'use client';
/* MATIN DESIGN SYSTEM — Integrations Page
   Dark Premium SaaS | RTL | Cairo Font
   Per Constitution v4: Noor, Nafaz, MOE, STC Pay, Visa, Mastercard, Apple Pay, Mada, WhatsApp, Firebase, Unifonic, Cloudflare, Google Auth */

import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, ArrowLeft } from "lucide-react";

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

const integrationGroups = [
  {
    title: "التكاملات الحكومية",
    desc: "ربط مباشر مع الأنظمة الحكومية السعودية لضمان الامتثال والموثوقية",
    color: "#22C55E",
    items: [
      {
        name: "نور",
        emoji: "🏛️",
        desc: "التحقق من بيانات الطلاب والمعلمين من نظام نور التعليمي الحكومي",
        features: ["التحقق من الهوية الوطنية", "ربط بيانات الطلاب", "إرسال التقارير الرسمية"]
      },
      {
        name: "نفاذ",
        emoji: "🔐",
        desc: "المصادقة الحكومية الموحدة لتسجيل الدخول الآمن بالهوية الوطنية",
        features: ["تسجيل دخول بالهوية الوطنية", "المصادقة الثنائية الحكومية", "توثيق المستخدمين"]
      },
      {
        name: "وزارة التعليم",
        emoji: "📚",
        desc: "إرسال التقارير والبيانات الرسمية لوزارة التعليم تلقائياً",
        features: ["تقارير الحضور الرسمية", "بيانات الدرجات", "إحصائيات المؤسسة"]
      },
    ],
  },
  {
    title: "التكاملات المالية",
    desc: "حلول دفع متعددة معتمدة لتسهيل تحصيل الرسوم وإدارة المدفوعات",
    color: "#D4A843",
    items: [
      {
        name: "STC Pay",
        emoji: "💳",
        desc: "الدفع الآمن والسريع عبر محفظة STC Pay السعودية",
        features: ["دفع فوري", "تحقق آمن", "سجل المعاملات"]
      },
      {
        name: "مدى",
        emoji: "🏦",
        desc: "قبول بطاقات مدى الصادرة من البنوك السعودية",
        features: ["بطاقات مدى", "دفع آمن", "تقارير مالية"]
      },
      {
        name: "Apple Pay",
        emoji: "🍎",
        desc: "الدفع السريع عبر Apple Pay للأجهزة الآبل",
        features: ["دفع بلمسة واحدة", "تشفير عالٍ", "موافقة فورية"]
      },
      {
        name: "Visa / Mastercard",
        emoji: "💰",
        desc: "قبول جميع بطاقات Visa وMastercard الائتمانية والمدفوعة مسبقاً",
        features: ["بطاقات ائتمانية", "بطاقات مدفوعة مسبقاً", "دفع آمن 3D Secure"]
      },
    ],
  },
  {
    title: "تكاملات التواصل",
    desc: "قنوات تواصل متعددة للتواصل الفوري مع جميع أطراف المنظومة التعليمية",
    color: "#60A5FA",
    items: [
      {
        name: "واتساب Business",
        emoji: "💬",
        desc: "إشعارات فورية عبر واتساب لأولياء الأمور والطلاب والمعلمين",
        features: ["إشعارات الحضور", "الدرجات والتقارير", "رسائل مخصصة"]
      },
      {
        name: "Firebase",
        emoji: "🔔",
        desc: "Push Notifications للتطبيق المحمول على iOS وAndroid",
        features: ["إشعارات فورية", "تخصيص الإشعارات", "إحصائيات التفاعل"]
      },
      {
        name: "Unifonic",
        emoji: "📱",
        desc: "رسائل SMS للتنبيهات والتحقق من الهوية",
        features: ["رسائل OTP", "تنبيهات الغياب", "إشعارات الاختبارات"]
      },
    ],
  },
  {
    title: "تكاملات الأمان",
    desc: "طبقات حماية إضافية لضمان أمان البيانات والمنصة على أعلى مستوى",
    color: "#EC4899",
    items: [
      {
        name: "Cloudflare",
        emoji: "🛡️",
        desc: "حماية من الهجمات الإلكترونية وتسريع الموقع عالمياً",
        features: ["DDoS Protection", "WAF", "CDN عالمي"]
      },
      {
        name: "Google Authenticator",
        emoji: "🔑",
        desc: "تطبيق المصادقة الثنائية الأكثر أماناً وانتشاراً",
        features: ["TOTP", "رموز احتياطية", "مزامنة آمنة"]
      },
    ],
  },
];

export default function Integrations() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">التكاملات</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            متصل بكل ما <span className="text-gold-gradient">تحتاجه</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            تكاملات مع الأنظمة الحكومية السعودية وبوابات الدفع المعتمدة وقنوات التواصل لتجربة سلسة ومتكاملة.
          </p>
        </div>
      </section>

      {integrationGroups.map((group, gIdx) => (
        <section key={gIdx} className={`py-16 ${gIdx % 2 === 1 ? "bg-[#0d0d0d]" : ""}`}>
          <div className="container">
            <div className="mb-10 fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-6 rounded-full" style={{ background: group.color }} />
                <h2 className="text-2xl font-black text-white">{group.title}</h2>
              </div>
              <p className="text-gray-500 mr-5">{group.desc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item, i) => (
                <div key={i} className="matin-card p-6 fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${group.color}15` }}>
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{item.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle size={13} style={{ color: group.color }} className="flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 bg-[#0d0d0d]">
        <div className="container text-center">
          <h2 className="text-3xl font-black text-white mb-4">هل تحتاج تكاملاً مخصصاً؟</h2>
          <p className="text-gray-500 mb-8">فريقنا التقني يمكنه بناء تكاملات مخصصة لاحتياجاتك الخاصة</p>
          <a href="mailto:hello@matin.ink" className="btn-gold px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center gap-2">
            تواصل مع الفريق التقني
            <ArrowLeft size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
