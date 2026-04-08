'use client';
import React, { useState } from 'react';
import '../../../styles/school-teacher.css';

export default function TeacherPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="dashboard-page">
<div className="overlay" id="overlay" onClick={() => {closeSb()}}></div>

{/* SIDEBAR */}
<aside className="sidebar" id="sidebar">
  <div className="sb-top">
    <a className="sb-logo" href="#">
      <div className="logo-icon">م</div>
      <div><div className="logo-main">متين</div><div className="logo-sub">نظام إدارة التعليم</div></div>
    </a>
    <div className="teacher-card">
      <div className="teacher-av">👨‍🏫</div>
      <div style={{minWidth:0}}>
        <div className="teacher-name">محمد الغامدي</div>
        <div className="teacher-role">معلم</div>
        <div className="teacher-subject">الرياضيات — مدرسة الأمل</div>
      </div>
    </div>
  </div>

  <nav className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      لوحتي <span className="nav-dot"></span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
      التقويم
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      ملفي الإنجازي
    </a>

    <div className="nav-grp">الفصل الدراسي</div>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      طلابي
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      الحضور والغياب
      <span className="nb nb-gold">اليوم</span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
      الدرجات
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
      الواجبات
      <span className="nb nb-red">3</span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
      السلوك والانضباط
    </a>

    <div className="nav-grp">الاختبارات</div>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
      الاختبارات
      <span className="nb nb-blue">2</span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      بنك الأسئلة
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
      جدول الاختبارات
    </a>

    <div className="nav-grp">التعليم الإلكتروني</div>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      المحاضرات
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
      البث المباشر
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      المكتبة
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
      الاستبيانات
    </a>

    <div className="nav-grp">التواصل</div>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      الرسائل
      <span className="nb nb-red">5</span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      الإشعارات
      <span className="nb nb-red">3</span>
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      الملتقى المجتمعي
    </a>
    <a className="nav-item" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      المساعد الذكي
    </a>
  </nav>

  <div className="sb-footer">
    <button className="logout-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      تسجيل الخروج
    </button>
  </div>
</aside>

{/* MAIN */}
<div className="main">
  <header className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSb()}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div>
        <div className="hdr-title">لوحتي</div>
        <div className="hdr-sub">الأحد 27 مارس — الفصل الثاني</div>
      </div>
    </div>
    <div className="hdr-right">
      <div className="hdr-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span className="notif-dot"></span>
      </div>
      <div className="hdr-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span className="notif-dot"></span>
      </div>
      <div className="user-btn">
        <div className="user-av">👨‍🏫</div>
        <div className="uinfo">
          <div className="uname">محمد الغامدي</div>
          <div className="urole">معلم رياضيات</div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </header>

  <div className="content">

    {/* PAGE HEADER */}
    <div className="pg-hdr">
      <div>
        <div className="pg-title">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          مرحباً، محمد 👋
        </div>
        <div className="pg-sub">لديك 4 حصص اليوم — الحصة الثالثة جارية الآن</div>
      </div>
      <button className="btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        تسجيل حضور الآن
      </button>
    </div>

    {/* TODAY SCHEDULE */}
    <div className="schedule-bar">
      <div className="schedule-title">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
        جدول اليوم
      </div>
      <div className="periods">
        <div className="period done">
          <div className="period-time">7:30 — 8:15</div>
          <div className="period-subject">الرياضيات</div>
          <div className="period-class">3/أ — 35 طالب</div>
        </div>
        <div className="period done">
          <div className="period-time">8:15 — 9:00</div>
          <div className="period-subject">الرياضيات</div>
          <div className="period-class">3/ب — 33 طالب</div>
        </div>
        <div className="period current">
          <span className="period-badge now-badge">الآن</span>
          <div className="period-time">9:15 — 10:00</div>
          <div className="period-subject" style={{color:'var(--accent)'}}>الرياضيات</div>
          <div className="period-class">4/أ — 32 طالب</div>
        </div>
        <div className="period free">
          <span className="period-badge free-badge">فراغ</span>
          <div className="period-time">10:00 — 10:45</div>
          <div className="period-subject" style={{color:'var(--text-muted)'}}>استراحة</div>
          <div className="period-class" style={{color:'var(--text-muted)'}}>—</div>
        </div>
        <div className="period upcoming">
          <div className="period-time">10:45 — 11:30</div>
          <div className="period-subject">الرياضيات</div>
          <div className="period-class">4/ب — 30 طالب</div>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="stats-grid">
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(74,222,128,0.05) 0%,transparent 60%)',pointerEvents:'none'}}></div>
        <div className="stat-icon" style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="stat-val" style={{color:'var(--accent)'}}>130</div>
        <div className="stat-lbl">إجمالي طلابي</div>
        <div className="stat-sub" style={{color:'rgba(74,222,128,0.6)'}}>4 فصول</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(96,165,250,0.05) 0%,transparent 60%)',pointerEvents:'none'}}></div>
        <div className="stat-icon" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div className="stat-val" style={{color:'var(--blue)'}}>94%</div>
        <div className="stat-lbl">متوسط الحضور</div>
        <div className="stat-sub" style={{color:'rgba(96,165,250,0.6)'}}>↑ هذا الأسبوع</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(251,146,60,0.05) 0%,transparent 60%)',pointerEvents:'none'}}></div>
        <div className="stat-icon" style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
        </div>
        <div className="stat-val" style={{color:'var(--orange)'}}>3</div>
        <div className="stat-lbl">واجبات معلقة</div>
        <div className="stat-sub" style={{color:'rgba(251,146,60,0.6)'}}>لم تُصحَّح بعد</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(167,139,250,0.05) 0%,transparent 60%)',pointerEvents:'none'}}></div>
        <div className="stat-icon" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div className="stat-val" style={{color:'var(--purple)'}}>78%</div>
        <div className="stat-lbl">متوسط الدرجات</div>
        <div className="stat-sub" style={{color:'rgba(167,139,250,0.6)'}}>آخر اختبار</div>
      </div>
    </div>

    {/* ROW 2 */}
    <div className="grid-2">

      {/* تسجيل حضور الفصل الحالي */}
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            حضور الفصل 4/أ — الآن
            <span className="card-count">32 طالب</span>
          </div>
          <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
            <span className="badge b-accent">● جارٍ</span>
            <button className="card-link">حفظ</button>
          </div>
        </div>
        {/* Summary bar */}
        <div style={{display:'flex',gap:0,borderBottom:'1px solid var(--border2)'}}>
          <div style={{flex:1,padding:'8px 12px',textAlign:'center',borderLeft:'1px solid var(--border2)'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--accent)'}}>28</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>حاضر</div>
          </div>
          <div style={{flex:1,padding:'8px 12px',textAlign:'center',borderLeft:'1px solid var(--border2)'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--red)'}}>2</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>غائب</div>
          </div>
          <div style={{flex:1,padding:'8px 12px',textAlign:'center'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--orange)'}}>2</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>متأخر</div>
          </div>
        </div>
        <div style={{maxHeight:'200px',overflowY:'auto'}}>
          <div className="att-student">
            <div className="att-num">1</div>
            <div className="att-name">أحمد محمد الزهراني</div>
            <div className="att-btns">
              <button className="att-btn att-present selected-p" title="حاضر">✓</button>
              <button className="att-btn att-absent" title="غائب">✗</button>
              <button className="att-btn att-late" title="متأخر">⏰</button>
            </div>
          </div>
          <div className="att-student">
            <div className="att-num">2</div>
            <div className="att-name">سارة عبدالله العتيبي</div>
            <div className="att-btns">
              <button className="att-btn att-present selected-p" title="حاضر">✓</button>
              <button className="att-btn att-absent" title="غائب">✗</button>
              <button className="att-btn att-late" title="متأخر">⏰</button>
            </div>
          </div>
          <div className="att-student">
            <div className="att-num">3</div>
            <div className="att-name">خالد فهد الشمري</div>
            <div className="att-btns">
              <button className="att-btn att-present" title="حاضر">✓</button>
              <button className="att-btn att-absent selected-a" title="غائب">✗</button>
              <button className="att-btn att-late" title="متأخر">⏰</button>
            </div>
          </div>
          <div className="att-student">
            <div className="att-num">4</div>
            <div className="att-name">نورة سعد الحربي</div>
            <div className="att-btns">
              <button className="att-btn att-present selected-p" title="حاضر">✓</button>
              <button className="att-btn att-absent" title="غائب">✗</button>
              <button className="att-btn att-late" title="متأخر">⏰</button>
            </div>
          </div>
          <div className="att-student">
            <div className="att-num">5</div>
            <div className="att-name">عمر علي القحطاني</div>
            <div className="att-btns">
              <button className="att-btn att-present" title="حاضر">✓</button>
              <button className="att-btn att-absent" title="غائب">✗</button>
              <button className="att-btn att-late selected-l" title="متأخر">⏰</button>
            </div>
          </div>
          <div className="att-student">
            <div className="att-num">6</div>
            <div className="att-name">ريم محمد المطيري</div>
            <div className="att-btns">
              <button className="att-btn att-present selected-p" title="حاضر">✓</button>
              <button className="att-btn att-absent" title="غائب">✗</button>
              <button className="att-btn att-late" title="متأخر">⏰</button>
            </div>
          </div>
          <div style={{padding:'10px 12px',textAlign:'center',fontSize:'11px',color:'var(--text-muted)'}}>+ 26 طالب آخر</div>
        </div>
      </div>

      {/* جانبي: واجبات + رسائل */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

        {/* الواجبات المعلقة */}
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
              واجبات تحتاج تصحيح
            </div>
            <button className="card-link" style={{color:'var(--orange)'}}>الكل</button>
          </div>
          <div>
            <div className="hw-item">
              <div className="hw-subject" style={{background:'var(--blue)'}}></div>
              <div style={{flex:1,minWidth:0}}>
                <div className="hw-name">واجب المعادلات التربيعية</div>
                <div className="hw-meta">3/أ — 35 طالب — سُلّم أمس</div>
              </div>
              <button className="btn-sm" style={{background:'rgba(251,146,60,0.08)',color:'var(--orange)',border:'1px solid rgba(251,146,60,0.2)'}}>تصحيح</button>
            </div>
            <div className="hw-item">
              <div className="hw-subject" style={{background:'var(--purple)'}}></div>
              <div style={{flex:1,minWidth:0}}>
                <div className="hw-name">تمارين الهندسة</div>
                <div className="hw-meta">3/ب — 28 طالب — سُلّم منذ يومين</div>
              </div>
              <button className="btn-sm" style={{background:'rgba(251,146,60,0.08)',color:'var(--orange)',border:'1px solid rgba(251,146,60,0.2)'}}>تصحيح</button>
            </div>
            <div className="hw-item" style={{borderBottom:'none'}}>
              <div className="hw-subject" style={{background:'var(--accent)'}}></div>
              <div style={{flex:1,minWidth:0}}>
                <div className="hw-name">مسائل الكسور</div>
                <div className="hw-meta">4/أ — 20 طالب — سُلّم اليوم</div>
              </div>
              <button className="btn-sm" style={{background:'rgba(74,222,128,0.08)',color:'var(--accent)',border:'1px solid rgba(74,222,128,0.2)'}}>جديد</button>
            </div>
          </div>
        </div>

        {/* آخر الرسائل */}
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              الرسائل
              <span className="card-count" style={{background:'rgba(239,68,68,0.1)',borderColor:'rgba(239,68,68,0.2)',color:'var(--red)'}}>5</span>
            </div>
            <button className="card-link" style={{color:'var(--blue)'}}>الكل</button>
          </div>
          <div>
            <div className="msg-item">
              <div className="msg-unread"></div>
              <div className="msg-av" style={{background:'rgba(251,146,60,0.1)',color:'var(--orange)'}}>و</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="msg-name">ولي أمر خالد الشمري</div>
                <div className="msg-preview">السلام عليكم، أريد الاستفسار عن...</div>
              </div>
              <div className="msg-time">5د</div>
            </div>
            <div className="msg-item">
              <div className="msg-unread"></div>
              <div className="msg-av" style={{background:'rgba(96,165,250,0.1)',color:'var(--blue)'}}>س</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="msg-name">سارة العتيبي</div>
                <div className="msg-preview">أستاذ، هل الواجب مطلوب غداً؟</div>
              </div>
              <div className="msg-time">22د</div>
            </div>
            <div className="msg-item" style={{borderBottom:'none'}}>
              <div style={{width:'7px',flexShrink:0}}></div>
              <div className="msg-av" style={{background:'rgba(167,139,250,0.1)',color:'var(--purple)'}}>إ</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="msg-name">إدارة المدرسة</div>
                <div className="msg-preview">تذكير: اجتماع المعلمين الثلاثاء</div>
              </div>
              <div className="msg-time">1س</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* ROW 3: درجات + اختبارات */}
    <div className="grid-3">

      {/* درجات آخر اختبار */}
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            درجات الفصل 3/أ
          </div>
          <button className="card-link" style={{color:'var(--purple)'}}>تعديل</button>
        </div>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>الطالب</th><th>الدرجة</th><th>التقدير</th></tr></thead>
            <tbody>
              <tr><td style={{fontWeight:600,color:'var(--text)'}}>أحمد الزهراني</td><td style={{color:'var(--accent)',fontWeight:700}}>95/100</td><td><span className="badge b-green">ممتاز</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--text)'}}>سارة العتيبي</td><td style={{color:'var(--accent)',fontWeight:700}}>88/100</td><td><span className="badge b-blue">جيد جداً</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--text)'}}>خالد الشمري</td><td style={{color:'var(--orange)',fontWeight:700}}>62/100</td><td><span className="badge b-orange">مقبول</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--text)'}}>نورة الحربي</td><td style={{color:'var(--accent)',fontWeight:700}}>91/100</td><td><span className="badge b-green">ممتاز</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--text)'}}>عمر القحطاني</td><td style={{color:'var(--red)',fontWeight:700}}>45/100</td><td><span className="badge b-red">ضعيف</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* الاختبارات القادمة */}
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            اختباراتي القادمة
          </div>
          <button className="card-link" style={{color:'var(--blue)'}}>إضافة</button>
        </div>
        <div>
          <div className="exam-item">
            <div className="exam-date"><div className="exam-day">29</div><div className="exam-month">مارس</div></div>
            <div style={{flex:1}}>
              <div className="exam-name">اختبار الجبر</div>
              <div className="exam-meta">الفصل 3/أ · 9:00 ص · 50 درجة</div>
            </div>
            <span className="badge b-blue">غداً</span>
          </div>
          <div className="exam-item" style={{borderBottom:'none'}}>
            <div className="exam-date"><div className="exam-day">05</div><div className="exam-month">أبريل</div></div>
            <div style={{flex:1}}>
              <div className="exam-name">اختبار الهندسة</div>
              <div className="exam-meta">الفصل 4/ب · 10:00 ص · 50 درجة</div>
            </div>
            <span className="badge b-accent">8 أيام</span>
          </div>
        </div>
        <div style={{padding:'12px 14px',borderTop:'1px solid var(--border2)'}}>
          <button className="btn-primary" style={{width:'100%',justifyContent:'center',fontSize:'12px',padding:'8px'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إنشاء اختبار جديد
          </button>
        </div>
      </div>

      {/* آخر النشاطات */}
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            آخر النشاطات
          </div>
        </div>
        <div>
          <div className="hw-item">
            <div className="hw-subject" style={{background:'var(--accent)'}}></div>
            <div style={{flex:1}}><div className="hw-name" style={{fontSize:'12px'}}>سجّلت حضور الفصل 3/أ</div><div className="hw-meta">94.3% حضور</div></div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>10د</div>
          </div>
          <div className="hw-item">
            <div className="hw-subject" style={{background:'var(--orange)'}}></div>
            <div style={{flex:1}}><div className="hw-name" style={{fontSize:'12px'}}>أضفت واجب مسائل الكسور</div><div className="hw-meta">الفصل 4/أ — موعد الغد</div></div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>45د</div>
          </div>
          <div className="hw-item">
            <div className="hw-subject" style={{background:'var(--purple)'}}></div>
            <div style={{flex:1}}><div className="hw-name" style={{fontSize:'12px'}}>رفعت درجات اختبار الجبر</div><div className="hw-meta">الفصل 3/أ — متوسط 78%</div></div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>2س</div>
          </div>
          <div className="hw-item" style={{borderBottom:'none'}}>
            <div className="hw-subject" style={{background:'var(--blue)'}}></div>
            <div style={{flex:1}}><div className="hw-name" style={{fontSize:'12px'}}>رسالة لولي أمر خالد</div><div className="hw-meta">بخصوص الدرجة المنخفضة</div></div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>3س</div>
          </div>
        </div>
      </div>

    </div>

    {/* QUICK ACTIONS */}
    <div style={{marginBottom:'6px'}}>
      <div style={{color:'var(--text-muted)',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>إجراءات سريعة</div>
      <div className="quick-grid">
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
          <span className="quick-lbl">تسجيل حضور</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div>
          <span className="quick-lbl">واجب جديد</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
          <span className="quick-lbl">إدخال درجات</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div>
          <span className="quick-lbl">اختبار جديد</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
          <span className="quick-lbl">رسالة للأهل</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.899L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>
          <span className="quick-lbl">محاضرة</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
          <span className="quick-lbl">السلوك</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(96,165,250,0.1)',border:'1px solid rgba(96,165,250,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
          <span className="quick-lbl">تقرير</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>
          <span className="quick-lbl">بث مباشر</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(251,146,60,0.1)',border:'1px solid rgba(251,146,60,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <span className="quick-lbl">المكتبة</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(212,168,67,0.1)',border:'1px solid rgba(212,168,67,0.2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <span className="quick-lbl">التقويم</span>
        </a>
        <a className="quick-item" href="#">
          <div className="quick-icon" style={{background:'rgba(255,255,255,0.04)',border:'1px solid var(--border2)'}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <span className="quick-lbl">المساعد الذكي</span>
        </a>
      </div>
    </div>

  </div>

  <footer className="footer">
    <p>© 2026 متين — مدرسة الأمل الدولية</p>
    <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
  </footer>
</div>
    </div>
  );
}