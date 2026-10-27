#!/usr/bin/env node
// Checks JSON-LD blocks in an HTML or JSON file: valid JSON, a @context and @type, and a minimum set
// of properties per common type. The property lists are a floor we chose, not Google's full rules;
// confirm rich-result eligibility with Google's Rich Results Test before claiming it.
//   node validate-jsonld.mjs <page.html | data.json>
// Exit 0 clean, 1 problems, 2 unreadable. JSON on stdout.

import { readFileSync } from "node:fs";

const MIN = {
  Organization: ["name", "url"],
  WebSite: ["name", "url"],
  Product: ["name", "offers"],
  SoftwareApplication: ["name", "offers", "applicationCategory"],
  Offer: ["price", "priceCurrency"],
  Article: ["headline", "datePublished", "author"],
  BlogPosting: ["headline", "datePublished", "author"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
  Event: ["name", "startDate", "location"],
  BreadcrumbList: ["itemListElement"],
  Person: ["name"],
};

let raw;
try {
  raw = readFileSync(process.argv[2], "utf8");
} catch (e) {
  process.stderr.write(`validate-jsonld: cannot read ${process.argv[2] ?? "(no file given)"}: ${e.message}\n`);
  process.exit(2);
}

export function check(source) {
  const blocks = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi.test(source)
    ? [...source.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
    : [source];
  const problems = [];
  const types = [];
  blocks.forEach((b, i) => {
    let data;
    try { data = JSON.parse(b); } catch (e) { problems.push({ block: i + 1, problem: `invalid JSON: ${e.message}` }); return; }
    const nodes = (Array.isArray(data) ? data : data["@graph"] ?? [data]);
    if (Array.isArray(data)) data.forEach((d, j) => { if (!d?.["@context"]) problems.push({ block: i + 1, entry: j + 1, problem: "missing @context" }); });
    else if (!data["@context"]) problems.push({ block: i + 1, problem: "missing @context" });
    const before = types.length;
    for (const node of nodes) walk(node, i + 1, problems, types);
    if (types.length === before) problems.push({ block: i + 1, problem: "no typed entity (no @type found)" });
  });
  if (!blocks.length) problems.push({ block: null, problem: "no JSON-LD found" });
  return { ok: problems.length === 0, types, problems };
}

function walk(node, block, problems, types) {
  if (!node || typeof node !== "object") return;
  const t = [].concat(node["@type"] ?? []);
  if (!t.length && Object.keys(node).some((k) => !k.startsWith("@"))) problems.push({ block, problem: "object without @type" });
  for (const type of t) {
    types.push(type);
    for (const prop of MIN[type] ?? []) if (node[prop] === undefined || node[prop] === "") problems.push({ block, type, problem: `missing ${prop}` });
  }
  for (const [k, v] of Object.entries(node)) if (!k.startsWith("@") && typeof v === "object") [].concat(v).forEach((c) => c && typeof c === "object" && c["@type"] && walk(c, block, problems, types));
}

const result = check(raw);
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
process.exit(result.ok ? 0 : 1);
