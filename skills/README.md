# Marketing intelligence skills

Playbooks for agents that do marketing work: launches, ads inside AI assistants, and being cited by them. Each skill is a `SKILL.md` with its own `evals/`, works in any agent that reads skills, and stops at the decisions a human should make: prices, publishing, sending and spending.

```bash
npx skills add frankxai/marketing-intelligence
```

## Skills

| Skill | Status | What it does |
|---|---|---|
| [`launch-playbook`](launch-playbook/SKILL.md) | v0.1 | One product from "should this exist" to a launch-ready waitlist in seven stations |
| [`chatgpt-ads`](chatgpt-ads/SKILL.md) | v0.1 | Plan, audit and measure ads inside ChatGPT, around conversation intents |
| `ai-search-visibility` | planned | Measure whether ChatGPT, Claude, Gemini and Perplexity cite you, and track it over time |
| `google-ai-max` | planned | AI Max, Performance Max and ads in AI Overviews and AI Mode |
| `meta-advantage-plus` | planned | Creative and measurement for Meta's automated campaigns |
| `llms-txt` | planned | Write and maintain `llms.txt` so assistants read the right pages |
| `competitor-intelligence` | planned | A dated, sourced view of what you must beat |
| `social-listening` | planned | What buyers say about the category, summarised without personal data |
| `newsletter-growth` | planned | Grow a list with gifts that are real slices of the product |

"Planned" means named and scoped, not written. A skill moves to v0.1 only with evals.

## Principles

- **Ground first.** Platforms change monthly. Skills fetch official sources and record read dates instead of quoting facts from memory.
- **Honest scarcity.** A founding window that closes at launch. No invented counts, resetting timers or fake deadlines.
- **Maker is not the checker.** Work is critiqued by a different model or person before it ships.
- **Stage, never send.** Agents draft; humans publish, send, spend and set prices.

## Companion skills

These playbooks call on general marketing skills where useful, for example [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) for customer research, positioning, pricing, copywriting and conversion work. Any equivalent skill works.
