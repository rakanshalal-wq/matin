'use client';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════
   صفحة الاستدامة — وفق الدستور السيادي 3.0
   الاستدامة = استدامة المنصة: 99.9% uptime، قيم الأمانة والجودة والشفافية
   ليست صفحة بيئية — هي صفحة موثوقية المنصة وقيمها
═══════════════════════════════════════════════════════ */

const VALUES = [
  {
    icon: '🏛️',
    title: 'الأمانة',
    desc: 'كل بيانات المؤسسة ملكها وحدها. لا نبيع بيانات. لا نشاركها. لا نستخدمها لأغراض خارج نطاق الخدمة.',
    color: '#C9A84C',
  },
  {
    icon: '💎',
    title: 'الجودة',
    desc: 'لا نطلق ميزة حتى تُختبر بالكامل. كل إصدار يمر بمراجعة أمنية وتقنية صارمة قبل الوصول للمستخدم.',
    color: '#3B82F6',
  },
  {
    icon: '🔍',
    title: 'الشفافية',
    desc: 'كل تغيير في النظام موثق. كل حادثة تقنية تُعلن ويُشرح سببها وحلها. لا أسرار مع عملائنا.',
    color: '#10B981',
  },
];

const RELIABILITY_STATS = [
  { value: '99.9%', label: 'وقت التشغيل المضمون', sub: 'SLA رسمي مع كل عقد' },
  { value: '< 200ms', label: 'سرعة الاستجابة', sub: 'متوسط وقت معالجة الطلب' },
  { value: 'كل ساعة', label: 'النسخ الاحتياطية', sub: 'نسخ تلقائية مشفرة' },
  { value: '< 5 دقائق', label: 'وقت الاسترجاع', sub: 'في حالات الطوارئ' },
];

const SECURITY_LAYERS = [
  { num: '01', title: 'جدار الحماية (Firewall)', desc: 'يمنع الوصول غير المصرح به قبل أن يصل لأي بيانات' },
  { num: '02', title: 'تشفير TLS 1.3', desc: 'تشفير كامل لكل الاتصالات بين المستخدم والخادم' },
  { num: '03', title: 'المصادقة المتعددة (2FA)', desc: 'كلمة مرور + رمز تحقق لكل دخول حساس' },
  { num: '04', title: 'تشفير AES-256', desc: 'تشفير كامل لكل البيانات المخزنة في قواعد البيانات' },
  { num: '05', title: 'التحكم في الوصول (RBAC)', desc: 'كل مستخدم يرى صلاحياته فقط — لا أكثر ولا أقل' },
  { num: '06', title: 'مراقبة الأمان (IDS)', desc: 'مراقبة 24/7 لاكتشاف أي نشاط غير طبيعي فوراً' },
  { num: '07', title: 'سجلات الأمان (Audit Logs)', desc: 'تسجيل كامل لكل الأحداث — لا يُحذف ولا يُعدَّل' },
  { num: '08', title: 'الذكاء الاصطناعي (AI Auditor)', desc: 'مراقب ذكي يكتشف الشذوذ ويرفع تنبيهات فورية' },
];

const COMMITMENTS = [
  { title: 'استمرارية الخدمة', desc: 'لا نوقف الخدمة أثناء ساعات الدراسة. التحديثات تُنفَّذ في أوقات الذروة المنخفضة.' },
  { title: 'حماية البيانات', desc: 'بيانات كل مؤسسة معزولة تماماً عن الأخرى. Multi-tenancy بأعلى معايير الأمان.' },
  { title: 'الامتثال التنظيمي', desc: 'نلتزم بكل متطلبات وزارة التعليم وهيئة البيانات الوطنية وحماية المعلومات الشخصية.' },
  { title: 'الدعم الفوري', desc: 'فريق دعم فني متاح 24/7 للباقة الاحترافية والمؤسسية. وقت الاستجابة الأول أقل من 15 دقيقة.' },
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
  heroGlow: { position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse,rgba(16,185,129,0.08) 0%,transparent 60%)', pointerEvents: 'none' },
  sLabel: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20, justifyContent: 'center' },
  h1: { fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 },
  heroSub: { fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.8 },
  section: { padding: '60px 24px', maxWidth: 1200, margin: '0 auto' },
  sectionTitle: { fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 12 },
  sectionSub: { fontSize: 16, color: 'rgba(238,238,245,0.65)', marginBottom: 40, lineHeight: 1.7 },
  divider: { width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' },
  footer: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, maxWidth: 1280, margin: '0 auto' },
  footerCopy: { fontSize: 13, color: 'rgba(238,238,245,0.35)' },
  footerLinks: { display: 'flex', gap: 24 },
  footerLink: { fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' },
};

export default function SustainabilityPage() {
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
          <li><Link href="/pricing" style={s.navLink}>الأسعار</Link></li>
          <li><Link href="/about" style={s.navLink}>عن متين</Link></li>
          <li><Link href="/sustainability" style={{ ...s.navLink, color: '#C9A84C' }}>الاستدامة</Link></li>
        </ul>
        <div style={s.navEnd}>
          <Link href="/login" style={s.btnGhost}>تسجيل الدخول</Link>
          <Link href="/register" style={s.btnPrimary}>ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.sLabel}>الاستدامة والموثوقية</div>
        <h1 style={s.h1}>
          منصة <span style={{ background: 'linear-gradient(90deg,#10B981,#C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تدوم</span> معك
        </h1>
        <p style={s.heroSub}>
          الاستدامة في متين تعني شيئاً واحداً: منصة موثوقة تعمل دائماً، بيانات آمنة، وقيم لا تتغير.
        </p>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, maxWidth: 900, margin: '60px auto 0', padding: '0 24px' }}>
          {RELIABILITY_STATS.map((stat) => (
            <div key={stat.label} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#C9A84C', letterSpacing: -2, marginBottom: 8 }}>{stat.value}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5', marginBottom: 4 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* VALUES */}
      <section style={s.section}>
        <div style={s.sLabel}>قيمنا الجوهرية</div>
        <h2 style={s.sectionTitle}>
          ثلاثة مبادئ <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>لا تُساوَم</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
          {VALUES.map((v) => (
            <div key={v.title} style={{ background: '#0B0B16', border: `1px solid ${v.color}20`, borderRadius: 20, padding: 36 }}>
              <div style={{ fontSize: 40, marginBottom: 20 }}>{v.icon}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: v.color, marginBottom: 12 }}>{v.title}</h3>
              <p style={{ fontSize: 15, color: 'rgba(238,238,245,0.7)', lineHeight: 1.8 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* SECURITY LAYERS */}
      <section style={s.section}>
        <div style={s.sLabel}>نظام الأمان</div>
        <h2 style={s.sectionTitle}>
          <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>8 طبقات</span> حماية
        </h2>
        <p style={s.sectionSub}>من الإنترنت إلى قاعدة البيانات — كل طبقة تحمي ما خلفها.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {SECURITY_LAYERS.map((layer) => (
            <div key={layer.num} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#C9A84C', background: 'rgba(201,168,76,0.1)', borderRadius: 8, padding: '6px 10px', flexShrink: 0 }}>{layer.num}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5', marginBottom: 6 }}>{layer.title}</div>
                <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.6)', lineHeight: 1.6 }}>{layer.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={s.divider} />

      {/* COMMITMENTS */}
      <section style={s.section}>
        <div style={s.sLabel}>التزاماتنا</div>
        <h2 style={s.sectionTitle}>
          وعود <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>مكتوبة</span> في العقد
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {COMMITMENTS.map((c) => (
            <div key={c.title} style={{ background: '#0B0B16', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ color: '#C9A84C', fontSize: 18 }}>✓</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#EEEEF5' }}>{c.title}</div>
              </div>
              <div style={{ fontSize: 13.5, color: 'rgba(238,238,245,0.65)', lineHeight: 1.7 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%,rgba(201,168,76,0.06) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={s.sLabel}>ابدأ اليوم</div>
        <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 16 }}>
          منصة <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تثق بها</span> من اليوم الأول
        </h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
          <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            ابدأ التجربة المجانية
          </Link>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(238,238,245,0.65)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            تحدث مع فريقنا
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
