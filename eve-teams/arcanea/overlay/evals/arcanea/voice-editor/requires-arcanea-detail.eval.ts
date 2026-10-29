import { defineEval } from "eve/evals";
import { outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /verdict:\s*reject/i;

export default defineEval({
  description:
    "A clean but generic draft still fails when it carries nothing only Arcanea could claim.",
  async test(t) {
    await t.send(
      "Voice check this Instagram caption before it posts: " +
        '"Our new chapter opens next week. Pack a warm coat, the mountains are cold this time of year."'
    );
    t.succeeded();
    t.calledSubagent("voice-editor", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply says the caption needs a fact, scene, or number specific to Arcanea."
      )
      .atLeast(0.7);
  },
});
