import Link from 'next/link';

export default function PrivacyPage() {
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
            سياسة{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>الخصوصية</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.4)', marginTop: 12 }}>آخر تحديث: مارس 2026</p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 40 }}>
            <div style={sectionStyle}>
              <h2 style={h2Style}>١. مقدمة</h2>
              <p style={pStyle}>نحن في منصة متين نلتزم بحماية خصوصية مستخدمينا وبياناتهم الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام منصتنا التعليمية. نحن نتوافق مع نظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL) وجميع الأنظمة واللوائح ذات الصلة.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٢. البيانات التي نجمعها</h2>
              <p style={pStyle}>نجمع المعلومات التي تقدمها مباشرة عند التسجيل (الاسم، البريد الإلكتروني، رقم الجوال، بيانات المؤسسة)، وبيانات الاستخدام (سجلات الدخول، الأنشطة داخل المنصة)، والبيانات الأكاديمية (الدرجات، الحضور، التقارير). لا نجمع بيانات حساسة دون موافقة صريحة.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٣. كيف نستخدم بياناتك</h2>
              <p style={pStyle}>نستخدم بياناتك حصرياً لتقديم خدمات المنصة وتحسينها، وإرسال الإشعارات المتعلقة بحسابك، وتوليد التقارير الأكاديمية والإدارية، والامتثال للمتطلبات القانونية. لا نبيع بياناتك ولا نشاركها مع أطراف ثالثة لأغراض تجارية.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٤. تخزين البيانات وأمانها</h2>
              <p style={pStyle}>جميع البيانات تُخزَّن على خوادم داخل المملكة العربية السعودية. نطبق 8 طبقات أمان تشمل التشفير من الطرف للطرف، المصادقة الثنائية، وسجل تدقيق كامل لكل عملية. نسخ احتياطية كل ساعة.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٥. حقوقك</h2>
              <p style={pStyle}>يحق لك الوصول لبياناتك، تصحيحها، حذفها، أو طلب نقلها في أي وقت. لممارسة هذه الحقوق، تواصل معنا عبر privacy@matin.ink.</p>
            </div>
            <div style={sectionStyle}>
              <h2 style={h2Style}>٦. التواصل</h2>
              <p style={pStyle}>لأي استفسار حول سياسة الخصوصية، تواصل معنا على: privacy@matin.ink أو من خلال صفحة <Link href="/contact" style={{ color: '#C9A84C' }}>تواصل معنا</Link>.</p>
            </div>
          </div>
        </div>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)' }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/terms" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>الشروط والأحكام</Link>
            <Link href="/contact" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>تواصل معنا</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
