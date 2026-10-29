#!/usr/bin/env node
// Lists every sentence in a draft that makes a checkable claim, so the claims check starts from a
// complete list instead of from what a model happened to notice. It finds; it never judges.
//   node claims-extract.mjs <draft.md>        JSON array of {line, kinds, text}
// Exit 2 if the file cannot be read.

import { readFileSync } from "node:fs";

const RULES = [
  ["number", /\b\d[\d,.]*\s*(%|percent|x\b|×|k\b|m\b|million|billion|users|customers|clients|teams|companies|people|visitors|views|followers|subscribers|sign-?ups|stars|downloads|installs|clicks|members|hours|minutes|days|weeks|months)|\b\d[\d,.]*\s+(of|out of)\s+(them|our|the)\b|[$€£]\s?\d/i],
  ["superlative", /\b(best|only|first|fastest|cheapest|easiest|leading|#\s?1|number one|world'?s|most (popular|trusted|advanced)|unmatched|unbeatable)\b/i],
  ["comparison", /\b(faster|cheaper|better|easier|more \w+|less \w+)\s+than\b|\bvs\.?\b|\bcompared (to|with)\b/i],
  ["social-proof", /\b(trusted by|used by|loved by|join(ed)?\s+[\d,]+|customers?|reviews?|rated|testimonial|as seen (in|on)|featured in)\b/i],
  ["promise", /\b(guarantee[ds]?|promise[ds]?|refund|risk[- ]free|will (save|double|triple|increase|grow)|in (just )?\d+ (days|minutes|weeks))\b/i],
  ["scarcity", /\b(only \d+|limited|last chance|ends (today|tonight|soon|on)|closes|spots? left|seats? left|while (stocks|supplies) last|hurry|countdown)\b/i],
  ["date", /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.? \d{1,2}\b|\b\d{4}-\d{2}-\d{2}\b|\b(today|tomorrow|this (week|month))\b/i],
];

let text;
try {
  text = readFileSync(process.argv[2], "utf8");
} catch (e) {
  process.stderr.write(`claims-extract: cannot read ${process.argv[2] ?? "(no file given)"}: ${e.message}\n`);
  process.exit(2);
}

export function extract(source) {
  const found = [];
  source.split("\n").forEach((line, i) => {
    if (/^\s*(```|<!--|---\s*$)/.test(line)) return;
    for (const sentence of line.split(/(?<=[.!?])\s+/)) {
      const kinds = RULES.filter(([, re]) => re.test(sentence)).map(([k]) => k);
      if (kinds.length) found.push({ line: i + 1, kinds, text: sentence.trim() });
    }
  });
  return found;
}

process.stdout.write(JSON.stringify(extract(text), null, 2) + "\n");
