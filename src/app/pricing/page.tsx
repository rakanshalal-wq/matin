'use client';
import { useState } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════
   صفحة الأسعار — وفق الدستور السيادي 3.0
   الباقات: الأساسية 299 / الاحترافية 699 / المؤسسية تواصل
═══════════════════════════════════════════════════════ */

const PLANS = [
  {
    id: 'basic',
    name: 'الأساسية',
    price_monthly: 299,
    price_yearly: 2990,
    students: 'حتى 200 طالب',
    badge: null,
    featured: false,
    color: '#3B82F6',
    features: [
      'الإدارة الأكاديمية الكاملة',
      'نظام الحضور والغياب',
      'إدارة الدرجات والتقييم',
      'تواصل أولياء الأمور',
      'الجدول الدراسي',
      'الواجبات المنزلية',
      'التقارير الأساسية',
      'دعم فني (8 ساعات/يوم)',
    ],
    notIncluded: [
      'التعليم الإلكتروني',
      'النقل المدرسي',
      'المالية المتقدمة',
      'الذكاء الاصطناعي',
    ],
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    price_monthly: 699,
    price_yearly: 6990,
    students: 'حتى 1000 طالب',
    badge: 'الأكثر طلباً',
    featured: true,
    color: '#C9A84C',
    features: [
      'كل مميزات الأساسية',
      'التعليم الإلكتروني الكامل',
      'المحاضرات المباشرة',
      'بنك الأسئلة',
      'إدارة المالية',
      'النقل المدرسي (GPS)',
      'واتساب Business API',
      'تكامل نفاذ',
      'التقارير المتقدمة',
      'دعم فني 24/7',
    ],
    notIncluded: [
      'الذكاء الاصطناعي المتقدم',
      'تكامل نور',
    ],
  },
  {
    id: 'enterprise',
    name: 'المؤسسية',
    price_monthly: null,
    price_yearly: null,
    students: 'غير محدود',
    badge: 'للمؤسسات الكبرى',
    featured: false,
    color: '#8B5CF6',
    features: [
      'كل مميزات الاحترافية',
      'ذكاء اصطناعي كامل (AI)',
      'AI Career Pathing',
      'Matin Coin (اقتصاد داخلي)',
      'AI Well-being',
      'Skills Passport',
      'تكامل نور (Noor)',
      'STC Pay',
      'تقارير متقدمة',
      'SLA 99.9% مضمون',
      'مدير حساب مخصص',
      'API خارجي للمؤسسة',
    ],
    notIncluded: [],
  },
];

const COMPARE_FEATURES = [
  { label: 'الإدارة الأكاديمية', basic: true, pro: true, enterprise: true },
  { label: 'الحضور والغياب', basic: true, pro: true, enterprise: true },
  { label: 'الدرجات والتقييم', basic: true, pro: true, enterprise: true },
  { label: 'تواصل أولياء الأمور', basic: true, pro: true, enterprise: true },
  { label: 'التعليم الإلكتروني', basic: false, pro: true, enterprise: true },
  { label: 'المحاضرات المباشرة', basic: false, pro: true, enterprise: true },
  { label: 'بنك الأسئلة', basic: false, pro: true, enterprise: true },
  { label: 'إدارة المالية', basic: false, pro: true, enterprise: true },
  { label: 'النقل المدرسي (GPS)', basic: false, pro: true, enterprise: true },
  { label: 'واتساب Business API', basic: false, pro: true, enterprise: true },
  { label: 'تكامل نفاذ', basic: false, pro: true, enterprise: true },
  { label: 'الذكاء الاصطناعي (AI)', basic: false, pro: false, enterprise: true },
  { label: 'AI Career Pathing', basic: false, pro: false, enterprise: true },
  { label: 'Matin Coin', basic: false, pro: false, enterprise: true },
  { label: 'تكامل نور (Noor)', basic: false, pro: false, enterprise: true },
  { label: 'STC Pay', basic: false, pro: false, enterprise: true },
  { label: 'Skills Passport', basic: false, pro: false, enterprise: true },
  { label: 'SLA 99.9%', basic: false, pro: false, enterprise: true },
  { label: 'API خارجي', basic: false, pro: false, enterprise: true },
];

const s: Record<string, React.CSSProperties> = {
  wrap: { background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 },
  nav: { position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 },
  logoIcon: { width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' },
  navLinks: { display: 'flex', gap: 32, listStyle: 'none', flex: 1 },
  navLink: { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 },
  navEnd: { display: 'flex', gap: 8, alignItems: 'center', marginRight: 'auto' },
  btnGhost: { padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' },
  btnPrimary: { padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' },
  hero: { padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  heroGlow: { position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse,rgba(201,168,76,0.1) 0%,transparent 60%)', pointerEvents: 'none' },
  sLabel: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, justifyContent: 'center' },
  h1: { fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 },
  heroSub: { fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.8 },
  toggle: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#0B0B16', borderRadius: 100, padding: 4, border: '1px solid rgba(255,255,255,0.06)', margin: '32px auto 0' },
  toggleBtn: { padding: '8px 24px', borderRadius: 100, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.2s' },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20, maxWidth: 1100, margin: '60px auto 0', padding: '0 24px' },
  planCard: { background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', overflow: 'hidden' },
  planCardFeatured: { background: '#0B0B16', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', overflow: 'hidden' },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700, marginBottom: 8 },
  planName: { fontSize: 22, fontWeight: 800, color: '#EEEEF5', marginBottom: 4 },
  planStudents: { fontSize: 13, color: 'rgba(238,238,245,0.5)' },
  price: { fontSize: 48, fontWeight: 800, letterSpacing: -2, lineHeight: 1 },
  pricePeriod: { fontSize: 14, color: 'rgba(238,238,245,0.5)', marginTop: 4 },
  featureList: { display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'rgba(238,238,245,0.8)' },
  featureCheck: { width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 },
  btnPlan: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', border: 'none', transition: 'all 0.2s' },
  section: { padding: '60px 24px', maxWidth: 1100, margin: '0 auto' },
  sectionTitle: { fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 32, textAlign: 'center' },
  compareTable: { width: '100%', borderCollapse: 'collapse', borderRadius: 16, overflow: 'hidden' } as React.CSSProperties,
  compareTh: { background: '#10101E', padding: '16px 20px', fontSize: 13, fontWeight: 700, color: 'rgba(238,238,245,0.65)', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' } as React.CSSProperties,
  compareTd: { padding: '14px 20px', fontSize: 13.5, color: 'rgba(238,238,245,0.65)', background: '#0B0B16', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' } as React.CSSProperties,
  divider: { width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '0' },
  cta: { padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  ctaGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(201,168,76,0.06) 0%,transparent 70%)', pointerEvents: 'none' },
  footer: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, maxWidth: 1280, margin: '0 auto' },
  footerCopy: { fontSize: 13, color: 'rgba(238,238,245,0.35)' },
  footerLinks: { display: 'flex', gap: 24 },
  footerLink: { fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (plan: typeof PLANS[0]) => {
    if (!plan.price_monthly) return null;
    return billing === 'yearly' ? Math.round(plan.price_yearly! / 12) : plan.price_monthly;
  };

  const getSaving = (plan: typeof PLANS[0]) => {
    if (!plan.price_monthly || !plan.price_yearly) return 0;
    return Math.round(((plan.price_monthly * 12 - plan.price_yearly) / (plan.price_monthly * 12)) * 100);
  };

  return (
    <div style={s.wrap}>
      {/* NAV */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>
          <div style={s.logoIcon}>م</div>
          متين
        </Link>
        <ul style={s.navLinks}>
          <li><Link href="/features" style={s.navLink}>المميزات</Link></li>
          <li><Link href="/pricing" style={{ ...s.navLink, color: '#C9A84C' }}>الأسعار</Link></li>
          <li><Link href="/about" style={s.navLink}>عن متين</Link></li>
          <li><Link href="/contact" style={s.navLink}>تواصل معنا</Link></li>
        </ul>
        <div style={s.navEnd}>
          <Link href="/login" style={s.btnGhost}>تسجيل الدخول</Link>
          <Link href="/register" style={s.btnPrimary}>ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.sLabel}>نظام الباقات</div>
        <h1 style={s.h1}>
          أسعار <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>شفافة</span> بلا مفاجآت
        </h1>
        <p style={s.heroSub}>ثلاث باقات مصممة لتناسب كل حجم مؤسسة تعليمية — لا رسوم خفية، لا شروط مبهمة.</p>

        {/* TOGGLE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <div style={s.toggle}>
            <button
              style={{ ...s.toggleBtn, background: billing === 'monthly' ? '#C9A84C' : 'transparent', color: billing === 'monthly' ? '#000' : 'rgba(238,238,245,0.65)' }}
              onClick={() => setBilling('monthly')}
            >
              شهري
            </button>
            <button
              style={{ ...s.toggleBtn, background: billing === 'yearly' ? '#C9A84C' : 'transparent', color: billing === 'yearly' ? '#000' : 'rgba(238,238,245,0.65)', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setBilling('yearly')}
            >
              سنوي
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 700 }}>وفّر 15%</span>
            </button>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <div style={s.plansGrid}>
        {PLANS.map((plan) => {
          const price = getPrice(plan);
          const saving = getSaving(plan);
          const isFeatured = plan.featured;
          return (
            <div key={plan.id} style={isFeatured ? s.planCardFeatured : s.planCard}>
              {isFeatured && (
                <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: 3, background: 'linear-gradient(90deg,#C9A84C,#E2C46A)' }} />
              )}
              {plan.badge && (
                <span style={{ ...s.badge, background: `${plan.color}15`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                  {plan.badge}
                </span>
              )}
              <div>
                <div style={s.planName}>{plan.name}</div>
                <div style={s.planStudents}>{plan.students}</div>
              </div>
              <div>
                {price ? (
                  <>
                    <div style={{ ...s.price, color: plan.color }}>
                      {price.toLocaleString('ar-SA')}
                      <span style={{ fontSize: 18, fontWeight: 600, color: 'rgba(238,238,245,0.5)' }}> ر.س</span>
                    </div>
                    <div style={s.pricePeriod}>
                      {billing === 'yearly' ? '/شهر (يُدفع سنوياً)' : '/شهر'}
                      {billing === 'yearly' && saving > 0 && (
                        <span style={{ marginRight: 8, color: '#10B981', fontWeight: 700 }}>وفّر {saving}%</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 32, fontWeight: 800, color: plan.color }}>تواصل معنا</div>
                    <div style={s.pricePeriod}>سعر مخصص حسب احتياجاتك</div>
                  </>
                )}
              </div>
              <div style={s.featureList}>
                {plan.features.map((f) => (
                  <div key={f} style={s.featureItem}>
                    <div style={{ ...s.featureCheck, background: `${plan.color}15`, color: plan.color }}>✓</div>
                    {f}
                  </div>
                ))}
                {plan.notIncluded.map((f) => (
                  <div key={f} style={{ ...s.featureItem, color: 'rgba(238,238,245,0.3)' }}>
                    <div style={{ ...s.featureCheck, background: 'rgba(255,255,255,0.04)', color: 'rgba(238,238,245,0.3)' }}>✕</div>
                    {f}
                  </div>
                ))}
              </div>
              {plan.id === 'enterprise' ? (
                <Link href="/contact" style={{ ...s.btnPlan, background: `${plan.color}15`, color: plan.color, border: `1px solid ${plan.color}30` }}>
                  تواصل مع فريق المبيعات
                </Link>
              ) : (
                <Link href="/register" style={{ ...s.btnPlan, background: isFeatured ? '#C9A84C' : `${plan.color}15`, color: isFeatured ? '#000' : plan.color, border: isFeatured ? 'none' : `1px solid ${plan.color}30` }}>
                  ابدأ الآن
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* COMPARE */}
      <section style={{ ...s.section, marginTop: 80 }}>
        <h2 style={s.sectionTitle}>
          مقارنة <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تفصيلية</span> للباقات
        </h2>
        <div style={{ overflowX: 'auto', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <table style={s.compareTable}>
            <thead>
              <tr>
                <th style={{ ...s.compareTh, textAlign: 'right' }}>الميزة</th>
                <th style={{ ...s.compareTh, color: '#3B82F6' }}>الأساسية</th>
                <th style={{ ...s.compareTh, color: '#C9A84C' }}>الاحترافية</th>
                <th style={{ ...s.compareTh, color: '#8B5CF6' }}>المؤسسية</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_FEATURES.map((row, i) => (
                <tr key={i}>
                  <td style={{ ...s.compareTd, textAlign: 'right', color: 'rgba(238,238,245,0.8)', fontWeight: 500 }}>{row.label}</td>
                  <td style={s.compareTd}>{row.basic ? <span style={{ color: '#3B82F6', fontSize: 16 }}>✓</span> : <span style={{ color: 'rgba(238,238,245,0.2)', fontSize: 14 }}>—</span>}</td>
                  <td style={s.compareTd}>{row.pro ? <span style={{ color: '#C9A84C', fontSize: 16 }}>✓</span> : <span style={{ color: 'rgba(238,238,245,0.2)', fontSize: 14 }}>—</span>}</td>
                  <td style={s.compareTd}>{row.enterprise ? <span style={{ color: '#8B5CF6', fontSize: 16 }}>✓</span> : <span style={{ color: 'rgba(238,238,245,0.2)', fontSize: 14 }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div style={s.divider} />

      {/* FAQ */}
      <section style={s.section}>
        <h2 style={s.sectionTitle}>أسئلة <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>شائعة</span></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
          {[
            { q: 'هل هناك فترة تجريبية مجانية؟', a: 'نعم، 14 يوم تجريبي مجاني بدون بطاقة ائتمانية.' },
            { q: 'هل يمكن الترقية أو التخفيض في أي وقت؟', a: 'نعم، يمكنك تغيير باقتك في أي وقت مع احتساب الفرق بشكل تناسبي.' },
            { q: 'هل الأسعار تشمل ضريبة القيمة المضافة؟', a: 'الأسعار المعروضة لا تشمل ضريبة القيمة المضافة (15%) التي تُضاف تلقائياً.' },
            { q: 'ما طرق الدفع المتاحة؟', a: 'مدى، Visa، Mastercard، Apple Pay، STC Pay، وTabby للتقسيط.' },
            { q: 'هل بياناتي محفوظة عند إلغاء الاشتراك؟', a: 'يمكنك تصدير بياناتك كاملة قبل الإلغاء. البيانات الأكاديمية تُحفظ 5 سنوات.' },
            { q: 'هل يوجد دعم فني باللغة العربية؟', a: 'نعم، فريق الدعم يعمل باللغة العربية 24/7 للباقة الاحترافية والمؤسسية.' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5', marginBottom: 10 }}>{item.q}</div>
              <div style={{ fontSize: 13.5, color: 'rgba(238,238,245,0.65)', lineHeight: 1.7 }}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.cta}>
        <div style={s.ctaGlow} />
        <div style={s.sLabel}>ابدأ اليوم</div>
        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 16 }}>
          جاهز لتجربة <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين؟</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>
          14 يوم تجريبي مجاني — لا بطاقة ائتمانية مطلوبة.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            ابدأ التجربة المجانية
          </Link>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(238,238,245,0.65)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            تحدث مع مستشار
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <span style={s.footerCopy}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
        <div style={s.footerLinks}>
          <Link href="/privacy" style={s.footerLink}>سياسة الخصوصية</Link>
          <Link href="/terms" style={s.footerLink}>الشروط والأحكام</Link>
          <Link href="/contact" style={s.footerLink}>تواصل معنا</Link>
        </div>
      </footer>
    </div>
  );
}
