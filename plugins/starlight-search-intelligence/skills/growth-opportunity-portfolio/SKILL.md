---
name: growth-opportunity-portfolio
description: Prioritize cross-channel SEO, AEO, GEO and growth experiments from traceable observations using deterministic scoring and bounded budgets.
---

# Opportunity portfolio / growth decisions

Choose a commercial objective and characterize potential work as technical repair, existing content improvement, new authority asset, backlink/PR partnership, AI-search citation improvement, conversion test or distribution. Maintain source lineage rather than narrative optimism.

For each opportunity create a unique ID/title and explicit evidence list `{source,ref,observed_at}` with timezone. Assign analyst-judgment `impact` 0-5, `business_fit` 0-5, `confidence` 0-1, `effort_hours` 0+; use first-party revenue or conversion evidence when available, mark uncertainty otherwise. Never call an index predicted revenue.

Run `python scripts/growth_core.py score opportunities.json` when the current host actually permits local script execution. Otherwise apply the documented formula and identify it as unexecuted heuristic. The script refuses missing evidence and malformed input. Rank by calculated index, then apply hard gates: indexability, legal/source licensing, permission, high blast radius, provider unit budget and campaign quality.

Return a portfolio with **now / next / defer**, baseline, value hypothesis, owner, cost bounds, acceptance metric, stop condition and reproducible data sources. One sprint should deliver at least one measured change, not merely another backlog. For projects with existing task authority, add scoped tasks there; do not create shadow roadmaps.
