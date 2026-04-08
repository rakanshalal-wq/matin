'use client';
import React, { useState } from 'react';
import '../../styles/inst-landing.css';

export default function InstituteTemplate() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<nav className="nav">
  <div className="nav-inner">
    <div className="nav-logo">
      <div className="inst-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>
      <div>
        <div className="nav-name">معهد الإتقان للتدريب</div>
        <div className="nav-tag">matin.ink/itqan</div>
      </div>
    </div>
    <div className="nav-links">
      <div className="nav-link">الرئيسية</div>
      <div className="nav-link">البرامج</div>
      <div className="nav-link">المدربون</div>
      <div className="nav-link">الجدول</div>
      <div className="nav-link">الشهادات</div>
      <div className="nav-link">تواصل معنا</div>
    </div>
    <div className="nav-r">
      <button className="nav-login" onClick={() => {openM('loginM')}}>تسجيل الدخول</button>
      <button className="nav-cta" onClick={() => {openM('regM')}}>سجّل الآن</button>
    </div>
    <div className="hamburger" onClick={() => {openMob()}}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </div>
  </div>
</nav>

{/* HERO */}
<section className="hero">
  <div className="hero-bg"></div>
  <div className="hero-grid"></div>
  <div className="hero-inner">
    <div>
      <div className="hero-badge"><span className="bdot"></span>معتمد من هيئة تقييم التعليم · الرياض</div>
      <h1 className="hero-title">طوّر مهاراتك<br /><em>احترافياً وبسرعة</em></h1>
      <p className="hero-sub">معهد الإتقان للتدريب — برامج مكثفة معتمدة بشهادات وطنية ودولية، تحضوري وأونلاين، مع مدربين معتمدين من كبرى الشركات.</p>
      <div className="hero-btns">
        <button className="btn-p" onClick={() => {openM('regM')}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          سجّل في برنامج
        </button>
        <button className="btn-o">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          جولة في المعهد
        </button>
      </div>
      <div className="hero-stats">
        <div><div className="hs-v">14,200<span>+</span></div><div className="hs-l">خريج معتمد</div></div>
        <div><div className="hs-v">68<span> برنامجاً</span></div><div className="hs-l">في 12 تخصص</div></div>
        <div><div className="hs-v">96<span>%</span></div><div className="hs-l">معدل رضا المتدربين</div></div>
        <div><div className="hs-v">48<span>+</span></div><div className="hs-l">مدرب معتمد</div></div>
      </div>
    </div>
    <div className="hero-visual" style={{position:'relative'}}>
      <div className="fl-card fl1">
        <div className="fl-ic" style={{background:'rgba(16,185,129,.12)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div><div className="fl-t">شهادة معتمدة دولياً</div><div className="fl-s">QR للتحقق الفوري</div></div>
      </div>
      <div className="hero-card">
        <div className="hc-hdr">
          <div style={{display:'flex',alignItems:'center',gap:'11px'}}>
            <div className="hc-ic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
            </div>
            <div>
              <div className="hc-title">البرامج المتاحة هذا الشهر</div>
              <div className="hc-sub">ذو القعدة 1446 · دفعة جديدة</div>
            </div>
          </div>
          <div className="live-badge"><span className="ldot"></span>تسجيل مفتوح</div>
        </div>
        <div className="prog-list">
          <div className="prog-row">
            <div className="prog-ic" style={{background:'rgba(14,165,233,.12)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="prog-name">تطوير تطبيقات الويب</div>
              <div className="prog-seats">12 أسبوع · 3 مقاعد متبقية</div>
            </div>
            <div className="prog-status" style={{background:'rgba(239,68,68,.1)',color:'#EF4444',border:'1px solid rgba(239,68,68,.2)'}}>يكاد يمتلئ</div>
          </div>
          <div className="prog-row">
            <div className="prog-ic" style={{background:'rgba(167,139,250,.1)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v2h-2v-2H9v2H7v-2a2 2 0 0 1-2-2v-1H4a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/><circle cx="9" cy="13" r="1" fill="#A78BFA"/><circle cx="15" cy="13" r="1" fill="#A78BFA"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="prog-name">الذكاء الاصطناعي وتعلم الآلة</div>
              <div className="prog-seats">8 أسابيع · 18 مقعداً متاحاً</div>
            </div>
            <div className="prog-status" style={{background:'rgba(16,185,129,.1)',color:'#10B981',border:'1px solid rgba(16,185,129,.2)'}}>متاح</div>
          </div>
          <div className="prog-row">
            <div className="prog-ic" style={{background:'rgba(245,158,11,.1)'}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="prog-name">إدارة المشاريع PMP</div>
              <div className="prog-seats">6 أسابيع · 22 مقعداً متاحاً</div>
            </div>
            <div className="prog-status" style={{background:'rgba(16,185,129,.1)',color:'#10B981',border:'1px solid rgba(16,185,129,.2)'}}>متاح</div>
          </div>
        </div>
        <div className="enroll-bar">
          <div className="eb-top"><span className="eb-lbl">إجمالي المتدربين هذا الشهر</span><span className="eb-val">284 / 320</span></div>
          <div className="eb-track"><div className="eb-fill" style={{width:'88.7%'}}></div></div>
        </div>
      </div>
      <div className="fl-card fl2">
        <div className="fl-ic" style={{background:'rgba(245,158,11,.1)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div><div className="fl-t">تقييم 4.9 / 5</div><div className="fl-s">1,840 تقييم موثق</div></div>
      </div>
    </div>
  </div>
</section>

{/* STATS */}
<section style={{padding:'0 24px 60px'}}>
  <div className="sec-inner">
    <div className="stats-bar">
      <div className="stat-item"><div className="stat-n">68<span>+</span></div><div className="stat-l">برنامجاً تدريبياً</div><div className="stat-ch">↑ 8 برامج جديدة</div></div>
      <div className="stat-item"><div className="stat-n">48<span>+</span></div><div className="stat-l">مدرباً معتمداً</div><div className="stat-ch">↑ 12 مدرب هذا العام</div></div>
      <div className="stat-item"><div className="stat-n">14,200<span>+</span></div><div className="stat-l">خريج معتمد</div><div className="stat-ch">↑ 2,400 هذا العام</div></div>
      <div className="stat-item"><div className="stat-n">96<span>%</span></div><div className="stat-l">معدل الرضا</div><div className="stat-ch">↑ الأعلى إقليمياً</div></div>
      <div className="stat-item"><div className="stat-n">24<span>+</span></div><div className="stat-l">شراكة مع شركات</div><div className="stat-ch">↑ 6 شراكات جديدة</div></div>
    </div>
  </div>
</section>

{/* PROGRAMS */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)',borderBottom:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'32px'}}>
      <div>
        <div className="sec-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          البرامج التدريبية
        </div>
        <h2 className="sec-title">اختر <span>برنامجك</span></h2>
        <p className="sec-sub">برامج مكثفة قصيرة ومتوسطة — حضوري، أونلاين، أو هجين.</p>
      </div>
      <button style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',borderRadius:'10px',padding:'8px 17px',color:'var(--td)',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'var(--f)'}}>جميع البرامج ←</button>
    </div>
    <div className="prog-grid">
      {/* Card 1 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--inst-p),var(--cy))'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(14,165,233,.1)',color:'var(--cy)',border:'1px solid rgba(14,165,233,.22)'}}>مبتدئ ← متقدم</div>
          <div className="pc-hours">96 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(14,165,233,.12)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div className="pc-name">تطوير تطبيقات الويب الكاملة</div>
        <div className="pc-desc">HTML, CSS, JavaScript, React, Node.js — من الصفر حتى النشر الفعلي على السحابة.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--cy)'}}>3,200 ر.س</div>
            <div className="pc-seats">3 مقاعد متبقية فقط</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(14,165,233,.12)',color:'var(--cy)',border:'1px solid rgba(14,165,233,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
      {/* Card 2 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--pu),#7C3AED)'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.22)'}}>متوسط ← متقدم</div>
          <div className="pc-hours">64 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(167,139,250,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v2h-2v-2H9v2H7v-2a2 2 0 0 1-2-2v-1H4a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/></svg>
        </div>
        <div className="pc-name">الذكاء الاصطناعي وتعلم الآلة</div>
        <div className="pc-desc">Python, TensorFlow, Prompt Engineering — مع مشروع حقيقي متكامل في نهاية البرنامج.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--pu)'}}>4,500 ر.س</div>
            <div className="pc-seats">18 مقعداً متاحاً</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
      {/* Card 3 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--or),#C2410C)'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(251,146,60,.1)',color:'var(--or)',border:'1px solid rgba(251,146,60,.22)'}}>جميع المستويات</div>
          <div className="pc-hours">48 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(251,146,60,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </div>
        <div className="pc-name">إدارة المشاريع الاحترافية PMP</div>
        <div className="pc-desc">منهج PMI الدولي — إعداد شامل لاختبار PMP مع محاكاة الاختبار وبنك أسئلة 1000+.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--or)'}}>2,800 ر.س</div>
            <div className="pc-seats">22 مقعداً متاحاً</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(251,146,60,.1)',color:'var(--or)',border:'1px solid rgba(251,146,60,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
      {/* Card 4 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--gr),#059669)'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.22)'}}>مبتدئ ← متوسط</div>
          <div className="pc-hours">40 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(16,185,129,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        </div>
        <div className="pc-name">المالية والمحاسبة المتقدمة</div>
        <div className="pc-desc">القوائم المالية، التحليل المالي، Excell المالي — مع شهادة معتمدة من SOCPA.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--gr)'}}>1,900 ر.س</div>
            <div className="pc-seats">15 مقعداً متاحاً</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
      {/* Card 5 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--gd),var(--gd2))'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(212,168,67,.1)',color:'var(--gd)',border:'1px solid rgba(212,168,67,.22)'}}>متوسط</div>
          <div className="pc-hours">32 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(212,168,67,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="pc-name">القيادة وإدارة الفرق</div>
        <div className="pc-desc">مهارات القيادة الحديثة، إدارة التغيير، التحفيز، وتطوير فرق العمل عالية الأداء.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--gd)'}}>1,600 ر.س</div>
            <div className="pc-seats">28 مقعداً متاحاً</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(212,168,67,.1)',color:'var(--gd)',border:'1px solid rgba(212,168,67,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
      {/* Card 6 */}
      <div className="prog-card">
        <div className="pc-stripe" style={{background:'linear-gradient(90deg,var(--rd),#B91C1C)'}}></div>
        <div className="pc-tag-bar">
          <div className="pc-level" style={{background:'rgba(239,68,68,.1)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.22)'}}>متقدم</div>
          <div className="pc-hours">56 ساعة تدريبية</div>
        </div>
        <div className="pc-ic" style={{background:'rgba(239,68,68,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div className="pc-name">الأمن السيبراني المتقدم</div>
        <div className="pc-desc">اختبار الاختراق، الاستجابة للحوادث، CompTIA Security+ — بيئة اختبار حية.</div>
        <div className="pc-footer">
          <div>
            <div className="pc-price" style={{color:'var(--rd)'}}>5,200 ر.س</div>
            <div className="pc-seats">10 مقاعد فقط</div>
          </div>
          <button className="pc-enroll" style={{background:'rgba(239,68,68,.1)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.25)'}} onClick={() => {openM('regM')}}>سجّل الآن</button>
        </div>
      </div>
    </div>
  </div>
</section>

{/* FEATURES */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        مزايا المعهد
      </div>
      <h2 className="sec-title">لماذا <span>الإتقان؟</span></h2>
      <p className="sec-sub">منظومة تدريبية متكاملة تجمع بين الجودة الأكاديمية وسرعة اكتساب المهارة العملية.</p>
    </div>
    <div className="feat-grid">
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(14,165,233,.12)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        </div>
        <div className="feat-title">شهادات معتمدة وطنياً ودولياً</div>
        <div className="feat-desc">كل شهادة تصدر برمز QR للتحقق الفوري، معتمدة من هيئة تقييم التعليم وجهات دولية معترف بها.</div>
        <span className="feat-tag" style={{background:'rgba(14,165,233,.1)',color:'var(--cy)',border:'1px solid rgba(14,165,233,.22)'}}>QR للتحقق</span>
      </div>
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(16,185,129,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </div>
        <div className="feat-title">3 طرق تدريب مرنة</div>
        <div className="feat-desc">حضوري في مقار المعهد، أونلاين مباشر عبر المنصة، أو هجين — اختر ما يناسب جدولك دون تنازل عن الجودة.</div>
        <span className="feat-tag" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.22)'}}>حضوري · أونلاين · هجين</span>
      </div>
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(245,158,11,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="feat-title">مدربون من الصناعة الفعلية</div>
        <div className="feat-desc">48 مدرباً معتمداً من كبرى الشركات مثل أرامكو، STC، NEOM — خبرة حقيقية لا أكاديمية فقط.</div>
        <span className="feat-tag" style={{background:'rgba(245,158,11,.1)',color:'var(--or)',border:'1px solid rgba(245,158,11,.22)'}}>خبرة عملية</span>
      </div>
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(167,139,250,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        </div>
        <div className="feat-title">مساعد AI شخصي للمتدرب</div>
        <div className="feat-desc">مساعد ذكاء اصطناعي يجيب على أسئلة المادة، يقدم ملخصات المحاضرات، ويتتبع تقدمك لحظة بلحظة.</div>
        <span className="feat-tag" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.22)'}}>ذكاء اصطناعي</span>
      </div>
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(34,211,238,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        </div>
        <div className="feat-title">الدفع بالأقساط المرنة</div>
        <div className="feat-desc">كوبونات خصم، دفع بالأقساط حتى 6 أشهر، وخصومات المجموعات للشركات — جميع طرق الدفع الإلكتروني.</div>
        <span className="feat-tag" style={{background:'rgba(34,211,238,.1)',color:'var(--cy)',border:'1px solid rgba(34,211,238,.22)'}}>مدى · Apple Pay · STC</span>
      </div>
      <div className="feat-card">
        <div className="feat-ic" style={{background:'rgba(212,168,67,.1)'}}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
        </div>
        <div className="feat-title">نظام الأسئلة والاختبارات الذكي</div>
        <div className="feat-desc">بنك أسئلة عشوائي، أسئلة ما بعد الجلسة، واختبار نهائي مشفر لضمان نزاهة الحصول على الشهادة.</div>
        <span className="feat-tag" style={{background:'rgba(212,168,67,.1)',color:'var(--gd)',border:'1px solid rgba(212,168,67,.22)'}}>تشفير سيادي</span>
      </div>
    </div>
  </div>
</section>

{/* SCHEDULE */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)',borderBottom:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
      <div>
        <div className="sec-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
          جدول الدورات
        </div>
        <h2 className="sec-title">الدفعات <span>القادمة</span></h2>
      </div>
      <button style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',borderRadius:'10px',padding:'8px 17px',color:'var(--td)',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'var(--f)'}}>الجدول الكامل ←</button>
    </div>
    <div className="schedule-wrap">
      <div className="sch-hdr">
        <div className="sch-title">دفعات ذو القعدة 1446</div>
        <div className="sch-tabs">
          <div className="sch-tab on">هذا الشهر</div>
          <div className="sch-tab">القادم</div>
          <div className="sch-tab">جميع الدفعات</div>
        </div>
      </div>
      <div className="sch-row">
        <div className="sch-time">الأحد 9 ص</div>
        <div style={{flex:1}}>
          <div className="sch-prog">تطوير تطبيقات الويب الكاملة</div>
          <div className="sch-trainer">م. سارة القحطاني · حضوري + أونلاين</div>
        </div>
        <div className="sch-seats-left">3 مقاعد متبقية</div>
        <div className="sch-type" style={{background:'rgba(239,68,68,.1)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.2)'}}>يكاد يمتلئ</div>
      </div>
      <div className="sch-row">
        <div className="sch-time">الاثنين 6 م</div>
        <div style={{flex:1}}>
          <div className="sch-prog">الذكاء الاصطناعي وتعلم الآلة</div>
          <div className="sch-trainer">د. خالد المطيري · أونلاين مباشر</div>
        </div>
        <div className="sch-seats-left">18 مقعداً</div>
        <div className="sch-type" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>متاح</div>
      </div>
      <div className="sch-row">
        <div className="sch-time">الثلاثاء 8 ص</div>
        <div style={{flex:1}}>
          <div className="sch-prog">إدارة المشاريع PMP</div>
          <div className="sch-trainer">م. نورة العمري · حضوري</div>
        </div>
        <div className="sch-seats-left">22 مقعداً</div>
        <div className="sch-type" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>متاح</div>
      </div>
      <div className="sch-row">
        <div className="sch-time">الأربعاء 5 م</div>
        <div style={{flex:1}}>
          <div className="sch-prog">الأمن السيبراني المتقدم</div>
          <div className="sch-trainer">م. فيصل الشمري · حضوري</div>
        </div>
        <div className="sch-seats-left">10 مقاعد فقط</div>
        <div className="sch-type" style={{background:'rgba(245,158,11,.1)',color:'var(--or)',border:'1px solid rgba(245,158,11,.2)'}}>محدود</div>
      </div>
      <div className="sch-row">
        <div className="sch-time">الخميس 7 م</div>
        <div style={{flex:1}}>
          <div className="sch-prog">القيادة وإدارة الفرق</div>
          <div className="sch-trainer">د. عبدالعزيز العتيبي · هجين</div>
        </div>
        <div className="sch-seats-left">28 مقعداً</div>
        <div className="sch-type" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>متاح</div>
      </div>
    </div>
  </div>
</section>

{/* TRAINERS */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        المدربون
      </div>
      <h2 className="sec-title">نخبة <span>المدربين المعتمدين</span></h2>
      <p className="sec-sub">مدربون من الصناعة الفعلية — لا مجرد أكاديميين.</p>
    </div>
    <div className="trainers-grid">
      <div className="trainer-card">
        <div className="tr-av" style={{background:'rgba(14,165,233,.1)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="tr-name">م. سارة القحطاني</div>
        <div className="tr-spec">تطوير الويب والتطبيقات</div>
        <div className="tr-bio">8 سنوات في Google وAmazon — مطورة full-stack معتمدة</div>
        <div className="tr-stars">★★★★★</div>
        <div className="tr-count">4.9 · 1,240 متدرب</div>
      </div>
      <div className="trainer-card">
        <div className="tr-av" style={{background:'rgba(167,139,250,.1)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="tr-name">د. خالد المطيري</div>
        <div className="tr-spec">الذكاء الاصطناعي وعلوم البيانات</div>
        <div className="tr-bio">دكتوراه MIT — باحث في KACST ومستشار أرامكو</div>
        <div className="tr-stars">★★★★★</div>
        <div className="tr-count">4.8 · 960 متدرب</div>
      </div>
      <div className="trainer-card">
        <div className="tr-av" style={{background:'rgba(251,146,60,.1)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="tr-name">م. نورة العمري</div>
        <div className="tr-spec">إدارة المشاريع PMP</div>
        <div className="tr-bio">PMP وPgMP معتمدة — مديرة مشاريع NEOM سابقاً</div>
        <div className="tr-stars">★★★★★</div>
        <div className="tr-count">4.9 · 780 متدرب</div>
      </div>
      <div className="trainer-card">
        <div className="tr-av" style={{background:'rgba(239,68,68,.1)'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div className="tr-name">م. فيصل الشمري</div>
        <div className="tr-spec">الأمن السيبراني</div>
        <div className="tr-bio">CISSP وCEH معتمد — خبير أمني في STC وزارة الداخلية</div>
        <div className="tr-stars">★★★★★</div>
        <div className="tr-count">4.8 · 620 متدرب</div>
      </div>
    </div>
  </div>
</section>

{/* CERTIFICATES */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        الشهادات والاعتمادات
      </div>
      <h2 className="sec-title">شهادات <span>تفتح الأبواب</span></h2>
      <p className="sec-sub">كل شهادة معتمدة ومحمية برمز QR للتحقق الفوري من صحتها.</p>
    </div>
    <div className="cert-grid">
      <div className="cert-card">
        <div className="cert-ic" style={{background:'rgba(14,165,233,.12)'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        </div>
        <div>
          <div className="cert-name">شهادة إتمام المعهد</div>
          <div className="cert-body">شهادة رسمية برمز QR معتمدة من هيئة تقييم التعليم والتدريب.</div>
          <div className="cert-tag" style={{background:'rgba(14,165,233,.1)',color:'var(--cy)',border:'1px solid rgba(14,165,233,.22)'}}>ETEC معتمد</div>
        </div>
      </div>
      <div className="cert-card">
        <div className="cert-ic" style={{background:'rgba(167,139,250,.1)'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <div>
          <div className="cert-name">شراكات دولية معتمدة</div>
          <div className="cert-body">PMI, CompTIA, Microsoft, AWS — شهادات معترف بها عالمياً.</div>
          <div className="cert-tag" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.22)'}}>اعتماد دولي</div>
        </div>
      </div>
      <div className="cert-card">
        <div className="cert-ic" style={{background:'rgba(16,185,129,.1)'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div>
          <div className="cert-name">تحقق فوري برمز QR</div>
          <div className="cert-body">أي جهة توظيف تستطيع التحقق من صحة الشهادة بمسح الرمز مباشرة.</div>
          <div className="cert-tag" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.22)'}}>موثوق ولا يُزوَّر</div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* REGISTER */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr">
      <div className="sec-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        التسجيل
      </div>
      <h2 className="sec-title">سجّل <span>الآن</span></h2>
      <p className="sec-sub">عملية تسجيل بالكامل إلكترونية — من الاختيار إلى الدفع في أقل من 5 دقائق.</p>
    </div>
    <div className="reg-wrap" id="regM-inline">
      <div className="reg-grid">
        <div>
          <div className="reg-steps">
            <div className="reg-step"><div className="rs-num">1</div><div><div className="rs-t">اختر البرنامج والموعد</div><div className="rs-s">تصفح البرامج واختر الدفعة والطريقة المناسبة لك</div></div></div>
            <div className="reg-step"><div className="rs-num">2</div><div><div className="rs-t">أكمل بياناتك</div><div className="rs-s">التحقق عبر نفاذ — هويتك تُملأ تلقائياً</div></div></div>
            <div className="reg-step"><div className="rs-num">3</div><div><div className="rs-t">ادفع وابدأ فوراً</div><div className="rs-s">مدى، Apple Pay، أو أقساط — تُرسل بيانات الدخول فورياً</div></div></div>
          </div>
          <div className="req-tags">
            <div className="req-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
              بطاقة هوية وطنية
            </div>
            <div className="req-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
              رقم جوال سعودي
            </div>
            <div className="req-tag">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
              بريد إلكتروني فعال
            </div>
          </div>
        </div>
        <div className="reg-form">
          <h3 style={{fontSize:'17px',fontWeight:800,color:'var(--t)',marginBottom:'4px'}}>ابدأ تسجيلك</h3>
          <p style={{fontSize:'12px',color:'var(--tm)',marginBottom:'8px'}}>التسجيل مفتوح — دفعات شهرية منتظمة</p>
          <div className="rrow">
            <div><label className="flbl">الاسم الأول</label><input className="finp" placeholder="محمد" /></div>
            <div><label className="flbl">اسم العائلة</label><input className="finp" placeholder="العمري" /></div>
          </div>
          <div><label className="flbl">رقم الهوية الوطنية</label><input className="finp" placeholder="1xxxxxxxxx" /></div>
          <div><label className="flbl">رقم الجوال</label><input className="finp" type="tel" placeholder="05xxxxxxxx" /></div>
          <div>
            <label className="flbl">البرنامج المطلوب</label>
            <select className="finp">
              <option value="">اختر البرنامج...</option>
              <option>تطوير تطبيقات الويب الكاملة — 3,200 ر.س</option>
              <option>الذكاء الاصطناعي وتعلم الآلة — 4,500 ر.س</option>
              <option>إدارة المشاريع PMP — 2,800 ر.س</option>
              <option>المالية والمحاسبة — 1,900 ر.س</option>
              <option>القيادة وإدارة الفرق — 1,600 ر.س</option>
              <option>الأمن السيبراني — 5,200 ر.س</option>
            </select>
          </div>
          <div>
            <label className="flbl">طريقة التدريب</label>
            <select className="finp">
              <option>حضوري</option>
              <option>أونلاين مباشر</option>
              <option>هجين (حضوري + أونلاين)</option>
            </select>
          </div>
          <button className="reg-submit">سجّل الآن والدفع لاحقاً ←</button>
          <p style={{fontSize:'11px',color:'var(--tm)',textAlign:'center'}}>ستُرسل بيانات الدخول على جوالك فور اكتمال الدفع</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* FOOTER */}
<footer className="footer">
  <div className="footer-inner">
    <div className="footer-top">
      <div>
        <div className="f-logo">
          <div className="inst-logo" style={{width:'36px',height:'36px'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <div style={{fontSize:'14.5px',fontWeight:800,color:'var(--t)'}}>معهد الإتقان للتدريب</div>
            <div style={{fontSize:'9px',color:'var(--tm)'}}>يعمل على منصة متين السحابية</div>
          </div>
        </div>
        <div className="footer-about">معهد الإتقان — مؤسسة تدريبية معتمدة من هيئة تقييم التعليم والتدريب، متخصصة في برامج التطوير المهني وتأهيل الكوادر البشرية لسوق العمل السعودي وفق رؤية 2030.</div>
      </div>
      <div>
        <div className="footer-col-t">البرامج</div>
        <div className="footer-link">تطوير الويب والتطبيقات</div>
        <div className="footer-link">الذكاء الاصطناعي</div>
        <div className="footer-link">إدارة المشاريع</div>
        <div className="footer-link">الأمن السيبراني</div>
        <div className="footer-link">جميع البرامج ←</div>
      </div>
      <div>
        <div className="footer-col-t">المعهد</div>
        <div className="footer-link">من نحن</div>
        <div className="footer-link">المدربون</div>
        <div className="footer-link">الجدول والمواعيد</div>
        <div className="footer-link">الشهادات والاعتمادات</div>
        <div className="footer-link">شراكات الشركات</div>
      </div>
      <div>
        <div className="footer-col-t">تواصل معنا</div>
        <div className="footer-link">📍 الرياض، طريق الملك فهد</div>
        <div className="footer-link">📞 920-000-1111</div>
        <div className="footer-link">✉️ info@itqan.edu.sa</div>
        <div className="footer-link">واتساب: 0500000000</div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="footer-copy">© 2025 معهد الإتقان للتدريب. جميع الحقوق محفوظة.</div>
      <div className="powered">مدعوم بـ <strong>منصة متين</strong> ⚡</div>
    </div>
  </div>
</footer>

{/* MOBILE NAV */}
<div className="mob-nav" id="mobNav">
  <div className="mob-bg" onClick={() => {closeMob()}}></div>
  <div className="mob-panel">
    <div className="mob-close" onClick={() => {closeMob()}}>×</div>
    <div className="mob-link">الرئيسية</div>
    <div className="mob-link">البرامج</div>
    <div className="mob-link">المدربون</div>
    <div className="mob-link">الجدول</div>
    <div className="mob-link">الشهادات</div>
    <div style={{height:'1px',background:'var(--b1)',margin:'8px 0'}}></div>
    <button className="reg-submit" onClick={() => {closeMob()}}>سجّل الآن</button>
    <button className="nav-login" style={{width:'100%',marginTop:'8px'}} onClick={() => {closeMob()}}>تسجيل الدخول</button>
  </div>
</div>

{/* LOGIN MODAL */}
<div className="modal-ov" id="loginM">
  <div className="modal-box">
    <div className="modal-hdr">
      <div className="modal-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        تسجيل الدخول
      </div>
      <div className="modal-x" onClick={() => {closeM('loginM')}}>×</div>
    </div>
    <div className="modal-body">
      <div className="mtabs">
        <button className="mtab on">متدرب</button>
        <button className="mtab" onClick={() => {switchTab(this)}}>مدرب</button>
        <button className="mtab" onClick={() => {switchTab(this)}}>إدارة</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
        <div><label className="flbl">رقم الهوية / البريد الإلكتروني</label><input className="finp" placeholder="أدخل بياناتك" /></div>
        <div><label className="flbl">كلمة المرور</label><input className="finp" type="password" placeholder="••••••••" /></div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <label style={{fontSize:'12px',color:'var(--td)',display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}}><input type="checkbox" style={{accentColor:'var(--inst-p)'}} /> تذكرني</label>
          <span style={{fontSize:'12px',color:'var(--cy)',cursor:'pointer'}}>نسيت كلمة المرور؟</span>
        </div>
        <button className="reg-submit">دخول ←</button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}