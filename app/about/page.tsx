// "How this works": the explainer video, then EXPLANATION.md from the repo, so editing that file updates this page.
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
import { ArrowLeft } from "@/components/Icons";
import { Card } from "@/components/ui";

export const metadata = { title: "How this works · Ziki", description: "Why the owner's home exists, explained in a short video and a one-page write-up." };

export default async function About() {
  const md = await readFile(path.join(process.cwd(), "EXPLANATION.md"), "utf-8");
  const html = await marked.parse(md);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zk-accent"><ArrowLeft className="h-3.5 w-3.5" /> Back to the mock-up</Link>

      <Card className="overflow-hidden">
        <video controls preload="metadata" poster="/video/poster.png" className="aspect-video w-full bg-zk-text">
          <source src="/video/explainer.mp4" type="video/mp4" />
          <track kind="captions" src="/video/explainer.vtt" srcLang="en" label="English" default />
        </video>
      </Card>

      <Card className="p-6 sm:p-8">
        <article className="doc" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
    </div>
  );
}
