"use client";
// Inbox → Needs your call: only the items agents could not take live on their own, as one-line rows you can scan and clear.
// Each row says why it's here (the tag), where it stopped (the journey dots), what the agents think (their faces), and has one
// main action. Groups have bulk actions, rows open in place for context, and the keyboard works (J/K, Enter, A, X, Esc).
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { age, AGENTS, calls, liveOnTheirOwn, STAGES, TAGS, type Call, type Tag } from "@/lib/calls";
import { Check, ChevronDown, Undo } from "./Icons";

type Outcome = { text: string };
const ORDER: Tag[] = ["rollback", "big", "proof", "split"];
const TONE: Record<string, string> = {
  warn: "bg-zk-warn-bg text-zk-warn-fg", info: "bg-zk-info-bg text-zk-info-fg", chip: "bg-zk-chip text-zk-text2", bad: "bg-zk-bad-bg text-zk-bad-fg",
};
const FACE = ["#f7b267", "#9ad1d4", "#f4845f", "#b8de6f", "#cdb4db", "#ffd166", "#90be6d", "#f9a1bc", "#a0c4ff", "#ffadad", "#bdb2ff", "#caffbf"];

function TagPill({ tag }: { tag: Tag }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold whitespace-nowrap ${TONE[TAGS[tag].tone]}`}>{TAGS[tag].label}</span>;
}

function Journey({ c }: { c: Call }) {
  return (
    <span className="inline-flex items-center gap-[3px]" title={`Stopped at ${STAGES[c.stage]}`} aria-label={`Stopped at ${STAGES[c.stage]}`}>
      {STAGES.map((s, i) => (
        <span key={s} className={`h-2 w-2 rounded-full ${i < c.stage ? "bg-electric-blue" : i === c.stage ? (c.tag === "rollback" ? "bg-zk-bad-fg ring-2 ring-zk-bad-bg" : "bg-zk-warn-fg ring-2 ring-zk-warn-bg") : "bg-zk-border"}`} />
      ))}
    </span>
  );
}

function Face({ agent, ok, size = "h-6 w-6" }: { agent: string; ok: boolean; size?: string }) {
  const colour = FACE[AGENTS.indexOf(agent) % FACE.length];
  return (
    <span className={`relative inline-flex ${size} shrink-0 items-center justify-center rounded-full border-2 border-zk-surface text-[10px] font-bold text-zk-text`} style={{ backgroundColor: colour }}>
      {agent[0]}
      <span className={`absolute -right-1 -bottom-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-zk-surface text-[8px] text-white ${ok ? "bg-zk-ok-fg" : "bg-zk-bad-fg"}`}>{ok ? "✓" : "✕"}</span>
    </span>
  );
}

function Faces({ c }: { c: Call }) {
  const yes = c.verdicts.filter((v) => v.ok).length;
  return (
    <span className="inline-flex items-center gap-1.5 sm:w-[120px]" title={c.verdicts.map((v) => `${v.agent}: ${v.says}`).join("\n")}>
      <span className="flex -space-x-1.5">{c.verdicts.map((v) => <Face key={v.agent} agent={v.agent} ok={v.ok} />)}</span>
      <span className="text-[11px] font-semibold text-zk-muted tabular-nums">{yes}–{c.verdicts.length - yes}</span>
    </span>
  );
}

function Shot({ label, good }: { label: string; good?: boolean }) {
  return (
    <figure className="w-36 shrink-0">
      <div className={`flex h-20 flex-col gap-1.5 rounded-lg border p-2 ${good ? "border-zk-ok-fg/40 bg-zk-ok-bg" : "border-zk-border bg-zk-bg"}`}>
        <span className="h-2 w-1/2 rounded bg-zk-border" /><span className="h-2 w-3/4 rounded bg-zk-border" />
        <span className={`mt-auto h-4 w-1/2 rounded ${good ? "bg-zk-ok-fg" : "bg-electric-blue-strong"}`} />
      </div>
      <figcaption className="mt-1 text-[11px] text-zk-muted">{label}</figcaption>
    </figure>
  );
}

export default function NeedsYourCall() {
  const [done, setDone] = useState<Record<string, Outcome>>({});
  const [filter, setFilter] = useState<Tag | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [focus, setFocus] = useState(0);
  const [menu, setMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ids: string[] } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const left = useMemo(() => calls.filter((c) => !done[c.id]), [done]);
  const shown = useMemo(() => left.filter((c) => filter === "all" || c.tag === filter), [left, filter]);
  const groups = ORDER.map((tag) => ({ tag, items: shown.filter((c) => c.tag === tag) })).filter((g) => g.items.length);
  const flat = groups.flatMap((g) => g.items);
  const count = (t: Tag) => left.filter((c) => c.tag === t).length;

  function resolve(ids: string[], text: string) {
    setDone((d) => ({ ...d, ...Object.fromEntries(ids.map((id) => [id, { text }])) }));
    setSelected((s) => s.filter((id) => !ids.includes(id)));
    setOpen((o) => (o && ids.includes(o) ? null : o));
    setMenu(null);
    setToast({ text: ids.length === 1 ? text : `${text} · ${ids.length} items`, ids });
  }
  function undo() {
    if (!toast) return;
    setDone((d) => Object.fromEntries(Object.entries(d).filter(([id]) => !toast.ids.includes(id))));
    setToast(null);
  }
  const main = (c: Call) => resolve([c.id], c.tag === "big" ? "Approved: going live" : c.tag === "proof" ? "Sent back for screenshots" : c.tag === "rollback" ? "Note added to project notes" : "Decided");
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // keyboard: J/K move, Enter opens, A does the main action, X selects, Esc closes
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as Element | null)?.closest?.("input, textarea, select")) return;
      const c = flat[Math.min(focus, flat.length - 1)];
      if (e.key === "j") setFocus((f) => Math.min(flat.length - 1, f + 1));
      else if (e.key === "k") setFocus((f) => Math.max(0, f - 1));
      else if (e.key === "Enter" && c) setOpen((o) => (o === c.id ? null : c.id));
      else if (e.key === "a" && c && c.tag !== "split") main(c);
      else if (e.key === "x" && c) toggle(c.id);
      else if (e.key === "Escape") { setOpen(null); setSelected([]); setMenu(null); }
      else return;
      e.preventDefault();
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });
  useEffect(() => { listRef.current?.querySelector<HTMLElement>(`[data-row="${flat[focus]?.id}"]`)?.scrollIntoView({ block: "nearest" }); }, [focus]); // eslint-disable-line react-hooks/exhaustive-deps

  const selItems = left.filter((c) => selected.includes(c.id));
  const sameTag = selItems.length && selItems.every((c) => c.tag === selItems[0].tag) ? selItems[0].tag : null;

  return (
    <div className="mt-4" ref={listRef}>
      <p className="text-[13px] text-zk-muted"><b className="text-[15px] text-zk-text">{left.length} need you</b> · {liveOnTheirOwn.toLocaleString()} went live on their own this week</p>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by why it's here">
        {(["all", ...ORDER] as const).map((t) => (
          <button key={t} type="button" role="tab" aria-selected={filter === t} onClick={() => { setFilter(t); setFocus(0); }}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${filter === t ? "border-electric-blue-strong bg-zk-tint text-zk-accent" : "border-zk-border text-zk-text2 hover:bg-zk-chip"}`}>
            {t === "all" ? "All" : TAGS[t].label} <span className="font-mono text-[11px] opacity-70">{t === "all" ? left.length : count(t)}</span>
          </button>
        ))}
        <span className="ml-auto hidden items-center gap-1 text-[11px] text-zk-muted md:inline-flex">
          {[["J", "K"], ["Enter"], ["A"], ["X"]].map((ks, i) => <span key={i}>{ks.map((k) => <kbd key={k} className="mx-0.5 rounded border border-zk-border bg-zk-surface px-1 font-mono">{k}</kbd>)}{["move", "open", "do it", "select"][i]}</span>)}
        </span>
      </div>

      {left.length === 0 ? (
        <div className="mt-6 rounded-[16px] border border-zk-border py-14 text-center">
          <span className="inline-flex h-14 w-14 animate-[pop_.5s_cubic-bezier(.3,1.6,.5,1)] items-center justify-center rounded-full bg-zk-ok-bg text-zk-ok-fg"><Check className="h-7 w-7" /></span>
          <p className="mt-3 text-lg font-extrabold">All clear</p>
          <p className="text-[13px] text-zk-muted">Agents will bring anything new here.</p>
        </div>
      ) : groups.map((g) => {
        const ids = g.items.map((c) => c.id);
        const allOn = ids.every((id) => selected.includes(id));
        return (
          <section key={g.tag} className="mt-5" aria-label={TAGS[g.tag].label}>
            <div className="flex items-center gap-2 border-b border-zk-divider pb-2">
              <input type="checkbox" aria-label={`Select all ${TAGS[g.tag].label}`} checked={allOn} onChange={() => setSelected((s) => (allOn ? s.filter((id) => !ids.includes(id)) : [...new Set([...s, ...ids])]))} className="h-4 w-4 accent-[var(--color-electric-blue-strong)]" />
              <TagPill tag={g.tag} /><span className="font-mono text-[12px] text-zk-muted">{g.items.length}</span>
              {TAGS[g.tag].bulk ? (
                <button type="button" onClick={() => resolve(ids, g.tag === "big" ? "Approved: going live" : g.tag === "proof" ? "Sent back for screenshots" : "Notes added")} className="ml-auto rounded-full border border-zk-border px-3 py-1 text-[12px] font-semibold hover:bg-zk-chip">{TAGS[g.tag].bulk} {g.items.length}</button>
              ) : <span className="ml-auto text-[12px] text-zk-muted">Decide each one</span>}
            </div>
            <ul>
              {g.items.map((c) => {
                const i = flat.indexOf(c);
                const isOpen = open === c.id;
                return (
                  <li key={c.id} data-row={c.id} className={`border-b border-zk-divider ${i === focus ? "bg-zk-tint/60" : ""}`}>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-2.5 pl-1 sm:flex-nowrap" onClick={() => { setFocus(i); setOpen(isOpen ? null : c.id); }}>
                      <input type="checkbox" aria-label={`Select ${c.title}`} checked={selected.includes(c.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggle(c.id)} className="h-4 w-4 shrink-0 accent-[var(--color-electric-blue-strong)]" />
                      <button type="button" aria-expanded={isOpen} className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left max-sm:basis-[calc(100%-2rem)]">
                        <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-zk-muted transition-transform ${isOpen ? "" : "-rotate-90"}`} />
                        <span className="truncate text-[13.5px] font-semibold">{c.title}</span>
                        <span className="shrink-0 font-mono text-[11px] text-zk-muted">#{c.issue}</span>
                      </button>
                      <span className="flex items-center gap-3 max-sm:ml-7">
                        <Journey c={c} />
                        <Faces c={c} />
                        <span className="w-7 text-right font-mono text-[11px] text-zk-muted">{age(c.ageMin)}</span>
                      </span>
                      <span className="ml-auto flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {c.tag === "split" ? (
                          <>
                            <button type="button" onClick={() => resolve([c.id], "Shipped: you sided with the majority")} className="rounded-full bg-electric-blue-strong px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-zk-accent">Ship it</button>
                            <button type="button" onClick={() => resolve([c.id], "Held: back to the agents")} className="rounded-full border border-zk-border px-3 py-1.5 text-[12px] font-semibold hover:bg-zk-chip">Hold</button>
                          </>
                        ) : (
                          <button type="button" onClick={() => main(c)} className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${c.tag === "proof" ? "border border-zk-border hover:bg-zk-chip" : "bg-electric-blue-strong text-white hover:bg-zk-accent"}`}>{TAGS[c.tag].action}</button>
                        )}
                        <span className="relative">
                          <button type="button" aria-label="More actions" onClick={() => setMenu(menu === c.id ? null : c.id)} className="rounded-full px-2 py-1.5 text-zk-muted hover:bg-zk-chip">⋯</button>
                          {menu === c.id && (
                            <span className="absolute right-0 z-20 mt-1 flex w-44 flex-col rounded-xl border border-zk-border bg-zk-surface p-1 text-[12.5px] shadow-lg">
                              {c.tag === "big" && <button type="button" className="rounded-lg px-2.5 py-1.5 text-left hover:bg-zk-chip" onClick={() => resolve([c.id], "Declined")}>Decline</button>}
                              {c.tag === "proof" && <button type="button" className="rounded-lg px-2.5 py-1.5 text-left hover:bg-zk-chip" onClick={() => resolve([c.id], "Approved without proof")}>Approve anyway</button>}
                              {c.tag === "rollback" && <button type="button" className="rounded-lg px-2.5 py-1.5 text-left hover:bg-zk-chip" onClick={() => resolve([c.id], "Note dismissed")}>Dismiss the note</button>}
                              <Link className="rounded-lg px-2.5 py-1.5 hover:bg-zk-chip" href={`/issues/${c.issue % 2 ? 144 : 143}`}>Open the issue</Link>
                            </span>
                          )}
                        </span>
                      </span>
                    </div>
                    {isOpen && (
                      <div className="mb-3 ml-7 flex flex-wrap gap-4 rounded-xl bg-zk-bg p-3 text-[12.5px]">
                        {c.before && <div className="flex gap-2"><Shot label={c.before} /><Shot label={c.tag === "proof" ? "After · mobile missing" : c.after!} good={c.tag !== "proof"} /></div>}
                        {c.note && <p className="max-w-sm self-center rounded-lg border-l-4 border-electric-blue bg-zk-surface px-3 py-2"><span className="block text-[11px] font-bold text-zk-muted uppercase">Proposed project note</span>{c.note}</p>}
                        <ul className="min-w-56 space-y-1 self-center">
                          {c.verdicts.filter((v) => !v.ok || c.tag !== "big").slice(0, 3).map((v) => (
                            <li key={v.agent} className="flex items-center gap-2"><Face agent={v.agent} ok={v.ok} size="h-5 w-5" /><b>{v.agent}</b><span className="text-zk-text2">{v.says}</span></li>
                          ))}
                          {c.tag === "big" && <li className="text-zk-text2">All {c.verdicts.length} agents: done correctly, needs a person.</li>}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {selected.length > 0 && (
        <div className="sticky bottom-20 z-30 mt-4 flex flex-wrap items-center gap-2 rounded-full border border-zk-border bg-zk-surface px-4 py-2 shadow-lg lg:bottom-4">
          <b className="text-[13px]">{selected.length} selected</b>
          {sameTag && sameTag !== "split" && <button type="button" onClick={() => resolve(selected, `${TAGS[sameTag].action} done`)} className="rounded-full bg-electric-blue-strong px-3 py-1.5 text-[12px] font-semibold text-white">{TAGS[sameTag].action}</button>}
          {sameTag !== "proof" && <button type="button" onClick={() => resolve(selected, "Sent back to the agents")} className="rounded-full border border-zk-border px-3 py-1.5 text-[12px] font-semibold">Send back</button>}
          <button type="button" onClick={() => setSelected([])} className="ml-auto text-[12px] text-zk-muted underline">Clear</button>
        </div>
      )}

      {toast && (
        <div role="status" className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-zk-text px-4 py-2 text-[13px] text-white shadow-lg lg:bottom-6">
          <Check className="h-4 w-4" /> {toast.text}
          <button type="button" onClick={undo} className="inline-flex items-center gap-1 font-semibold text-[#9fc0ff]"><Undo className="h-3.5 w-3.5" /> Undo</button>
        </div>
      )}
    </div>
  );
}
