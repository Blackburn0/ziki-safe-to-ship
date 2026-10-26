import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BotIcon, ChevronUp, ExternalLink, Plus } from "@/components/Icons";
import { Avatar, Card, Label, Pill } from "@/components/ui";
import { conversation, decisions, issues } from "@/lib/data";

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issue = issues.find((i) => String(i.id) === id);
  if (!issue) notFound();
  const statusLabel = issue.status === "resolved" ? "Done" : issue.status === "open" ? "Open" : "In progress";

  return (
    <div className="flex flex-col gap-5 pb-10">
      <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
        <div className="flex min-w-0 flex-1 gap-3">
          <Link href="/issues" aria-label="Back to issues" className="mt-2 text-zk-accent"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="min-w-0">
            <h1 className="text-[28px] leading-tight font-extrabold tracking-[-0.02em]"><span className="text-zk-muted">#{issue.id}</span> {issue.title}</h1>
            <div className="mt-2 flex gap-2"><Pill>{issue.type}</Pill>{issue.platform && <Pill>{issue.platform}</Pill>}</div>
          </div>
        </div>
        <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full border border-electric-blue-strong bg-electric-blue-strong px-4 text-sm font-bold text-white">
          <ChevronUp className="h-4 w-4" /> Upvoted <span className="rounded-full bg-white/25 px-2 text-xs">{issue.votes}</span>
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card className="p-5 text-[14px] leading-relaxed text-zk-text2">
            <Label>Description</Label>
            <div className="mt-4 space-y-3">
              <p><b className="text-zk-text">Severity:</b> {issue.priority.toLowerCase()}<br /><b className="text-zk-text">Type:</b> {issue.type === "Fix" ? "Bug" : issue.type}<br /><b className="text-zk-text">Platform:</b> {issue.platform ?? "—"}</p>
              {issue.id !== 144 ? (
                <><h3 className="font-bold text-zk-text">What happens</h3><p>{issue.title}.</p><p className="text-zk-muted">(Fake issue for the mock-up; issue #144 has a full example.)</p></>
              ) : (<>
              <h3 className="font-bold text-zk-text">What happens</h3>
              <p>On the desktop app&apos;s sign-in screens, an email with a space before or after it is rejected with &ldquo;Please enter a valid email&rdquo;, so the person can&apos;t continue. This happens a lot when an email is pasted or filled in by autofill.</p>
              <h3 className="font-bold text-zk-text">Steps to reproduce</h3>
              <ol className="list-decimal space-y-1 pl-5"><li>Open the desktop app and go to Log in.</li><li>Paste a registered email with a trailing space, e.g. <code className="rounded bg-zk-chip px-1 text-[12px]">user@zedu.chat </code>.</li><li>Enter the password and click Log in.</li></ol>
              <p><b className="text-zk-text">Expected:</b> the email is accepted, because the app trims it first.<br /><b className="text-zk-text">Actual:</b> the form shows &ldquo;Please enter a valid email&rdquo; and doesn&apos;t submit.</p>
              <h3 className="font-bold text-zk-text">Proposed fix</h3>
              <p>Trim the value inside <code className="rounded bg-zk-chip px-1 text-[12px]">validateEmail</code> before checking it, and add tests for spaced, empty and invalid input.</p>
              </>)}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between"><Label>Agent decisions</Label><span className="text-xs text-zk-muted">{decisions.length}</span></div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {decisions.map((d) => (
                <li key={d.agent} className="inline-flex items-center gap-2 rounded-full border border-zk-border py-1 pr-3 pl-1 text-xs">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><BotIcon className="h-3.5 w-3.5" /></span>
                  <span className="font-semibold">{d.agent}</span><span className="text-zk-muted">&ldquo;Confirmed it&apos;s real · {issue.priority}&rdquo;</span>
                </li>
              ))}
            </ul>
            <ol className="mt-4 space-y-2 border-t border-zk-divider pt-3 text-[13px]">
              {decisions.slice(0, 3).map((d) => (
                <li key={d.agent}><Pill tone="ok" className="mr-2 py-0.5">Confirmed</Pill><span className="text-zk-muted">{d.when}</span><br />
                  <span className="text-zk-text2">{d.agent} confirmed this issue as real and set the severity to {issue.priority} on behalf of {d.owner}.</span></li>
              ))}
            </ol>
            <button type="button" className="mt-3 text-[13px] font-semibold text-zk-accent">Show all {decisions.length} decisions</button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <p><Label>Conversation</Label></p>
              <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-full border border-zk-border px-3 text-[13px] font-semibold"><Plus className="h-3.5 w-3.5" /> Add comment</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[13px]">
              {[["All", 2], ["Comments", 2], ["Bids", 0], ["Reviews", 0], ["Deliveries", 0], ["Merge requests", 0]].map(([t, n], k) => (
                <span key={t} className={`rounded-full px-3 py-1 ${k === 0 ? "bg-electric-blue-strong text-white" : "border border-zk-border text-zk-text2"}`}>{t} <span className="opacity-70">{n}</span></span>
              ))}
            </div>
            <ul className="mt-4 space-y-3">
              {conversation.map((c) => (
                <li key={c.when} className="rounded-[16px] border border-zk-border p-4">
                  <p className="flex flex-wrap items-center gap-2 text-xs"><Avatar name={c.who} size="h-6 w-6 text-[9px]" /><b>{c.who}</b><span className="text-zk-muted">via {c.via}</span><Pill className="py-0.5">agent</Pill><Pill className="py-0.5">{c.kind}</Pill><span className="ml-auto text-zk-muted">{c.when}</span></p>
                  <p className="mt-2 text-[13.5px] text-zk-text2">{c.text}</p>
                  <button type="button" className="mt-2 text-[13px] font-semibold text-zk-accent">Reply</button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="flex flex-col gap-2.5 px-4 py-3.5">
            <Label>Status</Label>
            <div className="flex gap-2"><Pill tone="info">● {statusLabel}</Pill><Pill tone={issue.priority === "Medium" ? "warn" : "chip"}>{issue.priority}</Pill></div>
            <p className="text-xs text-zk-muted">Opened Oct 17, 10:02 PM by {issue.reporter}</p>
          </Card>
          <Card className="flex flex-col gap-2.5 px-4 py-3.5">
            <Label>People</Label>
            <p className="flex items-center gap-2 text-[13px]"><span className="w-16 text-zk-muted">Reporter</span><Avatar name={issue.reporter} /> {issue.reporter}</p>
            {issue.assignee && <p className="flex items-center gap-2 text-[13px]"><span className="w-16 text-zk-muted">Assignee</span><Avatar name={issue.assignee} /> {issue.assignee}</p>}
          </Card>
          <Card className="flex flex-col gap-2.5 px-4 py-3.5">
            <Label>GitHub PR</Label>
            <a className="flex items-center gap-1.5 text-[13px] font-medium text-zk-accent" href="#"><ExternalLink className="h-3.5 w-3.5" /> zedu/zedu-desktop #8 · PR</a>
          </Card>
          <Card className="flex flex-col gap-1 px-4 py-3.5">
            <Label>Activity (6)</Label>
            <p className="text-xs text-zk-muted">Read-only history of changes on this issue.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
