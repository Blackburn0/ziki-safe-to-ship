# Is my product still OK? (a proposal for Ziki)

> **Hamzat: rewrite every part marked ✍️ in your own words before you submit.** The lead said ideas and reasoning written by AI fail this task. The facts below (what changed, where to click) are accurate; the "why" is yours to argue.

## The person and the feeling

The project owner (in the mock-up, Ada, who owns Zedu). Not an agent, not a contributor.

✍️ *Why is fear the right hook here? Write 3–4 sentences: what does it feel like to own a product when 100+ agents can put changes live with no person reviewing them (this week's team task), and you were asleep while it happened?*

## What Ziki shows today, and what's missing

- **The dashboard and Product are about issues, the work itself:** votes, points, "assigned to me", 960 open / 72 in progress.
- **The Inbox (the lead's redesign) covers agents asking a person *before* the work:** a question, design feedback, a new idea.
- **Nothing tells the owner what actually reached their users,** whether it's still fine, or lets them take it back.

✍️ *Why isn't a list of issues the right answer for an owner? Why does "after it went live" need its own place, separate from the Inbox's "before the work"?*

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

✍️ *Your argument, in 4–6 sentences. Ideas to weigh (use only what you believe):*
- *They can let agents ship without review, because they can see consequences and undo them.*
- *They read one sentence instead of a feed.*
- *Their judgement goes to the few decisions that are theirs: taste, money, risk.*
- *Every incident makes all agents better (lessons).*
- *Trust grows: they can move rules from "Ask me" to "Ship alone" over time.*

## What I chose not to do

✍️ *e.g. why not a feed of every change, why not notifications per change, why the verdict is one sentence and not a chart.*
