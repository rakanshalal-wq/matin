"use client";

import Link from "next/link";

const actions = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    label: "الواجهة",
    labelColor: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    href: "/dashboard/theme-editor",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    label: "المستخدمون",
    labelColor: "text-txt-dim",
    borderColor: "border-bdr-light",
    href: "#",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    iconBg: "bg-gold-dim border-gold-border",
    label: "الاشتراكات",
    labelColor: "text-txt-dim",
    borderColor: "border-bdr-light",
    href: "#",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
    iconBg: "bg-orange-400/10 border-orange-400/20",
    label: "الإعلانات",
    labelColor: "text-txt-dim",
    borderColor: "border-bdr-light",
    href: "#",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    iconBg: "bg-purple-400/10 border-purple-400/20",
    label: "التقارير",
    labelColor: "text-txt-dim",
    borderColor: "border-bdr-light",
    href: "#",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.4)" strokeWidth="1.75">
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    iconBg: "bg-white/[0.04] border-bdr-light",
    label: "الإعدادات",
    labelColor: "text-txt-dim",
    borderColor: "border-bdr-light",
    href: "#",
  },
];

export default function QuickActions() {
  return (
    <div className="mb-4">
      <div className="text-txt-muted text-[10px] font-bold tracking-[1px] uppercase mb-3">
        إجراءات سريعة
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className={`bg-white/[0.02] border rounded-lg py-3 flex flex-col items-center gap-1.5 text-center hover:bg-white/5 hover:-translate-y-0.5 transition-all no-underline ${action.borderColor}`}
          >
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${action.iconBg}`}>
              {action.icon}
            </div>
            <span className={`text-[10px] font-medium ${action.labelColor}`}>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
