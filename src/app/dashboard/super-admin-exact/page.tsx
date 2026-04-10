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
    { id: 'overview', label: 'النظرة العامة', icon: '📊', active: true },
    { id: 'institutions', label: 'المؤسسات', icon: '🏫', badge: '12' },
    { id: 'users', label: 'المستخدمون', icon: '👥' },
    { id: 'subscriptions', label: 'الاشتراكات', icon: '💎' },
    { id: 'finance', label: 'المالية', icon: '💰' },
    { id: 'reports', label: 'التقارير', icon: '📈' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
    { id: 'support', label: 'الدعم', icon: '🎧', badge: '3' },
  ];

  const stats = [
    { icon: '🏫', value: '156', label: 'المؤسسات', change: '+12%', up: true, color: '#D4A843' },
    { icon: '👥', value: '12,450', label: 'المستخدمون', change: '+8%', up: true, color: '#60A5FA' },
    { icon: '💎', value: '89', label: 'الاشتراكات النشطة', change: '+5%', up: true, color: '#10B981' },
    { icon: '💰', value: '45,200', label: 'الإيرادات الشهرية', change: '+15%', up: true, color: '#A78BFA' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          \u003cdiv className="sb-logo">
            \u003cdiv className="sb-logo-row">
              \u003cdiv className="sb-logo-icon">م\u003c/div\u003e
              \u003cdiv\u003e
                \u003cdiv className="sb-logo-main">متين\u003c/div\u003e
                \u003cdiv className="sb-logo-sub">MATIN.INK\u003c/div\u003e
              \u003c/div\u003e
            \u003c/div\u003e
            
            \u003cdiv className="user-card">
              \u003cdiv className="user-av">👑\u003c/div\u003e
              \u003cdiv\u003e
                \u003cdiv className="user-name">ركان شلال\u003c/div\u003e
                \u003cdiv className="user-role">مالك المنصة\u003c/div\u003e
              \u003c/div\u003e
            \u003c/div\u003e
          \u003c/div\u003e
          
          \u003cnav className="nav">
            \u003cdiv className="nav-group">القائمة الرئيسية\u003c/div\u003e
            {navItems.map((item) => (
              \u003cdiv
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                \u003cspan\u003e{item.icon}\u003c/span\u003e
                \u003cspan\u003e{item.label}\u003c/span\u003e
                {item.badge && \u003cspan className="nav-badge">{item.badge}\u003c/span\u003e}
                {!item.badge && activeNav === item.id && \u003cspan className="nav-dot">\u003c/span\u003e}
              \u003c/div\u003e
            ))}
          \u003c/nav\u003e
          
          \u003cdiv className="sb-footer">
            \u003cbutton className="logout-btn">🚪 تسجيل الخروج\u003c/button\u003e
            \u003cdiv className="sb-ver">v1.0.0 - متين\u003c/div\u003e
          \u003c/div\u003e
        \u003c/aside\u003e

        {/* MAIN */}
        \u003cmain className="main">
          {/* HEADER */}
          \u003cheader className="header">
            \u003cdiv\u003e
              \u003cdiv className="hdr-title">داشبورد مالك المنصة\u003c/div\u003e
              \u003cdiv className="hdr-sub">نظرة عامة على أداء المنصة\u003c/div\u003e
            \u003c/div\u003e
            
            \u003cdiv className="hdr-right">
              \u003cdiv className="search-box">🔍 البحث...\u003c/div\u003e
              \u003cbutton className="hdr-btn">🔔\u003cspan className="dot">\u003c/span\u003e\u003c/button\u003e
              \u003cbutton className="hdr-btn">⚙️\u003c/button\u003e
              \u003cdiv className="user-btn">
                \u003cdiv className="user-btn-av">👑\u003c/div\u003e
                \u003cdiv\u003e
                  \u003cdiv className="user-btn-name">ركان\u003c/div\u003e
                  \u003cdiv className="user-btn-role">مالك\u003c/div\u003e
                \u003c/div\u003e
              \u003c/div\u003e
            \u003c/div\u003e
          \u003c/header\u003e

          {/* CONTENT */}
          \u003cdiv className="content">
            {/* PAGE HEADER */}
            \u003cdiv className="page-hdr">
              \u003cdiv\u003e
                \u003cdiv className="page-title">📊 النظرة العامة\u003c/div\u003e
                \u003cdiv className="page-sub">إحصائيات وأداء المنصة\u003c/div\u003e
              \u003c/div\u003e
              \u003cbutton className="btn-gold">+ إضافة مؤسسة\u003c/button\u003e
            \u003c/div\u003e

            {/* ALERT */}
            \u003cdiv className="alert">
              \u003cspan\u003e⚡\u003c/span\u003e
              \u003cdiv\u003e\u003cstrong\u003eتحديث جديد:\u003c/strong\u003e تم إضافة 3 مؤسسات جديدة هذا الأسبوع\u003c/div\u003e
            \u003c/div\u003e

            {/* STATS */}
            \u003cdiv className="stats-grid">
              {stats.map((stat, i) => (
                \u003cdiv key={i} className="stat-card">
                  \u003cdiv className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}\u003e{stat.icon}\u003c/div\u003e
                  \u003cdiv className="stat-value">{stat.value}\u003c/div\u003e
                  \u003cdiv className="stat-label">{stat.label}\u003c/div\u003e
                  \u003cdiv className={`stat-change ${stat.up ? 'up' : 'down'}`}\u003e{stat.up ? '↑' : '↓'} {stat.change}\u003c/div\u003e
                \u003c/div\u003e
              ))}
            \u003c/div\u003e

            {/* PLACEHOLDER FOR MORE CONTENT */}
            \u003cdiv style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: 24, textAlign: 'center', color: 'rgba(238,238,245,0.4)' }}>
              \u003cdiv style={{ fontSize: 48, marginBottom: 16 }}\u003e📈\u003c/div\u003e
              \u003cdiv style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}\u003eالمزيد من المحتوى قيد التطوير\u003c/div\u003e
              \u003cdiv style={{ fontSize: 13 }}\u003eسيتم إضافة الجداول والرسوم البيانية والتفاصيل الكاملة\u003c/div\u003e
            \u003c/div\u003e
          \u003c/div\u003e
        \u003c/main\u003e
      \u003c/div\u003e
    \u003c/>
  );
}
