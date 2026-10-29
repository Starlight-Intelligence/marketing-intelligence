---
name: seo-technical-audit
description: Audit crawlability, indexability, metadata, mobile performance and search architecture with Semrush Site Audit or verifiable URL evidence.
---

# Technical SEO / AEO foundation audit

Focus on **indexability before polish**. Identify actual affected pages, impact and fix ownership. A failed crawler is not proof of deindexing.

1. Identify host/protocol, canonical production pages, sitemap, robots policy, accessibility of primary page types and rendering strategy. Check mobile HTML parity and structured content extraction.
2. If connected Semrush project data is available, discover `projects.list_projects`; match the domain and an active `siteaudit` module. Discover completed audit snapshots and read issue occurrence counts and specific affected URLs with exact report schemas. A zero-project response means there is no project-backed crawl to cite.
3. When project data is unavailable, inspect authorized direct URLs, provided exports, Search Console indexing data, Lighthouse/CrUX reports and source code. Label the sampling frame and what was not crawled.
4. Separate blocker/error, ranking or experience degradation, and editorial opportunity. Verify status codes, canonical mismatch, redirect loop, accidental `noindex`, broken links, JS-only content, robots policies and factual structured data. Avoid inventing exact Google policies or CWV thresholds; verify current primary sources.
5. For AI search readiness, treat AI bots separately by vendor and by training vs retrieval purpose. Do not recommend opening everything, `llms.txt`, or bot allowlisting as guaranteed citation fixes.
6. Return an evidence table: URL or template, observed symptom, source/snapshot/time, severity, reason, owner, reversible remediation, acceptance test. Rank by conversion impact and blast radius; route approved changes through `seo-production-changes`.

**Guardrail:** no live robots, redirects, sitemap or indexing changes from analysis alone. Use Semrush upstream as a method reference, not proof that its original skill files are installed.
