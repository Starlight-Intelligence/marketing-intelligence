---
name: chatgpt-ads
description: "Plan ads inside ChatGPT (OpenAI Ads) and decide whether to run them at all. Use when someone mentions ChatGPT ads, OpenAI ads, advertising in ChatGPT, ads in AI answers, OpenAI Ads Manager, conversational ads, or asks whether their brand should buy ads in ChatGPT. Checks eligibility from live official pages, maps buyer questions to conversation intents, drafts a campaign worksheet and creative, and pre-registers a test with a maximum loss. Plans and drafts only; a human creates, funds and launches campaigns."
metadata:
  version: 0.2.0
  pack: marketing-intelligence
---

# ChatGPT ads

This skill decides whether a test is worth running, and if it is, produces a campaign worksheet (validated, so a person can enter it into Ads Manager, or clearly marked as a draft with its gaps) and a test plan whose stop rules were written before any money moved.

It never creates, funds or launches a campaign, and never enters payment details. Where and how ads are shown is a platform fact: take it from the grounding table in section 1, not from this page.

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

If a fact cannot be confirmed on an official page, write `[unverified]` beside it. Then:

- Account countries, ad locations or policy `[unverified]`: stop with a **blocked** result: the grounding table, what is missing, and who could confirm it (the advertiser's account rep, or the advertiser logging into Ads Manager).
- Any other row `[unverified]`: you may continue, but section 5 produces a **draft worksheet**, labelled as not ready to enter, with each unverified input listed. Only a worksheet whose every required input is verified is a **validated worksheet**.

Never quote availability, prices, formats or audience numbers from memory.

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
- **Economics.** From the advertiser's numbers: average order or contract value, gross margin, and the cost per acquisition they can afford (margin × expected first-year value, or the payback rule they already use). This is a cost per customer; section 7 converts it for any earlier conversion event. Without these numbers there is no plan; ask for them.
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

| Business goal | Campaign (objective) | Budget type and amount | Billing or bidding choice | Schedule | Ad group | Intent | Context hints or targeting settings, as documented | Creative fields per the current spec | Landing URL | Conversion event |
|---|---|---|---|---|---|---|---|---|---|---|

Rules:

- Use only settings that appear in the grounding table. Where the platform treats context as a hint rather than an exact match, say so in the row.
- Fill every input the documentation marks as required, and check each creative field against the documented limits (characters, image size, file type).
- The worksheet is **validated** only if every required input is filled and verified. Otherwise title it **draft worksheet, not ready to enter** and list the missing or unverified inputs at the top.
- Keep the structure as small as the budget allows (section 7 sets the number of ad groups and variants).
- This is a worksheet for a person. Do not create campaign objects through any interface or API.

## 6. Creative and landing continuity

For each ad group, draft up to three variants (fewer if section 7 says the budget cannot support them). Each one:

- Names the specific next step the answer left open ("Try it on your own file", "See the price for a team of five"), not a slogan.
- Uses the buyer's own noun for the problem, taken from the sourced questions.
- Makes one claim, and only a claim the landing page proves in its first screen.
- Does not imitate the answer's voice or formatting, and reads well next to a neutral, thorough answer, in whatever placement the grounding table documents.

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

- **Conversion event and target CPA.** Name the one event the platform will count (paid order, trial, sign-up, waitlist join). The affordable acquisition cost from section 3 is a cost per *customer*. Use it as the target only when the counted event is a customer. For any earlier event, the target is a conversion-specific one: affordable customer CPA × the sign-up-to-customer rate, where that rate comes from the advertiser's own data (source and period cited). If the rate is unknown or unsourced, do not borrow the customer CPA for the sign-up and do not guess a rate: the economic verdict (stop, inconclusive, scale-eligible) stays **unresolved**. Say so, and either ask for the rate, change the counted event to a customer event, or run the test as learn-the-rate only, reporting sign-up cost as a directional figure with no scale decision.
- **Maximum loss:** the amount the advertiser accepts losing to learn. This caps total spend for the test.
- **Learning question and minimum data.** Pick one question first.
  - "Does this channel reach target CPA?" is answered with a **CPA range**, not a point. With *n* conversions, treat the true count as roughly *n* ± 2√*n* (a Poisson approximation, fair from about 10 conversions), so CPA lies between spend ÷ (*n* + 2√*n*) and spend ÷ (*n* − 2√*n*). Before launch, compute the range you would get if the test hit target CPA exactly within the maximum loss. If its upper end is far above target, or the maximum loss buys fewer than 10 conversions at target, a result *at* target can only be **directional**: say so up front, and decide whether a directional answer is worth the money. The pre-launch sizing describes a test that lands on target; it does not override the verdict. A result well below target can still reach 10 or more conversions with its whole range under target, and the verdict rules below decide it (for example, a maximum loss of 9 × target buys 9 conversions at target, but 25 conversions on that spend gives a range of 9 ÷ 35 ≈ 0.26 × target to 9 ÷ 15 = 0.6 × target, which is scale-eligible).
  - "Which variant is better?" needs far more data: size it with a standard two-proportion power calculation and state the inputs. A small floor (for example 5 per variant) gives direction only.
  - If the budget cannot support the chosen question, cut variants and ad groups, or switch to the channel-level question. If even that is only directional and a directional answer is not worth the maximum loss, the verdict is **no test** or **learn small**.
- **Window:** learning period plus the advertiser's conversion lag. No verdict before the window closes.

**Two kinds of rule, applied in this order:**

1. **Spend stops** (during the test, protect money, not a verdict): pause a variant when its spend reaches 2 × target CPA with zero conversions; pause everything when total spend reaches the maximum loss. Pausing ends spending; the verdict still waits for lagged conversions to arrive.
2. **Verdict** (after the window closes, on matured conversions of the event the target was set for; with no conversion-specific target the verdict is **unresolved**), checked in this order:
   - **Zero conversions:** **stop**.
   - **Fewer than 10 conversions:** the range formula does not hold (at 4 or fewer, *n* − 2√*n* is zero or negative), so compute no range. If spend ÷ conversions is above 2 × target, **stop**; otherwise **inconclusive**, reported as a directional point CPA. Never scale on fewer than 10.
   - **10 or more:** **scale-eligible** if the whole CPA range is at or below target; **stop** if the whole range is above target; otherwise **inconclusive**, reported with the point CPA as a directional estimate.

   Inconclusive is a valid result and not a reason to extend the budget.

Any budget beyond the maximum loss, including scaling a scale-eligible result, is a new decision for the approver.

- **Approver:** the named person who funds and launches.

Example with labelled assumptions (not benchmarks), in multiples of target so no price enters: a maximum loss of 15 × target buys about 15 conversions at target. With 15 conversions, 2√15 ≈ 7.7, so the CPA range is 15 ÷ 22.75 ≈ 0.66 × target to 15 ÷ 7.25 ≈ 2.07 × target. Even a test that lands exactly on target is therefore **inconclusive**, a directional estimate, and it cannot rank twelve variants. The plan says so before launch; the advertiser either accepts a directional read, raises the maximum loss, or does not test. More budget is always the approver's decision.

Same example where the counted event is a waitlist sign-up: the advertiser can afford a customer CPA of C, and its own records (cited) show 1 in 5 sign-ups becomes a customer, so the sign-up target is 0.2 × C and the 15-conversion maximum loss is 15 × (0.2 × C) = 3 × C. If no sign-up-to-customer rate exists, the sign-up target is unknown and the verdict is unresolved; judging sign-ups against C would call every sign-up affordable at five times what it can bear.

## Output

One document:

1. Grounding table with source URLs and read dates, and any `[unverified]` facts.
2. Eligibility result, or the blocked or research handoff.
3. Fit answers with evidence, and the verdict.
4. Sourced question list, intents and ChatGPT observations.
5. Campaign worksheet, marked validated or draft.
6. Creative and landing brief per ad group.
7. Measurement checklist with pass or fail, and the pre-registered test plan.
8. Open questions only a human can answer.

## Guardrails

- Never create, schedule, fund or launch a campaign, and never enter payment details.
- Never present an unverified platform fact as current, and never invent buyer questions or observations.
- Respect the excluded categories and audiences published on the read date.
- No claim in an ad that the landing page does not prove.
