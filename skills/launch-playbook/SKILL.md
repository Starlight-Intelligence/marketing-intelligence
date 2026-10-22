---
name: launch-playbook
description: "Take one product from 'should this exist' to a launch-ready waitlist in seven stations: decide, question, buyer, position, door, prove, stage. Use when someone says launch playbook, go-to-market, GTM plan, 'how do I launch this', 'get this ready to sell', pre-launch, waitlist launch, or founding offer. Each station loads only the skills it needs, writes one file, and stops at a gate a human owns. Works with any agent that reads SKILL.md."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Launch playbook

This playbook runs one product through seven stations. Each station reads what the last one wrote, does one job, writes one file, and stops at a gate. You end with a waitlist page a stranger can use, a critique from a second model, and a short list of decisions only a human should make.

Load a station's companion skills only when you reach it. Focused context beats a bundle.

## Setup

Create a launch folder, for example `launch/<product>/<YYYY-MM-DD>/`. Every station writes there. Keep one shared context file, `product-marketing.md`, in that folder; many marketing skills look for it at `.agents/product-marketing.md`, so copy it there in the product repo when you build the page.

Choose a mode:

- **Dry run** stops after station 4. Nothing outside the launch folder changes. Start here.
- **Full** continues to a built page, a critique and a staged plan.

## Station 1: decide

Is this the product that deserves the next block of time? Compare it with the other things you could work on, and name what you will stop or pause to make room. "Not now" is a finished answer.

Writes `01-decision.md`: go, pause or drop; the reason in three sentences; what stops.
Gate: anything other than go ends the run.

## Station 2: question

Interrogate the idea until each answer is specific. Who exactly is the buyer? What job do they hire this for? What do they use today, and what does it cost them? Why now? What is the narrowest version still worth paying for?

The founder answers. Record anything unanswered as `[OPEN]`. Never fill a gap with a plausible guess.

Companions: any forcing-question or "grill me" skill.
Writes `02-brief.md`.
Gate: if the buyer is still `[OPEN]`, stop after station 3 and hand the questions back.

## Station 3: buyer

Find what the buyer uses today and what this must beat.

Writes `03-buyer.md`:
- At least three named alternatives, each with a URL, the date you read it, and the one dimension you will beat it on. "Comparable" is a failing answer.
- Where the buyer already looks: communities, searches, marketplaces, and what AI assistants say when asked about the category.

Companions: `customer-research`, `competitor-profiling` or equivalents.
Gate: fewer than three alternatives actually opened and read, stop.

## Station 4: position

Write the positioning and the offer.

Writes `product-marketing.md` and `04-offer.md`:
- One positioning line in the buyer's own words.
- A gift: a real slice of the product, delivered right after sign-up.
- A founding offer built on status and permanence (price locked for life, named credit, input on the roadmap), not on a discount.
- A price hypothesis as a range, marked as a hypothesis.

**Honest scarcity.** The only scarcity is a founding window that closes at launch and does not reopen. No invented counts, no timers that reset, no deadlines you have not decided, no unit limits on something digital. No discount until there is a real price to discount from.

Companions: `product-marketing`, `pricing`, `offers` or equivalents.
Gate: a dry run ends here.

## Station 5: door

Build the waitlist page in the product's repo, on its own branch.

- One screen, one message, one action. On a phone first.
- The noun the buyer uses; claims only you can prove.
- A short form: email first, then optional questions asked after they are in (expected price band, who they are, what they want to do). The price answer is your first real pricing evidence.
- Make it easy for AI assistants to cite: a clear answer block near the top, structured data, an `llms.txt` if the site has one.
- After it works, do one pass whose only output is cuts and tightening.

Companions: `copywriting`, `cro`, `ai-seo` or equivalents.
Writes `05-door.md`: branch, preview link, and what the refinement pass removed.

## Station 6: prove

The maker should not be the checker.

1. Ask a different model or a different person to review the page as a buyer who has already decided not to pay. Same-model critique does not count.
2. Fix what they find, or write down why you declined each point.
3. Check the copy for filler, inflated claims and anything that reads machine-made.

Writes `06-proof.md`: who critiqued, what they found, what changed.
Gate: unresolved serious findings keep the page in draft.

## Station 7: stage

Plan the first 30 days across owned channels (site, email list), rented channels (social platforms) and borrowed ones (communities, partners, newsletters).

- Draft posts and emails. Do not send or schedule them from the agent.
- The first email delivers the gift.
- If paid ads are in scope, write a test plan with a budget range and decision rules decided in advance. See `chatgpt-ads` for ads inside ChatGPT.
- Set a date to read the sign-up and price answers, and the number that would change the plan.

Companions: `launch` or equivalent.
Writes `07-stage.md`, and an index `00-index.md` that lists what was made, what was verified, and the decisions only a human makes: price, publishing, sending, spending.

## Hard lines

- The agent stages; a human publishes, sends, spends and sets prices.
- No invented numbers. Unknown is `[OPEN]`.
- Sign-up data stays out of git and out of the launch folder.
