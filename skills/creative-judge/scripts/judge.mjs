#!/usr/bin/env node
// Pairwise judging that survives position bias: the same pair is judged in both orders, and a
// winner counts only when both orders agree.
//   prepare --a a.md --b b.md --rubric rubric.md --out <dir>   writes packet-ab.md and packet-ba.md
//   score   --ab <verdict-ab.md> --ba <verdict-ba.md> [--id <id>] [--judge "<cli/model>"] [--log .marketing/memory/judgments.jsonl]
// A verdict file must contain one line "WINNER: FIRST", "WINNER: SECOND" or "WINNER: TIE".

import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const mode = args._[0];

try {
  if (mode === "prepare") prepare();
  else if (mode === "score") score();
  else throw new Error(`unknown mode "${mode}". Use prepare or score.`);
} catch (e) {
  process.stderr.write(`judge: ${e.message}\n`);
  process.exit(2);
}

function prepare() {
  for (const k of ["a", "b", "rubric", "out"]) if (!args[k]) throw new Error(`--${k} is required`);
  const [a, b, rubric] = [args.a, args.b, args.rubric].map((p) => readFileSync(p, "utf8"));
  mkdirSync(args.out, { recursive: true });
  writeFileSync(join(args.out, "packet-ab.md"), packet(rubric, a, b));
  writeFileSync(join(args.out, "packet-ba.md"), packet(rubric, b, a));
  out({ written: [join(args.out, "packet-ab.md"), join(args.out, "packet-ba.md")], next: "Run each packet through a judge from a different provider than the maker, in separate sessions." });
}

function packet(rubric, first, second) {
  return `You are judging two marketing drafts for the buyer and goal in the rubric. Judge only against the rubric.

## Rubric
${rubric.trim()}

## FIRST
${first.trim()}

## SECOND
${second.trim()}

Give your reasons in at most five bullets, then end with exactly one line:
WINNER: FIRST, WINNER: SECOND, or WINNER: TIE
`;
}

function score() {
  for (const k of ["ab", "ba"]) if (!args[k]) throw new Error(`--${k} is required`);
  const ab = verdict(readFileSync(args.ab, "utf8"), args.ab);
  const ba = verdict(readFileSync(args.ba, "utf8"), args.ba);
  // In the BA packet, FIRST is draft B.
  const abWinner = { FIRST: "A", SECOND: "B", TIE: "TIE" }[ab];
  const baWinner = { FIRST: "B", SECOND: "A", TIE: "TIE" }[ba];
  const agreed = abWinner === baWinner;
  const result = { id: args.id ?? null, date: new Date().toISOString().slice(0, 10), judge: args.judge ?? null, order_ab: abWinner, order_ba: baWinner, decision: agreed ? abWinner : "no decision (orders disagree)" };
  if (args.log) appendFileSync(args.log, JSON.stringify(result) + "\n");
  out(result);
}

function verdict(text, path) {
  const m = [...text.matchAll(/^\s*WINNER:\s*(FIRST|SECOND|TIE)\s*$/gim)];
  if (m.length !== 1) throw new Error(`${path} must contain exactly one WINNER line, found ${m.length}`);
  return m[0][1].toUpperCase();
}

function out(o) { process.stdout.write(JSON.stringify(o, null, 2) + "\n"); }

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}
