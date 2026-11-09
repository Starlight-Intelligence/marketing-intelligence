---
name: newsletter-growth
description: "Grow an email list honestly: a gift that is a real slice of the product, give before ask, where to place sign-up points, welcome sequence drafts, list hygiene and consent, and a monthly readout with sign-up rate by source. Use when someone says grow my newsletter, email list, lead magnet, opt-in, welcome sequence, subscriber growth, newsletter sign-ups, or why nobody subscribes. Drafts forms, copy and sequences; a person configures the email tool and sends anything."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Newsletter growth

A list grows when a stranger gets something useful before being asked for anything, and keeps growing when the emails that follow are worth opening. This skill plans the gift, the sign-up points, the welcome sequence and the monthly readout, and keeps consent and list hygiene in view. It does not buy lists, send emails or configure sending tools.

## 1. Ground first

Facts about the email tool, the sender requirements of mailbox providers, and the rules that apply to the list's countries change. Before drafting:

- Fetch the email tool's official help pages for double opt-in, tags or sources, unsubscribe handling and any sending limits. Record URL and read date in `.marketing/facts/<tool>.md` using the `platform-facts` skill.
- Fetch the current official sender guidance of the major mailbox providers (authentication, unsubscribe, complaint rates) and the official text of the privacy and email rules that apply where subscribers live (for example the GDPR and ePrivacy rules in the EU, CAN-SPAM in the US). Record them the same way. This skill is not legal advice; mark anything unclear as a question for the owner's adviser.
- Anything unconfirmed is `[unverified]` and not relied on. Never state a requirement, limit or threshold from memory as current.

## 2. Brief

Ask or read from `.marketing/TRUTH.md` and the brand file: who the reader is, the job they want done, what the newsletter will contain and how often, the product, existing list size and where subscribers come from today, and consent records. If any of these is `OPEN`, list it; do not guess.

Write one sentence in the form: "Every <cadence>, <reader> gets <specific thing> so they can <outcome>." If it cannot be written, the newsletter is not ready to promote.

## 3. The gift is a real slice of the product

The gift is the smallest complete piece of what the customer would get, not a teaser and not a coupon in disguise.

1. List what the product actually delivers (a result, a template, a calculation, a lesson).
2. Pick one piece that stands alone and solves a real, small problem in under 30 minutes of the reader's time. Examples of shape: a worked template, a checklist from a real project, a short course lesson, a calculator, a sample chapter, one real report with the numbers redacted.
3. Test it: could a reader get a result without ever buying? If not, it is a pitch, not a gift.
4. Name it for the outcome, not the format ("Price your first project in 20 minutes", not "Free PDF").
5. Do not claim a number of downloads, readers, ratings or testimonials unless the brand's TRUTH file holds them with a source.

## 4. Sign-up points

Place the form where the reader has just received value, not before. For each placement, record the source name and the UTM scheme (see section 7).

| Placement | Rule |
|---|---|
| End of a useful article, after the answer | Name the gift and show what is inside; one field (email) |
| Inline, mid-article, tied to the topic | Only if the gift matches that topic |
| Dedicated landing page for the gift | One promise, one field, a preview of the content |
| About page and footer | Quiet, always available |
| Exit or timed pop-up | Off by default; if the owner wants one, it appears after meaningful engagement, is easy to close, and is tested against no pop-up |
| Social profile link, podcast, talks | A short, memorable URL per source |

Form copy: say what arrives, how often and who it is from; link the privacy notice; offer an unsubscribe promise only if the tool supports it. No pre-ticked boxes. No countdown timers or "only 50 spots" unless true and verifiable.

## 5. Consent and hygiene

Apply what the grounding step found; the points below are this skill's defaults.

- **Consent:** subscribers sign up themselves, knowing what they will receive. Never add purchased, scraped or imported contacts without a documented lawful basis the owner confirms.
- **Double opt-in:** recommend it where the grounding shows it is required or where list quality matters; weigh the drop-off honestly.
- **Records:** store source, date and the wording shown at sign-up for each subscriber.
- **Unsubscribe:** one click in every email, honoured promptly; no re-adding.
- **Hygiene routine (monthly):** list hard bounces and spam complaints and propose removal; find non-openers and propose a re-engagement email, then removal of those who do not respond; check sender authentication is passing. Open data is unreliable (see section 7), so use clicks, replies and purchases alongside it. A person approves every removal and every send.

## 6. Welcome sequence drafts

Draft, never send. Three to five emails, written for review:

1. **Delivery:** the gift, a link, and what comes next. Sent as soon as the reader confirms. No pitch.
2. **Orientation:** who is writing, why, one useful idea tied to the gift.
3. **Value:** one more small, real piece of help. Still no pitch.
4. **Story or proof:** a real example from real work. Only facts and quotes that exist and carry permission. No invented customers or numbers.
5. **Invitation:** the product, plainly, with the price shown if the owner allows, one link, and an easy way to stay on the list without buying.

For every email: a subject line that says what is inside, a plain-text version, one call to action, the physical sender identification and unsubscribe link the grounding step requires. Run `claims-check` on all drafts. Honest scarcity only: a real deadline or real stock, with the date shown.

The spacing between emails and the choice of sequence length are hypotheses. Register them as tests with `marketing-experiments` before changing anything.

## 7. Metrics and the monthly readout

Define these before launch and record the definitions:

- **Sign-up rate by source** = new confirmed subscribers from a source divided by unique visitors to the placement from that source. Tag every link with UTM parameters; use the pack's `utm.mjs` where the `marketing-team` skill is installed. Report counts next to rates; small counts get a range, not a point.
- **Confirmation rate** (double opt-in): confirmed divided by form submissions.
- **Click rate and reply rate** per email. Treat opens with caution: mail privacy features and image blocking inflate or hide them, so use opens only for trends within one list and one period, and say so in the report.
- **Unsubscribe and complaint rates** per send.
- **Down-funnel** (visits to the product page, trials, purchases) by source, labelled as attributed, not caused.
- **Net list growth** = new confirmed minus unsubscribes minus removals.

Monthly readout, written to `.marketing/work/<month>/newsletter-readout.md`:

1. Numbers for the month, next to last month and the pre-registered target, with counts.
2. Which sources grew the list and which brought people who clicked, not only people who signed up.
3. What the tests said (verdict per the pre-registered rules; inconclusive stays inconclusive).
4. List health: bounces, complaints, authentication, proposed removals.
5. One to three decisions for the owner, each with the evidence.

Tests (gift title, form copy, placement) follow the `marketing-experiments` skill: one change at a time, fixed sample or stop rule written first, no peeking.

## Output

1. Grounding notes with URLs, read dates and `[unverified]` marks.
2. Brief and the one-sentence promise.
3. Gift proposal with the "could they get a result without buying" test.
4. Sign-up point plan with source names and UTM scheme.
5. Consent and hygiene plan, and the questions for the owner's adviser.
6. Welcome sequence drafts with claims-check result.
7. Metric definitions and the monthly readout template.
8. Open questions only a person can answer.

## Rules

- Never send, schedule or import: a person configures the tool, approves each send and each removal.
- No purchased or scraped lists, no pre-ticked consent, no hidden unsubscribe.
- No invented subscriber counts, testimonials, ratings or scarcity.
- Do not report opens as engagement without the caveat.
- Consent and legal questions go to the owner's adviser; this skill is not legal advice.
- Product claims in every email pass `claims-check`.
