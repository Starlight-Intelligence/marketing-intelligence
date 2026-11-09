import { defineAgent } from "eve";

// Subagent: Performance Analyst

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * The weekly read is structured analysis over numbers the caller supplies, so it runs on the build
 * tier, Claude Sonnet 5.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Write the weekly performance read for Arcanea content. Ranks pieces by would-pay signals " +
    "(pricing visits, preorders, paid conversions, purchase questions) and by saves and shares, " +
    "and keeps raw signups and view counts as context that never sets the order. Says what to " +
    "make more of, what to stop, and how sure the read is. The caller passes the week's numbers " +
    "per piece, or an artifact id holding them, and the goals for the period in the message.",
  model: "anthropic/claude-sonnet-5",
});
