---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Uses ab.mjs plan or equivalent arithmetic with the stated baseline and lift
- States that the required sample far exceeds monthly traffic
- Recommends a bigger change or no test rather than running an underpowered test

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Runs the plan arithmetic (baseline 0.03, mde 0.1) and finds roughly 50,000+ visitors per arm, far beyond 2,000 a month; says the test cannot detect a 10% lift in reasonable time and recommends testing a bigger change or not testing.
