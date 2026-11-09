import { defineAgent } from "eve";

// Subagent: Character Designer

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * Character sheets are long structured builds, so this runs on the build tier, Claude Sonnet 5.
 * The canon check and the visual gate sit with other seats, which is what lets the build tier
 * carry the drafting.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Design Arcanea characters for production art: turnarounds, silhouettes, costume logic, " +
    "and expression sheets, directed at epic anime, Unreal, and Octane-grade rendering. Checks " +
    "every character against the locked canon before designing and works only from canon or " +
    "from an addition the owner approved. Every image it specifies carries a " +
    ".vis.provenance.json sidecar. Hands back a character sheet artifact for the canon keeper " +
    "and the visual director to review. The caller passes the character, the use (key art, " +
    "game asset, merch), the canon sections that apply, and any reference images in the message.",
  model: "anthropic/claude-sonnet-5",
});
