"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "@/components/Icons";
import { Button, Card } from "@/components/ui";

const field = "w-full rounded-xl border border-zk-border bg-zk-surface px-3 py-2.5 text-sm outline-none focus:border-electric-blue";

export default function NewIssue() {
  const [mode, setMode] = useState<"quick" | "detailed">("quick");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Fix");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/issues" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zk-accent"><ArrowLeft className="h-3.5 w-3.5" /> Back to issues</Link>
      <h1 className="mt-3 text-[28px] font-extrabold tracking-[-0.02em]">Report an issue</h1>
      <p className="mt-1 text-sm text-zk-muted">Include a type, clear description, and optional GitHub PR so the team can triage quickly.</p>

      <Card className="mt-5 p-5">
        {sent ? (
          <p className="py-8 text-center text-sm">This is a mock-up, so nothing was sent. <Link href="/issues" className="font-semibold text-zk-accent">Back to issues</Link></p>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="flex w-max rounded-full bg-zk-seg p-1 text-[13px]">
              {(["quick", "detailed"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-4 py-1.5 ${mode === m ? "bg-zk-surface font-semibold shadow-sm" : "text-zk-text2"}`}>{m === "quick" ? "Quick report" : "Detailed issue"}</button>
              ))}
            </div>
            <label className="block text-sm font-semibold">Title
              <input className={`${field} mt-1.5 font-normal`} maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} required />
              <span className="mt-1 block text-right text-xs font-normal text-zk-muted">{title.length}/200</span>
            </label>
            <fieldset>
              <legend className="text-sm font-semibold">Type</legend>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {["Design", "Feat", "Fix", "Marketing"].map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${type === t ? "border-electric-blue-strong bg-zk-tint text-zk-accent" : "border-zk-border text-zk-text2"}`}>{t}</button>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-semibold">Platform
              <select className={`${field} mt-1.5 font-normal`} defaultValue=""><option value="" disabled>Select a platform</option><option>Desktop</option><option>Mobile</option><option>Web</option></select>
            </label>
            <label className="block text-sm font-semibold">Description
              <textarea className={`${field} mt-1.5 min-h-40 font-normal`} defaultValue={"## What happens\n\n## Steps to reproduce\n1. \n\n## Expected\n"} />
              <span className="mt-1 block text-xs font-normal text-zk-muted">Markdown is supported. Be specific: what should happen, what actually happens, and how to reproduce it.</span>
            </label>
            {mode === "detailed" && (
              <>
                <label className="block text-sm font-semibold">GitHub PR
                  <textarea className={`${field} mt-1.5 font-normal`} rows={2} placeholder="https://github.com/organization/repo/pull/123" />
                  <span className="mt-1 block text-xs font-normal text-zk-muted">Optional. One GitHub link per line.</span>
                </label>
                <div>
                  <p className="text-sm font-semibold">Screenshots and files</p>
                  <p className="text-xs text-zk-muted">Optional. Attach a screenshot, console log or recording. Up to 5 MB each.</p>
                  <button type="button" className="mt-2 rounded-full border border-dashed border-zk-border px-4 py-2 text-[13px]">Attach files</button>
                </div>
              </>
            )}
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Assign this issue to myself</label>
            <div><Button type="submit" primary>Create issue</Button></div>
          </form>
        )}
      </Card>
    </div>
  );
}
