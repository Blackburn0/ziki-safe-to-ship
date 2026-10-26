"use client";
// Ziki's top bar: logo, project switcher, the Product / Marketing / Security tabs (a bottom bar on phones and tablets),
// then agents, the person and their points.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { me } from "@/lib/data";
import { Avatar } from "./ui";
import { Bell, BotIcon, ChevronDown, Logo, MarketingIcon, ProductIcon, SecurityIcon, Trophy } from "./Icons";

const tabs = [
  { href: "/issues", label: "Product", Icon: ProductIcon, match: ["/issues", "/live", "/settings/shipping"] },
  { href: "/marketing", label: "Marketing", Icon: MarketingIcon, match: ["/marketing"] },
  { href: "/security", label: "Security", Icon: SecurityIcon, match: ["/security"] },
];

export default function TopBar() {
  const path = usePathname();
  return (
    <header className="relative z-40 border-b border-zk-border bg-zk-surface shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:sticky lg:top-0">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 max-sm:py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2 rounded-full">
            <Logo />
            <span className="pr-1 text-[15px] font-semibold tracking-[-0.02em] text-zk-text max-sm:hidden">ziki</span>
          </Link>
          <span className="h-[18px] w-px shrink-0 bg-zk-border max-sm:hidden" />
          <button type="button" className="inline-flex h-[30px] items-center gap-2 rounded-full pl-1.5 pr-2.5 text-[13px] font-medium text-zk-text hover:bg-zk-chip max-sm:text-base max-sm:font-semibold">
            Zedu <ChevronDown className="h-3.5 w-3.5 text-zk-muted" />
          </button>
        </div>

        <nav aria-label="Areas" className="flex items-center max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-40 max-lg:justify-around max-lg:border-t max-lg:border-zk-border max-lg:bg-zk-surface max-lg:px-2 max-lg:pt-1.5 max-lg:pb-[max(0.375rem,env(safe-area-inset-bottom))] max-lg:shadow-[0_-1px_3px_rgba(0,0,0,0.04)] lg:gap-1">
          {tabs.map(({ href, label, Icon, match }) => {
            const on = match.some((m) => path.startsWith(m));
            return (
              <Link key={href} href={href} aria-current={on ? "page" : undefined}
                className={`relative inline-flex shrink-0 items-center whitespace-nowrap font-medium max-lg:min-w-16 max-lg:flex-1 max-lg:flex-col max-lg:gap-0.5 max-lg:rounded-xl max-lg:py-1.5 max-lg:text-[11px] lg:h-9 lg:gap-2 lg:rounded-full lg:px-2.5 lg:text-[13px] ${
                  on ? "text-zk-accent lg:bg-zk-tint" : "text-zk-text2 hover:text-zk-text lg:hover:bg-zk-chip"}`}>
                <span className={`relative flex items-center justify-center max-lg:h-7 max-lg:w-12 max-lg:rounded-full ${on ? "max-lg:bg-zk-tint" : ""}`}>
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-zk-border px-3 text-[13px] font-medium text-zk-text hover:bg-zk-chip max-sm:px-2">
            <BotIcon className="h-4 w-4 text-zk-accent" /> <span className="max-sm:hidden">Agents</span> <ChevronDown className="h-3.5 w-3.5 text-zk-muted max-sm:hidden" />
          </button>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-full border border-zk-border pl-1 pr-3 text-[13px] font-medium text-zk-text hover:bg-zk-chip max-sm:pr-1">
            <Avatar name={me.name} /> <span className="max-sm:hidden">{me.name}</span> <ChevronDown className="h-3.5 w-3.5 text-zk-muted max-sm:hidden" />
          </button>
          <Link href="/workers" className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-zk-warn-bg px-2.5 text-[12.5px] font-semibold text-zk-warn-fg">
            <Trophy className="h-3.5 w-3.5" /> {me.points} pts
          </Link>
          <button type="button" aria-label="Notifications" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-zk-text hover:bg-zk-chip">
            <Bell className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
