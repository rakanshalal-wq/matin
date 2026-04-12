'use client';

import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// داشبورد مالك المنصة - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function SuperAdminDashboard() {
  const [activeNav, setActiveNav] = useState('overview');

  // CSS الأصلي كاملاً
  const styles = `
    :root {
      --gold:#D4A843; --gold2:#E8C060;
      --gold-dim:rgba(212,168,67,0.12); --gold-border:rgba(212,168,67,0.22);
      --bg:#06060E; --bg-sb:#08081A; --bg-card:rgba(255,255,255,0.025);
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
      --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
      --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA;
      --font:'IBM Plex Sans Arabic',sans-serif;
      --sw:268px; --hh:62px;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    
    .sidebar{
      width:var(--sw);flex-shrink:0;height:100vh;
      background:var(--bg-sb);border-left:1px solid var(--border);
      display:flex;flex-direction:column;overflow:hidden;position:relative;
    }
    .sidebar::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;
      background:linear-gradient(180deg,transparent 0%,var(--gold) 30%,var(--gold) 70%,transparent 100%);opacity:0.15;}
    
    .sb-logo{padding:18px 16px 14px;border-bottom:1px solid var(--border);flex-shrink:0;}
    .sb-logo-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
    .sb-logo-icon{width:38px;height:38px;border-radius:11px;
      background:linear-gradient(135deg,var(--gold),var(--gold2));
      display:flex;align-items:center;justify-content:center;
      font-size:20px;font-weight:900;color:#000;
      box-shadow:0 4px 16px rgba(212,168,67,0.3);}
    .sb-logo-main{font-size:19px;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
    .sb-logo-sub{font-size:10px;color:var(--text-muted);font-weight:500;}
    
    .user-card{background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:10px;}
    .user-av{width:34px;height:34px;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid var(--gold-border);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
    .user-name{color:var(--text);font-size:13px;font-weight:700;}
    .user-role{color:var(--gold);font-size:11px;font-weight:600;margin-top:1px;}
    
    .nav{flex:1;padding:8px 0 4px;overflow-y:auto;overflow-x:hidden;}
    .nav::-webkit-scrollbar{width:3px;}
    .nav::-webkit-scrollbar-thumb{background:rgba(212,168,67,0.2);border-radius:2px;}
    .nav-group{font-size:9.5px;color:var(--text-muted);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:10px 16px 4px;}
    .nav-item{display:flex;align-items:center;gap:9px;padding:7px 14px 7px 16px;
      font-size:12.5px;color:var(--text-dim);cursor:pointer;
      border-right:3px solid transparent;margin:1px 6px 1px 0;
      border-radius:0 8px 8px 0;transition:all 0.15s;text-decoration:none;}
    .nav-item:hover{background:rgba(255,255,255,0.04);color:var(--text);}
    .nav-item.active{background:var(--gold-dim);border-right-color:var(--gold);color:var(--text);font-weight:600;}
    .nav-dot{width:5px;height:5px;border-radius:50%;background:var(--gold);margin-right:auto;flex-shrink:0;box-shadow:0 0 6px var(--gold);}
    .nav-badge{background:rgba(239,68,68,0.15);color:var(--red);font-size:10px;font-weight:700;padding:1px 7px;border-radius:10px;border:1px solid rgba(239,68,68,0.25);margin-right:auto;}
    
    .sb-footer{padding:12px 14px;border-top:1px solid var(--border);flex-shrink:0;}
    .logout-btn{width:100%;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.15);border-radius:9px;padding:9px 14px;color:#F87171;font-size:12.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:var(--font);}
    .sb-ver{margin-top:8px;color:rgba(238,238,245,0.15);font-size:10px;text-align:center;}
    
    .main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
    
    .header{height:var(--hh);background:rgba(6,6,14,0.85);backdrop-filter:blur(24px) saturate(1.8);
      border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;
      padding:0 24px;flex-shrink:0;position:relative;z-index:10;}
    .hdr-title{font-size:17px;font-weight:800;color:var(--text);letter-spacing:-0.3px;}
    .hdr-sub{font-size:11px;color:rgba(238,238,245,0.35);margin-top:1px;}
    .hdr-right{display:flex;align-items:center;gap:8px;}
    .hdr-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;width:38px;height:38px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-dim);position:relative;}
    .hdr-btn .dot{position:absolute;top:8px;right:8px;width:7px;height:7px;border-radius:50%;background:var(--red);border:1.5px solid var(--bg);}
    .search-box{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:0 14px;height:38px;display:flex;align-items:center;gap:8px;color:var(--text-muted);font-size:12.5px;min-width:180px;}
    .user-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:11px;padding:5px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;}
    .user-btn-av{width:30px;height:30px;border-radius:8px;background:rgba(212,168,67,0.12);border:1.5px solid rgba(212,168,67,0.4);display:flex;align-items:center;justify-content:center;font-size:15px;}
    .user-btn-name{font-size:12.5px;font-weight:700;line-height:1.2;}
    .user-btn-role{font-size:10px;color:var(--gold);font-weight:700;}
    
    .content{flex:1;padding:24px 28px;overflow-y:auto;background:radial-gradient(circle at 50% 0%,rgba(212,168,67,0.03) 0%,transparent 60%);}
    .content::-webkit-scrollbar{width:4px;}
    .content::-webkit-scrollbar-thumb{background:rgba(212,168,67,0.2);border-radius:2px;}
    
    .page-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;}
    .page-title{color:var(--gold);font-size:22px;font-weight:800;letter-spacing:-0.5px;display:flex;align-items:center;gap:8px;}
    .page-sub{color:var(--text-muted);font-size:13px;margin-top:4px;}
    .btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));border:none;border-radius:10px;padding:10px 20px;color:#06060E;font-weight:700;font-size:14px;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:7px;box-shadow:0 4px 16px rgba(212,168,67,0.25);}
    
    .alert{display:flex;align-items:center;gap:12px;background:rgba(212,168,67,0.06);border:1px solid rgba(212,168,67,0.18);border-radius:12px;padding:11px 16px;margin-bottom:20px;font-size:13px;color:var(--text-dim);}
    .alert strong{color:var(--gold);}
    
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
    .stat-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:14px;padding:18px 20px;position:relative;overflow:hidden;transition:all 0.2s;cursor:default;}
    .stat-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.1);}
    .stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;font-size:18px;}
    .stat-value{font-size:26px;font-weight:800;color:var(--text);margin-bottom:3px;}
    .stat-label{font-size:12px;color:var(--text-muted);}
    .stat-change{font-size:11px;margin-top:6px;font-weight:600;}
    .stat-change.up{color:var(--green);}
    .stat-change.down{color:var(--red);}
  `;

  const navItems = [
    { id: 'overview', label: 'النظرة العامة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, active: true },
    { id: 'institutions', label: 'المؤسسات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, badge: '12' },
    { id: 'users', label: 'المستخدمون', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> },
    { id: 'subscriptions', label: 'الاشتراكات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    { id: 'finance', label: 'المالية', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: 'reports', label: 'التقارير', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> },
    { id: 'settings', label: 'الإعدادات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { id: 'support', label: 'الدعم', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, badge: '3' },
  ];

  const stats = [
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, value: '156', label: 'المؤسسات', change: '+12%', up: true, color: '#D4A843' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, value: '12,450', label: 'المستخدمون', change: '+8%', up: true, color: '#60A5FA' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, value: '89', label: 'الاشتراكات النشطة', change: '+5%', up: true, color: '#10B981' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, value: '45,200', label: 'الإيرادات الشهرية', change: '+15%', up: true, color: '#A78BFA' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-logo">
            <div className="sb-logo-row">
              <div className="sb-logo-icon">م</div>
              <div>
                <div className="sb-logo-main">متين</div>
                <div className="sb-logo-sub">MATIN.INK</div>
              </div>
            </div>
            
            <div className="user-card">
              <div className="user-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z M5 20h14"/></svg></div>
              <div>
                <div className="user-name">ركان شلال</div>
                <div className="user-role">مالك المنصة</div>
              </div>
            </div>
          </div>
          
          <nav className="nav">
            <div className="nav-group">القائمة الرئيسية</div>
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
                {!item.badge && activeNav === item.id && <span className="nav-dot"></span>}
              </div>
            ))}
          </nav>
          
          <div className="sb-footer">
            <button className="logout-btn"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> تسجيل الخروج</button>
            <div className="sb-ver">v1.0.0 - متين</div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* HEADER */}
          <header className="header">
            <div>
              <div className="hdr-title">داشبورد مالك المنصة</div>
              <div className="hdr-sub">نظرة عامة على أداء المنصة</div>
            </div>
            
            <div className="hdr-right">
              <div className="search-box"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"/></svg> البحث...</div>
              <button className="hdr-btn"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="dot"></span></button>
              <button className="hdr-btn"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
              <div className="user-btn">
                <div className="user-btn-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 4-4-7-4 7-6-4z M5 20h14"/></svg></div>
                <div>
                  <div className="user-btn-name">ركان</div>
                  <div className="user-btn-role">مالك</div>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="content">
            {/* PAGE HEADER */}
            <div className="page-hdr">
              <div>
                <div className="page-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> النظرة العامة</div>
                <div className="page-sub">إحصائيات وأداء المنصة</div>
              </div>
              <button className="btn-gold">+ إضافة مؤسسة</button>
            </div>

            {/* ALERT */}
            <div className="alert">
              <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></span>
              <div><strong>تحديث جديد:</strong> تم إضافة 3 مؤسسات جديدة هذا الأسبوع</div>
            </div>

            {/* STATS */}
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>{stat.icon}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className={`stat-change ${stat.up ? 'up' : 'down'}`}>{stat.up ? '↑' : '↓'} {stat.change}</div>
                </div>
              ))}
            </div>

            {/* PLACEHOLDER FOR MORE CONTENT */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 24, textAlign: 'center', color: 'rgba(238,238,245,0.4)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg></div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>المزيد من المحتوى قيد التطوير</div>
              <div style={{ fontSize: 13 }}>سيتم إضافة الجداول والرسوم البيانية والتفاصيل الكاملة</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

