"use client";
// The project owner's home: "Is Zedu OK right now, and what needs me?"
// One verdict at the top, then only the exceptions: what agents undid on their own, what they may not ship alone, and what is
// still being watched. Everything that went live and stayed fine is one collapsed line. Every action changes the page.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Alert, Check, CheckCircle, ChevronDown, Eye, Pulse, Scale, Undo } from "./Icons";
import { Button, Card, Label, Pill } from "./ui";
import { escalated, fine, health, rolledBack, since, watching, type Shipped } from "@/lib/story";
import { me } from "@/lib/data";

type Decision = "pending" | "approved" | "declined" | "asked";

export default function OwnerHome() {
  const [lesson, setLesson] = useState<"pending" | "approved" | "dismissed">("pending");
  const [brand, setBrand] = useState<Decision>("pending");
  const [asking, setAsking] = useState(false);
  const [question, setQuestion] = useState("");
  const [undone, setUndone] = useState<string[]>([]);
  const [showFine, setShowFine] = useState(false);
  const [confirming, setConfirming] = useState<Shipped | null>(null);
  const [watchMin, setWatchMin] = useState(watching.minutes);

  // The change still being watched counts up, so it visibly leaves the watch window during a demo (one "minute" every 2s)
  useEffect(() => {
    if (watchMin >= watching.of) return;
    const t = setTimeout(() => setWatchMin((m) => m + 1), 2000);
    return () => clearTimeout(t);
  }, [watchMin]);

  const needs = (lesson === "pending" ? 1 : 0) + (brand === "pending" ? 1 : 0);
  const watched = watchMin >= watching.of;
  const fineCount = fine.length + (watched ? 1 : 0);

  function undo(item: Shipped) {
    setUndone((u) => [...u, item.id, ...(item.laterId ? [item.laterId] : [])]);
    setConfirming(null);
  }

  function replay() {
    setLesson("pending"); setBrand("pending"); setAsking(false); setQuestion(""); setUndone([]); setShowFine(false); setWatchMin(watching.minutes);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.02em]">Good morning, {me.first}</h1>
          <p className="mt-1 text-sm text-zk-muted">Here&apos;s Zedu since you checked {since}.</p>
        </div>
        <Button href="/settings/shipping"><Scale className="h-4 w-4" /> What agents may ship alone</Button>
      </div>

      {/* The verdict: the answer to "is my product OK?" first */}
      <Card className={`p-5 ${needs ? "border-zk-warn-bd" : "border-zk-ok-fg/30"}`}>
        <div className="flex flex-wrap items-start gap-4">
          <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${needs ? "bg-zk-warn-bg text-zk-warn-fg" : "bg-zk-ok-bg text-zk-ok-fg"}`}>
            {needs ? <Alert className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1" aria-live="polite">
            <p className="text-xl font-extrabold tracking-[-0.01em]">
              {needs ? <>Zedu is fine right now. {needs === 1 ? "1 thing needs" : `${needs} things need`} you.</> : <>All clear. Zedu is fine and nothing needs you.</>}
            </p>
            <p className="mt-1 text-[13.5px] text-zk-text2">
              Agents put {fine.length + 2} changes live overnight. {fineCount} {fineCount === 1 ? "has" : "have"} been fine for 30+ minutes, 1 was undone automatically
              {watched ? "" : ", and 1 is still being watched"}.{undone.length ? ` You undid ${undone.length}.` : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {health.map((h) => <Pill key={h.name} tone="ok"><Pulse className="h-3 w-3" /> {h.name}: {h.value}</Pill>)}
            </div>
          </div>
        </div>
      </Card>

      {/* Needs you */}
      <section className="flex flex-col gap-3">
        <Label>Needs you</Label>

        {/* 1. Undone automatically: approve the lesson so it doesn't happen again */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={lesson === "pending" ? "bad" : "chip"}><Undo className="h-3 w-3" /> Undone automatically{lesson === "pending" ? "" : " · handled"}</Pill>
            <span className="text-xs text-zk-muted">Live at {rolledBack.wentLive} · undone at {rolledBack.undone} · <Link className="text-zk-accent" href={`/issues/${rolledBack.issue}`}>#{rolledBack.issue}</Link></span>
          </div>
          <h2 className="mt-3 text-[16px] font-bold">&ldquo;{rolledBack.what}&rdquo; was taken back</h2>
          <p className="mt-1 text-[13.5px] text-zk-text2">{rolledBack.why}</p>
          <p className="mt-1 text-[13.5px] font-semibold text-zk-ok-fg">{rolledBack.now}</p>
          <div className="mt-4 rounded-[16px] bg-zk-bg p-4">
            <p className="text-[13px] font-semibold">So it doesn&apos;t happen again, {rolledBack.proposedBy} suggest a new rule for every agent:</p>
            <p className="mt-2 border-l-2 border-electric-blue pl-3 text-[13.5px] text-zk-text">{rolledBack.lesson}</p>
            {lesson === "pending" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button primary onClick={() => setLesson("approved")}><Check className="h-4 w-4" /> Add the rule</Button>
                <Button onClick={() => setLesson("dismissed")}>Not needed</Button>
              </div>
            ) : (
              <p className="mt-3 text-[13px] font-semibold text-zk-ok-fg">
                {lesson === "approved" ? "Added to every agent's rules (AGENTS.md). The bell change goes back to its agent to fix and test again." : "Dismissed. The bell change goes back to its agent as it is."}
                <button type="button" className="ml-2 font-normal text-zk-accent underline" onClick={() => setLesson("pending")}>Change</button>
              </p>
            )}
          </div>
        </Card>

        {/* 2. Agents may not ship this alone */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            {brand === "pending" ? <Pill tone="warn"><Scale className="h-3 w-3" /> Waiting for you</Pill>
              : brand === "asked" ? <Pill tone="info">Waiting for the agents&apos; answer</Pill>
              : <Pill tone={brand === "approved" ? "ok" : "chip"}><Check className="h-3 w-3" /> {brand === "approved" ? "Approved by you" : "Declined by you"}</Pill>}
            <span className="text-xs text-zk-muted">{escalated.rule} · <Link className="text-zk-accent" href={`/issues/${escalated.issue}`}>#{escalated.issue}</Link></span>
          </div>
          <h2 className="mt-3 text-[16px] font-bold">{escalated.what}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[["Now", escalated.from], ["Proposed", escalated.to]].map(([label, colour]) => (
              <div key={label} className="rounded-[16px] border border-zk-border p-4">
                <p className="text-xs font-semibold text-zk-muted">{label}</p>
                <span className="mt-2 inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-white" style={{ backgroundColor: colour }}>Send message</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13.5px] text-zk-text2">{escalated.agents}</p>
          <p className="mt-1 text-[13px] text-zk-muted">Where it shows: {escalated.reach}</p>
          {brand === "pending" ? (
            asking ? (
              <form className="mt-3 flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (question.trim()) { setBrand("asked"); setAsking(false); } }}>
                <textarea className="w-full rounded-xl border border-zk-border p-3 text-sm outline-none focus:border-electric-blue" rows={2} placeholder="e.g. Does the green pass the contrast check on white text?" value={question} onChange={(e) => setQuestion(e.target.value)} autoFocus />
                <div className="flex gap-2"><Button type="submit" primary>Send to the agents</Button><Button onClick={() => setAsking(false)}>Cancel</Button></div>
              </form>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button primary onClick={() => setBrand("approved")}><Check className="h-4 w-4" /> Approve and ship</Button>
                <Button onClick={() => setBrand("declined")}>Decline</Button>
                <Button onClick={() => setAsking(true)}>Ask a question</Button>
              </div>
            )
          ) : (
            <p className="mt-3 text-[13px] font-semibold text-zk-ok-fg">
              {brand === "approved" && "Approved. It goes live now and is watched for 30 minutes like everything else."}
              {brand === "declined" && "Declined. The agents closed it and told the person whose agent made it."}
              {brand === "asked" && `Sent: "${question}". The agents will answer here; the change waits until you decide.`}
              <button type="button" className="ml-2 font-normal text-zk-accent underline" onClick={() => setBrand("pending")}>Change</button>
            </p>
          )}
        </Card>

        {needs === 0 && <p className="rounded-[16px] border border-dashed border-zk-border p-4 text-center text-[13px] text-zk-muted">Nothing else needs you. Agents will put anything new here, and in tomorrow&apos;s morning summary.</p>}
      </section>

      {/* Still being watched */}
      {!watched && (
        <section className="flex flex-col gap-3">
          <Label>Still being watched</Label>
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold">{watching.what}</p>
                <p className="mt-1 text-xs text-zk-muted">Live at {watching.at} · {watching.area} · <Link className="text-zk-accent" href={`/issues/${watching.issue}`}>#{watching.issue}</Link> · {watching.checked}</p>
              </div>
              <Button onClick={() => setConfirming({ id: watching.id, what: watching.what, area: watching.area, issue: watching.issue, at: watching.at, checked: watching.checked })}><Undo className="h-4 w-4" /> Undo</Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="h-2 min-w-[140px] flex-1 overflow-hidden rounded-full bg-zk-seg"><div className="h-full rounded-full bg-electric-blue transition-all" style={{ width: `${(watchMin / watching.of) * 100}%` }} /></div>
              <span className="text-xs text-zk-muted"><Eye className="mr-1 inline h-3.5 w-3.5" />{watchMin} of {watching.of} min · {watching.signals}</span>
            </div>
            <p className="mt-2 text-xs text-zk-muted">If errors go up while it&apos;s watched, agents undo it on their own and it moves to &ldquo;Needs you&rdquo;.</p>
          </Card>
        </section>
      )}

      {/* Everything that was fine: one line */}
      <Card>
        <button type="button" onClick={() => setShowFine((s) => !s)} aria-expanded={showFine} className="flex w-full items-center gap-3 px-5 py-4 text-left">
          <CheckCircle className="h-5 w-5 shrink-0 text-zk-ok-fg" />
          <span className="flex-1 text-[14px]"><b>{fineCount} changes went live and have been fine for 30+ minutes.</b> <span className="text-zk-muted">Nothing to do.</span></span>
          <span className="text-[13px] font-semibold text-zk-accent">{showFine ? "Hide" : "Show them"}</span>
          <ChevronDown className={`h-4 w-4 text-zk-accent transition-transform ${showFine ? "rotate-180" : ""}`} />
        </button>
        {showFine && (
          <ul className="border-t border-zk-divider">
            {[...fine, ...(watched ? [{ ...watching, id: watching.id } as Shipped] : [])].map((f) => {
              const gone = undone.includes(f.id);
              return (
                <li key={f.id} className="flex flex-wrap items-center gap-3 border-b border-zk-divider px-5 py-3 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className={`text-[13.5px] font-medium ${gone ? "text-zk-muted line-through" : ""}`}>{f.what}</p>
                    <p className="text-xs text-zk-muted">{f.area} · live at {f.at} · <Link className="text-zk-accent" href={`/issues/${f.issue}`}>#{f.issue}</Link> · {f.checked}</p>
                  </div>
                  {gone ? <Pill>Undone by you · agents told · #{f.issue} reopened</Pill> : <Button className="h-8 text-[13px]" onClick={() => setConfirming(f)}><Undo className="h-3.5 w-3.5" /> Undo</Button>}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <p className="text-center text-xs text-zk-muted">
        Mock-up with fake data. <Link href="/about" className="text-zk-accent underline">How this works (video)</Link> · <button type="button" onClick={replay} className="text-zk-accent underline">Replay the night</button> · <Link href="/dashboard/today" className="text-zk-accent underline">See this page as Ziki shows it today</Link>
      </p>

      {confirming && <UndoDialog item={confirming} onCancel={() => setConfirming(null)} onConfirm={() => undo(confirming)} />}
    </div>
  );
}

function UndoDialog({ item, onCancel, onConfirm }: { item: Shipped; onCancel: () => void; onConfirm: () => void }) {
  const keep = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    keep.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 sm:items-center" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <Card className="w-full max-w-md p-5 shadow-xl">
        <div role="dialog" aria-modal="true" aria-labelledby="undo-title">
          <h2 id="undo-title" className="text-lg font-extrabold">Undo this change?</h2>
          <p className="mt-1 text-[13.5px] text-zk-text2">&ldquo;{item.what}&rdquo;</p>
          {item.before && <p className="mt-3 text-[13px]">People will see <b>&ldquo;{item.before}&rdquo;</b> again instead of <b>&ldquo;{item.after}&rdquo;</b>.</p>}
          {item.dependsOnIt && (
            <p className="mt-3 rounded-xl bg-zk-warn-bg p-3 text-[13px] text-zk-warn-fg"><b>1 later change builds on this:</b> {item.dependsOnIt}. Both will be undone.</p>
          )}
          <p className="mt-3 text-[13px] text-zk-muted">Agents put the old version live within a few minutes, reopen #{item.issue} and tell the person whose agent made it. Nothing else changes.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={keep} type="button" onClick={onCancel} className="inline-flex h-10 items-center rounded-full border border-zk-border bg-zk-surface px-4 text-sm font-semibold hover:bg-zk-chip">Keep it</button>
            <button type="button" onClick={onConfirm} className="inline-flex h-10 items-center gap-2 rounded-full border border-zk-bad-bd bg-zk-bad-bg px-4 text-sm font-semibold text-zk-bad-fg hover:bg-zk-bad-soft">
              <Undo className="h-4 w-4" /> Undo it
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
