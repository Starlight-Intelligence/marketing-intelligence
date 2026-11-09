---
name: ai-search-visibility
description: "Measure and improve whether ChatGPT, Claude, Gemini, Perplexity and Google AI answers mention and cite your brand for the questions buyers ask. Fixed question panels, repeated runs with counts and intervals, raw per-run rows you own, a gap-to-brief loop, content rules from published research, llms.txt and structured data checks. Use for AI search visibility, GEO, AEO, generative engine optimization, LLM SEO, are we in ChatGPT answers, AI citations, share of voice in AI."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# AI search visibility

Assistant answers change from run to run. A single run per question is an anecdote, and a dashboard number without its run count cannot be checked. This skill measures with repeated runs, keeps every raw row in your repo, and turns each gap into a piece of work.

## 1. The panel

Keep `.marketing/memory/ai-panel.md`: 10 to 40 questions taken from real buyer language (support tickets, sales calls, community threads, search suggestions). Two kinds:

- **Category questions** that do not name you ("best bookkeeping app for freelance designers"). These measure whether you are found.
- **Brand questions** that do ("is Ledgerly worth it"). These measure what assistants say about you.

Keep the panel fixed between sweeps so results compare. Version it when it changes.

## 2. Runs

For each assistant you can actually query (its app, an API key the user has, or runs the user does and pastes in), run every question at least **3 times** per sweep, in the same mode each time (with or without web search), and append one row per run to `.marketing/memory/ai-visibility.jsonl`:

```json
{"date":"2026-11-02","assistant":"chatgpt","mode":"search","model":"<as reported or null>","question_id":"q07","mentioned":true,"cited":false,"position":2,"competitors":["acme"],"sources":["https://..."]}
```

An assistant you cannot query is recorded as not observed, never estimated. Never create accounts or automate a consumer app against its terms.

## 3. Read

```
node scripts/visibility.mjs --since 2026-11-01
```

It reports mention and citation rates per assistant and question with run counts and 95% intervals, the competitors that appear, the sources assistants cite most, and the questions where you never appear. Under 3 runs it reports "insufficient", not a rate.

## 4. Turn gaps into work

For each question where you are absent:

1. Look at the sources the assistants cite for it. That is where the answer comes from.
2. Decide the move: a page that answers the question directly, an update to an existing page, or earning a mention on a source the assistants already cite (draft the pitch; a person sends it).
3. Write a brief for the content seat with the question, the cited sources, and the dimension the page must beat them on.
4. Re-run the question in later sweeps and record the change. Visibility moves slowly; judge over several sweeps.

## 5. Page rules

Published research (Aggarwal et al., KDD 2024) found that adding statistics, quotations and cited sources raised visibility in generative answers on its benchmark, by up to 40%, with results varying by domain. Treat that as a hypothesis to test on your own panel:

- Answer the question in the first paragraph.
- Use specific, dated facts and numbers you can back.
- Cite sources and quote real people where you have permission.
- Mark up the page with structured data and check it: `node scripts/validate-jsonld.mjs page.html` (a floor; confirm rich-result eligibility with Google's Rich Results Test).
- Keep an `llms.txt` at the site root listing the pages that matter, in plain markdown with one-line descriptions.

## Rules

No fake reviews, planted posts, sock-puppet accounts or anything that impersonates a customer. Report rates with their counts and the model names seen. Never claim a ranking you did not measure.
