'use client';
import Link from 'next/link';
import { useState } from 'react';

const SERVICES = [
  {
    category: 'الإدارة الأكاديمية',
    items: [
      { title: 'إدارة الطلاب',             desc: 'ملفات شاملة لكل طالب تشمل السجل الأكاديمي، الدرجات، والمتابعة الدراسية.',                               href: '/dashboard/students',      color: '#3B82F6' },
      { title: 'الحضور والغياب',           desc: 'تسجيل الحضور تلقائياً مع إشعارات فورية لأولياء الأمور والطلاب.',                                        href: '/dashboard/attendance',    color: '#EF4444' },
      { title: 'الجداول الدراسية',         desc: 'توزيع ذكي للجداول مع مراعاة القاعات والأعباء التدريسية وتجنب التعارضات.',                               href: '/dashboard/schedules',     color: '#8B5CF6' },
      { title: 'إدارة المقررات',           desc: 'خطط المقررات، المتطلبات، والمحتوى التعليمي لكل مادة دراسية.',                                            href: '/dashboard/courses',       color: '#10B981' },
      { title: 'الاختبارات والدرجات',      desc: 'جدولة الاختبارات، رصد الدرجات، وإصدار كشوف النتائج إلكترونياً.',                                        href: '/dashboard/exams',         color: '#F59E0B' },
      { title: 'إدارة الفصول',            desc: 'تنظيم الفصول الدراسية وتوزيع الطلاب مع إدارة الطاقة الاستيعابية.',                                      href: '/dashboard/classes',       color: '#06B6D4' },
    ]
  },
  {
    category: 'التعليم الإلكتروني',
    items: [
      { title: 'المحاضرات المسجلة',        desc: 'رفع ومشاركة المحاضرات مع تتبع مشاهدة الطلاب وإحصائيات التفاعل.',                                        href: '/dashboard/lectures',      color: '#6366F1' },
      { title: 'البث المباشر',             desc: 'فصول افتراضية مباشرة مع أدوات تفاعلية وتسجيل تلقائي.',                                                  href: '/dashboard/live-stream',   color: '#EF4444' },
      { title: 'المكتبة الرقمية',          desc: 'استعارة إلكترونية وكتالوج رقمي شامل مع بحث متقدم.',                                                     href: '/dashboard/library',       color: '#A855F7' },
      { title: 'بنك الأسئلة',             desc: 'مكتبة أسئلة مصنفة حسب المادة والمستوى مع توليد اختبارات تلقائي.',                                       href: '/dashboard/question-bank', color: '#14B8A6' },
      { title: 'الواجبات الإلكترونية',     desc: 'توزيع ومتابعة الواجبات رقمياً مع كشف الانتحال وتقارير الإنجاز.',                                        href: '/dashboard/homework',      color: '#EC4899' },
    ]
  },
  {
    category: 'الموارد البشرية',
    items: [
      { title: 'إدارة المعلمين',           desc: 'ملفات المعلمين، جداولهم، تقييم أدائهم، وإدارة مهامهم.',                                                  href: '/dashboard/teachers',      color: '#F97316' },
      { title: 'إدارة الموظفين',           desc: 'سجلات الموظفين، الحضور، الإجازات، والعقود الإلكترونية.',                                                  href: '/dashboard/employees',     color: '#84CC16' },
      { title: 'مسير الرواتب',            desc: 'حساب الرواتب تلقائياً مع الخصومات والبدلات وإصدار قسائم الراتب.',                                         href: '/dashboard/salaries',      color: '#22D3EE' },
      { title: 'إدارة الإجازات',           desc: 'طلبات الإجازة، الموافقة الإلكترونية، وتتبع رصيد الإجازات.',                                               href: '/dashboard/leaves',        color: '#FB923C' },
    ]
  },
  {
    category: 'الخدمات والمالية',
    items: [
      { title: 'الإدارة المالية',          desc: 'فواتير إلكترونية، دفع آمن عبر Moyasar وTabby، وتقارير مالية شاملة.',                                     href: '/dashboard/finance',       color: '#10B981' },
      { title: 'الشهادات والوثائق',        desc: 'إصدار الشهادات والوثائق الرسمية إلكترونياً مع التحقق الرقمي.',                                            href: '/dashboard/certificates',  color: '#F472B6' },
      { title: 'الصحة المدرسية',           desc: 'ملفات صحية للطلاب، إدارة الحالات، وتتبع التطعيمات.',                                                     href: '/dashboard/health',        color: '#34D399' },
      { title: 'المتجر الإلكتروني',        desc: 'بيع الكتب والمستلزمات الدراسية إلكترونياً مع إدارة المخزون.',                                             href: '/dashboard/store',         color: '#38BDF8' },
    ]
  },
  {
    category: 'الذكاء الاصطناعي',
    items: [
      { title: 'المساعد الذكي',            desc: 'مساعد AI للمعلمين يساعد في إعداد الدروس والاختبارات والتقارير.',                                          href: '/dashboard/ai-chat',       color: '#A78BFA' },
      { title: 'تحليلات الأداء',           desc: 'رؤى ذكية عن أداء الطلاب والمعلمين بالذكاء الاصطناعي.',                                                   href: '/dashboard/reports',       color: '#60A5FA' },
      { title: 'توليد الأسئلة الآلي',      desc: 'توليد أسئلة اختبار تلقائياً من محتوى المقررات بالذكاء الاصطناعي.',                                        href: '/dashboard/question-analytics', color: '#F472B6' },
    ]
  },
];

const INTEGRATIONS = [
  { name: 'نفاذ',    desc: 'تسجيل دخول بالهوية الوطنية' },
  { name: 'نور',     desc: 'ربط مع منصة التعليم الحكومية' },
  { name: 'Moyasar', desc: 'بوابة الدفع الإلكتروني' },
  { name: 'Tabby',   desc: 'الدفع بالتقسيط' },
  { name: 'STC Pay', desc: 'الدفع عبر STC Pay' },
  { name: 'واتساب',  desc: 'إشعارات وتواصل فوري' },
];

const STATS = [
  { value: '+١٥٠', label: 'معهد يثق بمتين' },
  { value: '+٤٠ألف', label: 'طالب مسجل' },
  { value: '٩٩.٩٪', label: 'وقت تشغيل مضمون' },
  { value: '+٣٥', label: 'خدمة متكاملة' },
];

const PLANS = [
  {
    name: 'الأساسية',
    price: '٣٩٩',
    period: 'شهرياً',
    desc: 'مثالية للمعاهد الصغيرة',
    features: ['حتى ٣٠٠ طالب', 'الإدارة الأكاديمية الأساسية', 'الحضور والغياب', 'إصدار الشهادات', 'دعم فني'],
    href: '/register?type=institute&plan=basic',
    popular: false,
  },
  {
    name: 'الاحترافية',
    price: '٧٩٩',
    period: 'شهرياً',
    desc: 'الأكثر شعبية للمعاهد المتوسطة',
    features: ['حتى ٢٠٠٠ طالب', 'كل ميزات الأساسية', 'التعليم الإلكتروني والبث المباشر', 'الإدارة المالية والرواتب', 'تكامل واتساب ونفاذ', 'دعم أولوية'],
    href: '/register?type=institute&plan=pro',
    popular: true,
  },
  {
    name: 'المؤسسية',
    price: 'تواصل معنا',
    period: '',
    desc: 'لمجموعات المعاهد الكبيرة',
    features: ['طلاب غير محدودين', 'كل الميزات', 'المساعد الذكي AI', 'تقارير متقدمة', 'مدير حساب مخصص', 'SLA مضمون ٩٩.٩٪'],
    href: '/contact',
    popular: false,
  },
];

const FAQ = [
  { q: 'هل النظام مناسب لجميع أنواع المعاهد؟', a: 'نعم، يناسب النظام المعاهد التقنية والمهنية والعلمية والأكاديمية، مع إمكانية تخصيص الخدمات حسب طبيعة كل معهد.' },
  { q: 'هل يمكن إصدار شهادات معتمدة إلكترونياً؟', a: 'نعم، يوفر النظام إصدار شهادات إلكترونية مع رمز QR للتحقق الفوري، ويمكن تخصيص تصميم الشهادة بشعار معهدك.' },
  { q: 'هل المنصة متوافقة مع متطلبات الجهات الحكومية؟', a: 'نعم، المنصة مرتبطة بمنصة نور ومتوافقة مع متطلبات وزارة التعليم والمؤسسة العامة للتدريب التقني والمهني.' },
  { q: 'كيف يتم نقل بيانات الطلاب من النظام الحالي؟', a: 'يوفر فريقنا المتخصص خدمة نقل البيانات من أي نظام سابق بشكل آمن وكامل دون فقدان أي معلومة.' },
];

export default function InstitutesPage() {
  const [activeCategory, setActiveCategory] = useState('الإدارة الأكاديمية');
  const activeServices = SERVICES.find(s => s.category === activeCategory)?.items || [];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #C9A84C; --gold-2: #E2C46A; --gold-3: #F5DFA0;
          --dark: #06060E; --dark-2: #0B0B16; --dark-3: #10101E;
          --border: rgba(255,255,255,0.06); --border-gold: rgba(201,168,76,0.2);
          --text: #EEEEF5; --text-2: rgba(238,238,245,0.65); --text-3: rgba(238,238,245,0.35);
        }
        html { scroll-behavior: smooth; direction: rtl; }
        body { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; background: var(--dark); color: var(--text); overflow-x: hidden; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(6,6,14,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 34px; height: 34px; background: var(--gold); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: #060C18; }
        .nav-logo-text { font-size: 20px; font-weight: 800; color: var(--text); }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { color: var(--text-2); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover, .nav-link.active { color: var(--text); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost { padding: 8px 20px; border-radius: 9px; background: transparent; border: 1px solid var(--border); color: var(--text-2); font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .btn-ghost:hover { color: var(--text); }
        .btn-primary { padding: 8px 20px; border-radius: 9px; background: var(--gold); color: #000; font-size: 13.5px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .btn-primary:hover { background: var(--gold-2); }
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 130px 24px 80px; position: relative; overflow: hidden; }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-inner { position: relative; z-index: 1; max-width: 900px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); color: #34D399; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #10B981; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }
        .hero h1 { font-size: clamp(42px, 7vw, 82px); font-weight: 800; line-height: 1.05; letter-spacing: -2.5px; color: var(--text); }
        .hero h1 .gold { display: block; background: linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 40%, var(--gold-3) 70%, var(--gold-2) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        .hero-sub { font-size: 17px; color: var(--text-2); max-width: 560px; margin: 28px auto 0; line-height: 1.8; }
        .hero-btns { display: flex; gap: 12px; margin-top: 48px; justify-content: center; flex-wrap: wrap; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: var(--gold); color: #000; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s; }
        .btn-hero:hover { background: var(--gold-2); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(201,168,76,0.3); }
        .btn-hero-outline { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-2); padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 500; text-decoration: none; transition: all 0.25s; }
        .btn-hero-outline:hover { background: rgba(255,255,255,0.07); color: var(--text); }
        .hero-trust { margin-top: 24px; font-size: 13px; color: var(--text-3); display: flex; align-items: center; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-3); }
        .stats-bar { background: var(--dark-3); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 40px 24px; }
        .stats-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
        .stat-value { font-size: 36px; font-weight: 800; background: linear-gradient(90deg, var(--gold), var(--gold-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-label { font-size: 13px; color: var(--text-3); margin-top: 6px; }
        .section { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
        .section-label { background: rgba(201,168,76,0.08); border: 1px solid var(--border-gold); color: var(--gold); padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .section-title { font-size: clamp(28px, 4vw, 48px); font-weight: 800; line-height: 1.15; letter-spacing: -1.5px; margin-top: 16px; }
        .section-sub { font-size: 16px; color: var(--text-2); line-height: 1.8; max-width: 560px; margin: 16px auto 0; }
        .tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px; }
        .tab-btn { padding: 9px 20px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text-2); font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .tab-btn:hover { border-color: var(--border-gold); color: var(--text); }
        .tab-btn.active { background: var(--gold); border-color: var(--gold); color: #000; font-weight: 700; }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }
        .service-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 14px; padding: 24px; text-decoration: none; transition: all 0.25s; display: block; }
        .service-card:hover { border-color: var(--card-color, var(--gold)); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .service-dot { width: 8px; height: 8px; border-radius: 50%; margin-bottom: 14px; }
        .service-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .service-desc { font-size: 13px; color: var(--text-2); line-height: 1.7; }
        .integrations-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; margin-top: 48px; }
        @media (max-width: 900px) { .integrations-grid { grid-template-columns: repeat(3, 1fr); } }
        .integration-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 14px; padding: 20px 16px; text-align: center; transition: all 0.2s; }
        .integration-card:hover { border-color: var(--border-gold); }
        .integration-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .integration-desc { font-size: 12px; color: var(--text-3); }
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
        @media (max-width: 900px) { .plans-grid { grid-template-columns: 1fr; max-width: 420px; margin-inline: auto; } }
        .plan-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 20px; padding: 32px; position: relative; }
        .plan-card.popular { border-color: var(--gold); background: linear-gradient(135deg, var(--dark-3) 0%, rgba(201,168,76,0.05) 100%); }
        .plan-badge { position: absolute; top: -12px; right: 24px; background: var(--gold); color: #000; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }
        .plan-name { font-size: 20px; font-weight: 800; color: var(--text); }
        .plan-desc { font-size: 13px; color: var(--text-3); margin-top: 6px; }
        .plan-price { font-size: 48px; font-weight: 800; color: var(--gold); margin-top: 24px; line-height: 1; }
        .plan-price-small { font-size: 14px; color: var(--text-3); margin-top: 4px; }
        .plan-features { list-style: none; margin-top: 24px; display: flex; flex-direction: column; gap: 10px; }
        .plan-feature { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--text-2); }
        .plan-feature-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
        .plan-btn { display: block; text-align: center; padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 700; text-decoration: none; margin-top: 28px; transition: all 0.2s; }
        .plan-btn-primary { background: var(--gold); color: #000; }
        .plan-btn-primary:hover { background: var(--gold-2); }
        .plan-btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-2); }
        .plan-btn-outline:hover { border-color: var(--border-gold); color: var(--text); }
        .faq-list { margin-top: 48px; display: flex; flex-direction: column; gap: 16px; }
        .faq-item { background: var(--dark-3); border: 1px solid var(--border); border-radius: 14px; padding: 24px; }
        .faq-q { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
        .faq-a { font-size: 14px; color: var(--text-2); line-height: 1.8; }
        .cta-section { padding: 120px 24px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(16,185,129,0.1) 0%, transparent 70%); pointer-events: none; }
        .cta-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
        .cta-title { font-size: clamp(28px, 4vw, 52px); font-weight: 800; line-height: 1.15; letter-spacing: -1.5px; }
        .cta-sub { font-size: 16px; color: var(--text-2); margin-top: 20px; line-height: 1.8; }
        .footer { background: var(--dark-2); border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; }
        .footer-links { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
        .footer-link { color: var(--text-3); font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--text-2); }
        .footer-text { font-size: 12px; color: var(--text-3); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.6s ease forwards; }
        @media (max-width: 768px) { .nav-links { display: none; } .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">م</div>
          <span className="nav-logo-text">متين</span>
        </Link>
        <div className="nav-links">
          <Link href="/schools" className="nav-link">المدارس</Link>
          <Link href="/universities" className="nav-link">الجامعات</Link>
          <Link href="/institutes" className="nav-link active">المعاهد</Link>
          <Link href="/training" className="nav-link">التدريب</Link>
          <Link href="/pricing" className="nav-link">الأسعار</Link>
          <Link href="/contact" className="nav-link">تواصل معنا</Link>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/register?type=institute" className="btn-primary">ابدأ مجاناً</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-badge fade-in">
            <span className="badge-dot" />
            منصة إدارة المعاهد الأولى في السعودية
          </div>
          <h1 className="fade-in">
            أدر معهدك
            <span className="gold">بتميز واحترافية</span>
          </h1>
          <p className="hero-sub fade-in">
            منصة متين توفر لك أكثر من ٣٥ خدمة متكاملة لإدارة معهدك — من الإدارة الأكاديمية والتعليم الإلكتروني إلى الموارد البشرية والمالية، كل شيء في مكان واحد.
          </p>
          <div className="hero-btns fade-in">
            <Link href="/register?type=institute" className="btn-hero">ابدأ تجربتك المجانية</Link>
            <Link href="/contact" className="btn-hero-outline">استكشف الخدمات</Link>
          </div>
          <div className="hero-trust fade-in">
            <span>تجربة مجانية ١٤ يوم</span>
            <span className="trust-dot" />
            <span>بدون بيانات بنكية</span>
            <span className="trust-dot" />
            <span>إلغاء في أي وقت</span>
            <span className="trust-dot" />
            <span>دعم على مدار الساعة</span>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="fade-in">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>الخدمات</div>
            <h2 className="section-title">كل ما يحتاجه معهدك<br /><span style={{ color: 'var(--gold-2)' }}>في منصة واحدة</span></h2>
            <p className="section-sub">أكثر من ٣٥ خدمة متكاملة مصممة خصيصاً لاحتياجات المعاهد السعودية.</p>
          </div>
          <div className="tabs">
            {SERVICES.map(s => (
              <button key={s.category} className={`tab-btn ${activeCategory === s.category ? 'active' : ''}`} onClick={() => setActiveCategory(s.category)}>
                {s.category}
              </button>
            ))}
          </div>
          <div className="services-grid">
            {activeServices.map((s, i) => (
              <Link key={i} href={s.href} className="service-card fade-in" style={{ '--card-color': s.color } as any}>
                <div className="service-dot" style={{ background: s.color }} />
                <div className="service-title">{s.title}</div>
                <div className="service-desc">{s.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>التكاملات</div>
            <h2 className="section-title">متكامل مع الأنظمة الحكومية<br /><span style={{ color: 'var(--gold-2)' }}>وبوابات الدفع المعتمدة</span></h2>
          </div>
          <div className="integrations-grid">
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className="integration-card fade-in">
                <div className="integration-name">{int.name}</div>
                <div className="integration-desc">{int.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>الأسعار</div>
          <h2 className="section-title">خطط مرنة تناسب<br /><span style={{ color: 'var(--gold-2)' }}>كل حجم معهد</span></h2>
          <p className="section-sub">ابدأ مجاناً وقم بالترقية عندما تحتاج. لا رسوم خفية.</p>
        </div>
        <div className="plans-grid">
          {PLANS.map((plan, i) => (
            <div key={i} className={`plan-card fade-in ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="plan-badge">الأكثر شيوعاً</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-desc">{plan.desc}</div>
              <div className="plan-price">{plan.price}</div>
              {plan.period && <div className="plan-price-small">{plan.period}</div>}
              <ul className="plan-features">
                {plan.features.map((f, j) => (
                  <li key={j} className="plan-feature"><span className="plan-feature-dot" />{f}</li>
                ))}
              </ul>
              <Link href={plan.href} className={`plan-btn ${plan.popular ? 'plan-btn-primary' : 'plan-btn-outline'}`}>
                {plan.price === 'تواصل معنا' ? 'تواصل معنا' : 'ابدأ الآن'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>الأسئلة الشائعة</div>
            <h2 className="section-title">أسئلة يسألها<br /><span style={{ color: 'var(--gold-2)' }}>مديرو المعاهد</span></h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <div key={i} className="faq-item fade-in">
                <div className="faq-q">{item.q}</div>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner fade-in">
          <h2 className="cta-title">ابدأ رحلة التحول الرقمي<br /><span style={{ color: 'var(--gold-2)' }}>لمعهدك اليوم</span></h2>
          <p className="cta-sub">انضم إلى أكثر من ١٥٠ معهد يستخدم متين لإدارة عملياتها بكفاءة واحترافية.</p>
          <div className="hero-btns">
            <Link href="/register?type=institute" className="btn-hero">ابدأ تجربتك المجانية</Link>
            <Link href="/contact" className="btn-hero-outline">تحدث مع فريق المبيعات</Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <Link href="/privacy" className="footer-link">سياسة الخصوصية</Link>
          <Link href="/terms" className="footer-link">شروط الاستخدام</Link>
          <Link href="/contact" className="footer-link">تواصل معنا</Link>
          <Link href="/pricing" className="footer-link">الأسعار</Link>
        </div>
        <p className="footer-text">© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</p>
      </footer>
    </>
  );
}
