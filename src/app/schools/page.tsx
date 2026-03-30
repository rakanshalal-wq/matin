'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   خدمات المدارس — مربوطة بالمسارات الحقيقية
═══════════════════════════════════════════════════════════ */
const SCHOOL_SERVICES = [
  {
    category: 'الإدارة الأكاديمية',
    items: [
      { title: 'إدارة الطلاب',           desc: 'ملفات شاملة لكل طالب، تتبع الأداء الأكاديمي، وتقارير تفصيلية لأولياء الأمور.',         href: '/dashboard/students',    color: '#3B82F6' },
      { title: 'الحضور والغياب',          desc: 'تسجيل ذكي مع إشعارات فورية لأولياء الأمور عبر واتساب والرسائل النصية.',               href: '/dashboard/attendance',  color: '#10B981' },
      { title: 'الدرجات والتقارير',       desc: 'تحليل الأداء الأكاديمي بالذكاء الاصطناعي مع تقارير مرئية تفاعلية.',                   href: '/dashboard/grades',      color: '#8B5CF6' },
      { title: 'الاختبارات الإلكترونية', desc: 'بنك أسئلة ضخم، تصحيح تلقائي فوري، ومنع الغش بتقنيات الذكاء الاصطناعي.',              href: '/dashboard/exams',       color: '#F59E0B' },
      { title: 'الواجبات المنزلية',       desc: 'توزيع وتسليم ومتابعة الواجبات بشكل رقمي متكامل.',                                     href: '/dashboard/homework',    color: '#EC4899' },
      { title: 'الجداول الدراسية',        desc: 'توزيع ذكي للجداول بدون تعارضات مع مراعاة أعباء المعلمين.',                            href: '/dashboard/schedules',   color: '#0EA5E9' },
    ]
  },
  {
    category: 'التعليم الإلكتروني',
    items: [
      { title: 'المحاضرات المسجلة',       desc: 'رفع ومشاركة المحاضرات مع تتبع مشاهدة الطلاب وإحصائيات التفاعل.',                      href: '/dashboard/lectures',    color: '#6366F1' },
      { title: 'البث المباشر',            desc: 'فصول افتراضية مباشرة مع أدوات تفاعلية وتسجيل تلقائي.',                               href: '/dashboard/live-stream', color: '#EF4444' },
      { title: 'المكتبة الرقمية',         desc: 'استعارة إلكترونية وكتالوج رقمي شامل مع بحث متقدم.',                                   href: '/dashboard/library',     color: '#A855F7' },
      { title: 'بنك الأسئلة',             desc: 'مكتبة ضخمة من الأسئلة المصنفة حسب المادة والمستوى.',                                  href: '/dashboard/question-bank', color: '#14B8A6' },
    ]
  },
  {
    category: 'الموارد البشرية',
    items: [
      { title: 'إدارة المعلمين',          desc: 'ملفات المعلمين، جداولهم، تقييم أدائهم، وإدارة مهامهم.',                               href: '/dashboard/teachers',    color: '#F97316' },
      { title: 'إدارة الموظفين',          desc: 'سجلات الموظفين، الحضور، الإجازات، والعقود.',                                          href: '/dashboard/employees',   color: '#84CC16' },
      { title: 'مسير الرواتب',            desc: 'حساب الرواتب تلقائياً مع الخصومات والبدلات وإصدار قسائم الراتب.',                     href: '/dashboard/salaries',    color: '#22D3EE' },
      { title: 'إدارة الإجازات',          desc: 'طلبات الإجازة، الموافقة الإلكترونية، وتتبع الرصيد.',                                  href: '/dashboard/leaves',      color: '#FB923C' },
    ]
  },
  {
    category: 'الخدمات والمالية',
    items: [
      { title: 'الإدارة المالية',         desc: 'فواتير إلكترونية، دفع آمن عبر Moyasar وTabby، وتقارير مالية شاملة.',                  href: '/dashboard/finance',     color: '#10B981' },
      { title: 'النقل المدرسي',           desc: 'تتبع GPS مباشر للحافلات وإشعارات وصول فورية لأولياء الأمور.',                         href: '/dashboard/transport',   color: '#F43F5E' },
      { title: 'الصحة المدرسية',          desc: 'ملفات صحية للطلاب، إدارة التطعيمات، وتتبع الحالات الطارئة.',                          href: '/dashboard/health',      color: '#34D399' },
      { title: 'الكافتيريا',              desc: 'قوائم الطعام، الدفع الإلكتروني، وإدارة المخزون.',                                     href: '/dashboard/cafeteria',   color: '#FBBF24' },
    ]
  },
  {
    category: 'الذكاء الاصطناعي',
    items: [
      { title: 'المساعد الذكي',           desc: 'مساعد AI للمعلمين يساعد في إعداد الدروس، الاختبارات، والتقارير.',                     href: '/dashboard/ai-assistant', color: '#A78BFA' },
      { title: 'تحليلات متقدمة',          desc: 'رؤى ذكية عن أداء المؤسسة، الطلاب، والمعلمين بالذكاء الاصطناعي.',                     href: '/dashboard/reports',     color: '#60A5FA' },
      { title: 'توليد الأسئلة',           desc: 'توليد أسئلة اختبار تلقائياً من المناهج الدراسية بالذكاء الاصطناعي.',                  href: '/dashboard/ai-questions', color: '#F472B6' },
    ]
  },
];

const INTEGRATIONS = [
  { name: 'نفاذ',    desc: 'تسجيل دخول بالهوية الوطنية',   color: '#1B4F72' },
  { name: 'نور',     desc: 'ربط مع منصة التعليم الحكومية',  color: '#1A5276' },
  { name: 'Moyasar', desc: 'بوابة الدفع الإلكتروني',        color: '#1E8449' },
  { name: 'Tabby',   desc: 'الدفع بالتقسيط',               color: '#117A65' },
  { name: 'STC Pay', desc: 'الدفع عبر STC Pay',            color: '#7D3C98' },
  { name: 'واتساب',  desc: 'إشعارات وتواصل فوري',           color: '#1D6A39' },
];

const STATS = [
  { value: '+٥٠٠', label: 'مدرسة تثق بمتين' },
  { value: '+١٢٠ألف', label: 'طالب مسجل' },
  { value: '٩٩.٩٪', label: 'وقت تشغيل مضمون' },
  { value: '+٤٠', label: 'خدمة متكاملة' },
];

const PLANS = [
  {
    name: 'الأساسية',
    price: '٢٩٩',
    period: 'شهرياً',
    desc: 'مثالية للمدارس الصغيرة',
    features: ['حتى ٢٠٠ طالب', 'الإدارة الأكاديمية الأساسية', 'الحضور والغياب', 'تواصل أولياء الأمور', 'دعم فني'],
    href: '/register?type=school&plan=basic',
    popular: false,
  },
  {
    name: 'الاحترافية',
    price: '٦٩٩',
    period: 'شهرياً',
    desc: 'الأكثر شعبية للمدارس المتوسطة',
    features: ['حتى ١٠٠٠ طالب', 'كل ميزات الأساسية', 'التعليم الإلكتروني والبث المباشر', 'الإدارة المالية والرواتب', 'النقل المدرسي', 'تكامل واتساب ونفاذ', 'دعم أولوية'],
    href: '/register?type=school&plan=pro',
    popular: true,
  },
  {
    name: 'المؤسسية',
    price: 'تواصل معنا',
    period: '',
    desc: 'للمجموعات التعليمية الكبيرة',
    features: ['طلاب غير محدودين', 'كل الميزات', 'المساعد الذكي AI', 'تكاملات نور وSTC Pay', 'تقارير متقدمة', 'مدير حساب مخصص', 'SLA مضمون ٩٩.٩٪'],
    href: '/contact',
    popular: false,
  },
];

const FAQ = [
  { q: 'هل يمكنني تجربة المنصة قبل الاشتراك؟', a: 'نعم، نوفر فترة تجريبية مجانية لمدة ١٤ يوماً بدون الحاجة لبيانات بنكية.' },
  { q: 'هل المنصة متوافقة مع متطلبات وزارة التعليم؟', a: 'نعم، المنصة مرتبطة بمنصة نور وتدعم جميع متطلبات وزارة التعليم السعودية.' },
  { q: 'كيف يتم نقل بيانات مدرستي الحالية؟', a: 'نوفر فريق متخصص لمساعدتك في نقل جميع البيانات من أي نظام سابق بشكل آمن وسريع.' },
  { q: 'هل يمكنني إضافة فروع متعددة؟', a: 'نعم، تدعم الباقة المؤسسية إدارة فروع متعددة من لوحة تحكم واحدة.' },
  { q: 'ما طرق الدفع المتاحة؟', a: 'نقبل مدى، فيزا، ماستركارد، Apple Pay، STC Pay، وبالتقسيط عبر Tabby وTamara.' },
];

export default function SchoolsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-in').forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --gold: #C9A84C;
          --gold-2: #E2C46A;
          --gold-3: #F5DFA0;
          --dark: #06060E;
          --dark-2: #0B0B16;
          --dark-3: #10101E;
          --dark-4: #161626;
          --dark-5: #1E1E30;
          --border: rgba(255,255,255,0.06);
          --border-gold: rgba(201,168,76,0.2);
          --text: #EEEEF5;
          --text-2: rgba(238,238,245,0.65);
          --text-3: rgba(238,238,245,0.35);
          --r: 16px;
        }
        html { scroll-behavior: smooth; direction: rtl; }
        body { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; background: var(--dark); color: var(--text); overflow-x: hidden; }
        .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        /* NAVBAR */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 18px 40px; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s; }
        .nav.scrolled { background: rgba(6,6,14,0.92); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 14px 40px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--gold), var(--gold-2)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: #060C18; }
        .nav-logo-text { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-link { color: var(--text-2); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: var(--text); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost { padding: 8px 20px; border-radius: 9px; background: transparent; border: 1px solid var(--border); color: var(--text-2); font-size: 13.5px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }
        .btn-primary { padding: 8px 20px; border-radius: 9px; background: var(--gold); color: #000; font-size: 13.5px; font-weight: 700; border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; }
        .btn-primary:hover { background: var(--gold-2); }

        /* HERO */
        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 130px 24px 80px; position: relative; overflow: hidden; }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(59,130,246,0.1) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-inner { position: relative; z-index: 1; max-width: 900px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2); color: #60A5FA; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; letter-spacing: 0.4px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #3B82F6; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }
        .hero h1 { font-size: clamp(42px, 7vw, 82px); font-weight: 800; line-height: 1.05; letter-spacing: -2.5px; color: var(--text); }
        .hero h1 .gold { display: block; background: linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 40%, var(--gold-3) 70%, var(--gold-2) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        .hero-sub { font-size: 17px; color: var(--text-2); max-width: 560px; margin: 28px auto 0; line-height: 1.8; }
        .hero-btns { display: flex; gap: 12px; margin-top: 48px; justify-content: center; flex-wrap: wrap; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: var(--gold); color: #000; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .btn-hero:hover { background: var(--gold-2); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(201,168,76,0.3); }
        .btn-hero-outline { display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); color: var(--text-2); padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .btn-hero-outline:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); color: var(--text); }
        .hero-trust { margin-top: 24px; font-size: 13px; color: var(--text-3); display: flex; align-items: center; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .trust-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-3); }

        /* STATS */
        .stats-bar { background: var(--dark-3); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 40px 24px; }
        .stats-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
        .stat-value { font-size: 36px; font-weight: 800; background: linear-gradient(90deg, var(--gold), var(--gold-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .stat-label { font-size: 13px; color: var(--text-3); margin-top: 6px; }

        /* SECTION */
        .section { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
        .section-label { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,168,76,0.06); border: 1px solid var(--border-gold); color: var(--gold-2); padding: 5px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 20px; }
        .section-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; line-height: 1.15; letter-spacing: -1px; }
        .section-sub { font-size: 16px; color: var(--text-2); margin-top: 16px; line-height: 1.8; max-width: 560px; }

        /* SERVICES */
        .cat-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px; }
        .cat-tab { padding: 8px 20px; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: transparent; color: var(--text-3); transition: all 0.2s; }
        .cat-tab.active { background: var(--gold); color: #000; border-color: var(--gold); }
        .cat-tab:hover:not(.active) { color: var(--text); border-color: rgba(255,255,255,0.15); }
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .service-card { background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%); border: 1px solid var(--border); border-radius: var(--r); padding: 24px; text-decoration: none; display: block; transition: all 0.25s; position: relative; overflow: hidden; }
        .service-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.12); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .service-card::before { content: ''; position: absolute; top: 0; right: 0; width: 60px; height: 60px; border-radius: 0 var(--r) 0 60px; opacity: 0.08; }
        .service-dot { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 16px; }
        .service-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .service-desc { font-size: 13px; color: var(--text-2); line-height: 1.7; }

        /* INTEGRATIONS */
        .integrations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-top: 48px; }
        .integration-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; }
        .integration-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
        .integration-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
        .integration-desc { font-size: 11px; color: var(--text-3); }

        /* PLANS */
        .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 48px; }
        .plan-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 20px; padding: 32px; position: relative; transition: all 0.25s; }
        .plan-card.popular { border-color: var(--border-gold); background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, var(--dark-3) 100%); }
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .plan-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--gold); color: #000; font-size: 11px; font-weight: 700; padding: 4px 16px; border-radius: 100px; white-space: nowrap; }
        .plan-name { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
        .plan-desc { font-size: 13px; color: var(--text-3); margin-bottom: 24px; }
        .plan-price { font-size: 42px; font-weight: 800; color: var(--gold); line-height: 1; }
        .plan-price-small { font-size: 16px; color: var(--text-3); margin-top: 4px; }
        .plan-features { list-style: none; margin: 24px 0; display: flex; flex-direction: column; gap: 10px; }
        .plan-feature { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--text-2); }
        .plan-feature-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }
        .plan-btn { width: 100%; padding: 13px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; display: block; text-align: center; transition: all 0.2s; }
        .plan-btn-primary { background: var(--gold); color: #000; border: none; }
        .plan-btn-primary:hover { background: var(--gold-2); }
        .plan-btn-outline { background: transparent; color: var(--text-2); border: 1px solid var(--border); }
        .plan-btn-outline:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }

        /* FAQ */
        .faq-list { display: flex; flex-direction: column; gap: 12px; margin-top: 48px; }
        .faq-item { background: var(--dark-3); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
        .faq-q { font-size: 15px; font-weight: 700; color: var(--gold-2); margin-bottom: 10px; }
        .faq-a { font-size: 13px; color: var(--text-2); line-height: 1.8; }

        /* CTA */
        .cta-section { padding: 100px 24px; text-align: center; position: relative; overflow: hidden; }
        .cta-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(201,168,76,0.1) 0%, transparent 70%); pointer-events: none; }
        .cta-inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }
        .cta-title { font-size: clamp(32px, 5vw, 56px); font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; }
        .cta-sub { font-size: 16px; color: var(--text-2); margin-bottom: 40px; line-height: 1.8; }

        /* FOOTER */
        .footer { border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; }
        .footer-text { font-size: 13px; color: var(--text-3); }
        .footer-links { display: flex; gap: 24px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
        .footer-link { font-size: 13px; color: var(--text-3); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--text-2); }

        @media (max-width: 768px) {
          .nav { padding: 14px 20px; }
          .nav-links { display: none; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .plans-grid { grid-template-columns: 1fr; }
          .hero h1 { letter-spacing: -1.5px; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">م</div>
          <span className="nav-logo-text">متين</span>
        </Link>
        <div className="nav-links">
          <Link href="/schools" className="nav-link" style={{ color: 'var(--gold-2)' }}>المدارس</Link>
          <Link href="/universities" className="nav-link">الجامعات</Link>
          <Link href="/training" className="nav-link">التدريب</Link>
          <Link href="/pricing" className="nav-link">الأسعار</Link>
          <Link href="/contact" className="nav-link">تواصل معنا</Link>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/register?type=school" className="btn-primary">ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="badge-dot" />
            منصة إدارة المدارس الأولى في السعودية
          </div>
          <h1>
            أدر مدرستك
            <span className="gold">بذكاء وكفاءة</span>
          </h1>
          <p className="hero-sub">
            منصة متين توفر لك أكثر من ٤٠ خدمة متكاملة لإدارة مدرستك — من الطلاب والمعلمين إلى المالية والنقل والذكاء الاصطناعي، كل شيء في مكان واحد.
          </p>
          <div className="hero-btns">
            <Link href="/register?type=school" className="btn-hero">ابدأ تجربتك المجانية</Link>
            <Link href="#services" className="btn-hero-outline">استكشف الخدمات</Link>
          </div>
          <div className="hero-trust">
            <span>تجربة مجانية ١٤ يوم</span>
            <span className="trust-dot" />
            <span>بدون بيانات بنكية</span>
            <span className="trust-dot" />
            <span>إلغاء في أي وقت</span>
            <span className="trust-dot" />
            <span>دعم فني على مدار الساعة</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="section">
        <div className="fade-in">
          <div className="section-label">الخدمات</div>
          <h2 className="section-title">كل ما تحتاجه مدرستك<br /><span style={{ color: 'var(--gold-2)' }}>في منصة واحدة</span></h2>
          <p className="section-sub">أكثر من ٤٠ خدمة متكاملة مصممة خصيصاً لاحتياجات المدارس السعودية.</p>
        </div>
        <div className="cat-tabs" style={{ marginTop: 40 }}>
          {SCHOOL_SERVICES.map((cat, i) => (
            <button key={i} className={`cat-tab ${activeCategory === i ? 'active' : ''}`} onClick={() => setActiveCategory(i)}>
              {cat.category}
            </button>
          ))}
        </div>
        <div className="services-grid">
          {SCHOOL_SERVICES[activeCategory].items.map((s, i) => (
            <Link key={i} href={s.href} className="service-card fade-in" style={{ '--card-color': s.color } as any}>
              <div className="service-dot" style={{ background: s.color }} />
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>التكاملات</div>
            <h2 className="section-title" style={{ marginTop: 16 }}>متكامل مع الأنظمة الحكومية<br /><span style={{ color: 'var(--gold-2)' }}>وبوابات الدفع المعتمدة</span></h2>
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

      {/* PLANS */}
      <section id="pricing" className="section">
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div className="section-label" style={{ display: 'inline-flex' }}>الأسعار</div>
          <h2 className="section-title" style={{ marginTop: 16 }}>خطط مرنة تناسب<br /><span style={{ color: 'var(--gold-2)' }}>كل حجم مدرسة</span></h2>
          <p className="section-sub" style={{ margin: '16px auto 0' }}>ابدأ مجاناً وقم بالترقية عندما تحتاج. لا رسوم خفية.</p>
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
                  <li key={j} className="plan-feature">
                    <span className="plan-feature-dot" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`plan-btn ${plan.popular ? 'plan-btn-primary' : 'plan-btn-outline'}`}>
                {plan.price === 'تواصل معنا' ? 'تواصل معنا' : 'ابدأ الآن'}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--dark-2)', borderTop: '1px solid var(--border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="fade-in" style={{ textAlign: 'center', marginBottom: 0 }}>
            <div className="section-label" style={{ display: 'inline-flex' }}>الأسئلة الشائعة</div>
            <h2 className="section-title" style={{ marginTop: 16 }}>أسئلة يسألها<br /><span style={{ color: 'var(--gold-2)' }}>مديرو المدارس</span></h2>
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

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner fade-in">
          <h2 className="cta-title">ابدأ رحلة التحول الرقمي<br /><span style={{ color: 'var(--gold-2)' }}>لمدرستك اليوم</span></h2>
          <p className="cta-sub">انضم إلى أكثر من ٥٠٠ مدرسة تستخدم متين لإدارة عملياتها بكفاءة وذكاء.</p>
          <div className="hero-btns">
            <Link href="/register?type=school" className="btn-hero">ابدأ تجربتك المجانية</Link>
            <Link href="/contact" className="btn-hero-outline">تحدث مع فريق المبيعات</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
