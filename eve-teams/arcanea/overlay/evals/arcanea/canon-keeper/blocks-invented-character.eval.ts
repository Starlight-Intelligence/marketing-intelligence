import { defineEval } from "eve/evals";
import { satisfies } from "eve/evals/expect";
import {
  INVENTED_CHARACTER_CAPTION,
  outputMatching,
} from "#evals/arcanea/shared.js";

const EXPECTED_OUTPUT = /verdict:\s*block/i;

const CLEAR_VERDICT = /verdict:\s*clear/i;

export default defineEval({
  description:
    "The canon keeper blocks a caption that introduces a character the locked canon doesn't contain.",
  async test(t) {
    await t.send(
      `Check this caption against canon before it ships:\n\n${INVENTED_CHARACTER_CAPTION}`
    );
    t.succeeded();
    t.calledSubagent("canon-keeper", {
      output: outputMatching(EXPECTED_OUTPUT),
    });
    t.check(
      t.reply,
      satisfies(
        (reply) => !CLEAR_VERDICT.test(String(reply ?? "")),
        "lead does not report the caption as clear"
      )
    );
    t.judge.autoevals
      .closedQA(
        "The reply says the caption cannot ship because the character is not in the locked canon."
      )
      .atLeast(0.8);
  },
});
