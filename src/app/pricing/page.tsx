'use client';
export const dynamic = 'force-dynamic';
/* MATIN DESIGN SYSTEM — Pricing Page (Dynamic)
   يجلب الباقات ديناميكياً من /api/plans
   Dark Premium SaaS | RTL | Cairo Font */
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, X, Crown, Loader2 } from "lucide-react";

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

// الباقات الاحتياطية في حال لم تكن قاعدة البيانات جاهزة
const fallbackPlans = [
  {
    name_ar: "المجانية", price_monthly: 0, price_yearly: 0,
    max_students: 50, max_teachers: 5, is_featured: false, badge: null, color: "#6B7280",
    description: "تجربة مجانية لاكتشاف المنصة", is_government: false,
    features: ["الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب"],
    excluded: ["الاختبارات الإلكترونية", "المكتبة الرقمية", "الإدارة المالية", "النقل المدرسي GPS", "الذكاء الاصطناعي"],
  },
  {
    name_ar: "الأساسية", price_monthly: 299, price_yearly: 2868,
    max_students: 200, max_teachers: 20, is_featured: false, badge: null, color: "#D4A843",
    description: "للمدارس الصغيرة والمتوسطة", is_government: false,
    features: ["الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب", "الاختبارات الإلكترونية", "المكتبة الرقمية"],
    excluded: ["الإدارة المالية", "النقل المدرسي GPS", "الذكاء الاصطناعي"],
  },
  {
    name_ar: "الاحترافية", price_monthly: 699, price_yearly: 6710,
    max_students: 1000, max_teachers: 100, is_featured: true, badge: "الأكثر طلباً", color: "#D4A843",
    description: "للمؤسسات المتوسطة والكبيرة", is_government: false,
    features: ["الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب", "الاختبارات الإلكترونية", "المكتبة الرقمية", "الإدارة المالية", "النقل المدرسي GPS"],
    excluded: ["الذكاء الاصطناعي"],
  },
  {
    name_ar: "المؤسسية", price_monthly: -1, price_yearly: -1,
    max_students: -1, max_teachers: -1, is_featured: false, badge: null, color: "#22C55E",
    description: "للجامعات والسلاسل التعليمية", is_government: false,
    features: ["الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب", "الاختبارات الإلكترونية", "المكتبة الرقمية", "الإدارة المالية", "النقل المدرسي GPS", "الذكاء الاصطناعي"],
    excluded: [],
  },
  {
    name_ar: "الذهبية", price_monthly: -2, price_yearly: -2,
    max_students: -1, max_teachers: -1, is_featured: false, badge: "حكومي", color: "#F59E0B",
    description: "للجهات الحكومية والوزارات", is_government: true,
    features: ["الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب", "الاختبارات الإلكترونية", "المكتبة الرقمية", "الإدارة المالية", "النقل المدرسي GPS", "الذكاء الاصطناعي", "إخفاء إعلانات متين"],
    excluded: [],
  },
];

const fallbackFaqs = [
  { q: "هل يمكنني تغيير الباقة لاحقاً؟", a: "نعم، يمكنك الترقية في أي وقت. يتم احتساب الفرق بشكل تناسبي. لا يمكن التخفيض إلا في بداية دورة الفوترة." },
  { q: "هل هناك فترة تجريبية مجانية؟", a: "نعم، الباقة المجانية متاحة دائماً للمؤسسات الصغيرة. يمكنك الترقية في أي وقت." },
  { q: "كيف يتم احتساب عدد الطلاب؟", a: "يُحتسب عدد الطلاب النشطين في النظام. عند تجاوز الحد المسموح، يتوقف النظام تلقائياً عن إضافة طلاب جدد مع إشعار فوري لمالك المؤسسة." },
  { q: "هل البيانات محفوظة عند إلغاء الاشتراك؟", a: "نعم، يمكنك تصدير جميع بياناتك قبل إلغاء الاشتراك. نحتفظ بالبيانات لمدة 90 يوماً بعد الإلغاء." },
  { q: "هل يوجد عقد سنوي؟", a: "يمكنك الاشتراك شهرياً أو سنوياً. الاشتراك السنوي يوفر خصم 20%." },
  { q: "ما الفرق بين الباقة الذهبية والمؤسسية؟", a: "الباقة الذهبية مخصصة للجهات الحكومية والوزارات، وتشمل إخفاء إعلانات متين، وتكاملات حكومية إضافية، وعقود رسمية مع SLA مضمون." },
];

interface Plan {
  id?: number;
  name_ar: string;
  price_monthly: number;
  price_yearly: number;
  max_students: number;
  max_teachers: number;
  is_featured?: boolean;
  badge?: string | null;
  color?: string;
  description?: string;
  is_government?: boolean;
  features: string[];
  excluded?: string[];
}

function getPlanColor(plan: Plan): string {
  if (plan.color) return plan.color;
  if (plan.is_government) return "#F59E0B";
  if (plan.is_featured) return "#D4A843";
  if (plan.price_monthly === 0) return "#6B7280";
  if (plan.price_monthly < 0) return "#22C55E";
  return "#D4A843";
}

function getPriceDisplay(plan: Plan): { price: string; period: string } {
  if (plan.price_monthly === 0) return { price: "0", period: "دائماً" };
  if (plan.price_monthly === -1) return { price: "تواصل معنا", period: "" };
  if (plan.price_monthly === -2) return { price: "تفاوض مباشر", period: "" };
  return { price: plan.price_monthly.toString(), period: "شهرياً" };
}

function getPlanFeatures(plan: Plan): { label: string; included: boolean }[] {
  const allFeatures = [
    "الجداول الدراسية", "الرسائل الداخلية", "الدرجات الأساسية", "الحضور والغياب",
    "الاختبارات الإلكترونية", "المكتبة الرقمية", "الإدارة المالية",
    "النقل المدرسي GPS", "الذكاء الاصطناعي", "إخفاء إعلانات متين",
  ];

  // إذا كانت الـ features مصفوفة نصوص
  if (plan.features && Array.isArray(plan.features)) {
    const featSet = new Set(plan.features.map((f: string) => f.trim()));
    return allFeatures.map((label) => ({ label, included: featSet.has(label) }));
  }
  return allFeatures.map((label) => ({ label, included: false }));
}

export default function Pricing() {
  useScrollAnimation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingYearly, setBillingYearly] = useState(false);

  useEffect(() => {
    fetch('/api/public/plans')
      .then(res => res.json())
      .then(data => {
        const rawPlans = data.plans || data;
        if (Array.isArray(rawPlans) && rawPlans.length > 0) {
          data = rawPlans;
        }
        if (Array.isArray(data) && data.length > 0) {
          // تحويل features من JSON string إلى مصفوفة إذا لزم
          const parsed = data.map((p: Plan) => ({
            ...p,
            features: typeof p.features === 'string' ? JSON.parse(p.features) : (p.features || []),
          }));
          setPlans(parsed);
        } else {
          setPlans(fallbackPlans);
        }
      })
      .catch(() => setPlans(fallbackPlans))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الأسعار</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            باقات <span className="text-gold-gradient">تناسب الجميع</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            ابدأ مجاناً، وطوّر حسب احتياجاتك. لا رسوم خفية، لا مفاجآت.
          </p>

          {/* Toggle شهري / سنوي */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm font-bold ${!billingYearly ? 'text-white' : 'text-gray-500'}`}>شهري</span>
            <button
              onClick={() => setBillingYearly(!billingYearly)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ background: billingYearly ? '#D4A843' : 'rgba(255,255,255,0.1)' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                style={{ right: billingYearly ? '4px' : 'auto', left: billingYearly ? 'auto' : '4px' }}
              />
            </button>
            <span className={`text-sm font-bold ${billingYearly ? 'text-[#D4A843]' : 'text-gray-500'}`}>
              سنوي <span className="text-xs text-green-400 mr-1">وفّر 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin" style={{ color: '#D4A843' }} />
              <span className="mr-3 text-gray-400">جاري تحميل الباقات...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
              {plans.map((plan, i) => {
                const color = getPlanColor(plan);
                const { price, period } = getPriceDisplay(plan);
                const features = getPlanFeatures(plan);
                const isGovt = plan.is_government || plan.name_ar === 'الذهبية';
                const isFeatured = plan.is_featured || plan.name_ar === 'الاحترافية';
                const displayPrice = billingYearly && plan.price_yearly > 0
                  ? Math.round(plan.price_yearly / 12).toString()
                  : price;

                return (
                  <div
                    key={plan.id || i}
                    className={`pricing-card fade-in-up ${isFeatured ? 'featured' : ''}`}
                    style={{
                      transitionDelay: `${i * 80}ms`,
                      ...(isGovt ? {
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(10,10,10,1) 100%)',
                        border: '1px solid rgba(245,158,11,0.3)',
                      } : {}),
                    }}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 right-1/2 translate-x-1/2">
                        <span
                          className="text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1"
                          style={{
                            background: isGovt ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
                            color: isGovt ? '#F59E0B' : '#22C55E',
                            border: `1px solid ${isGovt ? 'rgba(245,158,11,0.4)' : 'rgba(34,197,94,0.4)'}`,
                          }}
                        >
                          {isGovt && <Crown size={12} />}
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="text-white font-black text-xl mb-1">{plan.name_ar}</h3>
                      <p className="text-gray-600 text-xs mb-3">{plan.description}</p>
                      <div className="flex items-baseline gap-1 mb-1">
                        {period ? (
                          <>
                            <span className="text-4xl font-black" style={{ color }}>{displayPrice}</span>
                            <span className="text-gray-500 text-xs">ر.س/{billingYearly ? 'شهرياً (سنوي)' : period}</span>
                          </>
                        ) : (
                          <span className="text-lg font-black" style={{ color }}>{displayPrice}</span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs">
                        {plan.max_students === -1 ? 'طلاب غير محدودين' : `حتى ${plan.max_students} طالب`}
                      </p>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {features.map((feature, j) => (
                        <li key={j} className={`flex items-center gap-2 text-xs ${feature.included ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature.included ? (
                            <CheckCircle size={13} className="flex-shrink-0" style={{ color }} />
                          ) : (
                            <X size={13} className="flex-shrink-0 text-gray-700" />
                          )}
                          {feature.label}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={
                        plan.price_monthly < 0
                          ? 'mailto:hello@matin.ink'
                          : '/register'
                      }
                      className={`block w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        isFeatured ? 'btn-gold' : isGovt ? '' : 'btn-outline-gold'
                      }`}
                      style={isGovt ? {
                        background: 'rgba(245,158,11,0.15)',
                        border: '1px solid rgba(245,158,11,0.4)',
                        color: '#F59E0B',
                      } : {}}
                    >
                      {plan.price_monthly === 0
                        ? 'ابدأ مجاناً'
                        : plan.price_monthly < 0
                        ? 'تواصل مع المبيعات'
                        : 'ابدأ التجربة'}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="pb-8">
        <div className="container max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-6 text-sm text-gray-400 leading-relaxed fade-in-up"
            style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)' }}
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
            {fallbackFaqs.map((faq, i) => (
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
