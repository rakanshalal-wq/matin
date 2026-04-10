'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap');
:root {
  --gold:#D4A843; --gold2:#E8C060;
  --gold-dim:rgba(212,168,67,0.12); --gold-border:rgba(212,168,67,0.22);
  --bg:#06060E; --card:rgba(255,255,255,0.03);
  --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
  --text:#EEEEF5; --text-dim:rgba(238,238,245,0.6); --text-muted:rgba(238,238,245,0.3);
  --green:#10B981; --blue:#60A5FA; --purple:#A78BFA; --orange:#FB923C; --cyan:#22D3EE;
  --font:'IBM Plex Sans Arabic',sans-serif;
  --nav-h:64px;
}
*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{font-family:var(--font);background:var(--bg);color:var(--text);overflow-x:hidden;}

nav{
  position:fixed;top:0;left:0;right:0;height:var(--nav-h);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 5%;
  background:rgba(6,6,14,0.85);
  backdrop-filter:blur(20px) saturate(1.8);
  border-bottom:1px solid var(--border);
  z-index:200;
}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.nav-logo-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  display:flex;align-items:center;justify-content:center;
  font-size:18px;font-weight:900;color:#000;
  box-shadow:0 4px 14px rgba(212,168,67,0.3);
  flex-shrink:0;
}
.nav-logo-main{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.5px;line-height:1.1;}
.nav-logo-sub{font-size:9px;color:var(--text-muted);font-weight:500;letter-spacing:0.5px;}
.nav-links{display:flex;align-items:center;gap:28px;}
.nav-links a{color:var(--text-dim);text-decoration:none;font-size:14px;font-weight:500;transition:color 0.2s;white-space:nowrap;}
.nav-links a:hover{color:var(--gold);}
.nav-cta{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  border:none;border-radius:9px;padding:8px 20px;
  color:#06060E;font-weight:700;font-size:13px;
  cursor:pointer;font-family:var(--font);white-space:nowrap;
  box-shadow:0 4px 14px rgba(212,168,67,0.25);
  transition:all 0.2s;
}
.nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(212,168,67,0.4);}

.hero{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  text-align:center;padding:calc(var(--nav-h) + 60px) 5% 80px;
  position:relative;overflow:hidden;
}
.hero-glow{position:absolute;width:min(700px,90vw);height:min(700px,90vw);border-radius:50%;background:radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-60%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;color:var(--gold);margin-bottom:28px;}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite;}
.hero-title{font-size:clamp(36px,6vw,72px);font-weight:800;line-height:1.1;letter-spacing:-2px;margin-bottom:10px;}
.hero-title-gold{color:var(--gold);}
.hero-sub{font-size:clamp(15px,2vw,19px);color:var(--text-dim);max-width:560px;margin:0 auto 40px;line-height:1.75;font-weight:400;}
.hero-actions{display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn-primary{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:12px;padding:14px 28px;color:#06060E;font-weight:800;font-size:15px;cursor:pointer;font-family:var(--font);box-shadow:0 6px 22px rgba(212,168,67,0.3);transition:all 0.2s;display:flex;align-items:center;gap:8px;white-space:nowrap;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(212,168,67,0.45);}
.btn-secondary{background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:12px;padding:14px 24px;color:var(--text);font-weight:600;font-size:15px;cursor:pointer;font-family:var(--font);transition:all 0.2s;display:flex;align-items:center;gap:8px;white-space:nowrap;}
.btn-secondary:hover{background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.15);}
.hero-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-top:56px;width:100%;max-width:1000px;}
.hero-card{background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:16px;padding:22px 20px;transition:all 0.2s;}
.hero-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.1);}
.hero-card-icon{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;font-size:24px;}
.hero-card-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:7px;}
.hero-card-desc{font-size:12.5px;color:var(--text-muted);line-height:1.65;}

section{padding:clamp(60px,8vw,100px) 5%;position:relative;z-index:1;}
.sec-center{text-align:center;margin-bottom:clamp(40px,5vw,64px);}
.sec-tag{display:inline-flex;align-items:center;gap:8px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:20px;padding:5px 14px;font-size:11px;font-weight:700;color:var(--gold);letter-spacing:0.5px;text-transform:uppercase;margin-bottom:18px;}
.sec-title{font-size:clamp(26px,4vw,44px);font-weight:800;letter-spacing:-1px;margin-bottom:14px;line-height:1.15;}
.sec-sub{font-size:clamp(14px,1.5vw,16px);color:var(--text-dim);line-height:1.75;max-width:520px;margin:0 auto;}

.inst-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;}
.inst-card{background:var(--card);border:1px solid var(--border2);border-radius:16px;padding:clamp(20px,3vw,28px);transition:all 0.25s;position:relative;overflow:hidden;cursor:pointer;text-decoration:none;display:block;}
.inst-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.1);}
.inst-icon-wrap{width:48px;height:48px;border-radius:13px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;flex-shrink:0;font-size:24px;}
.inst-name{font-size:16px;font-weight:700;margin-bottom:8px;color:var(--text);}
.inst-desc{font-size:13px;color:var(--text-muted);line-height:1.65;}
.inst-tag{display:inline-block;margin-top:14px;font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;margin-left:6px;}

.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(40px,6vw,80px);align-items:center;}
.features-list{display:flex;flex-direction:column;gap:16px;}
.feature-item{display:flex;gap:16px;align-items:flex-start;padding:18px;border-radius:14px;border:1px solid transparent;transition:all 0.2s;cursor:default;}
.feature-item:hover{background:rgba(255,255,255,0.03);border-color:var(--border);}
.feature-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px;}
.feature-title{font-size:15px;font-weight:700;margin-bottom:5px;color:var(--text);}
.feature-desc{font-size:13px;color:var(--text-muted);line-height:1.65;}

.mockup-wrap{background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:18px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.5);}
.mockup-bar{padding:12px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:7px;}
.mockup-dot{width:9px;height:9px;border-radius:50%;}
.mockup-url{flex:1;text-align:center;font-size:10px;color:rgba(238,238,245,0.25);}
.mockup-body{padding:18px;}
.mockup-title{font-size:12px;font-weight:700;color:var(--gold);margin-bottom:12px;}
.m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px;}
.m-stat{background:rgba(255,255,255,0.03);border:1px solid var(--border2);border-radius:9px;padding:12px;}
.m-val{font-size:20px;font-weight:800;line-height:1;color:var(--text);}
.m-lbl{font-size:9px;color:var(--text-muted);margin-top:3px;}
.m-progress{height:3px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;margin-top:12px;}
.m-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--blue));border-radius:2px;}

.roles-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;}
.role-card{background:var(--card);border:1px solid var(--border2);border-radius:13px;padding:18px 14px;text-align:center;transition:all 0.2s;}
.role-card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,0.1);}
.role-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:20px;}
.role-name{font-size:13px;font-weight:700;margin-bottom:4px;color:var(--text);}
.role-desc{font-size:11px;color:var(--text-muted);line-height:1.5;}

.int-grid{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:40px;}
.int-chip{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border2);border-radius:10px;padding:9px 16px;font-size:13px;font-weight:600;color:var(--text-dim);transition:all 0.2s;}
.int-chip:hover{border-color:var(--gold-border);color:var(--text);}

.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px;}
.price-card{background:var(--card);border:1px solid var(--border2);border-radius:20px;padding:clamp(24px,3vw,32px);position:relative;overflow:hidden;transition:all 0.25s;}
.price-card:hover{transform:translateY(-4px);}
.price-card.featured{background:linear-gradient(135deg,rgba(212,168,67,0.07),rgba(212,168,67,0.02));border-color:var(--gold-border);box-shadow:0 0 50px rgba(212,168,67,0.07);}
.price-badge{position:absolute;top:18px;left:18px;background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;font-size:10px;font-weight:800;padding:3px 11px;border-radius:20px;letter-spacing:0.5px;}
.price-name{font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;}
.price-amount{font-size:clamp(28px,3vw,38px);font-weight:800;line-height:1;color:var(--text);}
.price-amount span{font-size:13px;color:var(--text-muted);font-weight:400;}
.price-period{font-size:12px;color:var(--text-muted);margin-top:4px;}
.price-divider{height:1px;background:var(--border);margin:22px 0;}
.price-features{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:26px;}
.price-features li{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--text-dim);}
.price-features li.off{color:var(--text-muted);}
.check-icon{flex-shrink:0;color:var(--green);}
.off-icon{flex-shrink:0;color:var(--text-muted);}
.btn-price{width:100%;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--font);transition:all 0.2s;border:none;}
.btn-outline{background:transparent;border:1px solid var(--border);color:var(--text-dim);}
.btn-outline:hover{border-color:var(--gold-border);color:var(--gold);}
.btn-gold-p{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#000;box-shadow:0 4px 14px rgba(212,168,67,0.3);}
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

@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}

@media(max-width:768px){
  .nav-links{display:none;}
  .hero-cards{grid-template-columns:1fr;max-width:400px;}
  footer{flex-direction:column;text-align:center;}
  .footer-links{justify-content:center;}
}
`;

// 🏛️ أنواع المؤسسات
const institutions = [
  { name: 'المدارس', desc: 'إدارة شاملة للمدارس الأهلية والعالمية', icon: '🏫', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', features: ['جداول دراسية', 'نظام الحضور', 'التقييم'] },
  { name: 'حلقات القرآن', desc: 'متابعة الحفظ والمراجعة للطلاب', icon: '📖', color: '#10B981', bg: 'rgba(16,185,129,0.1)', features: ['تتبع الحفظ', 'تسجيل المراجعة', 'تقارير'] },
  { name: 'المعاهد', desc: 'إدارة الدورات والمتدربين', icon: '📚', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)', features: ['إدارة الدورات', 'شهادات', 'التقييم'] },
  { name: 'مراكز التدريب', desc: 'تدريب مهني وتطوير الموارد البشرية', icon: '💼', color: '#FB923C', bg: 'rgba(251,146,60,0.1)', features: ['خطط تدريب', 'مهارات', 'تقييم'] },
  { name: 'الجامعات', desc: 'نظام متكامل للجامعات والكليات', icon: '🎓', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', features: ['ساعات معتمدة', 'مناهج', 'بحث'] },
  { name: 'الحضانات', desc: 'رعاية وتعليم الأطفال', icon: '🧸', color: '#EC4899', bg: 'rgba(236,72,153,0.1)', features: ['متابعة النمو', 'أنشطة', 'تواصل'] },
];

// 👥 الأدوار
const roles = [
  { name: 'مالك المنصة', desc: 'إدارة كاملة', icon: '👑', color: '#D4A843', bg: 'rgba(212,168,67,0.1)' },
  { name: 'مدير المؤسسة', desc: 'إدارة يومية', icon: '⚡', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  { name: 'المعلم', desc: 'إدارة الطلاب', icon: '📖', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'ولي الأمر', desc: 'متابعة الأبناء', icon: '👨‍👩‍👧', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
];

// 💰 خطط الأسعار
const pricingPlans = [
  { name: 'مجاني', price: '0', period: 'للأبد', desc: 'للمؤسسات الصغيرة', featured: false, buttonText: 'ابدأ مجاناً', features: [
    { text: '100 طالب', included: true }, { text: '5 معلمين', included: true }, { text: 'مميزات أساسية', included: true },
    { text: 'دعم بالبريد', included: true }, { text: 'تقارير متقدمة', included: false }, { text: 'تكامل حكومي', included: false }
  ]},
  { name: 'متقدم', price: '299', period: 'ريال/شهر', desc: 'للمؤسسات المتوسطة', featured: true, buttonText: 'اشترك الآن', features: [
    { text: '500 طالب', included: true }, { text: '20 معلم', included: true }, { text: 'جميع المميزات', included: true },
    { text: 'دعم فني 24/7', included: true }, { text: 'تقارير متقدمة', included: true }, { text: 'تكامل حكومي', included: false }
  ]},
  { name: 'مؤسسي', price: '599', period: 'ريال/شهر', desc: 'للمنظمات الكبيرة', featured: false, buttonText: 'تواصل معنا', features: [
    { text: 'غير محدود', included: true }, { text: 'دعم VIP', included: true }, { text: 'تخصيص كامل', included: true },
    { text: 'مدير حساب', included: true }, { text: 'تدريب شامل', included: true }, { text: 'تكامل حكومي', included: true }
  ]},
];

// 🔗 التكاملات
const integrations = ['نظام نور 🏛️', 'أبشر 🆔', 'قوى 💼', 'النفاذ الوطني 🔐', 'فارس 🎖️', 'مدرستي 📱', 'توكلنا ✅', 'سدايا 🤖'];

// ✨ المميزات
const features = [
  { icon: '🎨', title: 'تخصيص كامل', desc: 'صمم منصتك بألوان وهوية خاصة', color: '#D4A843', bg: 'rgba(212,168,67,0.1)' },
  { icon: '📊', title: 'تقارير ذكية', desc: 'تحليلات متقدمة لأداء المؤسسة', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
  { icon: '🔒', title: 'أمان عالي', desc: 'حماية البيانات بتشفير متقدم', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  { icon: '📱', title: 'تطبيق جوال', desc: 'وصول من أي مكان وفي أي وقت', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.head.removeChild(style);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div dir="rtl">
      {/* 🧭 Navigation */}
      <nav style={{ background: scrolled ? 'rgba(6,6,14,0.95)' : undefined }}>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">م</div>
          <div>
            <div className="nav-logo-main">متين</div>
            <div className="nav-logo-sub">MATIN.INK</div>
          </div>
        </Link>
        
        <div className="nav-links">
          <Link href="#features">المميزات</Link>
          <Link href="#institutions">المؤسسات</Link>
          <Link href="#pricing">الأسعار</Link>
          <Link href="#roles">الأدوار</Link>
          <Link href="/login">تسجيل الدخول</Link>
        </div>
        
        <Link href="/register">
          <button className="nav-cta">ابدأ مجاناً</button>
        </Link>
      </nav>

      {/* 🦸 Hero */}
      <section className="hero">
        <div className="hero-glow"></div>
        
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          منصة سعودية 100%
        </div>
        
        <h1 className="hero-title">
          نظام إدارة التعليم<br />
          <span className="hero-title-gold">الأكثر تكاملاً</span>
        </h1>
        
        <p className="hero-sub">
          حل شامل وذكي لإدارة المؤسسات التعليمية بالذكاء الاصطناعي<br />
          متكامل مع الأنظمة الحكومية السعودية
        </p>
        
        <div className="hero-actions">
          <Link href="/register">
            <button className="btn-primary">🚀 ابدأ مجاناً</button>
          </Link>
          <Link href="/demo">
            <button className="btn-secondary">▶️ شاهد العرض</button>
          </Link>
        </div>
        
        <div className="hero-cards">
          {[
            { icon: '🎓', title: '6 أنواع مؤسسات', desc: 'مدارس، جامعات، معاهد، حضانات، تحفيظ، تدريب', color: '#60A5FA' },
            { icon: '👥', title: '11 دور مستخدم', desc: 'من مالك المنصة حتى الطالب والولي', color: '#10B981' },
            { icon: '🤖', title: 'ذكاء اصطناعي', desc: 'تحليلات ذكية وتقارير تنبؤية', color: '#A78BFA' },
            { icon: '🔐', title: 'تكامل حكومي', desc: 'نور، أبشر، قوى، النفاذ الوطني', color: '#FB923C' },
          ].map((card, i) => (
            <div key={i} className="hero-card">
              <div className="hero-card-icon" style={{ background: `${card.color}15` }}>{card.icon}</div>
              <div className="hero-card-title">{card.title}</div>
              <div className="hero-card-desc">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🏛️ Institutions */}
      <section id="institutions">
        <div className="sec-center">
          <div className="sec-tag">🏛️ المؤسسات</div>
          <h2 className="sec-title">حلول لكل نوع من المؤسسات</h2>
          <p className="sec-sub">منصة متين تدعم 6 أنواع مختلفة من المؤسسات التعليمية</p>
        </div>
        
        <div className="inst-grid">
          {institutions.map((inst, i) => (
            <Link key={i} href={`/institutions/${inst.name}`} className="inst-card">
              <div className="inst-icon-wrap" style={{ background: inst.bg }}>{inst.icon}</div>
              <div className="inst-name">{inst.name}</div>
              <div className="inst-desc">{inst.desc}</div>
              <div style={{ marginTop: 14 }}>
                {inst.features.map((feat, j) => (
                  <span key={j} className="inst-tag" style={{ color: inst.color, background: `${inst.color}15` }}>{feat}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ✨ Features */}
      <section id="features">
        <div className="features-grid">
          <div>
            <div className="sec-tag">✨ المميزات</div>
            <h2 className="sec-title">كل ما تحتاجه في منصة واحدة</h2>
            <p className="sec-sub">متين تجمع بين القوة والبساطة لتقديم تجربة فريدة</p>
            
            <div className="features-list">
              {features.map((feat, i) => (
                <div key={i} className="feature-item">
                  <div className="feature-icon" style={{ background: feat.bg }}>{feat.icon}</div>
                  <div>
                    <div className="feature-title">{feat.title}</div>
                    <div className="feature-desc">{feat.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mockup-wrap">
            <div className="mockup-bar">
              {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => (
                <div key={i} className="mockup-dot" style={{ background: c }}></div>
              ))}
              <div className="mockup-url">dashboard.matin.ink</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-title">📊 إحصائيات اليوم</div>
              <div className="m-grid">
                {[{ val: '1,247', lbl: 'طالب نشط' }, { val: '89%', lbl: 'نسبة الحضور' }, { val: '156', lbl: 'حلقة اليوم' }].map((s, i) => (
                  <div key={i} className="m-stat">
                    <div className="m-val">{s.val}</div>
                    <div className="m-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
              <div className="m-progress"><div className="m-fill" style={{ width: '75%' }}></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 Roles */}
      <section id="roles">
        <div className="sec-center">
          <div className="sec-tag">👥 الأدوار</div>
          <h2 className="sec-title">نظام أدوار مرن ومتكامل</h2>
        </div>
        
        <div className="roles-grid">
          {roles.map((role, i) => (
            <div key={i} className="role-card">
              <div className="role-icon" style={{ background: role.bg }}>{role.icon}</div>
              <div className="role-name">{role.name}</div>
              <div className="role-desc">{role.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔗 Integrations */}
      <section>
        <div className="sec-center">
          <h2 className="sec-title">متصل بـ <span style={{ color: '#D4A843' }}>الأنظمة الحكومية</span></h2>
        </div>
        <div className="int-grid">
          {integrations.map((int, i) => (
            <div key={i} className="int-chip">{int}</div>
          ))}
        </div>
      </section>

      {/* 💰 Pricing */}
      <section id="pricing">
        <div className="sec-center">
          <div className="sec-tag">💰 الأسعار</div>
          <h2 className="sec-title">اختر خطتك</h2>
          <p className="sec-sub">أسعار مرنة تناسب كل مؤسسة</p>
        </div>
        
        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`price-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="price-badge">الأكثر شعبية</div>}
              <div className="price-name">{plan.name}</div>
              <div className="price-amount">{plan.price} <span>{plan.period}</span></div>
              <div className="price-period">{plan.desc}</div>
              <div className="price-divider"></div>
              <ul className="price-features">
                {plan.features.map((feat, j) => (
                  <li key={j} className={feat.included ? '' : 'off'}>
                    <span className={feat.included ? 'check-icon' : 'off-icon'}>{feat.included ? '✓' : '✗'}</span>
                    {feat.text}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className={`btn-price ${plan.featured ? 'btn-gold-p' : 'btn-outline'}`}>{plan.buttonText}</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 🎯 CTA */}
      <section className="cta-wrap">
        <div className="cta-bg"></div>
        <h2 className="cta-title">جاهز لتحويل <span style={{ color: '#D4A843' }}>مؤسستك؟</span></h2>
        <p className="cta-sub">انضم للمئات من المؤسسات التعليمية التي تثق بمتين</p>
        <div className="cta-actions">
          <Link href="/register"><button className="btn-primary">🚀 ابدأ مجاناً الآن</button></Link>
          <Link href="/contact"><button className="btn-secondary">📞 تحدث مع فريقنا</button></Link>
        </div>
      </section>

      {/* 🦶 Footer */}
      <footer>
        <div className="footer-logo">
          <div className="footer-logo-icon">م</div>
          <p>© 2026 متين - جميع الحقوق محفوظة</p>
        </div>
        <div className="footer-links">
          <Link href="/privacy">سياسة الخصوصية</Link>
          <Link href="/terms">الشروط والأحكام</Link>
          <Link href="/contact">تواصل معنا</Link>
        </div>
      </footer>
    </div>
  );
}
