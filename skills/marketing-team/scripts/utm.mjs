#!/usr/bin/env node
// Tags outbound links with consistent UTM parameters so one campaign arrives in analytics as one campaign.
//   node utm.mjs --surface linkedin --campaign "Q4 Launch" [--content hook-a] [--term "<keyword>"] [--site example.com] <url> [<url> ...]
// Source and medium come from a fixed surface list; free text is normalised. Links to --site are left
// untagged, because UTM on internal links overwrites the visitor's real source.
// JSON on stdout; exit 2 on bad input.

const SURFACES = {
  x: ["x", "social"], linkedin: ["linkedin", "social"], threads: ["threads", "social"], bluesky: ["bluesky", "social"],
  instagram: ["instagram", "social"], tiktok: ["tiktok", "social"], youtube: ["youtube", "social"], reddit: ["reddit", "social"],
  hackernews: ["hackernews", "social"], newsletter: ["newsletter", "email"], email: ["email", "email"],
  "chatgpt-ads": ["chatgpt", "cpc"], "google-ads": ["google", "cpc"], "meta-ads": ["meta", "paid_social"],
  "linkedin-ads": ["linkedin", "paid_social"], "tiktok-ads": ["tiktok", "paid_social"], partner: ["partner", "referral"],
};

const args = parseArgs(process.argv.slice(2));

try {
  const surface = SURFACES[args.surface];
  if (!surface) throw new Error(`--surface must be one of: ${Object.keys(SURFACES).join(", ")}`);
  if (!args.campaign) throw new Error("--campaign is required");
  if (!args._.length) throw new Error("give at least one URL");
  const out = args._.map((raw) => tag(raw, surface, args));
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
} catch (e) {
  process.stderr.write(`utm: ${e.message}\n`);
  process.exit(2);
}

export function tag(raw, [source, medium], { campaign, content, term, site }) {
  let url;
  try { url = new URL(raw); } catch { throw new Error(`not a URL: ${raw}`); }
  if (site && (url.hostname === site || url.hostname.endsWith(`.${site}`))) return { url: raw, tagged: false, reason: "internal link" };
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", norm(campaign));
  if (content) url.searchParams.set("utm_content", norm(content));
  if (term) url.searchParams.set("utm_term", norm(term));
  return { url: url.toString(), tagged: true };
}

function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}
