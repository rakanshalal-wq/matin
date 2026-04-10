'use client';

import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════
// لوحة مالك المدرسة - بالضبط كما في الملف الأصلي
// ═══════════════════════════════════════════════════════════════

export default function SchoolOwnerDashboard() {
  const [activeNav, setActiveNav] = useState('overview');

  const styles = `
    :root {
      --primary:#34D399; --primary2:#059669;
      --primary-dim:rgba(52,211,153,0.1); --primary-border:rgba(52,211,153,0.22);
      --gold:#D4A843; --gold2:#E8C060;
      --bg:#06060E; --bg-sb:#070F0A; --bg-card:rgba(255,255,255,0.025);
      --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.04);
      --text:#EEEEF5; --text-dim:rgba(238,238,245,0.55); --text-muted:rgba(238,238,245,0.28);
      --green:#10B981; --red:#EF4444; --blue:#60A5FA; --purple:#A78BFA;
      --font:'IBM Plex Sans Arabic',sans-serif;
      --sw:266px; --hh:62px;
    }
    *{margin:0;padding:0;box-sizing:border-box;}
    
    .sidebar{
      width:var(--sw);flex-shrink:0;height:100vh;background:var(--bg-sb);
      border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;position:relative;
    }
    .sidebar::after{content:'';position:absolute;top:0;right:0;width:1px;height:100%;
      background:linear-gradient(180deg,transparent,var(--primary) 30%,var(--primary) 70%,transparent);opacity:0.22;}
    
    .sb-top{padding:14px 13px 11px;border-bottom:1px solid var(--border);flex-shrink:0;}
    .logo-r{display:flex;align-items:center;gap:8px;margin-bottom:10px;text-decoration:none;}
    .li{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,var(--gold),var(--gold2));
      display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#000;flex-shrink:0;}
    .lt{font-size:16px;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
    .ls{font-size:9px;color:var(--text-muted);}
    .own-card{background:var(--primary-dim);border:1px solid var(--primary-border);border-radius:9px;padding:9px 11px;display:flex;align-items:center;gap:9px;margin-bottom:10px;}
    .own-av{width:34px;height:34px;border-radius:8px;background:rgba(52,211,153,0.15);border:1px solid var(--primary-border);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
    .own-n{color:var(--text);font-size:12.5px;font-weight:700;}
    .own-r{color:var(--primary);font-size:10.5px;font-weight:600;margin-top:1px;}
    
    .nav{flex:1;padding:5px 0 4px;overflow-y:auto;overflow-x:hidden;}
    .nav::-webkit-scrollbar{width:3px;}
    .nav::-webkit-scrollbar-thumb{background:rgba(52,211,153,0.18);border-radius:2px;}
    .ng{font-size:9px;color:var(--text-muted);font-weight:700;letter-spacing:1.2px;text-transform:uppercase;padding:8px 13px 3px;}
    .ni{display:flex;align-items:center;gap:8px;padding:6px 11px 6px 13px;font-size:11.5px;color:var(--text-dim);cursor:pointer;border-right:3px solid transparent;margin:1px 4px 1px 0;border-radius:0 7px 7px 0;transition:all 0.15s;text-decoration:none;}
    .ni:hover{background:rgba(255,255,255,0.04);color:var(--text);}
    .ni.on{background:var(--primary-dim);border-right-color:var(--primary);color:var(--text);font-weight:600;}
    .nb{font-size:9.5px;font-weight:700;padding:1px 6px;border-radius:10px;margin-right:auto;}
    .nb-r{background:rgba(239,68,68,0.12);color:var(--red);border:1px solid rgba(239,68,68,0.22);}
    .nb-c{background:var(--primary-dim);color:var(--primary);border:1px solid var(--primary-border);}
    .dot{width:5px;height:5px;border-radius:50%;background:var(--primary);margin-right:auto;box-shadow:0 0 5px var(--primary);}
    .sb-ft{padding:9px 11px;border-top:1px solid var(--border);flex-shrink:0;}
    .lo{width:100%;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.15);border-radius:8px;padding:8px;color:#F87171;font-size:11.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;font-family:var(--font);}
    
    .main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
    .hdr{height:var(--hh);background:rgba(6,6,14,0.88);backdrop-filter:blur(24px) saturate(1.8);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 16px;flex-shrink:0;z-index:10;}
    .hl{display:flex;align-items:center;gap:10px;}
    .ht{font-size:15px;font-weight:800;color:var(--text);}
    .hs{font-size:10.5px;color:rgba(238,238,245,0.35);margin-top:1px;}
    .hr2{display:flex;align-items:center;gap:6px;}
    .hb{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-dim);position:relative;flex-shrink:0;}
    .nd{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--red);border:1.5px solid var(--bg);}
    .ub{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:10px;padding:4px 10px;display:flex;align-items:center;gap:7px;cursor:pointer;flex-shrink:0;}
    .ua{width:28px;height:28px;border-radius:7px;background:rgba(52,211,153,0.1);border:1.5px solid rgba(52,211,153,0.3);display:flex;align-items:center;justify-content:center;font-size:14px;}
    .ui{display:flex;flex-direction:column;}
    .un{font-size:12px;font-weight:700;line-height:1.2;}
    .ur{font-size:9.5px;color:var(--primary);font-weight:700;}
    
    .con{flex:1;padding:14px 16px;overflow-y:auto;}
    .con::-webkit-scrollbar{width:4px;}
    .con::-webkit-scrollbar-thumb{background:rgba(52,211,153,0.15);border-radius:2px;}
    
    .ph{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:13px;flex-wrap:wrap;gap:10px;}
    .pt{font-size:17px;font-weight:800;color:var(--primary);display:flex;align-items:center;gap:8px;}
    .ps{color:var(--text-muted);font-size:12px;margin-top:3px;}
    .btn-p{background:linear-gradient(135deg,var(--primary),var(--primary2));border:none;border-radius:9px;padding:9px 16px;color:#fff;font-weight:700;font-size:12.5px;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:6px;white-space:nowrap;}
    .btn-o{background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:9px;padding:8px 14px;color:var(--text-dim);font-weight:600;font-size:12px;cursor:pointer;font-family:var(--font);display:flex;align-items:center;gap:6px;white-space:nowrap;}
    
    .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:13px;}
    .sc{background:var(--bg-card);border:1px solid var(--border2);border-radius:11px;padding:12px;position:relative;overflow:hidden;transition:all 0.2s;}
    .sc:hover{transform:translateY(-2px);}
    .si{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;margin-bottom:8px;font-size:15px;}
    .sv{font-size:20px;font-weight:800;line-height:1;margin-bottom:2px;}
    .sl{color:var(--text-muted);font-size:11px;}
    .ss{font-size:10px;margin-top:3px;}
    
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:13px;}
    
    .card{background:var(--bg-card);border:1px solid var(--border);border-radius:11px;overflow:hidden;margin-bottom:13px;}
    .ch{padding:10px 13px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;}
    .ct{font-size:13px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px;}
    .cl{color:var(--primary);font-size:11px;font-weight:600;cursor:pointer;background:none;border:none;font-family:var(--font);}
    
    .tw{overflow-x:auto;}
    table{width:100%;border-collapse:collapse;min-width:360px;}
    thead tr{background:rgba(52,211,153,0.04);}
    th{padding:7px 11px;text-align:right;color:var(--primary);font-weight:700;font-size:10.5px;border-bottom:1px solid var(--border2);white-space:nowrap;}
    td{padding:8px 11px;border-bottom:1px solid var(--border2);font-size:12px;}
    tbody tr:hover td{background:rgba(255,255,255,0.015);}
    tbody tr:last-child td{border-bottom:none;}
    
    .badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600;white-space:nowrap;}
    .bg{background:rgba(16,185,129,0.1);color:var(--green);border:1px solid rgba(16,185,129,0.2);}
    .br{background:rgba(239,68,68,0.1);color:var(--red);border:1px solid rgba(239,68,68,0.2);}
    .bb{background:rgba(96,165,250,0.1);color:var(--blue);border:1px solid rgba(96,165,250,0.2);}
    .bp{background:rgba(167,139,250,0.1);color:var(--purple);border:1px solid rgba(167,139,250,0.2);}
    
    .btn-sm{padding:3px 9px;border-radius:5px;font-size:10.5px;font-weight:600;cursor:pointer;font-family:var(--font);border:none;white-space:nowrap;}
    .item{display:flex;align-items:center;gap:10px;padding:9px 13px;border-bottom:1px solid var(--border2);}
    .item:last-child{border-bottom:none;}
    .item-ic{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;}
    .pbar{height:5px;background:rgba(255,255,255,0.07);border-radius:3px;overflow:hidden;margin-top:4px;}
    .pfill{height:100%;border-radius:3px;}
    
    @media(max-width:1100px){.sg{grid-template-columns:repeat(2,1fr);}}
    @media(max-width:900px){.g2{grid-template-columns:1fr;}}
    @media(max-width:768px){.sg{grid-template-columns:1fr 1fr;}.con{padding:12px;}}
  `;

  const navItems = [
    { id: 'overview', label: 'النظرة العامة', icon: '📊', active: true },
    { id: 'students', label: 'الطلاب', icon: '👨‍🎓', badge: '12', badgeType: 'c' },
    { id: 'teachers', label: 'المعلمين', icon: '👨‍🏫' },
    { id: 'classes', label: 'الفصول', icon: '🏫' },
    { id: 'schedule', label: 'الجداول', icon: '📅' },
    { id: 'attendance', label: 'الحضور', icon: '✅' },
    { id: 'grades', label: 'الدرجات', icon: '📝', badge: '3', badgeType: 'r' },
    { id: 'fees', label: 'الرسوم', icon: '💰' },
    { id: 'transport', label: 'النقل', icon: '🚌' },
    { id: 'health', label: 'الصحة', icon: '🏥' },
    { id: 'announcements', label: 'الإعلانات', icon: '📢' },
    { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
  ];

  const stats = [
    { icon: '👨‍🎓', value: '1,247', label: 'الطلاب', change: '+12%', color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
    { icon: '👨‍🏫', value: '89', label: 'المعلمين', change: '+3', color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
    { icon: '📚', value: '42', label: 'الفصول', change: 'ثابت', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
    { icon: '💰', value: '84%', label: 'التحصيل', change: '+5%', color: '#D4A843', bg: 'rgba(212,168,67,0.15)' },
  ];

  const recentStudents = [
    { name: 'أحمد محمد', id: '2024001', grade: 'الثالث ثانوي', status: 'نشط' },
    { name: 'سارة عبدالله', id: '2024002', grade: 'الثاني ثانوي', status: 'نشط' },
    { name: 'خالد علي', id: '2024003', grade: 'الأول ثانوي', status: 'غائب' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', background: '#06060E', color: '#EEEEF5', height: '100vh', overflow: 'hidden', display: 'flex' }}>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        {/* SIDEBAR */}
        \u003caside className="sidebar">
          \u003cdiv className="sb-top">
            \u003cdiv className="logo-r">
              \u003cdiv className="li">م\u003c/div\u003e
              \u003cdiv\u003e
                \u003cdiv className="lt">متين\u003c/div\u003e
                \u003cdiv className="ls">مدرسة الأمل\u003c/div\u003e
              \u003c/div\u003e
            \u003c/div>
            \u003cdiv className="own-card">
              \u003cdiv className="own-av">👨‍💼\u003c/div\u003e
              \u003cdiv\u003e
                \u003cdiv className="own-n">عبدالرحمن العلي\u003c/div\u003e
                \u003cdiv className="own-r">مالك المدرسة\u003c/div\u003e
              \u003c/div\u003e
            \u003c/div>
          \u003c/div>
          
          \u003cnav className="nav">
            \u003cdiv className="ng">القائمة الرئيسية\u003c/div\u003e
            {navItems.map((item) => (
              \u003cdiv
                key={item.id}
                className={`ni ${activeNav === item.id ? 'on' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                \u003cspan\u003e{item.icon}\u003c/span>
                \u003cspan\u003e{item.label}\u003c/span>
                {item.badge && (
                  \u003cspan className={`nb ${item.badgeType === 'r' ? 'nb-r' : 'nb-c'}`}\u003e{item.badge}\u003c/span>
                )}
                {!item.badge && activeNav === item.id && \u003cspan className="dot">\u003c/span\u003e}
              \u003c/div>
            ))}
          \u003c/nav>
          
          \u003cdiv className="sb-ft">
            \u003cbutton className="lo">🚪 تسجيل الخروج\u003c/button\u003e
          \u003c/div>
        \u003c/aside>

        {/* MAIN */}
        \u003cmain className="main">
          {/* HEADER */}
          \u003cheader className="hdr">
            \u003cdiv className="hl">
              \u003cdiv\u003e
                \u003cdiv className="ht">لوحة مالك المدرسة\u003c/div\u003e
                \u003cdiv className="hs">الفصل الدراسي الثاني 2025-2026\u003c/div\u003e
              \u003c/div\u003e
            \u003c/div>
            \u003cdiv className="hr2">
              \u003cbutton className="hb">🔔\u003cspan className="nd">\u003c/span\u003e\u003c/button>
              \u003cdiv className="ub">
                \u003cdiv className="ua">👨‍💼\u003c/div\u003e
                \u003cdiv className="ui">
                  \u003cdiv className="un">عبدالرحمن\u003c/div\u003e
                  \u003cdiv className="ur">مالك\u003c/div\u003e
                \u003c/div\u003e
              \u003c/div\u003e
            \u003c/div>
          \u003c/header>

          {/* CONTENT */}
          \u003cdiv className="con">
            \u003cdiv className="ph">
              \u003cdiv>
                \u003cdiv className="pt">📊 النظرة العامة\u003c/div\u003e
                \u003cdiv className="ps">إحصائيات وأداء المدرسة\u003c/div\u003e
              \u003c/div>
              \u003cdiv style={{ display: 'flex', gap: 8 }}>
                \u003cbutton className="btn-o">📊 التقارير\u003c/button>
                \u003cbutton className="btn-p">+ إضافة طالب\u003c/button>
              \u003c/div>
            \u003c/div>

            {/* STATS */}
            \u003cdiv className="sg">
              {stats.map((stat, i) => (
                \u003cdiv key={i} className="sc">
                  \u003cdiv className="si" style={{ background: stat.bg, color: stat.color }}\u003e{stat.icon}\u003c/div\u003e
                  \u003cdiv className="sv" style={{ color: stat.color }}\u003e{stat.value}\u003c/div\u003e
                  \u003cdiv className="sl">{stat.label}\u003c/div\u003e
                  \u003cdiv className="ss" style={{ color: stat.change.includes('+') ? '#10B981' : '#EF4444' }}\u003e{stat.change}\u003c/div\u003e
                \u003c/div>
              ))}
            \u003c/div>

            {/* RECENT STUDENTS TABLE */}
            \u003cdiv className="card">
              \u003cdiv className="ch">
                \u003cdiv className="ct">👨‍🎓 آخر الطلاب المسجلين\u003c/div>
                \u003cbutton className="cl">عرض الكل →\u003c/button>
              \u003c/div>
              \u003cdiv className="tw">
                \u003ctable>
                  \u003cthead>
                    \u003ctr>
                      \u003cth>الطالب\u003c/th>
                      \u003cth>الرقم\u003c/th>
                      \u003cth>الصف\u003c/th>
                      \u003cth>الحالة\u003c/th>
                      \u003cth>الإجراءات\u003c/th>
                    \u003c/tr>
                  \u003c/thead>
                  \u003ctbody>
                    {recentStudents.map((student, i) => (
                      \u003ctr key={i}>
                        \u003ctd>{student.name}\u003c/td>
                        \u003ctd>{student.id}\u003c/td>
                        \u003ctd>{student.grade}\u003c/td>
                        \u003ctd>
                          \u003cspan className={`badge ${student.status === 'نشط' ? 'bg' : 'br'}`}\u003e{student.status}\u003c/span>
                        \u003c/td>
                        \u003ctd>\u003cbutton className="btn-sm" style={{ background: 'rgba(96,165,250,0.1)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.2)' }}\u003eعرض\u003c/button>\u003c/td>
                      \u003c/tr>
                    ))}
                  \u003c/tbody>
                \u003c/table>
              \u003c/div>
            \u003c/div>
          \u003c/div>
        \u003c/main>
      \u003c/div>
    \u003c/>
  );
}
