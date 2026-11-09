import { defineAgent } from "eve";

// Subagent: Visual Director

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * Visual critique runs on the critique tier, Gemini 4 Argon at high reasoning effort, since scoring
 * a render against the 30-point gate is image reading and close judgment. The score format in the
 * description is what the evals match on.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Direct Arcanea visuals: liquid-glass surfaces, shifting gradients with named stops and " +
    "motion rules, and composition. Writes render briefs a generator or an artist can execute, " +
    "and scores a render or a brief against the 30-point visual gate, returning 'Score: N/30' " +
    "and the band: 26 or more ships, 22 to 25 iterates with named fixes, under 22 restarts. " +
    "Refuses to pass an image with no provenance sidecar. The caller passes the image or brief, " +
    "its placement and format, the relevant brand system from the brand architect, and any " +
    "canon notes in the message.",
  model: "google/gemini-4-argon",
  reasoning: "high",
});
