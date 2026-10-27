// "Needs your call": bugs whose fix the agents could not agree on, so a person decides. Only bugs, and only disputes:
// if every agent agrees, they ship it themselves and it never shows up here. Made-up items from a fixed seed, so the list
// is the same on every load.

export type Severity = "critical" | "high" | "medium" | "low";
export type Side = "ship" | "hold";
export type Verdict = { agent: string; side: Side; says: string };
export type Msg = { agent: string; text: string };
export type Call = {
  id: string;
  title: string;
  severity: Severity;
  impact: string; // what the bug does to people, in one line
  fix: string; // what the proposed fix changes
  verdicts: Verdict[];
  thread: Msg[]; // how the agents got stuck
  ageMin: number;
};

export const SEVERITY: Record<Severity, { label: string; means: string; rank: number }> = {
  critical: { label: "Critical", means: "Crashes the app or loses people's work", rank: 0 },
  high: { label: "High", means: "Stops people from doing something", rank: 1 },
  medium: { label: "Medium", means: "Slow or awkward, but it works", rank: 2 },
  low: { label: "Low", means: "Small things to polish", rank: 3 },
};
export const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

export const AGENTS = ["Kite", "Lantern", "Harbor", "Quill", "Beacon", "Tiller", "Compass", "Dune", "Wren", "Scout", "Ember", "Juno"];

// Titles are an area of the product plus a kind of bug, so every one is different
const AREAS = ["Login", "Sign-up", "Search", "Inbox", "Threads", "DMs", "Channels", "Notifications", "Uploads", "Profile",
  "Settings", "Invites", "Emoji picker", "Calls", "Billing", "Onboarding"];
const BUGS: { title: (a: string) => string; severity: Severity; impact: string; fix: string }[] = [
  { title: (a) => `${a} crashes the desktop app`, severity: "critical", impact: "The app closes and unsent work is lost.", fix: "Catches the empty response that crashes it." },
  { title: (a) => `${a} sends the same message twice`, severity: "critical", impact: "People see every message twice.", fix: "Stops the retry once the first send succeeds." },
  { title: (a) => `${a} loses your draft when you switch tabs`, severity: "critical", impact: "Half-written messages disappear.", fix: "Saves the draft as you type." },
  { title: (a) => `${a} won't load on iPhone`, severity: "high", impact: "iPhone users get a blank screen.", fix: "Loads the page without the script iOS blocks." },
  { title: (a) => `${a}: button does nothing`, severity: "high", impact: "People can't finish what they started.", fix: "Wires the button to the action it lost." },
  { title: (a) => `${a}: uploads over 5 MB fail`, severity: "high", impact: "Bigger files never arrive, with no error shown.", fix: "Sends big files in parts." },
  { title: (a) => `${a} is very slow to open`, severity: "medium", impact: "It takes 6–8 seconds to open.", fix: "Loads the list in pages instead of all at once." },
  { title: (a) => `${a} breaks on small phones`, severity: "medium", impact: "Buttons go off the screen below 360 px.", fix: "Lets the row wrap on small screens." },
  { title: (a) => `${a} misses results from today`, severity: "medium", impact: "New items take hours to show up.", fix: "Refreshes the search index every few minutes." },
  { title: (a) => `${a} shows the wrong time`, severity: "low", impact: "Times are an hour off in some time zones.", fix: "Uses the viewer's time zone." },
  { title: (a) => `${a}: wrong label on a button`, severity: "low", impact: "The button says the opposite of what it does.", fix: "Fixes the label." },
];
const FOR = ["Tested it on 3 browsers. Fixed.", "The steps in the report no longer break it.", "Small change, and the tests pass.",
  "Fixed on my run, desktop and phone."];
const AGAINST = ["Fixes it, but could send a message twice on a slow network.", "Slows down channels with 1,000+ people.",
  "Changes how everyone's list is sorted, not only the bug.", "Fixes desktop, but the phone layout still breaks.",
  "Works, but hides an error we'll need later.", "Old data could show for up to an hour."];
const STUCK = ["We looked at it twice and still disagree.", "This needs a person to weigh the trade-off.", "We can't settle this between us."];

// a small seeded random, so the list never changes between loads
function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}

function build(): Call[] {
  const r = rng(27);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  // Fisher-Yates with the seeded random: the same order on the server and in every browser
  const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pairs = shuffle(BUGS.flatMap((bug) => AREAS.map((area) => ({ bug, area })))).slice(0, 64);
  return pairs.map(({ bug, area }, n) => {
    const team = shuffle(AGENTS).slice(0, 5);
    const forCount = [3, 2, 4, 3, 2][n % 5]; // 3–2, 2–3 and 4–1 splits
    const verdicts: Verdict[] = team.map((agent, i) => ({ agent, side: i < forCount ? "ship" : "hold", says: i < forCount ? pick(FOR) : pick(AGAINST) }));
    const yes = verdicts.find((v) => v.side === "ship")!;
    const no = verdicts.find((v) => v.side === "hold")!;
    return {
      id: `c${n + 1}`,
      title: bug.title(area),
      severity: bug.severity,
      impact: bug.impact,
      fix: bug.fix,
      verdicts,
      thread: [
        { agent: yes.agent, text: "The fix is ready and the report's steps no longer break it." },
        { agent: no.agent, text: "It fixes the bug, but it causes a new problem. See my reason above." },
        { agent: yes.agent, text: "That only happens in rare cases. Worth shipping now." },
        { agent: no.agent, text: pick(STUCK) },
      ],
      ageMin: Math.floor(3 + r() * 2900),
    };
  }).sort((a, b) => SEVERITY[a.severity].rank - SEVERITY[b.severity].rank || a.ageMin - b.ageMin);
}

export const calls = build();

export function waited(min: number) {
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.floor(min / 60)} h`;
  return `${Math.floor(min / 1440)} d`;
}
