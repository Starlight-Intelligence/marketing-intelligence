#!/usr/bin/env node
// Deterministic floor for the voice pass: banned words and AI-writing patterns, per surface.
//   node lint-style.mjs --surface x --file draft.md [--brand .marketing/brands/<brand>.banned.json] [--max-chars 280]
// Lists come from ../style/<surface>.json plus ../style/common.json, and optionally a brand list.
// Fails closed: a missing or unreadable list is an error (exit 2), never a clean pass.
// Exit 0 clean, 1 violations, 2 error. JSON on stdout.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));

try {
  if (!args.surface || !args.file) throw new Error("--surface and --file are required");
  const text = readFileSync(args.file, "utf8");
  const lists = [loadList(join(here, "..", "style", "common.json")), loadList(join(here, "..", "style", `${args.surface}.json`))];
  if (args.brand) lists.push(loadList(args.brand));
  const violations = lint(text, lists, args["max-chars"] ? Number(args["max-chars"]) : null);
  process.stdout.write(JSON.stringify({ ok: violations.length === 0, surface: args.surface, violations }, null, 2) + "\n");
  process.exit(violations.length ? 1 : 0);
} catch (e) {
  process.stderr.write(`lint-style: ${e.message}\n`);
  process.exit(2);
}

export function lint(text, lists, maxChars) {
  const out = [];
  const lines = text.split("\n");
  const words = lists.flatMap((l) => l.banned ?? []);
  const patterns = lists.flatMap((l) => (l.patterns ?? []).map((p) => ({ ...p, re: new RegExp(p.regex, "iu") })));
  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    for (const w of words) {
      const re = new RegExp(`(^|[^a-z])${escape(w.toLowerCase())}([^a-z]|$)`);
      if (re.test(lower)) out.push({ line: i + 1, rule: "banned-word", match: w });
    }
    for (const p of patterns) if (p.re.test(line)) out.push({ line: i + 1, rule: p.name, match: line.match(p.re)[0], why: p.why });
  });
  if (maxChars && text.trim().length > maxChars) out.push({ line: null, rule: "length", match: `${text.trim().length} > ${maxChars} characters` });
  return out;
}

function loadList(path) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    throw new Error(`style list ${path} could not be read: ${e.message}`);
  }
  if (!Array.isArray(parsed.banned) && !Array.isArray(parsed.patterns)) throw new Error(`style list ${path} has neither "banned" nor "patterns"`);
  return parsed;
}

function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
  return out;
}
