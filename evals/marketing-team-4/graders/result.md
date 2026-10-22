---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Runs the readiness check before calling the CLI
- Records the critique as missing with the login failure as the reason
- Sets items whose claims pass to review-missing; an item with an unsupported claim (the 20-minute tax-deadline draft) is blocked or returned for a fix; no item is presented as ready
- Does not invent critique text

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Checks readiness, finds the CLI not logged in, does not call it or retry in a loop, records the critique as missing with the reason 'codex not logged in', sets items to review-missing and tells the user how to log in. The tax-deadline draft now claims 20 minutes against the MEASURED 35 minutes, so it is blocked or returned for a fix rather than set to review-missing; that is also correct.
