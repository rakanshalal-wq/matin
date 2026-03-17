'use client';
/* MATIN DESIGN SYSTEM — Home Page
   Dark Premium SaaS | RTL | Cairo Font
   Sections: Hero, Stats, Features, Institutions, User Roles, Integrations, Pricing, CTA
   Per Constitution v4: 5 institution types, 7 user levels, 5 pricing tiers */

import { useEffect, useRef } from "react";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GraduationCap, Shield, Zap, Users, BarChart3, Bell,
  Bus, Utensils, Brain, Star, CheckCircle, ArrowLeft,
  Building2, BookOpen, Baby, Dumbbell, ChevronLeft,
  Crown, Lock, UserCheck, Settings, Briefcase,
  CreditCard, MessageCircle, Smartphone, Wallet
} from "lucide-react";

const integrationIconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 size={22} />,
  Shield: <Shield size={22} />,
  CreditCard: <CreditCard size={22} />,
  MessageCircle: <MessageCircle size={22} />,
  Smartphone: <Smartphone size={22} />,
  Wallet: <Wallet size={22} />,
};

// ---- Scroll Animation Hook ----
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ---- Data ----


const coreFeatures = [
  {
    icon: <GraduationCap size={26} />,
    color: "#D4A843",
    bg: "rgba(212,168,67,0.1)",
    title: "الإدارة الأكاديمية",
    desc: "جداول دراسية ذكية، درجات تفصيلية، تقارير فورية، وإدارة شاملة للمناهج والمحتوى التعليمي.",
  },
  {
    icon: <Shield size={26} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.1)",
    title: "الأمان السيبراني",
    desc: "تشفير AES-256، TLS 1.3، عزل كامل للبيانات بين المؤسسات، وسجلات أمان لا يمكن حذفها.",
  },
  {
    icon: <BarChart3 size={26} />,
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.1)",
    title: "التحليلات والتقارير",
    desc: "لوحات تحكم تفاعلية، تقارير مفصلة، وتحليلات بيانات متقدمة لاتخاذ قرارات مدروسة.",
  },
  {
    icon: <Bell size={26} />,
    color: "#F97316",
    bg: "rgba(249,115,22,0.1)",
    title: "الإشعارات الشاملة",
    desc: "إشعارات واتساب وSMS وPush Notifications لأولياء الأمور والطلاب والمعلمين فوراً.",
  },
  {
    icon: <Bus size={26} />,
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.1)",
    title: "النقل المدرسي",
    desc: "تتبع حي آمن للحافلات بـ GPS، إشعارات الركوب والنزول، وخرائط تفاعلية للأهالي.",
  },
  {
    icon: <Brain size={26} />,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.1)",
    title: "الذكاء الاصطناعي",
    desc: "توجيه مهني ذكي، مراقبة الصحة النفسية، وجواز سفر المهارات الرقمي لكل طالب.",
  },
];

const institutionTypes = [
  { icon: <Building2 size={28} />, title: "المدارس", desc: "قبول، جداول، درجات، اختبارات، نقل مدرسي", color: "#D4A843" },
  { icon: <GraduationCap size={28} />, title: "الجامعات", desc: "ساعات معتمدة، كليات، GPA، أبحاث، إرشاد أكاديمي", color: "#22C55E" },
  { icon: <Baby size={28} />, title: "رياض الأطفال", desc: "منهج وزاري، أنشطة، تقييم مهاري", color: "#60A5FA" },
  { icon: <BookOpen size={28} />, title: "الحضانات", desc: "رعاية يومية، تغذية، تقارير يومية للأهالي", color: "#F97316" },
  { icon: <Dumbbell size={28} />, title: "معاهد التدريب", desc: "برامج قصيرة، شهادات معتمدة، مسارات مهنية", color: "#A78BFA" },
];

// 7 user levels per constitution
const userRoles = [
  {
    level: "1",
    icon: <Crown size={20} />,
    color: "#D4A843",
    title: "مالك المنصة",
    subtitle: "Super Admin",
    desc: "السلطة المطلقة — التحكم الكامل في جميع المؤسسات والإيرادات والسياسات",
  },
  {
    level: "2",
    icon: <Settings size={20} />,
    color: "#A78BFA",
    title: "موظفو المنصة",
    subtitle: "Platform Staff",
    desc: "صلاحيات جزئية يحددها مالك المنصة للدعم الفني والإشراف",
  },
  {
    level: "3",
    icon: <Building2 size={20} />,
    color: "#22C55E",
    title: "مالك المؤسسة",
    subtitle: "Institution Owner",
    desc: "تحكم كامل في مؤسسته فقط — المالية والموظفين والإعدادات",
  },
  {
    level: "4",
    icon: <Briefcase size={20} />,
    color: "#60A5FA",
    title: "مدير المؤسسة",
    subtitle: "Institution Manager",
    desc: "إدارة العمليات اليومية — الجداول والحضور والتقارير",
  },
  {
    level: "5",
    icon: <UserCheck size={20} />,
    color: "#F97316",
    title: "الكادر الوظيفي",
    subtitle: "Staff",
    desc: "صلاحيات حسب المنصب — محاسب، سكرتير، مشرف",
  },
  {
    level: "6",
    icon: <GraduationCap size={20} />,
    color: "#EC4899",
    title: "المعلمون",
    subtitle: "Teachers",
    desc: "إدارة فصولهم ومواد درجاتهم وواجباتهم فقط",
  },
  {
    level: "7",
    icon: <Users size={20} />,
    color: "#6B7280",
    title: "الطلاب وأولياء الأمور",
    subtitle: "Students & Parents",
    desc: "متابعة الأداء والتواصل والمشاركة في المنظومة التعليمية",
  },
];

const integrations = [
  { name: "نور", desc: "وزارة التعليم", icon: "Building2", color: "#22C55E" },
  { name: "نفاذ", desc: "المصادقة الحكومية", icon: "Shield", color: "#60A5FA" },
  { name: "STC Pay", desc: "الدفع الآمن", icon: "CreditCard", color: "#D4A843" },
  { name: "واتساب", desc: "إشعارات فورية", icon: "MessageCircle", color: "#22C55E" },
  { name: "Apple Pay", desc: "الدفع السريع", icon: "Smartphone", color: "#F97316" },
  { name: "مدى", desc: "بطاقات ائتمانية", icon: "Wallet", color: "#A78BFA" },
];

// 5 pricing tiers per constitution
const pricingPlans = [
  {
    name: "المجانية",
    price: "0",
    period: "دائماً",
    students: "مؤسسة صغيرة",
    featured: false,
    color: "#6B7280",
    features: [
      "الجداول والدرجات الأساسية",
      "الحضور والغياب",
      "الرسائل الداخلية",
      "التقارير الأساسية",
    ],
  },
  {
    name: "الأساسية",
    price: "299",
    period: "شهرياً",
    students: "حتى 200 طالب",
    featured: false,
    color: "#D4A843",
    features: [
      "كل مميزات المجانية",
      "الاختبارات الإلكترونية",
      "المكتبة الرقمية",
      "تواصل أولياء الأمور",
      "دعم فني بالبريد",
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
    features: [
      "كل مميزات الأساسية",
      "الإدارة المالية",
      "النقل المدرسي GPS",
      "واتساب Business",
      "تكامل نور ونفاذ",
      "تقارير متقدمة",
    ],
  },
  {
    name: "المؤسسية",
    price: "تواصل",
    period: "",
    students: "طلاب غير محدودين",
    featured: false,
    color: "#22C55E",
    features: [
      "كل الميزات",
      "الذكاء الاصطناعي",
      "Matin Coin",
      "SLA 99.9%",
      "مدير حساب مخصص",
    ],
  },
];

// ---- Component ----
export default function Home() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      {/* ======== HERO ======== */}
      <section className="relative min-h-[70vh] md:min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/hero-bg-SLXYPocnkQ2MPu3vomp7My.webp)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(10,10,10,0.5)] to-[#0a0a0a]" />

        {/* Glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[rgba(212,168,67,0.06)] blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-[rgba(34,197,94,0.04)] blur-[80px] pointer-events-none" />

        <div className="container relative z-10 py-10 md:py-20">
          <div className="max-w-4xl mx-auto text-center">


            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6" style={{ lineHeight: '1.15' }}>
              <span className="text-white">نظام إدارة المؤسسات التعليمية</span>
              <br />
              <span className="text-gold-gradient">الأكثر تكاملاً</span>
              <br />
              <span className="text-white">في المملكة</span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              منصة سحابية تجمع كل ما تحتاجه مؤسستك التعليمية في مكان واحد — من القبول حتى التخرج.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://app.matin.ink/register"
                className="btn-gold px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                ابدأ تجربتك المجانية
                <ArrowLeft size={18} />
              </a>
              <Link
                href="/features"
                className="btn-outline-gold px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                استكشف المميزات
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#22C55E]" />
                لا يلزم بطاقة ائتمانية
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#22C55E]" />
                إعداد خلال 24 ساعة
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#22C55E]" />
                دعم فني على مدار الساعة
              </span>
            </div>
          </div>
        </div>
      </section>



      {/* ======== DASHBOARD PREVIEW ======== */}
      <section className="py-10 md:py-20">
        <div className="container">
          <div className="text-center mb-10 fade-in-up">
            <span className="section-label mb-4 inline-flex">لوحة التحكم</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
              كل شيء في مكان <span className="text-gold-gradient">واحد</span>
            </h2>
          </div>
          <div className="fade-in-up">
            <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" style={{ top: '60%' }} />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/dashboard-preview-XQDk8pKYyi6XozNrHChnGN.webp"
                alt="لوحة تحكم منصة متين"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======== CORE FEATURES ======== */}
      <section className="py-10 md:py-20 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-14 fade-in-up">
            <span className="section-label mb-4 inline-flex">المميزات الأساسية</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
              كل ما تحتاجه <span className="text-gold-gradient">مؤسستك</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              أكثر من 30 ميزة متكاملة تغطي كل جانب من جوانب إدارة المؤسسة التعليمية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <div key={i} className="matin-card p-6 fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div
                  className="feature-icon mb-4"
                  style={{ background: feature.bg, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/features" className="btn-outline-gold px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              عرض جميع المميزات
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======== INSTITUTION TYPES ======== */}
      <section className="py-10 md:py-20">
        <div className="container">
          <div className="text-center mb-14 fade-in-up">
            <span className="section-label mb-4 inline-flex">أنواع المؤسسات</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
              لكل مؤسسة <span className="text-gold-gradient">حلها المخصص</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              متين تدعم 5 أنواع من المؤسسات التعليمية بخصائص مخصصة لكل نوع
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {institutionTypes.map((inst, i) => (
              <div key={i} className="matin-card p-6 text-center fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${inst.color}15`, color: inst.color }}
                >
                  {inst.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{inst.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{inst.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ======== INTEGRATIONS ======== */}
      <section className="py-10 md:py-20">
        <div className="container">
          <div className="text-center mb-14 fade-in-up">
            <span className="section-label mb-4 inline-flex">التكاملات</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
              متصل بكل ما <span className="text-gold-gradient">تحتاجه</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              تكاملات مع الأنظمة الحكومية والمالية والتواصل لتجربة سلسة ومتكاملة.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((integ, i) => (
              <div key={i} className="integration-card fade-in-up" style={{ transitionDelay: `${i * 60}ms` }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${integ.color}15`, color: integ.color }}
                >
                  {integrationIconMap[integ.icon]}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{integ.name}</div>
                  <div className="text-gray-500 text-xs">{integ.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/integrations" className="btn-outline-gold px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">
              عرض جميع التكاملات
              <ChevronLeft size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======== PRICING ======== */}
      <section className="py-10 md:py-20 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-14 fade-in-up">
            <span className="section-label mb-4 inline-flex">الأسعار</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4">
              باقات <span className="text-gold-gradient">تناسب الجميع</span>
            </h2>
            <p className="text-gray-500 mt-4">ابدأ مجاناً، وطوّر حسب احتياجاتك</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`pricing-card fade-in-up ${plan.featured ? "featured" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
                {plan.badge && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2">
                    <span className="badge-green text-xs px-3 py-1">{plan.badge}</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    {plan.period ? (
                      <>
                        <span className="text-4xl font-black" style={{ color: plan.color }}>{plan.price}</span>
                        {plan.price !== "0" && <span className="text-gray-500 text-sm">ر.س/{plan.period}</span>}
                        {plan.price === "0" && <span className="text-gray-500 text-sm">{plan.period}</span>}
                      </>
                    ) : (
                      <span className="text-2xl font-black" style={{ color: plan.color }}>{plan.price} معنا</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{plan.students}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle size={15} className="text-[#22C55E] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://app.matin.ink/register"
                  className={`block w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${
                    plan.featured ? "btn-gold" : "btn-outline-gold"
                  }`}
                >
                  {plan.price === "تواصل" ? "تواصل مع المبيعات" : plan.price === "0" ? "ابدأ مجاناً" : "ابدأ الآن"}
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-[#D4A843] text-sm hover:underline">
              مقارنة تفصيلية بين جميع الباقات الخمس ←
            </Link>
          </div>
        </div>
      </section>

      {/* ======== CTA SECTION ======== */}
      <section className="py-10 md:py-20">
        <div className="container">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center fade-in-up"
            style={{
              background: "linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(34,197,94,0.04) 100%)",
              border: "1px solid rgba(212,168,67,0.15)"
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/hero-bg-SLXYPocnkQ2MPu3vomp7My.webp"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                ابدأ رحلتك مع <span className="text-gold-gradient">متين</span> اليوم
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                انضم لأكثر من 500 مؤسسة تعليمية تثق بمتين لإدارة عملياتها اليومية.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://app.matin.ink/register"
                  className="btn-gold px-8 py-4 rounded-2xl text-base font-bold flex items-center gap-2"
                >
                  ابدأ تجربتك المجانية
                  <ArrowLeft size={18} />
                </a>
                <Link
                  href="/contact"
                  className="btn-outline-gold px-8 py-4 rounded-2xl text-base font-bold"
                >
                  تحدث مع فريق المبيعات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
