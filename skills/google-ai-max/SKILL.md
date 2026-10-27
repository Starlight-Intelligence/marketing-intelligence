---
name: google-ai-max
description: "Decide whether and how to use Google's AI-driven search ads and Performance Max style campaigns, including ads that appear around AI answers in Google Search. Use when someone mentions AI Max, AI Overviews ads, AI Mode ads, Performance Max, PMax, broad match with automation, asset groups, search themes, final URL expansion, or asks whether to switch on Google's automated campaigns. Works out the economics first, grounds every setting in the current official pages, drafts a campaign worksheet with only documented settings, sets a search-term and asset review routine, and pre-registers a test. Plans and drafts only; a person creates, funds and launches campaigns."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Google AI Max

Google keeps moving advertisers toward automated campaigns: the system picks queries, builds ads from your assets and may send traffic to pages you did not choose. Whether that helps depends on the advertiser's economics and on how clean their conversion data is. This skill decides whether a test is worth running and, if it is, produces a worksheet and a test plan whose stop rules were written before any money moved.

It never creates, edits, funds or launches a campaign, and never handles payment details.

## 1. Ground first

Product names, eligibility, formats, controls and policies in this area change often. Fetch the current official pages (Google Ads help centre for the campaign types in question, the Ads policies, and the latest product announcements). Record each fact the plan depends on in `.marketing/facts/google-ads.md` using the `platform-facts` skill: value as published, source URL, read date, expiry.

| Fact | Why the plan needs it |
|---|---|
| Which campaign types and AI features exist today, under what names | Avoid planning around a feature that was renamed or retired |
| Where AI answer placements show ads (countries, languages, surfaces) | Can the buyers be reached |
| Account and category eligibility, and prohibited or restricted categories | Is the offer allowed |
| Controls the advertiser has: negative keywords, brand exclusions, URL exclusions, asset-level reporting, location and language settings | What can be steered |
| Bidding strategies and their data requirements | What a test costs |
| Conversion tracking options, attribution models and windows | What can be measured |
| Asset specs and limits | What can be drafted |

Anything not confirmed on an official page is marked `[unverified]` and not relied on. If account eligibility, placement availability or policy is `[unverified]`, stop with a **blocked** result: the grounding table, what is missing, and who can confirm it (the advertiser's account rep or the advertiser inside the account). Never quote features, availability or limits from memory.

## 2. Economics first

Ask for these numbers; without them there is no plan:

- Average order or contract value, gross margin, and the acquisition cost the advertiser can afford (margin times expected first-year value, or the payback rule they already use). That is the **target CPA**.
- Current conversion rate on the landing pages that would receive traffic.
- Monthly search demand reachable in eligible markets, from the advertiser's own search console and ads data, not from guesses.
- Spend limit for learning: the **maximum loss**.

Automated campaigns need conversion volume to learn. Add a grounding row for any minimum or recommended conversion volume Google publishes for the chosen bidding strategy, and compare the number of conversions the maximum loss buys at target CPA with it. If Google publishes no figure, mark it `[unverified]`, do not invent a threshold, and size the test with the CPA-range arithmetic in the `marketing-experiments` skill: fewer than 10 conversions can only be directional.

Verdict: **test**, **learn small** (a capped, narrow test), or **no**. Give the two facts that decided it.

## 3. Conversion data comes before the campaign

Automation optimises toward whatever you tell it counts. Before any draft:

- The conversion is the business event (paid order, qualified lead), not a page view or a click on a phone number.
- Counts in Google and in the advertiser's analytics reconcile within a stated tolerance, checked with a test conversion by a person.
- Duplicate events (tag plus import) are removed.
- If conversions are low-value or noisy, fix tracking first; no campaign draft until it passes.

## 4. Campaign worksheet

One row per campaign or asset group, using only settings listed in the grounding table:

| Business goal | Campaign type | Budget and schedule | Bidding choice | Locations and languages | Brand and URL exclusions | Search themes or signals, as documented | Asset group contents | Final URL and any expansion setting | Conversion event |
|---|---|---|---|---|---|---|---|---|---|

Rules:

- Title it **validated worksheet** only if every required input is filled and verified; otherwise **draft worksheet, not ready to enter**, with the gaps listed at the top.
- Keep the structure as small as the budget allows. One campaign, one asset group per distinct offer.
- Where the platform treats a signal as a hint, say so in the row.
- Decide the brand-term policy explicitly: exclude brand queries, or measure them separately, so brand traffic does not flatter the result.
- Decide the URL policy explicitly: allow the system to choose pages or restrict it, and state why.

## 5. Assets

Draft assets only from claims the advertiser can prove. Run `claims-check` on every headline and description. Use the buyer's own words, taken from sourced questions (tickets, calls, search terms), and mark each source. No invented urgency, scarcity or social proof. Each asset checked against the documented character and size limits.

## 6. Review routine after launch

A person launches. Then, on a fixed cadence written into the plan (weekly during the test):

1. **Search terms:** export the report. Group queries into relevant, irrelevant and brand. Propose negatives with the query as evidence. A person applies them.
2. **Placements and pages:** list landing URLs that received traffic, with conversions and spend. Flag pages the advertiser did not intend.
3. **Assets:** read the asset-level reporting as documented. Label ratings are the platform's, not a verdict; do not delete an asset on one weak label without checking its spend.
4. **Reconcile:** compare platform conversions with the advertiser's analytics. Log gaps over the stated tolerance.

Write the log to `.marketing/work/<week>/google-ads-review.md`. Proposals only.

## 7. Measurement and the test plan

Register the test with the `marketing-experiments` skill before launch: hypothesis, the one deciding metric, maximum loss, fixed window (learning period plus conversion lag), and the rules below, all written before any spend.

Keep three numbers apart:

1. **Platform-reported conversions**, under the documented attribution model.
2. **Your analytics**, from UTM parameters.
3. **Incremental lift**, the only causal claim. It needs a comparable control such as a geo split or matched on/off periods, or a platform experiment feature if the grounding table documents one. Without a valid control, report attributed results and say lift is unmeasured.

Rules:

- **Spend stops:** pause when total spend reaches the maximum loss; pause a campaign that reaches 2 times target CPA in spend with zero conversions.
- **Verdict after the window, on matured conversions:** zero conversions means stop. Fewer than 10 means inconclusive, reported as a directional CPA, and never scale. With 10 or more, compute a CPA range with the `marketing-experiments` script; scale-eligible only if the whole range is at or below target.
- Inconclusive is a valid result. It does not earn a bigger budget.
- Any spend beyond the maximum loss is a new decision for the approver.

## Output

1. Grounding table with URLs, read dates and `[unverified]` marks.
2. Economics and verdict.
3. Conversion-data check, pass or fail per item.
4. Worksheet, marked validated or draft.
5. Assets with sources and claims-check result.
6. Review routine and log template.
7. Pre-registered test plan.
8. Open questions only a person can answer.

## Rules

- Never create, change, fund or launch a campaign, and never enter payment details.
- Never present an unverified platform fact as current.
- Do not claim the automation will find the advertiser's best customers; it optimises toward the conversion event you define.
- No ad copy claim the landing page does not prove.
- Respect the restricted categories and policies published on the read date.
