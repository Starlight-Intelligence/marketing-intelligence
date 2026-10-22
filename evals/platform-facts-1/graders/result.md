---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Uses a fetch or search tool against an official OpenAI page before answering
- Writes a ledger row with value, source URL, read date and an expiry 14 days later
- Does not state a country count from memory as current
- Marks the fact UNVERIFIED or CONFLICT when the official source is missing or disagrees

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Fetches the official OpenAI advertiser pages, records the value as published with the exact URL, today's read date and a 14-day expiry in .marketing/facts/chatgpt-ads.md. If official pages are unreachable or disagree with news coverage, marks the fact UNVERIFIED or CONFLICT instead of stating a number from memory.
