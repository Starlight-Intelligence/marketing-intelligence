# /// script
# requires-python = ">=3.10"
# dependencies = ["numpy>=1.26"]
# ///
"""Did a change on a known date move the outcome? Interrupted time series with control series.

Fits the outcome on the control series over the pre-period (least squares with an intercept),
predicts what the post-period would have been without the change, and reports the difference with a
residual-bootstrap 95% interval. It refuses to give a verdict when the pre-period is too short or
the controls do not track the outcome before the change.

    uv run causal_readout.py --csv data.csv --date-col week --outcome signups \
        --controls organic_visits,brand_searches --change 2026-09-14 [--min-pre 8] [--min-r2 0.5]

The CSV needs one row per period, sorted or sortable by the date column (ISO dates). Controls must
not be affected by the change itself. JSON on stdout; exit 2 on bad input.

This is the light method for small businesses. With long histories, prefer a Bayesian structural
model (CausalPy, CausalImpact); see the incrementality skill.
"""

import argparse
import csv
import json
import sys

import numpy as np


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--csv", required=True)
    p.add_argument("--date-col", required=True)
    p.add_argument("--outcome", required=True)
    p.add_argument("--controls", required=True, help="comma-separated column names")
    p.add_argument("--change", required=True, help="first period after the change, ISO date")
    p.add_argument("--min-pre", type=int, default=8)
    p.add_argument("--min-r2", type=float, default=0.5)
    p.add_argument("--draws", type=int, default=2000)
    p.add_argument("--seed", type=int, default=1)
    a = p.parse_args()

    try:
        result = readout(load(a.csv, a.date_col, a.outcome, a.controls.split(",")), a)
    except ValueError as e:
        print(f"causal_readout: {e}", file=sys.stderr)
        sys.exit(2)
    print(json.dumps(result, indent=2))


def load(path, date_col, outcome, controls):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        raise ValueError("the CSV has no rows")
    missing = [c for c in [date_col, outcome, *controls] if c not in rows[0]]
    if missing:
        raise ValueError(f"missing columns: {', '.join(missing)}")
    rows.sort(key=lambda r: r[date_col])
    try:
        y = np.array([float(r[outcome]) for r in rows])
        x = np.array([[float(r[c]) for c in controls] for r in rows])
    except ValueError as e:
        raise ValueError(f"non-numeric value: {e}") from e
    return [r[date_col] for r in rows], y, x


def readout(data, a):
    dates, y, x = data
    pre = np.array([d < a.change for d in dates])
    n_pre, n_post = int(pre.sum()), int((~pre).sum())
    base = {"pre_periods": n_pre, "post_periods": n_post, "change": a.change, "method": "OLS on controls, residual bootstrap"}
    if n_post == 0:
        raise ValueError("no periods on or after the change date")
    if n_pre < max(a.min_pre, 3 * x.shape[1] + 2):
        return {**base, "verdict": "inconclusive", "reason": f"pre-period has {n_pre} periods; need at least {max(a.min_pre, 3 * x.shape[1] + 2)}"}

    X = np.column_stack([np.ones(len(y)), x])
    beta, *_ = np.linalg.lstsq(X[pre], y[pre], rcond=None)
    fit = X[pre] @ beta
    resid = y[pre] - fit
    ss_tot = float(((y[pre] - y[pre].mean()) ** 2).sum())
    r2 = 1 - float((resid ** 2).sum()) / ss_tot if ss_tot else 0.0
    base["pre_fit_r2"] = round(r2, 3)
    if r2 < a.min_r2:
        return {**base, "verdict": "inconclusive", "reason": f"controls track the outcome poorly before the change (R2 {r2:.2f} < {a.min_r2})"}

    counterfactual = X[~pre] @ beta
    observed = y[~pre]
    effect = float((observed - counterfactual).sum())

    rng = np.random.default_rng(a.seed)
    sims = np.empty(a.draws)
    for i in range(a.draws):
        y_b = fit + rng.choice(resid, size=n_pre, replace=True)
        b_b, *_ = np.linalg.lstsq(X[pre], y_b, rcond=None)
        noise = rng.choice(resid, size=n_post, replace=True)
        sims[i] = float((observed - (X[~pre] @ b_b + noise)).sum())
    lo, hi = np.percentile(sims, [2.5, 97.5])
    baseline = float(counterfactual.sum())

    if lo > 0:
        verdict = "lift"
    elif hi < 0:
        verdict = "drop"
    else:
        verdict = "inconclusive"
    return {
        **base,
        "verdict": verdict,
        "observed_total": round(float(observed.sum()), 3),
        "counterfactual_total": round(baseline, 3),
        "effect_total": round(effect, 3),
        "effect_ci95": [round(float(lo), 3), round(float(hi), 3)],
        "relative_effect": round(effect / baseline, 4) if baseline else None,
        "caveats": [
            "Valid only if the controls were not affected by the change and nothing else changed on that date.",
            "Interval reflects model noise, not seasonality the controls miss.",
        ],
    }


if __name__ == "__main__":
    main()
