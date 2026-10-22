---
name: chatgpt-ads
description: "Plan, audit and measure advertising inside ChatGPT (OpenAI Ads). Use when someone mentions ChatGPT ads, OpenAI ads, advertising in ChatGPT, ads in AI answers, OpenAI Ads Manager, conversational ads, or asks whether their brand should buy ads in ChatGPT. Covers fit, conversation-intent research, creative that follows an answer, landing continuity, conversion tracking and a pre-registered test plan. Plans and drafts only; a human launches and funds campaigns."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# ChatGPT ads

Ads in ChatGPT sit next to an answer the user just asked for. A search ad competes with ten blue links; a ChatGPT ad competes with a complete answer the user already trusts. The ad that works offers the obvious next step after that answer.

This skill produces a plan a person can launch. It never creates, funds or launches a campaign.

## 1. Ground first

The platform is new and changes monthly. Before writing any plan, fetch the current official pages and record the date you read them:

- OpenAI's advertiser help centre and ads policies (search `help.openai.com ChatGPT ads`).
- The latest OpenAI announcement on ads availability (markets, plans that show ads, self-serve status).
- The Ads Manager documentation for bidding, conversion tracking and any API.

Write down, with source URL and read date: markets where self-serve is open, which ChatGPT plans show ads, bidding model, tracking options, excluded categories and audiences. If a fact cannot be confirmed from an official page, mark it `[unverified]` and do not build the plan on it. Never quote availability, prices or audience numbers from memory.

## 2. Fit check

ChatGPT ads fit when buyers ask questions before they buy. Score each from 0 to 2 and keep the evidence:

| Signal | 0 | 2 |
|---|---|---|
| Question-shaped demand | Impulse or habitual purchase | People research, compare, ask "which" and "how" |
| Consideration length | Minutes | Days or weeks |
| Answer gap | ChatGPT already recommends you unprompted | ChatGPT answers the category without naming you |
| Market availability | Self-serve not open where your buyers are | Open in your markets |
| Policy fit | Restricted or sensitive category | Clearly allowed |

7 or more: plan a test. 4 to 6: plan a small learning budget and fix organic visibility first. Under 4: say no and explain where the budget does more.

A score of 0 on policy fit ends the plan regardless of the total.

## 3. Map conversation intents, not keywords

Search ads buy keywords. ChatGPT ads are matched to what the conversation is about, so plan around the questions buyers ask.

1. Collect 20 to 40 real questions your buyers ask before buying: support tickets, sales calls, community threads, reviews, "vs" searches.
2. Group them into 4 to 8 **conversation intents** ("choose a tool for X", "fix problem Y", "compare A and B", "is it worth paying for Z").
3. For each intent, ask ChatGPT the question yourself in a clean session and record: does the answer mention you, which competitors it names, and what the user would naturally want next.
4. The next step after the answer is your ad's job. Write it down per intent.

If a companion visibility skill is available (for example `ai-search-visibility`), use its results here.

## 4. Creative that follows an answer

For each intent, draft three variants. Each one:

- Names the specific next step the answer left open ("Try it on your own file", "See the price for a team of five"), not a slogan.
- Uses the buyer's noun for the problem, taken from step 3.
- Makes one claim, and only a claim the landing page proves above the fold.
- Reads well directly under a neutral, thorough answer. If it would embarrass you there, rewrite it.

Avoid superlatives you cannot source, fake urgency, and anything that imitates the answer's voice or formatting.

## 5. Landing continuity

The visitor arrives mid-thought, carrying the answer they just read. The landing page should:

- Open on the exact follow-up the ad promised, not the generic homepage.
- Answer the next likely question in the first screen.
- Offer one action. For an unlaunched product that is a waitlist, not a checkout.
- Load fast on a phone; much ChatGPT use is mobile.

## 6. Measurement before money

Set this up and verify it with a test conversion before any budget is approved:

- Conversion tracking using the options the help centre lists (pixel, conversions API, or both), with the conversion defined as the business event, not a page view.
- UTM parameters per intent and variant, so you can read results outside the ads dashboard.
- A baseline: current weekly conversions from organic and other channels, so a lift is visible.
- Where volume allows, a holdout (a market or period without ads) to estimate incremental lift.

## 7. Pre-registered test plan

Write the decision rules before the test starts, so the result cannot be argued afterwards:

- Budget band and duration (a learning period, then a decision date).
- The one metric that decides (cost per qualified conversion, or incremental conversions).
- Scale rule, hold rule and kill rule, with numbers.
- Minimum data before any call (for example, a stated number of conversions per variant).
- Who approves spend. The agent drafts the plan; a person launches and funds it.

## Output

Deliver one document:

1. Grounding table: fact, source URL, read date.
2. Fit score with evidence, and the verdict.
3. Conversation intents with the observed answer and the next step.
4. Creative variants per intent.
5. Landing page brief per intent.
6. Measurement checklist with a pass or fail per item.
7. The pre-registered test plan.
8. Open questions only a human can answer.

## Guardrails

- Never create, schedule, fund or launch a campaign, and never enter payment details.
- Never present an unverified platform fact as current.
- Respect the platform's excluded categories and audiences as published on the read date.
- No claim in an ad that the landing page does not prove.
