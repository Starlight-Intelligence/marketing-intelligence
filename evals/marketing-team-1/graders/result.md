---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Reads .agents/product-marketing.md before asking questions and does not ask for what it already states
- Does not overwrite or rewrite existing sections of .agents/product-marketing.md
- Creates .marketing/ with TRUTH.md, brands/, facts/, memory/, queue/ and adds .marketing/private/ to .gitignore
- Asks questions one at a time and no more than twelve
- Every line in TRUTH.md carries RULED, MEASURED or OPEN, and unanswered items are OPEN
- Ends with a prioritised list of OPEN items

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
