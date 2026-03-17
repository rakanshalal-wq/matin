'use client';

import { BookOpen, Drama, Handshake, Heart, Laptop, MessageCircle, Microscope, Palette, PenTool, RefreshCw, Sprout, Trophy, Bell, Brain, CheckCircle, ChevronLeft, Globe, Lock, MessageSquare, Shield, UserCheck, Users } from "lucide-react";

// ===== DESIGN: Dark Premium — Black/Gold, Cairo font =====

export default function CommunityPage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: 'Cairo, sans-serif' }}>

      {/* ======== HERO ======== */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[rgba(212,168,67,0.05)] blur-[120px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.05)]">
              <Users size={16} className="text-[#D4A843]" />
              <span className="text-[#D4A843] text-sm font-semibold">الباب الحادي عشر</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-white">الملتقى </span>
              <span className="text-gold-gradient">المجتمعي</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              فضاء اجتماعي داخلي آمن — مثل X لكن مغلق ومقيّد بمنتسبي المؤسسة فقط، مع رقابة ذكاء اصطناعي فورية.
            </p>
          </div>
        </div>
      </section>

      {/* ======== المنشور العام vs الخاص ======== */}
      <section className="py-16 border-t border-white/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">أنواع المنشورات</h2>
            <p className="text-gray-500">تحكم كامل في من يرى ماذا</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border border-white/10 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                  <Globe size={20} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">منشور عام</h3>
                  <span className="text-xs text-gray-500">لجميع منتسبي المؤسسة</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                يظهر لجميع أعضاء المؤسسة — طلاب، معلمون، إداريون. مناسب للإعلانات والأخبار والمحتوى التعليمي العام.
              </p>
              <ul className="space-y-2">
                {[
                  "يراه كل منتسبي المؤسسة",
                  "يظهر في الصفحة الرئيسية للملتقى",
                  "يمكن التعليق والتفاعل من الجميع",
                  "المعلم يستطيع نشر مواد تعليمية عامة",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-[rgba(212,168,67,0.3)] bg-[#111]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.15)] flex items-center justify-center">
                  <Lock size={20} className="text-[#D4A843]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">منشور خاص</h3>
                  <span className="text-xs text-[#D4A843]">لمجموعة أو ناد محدد</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                يظهر فقط لأعضاء مجموعة أو ناد معين. مناسب للمناقشات الأكاديمية الخاصة بفصل دراسي أو نادٍ طلابي.
              </p>
              <ul className="space-y-2">
                {[
                  "يراه أعضاء المجموعة/الناد فقط",
                  "المعلم يشارك مواد لفصله المحدد",
                  "نقاشات خاصة بين أعضاء النادي",
                  "ملفات ووثائق خاصة بالمجموعة",
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

      {/* ======== التفاعلات ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">التفاعلات المتاحة</h2>
            <p className="text-gray-500">تجربة اجتماعية كاملة داخل المؤسسة</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "PenTool️", title: "النشر", desc: "نص أو صور أو ملفات" },
              { icon: "Heart️", title: "اللايك", desc: "تفاعل سريع مع المنشورات" },
              { icon: "ICON_MessageCircle", title: "التعليق", desc: "نقاشات تحت كل منشور" },
              { icon: "ICON_RefreshCw", title: "إعادة النشر", desc: "مشاركة المحتوى المفيد" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] text-center hover:border-[rgba(212,168,67,0.2)] transition-all">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== الأندية والمجموعات ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">إدارة الأندية والمجموعات</h2>
              <p className="text-gray-500">كل ناد عالم خاص به داخل المؤسسة</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <Users size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">هيكل النادي</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "كل ناد له اسم وصورة ووصف خاص",
                    "مشرف النادي يعيّنه مدير المؤسسة",
                    "المشرف يقبل ويرفض طلبات الانضمام",
                    "صفحة ملتقى خاصة بأعضاء النادي فقط",
                    "ملفات ووثائق خاصة بالنادي",
                    "إحصائيات النشاط لكل ناد",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <UserCheck size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">صلاحيات المشرف</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "قبول أو رفض طلبات الانضمام",
                    "حذف أي منشور مخالف داخل النادي",
                    "تعيين نواب مشرفين",
                    "إنشاء فعاليات خاصة بالنادي",
                    "إرسال إشعارات لجميع أعضاء النادي",
                    "تقرير نشاط شهري للإدارة",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* أمثلة على الأندية */}
            <div className="p-6 rounded-2xl border border-white/8 bg-[#111]">
              <h4 className="font-bold mb-4 text-[#D4A843]">أمثلة على الأندية</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Microscope نادي العلوم", "Palette نادي الفنون", "Laptop نادي البرمجة", "BookOpen نادي القراءة", "Trophy النادي الرياضي", "Drama نادي المسرح", "Sprout نادي البيئة", "Handshake نادي التطوع"].map((item, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg bg-[#0d0d0d] border border-white/5 text-sm text-gray-300 text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== المعلم في الملتقى ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">المعلم في الملتقى</h2>
              <p className="text-gray-500">أداة تعليمية وتواصلية في آنٍ واحد</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <BookOpen size={22} className="text-[#D4A843]" />,
                  title: "نشر مواد تعليمية",
                  items: [
                    "ملفات PDF وعروض تقديمية",
                    "روابط مقاطع فيديو تعليمية",
                    "أسئلة مراجعة وتدريبات",
                    "منشور عام أو خاص بفصله",
                  ],
                },
                {
                  icon: <MessageSquare size={22} className="text-[#D4A843]" />,
                  title: "التواصل مع أولياء الأمور",
                  items: [
                    "غرف تواصل مباشر مع ولي الأمر",
                    "محكومة بساعات العمل الرسمية",
                    "لا رسائل خارج أوقات الدوام",
                    "سجل كامل للمحادثات",
                  ],
                },
                {
                  icon: <Bell size={22} className="text-[#D4A843]" />,
                  title: "الإشعارات والتنبيهات",
                  items: [
                    "إشعار لطلابه عند نشر مادة جديدة",
                    "تذكير بالواجبات والاختبارات",
                    "إعلانات خاصة بفصله",
                    "إحصائيات تفاعل الطلاب مع المحتوى",
                  ],
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#111]">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
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

      {/* ======== الرقابة والأمان ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">الرقابة والأمان</h2>
              <p className="text-gray-500">بيئة آمنة بالكامل للطلاب</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <Brain size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">رقابة الذكاء الاصطناعي</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "يحذف الكلمات النابية قبل النشر تلقائياً",
                    "يكتشف المحتوى غير اللائق فوراً",
                    "يرصد علامات التنمر في التعليقات",
                    "يحلل نبرة الكتابة لاكتشاف الضغط النفسي",
                    "تنبيه سري للأخصائي الاجتماعي عند الحاجة",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <Shield size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">صلاحيات الإشراف البشري</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "المشرف يحذف أي منشور مخالف",
                    "إيقاف عضو مؤقتاً أو دائماً",
                    "من يُلغى تسجيله يفقد الوصول فوراً",
                    "الإبلاغ عن منشور من أي عضو",
                    "سجل كامل لجميع الإجراءات التأديبية",
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

      {/* ======== الصحة النفسية ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.03)]">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.15)] flex items-center justify-center shrink-0">
                  <Heart size={24} className="text-[#D4A843]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black mb-2">نظام الصحة النفسية — AI Well-being</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    متين تحرص على البيئة التعليمية الإنسانية عبر نظام ذكاء اصطناعي يراقب الصحة النفسية للطلاب بشكل سري وغير مباشر.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "التحليل", desc: "تحليل نبرة الكتابة والتفاعل في الملتقى باستخدام معالجة اللغات الطبيعية (NLP)" },
                  { title: "الرصد المبكر", desc: "رصد مبكر لحالات التنمر، الإحباط، والضغط النفسي الشديد" },
                  { title: "التدخل السري", desc: "تنبيه سري للأخصائي الاجتماعي — المعلومة لا تصل للطالب أو ولي الأمر مباشرة" },
                  { title: "التدخل الإنساني", desc: "التدخل يكون بشكل طبيعي غير مباشر — الهدف الدعم لا العقاب" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#111] border border-white/8">
                    <h4 className="font-bold text-sm text-[#D4A843] mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl bg-[#111] border border-white/8 text-center">
                <p className="text-sm text-gray-400">
                  <span className="text-[#D4A843] font-bold">الهدف: </span>
                  متين هي الأكثر أماناً نفسياً للطالب في المملكة
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">ابنِ مجتمعاً داخل مؤسستك</h2>
            <p className="text-gray-400 mb-8">الملتقى المجتمعي متاح من الباقة الاحترافية فما فوق</p>
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
