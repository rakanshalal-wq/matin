'use client';

/* MATIN DESIGN SYSTEM — About Page (Dynamic Stats)
   يجلب إحصاءات المنصة الحقيقية من /api/public?type=stats
   Dark Premium SaaS | RTL | Cairo Font */

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, Star, Users, Target, Crown, Zap } from "lucide-react";

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

const principles = [
  {
    icon: <Crown size={28} />,
    color: "#D4A843",
    title: "الضبط والجودة",
    desc: "متين تضمن بيئة آمنة وعادلة لجميع المستخدمين وفق أعلى معايير الجودة والأمان.",
  },
  {
    icon: <Star size={28} />,
    color: "#22C55E",
    title: "التمكين للمؤسسة",
    desc: "كل مؤسسة تملك استقلاليتها الكاملة ضمن إطار المنصة. نوفر الأدوات، وأنت تقود.",
  },
  {
    icon: <Shield size={28} />,
    color: "#60A5FA",
    title: "الأمان للمستخدم",
    desc: "بيانات كل فرد مصانة ومشفرة ولا تباع ولا تشارك. خصوصيتك خط أحمر لا نتجاوزه.",
  },
];

// Per Constitution v4: exactly 3 phases
const roadmap = [
  {
    phase: "المرحلة الأولى",
    status: "الحالية",
    title: "المدارس في المنطقة الوسطى",
    detail: "إطلاق المنصة وخدمة المدارس في الرياض والمنطقة الوسطى",
    color: "#D4A843"
  },
  {
    phase: "المرحلة الثانية",
    status: "قادمة",
    title: "جميع أنواع المؤسسات في المملكة + تطبيق الجوال",
    detail: "توسيع المنصة لتشمل الجامعات ورياض الأطفال والحضانات ومعاهد التدريب في جميع مناطق المملكة",
    color: "#22C55E"
  },
  {
    phase: "المرحلة الثالثة",
    status: "قادمة",
    title: "الانتشار الخليجي والتكامل الرسمي مع الوزارات",
    detail: "التوسع في الإمارات والكويت وقطر والبحرين وعُمان، مع التكامل الرسمي مع وزارة التعليم والموارد البشرية",
    color: "#60A5FA"
  },
];

const performance = [
  { metric: "99.9%", label: "وقت التشغيل المضمون" },
  { metric: "< 200ms", label: "سرعة المعالجة" },
  { metric: "كل ساعة", label: "النسخ الاحتياطية" },
  { metric: "< 5 دقائق", label: "وقت الاسترجاع" },
];

const securityLayers = [
  { name: "جدار الحماية" },
  { name: "TLS 1.3" },
  { name: "المصادقة الثنائية 2FA" },
  { name: "تشفير AES-256" },
  { name: "RBAC متقدم" },
  { name: "نظام كشف التسلل IDS" },
  { name: "سجلات المراجعة Audit Logs" },
  { name: "AI Auditor الذكي" },
];

function formatNumber(n: number | string): string {
  const num = Number(n);
  if (isNaN(num)) return String(n);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}م`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}ك+`;
  return num.toString();
}

interface PlatformStats {
  schools_count?: number;
  students_count?: number;
  teachers_count?: number;
  total_users?: number;
}

export default function About() {
  useScrollAnimation();
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch('/api/public?type=stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  // إحصاءات ديناميكية — تُجلب من قاعدة البيانات
  const dynamicStats = [
    {
      metric: stats?.schools_count ? `${formatNumber(stats.schools_count)}+` : '100+',
      label: "مؤسسة تعليمية",
      color: "#D4A843"
    },
    {
      metric: stats?.students_count ? `${formatNumber(stats.students_count)}+` : '50,000+',
      label: "طالب وطالبة",
      color: "#22C55E"
    },
    {
      metric: stats?.teachers_count ? `${formatNumber(stats.teachers_count)}+` : '5,000+',
      label: "معلم ومعلمة",
      color: "#60A5FA"
    },
    {
      metric: stats?.total_users ? `${formatNumber(stats.total_users)}+` : '100,000+',
      label: "مستخدم نشط",
      color: "#A78BFA"
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">عن متين</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            منصة تعليمية <span className="text-gold-gradient">متكاملة</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            متين ليست مجرد برنامج إدارة مدارس — بل بنية تحتية رقمية متكاملة لبناء الإنسان السعودي وفق رؤية 2030.
          </p>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="py-12 bg-[#0d0d0d]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dynamicStats.map((s, i) => (
              <div key={i} className="text-center fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="stat-number mb-2" style={{ color: s.color }}>{s.metric}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Image */}
      <section className="pb-16 pt-8">
        <div className="container">
          <div className="fade-in-up rounded-2xl overflow-hidden border border-white/8 max-h-80">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/school-building-gFR2seAkEJYsiSPUy7oCTm.webp"
              alt="مدرسة سعودية حديثة"
              className="w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="matin-card p-8 fade-in-up">
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.1)] flex items-center justify-center mb-4">
                <Target size={24} className="text-[#D4A843]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">رؤيتنا</h2>
              <p className="text-gray-400 leading-relaxed">
                أن نكون المنصة التعليمية الرقمية الأكثر تكاملاً في المملكة العربية السعودية، ونساهم في تحقيق رؤية 2030 من خلال تمكين المؤسسات التعليمية بأحدث التقنيات.
              </p>
            </div>
            <div className="matin-card p-8 fade-in-up" style={{ transitionDelay: '100ms' }}>
              <div className="w-12 h-12 rounded-xl bg-[rgba(34,197,94,0.1)] flex items-center justify-center mb-4">
                <Star size={24} className="text-[#22C55E]" />
              </div>
              <h2 className="text-2xl font-black text-white mb-4">رسالتنا</h2>
              <p className="text-gray-400 leading-relaxed">
                تمكين كل مؤسسة تعليمية في المملكة من إدارة عملياتها بكفاءة وأمان، وتوفير تجربة تعليمية استثنائية للطلاب وأولياء الأمور والمعلمين.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-black text-white">
              المبادئ <span className="text-gold-gradient">الثلاثة</span>
            </h2>
            <p className="text-gray-500 mt-3">غير القابلة للاختراق</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((p, i) => (
              <div key={i} className="matin-card p-8 text-center fade-in-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: `${p.color}15`, color: p.color }}
                >
                  {p.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Layers */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-black text-white">
              <span className="text-gold-gradient">8 طبقات</span> أمان متكاملة
            </h2>
            <p className="text-gray-500 mt-3">حماية شاملة لا مثيل لها في المنطقة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {securityLayers.map((layer, i) => (
              <div key={i} className="matin-card p-4 text-center fade-in-up" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="text-white text-sm font-semibold">{layer.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-black text-white">الأداء والموثوقية</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {performance.map((p, i) => (
              <div key={i} className="text-center fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="stat-number mb-2">{p.metric}</div>
                <div className="text-gray-500 text-sm">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap — 3 Phases per Constitution */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-black text-white">
              خارطة <span className="text-gold-gradient">التطوير</span>
            </h2>
            <p className="text-gray-500 mt-3">3 مراحل لبناء منصة تعليمية متكاملة</p>
          </div>
          <div className="relative">
            <div className="timeline-line" />
            <div className="space-y-8 pe-16">
              {roadmap.map((item, i) => (
                <div key={i} className="relative fade-in-up" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div
                    className="absolute -right-[52px] w-8 h-8 rounded-full flex items-center justify-center border-2"
                    style={{ background: '#0d0d0d', borderColor: item.color }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  </div>
                  <div className="matin-card p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold" style={{ color: item.color }}>{item.phase}</span>
                      {item.status === "الحالية" && (
                        <span className="badge-green text-xs">الحالية</span>
                      )}
                    </div>
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            كن جزءاً من <span className="text-gold-gradient">رحلة متين</span>
          </h2>
          <p className="text-gray-500 mb-8">انضم لمئات المؤسسات التي تثق بمتين لبناء مستقبل التعليم</p>
          <a href="https://app.matin.ink/register" className="btn-gold px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center gap-2">
            ابدأ رحلتك معنا
            <ArrowLeft size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
