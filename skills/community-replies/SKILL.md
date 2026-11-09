---
name: community-replies
description: "Find community threads (Reddit, Hacker News, forums, Discord, Slack groups, Q&A sites) where a founder's real expertise helps, and draft replies that help first, disclose affiliation and follow each community's rules. Drafts go to an approval queue; nothing is posted automatically. Use for Reddit marketing, Hacker News, community-led growth, reply to threads, find conversations about our category."
metadata:
  version: 0.1.0
  pack: marketing-intelligence
---

# Community replies

For a solo founder, a useful answer in the right thread can beat a week of posts. It only works if it is genuinely useful, clearly from the founder, and within the community's rules. Communities detect and punish anything else, and the damage outlasts the thread.

## 1. Find threads

Search the places the buyer asks for help (from `.marketing/work/*/buyer-language.md` and the brand pack's channel list) for recent threads where:

- someone describes the problem the product solves, or asks for a comparison or a recommendation, and
- the founder has first-hand knowledge to add.

Record each candidate: link, community, date, the question in under 15 words, why it fits, and the community's self-promotion rules (read the sidebar or rules page; quote the relevant line).

## 2. Draft

Each reply:

- Answers the question fully without the product. If the reply is only useful with a link, do not write it.
- Uses specifics from the founder's experience, numbers they measured, mistakes they made.
- Mentions the product only if it directly answers the question and the rules allow it, once, with plain disclosure ("I build X, so I'm biased").
- Matches the community's tone and length; no marketing voice, no emoji bullets.
- Passes `marketing-team`'s lint with the `reddit` surface (or `x`, `linkedin` for those communities).

## 3. Queue

Write each draft to `.marketing/queue/<item>.draft.md` with an item record: link, community, rule quote, why it fits, and the risk if any. A person reads the thread and posts from their own account.

## Never

- Post, vote, or message from the agent.
- Use multiple accounts, ask others to upvote, or reply to your own thread as someone else.
- Reply in communities whose rules ban promotion with anything that promotes.
- Copy the same reply into several threads.

Track what happened (replies, clicks with `utm_source=reddit` or similar, sign-ups) in the next readout. If a community responds badly, stop there.
