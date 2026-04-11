"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Play, Check } from "lucide-react";

const heroCards = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
    iconBg: "bg-purple-500/10 border-purple-500/20",
    title: "المتجر الإلكتروني",
    desc: "متجر خاص لكل مؤسسة لبيع الكتب والأدوات والمنتجات التعليمية.",
    badge: "مدفوعات إلكترونية مدمجة",
    badgeColor: "text-purple-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    iconBg: "bg-blue-400/10 border-blue-400/20",
    title: "المكتبة الرقمية",
    desc: "مستودع محتوى تعليمي — كتب، مقاطع، ملفات في متناول الجميع.",
    badge: "وصول 24/7 من أي جهاز",
    badgeColor: "text-blue-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
      </svg>
    ),
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    title: "الملتقى المجتمعي",
    desc: "فضاء تفاعلي يجمع الطلاب والمعلمين وأولياء الأمور.",
    badge: "تواصل حقيقي داخل المؤسسة",
    badgeColor: "text-emerald-400",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    iconBg: "bg-red-500/10 border-red-500/20",
    title: "الإعلانات",
    desc: "إعلانات مستهدفة داخل لوحات التحكم لجميع مستخدمي المنصة.",
    badge: "استهداف حسب الدور والمؤسسة",
    badgeColor: "text-red-400",
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
          }
        });
      },
      { threshold: 0.08 }
    );
    const fadeEls = sectionRef.current?.querySelectorAll(".fade-up");
    fadeEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center text-center pt-28 pb-20 px-[5%] relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute w-[min(700px,90vw)] h-[min(700px,90vw)] rounded-full bg-[radial-gradient(circle,rgba(212,168,67,0.07)_0%,transparent_70%)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold-border rounded-full px-4 py-1.5 text-xs font-semibold text-gold mb-7 fade-up opacity-0 translate-y-6 transition-all duration-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        منصة التعليم الأذكى للمؤسسات الخاصة في السعودية
      </div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-4 fade-up opacity-0 translate-y-6 transition-all duration-500">
        كل مؤسستك في
        <br />
        <span className="text-gold">لوحة تحكم واحدة</span>
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-txt-dim max-w-xl mx-auto mb-8 leading-relaxed fade-up opacity-0 translate-y-6 transition-all duration-500">
        من الحضور والدرجات إلى الرسوم والنقل — متين يدير كل شيء حتى تركّز أنت على التعليم.
      </p>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4 justify-center flex-wrap fade-up opacity-0 translate-y-6 transition-all duration-500">
        <a
          href="#"
          className="bg-gradient-to-br from-gold to-gold-light rounded-xl px-8 py-4 text-[#06060E] font-extrabold text-base shadow-lg shadow-gold/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/45 transition-all duration-200 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          ابدأ تجربتك المجانية
        </a>
        <a
          href="#"
          className="bg-white/5 border border-bdr rounded-xl px-7 py-4 text-txt font-semibold text-base hover:bg-white/[0.09] hover:border-white/[0.15] transition-all duration-200 flex items-center gap-2"
        >
          <Play size={15} />
          شاهد العرض
        </a>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 w-full max-w-[900px] fade-up opacity-0 translate-y-6 transition-all duration-500">
        {heroCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white/[0.03] border border-bdr-light rounded-2xl p-5 flex gap-4 items-start hover:-translate-y-1 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold mb-1">{card.title}</div>
              <div className="text-[13px] text-txt-muted leading-relaxed mb-2">{card.desc}</div>
              <div className={`flex items-center gap-1.5 text-[11px] font-bold ${card.badgeColor}`}>
                <Check size={11} strokeWidth={2.5} />
                {card.badge}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
