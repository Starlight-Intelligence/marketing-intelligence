---
name: creative-judge
description: "Compare two marketing drafts (headlines, hooks, ads, emails, landing pages) with an AI judge that is hard to fool: pairwise judging in both orders, a judge from a different model provider than the writer, a winner only when both orders agree, and every verdict logged so it can be checked against real results later. Also sets the limits on synthetic personas. Use for which version is better, pre-test ad copy, pick the best hook, A vs B copy review."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Creative judge

AI judges are cheap pre-screens with known biases: they tend to favour whichever option they read first or second depending on the model, and they favour text that resembles their own. This skill makes the judgement robust to the first and avoids the second, then keeps score.

## Method

1. **Rubric first.** Write `rubric.md`: the buyer (from `.agents/product-marketing.md`), the goal of the piece, and three to five criteria in priority order. Generic rubrics ("engaging, clear") produce generic verdicts.
2. **Prepare both orders:**
   ```
   node scripts/judge.mjs prepare --a hook-a.md --b hook-b.md --rubric rubric.md --out .marketing/work/<YYYY-WW>/judge-hooks
   ```
3. **Judge on a different provider than the writer**, each packet in a separate session, for example with the Codex or Gemini CLI, read-only, output to a file. Never let the writing model judge its own work.
4. **Score:**
   ```
   node scripts/judge.mjs score --ab verdict-ab.md --ba verdict-ba.md --id hooks-w45 --judge "codex/<model>" --log .marketing/memory/judgments.jsonl
   ```
   A winner counts only if both orders pick it. Disagreement is "no decision", which is useful information: the drafts are close, so test both or pick on other grounds.
5. **Log the prediction.** Record the judge's pick with `marketing-experiments` (`predictions.mjs add`) and resolve it when real results arrive. After enough cases you will know whether this judge predicts your audience.

## Synthetic personas

Simulated customers can help brainstorm objections. They are not research: Pew Research Center (September 2026) found the best models missed real survey results by roughly 11 to 15 points on average. Label any persona output "idea screening only" and never report it as customer feedback.

## Rules

- A judge verdict is a filter, not a launch decision. Real results decide.
- Judge only the drafts as written: no hidden context the audience will not see.
- Keep the rubric and verdict files with the work so anyone can re-run them.
