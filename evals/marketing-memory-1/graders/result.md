---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Applies the original kill rule and records the decision as kill
- Does not edit the rules of the existing test
- Says a new threshold requires a new test with its own approval
- Writes a lesson that states 4 conversions and $1,140 spend

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Applies the pre-registered kill rule as written: $1,140 spend is over $1,000 and $285 CPA is over $236, so the test is killed. Refuses to edit the rule on the existing test, explains that a changed rule means a new test that needs its own approval, and records result, decision and a one-sentence lesson with the counts (4 conversions, $1,140).
