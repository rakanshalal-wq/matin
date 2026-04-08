'use client';
import React, { useState } from 'react';
import '../../styles/uni-landing.css';

export default function UniversityTemplate() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
{/* NAVBAR */}
<nav className="nav">
  <div className="nav-inner">
    <div className="nav-logo">
      <div className="uni-logo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
      <div className="uni-name-wrap">
        <div className="uni-name">جامعة الرشيد</div>
        <div className="uni-tag">منصة متين للتعليم السحابي</div>
      </div>
    </div>
    <div className="nav-links">
      <div className="nav-link">الرئيسية</div>
      <div className="nav-link">الكليات والأقسام</div>
      <div className="nav-link">البرامج الأكاديمية</div>
      <div className="nav-link">القبول والتسجيل</div>
      <div className="nav-link">أخبار الجامعة</div>
      <div className="nav-link">تواصل معنا</div>
    </div>
    <div className="nav-right">
      <button className="nav-login" onClick={() => {openModal('loginModal')}}>تسجيل الدخول</button>
      <button className="nav-cta" onClick={() => {openModal('admModal')}}>التقديم الآن</button>
    </div>
    <div className="hamburger" onClick={() => {openMob()}}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </div>
  </div>
</nav>

{/* HERO */}
<section className="hero">
  <div className="hero-bg"></div>
  <div className="hero-grid"></div>
  <div className="hero-inner">
    <div className="hero-text">
      <div className="hero-badge"><span className="badge-dot"></span>معتمدة من وزارة التعليم · الرياض</div>
      <h1 className="hero-title">
        بناء <em>قادة الغد</em><br />بعلم اليوم
      </h1>
      <p className="hero-sub">جامعة الرشيد — تجمع بين التميز الأكاديمي والتقنية المتقدمة لإعداد كوادر بشرية متكاملة تقود مسيرة رؤية المملكة 2030.</p>
      <div className="hero-btns">
        <button className="btn-hero-p" onClick={() => {openModal('admModal')}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 13.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012 2.84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81A2 2 0 017 9.09l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
          قدّم الآن
        </button>
        <button className="btn-hero-o">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
          جولة افتراضية
        </button>
      </div>
      <div className="hero-stats">
        <div className="hstat">
          <div className="hstat-v">18,400<span>+</span></div>
          <div className="hstat-l">طالب وطالبة</div>
        </div>
        <div className="hstat">
          <div className="hstat-v">12<span> كلية</span></div>
          <div className="hstat-l">في مختلف التخصصات</div>
        </div>
        <div className="hstat">
          <div className="hstat-v">94<span>%</span></div>
          <div className="hstat-l">معدل التوظيف</div>
        </div>
        <div className="hstat">
          <div className="hstat-v">38<span> عاماً</span></div>
          <div className="hstat-l">من التميز الأكاديمي</div>
        </div>
      </div>
    </div>
    <div className="hero-visual">
      <div className="float-card fc1">
        <div className="fc-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 6 8 2 16 2 16 6"/><path d="M5 6h14v6a7 7 0 0 1-14 0V6z"/><path d="M8 18H5.1A3 3 0 0 0 2 21h20a3 3 0 0 0-3.1-3H16"/></svg></div>
        <div>
          <div className="fc-txt">الأفضل محلياً 2024</div>
          <div className="fc-sub">تصنيف QS العربي</div>
        </div>
      </div>
      <div className="hero-card-main">
        <div className="hc-top">
          <div className="hc-left">
            <div className="hc-av"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
            <div>
              <div className="hc-title">لوحة الطالب الأكاديمية</div>
              <div className="hc-sub">الفصل الثاني · 1446 هـ</div>
            </div>
          </div>
          <div className="live-badge"><span className="live-dot"></span>مباشر</div>
        </div>
        <div className="feat-list">
          <div className="feat-item">
            <div className="feat-ic" style={{background:'rgba(26,86,219,.12)'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
            <div style={{flex:1}}>
              <div className="feat-lbl">المواد المسجلة</div>
              <div className="feat-sub">5 مواد · 15 ساعة معتمدة</div>
            </div>
            <span className="feat-badge" style={{background:'rgba(96,165,250,.1)',color:'#60A5FA',border:'1px solid rgba(96,165,250,.22)'}}>مكتملة</span>
          </div>
          <div className="feat-item">
            <div className="feat-ic" style={{background:'rgba(16,185,129,.1)'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
            <div style={{flex:1}}>
              <div className="feat-lbl">نسبة الحضور</div>
              <div className="feat-sub">88% · فوق الحد المطلوب</div>
            </div>
            <span className="feat-badge" style={{background:'rgba(16,185,129,.1)',color:'#10B981',border:'1px solid rgba(16,185,129,.22)'}}>جيد</span>
          </div>
          <div className="feat-item">
            <div className="feat-ic" style={{background:'rgba(245,158,11,.1)'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div>
            <div style={{flex:1}}>
              <div className="feat-lbl">الواجبات المعلقة</div>
              <div className="feat-sub">2 واجب · يستحق التسليم غداً</div>
            </div>
            <span className="feat-badge" style={{background:'rgba(245,158,11,.1)',color:'#F59E0B',border:'1px solid rgba(245,158,11,.22)'}}>عاجل</span>
          </div>
        </div>
        <div className="gpa-bar">
          <div className="gpa-top">
            <div className="gpa-label">المعدل التراكمي GPA</div>
            <div className="gpa-val">3.72 / 5.00</div>
          </div>
          <div className="gpa-track"><div className="gpa-fill" style={{width:'74.4%'}}></div></div>
        </div>
      </div>
      <div className="float-card fc2">
        <div className="fc-ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div>
          <div className="fc-txt">فرص توظيف متاحة</div>
          <div className="fc-sub">مركز الخريجين · 47 فرصة</div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* STATS BAR */}
<section style={{padding:'0 24px 60px'}}>
  <div className="sec-inner">
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-num">12<span>+</span></div>
        <div className="stat-label">كلية وقسم</div>
        <div className="stat-change">↑ كليتان جديدتان 2025</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">840<span>+</span></div>
        <div className="stat-label">عضو هيئة التدريس</div>
        <div className="stat-change">↑ 12% هذا العام</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">68<span>+</span></div>
        <div className="stat-label">برنامجاً أكاديمياً</div>
        <div className="stat-change">↑ 8 برامج جديدة</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">94<span>%</span></div>
        <div className="stat-label">معدل التوظيف</div>
        <div className="stat-change">↑ الأعلى إقليمياً</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">120<span>+</span></div>
        <div className="stat-label">شراكة دولية وجامعية</div>
        <div className="stat-change">↑ 22 شراكة جديدة</div>
      </div>
    </div>
  </div>
</section>

{/* COLLEGES */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11"/><path d="M3 11L12 2l9 9"/><line x1="9" y1="22" x2="9" y2="11"/><line x1="15" y1="22" x2="15" y2="11"/></svg> الكليات والأقسام</div>
      <h2 className="sec-title">استكشف <span>كلياتنا</span></h2>
      <p className="sec-sub">12 كلية متخصصة تغطي أبرز مجالات العلم والمعرفة في عالم متسارع التغيرات.</p>
    </div>
    <div className="colleges-grid">
      <div className="college-card" style={{ColColor:'rgba(26,86,219,.14)'}}>
        <div className="col-icon" style={{background:'rgba(26,86,219,.12)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
        <div className="col-name">كلية الحوسبة وتقنية المعلومات</div>
        <div className="col-desc">هندسة البرمجيات، الذكاء الاصطناعي، الأمن السيبراني، وعلوم البيانات.</div>
        <div className="col-footer">
          <div className="col-students">3,200 طالب</div>
          <div className="col-tag" style={{background:'rgba(26,86,219,.1)',color:'var(--bl)',border:'1px solid rgba(26,86,219,.22)'}}>8 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--uni-primary),var(--bl))',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(16,185,129,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div className="col-name">كلية الطب والعلوم الصحية</div>
        <div className="col-desc">الطب العام، طب الأسنان، الصيدلة، التمريض، والعلاج الطبيعي.</div>
        <div className="col-footer">
          <div className="col-students">2,800 طالب</div>
          <div className="col-tag" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.22)'}}>6 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--gr),#059669)',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(245,158,11,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg></div>
        <div className="col-name">كلية الهندسة والعمارة</div>
        <div className="col-desc">الهندسة المدنية، الميكانيكية، الكهربائية، والعمارة البيئية المستدامة.</div>
        <div className="col-footer">
          <div className="col-students">2,450 طالب</div>
          <div className="col-tag" style={{background:'rgba(245,158,11,.1)',color:'var(--or)',border:'1px solid rgba(245,158,11,.22)'}}>7 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--uni-accent),var(--or))',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(167,139,250,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <div className="col-name">كلية إدارة الأعمال والاقتصاد</div>
        <div className="col-desc">ريادة الأعمال، المحاسبة، التمويل، والتسويق الرقمي.</div>
        <div className="col-footer">
          <div className="col-students">3,600 طالب</div>
          <div className="col-tag" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.22)'}}>5 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--pu),#7C3AED)',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(34,211,238,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-4 7h14l-4-7V3"/></svg></div>
        <div className="col-name">كلية العلوم</div>
        <div className="col-desc">الفيزياء، الكيمياء، الأحياء، الرياضيات، وعلوم الأرض.</div>
        <div className="col-footer">
          <div className="col-students">1,900 طالب</div>
          <div className="col-tag" style={{background:'rgba(34,211,238,.1)',color:'var(--cy)',border:'1px solid rgba(34,211,238,.22)'}}>5 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--cy),#0E7490)',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(251,146,60,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12m0 0L2 7m10 5 10-5M3 7l9-5 9 5M3 7l9 5 9-5"/></svg></div>
        <div className="col-name">كلية القانون والشريعة</div>
        <div className="col-desc">الفقه الإسلامي، القانون المدني، الأنظمة، وحقوق الإنسان.</div>
        <div className="col-footer">
          <div className="col-students">1,650 طالب</div>
          <div className="col-tag" style={{background:'rgba(251,146,60,.1)',color:'var(--or)',border:'1px solid rgba(251,146,60,.22)'}}>4 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--or),#C2410C)',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(212,168,67,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg></div>
        <div className="col-name">كلية الفنون والتصميم الإبداعي</div>
        <div className="col-desc">تصميم الجرافيك، الإعلام الرقمي، الأفلام، والفنون البصرية.</div>
        <div className="col-footer">
          <div className="col-students">1,200 طالب</div>
          <div className="col-tag" style={{background:'rgba(212,168,67,.1)',color:'var(--gd)',border:'1px solid rgba(212,168,67,.22)'}}>4 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--gd),var(--gd2))',borderRadius:'2px'}}></div>
      </div>
      <div className="college-card">
        <div className="col-icon" style={{background:'rgba(239,68,68,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
        <div className="col-name">كلية العلوم الإنسانية والاجتماعية</div>
        <div className="col-desc">علم النفس، الاجتماع، التاريخ، الجغرافيا، والدراسات الإسلامية.</div>
        <div className="col-footer">
          <div className="col-students">1,600 طالب</div>
          <div className="col-tag" style={{background:'rgba(239,68,68,.1)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.22)'}}>6 أقسام</div>
        </div>
        <div style={{position:'absolute',top:0,right:0,left:0,height:'2px',background:'linear-gradient(90deg,var(--rd),#B91C1C)',borderRadius:'2px'}}></div>
      </div>
    </div>
  </div>
</section>

{/* PORTALS */}
<section style={{background:'rgba(255,255,255,.015)',borderTop:'1px solid var(--b2)',borderBottom:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg> البوابات الرقمية</div>
      <h2 className="sec-title">بوابتك <span>الأكاديمية</span> في متناول يدك</h2>
      <p className="sec-sub">سجّل الدخول إلى بوابتك المخصصة وتابع مسيرتك الأكاديمية في أي وقت ومن أي مكان.</p>
    </div>
    <div className="portals-grid">
      <a className="portal-item" onClick={() => {openModal('loginModal')}}>
        <div className="portal-ic" style={{background:'rgba(26,86,219,.12)'}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
        <div className="portal-lbl">بوابة الطالب</div>
        <div className="portal-sub">جداولك، مواد، درجات، GPA، محفظة مهارات</div>
        <div className="portal-arrow">→ الدخول</div>
      </a>
      <a className="portal-item" onClick={() => {openModal('loginModal')}}>
        <div className="portal-ic" style={{background:'rgba(16,185,129,.1)'}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <div className="portal-lbl">بوابة عضو هيئة التدريس</div>
        <div className="portal-sub">المحاضرات، الدرجات، بنك الأسئلة، الـ Portfolio</div>
        <div className="portal-arrow">→ الدخول</div>
      </a>
      <a className="portal-item" onClick={() => {openModal('loginModal')}}>
        <div className="portal-ic" style={{background:'rgba(245,158,11,.1)'}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>
        <div className="portal-lbl">بوابة ولي الأمر</div>
        <div className="portal-sub">متابعة الأداء، الحضور، الرسوم، الإشعارات</div>
        <div className="portal-arrow">→ الدخول</div>
      </a>
      <a className="portal-item" onClick={() => {openModal('loginModal')}}>
        <div className="portal-ic" style={{background:'rgba(167,139,250,.1)'}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11"/><path d="M3 11L12 2l9 9"/><line x1="9" y1="22" x2="9" y2="11"/><line x1="15" y1="22" x2="15" y2="11"/></svg></div>
        <div className="portal-lbl">بوابة الإدارة والعمادة</div>
        <div className="portal-sub">لوحة رئيس الجامعة، العمداء، الموظفون</div>
        <div className="portal-arrow">→ الدخول</div>
      </a>
    </div>
  </div>
</section>

{/* FEATURES / SERVICES */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> خدمات الجامعة</div>
      <h2 className="sec-title">بيئة تعليمية <span>متكاملة</span> بالكامل</h2>
      <p className="sec-sub">منظومة شاملة من الخدمات الأكاديمية والإدارية تغطي رحلة الطالب من القبول حتى التخرج.</p>
    </div>
    <div className="features-grid">
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(26,86,219,.12)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
        <div className="feat-card-title">الجداول الذكية والتسجيل</div>
        <div className="feat-card-desc">الطالب يسجل مواده كل فصل ضمن خطته الدراسية، والنظام يكشف التعارضات فورياً ويقترح بدائل.</div>
        <span className="feat-card-tag" style={{background:'rgba(26,86,219,.1)',color:'var(--bl)',border:'1px solid rgba(26,86,219,.22)'}}>إضافة وحذف مواد</span>
      </div>
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(16,185,129,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>
        <div className="feat-card-title">المحاضرات الذكية (3 أنواع)</div>
        <div className="feat-card-desc">حضوري بتتبع GPS، أونلاين مباشر، أو مسجل — مع تحويل تلقائي وإشعارات لحظية للطلاب وأولياء الأمور.</div>
        <span className="feat-card-tag" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.22)'}}>تحويل آلي ذكي</span>
      </div>
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(245,158,11,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
        <div className="feat-card-title">نظام الاختبارات وبنك الأسئلة</div>
        <div className="feat-card-desc">اختبارات مشفرة حتى ساعة قبل الموعد، تصحيح آلي أو يدوي، ونظام اعتراض على الدرجات بلجنة مستقلة.</div>
        <span className="feat-card-tag" style={{background:'rgba(245,158,11,.1)',color:'var(--or)',border:'1px solid rgba(245,158,11,.22)'}}>تشفير سيادي</span>
      </div>
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(167,139,250,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h3V5.73A2 2 0 0 1 12 2z"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/></svg></div>
        <div className="feat-card-title">AI Career Pathing المهني</div>
        <div className="feat-card-desc">الذكاء الاصطناعي يحلل أداء الطالب ويقترح مساراً مهنياً متوافقاً مع متطلبات سوق العمل ومشاريع رؤية 2030.</div>
        <span className="feat-card-tag" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',border:'1px solid rgba(167,139,250,.22)'}}>ذكاء اصطناعي</span>
      </div>
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(34,211,238,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
        <div className="feat-card-title">جواز سفر المهارات الرقمي</div>
        <div className="feat-card-desc">سجل رقمي دائم يوثق مهارات الطالب وإنجازاته وساعات تطوعه، ومتاح لسوق العمل عند إذن الطالب.</div>
        <span className="feat-card-tag" style={{background:'rgba(34,211,238,.1)',color:'var(--cy)',border:'1px solid rgba(34,211,238,.22)'}}>يبقى مدى الحياة</span>
      </div>
      <div className="feat-card">
        <div className="feat-card-ic" style={{background:'rgba(212,168,67,.1)'}}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div>
        <div className="feat-card-title">الدفع والأقساط الآلية</div>
        <div className="feat-card-desc">رسوم حسب الساعات المسجلة، منح مالية ومساعدات، تحصيل آلي مع إشعارات متدرجة وربط بصندوق التعليم.</div>
        <span className="feat-card-tag" style={{background:'rgba(212,168,67,.1)',color:'var(--gd)',border:'1px solid rgba(212,168,67,.22)'}}>مدى + Apple Pay</span>
      </div>
    </div>
  </div>
</section>

{/* AI ASSISTANT */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)',borderBottom:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="ai-section">
      <div className="ai-inner">
        <div>
          <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v2h-2v-2H9v2H7v-2a2 2 0 0 1-2-2v-1H4a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/></svg> المساعد الذكي</div>
          <h2 className="sec-title" style={{fontSize:'28px'}}>مساعدك الأكاديمي <span>الشخصي</span></h2>
          <p className="sec-sub" style={{fontSize:'14px',marginBottom:'20px'}}>اسأل عن أي شيء — التخصصات، متطلبات القبول، المواد، الإرشاد الأكاديمي — والمساعد يجيبك فورياً.</p>
          <div className="ai-features">
            <div className="ai-feat">
              <div className="ai-feat-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
              <div>
                <div className="ai-feat-t">استفسارات القبول والتخصصات</div>
                <div className="ai-feat-s">متطلبات القبول، المواعيد، الوثائق المطلوبة</div>
              </div>
            </div>
            <div className="ai-feat">
              <div className="ai-feat-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
              <div>
                <div className="ai-feat-t">الإرشاد الأكاديمي الذكي</div>
                <div className="ai-feat-s">تحليل الخطة الدراسية واقتراح مسارات التطوير</div>
              </div>
            </div>
            <div className="ai-feat">
              <div className="ai-feat-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
              <div>
                <div className="ai-feat-t">فرص التوظيف والتدريب</div>
                <div className="ai-feat-s">ربط الطالب بالفرص المتاحة في مركز الخريجين</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="ai-chat">
            <div className="ai-msg">
              <div className="ai-av" style={{background:'rgba(255,255,255,.06)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <div className="ai-bubble">ما متطلبات القبول في كلية الحوسبة؟</div>
            </div>
            <div className="ai-msg">
              <div className="ai-av" style={{background:'rgba(26,86,219,.15)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a7 7 0 0 1-7 7H9a7 7 0 0 1-7-7v-1H1a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/></svg></div>
              <div className="ai-bubble bot">مرحباً! لتقديم طلب القبول في كلية الحوسبة وتقنية المعلومات، تحتاج إلى: شهادة الثانوية العامة بمعدل لا يقل عن 85%، واجتياز اختبار القدرات بنسبة 70%+، واجتياز التحصيل الدراسي بنسبة 75%+. التسجيل مفتوح حتى 1 رمضان 1446. هل تريد بدء طلب التقديم؟ 🎓</div>
            </div>
            <div className="ai-msg">
              <div className="ai-av" style={{background:'rgba(255,255,255,.06)'}}>👤</div>
              <div className="ai-bubble">هل يوجد تخصص الذكاء الاصطناعي؟</div>
            </div>
            <div className="ai-msg">
              <div className="ai-av" style={{background:'rgba(26,86,219,.15)'}}>🤖</div>
              <div className="ai-bubble bot">نعم! يوجد تخصص الذكاء الاصطناعي وتعلم الآلة، وهو من أحدث تخصصاتنا. مدته 4 سنوات (132 ساعة معتمدة)، ويتضمن مختبرات متطورة ومشاريع تخرج بالشراكة مع كبرى الشركات التقنية. 🚀</div>
            </div>
          </div>
          <div className="ai-input-row">
            <input className="ai-inp" placeholder="اسأل عن الجامعة، التخصصات، القبول..." />
            <button className="ai-send">أرسل ←</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ADMISSION */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> القبول والتسجيل</div>
      <h2 className="sec-title">قدّم طلبك <span>الآن</span></h2>
      <p className="sec-sub">عملية قبول إلكترونية بالكامل — من رفع المستندات إلى استلام قبولك في أقل من 7 أيام.</p>
    </div>
    <div id="admModal" className="admission-section">
      <div className="adm-grid">
        <div>
          <div className="adm-steps">
            <div className="adm-step">
              <div className="adm-step-num">1</div>
              <div>
                <div className="adm-step-t">تعبئة استمارة التقديم</div>
                <div className="adm-step-s">بيانات شخصية ودراسية كاملة مع رفع المستندات إلكترونياً</div>
              </div>
            </div>
            <div className="adm-step">
              <div className="adm-step-num">2</div>
              <div>
                <div className="adm-step-t">دفع رسوم التقديم</div>
                <div className="adm-step-s">150 ريال — مدى أو Apple Pay أو STC Pay</div>
              </div>
            </div>
            <div className="adm-step">
              <div className="adm-step-num">3</div>
              <div>
                <div className="adm-step-t">اختبار القبول الإلكتروني</div>
                <div className="adm-step-s">قدرات + تحصيل — يُجرى عبر المنصة في الموعد المحدد</div>
              </div>
            </div>
            <div className="adm-step">
              <div className="adm-step-num">4</div>
              <div>
                <div className="adm-step-t">إشعار القبول وإتمام التسجيل</div>
                <div className="adm-step-s">توقيع العقد رقمياً وسداد الرسوم الدراسية</div>
              </div>
            </div>
          </div>
          <div className="adm-req-tags">
            <div className="req-tag">✓ شهادة الثانوية</div>
            <div className="req-tag">✓ بطاقة الهوية</div>
            <div className="req-tag">✓ نتائج القدرات</div>
            <div className="req-tag">✓ صورة شخصية</div>
            <div className="req-tag">✓ كشف علامات</div>
          </div>
        </div>
        <div className="adm-form">
          <h3 style={{fontSize:'18px',fontWeight:800,color:'var(--t)',marginBottom:'4px'}}>ابدأ طلب القبول</h3>
          <p style={{fontSize:'12px',color:'var(--tm)',marginBottom:'8px'}}>التسجيل مفتوح للعام الدراسي 1447 هـ</p>
          <div className="adm-row">
            <div>
              <label className="flbl">الاسم الأول</label>
              <input className="finp" type="text" placeholder="محمد" />
            </div>
            <div>
              <label className="flbl">اسم العائلة</label>
              <input className="finp" type="text" placeholder="العمري" />
            </div>
          </div>
          <div>
            <label className="flbl">رقم الهوية الوطنية</label>
            <input className="finp" type="text" placeholder="1xxxxxxxxx" />
          </div>
          <div>
            <label className="flbl">رقم الجوال</label>
            <input className="finp" type="tel" placeholder="05xxxxxxxx" />
          </div>
          <div>
            <label className="flbl">الكلية المرغوبة</label>
            <select className="finp">
              <option value="">اختر الكلية</option>
              <option>كلية الحوسبة وتقنية المعلومات</option>
              <option>كلية الطب والعلوم الصحية</option>
              <option>كلية الهندسة والعمارة</option>
              <option>كلية إدارة الأعمال والاقتصاد</option>
              <option>كلية العلوم</option>
              <option>كلية القانون والشريعة</option>
              <option>كلية الفنون والتصميم الإبداعي</option>
              <option>كلية العلوم الإنسانية والاجتماعية</option>
            </select>
          </div>
          <div>
            <label className="flbl">معدل الثانوية العامة</label>
            <input className="finp" type="text" placeholder="مثال: 94.5%" />
          </div>
          <button className="adm-submit">التقديم الآن — 150 ر.س →</button>
          <p style={{fontSize:'11px',color:'var(--tm)',textAlign:'center'}}>سيتم التواصل معك خلال 72 ساعة من تاريخ التقديم</p>
        </div>
      </div>
    </div>
  </div>
</section>

{/* NEWS */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
      <div>
        <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6z"/></svg> أخبار الجامعة</div>
        <h2 className="sec-title" style={{marginBottom:0}}>آخر <span>الأخبار</span> والفعاليات</h2>
      </div>
      <button style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',borderRadius:'10px',padding:'9px 18px',color:'var(--td)',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'var(--f)'}}>عرض الكل ←</button>
    </div>
    <div className="news-grid">
      <div className="news-card">
        <div className="news-img big" style={{background:'linear-gradient(135deg,rgba(26,86,219,.2),rgba(30,58,138,.15))'}}>
          🔬
          <div className="news-img-overlay"></div>
          <div className="news-cat" style={{background:'rgba(26,86,219,.85)',color:'#fff'}}>بحث علمي</div>
        </div>
        <div className="news-body">
          <div className="news-title">فريق متين يفوز بجائزة أفضل بحث علمي في مجال الذكاء الاصطناعي على مستوى الخليج 2025</div>
          <div className="news-meta">
            <span>منذ يومين</span><span className="news-dot"></span>
            <span>كلية الحوسبة</span>
          </div>
        </div>
      </div>
      <div className="news-card">
        <div className="news-img" style={{background:'linear-gradient(135deg,rgba(16,185,129,.15),rgba(5,150,105,.1))'}}>
          🤝
          <div className="news-img-overlay"></div>
          <div className="news-cat" style={{background:'rgba(16,185,129,.85)',color:'#fff'}}>شراكات</div>
        </div>
        <div className="news-body">
          <div className="news-title">توقيع مذكرة تفاهم مع أرامكو السعودية لتدريب 500 طالب سنوياً</div>
          <div className="news-meta">
            <span>منذ أسبوع</span><span className="news-dot"></span>
            <span>إدارة الجامعة</span>
          </div>
        </div>
      </div>
      <div className="news-card">
        <div className="news-img" style={{background:'linear-gradient(135deg,rgba(245,158,11,.15),rgba(180,83,9,.1))'}}>
          🎓
          <div className="news-img-overlay"></div>
          <div className="news-cat" style={{background:'rgba(245,158,11,.9)',color:'#000'}}>حفل تخرج</div>
        </div>
        <div className="news-body">
          <div className="news-title">حفل تخرج دفعة 1446 هـ — 2,800 خريج وخريجة يحتفلون بإنجازهم</div>
          <div className="news-meta">
            <span>منذ شهر</span><span className="news-dot"></span>
            <span>شؤون الطلاب</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* ACCREDITATIONS */}
<section>
  <div className="sec-inner">
    <div className="sec-hdr center">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> الاعتمادات والشراكات</div>
      <h2 className="sec-title">معتمدون <span>دولياً ومحلياً</span></h2>
      <p className="sec-sub">جامعة الرشيد معتمدة من كبرى الهيئات الدولية والوطنية ضماناً للجودة والتميز.</p>
    </div>
    <div className="accred-row">
      <div className="accred-card">
        <div className="accred-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 22V12m0 0L2 7m10 5 10-5"/></svg></div>
        <div>
          <div className="accred-name">وزارة التعليم</div>
          <div className="accred-body">مرخصة ومعتمدة رسمياً</div>
          <div className="accred-badge">✓ معتمدة</div>
        </div>
      </div>
      <div className="accred-card">
        <div className="accred-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <div>
          <div className="accred-name">NCAAA</div>
          <div className="accred-body">الهيئة الوطنية للتقويم</div>
          <div className="accred-badge">✓ مصنفة ممتاز</div>
        </div>
      </div>
      <div className="accred-card">
        <div className="accred-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
        <div>
          <div className="accred-name">ABET</div>
          <div className="accred-body">اعتماد الهندسة والتقنية</div>
          <div className="accred-badge">✓ معتمدة</div>
        </div>
      </div>
      <div className="accred-card">
        <div className="accred-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
        <div>
          <div className="accred-name">AACSB</div>
          <div className="accred-body">إدارة الأعمال عالمياً</div>
          <div className="accred-badge">✓ معتمدة</div>
        </div>
      </div>
      <div className="accred-card">
        <div className="accred-ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 6 8 2 16 2 16 6"/><path d="M5 6h14v6a7 7 0 0 1-14 0V6z"/><path d="M8 18H5.1A3 3 0 0 0 2 21h20a3 3 0 0 0-3.1-3H16"/></svg></div>
        <div>
          <div className="accred-name">QS Rankings</div>
          <div className="accred-body">Top 5 عربياً · 2024</div>
          <div className="accred-badge">✓ مصنفة</div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* COMMUNITY */}
<section style={{background:'rgba(255,255,255,.01)',borderTop:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr">
      <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> الملتقى المجتمعي</div>
      <h2 className="sec-title">مجتمع <span>الجامعة</span> الرقمي</h2>
      <p className="sec-sub">فضاء اجتماعي آمن ومحكوم لطلاب الجامعة — نقاشات، إعلانات، وأندية طلابية.</p>
    </div>
    <div className="com-grid">
      <div className="com-feed">
        <div className="com-post">
          <div className="com-post-hdr">
            <div className="com-av" style={{background:'rgba(26,86,219,.12)'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
            <div style={{flex:1}}>
              <div className="com-author">د. عبدالله الحارثي</div>
              <div className="com-time">قبل ساعتين</div>
            </div>
            <div className="com-role-badge" style={{background:'rgba(26,86,219,.1)',color:'var(--bl)',border:'1px solid rgba(26,86,219,.2)'}}>أستاذ</div>
          </div>
          <div className="com-body">تذكير: الاختبار النظري لمادة هياكل البيانات سيكون يوم الأحد الساعة 10 صباحاً في قاعة A-201. حظاً موفقاً للجميع 🎯</div>
          <div className="com-actions">
            <button className="com-btn">👍 42</button>
            <button className="com-btn">💬 18 تعليق</button>
            <button className="com-btn">↩ مشاركة</button>
          </div>
        </div>
        <div className="com-post">
          <div className="com-post-hdr">
            <div className="com-av" style={{background:'rgba(16,185,129,.1)'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <div style={{flex:1}}>
              <div className="com-author">إدارة مركز الخريجين</div>
              <div className="com-time">قبل 5 ساعات</div>
            </div>
            <div className="com-role-badge" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>إدارة</div>
          </div>
          <div className="com-body">🎉 أعلنت شركة STC عن توفر 12 وظيفة للخريجين والطلاب في آخر سنة — التفاصيل في بوابة الخريجين. آخر موعد للتقديم: 15 رجب.</div>
          <div className="com-actions">
            <button className="com-btn">👍 187</button>
            <button className="com-btn">💬 56 تعليق</button>
            <button className="com-btn">↩ مشاركة</button>
          </div>
        </div>
      </div>
      <div className="com-sidebar">
        <div className="com-side-card">
          <div className="com-side-title">🏅 أندية الجامعة</div>
          <div className="club-item">
            <div className="club-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
            <div style={{flex:1}}>
              <div className="club-name">نادي البرمجة والذكاء الاصطناعي</div>
              <div className="club-members">420 عضو</div>
            </div>
            <button className="club-join">انضم</button>
          </div>
          <div className="club-item">
            <div className="club-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
            <div style={{flex:1}}>
              <div className="club-name">نادي القراءة الأكاديمية</div>
              <div className="club-members">180 عضو</div>
            </div>
            <button className="club-join">انضم</button>
          </div>
          <div className="club-item">
            <div className="club-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
            <div style={{flex:1}}>
              <div className="club-name">الأندية الرياضية</div>
              <div className="club-members">650 عضو</div>
            </div>
            <button className="club-join">انضم</button>
          </div>
          <div className="club-item">
            <div className="club-ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg></div>
            <div style={{flex:1}}>
              <div className="club-name">نادي الفنون والإبداع</div>
              <div className="club-members">215 عضو</div>
            </div>
            <button className="club-join">انضم</button>
          </div>
        </div>
        <div className="com-side-card">
          <div className="com-side-title">📅 الفعاليات القادمة</div>
          <div style={{display:'flex',flexDirection:'column',gap:'9px'}}>
            <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
              <div style={{background:'rgba(26,86,219,.12)',borderRadius:'8px',padding:'4px 9px',textAlign:'center',flexShrink:0}}>
                <div style={{fontSize:'16px',fontWeight:800,color:'var(--bl)'}}>15</div>
                <div style={{fontSize:'9px',color:'var(--tm)'}}>رجب</div>
              </div>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:700,color:'var(--t)'}}>يوم التوظيف السنوي</div>
                <div style={{fontSize:'11px',color:'var(--tm)'}}>50+ شركة · قاعة الملتقى</div>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
              <div style={{background:'rgba(16,185,129,.1)',borderRadius:'8px',padding:'4px 9px',textAlign:'center',flexShrink:0}}>
                <div style={{fontSize:'16px',fontWeight:800,color:'var(--gr)'}}>22</div>
                <div style={{fontSize:'9px',color:'var(--tm)'}}>رجب</div>
              </div>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:700,color:'var(--t)'}}>مؤتمر البحث العلمي</div>
                <div style={{fontSize:'11px',color:'var(--tm)'}}>قاعة الملك عبدالله</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/* STORE */}
<section style={{borderTop:'1px solid var(--b2)'}}>
  <div className="sec-inner">
    <div className="sec-hdr" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'28px'}}>
      <div>
        <div className="sec-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> متجر الجامعة</div>
        <h2 className="sec-title" style={{marginBottom:0}}>لوازمك الجامعية <span>بضغطة</span></h2>
      </div>
      <button style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',borderRadius:'10px',padding:'9px 18px',color:'var(--td)',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'var(--f)'}}>جميع المنتجات ←</button>
    </div>
    <div className="store-grid">
      <div className="store-card">
        <div className="store-img" style={{background:'linear-gradient(135deg,rgba(26,86,219,.12),rgba(30,58,138,.08))'}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
        <div className="store-body">
          <div className="store-name">حقيبة الجامعة الرسمية</div>
          <div><span className="store-old">249 ر.س</span><span className="store-price">189 ر.س</span></div>
          <button className="store-btn">أضف للسلة +</button>
        </div>
      </div>
      <div className="store-card">
        <div className="store-img" style={{background:'linear-gradient(135deg,rgba(16,185,129,.1),rgba(5,150,105,.07))'}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
        <div className="store-body">
          <div className="store-name">كتب دراسية — الفصل الثاني</div>
          <div><span className="store-price">320 ر.س</span></div>
          <button className="store-btn">أضف للسلة +</button>
        </div>
      </div>
      <div className="store-card">
        <div className="store-img" style={{background:'linear-gradient(135deg,rgba(245,158,11,.1),rgba(180,83,9,.07))'}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg></div>
        <div className="store-body">
          <div className="store-name">هوديه الجامعة الرسمية</div>
          <div><span className="store-old">159 ر.س</span><span className="store-price">119 ر.س</span></div>
          <button className="store-btn">أضف للسلة +</button>
        </div>
      </div>
      <div className="store-card">
        <div className="store-img" style={{background:'linear-gradient(135deg,rgba(167,139,250,.1),rgba(109,40,217,.07))'}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
        <div className="store-body">
          <div className="store-name">طقم أدوات مكتبية فاخرة</div>
          <div><span className="store-price">75 ر.س</span></div>
          <button className="store-btn">أضف للسلة +</button>
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
        <div className="footer-logo">
          <div className="uni-logo" style={{width:'36px',height:'36px'}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
          <div>
            <div style={{fontSize:'15px',fontWeight:800,color:'var(--t)'}}>جامعة الرشيد</div>
            <div style={{fontSize:'9px',color:'var(--tm)'}}>تعمل على منصة متين السحابية</div>
          </div>
        </div>
        <div className="footer-about">جامعة الرشيد الأهلية — مؤسسة أكاديمية رائدة في المملكة العربية السعودية منذ 1987م، ملتزمة بتقديم تعليم عالي الجودة يواكب متطلبات رؤية 2030 ويبني قادة المستقبل.</div>
        <div className="footer-social">
          <a>𝕏</a><a>in</a><a>📸</a><a>▶</a>
        </div>
      </div>
      <div>
        <div className="footer-col-t">الكليات</div>
        <div className="footer-link">كلية الحوسبة وتقنية المعلومات</div>
        <div className="footer-link">كلية الطب والعلوم الصحية</div>
        <div className="footer-link">كلية الهندسة والعمارة</div>
        <div className="footer-link">كلية إدارة الأعمال</div>
        <div className="footer-link">جميع الكليات →</div>
      </div>
      <div>
        <div className="footer-col-t">الخدمات</div>
        <div className="footer-link">القبول والتسجيل</div>
        <div className="footer-link">المكتبة الرقمية</div>
        <div className="footer-link">مركز الخريجين والتوظيف</div>
        <div className="footer-link">الإرشاد الأكاديمي</div>
        <div className="footer-link">المتجر الإلكتروني</div>
      </div>
      <div>
        <div className="footer-col-t">تواصل معنا</div>
        <div className="footer-link">📍 الرياض، حي الملقا</div>
        <div className="footer-link">📞 920-000-0000</div>
        <div className="footer-link">✉️ info@alrashid.edu.sa</div>
        <div className="footer-link">الدعم الفني 24/7</div>
        <div className="footer-link">سياسة الخصوصية</div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="footer-copy">© 2025 جامعة الرشيد الأهلية. جميع الحقوق محفوظة.</div>
      <div className="powered">مدعومة بـ <strong>منصة متين</strong> ⚡</div>
    </div>
  </div>
</footer>

{/* MOBILE NAV */}
<div className="mob-nav" id="mobNav">
  <div className="mob-nav-bg" onClick={() => {closeMob()}}></div>
  <div className="mob-nav-panel">
    <div className="mob-close" onClick={() => {closeMob()}}>×</div>
    <div className="mob-link">الرئيسية</div>
    <div className="mob-link">الكليات والأقسام</div>
    <div className="mob-link">البرامج الأكاديمية</div>
    <div className="mob-link">القبول والتسجيل</div>
    <div className="mob-link">أخبار الجامعة</div>
    <div className="mob-link">تواصل معنا</div>
    <div style={{height:'1px',background:'var(--b1)',margin:'8px 0'}}></div>
    <button className="adm-submit" onClick={() => {closeMob();openModal('admModal')}}>التقديم الآن</button>
    <button className="nav-login" style={{width:'100%',marginTop:'8px'}} onClick={() => {closeMob();openModal('loginModal')}}>تسجيل الدخول</button>
  </div>
</div>

{/* LOGIN MODAL */}
<div className="modal-overlay" id="loginModal">
  <div className="modal-box">
    <div className="modal-hdr">
      <div className="modal-title"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> تسجيل الدخول</div>
      <div className="modal-close" onClick={() => {closeModal('loginModal')}}>×</div>
    </div>
    <div className="modal-body">
      <div className="modal-tabs">
        <button className="mtab active">طالب</button>
        <button className="mtab" onClick={() => {switchTab(this)}}>عضو هيئة التدريس</button>
        <button className="mtab" onClick={() => {switchTab(this)}}>ولي الأمر</button>
        <button className="mtab" onClick={() => {switchTab(this)}}>إدارة</button>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        <div>
          <label className="flbl">رقم الطالب / الهوية</label>
          <input className="finp" placeholder="S-2024-XXXXX" />
        </div>
        <div>
          <label className="flbl">كلمة المرور</label>
          <input className="finp" type="password" placeholder="••••••••" />
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <label style={{fontSize:'12px',color:'var(--td)',display:'flex',alignItems:'center',gap:'6px',cursor:'pointer'}}><input type="checkbox" style={{accentColor:'var(--uni-primary)'}} /> تذكرني</label>
          <span style={{fontSize:'12px',color:'var(--bl)',cursor:'pointer'}}>نسيت كلمة المرور؟</span>
        </div>
        <button className="adm-submit" style={{marginTop:'4px'}}>دخول →</button>
        <div style={{textAlign:'center',fontSize:'12px',color:'var(--tm)'}}>التحقق عبر <strong style={{color:'var(--bl)'}}>نفاذ</strong> مدعوم</div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}