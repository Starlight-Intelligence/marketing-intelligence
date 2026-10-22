---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Appends one taste.jsonl line per rejection with the founder's own reason
- Identifies the shared pattern
- Proposes the brand pack change for the founder to approve instead of making it

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Appends three taste.jsonl lines with the founder's reasons, notices the shared pattern (open with the problem, not the product), and proposes adding it to the brand pack for the founder to decide rather than changing the brand pack itself.
