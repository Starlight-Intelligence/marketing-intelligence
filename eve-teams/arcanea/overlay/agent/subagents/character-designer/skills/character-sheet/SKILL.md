---
description: "Use for any character design work: the order of the sheet (silhouette, turnaround, costume logic, expressions, render notes), the minimum for each section, and the provenance sidecar every image needs."
---

# Character sheet

Work the sections in this order. Each one constrains the next, so a later section never fixes an earlier one.

1. Silhouette. Three to five thumbnail silhouettes, then the chosen one with the reason. It has to read in a flat black fill at 64 pixels tall and differ from every other character in the cast at that size.
2. Turnaround. The views, pose, and orthographic rules in `references/turnaround-spec.md`.
3. Costume logic. Every element answers four questions: what it does, where it comes from, what it says about rank or role, and what history it carries. Only canon history counts; a proposed detail is marked as proposed.
4. Expression sheet. At least eight expressions, with the two the character defaults to marked.
5. Render notes. Materials, lighting logic, and what changes between anime key art, Unreal real-time, and Octane path-traced targets.

Every image, whether it is generated, painted, or a reference, gets a `.vis.provenance.json` sidecar in the format of `references/provenance-sidecar.md`.
