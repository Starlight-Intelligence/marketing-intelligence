# Architectural contract · Starlight Growth Intelligence v0.1

**Business capability:** Starlight Growth Intelligence — multi-provider, measurable search and growth decision infrastructure. This package is **Starlight SEO & AI Visibility**, the portable skills-only ChatGPT/Codex surface. It is not a deployed SaaS or a Semrush reseller.

## System ownership

- `Starlight-Intelligence/marketing-intelligence`: search evidence, opportunity models, visibility cohort scoring, portable plugin source and future independent provider adapters.
- `Starlight-Intelligence/starlight-marketing`: existing Eve-based marketing agent team; consume findings and produce work. No duplicated marketing agent runtime here.
- `starlight-marketing-skills` account plugin: broad methodology and 50+ pinned Corey Haines reference modules.
- GenCreator Growth Studio: creator UI/editorial distribution and social packaging; consumes Starlight findings.
- FrankX: published architecture guides, advisory offers and public proof; not a source of truth for raw data.
- `agentic-ops` registry and existing product board: control plane for cross-repo operations. Do not create a parallel registry.

## Future hosted services (NOT shipped in this release)

`provider adapters` → `scoped ingestion jobs` → `raw observation evidence ledger (Postgres)` → `normalization + scoring` → `recommendation/approval service` → `GitHub PR / CMS draft` → `deploy/measurement feedback`. Run scheduled jobs on an authorized cloud runtime only after deployment evidence.

Multi-tenant invariants: user/tenant membership on every request; server-side authorization; per-tenant provider secret vault; provenance fields and timestamps; raw vs derived tables; retention controls; provider budgets; idempotency keys; capability-based write gates; immutable review receipts; rollbacks; consent and provider license review before redistribution.

## Visibility contract

Observation unit: engine × surface × model × market × language × stable prompt sample × run. Citations are actual URL links, mentions are literal text/brand occurrences. Avoid cross-platform totals unless samples are structurally comparable. Sample confidence intervals reflect within-sample uncertainty, not generalization to platform audiences. Preserve capture refs, original records, redaction decisions and query/rate costs.

## Cost / authority

Provider and model spend require explicit budget owner and price-bound. Reserve 0 provider API units by default for agent speculation. Never send data to unapproved endpoints. Viewing source does not authorize writing it. Plugins do not schedule agents by their mere installation.
