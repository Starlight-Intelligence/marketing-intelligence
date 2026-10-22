# Skill shelf

The team does not rewrite what others already do well. Each seat calls on the strongest public skill for its craft through the `Skill` tool when it is installed, and the team adds records those skills do not keep: pre-registered experiments with results, a taste ledger, expiring platform facts, a claims check, a hand-off to a different provider's critique when one is installed, and a queue for human decisions.

Checked 2026-10-22. Install counts change; re-check on [skills.sh](https://skills.sh) before relying on them.

## Install the specialists (optional, recommended)

```bash
npx skills add coreyhaines31/marketingskills
npx skills add mattpocock/skills
```

The team works without them; seats then rely on their own instructions.

## By seat

| Seat | Specialist skills it uses when installed | What the team adds |
|---|---|---|
| `cmo` | `marketing-plan`, `marketing-council` (coreyhaines31) | Three-bet limit, briefs that name the reference to beat, the approval queue summary |
| `market-intel` | `customer-research`, `competitor-profiling` (coreyhaines31) | Dated sources on every finding, the outlier corpus, the platform-facts ledger |
| `product-marketer` | `product-marketing`, `pricing`, `offers`, `launch` (coreyhaines31); `grill-me` (mattpocock) | `TRUTH.md` provenance tags, honest scarcity, price as a labelled hypothesis, the seven-station launch playbook |
| `ai-visibility` | `ai-seo`, `seo-audit`, `schema`, `site-architecture` (coreyhaines31) | A repeated question panel across ChatGPT, Claude, Gemini and Perplexity, logged over time |
| `content-marketer` | `copywriting`, `content-strategy`, `copy-editing`, `lead-magnets` (coreyhaines31) | Brief must name the piece it beats and on which dimension |
| `social-coordinator` | `social`, `social-content`, `video` (coreyhaines31) | Format limits from the facts ledger, every post tagged with the bet and metric that judge it |
| `performance-marketer` | `ads`, `ad-creative`, `ab-testing` (coreyhaines31); `chatgpt-ads` (this repo) | Economics first, variants derived from maximum loss, pre-registered stop rules, never spends |
| `conversion-engineer` | `cro`, `copywriting`, `analytics` (coreyhaines31) | Synthetic end-to-end test before a page counts as done |
| `voice-editor` | `copy-editing` (coreyhaines31); any humanizer skill | Taste ledger from the founder's own edits, the outlier bar |
| `critic` | none | Claims check against evidence, buyer critique on a different model provider |
| `performance-analyst` | `analytics`, `attribution` (coreyhaines31) | Pre-registered rules applied as written, would-pay signals ranked first, lessons written to memory |

## How this differs from what exists

| Approach | Strength | What it leaves open |
|---|---|---|
| Marketing skill collections | Deep craft per task; a shared product context file (for example `.agents/product-marketing.md` in coreyhaines31/marketingskills, read 2026-10-22) | No pre-registered experiment record, no expiring platform-facts ledger, and drafting and judging run on the same model |
| Cloud marketing-team templates | A lead agent routing to specialists, approval steps, chat integration | Runs as a hosted service; brand memory and measurement are left to the operator |
| C-suite advisor skills | Fast strategic framing | Advice without execution, data or gates |
| This team | Runs in your agent on your keys, with the four records in `TEAM.md`, on top of the same context file | Depends on the data you give it and on a second provider's CLI for independent critique; no seat holds a tool that publishes, sends or spends |
