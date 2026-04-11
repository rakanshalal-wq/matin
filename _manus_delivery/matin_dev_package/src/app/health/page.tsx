'use client';
export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function HealthPage() {
  return (
    <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        :root { --gold: #C9A84C; --gold-2: #E8C96D; --dark: #06060E; --dark-2: #0B0B16; --dark-3: #10101E; --border: rgba(201,168,76,0.15); --text: #EEEEF5; --text-2: rgba(238,238,245,0.6); }
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
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(52,211,153,0.12) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); color: #34D399; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #34D399; animation: pulse 2s infinite; }
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
        .ai-box { background: linear-gradient(135deg, rgba(139,92,246,0.08), rgba(201,168,76,0.06)); border: 1px solid rgba(139,92,246,0.25); border-radius: 20px; padding: 48px; margin: 48px 0; }
        .ai-box h3 { font-size: 24px; font-weight: 800; color: #A78BFA; margin-bottom: 16px; }
        .ai-box p { font-size: 15px; color: var(--text-2); line-height: 1.8; }
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
            الصحة المدرسية
          </div>
          <h1>
            رعاية صحية شاملة
            <span className="gold">لكل طالب في مؤسستك</span>
          </h1>
          <p>نظام متكامل للصحة المدرسية — ملفات صحية رقمية، تتبع التطعيمات، إدارة الحالات الطارئة، والصحة النفسية بالذكاء الاصطناعي.</p>
        </div>
      </section>

      <div className="divider"></div>

      <section className="section">
        <div className="section-label">الصحة الجسدية</div>
        <div className="section-title">الملف الصحي الرقمي الكامل</div>
        <div className="section-desc">كل طالب لديه ملف صحي رقمي شامل يرافقه طوال مسيرته التعليمية.</div>

        <div className="features-grid">
          {[
            { icon: '📋', title: 'الملف الصحي الشامل', desc: 'بيانات صحية كاملة لكل طالب — فصيلة الدم، الأمراض المزمنة، الأدوية الدائمة، الحساسيات، والتاريخ الطبي.', color: 'rgba(52,211,153,0.12)' },
            { icon: '💉', title: 'جدول التطعيمات', desc: 'تتبع جدول تطعيمات كل طالب مع تنبيهات تلقائية لولي الأمر قبل موعد الجرعة القادمة.', color: 'rgba(52,211,153,0.12)' },
            { icon: '🏥', title: 'سجل زيارات العيادة', desc: 'توثيق كل زيارة للعيادة المدرسية — الشكوى، التشخيص، العلاج، وإشعار ولي الأمر فوراً.', color: 'rgba(52,211,153,0.12)' },
            { icon: '🚨', title: 'إدارة الطوارئ', desc: 'بروتوكول طوارئ واضح لكل طالب — معلومات الاتصال السريع، الأمراض الخطيرة، وخطة التصرف الفوري.', color: 'rgba(239,68,68,0.12)' },
            { icon: '💊', title: 'إدارة الأدوية المزمنة', desc: 'جدول أدوية الطلاب ذوي الأمراض المزمنة مع تذكير الممرضة بمواعيد الجرعات خلال اليوم الدراسي.', color: 'rgba(52,211,153,0.12)' },
            { icon: '📊', title: 'تقارير صحية دورية', desc: 'إحصائيات صحية شاملة للمؤسسة — الأمراض الأكثر شيوعاً، معدلات الغياب الصحي، وتوصيات وقائية.', color: 'rgba(52,211,153,0.12)' },
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

      {/* AI Well-being */}
      <section className="section">
        <div className="section-label">ركيزة الابتكار الخامسة</div>
        <div className="section-title">AI Well-being — الصحة النفسية بالذكاء الاصطناعي</div>
        <div className="section-desc">ميزة فريدة في متين تراقب المؤشرات النفسية للطلاب وتتدخل مبكراً قبل تفاقم المشكلة.</div>

        <div className="ai-box">
          <h3>🧠 كيف يعمل AI Well-being؟</h3>
          <p>
            الذكاء الاصطناعي في متين يحلل مؤشرات متعددة بشكل مستمر: معدل الحضور والغياب، الأداء الأكاديمي، مستوى التفاعل في الفصل، وأنماط السلوك. عند رصد تغيرات مقلقة، يُنبّه المرشد الطلابي تلقائياً لإجراء جلسة متابعة. هذا النظام يساعد في الكشف المبكر عن الاكتئاب، القلق، والتنمر قبل أن تتفاقم.
          </p>
        </div>

        <div className="features-grid">
          {[
            { icon: '🔍', title: 'رصد المؤشرات النفسية', desc: 'تحليل مستمر لمؤشرات الصحة النفسية من بيانات الحضور والأداء والسلوك.', color: 'rgba(139,92,246,0.12)' },
            { icon: '⚡', title: 'تنبيه مبكر للمرشد', desc: 'إشعار تلقائي للمرشد الطلابي عند رصد مؤشرات مقلقة تستدعي التدخل.', color: 'rgba(139,92,246,0.12)' },
            { icon: '📝', title: 'جلسات الإرشاد الرقمية', desc: 'توثيق جلسات الإرشاد الطلابي وتتبع التقدم بمرور الوقت.', color: 'rgba(139,92,246,0.12)' },
            { icon: '👨‍👩‍👧', title: 'تواصل مع الأسرة', desc: 'تنسيق مع أولياء الأمور عند الحاجة للدعم الأسري في الحالات الحساسة.', color: 'rgba(139,92,246,0.12)' },
            { icon: '🛡️', title: 'رصد التنمر', desc: 'خوارزميات تكتشف أنماط التنمر المدرسي من سلوكيات الطلاب وتنبه الإدارة.', color: 'rgba(139,92,246,0.12)' },
            { icon: '📈', title: 'تقارير الصحة النفسية', desc: 'تقارير دورية عن المناخ النفسي العام في المؤسسة مع توصيات للتحسين.', color: 'rgba(139,92,246,0.12)' },
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
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>صحة طلابك أمانة في عنقك</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7 }}>متين يساعدك على رعاية صحة طلابك جسدياً ونفسياً بأدوات ذكية وشاملة.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
