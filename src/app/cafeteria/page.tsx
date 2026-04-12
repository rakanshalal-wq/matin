'use client';
import Link from 'next/link';

export default function CafeteriaPage() {
  return (
    <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', sans-serif", direction: 'rtl', overflowX: 'hidden' }}>
      <style>{`
        :root { --gold: #C9A84C; --gold-2: #E8C96D; --dark: #06060E; --dark-2: #0B0B16; --dark-3: #10101E; --border: rgba(201,168,76,0.15); --text: #EEEEF5; --text-2: rgba(238,238,245,0.6); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif; background: var(--dark); color: var(--text); overflow-x: hidden; }
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(6,6,14,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 0 40px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark { width: 34px; height: 34px; background: var(--gold); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px; color: #060C18; }
        .nav-logo-text { font-size: 18px; font-weight: 800; color: var(--text); }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .btn-ghost { padding: 8px 20px; border-radius: 9px; background: transparent; border: 1px solid var(--border); color: var(--text-2); font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
        .btn-primary { padding: 8px 20px; border-radius: 9px; background: var(--gold); color: #000; font-size: 13.5px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
        .btn-primary:hover { background: var(--gold-2); }
        .hero { position: relative; padding: 140px 40px 80px; text-align: center; overflow: hidden; }
        .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%); }
        .hero-glow { position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 1100px; height: 700px; background: radial-gradient(ellipse, rgba(251,191,36,0.12) 0%, rgba(201,168,76,0.08) 40%, transparent 70%); pointer-events: none; z-index: 0; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); color: #FBBF24; padding: 6px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; margin-bottom: 40px; }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: #FBBF24; animation: pulse 2s infinite; }
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
        .highlight-box { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.25); border-radius: 20px; padding: 48px; margin: 48px 0; }
        .highlight-box h3 { font-size: 24px; font-weight: 800; color: var(--gold); margin-bottom: 16px; }
        .highlight-box p { font-size: 15px; color: var(--text-2); line-height: 1.8; }
        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 40px; }
        .step-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 14px; padding: 28px; text-align: center; }
        .step-num { width: 40px; height: 40px; border-radius: 50%; background: var(--gold); color: #000; font-weight: 900; font-size: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .step-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: var(--text-2); line-height: 1.6; }
        .alert-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 32px; margin: 32px 0; display: flex; gap: 20px; align-items: flex-start; }
        .alert-icon { font-size: 32px; flex-shrink: 0; }
        .alert-title { font-size: 18px; font-weight: 800; color: #EF4444; margin-bottom: 8px; }
        .alert-desc { font-size: 14px; color: var(--text-2); line-height: 1.7; }
        .divider { height: 1px; background: var(--border); margin: 0 40px; }
        .cta-section { padding: 80px 40px; text-align: center; }
        .cta-box { background: rgba(201,168,76,0.06); border: 1px solid rgba(201,168,76,0.2); border-radius: 24px; padding: 64px 40px; max-width: 700px; margin: 0 auto; }
        .btn-hero { display: inline-flex; align-items: center; gap: 10px; background: var(--gold); color: #000; padding: 15px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s; margin-top: 32px; }
        .btn-hero:hover { background: var(--gold-2); transform: translateY(-2px); box-shadow: 0 16px 48px rgba(201,168,76,0.3); }
        .footer { padding: 40px; border-top: 1px solid var(--border); text-align: center; color: var(--text-2); font-size: 13px; }
      `}</style>

      {/* Navbar */}
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

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            المقصف الذكي
          </div>
          <h1>
            المقصف الرقمي
            <span className="gold">بذكاء يحمي صحة طلابك</span>
          </h1>
          <p>نظام متكامل لإدارة المقصف المدرسي — من قائمة الطعام إلى الدفع الإلكتروني، مع ميزة حيوية فريدة: تنبيهات الحساسية الغذائية التي تحمي حياة الطلاب.</p>
        </div>
      </section>

      <div className="divider"></div>

      {/* الميزة الحيوية - الحساسية الغذائية */}
      <section className="section">
        <div className="section-label">الميزة الأهم</div>
        <div className="section-title">تنبيهات الحساسية الغذائية</div>
        <div className="section-desc">ميزة حيوية تفرق متين عن أي نظام آخر — تحمي حياة الطلاب من الحساسيات الغذائية الخطيرة.</div>

        <div className="alert-box">
          <div className="alert-icon">⚠️</div>
          <div>
            <div className="alert-title">حماية حيوية لا مثيل لها</div>
            <div className="alert-desc">
              ولي الأمر يسجل الحساسيات الغذائية لابنه في ملفه (فول سوداني، لاكتوز، جلوتين، إلخ). عند محاولة الطالب شراء وجبة تحتوي على مكون يسبب له حساسية، يظهر تحذير فوري أحمر للكاشير. لا يستطيع الكاشير إتمام البيع إلا بتأكيد استثنائي من ولي الأمر مباشرة. هذه الميزة تحمي حياة الطلاب وتفرق متين عن أي نظام آخر.
            </div>
          </div>
        </div>

        <div className="features-grid">
          {[
            { icon: '🥜', title: 'تسجيل الحساسيات', desc: 'ولي الأمر يسجل جميع الحساسيات الغذائية لابنه في ملفه الشخصي — فول سوداني، لاكتوز، جلوتين، مكسرات، وغيرها.', color: 'rgba(239,68,68,0.15)' },
            { icon: '🚨', title: 'تحذير فوري للكاشير', desc: 'عند مسح QR الطالب، يظهر تنبيه أحمر فوري إذا كانت الوجبة تحتوي على مكون يسبب له حساسية.', color: 'rgba(239,68,68,0.15)' },
            { icon: '📱', title: 'تأكيد ولي الأمر', desc: 'الكاشير لا يستطيع إتمام البيع إلا بعد تأكيد استثنائي من ولي الأمر عبر الجوال مباشرة.', color: 'rgba(239,68,68,0.15)' },
            { icon: '📋', title: 'مكونات كل وجبة', desc: 'كل وجبة في القائمة مسجلة مكوناتها بالكامل — الإدارة تضيفها عند إنشاء القائمة.', color: 'rgba(201,168,76,0.15)' },
            { icon: '📊', title: 'تقرير الحساسيات', desc: 'تقرير شامل بجميع الطلاب الذين لديهم حساسيات غذائية لمساعدة إدارة المقصف في التخطيط.', color: 'rgba(201,168,76,0.15)' },
            { icon: '🛡️', title: 'حماية قانونية', desc: 'توثيق كامل لكل عملية بيع مع سجل الحساسيات يحمي المؤسسة قانونياً ويثبت الالتزام بالسلامة.', color: 'rgba(201,168,76,0.15)' },
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

      {/* كيف يعمل المقصف */}
      <section className="section">
        <div className="section-label">آلية العمل</div>
        <div className="section-title">كيف يعمل المقصف الذكي؟</div>
        <div className="section-desc">تجربة سلسة من الطلب إلى الاستلام — رقمية بالكامل.</div>

        <div className="steps-grid">
          {[
            { num: '١', title: 'إدارة القائمة', desc: 'الإدارة تضيف الوجبات بالأسعار والصور والمكونات من لوحة التحكم.' },
            { num: '٢', title: 'شحن الرصيد', desc: 'ولي الأمر يشحن رصيداً إلكترونياً لابنه عبر التطبيق بأي طريقة دفع.' },
            { num: '٣', title: 'الطلب المسبق', desc: 'الطالب يطلب وجبته مسبقاً من التطبيق قبل الفسحة لتجنب الازدحام.' },
            { num: '٤', title: 'رمز QR', desc: 'عند المقصف، الطالب يعرض رمز QR للكاشير للمسح والدفع الفوري.' },
            { num: '٥', title: 'فحص الحساسية', desc: 'النظام يفحص تلقائياً مكونات الوجبة مقابل حساسيات الطالب.' },
            { num: '٦', title: 'إشعار ولي الأمر', desc: 'ولي الأمر يستلم إشعاراً بكل عملية شراء لمتابعة مصروف ابنه.' },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider"></div>

      {/* المميزات الكاملة */}
      <section className="section">
        <div className="section-label">المميزات الكاملة</div>
        <div className="section-title">إدارة شاملة للمقصف</div>
        <div className="section-desc">كل ما تحتاجه لإدارة مقصف مدرسي احترافي ومتكامل.</div>

        <div className="features-grid">
          {[
            { icon: '📋', title: 'قائمة طعام ديناميكية', desc: 'وجبات، أسعار، صور، مكونات — تُدار من لوحة التحكم بسهولة تامة مع إمكانية تغييرها يومياً.', color: 'rgba(201,168,76,0.1)' },
            { icon: '💳', title: 'محفظة رقمية للطالب', desc: 'كل طالب لديه محفظة رقمية داخل متين — ولي الأمر يشحنها، الطالب يصرف منها فقط في المقصف.', color: 'rgba(201,168,76,0.1)' },
            { icon: '📱', title: 'طلب مسبق من الجوال', desc: 'الطالب يطلب وجبته قبل الفسحة من التطبيق — يصل المقصف ليجد طلبه جاهزاً.', color: 'rgba(201,168,76,0.1)' },
            { icon: '🔲', title: 'دفع بـ QR Code', desc: 'مسح رمز QR عند الكاشير يكمل الدفع فورياً — لا نقود، لا تأخير، لا أخطاء.', color: 'rgba(201,168,76,0.1)' },
            { icon: '📊', title: 'تقارير مالية يومية', desc: 'تقرير يومي بإجمالي المبيعات، الوجبات الأكثر طلباً، والإيرادات — مع تصدير Excel.', color: 'rgba(201,168,76,0.1)' },
            { icon: '📦', title: 'إدارة المخزون', desc: 'تتبع المخزون تلقائياً مع تنبيه عند نفاد الكميات قبل الفسحة.', color: 'rgba(201,168,76,0.1)' },
            { icon: '👁️', title: 'مراقبة ولي الأمر', desc: 'ولي الأمر يرى كل عملية شراء لابنه — ماذا أكل، كم صرف، متى — شفافية كاملة.', color: 'rgba(201,168,76,0.1)' },
            { icon: '🍎', title: 'التغذية الصحية', desc: 'إمكانية تصنيف الوجبات حسب القيمة الغذائية وتوجيه الطلاب نحو الخيارات الصحية.', color: 'rgba(201,168,76,0.1)' },
            { icon: '⚡', title: 'سرعة الخدمة', desc: 'الطلب المسبق + QR يقلل وقت الانتظار في الفسحة من دقائق إلى ثوانٍ.', color: 'rgba(201,168,76,0.1)' },
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

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '16px' }}>ابدأ الآن</div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>هل مقصفك مدرستك يحمي طلابك؟</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: 1.7 }}>انضم لمئات المدارس التي تستخدم متين لإدارة مقصفها بذكاء وأمان. ميزة الحساسية الغذائية وحدها تستحق التجربة.</p>
          <Link href="/register" className="btn-hero">ابدأ تجربتك المجانية ←</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} منصة متين التعليمية. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
