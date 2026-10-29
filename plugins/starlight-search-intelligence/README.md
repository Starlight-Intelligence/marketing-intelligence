# Starlight SEO & AI Visibility

**SEO · AEO · GEO · AI Search Visibility** | Starlight Growth Intelligence, portable skills surface

This private skills-only ChatGPT/Codex plugin provides 13 bounded workflows, including eight Semrush-aligned methods and original AI visibility measurement, source-backed prioritization, production patching and GenCreator handoffs. The plugin has **no bundled Semrush API/MCP endpoint and no hosted scheduler**. It uses separately connected, authenticated provider tools only when available.

## Fast example

> Audit the technical SEO and AI search visibility of example.com in the Netherlands. Verify Semrush access and state every data gap. Prioritize three evidence-backed opportunities; propose a reviewable GitHub PR, not a direct deployment.

## Capabilities

- `skills/search-setup`: onboarding, source and budget assessment
- `skills/seo-*`: 8 independent Semrush-aligned search workflows
- `skills/geo-ai-visibility`: observed-prompt citation measurement, not hallucinated rankings
- `skills/growth-opportunity-portfolio`: deterministic evidence-preserving index
- `skills/seo-production-changes`: PR-first website implementation
- `skills/gencreator-growth-handoff`: creator/editorial distribution packet

## Offline CLI (Python stdlib, no network)

```bash
python scripts/growth_core.py score skills/search-setup/references/examples/opportunities.json
python scripts/growth_core.py visibility skills/search-setup/references/examples/visibility.json
python scripts/growth_core.py semrush-rank skills/search-setup/references/examples/semrush_rank.csv --database us --observed-at 2026-10-27T13:00:00+00:00
python -m unittest discover -s scripts -p 'test_*.py' -v
```

Each output carries source data or a digest, input validation and explicit limitations. Input fixtures use **synthetic data**, except when your own user-authorized Semrush report is supplied. These scripts read existing local files only.

## OSS provenance and licensing

Our skill adaptations and CLI are MIT licensed. Upstream projects are referenced rather than copied. Attribution, exact upstream revisions and an eight-workflow map: `skills/search-setup/references/upstream-registry.md`. Semrush official source code is Apache-2.0; Corey Haines and MarketingSkills SEO Operator are MIT. No external shell install commands are executed.

## Lifecycle status

Initial capabilities: structured skills + deterministic offline analysis. No customer-facing dashboard, private production data adapter, public directory publication, always-on hosted monitoring, cross-platform AI scraping, or automatic publishing. Those require separately tested cloud services and user authorization.

The architecture contract is in `skills/search-setup/references/architecture.md`.
