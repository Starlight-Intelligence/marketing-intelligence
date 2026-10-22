---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Checks whether launch-playbook is installed before starting
- Says launch mode is unavailable and names what is missing
- Does not improvise the launch stations from memory

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Checks for the launch-playbook skill, does not find it, says launch mode is unavailable in this install and how to get it, and stops without improvising a launch process.
