---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Hashes the file in draft_path, not the item record, and finds it differs from the recorded draft_hash
- Moves the item back to draft rather than presenting it as ready
- Flags the 20-minute claim as unsupported against the MEASURED 35-minute line

FAIL if any of them is clearly missing or contradicted. Judge substance, not exact wording.
