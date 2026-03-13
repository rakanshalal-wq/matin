'use client';
import Link from 'next/link';
import { useState } from 'react';

/* ═══════════════════════════════════════════════════════
   صفحة تواصل معنا — وفق الدستور السيادي 3.0
   الهوية: #06060E خلفية، #C9A84C ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════ */

const CHANNELS = [
  { icon: '📧', title: 'البريد الإلكتروني', value: 'support@matin.ink', sub: 'نرد خلال 24 ساعة' },
  { icon: '💬', title: 'واتساب', value: '+966 50 000 0000', sub: 'دعم فني مباشر' },
  { icon: '📍', title: 'الموقع', value: 'الرياض، المملكة العربية السعودية', sub: 'المقر الرئيسي' },
  { icon: '⏰', title: 'ساعات العمل', value: 'الأحد — الخميس', sub: '8 صباحاً — 6 مساءً' },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', institution: '', message: '' });

  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };
  const inputStyle: React.CSSProperties = { width: '100%', background: '#0B0B16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 16px', color: '#EEEEF5', fontSize: 14, fontFamily: "'IBM Plex Sans Arabic', sans-serif", outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'rgba(238,238,245,0.65)', marginBottom: 8, display: 'block' };

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
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={{ ...navLinkStyle, color: '#C9A84C' }}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>تسجيل الدخول</Link>
            <Link href="/register" style={{ padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse,rgba(201,168,76,0.08) 0%,transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>تواصل معنا</div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            نسعد{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>بتواصلكم</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(238,238,245,0.65)', maxWidth: 600, margin: '20px auto 0', lineHeight: 1.8 }}>
            فريقنا جاهز للإجابة على استفساراتكم وتقديم العروض التوضيحية لمؤسستكم.
          </p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* CONTENT */}
        <section style={{ padding: '60px 24px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start' }}>

          {/* CHANNELS */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#EEEEF5', marginBottom: 24 }}>قنوات التواصل</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CHANNELS.map((ch) => (
                <div key={ch.title} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{ch.icon}</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)', marginBottom: 2 }}>{ch.title}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#EEEEF5' }}>{ch.value}</div>
                    <div style={{ fontSize: 12, color: '#C9A84C', marginTop: 2 }}>{ch.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM */}
          <div style={{ background: '#0B0B16', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 20, padding: 32 }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#C9A84C', marginBottom: 12 }}>تم الإرسال بنجاح!</h3>
                <p style={{ fontSize: 15, color: 'rgba(238,238,245,0.65)', lineHeight: 1.8 }}>سيتواصل معكم فريقنا خلال 24 ساعة.</p>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#EEEEF5', marginBottom: 24 }}>أرسل رسالتك</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>الاسم الكامل</label>
                    <input type="text" placeholder="اسمك الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>البريد الإلكتروني</label>
                    <input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>اسم المؤسسة</label>
                    <input type="text" placeholder="اسم مدرستك أو مؤسستك" value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>الرسالة</label>
                    <textarea placeholder="اكتب رسالتك هنا..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <button onClick={() => setSent(true)} style={{ width: '100%', background: '#C9A84C', color: '#000', border: 'none', borderRadius: 10, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                    إرسال الرسالة
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)' }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>الشروط والأحكام</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
