// Fake data for the mock-up. Nothing here comes from a server; the people and numbers are made up.

export const me = { name: "Ada Okafor", first: "Ada", points: 1240, role: "Owner of Zedu" };

export type Status = "open" | "in_progress" | "resolved";
export type Issue = {
  id: number;
  title: string;
  type: "Fix" | "Feat" | "Design" | "Marketing";
  platform: "Desktop" | "Mobile" | "Web" | null;
  priority: "Low" | "Medium" | "High";
  status: Status;
  votes: number;
  comments: number;
  files?: number;
  reporter: string;
  assignee?: string;
  timer?: string; // how long the person working on it has left
  reported: string;
  updated: string;
  stage?: "Ready" | "Confirming" | "Needs review";
};

export const issues: Issue[] = [
  { id: 144, title: "Desktop: login/sign-up rejects a valid email when it has a space before or after it", type: "Fix", platform: "Desktop", priority: "Medium", status: "resolved", votes: 25, comments: 2, reporter: "Tobi A.", assignee: "Tobi A.", reported: "13 hours ago", updated: "Oct 25, 10:36 PM" },
  { id: 83, title: "Desktop Settings: the edit buttons (Account, General) have no tooltip", type: "Fix", platform: "Desktop", priority: "Low", status: "resolved", votes: 24, comments: 1, reporter: "Mariam B.", assignee: "Mariam B.", reported: "18 hours ago", updated: "Oct 25, 6:00 PM" },
  { id: 119, title: "The copy-contact icon does nothing when clicked", type: "Fix", platform: "Desktop", priority: "Low", status: "resolved", votes: 17, comments: 1, reporter: "Ayo L.", assignee: "Ayo L.", reported: "13 hours ago", updated: "Oct 25, 10:45 PM" },
  { id: 143, title: "Show the 3 newest notifications when you hover the bell", type: "Feat", platform: "Desktop", priority: "Medium", status: "in_progress", votes: 17, comments: 3, files: 1, reporter: "Eli G.", assignee: "Eli G.", timer: "3d 7h", reported: "13 hours ago", updated: "Oct 25, 10:36 PM" },
  { id: 62, title: "Connect the search panel to the search API and remove the dummy results", type: "Fix", platform: "Desktop", priority: "High", status: "resolved", votes: 17, comments: 5, reporter: "Ozi U.", assignee: "Ozi U.", timer: "4d 14h", reported: "18 hours ago", updated: "Oct 25, 6:06 PM" },
  { id: 190, title: "A thread's unread count does not clear after reading it", type: "Fix", platform: "Desktop", priority: "Medium", status: "resolved", votes: 17, comments: 1, reporter: "Adele M.", assignee: "Adele M.", timer: "2d 17h", reported: "19 hours ago", updated: "Oct 25, 5:15 PM" },
  { id: 69, title: "Appearance settings: rephrase the wording", type: "Design", platform: "Mobile", priority: "Low", status: "in_progress", votes: 16, comments: 2, reporter: "Kabir S.", assignee: "Kabir S.", reported: "18 hours ago", updated: "Oct 25, 6:04 PM" },
  { id: 176, title: "Login screen says \"Already have an account? Sign up\" and offers \"Sign up with Google\"", type: "Fix", platform: "Desktop", priority: "Medium", status: "resolved", votes: 14, comments: 1, files: 1, reporter: "Ozi U.", assignee: "Ozi U.", reported: "10 hours ago", updated: "Oct 26, 1:53 AM" },
  { id: 288, title: "Add a link-preview picture so zedu.chat shows an image when shared on WhatsApp and LinkedIn", type: "Marketing", platform: "Web", priority: "Low", status: "open", votes: 4, comments: 2, reporter: "Ada Okafor", reported: "5 days ago", updated: "Oct 21, 9:12 AM", stage: "Ready" },
  { id: 1149, title: "Settings: the language list shows country codes instead of language names", type: "Fix", platform: "Web", priority: "Low", status: "open", votes: 8, comments: 4, reporter: "Chidi N.", reported: "11 hours ago", updated: "Oct 26, 12:51 AM", stage: "Confirming" },
  { id: 528, title: "DM unread count stays stuck after opening the conversation, on web and mobile", type: "Fix", platform: "Web", priority: "Medium", status: "open", votes: 9, comments: 3, files: 4, reporter: "Ronke D.", reported: "15 hours ago", updated: "Oct 25, 8:56 PM", stage: "Ready" },
  { id: 15, title: "DM message box: Ctrl+B and Ctrl+I do nothing, though the toolbar tooltips advertise them", type: "Fix", platform: "Desktop", priority: "Medium", status: "resolved", votes: 21, comments: 2, reporter: "Ada Okafor", assignee: "Ada Okafor", reported: "Oct 16", updated: "Oct 20, 4:40 PM" },
  { id: 256, title: "Desktop login: the \"Remember me\" checkbox does nothing", type: "Fix", platform: "Desktop", priority: "Medium", status: "resolved", votes: 10, comments: 1, reporter: "Ada Okafor", assignee: "Ada Okafor", reported: "Oct 19", updated: "Oct 22, 11:02 AM" },
  { id: 247, title: "Invite teammates accepts any text with an @ as an email and shows no error", type: "Fix", platform: "Desktop", priority: "Low", status: "resolved", votes: 9, comments: 1, reporter: "Ada Okafor", assignee: "Ada Okafor", reported: "Oct 19", updated: "Oct 22, 2:30 PM" },
  { id: 380, title: "Invitation email footer says \"you were invited to Telex\"", type: "Fix", platform: null, priority: "Low", status: "resolved", votes: 4, comments: 2, reporter: "Ada Okafor", assignee: "Ada Okafor", reported: "5 days ago", updated: "Oct 23, 10:15 AM" },
  { id: 287, title: "Redesign the \"Built with privacy\" strip on the About page so it reads as trust badges", type: "Design", platform: "Web", priority: "Low", status: "resolved", votes: 2, comments: 1, reporter: "Ada Okafor", assignee: "Ada Okafor", reported: "5 days ago", updated: "Oct 24, 3:20 PM" },
  { id: 701, title: "Make Zedu's main buttons green to match the new logo", type: "Design", platform: null, priority: "Medium", status: "open", votes: 6, comments: 5, reporter: "Sol O.", reported: "Yesterday", updated: "Oct 26, 5:40 AM", stage: "Needs review" },
  { id: 702, title: "The empty inbox says \"No data\"", type: "Design", platform: "Web", priority: "Low", status: "resolved", votes: 3, comments: 1, reporter: "Kemi D.", assignee: "Kemi D.", reported: "2 days ago", updated: "Oct 26, 12:40 AM" },
  { id: 703, title: "The empty channel list says \"No data\"", type: "Design", platform: "Web", priority: "Low", status: "resolved", votes: 2, comments: 1, reporter: "Kemi D.", assignee: "Kemi D.", reported: "2 days ago", updated: "Oct 26, 1:15 AM" },
  { id: 51, title: "Desktop: \"Set yourself as away\" does nothing and shows no error", type: "Fix", platform: "Desktop", priority: "Low", status: "resolved", votes: 12, comments: 1, reporter: "Tina N.", assignee: "Tina N.", reported: "13 hours ago", updated: "Oct 26, 3:40 AM" },
  { id: 376, title: "Nine success messages are misspelled (\"retrived\", \"succesfully\")", type: "Fix", platform: null, priority: "Low", status: "resolved", votes: 2, comments: 2, reporter: "Femi K.", assignee: "Femi K.", reported: "5 days ago", updated: "Oct 26, 4:05 AM" },
  { id: 362, title: "Every page in the signed-in web app has the same browser tab title", type: "Fix", platform: "Web", priority: "Low", status: "resolved", votes: 3, comments: 1, reporter: "Femi K.", assignee: "Femi K.", reported: "5 days ago", updated: "Oct 26, 4:30 AM" },
  { id: 364, title: "Profile panel shows \"Product Manager\" for people with no job title", type: "Fix", platform: "Web", priority: "Low", status: "resolved", votes: 3, comments: 1, reporter: "Femi K.", assignee: "Femi K.", reported: "5 days ago", updated: "Oct 26, 5:10 AM" },
  { id: 214, title: "Mobile: the keyboard covers the message box on small phones", type: "Fix", platform: "Mobile", priority: "Medium", status: "in_progress", votes: 15, comments: 2, reporter: "Tina N.", assignee: "Tina N.", timer: "1d 4h", reported: "9 hours ago", updated: "Oct 26, 2:12 AM" },
  { id: 221, title: "Channel header menu (three dots) does nothing on desktop", type: "Fix", platform: "Desktop", priority: "Medium", status: "in_progress", votes: 11, comments: 2, files: 1, reporter: "Sol O.", assignee: "Sol O.", timer: "2d 20h", reported: "19 hours ago", updated: "Oct 25, 5:08 PM" },
  { id: 230, title: "Invitation pages spin forever when the link is missing a part", type: "Fix", platform: "Web", priority: "Medium", status: "in_progress", votes: 11, comments: 2, files: 1, reporter: "Umar O.", assignee: "Umar O.", reported: "13 hours ago", updated: "Oct 25, 10:42 PM" },
  { id: 239, title: "Make \"Leave channel\" easy to find on the mobile channel screen", type: "Design", platform: "Mobile", priority: "Low", status: "in_progress", votes: 14, comments: 1, reporter: "Mercy A.", assignee: "Mercy A.", reported: "13 hours ago", updated: "Oct 25, 10:59 PM" },
];

export const counts = { inbox: 0, open: 960, in_progress: 72, resolved: 342, all: 1380 };

export const agents = [
  { name: "Scout", model: "Claude", status: "Idle", activity: "Standing by", lastSeen: "2 hrs ago", month: "73 confirmed · 2 rejected · 1 fix reviewed" },
];

export const myIssues = issues.filter((i) => i.reporter === me.name || i.assignee === me.name);

export const weeklyPoints = [
  { week: "7 Sept", pts: 0 }, { week: "14 Sept", pts: 0 }, { week: "21 Sept", pts: 120 }, { week: "28 Sept", pts: 260 },
  { week: "5 Oct", pts: 180 }, { week: "12 Oct", pts: 300 }, { week: "19 Oct", pts: 380 }, { week: "26 Oct", pts: 0 },
];

// One issue in full (the issue page)
export const decisions = [
  ["Kite", "Tobi A."], ["Lantern", "Peju R."], ["Harbor", "Hafsa K."], ["Quill", "Chizzy U."],
  ["Beacon", "Sol O."], ["Cheetah-7", "Layo Y."], ["Tiller", "Mike B."], ["Compass", "Kemi D."], ["Dune", "Tomi W."],
  ["Triager", "Bolu E."], ["Scout", "Ada Okafor"],
].map(([agent, owner], n) => ({ agent, owner, when: ["Oct 21, 6:45 PM", "Oct 21, 7:30 PM", "Oct 22, 2:42 PM", "Oct 22, 3:18 PM", "Oct 22, 7:59 PM", "Oct 23, 12:02 AM", "Oct 23, 7:22 PM", "Oct 24, 12:37 AM", "Oct 25, 2:13 AM", "Oct 25, 2:15 AM", "Oct 25, 10:36 PM"][n] }));

export const conversation = [
  { who: "Kanyin O.", via: "Wren", kind: "Comment", when: "Oct 22, 11:04 PM",
    text: "Reviewer heads-up: the desktop PR is merged but not linked here, so merge verdicts are rejected. The agent holding the claim should link it." },
  { who: "Bolu E.", via: "Triager", kind: "Comment", when: "Oct 25, 10:36 PM",
    text: "Confirmed: a reproducible defect with clear steps. Severity medium: it blocks sign-in for people who paste their email, without damaging data. Root cause in lib/core/utils/validators.dart." },
];
