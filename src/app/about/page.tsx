import Link from 'next/link';

/* ═══════════════════════════════════════════════════════
   صفحة عن متين — وفق الدستور السيادي 3.0
   الهوية: #06060E خلفية، #C9A84C ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════ */

const PRINCIPLES = [
  { icon: '🏛️', title: 'السيادة للمنصة', desc: 'متين منصة سيادية سعودية 100%. البيانات تُخزَّن داخل المملكة وفق أعلى معايير الأمان والامتثال لأنظمة هيئة الاتصالات وتقنية المعلومات.' },
  { icon: '⚡', title: 'التمكين للمؤسسة', desc: 'نمنح كل مؤسسة تعليمية أدوات إدارة احترافية كانت حكراً على الشركات الكبرى. من الروضة للجامعة، كل مؤسسة تستحق أفضل الأدوات.' },
  { icon: '🔐', title: 'الأمان للمستخدم', desc: 'خصوصية المستخدم خط أحمر. 7 مستويات صلاحيات، تشفير من الطرف للطرف، وسجل تدقيق كامل لكل عملية.' },
];

const ROADMAP = [
  { phase: 'المرحلة الأولى', year: '2024', title: 'الأساس', items: ['إدارة المدارس الأساسية', 'نظام الحضور والدرجات', 'التواصل مع أولياء الأمور', 'الفوترة الإلكترونية'] },
  { phase: 'المرحلة الثانية', year: '2025', title: 'التوسع', items: ['التعليم الإلكتروني المتكامل', 'تكاملات نفاذ ونور', 'تطبيقات الجوال', 'الذكاء الاصطناعي الأساسي'] },
  { phase: 'المرحلة الثالثة', year: '2026', title: 'الابتكار', items: ['AI Career Pathing', 'Matin Coin', 'Skills Passport', 'المحفظة التعليمية الموحدة'] },
  { phase: 'المرحلة الرابعة', year: '2027', title: 'السيادة', items: ['التوسع الخليجي', 'منصة البيانات التعليمية', 'AI Well-being', 'الشراكات الاستراتيجية'] },
];

const TYPES = [
  { icon: '🏫', title: 'المدارس', desc: 'ابتدائي، متوسط، ثانوي — حكومي وأهلي' },
  { icon: '🏛️', title: 'الجامعات', desc: 'إدارة أكاديمية وإدارية متكاملة' },
  { icon: '🎓', title: 'معاهد التدريب', desc: 'دورات، شهادات، وتتبع الإنجاز' },
  { icon: '🌱', title: 'رياض الأطفال', desc: 'بيئة آمنة وتواصل مع الأسرة' },
  { icon: '🏢', title: 'مراكز التعليم', desc: 'مرونة كاملة لكل نموذج تعليمي' },
];

export default function AboutPage() {
  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };
  const btnGhostStyle: React.CSSProperties = { padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textDecoration: 'none' };
  const btnPrimaryStyle: React.CSSProperties = { padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none' };
  const sLabelStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 };
  const cardStyle: React.CSSProperties = { background: '#0B0B16', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 16, padding: 28 };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 }}>

        {/* NAV */}
        <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' }}>م</div>
            متين
          </Link>
          <div style={{ display: 'flex', gap: 28, flex: 1 }}>
            <Link href="/features" style={navLinkStyle}>المميزات</Link>
            <Link href="/pricing" style={navLinkStyle}>الأسعار</Link>
            <Link href="/ai" style={navLinkStyle}>الذكاء الاصطناعي</Link>
            <Link href="/about" style={{ ...navLinkStyle, color: '#C9A84C' }}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={btnGhostStyle}>تسجيل الدخول</Link>
            <Link href="/register" style={btnPrimaryStyle}>ابدأ مجاناً</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div style={sLabelStyle}>من نحن</div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            منصة{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 680, margin: '24px auto 0', lineHeight: 1.8 }}>
            منصة سعودية سيادية لإدارة المؤسسات التعليمية. نؤمن بأن كل مؤسسة تعليمية — مهما كان حجمها — تستحق أدوات إدارة احترافية تُمكّنها من التميز.
          </p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* PRINCIPLES */}
        <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={sLabelStyle}>مبادئنا الثلاثة</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5' }}>
              الشعار الذي نعيشه كل يوم
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {PRINCIPLES.map((p) => (
              <div key={p.title} style={{ ...cardStyle, borderColor: 'rgba(201,168,76,0.2)' }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#C9A84C', marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.65)', lineHeight: 1.8 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* INSTITUTION TYPES */}
        <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={sLabelStyle}>من نخدم</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5' }}>
              5 أنواع من المؤسسات التعليمية
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            {TYPES.map((t) => (
              <div key={t.title} style={{ ...cardStyle, textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#EEEEF5', marginBottom: 8 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.45)', lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* ROADMAP */}
        <section style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={sLabelStyle}>خارطة التطوير</div>
            <h2 style={{ fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5' }}>
              رحلتنا نحو السيادة التعليمية
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
            {ROADMAP.map((phase, i) => (
              <div key={phase.phase} style={{ ...cardStyle, borderColor: i <= 1 ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
                {i <= 1 && <div style={{ position: 'absolute', top: 0, right: 0, left: 0, height: 3, background: 'linear-gradient(90deg,#C9A84C,#E2C46A)' }} />}
                <div style={{ fontSize: 11, fontWeight: 700, color: i <= 1 ? '#C9A84C' : 'rgba(238,238,245,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{phase.year}</div>
                <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.45)', marginBottom: 4 }}>{phase.phase}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#EEEEF5', marginBottom: 16 }}>{phase.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {phase.items.map((item) => (
                    <li key={item} style={{ fontSize: 13, color: 'rgba(238,238,245,0.65)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: i <= 1 ? '#C9A84C' : 'rgba(238,238,245,0.25)', fontSize: 16 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: -1.5, color: '#EEEEF5', marginBottom: 16 }}>
            انضم إلى{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين</span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.8 }}>ابدأ رحلتك مع منصة متين اليوم وانضم لمئات المؤسسات التعليمية.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(238,238,245,0.65)', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>تواصل معنا</Link>
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
