"use client";
// Inbox → Needs your call: bugs whose fix the agents couldn't agree on, in four folded sections by how serious they are.
// Open a section to see its bugs: one line each, with the split shown as a small tug of war ("3 say ship · 2 say hold").
// A row opens in place to show every agent's reason and how they got stuck. Deciding pulls the rope to your side and the
// row slides away; every decision can be undone for a few seconds.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calls, SEVERITIES, SEVERITY, waited, type Call, type Severity, type Side } from "@/lib/calls";
import { BotIcon, Check, ChevronDown, Undo } from "./Icons";

const LOOK: Record<Severity, { tile: string; dot: string; halo?: boolean }> = {
  critical: { tile: "bg-rose-50 text-rose-600", dot: "bg-rose-500", halo: true },
  high: { tile: "bg-orange-50 text-orange-600", dot: "bg-orange-500" },
  medium: { tile: "bg-sky-50 text-sky-600", dot: "bg-sky-500" },
  low: { tile: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};
const COLS = "sm:grid sm:grid-cols-[minmax(0,1fr)_160px_88px_150px] sm:items-center sm:gap-4";

function TugOfWar({ c, pull }: { c: Call; pull?: Side }) {
  const ship = c.verdicts.filter((v) => v.side === "ship").length;
  const hold = c.verdicts.length - ship;
  const pct = pull === "ship" ? 100 : pull === "hold" ? 0 : (ship / c.verdicts.length) * 100;
  return (
    <span className="block w-40" aria-label={`${ship} agents say ship the fix, ${hold} say hold it`}>
      <span className="relative flex h-2 rounded-full bg-amber-300 bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(255,255,255,.35)_4px_6px)]">
        <span className="rounded-full bg-emerald-500 transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-zk-surface bg-zk-text shadow transition-[left] duration-500 ease-out group-hover:animate-[wiggle_.6s_ease-in-out]" style={{ left: `${pct}%` }} />
      </span>
      <span className="mt-1.5 flex justify-between text-[11px] font-semibold">
        <span className="text-emerald-700">{ship} {ship === 1 ? "says" : "say"} ship</span>
        <span className="text-amber-700">{hold} {hold === 1 ? "says" : "say"} hold</span>
      </span>
    </span>
  );
}

function AgentName({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zk-tint text-zk-accent"><BotIcon className="h-3 w-3" /></span>
      {name}
    </span>
  );
}

function Side({ c, side }: { c: Call; side: Side }) {
  const list = c.verdicts.filter((v) => v.side === side);
  return (
    <div className={`min-w-0 flex-1 rounded-xl p-3 ${side === "ship" ? "bg-emerald-50" : "bg-amber-50"}`}>
      <p className={`text-[11px] font-bold tracking-[0.06em] uppercase ${side === "ship" ? "text-emerald-700" : "text-amber-700"}`}>
        {side === "ship" ? "Ship the fix" : "Hold it"} · {list.length} {list.length === 1 ? "agent" : "agents"}
      </p>
      <ul className="mt-2 space-y-1.5">
        {list.map((v) => <li key={v.agent} className="flex flex-wrap items-baseline gap-x-2"><AgentName name={v.agent} /><span className="text-zk-text2">{v.says}</span></li>)}
      </ul>
    </div>
  );
}

function Row({ c, i, pull, isOpen, onOpen, onDecide }: {
  c: Call; i: number; pull?: Side; isOpen: boolean; onOpen: () => void; onDecide: (side: Side) => void;
}) {
  return (
    <li
      className={`group animate-[rise_.35s_ease-out_both] border-t border-zk-divider transition-all duration-500 ${pull ? `opacity-0 ${pull === "ship" ? "translate-x-6" : "-translate-x-6"}` : ""}`}
      style={{ animationDelay: `${Math.min(i, 12) * 25}ms` }}
    >
      <div className={`${COLS} flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-2 py-3 transition-colors hover:bg-zk-bg`}>
        <button type="button" aria-expanded={isOpen} onClick={onOpen} className="flex min-w-0 cursor-pointer items-center gap-2 text-left max-sm:basis-full">
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-zk-muted transition-transform ${isOpen ? "" : "-rotate-90"}`} />
          <span className="truncate text-[13.5px] font-semibold">{c.title}</span>
        </button>
        <span className="max-sm:ml-5.5"><TugOfWar c={c} pull={pull} /></span>
        <span className="text-[12px] text-zk-muted sm:text-right"><span className="sm:hidden">waiting </span>{waited(c.ageMin)}</span>
        <span className="ml-auto flex gap-1.5 sm:justify-end">
          <button type="button" onClick={() => onDecide("ship")} className="rounded-full bg-gradient-to-b from-[#4f7dff] to-electric-blue-strong px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition active:scale-95">Ship fix</button>
          <button type="button" onClick={() => onDecide("hold")} className="rounded-full border border-zk-border bg-zk-surface px-3.5 py-1.5 text-[12px] font-semibold transition hover:bg-amber-50 active:scale-95">Hold</button>
        </span>
      </div>
      {isOpen && (
        <div className="mb-3 animate-[rise_.25s_ease-out_both] space-y-4 rounded-2xl border border-zk-border bg-zk-surface p-4 text-[12.5px] sm:ml-7">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div><dt className="text-[11px] font-bold text-zk-muted uppercase">What it does to people</dt><dd className="mt-0.5">{c.impact}</dd></div>
            <div><dt className="text-[11px] font-bold text-zk-muted uppercase">What the fix changes</dt><dd className="mt-0.5">{c.fix}</dd></div>
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row"><Side c={c} side="ship" /><Side c={c} side="hold" /></div>
          <div>
            <p className="text-[11px] font-bold text-zk-muted uppercase">How they got stuck</p>
            <ol className="mt-1.5 space-y-1.5 border-l-2 border-zk-border pl-3">
              {c.thread.map((m, k) => <li key={k} className="flex flex-wrap items-baseline gap-x-2"><AgentName name={m.agent} /><span className="text-zk-text2">{m.text}</span></li>)}
            </ol>
            <Link href="/issues/143" className="mt-2 inline-block font-semibold text-zk-accent">Open the issue and the full discussion →</Link>
          </div>
        </div>
      )}
    </li>
  );
}

export default function NeedsYourCall() {
  const [done, setDone] = useState<Record<string, Side>>({});
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [pulling, setPulling] = useState<{ id: string; side: Side } | null>(null);
  const [toast, setToast] = useState<{ text: string; id: string } | null>(null);

  const left = useMemo(() => calls.filter((c) => !done[c.id]), [done]);

  // the rope pulls to the side you chose, the row slides away, then it's gone
  function decide(c: Call, side: Side) {
    if (pulling) return;
    setPulling({ id: c.id, side });
    setTimeout(() => {
      setDone((d) => ({ ...d, [c.id]: side }));
      setPulling(null);
      setOpen((o) => (o === c.id ? null : o));
      setToast({ id: c.id, text: side === "ship" ? "Shipped: the fix goes live" : "Held: sent back to the agents" });
    }, 650);
  }
  function undo() {
    if (!toast) return;
    setDone((d) => Object.fromEntries(Object.entries(d).filter(([id]) => id !== toast.id)));
    setToast(null);
  }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="mt-3">
      <p className="text-[13px] text-zk-muted">Bugs your agents couldn&apos;t agree on how to fix. Open a group to decide.</p>

      {SEVERITIES.map((s) => {
        const items = left.filter((c) => c.severity === s);
        const isOpen = !!openSection[s] && items.length > 0;
        const look = LOOK[s];
        return (
          <section key={s} className={`mt-3 rounded-2xl border bg-zk-surface transition-shadow ${isOpen ? "border-zk-border shadow-[0_10px_30px_-18px_rgba(20,40,90,.35)]" : "border-zk-border hover:shadow-[0_8px_24px_-16px_rgba(20,40,90,.35)]"}`}>
            <button type="button" aria-expanded={isOpen} disabled={!items.length} onClick={() => setOpenSection((o) => ({ ...o, [s]: !o[s] }))} className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:gap-4">
              <span className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${look.tile}`}>
                {look.halo && items.length > 0 && <span className={`absolute h-3 w-3 animate-ping rounded-full ${look.dot} opacity-50`} />}
                <span className={`relative h-3 w-3 rounded-full ${look.dot}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-bold">{SEVERITY[s].label}</span>
                <span className="block truncate text-[12px] text-zk-muted">{SEVERITY[s].means}</span>
              </span>
              {items.length ? (
                <span className="text-right">
                  <span key={items.length} className="block animate-[pop_.35s_cubic-bezier(.3,1.6,.5,1)] text-2xl leading-none font-extrabold tabular-nums">{items.length}</span>
                  <span className="text-[11px] text-zk-muted">{items.length === 1 ? "bug" : "bugs"}</span>
                </span>
              ) : (
                <span className="inline-flex animate-[pop_.4s_cubic-bezier(.3,1.6,.5,1)] items-center gap-1 rounded-full bg-zk-ok-bg px-2.5 py-1 text-[12px] font-semibold text-zk-ok-fg"><Check className="h-3.5 w-3.5" /> All settled</span>
              )}
              <ChevronDown className={`h-4 w-4 shrink-0 text-zk-muted transition-transform duration-300 ${isOpen ? "" : "-rotate-90"} ${items.length ? "" : "invisible"}`} />
            </button>

            {isOpen && (
              <div className="px-2 pb-2 sm:px-3">
                <div className={`${COLS} hidden px-2 pb-1.5 text-[11px] font-bold tracking-[0.06em] text-zk-muted uppercase`}>
                  <span className="pl-5.5">Bug</span><span>What the agents say</span><span className="text-right">Waiting</span><span className="text-right">Your call</span>
                </div>
                <ul>
                  {items.map((c, i) => (
                    <Row key={c.id} c={c} i={i} pull={pulling?.id === c.id ? pulling.side : undefined} isOpen={open === c.id}
                      onOpen={() => setOpen(open === c.id ? null : c.id)} onDecide={(side) => decide(c, side)} />
                  ))}
                </ul>
              </div>
            )}
          </section>
        );
      })}

      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 animate-[rise_.25s_ease-out_both] items-center gap-3 rounded-full bg-zk-text px-4 py-2 text-[13px] text-white shadow-lg lg:bottom-6">
          <Check className="h-4 w-4" /> {toast.text}
          <button type="button" onClick={undo} className="inline-flex items-center gap-1 font-semibold text-[#9fc0ff]"><Undo className="h-3.5 w-3.5" /> Undo</button>
        </div>
      )}
    </div>
  );
}
