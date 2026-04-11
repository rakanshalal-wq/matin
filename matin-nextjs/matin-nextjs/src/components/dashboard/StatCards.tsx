"use client";

const stats = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75">
        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    gradientFrom: "from-blue-400/5",
    value: "47",
    label: "المؤسسات",
    sub: "44 نشطة · 3 متجمدة",
    valueColor: "text-blue-400",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    gradientFrom: "from-emerald-500/5",
    value: "12,430",
    label: "الطلاب",
    sub: "↑ 8.2%",
    valueColor: "text-emerald-400",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    iconBg: "bg-purple-400/10 border-purple-400/20",
    gradientFrom: "from-purple-400/5",
    value: "1,847",
    label: "المعلمون",
    sub: "↑ 32 مالك",
    valueColor: "text-purple-400",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    iconBg: "bg-gold-dim border-gold-border",
    gradientFrom: "from-gold/5",
    value: "247K",
    label: "الإيرادات SAR",
    sub: "↑ 14.5%",
    valueColor: "text-gold",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-bg-card border border-bdr-light rounded-xl p-4 hover:-translate-y-0.5 transition-all relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradientFrom} to-transparent pointer-events-none`} />
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${stat.iconBg}`}>
            {stat.icon}
          </div>
          <div className={`text-[28px] sm:text-[34px] font-black leading-none mb-1 ${stat.valueColor}`}>
            {stat.value}
          </div>
          <div className="text-txt-muted text-[11px] font-medium">{stat.label}</div>
          <div className="text-emerald-400 text-[10px] font-bold mt-1">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}
