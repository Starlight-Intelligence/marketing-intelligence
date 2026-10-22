---
type: llm
weight: 2
---

PASS if the response satisfies all of these:
- Hashes the file in draft_path, not the item record, and finds it differs from the recorded draft_hash
- Moves the item back to draft rather than presenting it as ready
- Flags the 20-minute claim as unsupported against the MEASURED 35-minute line

FAIL if any of them is missing or contradicted. Expected behaviour in brief: Hashes the draft file named in draft_path (x-post-taxdeadline.draft.md) with git hash-object, finds it differs from the recorded draft_hash, moves the item back to draft, and flags that the current '20 minutes' contradicts the MEASURED 35-minute line in TRUTH.md.
