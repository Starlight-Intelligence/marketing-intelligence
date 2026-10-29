---
name: meta-advantage-plus
description: "Plan Meta's automated campaigns (Advantage+ sales, app and lead campaigns, Advantage+ audience and placements, creative enhancements) with creative variety as the main lever. Use when someone mentions Advantage+, Meta automation, Facebook or Instagram ads on autopilot, broad targeting, creative testing on Meta, ad fatigue, or asks why Meta ads stopped working. Grounds settings in current official pages, builds a creative matrix sized to budget, explains attributed versus incremental results, and sets a weekly review routine. Plans and drafts only; a person creates, funds and launches campaigns."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Meta Advantage+

In Meta's automated campaigns the advertiser gives up most targeting and bidding control. What is left to influence is the conversion event, the budget, the offer, the landing page and, above all, the creative. This skill treats creative as the main lever: a small, deliberate set of ads that differ in ways worth learning from, a test sized to the budget, and honest reporting about what Meta's numbers can and cannot tell you.

It never creates, edits, funds or launches a campaign, and never handles payment details.

## 1. Ground first

Campaign names, settings and defaults change often. Fetch the current official pages (Meta Business Help Centre for the campaign types in question, Advertising Standards, and the latest product announcements). Record each fact the plan depends on in `.marketing/facts/meta-ads.md` with the `platform-facts` skill: value as published, URL, read date, expiry.

| Fact | Why the plan needs it |
|---|---|
| Current automated campaign types and their names | Plan the right objects |
| What the advertiser can still control: audience suggestions, exclusions, locations, age limits, placements, budget type | What can be steered |
| Creative formats, specs and limits per placement | What can be drafted |
| Automated creative features and which are on by default | What may alter the ad after it leaves the advertiser |
| Conversion event options, attribution settings and windows | What can be measured |
| Special ad categories and prohibited or restricted content | Is the offer allowed |
| Minimum budgets and learning requirements, if published | What a test costs |

Unconfirmed items are marked `[unverified]` and not relied on. If policy or category status is `[unverified]`, stop with a **blocked** result and name who can confirm it.

## 2. Economics and the unit of learning

Ask for average order value, gross margin, and the acquisition cost the advertiser can afford (**target CPA**). Ask for the **maximum loss** the advertiser accepts for the test, and the number of conversions per week the account has had on the chosen event.

Automated delivery learns from conversions. If the budget buys only a handful per week at target CPA, say so: the campaign may not learn, and the test is directional. Consider a higher-funnel event only if it is a real step toward revenue, and label the result as a proxy.

## 3. Creative is the plan

Write the creative brief before any worksheet.

1. **Source the angles.** Collect buyer language from tickets, calls, reviews and community threads, each with its source. Group it into 3 to 5 angles (a problem, a desired outcome, an objection, a comparison, a proof point the advertiser actually has).
2. **Choose the factors.** A small factorial: two or three factors, each with two levels. For example, angle (problem or outcome) times format (static image or short video) times hook (question or statement). Three factors with two levels each is eight cells.
3. **Size it to the budget.** Each cell needs enough spend to produce a readable result. Use the `marketing-experiments` skill to size it. If the maximum loss cannot support eight cells, cut to a two-factor, four-cell test. Do not spread a small budget over many ads and call the pattern a finding.
4. **Hold the rest constant:** same offer, same landing page, same conversion event, same audience settings, same start date.
5. **Draft each cell.** The opening line or first seconds name the buyer's problem in the buyer's words. One claim per ad, and the landing page proves it in the first screen. Run `claims-check` on every line. No invented urgency, scarcity, testimonials or numbers. Proof elements (reviews, customer counts) only if they exist and are sourced in the brand's TRUTH file.
6. **Check the automated features.** For each creative enhancement the platform may apply (text variations, cropping, music, overlays), decide on or off per the grounding table. Copy that is altered after approval can break a claim or the brand's voice; default to off for anything that changes words or faces unless the advertiser opts in after seeing examples.

## 4. Campaign worksheet

One row per campaign, only documented settings:

| Business goal | Campaign type | Budget type and amount | Schedule | Conversion event and attribution setting | Audience inputs, as documented | Locations, languages, age limits | Placements | Ads (cell IDs) | Landing URL | Creative enhancements on or off |
|---|---|---|---|---|---|---|---|---|---|---|

Title it **validated worksheet** only when every required input is filled and verified; otherwise **draft worksheet, not ready to enter** with gaps listed. Where a setting is a suggestion to the system rather than a hard limit, say so in the row.

## 5. Measurement limits

Keep three numbers apart:

1. **Meta-reported conversions**, under the attribution setting and window documented on the read date. They count conversions Meta attributes to its ads, including people who would have bought anyway.
2. **Your analytics**, from UTM parameters per ad. They show which ad sent the visit, and they miss view-through effects.
3. **Incremental lift**, the only causal claim. It needs a comparable control: a geo split, matched on/off periods, or a platform lift study if the grounding table documents one. Without it, report attributed results and say lift is unmeasured.

Check tracking with a test conversion by a person before launch, mark pass or fail, and reconcile Meta and analytics counts within a stated tolerance.

## 6. Pre-registered test

Register it with `marketing-experiments` before launch: the question, the deciding metric, the cells, maximum loss, window (learning period plus conversion lag), and rules written now.

- **Spend stops:** pause a cell at 2 times target CPA in spend with zero conversions; pause everything at the maximum loss.
- **Verdict after the window, on matured conversions:** zero conversions means stop; fewer than 10 per campaign means inconclusive and directional; with 10 or more, compute a CPA range (script or fallback below) and call scale-eligible only when the whole range is at or below target.
- Comparing cells needs a power calculation; a small floor gives direction only. Say which kind of answer this test can give before it runs.
- Inconclusive stays inconclusive. More budget is a new decision for the approver.

**Dependency and fallback.** The CPA range comes from the script in the `marketing-experiments` skill, which may not be installed. Fallback, in order:

1. Run the bundled script: `node skills/meta-advantage-plus/scripts/cpa-range.mjs --spend <S> --conversions <n> --target <T>` (test: `node --test skills/meta-advantage-plus/scripts/cpa-range.test.mjs`). Method: treat the matured conversion count *n* as *n* plus or minus 2 times the square root of *n*, so CPA lies between *S* / (*n* + 2 sqrt *n*) and *S* / (*n* - 2 sqrt *n*). Valid from *n* of 10 only.
2. If node is not available, apply the same formula by hand and show the arithmetic.
3. If neither can be done, or an input (spend, matured conversions, target CPA) is missing, the verdict stays **unresolved**: report the directional CPA, do not scale, and name the missing input.

Record the test in `.marketing/experiments.md` before launch (hypothesis, deciding metric, maximum loss, window, the rules above). Comparing variants needs a two-proportion power calculation; without one, report direction only.

## 7. Weekly review routine

After a person launches:

1. Pull spend, conversions and CPA by ad. Do not judge an ad before its pre-registered spend floor.
2. Note fatigue signals the platform reports (frequency, falling click-through) next to the conversion trend, without treating one metric as a verdict.
3. Check which automated features altered the creative; log any change that touches a claim.
4. Propose next creative: winners' angles in new formats, never a copy of the winning ad with a number changed. Proposals go to the approver.

Log to `.marketing/work/<week>/meta-review.md`.

## Output

1. Grounding table with URLs, read dates and `[unverified]` marks.
2. Economics, verdict (test, learn small, no) and the two deciding facts.
3. Sourced angles and the creative matrix sized to budget.
4. Drafted ads with claims-check result.
5. Worksheet, validated or draft.
6. Measurement checklist, pass or fail.
7. Pre-registered test and review routine.
8. Open questions only a person can answer.

## Rules

- Never create, change, fund or launch a campaign; never enter payment details.
- Never state a platform fact from memory as current.
- No fabricated testimonials, reviews, counts or deadlines.
- Do not report attributed conversions as lift.
- Special ad categories and restricted content follow the policies on the read date; if in doubt the item is blocked.
