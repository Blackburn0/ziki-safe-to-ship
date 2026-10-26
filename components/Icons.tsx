// Line icons drawn inline (Ziki uses the same thin 2px line style), so the mock-up needs no icon library.
type P = { className?: string };
const base = (className = "h-4 w-4") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const Logo = ({ className = "h-7 w-auto text-electric-blue-strong" }: P) => (
  <svg viewBox="0 0 28 32" fill="none" className={className} aria-hidden="true">
    <path d="M5 13h16L5 27.5h16" stroke="currentColor" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 2.5 21 9h-9Z" fill="#38A3FF" stroke="#38A3FF" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
export const ProductIcon = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="1.5" /></svg>);
export const MarketingIcon = ({ className }: P) => (<svg {...base(className)}><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 6a8.5 8.5 0 0 1 0 12" /></svg>);
export const SecurityIcon = ({ className }: P) => (<svg {...base(className)}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
export const BotIcon = ({ className }: P) => (<svg {...base(className)}><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 4v4" /><path d="M9 13v1M15 13v1" /></svg>);
export const ChevronDown = ({ className }: P) => (<svg {...base(className)}><path d="m6 9 6 6 6-6" /></svg>);
export const ChevronRight = ({ className }: P) => (<svg {...base(className)}><path d="m9 6 6 6-6 6" /></svg>);
export const ChevronUp = ({ className }: P) => (<svg {...base(className)}><path d="m6 15 6-6 6 6" /></svg>);
export const Trophy = ({ className }: P) => (<svg {...base(className)}><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M16 5h3a3 3 0 0 1-3 4M8 5H5a3 3 0 0 0 3 4" /><path d="M12 13v4M8 20h8" /></svg>);
export const Bell = ({ className }: P) => (<svg {...base(className)}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>);
export const Plus = ({ className }: P) => (<svg {...base(className)}><path d="M12 5v14M5 12h14" /></svg>);
export const ArrowUpRight = ({ className }: P) => (<svg {...base(className)}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const ArrowLeft = ({ className }: P) => (<svg {...base(className)}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>);
export const Search = ({ className }: P) => (<svg {...base(className)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></svg>);
export const Filter = ({ className }: P) => (<svg {...base(className)}><path d="M4 5h16l-6 7.5V19l-4-2v-4.5L4 5Z" /></svg>);
export const Sort = ({ className }: P) => (<svg {...base(className)}><path d="M8 4v16M4 8l4-4 4 4M16 20V4M12 16l4 4 4-4" /></svg>);
export const Monitor = ({ className }: P) => (<svg {...base(className)}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>);
export const InboxIcon = ({ className }: P) => (<svg {...base(className)}><path d="M3 13h5l1.5 3h5L16 13h5" /><path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5l2-8Z" /></svg>);
export const CircleDashed = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="8.5" strokeDasharray="3 3" /></svg>);
export const Timer = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="13" r="7.5" /><path d="M12 13V9.5M10 2h4" /></svg>);
export const CheckCircle = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>);
export const Layers = ({ className }: P) => (<svg {...base(className)}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>);
export const Message = ({ className }: P) => (<svg {...base(className)}><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /></svg>);
export const Paperclip = ({ className }: P) => (<svg {...base(className)}><path d="m20 11-8 8a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 5 5l-8 8a1.7 1.7 0 0 1-2.5-2.5l7-7" /></svg>);
export const ExternalLink = ({ className }: P) => (<svg {...base(className)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>);
export const Settings = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>);
export const Undo = ({ className }: P) => (<svg {...base(className)}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>);
export const Alert = ({ className }: P) => (<svg {...base(className)}><path d="M12 3 2 20h20L12 3Z" /><path d="M12 10v4M12 17v.5" /></svg>);
export const Check = ({ className }: P) => (<svg {...base(className)}><path d="m5 12 4.5 4.5L19 7" /></svg>);
export const Eye = ({ className }: P) => (<svg {...base(className)}><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" /><circle cx="12" cy="12" r="2.8" /></svg>);
export const Pulse = ({ className }: P) => (<svg {...base(className)}><path d="M3 12h4l2.5-6 5 12 2.5-6h4" /></svg>);
export const Sun = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>);
export const Scale = ({ className }: P) => (<svg {...base(className)}><path d="M12 4v16M6 20h12M4 8h16" /><path d="m4 8-2 6a3 3 0 0 0 4 0L4 8ZM20 8l-2 6a3 3 0 0 0 4 0l-2-6Z" /></svg>);
export const Book = ({ className }: P) => (<svg {...base(className)}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" /><path d="M5 17a3 3 0 0 1 3-3h11" /></svg>);
