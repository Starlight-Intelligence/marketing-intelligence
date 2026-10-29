# AGENTS.md

Instructions for any agent working in this repository.

## What this repo is

A public pack of marketing playbook skills under `skills/<name>/`, installed with `npx skills add Starlight-Intelligence/marketing-intelligence`. Each skill is one `SKILL.md` plus `evals/evals.json`. Runnable cases for `claude plugin eval` live at the repo root under `evals/<skill>-<case>/` (`prompt.md` plus `graders/*.md`); every skill has at least a `<skill>-trigger` and a `<skill>-no-trigger` case.

## Rules for changes

- One skill per folder; the folder name is the install name. Name skills after the words people search for.
- A skill is listed as v0.1 or later in `skills/README.md` only when it has evals. Otherwise it is `planned`.
- Platform facts (availability, prices, policies, audience sizes) are never hard-coded as current. The skill tells the agent to fetch the official source and record the read date.
- Skills stage work for humans. No skill may instruct an agent to send, post, schedule, spend, set prices or handle payment details.
- No private brand material, customer data, credentials or internal estate paths in this repo; it is public.
- Prose: plain, specific, sentence case. No invented numbers, testimonials or scarcity.

## Workflow

Branch as `agent/<harness>/<scope>`, open a draft PR, and get review from a different model or person than the author before merge.
