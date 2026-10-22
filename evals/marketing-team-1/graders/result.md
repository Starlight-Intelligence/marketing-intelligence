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

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Runs setup mode: reads the existing .agents/product-marketing.md first and asks only about what it leaves open; creates .marketing/ with the documented layout without overwriting anything; adds .marketing/private/ to .gitignore; interviews one question at a time (at most twelve); writes TRUTH.md with every line tagged RULED, MEASURED or OPEN; adds missing sections to .agents/product-marketing.md without changing existing ones; seeds facts only for channels in use; ends with the OPEN items that block good work.
