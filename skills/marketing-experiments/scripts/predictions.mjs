#!/usr/bin/env node
// Predicted-versus-actual ledger, so every score the team gives can be checked later.
//   add     --id <id> --what "<claim>" --kind binary|number|probability --predicted <v> --by <seat/provider> [--due YYYY-MM-DD]
//   resolve --id <id> --actual <v> [--source "<where the actual came from>"]
//   report  [--by <seat/provider>]
// Ledger: .marketing/memory/predictions.jsonl (override with --file). JSON on stdout; exit 2 on bad input.

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const args = parseArgs(process.argv.slice(2));
const file = args.file ?? ".marketing/memory/predictions.jsonl";
const mode = args._[0];

try {
  if (mode === "add") add();
  else if (mode === "resolve") resolve();
  else if (mode === "report") print(report(load(), args.by));
  else throw new Error(`unknown mode "${mode}". Use add, resolve or report.`);
} catch (e) {
  process.stderr.write(`predictions: ${e.message}\n`);
  process.exit(2);
}

function add() {
  for (const k of ["id", "what", "kind", "predicted", "by"]) if (args[k] === undefined || args[k] === true) throw new Error(`--${k} is required`);
  if (!["binary", "number", "probability"].includes(args.kind)) throw new Error("--kind must be binary, number or probability");
  const rows = load();
  if (rows.some((r) => r.id === args.id)) throw new Error(`id ${args.id} already exists; predictions are never edited, add a new id`);
  const row = { id: args.id, what: args.what, kind: args.kind, predicted: value(args.kind, args.predicted), by: args.by, made: today(), due: args.due ?? null, actual: null, resolved: null, source: null };
  appendFileSync(file, JSON.stringify(row) + "\n");
  print(row);
}

function resolve() {
  const rows = load();
  const row = rows.find((r) => r.id === args.id);
  if (!row) throw new Error(`no prediction with id ${args.id}`);
  if (row.actual !== null) throw new Error(`${args.id} is already resolved`);
  row.actual = value(row.kind === "probability" ? "binary" : row.kind, args.actual);
  row.resolved = today();
  row.source = args.source ?? null;
  writeFileSync(file, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  print(row);
}

export function report(rows, by) {
  const done = rows.filter((r) => r.actual !== null && (!by || r.by === by));
  const groups = {};
  for (const r of done) (groups[`${r.by} | ${r.kind}`] ??= []).push(r);
  const out = {};
  for (const [key, rs] of Object.entries(groups)) {
    const kind = rs[0].kind;
    const n = rs.length;
    if (kind === "binary") out[key] = { n, hit_rate: round(rs.filter((r) => r.predicted === r.actual).length / n) };
    if (kind === "number") out[key] = { n, mean_abs_error: round(rs.reduce((s, r) => s + Math.abs(r.predicted - r.actual), 0) / n), mean_abs_pct_error: pctError(rs) };
    if (kind === "probability") out[key] = { n, brier: round(rs.reduce((s, r) => s + (r.predicted - (r.actual ? 1 : 0)) ** 2, 0) / n), note: "0 is perfect; 0.25 is what always saying 50% scores" };
    if (n < 10) out[key].caution = "fewer than 10 resolved predictions; treat as anecdote";
  }
  return { resolved: done.length, open: rows.filter((r) => r.actual === null).length, by_source: out };
}

function pctError(rs) {
  const usable = rs.filter((r) => r.actual !== 0);
  return usable.length ? round(usable.reduce((s, r) => s + Math.abs((r.predicted - r.actual) / r.actual), 0) / usable.length) : null;
}

function value(kind, v) {
  if (kind === "binary") {
    if (!["true", "false", true, false].includes(v)) throw new Error("binary values are true or false");
    return v === true || v === "true";
  }
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error("value must be a number");
  if (kind === "probability" && (n < 0 || n > 1)) throw new Error("probability must be between 0 and 1");
  return n;
}

function load() {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8").split("\n").filter(Boolean).map((l, i) => {
    try { return JSON.parse(l); } catch { throw new Error(`${file} line ${i + 1} is not valid JSON`); }
  });
}

function today() { return new Date().toISOString().slice(0, 10); }
function round(x) { return Math.round(x * 1000) / 1000; }
function print(o) { process.stdout.write(JSON.stringify(o, null, 2) + "\n"); }

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}
