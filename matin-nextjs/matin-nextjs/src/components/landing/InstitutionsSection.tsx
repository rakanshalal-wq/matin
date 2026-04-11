"use client";

const institutions = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M9 12h1M14 8h1M14 12h1"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    title: "المدارس",
    desc: "إدارة كاملة للفصول، المناهج، الحضور، الدرجات، والتواصل مع أولياء الأمور.",
    badge: "+2,400 طالب نشط",
    badgeColor: "text-blue-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
    iconBg: "bg-purple-400/10 border-purple-400/20",
    title: "الجامعات",
    desc: "نظام أكاديمي شامل بالساعات والفصول والتخصصات مع بوابة طلابية كاملة.",
    badge: "كليات · أقسام · مسارات",
    badgeColor: "text-purple-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "حلقات التحفيظ",
    desc: "متابعة الحفظ والمراجعة والإجازات بنظام مخصص لحلقات القرآن الكريم.",
    badge: "سور · أجزاء · إجازات",
    badgeColor: "text-emerald-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    ),
    iconBg: "bg-orange-400/10 border-orange-400/20",
    title: "المراكز التدريبية",
    desc: "إدارة الدورات والمتدربين والشهادات والحضور بمرونة كاملة.",
    badge: "دورات · شهادات · متدربين",
    badgeColor: "text-orange-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      </svg>
    ),
    iconBg: "bg-pink-400/10 border-pink-400/20",
    title: "رياض الأطفال",
    desc: "متابعة يومية للأطفال مع تقارير مصورة وتواصل مباشر مع الأهل.",
    badge: "تقارير يومية · صور · أنشطة",
    badgeColor: "text-pink-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
    iconBg: "bg-cyan-400/10 border-cyan-400/20",
    title: "المعاهد",
    desc: "مرونة كاملة لإدارة برامج متعددة ومسارات تعليمية متنوعة.",
    badge: "برامج · مسارات · مستويات",
    badgeColor: "text-cyan-400",
  },
];

export default function InstitutionsSection() {
  return (
    <section id="institutions" className="py-20 lg:py-28 px-[5%] bg-white/[0.01]">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold-border rounded-full px-3.5 py-1 text-[11px] font-bold text-gold tracking-wider uppercase mb-4">
          المؤسسات المدعومة
        </div>
        <h2 className="text-3xl lg:text-[44px] font-extrabold tracking-tight mb-3.5 leading-tight">
          لكل مؤسسة تعليمية
          <br />
          <span className="text-gold">حل مخصص</span>
        </h2>
        <p className="text-sm lg:text-base text-txt-dim leading-relaxed max-w-lg mx-auto">
          من الروضة للجامعة — متين يتكيف مع طبيعة مؤسستك وهيكلها الأكاديمي.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {institutions.map((inst, idx) => (
          <div
            key={idx}
            className="bg-white/[0.03] border border-bdr-light rounded-2xl p-6 hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${inst.iconBg}`}>
              {inst.icon}
            </div>
            <div className="text-base font-bold mb-2">{inst.title}</div>
            <div className="text-[13px] text-txt-dim leading-relaxed">{inst.desc}</div>
            <div className={`mt-3.5 text-[11px] font-bold ${inst.badgeColor}`}>{inst.badge}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
