#!/usr/bin/env node
// Turns raw assistant runs into rates with their run counts and 95% intervals.
//   node visibility.mjs [--file .marketing/memory/ai-visibility.jsonl] [--since YYYY-MM-DD] [--until YYYY-MM-DD]
// Each input line is one run of one question on one assistant:
//   {"date":"2026-11-02","assistant":"chatgpt","mode":"search","model":"...","question_id":"q07",
//    "mentioned":true,"cited":false,"position":2,"competitors":["acme"],"sources":["https://..."]}
// A cell with fewer than 3 runs is reported as insufficient, never as a rate.

import { readFileSync } from "node:fs";

const args = parseArgs(process.argv.slice(2));
const file = args.file ?? ".marketing/memory/ai-visibility.jsonl";

try {
  const rows = readFileSync(file, "utf8").split("\n").filter(Boolean).map((l, i) => {
    try { return JSON.parse(l); } catch { throw new Error(`${file} line ${i + 1} is not valid JSON`); }
  });
  const kept = rows.filter((r) => (!args.since || r.date >= args.since) && (!args.until || r.date <= args.until));
  process.stdout.write(JSON.stringify(summarise(kept), null, 2) + "\n");
} catch (e) {
  process.stderr.write(`visibility: ${e.message}\n`);
  process.exit(2);
}

export function summarise(rows) {
  const by = (keyFn) => {
    const g = {};
    for (const r of rows) (g[keyFn(r)] ??= []).push(r);
    return g;
  };
  const cell = (rs) => {
    if (rs.length < 3) return { runs: rs.length, status: "insufficient: fewer than 3 runs" };
    const m = rs.filter((r) => r.mentioned).length;
    const c = rs.filter((r) => r.cited).length;
    return { runs: rs.length, mention_rate: rate(m, rs.length), citation_rate: rate(c, rs.length) };
  };
  const assistants = Object.fromEntries(Object.entries(by((r) => `${r.assistant}|${r.mode ?? "default"}`)).map(([k, rs]) => [k, cell(rs)]));
  const questions = Object.fromEntries(Object.entries(by((r) => `${r.question_id}|${r.assistant}`)).map(([k, rs]) => [k, cell(rs)]));
  const competitorCounts = {};
  for (const r of rows) for (const comp of r.competitors ?? []) competitorCounts[comp] = (competitorCounts[comp] ?? 0) + 1;
  const sourceCounts = {};
  for (const r of rows) for (const s of r.sources ?? []) { const host = safeHost(s); if (host) sourceCounts[host] = (sourceCounts[host] ?? 0) + 1; }
  return {
    runs: rows.length,
    window: rows.length ? [rows.reduce((a, r) => (r.date < a ? r.date : a), rows[0].date), rows.reduce((a, r) => (r.date > a ? r.date : a), rows[0].date)] : null,
    models_seen: [...new Set(rows.map((r) => r.model).filter(Boolean))],
    by_assistant: assistants,
    by_question: questions,
    competitor_appearances: competitorCounts,
    top_cited_sources: Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 15),
    gaps: Object.entries(questions).filter(([, v]) => v.mention_rate && v.mention_rate.value === 0).map(([k]) => k),
  };
}

// Wilson score interval: honest at small n, unlike a bare percentage.
function rate(k, n) {
  const z = 1.96, p = k / n;
  const denom = 1 + z * z / n;
  const centre = (p + z * z / (2 * n)) / denom;
  const half = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / denom;
  return { value: round(p), ci95: [round(Math.max(0, centre - half)), round(Math.min(1, centre + half))], k, n };
}

function safeHost(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return null; } }
function round(x) { return Math.round(x * 1000) / 1000; }

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
  return out;
}
