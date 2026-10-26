// The overnight story the owner's home tells: what agents shipped to Zedu while Ada was asleep, in plain words.
// Fake data. Everything that was fine is one collapsed line; only the exceptions are shown by default.

export const since = "last night at 11:40 PM";

export type Shipped = {
  id: string;
  what: string; // what changed for people using Zedu, in their words
  area: string;
  issue: number;
  at: string;
  checked: string; // how agents proved it before it went live
  before?: string;
  after?: string;
  dependsOnIt?: string; // a later change that builds on this one
  laterId?: string; // and its id, undone with it
};

// Went live and has been fine for more than the 30-minute watch
export const fine: Shipped[] = [
  { id: "s1", what: "The login screen now accepts an email with a space before or after it", area: "Sign in", issue: 144, at: "12:05 AM", checked: "3 tester agents reproduced the bug and checked the fix" },
  { id: "s2", what: "The empty inbox now says \"You're all caught up\" instead of \"No data\"", area: "Inbox", issue: 702, at: "12:40 AM", checked: "2 reviewers agreed the wording is clearer", before: "No data", after: "You're all caught up", dependsOnIt: "the empty channel list now uses the same message (went live at 1:15 AM)", laterId: "s4" },
  { id: "s3", what: "The settings edit buttons now show a tooltip", area: "Settings", issue: 83, at: "1:02 AM", checked: "2 tester agents checked every button" },
  { id: "s4", what: "The empty channel list now says \"You're all caught up\"", area: "Channels", issue: 703, at: "1:15 AM", checked: "Follows the inbox wording change" },
  { id: "s5", what: "Copying a contact's details now works", area: "Contacts", issue: 119, at: "1:30 AM", checked: "3 tester agents copied and pasted in each app" },
  { id: "s6", what: "A thread's unread count now clears after you read it", area: "Messages", issue: 190, at: "2:10 AM", checked: "Tested on web, desktop and mobile" },
  { id: "s7", what: "The invitation email no longer says \"Telex\"", area: "Emails", issue: 380, at: "2:25 AM", checked: "A reviewer read the sent email" },
  { id: "s8", what: "The login screen no longer offers \"Sign up\" to people logging in", area: "Sign in", issue: 176, at: "2:48 AM", checked: "2 tester agents checked both screens" },
  { id: "s9", what: "\"Set yourself as away\" now works and shows that you're away", area: "Status", issue: 51, at: "3:40 AM", checked: "Tested with two accounts" },
  { id: "s10", what: "Nine success messages had spelling mistakes; they're fixed", area: "Messages", issue: 376, at: "4:05 AM", checked: "A reviewer checked each message" },
  { id: "s11", what: "Every page in the web app now has its own browser tab title", area: "Web app", issue: 362, at: "4:30 AM", checked: "Checked on 14 pages" },
  { id: "s12", what: "The profile panel no longer shows \"Product Manager\" for people with no job title", area: "Profile", issue: 364, at: "5:10 AM", checked: "Tested with and without a job title" },
  { id: "s13", what: "The \"Remember me\" box on desktop login now keeps you signed in", area: "Sign in", issue: 256, at: "6:20 AM", checked: "Tested across restarts" },
];

// Went live recently and is still inside the watch window
export const watching = {
  id: "w1", what: "Search now finds real messages instead of sample results", area: "Search", issue: 62, at: "7:58 AM",
  minutes: 12, of: 30, checked: "3 tester agents searched in 4 channels", signals: "Errors normal · 212 searches so far · no complaints",
};

// Undone automatically by the agents
export const rolledBack = {
  id: "r1",
  what: "Hovering the bell showed your 3 newest notifications",
  issue: 143,
  wentLive: "3:05 AM",
  undone: "3:12 AM",
  why: "The desktop app froze for people with a lot of notifications. Crash reports came from 41 people in 6 minutes, so the agents put the old version back.",
  now: "Nobody is affected now. Crash reports went back to normal at 3:18 AM.",
  lesson: "Before shipping anything that runs when you hover in the desktop app, test it with an account that has 500+ notifications.",
  proposedBy: "Kite and Harbor (the tester agents)",
};

// Agents may not ship these alone (your rules say so)
export const escalated = {
  id: "e1",
  what: "Make Zedu's main buttons green to match the new logo",
  issue: 701,
  rule: "Changes the brand colour. Your rules say look and feel needs you.",
  agents: "4 agents say the change is done correctly. 1 says the green clashes with the marketing site.",
  reach: "Every screen with a main button: about 60 places in the web, desktop and mobile apps.",
  from: "#2E6FEF",
  to: "#16A34A",
};

export const health = [
  { name: "Errors", value: "Normal" },
  { name: "Sign-ins", value: "Normal" },
  { name: "Crash reports", value: "Normal since 3:18 AM" },
];
