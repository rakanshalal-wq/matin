'use client';

import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// لوحة الجامعة - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function UniversityDashboard() {
  const [activeNav, setActiveNav] = useState('overview');

  const styles = `
    :root {
      --primary:#3B82F6; --primary2:#2563EB;
      --primary-dim:rgba(59,130,246,0.1); --primary-border:rgba(59,130,246,0.22);
      --gold:#D4A843;
      --bg:#06060E; --bg-sb:#08081A; --bg-card:rgba(255,255,255,0.025);
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
      --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
      --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA;
      --font:'IBM Plex Sans Arabic',sans-serif;
      --sw:260px; --hh:62px;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    
    .sidebar{width:var(--sw);flex-shrink:0;height:100vh;background:var(--bg-sb);border-left:1px solid var(--border);display:flex;flex-direction:column;}
    .sb-top{padding:16px 14px 12px;border-bottom:1px solid var(--border);}
    .logo{display:flex;align-items:center;gap:9px;margin-bottom:12px;text-decoration:none;}
    .logo-icon{width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,var(--gold),#E8C060);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:900;color:#000;}
    .logo-main{font-size:17px;font-weight:800;color:var(--text);}
    .logo-sub{font-size:9px;color:var(--text-muted);}
    .admin-card{background:var(--primary-dim);border:1px solid var(--primary-border);border-radius:9px;padding:9px 11px;display:flex;align-items:center;gap:9px;}
    .admin-av{width:32px;height:32px;border-radius:8px;background:rgba(59,130,246,0.15);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;font-size:16px;}
    .admin-name{color:var(--text);font-size:12.5px;font-weight:700;}
    .admin-role{color:var(--primary);font-size:10.5px;font-weight:600;}
    
    .nav{flex:1;padding:6px 0;overflow-y:auto;}
    .nav-item{display:flex;align-items:center;gap:8px;padding:6px 12px 6px 14px;font-size:12px;color:var(--text-dim);cursor:pointer;border-right:3px solid transparent;margin:1px 5px 1px 0;border-radius:0 7px 7px 0;transition:all 0.15s;}
    .nav-item:hover{background:rgba(255,255,255,0.04);color:var(--text);}
    .nav-item.active{background:var(--primary-dim);border-right-color:var(--primary);color:var(--text);font-weight:600;}
    .nav-dot{width:5px;height:5px;border-radius:50%;background:var(--primary);margin-right:auto;}
    
    .sb-footer{padding:10px 12px;border-top:1px solid var(--border);}
    .logout-btn{width:100%;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.15);border-radius:8px;padding:8px 12px;color:#F87171;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;}
    
    .main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
    .header{height:var(--hh);background:rgba(6,6,14,0.88);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 18px;}
    .hdr-title{font-size:16px;font-weight:800;color:var(--text);}
    .hdr-sub{font-size:10.5px;color:rgba(238,238,245,0.35);}
    .user-btn{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:5px 10px;display:flex;align-items:center;gap:7px;cursor:pointer;}
    .user-av{width:28px;height:28px;border-radius:7px;background:rgba(59,130,246,0.1);border:1.5px solid rgba(59,130,246,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;}
    
    .content{flex:1;padding:18px 20px;overflow-y:auto;}
    .page-title{color:var(--primary);font-size:19px;font-weight:800;margin-bottom:16px;}
    
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
    .stat-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:11px;padding:14px;}
    .stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:18px;}
    .stat-value{font-size:22px;font-weight:800;color:var(--text);}
    .stat-label{font-size:11px;color:var(--text-muted);}
    
    @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
  `;

  const navItems = [
    { id: 'overview', label: 'النظرة العامة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> },
    { id: 'colleges', label: 'الكليات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> },
    { id: 'students', label: 'الطلاب', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg> },
    { id: 'faculty', label: 'الهيئة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> },
    { id: 'curriculum', label: 'المناهج', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { id: 'research', label: 'البحث', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"/></svg> },
    { id: 'library', label: 'المكتبة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { id: 'registration', label: 'التسجيل', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> },
  ];

  const stats = [
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, value: '45,000', label: 'الطلاب', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, value: '18', label: 'الكليات', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, value: '2,400', label: 'الهيئة', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, value: '120', label: 'البرامج', color: '#D4A843', bg: 'rgba(212,168,67,0.15)' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sb-top">
            <a href="/" className="logo">
              <div className="logo-icon">م</div>
              <div>
                <div className="logo-main">متين</div>
                <div className="logo-sub">جامعة الملك سعود</div>
              </div>
            </a>
            <div className="admin-card">
              <div className="admin-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <div>
                <div className="admin-name">د. أحمد الفهد</div>
                <div className="admin-role">مدير الجامعة</div>
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
                {activeNav === item.id && <span className="nav-dot"></span>}
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
            <div>
              <div className="hdr-title">لوحة الجامعة</div>
              <div className="hdr-sub">العام الدراسي 2025-2026</div>
            </div>
            <div className="user-btn">
              <div className="user-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>د. أحمد</div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="content">
            <div className="page-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> النظرة العامة</div>
            
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
          </div>
        </main>
      </div>
    </>
  );
}

