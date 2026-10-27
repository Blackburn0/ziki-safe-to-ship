import Link from "next/link";
import {
  BotIcon, CheckCircle, ChevronRight, ChevronUp, CircleDashed, Filter, InboxIcon, Layers, Message, Monitor, Paperclip, Plus, Search, Settings, Sort, Timer,
} from "@/components/Icons";
import { Avatar, Card, Pill } from "@/components/ui";
import { agents, counts, issues, type Status } from "@/lib/data";
import { calls } from "@/lib/calls";
import NeedsYourCall from "@/components/NeedsYourCall";

type View = "inbox" | Status | "all";
const statusTabs: { key: View; label: string; Icon: typeof Timer; count: number }[] = [
  { key: "open", label: "Open", Icon: CircleDashed, count: counts.open },
  { key: "in_progress", label: "In progress", Icon: Timer, count: counts.in_progress },
  { key: "resolved", label: "Done", Icon: CheckCircle, count: counts.resolved },
  { key: "all", label: "All", Icon: InboxIcon, count: counts.all },
];

function PriorityBars({ level }: { level: string }) {
  const n = level === "High" ? 3 : level === "Medium" ? 2 : 1;
  return (
    <span className="inline-flex items-end gap-[2px]" aria-label={`${level} priority`}>
      {[1, 2, 3].map((b) => <span key={b} className={`w-[3px] rounded-sm ${b <= n ? "bg-zk-text2" : "bg-zk-border"}`} style={{ height: 4 + b * 3 }} />)}
    </span>
  );
}

export default async function Issues({ searchParams }: { searchParams: Promise<{ status?: string; inbox?: string }> }) {
  const { status, inbox } = await searchParams;
  const view: View = (["open", "in_progress", "resolved", "all"].includes(status ?? "") ? status : "inbox") as View;
  const list = issues.filter((i) => view === "all" || i.status === view).sort((a, b) => b.votes - a.votes);
  const inboxTab = inbox ?? "call";

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zk-divider px-4 py-3 sm:px-5">
        <p className="flex items-center gap-1.5 text-[13px]"><span className="text-zk-muted">Zedu</span><ChevronRight className="h-3 w-3 text-zk-muted" /><span className="font-semibold">Issues</span></p>
        <div className="flex items-center gap-1.5">
          {[{ I: Search, l: "Search" }, { I: Filter, l: "Filters" }, { I: Sort, l: "Sort" }].map(({ I, l }) => (
            <button key={l} type="button" aria-label={l} className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zk-border hover:bg-zk-chip"><I className="h-3.5 w-3.5" /></button>
          ))}
          <Link href="/issues/new" aria-label="New issue" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zk-border hover:bg-zk-chip"><Plus className="h-3.5 w-3.5" /></Link>
          <span className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full border border-zk-border px-3 text-[13px]"><Monitor className="h-3.5 w-3.5" /> Platform: <b>All</b> <span className="text-zk-muted">0</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link href="/issues" className={`inline-flex h-9 items-center gap-2 rounded-xl px-3 text-[13px] font-semibold ${view === "inbox" ? "bg-electric-blue-strong text-white" : "bg-zk-seg text-zk-text2"}`}>
          <InboxIcon className="h-4 w-4" /> Inbox <span className={`rounded-md px-1.5 font-mono text-[11px] ${view === "inbox" ? "bg-white/25" : "bg-zk-surface"}`}>{calls.length}</span>
        </Link>
        <div className="flex flex-wrap rounded-xl bg-zk-seg p-1">
          {statusTabs.map(({ key, label, Icon, count }) => (
            <Link key={key} href={`/issues?status=${key}`} className={`inline-flex h-8 items-center gap-2 rounded-lg px-3 text-[13px] font-medium ${view === key ? "bg-electric-blue-strong text-white" : "text-zk-text2 hover:text-zk-text"}`}>
              <Icon className="h-3.5 w-3.5" /> {label} <span className={`font-mono text-[11px] ${view === key ? "text-white/80" : "text-zk-muted"}`}>{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {view === "inbox" ? (
        <div className="px-4 pb-5 sm:px-5">
          {inboxTab !== "call" && <div className="grid overflow-hidden rounded-[16px] border border-zk-border md:grid-cols-[1fr_auto]">
            <div className="flex gap-3 p-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zk-tint text-zk-accent"><InboxIcon className="h-4 w-4" /></span>
              <div>
                <h2 className="text-sm font-semibold">How the Inbox works</h2>
                <p className="mt-1 text-[13px] text-zk-text2">Agents work through issues on their own and stop here when they need a person: to answer a question, give feedback on a design, or weigh in on a new idea.</p>
              </div>
            </div>
            <div className="border-zk-divider p-4 max-md:border-t md:w-64 md:border-l">
              <p className="text-[11px] font-bold tracking-[0.08em] text-zk-muted uppercase">Your agents</p>
              {agents.map((a) => (
                <div key={a.name} className="mt-2 flex gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><BotIcon className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between text-[13px] font-semibold">{a.name}<span className="flex items-center gap-1.5"><span className="rounded-full border border-zk-border px-2 text-[11px] font-normal text-zk-muted">Work</span><Settings className="h-3.5 w-3.5 text-zk-muted" /></span></p>
                    <Pill tone="info" className="mt-1 py-0.5 text-[11px]">{a.activity}</Pill>
                    <p className="mt-1 truncate text-[11px] text-zk-muted">Last 30 days: {a.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>}

          <div className={`flex gap-1 border-b border-zk-divider text-[13px] max-sm:overflow-x-auto max-sm:overflow-y-hidden ${inboxTab === "call" ? "" : "mt-4"}`}>
            {[["call", "Needs your call", calls.length], ["input", "Need your input", 0], ["design", "Design feedback needed", 0], ["ideas", "New ideas", 1]].map(([key, label, n]) => (
              <Link key={key} href={key === "call" ? "/issues" : `/issues?inbox=${key}`} className={`-mb-px shrink-0 border-b-2 px-2 py-2 font-medium whitespace-nowrap ${inboxTab === key ? "border-zk-accent text-zk-text" : "border-transparent text-zk-text2"}`}>
                {label} <span className="ml-1 rounded-md bg-zk-chip px-1.5 font-mono text-[11px] text-zk-muted">{n}</span>
              </Link>
            ))}
          </div>
          {inboxTab === "call" ? <NeedsYourCall /> : inboxTab === "ideas" ? (
            <Link href="/issues/288" className="mt-4 flex items-center gap-3 rounded-[16px] border border-zk-border p-4 hover:bg-zk-bg">
              <Layers className="h-4 w-4 text-zk-accent" />
              <span className="flex-1 text-[13px] font-semibold">Add a link-preview picture so zedu.chat shows an image when shared</span>
              <Pill tone="info">New idea</Pill>
            </Link>
          ) : (
            <div className="mt-4 rounded-[16px] border border-zk-border py-10 text-center">
              <p className="text-sm font-semibold">Nothing here right now.</p>
              <p className="mt-1 text-[13px] text-zk-muted">No agent is waiting on an answer.</p>
              <Link href="/issues" className="mt-3 inline-block text-[13px] font-semibold text-zk-accent">Clear filters</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 pb-5 sm:px-5">
          <div className="grid grid-cols-[56px_1fr_150px_60px_36px] gap-3 rounded-xl bg-zk-bg px-3 py-2 text-[12px] text-zk-muted max-md:hidden">
            <span>Votes</span><span>Issue</span><span>Status</span><span>Priority</span><span />
          </div>
          <ul>
            {list.map((i) => (
              <li key={i.id} className="grid grid-cols-[56px_1fr] items-center gap-3 border-b border-zk-divider px-3 py-3 last:border-0 md:grid-cols-[56px_1fr_150px_60px_36px]">
                <span className={`inline-flex h-11 w-10 flex-col items-center justify-center rounded-lg border text-[12px] font-bold ${i.status === "in_progress" ? "border-electric-blue/50 text-zk-accent" : "border-amber-300 text-zk-warn-fg"}`}>
                  <ChevronUp className="h-3 w-3" />{i.votes}
                </span>
                <div className="min-w-0">
                  <Link href={`/issues/${i.id}`} className="block truncate text-[13.5px] font-semibold hover:text-zk-accent">{i.title}</Link>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-zk-muted">
                    #{i.id} · {i.type} <span className="inline-flex items-center gap-0.5"><Message className="h-3 w-3" />{i.comments}</span>
                    {i.files ? <span className="inline-flex items-center gap-0.5"><Paperclip className="h-3 w-3" />{i.files}</span> : null}
                    {i.platform && <span>{i.platform}</span>}<span>{i.reported}</span>
                  </p>
                </div>
                <div className="text-xs max-md:col-start-2">
                  {i.status === "in_progress" && i.assignee ? (
                    <><p className="text-zk-text2"><span className="text-emerald-600">⚑</span> {i.assignee}</p>{i.timer && <p className="text-zk-muted">⏱ {i.timer}</p>}</>
                  ) : <Pill tone={i.status === "resolved" ? "ok" : "chip"}>{i.status === "resolved" ? "Done" : i.stage ?? "Open"}</Pill>}
                </div>
                <span className="max-md:hidden"><PriorityBars level={i.priority} /></span>
                <span className="max-md:hidden">{i.assignee ? <Avatar name={i.assignee} size="h-6 w-6 text-[9px]" /> : null}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-zk-muted">{list.length} {view === "all" ? "" : statusTabs.find((t) => t.key === view)?.label.toLowerCase()} issues shown, sorted by top votes</p>
        </div>
      )}
    </Card>
  );
}
