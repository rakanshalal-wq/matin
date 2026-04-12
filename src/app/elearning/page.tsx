'use client';
import Link from 'next/link';
export default function ElearningPage() {
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
        .hero-glow { position:absolute; top:-200px; left:50%; transform:translateX(-50%); width:1100px; height:700px; background:radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events:none; z-index:0; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); color:#10B981; padding:6px 16px; border-radius:100px; font-size:12.5px; font-weight:600; margin-bottom:40px; }
        .badge-dot { width:7px; height:7px; border-radius:50%; background:#10B981; animation:pulse 2s infinite; }
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
          <div className="hero-badge"><span className="badge-dot"></span>التعليم الإلكتروني</div>
          <h1>تعليم إلكتروني متكامل<span className="gold">بتقنية الذكاء الاصطناعي</span></h1>
          <p>منصة تعليم إلكتروني مدمجة — محتوى تفاعلي، فصول افتراضية، مسارات تعلم شخصية، وتقييم مستمر.</p>
        </div>
      </section>
      <div className="divider"></div>
      <section className="section">
        <div className="section-label">المميزات الكاملة</div>
        <div className="section-title">بيئة تعلم رقمية شاملة</div>
        <div className="section-desc">كل أدوات التعليم الإلكتروني في منصة واحدة متكاملة مع نظام إدارة المدرسة.</div>
        <div className="features-grid">
          {[
            { icon: '🎥', title: 'فصول افتراضية مباشرة', desc: 'بث مباشر للدروس مع تسجيل تلقائي — الطالب الغائب يشاهد الدرس لاحقاً بنفس الجودة.', color: 'rgba(16,185,129,0.12)' },
            { icon: '📹', title: 'مكتبة الفيديوهات', desc: 'رفع وتنظيم الفيديوهات التعليمية حسب المادة والوحدة — متاحة للطلاب في أي وقت.', color: 'rgba(16,185,129,0.12)' },
            { icon: '📝', title: 'الواجبات الإلكترونية', desc: 'تسليم الواجبات رقمياً — الطالب يرفع الحل، المعلم يصحح ويرسل الملاحظات مباشرة.', color: 'rgba(201,168,76,0.12)' },
            { icon: '🤖', title: 'مسارات تعلم بالذكاء الاصطناعي', desc: 'AI يحلل أداء كل طالب ويقترح محتوى مخصصاً لتعزيز نقاط الضعف وتطوير نقاط القوة.', color: 'rgba(201,168,76,0.12)' },
            { icon: '💬', title: 'منتدى الفصل', desc: 'منتدى نقاش لكل فصل — الطلاب يطرحون الأسئلة، المعلم يجيب، والجميع يستفيد.', color: 'rgba(201,168,76,0.12)' },
            { icon: '🏅', title: 'نظام الإنجازات', desc: 'شارات وإنجازات رقمية تحفز الطلاب على الإنجاز والمشاركة الفعالة في التعلم.', color: 'rgba(201,168,76,0.12)' },
            { icon: '📊', title: 'تحليلات التعلم', desc: 'تقارير تفصيلية عن تقدم كل طالب — وقت الدراسة، المحتوى المشاهد، ومعدل الإنجاز.', color: 'rgba(201,168,76,0.12)' },
            { icon: '📱', title: 'متوافق مع الجوال', desc: 'تجربة تعلم سلسة من أي جهاز — جوال، تابلت، أو حاسوب — بدون أي فقدان للمحتوى.', color: 'rgba(201,168,76,0.12)' },
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
          <h2 style={{ fontSize:'32px', fontWeight:900, marginBottom:'16px' }}>حوّل فصلك إلى بيئة تعلم ذكية</h2>
          <p style={{ fontSize:'15px', color:'var(--text-2)', lineHeight:1.7 }}>التعليم الإلكتروني في متين ليس إضافة — هو جزء أصيل من منظومة إدارة المؤسسة التعليمية.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>
      <footer className="footer"><p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p></footer>
    </div>
  );
}
