"use client";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM20 8v6M23 11h-6"/>
      </svg>
    ),
    iconBg: "bg-gold-dim border-gold-border",
    title: "إدارة الطلاب",
    desc: "تسجيل، حضور وغياب، درجات، وتقارير أداء شاملة لكل طالب.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    title: "الإدارة المالية",
    desc: "رسوم، فواتير، أقساط، تقارير مالية، وتحصيل إلكتروني.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "التواصل والإشعارات",
    desc: "رسائل SMS وواتساب وإشعارات فورية لأولياء الأمور والمعلمين.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    iconBg: "bg-purple-400/10 border-purple-400/20",
    title: "النقل المدرسي",
    desc: "تتبع GPS مباشر للحافلات مع إشعارات وصول للأهل.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 px-[5%]">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold-border rounded-full px-3.5 py-1 text-[11px] font-bold text-gold tracking-wider uppercase mb-4">
          المميزات
        </div>
        <h2 className="text-3xl lg:text-[44px] font-extrabold tracking-tight mb-3.5 leading-tight">
          كل ما تحتاجه
          <br />
          <span className="text-gold">في منصة واحدة</span>
        </h2>
        <p className="text-sm lg:text-base text-txt-dim leading-relaxed max-w-lg mx-auto">
          أدوات متكاملة لإدارة كل جانب من جوانب مؤسستك التعليمية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
        {/* Features List */}
        <div className="flex flex-col gap-3">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-start p-5 rounded-xl border border-transparent hover:bg-white/[0.04] hover:border-bdr transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${feat.iconBg}`}>
                {feat.icon}
              </div>
              <div>
                <div className="text-[15px] font-bold mb-1.5 text-txt">{feat.title}</div>
                <div className="text-[13px] text-txt-dim leading-relaxed">{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div>
          <div className="bg-white/[0.02] border border-bdr rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Browser Bar */}
            <div className="px-4 py-3 bg-white/[0.03] border-b border-bdr flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <div className="flex-1 text-center text-[10px] text-white/20">app.matin.ink/dashboard</div>
            </div>
            {/* Dashboard Content */}
            <div className="p-5">
              <div className="text-xs font-bold text-gold mb-3">لوحة التحكم — مدرسة النور الأهلية</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white/[0.03] border border-bdr-light rounded-lg p-3">
                  <div className="text-xl font-extrabold leading-none">847</div>
                  <div className="text-[9px] text-txt-muted mt-1">طالب نشط</div>
                </div>
                <div className="bg-white/[0.03] border border-bdr-light rounded-lg p-3">
                  <div className="text-xl font-extrabold leading-none text-emerald-400">94%</div>
                  <div className="text-[9px] text-txt-muted mt-1">نسبة الحضور</div>
                </div>
                <div className="bg-white/[0.03] border border-bdr-light rounded-lg p-3">
                  <div className="text-xl font-extrabold leading-none text-gold">52</div>
                  <div className="text-[9px] text-txt-muted mt-1">معلم</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-md text-[11px]">
                  <span>أحمد الغامدي</span>
                  <span className="text-emerald-400 font-bold">حاضر</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-md text-[11px]">
                  <span>سارة العتيبي</span>
                  <span className="text-emerald-400 font-bold">حاضرة</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-md text-[11px]">
                  <span>خالد القحطاني</span>
                  <span className="text-red-400 font-bold">غائب</span>
                </div>
              </div>
              <div className="mt-3 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-gradient-to-l from-gold to-blue-400 rounded-full" />
              </div>
              <div className="flex justify-between mt-1 text-[9px] text-txt-muted">
                <span>التقدم الأكاديمي</span>
                <span>78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
