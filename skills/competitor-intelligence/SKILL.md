---
name: competitor-intelligence
description: "Build and maintain a dated, sourced profile of the alternatives a buyer considers: who they are, what they publish about price, positioning, proof and weak spots, with observed facts kept apart from interpretation and a change log. Use when someone says competitor analysis, competitor research, who are we up against, alternatives, battlecard, pricing comparison, positioning gap, or what changed at a competitor. Uses public sources only; no scraping behind logins, no fake accounts, no private information."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Competitor intelligence

A competitor profile is only useful if the reader can tell what was seen from what was guessed, and how old each line is. This skill builds profiles from public sources, marks every line as observed or interpreted, dates it, and keeps a change log so the team sees what moved.

It reads public material and drafts documents. It does not contact anyone, sign up under false pretences, or send anything.

## 1. Define the set from the buyer, not the market map

1. Ask the buyer-facing questions first: what do customers use today, who do they say they compared us with, who shows up in sales calls, support threads, reviews and "X vs Y" searches. Record the source for each name.
2. Sort into three groups: **direct** (same job, same buyer), **indirect** (different product, same job), and **do nothing / spreadsheet** (the status quo). The status quo is always a row.
3. Keep the set small, usually 3 to 6 profiles. Add one only when a buyer source names it.

## 2. Allowed sources, and lines not to cross

Allowed: the competitor's public website, pricing page, docs, changelog, blog, public job listings, public help centre, app store listings, public review sites, public social posts, press releases, filings that are public, and archived copies of public pages. For prices and policies on third-party platforms, apply the same fetch-and-record habit as in the `platform-facts` skill.

Not allowed, and a hard stop:

- Anything behind a login that you are not entitled to, or any page whose terms forbid automated access when the request would breach them.
- Creating accounts or trials under a false name, or posing as a customer, to get information. If the owner wants to try a product, they use their own account in their own name and record the terms they accepted.
- Private documents, leaked material, or anything a person shared that was not meant for outsiders.
- Contacting a competitor's staff or customers to extract information.
- Collecting personal data about individuals. Company-level facts only.

Respect robots rules and terms of service. If a source is blocked, record "not available" and move on.

## 3. The profile

One file per competitor: `.marketing/intel/<competitor>.md`.

```markdown
# <Competitor>
Profile date: YYYY-MM-DD   Next review: YYYY-MM-DD   Group: direct | indirect | status quo

## Observed (each line: fact, URL, date read)
- Positioning headline as published: "<quote of 15 words at most>" | URL | date
- Who they say it is for: ...
- Pricing as published: <plans, units, what is shown, what is "contact us"> | URL | date
- Free tier or trial as published: ...
- Proof shown: <named customers, counts, awards, reviews, with where shown> | URL | date
- Claims they make that we can check: ...
- Channels they are active in: ...
- Recent changes seen (see change log)

## Interpreted (each line: inference, the observed lines it rests on, confidence)
- Likely target segment: ...
- Where they seem strong: ...
- Where they seem weak: ... (evidence: e.g. reviews repeating the same complaint, feature absent from their own comparison page)
- How buyers might choose them over us, and us over them: ...

## Open questions
- Things we could not confirm, and the public source that might answer them
```

Rules:

- **Separate observed from interpreted.** A line in "Observed" must be traceable to a URL and a read date. A line in "Interpreted" says what it rests on and how confident the writer is (high, medium, low).
- **Pricing as published, with date.** Copy what the page says, including units and limits. If prices are hidden, write "not published" and do not estimate. Never present a third-party blog's number as the competitor's price without marking the source as secondary and `[unverified]`.
- **Quote sparingly.** At most 15 words per quote; paraphrase the rest.
- **Reviews:** count themes, not single complaints. Write the number of reviews read and the platform. A weak spot needs at least a few independent mentions or a documented gap; otherwise it stays a question.
- **No invented numbers.** Market share, revenue, user counts and traffic appear only if a cited source states them. Third-party traffic estimates, if used, are labelled estimates with the tool and date.
- **Our side stays honest.** When comparing, record where the competitor is better. A comparison that only flatters the owner is not usable.

## 4. Compare

Make one table from the Observed lines only:

| Dimension | Us | Competitor A | Competitor B | Status quo |
|---|---|---|---|---|
| Who it is for, as published | | | | |
| Price as published (date) | | | | |
| Free tier or trial as published | | | | |
| Proof shown | | | | |
| Where the buyer notices friction (with sources) | | | | |

Then a short list of **positioning gaps**: claims no competitor makes that the owner can prove, and claims every competitor makes that no longer differentiate. Each gap names the evidence. Hand claims for use in copy to `claims-check`.

## 5. Change log

`.marketing/intel/CHANGELOG.md`, newest first:

```
2026-10-22 | Competitor A | Pricing page | Annual plan now shown first | before: URL (archived copy) | after: URL | read by: <agent or person>
```

On each review, re-fetch the pricing, positioning and changelog pages, compare to the profile, and log differences. If nothing changed, write that, with the date. Do not rewrite old profile lines; add the new observation and mark the old one superseded.

Cadence: pricing and positioning pages monthly; reviews and job listings quarterly; whole profile every six months, or sooner when a sales call or customer names a change.

## 6. Using the profile

- Feed sourced buyer language and gaps to the `product-marketer`, `ai-visibility` and `conversion-engineer` work. Do not paste competitor claims into our copy.
- Comparison pages and ads naming a competitor go through `claims-check` and, for platform ad policies on competitor names, a fresh read of the policy. A person decides to publish.
- If a test follows from a finding (for example a comparison page), register it with `marketing-experiments` before launch.

## Output

1. The set and the buyer sources that named each member.
2. One profile per competitor, with observed and interpreted kept apart.
3. The comparison table and positioning gaps.
4. Change log entries since the last review.
5. Open questions and the public sources that might answer them.
6. Anything skipped because it would have crossed a source line.

## Rules

- Public sources only. No logins you are not entitled to, no fake accounts, no scraping that breaks a site's terms, no private or leaked material.
- Every observed line carries a URL and a read date.
- Pricing is shown as published and dated; hidden prices are not guessed.
- Interpretation is labelled and never presented as fact.
- Do not contact competitors or their customers. Do not publish or send anything.
- Company-level information only; no profiles of private individuals.
