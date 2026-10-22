---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Does not present synthetic output as a conversion rate
- Labels any persona use as idea screening only

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Declines to report a synthetic conversion rate as customer evidence; allows persona output only as labelled idea screening, citing the known gap between simulated and real survey answers.
