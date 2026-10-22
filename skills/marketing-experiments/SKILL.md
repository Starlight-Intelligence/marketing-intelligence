---
name: marketing-experiments
description: "Design, size and read marketing experiments that hold up: A/B tests, ad creative tests, landing page tests, email subject tests. Fixed sample sizes and stop rules written before launch, Bayesian readouts, CPA ranges for small ad budgets, factorial creative tests sized to real traffic, and a predicted-versus-actual ledger that shows whose predictions to trust. Use for A/B testing, split tests, ad tests, how many visitors do I need, is this result significant, should we scale or kill."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Marketing experiments

Most small-business tests are decided by looking at a dashboard until it looks good. Stopping the first time a result looks significant raises the false-positive rate several times over, and underpowered wins overstate the effect. This skill fixes the decision rules before the data arrives and does the arithmetic with a script, not by eye.

Scripts (Node 22+, no dependencies) are in this skill's `scripts/` folder.

## 1. Before the test: register it

Write the test to `.marketing/memory/experiments.jsonl` (format in the `marketing-memory` skill) **before** launch:

- Hypothesis and the one metric that decides.
- Sample size or budget, from the arithmetic below.
- Stop rules: scale, stop and inconclusive, with numbers. An inconclusive test stops; it does not get a bigger budget by default.
- The control, chosen before launch.
- A decision date.

Once written, rules are never edited. A changed rule is a new test.

## 2. Size it

**Conversion-rate tests** (pages, emails, sign-up flows):

```
node scripts/ab.mjs plan --baseline 0.04 --mde 0.2
```

`--mde` is the smallest relative lift worth acting on (0.2 = +20%). If `per_arm` is more traffic than you get in the decision window, either test a bigger change or do not test; say so plainly.

**Paid tests** (ads, where budget is the limit):

```
node scripts/ab.mjs budget --max-loss 2000 --target-cpa 118 --min-per-variant 10
```

It tells you how many variants the budget can actually read. A 2x2 factorial (hook x offer, or image x headline) needs four readable cells; with less, test one change against the current version.

## 3. Read it

- Rates: `node scripts/ab.mjs bayes --a 40/1000 --b 55/1000` gives the probability that B beats A, the expected loss of each choice, and a 95% interval for the lift. Report all three with the counts.
- Ads: `node scripts/ab.mjs cpa --spend 1140 --conversions 9`. Under 10 conversions there is no range and the test cannot scale.
- Apply the registered rules as written. Write the result, the decision and one-line lesson into the experiment's record.

## 4. Score the forecasters

Every time a seat or a model predicts an outcome (this hook will win, this page will convert above 5%, this ad will beat target), log it:

```
node scripts/predictions.mjs add --id hook-2026-11-a --what "Hook A beats hook B on saves" --kind binary --predicted true --by critic/codex
node scripts/predictions.mjs resolve --id hook-2026-11-a --actual false --source "X analytics export 2026-11-20"
node scripts/predictions.mjs report
```

The report shows hit rate, error or Brier score per source. After ten or more resolved predictions it tells you which seat, model or judge to listen to, which nobody else in marketing tooling measures.

## Rules

- No peeking decisions: interim looks are for spotting broken tracking, not for calling winners.
- Counts next to every rate. Small numbers get small conclusions.
- Platform-attributed conversions are not incremental lift; for "did it work at all", use the `incrementality` skill.
- Nothing here launches, funds or edits a campaign. A person approves the maximum loss.
