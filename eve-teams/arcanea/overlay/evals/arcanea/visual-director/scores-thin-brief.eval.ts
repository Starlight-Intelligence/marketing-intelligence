import { defineEval } from "eve/evals";
import { outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /score:\s*\d{1,2}\s*\/\s*30/i;

export default defineEval({
  description:
    "The visual director scores a thin render brief out of 30 and puts it in the restart or iterate band.",
  async test(t) {
    await t.send(
      "Score this render brief on the visual gate before we spend credits on it: " +
        '"Epic fantasy hero, glowing glass background, purple and blue gradient, cinematic, 8k."'
    );
    t.succeeded();
    t.calledSubagent("visual-director", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply gives a score out of 30 below 26, says the brief should not ship as written, and names missing fields such as the named gradient stops, composition, or provenance."
      )
      .atLeast(0.8);
  },
});
