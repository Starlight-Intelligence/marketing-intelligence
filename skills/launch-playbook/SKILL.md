---
name: launch-playbook
description: "Take one unlaunched product from 'is this worth our time' to a tested waitlist page in seven stations: decide, question, buyer, position, door, prove, stage. Use when someone says launch playbook, pre-launch, waitlist launch, founding offer, 'how do I launch this', or wants a go-to-market pass before taking payments. Each station writes its files, checks a gate, and stops at decisions a human owns. Ends at a waitlist and a staged 30-day plan, not at checkout. Works with any agent that reads SKILL.md."
metadata:
  version: 0.2.0
  pack: marketing-intelligence
---

# Launch playbook

This playbook runs one product through seven stations. Each station reads what the last one wrote, writes its files, and checks a gate. You end with a waitlist page that has been tested end to end, a critique from someone other than its maker, and a short list of decisions only a human should make.

Every station below has a **standalone procedure** that works with no other skills installed. **Companions** are optional skills that deepen a station if your agent has them; check whether they are installed before relying on one, and say which you used.

## Setup

Create a launch folder, for example `launch/<product>/<YYYY-MM-DD>/`. Every station writes there, and `00-index.md` is updated as you go: what was made, what was verified, and what is waiting for a human.

Keep one shared context file, `product-marketing.md`, in the folder. Some marketing skills read it from `.agents/product-marketing.md`. When you copy it into the product repo at station 5, merge with any existing file there instead of overwriting it, and keep the launch folder copy as the source.

Choose a mode:

- **Dry run** stops after station 4 and writes only inside the launch folder: `00-index.md`, `01-decision.md`, `02-brief.md`, `03-buyer.md`, `product-marketing.md`, `04-offer.md`. Start here.
- **Full** continues to a tested page, a critique and a staged plan.

## Station 1: decide (provisional)

Is this worth investigating now? Compare it with the other things you could work on and name what you would pause to make room. This is permission to research, not a launch decision; station 3 revisits it with evidence.

Writes `01-decision.md`: investigate, pause or drop; the reason in three sentences; what pauses.
Gate: pause or drop ends the run. Both are finished results.

## Station 2: question

Standalone procedure: ask the founder, one at a time, until each answer is specific enough that two people would picture the same customer:

1. Who exactly is the buyer? (role, size, situation)
2. What job do they hire this for?
3. What do they use today, and what does it cost them in money and time?
4. Why now?
5. What is the narrowest version still worth paying for?

Only the founder answers. Anything unanswered is `[OPEN]`; never fill a gap with a plausible guess.

Companions: a forcing-question or "grill me" skill.
Writes `02-brief.md`.
Gate: if the buyer is still `[OPEN]`, run station 3 for context, then stop and hand the questions back.

## Station 3: buyer

Standalone procedure: search for what the buyer uses today, open each candidate, and read it.

Writes `03-buyer.md`:

- At least three named alternatives, each with URL and the date you read it. For each, keep two columns apart: **observed** (what the page, pricing and reviews actually show) and **proposed advantage** (the one dimension you think you can beat it on). A proposed advantage needs a reason the buyer cares about that dimension (their own words in reviews, threads or the founder's interviews) and evidence the product can deliver it. "Comparable" is a failing answer.
- Where the buyer already looks: communities, searches, marketplaces, and what AI assistants say when asked about the category (with the date and assistant used).
- **Decision revisited:** confirm go, or change station 1's answer to pause or drop, with the evidence that decided it.

Companions: `customer-research`, `competitor-profiling`.
Gate: fewer than three alternatives actually opened and read, or a decision that is no longer go, stops the run.

## Station 4: position

Standalone procedure: write the positioning from the brief and the buyer research, then choose an offer by comparing options against the product's costs and the buyer's main objection.

Writes `product-marketing.md` and `04-offer.md`:

- One positioning line in the buyer's own words.
- **Gift, if one fits:** a real slice of the product delivered right after sign-up. Skip it if no slice stands on its own.
- **Offer:** compare two or three options (for example a founding price lock, named credit, roadmap input, early access) by what each costs to honour and which objection it answers. Do not promise permanence you have not costed: a lifetime price lock is a liability on every future price change.
- **Price hypothesis:** a range, labelled as a hypothesis.

**Honest scarcity.** Scarcity is optional. If you use it, the only kind is a founding window that genuinely closes at launch and does not reopen. No invented counts, no timers that reset, no deadlines you have not decided, no unit limits on something digital. No discount until there is a real price to discount from.

Companions: `product-marketing`, `pricing`, `offers`.
Gate: a dry run ends here.

## Station 5: door

Build the waitlist page in the product's repo, on its own branch.

- One screen, one message, one action, designed on a phone first.
- The buyer's own noun for the problem; only claims you can prove.
- A short form: email first, then optional questions after they are in (expected price band, who they are, what they want to do). Price answers are stated preference, useful early evidence, and weaker than anyone actually paying.
- Make it easy for AI assistants to cite: a clear answer block near the top, structured data, an `llms.txt` if the site has one.

When the page works, do one pass whose only output is cuts and tightening. Then run the acceptance checks on that final revision.

**Functional acceptance, with synthetic data only:**

1. A test sign-up submits and is stored where the capture says it is.
2. A duplicate email and an invalid email are handled with a clear message.
3. The gift email (if there is a gift) arrives within the promised time, checked through a test inbox or a mail sink you control.
4. The sign-up event is recorded by the analytics the plan will read.
5. The page works with the network slow or the form endpoint down: the visitor sees an error, not a silent success.

Any later material change to the page reruns the affected checks.

Companions: `copywriting`, `cro`, `ai-seo`.
Writes `05-door.md`: branch, preview link, the revision tested, the five acceptance results, and what the refinement pass removed.
Gate: any failed acceptance check keeps the station open.

## Station 6: prove

The maker should not be the checker.

1. Hand a different model or a different person a **review packet**: the page URL, the revision, the buyer from `02-brief.md`, the alternatives from `03-buyer.md`, and the instruction to review as a buyer who has already decided not to pay, reporting each finding with a severity.
2. Fix what they find, or write down why you declined each point.
3. If the fixes change the page materially, rerun the affected station 5 acceptance checks on the new revision and record it.
4. Check the copy for filler, inflated claims and anything that reads machine-made.

If no second reviewer is available, write the review packet, leave this station open and stop. Your own review can be recorded, labelled as the maker's, but it does not close the station.

Writes `06-proof.md`: who critiqued, the revision they saw, what they found, what changed.
Gate: unresolved serious findings keep the page in draft.

## Station 7: stage

Plan the first 30 days across owned channels (site, email list), rented channels (social platforms) and borrowed ones (communities, partners, newsletters).

- Draft posts and emails. Do not send or schedule them from the agent.
- The first email delivers the gift, if there is one.
- If paid ads are in scope, write a test plan with a maximum loss and decision rules decided in advance. For ads inside ChatGPT, see `chatgpt-ads`.
- Set a date to read sign-ups and price answers, and the number that would change the plan.

Companions: `launch`.
Writes `07-stage.md`, and closes `00-index.md` with what was made, what was verified, and the decisions only a human makes: price, publishing, sending, spending.

## Hard lines

- The agent stages; a human publishes, sends, spends and sets prices.
- No invented numbers or answers. Unknown is `[OPEN]`.
- Test with synthetic data. Real sign-up data stays out of git and out of the launch folder.
