'use client';

/* MATIN DESIGN SYSTEM — Contact Page */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, MessageSquare, Clock, ArrowLeft } from "lucide-react";

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

const contactMethods = [
  { icon: <MessageSquare size={24} />, color: "#22C55E", title: "واتساب", desc: "تحدث معنا مباشرة", action: "ابدأ المحادثة", href: "https://wa.me/966500000000" },
  { icon: <Mail size={24} />, color: "#D4A843", title: "البريد الإلكتروني", desc: "hello@matin.ink", action: "أرسل رسالة", href: "mailto:hello@matin.ink" },
  { icon: <Phone size={24} />, color: "#60A5FA", title: "الهاتف", desc: "+966 50 000 0000", action: "اتصل الآن", href: "tel:+966500000000" },
  { icon: <Clock size={24} />, color: "#F97316", title: "ساعات العمل", desc: "الأحد - الخميس، 8ص - 6م", action: null, href: null },
];

export default function Contact() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">تواصل معنا</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            نحن هنا <span className="text-gold-gradient">لمساعدتك</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            فريقنا متاح على مدار الساعة للإجابة على استفساراتك ومساعدتك في البدء.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, i) => (
              <div key={i} className="matin-card p-6 text-center fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${method.color}15`, color: method.color }}
                >
                  {method.icon}
                </div>
                <h3 className="text-white font-bold mb-2">{method.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{method.desc}</p>
                {method.action && method.href && (
                  <a
                    href={method.href}
                    className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold inline-block"
                    style={{ color: method.color, borderColor: method.color }}
                  >
                    {method.action}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="matin-card p-8 fade-in-up">
              <h2 className="text-2xl font-black text-white mb-6">أرسل لنا رسالة</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors"
                      placeholder="محمد أحمد"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors"
                      placeholder="example@school.edu.sa"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">اسم المؤسسة</label>
                  <input
                    type="text"
                    className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors"
                    placeholder="مدرسة النجاح الأهلية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">رقم الجوال</label>
                  <input
                    type="tel"
                    className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors"
                    placeholder="+966 5X XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">رسالتك</label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#1a1a1a] border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4A843] transition-colors resize-none"
                    placeholder="أخبرنا عن مؤسستك واحتياجاتك..."
                  />
                </div>
                <button type="submit" className="btn-gold w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                  إرسال الرسالة
                  <ArrowLeft size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
