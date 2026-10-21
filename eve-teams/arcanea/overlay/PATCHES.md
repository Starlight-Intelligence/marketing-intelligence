# Patches to the template

The overlay adds files. `arcanea-template.patch` changes eleven existing template files and adds two. It was cut against `vercel-labs/marketing-team-eve-template` at `f4a9309` with eve `0.39.3`, and it depends on the overlay: the two root tool files import `#lib/starlight/tools.js`, so copy the overlay in before applying it.

## What the patch changes

| File | Change | Why |
| --- | --- | --- |
| `agent/instructions.md` | New section 5, "Run Arcanea work through its review seats" | Lead routing for the seven seats: canon before craft, character then canon then visual, brand architect before visual briefs, voice editor last, scouting and analysis before planning. Also tells the lead to quote canon into briefs with `read_canon` and to open one factory ticket per piece. |
| `agent/tools/read_canon.ts` | New, one line | Registers `read_canon` on the lead so it can quote canon into a seat's brief. |
| `agent/tools/open_factory_ticket.ts` | New, one line | Registers `open_factory_ticket` on the lead so one ticket covers a whole piece. |
| `agent/lib/brand-context/tools.ts` | `approval: always()` on `saveBrandContextTool`, TSDoc updated | The template's setup notes call `save_brand_context` ungated. It now pauses for approval for every caller. |
| `agent/subagents/social-media-coordinator/connections/typefully.ts` | New `APPROVAL_REQUIRED_TOOLS = ["typefully_create_draft"]`, gated unconditionally next to the deletes. `PUBLISH_TOOLS` keeps `typefully_edit_draft`, still gated only when `publish_at` is set. | The template only gated a create that scheduled. An unscheduled create now pauses too. |
| `agent/subagents/social-media-coordinator/instructions.md` | One bullet | Tells the coordinator a new draft pauses, so it batches creates. |
| `agent/subagents/product-marketer/instructions.md`, `agent.ts` | One sentence each | Removed the claim that nothing pauses on save. |
| `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md` | The sentences that described the old gates | Kept consistent with the new gates, since the template's own rule is that contradictions cost more than verbosity. |

## The two Starlight tools

Both live in `agent/lib/starlight/` as factories (`config.ts` plus `tools.ts`, the template's two-file rule) and are called from one-line files.

`open_factory_ticket` opens a GitHub issue labelled `factory` on `FACTORY_TICKET_REPO` (default `frankxai/arcanea-ai-app`) with the token in `FACTORY_GITHUB_TOKEN`. Its approval policy looks itself up in `PUBLISH_TOOLS` (`lib/starlight/config.ts`): listed means `user-approval`, unlisted means the call is denied, so renaming the file without updating the list fails closed. Held by the lead, `brand-architect`, `visual-director`, and `character-designer`.

`read_canon` is a GET on the GitHub contents API for `CANON_REPO` (default `frankxai/arcanea-ai-app`) and `CANON_PATH` (default `.arcanea/lore/CANON_LOCKED.md`), with an optional `CANON_GITHUB_TOKEN`. It can return one section by heading, caps output at 60,000 characters, and never builds a regex from model input. Held by the lead, `canon-keeper`, `visual-director`, `character-designer`, and `voice-editor`.

Repository slugs and paths come only from the environment and are validated before they reach a URL. No token is read anywhere else.

## Model tiers

| Tier | Model id in `agent.ts` | Seats |
| --- | --- | --- |
| judgment | `anthropic/claude-fable-5.1`, fallback `anthropic/claude-opus-5` through `modelOptions.providerOptions.gateway.models` | brand-architect, voice-editor |
| build | `anthropic/claude-sonnet-5` | character-designer, performance-analyst |
| volume | `google/gemini-3.8-flash` | outlier-scout |
| visual and canon critique | `google/gemini-4-argon`, `reasoning: "high"` | canon-keeper, visual-director |

The template itself runs every agent on `anthropic/claude-opus-5` and names no Sonnet id. `anthropic/claude-sonnet-5` comes from the eve 0.39.3 agent-config docs.

## Open

- OPEN: the proof run of `pnpm validate` and `npx eve info` stopped at eve's model-catalog fetch, because this session's network policy denies `ai-gateway.vercel.sh`. Lint (179 files) and `tsc` passed. An offline diagnostic in `../receipts/` shows 0 errors, 0 warnings, and 12 subagents, but it is not the proof. Rerun both commands where the gateway is reachable.
- Resolved for catalog existence only: on 2026-10-21 the owner checked the live public catalog at `https://ai-gateway.vercel.sh/v1/models` from a network-capable workspace, and all four new ids (`anthropic/claude-fable-5.1`, `anthropic/claude-sonnet-5`, `google/gemini-3.8-flash`, `google/gemini-4-argon`) plus the fallback `anthropic/claude-opus-5` are listed, each with a 1,000,000-token context window. No model call was made. OPEN still: inference access, fallback behavior, capability fit, quality, cost, and eval acceptance. The overlay keeps no `modelContextWindowTokens` override; the offline diagnostic's placeholder is not release proof.
- OPEN: the judgment-tier fallback relies on the AI Gateway `models` provider option. Confirm the key name against the current gateway docs.
- OPEN: `CANON_REPO` defaults to the same repository as the factory. Set it if canon lives elsewhere.
- OPEN: the evals have not been run. They need model credentials and the gateway.
- `AGENTS.md` says the lead's instructions should not list specialists. Section 5 names the seven seats because the requested routing is an order, the same kind of sequencing section 3 already describes. Remove the names if the fork prefers descriptions alone.
- An unscheduled `typefully_edit_draft` stays ungated. Only creates were asked for.
