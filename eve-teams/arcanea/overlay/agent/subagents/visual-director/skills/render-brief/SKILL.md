---
description: "Use when writing a render brief for a generator or an artist: the brief template, the liquid-glass surface rules, and the provenance fields a generated image must come back with."
---

# Render brief

A render brief is complete when someone who has never seen Arcanea could execute it and the visual gate could score the result. Use `references/brief-template.md` field by field and leave no field blank: write "open" and the reason when a field is deliberately undecided.

Surfaces follow `references/liquid-glass.md`. Gradients are quoted by name from the brand architect's system, with the motion rule, never as loose hex values.

Every brief ends with the provenance block the generator or artist fills in, so the `.vis.provenance.json` sidecar can be written for the output.
