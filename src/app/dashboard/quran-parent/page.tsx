'use client';
import React, { useState } from 'react';
import '../../styles/quran-parent.css';

export default function QuranParentPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="sidebar" id="sidebar">
  <div className="sb-top">
    <a className="sb-logo"><div className="logo-icon"><span className="ic" style={{width:'18px',height:'18px'}}><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><text x="4" y="18" font-size="16" font-weight="900" font-family="serif">م</text></svg></span></div><div><div className="logo-main">متين</div><div className="logo-sub">منصة إدارة التعليم</div></div></a>
    <div className="user-card">
      <div className="user-av"><span className="ic" style={{width:'16px',height:'16px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>
      <div><div className="user-name">أبو يوسف السبيعي</div><div className="user-role">ولي أمر</div></div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span> الرئيسية</a>

    <div className="nav-grp">متابعة الأبناء</div>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span> يوسف <span className="nb nb-grn">ممتاز</span></a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span> عمر <span className="nb nb-gold">جيد</span></a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span> تقدم الحفظ</a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg></span> سجل الحضور</a>
    <a className="nav-item" onClick={() => {openTasmi()}}><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span> التسميع المرئي <span className="nb nb-grn">جديد</span></a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span> نقاط التحفيز</a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span> التقارير الشهرية</a>

    <div className="nav-grp">التواصل</div>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> مراسلة المحفّظ <span className="nb nb-red">1</span></a>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg></span> إعلانات المركز</a>

    <div className="nav-grp">أخرى</div>
    <a className="nav-item"><span className="ic" style={{width:'15px',height:'15px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82.66V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06c.5-.5.63-1.25.33-1.82A1.65 1.65 0 0 0 3.09 14H3a2 2 0 1 1 0-4h.09c.7 0 1.33-.42 1.51-1.08a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.5.5 1.25.63 1.82.33A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09c0 .7.42 1.33 1.08 1.51.57.18 1.22.05 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.5.5-.63 1.25-.33 1.82.2.4.58.67 1.01.73H21a2 2 0 1 1 0 4h-.09c-.7 0-1.33.42-1.51 1.08z"/></svg></span> الإعدادات</a>
  </div>
  <div className="sb-footer"><button className="logout-btn"><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span> تسجيل خروج</button></div>
</div>
<div className="overlay" id="overlay" onClick={() => {toggleSidebar()}}></div>

<div className="main">
  <div className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSidebar()}}>☰</button>
      <div><div className="page-title">مرحباً أبو يوسف</div><div className="page-sub">متابعة أبنائك في مركز النور لتحفيظ القرآن</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn"><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></span> <span className="nb nb-red">1</span></button>
      <button className="hdr-btn hdr-btn-p" onClick={() => {openTasmi()}}><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span> التسميع المرئي</button>
    </div>
  </div>
  <div className="content">

    {/* Children Cards */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'18px'}}>
      <div style={{background:'rgba(16,185,129,.06)',border:'2px solid rgba(16,185,129,.3)',borderRadius:'14px',padding:'16px',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--green)'}}><span className="ic" style={{width:'22px',height:'22px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>
          <div><div style={{fontSize:'15px',fontWeight:800}}>يوسف</div><div style={{fontSize:'11px',color:'var(--green)',fontWeight:600}}>حلقة الإتقان · حفظ كامل</div></div>
          <span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)',marginRight:'auto'}}>ممتاز</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'11px'}}><span style={{color:'var(--text-dim)'}}>تقدم الحفظ</span><span style={{color:'var(--green)',fontWeight:700}}>30/30 جزء</span></div>
        <div className="prog-bar"><div className="prog-fill" style={{width:'100%',background:'var(--green)'}}></div></div>
      </div>
      <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'16px',cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'rgba(96,165,250,.12)',border:'1px solid rgba(96,165,250,.25)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--blue)'}}><span className="ic" style={{width:'22px',height:'22px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>
          <div><div style={{fontSize:'15px',fontWeight:800}}>عمر</div><div style={{fontSize:'11px',color:'var(--blue)',fontWeight:600}}>حلقة البراعم · جزء عمّ</div></div>
          <span className="status" style={{background:'rgba(96,165,250,.15)',color:'var(--blue)',border:'1px solid rgba(96,165,250,.3)',marginRight:'auto'}}>جيد</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'11px'}}><span style={{color:'var(--text-dim)'}}>تقدم الحفظ</span><span style={{color:'var(--blue)',fontWeight:700}}>جزء عمّ 80%</span></div>
        <div className="prog-bar"><div className="prog-fill" style={{width:'80%',background:'var(--blue)'}}></div></div>
      </div>
    </div>

    {/* Congratulations Banner */}
    <div style={{background:'linear-gradient(135deg,rgba(4,120,87,.06),rgba(212,168,67,.04))',border:'1px solid rgba(4,120,87,.18)',borderRadius:'16px',padding:'20px',marginBottom:'18px',display:'flex',alignItems:'center',gap:'14px'}}>
      <div style={{width:'48px',height:'48px',borderRadius:'12px',background:'rgba(212,168,67,.12)',border:'1px solid rgba(212,168,67,.25)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',flexShrink:0}}><span className="ic" style={{width:'24px',height:'24px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span></div>
      <div><div style={{fontSize:'14px',fontWeight:800,color:'var(--gold)'}}>مبارك! يوسف أتمّ ختمة القرآن الكريم كاملاً</div><div style={{fontSize:'11px',color:'var(--text-dim)',marginTop:'2px'}}>المرحلة القادمة: التأهل للإجازة بالسند المتصل</div></div>
    </div>

    {/* Video Tasmi' CTA */}
    <div style={{background:'linear-gradient(135deg,rgba(4,120,87,.08),rgba(16,185,129,.04))',border:'1px solid rgba(4,120,87,.2)',borderRadius:'14px',padding:'18px',marginBottom:'18px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer'}} onClick={() => {openTasmi()}}>
      <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
        <div style={{width:'52px',height:'52px',borderRadius:'14px',background:'linear-gradient(135deg,var(--qr),#065F46)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',boxShadow:'0 6px 20px rgba(4,120,87,.3)'}}><span className="ic" style={{width:'24px',height:'24px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span></div>
        <div><div style={{fontSize:'15px',fontWeight:800}}>التسميع المرئي</div><div style={{fontSize:'11px',color:'var(--text-dim)',marginTop:'2px'}}>ادخل حلقة التسميع مع الشيخ عبدالرحمن — الكاميرا + صفحة القرآن مباشرة</div></div>
      </div>
      <div style={{background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',borderRadius:'10px',padding:'8px 16px',color:'var(--green)',fontSize:'12px',fontWeight:700}}>ابدأ الآن</div>
    </div>

    <div className="kpi-grid">
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)',color:'var(--green)'}}><span className="ic" style={{width:'18px',height:'18px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span></div></div><div className="kpi-val">30</div><div className="kpi-label">جزء محفوظ (يوسف)</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)',color:'var(--blue)'}}><span className="ic" style={{width:'18px',height:'18px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span></div></div><div className="kpi-val">95%</div><div className="kpi-label">نسبة الحضور</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--gold)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'var(--gold-dim)',border:'1px solid var(--gold-border)',color:'var(--gold)'}}><span className="ic" style={{width:'18px',height:'18px'}}><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span></div></div><div className="kpi-val">480</div><div className="kpi-label">نقاط التحفيز</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--purple)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.22)',color:'var(--purple)'}}><span className="ic" style={{width:'18px',height:'18px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span></div></div><div className="kpi-val">1</div><div className="kpi-label">المركز في المسابقة</div></div>
    </div>

    <div className="grid-2">
      {/* Weekly Report */}
      <div className="card">
        <div className="card-hdr"><span className="card-title"><span className="ic" style={{width:'15px',height:'15px',color:'var(--green)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span> تقرير يوسف الأسبوعي</span><span className="status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>ممتاز</span></div>
        <div className="card-body">
          <div style={{marginBottom:'14px'}}>
            <div style={{fontSize:'12px',fontWeight:700,marginBottom:'8px'}}>الحفظ الجديد</div>
            <div style={{padding:'10px 12px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'10px'}}>
              <div style={{fontSize:'12px',color:'var(--text-dim)'}}>المقرر: <strong>سورة النساء (1-35)</strong></div>
              <div style={{fontSize:'11px',color:'var(--green)',marginTop:'4px',fontWeight:600}}>تم الحفظ بتقدير ممتاز</div>
            </div>
          </div>
          <div style={{marginBottom:'14px'}}>
            <div style={{fontSize:'12px',fontWeight:700,marginBottom:'8px'}}>المراجعة</div>
            <div style={{padding:'10px 12px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'10px'}}>
              <div style={{fontSize:'12px',color:'var(--text-dim)'}}>تمت مراجعة: <strong>جزء 28 + 29 + 30</strong></div>
              <div style={{fontSize:'11px',color:'var(--green)',marginTop:'4px',fontWeight:600}}>ممتاز — الحفظ متين</div>
            </div>
          </div>
          <div style={{marginTop:'14px',padding:'10px',background:'rgba(212,168,67,.06)',border:'1px solid rgba(212,168,67,.15)',borderRadius:'8px'}}>
            <div style={{fontSize:'11px',color:'var(--gold)',fontWeight:700}}>ملاحظة المحفّظ:</div>
            <div style={{fontSize:'11.5px',color:'var(--text-dim)',marginTop:'4px',lineHeight:'1.5'}}>ماشاءالله تبارك الله، يوسف من أفضل الطلاب. ختم القرآن بإتقان وهو جاهز لمرحلة الإجازة.</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="card-hdr"><span className="card-title"><span className="ic" style={{width:'15px',height:'15px',color:'var(--gold)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></span> إنجازات يوسف</span></div>
        <div className="card-body">
          <div style={{padding:'14px',background:'linear-gradient(135deg,rgba(212,168,67,.08),rgba(4,120,87,.04))',border:'1px solid rgba(212,168,67,.2)',borderRadius:'12px',textAlign:'center',marginBottom:'16px'}}>
            <div style={{width:'56px',height:'56px',margin:'0 auto 8px',borderRadius:'50%',background:'var(--gold-dim)',border:'2px solid var(--gold-border)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)'}}><span className="ic" style={{width:'28px',height:'28px'}}><svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M22 10l-10-6L2 10l10 6 10-6z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" fill="none" stroke="currentColor" strokeWidth="2"/></svg></span></div>
            <div style={{fontSize:'16px',fontWeight:800,color:'var(--gold)'}}>حافظ القرآن الكريم</div>
            <div style={{fontSize:'11px',color:'var(--text-dim)',marginTop:'4px'}}>30 جزءاً كاملاً — بتقدير ممتاز</div>
            <button style={{marginTop:'10px',background:'var(--gold-dim)',border:'1px solid var(--gold-border)',borderRadius:'8px',padding:'6px 16px',color:'var(--gold)',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}} onClick={() => {toast('جارٍ تحميل الشهادة','var(--gold)')}}>تحميل الشهادة</button>
          </div>
          <div style={{textAlign:'center',padding:'14px',background:'var(--gold-dim)',border:'1px solid var(--gold-border)',borderRadius:'10px'}}>
            <div style={{fontSize:'24px',fontWeight:800,color:'var(--gold)'}}>480 نقطة</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'2px'}}>الترتيب: الأول على الحلقة</div>
          </div>
        </div>
      </div>
    </div>

    {/* Chat */}
    <div className="card">
      <div className="card-hdr"><span className="card-title"><span className="ic" style={{width:'15px',height:'15px',color:'var(--cyan)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> المحادثة مع المحفّظ</span></div>
      <div className="card-body">
        <div style={{display:'flex',flexDirection:'column',gap:'10px',marginBottom:'14px'}}>
          <div style={{display:'flex',gap:'8px'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'rgba(212,168,67,.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--gold)',flexShrink:0}}><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>
            <div style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--border2)',borderRadius:'10px 10px 10px 2px',padding:'10px 14px',maxWidth:'75%'}}>
              <div style={{fontSize:'10px',color:'var(--gold)',fontWeight:600,marginBottom:'4px'}}>الشيخ عبدالرحمن</div>
              <div style={{fontSize:'12px',color:'var(--text-dim)',lineHeight:'1.5'}}>السلام عليكم، مبارك ختمة يوسف. يوسف جاهز للإجازة بإذن الله، نحتاج موافقتكم للبدء.</div>
              <div style={{fontSize:'9px',color:'var(--text-muted)',marginTop:'4px'}}>أمس 8:30 م</div>
            </div>
          </div>
          <div style={{display:'flex',gap:'8px',flexDirection:'row-reverse'}}>
            <div style={{width:'28px',height:'28px',borderRadius:'7px',background:'rgba(16,185,129,.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--green)',flexShrink:0}}><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span></div>
            <div style={{background:'rgba(4,120,87,.08)',border:'1px solid rgba(4,120,87,.2)',borderRadius:'10px 10px 2px 10px',padding:'10px 14px',maxWidth:'75%'}}>
              <div style={{fontSize:'12px',color:'var(--text-dim)',lineHeight:'1.5'}}>وعليكم السلام يا شيخنا، جزاكم الله خيراً. بكل سرور نوافق على البدء بالإجازة إن شاء الله.</div>
              <div style={{fontSize:'9px',color:'var(--text-muted)',marginTop:'4px'}}>اليوم 9:15 ص</div>
            </div>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <input type="text" placeholder="اكتب رسالتك..." style={{flex:1,background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',borderRadius:'10px',padding:'10px 14px',color:'var(--text)',fontSize:'12px',fontFamily:'var(--font)',outline:'none'}} />
          <button style={{background:'linear-gradient(135deg,var(--qr),#065F46)',border:'none',borderRadius:'10px',padding:'10px 18px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',display:'flex',alignItems:'center',gap:'5px'}} onClick={() => {toast('تم إرسال الرسالة','var(--green)')}}><span className="ic" style={{width:'14px',height:'14px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></span> إرسال</button>
        </div>
      </div>
    </div>
  </div>
</div>

{/* ═══════════════════════════════════════════ */}
{/* ═══ VIDEO TASMI' (RECITATION) MODAL ═══ */}
{/* ═══════════════════════════════════════════ */}
<div className="tasmi-modal" id="tasmi-modal">
  <div className="tasmi-header">
    <div className="tasmi-title">
      <span className="ic" style={{width:'18px',height:'18px',color:'var(--green)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span>
      التسميع المرئي — الشيخ عبدالرحمن السديري
    </div>
    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
      <div className="tasmi-live"><div className="tasmi-live-dot"></div> مباشر</div>
      <button className="tasmi-close" onClick={() => {closeTasmi()}}>إغلاق</button>
    </div>
  </div>

  <div className="tasmi-body">
    {/* Video Section */}
    <div className="tasmi-video-section">
      <div className="tasmi-video-bg"></div>
      <div className="tasmi-video-placeholder" id="sheikh-video">
        <div className="cam-icon"><span className="ic" style={{width:'24px',height:'24px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span></div>
        <div className="tasmi-video-label">كاميرا الشيخ</div>
        <div className="tasmi-video-name">الشيخ عبدالرحمن السديري</div>
        <div style={{fontSize:'10px',color:'rgba(4,120,87,.7)',fontWeight:600,marginTop:'2px'}}>حفص عن عاصم · مجاز بالسند المتصل</div>
      </div>
      {/* Self Camera */}
      <div className="self-cam">
        <div>
          <div style={{color:'var(--green)',marginBottom:'2px',display:'flex',justifyContent:'center'}}><span className="ic" style={{width:'16px',height:'16px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></span></div>
          <div className="self-cam-label">الطالب يوسف</div>
        </div>
      </div>
      {/* Connection status */}
      <div style={{position:'absolute',top:'12px',right:'12px',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.25)',borderRadius:'8px',padding:'4px 10px',fontSize:'10px',color:'var(--green)',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',zIndex:3}}>
        <span className="ic" style={{width:'12px',height:'12px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span> متصل
      </div>
    </div>

    {/* Quran Section */}
    <div className="tasmi-quran-section">
      <div className="tasmi-quran-header">
        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
          <span className="ic" style={{width:'16px',height:'16px',color:'var(--gold)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
          <span className="surah-name">سورة الفاتحة</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          <span className="ayah-counter">الآية: <strong id="current-ayah">1</strong> / 7</span>
          <button style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)',borderRadius:'6px',padding:'4px 10px',color:'var(--gold)',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}} onClick={() => {nextSurah()}}>السورة التالية</button>
        </div>
      </div>
      <div className="tasmi-quran-body">
        <div className="quran-text" id="quran-display">
          <span className="ayah active" data-num="1" onClick={() => {setAyah(1)}}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span><span className="ayah-num">﴿١﴾</span>
          <span className="ayah" data-num="2" onClick={() => {setAyah(2)}}>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</span><span className="ayah-num">﴿٢﴾</span>
          <span className="ayah" data-num="3" onClick={() => {setAyah(3)}}>الرَّحْمَٰنِ الرَّحِيمِ</span><span className="ayah-num">﴿٣﴾</span>
          <span className="ayah" data-num="4" onClick={() => {setAyah(4)}}>مَالِكِ يَوْمِ الدِّينِ</span><span className="ayah-num">﴿٤﴾</span>
          <span className="ayah" data-num="5" onClick={() => {setAyah(5)}}>إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ</span><span className="ayah-num">﴿٥﴾</span>
          <span className="ayah" data-num="6" onClick={() => {setAyah(6)}}>اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ</span><span className="ayah-num">﴿٦﴾</span>
          <span className="ayah" data-num="7" onClick={() => {setAyah(7)}}>صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ</span><span className="ayah-num">﴿٧﴾</span>
        </div>
      </div>
    </div>
  </div>

  {/* Controls */}
  <div className="tasmi-controls">
    <div style={{textAlign:'center'}}>
      <button className="ctrl-btn ctrl-mic" id="mic-btn" onClick={() => {toggleMic()}}><span className="ic" style={{width:'20px',height:'20px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></span></button>
      <div className="ctrl-label">الميكروفون</div>
    </div>
    <div style={{textAlign:'center'}}>
      <button className="ctrl-btn ctrl-cam" id="cam-btn" onClick={() => {toggleCam()}}><span className="ic" style={{width:'20px',height:'20px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></span></button>
      <div className="ctrl-label">الكاميرا</div>
    </div>
    <div style={{textAlign:'center'}}>
      <button className="ctrl-btn ctrl-end" onClick={() => {closeTasmi()}}><span className="ic" style={{width:'24px',height:'24px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.5 16.5l1.27-1.27a2 2 0 0 1 2.11-.45c.89.33 1.84.56 2.81.7a2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07"/><path d="M5 4.87a19.79 19.79 0 0 1-3.07-3.07A2 2 0 0 1 4.11 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 7.91"/></svg></span></button>
      <div className="ctrl-label">إنهاء</div>
    </div>
    <div style={{textAlign:'center'}}>
      <button className="ctrl-btn ctrl-next" onClick={() => {nextAyah()}}><span className="ic" style={{width:'20px',height:'20px'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span></button>
      <div className="ctrl-label">الآية التالية</div>
    </div>
  </div>
</div>

<div className="toast" id="toast-el"></div>
    </div>
  );
}