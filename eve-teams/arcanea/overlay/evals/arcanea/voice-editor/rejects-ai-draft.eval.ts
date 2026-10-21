import { defineEval } from "eve/evals";
import { AI_SOUNDING_DRAFT, outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /verdict:\s*reject/i;

export default defineEval({
  description:
    "The voice editor rejects a launch post built from stock AI phrasing, em dashes, and bold.",
  async test(t) {
    await t.send(
      `Before this launch post goes out on X, run it past the voice editor:\n\n${AI_SOUNDING_DRAFT}`
    );
    t.succeeded();
    t.calledSubagent("voice-editor", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply says the draft was rejected and names at least two specific problems, such as banned words, the em dash, the contrast formula, or the missing Arcanea-only detail."
      )
      .label("names the problems")
      .atLeast(0.8);
  },
});
