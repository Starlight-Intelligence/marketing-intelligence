---
name: search-setup
description: Prepare a privacy-scoped SEO, AEO, GEO and AI-search visibility project using connected data and local evidence without asking for secrets.
---

# Initialize Search Intelligence

**Task:** establish one target domain, intended region/language, commercial outcome and read-only evidence inventory. The user's request and available connected accounts are authoritative; do not restart discovery from questions when data exists.

1. Confirm the site from the current user request or connected context; distinguish production, staging and competitor URLs. Never imply ownership merely from a domain string.
2. Inventory only *available, authenticated* data sources: Semrush, GSC, GA4, PostHog, GitHub, Vercel, first-party CRM and declared AI-search observation exports. Detect tools before use, not from memorized names.
3. Semrush: use report discovery → current report schema → report execution. Start with a low-cost domain snapshot; reports consume API units. If `projects.list_projects` returns empty, do not claim a project Site Audit exists. Do not ask for an API key when the official connected MCP handles authentication.
4. Establish `site`, `market`, `language`, `search_surfaces`, `primary_conversion`, `sample_period`, `payer`, `maximum_provider_units`, `access_level`, `source_refs`, `known_gaps`. If an important value is unknown, mark it unknown rather than inventing.
5. Output a one-page project packet with verified sources, authorization boundary, baseline timestamp, missing sources and recommended first workflow. The project packet is a *handoff*, not a persistent database write.

**Acceptance:** one useful next action runs with current permissions; no secret handling or claims about unverified integrations.

**Routing:** technical issues → `seo-technical-audit`; organic demand → `seo-keyword-research`; AI answers → `geo-ai-visibility`; funnel output → `gencreator-growth-handoff`.
