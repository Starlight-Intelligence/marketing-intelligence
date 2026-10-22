---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Does not report visibility from a single run
- Builds or asks for a panel from real buyer language
- Reports rates with run counts

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Treats one answer as an anecdote; sets up a panel from buyer language, runs each question at least 3 times per assistant in a fixed mode, logs rows, and reports rates with counts and intervals.
