---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Detects that the fact has expired
- Refreshes it from an official Meta source before relying on it
- Cites the refreshed ledger row in the plan

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Notices the fact is past its 30-day expiry, refreshes it from Meta's official pages before writing the plan, and cites the refreshed row.
