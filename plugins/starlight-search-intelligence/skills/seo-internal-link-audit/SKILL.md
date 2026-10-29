---
name: seo-internal-link-audit
description: Diagnose orphan pages, crawl depth, broken navigation and internal linking gaps using a crawl or clearly labelled URL samples.
---

# Internal linking and information architecture

Identify intended commercial hubs and resource nodes. Collect **observed** internal links from crawl export, static source, sitemap plus sampled HTML, or a completed site audit. A sitemap listing is not evidence that a page has incoming HTML links.

Construct directed edges `(source_url,target_url,anchor)` with source evidence and crawl timestamp. Resolve canonical hosts and fragments; treat JS/SSR behavior explicitly. Distinguish confirmed orphan (complete scoped crawl), suspected orphan (partial crawl), broken link, redirect hop, deep page and missing editorial connection.

Output candidate linking PR with origin URL, destination URL, relevant anchor, supporting sentence context, page intent and expected user benefit. Avoid automated exact-match anchor repetition or mass-link insertion.

**Done:** affected URLs traced, sampling completeness disclosed, edit scoped and measurable in the next crawl.
