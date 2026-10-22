// Run: node --test team/tests/   (from the repo root). The Python readout test needs uv on PATH.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const s = (...p) => join(root, "skills", ...p);
const run = (script, args, input) => spawnSync(process.execPath, [script, ...args], { encoding: "utf8", input });
const json = (r) => JSON.parse(r.stdout);
const tmp = () => mkdtempSync(join(tmpdir(), "mt-"));

test("ab plan matches the standard two-proportion sample size", () => {
  const r = json(run(s("marketing-experiments", "scripts", "ab.mjs"), ["plan", "--baseline", "0.05", "--mde", "0.2"]));
  assert.ok(r.per_arm > 8000 && r.per_arm < 8300, `per_arm ${r.per_arm}`);
});

test("ab bayes favours the clearly better arm and is reproducible", () => {
  const args = ["bayes", "--a", "40/1000", "--b", "80/1000", "--draws", "20000"];
  const r1 = json(run(s("marketing-experiments", "scripts", "ab.mjs"), args));
  const r2 = json(run(s("marketing-experiments", "scripts", "ab.mjs"), args));
  assert.ok(r1.prob_b_beats_a > 0.99);
  assert.deepEqual(r1, r2);
});

test("ab cpa gives no range below 10 conversions and budget refuses unreadable tests", () => {
  assert.equal(json(run(s("marketing-experiments", "scripts", "ab.mjs"), ["cpa", "--spend", "500", "--conversions", "4"])).range, null);
  assert.equal(json(run(s("marketing-experiments", "scripts", "ab.mjs"), ["budget", "--max-loss", "250", "--target-cpa", "25"])).variants_readable, 1);
  assert.equal(run(s("marketing-experiments", "scripts", "ab.mjs"), ["bayes", "--a", "5/3"]).status, 2);
});

test("predictions: add, refuse duplicate, resolve, report", () => {
  const file = join(tmp(), "p.jsonl");
  const p = s("marketing-experiments", "scripts", "predictions.mjs");
  assert.equal(run(p, ["add", "--file", file, "--id", "h1", "--what", "hook A wins", "--kind", "binary", "--predicted", "true", "--by", "critic/codex"]).status, 0);
  assert.equal(run(p, ["add", "--file", file, "--id", "h1", "--what", "x", "--kind", "binary", "--predicted", "true", "--by", "x"]).status, 2);
  assert.equal(run(p, ["resolve", "--file", file, "--id", "h1", "--actual", "false"]).status, 0);
  const rep = json(run(p, ["report", "--file", file]));
  assert.equal(rep.by_source["critic/codex | binary"].hit_rate, 0);
  assert.match(rep.by_source["critic/codex | binary"].caution, /fewer than 10/);
});

test("claims-extract finds numbers, superlatives, social proof and scarcity", () => {
  const f = join(tmp(), "d.md");
  writeFileSync(f, "Cut reporting time by 40%. Trusted by 2,000 agencies.\nThe only tool you need. Only 7 spots left!\nA calm sentence.");
  const kinds = json(run(s("claims-check", "scripts", "claims-extract.mjs"), [f])).flatMap((c) => c.kinds);
  for (const k of ["number", "social-proof", "superlative", "scarcity"]) assert.ok(kinds.includes(k), k);
});

test("lint-style flags banned words and patterns, and fails closed on a missing list", () => {
  const f = join(tmp(), "post.md");
  writeFileSync(f, "Excited to announce our seamless tool — it's not just a tool, it's a movement!!");
  const l = s("marketing-team", "scripts", "lint-style.mjs");
  const r = run(l, ["--surface", "x", "--file", f]);
  assert.equal(r.status, 1);
  const rules = json(r).violations.map((v) => v.rule);
  for (const k of ["banned-word", "em-dash", "not-x-but-y", "exclamation-run"]) assert.ok(rules.includes(k), k);
  assert.equal(run(l, ["--surface", "nosuchsurface", "--file", f]).status, 2);
});

test("utm normalises tags and leaves internal links alone", () => {
  const out = json(run(s("marketing-team", "scripts", "utm.mjs"), ["--surface", "linkedin", "--campaign", "Q4 Launch!", "--site", "example.com", "https://example.com/a", "https://other.io/b"]));
  assert.equal(out[0].tagged, false);
  assert.match(out[1].url, /utm_source=linkedin&utm_medium=social&utm_campaign=q4-launch/);
});

test("validate-jsonld catches missing properties and bad JSON", () => {
  const d = tmp();
  writeFileSync(join(d, "ok.html"), '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"A","url":"https://a.io"}</script>');
  writeFileSync(join(d, "bad.html"), '<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"A"}</script><script type="application/ld+json">{oops</script>');
  const v = s("ai-search-visibility", "scripts", "validate-jsonld.mjs");
  assert.equal(run(v, [join(d, "ok.html")]).status, 0);
  const bad = run(v, [join(d, "bad.html")]);
  assert.equal(bad.status, 1);
  assert.equal(json(bad).problems.length, 2);
});

test("visibility reports intervals and refuses rates under 3 runs", () => {
  const f = join(tmp(), "v.jsonl");
  const rows = [];
  for (let i = 0; i < 6; i++) rows.push({ date: "2026-11-02", assistant: "chatgpt", mode: "search", question_id: "q1", mentioned: i < 3, cited: i < 1, competitors: ["acme"], sources: ["https://www.g2.com/x"] });
  rows.push({ date: "2026-11-02", assistant: "claude", mode: "default", question_id: "q1", mentioned: false, cited: false });
  writeFileSync(f, rows.map((r) => JSON.stringify(r)).join("\n"));
  const out = json(run(s("ai-search-visibility", "scripts", "visibility.mjs"), ["--file", f]));
  assert.equal(out.by_assistant["chatgpt|search"].mention_rate.value, 0.5);
  assert.match(out.by_assistant["claude|default"].status, /insufficient/);
  assert.equal(out.top_cited_sources[0][0], "g2.com");
});

test("judge counts a winner only when both orders agree", () => {
  const d = tmp();
  const j = s("creative-judge", "scripts", "judge.mjs");
  writeFileSync(join(d, "ab.md"), "reasons\nWINNER: FIRST\n");
  writeFileSync(join(d, "ba-agree.md"), "reasons\nWINNER: SECOND\n");
  writeFileSync(join(d, "ba-flip.md"), "reasons\nWINNER: FIRST\n");
  assert.equal(json(run(j, ["score", "--ab", join(d, "ab.md"), "--ba", join(d, "ba-agree.md")])).decision, "A");
  assert.match(json(run(j, ["score", "--ab", join(d, "ab.md"), "--ba", join(d, "ba-flip.md")])).decision, /no decision/);
});

test("gate asks before risky MCP tools and stays silent otherwise", () => {
  const g = join(root, "hooks", "gate.mjs");
  const ask = (tool) => run(g, [], JSON.stringify({ tool_name: tool })).stdout;
  assert.match(ask("mcp__slack__slack_send_message"), /"permissionDecision":"ask"/);
  assert.match(ask("mcp__postiz__integrationSchedulePostTool"), /"ask"/);
  assert.match(ask("mcp__taplio__publish_draft"), /"ask"/);
  assert.equal(ask("mcp__taplio__list_posts"), "");
  assert.equal(ask("mcp__taplio__create_draft"), "");
  assert.equal(ask("Read"), "");
  assert.equal(run(g, [], "not json").stdout, "");
});

test("causal readout recovers a planted lift and refuses a short pre-period", { skip: spawnSync("uv", ["--version"]).status !== 0 && "uv not installed" }, () => {
  const d = tmp();
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const lines = ["week,signups,organic"];
  for (let i = 0; i < 30; i++) {
    const org = 200 + i * 3 + (rnd() - 0.5) * 20;
    lines.push(`${new Date(Date.UTC(2026, 0, 5 + 7 * i)).toISOString().slice(0, 10)},${(0.5 * org + (i >= 20 ? 30 : 0) + (rnd() - 0.5) * 8).toFixed(1)},${org.toFixed(1)}`);
  }
  writeFileSync(join(d, "its.csv"), lines.join("\n"));
  const py = s("incrementality", "scripts", "causal_readout.py");
  const go = (change) => JSON.parse(execFileSync("uv", ["run", "--quiet", py, "--csv", join(d, "its.csv"), "--date-col", "week", "--outcome", "signups", "--controls", "organic", "--change", change], { encoding: "utf8" }));
  const lift = go("2026-05-25");
  assert.equal(lift.verdict, "lift");
  assert.ok(lift.effect_ci95[0] < 300 && lift.effect_ci95[1] > 300);
  assert.equal(go("2026-02-09").verdict, "inconclusive");
});
