'use client';
/* MATIN DESIGN SYSTEM — News Page */

import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowLeft } from "lucide-react";

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

const newsItems = [
  {
    date: "مارس 2026",
    category: "إطلاق",
    title: "إطلاق الإصدار 3.0 من منصة متين",
    desc: "أعلنت منصة متين عن إطلاق الإصدار 3.0، الذي يتضمن ركائز الابتكار الخمس وتكاملات حكومية جديدة.",
    color: "#D4A843",
  },
  {
    date: "فبراير 2026",
    category: "شراكة",
    title: "شراكة استراتيجية مع STC Pay",
    desc: "أعلنت متين عن شراكة استراتيجية مع STC Pay لتوفير حلول دفع متكاملة لجميع المؤسسات التعليمية.",
    color: "#22C55E",
  },
  {
    date: "يناير 2026",
    category: "تكامل",
    title: "تكامل متين مع Apple Pay ومدى",
    desc: "أتمت متين تكامل بوابة الدفع مع Apple Pay ومدى، لتوفير خيارات دفع متكاملة لجميع المؤسسات التعليمية.",
    color: "#60A5FA",
  },
  {
    date: "ديسمبر 2025",
    category: "تقنية",
    title: "إطلاق نظام AI Auditor للمراقبة الذكية",
    desc: "أطلقت متين نظام المراقبة الذكي AI Auditor الذي يكتشف التهديدات الأمنية ويتدخل تلقائياً.",
    color: "#F97316",
  },
  {
    date: "نوفمبر 2025",
    category: "تكامل",
    title: "تكامل رسمي مع نظام نور التعليمي",
    desc: "أتمت متين التكامل الرسمي مع نظام نور التعليمي التابع لوزارة التعليم السعودية.",
    color: "#A78BFA",
  },
  {
    date: "أكتوبر 2025",
    category: "إطلاق",
    title: "إطلاق خدمة النقل المدرسي الذكي",
    desc: "أطلقت متين خدمة النقل المدرسي الذكي مع تتبع GPS حي وإشعارات فورية لأولياء الأمور.",
    color: "#EC4899",
  },
];

export default function News() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الأخبار</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            آخر <span className="text-gold-gradient">أخبار متين</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            تابع أحدث المستجدات والإعلانات من منصة متين التعليمية.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <div key={i} className="matin-card p-6 fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: `${item.color}15`, color: item.color }}
                  >
                    {item.category}
                  </span>
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <Calendar size={12} />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
