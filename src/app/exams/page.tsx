'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function ExamsPage() {
  return (
    <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        :root { --gold: #C9A84C; --gold-2: #E8C96D; --dark: #06060E; --border: rgba(201,168,76,0.15); --text: #EEEEF5; --text-2: rgba(238,238,245,0.6); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(6,6,14,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 34px; height: 34px; background: var(--gold); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: #060C18; }
        .nav-logo-text { font-size: 18px; font-weight: 800; color: var(--text); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .btn-ghost { padding: 8px 20px; border-radius: 9px; background: transparent; border: 1px solid var(--border); color: var(--text-2); font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
        .btn-primary { padding: 8px 20px; border-radius: 9px; background: var(--gold); color: #000; font-size: 13.5px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .hero { position: relative; padding: 140px 40px 80px; text-align: center; overflow: hidden; }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2); color: #F59E0B; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #F59E0B; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .hero h1 { font-size: clamp(36px, 5vw, 64px); font-weight: 900; line-height: 1.15; position: relative; z-index: 1; }
        .hero h1 .gold { display: block; background: linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 40%, #F5D78E 70%, var(--gold-2) 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        .hero p { font-size: 18px; color: var(--text-2); max-width: 600px; margin: 24px auto 0; position: relative; z-index: 1; line-height: 1.7; }
        .section { padding: 80px 40px; max-width: 1280px; margin: 0 auto; }
        .section-label { font-size: 12px; font-weight: 700; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 16px; }
        .section-title { font-size: clamp(28px, 3.5vw, 42px); font-weight: 900; margin-bottom: 16px; }
        .section-desc { font-size: 16px; color: var(--text-2); max-width: 600px; line-height: 1.7; margin-bottom: 48px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
        .feature-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 16px; padding: 32px; transition: all 0.3s; }
        .feature-card:hover { border-color: var(--gold); background: rgba(201,168,76,0.05); transform: translateY(-4px); }
        .feature-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 20px; }
        .feature-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; }
        .feature-desc { font-size: 14px; color: var(--text-2); line-height: 1.7; }
        .security-box { background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.25); border-radius: 20px; padding: 48px; margin: 48px 0; }
        .security-box h3 { font-size: 24px; font-weight: 800; color: #F59E0B; margin-bottom: 16px; }
        .security-box p { font-size: 15px; color: var(--text-2); line-height: 1.8; }
        .stages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 32px; }
        .stage-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; padding: 20px; text-align: center; }
        .stage-num { font-size: 28px; font-weight: 900; color: var(--gold); margin-bottom: 8px; }
        .stage-title { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
        .stage-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; }
        .divider { height: 1px; background: var(--border); margin: 0 40px; }
        .cta-section { padding: 80px 40px; text-align: center; }
        .cta-box { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2); border-radius: 24px; padding: 64px 40px; max-width: 700px; margin: 0 auto; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: var(--gold); color: #000; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s; margin-top: 32px; }
        .btn-hero:hover { background: var(--gold-2); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(201,168,76,0.3); }
        .footer { padding: 40px; border-top: 1px solid var(--border); text-align: center; color: var(--text-2); font-size: 13px; }
      `}</style>

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-mark">م</div>
          <span className="nav-logo-text">متين</span>
        </Link>
        <div className="nav-links">
          <Link href="/features" className="btn-ghost">المميزات</Link>
          <Link href="/pricing" className="btn-ghost">الأسعار</Link>
          <Link href="/login" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/register" className="btn-primary">ابدأ مجاناً</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            الاختبارات الإلكترونية
          </div>
          <h1>
            اختبارات آمنة وذكية
            <span className="gold">بـ 8 طبقات حماية</span>
          </h1>
          <p>نظام اختبارات إلكتروني متكامل — من بنك الأسئلة إلى التصحيح التلقائي، مع أقوى نظام لمنع الغش في السوق السعودي.</p>
        </div>
      </section>

      <div className="divider"></div>

      {/* 8 مراحل الأمان */}
      <section className="section">
        <div className="section-label">الأمان والنزاهة</div>
        <div className="section-title">8 طبقات لمنع الغش</div>
        <div className="section-desc">نظام أمان متعدد الطبقات يضمن نزاهة الاختبارات ويمنع أي محاولة للغش.</div>

        <div className="security-box">
          <h3>🔒 نظام الأمان الشامل — AES-256</h3>
          <p>
            جميع بيانات الاختبارات مشفرة بـ AES-256. الأسئلة لا تُرسل للمتصفح إلا عند بدء الاختبار الفعلي. كل اختبار يُولّد نسخة عشوائية مختلفة لكل طالب من نفس بنك الأسئلة. النظام يرصد محاولات الخروج من الصفحة، التبديل بين التطبيقات، والنسخ واللصق.
          </p>
        </div>

        <div className="stages-grid">
          {[
            { num: '١', title: 'تشفير AES-256', desc: 'تشفير كامل لجميع بيانات الاختبار' },
            { num: '٢', title: 'أسئلة عشوائية', desc: 'ترتيب مختلف لكل طالب من نفس البنك' },
            { num: '٣', title: 'منع الخروج', desc: 'رصد محاولات الخروج من صفحة الاختبار' },
            { num: '٤', title: 'منع النسخ', desc: 'تعطيل النسخ واللصق والطباعة' },
            { num: '٥', title: 'رصد التبديل', desc: 'تنبيه عند التبديل بين التطبيقات' },
            { num: '٦', title: 'كاميرا المراقبة', desc: 'مراقبة بصرية اختيارية عبر الكاميرا' },
            { num: '٧', title: 'توقيت دقيق', desc: 'عداد زمني دقيق لكل سؤال وللاختبار كله' },
            { num: '٨', title: 'سجل النشاط', desc: 'تسجيل كامل لكل تصرف أثناء الاختبار' },
          ].map((s, i) => (
            <div key={i} className="stage-card">
              <div className="stage-num">{s.num}</div>
              <div className="stage-title">{s.title}</div>
              <div className="stage-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <section className="section">
        <div className="section-label">المميزات الكاملة</div>
        <div className="section-title">نظام اختبارات متكامل</div>
        <div className="section-desc">كل ما تحتاجه لإجراء اختبارات إلكترونية احترافية وموثوقة.</div>

        <div className="features-grid">
          {[
            { icon: '📚', title: 'بنك أسئلة ضخم', desc: 'مكتبة أسئلة مصنفة حسب المادة، المستوى، ونوع السؤال — اختيار متعدد، صح/خطأ، مقالي، ملء الفراغ.', color: 'rgba(245,158,11,0.12)' },
            { icon: '🤖', title: 'توليد أسئلة بالذكاء الاصطناعي', desc: 'AI يولد أسئلة اختبار تلقائياً من المنهج الدراسي مع ضبط مستوى الصعوبة.', color: 'rgba(245,158,11,0.12)' },
            { icon: '⚡', title: 'تصحيح تلقائي فوري', desc: 'النتيجة تظهر للطالب فور الانتهاء من الاختبار — لا انتظار، لا جهد يدوي للمعلم.', color: 'rgba(201,168,76,0.12)' },
            { icon: '📊', title: 'تحليلات الأداء', desc: 'تقارير تفصيلية عن أداء كل طالب — نقاط القوة والضعف، مقارنة بالصف، وتوصيات للتحسين.', color: 'rgba(201,168,76,0.12)' },
            { icon: '📅', title: 'جدولة الاختبارات', desc: 'جدولة الاختبارات مسبقاً مع إشعارات تلقائية للطلاب وأولياء الأمور.', color: 'rgba(201,168,76,0.12)' },
            { icon: '🔄', title: 'إعادة الاختبار', desc: 'إمكانية إعادة الاختبار للطلاب المتغيبين أو الراسبين مع نسخة مختلفة من الأسئلة.', color: 'rgba(201,168,76,0.12)' },
            { icon: '📱', title: 'متوافق مع الجوال', desc: 'الطالب يؤدي الاختبار من أي جهاز — حاسوب، تابلت، أو جوال — بنفس الجودة والأمان.', color: 'rgba(201,168,76,0.12)' },
            { icon: '🏆', title: 'كشوف النتائج', desc: 'إصدار كشوف نتائج رسمية إلكترونية مع إمكانية الطباعة وإرسالها لأولياء الأمور.', color: 'rgba(201,168,76,0.12)' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      <section className="cta-section">
        <div className="cta-box">
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '16px' }}>ابدأ الآن</div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>اختبارات نزيهة وذكية</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7 }}>انضم للمؤسسات التي تثق بمتين لإجراء اختباراتها الإلكترونية بأعلى معايير الأمان والنزاهة.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
