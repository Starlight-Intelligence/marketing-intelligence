---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Adds and resolves the prediction with predictions.mjs
- Notes fewer than 10 resolved predictions means no conclusion

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Adds the prediction, resolves it as false, and reports that with one resolved prediction the hit rate is an anecdote; explains the report becomes useful after ten or more.
