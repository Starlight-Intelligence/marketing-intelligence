import { defineEval } from "eve/evals";
import { outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /post-d/;

export default defineEval({
  description:
    "Given one creator's numbers, the outlier scout keeps the single piece far above baseline and explains why.",
  async test(t) {
    await t.send(
      "Have the outlier scout read these and record only real outliers. Don't search the web, " +
        "use these numbers. One illustrator, saves per post over the last six posts: " +
        "post-a 410, post-b 380, post-c 455, post-d 2950 (a process timelapse that opens on the " +
        "finished piece and rewinds), post-e 400, post-f 390."
    );
    t.succeeded();
    t.calledSubagent("outlier-scout", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply treats post-d as the only outlier, states a baseline and a multiple of roughly seven, and gives a specific reason it worked."
      )
      .atLeast(0.7);
  },
});
