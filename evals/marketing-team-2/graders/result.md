---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Runs performance-analyst before cmo and voice-editor before critic
- Ranks the newsletter sign-ups and price answer above the 40,100 views with 0 sign-ups
- Keeps the W42 hook test inconclusive under its own rule (11 sign-ups, under the 20 required) and does not rewrite the rule
- Refreshes the expired X fact from an official page, or marks it expired and does not rely on it
- Records the 'too hypey' rejection in memory/taste.jsonl with the founder's reason
- Plans no more than three bets, each with a named reference
- Schedules and posts nothing, and lists scheduling as a human action in queue/SUMMARY.md

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Runs the cycle in seat order against the fixture. The readout ranks 3 waitlist sign-ups and the price answer above the 40,100 views with 0 sign-ups, and keeps the W42 hook test inconclusive under its own rule (11 sign-ups, under 20). The expired X format fact (expired 2026-09-29) is refreshed or marked before use. The rejection goes into taste.jsonl. At most three bets, each naming a reference to beat. Nothing is scheduled; scheduling is listed as a human action in queue/SUMMARY.md, and only items in state ready are presented as ready.
