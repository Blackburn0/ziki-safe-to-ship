import Link from "next/link";
import { Card } from "./ui";

export default function ComingSoon({ title, text }: { title: string; text: string }) {
  return (
    <Card className="mx-auto mt-6 max-w-xl px-6 py-14 text-center">
      <p className="text-[11px] font-bold tracking-[0.12em] text-zk-accent uppercase">Coming soon</p>
      <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.02em]">{title}</h1>
      <p className="mt-2 text-sm text-zk-muted">{text}</p>
      <Link href="/issues" className="mt-5 inline-block text-[13px] font-semibold text-zk-accent">Back to Product</Link>
    </Card>
  );
}
