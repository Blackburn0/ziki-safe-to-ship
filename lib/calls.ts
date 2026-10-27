// "Needs your call": the items agents could not take live on their own, for the Inbox. 200 made-up items from a fixed seed,
// so the list is the same on every load and big enough to test the design at volume.

export type Tag = "big" | "split" | "proof" | "rollback";
export type Verdict = { agent: string; ok: boolean; says: string };
export type Call = {
  id: string;
  tag: Tag;
  title: string;
  issue: number;
  stage: number; // where it stopped: 0 Proposal, 1 Working, 2 Ready, 3 Staging, 4 Live
  verdicts: Verdict[];
  ageMin: number;
  dissent?: string; // the agent that disagreed, in one line
  note?: string; // the project note agents propose after a rollback
  before?: string; // what the screenshots show
  after?: string;
};

export const STAGES = ["Proposal", "Working", "Ready", "Staging", "Live"];

export const TAGS: Record<Tag, { label: string; action: string; bulk?: string; tone: string }> = {
  big: { label: "Big change", action: "Approve", bulk: "Approve all", tone: "warn" },
  split: { label: "Agents split", action: "Pick a side", tone: "info" },
  proof: { label: "No test proof", action: "Send back", bulk: "Send all back", tone: "chip" },
  rollback: { label: "Rolled back", action: "Approve note", bulk: "Approve all notes", tone: "bad" },
};

export const AGENTS = ["Kite", "Lantern", "Harbor", "Quill", "Beacon", "Tiller", "Compass", "Dune", "Wren", "Scout", "Ember", "Juno"];

// Titles are an area of the product plus a phrasing for the tag, so all 200 are different
const AREAS = ["Login", "Sign-up", "Search", "Inbox", "Threads", "DMs", "Channels", "Notifications", "Uploads", "Profile", "Settings",
  "Invites", "Emoji picker", "Calls", "Billing", "Onboarding"];
const PHRASES: Record<Tag, ((a: string) => string)[]> = {
  big: [(a) => `Redesign ${a}`, (a) => `Remove the old ${a} screen`, (a) => `Move ${a} into the sidebar`, (a) => `New ${a} layout on mobile`],
  split: [(a) => `Cache ${a} for an hour`, (a) => `Retry ${a} automatically`, (a) => `Preload ${a} on start`],
  proof: [(a) => `${a}: button does nothing`, (a) => `${a}: wrong label`, (a) => `${a}: crash on an empty list`, (a) => `${a}: slow to open`, (a) => `${a}: breaks on small phones`],
  rollback: [(a) => `${a} froze the desktop app`, (a) => `${a} broke on iOS`],
};
const DISSENT = [
  "Could send a message twice.", "Slows down channels with 1,000+ people.", "Old data could show for up to an hour.",
  "Breaks reading on tablets.", "Users asked for the opposite last month.", "Costs more storage than it saves.",
];
const MISSING = ["Mobile screenshot missing.", "No screenshot of the error state.", "Only tested on desktop.", "Screenshot is of the wrong screen."];
const note = (title: string) => title.includes("iOS") ? `Test ${title.split(" broke")[0]} on a real iPhone before merging.` : `Test ${title.split(" froze")[0]} with a large account on desktop.`;

// a small seeded random, so the 200 items never change between loads
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

function build(): Call[] {
  const r = rng(26);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  // Fisher-Yates with the seeded random: the same order on the server and in every browser
  const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const plan: [Tag, number][] = [["proof", 80], ["big", 50], ["split", 40], ["rollback", 30]];
  const out: Call[] = [];
  let n = 0;
  for (const [tag, count] of plan) {
    const titles = shuffle(PHRASES[tag].flatMap((p) => AREAS.map(p)));
    for (let k = 0; k < count; k++) {
      const title = titles[k];
      const team = shuffle(AGENTS).slice(0, tag === "split" ? 5 : 4 + Math.floor(r() * 2));
      const verdicts: Verdict[] = team.map((agent, i) => {
        if (tag === "split") return { agent, ok: i < 3 - (k % 2), says: i < 3 - (k % 2) ? "Ready: tested and works." : pick(DISSENT) };
        if (tag === "proof") return { agent, ok: i > 0, says: i > 0 ? "Works on my run." : pick(MISSING) };
        if (tag === "rollback") return { agent, ok: true, says: "Agree with the note." };
        return { agent, ok: true, says: "Done correctly; needs a person." };
      });
      out.push({
        id: `c${++n}`,
        tag,
        title,
        issue: 400 + ((n * 37) % 1200),
        stage: tag === "rollback" ? 4 : tag === "proof" ? 2 : tag === "split" ? 1 + (k % 2) : 2,
        verdicts,
        ageMin: Math.floor(3 + r() * 4300),
        dissent: tag === "split" || tag === "proof" ? verdicts.find((v) => !v.ok)?.says : undefined,
        note: tag === "rollback" ? note(title) : undefined,
        before: tag === "big" || tag === "proof" ? "Before" : undefined,
        after: tag === "big" || tag === "proof" ? "After" : undefined,
      });
    }
  }
  return out.sort((a, b) => a.ageMin - b.ageMin);
}

export const calls = build();
export const liveOnTheirOwn = 1240;

export function age(min: number) {
  if (min < 60) return `${min}m`;
  if (min < 1440) return `${Math.floor(min / 60)}h`;
  return `${Math.floor(min / 1440)}d`;
}
