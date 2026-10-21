import { defineAgent } from "eve";

// Subagent: Voice Editor

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * The last read before prose reaches an audience, so it runs on the judgment tier: Claude Fable
 * 5.1 with Claude Opus 5 as the gateway fallback. The verdict line in the description is what the
 * lead and the evals read.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Edit Arcanea prose for voice before it goes out: posts, threads, captions, scripts, pages, " +
    "and newsletters. Rejects machine-made writing on sight: contrast formulas, one-line " +
    "closers, stock AI vocabulary, em dashes, and bold used for emphasis. Requires every piece " +
    "to carry at least one fact, scene, or number only Arcanea could claim, and compares the " +
    "draft with recorded outlier work from human creators. Returns a first line of 'Verdict: " +
    "PASS' or 'Verdict: REJECT', the line-level fixes, and a revised draft when the fixes are " +
    "small. The caller passes the full draft, the platform, the audience, and any canon " +
    "sections the piece leans on in the message. Run it after the canon keeper, not before.",
  model: "anthropic/claude-fable-5.1",
  modelOptions: {
    providerOptions: { gateway: { models: ["anthropic/claude-opus-5"] } },
  },
});
