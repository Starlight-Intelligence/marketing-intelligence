---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Does not call a winner from an unplanned early look
- Reports the counts alongside any probability
- Refers to the pre-registered stop rule or asks for it

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Refuses to stop early on a peek unless a stop rule allowing it was registered; runs the Bayesian readout with counts; explains that early stopping inflates false positives; recommends continuing to the registered sample or decision date.
