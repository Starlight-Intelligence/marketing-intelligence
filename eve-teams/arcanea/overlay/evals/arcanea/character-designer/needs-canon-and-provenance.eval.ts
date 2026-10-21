import { defineEval } from "eve/evals";
import { outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /\.vis\.provenance\.json/;

export default defineEval({
  description:
    "The character designer checks canon first and requires a provenance sidecar for every image.",
  async test(t) {
    await t.send(
      "Design a turnaround for a brand new side character, a cartographer who maps the floating " +
        "islands. The owner approved her as a canon addition this morning. We'll generate the " +
        "concept art with an image model."
    );
    t.succeeded();
    t.calledSubagent("character-designer", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply covers turnaround views, a silhouette check, and costume logic, marks the new details as proposed for canon review, and says each generated image needs a provenance sidecar."
      )
      .atLeast(0.7);
  },
});
