"use client";

import { Check, X } from "lucide-react";

const plans = [
  {
    name: "أساسي",
    price: "مجاناً",
    priceSub: "للبداية",
    period: "تجربة 30 يوم كاملة",
    featured: false,
    features: [
      { text: "حتى 100 طالب", included: true },
      { text: "لوحة تحكم أساسية", included: true },
      { text: "الحضور والغياب", included: true },
      { text: "الدرجات والتقارير", included: true },
      { text: "النقل المدرسي", included: false },
    ],
    cta: "ابدأ مجاناً",
    ctaStyle: "w-full py-3 rounded-xl text-sm font-bold border border-bdr text-txt-dim bg-transparent hover:border-gold-border hover:text-gold hover:bg-gold/5 transition-all duration-200",
  },
  {
    name: "متقدم",
    price: "1,200",
    priceSub: "ريال / سنة",
    period: "100 ريال شهرياً",
    featured: true,
    badge: "الأكثر شعبية",
    features: [
      { text: "حتى 500 طالب", included: true },
      { text: "جميع مميزات الأساسي", included: true },
      { text: "التعليم الإلكتروني", included: true },
      { text: "النقل + GPS", included: true },
      { text: "إدارة مالية كاملة", included: true },
      { text: "واتساب/SMS", included: true },
    ],
    cta: "اشترك الآن",
    ctaStyle: "w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-br from-gold to-gold-light text-black shadow-lg shadow-gold/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/45 transition-all duration-200 border-none",
  },
  {
    name: "مؤسسي",
    price: "حسب الطلب",
    priceSub: "",
    period: "للمؤسسات الكبيرة",
    featured: false,
    features: [
      { text: "طلاب غير محدودين", included: true },
      { text: "جميع المميزات", included: true },
      { text: "دعم 24/7", included: true },
      { text: "SLA 99.9%", included: true },
      { text: "White Label", included: true },
    ],
    cta: "تواصل معنا",
    ctaStyle: "w-full py-3 rounded-xl text-sm font-bold border border-gold-border text-gold bg-transparent hover:bg-gold/5 transition-all duration-200",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 lg:py-28 px-[5%] bg-white/[0.01]">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold-border rounded-full px-3.5 py-1 text-[11px] font-bold text-gold tracking-wider uppercase mb-4">
          الأسعار
        </div>
        <h2 className="text-3xl lg:text-[44px] font-extrabold tracking-tight mb-3.5 leading-tight">
          باقة لكل <span className="text-gold">مؤسسة</span>
        </h2>
        <p className="text-sm lg:text-base text-txt-dim leading-relaxed max-w-lg mx-auto">
          ابدأ مجاناً وطوّر حسب احتياجك.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto items-start">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1 relative ${
              plan.featured
                ? "bg-gradient-to-b from-gold/[0.08] to-gold/[0.02] border-2 border-gold-border md:scale-105 shadow-[0_0_60px_rgba(212,168,67,0.12),0_0_120px_rgba(212,168,67,0.06)]"
                : "bg-white/[0.03] border border-bdr-light hover:border-white/10"
            }`}
          >
            {plan.badge && (
              <div className="absolute top-4 start-4 bg-gradient-to-br from-gold to-gold-light text-black text-[10px] font-extrabold px-3 py-0.5 rounded-full">
                {plan.badge}
              </div>
            )}

            <div className={`text-xs font-bold uppercase tracking-widest mb-2.5 ${plan.featured ? "text-gold mt-3" : "text-txt-muted"}`}>
              {plan.name}
            </div>
            <div className={`text-3xl font-extrabold leading-none ${plan.featured ? "text-gold" : ""}`}>
              {plan.price}{" "}
              {plan.priceSub && (
                <span className="text-[13px] text-txt-muted font-normal">{plan.priceSub}</span>
              )}
            </div>
            <div className="text-xs text-txt-muted mt-1 mb-5">{plan.period}</div>
            <div className={`h-px mb-5 ${plan.featured ? "bg-gold-border" : "bg-bdr"}`} />

            <ul className="space-y-2.5 mb-7">
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-center gap-2.5 text-[13px] text-txt-dim">
                  {feat.included ? (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className="flex-shrink-0 text-emerald-400"
                    />
                  ) : (
                    <X
                      size={14}
                      strokeWidth={2}
                      className="flex-shrink-0 text-txt-muted"
                    />
                  )}
                  {feat.text}
                </li>
              ))}
            </ul>

            <button className={plan.ctaStyle}>{plan.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
