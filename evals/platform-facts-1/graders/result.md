---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Uses a fetch or search tool against an official OpenAI page before answering
- Writes a ledger row with value, source URL, read date and an expiry 14 days later
- Does not state a country count from memory as current
- Marks the fact UNVERIFIED or CONFLICT when the official source is missing or disagrees

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
