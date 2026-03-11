import Link from 'next/link';

export default function ExamsPage() {
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
            <div style={{ fontSize: 80, marginBottom: 24 }}>📝</div>
            <h1 style={{ fontSize: 56, fontWeight: 900, color: 'white', marginBottom: 20 }}>
              الاختبارات <span style={{ color: '#C9A227' }}>والدرجات</span>
            </h1>
            <p style={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 40 }}>
              نظام متكامل لإدارة الاختبارات والدرجات مع التصحيح الآلي والتقارير التفصيلية
            </p>
          </div>
        </section>

        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
              {[
                { icon: '📋', title: 'بنك الأسئلة', desc: 'مكتبة ضخمة من الأسئلة المصنفة حسب المادة والموضوع والصعوبة' },
                { icon: '🎯', title: 'إنشاء اختبارات', desc: 'إنشاء اختبارات إلكترونية بأنواع أسئلة متعددة: اختيار متعدد، صح وخطأ، مقالي' },
                { icon: '⚡', title: 'تصحيح تلقائي', desc: 'تصحيح فوري للأسئلة الموضوعية مع إظهار النتيجة مباشرة' },
                { icon: '📊', title: 'دفتر الدرجات', desc: 'دفتر درجات إلكتروني شامل مع حساب المعدلات والتقديرات' },
                { icon: '📈', title: 'تحليل الأداء', desc: 'تحليل إحصائي لأداء الطلاب ونقاط القوة والضعف' },
                { icon: '🔔', title: 'إشعارات النتائج', desc: 'إشعارات فورية للطلاب والأهالي عند نشر النتائج' },
                { icon: '📄', title: 'كشوف الدرجات', desc: 'طباعة كشوف الدرجات والشهادات بتصاميم احترافية' },
                { icon: '🔐', title: 'أمان البيانات', desc: 'حماية كاملة لبيانات الاختبارات والدرجات' }
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
                { num: '1', title: 'إعداد الاختبار', desc: 'المعلم ينشئ الاختبار' },
                { num: '2', title: 'أداء الاختبار', desc: 'الطلاب يؤدون الاختبار' },
                { num: '3', title: 'التصحيح', desc: 'تصحيح تلقائي أو يدوي' },
                { num: '4', title: 'النتائج', desc: 'نشر النتائج والتحليل' }
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
                '✅ توفير وقت التصحيح',
                '✅ دقة عالية في الدرجات',
                '✅ تحليل شامل للأداء',
                '✅ شفافية كاملة للأهالي',
                '✅ تقليل الأخطاء البشرية',
                '✅ أرشفة آمنة للاختبارات'
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
              ابدأ تجربتك المجانية الآن واكتشف كيف يمكن لمتين تطوير نظام الاختبارات والدرجات
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
