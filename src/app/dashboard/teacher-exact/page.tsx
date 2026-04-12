'use client';

import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// لوحة المعلم - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState('overview');

  const styles = `
    :root {
      --accent:#4ADE80; --accent2:#22C55E;
      --accent-dim:rgba(74,222,128,0.1); --accent-border:rgba(74,222,128,0.22);
      --gold:#D4A843; --gold-dim:rgba(212,168,67,0.1); --gold-border:rgba(212,168,67,0.22);
      --bg:#06060E; --bg-sb:#08081A; --bg-card:rgba(255,255,255,0.025);
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
      --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
      --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA; --orange:#FB923C;
      --font:'IBM Plex Sans Arabic',sans-serif;
      --sw:260px; --hh:62px;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    
    .sidebar{width:var(--sw);flex-shrink:0;height:100vh;background:var(--bg-sb);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;position:relative;}
    .sidebar::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;background:linear-gradient(180deg,transparent,var(--accent) 30%,var(--accent) 70%,transparent 100%);opacity:0.2;}
    .sb-top{padding:16px 14px 12px;border-bottom:1px solid var(--border);flex-shrink:0;}
    .sb-logo{display:flex;align-items:center;gap:9px;margin-bottom:12px;text-decoration:none;}
    .logo-icon{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--gold),#E8C060);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#000;box-shadow:0 4px 12px rgba(212,168,67,0.3);flex-shrink:0;}
    .logo-main{font-size:17px;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
    .logo-sub{font-size:9px;color:var(--text-muted);font-weight:500;}
    .teacher-card{background:var(--accent-dim);border:1px solid var(--accent-border);border-radius:9px;padding:9px 11px;display:flex;align-items:center;gap:9px;}
    .teacher-av{width:32px;height:32px;border-radius:8px;background:rgba(74,222,128,0.12);border:1px solid var(--accent-border);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
    .teacher-name{color:var(--text);font-size:12.5px;font-weight:700;}
    .teacher-role{color:var(--accent);font-size:10.5px;font-weight:600;margin-top:1px;}
    .teacher-subject{color:var(--text-muted);font-size:10px;margin-top:1px;}
    
    .nav{flex:1;padding:6px 0 4px;overflow-y:auto;overflow-x:hidden;}
    .nav::-webkit-scrollbar{width:3px;}
    .nav::-webkit-scrollbar-thumb{background:rgba(74,222,128,0.18);border-radius:2px;}
    .nav-grp{font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:9px 14px 3px;}
    .nav-item{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 14px;font-size:12px;color:var(--text-dim);cursor:pointer;border-right:3px solid transparent;margin:1px 5px 1px 0;border-radius:0 7px 7px 0;transition:all 0.15s;text-decoration:none;}
    .nav-item:hover{background:rgba(255,255,255,0.04);color:var(--text);}
    .nav-item.active{background:var(--accent-dim);border-right-color:var(--accent);color:var(--text);font-weight:600;}
    .nb{font-size:10px;font-weight:700;padding:1px 6px;border-radius:10px;margin-right:auto;}
    .nb-red{background:rgba(239,68,68,0.12);color:var(--red);border:1px solid rgba(239,68,68,0.22);}
    .nb-accent{background:var(--accent-dim);color:var(--accent);border:1px solid var(--accent-border);}
    .nav-dot{width:5px;height:5px;border-radius:50%;background:var(--accent);margin-right:auto;flex-shrink:0;box-shadow:0 0 5px var(--accent);}
    
    .sb-footer{padding:10px 12px;border-top:1px solid var(--border);flex-shrink:0;}
    .logout-btn{width:100%;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.15);border-radius:8px;padding:8px 12px;color:#F87171;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;font-family:var(--font);}
    
    .main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
    .header{height:var(--hh);background:rgba(6,6,14,0.88);backdrop-filter:blur(24px) saturate(1.8);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 18px;flex-shrink:0;z-index:10;}
    .hdr-left{display:flex;align-items:center;gap:10px;}
    .hdr-title{font-size:16px;font-weight:800;color:var(--text);letter-spacing:-0.3px;}
    .hdr-sub{font-size:10.5px;color:rgba(238,238,245,0.35);margin-top:1px;}
    .hdr-right{display:flex;align-items:center;gap:7px;}
    .hdr-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-dim);position:relative;flex-shrink:0;}
    .notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--red);border:1.5px solid var(--bg);}
    .user-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:5px 10px;display:flex;align-items:center;gap:7px;cursor:pointer;flex-shrink:0;}
    .user-av{width:28px;height:28px;border-radius:7px;background:rgba(74,222,128,0.1);border:1.5px solid rgba(74,222,128,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;}
    .uname{font-size:12px;font-weight:700;line-height:1.2;}
    .urole{font-size:9.5px;color:var(--accent);font-weight:700;}
    
    .content{flex:1;padding:18px 20px;overflow-y:auto;background:radial-gradient(circle at 70% 0%,rgba(74,222,128,0.025) 0%,transparent 55%);}
    .content::-webkit-scrollbar{width:4px;}
    .content::-webkit-scrollbar-thumb{background:rgba(74,222,128,0.15);border-radius:2px;}
    
    .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;gap:10px;}
    .page-title{color:var(--accent);font-size:19px;font-weight:800;display:flex;align-items:center;gap:8px;}
    .btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;border-radius:9px;padding:9px 16px;color:#04190E;font-weight:700;font-size:13px;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:6px;white-space:nowrap;}
    .btn-outline{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;padding:8px 14px;color:var(--text-dim);font-weight:600;font-size:12px;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:6px;white-space:nowrap;}
    
    .schedule-bar{background:var(--bg-card);border:1px solid var(--border2);border-radius:13px;padding:14px 16px;margin-bottom:14px;overflow-x:auto;}
    .schedule-title{font-size:12px;color:var(--text-muted);font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
    .periods{display:flex;gap:10px;min-width:max-content;}
    .period{border-radius:10px;padding:10px 14px;min-width:110px;position:relative;flex-shrink:0;}
    .period.current{border:2px solid var(--accent);background:rgba(74,222,128,0.06);}
    .period.done{opacity:0.45;}
    .period.free{background:rgba(255,255,255,0.02);border:1px solid var(--border2);}
    .period.upcoming{background:rgba(255,255,255,0.025);border:1px solid var(--border2);}
    .period-time{font-size:10px;color:var(--text-muted);font-weight:600;margin-bottom:4px;}
    .period-subject{font-size:13px;font-weight:700;color:var(--text);}
    .period-class{font-size:11px;color:var(--text-dim);margin-top:2px;}
    
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
    .stat-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:11px;padding:14px;}
    .stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:18px;}
    .stat-value{font-size:22px;font-weight:800;color:var(--text);margin-bottom:2px;}
    .stat-label{font-size:11px;color:var(--text-muted);}
    
    @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
    @media(max-width:768px){.periods{overflow-x:auto;}.stats-grid{grid-template-columns:repeat(2,1fr);}}
  `;

  const navItems: Array<{ id: string; label: React.ReactNode; icon: React.ReactNode; active?: boolean; badge?: string; badgeType?: string }> = [
    { id: 'overview', label: 'النظرة العامة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, active: true },
    { id: 'schedule', label: 'جدولي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> },
    { id: 'classes', label: 'فصولي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, badge: '3' },
    { id: 'students', label: 'الطلاب', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg> },
    { id: 'attendance', label: 'الحضور', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { id: 'grades', label: 'التقييم', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, badge: '12' },
    { id: 'homework', label: 'الواجبات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, badge: '5' },
    { id: 'messages', label: 'الرسائل', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, badge: '3' },
    { id: 'reports', label: 'التقارير', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> },
  ];

  const schedule = [
    { time: '07:30 - 08:15', subject: 'الرياضيات', class: 'ثالث ثانوي - أ', status: 'done' },
    { time: '08:20 - 09:05', subject: 'الرياضيات', class: 'ثالث ثانوي - ب', status: 'current' },
    { time: '09:10 - 09:55', subject: 'فصلة', class: 'استراحة', status: 'free' },
    { time: '10:00 - 10:45', subject: 'الرياضيات', class: 'ثاني ثانوي - أ', status: 'upcoming' },
    { time: '10:50 - 11:35', subject: 'الرياضيات', class: 'ثاني ثانوي - ب', status: 'upcoming' },
  ];

  const stats = [
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, value: '87', label: 'طلابي', color: '#4ADE80', bg: 'rgba(74,222,128,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, value: '94%', label: 'الحضور اليوم', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, value: '12', label: 'واجبات للتصحيح', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, value: '3', label: 'رسائل جديدة', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-top">
            <a href="/" className="sb-logo">
              <div className="logo-icon">م</div>
              <div>
                <div className="logo-main">متين</div>
                <div className="logo-sub">مدرسة الأمل</div>
              </div>
            </a>
            <div className="teacher-card">
              <div className="teacher-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <div>
                <div className="teacher-name">أحمد محمد</div>
                <div className="teacher-role">معلم الرياضيات</div>
              </div>
            </div>
          </div>
          
          <nav className="nav">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`nb ${item.badgeType === 'red' ? 'nb-red' : 'nb-accent'}`}>{item.badge}</span>
                )}
                {!item.badge && activeNav === item.id && <span className="nav-dot"></span>}
              </div>
            ))}
          </nav>
          
          <div className="sb-footer">
            <button className="logout-btn"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> تسجيل الخروج</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* HEADER */}
          <header className="header">
            <div className="hdr-left">
              <div>
                <div className="hdr-title">لوحة المعلم</div>
                <div className="hdr-sub">الأحد، 10 أبريل 2026</div>
              </div>
            </div>
            <div className="hdr-right">
              <button className="hdr-btn"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="notif-dot"></span></button>
              <div className="user-btn">
                <div className="user-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
                <div>
                  <div className="uname">أحمد محمد</div>
                  <div className="urole">معلم</div>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="content">
            <div className="page-hdr">
              <div className="page-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> النظرة العامة</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-outline"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> التقارير</button>
                <button className="btn-primary">+ تسجيل حضور</button>
              </div>
            </div>

            {/* TODAY'S SCHEDULE */}
            <div className="schedule-bar">
              <div className="schedule-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> جدول اليوم</div>
              <div className="periods">
                {schedule.map((period, i) => (
                  <div key={i} className={`period ${period.status}`}>
                    <div className="period-time">{period.time}</div>
                    <div className="period-subject">{period.subject}</div>
                    <div className="period-class">{period.class}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button className="btn-primary"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> رصد درجات</button>
              <button className="btn-outline"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> إضافة واجب</button>
              <button className="btn-outline"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/></svg> إرسال رسالة</button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

