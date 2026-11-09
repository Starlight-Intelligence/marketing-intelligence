import { defineEvalConfig } from "eve/evals";

/**
 * Shared eval defaults for the Arcanea seats.
 *
 * @remarks
 * The judge is never the model under test. Claude Opus 5 grades the free-form criteria; the gates
 * that decide pass or fail are deterministic matches on each seat's verdict line.
 */
export default defineEvalConfig({
  judge: { model: "anthropic/claude-opus-5" },
});
