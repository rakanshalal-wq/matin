'use client';

import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// لوحة ولي الأمر - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function ParentDashboard() {
  const [activeNav, setActiveNav] = useState('overview');

  const styles = `
    :root {
      --primary:#A78BFA; --primary2:#8B5CF6;
      --primary-dim:rgba(167,139,250,0.1); --primary-border:rgba(167,139,250,0.22);
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
    .parent-card{background:var(--primary-dim);border:1px solid var(--primary-border);border-radius:9px;padding:9px 11px;display:flex;align-items:center;gap:9px;}
    .parent-av{width:32px;height:32px;border-radius:8px;background:rgba(167,139,250,0.15);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;font-size:16px;}
    .parent-name{color:var(--text);font-size:12.5px;font-weight:700;}
    .parent-role{color:var(--primary);font-size:10.5px;font-weight:600;}
    
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
    .user-av{width:28px;height:28px;border-radius:7px;background:rgba(167,139,250,0.1);border:1.5px solid rgba(167,139,250,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;}
    
    .content{flex:1;padding:18px 20px;overflow-y:auto;}
    .page-title{color:var(--primary);font-size:19px;font-weight:800;margin-bottom:16px;}
    
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
    .stat-card{background:var(--bg-card);border:1px solid var(--border2);border-radius:11px;padding:14px;}
    .stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;font-size:18px;}
    .stat-value{font-size:22px;font-weight:800;color:var(--text);}
    .stat-label{font-size:11px;color:var(--text-muted);}
    
    .children-card{background:var(--bg-card);border:1px solid var(--border);border-radius:11px;padding:14px;margin-bottom:16px;}
    .children-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;}
    .child-item{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border2);}
    .child-item:last-child{border-bottom:none;}
    .child-av{width:40px;height:40px;border-radius:10px;background:rgba(96,165,250,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;}
    .child-info{flex:1;}
    .child-name{font-size:13px;font-weight:700;color:var(--text);}
    .child-grade{font-size:11px;color:var(--text-muted);}
    .child-status{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);}
    
    @media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
  `;

  const navItems = [
    { id: 'overview', label: 'النظرة العامة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> },
    { id: 'children', label: 'أبنائي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> },
    { id: 'schedule', label: 'الجداول', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> },
    { id: 'grades', label: 'الدرجات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> },
    { id: 'attendance', label: 'الحضور', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { id: 'payments', label: 'الدفعات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: 'messages', label: 'الرسائل', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: 'notifications', label: 'الإشعارات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  ];

  const stats = [
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, value: '3', label: 'أبنائي', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, value: '94%', label: 'الحضور', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, value: '2,500', label: 'المبالغ المستحقة', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, value: '5', label: 'رسائل جديدة', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  ];

  const children = [
    { name: 'خالد العلي', grade: 'الصف الثالث ثانوي', status: 'present' },
    { name: 'سارة العلي', grade: 'الصف الأول ثانوي', status: 'present' },
    { name: 'محمد العلي', grade: 'الصف الثالث متوسط', status: 'absent' },
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
                <div className="logo-sub">مدرسة الأمل</div>
              </div>
            </a>
            <div className="parent-card">
              <div className="parent-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <div>
                <div className="parent-name">عبدالله العلي</div>
                <div className="parent-role">ولي أمر</div>
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
              <div className="hdr-title">لوحة ولي الأمر</div>
              <div className="hdr-sub">تابع أبنائك وادفع الرسوم</div>
            </div>
            <div className="user-btn">
              <div className="user-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <div style={{ fontSize: '12px', fontWeight: 700 }}>عبدالله</div>
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

            {/* CHILDREN */}
            <div className="children-card">
              <div className="children-title"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> أبنائي</div>
              {children.map((child, i) => (
                <div key={i} className="child-item">
                  <div className="child-av"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                  <div className="child-info">
                    <div className="child-name">{child.name}</div>
                    <div className="child-grade">{child.grade}</div>
                  </div>
                  <div className="child-status" style={{ background: child.status === 'present' ? '#10B981' : '#EF4444' }}></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

