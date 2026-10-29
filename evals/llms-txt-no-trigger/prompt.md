---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
timeout_seconds: 240
tags: [llms-txt, no-trigger]
---

Here is our whole robots.txt:

User-agent: *
Disallow: /admin

Add a line that points crawlers to https://example.com/sitemap.xml and show me the full updated file in your reply. Do not look for files; just answer.
