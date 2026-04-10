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
    { id: 'overview', label: 'النظرة العامة', icon: '📊' },
    { id: 'children', label: 'أبنائي', icon: '👨‍👩‍👧' },
    { id: 'schedule', label: 'الجداول', icon: '📅' },
    { id: 'grades', label: 'الدرجات', icon: '📝' },
    { id: 'attendance', label: 'الحضور', icon: '✅' },
    { id: 'payments', label: 'الدفعات', icon: '💰' },
    { id: 'messages', label: 'الرسائل', icon: '💬' },
    { id: 'notifications', label: 'الإشعارات', icon: '🔔' },
  ];

  const stats = [
    { icon: '👨‍👩‍👧', value: '3', label: 'أبنائي', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
    { icon: '✅', value: '94%', label: 'الحضور', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    { icon: '💰', value: '2,500', label: 'المبالغ المستحقة', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
    { icon: '💬', value: '5', label: 'رسائل جديدة', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  ];

  const children = [
    { name: 'خالد العلي', grade: 'الصف الثالث ثانوي', status: 'present' },
    { name: 'سارة العلي', grade: 'الصف الأول ثانوي', status: 'present' },
    { name: 'محمد العلي', grade: 'الصف الثالث متوسط', status: 'absent' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        \u003caside className="sidebar">
          \u003cdiv className="sb-top">
            \u003ca href="/" className="logo">
              \u003cdiv className="logo-icon">م\u003c/div>
              \u003cdiv>
                \u003cdiv className="logo-main">متين\u003c/div>
                \u003cdiv className="logo-sub">مدرسة الأمل\u003c/div>
              \u003c/div>
            \u003c/a>
            \u003cdiv className="parent-card">
              \u003cdiv className="parent-av">👨‍👩‍👧\u003c/div>
              \u003cdiv>
                \u003cdiv className="parent-name">عبدالله العلي\u003c/div>
                \u003cdiv className="parent-role">ولي أمر\u003c/div>
              \u003c/div>
            \u003c/div>
          \u003c/div>
          
          \u003cnav className="nav">
            {navItems.map((item) => (
              \u003cdiv
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                \u003cspan\u003e{item.icon}\u003c/span>
                \u003cspan\u003e{item.label}\u003c/span>
                {activeNav === item.id && \u003cspan className="nav-dot">\u003c/span\u003e}
              \u003c/div>
            ))}
          \u003c/nav>
          
          \u003cdiv className="sb-footer">
            \u003cbutton className="logout-btn">🚪 تسجيل الخروج\u003c/button>
          \u003c/div>
        \u003c/aside>

        {/* MAIN */}
        \u003cmain className="main">
          {/* HEADER */}
          \u003cheader className="header">
            \u003cdiv>
              \u003cdiv className="hdr-title">لوحة ولي الأمر\u003c/div>
              \u003cdiv className="hdr-sub">تابع أبنائك وادفع الرسوم\u003c/div>
            \u003c/div>
            \u003cdiv className="user-btn">
              \u003cdiv className="user-av">👨‍👩‍👧\u003c/div>
              \u003cdiv style={{ fontSize: '12px', fontWeight: 700 }}>عبدالله\u003c/div>
            \u003c/div>
          \u003c/header>

          {/* CONTENT */}
          \u003cdiv className="content">
            \u003cdiv className="page-title">📊 النظرة العامة\u003c/div>
            
            {/* STATS */}
            \u003cdiv className="stats-grid">
              {stats.map((stat, i) => (
                \u003cdiv key={i} className="stat-card">
                  \u003cdiv className="stat-icon" style={{ background: stat.bg, color: stat.color }}\u003e{stat.icon}\u003c/div>
                  \u003cdiv className="stat-value" style={{ color: stat.color }}\u003e{stat.value}\u003c/div>
                  \u003cdiv className="stat-label">{stat.label}\u003c/div>
                \u003c/div>
              ))}
            \u003c/div>

            {/* CHILDREN */}
            \u003cdiv className="children-card">
              \u003cdiv className="children-title">👨‍👩‍👧 أبنائي\u003c/div>
              {children.map((child, i) => (
                \u003cdiv key={i} className="child-item">
                  \u003cdiv className="child-av">👨‍🎓\u003c/div>
                  \u003cdiv className="child-info">
                    \u003cdiv className="child-name">{child.name}\u003c/div>
                    \u003cdiv className="child-grade">{child.grade}\u003c/div>
                  \u003c/div>
                  \u003cdiv className="child-status" style={{ background: child.status === 'present' ? '#10B981' : '#EF4444' }}\u003e\u003c/div>
                \u003c/div>
              ))}
            \u003c/div>
          \u003c/div>
        \u003c/main>
      \u003c/div>
    \u003c/>
  );
}
