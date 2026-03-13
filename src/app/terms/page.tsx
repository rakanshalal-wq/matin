import Link from 'next/link';

export default function TermsPage() {
  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };
  const sectionStyle: React.CSSProperties = { marginBottom: 40 };
  const h2Style: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: '#C9A84C', marginBottom: 12, borderRight: '3px solid #C9A84C', paddingRight: 12 };
  const pStyle: React.CSSProperties = { fontSize: 14, color: 'rgba(238,238,245,0.65)', lineHeight: 1.9 };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 }}>

        <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' }}>م</div>
            متين
          </Link>
          <div style={{ display: 'flex', gap: 28, flex: 1 }}>
            <Link href="/features" style={navLinkStyle}>المميزات</Link>
            <Link href="/pricing" style={navLinkStyle}>الأسعار</Link>
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <Link href="/register" style={{ padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
        </nav>

        <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            الشروط{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>والأحكام</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.4)', marginTop: 12 }}>آخر تحديث: مارس 2026</p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 40 }}>
            <div style={sectionStyle}>
              <h2 style={h2Style}>١. القبول بالشروط</h2>
              <p style={pStyle}>مرحباً بك في منصة متين التعليمية. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٢. الاشتراك والحساب</h2>
              <p style={pStyle}>يجب أن تكون مؤسسة تعليمية مرخصة للاشتراك في متين. أنت مسؤول عن الحفاظ على سرية بيانات الدخول لحسابك. يحق لمتين تعليق أو إنهاء الحساب في حال مخالفة الشروط.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٣. الاشتراكات والمدفوعات</h2>
              <p style={pStyle}>الاشتراكات تُجدَّد تلقائياً ما لم يتم الإلغاء قبل 7 أيام من تاريخ التجديد. المدفوعات غير قابلة للاسترداد بعد بدء الفترة الجديدة. نقدم 14 يوماً تجريبية مجانية بدون بطاقة ائتمانية.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٤. ملكية البيانات</h2>
              <p style={pStyle}>جميع البيانات التي تُدخلها في المنصة هي ملكك الحصري. متين لا تدّعي أي ملكية على بياناتك. عند إنهاء الاشتراك، يمكنك تصدير بياناتك كاملة خلال 30 يوماً.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٥. الاستخدام المقبول</h2>
              <p style={pStyle}>يُمنع استخدام المنصة لأي غرض غير قانوني، أو نشر محتوى مسيء، أو محاولة اختراق الأنظمة، أو إعادة بيع الخدمة لأطراف ثالثة دون إذن كتابي.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٦. تحديد المسؤولية</h2>
              <p style={pStyle}>تلتزم متين بتقديم الخدمة بأعلى معايير الجودة. في حالات الانقطاع غير المتوقعة، نقدم تعويضاً وفق اتفاقية مستوى الخدمة (SLA) المتفق عليها. مسؤوليتنا القصوى لا تتجاوز قيمة اشتراكك الشهري.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٧. القانون المطبق</h2>
              <p style={pStyle}>تخضع هذه الشروط لأنظمة المملكة العربية السعودية. أي نزاع يُحسم أمام المحاكم السعودية المختصة.</p>
            </div>
          </div>
        </div>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)' }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
            <Link href="/contact" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>تواصل معنا</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
