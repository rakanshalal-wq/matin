/* MATIN DESIGN SYSTEM — Privacy Policy Page */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />
      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">القانونية</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4">سياسة الخصوصية</h1>
          <p className="text-gray-500 text-sm">آخر تحديث: مارس 2026</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-8">
            {[
              { title: "جمع البيانات", content: "نجمع فقط البيانات الضرورية لتشغيل المنصة وتقديم الخدمات. لا نجمع بيانات غير ضرورية أو نبيعها لأطراف ثالثة." },
              { title: "استخدام البيانات", content: "تُستخدم البيانات حصراً لتقديم خدمات المنصة، وتحسين تجربة المستخدم، والامتثال للمتطلبات القانونية." },
              { title: "حماية البيانات", content: "نستخدم تشفير AES-256 لجميع البيانات المخزنة، وTLS 1.3 للبيانات المنقولة. بياناتك محمية بـ 8 طبقات أمان." },
              { title: "مشاركة البيانات", content: "لا نشارك بياناتك مع أطراف ثالثة إلا في حالات الامتثال القانوني أو بموافقتك الصريحة." },
              { title: "حقوقك", content: "لك الحق في الوصول لبياناتك، تصحيحها، حذفها، أو نقلها في أي وقت. تواصل معنا على hello@matin.ink." },
              { title: "الاحتفاظ بالبيانات", content: "نحتفظ بالبيانات طوال فترة الاشتراك النشط، وبعد الإلغاء لمدة 90 يوماً ثم يتم حذفها نهائياً." },
            ].map((section, i) => (
              <div key={i} className="matin-card p-6">
                <h2 className="text-white font-black text-xl mb-3">{section.title}</h2>
                <p className="text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
