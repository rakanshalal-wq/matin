import Link from 'next/link';

export default function SchedulePage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }} dir="rtl">
        
        <nav style={{ position: 'sticky', top: 0, background: 'rgba(13, 27, 42, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201, 162, 39, 0.2)', zIndex: 1000, padding: '16px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#0D1B2A', boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)' }}>م</div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#C9A227' }}>متين</span>
            </Link>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <Link href="/community" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>المجتمع</Link>
              <Link href="/store" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>المتجر</Link>
              <Link href="/pricing" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>الأسعار</Link>
              <Link href="/contact" style={{ color: 'white', textDecoration: 'none', fontSize: 15, fontWeight: 500 }}>تواصل معنا</Link>
              <Link href="/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 8, color: '#0D1B2A', textDecoration: 'none', fontSize: 15, fontWeight: 700, boxShadow: '0 4px 12px rgba(201, 162, 39, 0.4)' }}>تسجيل الدخول</Link>
            </div>
          </div>
        </nav>

        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: 80, marginBottom: 24 }}>📅</div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: 'white', marginBottom: 20 }}>
              الجداول <span style={{ color: '#C9A227' }}>الدراسية</span>
            </h1>
            <p style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 40 }}>
              نظام ذكي لإنشاء وإدارة الجداول الدراسية مع توزيع أوتوماتيكي متوازن
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              {[
                { icon: '🤖', title: 'توزيع ذكي', desc: 'توزيع تلقائي للحصص يراعي توازن الجدول وتوفر المعلمين' },
                { icon: '📊', title: 'جداول متعددة', desc: 'إنشاء جداول للطلاب، المعلمين، الفصول، والمختبرات' },
                { icon: '⚡', title: 'تعديل سريع', desc: 'تعديل الجداول بسهولة مع اكتشاف التعارضات تلقائياً' },
                { icon: '📱', title: 'وصول سهل', desc: 'عرض الجدول على الجوال والكمبيوتر مع إمكانية الطباعة' },
                { icon: '🔔', title: 'تنبيهات الحصص', desc: 'تذكيرات تلقائية قبل بداية كل حصة' },
                { icon: '🔄', title: 'جداول بديلة', desc: 'إنشاء جداول بديلة لحالات الطوارئ والإجازات' },
                { icon: '📈', title: 'إحصائيات الجداول', desc: 'تحليل توزيع المواد والحصص والعبء التدريسي' },
                { icon: '🎯', title: 'التزامن التام', desc: 'تحديث فوري لجميع الجداول عند أي تعديل' }
              ].map((f, i) => (
                <div key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 24px', background: 'rgba(201, 162, 39, 0.05)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 40, textAlign: 'center' }}>
              كيف <span style={{ color: '#C9A227' }}>يعمل النظام؟</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32 }}>
              {[
                { num: '1', title: 'إدخال البيانات', desc: 'المواد، المعلمين، الفصول' },
                { num: '2', title: 'التوزيع الذكي', desc: 'النظام يوزع الحصص تلقائياً' },
                { num: '3', title: 'المراجعة', desc: 'مراجعة وتعديل الجدول' },
                { num: '4', title: 'النشر', desc: 'نشر الجداول للجميع' }
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: '#0D1B2A', margin: '0 auto 20px' }}>{s.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 40, textAlign: 'center' }}>
              الفوائد <span style={{ color: '#C9A227' }}>الرئيسية</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              {[
                '✅ توفير ساعات من العمل اليدوي',
                '✅ جداول متوازنة وعادلة',
                '✅ تجنب التعارضات',
                '✅ مرونة في التعديل',
                '✅ وصول سهل للجميع',
                '✅ تنظيم محكم للحصص'
              ].map((b, i) => (
                <div key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 24, fontSize: 18, fontWeight: 600, color: 'white' }}>{b}</div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 24px', background: 'rgba(201, 162, 39, 0.05)', textAlign: 'center' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: 'white', marginBottom: 20 }}>
              جاهز <span style={{ color: '#C9A227' }}>للبدء؟</span>
            </h2>
            <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 32 }}>
              ابدأ تجربتك المجانية الآن واكتشف كيف يمكن لمتين تبسيط إدارة الجداول الدراسية
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', border: 'none', borderRadius: 12, color: '#0D1B2A', textDecoration: 'none', fontSize: 18, fontWeight: 800 }}>
                🚀 ابدأ مجاناً
              </Link>
              <Link href="/contact" style={{ display: 'inline-block', padding: '16px 40px', background: 'transparent', border: '2px solid #C9A227', borderRadius: 12, color: '#C9A227', textDecoration: 'none', fontSize: 18, fontWeight: 700 }}>
                📞 تواصل معنا
              </Link>
            </div>
          </div>
        </section>

        <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(201, 162, 39, 0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2026 متين - جميع الحقوق محفوظة | صنع بـ ❤️ في السعودية 🇸🇦
          </p>
        </footer>

      </div>
    </>
  );
}
