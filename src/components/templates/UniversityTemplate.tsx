'use client';
import React, { useState } from 'react';

interface UniversityTemplateProps {
  data: {
    name: string;
    logo?: string;
    cover_image?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    font_family?: string;
    show_global_ads?: boolean;
    phone?: string;
    email?: string;
    address?: string;
  };
  globalAds?: any[];
  globalProducts?: any[];
}

const UniversityTemplate: React.FC<UniversityTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [admOpen, setAdmOpen] = useState(false);
  const [mobNav, setMobNav] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const pc = data.primary_color || '#1A56DB';
  const sc = data.secondary_color || '#1E3A8A';
  const ac = data.accent_color || '#F59E0B';

  const colleges = [
    { name: 'كلية الحوسبة وتقنية المعلومات', desc: 'هندسة البرمجيات، الذكاء الاصطناعي، أمن المعلومات', students: '2,400+', tag: 'الأكثر طلباً', grad: `linear-gradient(90deg,${pc},#60A5FA)` },
    { name: 'كلية الطب والعلوم الصحية', desc: 'طب بشري، تمريض، صيدلة، علاج طبيعي', students: '1,800+', tag: 'مختبرات متقدمة', grad: 'linear-gradient(90deg,#10B981,#059669)' },
    { name: 'كلية الهندسة', desc: 'مدني، كهربائي، ميكانيكي، كيميائي، معماري', students: '2,100+', tag: 'معتمدة ABET', grad: `linear-gradient(90deg,${ac},#FB923C)` },
    { name: 'كلية إدارة الأعمال', desc: 'محاسبة، تمويل، تسويق، إدارة موارد بشرية', students: '1,600+', tag: 'معتمدة AACSB', grad: 'linear-gradient(90deg,#A78BFA,#7C3AED)' },
    { name: 'كلية العلوم', desc: 'رياضيات، فيزياء، كيمياء، أحياء', students: '900+', tag: 'أبحاث متقدمة', grad: 'linear-gradient(90deg,#22D3EE,#0E7490)' },
    { name: 'كلية القانون والشريعة', desc: 'قانون، شريعة إسلامية، دراسات قضائية', students: '700+', tag: 'معتمدة وزارياً', grad: 'linear-gradient(90deg,#FB923C,#C2410C)' },
    { name: 'كلية الفنون والتصميم', desc: 'تصميم جرافيك، وسائط متعددة، تصميم داخلي', students: '500+', tag: 'استوديوهات حديثة', grad: 'linear-gradient(90deg,#D4A843,#E8C060)' },
    { name: 'كلية العلوم الإنسانية', desc: 'لغات، ترجمة، علم نفس، علوم اجتماعية', students: '600+', tag: 'تبادل دولي', grad: 'linear-gradient(90deg,#EF4444,#B91C1C)' },
  ];

  const portals = [
    { title: 'بوابة الطالب', desc: 'الجدول، المحاضرات، النتائج، التسجيل', icon: 'M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5', color: pc },
    { title: 'بوابة هيئة التدريس', desc: 'المقررات، الحضور، الدرجات، الأبحاث', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', color: '#22D3EE' },
    { title: 'بوابة ولي الأمر', desc: 'المعدل، الحضور، الرسوم، التواصل', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', color: ac },
    { title: 'بوابة الإدارة', desc: 'التقارير، الموظفون، المالية، الأنظمة', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z', color: '#A78BFA' },
  ];

  const features = [
    { title: 'الجداول الذكية', desc: 'إنشاء جداول دراسية ذكية تتوافق مع القاعات والأوقات تلقائياً', icon: 'M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z', color: pc },
    { title: 'المحاضرات الذكية', desc: 'بث مباشر مع مراقبة AI للحضور وتسجيل تلقائي', icon: 'M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', color: '#22D3EE' },
    { title: 'نظام الاختبارات', desc: 'اختبارات أونلاين مع مراقبة ذكية ومنع الغش', icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', color: '#A78BFA' },
    { title: 'AI Career Pathing', desc: 'توجيه مهني ذكي بناءً على أداء الطالب الأكاديمي', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3', color: '#10B981' },
    { title: 'جواز سفر المهارات', desc: 'توثيق المهارات والشهادات والخبرات في ملف رقمي موحد', icon: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z', color: ac },
    { title: 'الدفع والأقساط', desc: 'نظام دفع إلكتروني متكامل مع خطط تقسيط مرنة', icon: 'M1 4h22v16H1z M1 10h22', color: '#EF4444' },
  ];

  const programs = [
    { name: 'هندسة البرمجيات', dept: 'كلية الحوسبة', duration: '4 سنوات', type: 'بكالوريوس', color: pc },
    { name: 'الذكاء الاصطناعي', dept: 'كلية الحوسبة', duration: '4 سنوات', type: 'بكالوريوس', color: '#22D3EE' },
    { name: 'طب بشري', dept: 'كلية الطب', duration: '6 سنوات', type: 'بكالوريوس', color: '#10B981' },
    { name: 'هندسة مدنية', dept: 'كلية الهندسة', duration: '5 سنوات', type: 'بكالوريوس', color: ac },
    { name: 'محاسبة وتمويل', dept: 'كلية الأعمال', duration: '4 سنوات', type: 'بكالوريوس', color: '#A78BFA' },
    { name: 'كيمياء', dept: 'كلية العلوم', duration: '4 سنوات', type: 'بكالوريوس', color: '#22D3EE' },
    { name: 'فقه إسلامي', dept: 'كلية الشريعة', duration: '4 سنوات', type: 'بكالوريوس', color: '#FB923C' },
    { name: 'تصميم جرافيك', dept: 'كلية الفنون', duration: '4 سنوات', type: 'بكالوريوس', color: '#D4A843' },
    { name: 'علم النفس', dept: 'كلية العلوم الإنسانية', duration: '4 سنوات', type: 'بكالوريوس', color: '#EF4444' },
  ];

  const accreditations = ['NCAAA', 'ABET', 'QS Stars', 'AACSB', 'ISO 9001'];
  const navLinks = ['الرئيسية', 'الكليات والأقسام', 'البرامج الأكاديمية', 'القبول والتسجيل', 'أخبار الجامعة', 'تواصل معنا'];
  const tabs = ['طالب', 'عضو هيئة التدريس', 'ولي الأمر', 'إدارة'];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", backgroundColor: '#06060E', color: '#EEEEF5', minHeight: '100vh', direction: 'rtl' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--uni-p:${pc};--uni-s:${sc};--uni-a:${ac};--b1:rgba(255,255,255,.08);--b2:rgba(255,255,255,.04);--t:#EEEEF5;--td:rgba(238,238,245,.6);--tm:rgba(238,238,245,.3);--card:rgba(255,255,255,.03);--gd:#D4A843;--gd2:#E8C060;--gr:#10B981;--rd:#EF4444;--or:#FB923C;--pu:#A78BFA;--cy:#22D3EE;--bl:#60A5FA}
        .sec-inner{max-width:1280px;margin:0 auto;padding:0 24px}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .uni-card:hover{transform:translateY(-4px)!important;box-shadow:0 12px 40px rgba(0,0,0,.5)!important}
        .feat-card:hover{border-color:rgba(255,255,255,.12)!important;background:rgba(255,255,255,.04)!important}
        .portal-item:hover{transform:translateY(-3px)!important}
        .prog-card:hover{border-color:rgba(255,255,255,.12)!important}
        .store-card:hover{transform:translateY(-3px)!important}
        .nav-link:hover{color:var(--t)!important}
        a{text-decoration:none;color:inherit}
      `}} />

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 66, background: 'rgba(6,6,14,.92)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--b1)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${pc},${sc})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {data.logo ? <img src={data.logo} alt="" style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} /> : '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" /></svg>'}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>{data.name}</div>
              <div style={{ fontSize: 10, color: 'var(--tm)' }}>منصة متين للتعليم السحابي</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24 }} className="nav-links-wrap">
            {navLinks.map((l, i) => (
              <div key={i} className="nav-link" style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? pc : 'var(--td)', cursor: 'pointer', transition: 'color .2s' }}>{l}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setLoginOpen(true)} style={{ background: 'transparent', border: `1px solid var(--b1)`, color: 'var(--t)', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>تسجيل الدخول</button>
            <button onClick={() => setAdmOpen(true)} style={{ background: pc, border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>التقديم الآن</button>
          </div>
          <div onClick={() => setMobNav(true)} style={{ display: 'none', cursor: 'pointer', padding: 8 }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', paddingTop: 66, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 25% 40%,rgba(26,86,219,.1) 0%,transparent 55%),radial-gradient(ellipse at 78% 55%,rgba(245,158,11,.06) 0%,transparent 50%)` }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize: '52px 52px', opacity: 0.4 }} />
        <div className="sec-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 500px', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(26,86,219,.08)', border: '1px solid rgba(26,86,219,.2)', marginBottom: 24, fontSize: 12, fontWeight: 600, color: 'var(--td)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
              معتمدة من وزارة التعليم
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.2, marginBottom: 20, letterSpacing: '-1px' }}>
              بناء <em style={{ color: pc, fontStyle: 'normal' }}>قادة الغد</em><br />بعلم اليوم
            </h1>
            <p style={{ fontSize: 16, color: 'var(--td)', lineHeight: 1.8, marginBottom: 32, maxWidth: 520 }}>
              {data.description || `${data.name} — بيئة أكاديمية متكاملة تجمع بين التميز العلمي والتقنيات الحديثة، لتخريج كوادر مؤهلة تقود مسيرة التنمية.`}
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              <button onClick={() => setAdmOpen(true)} style={{ background: pc, border: 'none', color: '#fff', padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>قدّم الآن</button>
              <button style={{ background: 'transparent', border: '1px solid var(--b1)', color: 'var(--t)', padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>جولة افتراضية</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { val: '18,400+', label: 'طالب وطالبة' },
                { val: '12', label: 'كلية متخصصة' },
                { val: '94%', label: 'نسبة التوظيف' },
                { val: '38', label: 'عاماً من التميز' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: i === 0 ? pc : i === 3 ? '#D4A843' : 'var(--t)' }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--tm)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, right: -10, background: 'rgba(10,15,30,.92)', border: '1px solid var(--b1)', borderRadius: 14, padding: '12px 18px', zIndex: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg></span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>الأفضل محلياً 2024</div>
                <div style={{ fontSize: 10, color: 'var(--tm)' }}>تصنيف QS العربي</div>
              </div>
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b1)', borderRadius: 20, padding: 24, backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>لوحة الطالب</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#10B981' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 1.5s infinite' }} />LIVE
                </div>
              </div>
              {[
                { label: 'المواد المسجلة', val: '6 مواد', badge: 'مكتملة', bc: 'rgba(96,165,250,.1)', btc: '#60A5FA', bbc: 'rgba(96,165,250,.22)' },
                { label: 'نسبة الحضور', val: '94%', badge: 'جيد', bc: 'rgba(16,185,129,.1)', btc: '#10B981', bbc: 'rgba(16,185,129,.22)' },
                { label: 'الواجبات المعلقة', val: '3 واجبات', badge: 'عاجل', bc: 'rgba(245,158,11,.1)', btc: '#F59E0B', bbc: 'rgba(245,158,11,.22)' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--b2)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--tm)' }}>{f.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{f.val}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: f.bc, color: f.btc, border: `1px solid ${f.bbc}` }}>{f.badge}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                  <span style={{ color: 'var(--tm)' }}>المعدل التراكمي GPA</span>
                  <span style={{ fontWeight: 700 }}>3.72 / 5.00</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '74.4%', height: '100%', background: `linear-gradient(90deg,${pc},${ac})`, borderRadius: 3 }} />
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -15, left: -10, background: 'rgba(10,15,30,.92)', border: '1px solid var(--b1)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg></span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>فرص توظيف متاحة</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#10B981' }}>47 فرصة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ padding: '0 24px 60px' }}>
        <div className="sec-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, background: 'var(--b1)', borderRadius: 16, overflow: 'hidden' }}>
            {[
              { val: '12+', label: 'كلية متخصصة', color: pc },
              { val: '840+', label: 'عضو هيئة تدريس', color: '#A78BFA' },
              { val: '68+', label: 'برنامج أكاديمي', color: '#22D3EE' },
              { val: '94%', label: 'نسبة التوظيف', color: '#10B981' },
              { val: '120+', label: 'شراكة دولية', color: ac },
            ].map((s, i) => (
              <div key={i} style={{ background: '#06060E', padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'var(--tm)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLEGES */}
      <section style={{ padding: '60px 0' }}>
        <div className="sec-inner">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: `rgba(26,86,219,.08)`, border: `1px solid rgba(26,86,219,.2)`, fontSize: 11, fontWeight: 600, color: pc, marginBottom: 12 }}>الكليات والأقسام</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>كليات متخصصة بمعايير عالمية</h2>
            <p style={{ fontSize: 14, color: 'var(--td)', maxWidth: 500 }}>برامج أكاديمية معتمدة تغطي كافة التخصصات العلمية والأدبية</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {colleges.map((c, i) => (
              <div key={i} className="uni-card" style={{ position: 'relative', background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all .3s' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c.grad, borderRadius: '16px 16px 0 0' }} />
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.grad.includes(pc) ? pc : c.grad.split(',')[1]?.split(')')[0] || pc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M5 21V7l7-4 7 4v14 M9 21v-4a3 3 0 0 1 6 0v4" /></svg></div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'var(--tm)', lineHeight: 1.6, marginBottom: 12 }}>{c.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--td)' }}>{c.students} طالب</div>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,.04)', color: 'var(--tm)', fontWeight: 600 }}>{c.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTALS */}
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,.015)', borderTop: '1px solid var(--b2)', borderBottom: '1px solid var(--b2)' }}>
        <div className="sec-inner">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(212,168,67,.08)', border: '1px solid rgba(212,168,67,.2)', fontSize: 11, fontWeight: 600, color: '#D4A843', marginBottom: 12 }}>البوابات الإلكترونية</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>بوابتك الخاصة بنقرة واحدة</h2>
            <p style={{ fontSize: 14, color: 'var(--td)' }}>ادخل من بوابتك المخصصة للوصول لجميع خدماتك</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {portals.map((p, i) => (
              <div key={i} className="portal-item" onClick={() => setLoginOpen(true)} style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 16, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'all .3s' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${p.color}15`, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg></div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--tm)', lineHeight: 1.6 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 0' }}>
        <div className="sec-inner">
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(34,211,238,.08)', border: '1px solid rgba(34,211,238,.2)', fontSize: 11, fontWeight: 600, color: '#22D3EE', marginBottom: 12 }}>خدمات ذكية</div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>تقنيات تعليمية متقدمة</h2>
            <p style={{ fontSize: 14, color: 'var(--td)' }}>أدوات ذكية تساعد الطالب وعضو هيئة التدريس</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 16, padding: 24, transition: 'all .3s', cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg></div>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--tm)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,.01)', borderTop: '1px solid var(--b2)', borderBottom: '1px solid var(--b2)' }}>
        <div className="sec-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.2)', fontSize: 11, fontWeight: 600, color: '#A78BFA', marginBottom: 16 }}>مساعد ذكي</div>
              <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>مساعدك الأكاديمي الذكي</h2>
              <p style={{ fontSize: 13, color: 'var(--td)', lineHeight: 1.8, marginBottom: 24 }}>يجيب على استفساراتك حول القبول، البرامج، المتطلبات والمزيد</p>
              {['إجابات فورية 24/7', 'معلومات محدثة ودقيقة', 'دعم متعدد اللغات'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(167,139,250,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b1)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                <div style={{ alignSelf: 'flex-start', background: `${pc}15`, border: `1px solid ${pc}30`, borderRadius: '12px 12px 4px 12px', padding: '10px 16px', maxWidth: '80%', fontSize: 13 }}>ما هي متطلبات القبول في كلية الحوسبة؟</div>
                <div style={{ alignSelf: 'flex-end', background: 'rgba(255,255,255,.04)', border: '1px solid var(--b1)', borderRadius: '12px 12px 12px 4px', padding: '10px 16px', maxWidth: '80%', fontSize: 13, color: 'var(--td)' }}>
                  مرحباً! متطلبات القبول في كلية الحوسبة تشمل: الثانوية العامة بمعدل 80%+ (علمي)، اختبار القدرات 70+، واختبار التحصيلي 65+.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="اسأل المساعد الذكي..." style={{ flex: 1, background: 'rgba(255,255,255,.04)', border: '1px solid var(--b2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--t)', outline: 'none', fontFamily: 'inherit' }} />
                <button style={{ background: pc, border: 'none', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>إرسال</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACADEMIC PROGRAMS */}
      <section style={{ padding: '60px 0' }}>
        <div className="sec-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', fontSize: 11, fontWeight: 600, color: '#10B981', marginBottom: 12 }}>البرامج الأكاديمية</div>
              <h2 style={{ fontSize: 28, fontWeight: 900 }}>تخصصات متنوعة تناسب طموحك</h2>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--b1)', color: 'var(--td)', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>جميع البرامج ←</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {programs.map((p, i) => (
              <div key={i} className="prog-card" style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 14, padding: 18, transition: 'all .3s', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 10 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg></div>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--tm)', marginBottom: 10 }}>{p.dept}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,.04)', color: 'var(--td)', fontWeight: 600 }}>{p.duration}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: `${p.color}12`, color: p.color, fontWeight: 600 }}>{p.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section style={{ padding: '60px 0' }}>
        <div className="sec-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', fontSize: 11, fontWeight: 600, color: ac, marginBottom: 12 }}>آخر الأخبار</div>
              <h2 style={{ fontSize: 28, fontWeight: 900 }}>أخبار ومستجدات الجامعة</h2>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--b1)', color: 'var(--td)', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>جميع الأخبار ←</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 200, background: `linear-gradient(135deg,${pc}20,${sc}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg></div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 10, color: ac, fontWeight: 600, marginBottom: 8 }}>أكاديمي · 15 مارس 2025</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>افتتاح مختبر الذكاء الاصطناعي المتقدم</div>
                <div style={{ fontSize: 12, color: 'var(--tm)', lineHeight: 1.6 }}>تم افتتاح المختبر الجديد بأحدث التجهيزات لدعم الأبحاث والمشاريع الطلابية</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'فتح باب القبول للفصل الثاني', date: '10 مارس 2025', cat: 'قبول' },
                { title: 'ندوة حول ريادة الأعمال الرقمية', date: '8 مارس 2025', cat: 'فعاليات' },
                { title: 'نتائج مسابقة البرمجة السنوية', date: '5 مارس 2025', cat: 'مسابقات' },
              ].map((n, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 14, padding: 16, display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: `rgba(${i === 0 ? '26,86,219' : i === 1 ? '167,139,250' : '245,158,11'},.08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{i === 0 ? '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" /></svg>' : i === 1 ? '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 1 0 8 M11.86 17.86c.47.12.95.14 1.14.14a3 3 0 0 0 0-6 M19 12H21 M3 8h2v8H3z M5 8l6 4-6 4V8z" /></svg>' : '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>'}</div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--tm)', marginBottom: 4 }}>{n.cat} · {n.date}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS */}
      <section style={{ padding: '60px 0', background: 'rgba(255,255,255,.015)', borderTop: '1px solid var(--b2)' }}>
        <div className="sec-inner" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(212,168,67,.08)', border: '1px solid rgba(212,168,67,.2)', fontSize: 11, fontWeight: 600, color: '#D4A843', marginBottom: 12 }}>الاعتمادات والتصنيفات</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>معتمدون من أرقى الجهات الدولية</h2>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 20 }}>
            {accreditations.map((a, i) => (
              <div key={i} style={{ width: 140, background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,168,67,.08)', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12" /></svg></div>
                <div style={{ fontSize: 13, fontWeight: 800 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORE */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--b2)' }}>
        <div className="sec-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 8, background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.2)', fontSize: 11, fontWeight: 600, color: ac, marginBottom: 12 }}>متجر الجامعة</div>
              <h2 style={{ fontSize: 28, fontWeight: 900 }}>منتجات وهدايا الجامعة</h2>
            </div>
            <button style={{ background: 'transparent', border: '1px solid var(--b1)', color: 'var(--td)', padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>جميع المنتجات ←</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {[
              { name: 'حقيبة الجامعة الرسمية', price: '189', color: pc },
              { name: 'مجموعة الكتب المرجعية', price: '320', color: '#10B981' },
              { name: 'هودي الجامعة', price: '119', color: '#A78BFA' },
              { name: 'أدوات مكتبية فاخرة', price: '75', color: ac },
            ].map((p, i) => (
              <div key={i} className="store-card" style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all .3s' }}>
                <div style={{ height: 140, background: `linear-gradient(135deg,${p.color}20,${p.color}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" /></svg></div>
                <div style={{ padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: p.color }}>{p.price} ر.س</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--b1)', padding: '48px 0 0' }}>
        <div className="sec-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: `linear-gradient(135deg,${pc},${sc})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" /></svg></div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{data.name}</div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--tm)', lineHeight: 1.8, marginBottom: 16 }}>مؤسسة تعليمية رائدة تسعى لتقديم تعليم عالي الجودة يواكب متطلبات سوق العمل</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['𝕏', 'in', '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>', '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /></svg>'].map((s, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,.04)', border: '1px solid var(--b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, cursor: 'pointer' }}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>الكليات</div>
              {['الحوسبة', 'الطب', 'الهندسة', 'الأعمال', 'العلوم'].map((l, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--tm)', marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>الخدمات</div>
              {['القبول والتسجيل', 'المكتبة الرقمية', 'الدعم الفني', 'التوظيف', 'المنح'].map((l, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--tm)', marginBottom: 10, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 16 }}>تواصل معنا</div>
              {data.phone && <div style={{ fontSize: 12, color: 'var(--tm)', marginBottom: 10 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> {data.phone}</div>}
              {data.email && <div style={{ fontSize: 12, color: 'var(--tm)', marginBottom: 10 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" /></svg> {data.email}</div>}
              {data.address && <div style={{ fontSize: 12, color: 'var(--tm)', marginBottom: 10 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg> {data.address}</div>}
              {!data.phone && !data.email && <div style={{ fontSize: 12, color: 'var(--tm)' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg> المملكة العربية السعودية</div>}
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--b2)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--tm)' }}>© 2025 {data.name}. جميع الحقوق محفوظة.</div>
            <div style={{ fontSize: 11, color: 'var(--tm)' }}>مدعومة بـ <strong style={{ color: '#D4A843' }}>منصة متين</strong> <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg></div>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setLoginOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0D1424', border: '1px solid var(--b1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>تسجيل الدخول</h3>
              <div onClick={() => setLoginOpen(false)} style={{ cursor: 'pointer', fontSize: 18, color: 'var(--tm)' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18 M6 6l12 12" /></svg></div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,.03)', borderRadius: 10, padding: 4 }}>
              {tabs.map((t, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: activeTab === i ? pc : 'transparent', color: activeTab === i ? '#fff' : 'var(--tm)', transition: 'all .2s', fontFamily: 'inherit' }}>{t}</button>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--td)', display: 'block', marginBottom: 6 }}>رقم الهوية / الرقم الجامعي</label>
              <input style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b1)', background: 'rgba(255,255,255,.03)', color: 'var(--t)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} placeholder="أدخل رقم الهوية" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--td)', display: 'block', marginBottom: 6 }}>كلمة المرور</label>
              <input type="password" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b1)', background: 'rgba(255,255,255,.03)', color: 'var(--t)', fontSize: 14, outline: 'none', fontFamily: 'inherit' }} placeholder="أدخل كلمة المرور" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 12 }}>
              <label style={{ color: 'var(--td)', cursor: 'pointer' }}><input type="checkbox" style={{ marginLeft: 6 }} />تذكرني</label>
              <span style={{ color: pc, cursor: 'pointer' }}>نسيت كلمة المرور؟</span>
            </div>
            <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: pc, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>دخول</button>
            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'var(--tm)' }}>أو الدخول عبر <strong style={{ color: '#10B981' }}>نفاذ</strong></div>
          </div>
        </div>
      )}

      {/* ADMISSION MODAL */}
      {admOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAdmOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0D1424', border: '1px solid var(--b1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>التقديم للقبول</h3>
              <div onClick={() => setAdmOpen(false)} style={{ cursor: 'pointer', fontSize: 18, color: 'var(--tm)' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18 M6 6l12 12" /></svg></div>
            </div>
            {[
              { label: 'الاسم الكامل', ph: 'أدخل اسمك الكامل' },
              { label: 'رقم الهوية الوطنية', ph: '10 أرقام' },
              { label: 'البريد الإلكتروني', ph: 'example@email.com' },
              { label: 'رقم الجوال', ph: '05xxxxxxxx' },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--td)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b1)', background: 'rgba(255,255,255,.03)', color: 'var(--t)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} placeholder={f.ph} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--td)', display: 'block', marginBottom: 6 }}>الكلية المطلوبة</label>
              <select style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--b1)', background: '#0B0B16', color: 'var(--t)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}>
                {colleges.map((c, i) => <option key={i} style={{ background: '#0B0B16', color: '#EEEEF5' }}>{c.name}</option>)}
              </select>
            </div>
            <button style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: pc, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' }}>إرسال طلب القبول</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityTemplate;
