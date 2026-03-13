'use client';
import Link from 'next/link';
import { useState } from 'react';

const FAQS = [
  { q: 'هل متين مناسب لمدرستي الصغيرة؟', a: 'نعم. متين مصمم لخدمة جميع أحجام المؤسسات التعليمية — من رياض الأطفال الصغيرة حتى الجامعات الكبيرة. الباقة الأساسية تبدأ من 299 ر.س/شهر وتدعم حتى 200 طالب.' },
  { q: 'هل بياناتنا آمنة؟', a: 'بالتأكيد. متين منصة سيادية سعودية 100%. بياناتك تُخزَّن داخل المملكة العربية السعودية على خوادم مشفرة، مع 8 طبقات أمان وسجل تدقيق كامل لكل عملية.' },
  { q: 'كم يستغرق التفعيل والإعداد؟', a: 'يمكن تفعيل المنصة وإعدادها الأساسي خلال يوم واحد. فريق الدعم يساعدك في الإعداد الكامل ونقل البيانات خلال أسبوع.' },
  { q: 'هل يتكامل متين مع نفاذ ونور؟', a: 'نعم. متين يتكامل مع منصة نفاذ للتحقق من هويات المستخدمين، ومنصة نور لاستيراد بيانات الطلاب والتحقق منها مباشرة.' },
  { q: 'ما طرق الدفع المتاحة؟', a: 'ندعم مدى، Visa، Mastercard، Apple Pay، STC Pay، وTabby للتقسيط. جميع المدفوعات تمر عبر بوابة Moyasar الآمنة.' },
  { q: 'هل يوجد تطبيق جوال؟', a: 'نعم. متين متاح على iOS وAndroid لجميع أنواع المستخدمين: المدير، المعلم، الطالب، وولي الأمر — كل منهم يرى ما يخصه فقط.' },
  { q: 'ما الفرق بين الباقات؟', a: 'الباقة الأساسية (299 ر.س) للمؤسسات الصغيرة حتى 200 طالب. الاحترافية (699 ر.س) حتى 1000 طالب مع ميزات AI. المؤسسية بدون حدود مع دعم مخصص.' },
  { q: 'هل يمكن تجربة المنصة قبل الاشتراك؟', a: 'نعم. نقدم 14 يوماً تجريبية مجانية بكامل المميزات دون الحاجة لبطاقة ائتمانية. يمكنك البدء الآن من صفحة التسجيل.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };

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
            <Link href="/faq" style={{ ...navLinkStyle, color: '#C9A84C' }}>الأسئلة الشائعة</Link>
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>تسجيل الدخول</Link>
            <Link href="/register" style={{ padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
          </div>
        </nav>

        <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>الأسئلة الشائعة</div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            كل ما تريد{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>معرفته</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.8 }}>إجابات على أكثر الأسئلة شيوعاً حول منصة متين.</p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <section style={{ padding: '60px 24px', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#0B0B16', border: `1px solid ${open === i ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, overflow: 'hidden' }}>
                <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'transparent', border: 'none', color: '#EEEEF5', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", textAlign: 'right', gap: 16 }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#C9A84C', fontSize: 20, flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {open === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: 14, color: 'rgba(238,238,245,0.65)', lineHeight: 1.8 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '60px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'rgba(238,238,245,0.65)', marginBottom: 20 }}>لم تجد إجابتك؟</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#C9A84C', color: '#000', padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>تواصل مع فريق الدعم</Link>
        </section>

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
