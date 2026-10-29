// Run: node --test team/tests/tools.test.mjs   (from the repo root). The Python readout test needs uv on PATH.
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
  writeFileSync(f, "Cut reporting time by 40%. Trusted by 2,000 agencies.\nThe only tool you need. Only 7 spots left!\nOur library had 546 visitors. 343 of them came from search.\nA calm sentence.");
  const found = json(run(s("claims-check", "scripts", "claims-extract.mjs"), [f]));
  const kinds = found.flatMap((c) => c.kinds);
  for (const k of ["number", "social-proof", "superlative", "scarcity"]) assert.ok(kinds.includes(k), k);
  // Found while dogfooding on a LinkedIn draft: plain counts of people were missed.
  assert.ok(found.some((c) => c.text.includes("546 visitors") && c.kinds.includes("number")));
  assert.ok(found.some((c) => c.text.includes("343 of them") && c.kinds.includes("number")));
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

const gate = join(root, "hooks", "gate.mjs");
const gateOut = (payload) => run(gate, [], typeof payload === "string" ? payload : JSON.stringify(payload)).stdout;
const mcp = (tool) => gateOut({ tool_name: tool });
const sh = (command) => gateOut({ tool_name: "Bash", tool_input: { command } });

test("gate fails closed on MCP tools: only read-verb names without write verbs pass", () => {
  // Codex P0: an executable tool whose name had no listed verb got no decision.
  assert.match(mcp("mcp__n8n__execute_workflow"), /"permissionDecision":"ask"/);
  assert.match(mcp("mcp__make__scenarios_run"), /"ask"/);
  assert.match(mcp("mcp__slack__slack_send_message"), /"ask"/);
  assert.match(mcp("mcp__postiz__integrationSchedulePostTool"), /"ask"/);
  assert.match(mcp("mcp__taplio__publish_draft"), /"ask"/);
  assert.match(mcp("mcp__taplio__create_draft"), /"ask"/);
  assert.match(mcp("mcp__x__somethingNew"), /"ask"/);
  // Read-only names pass to the normal permission flow.
  assert.equal(mcp("mcp__taplio__list_posts"), "");
  assert.equal(mcp("mcp__github__get_file_contents"), "");
  assert.equal(mcp("mcp__Slack__slack_read_channel"), "");
  assert.equal(mcp("mcp__Notion__notion-search"), "");
  // Mixed names ask even when a read verb comes first.
  assert.match(mcp("mcp__x__get_and_send_report"), /"ask"/);
  assert.match(mcp("mcp__n8n__list_and_execute_workflows"), /"ask"/);
  assert.match(mcp("mcp__supabase__query_then_delete"), /"ask"/);
  // Non-MCP, non-Bash tools and bad input stay silent.
  assert.equal(gateOut({ tool_name: "Read" }), "");
  assert.equal(gateOut("not json"), "");
});

test("gate asks before shell commands that reach the network, publish, push or merge", () => {
  // Codex P0: seats with Bash could bypass the MCP-only gate.
  for (const c of [
    "curl -s -X POST https://api.example.com/post",
    "wget https://example.com",
    "echo hi && ssh host",
    "git status; git push origin main",
    "gh pr merge 4 --squash",
    "gh release create v1",
    "gh api -X POST repos/a/b/issues",
    "gh api repos/a/b/issues -f title=x",
    "npm publish",
    "stripe charges create --amount 100",
    "twurl -d 'status=hi' /1.1/statuses/update.json",
    "vercel --prod",
    "aws s3 cp a s3://b",
    "gcloud run deploy",
    "echo $(/usr/bin/curl example.com)",
  ]) assert.match(sh(c), /"permissionDecision":"ask"/, c);
  for (const c of [
    "node skills/marketing-team/scripts/utm.mjs --surface x --site example.com https://example.com/a",
    "uv run skills/incrementality/scripts/causal_readout.py --csv a.csv",
    "git status && git diff",
    "gh pr view 4",
    "gh api repos/a/b/pulls",
    "ls -la",
  ]) assert.equal(sh(c), "", c);
});

test("ab bayes rejects draw counts outside 1000..1000000 or not whole", () => {
  // Codex P1: --draws 0 exited 0 with null stats.
  const ab = s("marketing-experiments", "scripts", "ab.mjs");
  for (const d of ["0", "-5", "1.5", "2000000", "abc"]) {
    const r = run(ab, ["bayes", "--a", "40/1000", "--b", "80/1000", "--draws", d]);
    assert.equal(r.status, 2, `draws ${d}`);
    assert.match(r.stderr, /--draws must be a whole number from 1000 to 1000000/);
    assert.equal(r.stdout, "");
  }
  assert.equal(run(ab, ["bayes", "--a", "40/1000", "--b", "80/1000", "--draws"]).status, 2);
  assert.equal(run(ab, ["bayes", "--a", "40/1000", "--b", "80/1000", "--draws", "1000"]).status, 0);
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

test("causal readout rejects draw counts outside 1000..100000 or not whole", { skip: spawnSync("uv", ["--version"]).status !== 0 && "uv not installed" }, () => {
  const d = tmp();
  writeFileSync(join(d, "x.csv"), "week,y,c\n2026-01-05,1,1\n2026-01-12,2,2\n");
  const py = s("incrementality", "scripts", "causal_readout.py");
  for (const draws of ["0", "-5", "1.5", "200000"]) {
    const r = spawnSync("uv", ["run", "--quiet", py, "--csv", join(d, "x.csv"), "--date-col", "week", "--outcome", "y", "--controls", "c", "--change", "2026-01-12", "--draws", draws], { encoding: "utf8" });
    assert.equal(r.status, 2, `draws ${draws}`);
    assert.equal(r.stdout, "");
  }
});

test("lint-style surface patterns load as real regexes and match what they describe", () => {
  // Codex review: "\b" in JSON decodes to a backspace, and "\w", "\s", "\S" had lost their backslash.
  const l = s("marketing-team", "scripts", "lint-style.mjs");
  const rulesFor = (surface, text) => {
    const f = join(tmp(), "d.md");
    writeFileSync(f, text);
    const r = run(l, ["--surface", surface, "--file", f]);
    return r.status === 2 ? null : json(r).violations.map((v) => v.rule);
  };
  assert.ok(rulesFor("ad", "The fastest option for your team.").includes("unsourced-superlative"));
  assert.ok(!rulesFor("ad", "A calm option for your team.").includes("unsourced-superlative"));
  assert.ok(rulesFor("email", "Read this URGENT note before Friday.").includes("all-caps-word"));
  assert.ok(!rulesFor("email", "Read this before Friday, when the report is due.").includes("all-caps-word"));
  assert.ok(rulesFor("x", "New guide out #seo #marketing #growth").includes("hashtag-stack"));
  assert.ok(!rulesFor("x", "New guide out #seo #marketing").includes("hashtag-stack"));
  assert.ok(rulesFor("linkedin", "Here is what we learned from the launch\nRead it twice.\n#a #b #c #d").includes("hashtag-stack"));
  assert.ok(rulesFor("linkedin", "Then it broke.").includes("broetry"));
  assert.ok(!rulesFor("linkedin", "We shipped the reporting change after three weeks of testing with customers.").includes("broetry"));
  for (const f of ["ad", "email", "x", "linkedin", "reddit", "blog", "common"]) {
    const list = JSON.parse(readFileSync(s("marketing-team", "style", `${f}.json`), "utf8"));
    for (const p of list.patterns ?? []) assert.ok(!/[\x00-\x1f]/.test(p.regex), `${f}/${p.name} has a control character`);
  }
});

test("visibility keeps assistant modes apart per question", () => {
  const f = join(tmp(), "v.jsonl");
  const rows = [];
  for (let i = 0; i < 3; i++) rows.push({ date: "2026-11-02", assistant: "chatgpt", mode: "search", question_id: "q1", mentioned: true, cited: false });
  for (let i = 0; i < 3; i++) rows.push({ date: "2026-11-02", assistant: "chatgpt", mode: "default", question_id: "q1", mentioned: false, cited: false });
  writeFileSync(f, rows.map((r) => JSON.stringify(r)).join("\n"));
  const out = json(run(s("ai-search-visibility", "scripts", "visibility.mjs"), ["--file", f]));
  assert.equal(out.by_question["q1|chatgpt|search"].mention_rate.value, 1);
  assert.equal(out.by_question["q1|chatgpt|default"].mention_rate.value, 0);
  assert.deepEqual(out.gaps, ["q1|chatgpt|default"]);
});

test("validate-jsonld requires @context on every top-level array entry", () => {
  const d = tmp();
  const v = s("ai-search-visibility", "scripts", "validate-jsonld.mjs");
  writeFileSync(join(d, "arr.json"), JSON.stringify([{ "@context": "https://schema.org", "@type": "Person", name: "A" }, { "@type": "Person", name: "B" }]));
  const r = run(v, [join(d, "arr.json")]);
  assert.equal(r.status, 1);
  assert.deepEqual(json(r).problems.map((p) => p.problem), ["missing @context"]);
  writeFileSync(join(d, "ok.json"), JSON.stringify([{ "@context": "https://schema.org", "@type": "Person", name: "A" }]));
  assert.equal(run(v, [join(d, "ok.json")]).status, 0);
});

test("ab plan rejects impossible inputs instead of printing a sample size", () => {
  const ab = s("marketing-experiments", "scripts", "ab.mjs");
  for (const extra of [["--mde", "0"], ["--mde", "-0.1"], ["--mde", "0.2", "--alpha", "0"], ["--mde", "0.2", "--alpha", "1"], ["--mde", "0.2", "--power", "1"], ["--mde", "0.2", "--power", "0"], ["--mde", "1e-300"]]) {
    const r = run(ab, ["plan", "--baseline", "0.05", ...extra]);
    assert.equal(r.status, 2, extra.join(" "));
    assert.equal(r.stdout, "");
  }
  assert.equal(run(ab, ["plan", "--baseline", "1", "--mde", "0.2"]).status, 2);
});

test("predictions refuse valueless, boolean-looking or empty values for numbers", () => {
  const file = join(tmp(), "p.jsonl");
  const p = s("marketing-experiments", "scripts", "predictions.mjs");
  assert.equal(run(p, ["add", "--file", file, "--id", "n1", "--what", "signups", "--kind", "number", "--predicted", "120", "--by", "analyst"]).status, 0);
  const before = readFileSync(file, "utf8");
  for (const bad of [["--actual"], ["--actual", ""], ["--actual", " "], ["--actual", "true"]]) {
    assert.equal(run(p, ["resolve", "--file", file, "--id", "n1", ...bad]).status, 2, JSON.stringify(bad));
    assert.equal(readFileSync(file, "utf8"), before);
  }
  assert.equal(run(p, ["add", "--file", file, "--id", "n2", "--what", "x", "--kind", "number", "--predicted", "", "--by", "analyst"]).status, 2);
  assert.equal(run(p, ["resolve", "--file", file, "--id", "n1", "--actual", "0"]).status, 0);
});

test("ab budget refuses a zero target CPA or minimum per variant", () => {
  const ab = s("marketing-experiments", "scripts", "ab.mjs");
  for (const extra of [["--target-cpa", "0"], ["--target-cpa", "-5"], ["--target-cpa", "25", "--min-per-variant", "0"], ["--target-cpa", "25", "--min-per-variant", "2.5"], ["--target-cpa", "1e-320"]]) {
    const r = run(ab, ["budget", "--max-loss", "250", ...extra]);
    assert.equal(r.status, 2, extra.join(" "));
    assert.equal(r.stdout, "");
  }
  assert.equal(json(run(ab, ["budget", "--max-loss", "2000", "--target-cpa", "50"])).variants_readable, 4);
});

test("validate-jsonld reports blocks with no typed entity", () => {
  const d = tmp();
  const v = s("ai-search-visibility", "scripts", "validate-jsonld.mjs");
  writeFileSync(join(d, "ctx.json"), JSON.stringify({ "@context": "https://schema.org" }));
  writeFileSync(join(d, "empty.json"), "[]");
  for (const f of ["ctx.json", "empty.json"]) {
    const r = run(v, [join(d, f)]);
    assert.equal(r.status, 1, f);
    assert.ok(json(r).problems.some((p) => /no typed entity/.test(p.problem)), f);
  }
  writeFileSync(join(d, "graph.json"), JSON.stringify({ "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "A", url: "https://a.io" }] }));
  assert.equal(run(v, [join(d, "graph.json")]).status, 0);
});

test("causal readout is inconclusive when controls are collinear", { skip: spawnSync("uv", ["--version"]).status !== 0 && "uv not installed" }, () => {
  const d = tmp();
  const lines = ["week,y,control_a,control_b"];
  for (let i = 1; i <= 8; i++) lines.push(`${new Date(Date.UTC(2026, 0, 7 * i)).toISOString().slice(0, 10)},${i},${i},${i}`);
  lines.push(`${new Date(Date.UTC(2026, 0, 63)).toISOString().slice(0, 10)},9,9,10`);
  writeFileSync(join(d, "c.csv"), lines.join("\n"));
  const py = s("incrementality", "scripts", "causal_readout.py");
  const out = JSON.parse(execFileSync("uv", ["run", "--quiet", py, "--csv", join(d, "c.csv"), "--date-col", "week", "--outcome", "y", "--controls", "control_a,control_b", "--change", new Date(Date.UTC(2026, 0, 63)).toISOString().slice(0, 10)], { encoding: "utf8" }));
  assert.equal(out.verdict, "inconclusive");
  assert.match(out.reason, /collinear|rank/);
});
