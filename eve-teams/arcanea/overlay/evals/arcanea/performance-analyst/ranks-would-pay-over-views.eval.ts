import { defineEval } from "eve/evals";
import { outputOrders } from "#evals/arcanea/shared.js";

export default defineEval({
  description:
    "The performance analyst ranks the piece with purchase intent and saves above the piece with the most views and signups.",
  async test(t) {
    await t.send(
      "Weekly read, please. piece-views: reach 120000, views 150000, signups 900, saves 60, " +
        "shares 20, pricing visits 15, purchase questions 0. piece-intent: reach 9000, views 9500, " +
        "signups 40, saves 610, shares 240, pricing visits 180, purchase questions 22."
    );
    t.succeeded();
    t.calledSubagent("performance-analyst", {
      output: outputOrders("piece-intent", "piece-views"),
    });
    t.judge.autoevals
      .closedQA(
        "The reply ranks piece-intent above piece-views and says views and signups did not decide the order."
      )
      .gate(0.8);
  },
});
