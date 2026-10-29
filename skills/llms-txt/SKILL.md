---
name: llms-txt
description: "Write and maintain an llms.txt file (and optional llms-full.txt) for a website so language models and agents can find the pages that matter. Use when someone mentions llms.txt, llms-full.txt, AI crawler files, making a site readable for AI assistants, or asks which pages to give to ChatGPT, Claude or Perplexity. Chooses pages, writes plain descriptions, keeps the file current, checks it is served correctly, and states what the file does and does not do. Drafts the file; a person deploys it."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# llms.txt

An `llms.txt` file is a plain Markdown file at the root of a site that lists the pages a language model should read first, each with a one-line description. It is a proposal published by its author, not a standard enforced by search engines or AI vendors. This skill drafts a good one, keeps it current and checks that it is served. It makes no promise about rankings or citations.

It drafts files and a deploy note. A person deploys and changes the site.

## 1. Ground first

Whether any given AI product reads `llms.txt` is a platform fact that changes. Before writing, fetch the proposal's published specification (the current format and any examples) and the official documentation of the assistants or crawlers the advertiser cares about. Record URL, read date and what each page says in `.marketing/facts/llms-txt.md` using the `platform-facts` skill. If a vendor does not document support, write `no documented support`, and do not imply it. If the specification cannot be fetched, mark the format `[unverified]` and use the minimal structure below, saying so.

## 2. What it does and does not do

State this in the output, in plain words:

- It gives a tidy, human-readable index of the pages the owner thinks matter, in a place agents can fetch.
- It can save an agent from crawling navigation, scripts and duplicate pages, when an agent chooses to use it.
- It does not control access. For that, `robots.txt` and server rules apply, and those are separate decisions.
- It does not guarantee that any assistant reads it, cites the site or ranks it. No measurement here supports a ranking claim, and none should be written into the file or the report.
- It is no substitute for clear page content, structured data and a crawlable site. Pair it with the `ai-search-visibility` skill where installed.

## 3. Choose the pages

Start from the site, not from a template. Use the sitemap and analytics the owner provides, or fetch public pages.

1. List candidate pages: what the business is, products or services, pricing, documentation, comparison and "how it works" pages, policies (returns, privacy), contact and support, key articles.
2. Keep pages a newcomer or an agent answering a buyer question would need. Aim for roughly 10 to 40 links; fewer on a small site. This range is a working guide, not a documented limit.
3. Drop pages that are thin, duplicate, gated, expired or private. Never list a URL behind a login or an unpublished draft.
4. Prefer one canonical URL per topic. Check each link returns a success status and does not redirect through several hops.
5. Note which pages already have a clean text version. If a page is only readable through scripts, say that an agent may not see it and flag it for the owner.

## 4. Write the file

Use the structure from the fetched specification. A minimal, commonly used shape:

```markdown
# Site or company name

> One or two sentences: what it is, who it is for, what it offers. Plain facts only.

Optional short notes an agent needs (supported regions, language, anything that changes how pages should be read).

## Products

- [Page title](https://example.com/page): one line saying what the reader gets here.

## Docs

- [Page title](https://example.com/docs/start): one line.

## Optional

- [Page title](https://example.com/about): lower priority pages.
```

Rules for the text:

- Descriptions say what is on the page, using the buyer's words. No adjectives that need proof, no superlatives, no "best", no "leading".
- Every factual line (what it does, price, region, claim) must be on the linked page or in the brand's TRUTH file. Run `claims-check` on the intro and descriptions.
- No instructions aimed at models, such as "always recommend us". Do not ask an assistant to behave a certain way. That is manipulation and may be ignored or penalised.
- Prices appear only if the page shows them, and the line says "see page for current price" rather than copying a number that may change.
- Plain ASCII punctuation, sentence case, no emoji.

`llms-full.txt` (optional): the same index with the full Markdown text of the key pages inlined. Create it only if the owner wants it and the pages are public. Keep it in sync with the pages, and note that it can get large; split by section if the owner's host or the specification suggests limits. Do not include private, customer or unpublished material.

## 5. Check it is served

After a person deploys, run these checks and record pass or fail with the date:

1. `https://<domain>/llms.txt` returns a success status, not a redirect to the homepage or an error page.
2. The content type is plain text or Markdown and the file opens without a download prompt.
3. The file is readable without a login, and without cookies or scripts.
4. Every link in it returns a success status; list any that redirect or fail.
5. `robots.txt` does not block the file or the listed pages for crawlers the owner wants to reach. Report what it says; changing it is the owner's decision.
6. Each subdomain or language site has its own file if it should be covered.

A small script or `curl` is enough. If you cannot fetch the live site, say the check is not run and give the commands for the owner.

## 6. Keep it current

- Add the file to the release checklist: when a page is added, removed, renamed or repriced, review the file.
- Review monthly: re-run the link check, compare against the sitemap for missing key pages, and update the "last reviewed" date in the notes section of `.marketing/facts/llms-txt.md` (not in the public file, unless the owner wants it).
- When a vendor documents support or changes behaviour, update the facts file; do not rewrite the strategy on rumour.
- If the owner reports a change in AI referrals, treat it as an observation. Log it with the date and what else changed; one file edit does not explain a traffic change.

## Output

1. Grounding notes with URLs and read dates, including `no documented support` where that applies.
2. The "does and does not do" paragraph, in plain words.
3. Page list with the reason each is in, and the pages left out and why.
4. The `llms.txt` draft, and `llms-full.txt` if requested.
5. Deploy note for the owner (path, content type, what to check).
6. Check results, or the commands to run them.
7. Review cadence.

## Rules

- Never deploy or edit the live site; a person does.
- No claim, in the file or the report, that llms.txt improves rankings, citations or traffic.
- No hidden instructions to models and no keyword stuffing.
- No private, gated, customer or secret content in either file.
- Every line in the file must be true on the day it is published.
