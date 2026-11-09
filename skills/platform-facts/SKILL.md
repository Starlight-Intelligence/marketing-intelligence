---
name: platform-facts
description: "Keep marketing platform facts current: ad availability by market, eligibility, formats and limits, bidding, tracking options, policies, fees. Each fact stored with official source, read date and expiry, and re-fetched when stale. Use before any ads plan, channel plan or platform claim, or when someone asks what changed on ChatGPT ads, Google Ads, Meta, TikTok, LinkedIn, YouTube or a marketplace."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Platform facts

Ad platforms and AI assistants change monthly. Advice built on last quarter's facts is wrong in ways that cost money. This skill keeps a dated ledger of platform facts and refuses to use one that has expired.

## Storage

One file per platform: `.marketing/facts/<platform>.md`, for example `chatgpt-ads.md`, `google-ads.md`, `meta-ads.md`.

```markdown
# <Platform>

| Fact | Value | Source | Read | Expires |
|---|---|---|---|---|
| Self-serve advertiser countries | <value as published> | <official URL> | 2026-11-02 | 2026-11-16 |
| Placements that show ads | ... | ... | ... | ... |
```

## Expiry

| Kind of fact | Expires after |
|---|---|
| Market availability, eligibility, new formats on a platform under a year old | 14 days |
| Policies, bidding options, tracking options | 30 days |
| Format limits (lengths, sizes) on mature platforms | 90 days |
| Anything from a secondary source | Treat as a lead; replace with the official source before use |

## Refresh

1. Search the platform's official help centre, policy pages and announcements first. Secondary coverage (news, blogs) only points you to the official page.
2. Record the value as the official page states it, the exact URL and today's date. Quote no more than 15 words.
3. If official pages disagree with each other or with secondary sources, record both with dates and mark the fact `CONFLICT`. Plans must not rely on a `CONFLICT` fact.
4. If you cannot reach an official page, mark the fact `UNVERIFIED` with the reason. Plans must not rely on it.

## Using a fact

Any plan, worksheet or claim that depends on a platform fact cites the ledger row. Before use, check the expiry; if it has passed, refresh first. Never state a platform fact from memory as current.
