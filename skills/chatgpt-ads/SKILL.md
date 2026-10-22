---
name: chatgpt-ads
description: "Plan ads inside ChatGPT (OpenAI Ads) and decide whether to run them at all. Use when someone mentions ChatGPT ads, OpenAI ads, advertising in ChatGPT, ads in AI answers, OpenAI Ads Manager, conversational ads, or asks whether their brand should buy ads in ChatGPT. Checks eligibility from live official pages, maps buyer questions to conversation intents, drafts a campaign worksheet and creative, and pre-registers a test with a maximum loss. Plans and drafts only; a human creates, funds and launches campaigns."
metadata:
  version: 0.2.0
  pack: marketing-intelligence
---

# ChatGPT ads

Ads in ChatGPT appear around an answer the user asked for. This skill decides whether a test is worth running, and if it is, produces a worksheet a person can enter into Ads Manager and a test plan whose stop rules were written before any money moved.

It never creates, funds or launches a campaign, and never enters payment details.

Two kinds of statement appear below. **Platform facts** (formats, placements, targeting, bidding, tracking, eligibility) come only from official pages fetched today. **Working hypotheses** (for example, "the ad that works offers the next step after the answer") are this skill's strategy; label them as hypotheses in the output and let the test confirm or kill them.

## 1. Ground first

The platform is new and changes often. Fetch the current official pages (OpenAI's help centre for ChatGPT ads, its ads policies, its latest ads announcement, and the Ads Manager documentation for campaigns, ad groups and conversion tracking). Build a grounding table with source URL and read date for every fact the plan depends on:

| Fact | Why the plan needs it |
|---|---|
| Countries where an advertiser account can be opened | Can this advertiser buy at all |
| Locations and ChatGPT plans where ads are shown | Can the buyers be reached |
| Ad formats and their creative fields, limits and asset specs | What can be drafted |
| Campaign objectives and ad-group settings, including any context or topic hints | How intents become a campaign |
| Bidding and budget options, minimums | What a test costs |
| Conversion tracking options and attribution windows | What can be measured |
| Prohibited and restricted categories, and the conditions for restricted ones | Is the offer allowed |

If a fact cannot be confirmed on an official page, write `[unverified]` beside it. If any fact in the first, second, third or last row is `[unverified]`, stop with a **blocked** result: the grounding table, what is missing, and who could confirm it (the advertiser's account rep, or the advertiser logging into Ads Manager). Never quote availability, prices, formats or audience numbers from memory.

## 2. Eligibility gate

Three yes/no checks, each backed by a row of the grounding table:

1. **Account:** the advertiser can open an account where they are based.
2. **Market:** ads are shown where the buyers are.
3. **Policy:** the offer is allowed. A restricted category passes only if the advertiser meets the published conditions; write which conditions and how they are met.

Any `no` ends the plan with a short note on where the budget does more. Any `unknown` produces a research handoff instead of a plan.

## 3. Fit

Fit is a judgement, so show the evidence rather than a score. Answer each question in one or two sentences with a source:

- **Question-shaped demand.** Do buyers research and compare before buying? Evidence: support tickets, sales calls, "vs" searches, community threads.
- **Reachable volume.** Is there enough of that demand in eligible markets to reach the minimum data in section 7 within the test window?
- **Economics.** From the advertiser's numbers: average order or contract value, gross margin, and the cost per acquisition they can afford (margin × expected first-year value, or the payback rule they already use). Without these numbers there is no plan; ask for them.
- **Organic position.** What ChatGPT says today when asked about the category (section 4). Being absent from answers is a reason to research, not by itself a reason to spend.

Verdict: **test**, **learn small** (fix organic visibility first, run a capped learning budget), or **no**. Give the two facts that decided it.

## 4. Map conversation intents, with sources

Plan around the questions buyers ask, grouped into intents. Keep a source for every question so nothing is invented.

1. Collect 20 to 40 real buyer questions. Each row records where it came from (ticket ID, call date, thread URL, review link). If the advertiser has not supplied any and you cannot fetch public ones, stop this section and hand over a collection protocol: which sources to export, how many questions, and the fields to keep.
2. Group them into 4 to 8 **conversation intents** ("choose a tool for X", "fix problem Y", "compare A and B", "is Z worth paying for").
3. Observe ChatGPT's answer for each intent and record it as an **observation**: date, model shown in the interface, plan, country, whether memory or custom instructions were on, the exact question, and which brands the answer named. Ask each question three times in fresh chats; one answer is anecdote. If you cannot use ChatGPT directly, mark the column `not observed` and say what was used instead (another model, an API), because those are proxies, not ChatGPT.
4. For each intent, write the next step the answer leaves open. That is the ad's job (working hypothesis).

If a companion visibility skill is installed (for example `ai-seo`), use its results here.

## 5. Campaign worksheet

Translate the intents into the structure Ads Manager actually uses, as documented on the read date. One row per ad group:

| Business goal | Campaign (objective) | Ad group | Intent | Context hints or targeting settings, as documented | Creative fields per the current spec | Landing URL | Conversion event |
|---|---|---|---|---|---|---|---|

Rules:

- Use only settings that appear in the grounding table. Where the platform treats context as a hint rather than an exact match, say so in the row.
- Fill every required creative field and check each against the documented limits (characters, image size, file type). Mark any field you could not check.
- Keep the structure as small as the budget allows (section 7 sets the number of ad groups and variants).
- This is a worksheet for a person. Do not create campaign objects through any interface or API.

## 6. Creative and landing continuity

For each ad group, draft up to three variants (fewer if section 7 says the budget cannot support them). Each one:

- Names the specific next step the answer left open ("Try it on your own file", "See the price for a team of five"), not a slogan.
- Uses the buyer's own noun for the problem, taken from the sourced questions.
- Makes one claim, and only a claim the landing page proves in its first screen.
- Does not imitate the answer's voice or formatting, and reads well under a neutral, thorough answer.

No superlative without a source, no invented urgency.

For each variant's landing page: it opens on the follow-up the ad promised (not the homepage), answers the next likely question in the first screen, and offers one action. For an unlaunched product that action is a waitlist, not a checkout. Check the page on a phone; if the grounding table has device data, cite it.

## 7. Measurement and the test plan

Write this before any budget is approved, so the result cannot be argued afterwards.

**Three kinds of numbers, kept apart:**

1. **Platform-reported conversions**, under the attribution window the platform documents.
2. **Your analytics**, from UTM parameters per ad group and variant. UTMs show which of your ad groups sent the visit; they do not show which conversation triggered the ad.
3. **Incremental lift**, the only causal claim. It needs a comparable control: a geo split, an on/off schedule across matched periods, or a platform lift test if one is documented. A quiet week before launch is not a control. Without a valid control, report attributed results and say lift is unmeasured.

**Tracking checks**, each verified with a test conversion and marked pass or fail: the conversion is the business event (sign-up, paid order), not a page view; platform and analytics counts reconcile within a stated tolerance; duplicates between pixel and server events are removed.

**Test plan, derived from the economics in section 3:**

- **Target CPA:** the affordable acquisition cost.
- **Maximum loss:** the amount the advertiser accepts losing to learn. This caps total spend.
- **Minimum data:** conversions per variant before comparing variants. If maximum loss ÷ target CPA cannot buy at least that many conversions across all variants, cut variants and ad groups until it can, down to one ad group with two variants. If even that fails, the verdict is **no test** or **learn small** with a decision on intent-level signals only.
- **Window:** learning period plus the advertiser's conversion lag before any call.
- **Rules:** scale if CPA ≤ target with minimum data; kill if spend reaches 2 × target CPA per variant with zero conversions, or the maximum loss is reached; otherwise **inconclusive**, which is a valid result and not a reason to extend the budget.
- **Approver:** the named person who funds and launches.

Example with labelled assumptions (not benchmarks): first order €600 at 70% margin is €420 of margin; the advertiser's rule is to spend at most a third of first-order margin, so target CPA is €140; a maximum loss of €2,100 buys about 15 conversions at target; at a minimum of 5 conversions per variant that supports three variants in one ad group, not twelve.

## Output

One document:

1. Grounding table with source URLs and read dates, and any `[unverified]` facts.
2. Eligibility result, or the blocked or research handoff.
3. Fit answers with evidence, and the verdict.
4. Sourced question list, intents and ChatGPT observations.
5. Campaign worksheet.
6. Creative and landing brief per ad group.
7. Measurement checklist with pass or fail, and the pre-registered test plan.
8. Open questions only a human can answer.

## Guardrails

- Never create, schedule, fund or launch a campaign, and never enter payment details.
- Never present an unverified platform fact as current, and never invent buyer questions or observations.
- Respect the excluded categories and audiences published on the read date.
- No claim in an ad that the landing page does not prove.
