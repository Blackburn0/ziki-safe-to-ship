import Link from "next/link";
import { ArrowUpRight, ChevronUp, Layers, Message, Plus } from "@/components/Icons";
import { Button, Card, Pill } from "@/components/ui";
import { agents, me, myIssues, weeklyPoints } from "@/lib/data";

function Stat({ title, value, badge, tone, note, href }: { title: string; value: string; badge: string; tone: "info" | "ok" | "chip"; note: string; href: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <h2 className="text-[15px] font-semibold text-zk-text">{title}</h2>
        <Link href={href} aria-label={`Open ${title}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zk-border hover:bg-zk-chip"><ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </div>
      <p className="mt-3 text-[34px] leading-none font-extrabold tracking-[-0.02em]">{value}</p>
      <p className="mt-3 flex items-center gap-2 text-[13px] text-zk-muted"><Pill tone={tone}>{badge}</Pill>{note}</p>
    </Card>
  );
}

export default function Dashboard() {
  const max = Math.max(...weeklyPoints.map((w) => w.pts), 500);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em]">Welcome back, {me.first}</h1>
          <p className="mt-1 text-sm text-zk-muted">Issues, votes and your points for Ziki at a glance.</p>
        </div>
        <Button href="/issues/new"><Plus className="h-4 w-4" /> New issue</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Points" value={String(me.points)} badge="Goal reached" tone="info" note="500 required this week" href="/workers" />
        <Stat title="Created by me" value="18" badge="+18" tone="ok" note="in the last 30 days" href="/issues?status=all" />
        <Stat title="Assigned to me" value="6" badge="0" tone="chip" note="high priority" href="/issues?status=all" />
        <Stat title="Resolved issues" value="5" badge="83%" tone="chip" note="of issues assigned to me" href="/issues?status=resolved" />
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-[15px] font-semibold">Issues assigned to me <span className="ml-1 text-[13px] font-normal text-zk-muted">{myIssues.length} issues · sorted by top votes</span></h2>
          <Button href="/issues?status=all" className="h-8 text-[13px]">View all issues</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="bg-zk-tint text-[11px] font-bold tracking-[0.06em] text-zk-accent uppercase">
                {["Votes", "Issue", "Type", "Priority", "Status", "Stage", "Reported"].map((h, n) => (
                  <th key={h} className={`px-3 py-2.5 ${n === 0 ? "rounded-l-full pl-4" : ""} ${n === 6 ? "rounded-r-full" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...myIssues].sort((a, b) => b.votes - a.votes).map((i) => (
                <tr key={i.id} className="border-b border-zk-divider last:border-0">
                  <td className="px-3 py-3 pl-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${i.votes > 20 ? "bg-electric-blue-strong text-white" : "border border-zk-border"}`}><ChevronUp className="h-3 w-3" />{i.votes}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><Layers className="h-4 w-4" /></span>
                      <div className="min-w-0">
                        <Link href={`/issues/${i.id}`} className="block max-w-[340px] truncate font-semibold hover:text-zk-accent">{i.title}</Link>
                        <span className="text-xs text-zk-muted">#{i.id} · <Message className="inline h-3 w-3" /> {i.comments} comment{i.comments === 1 ? "" : "s"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-zk-text2">{i.type}</td>
                  <td className="px-3 py-3"><Pill tone={i.priority === "Medium" ? "warn" : i.priority === "High" ? "bad" : "chip"}>{i.priority}</Pill></td>
                  <td className="px-3 py-3"><Pill tone={i.status === "resolved" ? "chip" : "info"}>● {i.status === "resolved" ? "Resolved" : i.status === "open" ? "Open" : "In progress"}</Pill></td>
                  <td className="px-3 py-3 text-zk-muted">{i.stage ?? "—"}</td>
                  <td className="px-3 py-3 text-zk-muted">{i.reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[13px] text-zk-muted">Showing {myIssues.length} issues</p>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold">Your points</h2>
            <p className="text-[13px] text-zk-muted">Points earned each week, last 8 weeks · 500 pts required, more is welcome</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full bg-zk-seg p-1 text-[13px]">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((t) => (
                <span key={t} className={`rounded-full px-3 py-1 ${t === "Weekly" ? "bg-zk-surface font-semibold shadow-sm" : "text-zk-text2"}`}>{t}</span>
              ))}
            </div>
            <p className="text-right"><span className="block text-2xl font-extrabold">{me.points}</span><span className="text-xs text-zk-muted">pts in this range</span></p>
          </div>
        </div>
        <div className="mt-6 flex h-40 items-end gap-3">
          {weeklyPoints.map((w) => (
            <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[11px] text-zk-muted">{w.pts || ""}</span>
              <div className={`w-full rounded-t-lg ${w.pts >= 300 ? "bg-electric-blue" : "bg-zk-info-bg"}`} style={{ height: `${Math.max(4, (w.pts / max) * 110)}px` }} />
              <span className="text-[11px] text-zk-muted">{w.week}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-[15px] font-semibold">Your agents <span className="ml-1 text-zk-muted">{agents.length}</span></h2>
        <table className="mt-3 w-full text-left text-[13px]">
          <thead><tr className="text-[11px] font-bold tracking-[0.06em] text-zk-muted uppercase"><th className="py-2">Agent</th><th>Status</th><th>Current activity</th><th>Last seen</th></tr></thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.name} className="border-t border-zk-divider">
                <td className="py-3"><span className="font-semibold">{a.name}</span> <span className="text-zk-muted">{a.model}</span></td>
                <td><Pill>{a.status}</Pill></td><td className="text-zk-text2">{a.activity}</td><td className="text-zk-muted">{a.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
