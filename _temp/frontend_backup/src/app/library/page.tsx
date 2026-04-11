'use client';

import { Flower2, GraduationCap, School, BarChart3, BookMarked, BookOpen, CheckCircle, ChevronLeft, FileText, Headphones, RefreshCw, Search, Star, Users, Video } from "lucide-react";
import IconRenderer from "@/components/IconRenderer";

// ===== DESIGN: Dark Premium — Black/Gold, Cairo font =====

export default function LibraryPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: 'Cairo, sans-serif' }}>

      {/* ======== HERO ======== */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 rounded-full bg-[rgba(212,168,67,0.05)] blur-[120px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.05)]">
              <BookOpen size={16} className="text-[#D4A843]" />
              <span className="text-[#D4A843] text-sm font-semibold">الباب السابع عشر</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-white">المكتبة </span>
              <span className="text-gold-gradient">الرقمية</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              مكتبة رقمية متكاملة مدمجة داخل المنصة — الطالب يقرأ ويبحث ويضع ملاحظاته دون مغادرة متين.
            </p>
          </div>
        </div>
      </section>

      {/* ======== نموذجا المكتبة ======== */}
      <section className="py-16 border-t border-white/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">نموذجا المكتبة</h2>
            <p className="text-gray-500">مصدران للمحتوى في مكان واحد</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* النموذج الأول */}
            <div className="p-8 rounded-2xl border border-white/10 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                  <GraduationCap size={24} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">مكتبة وزارة التعليم</h3>
                  <span className="text-xs text-green-400 font-semibold">مجاني لجميع الباقات</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                الكتب المدرسية المعتمدة من وزارة التعليم — متاحة مجاناً لجميع الطلاب وتتحدث تلقائياً مع المناهج الدراسية.
              </p>
              <ul className="space-y-2">
                {[
                  "جميع الكتب المدرسية المعتمدة",
                  "تحديث تلقائي مع تغييرات المناهج",
                  "متاحة لجميع المراحل الدراسية",
                  "بحث داخل الكتاب بالكلمات المفتاحية",
                  "مجانية بالكامل — بدون رسوم إضافية",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* النموذج الثاني */}
            <div className="p-8 rounded-2xl border border-[rgba(212,168,67,0.3)] bg-[#111]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.15)] flex items-center justify-center">
                  <Star size={24} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">شراكة وجيز وغيره</h3>
                  <span className="text-xs text-[#D4A843] font-semibold">باقة احترافية فما فوق</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                محتوى تعليمي متميز من مزودي المحتوى الرائدين — مدمج مباشرة داخل المنصة بدون الحاجة لتطبيقات خارجية.
              </p>
              <ul className="space-y-2">
                {[
                  "آلاف الكتب والمراجع الأكاديمية",
                  "شروحات مرئية وصوتية للمواد",
                  "محتوى إثرائي يتجاوز المنهج",
                  "مكتبة للجامعات والمعاهد التدريبية",
                  "الطالب يقرأ ويضع ملاحظات داخل المنصة",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======== أنواع المحتوى ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">أنواع المحتوى</h2>
            <p className="text-gray-500">تنوع يناسب كل أسلوب تعلم</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: <FileText size={22} className="text-[#D4A843]" />, title: "كتب ومراجع", desc: "PDF تفاعلي مع بحث وتعليقات" },
              { icon: <Video size={22} className="text-[#D4A843]" />, title: "شروحات مرئية", desc: "فيديوهات تعليمية مدمجة" },
              { icon: <Headphones size={22} className="text-[#D4A843]" />, title: "محتوى صوتي", desc: "كتب مسموعة وبودكاست تعليمي" },
              { icon: <BookMarked size={22} className="text-[#D4A843]" />, title: "ملاحظاتي", desc: "تدوين ملاحظات على أي محتوى" },
              { icon: <Search size={22} className="text-[#D4A843]" />, title: "بحث ذكي", desc: "بحث بالكلمة أو الموضوع أو المادة" },
              { icon: <RefreshCw size={22} className="text-[#D4A843]" />, title: "تحديث تلقائي", desc: "المحتوى يتحدث مع المناهج" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
                <div className="mb-3">{item.icon}</div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== تجربة الطالب ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">تجربة الطالب في المكتبة</h2>
              <p className="text-gray-500">قراءة ذكية داخل المنصة</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <h3 className="font-bold text-lg mb-5 text-[#D4A843]">أثناء القراءة</h3>
                <ul className="space-y-3">
                  {[
                    "تظليل النصوص المهمة بألوان مختلفة",
                    "إضافة ملاحظات على أي صفحة",
                    "إشارة مرجعية للصفحات المهمة",
                    "تغيير حجم الخط وسطوع الشاشة",
                    "وضع القراءة الليلي لحماية العينين",
                    "القراءة أوفلاين بعد التحميل",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <h3 className="font-bold text-lg mb-5 text-[#D4A843]">متابعة التقدم</h3>
                <ul className="space-y-3">
                  {[
                    "نسبة إكمال كل كتاب أو مادة",
                    "سجل القراءة اليومي والأسبوعي",
                    "تذكير بمتابعة الكتب غير المكتملة",
                    "شارات تحفيزية عند إكمال كتاب",
                    "مقارنة مع متوسط الفصل الدراسي",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== إحصائيات للمعلم ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">إحصائيات القراءة للمعلم</h2>
              <p className="text-gray-500">بيانات تساعد المعلم على متابعة طلابه</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <BarChart3 size={20} />, title: "نسبة القراءة", desc: "كم قرأ كل طالب من المادة المطلوبة" },
                { icon: <Users size={20} />, title: "أكثر الطلاب قراءة", desc: "ترتيب الطلاب حسب ساعات القراءة" },
                { icon: <BookOpen size={20} />, title: "أكثر الكتب قراءة", desc: "الكتب الأكثر تفاعلاً في الفصل" },
                { icon: <RefreshCw size={20} />, title: "الطلاب المتأخرون", desc: "من لم يبدأ القراءة المطلوبة بعد" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
                  <div className="text-[#D4A843] mb-3">{item.icon}</div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-5 rounded-xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.03)] text-center">
              <p className="text-sm text-gray-400">
                <span className="text-[#D4A843] font-bold">ملاحظة: </span>
                إحصائيات القراءة تُرسل للمعلم تلقائياً — الطالب يعلم أن قراءته مرصودة لتحفيزه على الاستمرار.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======== المكتبة حسب نوع المؤسسة ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">المكتبة لكل مؤسسة</h2>
              <p className="text-gray-500">محتوى مخصص لكل نوع</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { emoji: "ICON_School", title: "المدارس", items: ["كتب وزارة التعليم الكاملة", "مراجع ومذكرات مساعدة", "أسئلة الاختبارات السابقة", "محتوى إثرائي للمتفوقين"] },
                { emoji: "ICON_GraduationCap", title: "الجامعات والمعاهد", items: ["مراجع أكاديمية متخصصة", "أبحاث ودوريات علمية", "مكتبة رسائل الماجستير", "محتوى تدريبي مهني"] },
                { emoji: "ICON_Flower2", title: "رياض الأطفال", items: ["قصص تفاعلية مصورة", "أناشيد وأغاني تعليمية", "ألعاب تعليمية رقمية", "محتوى لأولياء الأمور"] },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
                  <div className="text-4xl mb-4"><IconRenderer name={item.emoji} /></div>
                  <h4 className="font-bold mb-4">{item.title}</h4>
                  <ul className="space-y-2">
                    {item.items.map((li, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle size={13} className="text-[#D4A843] shrink-0 mt-0.5" />
                        {li}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">افتح المكتبة لطلابك</h2>
            <p className="text-gray-400 mb-8">مكتبة وزارة التعليم مجانية في جميع الباقات — المحتوى المتميز من الباقة الاحترافية</p>
            <a href="/pricing" className="btn-primary inline-flex items-center gap-2">
              اطلع على الباقات
              <ChevronLeft size={18} />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
