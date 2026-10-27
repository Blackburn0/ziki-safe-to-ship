// "How this works": EXPLANATION.md from the repo, so editing that file updates this page.
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { marked } from "marked";
import { ArrowLeft } from "@/components/Icons";
import { Card } from "@/components/ui";

export const metadata = { title: "How this works · Ziki", description: "Needs your call: the few decisions agents can't make, in one list you can clear in minutes." };

export default async function About() {
  const md = await readFile(path.join(process.cwd(), "EXPLANATION.md"), "utf-8");
  const html = await marked.parse(md);
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <Link href="/issues" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zk-accent"><ArrowLeft className="h-3.5 w-3.5" /> Back to the Inbox</Link>
      <Card className="p-6 sm:p-8">
        <article className="doc" dangerouslySetInnerHTML={{ __html: html }} />
      </Card>
    </div>
  );
}
