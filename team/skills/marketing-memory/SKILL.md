---
name: marketing-memory
description: "Give marketing work a memory that compounds: pre-registered experiments with results, a taste ledger of human approvals and edits, and an outlier corpus of work that beat its peers. Use when someone wants to log a marketing test, record what worked, learn from past campaigns, build a swipe file with reasons, or stop an AI from repeating generic best practice. Plain files in the repo, readable by any agent."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Marketing memory

This skill keeps three records in `.marketing/memory/` of what worked for this audience, and says how to read them before planning.

## 1. Experiments: `experiments.jsonl`

One JSON object per line, appended when a test is proposed and updated in place when it ends. The example values are illustrative, not recommendations. "CPA range" means spend ÷ (n + 2√n) to spend ÷ (n − 2√n) for n conversions, a Poisson approximation used only from 10 conversions; below that, no range is computed and the test cannot scale (the `chatgpt-ads` skill, section 7, has the full method).

```json
{"id":"2026-W44-chatgpt-ads-1","status":"proposed","hypothesis":"Ads on the 'compare tools' intent bring sign-ups below target CPA","metric":"cost per qualified sign-up","target":118,"max_loss":2000,"min_per_variant":10,"variants":["A","B"],"rules":{"spend_stop":"pause at max_loss, or a variant at 2 x target with zero conversions","scale":"whole CPA range <= 118 with >= 10 conversions","stop":"whole CPA range > 118","inconclusive":"otherwise; stop, do not extend"},"control":"matched geo split chosen before launch (illustrative)","decision_date":"2026-11-20","result":null,"decision":null,"lesson":null}
```

Rules:

- `rules` and `control` are written before the test starts and never edited afterwards. A changed rule is a new test.
- `status` moves `proposed` → `approved` (a human approved the maximum loss) → `running` → `decided`.
- `lesson` is one sentence a future brief can use, with the evidence.
- Report counts next to every rate.
- No personal data: aggregates only. Raw exports stay in `.marketing/private/`.

## 2. Taste ledger: `taste.jsonl`

Every human decision on a queue item, so the team learns the founder's judgement.

```json
{"date":"2026-11-03","item":"queue/x-thread-launch.md","decision":"edited","reason":"too salesy in the first line","pattern":"open with the problem, not the product","brand":"acme"}
```

Read the last 50 lines before drafting or editing. When three or more entries share a pattern, propose adding it to the brand pack; the founder decides.

## 3. Outlier corpus: `outliers/<slug>.md`

Human-made work that clearly beat its peers, and why.

```markdown
# <title>
- Link: <url> (read <date>)
- Creator: <name>
- Format: <thread | article | video | page | email>
- Evidence it outperformed: <public numbers or coverage, with source>
- The move that transfers: <one or two sentences>
- What not to copy: <the part that only works for them>
- Tags: <channel>, <topic>
```

Link and describe; never copy the work. Quotes stay under 15 words.

## Reading memory before planning

Before any brief or draft:

1. Decided experiments on the same channel or intent: what won, what was killed, and why.
2. The last 50 taste entries.
3. Two or three outliers tagged for the channel.

Cite what you used in the brief. A plan that ignores a relevant past result must say why.
