'use client';

import { Award, BookOpen, Bus, GraduationCap, Laptop, Package } from "lucide-react";

// ===== DESIGN: Dark Premium — Black/Gold, Cairo font, asymmetric sections =====

export default function StorePage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: 'Cairo, sans-serif' }}>

      {/* ======== HERO ======== */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[rgba(212,168,67,0.05)] blur-[120px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.05)]">
              <ShoppingBag size={16} className="text-[#D4A843]" />
              <span className="text-[#D4A843] text-sm font-semibold">الباب الثاني عشر</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-white">المتجر </span>
              <span className="text-gold-gradient">الإلكتروني</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              امتداد رقمي لكل مؤسسة — ليس مجرد قائمة منتجات، بل بيئة تجارية متكاملة داخل المنصة تربط المؤسسة بمنتسبيها.
            </p>
          </div>
        </div>
      </section>

      {/* ======== نمطا المتجر ======== */}
      <section className="py-16 border-t border-white/5">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">نمطا المتجر</h2>
            <p className="text-gray-500">كل مؤسسة تختار النمط المناسب لها</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl border border-white/10 bg-[#111] hover:border-[rgba(212,168,67,0.3)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.1)] flex items-center justify-center mb-5">
                <Package size={24} className="text-[#D4A843]" />
              </div>
              <h3 className="text-xl font-bold mb-3">النمط العادي</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">قوالب متين الرسمية الجاهزة — تُفعَّل بنقرة واحدة وتعمل فوراً بدون أي إعداد تقني.</p>
              <ul className="space-y-2">
                {["قوالب جاهزة ومعتمدة", "إعداد سريع خلال دقائق", "تصميم موحد ومحترف", "مناسب للمدارس والحضانات"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-[#D4A843] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 rounded-2xl border border-[rgba(212,168,67,0.3)] bg-[#111] relative">
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#D4A843] text-black text-xs font-bold">متقدم</div>
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.15)] flex items-center justify-center mb-5">
                <Store size={24} className="text-[#D4A843]" />
              </div>
              <h3 className="text-xl font-bold mb-3">النمط المتقدم</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">تخصيص كامل للمتجر — هوية بصرية خاصة، تصنيفات مخصصة، وتجربة تسوق فريدة لمنتسبي المؤسسة.</p>
              <ul className="space-y-2">
                {["هوية بصرية خاصة بالمؤسسة", "تصنيفات وفئات مخصصة", "صفحات منتج مخصصة", "مناسب للجامعات والمعاهد"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-[#D4A843] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ======== أنواع المنتجات ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">أنواع المنتجات</h2>
            <p className="text-gray-500">كل ما يحتاجه منتسبو المؤسسة في مكان واحد</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { icon: "<BookOpen className="w-6 h-6" />", title: "مستلزمات مدرسية", desc: "كتب، أدوات، زي مدرسي، حقائب" },
              { icon: "<Laptop className="w-6 h-6" />", title: "منتجات رقمية", desc: "كورسات، ملفات، قوالب، اشتراكات" },
              { icon: "<GraduationCap className="w-6 h-6" />", title: "خدمات أكاديمية", desc: "دروس خصوصية، إرشاد، تدريب" },
              { icon: "<Package className="w-6 h-6" />", title: "خدمات المقصف", desc: "وجبات، مشروبات، طلبات مسبقة" },
              { icon: "<Bus className="w-6 h-6" />", title: "خدمات النقل", desc: "اشتراكات الحافلة، رسوم المسارات" },
              { icon: "<Award className="w-6 h-6" />", title: "الأنشطة والفعاليات", desc: "رحلات، بطولات، أنشطة لاصفية" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== خطوات إنشاء منتج ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">كيف يُنشئ مالك المؤسسة منتجاً</h2>
              <p className="text-gray-500">خطوات بسيطة وسريعة</p>
            </div>
            <div className="relative">
              <div className="absolute right-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4A843] via-[rgba(212,168,67,0.3)] to-transparent hidden md:block" />
              <div className="space-y-6">
                {[
                  { step: "01", title: "اسم المنتج والوصف", desc: "أدخل اسم المنتج ووصفاً واضحاً يساعد المشتري على الفهم السريع" },
                  { step: "02", title: "التصنيف والفئة", desc: "اختر الفئة المناسبة (مستلزمات / رقمي / خدمة) لتسهيل البحث" },
                  { step: "03", title: "السعر والمخزون", desc: "حدد السعر بالريال وكمية المخزون المتاحة، مع خيار السعر المخفض" },
                  { step: "04", title: "رفع الصور", desc: "أضف صور واضحة للمنتج (حتى 5 صور) بصيغة JPG أو PNG" },
                  { step: "05", title: "إعدادات الشحن", desc: "حدد طريقة الاستلام: داخل المؤسسة أو توصيل خارجي مع تحديد التكلفة" },
                  { step: "06", title: "النشر والتفعيل", desc: "راجع البيانات وانشر المنتج — يظهر فوراً لمنتسبي المؤسسة" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start pr-0 md:pr-14">
                    <div className="w-12 h-12 rounded-full bg-[rgba(212,168,67,0.15)] border border-[rgba(212,168,67,0.4)] flex items-center justify-center shrink-0 text-[#D4A843] font-black text-sm">
                      {item.step}
                    </div>
                    <div className="flex-1 p-5 rounded-xl border border-white/8 bg-[#111]">
                      <h4 className="font-bold mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== الشحن والتوصيل ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">نظام الشحن والتوصيل</h2>
              <p className="text-gray-500">خيارات مرنة تناسب كل مؤسسة</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                    <Package size={20} className="text-[#D4A843]" />
                  </div>
                  <h3 className="font-bold text-lg">استلام داخل المؤسسة</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "الطالب يستلم من مكتب محدد داخل المدرسة",
                    "إشعار تلقائي عند جاهزية الطلب للاستلام",
                    "مجاني — بدون رسوم شحن إضافية",
                    "مناسب للمستلزمات المدرسية والوجبات",
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
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                    <Truck size={20} className="text-[#D4A843]" />
                  </div>
                  <h3 className="font-bold text-lg">توصيل خارجي</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "تحدد المؤسسة تكلفة التوصيل لكل منطقة",
                    "تتبع الطلب لحظياً عبر التطبيق",
                    "التوصيل خلال المدة المحددة من المؤسسة",
                    "مناسب للمنتجات الرقمية والمستلزمات الكبيرة",
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

      {/* ======== المرتجعات والاسترداد ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">سياسة المرتجعات والاسترداد</h2>
              <p className="text-gray-500">حماية للمشتري وضمان للبائع</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <RotateCcw size={22} className="text-[#D4A843]" />,
                  title: "خلال 7 أيام",
                  desc: "استرداد كامل للمنتجات المادية غير المستخدمة خلال 7 أيام من الاستلام",
                  tag: "منتجات مادية",
                },
                {
                  icon: <Shield size={22} className="text-[#D4A843]" />,
                  title: "منتجات رقمية",
                  desc: "لا يُقبل الاسترداد بعد تحميل المنتج الرقمي أو الوصول إليه",
                  tag: "منتجات رقمية",
                },
                {
                  icon: <CheckCircle size={22} className="text-[#D4A843]" />,
                  title: "خدمات",
                  desc: "الاسترداد قبل 48 ساعة من موعد الخدمة — بعدها لا يُقبل إلا بعذر موثق",
                  tag: "خدمات",
                },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-2xl border border-white/10 bg-[#111]">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <span className="text-xs text-[#D4A843] font-semibold mb-2 block">{item.tag}</span>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== التقييمات والمراجعات ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">نظام التقييمات والمراجعات</h2>
              <p className="text-gray-500">شفافية تبني الثقة بين المؤسسة ومنتسبيها</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-5">
                  <Star size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">كيف يعمل النظام</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "فقط من اشترى المنتج يستطيع تقييمه",
                    "تقييم من 1 إلى 5 نجوم مع تعليق اختياري",
                    "التقييمات تظهر للجميع على صفحة المنتج",
                    "المؤسسة تستطيع الرد على التقييمات",
                    "التقييمات المسيئة تُراجع تلقائياً بالذكاء الاصطناعي",
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
                  <TrendingUp size={22} className="text-[#D4A843]" />
                  <h3 className="font-bold text-lg">تأثير التقييمات</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "المنتجات الأعلى تقييماً تظهر أولاً في البحث",
                    "تقييم المتجر الإجمالي يظهر في صفحة المؤسسة",
                    "تنبيه للمؤسسة عند تراجع التقييم عن 3 نجوم",
                    "إحصائيات التقييمات في لوحة تحكم المتجر",
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

      {/* ======== إحصائيات المتجر ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">إحصائيات المتجر لمالك المؤسسة</h2>
              <p className="text-gray-500">بيانات دقيقة لقرارات أذكى</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: <BarChart3 size={20} />, title: "إجمالي المبيعات", desc: "يومياً وشهرياً وسنوياً مع رسوم بيانية" },
                { icon: <TrendingUp size={20} />, title: "أكثر المنتجات مبيعاً", desc: "ترتيب المنتجات حسب الإيراد والكمية" },
                { icon: <Users size={20} />, title: "تحليل المشترين", desc: "من اشترى ماذا وكم مرة" },
                { icon: <Tag size={20} />, title: "الأرباح الصافية", desc: "بعد خصم عمولة متين وتكاليف الشحن" },
                { icon: <RotateCcw size={20} />, title: "المرتجعات", desc: "عدد ونسبة المرتجعات لكل منتج" },
                { icon: <Star size={20} />, title: "متوسط التقييم", desc: "للمتجر ككل ولكل منتج على حدة" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/8 bg-[#111] hover:border-[rgba(212,168,67,0.2)] transition-all">
                  <div className="text-[#D4A843] mb-3">{item.icon}</div>
                  <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== الإعلانات في المتجر ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-3">نظام الإعلانات</h2>
              <p className="text-gray-500">نظام إعلاني متكامل بمستويين</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                    <Megaphone size={20} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <h3 className="font-bold">إعلانات المنصة</h3>
                    <span className="text-xs text-gray-500">يديرها مالك متين</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "إجبارية على جميع لوحات التحكم",
                    "لا يمكن لأي مؤسسة إخفاؤها (إلا الباقة الذهبية)",
                    "مصدر إيراد مباشر لمتين",
                    "محتوى تعليمي وتقني فقط",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-7 rounded-2xl border border-white/10 bg-[#111]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center">
                    <Zap size={20} className="text-[#D4A843]" />
                  </div>
                  <div>
                    <h3 className="font-bold">إعلانات المؤسسة</h3>
                    <span className="text-xs text-gray-500">تديرها المؤسسة</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {[
                    "تظهر لمنتسبي المؤسسة فقط",
                    "إعلانات الفعاليات والمنتجات والخدمات",
                    "تحكم كامل في التوقيت والمحتوى",
                    "إحصائيات الظهور والنقرات",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle size={14} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* تسعير الإعلانات */}
            <div className="p-7 rounded-2xl border border-[rgba(212,168,67,0.2)] bg-[rgba(212,168,67,0.03)]">
              <h3 className="font-bold text-lg mb-5 text-[#D4A843]">تسعير الإعلانات وإدارة العقود</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { model: "بالنقرة (CPC)", desc: "تدفع فقط عند نقر المستخدم على الإعلان — مناسب للمنتجات والخدمات", price: "يبدأ من 0.5 ريال/نقرة" },
                  { model: "بالظهور (CPM)", desc: "تدفع لكل 1000 ظهور للإعلان — مناسب لزيادة الوعي بالفعاليات", price: "يبدأ من 5 ريال/1000 ظهور" },
                  { model: "بالفترة الزمنية", desc: "إعلان ثابت لفترة محددة (يوم/أسبوع/شهر) — مناسب للإعلانات الكبرى", price: "يبدأ من 50 ريال/يوم" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#111] border border-white/8">
                    <h4 className="font-bold text-sm text-[#D4A843] mb-2">{item.model}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3">{item.desc}</p>
                    <span className="text-xs text-gray-500 font-semibold">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl bg-[#111] border border-white/8">
                <h4 className="font-bold text-sm mb-2">إدارة العقود الإعلانية</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "عقد إلكتروني موقّع عبر توكلنا لكل حملة إعلانية",
                    "فاتورة ضريبية تلقائية بعد كل دورة دفع",
                    "لوحة تحكم للحملات: بداية، نهاية، ميزانية، أداء",
                    "إيقاف الحملة تلقائياً عند انتهاء الميزانية",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <CheckCircle size={12} className="text-[#D4A843] shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== عمولة متين ======== */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-8 rounded-2xl border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.03)]">
              <h2 className="text-2xl font-black mb-4">نموذج الإيراد</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                متين تأخذ عمولة من كل عملية بيع تتم عبر المتجر — نسبة شفافة ومحددة مسبقاً في عقد الاشتراك. كلما نجح متجر مؤسستك، كلما نمت شراكتنا معاً.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "الباقة الأساسية", value: "5%" },
                  { label: "الباقة الاحترافية", value: "3%" },
                  { label: "الباقة المؤسسية", value: "2%" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#111] border border-white/8">
                    <div className="text-2xl font-black text-[#D4A843] mb-1">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">افتح متجرك الآن</h2>
            <p className="text-gray-400 mb-8">ابدأ ببيع المنتجات والخدمات لمنتسبي مؤسستك خلال 24 ساعة</p>
            <a href="https://app.matin.ink/register" className="btn-primary inline-flex items-center gap-2">
              ابدأ تجربتك المجانية
              <ChevronLeft size={18} />
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
