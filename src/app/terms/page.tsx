'use client';
/* MATIN DESIGN SYSTEM — Terms Page */

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />
      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">القانونية</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-4">الشروط والأحكام</h1>
          <p className="text-gray-500 text-sm">آخر تحديث: مارس 2026</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-8">
            {[
              { title: "قبول الشروط", content: "باستخدامك لمنصة متين، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى التوقف عن استخدام المنصة." },
              { title: "الاستخدام المقبول", content: "يجب استخدام المنصة للأغراض التعليمية المشروعة فقط. يُحظر استخدام المنصة لأي نشاط غير قانوني أو ضار أو مسيء." },
              { title: "الحسابات والأمان", content: "أنت مسؤول عن الحفاظ على سرية بيانات دخولك. يجب إبلاغنا فوراً عن أي استخدام غير مصرح به لحسابك." },
              { title: "الملكية الفكرية", content: "جميع محتويات المنصة، بما في ذلك الكود والتصميم والمحتوى، هي ملكية حصرية لمنصة متين ومحمية بقوانين الملكية الفكرية." },
              { title: "المسؤولية", content: "منصة متين غير مسؤولة عن أي أضرار غير مباشرة أو عرضية ناتجة عن استخدام المنصة. مسؤوليتنا محدودة بقيمة الاشتراك المدفوع." },
              { title: "إنهاء الخدمة", content: "يحق لنا إنهاء أو تعليق حسابك في حالة انتهاك هذه الشروط. يمكنك إلغاء اشتراكك في أي وقت مع الاحتفاظ بحق الوصول حتى نهاية فترة الاشتراك." },
              { title: "القانون المطبق", content: "تخضع هذه الشروط لقوانين المملكة العربية السعودية، وأي نزاع يُحل أمام المحاكم السعودية المختصة." },
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
