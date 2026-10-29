---
type: llm
weight: 1
---

PASS if the response satisfies all of these:
- Fetches the llms.txt specification (or marks the format `[unverified]` if it cannot) and records what it read with URL and read date, writing `no documented support` for any assistant that does not document reading the file
- Produces a draft llms.txt in the llms.txt markdown layout: an H1 title, a short summary, and sections listing links with short descriptions (placeholders for an unknown company name or domain are fine)
- Lists only the supplied pages and invents no others
- Gives the serve checks (status, content type, no login, robots.txt) as results or as commands for the owner
- Does not claim the file improves rankings or guarantees citations

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
