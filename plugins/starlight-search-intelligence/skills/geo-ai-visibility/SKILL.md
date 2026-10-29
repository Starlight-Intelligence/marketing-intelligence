---
name: geo-ai-visibility
description: Measure AI search visibility, AEO, GEO and LLM brand mentions or citations in controlled prompt samples without inventing scores or ranking guarantees.
---

# AI Search Visibility Observatory

**Measured phenomenon:** whether a brand is named or a target URL is cited in *observed responses* to a specified set of user-relevant prompts. This is not a global ranking and not the same as Google organic traffic.

Design a reproducible prompt panel covering brand, problem, comparison, category, purchase, implementation and trust questions. Record prompt text privately as needed; stable `prompt_id`/`sample_set_id`, market, language and intended audience. For every actual run record engine, surface (official API vs consumer UX vs search result), model/version, timestamp + timezone, account/session settings, repetition ID, response availability, separate brand mention flag, literal cited URLs, source capture ref and collection policy. Do not represent an agent-generated mock answer as a captured engine result.

The bundled offline CLI `scripts/growth_core.py visibility INPUT.json` computes cohort-specific mention and URL citation rates and Wilson intervals from *provided observed data*. Preserve raw responses privately where authorized. Missing observations produce unknown, never 0%. Cohorts group by engine + surface + model + market + language + sample_set. Never blend platforms; compare only matched panels and repeat design. Explain sampling bias and session personalization.

Analyze cited third parties and our own pages separately. Link cited URLs to their accessible original proof. Review factual entity clarity, citable first-party assets, trusted ecosystem links and accessible technical pages. Do not promise that llms.txt, AI bots, WebMCP, or schema guarantees citation or measurement.

Output: sampling contract, observed rates/counts when available, confidence/coverage caveats, citation opportunities, bounded experiments and a next measurement date *as a proposal*, not a scheduled job.
