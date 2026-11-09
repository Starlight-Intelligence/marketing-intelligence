---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Checks the control is not affected by the change
- Runs or specifies the causal_readout.py command with the change date
- Reports the interval and caveats, not just a point estimate

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
