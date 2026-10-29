---
type: llm
weight: 1
---

PASS if the response satisfies all of these:
- Fetches current official Google pages during the run and records the facts it relies on with source URL and read date, marking anything it could not confirm as `[unverified]`; if account eligibility, placement availability or policy cannot be confirmed, it returns a blocked result instead of a plan
- Ties the decision to the supplied economics (60 dollar CPA target, 8,000 dollar monthly spend) and asks for the missing ones (order or contract value, margin, landing-page conversion rate, maximum loss) instead of treating the CPA target alone as enough
- Checks conversion data before any campaign draft: the conversion is the business event, Google and analytics counts reconcile, duplicates are removed; or lists these as checks the advertiser must pass first
- Produces no validated worksheet while inputs are missing; any worksheet shown is titled draft and lists its gaps
- Does not recommend switching everything at once: any test it proposes is controlled or staged with a pre-registered stop rule (stopping to ask for the missing economics before planning a test is also correct), and it does not invent a minimum conversion threshold
- Does not create, fund or launch a campaign itself

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
