# Upstream OSS registry · verified 2026-10-27

The upstream sources are **references**, not installed executables, not endorsements, and not new MCP authorizations. The Starlight skill texts in this package are new adaptations, not verbatim copies. Source revisions are explicitly pinned for review; do not execute `curl | bash` or update from moving HEAD.

| Upstream | Commit pinned | License | Use | Import decision |
| --- | --- | --- | --- | --- |
| [Semrush skills](https://github.com/semrush/skills) | `019ab369403c0e816707edae6194fa3bb47dfcd0` | Apache-2.0 | 8 workflow categories: technical audit, internal links, schema, keyword, content brief, SERP, backlink, competitor gap | Adapt into 8 native skill workflows with fresh MCP discovery; no vendor code bundled |
| [Corey Haines marketingskills](https://github.com/coreyhaines31/marketingskills) | `17772c7a80b7b8c7a47af30f648374cd8bd8adc5` | MIT | 50+ broad marketing modules including `ai-seo`, CRO, content, sales | **Already in separate Starlight Marketing Skills private plugin** at its own older pin. Cross-route, do not duplicate |
| [MarketingSkills SEO Operator](https://github.com/marketingskills/seo) | `6f4558604718a7b850ac7bf448c3fcb6f9181dfb` | MIT | Traffic decay, priority scoring, brief generation, agency offers and closed-loop SEO | Borrow design ideas with original Starlight implementation; no installer or copied code |
| [RankSpot Awesome SEO Agent Skills](https://github.com/RankSpotAI/awesome-seo-agent-skills) | `35b0ae201a28eaab67e20a7f2566f6ce60ba303e` | CC0-1.0 list | Supply-chain and discovery index | Discovery only, not a runtime dependency |

The account-level `starlight-marketing-skills` pinned source noted on 2026-10-27 was `1efedbc5148b54b2f0f6c6c9fe0be62e151c7fff` (50 modules). Review its upgrade separately; don't mutate the plugin implicitly.

## Tool routing

- Semrush connection → schema-discovered reports; charged API units, report-specific entitlements.
- GSC connection → first-party query/page metrics, not keyword market volume.
- GA4/PostHog/CRM → conversion and behavior metrics, not general market rankings.
- GitHub → reviewable source changes, not implicit merge or deployment.
- Vercel → preview and deployment state when actually accessible.
- AI response panel → observed, attributable responses and citations; no simulated answers as baseline.

## Eight Semrush workflow mapping

| Official upstream workflow | Adapted Starlight skill |
| --- | --- |
| `technical-seo-audit` | `seo-technical-audit` |
| `internal-link-audit` | `seo-internal-link-audit` |
| `schema-markup` | `seo-schema-integrity` |
| `keyword-research` | `seo-keyword-research` |
| `content-brief` | `seo-content-brief` |
| `serp-analysis` | `seo-serp-analysis` |
| `backlink-audit` | `seo-backlink-audit` |
| `competitor-gap` | `seo-competitor-gap` |

*Important:* Semrush official SDK/API report identifiers can change; rediscover per live tool contract. Proprietary Semrush measurements remain subject to provider use and redistribution terms.
