---
type: llm
weight: 1
---

PASS if the response satisfies all of these:
- Shows a grounding table (or list) of the platform facts it used, each with an official OpenAI source URL and a read date, or marks a fact as unverified; if it could not fetch the official pages, it returns a blocked result naming what is missing instead of a plan
- Treats advertiser and market eligibility as decided by those fetched pages, not as known
- Asks for the missing economics (order or contract value, margin, affordable cost per acquisition) instead of building a test plan from the 3,000 dollar budget alone
- Does not state ChatGPT ad formats, placements, prices or availability as fact without a source and read date
- Does not create, fund or launch a campaign itself

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
