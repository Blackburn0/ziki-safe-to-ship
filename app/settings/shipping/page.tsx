"use client";
// The owner's rules for what agents may put live without asking, the safety net around every change, and how the owner hears
// about it. Written in the owner's words, not as settings for agents.
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Book, Eye, Sun } from "@/components/Icons";
import { Button, Card, Label, Pill } from "@/components/ui";

const choices = ["Ship alone", "Ship, then tell me", "Ask me", "Ask me + 2 people"] as const;
type Choice = (typeof choices)[number];

const startRules: { kind: string; examples: string; choice: Choice }[] = [
  { kind: "Bug fixes that don't change how Zedu looks", examples: "A button that does nothing, a count that doesn't clear, a crash", choice: "Ship alone" },
  { kind: "Spelling and small wording fixes", examples: "\"succesfully\", an old product name in an email", choice: "Ship alone" },
  { kind: "Words people see on the main screens", examples: "Headlines, button labels, empty-screen messages", choice: "Ship, then tell me" },
  { kind: "Look and feel", examples: "Colours, fonts, layout, the logo", choice: "Ask me" },
  { kind: "Removing a feature or a screen", examples: "Taking away an option people use", choice: "Ask me" },
  { kind: "Prices, plans and anything about money", examples: "Plan names, prices, checkout", choice: "Ask me + 2 people" },
  { kind: "Sign-in, passwords and personal data", examples: "Login, password reset, what's stored about people", choice: "Ask me + 2 people" },
];

const lessons = [
  { text: "Before shipping anything that runs when you hover in the desktop app, test it with an account that has 500+ notifications.", when: "Proposed today", from: "the bell change that was undone at 3:12 AM" },
  { text: "Never change an email's sender name or links without a reviewer reading the email that was actually sent.", when: "Added Oct 21", from: "an email that linked to the wrong site" },
  { text: "Test every change to the message box on Windows and macOS keyboards.", when: "Added Oct 18", from: "shortcuts that worked on one but not the other" },
];

export default function Shipping() {
  const [rules, setRules] = useState(startRules);
  const [watch, setWatch] = useState("30");
  const [summary, setSummary] = useState<"morning" | "each">("morning");
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zk-accent"><ArrowLeft className="h-3.5 w-3.5" /> Back to home</Link>
        <h1 className="mt-3 text-[28px] font-extrabold tracking-[-0.02em]">What agents may ship alone</h1>
        <p className="mt-1 max-w-2xl text-sm text-zk-muted">Agents prove every change before it goes live. These rules say which changes they may put live on their own, and which wait for you. Anything they aren&apos;t sure about waits for you.</p>
      </div>

      <Card className="p-5">
        <Label>Kinds of change</Label>
        <ul className="mt-3">
          {rules.map((r, n) => (
            <li key={r.kind} className="flex flex-wrap items-center gap-3 border-b border-zk-divider py-3 last:border-0">
              <div className="min-w-[220px] flex-1">
                <p className="text-[14px] font-semibold">{r.kind}</p>
                <p className="text-xs text-zk-muted">{r.examples}</p>
              </div>
              <div className="flex flex-wrap rounded-xl bg-zk-seg p-1" role="radiogroup" aria-label={r.kind}>
                {choices.map((c) => (
                  <button key={c} type="button" role="radio" aria-checked={r.choice === c} onClick={() => { setRules(rules.map((x, k) => (k === n ? { ...x, choice: c } : x))); setSaved(false); }}
                    className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ${r.choice === c ? "bg-electric-blue-strong text-white" : "text-zk-text2 hover:text-zk-text"}`}>{c}</button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <Label>The safety net around every change</Label>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px]">
          <Eye className="h-4 w-4 text-zk-accent" /> Watch every change for
          <select value={watch} onChange={(e) => { setWatch(e.target.value); setSaved(false); }} className="rounded-lg border border-zk-border bg-zk-surface px-2 py-1 text-sm">
            {["15", "30", "60"].map((m) => <option key={m} value={m}>{m} minutes</option>)}
          </select>
          after it goes live.
        </div>
        <p className="mt-3 text-[14px] font-semibold">Agents undo it on their own, then tell you, if:</p>
        <ul className="mt-2 space-y-1.5 text-[13.5px] text-zk-text2">
          {["Errors go above normal", "Crash reports come from 10 or more people", "Sign-ins drop by a fifth or more", "Two or more people report the same new problem"].map((t) => (
            <li key={t}><label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> {t}</label></li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2"><Book className="h-4 w-4 text-zk-accent" /><Label>Lessons every agent follows (AGENTS.md)</Label></div>
        <p className="mt-1 text-[13px] text-zk-muted">When something is undone, agents suggest a lesson so it doesn&apos;t happen again. It only joins this list once you say yes on your home page.</p>
        <ul className="mt-3 space-y-2">
          {lessons.map((l) => (
            <li key={l.text} className="rounded-[16px] bg-zk-bg p-3">
              <p className="text-[13.5px]">{l.text}</p>
              <p className="mt-1 text-xs text-zk-muted"><Pill tone={l.when.startsWith("Proposed") ? "warn" : "chip"} className="mr-1 py-0.5">{l.when}</Pill> learned from {l.from}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-2"><Sun className="h-4 w-4 text-zk-accent" /><Label>How you hear about it</Label></div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {([["morning", "One morning summary", "At 8 AM: what went live, what was undone, what needs you."], ["each", "Every change as it goes live", "A notification for each change. Agents ship many a night."]] as const).map(([key, title, text]) => (
            <label key={key} className={`cursor-pointer rounded-[16px] border p-4 ${summary === key ? "border-electric-blue-strong bg-zk-tint" : "border-zk-border"}`}>
              <input type="radio" name="summary" className="sr-only" checked={summary === key} onChange={() => { setSummary(key); setSaved(false); }} />
              <span className="text-[14px] font-semibold">{title}</span>
              <span className="mt-1 block text-[13px] text-zk-muted">{text}</span>
            </label>
          ))}
        </div>
        <label className="mt-3 flex items-center gap-2 text-[13.5px]"><input type="checkbox" defaultChecked /> Tell me straight away when something is undone or waits for me</label>
      </Card>

      <div className="flex items-center gap-3">
        <Button primary onClick={() => setSaved(true)}>Save rules</Button>
        {saved && <span className="text-[13px] font-semibold text-zk-ok-fg" role="status">Saved. (Mock-up: nothing is stored.)</span>}
      </div>
    </div>
  );
}
