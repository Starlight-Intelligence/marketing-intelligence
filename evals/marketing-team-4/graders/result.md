---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Runs the readiness check before calling the CLI
- Records the critique as missing with the login failure as the reason
- Sets items whose claims pass to review-missing; an item with an unsupported claim (the 20-minute tax-deadline draft) is blocked or returned for a fix; no item is presented as ready
- Does not invent critique text

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
