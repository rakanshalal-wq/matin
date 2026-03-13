'use client';
import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = [
  {
    id: 'academic', label: 'أكاديمي', color: '#C9A84C',
    features: [
      { icon: '📅', title: 'الجدول الدراسي', desc: 'بناء جداول ذكية تلقائياً مع تجنب التعارضات. دعم الحصص المزدوجة والمختبرات والفصول المتعددة.' },
      { icon: '✅', title: 'الحضور والغياب', desc: 'تسجيل دقيق مع تنبيهات فورية لأولياء الأمور. تقارير شهرية وسنوية. تكامل مع GPS للتحقق.' },
      { icon: '📊', title: 'الدرجات والتقييم', desc: 'إدارة شاملة للدرجات والمعدلات. نظام GPA، توزيع الدرجات، التقارير الفصلية والسنوية.' },
      { icon: '📝', title: 'الاختبارات', desc: 'اختبارات آمنة مع كشف الغش. بنك أسئلة ذكي، توزيع تلقائي، تصحيح فوري، تحليل النتائج.' },
      { icon: '📚', title: 'الواجبات', desc: 'إدارة الواجبات والتسليمات. تذكيرات تلقائية، تصحيح إلكتروني، تقارير الإنجاز.' },
      { icon: '🎓', title: 'القبول والتسجيل', desc: 'من الطلب للطالب النشط. نماذج إلكترونية، مراجعة المستندات، قوائم الانتظار، التحقق من نور.' },
    ],
  },
  {
    id: 'elearning', label: 'تعليم إلكتروني', color: '#3B82F6',
    features: [
      { icon: '💻', title: 'المحاضرات المباشرة', desc: 'فصول افتراضية متكاملة. بث مباشر، تسجيل، غرف جانبية، لوح تفاعلي، استطلاعات فورية.' },
      { icon: '🎬', title: 'المحتوى المسجل', desc: 'مكتبة محتوى تعليمي. رفع الفيديوهات، تنظيمها، التحكم في الوصول، تتبع المشاهدة.' },
      { icon: '🧩', title: 'بنك الأسئلة', desc: 'بنك أسئلة ذكي بأنواع متعددة. MCQ، صح/خطأ، مقالي، تطبيقي. تصنيف حسب المادة والصعوبة.' },
      { icon: '📖', title: 'المناهج الرقمية', desc: 'رفع وتنظيم المناهج الدراسية. كتب إلكترونية، ملفات PDF، روابط خارجية، تنظيم حسب الوحدات.' },
    ],
  },
  {
    id: 'admin', label: 'إدارة', color: '#10B981',
    features: [
      { icon: '👥', title: 'إدارة المستخدمين', desc: '7 مستويات صلاحيات: مالك المنصة، مالك المؤسسة، مدير، معلم، طالب، ولي أمر، موظف.' },
      { icon: '🏫', title: 'إدارة المؤسسات', desc: 'Multi-tenancy كامل. كل مؤسسة بيئة معزولة. إدارة الفروع، الأقسام، الفصول، المباني.' },
      { icon: '👨‍🏫', title: 'شؤون الموظفين', desc: 'ملفات الموظفين، العقود، الإجازات، الرواتب، التقييم السنوي، التدريب والتطوير.' },
      { icon: '📋', title: 'التقارير والتحليلات', desc: 'تقارير شاملة قابلة للتخصيص. تصدير PDF/Excel. جداول زمنية تلقائية. تقارير AI ذكية.' },
      { icon: '🔔', title: 'نظام الإشعارات', desc: 'إشعارات فورية عبر واتساب، SMS، بريد إلكتروني، وإشعارات داخل التطبيق. قوالب جاهزة.' },
      { icon: '🗂️', title: 'إدارة الوثائق', desc: 'أرشفة رقمية للوثائق. عقود، شهادات، محاضر الاجتماعات. بحث ذكي وتصنيف تلقائي.' },
    ],
  },
  {
    id: 'finance', label: 'مالية', color: '#F59E0B',
    features: [
      { icon: '💰', title: 'الرسوم الدراسية', desc: 'إدارة شاملة للرسوم. جداول الأقساط، التذكيرات التلقائية، الإعفاءات، المنح الدراسية.' },
      { icon: '💳', title: 'الدفع الإلكتروني', desc: 'تكامل مع مدى، Visa، Apple Pay، STC Pay، Tabby للتقسيط، وMoyasar كبوابة دفع.' },
      { icon: '📑', title: 'الفواتير والإيصالات', desc: 'إصدار فواتير إلكترونية معتمدة. إيصالات فورية، تقارير مالية، تكامل مع أنظمة المحاسبة.' },
      { icon: '💼', title: 'الرواتب', desc: 'إدارة رواتب الموظفين. الحسابات التلقائية، الخصومات، البدلات، حوالات البنوك.' },
    ],
  },
  {
    id: 'ai', label: 'ذكاء اصطناعي', color: '#8B5CF6',
    features: [
      { icon: '🎯', title: 'AI Career Pathing', desc: 'توجيه مهني ذكي يحلل مهارات الطالب ويقترح مسارات وظيفية مناسبة بناءً على بيانات حقيقية.' },
      { icon: '🪙', title: 'Matin Coin', desc: 'اقتصاد داخلي يحفز الطلاب على الإنجاز. تُكسب بالحضور والدرجات وتُصرف في المتجر الداخلي.' },
      { icon: '💚', title: 'AI Well-being', desc: 'مراقبة ذكية وسرية للصحة النفسية. يكتشف مبكراً علامات الضغط ويرفع تنبيهات للمرشد.' },
      { icon: '📘', title: 'Skills Passport', desc: 'جواز سفر المهارات يتابع الطالب مدى الحياة. يوثق كل مهارة من الروضة لسوق العمل.' },
      { icon: '🗂️', title: 'المحفظة التعليمية', desc: 'ملف شامل للطالب ينقل معه بين المؤسسات. كل التاريخ الأكاديمي والمهاري في مكان واحد.' },
    ],
  },
  {
    id: 'extra', label: 'خدمات إضافية', color: '#EF4444',
    features: [
      { icon: '🚌', title: 'النقل المدرسي', desc: 'تتبع حي آمن للحافلات بـ GPS. إشعارات الركوب والنزول، خرائط المسارات، تقارير السائقين.' },
      { icon: '🍽️', title: 'المقصف الذكي', desc: 'إدارة القوائم والطلبات والدفع. طلب مسبق، تتبع الحساسية الغذائية، تقارير المبيعات.' },
      { icon: '💬', title: 'الملتقى المجتمعي', desc: 'ملتقى آمن للطلاب. منتديات، مجموعات، مشاركة المحتوى، مراقبة ذكية للمحتوى.' },
      { icon: '🏥', title: 'الصحة المدرسية', desc: 'ملف صحي رقمي لكل طالب. السجلات الصحية، التطعيمات، الحالات المزمنة، طوارئ.' },
      { icon: '📚', title: 'المكتبة الرقمية', desc: 'كتالوج رقمي كامل. استعارة إلكترونية، تذكير بالإرجاع، تقارير القراءة.' },
      { icon: '🎭', title: 'الأنشطة والفعاليات', desc: 'إدارة الأنشطة اللاصفية. النوادي، الرياضة، المسابقات، الرحلات، الشهادات.' },
    ],
  },
];

export default function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState('academic');
  const current = CATEGORIES.find(c => c.id === activeCategory)!;

  const navStyle: React.CSSProperties = { position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' };
  const logoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 };
  const logoIconStyle: React.CSSProperties = { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' };
  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };
  const btnGhostStyle: React.CSSProperties = { padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' };
  const btnPrimaryStyle: React.CSSProperties = { padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 }}>

        {/* NAV */}
        <nav style={navStyle}>
          <Link href="/" style={logoStyle}>
            <div style={logoIconStyle}>م</div>
            متين
          </Link>
          <div style={{ display: 'flex', gap: 28, flex: 1 }}>
            <Link href="/features" style={{ ...navLinkStyle, color: '#C9A84C' }}>المميزات</Link>
            <Link href="/pricing" style={navLinkStyle}>الأسعار</Link>
            <Link href="/ai" style={navLinkStyle}>الذكاء الاصطناعي</Link>
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={btnGhostStyle}>تسجيل الدخول</Link>
            <Link href="/register" style={btnPrimaryStyle}>ابدأ مجاناً</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse,rgba(201,168,76,0.1) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>30+ وحدة متكاملة</div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            كل ما تحتاجه في{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>منصة واحدة</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.8 }}>
            من الإدارة الأكاديمية إلى الذكاء الاصطناعي — متين يغطي كل احتياجات مؤسستك التعليمية.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
            {[{ value: '30+', label: 'وحدة متكاملة' }, { value: '7', label: 'مستويات صلاحيات' }, { value: '5', label: 'أنواع مؤسسات' }, { value: '14+', label: 'تكامل خارجي' }].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#C9A84C', letterSpacing: -2 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.5)', marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* CATEGORY TABS */}
        <section style={{ padding: '40px 24px 0', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ padding: '10px 20px', borderRadius: 100, border: `1px solid ${activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.06)'}`, background: activeCategory === cat.id ? `${cat.color}20` : 'transparent', color: activeCategory === cat.id ? cat.color : 'rgba(238,238,245,0.5)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                {cat.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16, paddingBottom: 60 }}>
            {current.features.map((feature) => (
              <div key={feature.title} style={{ background: '#0B0B16', border: `1px solid ${current.color}20`, borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{feature.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: current.color, marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ fontSize: 13.5, color: 'rgba(238,238,245,0.65)', lineHeight: 1.7 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* CTA */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 16 }}>
            جاهز لتجربة{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين؟</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>14 يوم تجريبي مجاني — لا بطاقة ائتمانية مطلوبة.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>ابدأ التجربة المجانية</Link>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(238,238,245,0.65)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>عرض الأسعار</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)' }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>الشروط والأحكام</Link>
            <Link href="/contact" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>تواصل معنا</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
