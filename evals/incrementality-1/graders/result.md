---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Checks the control is not affected by the change
- Runs or specifies the causal_readout.py command with the change date
- Reports the interval and caveats, not just a point estimate

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Notes the pre-period is about 10 weeks, checks organic visits is a plausible control not affected by the newsletter, runs causal_readout.py, and reports the verdict with the interval and caveats; says inconclusive if the script does.
