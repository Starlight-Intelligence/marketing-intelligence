# Marketing team

An eleven-seat marketing team that runs inside your own agent, on your own keys, against a memory that lives in your repo. It plans, researches, drafts, critiques and measures. People approve, publish, send, spend and set prices.

Good marketing skill collections already share a product context file between tasks. This team adds four records that compound, so week ten can be better than week one:

| Record | What it holds | Why it matters |
|---|---|---|
| Truth | What is true about the brand and product, each line tagged `RULED`, `MEASURED` or `OPEN` | Agents stop inventing facts and stop arguing with decisions already made |
| Facts | Platform facts (ad markets, policies, formats, prices) with source, read date and expiry | Advice stays current when platforms change monthly |
| Memory | Experiments with their pre-registered rules and results, the taste ledger, the outlier corpus | The team learns what works for *this* audience instead of repeating best practice |
| Queue | Every draft that needs a human decision, with its evidence and a recommendation | Nothing leaves the building unseen, and review takes minutes |

## The brain

The team works from one folder in your project:

```
.agents/
  product-marketing.md     positioning context, shared with other marketing skills
.marketing/
  TRUTH.md                 brand and product truth, provenance-tagged
  preferences.md           how the founder likes to work (channels, review rhythm, lengths); not brand voice
  private/                 raw exports (tickets, analytics, sign-ups); git-ignored, never committed
  brands/<brand>.md        voice, visual rules, banned patterns, channels, budget line
  brands/<brand>.banned.json  brand words and patterns the lint enforces
  facts/<platform>.md      dated, sourced platform facts with an expiry
  memory/
    experiments.jsonl      one line per test: hypothesis, rules, result, decision
    predictions.jsonl      every forecast a seat, model or judge made, and what actually happened
    judgments.jsonl        pairwise judge verdicts, both orders
    taste.jsonl            one line per human approve, reject or edit, with the reason
    ai-panel.md            the fixed buyer-question panel for AI visibility
    ai-visibility.jsonl    one row per assistant run
    outliers/              human work that beat its peers, and why
  queue/                   one item per draft awaiting a human: <item>.md (state and review record)
                           and <item>.draft.md (the draft itself), plus SUMMARY.md and review packets
  work/<YYYY-WW>/          the week's briefs, drafts and reports
```

`.agents/product-marketing.md` is the file `coreyhaines31/marketingskills` and similar skills already read, so the team uses it instead of keeping a second copy. If it exists, setup imports it and never overwrites it.

`marketing-team` sets it up. `marketing-memory`, `platform-facts` and `claims-check` maintain it.

**Personal data.** Raw exports go in `.marketing/private/`, which setup adds to `.gitignore`. Everything committed (work files, memory, queue, review packets sent to another provider) holds aggregates and anonymised evidence references only: no names, emails, handles or quotes that identify a customer. Buyer-language quotes from public sources stay under 15 words with their source.

## The seats

| Seat | Owns | Can act alone? |
|---|---|---|
| `cmo` | The weekly plan (three bets at most), routing, the queue summary | Plans and routes |
| `market-intel` | Buyers' own words, competitors, outliers, platform facts refresh | Research only |
| `product-marketer` | Positioning, offer, pricing hypothesis, launches | Drafts |
| `ai-visibility` | Search and AI-assistant citations (ChatGPT, Claude, Gemini, Perplexity), `llms.txt`, structured data | Research and drafts |
| `content-marketer` | Long-form, newsletter, lead magnets | Drafts |
| `social-coordinator` | Posts and short-form scripts per channel | Drafts into the queue |
| `performance-marketer` | Ads in ChatGPT, Google (AI Max, Performance Max), Meta (Advantage+): worksheets and test plans | Plans only, never spends |
| `conversion-engineer` | Landing and waitlist pages, CRO, tracking verified with a synthetic test | Drafts code on a branch |
| `voice-editor` | Removes AI-sounding prose, enforces the brand voice and the outlier bar | Sends work back |
| `critic` | Claims check and a skeptical-buyer critique, run on a different model provider | Blocks |
| `performance-analyst` | Weekly readout, experiment decisions, memory updates | Reads and records |

## The rhythms

**Setup, once.** `marketing-team setup` interviews the founder, writes `TRUTH.md` and the brand pack, seeds facts for the channels in use, and records what is `OPEN`.

**Weekly cycle.**

1. `performance-analyst` reads last week: results against pre-registered rules, taste ledger, queue outcomes.
2. `market-intel` refreshes expired facts and adds new buyer language and outliers.
3. `cmo` picks at most three bets for the week and writes one brief each, naming the reference each piece must beat.
4. Makers draft: content, social, ads, pages, as each brief needs.
5. `voice-editor` then `critic` review every draft. Failures go back once; a second failure goes to the queue marked as such.
6. `cmo` writes the queue summary: what is ready, the recommendation, and what only a human can decide.

**Light week.** One bet, refresh only the facts that bet depends on, and skip seats it does not need. Use it until the full cycle has shown it pays for its review time.

**Launch mode.** `marketing-team launch <product>` runs the seven-station `launch-playbook` skill with these seats at each station. It needs that skill installed (root `skills/` of this repository); without it, launch mode says it is unavailable and stops.

**Always on.** Expired facts and unanswered `OPEN` items surface at the top of every cycle.

## Gates

- **Stage, never send.** No seat posts, sends, schedules, publishes, spends, changes a price or handles payment details. Everything external goes to the queue.
- **Maker is not the checker.** The `critic` gets its buyer critique from a different model provider's CLI installed on your machine (for example Codex CLI), run read-only with a time limit. If none is installed, logged in and working, it writes a review packet and the critique is recorded as missing, never as done.
- **No unsupported claims.** Every public claim maps to a line in `TRUTH.md` or a cited source. `claims-check` enforces it.
- **No stale facts.** A platform fact past its expiry is re-fetched before use.
- **Honest scarcity.** Founding windows that really close. No invented counts, resetting timers or undecided deadlines.
- **Pre-registered tests.** Scale, hold and kill rules are written before a test starts, and the analyst applies them as written.

## Queue states

Every queue item record (`<item>.md`) carries one state, a `draft_path` pointing at its `<item>.draft.md`, and `draft_hash`, the full `git hash-object` of that draft file. Review packets, critiques and `SUMMARY.md` carry no state.

| State | Meaning |
|---|---|
| `draft` | Made, not yet reviewed |
| `review-missing` | Claims check passed; no different-provider critique ran. A review packet is attached. |
| `ready` | Claims check passed and a different-provider critique ran successfully on this draft's current hash, with its objections answered |
| `blocked` | Unsupported claim, policy problem or second failure |
| `decided` | A human approved, edited or rejected it; the decision is in the taste ledger |

Precedence: `blocked` wins over everything (an unresolved claim or policy problem stays blocked whether or not a provider is available); then `review-missing`; `ready` only when nothing else applies. Only `ready` items are presented as ready. If the draft file changes after review, its hash no longer matches and the item drops back to `draft`. Writing the verdict into `<item>.md` does not change the draft's hash.

## Checks that are code

Judgement stays with the seats; anything a script can check, a script checks. All are Node 22+ with no dependencies, except the incrementality readout (Python via `uv`).

| Check | Script | Used by |
|---|---|---|
| Banned words and AI-writing patterns per surface, fails closed | `skills/marketing-team/scripts/lint-style.mjs` | voice-editor, content, social |
| Consistent UTM tags, internal links left alone | `skills/marketing-team/scripts/utm.mjs` | social, paid, conversion |
| Every checkable claim in a draft, listed | `skills/claims-check/scripts/claims-extract.mjs` | critic |
| Test sizing, Bayesian readout, CPA ranges, budget readability | `skills/marketing-experiments/scripts/ab.mjs` | cmo, paid, conversion, analyst |
| Predicted versus actual, per seat and judge | `skills/marketing-experiments/scripts/predictions.mjs` | everyone who forecasts |
| AI-visibility rates with run counts and intervals | `skills/ai-search-visibility/scripts/visibility.mjs` | ai-visibility, analyst |
| Structured data floor | `skills/ai-search-visibility/scripts/validate-jsonld.mjs` | ai-visibility, conversion |
| Pairwise judging in both orders | `skills/creative-judge/scripts/judge.mjs` | critic |
| Did a change cause a lift, or inconclusive | `skills/incrementality/scripts/causal_readout.py` | analyst |

Tests: `node --test team/tests/tools.test.mjs`.

## What enforces the gates

**A hook, for connected tools.** With the plugin installed, `hooks/gate.mjs` runs before every MCP tool call in the session. Any tool whose name says it sends, posts, publishes, schedules, spends, pays or deletes becomes an "ask": Claude Code shows you the call and waits for your yes. Read-shaped tools (get, list, search) and drafting pass straight through. It applies to the whole session while the plugin is enabled, not only to these seats. Turn it off with `MARKETING_TEAM_GATE=off`. If the hook cannot read its input it stays silent and Claude Code's normal permission rules apply; it never approves anything itself. It matches on tool names, so a tool with an innocent name that acts externally is not caught.

**Instructions and tool lists, for everything else.** No seat is given connector or MCP tools. Every seat except `product-marketer` holds `Bash`, to run the scripts above and, for `critic`, another provider's CLI. That is not a sandbox: a seat with `Bash` can run anything your shell can, including network clients and logged-in CLIs, and `Write`/`Edit` are not limited to `.marketing/`. For hard limits, add your own Claude Code permission rules, for example asking before every `Bash` command except `node` and `uv run` on this plugin's scripts, asking before `git push`, and denying merges and any posting CLI you have installed.

## Specialist skills

Seats call specialist skills through the `Skill` tool when they are installed (see `SHELF.md`). If a skill is not available, the seat says so once and works from its own instructions.

## Install

Claude Code:

```
/plugin install marketing-team --marketplace Starlight-Intelligence/marketing-intelligence
```

On Claude Code versions before 2.1.275, add the marketplace first with `/plugin marketplace add Starlight-Intelligence/marketing-intelligence`, then `/plugin install marketing-team@marketing-intelligence`.

Skills only, any agent (each skill carries its own scripts):

```
npx skills add Starlight-Intelligence/marketing-intelligence
```

Whole team in another agent: copy the repository's `team/` and `skills/` folders into your project. Wherever a file says `${CLAUDE_PLUGIN_ROOT}`, read it as the folder that contains both. Without subagents, `marketing-team` runs each seat's brief in sequence in one context. The gate hook is Claude Code only; elsewhere, use your agent's own approval settings.

The team calls on proven specialist skills where they exist. `SHELF.md` lists them and how to install them.
