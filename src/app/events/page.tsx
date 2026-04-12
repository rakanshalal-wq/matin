'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';
export default function EventsPage() {
  return (
    <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        :root { --gold: #C9A84C; --gold-2: #E8C96D; --border: rgba(201,168,76,0.15); --text: #EEEEF5; --text-2: rgba(238,238,245,0.6); }
        * { margin:0; padding:0; box-sizing:border-box; }
        .nav { position:fixed; top:0; left:0; right:0; z-index:100; background:rgba(6,6,14,0.85); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); padding:0 40px; height:64px; display:flex; align-items:center; justify-content:space-between; }
        .nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .nav-logo-mark { width:34px; height:34px; background:var(--gold); border-radius:9px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px; color:#060C18; }
        .nav-logo-text { font-size:18px; font-weight:800; color:var(--text); }
        .nav-links { display:flex; align-items:center; gap:8px; }
        .btn-ghost { padding:8px 20px; border-radius:9px; background:transparent; border:1px solid var(--border); color:var(--text-2); font-size:13.5px; font-weight:500; text-decoration:none; }
        .btn-primary { padding:8px 20px; border-radius:9px; background:var(--gold); color:#000; font-size:13.5px; font-weight:700; text-decoration:none; }
        .hero { position:relative; padding:140px 40px 80px; text-align:center; overflow:hidden; }
        .hero-grid { position:absolute; inset:0; z-index:0; background-image:linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px); background-size:80px 80px; mask-image:radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
        .hero-glow { position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:1100px; height:700px; background:radial-gradient(ellipse, rgba(251,146,60,0.12) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events:none; z-index:0; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(251,146,60,0.08); border:1px solid rgba(251,146,60,0.2); color:#FB923C; padding:6px 16px; border-radius:100px; font-size:12.5px; font-weight:600; margin-bottom:40px; }
        .badge-dot { width:7px; height:7px; border-radius:50%; background:#FB923C; animation:pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .hero h1 { font-size:clamp(36px,5vw,64px); font-weight:900; line-height:1.15; position:relative; z-index:1; }
        .hero h1 .gold { display:block; background:linear-gradient(90deg, var(--gold) 0%, var(--gold-2) 40%, #F5D78E 70%, var(--gold-2) 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        .hero p { font-size:18px; color:var(--text-2); max-width:600px; margin:24px auto 0; position:relative; z-index:1; line-height:1.7; }
        .section { padding:80px 40px; max-width:1280px; margin:0 auto; }
        .section-label { font-size:12px; font-weight:700; letter-spacing:2px; color:var(--gold); text-transform:uppercase; margin-bottom:16px; }
        .section-title { font-size:clamp(28px,3.5vw,42px); font-weight:900; margin-bottom:16px; }
        .section-desc { font-size:16px; color:var(--text-2); max-width:600px; line-height:1.7; margin-bottom:48px; }
        .features-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px; }
        .feature-card { background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:16px; padding:32px; transition:all 0.3s; }
        .feature-card:hover { border-color:var(--gold); background:rgba(201,168,76,0.05); transform:translateY(-4px); }
        .feature-icon { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:20px; }
        .feature-title { font-size:17px; font-weight:700; margin-bottom:10px; }
        .feature-desc { font-size:14px; color:var(--text-2); line-height:1.7; }
        .divider { height:1px; background:var(--border); margin:0 40px; }
        .cta-section { padding:80px 40px; text-align:center; }
        .cta-box { background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.2); border-radius:24px; padding:64px 40px; max-width:700px; margin:0 auto; }
        .btn-hero { display:inline-flex; align-items:center; gap:10px; background:var(--gold); color:#000; padding:15px 32px; border-radius:12px; font-size:15px; font-weight:700; text-decoration:none; margin-top:32px; }
        .footer { padding:40px; border-top:1px solid var(--border); text-align:center; color:var(--text-2); font-size:13px; }
      `}</style>
      <nav className="nav">
        <Link href="/" className="nav-logo"><div className="nav-logo-mark">م</div><span className="nav-logo-text">متين</span></Link>
        <div className="nav-links">
          <Link href="/features" className="btn-ghost">المميزات</Link>
          <Link href="/pricing" className="btn-ghost">الأسعار</Link>
          <Link href="/login" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/register" className="btn-primary">ابدأ مجاناً</Link>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-grid"></div><div className="hero-glow"></div>
        <div style={{ position:'relative', zIndex:1 }}>
          <div className="hero-badge"><span className="badge-dot"></span>الفعاليات والأنشطة</div>
          <h1>إدارة فعاليات المدرسة<span className="gold">بكل احترافية</span></h1>
          <p>نظام إدارة الفعاليات والأنشطة المدرسية — تخطيط، تسجيل، إشعارات، وتقارير في منصة واحدة.</p>
        </div>
      </section>
      <div className="divider"></div>
      <section className="section">
        <div className="section-label">المميزات الكاملة</div>
        <div className="section-title">فعاليات منظمة واحترافية</div>
        <div className="section-desc">من الحفلات المدرسية إلى الرحلات الميدانية — كل شيء مُدار بدقة واحترافية.</div>
        <div className="features-grid">
          {[
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg>, title: 'تقويم الفعاليات', desc: 'تقويم مرئي لجميع فعاليات المدرسة — المعلمون وأولياء الأمور يرون الجدول كاملاً.', color: 'rgba(251,146,60,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, title: 'تسجيل المشاركين', desc: 'تسجيل الطلاب في الفعاليات إلكترونياً مع تأكيد الحضور وإدارة الأعداد.', color: 'rgba(251,146,60,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: 'إشعارات الفعاليات', desc: 'إشعارات واتساب تلقائية لأولياء الأمور عند إضافة فعالية أو قبل موعدها.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-3h4l2 3h3a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, title: 'ألبوم الفعاليات', desc: 'رفع صور وفيديوهات الفعاليات في ألبوم مشترك يراه أولياء الأمور والطلاب.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: 'رسوم الفعاليات', desc: 'تحصيل رسوم الرحلات والفعاليات إلكترونياً عبر بوابات الدفع المتكاملة.', color: 'rgba(201,168,76,0.12)' },
            { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, title: 'تقارير المشاركة', desc: 'إحصائيات مشاركة الطلاب في الفعاليات والأنشطة المدرسية.', color: 'rgba(201,168,76,0.12)' },
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
          <div style={{ fontSize:'12px', fontWeight:700, letterSpacing:'2px', color:'var(--gold)', textTransform:'uppercase', marginBottom:'16px' }}>ابدأ الآن</div>
          <h2 style={{ fontSize:'32px', fontWeight:900, marginBottom:'16px' }}>فعاليات تُبهج الطلاب وتُطمئن الأهل</h2>
          <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.7 }}>متين يجعل تنظيم الفعاليات المدرسية تجربة سلسة ومبهجة للجميع.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>
      <footer className="footer"><p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p></footer>
    </div>
  );
}
