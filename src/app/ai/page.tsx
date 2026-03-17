'use client';
/* MATIN DESIGN SYSTEM — AI Page */

import { useEffect } from "react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Brain, TrendingUp, Heart, Award, Wallet, Star } from "lucide-react";

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

const aiFeatures = [
  {
    icon: <TrendingUp size={32} />,
    color: "#D4A843",
    title: "التوجيه المهني الذكي",
    subtitle: "AI Career Pathing",
    desc: "نظام ذكاء اصطناعي يحلل مهارات الطالب وأدائه الأكاديمي واهتماماته، ثم يقترح مسارات وظيفية مناسبة ويوجهه نحو التخصصات الأكثر توافقاً مع قدراته.",
    points: [
      "تحليل نقاط القوة والضعف الأكاديمية",
      "اقتراح مسارات وظيفية مناسبة",
      "ربط المهارات بسوق العمل السعودي",
      "توافق مع رؤية 2030",
    ],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/ai-education-YjCBdyveQJPPGeGRx99ChZ.webp",
  },
  {
    icon: <Award size={32} />,
    color: "#22C55E",
    title: "جواز سفر المهارات",
    subtitle: "Skills Passport",
    desc: "ملف رقمي شامل يتابع الطالب مدى الحياة، يسجل كل إنجاز ومهارة ونشاط من رياض الأطفال حتى سوق العمل، وينتقل معه بين المؤسسات التعليمية.",
    points: [
      "سجل شامل لجميع الإنجازات",
      "ينتقل بين المؤسسات التعليمية",
      "موثق ومعتمد رقمياً",
      "يُستخدم في التقديم للجامعات والوظائف",
    ],
    image: null,
  },
  {
    icon: <Heart size={32} />,
    color: "#EC4899",
    title: "مراقبة الصحة النفسية",
    subtitle: "AI Well-being",
    desc: "نظام ذكي يراقب مؤشرات الصحة النفسية للطلاب بطريقة سرية وإنسانية، ويتدخل مبكراً عند اكتشاف علامات التوتر أو الاكتئاب أو التنمر.",
    points: [
      "مراقبة سرية وإنسانية",
      "تنبيهات مبكرة للمرشدين",
      "تقارير دورية للإدارة",
      "حماية خصوصية الطالب",
    ],
    image: null,
  },
  {
    icon: <Star size={32} />,
    color: "#F97316",
    title: "متين كوين",
    subtitle: "Matin Coin",
    desc: "اقتصاد داخلي مبتكر يحفز الطلاب على الإنجاز والمشاركة الإيجابية. يكسب الطلاب عملات متين مقابل الحضور والدرجات والأنشطة، ويستبدلونها بمكافآت.",
    points: [
      "مكافأة الحضور المنتظم",
      "تحفيز على الإنجاز الأكاديمي",
      "استبدال بمكافآت حقيقية",
      "تعزيز المنافسة الإيجابية",
    ],
    image: null,
  },
  {
    icon: <Wallet size={32} />,
    color: "#A78BFA",
    title: "المحفظة التعليمية الموحدة",
    subtitle: "Educational Portfolio",
    desc: "ملف شامل يجمع كل تاريخ الطالب التعليمي في مكان واحد — من الدرجات والشهادات إلى الأنشطة والمهارات — وينتقل معه بين المؤسسات.",
    points: [
      "سجل تعليمي كامل ومتكامل",
      "شهادات موثقة رقمياً",
      "سهولة التحويل بين المؤسسات",
      "مقبول من الجامعات والجهات الرسمية",
    ],
    image: null,
  },
];

export default function AI() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الذكاء الاصطناعي</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            ركائز الابتكار <span className="text-gold-gradient">الخمس</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            متين لا تكتفي بإدارة المدرسة — بل تبني مستقبل الطالب بالذكاء الاصطناعي.
          </p>
        </div>
      </section>

      {/* AI Hero Image */}
      <section className="pb-16">
        <div className="container">
          <div className="fade-in-up rounded-2xl overflow-hidden border border-white/8 max-h-80 overflow-hidden">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663430723344/NkUVobJTWfHHFdjs4pEyWK/ai-education-YjCBdyveQJPPGeGRx99ChZ.webp"
              alt="الذكاء الاصطناعي في التعليم"
              className="w-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* AI Features */}
      {aiFeatures.map((feature, i) => (
        <section key={i} className={`py-16 ${i % 2 === 1 ? "bg-[#0d0d0d]" : ""}`}>
          <div className="container">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className="fade-in-up">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${feature.color}15`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <div className="text-xs font-bold mb-2" style={{ color: feature.color }}>{feature.subtitle}</div>
                <h2 className="text-3xl font-black text-white mb-4">{feature.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.points.map((point, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${feature.color}20` }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: feature.color }}></div>
                      </div>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="fade-in-up">
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}08, transparent)`,
                    border: `1px solid ${feature.color}20`,
                  }}
                >
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: `${feature.color}15`, color: feature.color }}
                  >
                    <div style={{ transform: 'scale(1.5)' }}>{feature.icon}</div>
                  </div>
                  <h3 className="text-white font-black text-xl mb-2">{feature.title}</h3>
                  <p className="text-xs font-semibold" style={{ color: feature.color }}>{feature.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            ابنِ مستقبل <span className="text-gold-gradient">طلابك</span> معنا
          </h2>
          <p className="text-gray-500 mb-8">الذكاء الاصطناعي في متين ليس مجرد أداة — بل شريك في بناء الإنسان</p>
          <a href="https://app.matin.ink/register" className="btn-gold px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center gap-2">
            ابدأ تجربتك المجانية
            <ArrowLeft size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
