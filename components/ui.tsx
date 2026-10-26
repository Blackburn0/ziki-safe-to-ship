// Small building blocks in Ziki's style: white cards with a thin border and 20px corners, round chips, initials avatars.
import Link from "next/link";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-[20px] border border-zk-border bg-zk-surface ${className}`}>{children}</section>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] font-bold tracking-[0.08em] text-zk-muted uppercase">{children}</h2>;
}

type Tone = "chip" | "ok" | "bad" | "warn" | "info";
const tones: Record<Tone, string> = {
  chip: "bg-zk-chip text-zk-text2",
  ok: "bg-zk-ok-bg text-zk-ok-fg",
  bad: "bg-zk-bad-bg text-zk-bad-fg",
  warn: "bg-zk-warn-bg text-zk-warn-fg",
  info: "bg-zk-info-bg text-zk-info-fg",
};
export function Pill({ tone = "chip", className = "", children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]} ${className}`}>{children}</span>;
}

const avatarColours = ["bg-sky-100 text-sky-800", "bg-violet-100 text-violet-800", "bg-amber-100 text-amber-800", "bg-rose-100 text-rose-800", "bg-emerald-100 text-emerald-800"];
export function Avatar({ name, size = "h-7 w-7 text-[11px]" }: { name: string; size?: string }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const colour = avatarColours[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % avatarColours.length];
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold ${size} ${colour}`} aria-hidden="true">{initials}</span>;
}

export function Button({ href, primary, className = "", children, onClick, type = "button", disabled }: {
  href?: string; primary?: boolean; className?: string; children: React.ReactNode; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  const cls = `inline-flex h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:opacity-50 ${
    primary ? "border-electric-blue-strong bg-electric-blue-strong text-white hover:bg-zk-accent" : "border-zk-border bg-zk-surface text-zk-text hover:bg-zk-chip"
  } ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} className={cls} onClick={onClick} disabled={disabled}>{children}</button>;
}
