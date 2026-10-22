---
name: marketing-team
description: "Run an eleven-seat marketing team (CMO, market intel, product marketing, AI visibility, content, social, paid media, conversion, voice, critic, analyst) against a memory kept in your repo. Use when someone says marketing team, run marketing, weekly marketing plan, set up marketing, marketing OS, AI CMO, or wants marketing that learns from results. Modes: setup, week, launch, review, readout. Plans, drafts and measures; people publish, send, spend and set prices."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Marketing team

This skill runs the team described in `team/TEAM.md` of the marketing-intelligence repository (`${CLAUDE_PLUGIN_ROOT}/team/TEAM.md` when installed as the Claude Code plugin). With the plugin, each seat is a subagent named `marketing-team:<seat>`. In any other agent, copy the whole `team/` folder into the project, read `${CLAUDE_PLUGIN_ROOT}` as the folder that contains `team/`, and run each seat's brief in order in one context: read the seat file in `team/agents/`, do its job, write its output, move on.

Pick the mode from the request. If unclear, ask which one, nothing else.

## setup

Creates the brain. Run once per project, or to repair a missing part.

1. Create `.marketing/` with the layout in `TEAM.md`. Never overwrite an existing file; report what already exists. Add `.marketing/private/` to `.gitignore`.
2. Import before asking: read `.agents/product-marketing.md` and any existing brand or positioning notes the user points to. Ask only about what they leave open.
3. Interview the founder, one question at a time, for: the product, the buyer, the job they hire it for, what they use today, proof that exists, prices and economics if any, channels in use, brands, and the things the brand will never say. Stop after twelve questions; the rest can be `OPEN`.
4. Write `TRUTH.md`. Every line carries a tag:
   - `RULED`: the founder decided it. Only the founder changes it.
   - `MEASURED`: verified by a source or a command, with method and date.
   - `OPEN`: unknown. Never filled with a guess.
5. Write `brands/<brand>.md` (voice, visual rules, banned words and patterns, channels, monthly budget line). Create `.agents/product-marketing.md` only if it does not exist; otherwise add missing sections to it without changing existing ones.
6. Seed `facts/` for each channel in use with the `platform-facts` skill.
7. Create empty `memory/experiments.jsonl`, `memory/taste.jsonl`, `memory/outliers/`, and `queue/`.
8. End with the list of `OPEN` items that block good work, most important first.

## week

The weekly cycle. Ask whether to run a **light week** (one bet, only the facts it depends on, only the seats it needs) or the full cycle; default to light until a readout shows the full cycle paying off. Seats in order:

1. `performance-analyst`: readout of last week, decisions due under pre-registered rules.
2. `market-intel`: refresh expired facts, new buyer language, new outliers.
3. `cmo`: up to three bets, one brief each, with the reference each piece must beat.
4. Makers per brief: `product-marketer`, `ai-visibility`, `content-marketer`, `social-coordinator`, `performance-marketer`, `conversion-engineer`.
5. `voice-editor` on every draft, then `critic` (claims check plus a different-provider buyer critique).
6. `cmo`: `queue/SUMMARY.md` with recommendations and the decisions only a human makes.

Write everything under `.marketing/work/<YYYY-WW>/`. If a seat cannot do its job (missing data, missing tool), it writes what is missing and the cycle continues, but nothing becomes `ready` without the critic's Pass (queue states in `TEAM.md`). Precedence follows `TEAM.md`: an unresolved claim or policy problem leaves the item `blocked`; otherwise a missing different-provider critique leaves it `review-missing` with its packet.

## launch

Run the `launch-playbook` skill for one product. First check it is installed (root `skills/launch-playbook/SKILL.md` of this repository, or available through the `Skill` tool). If it is not, say launch mode is unavailable in this install and stop. Map its stations to seats: decide (`cmo`), question (`product-marketer` with the founder), buyer (`market-intel`), position (`product-marketer`), door (`conversion-engineer`, `content-marketer`, `ai-visibility`), prove (`voice-editor`, `critic`), stage (`social-coordinator`, `performance-marketer`, `content-marketer`).

## review

Read `queue/`. For each item give its state, the evidence, the critic's verdict with the provider record and draft hash, and a recommendation. An item whose draft hash no longer matches its review goes back to `draft`. Record the human's decisions in `memory/taste.jsonl` through the `voice-editor` taste-ledger rule. Execute nothing external.

## readout

Run `performance-analyst` alone and update `memory/`.

## Gates (every mode)

- Stage, never send: no posting, sending, scheduling, publishing, spending, price changes or payment details.
- The buyer critique runs on a different model provider from the maker, on the current draft, or the item stays `review-missing`.
- No personal data in committed files or review packets; raw exports stay in `.marketing/private/`.
- Every public claim traces to `TRUTH.md` or a cited source.
- Platform facts past expiry are re-fetched before use.
- Honest scarcity only. Tests follow rules written before they start.
