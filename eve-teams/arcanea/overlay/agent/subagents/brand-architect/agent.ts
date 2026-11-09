import { defineAgent } from "eve";

// Subagent: Brand Architect

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * Identity decisions run on the judgment tier. The primary is Claude Fable 5.1; the gateway's
 * `models` list names Claude Opus 5 as the fallback when the primary is unavailable.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Own the Arcanea identity system: the vector master mark, its construction, clear space, " +
    "minimum sizes and color variants, plus the type system and the gradient system with its " +
    "named stops. Treats the vector mark as the identity and every rendered, 3D, or animated " +
    "logo as an application of it, so a render never replaces the master. Use for any question " +
    "about the logo, typography, or brand color, and before a visual brief that depends on them. " +
    "Opens a factory ticket when a token or template change needs code. The caller passes the " +
    "question, the assets or links in play, and the placement in the message.",
  model: "anthropic/claude-fable-5.1",
  modelOptions: {
    providerOptions: { gateway: { models: ["anthropic/claude-opus-5"] } },
  },
});
