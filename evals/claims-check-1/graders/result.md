---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Lists all four claims
- Marks the reporting-time claim overstated and rewrites it to about 30% with the sample size
- Cuts the 2,000 agencies claim as unsupported
- Keeps the lifetime price claim citing the RULED line
- Cuts the 7 spots claim as not allowed

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Extracts four claims. 'Cut reporting time in half' is overstated (evidence shows 30% on 12 users) and is rewritten to match. 'Trusted by 2,000 agencies' is unsupported and cut. The lifetime price claim is supported by the RULED line. 'Only 7 founding spots left' is not allowed without a ruled, real limit and is cut.
