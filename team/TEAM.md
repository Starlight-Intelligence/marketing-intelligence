# Marketing team

An eleven-seat marketing team that runs inside your own agent, on your own keys, against a memory that lives in your repo. It plans, researches, drafts, critiques and measures. People approve, publish, send, spend and set prices.

Most marketing skills are good advice with no memory. This team keeps four records that compound, so week ten is better than week one:

| Record | What it holds | Why it matters |
|---|---|---|
| Truth | What is true about the brand and product, each line tagged `RULED`, `MEASURED` or `OPEN` | Agents stop inventing facts and stop arguing with decisions already made |
| Facts | Platform facts (ad markets, policies, formats, prices) with source, read date and expiry | Advice stays current when platforms change monthly |
| Memory | Experiments with their pre-registered rules and results, the taste ledger, the outlier corpus | The team learns what works for *this* audience instead of repeating best practice |
| Queue | Every draft that needs a human decision, with its evidence and a recommendation | Nothing leaves the building unseen, and review takes minutes |

## The brain

The team works from one folder in your project:

```
.marketing/
  TRUTH.md                 brand and product truth, provenance-tagged
  product-marketing.md     positioning context (compatible with other marketing skills)
  brands/<brand>.md        voice, visual rules, banned patterns, channels, budget line
  facts/<platform>.md      dated, sourced platform facts with an expiry
  memory/
    experiments.jsonl      one line per test: hypothesis, rules, result, decision
    taste.jsonl            one line per human approve, reject or edit, with the reason
    outliers/              human work that beat its peers, and why
  queue/                   drafts awaiting a human, one file each
  work/<YYYY-WW>/          the week's briefs, drafts and reports
```

`marketing-team` sets it up. `marketing-memory`, `platform-facts` and `claims-check` maintain it.

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

**Launch mode.** `marketing-team launch <product>` runs the seven-station launch playbook with these seats at each station.

**Always on.** Expired facts and unanswered `OPEN` items surface at the top of every cycle.

## Gates

- **Stage, never send.** No seat posts, sends, schedules, publishes, spends, changes a price or handles payment details. Everything external goes to the queue.
- **Maker is not the checker.** The `critic` runs on a different model provider from the maker (for example through the Codex or Gemini CLI). If none is available it writes a review packet and the critique is recorded as missing, never as done.
- **No unsupported claims.** Every public claim maps to a line in `TRUTH.md` or a cited source. `claims-check` enforces it.
- **No stale facts.** A platform fact past its expiry is re-fetched before use.
- **Honest scarcity.** Founding windows that really close. No invented counts, resetting timers or undecided deadlines.
- **Pre-registered tests.** Scale, hold and kill rules are written before a test starts, and the analyst applies them as written.

## Install

Claude Code:

```
/plugin install marketing-team --marketplace Starlight-Intelligence/marketing-intelligence
```

On Claude Code versions before 2.1.275, add the marketplace first with `/plugin marketplace add Starlight-Intelligence/marketing-intelligence`, then `/plugin install marketing-team@marketing-intelligence`.

Other agents: copy `team/skills/` into your skills folder. Without subagents, `marketing-team` runs each seat's brief in sequence in one context.

The team calls on proven specialist skills where they exist. `SHELF.md` lists them and how to install them.
