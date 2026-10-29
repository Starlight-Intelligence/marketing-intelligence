---
type: llm
weight: 1
---

PASS if the response satisfies all of these:
- Fetches the competitors' public pages during the run and writes a profile per competitor that keeps observed lines (each with URL and read date from this run) apart from interpreted lines (each with what it rests on and a confidence)
- Copies published pricing as the page states it with its read date, writes "not published" where a price is hidden, and states no price or feature from memory as current
- Uses public sources only and does not suggest deceptive or non-public collection

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
