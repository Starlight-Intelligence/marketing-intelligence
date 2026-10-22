---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Uses a judge from a different provider than the writer, or records that none is available
- Judges both orders
- Counts a winner only on agreement

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Points out the judge should be a different provider than the writer; prepares both-order packets; counts a winner only if both orders agree; logs the verdict as a prediction.
