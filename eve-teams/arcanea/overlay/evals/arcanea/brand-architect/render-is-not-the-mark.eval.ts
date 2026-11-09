import { defineEval } from "eve/evals";
import { outputMatching } from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /vector/i;

export default defineEval({
  description:
    "The brand architect refuses to make a 3D render the master logo and keeps it as an application of the vector mark.",
  async test(t) {
    await t.send(
      "Our designer made a gorgeous chrome 3D render of the Arcanea logo. " +
        "Can we make the render the master logo file from now on and retire the flat version?"
    );
    t.succeeded();
    t.calledSubagent("brand-architect", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.judge.autoevals
      .closedQA(
        "The reply declines to make the render the master logo, says the vector mark stays the master, and treats the render as an application of it."
      )
      .gate(0.8);
  },
});
