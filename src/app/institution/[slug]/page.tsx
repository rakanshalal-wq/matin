'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';
const TEXT_DIM = 'rgba(238,238,245,0.6)';
const TEXT_MUTED = 'rgba(238,238,245,0.3)';

// اعدادات كل نوع مؤسسة
const TYPE_CONFIG: Record<string, {
  icon: string;
  label: string;
  badge: string;
  defaultPrimary: string;
  defaultSecondary: string;
  defaultAccent: string;
  heroTitle: string;
  heroDesc: string;
  ctaText: string;
  ctaShort: string;
  servicesTitle: string;
  defaultServices: { icon: string; title: string; desc: string; color: string; tag: string }[];
  formTitle: string;
  formDesc: string;
  formFields: { key: string; ph: string; type: string; required?: boolean }[];
  gradeOptions?: string[];
  statsLabels: Record<string, string>;
}> = {
  school: {
    icon: '🏫',
    label: 'مدرسة',
    badge: 'مدرسة معتمدة على منصة متين',
    defaultPrimary: '#1E88E5',
    defaultSecondary: '#0D47A1',
    defaultAccent: '#FFB300',
    heroTitle: 'بوابتك الكاملة لـ',
    heroDesc: 'سجّل ابنك، تابع دراسته، تواصل مع معلميه — كل شيء من مكان واحد.',
    ctaText: 'سجّل ابنك الآن',
    ctaShort: 'تعرّف على المدرسة',
    servicesTitle: 'خدمات المدرسة',
    defaultServices: [
      { icon: '📚', title: 'التعليم الرقمي', desc: 'منهج متكامل مع كتب رقمية ومقاطع تعليمية تفاعلية', color: '#3B82F6', tag: 'متاح' },
      { icon: '📊', title: 'تتبع التقدم الأكاديمي', desc: 'اطلع على درجات ابنك وتقدمه في الوقت الفعلي', color: '#10B981', tag: 'مباشر' },
      { icon: '🚌', title: 'تتبع GPS للباص', desc: 'تعرف أين ابنك في أي وقت مع تنبيهات فورية', color: '#F59E0B', tag: 'مباشر' },
      { icon: '💬', title: 'التواصل المباشر', desc: 'محادثة مباشرة مع المعلمين وإدارة المدرسة', color: '#A78BFA', tag: 'متاح' },
      { icon: '🏆', title: 'الأنشطة والمسابقات', desc: 'برامج إثرائية متنوعة لتنمية مهارات الطالب', color: '#1E88E5', tag: 'متاح' },
      { icon: '💳', title: 'الدفع الإلكتروني', desc: 'سدّد الرسوم الدراسية بأمان عبر بوابة الدفع', color: '#EF4444', tag: 'آمن' },
    ],
    formTitle: 'سجّل ابنك الآن',
    formDesc: 'أرسل طلب التسجيل وسنتواصل معك خلال 24 ساعة',
    formFields: [
      { key: 'parent_name', ph: 'اسم ولي الأمر *', type: 'text', required: true },
      { key: 'student_name', ph: 'اسم الطالب *', type: 'text', required: true },
      { key: 'phone', ph: 'رقم الجوال *', type: 'tel', required: true },
      { key: 'email', ph: 'البريد الإلكتروني', type: 'email' },
    ],
    gradeOptions: ['الروضة', 'الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي', 'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي', 'الأول المتوسط', 'الثاني المتوسط', 'الثالث المتوسط', 'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'],
    statsLabels: { students: 'طالب مسجّل', teachers: 'معلم متخصص', years: 'سنة خبرة', satisfaction: 'رضا الأهالي' },
  },
  university: {
    icon: '🎓',
    label: 'جامعة',
    badge: 'جامعة معتمدة على منصة متين',
    defaultPrimary: '#7C3AED',
    defaultSecondary: '#4C1D95',
    defaultAccent: '#F59E0B',
    heroTitle: 'بوابتك الأكاديمية لـ',
    heroDesc: 'سجّل في الجامعة، تابع موادك، تواصل مع أساتذتك — منصة أكاديمية متكاملة.',
    ctaText: 'قدّم طلب القبول',
    ctaShort: 'تعرّف على الجامعة',
    servicesTitle: 'خدمات الجامعة',
    defaultServices: [
      { icon: '📖', title: 'البوابة الأكاديمية', desc: 'التسجيل والجداول والدرجات في مكان واحد', color: '#7C3AED', tag: 'متاح' },
      { icon: '🔬', title: 'البحث العلمي', desc: 'منصة لإدارة الأبحاث والمشاريع الأكاديمية', color: '#10B981', tag: 'متاح' },
      { icon: '📊', title: 'السجل الأكاديمي', desc: 'تتبع التقدم والمعدل التراكمي بشكل لحظي', color: '#3B82F6', tag: 'مباشر' },
      { icon: '🏛️', title: 'الكليات والأقسام', desc: 'استعرض الكليات والتخصصات المتاحة', color: '#F59E0B', tag: 'متاح' },
      { icon: '💬', title: 'التواصل الأكاديمي', desc: 'تواصل مع الأساتذة والمرشدين الأكاديميين', color: '#A78BFA', tag: 'متاح' },
      { icon: '💳', title: 'الرسوم الجامعية', desc: 'سدّد الرسوم إلكترونياً بأمان وسهولة', color: '#EF4444', tag: 'آمن' },
    ],
    formTitle: 'قدّم طلب القبول',
    formDesc: 'أرسل طلبك وسنراجعه خلال 48 ساعة',
    formFields: [
      { key: 'full_name', ph: 'الاسم الكامل *', type: 'text', required: true },
      { key: 'phone', ph: 'رقم الجوال *', type: 'tel', required: true },
      { key: 'email', ph: 'البريد الإلكتروني *', type: 'email', required: true },
    ],
    gradeOptions: ['بكالوريوس', 'ماجستير', 'دكتوراه', 'دبلوم عالي'],
    statsLabels: { students: 'طالب مسجّل', teachers: 'عضو هيئة تدريس', years: 'سنة تأسيس', satisfaction: 'نسبة التوظيف' },
  },
  institute: {
    icon: '🏛️',
    label: 'معهد',
    badge: 'معهد معتمد على منصة متين',
    defaultPrimary: '#0EA5E9',
    defaultSecondary: '#0369A1',
    defaultAccent: '#F59E0B',
    heroTitle: 'طوّر مهاراتك مع',
    heroDesc: 'دورات تدريبية متخصصة وشهادات معتمدة — ابدأ رحلتك المهنية الآن.',
    ctaText: 'سجّل الآن',
    ctaShort: 'تعرّف على المعهد',
    servicesTitle: 'خدمات المعهد',
    defaultServices: [
      { icon: '📚', title: 'دورات متخصصة', desc: 'برامج تدريبية في مختلف المجالات', color: '#0EA5E9', tag: 'متاح' },
      { icon: '📜', title: 'شهادات معتمدة', desc: 'شهادات إتمام معتمدة من جهات رسمية', color: '#10B981', tag: 'معتمد' },
      { icon: '👨‍🏫', title: 'مدربون خبراء', desc: 'نخبة من المدربين المتخصصين في مجالاتهم', color: '#F59E0B', tag: 'متاح' },
      { icon: '💻', title: 'تعلم عن بُعد', desc: 'حضر الدورات أونلاين من أي مكان', color: '#A78BFA', tag: 'متاح' },
      { icon: '📊', title: 'تتبع التقدم', desc: 'تابع تقدمك في كل دورة بشكل لحظي', color: '#3B82F6', tag: 'مباشر' },
      { icon: '💳', title: 'دفع إلكتروني', desc: 'ادفع رسوم الدورات بأمان وسهولة', color: '#EF4444', tag: 'آمن' },
    ],
    formTitle: 'سجّل في الدورة',
    formDesc: 'اختر البرنامج المناسب وسجّل الآن',
    formFields: [
      { key: 'full_name', ph: 'الاسم الكامل *', type: 'text', required: true },
      { key: 'phone', ph: 'رقم الجوال *', type: 'tel', required: true },
      { key: 'email', ph: 'البريد الإلكتروني', type: 'email' },
    ],
    statsLabels: { students: 'متدرب', programs: 'برنامج تدريبي', years: 'سنة خبرة', employment: 'نسبة التوظيف' },
  },
  training: {
    icon: '💼',
    label: 'مركز تدريب',
    badge: 'مركز تدريب معتمد على منصة متين',
    defaultPrimary: '#F97316',
    defaultSecondary: '#C2410C',
    defaultAccent: '#10B981',
    heroTitle: 'تدريب احترافي في',
    heroDesc: 'برامج تدريبية عملية مع شهادات معتمدة — طوّر مسيرتك المهنية.',
    ctaText: 'سجّل في البرنامج',
    ctaShort: 'تعرّف على المركز',
    servicesTitle: 'خدمات المركز',
    defaultServices: [
      { icon: '🎯', title: 'تدريب عملي', desc: 'تطبيق عملي مباشر على المهارات المطلوبة', color: '#F97316', tag: 'متاح' },
      { icon: '📜', title: 'شهادات مهنية', desc: 'شهادات معتمدة تعزز سيرتك الذاتية', color: '#10B981', tag: 'معتمد' },
      { icon: '👥', title: 'ورش عمل', desc: 'ورش تفاعلية بمجموعات صغيرة لتعلّم أفضل', color: '#3B82F6', tag: 'متاح' },
      { icon: '💼', title: 'تأهيل مهني', desc: 'تأهيل لسوق العمل بمهارات مطلوبة', color: '#A78BFA', tag: 'متاح' },
      { icon: '📊', title: 'تقييم الأداء', desc: 'تقييم مستمر وتقارير تقدم مفصّلة', color: '#F59E0B', tag: 'مباشر' },
      { icon: '💳', title: 'دفع مرن', desc: 'خيارات دفع متعددة وتقسيط ميسّر', color: '#EF4444', tag: 'مرن' },
    ],
    formTitle: 'سجّل في البرنامج التدريبي',
    formDesc: 'أرسل طلبك وسنتواصل معك لتحديد البرنامج المناسب',
    formFields: [
      { key: 'full_name', ph: 'الاسم الكامل *', type: 'text', required: true },
      { key: 'phone', ph: 'رقم الجوال *', type: 'tel', required: true },
      { key: 'email', ph: 'البريد الإلكتروني', type: 'email' },
    ],
    statsLabels: { students: 'متدرب', teachers: 'مدرب معتمد', years: 'سنة خبرة', satisfaction: 'رضا المتدربين' },
  },
  quran: {
    icon: '📖',
    label: 'تحفيظ قرآن',
    badge: 'مركز تحفيظ معتمد على منصة متين',
    defaultPrimary: '#059669',
    defaultSecondary: '#065F46',
    defaultAccent: '#D4A843',
    heroTitle: 'احفظ كتاب الله في',
    heroDesc: 'حلقات تحفيظ متميزة مع محفّظين متخصصين — ابدأ رحلتك القرآنية.',
    ctaText: 'انضم لحلقة التحفيظ',
    ctaShort: 'تعرّف على المركز',
    servicesTitle: 'خدمات المركز',
    defaultServices: [
      { icon: '📖', title: 'حلقات التحفيظ', desc: 'حلقات منظّمة لحفظ القرآن الكريم بإتقان', color: '#059669', tag: 'متاح' },
      { icon: '🎤', title: 'التسميع المباشر', desc: 'تسميع مباشر مع المحفّظ عبر المنصة', color: '#D4A843', tag: 'مباشر' },
      { icon: '📊', title: 'متابعة الحفظ', desc: 'تتبع تقدم الحفظ والمراجعة بشكل يومي', color: '#3B82F6', tag: 'مباشر' },
      { icon: '🏆', title: 'المسابقات القرآنية', desc: 'مسابقات دورية في الحفظ والتجويد والتلاوة', color: '#F59E0B', tag: 'متاح' },
      { icon: '📜', title: 'الإجازات القرآنية', desc: 'إجازات معتمدة بالسند المتصل', color: '#10B981', tag: 'معتمد' },
      { icon: '👨‍👩‍👧‍👦', title: 'حلقات الأسرة', desc: 'برامج خاصة لجميع أفراد الأسرة', color: '#A78BFA', tag: 'متاح' },
    ],
    formTitle: 'انضم لحلقة التحفيظ',
    formDesc: 'سجّل الآن وابدأ رحلتك مع كتاب الله',
    formFields: [
      { key: 'full_name', ph: 'اسم الطالب *', type: 'text', required: true },
      { key: 'parent_name', ph: 'اسم ولي الأمر', type: 'text' },
      { key: 'phone', ph: 'رقم الجوال *', type: 'tel', required: true },
      { key: 'email', ph: 'البريد الإلكتروني', type: 'email' },
    ],
    gradeOptions: ['مبتدئ', 'حافظ جزء عم', 'حافظ 5 أجزاء', 'حافظ 10 أجزاء', 'حافظ 20 جزء', 'مراجعة وإتقان'],
    statsLabels: { students: 'طالب', teachers: 'محفّظ معتمد', years: 'سنة عطاء', satisfaction: 'رضا الطلاب' },
  },
};

export default function InstitutionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [institution, setInstitution] = useState<any>(null);
  const [instType, setInstType] = useState<string>('school');
  const [stats, setStats] = useState<any>({});
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    fetch(`/api/public/institution/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setInstitution(d.institution);
          setInstType(d.type || 'school');
          if (d.stats) setStats(d.stats);
          if (d.announcements) setAnnouncements(d.announcements);
          if (d.activities) setActivities(d.activities);
          if (d.programs) setPrograms(d.programs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const cfg = TYPE_CONFIG[instType] || TYPE_CONFIG.school;
  const PRIMARY = institution?.primary_color || cfg.defaultPrimary;
  const SECONDARY = institution?.secondary_color || cfg.defaultSecondary;
  const ACCENT = institution?.accent_color || cfg.defaultAccent;
  const instName = institution?.name || cfg.label;
  const instDesc = institution?.description || cfg.heroDesc;

  const submitForm = async () => {
    const requiredFields = cfg.formFields.filter(f => f.required).map(f => f.key);
    if (requiredFields.some(k => !formData[k])) return;
    setFormLoading(true);
    setFormMsg('');
    try {
      const res = await fetch(`/api/public/institution/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, grade: formData.grade }),
      });
      if (res.ok) {
        setFormMsg('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
        setFormData({});
      } else {
        setFormMsg('حدث خطأ، يرجى المحاولة مجدداً.');
      }
    } catch {
      setFormMsg('حدث خطأ، يرجى المحاولة مجدداً.');
    }
    setFormLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#06060E', color: '#fff', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{cfg.icon}</div>
          <div style={{ fontSize: '1.1rem', color: TEXT_DIM }}>جارٍ تحميل البوابة...</div>
        </div>
      </div>
    );
  }

  const displayServices = cfg.defaultServices;
  const navLinks = [
    { id: 'services', label: 'خدماتنا' },
    ...(announcements.length > 0 ? [{ id: 'announcements', label: 'الإعلانات' }] : []),
    ...(activities.length > 0 || instType === 'school' ? [{ id: 'activities', label: 'الأنشطة' }] : []),
    ...(programs.length > 0 ? [{ id: 'programs', label: 'البرامج' }] : []),
    { id: 'register', label: 'التسجيل' },
  ];

  const statsArray = Object.entries(cfg.statsLabels).map(([key, label]) => ({
    v: key === 'satisfaction' || key === 'employment' ? `${stats[key] || 0}%` : `${stats[key] || 0}+`,
    l: label,
  }));

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', background: '#06060E', color: '#EEEEF5', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, backdropFilter: 'blur(20px)', background: 'rgba(6,6,14,0.9)', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>
              {cfg.icon}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800 }}>{instName}</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED }}>{slug}.matin.ink</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {navLinks.map(nl => (
              <button key={nl.id} onClick={() => scrollTo(nl.id)}
                style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', border: 'none', color: TEXT_DIM, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                {nl.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login">
              <button style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '8px 16px', color: TEXT_DIM, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                تسجيل الدخول
              </button>
            </Link>
            <button onClick={() => scrollTo('register')}
              style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 4px 14px ${PRIMARY}40` }}>
              {cfg.ctaText}
            </button>
            <button onClick={() => setMobileOpen(true)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, width: 38, height: 38, display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: TEXT_DIM }}>
              &#9776;
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: '100%', background: '#090E16', borderLeft: `1px solid ${BORDER}`, padding: 24, display: 'flex', flexDirection: 'column', gap: 6 }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setMobileOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, width: 36, height: 36, marginBottom: 12, cursor: 'pointer', color: TEXT_DIM }}>&#10005;</button>
            {navLinks.map(nl => (
              <button key={nl.id} onClick={() => scrollTo(nl.id)}
                style={{ padding: '11px 14px', borderRadius: 9, background: 'transparent', border: 'none', color: TEXT_DIM, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'right', fontFamily: 'inherit' }}>
                {nl.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HERO */}
      <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px 60px' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 40%,${PRIMARY}18 0%,transparent 55%),radial-gradient(circle at 75% 60%,${ACCENT}10 0%,transparent 45%)` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr min(480px,45%)', gap: 60, alignItems: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}30`, borderRadius: 20, padding: '6px 14px', fontSize: 12, color: PRIMARY, fontWeight: 600, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIMARY, display: 'inline-block' }} />
              {cfg.badge}
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: -1 }}>
              {cfg.heroTitle}
              <br />
              <span style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {instName}
              </span>
            </h1>
            <p style={{ fontSize: 16, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 28, maxWidth: 480 }}>{instDesc}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => scrollTo('register')}
                style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 12, padding: '13px 28px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: `0 8px 28px ${PRIMARY}30`, display: 'flex', alignItems: 'center', gap: 8 }}>
                + {cfg.ctaText}
              </button>
              <button onClick={() => scrollTo('services')}
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '13px 24px', color: TEXT_DIM, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                &#9654; {cfg.ctaShort}
              </button>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 28, marginTop: 32, flexWrap: 'wrap' }}>
              {statsArray.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Card */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 20, backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{cfg.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{instName}</div>
                <div style={{ fontSize: 11, color: PRIMARY, fontWeight: 600, marginTop: 2 }}>&#9679; مفتوح للتسجيل</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {displayServices.slice(0, 4).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: TEXT_DIM }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${f.color}15`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#EEEEF5' }}>{f.title}</div>
                    <div style={{ fontSize: 10.5, color: TEXT_MUTED, marginTop: 1 }}>{f.desc}</div>
                  </div>
                  <span style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{f.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 20, padding: '5px 14px', fontSize: 11.5, color: TEXT_DIM, fontWeight: 600, marginBottom: 14 }}>
              {cfg.servicesTitle}
            </div>
            <h2 style={{ fontSize: 'clamp(26px,4vw,34px)', fontWeight: 800, marginBottom: 12 }}>
              {'كل ما تحتاجه '}
              <span style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                في مكان واحد
              </span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {displayServices.map((s, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 22, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${s.color}18`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 24 }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12.5, color: TEXT_DIM, lineHeight: 1.6 }}>{s.desc}</div>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, marginTop: 10, background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS (for institute/training) */}
      {programs.length > 0 && (
        <section id="programs" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, marginBottom: 8 }}>&#128218; البرامج المتاحة</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {programs.map((p: any, i: number) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: `${p.color || PRIMARY}18`, border: `1px solid ${p.color || PRIMARY}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {p.icon || '📚'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                      {p.duration && <div style={{ fontSize: 11, color: TEXT_MUTED }}>{p.duration}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {p.price && <span style={{ fontSize: 13, fontWeight: 700, color: PRIMARY }}>{p.price} ر.س</span>}
                    {p.seats && <span style={{ fontSize: 11, color: TEXT_MUTED }}>{p.seats} مقعد</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ANNOUNCEMENTS */}
      {(announcements.length > 0) && (
        <section id="announcements" style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, marginBottom: 8 }}>&#128226; الإعلانات والأخبار</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {announcements.map((a: any, i: number) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PRIMARY, flexShrink: 0, marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{a.title}</div>
                      {a.pinned && <span style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 9.5, fontWeight: 700, padding: '2px 7px', borderRadius: 8 }}>مثبّت</span>}
                    </div>
                    <div style={{ fontSize: 12.5, color: TEXT_DIM, lineHeight: 1.6 }}>{a.body}</div>
                    {a.created_at && <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 6 }}>{new Date(a.created_at).toLocaleDateString('ar-SA')}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ACTIVITIES (school/university) */}
      {activities.length > 0 && (
        <section id="activities" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, marginBottom: 8 }}>&#127942; الأنشطة والفعاليات</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {activities.map((a: any, i: number) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {a.icon || '🏆'}
                    </div>
                    {a.event_date && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: `${PRIMARY}18`, color: PRIMARY, border: `1px solid ${PRIMARY}30`, marginRight: 'auto' }}>
                      {new Date(a.event_date).toLocaleDateString('ar-SA')}
                    </span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: TEXT_DIM, lineHeight: 1.6 }}>{a.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REGISTER FORM */}
      <section id="register" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: `linear-gradient(135deg,${PRIMARY}10,${SECONDARY}08)`, border: `1px solid ${PRIMARY}20`, borderRadius: 20, padding: 40 }}>
            <div style={{ maxWidth: 500 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{cfg.formTitle}</h2>
              <p style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 24, lineHeight: 1.7 }}>{cfg.formDesc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: cfg.formFields.length >= 3 ? '1fr 1fr' : '1fr', gap: 12 }}>
                  {cfg.formFields.map(f => (
                    <input key={f.key} type={f.type} placeholder={f.ph} value={formData[f.key] || ''}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#EEEEF5', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
                  ))}
                </div>
                {cfg.gradeOptions && (
                  <select value={formData.grade || ''} onChange={e => setFormData(p => ({ ...p, grade: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: formData.grade ? '#EEEEF5' : 'rgba(238,238,245,0.3)', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none' }}>
                    <option value="">{instType === 'school' ? 'المرحلة الدراسية' : instType === 'quran' ? 'المستوى' : 'التخصص'}</option>
                    {cfg.gradeOptions.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                )}
                <textarea placeholder="ملاحظات إضافية (اختياري)" value={formData.notes || ''}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#EEEEF5', fontSize: 13, padding: '11px 14px', borderRadius: 10, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                {formMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: 9, background: formMsg.includes('نجاح') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${formMsg.includes('نجاح') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: formMsg.includes('نجاح') ? '#10B981' : '#EF4444', fontSize: 13 }}>
                    {formMsg}
                  </div>
                )}
                <button onClick={submitForm} disabled={formLoading}
                  style={{ background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', borderRadius: 12, padding: 13, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%', boxShadow: `0 6px 20px ${PRIMARY}30`, opacity: formLoading ? 0.6 : 1, marginTop: 4 }}>
                  {formLoading ? 'جارٍ الإرسال...' : cfg.ctaText + ' ←'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#09111A', borderTop: `1px solid ${BORDER}`, padding: '48px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cfg.icon}</div>
                <span style={{ fontWeight: 800, fontSize: 15 }}>{instName}</span>
              </div>
              <p style={{ fontSize: 13, color: TEXT_DIM, lineHeight: 1.7, marginBottom: 16 }}>
                {cfg.badge}
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EEEEF5', letterSpacing: 0.8, marginBottom: 14 }}>روابط سريعة</div>
              {navLinks.map(nl => (
                <div key={nl.id} onClick={() => scrollTo(nl.id)} style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 8, cursor: 'pointer' }}>{nl.label}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EEEEF5', letterSpacing: 0.8, marginBottom: 14 }}>التواصل</div>
              <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 8 }}>{institution?.phone || '920-XXX-XXX'}</div>
              <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 8 }}>{institution?.email || 'info@institution.sa'}</div>
              <div style={{ fontSize: 13, color: TEXT_DIM, marginBottom: 8 }}>{institution?.address || 'المملكة العربية السعودية'}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, color: TEXT_MUTED }}>&copy; {new Date().getFullYear()} {instName}. جميع الحقوق محفوظة.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: TEXT_MUTED }}>
              {'مدعوم بـ '}<strong style={{ color: '#D4A843' }}>متين</strong>{' للتعليم الذكي'}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
