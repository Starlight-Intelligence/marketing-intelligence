---
name: claims-check
description: "Check every claim in marketing copy against evidence before it ships: numbers, comparisons, superlatives, testimonials, guarantees, scarcity and dates. Each claim must trace to the brand's TRUTH file or a cited source, or it is cut or rewritten. Use before publishing a page, post, email or ad, or when someone asks to fact-check marketing copy, audit claims, or make copy compliant and credible."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Claims check

This check finds every claim in a draft and asks one question of each: what is the evidence?

## 1. Extract

List every sentence that asserts something a reader could check or rely on:

- Numbers and results ("cuts reporting time by 40%", "2,000 users")
- Comparisons and superlatives ("faster than", "the only", "best")
- Social proof (testimonials, logos, counts, "trusted by")
- Promises (guarantees, delivery times, outcomes)
- Scarcity and dates ("only 50 seats", "closes Friday")
- Facts about other companies or platforms

## 2. Trace

For each claim, find one of:

- A `TRUTH.md` line tagged `RULED` (for decisions such as a guarantee or a founding window) or `MEASURED` (for numbers), with its method and date.
- A cited external source, opened and dated, that states it.
- A platform fact from `.marketing/facts/` that has not expired.

## 3. Verdict per claim

| Verdict | Meaning | Action |
|---|---|---|
| Supported | Evidence found and current | Keep; note the evidence |
| Overstated | Evidence supports a weaker claim | Rewrite to what the evidence supports |
| Unsupported | No evidence | Cut, or move to `OPEN` for the founder |
| Not allowed | Invented testimonial, seeded count, resetting timer, undecided date, a competitor claim you cannot source | Cut; block if the piece depends on it |

## Output

A table: claim, verdict, evidence, fix. Then the draft with fixes applied, or the reason it is blocked. Never resolve an unsupported claim by finding a source after the fact that says something different from the claim.
