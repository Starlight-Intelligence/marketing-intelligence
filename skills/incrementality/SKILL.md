---
name: incrementality
description: "Find out whether a marketing change actually caused a lift, not just whether a dashboard went up: interrupted time series with control series, when geo experiments make sense, and when marketing mix modeling is worth it. Includes a small Python readout that refuses to answer when the data cannot support one. Use for incrementality, did this campaign work, causal impact, lift test, geo test, marketing mix modeling, MMM, attribution doubts."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Incrementality

Attribution tells you who touched a conversion. Incrementality asks whether it would have happened anyway. This skill picks the method the data can support and says "inconclusive" when it cannot.

## Pick the method by the data you have

| You have | Use | Minimum |
|---|---|---|
| A change on a known date, and one or more series it did not affect (organic visits, a market you did not touch, branded search) | Interrupted time series with controls: `scripts/causal_readout.py` | 8+ periods before the change, controls that tracked the outcome before it |
| Many separate markets you can switch on and off | A geo experiment (Meta's GeoLift, Google's matched markets) | Practitioners use roughly a dozen or more markets per arm; check the tool's own power analysis |
| Two or more years of weekly spend and outcomes across 3+ channels with real variation | Marketing mix modeling (pymc-marketing, Google Meridian, Meta Robyn), calibrated with any lift tests you ran | As stated; below it, do not run MMM |
| None of the above | A clean A/B or holdout going forward (`marketing-experiments`) | Plan it before spending |

## Run the readout

Needs `uv` (it installs numpy for the run):

```
uv run scripts/causal_readout.py --csv weekly.csv --date-col week --outcome signups \
  --controls organic_visits,brand_searches --change 2026-09-14
```

`--draws` sets the bootstrap resamples (default 2,000). It must be a whole number from 1,000 to 100,000; anything else exits with code 2.

It fits the outcome on the controls before the change, predicts the after-period without the change, and returns the difference with a 95% interval. It returns `inconclusive`, with the reason, when:

- the pre-period is shorter than 8 periods (or too short for the number of controls), or
- the controls did not track the outcome beforehand (pre-fit R² under 0.5).

A `lift` or `drop` verdict needs the whole interval on one side of zero.

## Choosing controls

- A control must not be affected by the change. Paid search clicks are a bad control for a paid search test; organic visits from another country might be fine.
- Nothing else may change on the same date (a launch, a price change, press). If something did, say the readout cannot separate them.
- Seasonality the controls do not share is not in the interval. Say so when the window crosses a holiday.

## Report

Write `.marketing/work/<YYYY-WW>/incrementality-<change>.md`: question, method and why, data window, controls and why they qualify, the script's JSON, verdict in one sentence, caveats. Add the lesson to the experiment record if there was one.

## When to go further

With longer histories, a Bayesian structural model (CausalPy or CausalImpact) handles trend and seasonality better than this light readout. With two-plus years of multi-channel data, use pymc-marketing and calibrate it with your lift tests. Those need a heavier Python setup; this skill names them but does not install them.
