/**
 * Fixtures and matchers shared by the Arcanea seat evals.
 *
 * @remarks
 * The fixtures are written for these evals and contain no canon text. The invented character is
 * deliberately absent from any canon, which is what the canon keeper has to catch.
 */

/** A launch post built from the stock phrasing the voice editor must reject. */
export const AI_SOUNDING_DRAFT = [
  "In a world where stories matter, Arcanea isn't just a game — it's a revolutionary tapestry of wonder.",
  "Unleash your imagination, elevate your craft, and delve into a seamless experience built to empower every creator.",
  "Are you ready? The journey starts now.",
  "**This changes everything.**",
].join("\n\n");

/** A caption introducing a character that no canon contains. */
export const INVENTED_CHARACTER_CAPTION =
  "Meet Korvane Esh, the long-lost twin who founded the first academy and taught every hero " +
  "their first spell. Her story drops Friday.";

/**
 * Build a matcher that tests a subagent's output against a pattern, whatever shape it arrives in.
 *
 * @param pattern - The pattern the output must match.
 * @returns A predicate for the `output` field of `calledSubagent`.
 */
export const outputMatching =
  (pattern: RegExp) =>
  (value: unknown): boolean =>
    pattern.test(
      typeof value === "string" ? value : (JSON.stringify(value) ?? "")
    );

/**
 * Build a matcher that passes when `first` appears before `second` in a subagent's output.
 *
 * @param first - Text expected earlier in the output.
 * @param second - Text expected later in the output.
 * @returns A predicate for the `output` field of `calledSubagent`.
 */
export const outputOrders =
  (first: string, second: string) =>
  (value: unknown): boolean => {
    const text =
      typeof value === "string" ? value : (JSON.stringify(value) ?? "");
    const a = text.indexOf(first);
    const b = text.indexOf(second);
    return a !== -1 && b !== -1 && a < b;
  };
