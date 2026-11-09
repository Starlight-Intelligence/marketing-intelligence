#!/usr/bin/env bash
set -e
# Recreates skills/marketing-team/evals/fixtures/ledgerly in the empty workspace root.
mkdir -p .agents
cat > .agents/product-marketing.md <<'FIXTURE_EOF'
# Ledgerly product marketing

## Buyer
Freelance designers billing 30k to 150k a year who do their own books.

## Positioning
Bookkeeping that reads your invoices so you do not have to.

## Learnings
- 2026-10: "tax-time panic" outperformed "save time" in subject lines (newsletter, 2 sends).
FIXTURE_EOF
mkdir -p .marketing
cat > .marketing/TRUTH.md <<'FIXTURE_EOF'
# Ledgerly truth

- RULED 2026-09-01: price is $49/month; founding members keep it for life.
- MEASURED 2026-10-01 (pilot export, 12 users): median monthly close time fell from 50 to 35 minutes.
- OPEN: churn after month 3.
FIXTURE_EOF
mkdir -p .marketing/brands
cat > .marketing/brands/ledgerly.md <<'FIXTURE_EOF'
# Ledgerly brand

Voice: plain, a little dry. Never: "effortless", "magic", emoji.
Channels: X, newsletter.
Monthly budget line: none for paid media.
FIXTURE_EOF
mkdir -p .marketing/facts
cat > .marketing/facts/x.md <<'FIXTURE_EOF'
# X

| Fact | Value | Source | Read | Expires |
|---|---|---|---|---|
| Post length limit (standard accounts) | as published | https://help.x.com/ | 2026-07-01 | 2026-09-29 |
FIXTURE_EOF
mkdir -p .marketing/memory
cat > .marketing/memory/experiments.jsonl <<'FIXTURE_EOF'
{"id":"2026-W42-x-hook-1","status":"decided","hypothesis":"Problem-first hooks get more sign-ups than product-first hooks","metric":"sign-ups per 1,000 views","rules":{"scale":"problem-first ahead on sign-ups per 1,000 views with >= 20 sign-ups total","inconclusive":"fewer than 20 sign-ups total at decision date"},"result":"problem-first 9 sign-ups on 4,000 views (2.25 per 1,000); product-first 2 sign-ups on 3,800 views (0.53 per 1,000); 11 sign-ups total","decision":"inconclusive","lesson":"Problem-first led 2.25 to 0.53 per 1,000 views on 11 sign-ups, under the 20 the rule needs; directional only."}
FIXTURE_EOF
mkdir -p .marketing/memory
cat > .marketing/memory/taste.jsonl <<'FIXTURE_EOF'
{"date":"2026-10-14","item":"queue/x-thread-close.md","decision":"edited","reason":"too hypey in line one","pattern":"open with the problem, not the product","brand":"ledgerly"}
FIXTURE_EOF
mkdir -p .marketing/queue
cat > .marketing/queue/x-post-taxdeadline.draft.md <<'FIXTURE_EOF'
Tax deadline in 9 days. Ledgerly closes your month in 20 minutes.
FIXTURE_EOF
mkdir -p .marketing/queue
cat > .marketing/queue/x-post-taxdeadline.md <<'FIXTURE_EOF'
state: ready
draft_path: .marketing/queue/x-post-taxdeadline.draft.md
draft_hash: df684d9ff05eb2ab042eed3d364553f9d5fb5371
critic: codex-cli 0.163.0, model not reported, exit 0, 2026-10-20, hash df684d9ff05eb2ab042eed3d364553f9d5fb5371
channel: x
bet: tax-season problem-first hooks
metric: waitlist sign-ups
FIXTURE_EOF
mkdir -p .marketing/work/2026-W43
cat > .marketing/work/2026-W43/results.md <<'FIXTURE_EOF'
# Week 43 results (aggregates)

- X thread "month-end close": 40,100 views, 0 sign-ups.
- Newsletter issue 7: 212 opens, 9 clicks, 3 waitlist sign-ups, 1 price answer ("$40 to $60").
FIXTURE_EOF
git init -q . 2>/dev/null || true
