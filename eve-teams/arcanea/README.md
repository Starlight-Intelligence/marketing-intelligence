# Arcanea seats for the eve marketing team

Seven Arcanea specialists packaged as an overlay for a fork of [vercel-labs/marketing-team-eve-template](https://github.com/vercel-labs/marketing-team-eve-template). Applied, the team goes from five specialists to twelve, and the lead routes Arcanea work through them in order.

| Seat | Owns | Hands back |
| --- | --- | --- |
| `canon-keeper` | Checks claims, characters, and lore against the locked canon | `Verdict: CLEAR` or `Verdict: BLOCK` with findings |
| `brand-architect` | The vector master mark, the type system, the gradient system | A ruling plus tokens |
| `visual-director` | Liquid-glass surfaces, gradients with named stops and motion, composition, render briefs | `Score: N/30` and a band: 26 or more ships, 22 to 25 iterates, under 22 restarts |
| `character-designer` | Turnarounds, silhouettes, costume logic, expression sheets, with a `.vis.provenance.json` sidecar for every image | A character sheet artifact |
| `voice-editor` | Rejects machine-made prose, requires an Arcanea-only detail, compares with outlier records | `Verdict: PASS` or `Verdict: REJECT` with line fixes |
| `outlier-scout` | Human work that beats its peers, and why | Outlier records |
| `performance-analyst` | The weekly read, ranked by would-pay and save/share signals | A ranked table and three calls |

No canon or lore text is in this repository. The seats read canon at run time through `read_canon`.

## Layout

```text
eve-teams/arcanea/
├── overlay/
│   ├── agent/lib/starlight/          read_canon and open_factory_ticket factories
│   ├── agent/subagents/<seat>/       seven seats in the template's layout
│   ├── evals/                        eve evals, one folder per seat
│   ├── arcanea-template.patch        changes to existing template files
│   └── PATCHES.md                    what the patch does, model tiers, open items
├── receipts/                         validate and eve info output
└── references/outliers/              written by a sibling run, read by the voice editor
```

## Apply it to the fork

Run from the root of the fork, with this repository checked out at `$MI`:

```bash
cp -R "$MI/eve-teams/arcanea/overlay/agent" "$MI/eve-teams/arcanea/overlay/evals" .
git apply "$MI/eve-teams/arcanea/overlay/arcanea-template.patch"
cp "$MI"/eve-teams/arcanea/references/outliers/*.md \
  agent/subagents/voice-editor/skills/outlier-comparison/references/outliers/
pnpm install
pnpm validate
npx eve info
```

Copy the overlay before applying the patch: the two root tool files the patch adds import from `agent/lib/starlight/`. If the fork has drifted from template commit `f4a9309`, run `git apply --3way` and resolve by hand. If the fork already has an `evals/evals.config.ts`, keep one and merge the `judge` setting.

`pnpm validate` must report 0 errors and 0 warnings, and `npx eve info` must list 12 subagents. Both need network access to `ai-gateway.vercel.sh`, since eve reads model metadata from the gateway catalog at compile time.

## Environment

Set these in the Vercel project. Tokens are read from the environment only.

| Variable | Used by | Default |
| --- | --- | --- |
| `FACTORY_TICKET_REPO` | `open_factory_ticket` | `frankxai/arcanea-ai-app` |
| `FACTORY_GITHUB_TOKEN` | `open_factory_ticket`, needs issues write on that repo | none, the tool refuses without it |
| `CANON_REPO` | `read_canon` | `frankxai/arcanea-ai-app` |
| `CANON_PATH` | `read_canon` | `.arcanea/lore/CANON_LOCKED.md` |
| `CANON_GITHUB_TOKEN` | `read_canon`, contents read on a private repo | none |

## Approval gates added

- `open_factory_ticket`: every call, through `PUBLISH_TOOLS`.
- `save_brand_context`: every call.
- `typefully_create_draft`: every call, scheduled or not.

## Evals

`eve eval arcanea` runs eight cases, at least one per seat. The two required ones are `voice-editor/rejects-ai-draft` and `canon-keeper/blocks-invented-character`. Each gates on the seat's verdict line and adds a judged criterion. They drive the lead, so they also check that it routes to the right seat.

## Status

Built and checked on 2026-10-21 against template `f4a9309` and eve `0.39.3`. Lint and typecheck pass. The proof run stopped at the gateway catalog fetch, which this build environment couldn't reach; see `receipts/` and the open items in `overlay/PATCHES.md`.
