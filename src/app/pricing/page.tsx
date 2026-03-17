'use client';

/* MATIN DESIGN SYSTEM — Pricing Page
   Dark Premium SaaS | RTL | Cairo Font
   5 Tiers per Constitution v4: Free, Basic, Professional, Enterprise, Government Gold */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, X, ArrowLeft, Crown, Building2 } from "lucide-react";

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const plans = [
  {
    name: "المجانية",
    price: "0",
    period: "دائماً",
    students: "مؤسسة صغيرة",
    featured: false,
    badge: null,
    color: "#6B7280",
    icon: null,
    desc: "تجربة مجانية لاكتشاف المنصة",
    features: [
      { label: "الجداول الدراسية", included: true },
      { label: "الرسائل الداخلية", included: true },
      { label: "الدرجات الأساسية", included: true },
      { label: "الحضور والغياب", included: true },
      { label: "الاختبارات الإلكترونية", included: false },
      { label: "المكتبة الرقمية", included: false },
      { label: "الإدارة المالية", included: false },
      { label: "النقل المدرسي GPS", included: false },
      { label: "الذكاء الاصطناعي", included: false },
      { label: "إخفاء إعلانات متين", included: false },
    ],
  },
  {
    name: "الأساسية",
    price: "299",
    period: "شهرياً",
    students: "حتى 200 طالب",
    featured: false,
    badge: null,
    color: "#D4A843",
    icon: null,
    desc: "للمدارس الصغيرة والمتوسطة",
    features: [
      { label: "الجداول الدراسية", included: true },
      { label: "الرسائل الداخلية", included: true },
      { label: "الدرجات الأساسية", included: true },
      { label: "الحضور والغياب", included: true },
      { label: "الاختبارات الإلكترونية", included: true },
      { label: "المكتبة الرقمية", included: true },
      { label: "الإدارة المالية", included: false },
      { label: "النقل المدرسي GPS", included: false },
      { label: "الذكاء الاصطناعي", included: false },
      { label: "إخفاء إعلانات متين", included: false },
    ],
  },
  {
    name: "الاحترافية",
    price: "699",
    period: "شهرياً",
    students: "حتى 1000 طالب",
    featured: true,
    badge: "الأكثر طلباً",
    color: "#D4A843",
    icon: null,
    desc: "للمؤسسات المتوسطة والكبيرة",
    features: [
      { label: "الجداول الدراسية", included: true },
      { label: "الرسائل الداخلية", included: true },
      { label: "الدرجات الأساسية", included: true },
      { label: "الحضور والغياب", included: true },
      { label: "الاختبارات الإلكترونية", included: true },
      { label: "المكتبة الرقمية", included: true },
      { label: "الإدارة المالية", included: true },
      { label: "النقل المدرسي GPS", included: true },
      { label: "الذكاء الاصطناعي", included: false },
      { label: "إخفاء إعلانات متين", included: false },
    ],
  },
  {
    name: "المؤسسية",
    price: "تواصل معنا",
    period: "",
    students: "طلاب غير محدودين",
    featured: false,
    badge: null,
    color: "#22C55E",
    icon: null,
    desc: "للجامعات والسلاسل التعليمية",
    features: [
      { label: "الجداول الدراسية", included: true },
      { label: "الرسائل الداخلية", included: true },
      { label: "الدرجات الأساسية", included: true },
      { label: "الحضور والغياب", included: true },
      { label: "الاختبارات الإلكترونية", included: true },
      { label: "المكتبة الرقمية", included: true },
      { label: "الإدارة المالية", included: true },
      { label: "النقل المدرسي GPS", included: true },
      { label: "الذكاء الاصطناعي", included: true },
      { label: "إخفاء إعلانات متين", included: false },
    ],
  },
  {
    name: "الذهبية",
    price: "تفاوض مباشر",
    period: "",
    students: "جهات حكومية",
    featured: false,
    badge: "حكومي",
    color: "#F59E0B",
    icon: <Crown size={20} />,
    desc: "للجهات الحكومية والوزارات",
    features: [
      { label: "الجداول الدراسية", included: true },
      { label: "الرسائل الداخلية", included: true },
      { label: "الدرجات الأساسية", included: true },
      { label: "الحضور والغياب", included: true },
      { label: "الاختبارات الإلكترونية", included: true },
      { label: "المكتبة الرقمية", included: true },
      { label: "الإدارة المالية", included: true },
      { label: "النقل المدرسي GPS", included: true },
      { label: "الذكاء الاصطناعي", included: true },
      { label: "إخفاء إعلانات متين", included: true },
    ],
  },
];

const faqs = [
  { q: "هل يمكنني تغيير الباقة لاحقاً؟", a: "نعم، يمكنك الترقية في أي وقت. يتم احتساب الفرق بشكل تناسبي. لا يمكن التخفيض إلا في بداية دورة الفوترة." },
  { q: "هل هناك فترة تجريبية مجانية؟", a: "نعم، الباقة المجانية متاحة دائماً للمؤسسات الصغيرة. يمكنك الترقية في أي وقت." },
  { q: "كيف يتم احتساب عدد الطلاب؟", a: "يُحتسب عدد الطلاب النشطين في النظام. عند تجاوز الحد المسموح، يتوقف النظام تلقائياً عن إضافة طلاب جدد مع إشعار فوري لمالك المؤسسة." },
  { q: "هل البيانات محفوظة عند إلغاء الاشتراك؟", a: "نعم، يمكنك تصدير جميع بياناتك قبل إلغاء الاشتراك. نحتفظ بالبيانات لمدة 90 يوماً بعد الإلغاء." },
  { q: "هل يوجد عقد سنوي؟", a: "يمكنك الاشتراك شهرياً أو سنوياً. الاشتراك السنوي يوفر خصم 20%." },
  { q: "ما الفرق بين الباقة الذهبية والمؤسسية؟", a: "الباقة الذهبية مخصصة للجهات الحكومية والوزارات، وتشمل إخفاء إعلانات متين، وتكاملات حكومية إضافية، وعقود رسمية مع SLA مضمون." },
];

export default function Pricing() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الأسعار</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            باقات <span className="text-gold-gradient">تناسب الجميع</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            ابدأ مجاناً، وطوّر حسب احتياجاتك. لا رسوم خفية، لا مفاجآت.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card fade-in-up ${plan.featured ? "featured" : ""}`}
                style={{
                  transitionDelay: `${i * 80}ms`,
                  ...(plan.name === "الذهبية" ? {
                    background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(10,10,10,1) 100%)",
                    border: "1px solid rgba(245,158,11,0.3)",
                  } : {})
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2">
                    <span
                      className="text-xs px-3 py-1 rounded-full font-bold"
                      style={{
                        background: plan.name === "الذهبية" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)",
                        color: plan.name === "الذهبية" ? "#F59E0B" : "#22C55E",
                        border: `1px solid ${plan.name === "الذهبية" ? "rgba(245,158,11,0.4)" : "rgba(34,197,94,0.4)"}`,
                      }}
                    >
                      {plan.icon && <span className="inline-flex items-center gap-1">{plan.icon} {plan.badge}</span>}
                      {!plan.icon && plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
                  <p className="text-gray-600 text-xs mb-3">{plan.desc}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    {plan.period ? (
                      <>
                        <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                        <span className="text-gray-500 text-xs">ر.س/{plan.period}</span>
                      </>
                    ) : (
                      <span className="text-lg font-black" style={{ color: plan.color }}>{plan.price}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">{plan.students}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className={`flex items-center gap-2 text-xs ${feature.included ? "text-gray-300" : "text-gray-700"}`}>
                      {feature.included ? (
                        <CheckCircle size={13} className="flex-shrink-0" style={{ color: plan.color }} />
                      ) : (
                        <X size={13} className="flex-shrink-0 text-gray-700" />
                      )}
                      {feature.label}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.price === "تواصل معنا" || plan.price === "تفاوض مباشر" ? "mailto:hello@matin.ink" : plan.price === "0" ? "https://app.matin.ink/register" : "https://app.matin.ink/register"}
                  className={`block w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                    plan.featured ? "btn-gold" : plan.name === "الذهبية" ? "" : "btn-outline-gold"
                  }`}
                  style={plan.name === "الذهبية" ? {
                    background: "rgba(245,158,11,0.15)",
                    border: "1px solid rgba(245,158,11,0.4)",
                    color: "#F59E0B",
                  } : {}}
                >
                  {plan.price === "0" ? "ابدأ مجاناً" : plan.price === "تواصل معنا" || plan.price === "تفاوض مباشر" ? "تواصل مع المبيعات" : "ابدأ التجربة"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note about student limits */}
      <section className="pb-8">
        <div className="container max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-6 text-sm text-gray-400 leading-relaxed fade-in-up"
            style={{ background: "rgba(212,168,67,0.04)", border: "1px solid rgba(212,168,67,0.1)" }}
          >
            <p className="font-bold text-[#D4A843] mb-2">ملاحظة حول حدود الطلاب</p>
            <p>يحدد مالك المنصة الحد الأقصى لعدد الطلاب لكل باقة. عند تجاوز الحد، يتوقف النظام تلقائياً عن إضافة طلاب جدد مع إشعار فوري. يمكن للمؤسسة ترقية باقتها في أي وقت للاستمرار في الإضافة.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-black text-white">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="matin-card p-6 fade-in-up" style={{ transitionDelay: `${i * 60}ms` }}>
                <h3 className="text-white font-bold mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
