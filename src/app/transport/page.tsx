'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function TransportPage() {
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
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(244,63,94,0.1) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2); color: #F43F5E; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #F43F5E; animation: pulse 2s infinite; }
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
        .highlight-box { background: rgba(244,63,94,0.06); border: 1px solid rgba(244,63,94,0.2); border-radius: 20px; padding: 48px; margin: 48px 0; }
        .highlight-box h3 { font-size: 24px; font-weight: 800; color: #F43F5E; margin-bottom: 16px; }
        .highlight-box p { font-size: 15px; color: var(--text-2); line-height: 1.8; }
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
            النقل المدرسي
          </div>
          <h1>
            تتبع حافلاتك
            <span className="gold">وأطمئن أولياء الأمور</span>
          </h1>
          <p>نظام GPS متكامل لإدارة النقل المدرسي — تتبع مباشر للحافلات، إشعارات وصول فورية، وتطبيق مخصص للسائق.</p>
        </div>
      </section>

      <div className="divider"></div>

      <section className="section">
        <div className="section-label">التتبع الذكي</div>
        <div className="section-title">GPS مباشر لكل حافلة</div>
        <div className="section-desc">ولي الأمر يعرف أين ابنه في كل لحظة — من مغادرة المنزل حتى الوصول للمدرسة والعودة.</div>

        <div className="highlight-box">
          <h3><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg> تطبيق السائق — تجربة فريدة</h3>
          <p>
            السائق يستخدم تطبيق متين المخصص — يفتح الرحلة، يسجل صعود كل طالب بمسح QR أو النقر على اسمه، ويُرسل إشعاراً فورياً لولي الأمر عند الصعود والنزول. في حالة الطوارئ، زر SOS يُنبّه الإدارة والأهل فوراً مع الموقع الدقيق.
          </p>
        </div>

        <div className="features-grid">
          {[
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg>, title: 'تتبع GPS مباشر', desc: 'موقع الحافلة على الخريطة في الوقت الفعلي — ولي الأمر يتابع من تطبيقه بدون أي تأخير.', color: 'rgba(244,63,94,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: 'إشعارات الوصول الفورية', desc: 'إشعار واتساب فوري لولي الأمر عند صعود ابنه للحافلة وعند وصوله للمدرسة أو المنزل.', color: 'rgba(244,63,94,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4"/></svg>, title: 'تطبيق السائق', desc: 'تطبيق مخصص للسائق لإدارة الرحلة، تسجيل الطلاب، وإرسال التحديثات تلقائياً.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'إدارة الخطوط والمحطات', desc: 'رسم خطوط السير والمحطات على الخريطة مع تحسين المسارات لتقليل وقت الرحلة.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/></svg>, title: 'ملفات السائقين والمشرفات', desc: 'بيانات كاملة للسائقين والمشرفات — رخصة القيادة، بيانات الاتصال، وسجل الرحلات.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: 'زر الطوارئ SOS', desc: 'السائق يضغط SOS في الطوارئ — إشعار فوري للإدارة وأولياء الأمور مع الموقع الدقيق.', color: 'rgba(239,68,68,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg>, title: 'تقارير الالتزام بالمواعيد', desc: 'تقارير يومية عن دقة مواعيد الوصول والمغادرة لكل حافلة وكل سائق.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>, title: 'صيانة الحافلات', desc: 'جدول صيانة دورية للحافلات مع تنبيهات عند اقتراب موعد الصيانة أو انتهاء الفحص الدوري.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, title: 'تقارير النقل الشاملة', desc: 'إحصائيات كاملة عن عمليات النقل — عدد الطلاب، المسافات، التكاليف، والكفاءة التشغيلية.', color: 'rgba(201,168,76,0.12)' },
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
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>أطمئن أولياء الأمور على أبنائهم</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7 }}>نظام النقل في متين يحول القلق على الأبناء إلى طمأنينة تامة مع تتبع GPS مباشر وإشعارات فورية.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
