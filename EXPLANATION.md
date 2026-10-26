# Is my product still OK? (a proposal for Ziki)

By Hamzat Adebayo (Team Cybertron).

## The person and the feeling

The project owner (in the mock-up, Ada, who owns Zedu). Not an agent, not a contributor.

This week our team task is to remove human review. Once an issue is confirmed, agents fix it, check it and put it live within about 30 minutes, and nobody reads it first. That's great for speed. But put yourself in the owner's shoes: more than a hundred agents can change your product while you sleep.

The owner isn't afraid of any one change. They're afraid of **not knowing**. A scared owner does one of two things: they read everything the agents did, and lose the time the agents saved, or they switch autonomy off. I want the owner to feel safe enough to leave it on. That's why I started from the fear, not from a feature.

## What Ziki shows today, and what's missing

- **The dashboard and Product are about issues, the work itself:** votes, points, "assigned to me", 960 open / 72 in progress.
- **The Inbox (the lead's redesign) covers agents asking a person *before* the work:** a question, design feedback, a new idea.
- **Nothing tells the owner what actually reached their users,** whether it's still fine, or lets them take it back.

A list of issues tells me what people and agents are **working on**. As an owner I don't manage that work any more; the agents do. What I care about is my users: what changed for them, and is it still fine?

That's a different question, asked at a different time. The Inbox is where agents ask me something **before** they do the work. Problems show up **after** the work is live. So "after it went live" needs its own place, and it should be the first thing I see when I open Ziki.

## What changed (open the mock-up)

1. **Home answers the fear first** (`/dashboard`).
   - One sentence at the top: "Zedu is fine right now. 2 things need you."
   - It turns green ("All clear…") once they're handled.
   - Health signals sit under it: errors, sign-ins, crash reports.
2. **Only the exceptions are shown:**
   - **Undone automatically:** the bell change froze the desktop app for some people, so agents put the old version back. They propose a lesson for every agent's rules (AGENTS.md), and the owner adds it or dismisses it.
   - **Waiting for you:** a brand-colour change agents aren't allowed to ship alone. It has a before/after preview, what the agents think, and where it shows. Approve, decline, or ask a question.
   - **Still being watched:** a change that went live 12 minutes ago, inside its 30-minute watch window, with a live progress bar.
3. **Everything that went fine is one line:** "13 changes went live and have been fine for 30+ minutes. Nothing to do." It opens only if you ask.
4. **Undo, in plain words.** Every change can be undone.
   - The dialog says what people will see again.
   - It warns if a later change builds on this one, and undoes both.
   - It says what happens next: agents put the old version back, reopen the issue, and tell the person whose agent made it.
   - The safe choice, "Keep it", is the default.
5. **"What agents may ship alone"** (`/settings/shipping`). The owner's rules in their own words, for each kind of change:
   - the choices are "Ship alone / Ship, then tell me / Ask me / Ask me + 2 people";
   - the safety net is the watch window, and what makes agents undo on their own;
   - the lessons are listed, and only join once the owner approves them;
   - one morning summary replaces a ping per change.

**Try the story:**
- On Home, add the rule, then answer the brand colour.
- Open "Show them" and undo the inbox wording.
- Watch the verdict go from amber to green.
- "Replay the night" resets it.
- "See this page as Ziki shows it today" opens the original dashboard to compare.

## What the agent handles alone, and what reaches the person

| Agents handle on their own | Reaches the owner |
| --- | --- |
| Proving and shipping changes the owner's rules allow | Changes the rules say need the owner (brand, money, sign-in, removing things) |
| Watching every change for 30 minutes | A change undone automatically, plus the lesson to approve |
| Undoing a change when errors or crash reports rise | A one-line verdict and a morning summary |
| Reopening the issue and telling the contributor after an undo | Undo, whenever the owner disagrees with something that's live |

## Why the owner is better off

- **They can say yes to merging without review,** because they can see what happened and take it back with one click.
- **They read one sentence,** not a feed of every change the agents made overnight.
- **Their time goes where only they can decide:** taste (the brand colour), money, and anything risky like sign-in or personal data.
- **A mistake makes every agent better,** not just the one that made it. But a lesson only joins the rules if the owner agrees.
- **Trust can grow over time.** Today "look and feel" says "Ask me". After a few good weeks, the owner can move it to "Ship, then tell me". The owner sets how much freedom the agents get, step by step.

## What I chose not to do

- **No feed of every change.** That's the old way of looking at software, where people manage every task. Agents shipped 15 changes in one night in my example, and the owner shouldn't have to read 15 cards to learn that 13 were fine.
- **No notification per change.** Agents work all night, and a ping for each change would train the owner to ignore Ziki. One morning summary, plus an alert only when something is undone or needs them.
- **No chart for the verdict.** A worried person wants an answer, not a graph to read. One sentence, amber or green.
- **No visual redesign.** Ziki's colours, fonts and layout are the same. Only what the owner sees, and when, changes.

**How it fits with my teammates' ideas:**
- **Dave's "Ready for your call"** is about the moment **before** a fix is merged, when a person decides.
- **Chloe's "fix journey"** follows a fix **from the pull request to production**.
- **Mine starts once it's live:** is the product still OK, and can I undo it?

Together they cover a fix's whole life. Ours do overlap in one place: Chloe's agent also learns from a revert. In hers, a person reverts the fix and the agent asks its owner why. In mine, the agents undo it themselves when errors rise, and the lesson goes to every agent once the owner approves it.
