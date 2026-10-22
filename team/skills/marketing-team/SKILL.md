---
name: marketing-team
description: "Run an eleven-seat marketing team (CMO, market intel, product marketing, AI visibility, content, social, paid media, conversion, voice, critic, analyst) against a memory kept in your repo. Use when someone says marketing team, run marketing, weekly marketing plan, set up marketing, marketing OS, AI CMO, or wants marketing that learns from results. Modes: setup, week, launch, review, readout. Plans, drafts and measures; people publish, send, spend and set prices."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Marketing team

This skill runs the team described in `team/TEAM.md` of the marketing-intelligence repository (`${CLAUDE_PLUGIN_ROOT}/team/TEAM.md` when installed as the Claude Code plugin). With the plugin, each seat is a subagent named `marketing-team:<seat>`. In any other agent, run each seat's brief in order in one context: read the seat file in `team/agents/`, do its job, write its output, move on.

Pick the mode from the request. If unclear, ask which one, nothing else.

## setup

Creates the brain. Run once per project, or to repair a missing part.

1. Create `.marketing/` with the layout in `TEAM.md`. Never overwrite an existing file; report what already exists.
2. Interview the founder, one question at a time, for: the product, the buyer, the job they hire it for, what they use today, proof that exists, prices and economics if any, channels in use, brands, and the things the brand will never say. Stop after twelve questions; the rest can be `OPEN`.
3. Write `TRUTH.md`. Every line carries a tag:
   - `RULED`: the founder decided it. Only the founder changes it.
   - `MEASURED`: verified by a source or a command, with method and date.
   - `OPEN`: unknown. Never filled with a guess.
4. Write `brands/<brand>.md` (voice, visual rules, banned words and patterns, channels, monthly budget line) and `product-marketing.md`.
5. Seed `facts/` for each channel in use with the `platform-facts` skill.
6. Create empty `memory/experiments.jsonl`, `memory/taste.jsonl`, `memory/outliers/`, and `queue/`.
7. End with the list of `OPEN` items that block good work, most important first.

## week

The weekly cycle. Seats in order:

1. `performance-analyst`: readout of last week, decisions due under pre-registered rules.
2. `market-intel`: refresh expired facts, new buyer language, new outliers.
3. `cmo`: up to three bets, one brief each, with the reference each piece must beat.
4. Makers per brief: `product-marketer`, `ai-visibility`, `content-marketer`, `social-coordinator`, `performance-marketer`, `conversion-engineer`.
5. `voice-editor` on every draft, then `critic` (claims check plus a different-provider buyer critique).
6. `cmo`: `queue/SUMMARY.md` with recommendations and the decisions only a human makes.

Write everything under `.marketing/work/<YYYY-WW>/`. If a seat cannot do its job (missing data, missing tool), it writes what is missing and the cycle continues.

## launch

Run the launch playbook (`launch-playbook` in this repository's `skills/`) for one product. Map its stations to seats: decide (`cmo`), question (`product-marketer` with the founder), buyer (`market-intel`), position (`product-marketer`), door (`conversion-engineer`, `content-marketer`, `ai-visibility`), prove (`voice-editor`, `critic`), stage (`social-coordinator`, `performance-marketer`, `content-marketer`).

## review

Read `queue/`. For each item give the evidence, the critic's verdict and provider, and a recommendation. Record the human's decisions in `memory/taste.jsonl` through the `voice-editor` taste-ledger rule. Execute nothing external.

## readout

Run `performance-analyst` alone and update `memory/`.

## Gates (every mode)

- Stage, never send: no posting, sending, scheduling, publishing, spending, price changes or payment details.
- The buyer critique runs on a different model provider from the maker, or is recorded as missing.
- Every public claim traces to `TRUTH.md` or a cited source.
- Platform facts past expiry are re-fetched before use.
- Honest scarcity only. Tests follow rules written before they start.
