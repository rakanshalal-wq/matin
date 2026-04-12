import Link from 'next/link';
import pool from '@/lib/db';
import FadeInObserver from '@/components/FadeInObserver';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  let saved: Record<string,any> = {};
  try {
    const r = await pool.query("SELECT content FROM landing_content WHERE section='main'");
    saved = r.rows[0]?.content || {};
  } catch {}
  const g = (k: string, d: string): string => (saved[k] ?? d);
  const gb = (k: string): boolean => (saved[k] ?? true);
  const ga = (k: string, d: any[] = []): any[] => { try { const v = saved[k]; return Array.isArray(v) ? v : d; } catch { return d; } };
  const insts = ga('institutions', [{name:'المدارس',tag:'الأكثر استخداماً',desc:'إدارة كاملة للفصول، المناهج، الحضور، الدرجات، والتواصل مع أولياء الأمور.'},{name:'الجامعات',tag:'دعم متعدد الأقسام',desc:'نظام أكاديمي متقدم يدعم التسجيل، الساعات المعتمدة، والمقررات الإلكترونية.'},{name:'رياض الأطفال',tag:'تواصل لحظي مع الأهل',desc:'متابعة يومية للنشاطات، التغذية، الحضور، وتقارير النمو لأولياء الأمور.'},{name:'حضانات الأطفال',tag:'متابعة دقيقة بالدقيقة',desc:'إدارة الحضانة بالكامل — تسجيل الأطفال، جداول الرعاية، وتقارير يومية.'},{name:'مراكز التدريب',tag:'إصدار شهادات رقمية',desc:'إدارة الدورات، المدربين، الحضور، الشهادات، والمدفوعات في منظومة واحدة.'},{name:'المعاهد التقنية',tag:'تكامل مع سوق العمل',desc:'مناهج تقنية، مشاريع التخرج، التدريب الميداني، ومتابعة الكفاءات العملية.'},{name:'المساجد والحلقات',tag:'خصوصية تامة',desc:'إدارة حلقات التحفيظ، المستويات، الحضور، والتقييم الديني بشكل منظم.'}]);
  const feats = ga('features', [{title:'إدارة متعددة الأدوار',color:'#60A5FA',desc:'15+ دور من مالك المنصة لولي الأمر — كل دور بصلاحياته الدقيقة.'},{title:'حضور وغياب ذكي',color:'#10B981',desc:'تسجيل فوري مع إشعارات لحظية لأولياء الأمور عبر واتساب و SMS.'},{title:'إدارة مالية متكاملة',color:'#D4A843',desc:'رسوم الطلاب، الرواتب، الفواتير، والمنح — مع تقارير مالية تلقائية.'},{title:'تعليم إلكتروني مدمج',color:'#A78BFA',desc:'محاضرات مسجّلة، بث مباشر، واجبات إلكترونية، وبنك أسئلة متقدم.'},{title:'نقل مدرسي مع GPS',color:'#FB923C',desc:'تتبع حافلات المدرسة في الوقت الفعلي مع إشعارات وصول وانصراف.'}]);
  const faqItems = ga('faqs', [{question:'هل يمكنني تجربة متين قبل الدفع?',answer:'نعم، نوفر تجربة مجانية كاملة لمدة 30 يوم بدون بطاقة ائتمان.'},{question:'كم يستغرق إعداد المنصة لمؤسستي?',answer:'معظم المؤسسات تكون جاهزة خلال يوم واحد.'},{question:'هل بياناتي آمنة على متين?',answer:'نعم، نستخدم تشفير SSL كامل، ونسخ احتياطية يومية.'}]);
  const intList = ga('integrations', ['واتساب Business','SMS محلي','نظام نور','مدى / فيزا','تقارير PDF','تخزين سحابي','ذكاء اصطناعي','GPS تتبع','إشعارات فورية','SSL وأمان']);

  return (
    <>
      <FadeInObserver />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
        :root{--gold:#D4A843;--gold2:#E8C060;--gold-dim:rgba(212,168,67,0.12);--gold-border:rgba(212,168,67,0.22);--bg:#06060E;--card:rgba(255,255,255,0.03);--border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.04);--text:#EEEEF5;--text-dim:rgba(238,238,245,0.6);--text-muted:rgba(238,238,245,0.3);--green:#10B981;--blue:#60A5FA;--purple:#A78BFA;--orange:#FB923C;--cyan:#22D3EE;--font:'IBM Plex Sans Arabic',sans-serif;--nav-h:64px;}
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{font-family:var(--font);background:var(--bg);color:var(--text);overflow-x:hidden;}
        nav{position:fixed;top:0;left:0;right:0;height:var(--nav-h);display:flex;align-items:center;justify-content:space-between;padding:0 5%;background:rgba(6,6,14,0.85);backdrop-filter:blur(20px) saturate(1.8);border-bottom:1px solid var(--border);z-index:200;}
        .nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
        .nav-logo-icon{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:#000;box-shadow:0 4px 14px rgba(212,168,67,0.3);flex-shrink:0;}
        .nav-logo-main{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.5px;line-height:1.1;}
        .nav-logo-sub{font-size:9px;color:var(--text-muted);font-weight:500;letter-spacing:0.5px;}
        .nav-links{display:flex;align-items:center;gap:28px;}
        .nav-links a{color:var(--text-dim);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s;white-space:nowrap;}
        .nav-links a:hover{color:var(--gold);}
        .nav-cta{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:9px;padding:8px 20px;color:#06060E;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;box-shadow:0 4px 14px rgba(212,168,67,0.25);transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;}
        .nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.4);}
        .nav-mobile-menu{display:none;background:none;border:1px solid var(--border);border-radius:8px;width:36px;height:36px;align-items:center;justify-content:center;cursor:pointer;color:var(--text-dim);}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:calc(var(--nav-h) + 60px) 5% 80px;position:relative;overflow:hidden;}
        .hero-glow{position:absolute;width:min(700px,90vw);height:min(700px,90vw);border-radius:50%;background:radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none;}
        .hero-glow2{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(96,165,250,0.05) 0%,transparent 70%);bottom:15%;right:5%;pointer-events:none;}
        .hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;color:var(--gold);margin-bottom:28px;}
        .hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse-dot 2s infinite;}
        .hero-title{font-size:clamp(36px,6vw,72px);font-weight:800;line-height:1.1;letter-spacing:-2px;margin-bottom:10px;}
        .hero-title-gold{color:var(--gold);}
        .hero-sub{font-size:clamp(15px,2vw,19px);color:var(--text-dim);max-width:560px;margin:0 auto 40px;line-height:1.75;font-weight:400;}
        .hero-actions{display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;}
        .btn-primary{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;padding:14px 28px;color:#06060E;font-weight:800;font-size:15px;cursor:pointer;box-shadow:0 6px 22px rgba(212,168,67,0.3);transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(212,168,67,0.45);}
        .btn-secondary{background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:12px;padding:14px 24px;color:var(--text);font-weight:600;font-size:15px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;white-space:nowrap;text-decoration:none;}
        .btn-secondary:hover{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.15);}
        .hero-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:56px;width:100%;max-width:1000px;}
        .hero-card{background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:16px;padding:22px 20px;transition:all 0.2s;}
        .hero-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.1);}
        .hero-card-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
        .hero-card-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:7px;}
        .hero-card-desc{font-size:12.5px;color:var(--text-muted);line-height:1.65;margin-bottom:12px;}
        .hero-card-tag{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;}
        section{padding:clamp(60px,8vw,100px) 5%;position:relative;z-index:1;}
        .sec-center{text-align:center;margin-bottom:clamp(40px,5vw,64px);}
        .sec-tag{display:inline-flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:18px;}
        .sec-title{font-size:clamp(26px,4vw,44px);font-weight:800;letter-spacing:-1px;margin-bottom:14px;line-height:1.15;}
        .sec-sub{font-size:clamp(14px,1.5vw,16px);color:var(--text-dim);line-height:1.75;max-width:520px;margin:0 auto;}
        .inst-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
        .inst-card{background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:clamp(20px,3vw,28px);transition:all 0.25s;position:relative;overflow:hidden;}
        .inst-card::before{content:'';position:absolute;inset:0;background:transparent;transition:background 0.25s;pointer-events:none;}
        .inst-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.1);}
        .inst-icon-wrap{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0;}
        .inst-name{font-size:16px;font-weight:700;margin-bottom:8px;}
        .inst-desc{font-size:13px;color:var(--text-muted);line-height:1.65;}
        .inst-tag{margin-top:14px;font-size:11px;font-weight:700;letter-spacing:0.3px;}
        .features-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,6vw,80px);align-items:center;}
        .features-list{display:flex;flex-direction:column;gap:16px;}
        .feature-item{display:flex;gap:16px;align-items:flex-start;padding:18px;border-radius:14px;border:1px solid transparent;transition:all 0.2s;cursor:default;}
        .feature-item:hover{background:rgba(255,255,255,0.03);border-color:var(--border);}
        .feature-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .feature-title{font-size:15px;font-weight:700;margin-bottom:5px;}
        .feature-desc{font-size:13px;color:var(--text-muted);line-height:1.65;}
        .mockup-wrap{background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.04);}
        .mockup-bar{padding:12px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px;}
        .mockup-dot{width:9px;height:9px;border-radius:50%;}
        .mockup-url{flex:1;text-align:center;font-size:10px;color:rgba(238,238,245,0.25);}
        .mockup-body{padding:18px;}
        .mockup-title{font-size:12px;font-weight:700;color:var(--gold);margin-bottom:12px;}
        .m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
        .m-stat{background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:9px;padding:12px;}
        .m-val{font-size:20px;font-weight:800;line-height:1;}
        .m-lbl{font-size:9px;color:var(--text-muted);margin-top:3px;}
        .m-row{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;background:rgba(255,255,255,0.02);border-radius:7px;margin-bottom:5px;font-size:11px;}
        .m-progress{height:3px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;margin-top:12px;}
        .m-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--blue));border-radius:2px;}
        .m-prog-labels{display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:var(--text-muted);}
        .roles-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .role-card{background:var(--card);border:1px solid var(--border2);border-radius:13px;padding:18px 14px;text-align:center;transition:all 0.2s;}
        .role-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.1);}
        .role-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;}
        .role-name{font-size:13px;font-weight:700;margin-bottom:4px;}
        .role-desc{font-size:11px;color:var(--text-muted);line-height:1.5;}
        .int-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:40px;}
        .int-chip{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:9px 16px;font-size:13px;font-weight:600;color:var(--text-dim);transition:all 0.2s;}
        .int-chip:hover{border-color:var(--gold-border);color:var(--text);}
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
        .price-card{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:clamp(24px,3vw,32px);position:relative;overflow:hidden;transition:all 0.25s;}
        .price-card:hover{transform:translateY(-4px);}
        .price-card.featured{background:linear-gradient(135deg,rgba(212,168,67,0.07),rgba(212,168,67,0.02));border-color:var(--gold-border);box-shadow:0 0 50px rgba(212,168,67,0.07);}
        .price-badge{position:absolute;top:18px;left:18px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-size:10px;font-weight:800;padding:3px 11px;border-radius:20px;letter-spacing:0.5px;}
        .price-name{font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
        .price-amount{font-size:clamp(28px,3vw,38px);font-weight:800;line-height:1;}
        .price-amount span{font-size:13px;color:var(--text-muted);font-weight:400;}
        .price-period{font-size:12px;color:var(--text-muted);margin-top:4px;}
        .price-divider{height:1px;background:var(--border);margin:22px 0;}
        .price-features{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:26px;}
        .price-features li{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text-dim);}
        .price-features li.off{color:var(--text-muted);}
        .check-icon{flex-shrink:0;color:var(--green);}
        .off-icon{flex-shrink:0;color:var(--text-muted);}
        .btn-price{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);transition:all 0.2s;}
        .btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-dim);}
        .btn-outline:hover{border-color:var(--gold-border);color:var(--gold);}
        .btn-gold-p{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;color:#000;box-shadow:0 4px 14px rgba(212,168,67,0.3);}
        .btn-gold-p:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.45);}
        .cta-wrap{text-align:center;padding:clamp(60px,8vw,100px) 5%;position:relative;overflow:hidden;}
        .cta-bg{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(212,168,67,0.05) 0%,transparent 70%);pointer-events:none;}
        .cta-title{font-size:clamp(28px,5vw,52px);font-weight:800;letter-spacing:-1.5px;margin-bottom:18px;}
        .cta-sub{font-size:clamp(14px,1.8vw,17px);color:var(--text-dim);max-width:480px;margin:0 auto 36px;line-height:1.75;}
        .cta-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
        footer{padding:clamp(30px,4vw,50px) 5% clamp(20px,3vw,30px);border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;}
        .footer-logo{display:flex;align-items:center;gap:10px;}
        .footer-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;color:#000;}
        footer p{color:var(--text-muted);font-size:12px;}
        .footer-links{display:flex;gap:20px;flex-wrap:wrap;}
        .footer-links a{color:var(--text-muted);font-size:12px;text-decoration:none;transition:color 0.2s;}
        .footer-links a:hover{color:var(--gold);}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}
        .fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.55s ease,transform 0.55s ease;}
        .fade-in.visible{opacity:1;transform:translateY(0);}
        @media(max-width:1024px){.inst-grid{grid-template-columns:repeat(2,1fr);}.features-grid{grid-template-columns:1fr;}.mockup-wrap{max-width:500px;margin:0 auto;}.pricing-grid{grid-template-columns:1fr;max-width:420px;margin:0 auto;}.roles-grid{grid-template-columns:repeat(3,1fr);}.hero-cards{grid-template-columns:repeat(2,1fr);max-width:600px;}}
        @media(max-width:768px){.nav-links{display:none;}.nav-mobile-menu{display:flex;}.inst-grid{grid-template-columns:1fr 1fr;}.roles-grid{grid-template-columns:repeat(2,1fr);}.hero-cards{grid-template-columns:1fr;max-width:400px;}.hero-title{letter-spacing:-1px;}footer{flex-direction:column;text-align:center;}.footer-links{justify-content:center;}}
        @media(max-width:480px){.inst-grid{grid-template-columns:1fr;}.roles-grid{grid-template-columns:repeat(2,1fr);}.btn-primary,.btn-secondary{width:100%;justify-content:center;}.hero-actions{flex-direction:column;width:100%;max-width:320px;}.cta-actions{flex-direction:column;align-items:center;}.hero-cards{grid-template-columns:1fr;}}
      `}</style>

      {/* NAV */}
      <nav>
        <Link className="nav-logo" href="/">
          <div className="nav-logo-icon">م</div>
          <div>
            <div className="nav-logo-main">متين</div>
            <div className="nav-logo-sub">MATIN.INK</div>
          </div>
        </Link>
        <div className="nav-links">
          <a href="#features">المميزات</a>
          <a href="#institutions">المؤسسات</a>
          <a href="#pricing">الأسعار</a>
          <a href="#roles">الأدوار</a>
          <Link href="/login">تسجيل الدخول</Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button className="nav-mobile-menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <Link href="/register" className="nav-cta">ابدأ مجاناً</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-glow2"></div>
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          {g('hero_badge','منصة التعليم الأذكى للمؤسسات الخاصة في السعودية')}
        </div>
        <h1 className="hero-title">
          {g('hero_title1','كل مؤسستك في')}<br />
          <span className="hero-title-gold">{g('hero_title2','لوحة تحكم واحدة')}</span>
        </h1>
        <p className="hero-sub">{g('hero_desc','من الحضور والدرجات إلى الرسوم والنقل — متين يدير كل شيء حتى تركّز أنت على التعليم.')}</p>
        <div className="hero-actions">
          <Link href="/register" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            {g('hero_btn1','ابدأ تجربتك المجانية')}
          </Link>
          <button className="btn-secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            {g('hero_btn2','شاهد العرض')}
          </button>
        </div>
        <div className="hero-cards fade-in">
          <div className="hero-card">
            <div className="hero-card-icon" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
            </div>
            <div className="hero-card-title">المتجر الإلكتروني</div>
            <div className="hero-card-desc">متجر خاص لكل مؤسسة لبيع الكتب، الأدوات، والمنتجات التعليمية مباشرة للطلاب.</div>
            <div className="hero-card-tag" style={{color:'#A78BFA'}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              مدفوعات إلكترونية مدمجة
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-icon" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div className="hero-card-title">المكتبة الرقمية</div>
            <div className="hero-card-desc">مستودع محتوى تعليمي ثري — كتب، مقاطع، ملفات، ومراجع في متناول الطلاب والمعلمين.</div>
            <div className="hero-card-tag" style={{color:'#60A5FA'}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              وصول 24/7 من أي جهاز
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-icon" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="hero-card-title">الملتقى المجتمعي</div>
            <div className="hero-card-desc">فضاء تفاعلي يجمع الطلاب والمعلمين وأولياء الأمور — نقاشات، فعاليات، وإعلانات.</div>
            <div className="hero-card-tag" style={{color:'#10B981'}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              تواصل حقيقي داخل المؤسسة
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-icon" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <div className="hero-card-title">الإعلانات</div>
            <div className="hero-card-desc">أنشئ إعلانات وأظهرها داخل لوحات التحكم لجميع مستخدمي المنصة باستهداف دقيق.</div>
            <div className="hero-card-tag" style={{color:'#EF4444'}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              استهداف حسب الدور والمؤسسة
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONS */}
      {gb('sec_institutions') && <section id="institutions" style={{background:'rgba(255,255,255,0.01)'}}>
        <div className="sec-center fade-in">
          <div className="sec-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M14 8h1"/></svg>
            المؤسسات المدعومة
          </div>
          <h2 className="sec-title">{g('inst_title1','لكل مؤسسة تعليمية')}<br /><span style={{color:'var(--gold)'}}>{g('inst_title2','حل مخصص')}</span></h2>
          <p className="sec-sub">{g('inst_desc','من الروضة للجامعة — متين يتكيف مع طبيعة مؤسستك وهيكلها الأكاديمي.')}</p>
        </div>
        <div className="inst-grid">
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/></svg>
            </div>
            <div className="inst-name">{insts[0]?.name||"المدارس"}</div>
            <div className="inst-desc">{insts[0]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--blue)'}}>{insts[0]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div className="inst-name">{insts[1]?.name||"الجامعات"}</div>
            <div className="inst-desc">{insts[1]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--purple)'}}>{insts[1]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
            <div className="inst-name">{insts[2]?.name||"رياض الأطفال"}</div>
            <div className="inst-desc">{insts[2]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--orange)'}}>{insts[2]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(252,211,77,0.1)',border:'1px solid rgba(252,211,77,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FCD34D" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </div>
            <div className="inst-name">{insts[3]?.name||"حضانات الأطفال"}</div>
            <div className="inst-desc">{insts[3]?.desc||""}</div>
            <div className="inst-tag" style={{color:'#FCD34D'}}>{insts[3]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(34,211,238,0.1)',border:'1px solid rgba(34,211,238,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div className="inst-name">{insts[4]?.name||"مراكز التدريب"}</div>
            <div className="inst-desc">{insts[4]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--cyan)'}}>{insts[4]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div className="inst-name">{insts[5]?.name||"المعاهد التقنية"}</div>
            <div className="inst-desc">{insts[5]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--green)'}}>{insts[5]?.tag||""}</div>
          </div>
          <div className="inst-card fade-in">
            <div className="inst-icon-wrap" style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.2)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="inst-name">{insts[6]?.name||"المساجد والحلقات"}</div>
            <div className="inst-desc">{insts[6]?.desc||""}</div>
            <div className="inst-tag" style={{color:'var(--gold)'}}>{insts[6]?.tag||""}</div>
          </div>
        </div>
      </section>}

      {/* FEATURES */}
      {gb('sec_features') && <section id="features">
        <div className="features-grid">
          <div>
            <div className="fade-in">
              <div className="sec-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                المميزات الأساسية
              </div>
              <h2 className="sec-title">{g('feat_title1','كل ما تحتاجه')}<br /><span style={{color:'var(--gold)'}}>{g('feat_title2','في مكان واحد')}</span></h2>
              <p className="sec-sub">نظام متكامل يغطي كل جوانب إدارة المؤسسة التعليمية.</p>
            </div>
            <div className="features-list" style={{marginTop:32}}>
              <div className="feature-item fade-in">
                <div className="feature-icon" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div><div className="feature-title">{feats[0]?.title||"إدارة متعددة الأدوار"}</div><div className="feature-desc">{feats[0]?.desc||""}</div></div>
              </div>
              <div className="feature-item fade-in">
                <div className="feature-icon" style={{background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.2)'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                </div>
                <div><div className="feature-title">{feats[1]?.title||"حضور وغياب ذكي"}</div><div className="feature-desc">{feats[1]?.desc||""}</div></div>
              </div>
              <div className="feature-item fade-in">
                <div className="feature-icon" style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.2)'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div><div className="feature-title">{feats[2]?.title||"إدارة مالية متكاملة"}</div><div className="feature-desc">{feats[2]?.desc||""}</div></div>
              </div>
              <div className="feature-item fade-in">
                <div className="feature-icon" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </div>
                <div><div className="feature-title">{feats[3]?.title||"تعليم إلكتروني مدمج"}</div><div className="feature-desc">{feats[3]?.desc||""}</div></div>
              </div>
              <div className="feature-item fade-in">
                <div className="feature-icon" style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div><div className="feature-title">{feats[4]?.title||"نقل مدرسي مع GPS"}</div><div className="feature-desc">{feats[4]?.desc||""}</div></div>
              </div>
            </div>
          </div>
          <div className="fade-in">
            <div className="mockup-wrap">
              <div className="mockup-bar">
                <div className="mockup-dot" style={{background:'#EF4444'}}></div>
                <div className="mockup-dot" style={{background:'#F59E0B'}}></div>
                <div className="mockup-dot" style={{background:'#10B981'}}></div>
                <div className="mockup-url">matin.ink/dashboard</div>
              </div>
              <div className="mockup-body">
                <div className="mockup-title">لوحة التحكم — مدرسة الأمل الدولية</div>
                <div className="m-grid">
                  <div className="m-stat"><div className="m-val" style={{color:'var(--blue)'}}>1,240</div><div className="m-lbl">طالب</div></div>
                  <div className="m-stat"><div className="m-val" style={{color:'var(--green)'}}>96%</div><div className="m-lbl">حضور اليوم</div></div>
                  <div className="m-stat"><div className="m-val" style={{color:'var(--gold)'}}>48</div><div className="m-lbl">معلم</div></div>
                </div>
                <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:8,fontWeight:600}}>آخر النشاطات</div>
                <div className="m-row"><span style={{color:'var(--text-dim)'}}>أحمد محمد</span><span style={{color:'var(--green)',fontSize:10}}>حضر ✓</span></div>
                <div className="m-row"><span style={{color:'var(--text-dim)'}}>فاطمة علي</span><span style={{color:'var(--gold)',fontSize:10}}>رسوم معلقة</span></div>
                <div className="m-row"><span style={{color:'var(--text-dim)'}}>اختبار الرياضيات</span><span style={{color:'var(--purple)',fontSize:10}}>غداً 9:00</span></div>
                <div className="m-row"><span style={{color:'var(--text-dim)'}}>محاضرة العلوم</span><span style={{color:'var(--blue)',fontSize:10}}>مباشر الآن</span></div>
                <div className="m-progress"><div className="m-fill" style={{width:'78%'}}></div></div>
                <div className="m-prog-labels"><span>التخزين: 78%</span><span>85.6 / 120 GB</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>}

      {/* ROLES */}
      {gb('sec_roles') && <section id="roles" style={{background:'rgba(255,255,255,0.01)'}}>
        <div className="sec-center fade-in">
          <div className="sec-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            الأدوار والصلاحيات
          </div>
          <h2 className="sec-title">منظومة أدوار <span style={{color:'var(--gold)'}}>متكاملة</span></h2>
          <p className="sec-sub">كل مستخدم يرى ما يحتاجه فقط — بصلاحيات دقيقة وآمنة.</p>
        </div>
        <div className="roles-grid">
          {[
            {name:'مالك المنصة',desc:'تحكم سيادي كامل في كل المؤسسات',color:'#D4A843',d:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'},
            {name:'مالك المؤسسة',desc:'إدارة كاملة لمؤسسته وفروعها',color:'#10B981',d:'M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 8h1M14 8h1'},
            {name:'مدير المدرسة',desc:'إشراف على العمليات اليومية',color:'#60A5FA',d:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'},
            {name:'المعلم',desc:'فصله، درجاته، محاضراته',color:'#4ADE80',d:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'},
            {name:'الطالب',desc:'جدوله، واجباته، درجاته',color:'#38BDF8',d:'M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5'},
            {name:'ولي الأمر',desc:'متابعة أبنائه لحظة بلحظة',color:'#F9A8D4',d:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M15 11h6M18 8v6'},
            {name:'السائق',desc:'GPS ومتابعة الطلاب في رحلته',color:'#FCD34D',d:'M1 3h15v13H1zM16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 M18.5 21a2.5 2.5 0 1 0 0-5'},
            {name:'حارس الأمن',desc:'سجل الزوار والطوارئ',color:'#F87171',d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'},
          ].map((r,i) => (
            <div key={i} className="role-card fade-in">
              <div className="role-icon" style={{background:`${r.color}1a`,border:`1px solid ${r.color}33`}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={r.d}/></svg>
              </div>
              <div className="role-name">{r.name}</div>
              <div className="role-desc">{r.desc}</div>
            </div>
          ))}
        </div>
      </section>}

      {/* INTEGRATIONS */}
      {gb('sec_integrations') && <section>
        <div className="sec-center fade-in">
          <div className="sec-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            التكاملات
          </div>
          <h2 className="sec-title" style={{fontSize:'clamp(24px,3.5vw,36px)'}}>متصل بكل ما تحتاجه</h2>
        </div>
        <div className="int-grid fade-in">
          {[
            {label:'واتساب Business',color:'#25D366'},{label:'SMS محلي',color:'#60A5FA'},
            {label:'نظام نور',color:'#10B981'},{label:'مدى / فيزا',color:'#D4A843'},
            {label:'تحويل بنكي',color:'#34D399'},{label:'تقارير PDF',color:'#F87171'},
            {label:'تخزين سحابي',color:'#38BDF8'},{label:'ذكاء اصطناعي',color:'#C084FC'},
            {label:'GPS تتبع',color:'#FB923C'},{label:'إشعارات فورية',color:'#FCD34D'},
            {label:'SSL وأمان',color:'#10B981'},
          ].map((c,i) => (
            <div key={i} className="int-chip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/></svg>
              {c.label}
            </div>
          ))}
        </div>
      </section>}

      {/* PRICING */}
      {gb('sec_pricing') && <section id="pricing" style={{background:'rgba(255,255,255,0.01)'}}>
        <div className="sec-center fade-in">
          <div className="sec-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            الأسعار
          </div>
          <h2 className="sec-title">{g('pricing_title','باقة لكل مؤسسة')}</h2>
          <p className="sec-sub">{g('pricing_desc','ابدأ مجاناً وطوّر حسب احتياجك.')}</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card fade-in">
            <div className="price-name">{ga('pricing_plans',[])[0]?.name||"أساسي"}</div>
            <div className="price-amount">{ga('pricing_plans',[])[0]?.price||"مجاناً"} <span>{ga('pricing_plans',[])[0]?.period||"للبداية"}</span></div>
            <div className="price-period">تجربة 30 يوم كاملة</div>
            <div className="price-divider"></div>
            <ul className="price-features">
              {['حتى 100 طالب','لوحة تحكم أساسية','الحضور والغياب','الدرجات والتقارير'].map((f,i)=>(
                <li key={i}><svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
              {['النقل المدرسي','التعليم الإلكتروني','دعم مخصص'].map((f,i)=>(
                <li key={i} className="off"><svg className="off-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>{f}</li>
              ))}
            </ul>
            <Link href="/register" className="btn-price btn-outline" style={{display:'block',textAlign:'center'}}>ابدأ مجاناً</Link>
          </div>
          <div className="price-card featured fade-in">
            <div className="price-badge">الأكثر شعبية</div>
            <div className="price-name" style={{color:'var(--gold)'}}>{ga('pricing_plans',[])[1]?.name||"متقدم"}</div>
            <div className="price-amount" style={{color:'var(--gold)'}}>{ga('pricing_plans',[])[1]?.price||"1,200"} <span>{ga('pricing_plans',[])[1]?.period||"ريال / سنة"}</span></div>
            <div className="price-period">100 ريال شهرياً</div>
            <div className="price-divider" style={{background:'var(--gold-border)'}}></div>
            <ul className="price-features">
              {['حتى 500 طالب','جميع مميزات الأساسي','التعليم الإلكتروني','النقل المدرسي + GPS','إدارة مالية كاملة','تكاملات واتساب/SMS'].map((f,i)=>(
                <li key={i}><svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
              <li className="off"><svg className="off-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>دعم مخصص 24/7</li>
            </ul>
            <Link href="/register" className="btn-price btn-gold-p" style={{display:'block',textAlign:'center'}}>اشترك الآن</Link>
          </div>
          <div className="price-card fade-in">
            <div className="price-name">{ga('pricing_plans',[])[2]?.name||"مؤسسي"}</div>
            <div className="price-amount">{ga('pricing_plans',[])[2]?.price||"حسب الطلب"}</div>
            <div className="price-period">للمؤسسات الكبيرة</div>
            <div className="price-divider"></div>
            <ul className="price-features">
              {['طلاب غير محدودين','جميع المميزات','دعم مخصص 24/7','تكاملات مخصصة','تدريب الفريق','SLA مضمون 99.9%','White Label متاح'].map((f,i)=>(
                <li key={i}><svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{f}</li>
              ))}
            </ul>
            <button className="btn-price btn-outline" style={{borderColor:'var(--gold-border)',color:'var(--gold)'}}>تواصل معنا</button>
          </div>
        </div>
      </section>}

      {/* CTA */}
      {gb('sec_cta') && <div className="cta-wrap">
        <div className="cta-bg"></div>
        <div className="sec-tag fade-in" style={{margin:'0 auto 22px'}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          ابدأ اليوم
        </div>
        <h2 className="cta-title fade-in">جاهز لتحويل<br /><span style={{color:'var(--gold)'}}>مؤسستك التعليمية؟</span></h2>
        <p className="cta-sub fade-in">انضم لأكثر من 47 مؤسسة تعليمية في المملكة تثق بمتين.</p>
        <div className="cta-actions fade-in">
          <Link href="/register" className="btn-primary">ابدأ تجربتك المجانية</Link>
          <button className="btn-secondary">تحدث مع فريقنا</button>
        </div>
      </div>}

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <div className="footer-logo-icon">م</div>
          <div>
            <div style={{fontSize:15,fontWeight:800,color:'var(--text)'}}>متين</div>
            <div style={{fontSize:9,color:'var(--text-muted)',fontWeight:500}}>{g('footer_logo_desc','النظام السيادي للتعليم')}</div>
          </div>
        </div>
        <p>{g('footer_copyright','© 2026 متين — جميع الحقوق محفوظة · صنع بـ ❤️ في المملكة العربية السعودية')}</p>
        <div className="footer-links">
          <a href="#">سياسة الخصوصية</a>
          <a href="#">الشروط والأحكام</a>
          <a href="#">تواصل معنا</a>
        </div>
      </footer>
    </>
  );
}
