import { defineAgent } from "eve";

// Subagent: Canon Keeper

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * Sets the description the lead routes on and the model. Canon critique runs on the critique tier,
 * Gemini 4 Argon at high reasoning effort, because the job is a close comparison of a draft against
 * a long reference file rather than generation. The verdict line the description promises is what
 * the lead and the evals read, so keep the two in step.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Check a draft, caption, script, character sheet, or image brief against the locked Arcanea " +
    "canon before it ships. Reads the canon file itself and compares every claim, name, " +
    "relationship, place, and event in the piece. Returns a first line of 'Verdict: CLEAR' or " +
    "'Verdict: BLOCK', then each finding with the canon section it rests on. A character, " +
    "event, or fact the canon does not contain is blocked, so invented lore never ships by " +
    "accident; a deliberate addition comes back as a proposal for the owner to approve. The " +
    "caller passes the full piece, where it will appear, and any canon sections it already " +
    "pulled in the message. Does not rewrite the piece.",
  model: "google/gemini-4-argon",
  reasoning: "high",
});
