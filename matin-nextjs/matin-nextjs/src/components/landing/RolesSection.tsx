"use client";

const roles = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    iconBg: "bg-gold-dim border-gold-border",
    title: "مالك المنصة",
    desc: "تحكم كامل بكل المؤسسات",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    title: "مدير المؤسسة",
    desc: "إدارة مؤسسته بالكامل",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "المعلم",
    desc: "الحضور والدرجات والمهام",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      </svg>
    ),
    iconBg: "bg-purple-400/10 border-purple-400/20",
    title: "ولي الأمر",
    desc: "متابعة أبنائه لحظة بلحظة",
  },
];

export default function RolesSection() {
  return (
    <section id="roles" className="py-20 lg:py-28 px-[5%] bg-white/[0.01]">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold-border rounded-full px-3.5 py-1 text-[11px] font-bold text-gold tracking-wider uppercase mb-4">
          الأدوار
        </div>
        <h2 className="text-3xl lg:text-[44px] font-extrabold tracking-tight mb-3.5 leading-tight">
          لوحة تحكم
          <br />
          <span className="text-gold">لكل دور</span>
        </h2>
        <p className="text-sm lg:text-base text-txt-dim leading-relaxed max-w-lg mx-auto">
          كل مستخدم يرى ما يحتاجه فقط — بصلاحيات دقيقة وتجربة مخصصة.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {roles.map((role, idx) => (
          <div
            key={idx}
            className="bg-white/[0.03] border border-bdr-light rounded-xl p-5 text-center hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mx-auto mb-3 ${role.iconBg}`}>
              {role.icon}
            </div>
            <div className="text-[13px] font-bold mb-1">{role.title}</div>
            <div className="text-[11px] text-txt-muted leading-snug">{role.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
