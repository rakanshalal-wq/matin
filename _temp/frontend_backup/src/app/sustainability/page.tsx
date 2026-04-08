'use client';

/* MATIN DESIGN SYSTEM — Sustainability Page */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Leaf, Sun, Recycle, Globe, ArrowLeft } from "lucide-react";

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

const initiatives = [
  { icon: <Leaf size={28} />, color: "#22C55E", title: "التحول الرقمي الأخضر", desc: "نساعد المؤسسات التعليمية على التخلص من الأوراق والطباعة، مما يقلل البصمة الكربونية بشكل ملحوظ." },
  { icon: <Sun size={28} />, color: "#D4A843", title: "الطاقة المتجددة", desc: "مراكز البيانات الخاصة بنا تعمل بنسبة 60% من الطاقة المتجددة، ونسعى للوصول إلى 100% بحلول 2030." },
  { icon: <Recycle size={28} />, color: "#60A5FA", title: "اقتصاد دائري", desc: "نشجع إعادة استخدام الأجهزة والمعدات التقنية في المؤسسات التعليمية لتقليل النفايات الإلكترونية." },
  { icon: <Globe size={28} />, color: "#A78BFA", title: "التعليم عن بُعد", desc: "نمكّن التعليم الهجين والعن بُعد، مما يقلل التنقل ويخفض انبعاثات ثاني أكسيد الكربون." },
];

export default function Sustainability() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الاستدامة</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            تعليم <span className="text-gold-gradient">مستدام</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            التزامنا بالاستدامة البيئية والاجتماعية جزء لا يتجزأ من رؤيتنا لمستقبل التعليم.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {initiatives.map((item, i) => (
              <div key={i} className="matin-card p-8 fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="text-white font-black text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="matin-card p-10 text-center fade-in-up" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.05), transparent)', borderColor: 'rgba(34,197,94,0.15)' }}>
            <h2 className="text-3xl font-black text-white mb-4">هدفنا 2030</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
              نلتزم بتحقيق الحياد الكربوني بحلول عام 2030، بما يتوافق مع رؤية المملكة العربية السعودية 2030 وأهداف التنمية المستدامة للأمم المتحدة.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div>
                <div className="stat-number text-[#22C55E]">60%</div>
                <div className="text-gray-500 text-xs mt-1">طاقة متجددة حالياً</div>
              </div>
              <div>
                <div className="stat-number text-[#22C55E]">100%</div>
                <div className="text-gray-500 text-xs mt-1">هدف 2030</div>
              </div>
              <div>
                <div className="stat-number text-[#22C55E]">0</div>
                <div className="text-gray-500 text-xs mt-1">انبعاثات صافية</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
