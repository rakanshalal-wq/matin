'use client';
import React, { useState } from 'react';
import '../../../styles/training-trainee.css';

export default function TraineePage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="sidebar" id="sidebar">
  <div className="sb-top">
    <a className="sb-logo" href="#">
      <div className="logo-icon">م</div>
      <div><div className="logo-main">متين</div><div className="logo-sub">منصة إدارة التعليم</div></div>
    </a>
    <div className="user-card">
      <div className="user-av">👨‍🎓</div>
      <div>
        <div className="user-name">عبدالله المالكي</div>
        <div className="user-role">متدرب</div>
        <div className="user-spec">تطوير تطبيقات الويب</div>
      </div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active">🏠 الرئيسية</a>
    <a className="nav-item">📅 جدولي التدريبي</a>

    <div className="nav-grp">التعلم</div>
    <a className="nav-item">📚 دوراتي <span className="nb nb-gold">2</span></a>
    <a className="nav-item">📝 الواجبات <span className="nb nb-red">3</span></a>
    <a className="nav-item">📊 الاختبارات</a>
    <a className="nav-item">📁 المواد التدريبية</a>

    <div className="nav-grp">الإنجازات</div>
    <a className="nav-item">🎓 شهاداتي <span className="nb nb-gold">1</span></a>
    <a className="nav-item">🏆 ملف الإنجاز</a>
    <a className="nav-item">📈 تقدمي الأكاديمي</a>

    <div className="nav-grp">المالية</div>
    <a className="nav-item">💰 الرسوم والمدفوعات</a>
    <a className="nav-item">📋 فواتيري</a>

    <div className="nav-grp">أخرى</div>
    <a className="nav-item">💬 الرسائل <span className="nb nb-red">2</span></a>
    <a className="nav-item">📣 الإعلانات</a>
    <a className="nav-item">👤 ملفي الشخصي</a>
    <a className="nav-item">⚙️ الإعدادات</a>
  </div>
  <div className="sb-footer">
    <button className="logout-btn">🚪 تسجيل خروج</button>
  </div>
</div>

<div className="overlay" id="overlay" onClick={() => {toggleSidebar()}}></div>

<div className="main">
  <div className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSidebar()}}>☰</button>
      <div><div className="page-title">مرحباً عبدالله 👋</div><div className="page-sub">لديك حصة تدريبية اليوم الساعة 9:00 ص</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn">🔔 <span className="nb nb-red">2</span></button>
      <button className="hdr-btn">📋 واجباتي</button>
    </div>
  </div>

  <div className="content">
    <div className="kpi-grid">
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--cyan)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--accent-dim)',border:'1px solid var(--accent-border)'}}>📚</div>
        </div>
        <div className="kpi-val">2</div>
        <div className="kpi-label">دورات مسجلة</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)'}}>📊</div>
        </div>
        <div className="kpi-val">90%</div>
        <div className="kpi-label">معدلي العام</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)'}}>✅</div>
        </div>
        <div className="kpi-val">95%</div>
        <div className="kpi-label">نسبة الحضور</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--gold)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--gold-dim)',border:'1px solid var(--gold-border)'}}>🎓</div>
        </div>
        <div className="kpi-val">1</div>
        <div className="kpi-label">شهادة حاصل عليها</div>
      </div>
    </div>

    {/* My Courses */}
    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr">
        <span className="card-title">📚 دوراتي الحالية</span>
      </div>
      <div className="card-body">
        <div className="course-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>💻</div>
              <div>
                <div style={{fontSize:'14px',fontWeight:700,color:'var(--text)'}}>تطوير تطبيقات الويب</div>
                <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>م. خالد الحربي · 120 ساعة</div>
              </div>
            </div>
            <span className="status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>نشطة</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'11px'}}>
            <span style={{color:'var(--text-dim)'}}>التقدم في الدورة</span>
            <span style={{color:'var(--blue)',fontWeight:700}}>75%</span>
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{width:'75%',background:'var(--blue)'}}></div></div>
          <div style={{display:'flex',gap:'16px',marginTop:'12px'}}>
            <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>📖 الوحدة الحالية: <span style={{color:'var(--text)'}}>React Hooks</span></div>
            <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>⏰ الحصة القادمة: <span style={{color:'var(--cyan)'}}>اليوم 9:00 ص</span></div>
          </div>
        </div>

        <div className="course-card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{width:'40px',height:'40px',borderRadius:'10px',background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px'}}>📊</div>
              <div>
                <div style={{fontSize:'14px',fontWeight:700,color:'var(--text)'}}>إدارة المشاريع PMP</div>
                <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>د. عبدالرحمن السالم · 80 ساعة</div>
              </div>
            </div>
            <span className="status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>نشطة</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px',fontSize:'11px'}}>
            <span style={{color:'var(--text-dim)'}}>التقدم في الدورة</span>
            <span style={{color:'var(--purple)',fontWeight:700}}>45%</span>
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{width:'45%',background:'var(--purple)'}}></div></div>
          <div style={{display:'flex',gap:'16px',marginTop:'12px'}}>
            <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>📖 الوحدة الحالية: <span style={{color:'var(--text)'}}>إدارة المخاطر</span></div>
            <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>⏰ الحصة القادمة: <span style={{color:'var(--cyan)'}}>الأحد 10:00 ص</span></div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid-2">
      {/* Assignments */}
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📝 الواجبات المطلوبة</span>
          <span className="nb nb-red">3</span>
        </div>
        <div className="card-body">
          ${[
            ['مشروع: بناء REST API','تطوير الويب','var(--red)','⏰ اليوم','عاجل'],
            ['واجب: مخطط Gantt Chart','إدارة المشاريع','var(--orange)','📅 بعد غد','مهم'],
            ['تمرين: React Components','تطوير الويب','var(--blue)','📅 الأحد','عادي'],
          ].map(([name,course,color,due,priority]) => `
            <div style={{padding:'12px',background:'rgba(255,255,255,.02)',border:'1px solid var(--border2)',borderRadius:'10px',marginBottom:'8px',borderRight:'3px solid ${color}'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)',marginBottom:'4px'}}>${name}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{fontSize:'10.5px',color:'var(--text-muted)'}}>${course} · ${due}</span>
                <span className="status" style={{background:'${color}18',color:'${color}',border:'1px solid ${color}33'}}>${priority}</span>
              </div>
            </div>
          `).join('')}
          <button style={{width:'100%',marginTop:'8px',background:'var(--accent-dim)',border:'1px solid var(--accent-border)',borderRadius:'10px',padding:'10px',color:'var(--cyan)',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}} onClick={() => {toast('📝 عرض جميع الواجبات','var(--cyan)')}}>عرض جميع الواجبات</button>
        </div>
      </div>

      {/* Certificates */}
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">🎓 شهاداتي</span>
        </div>
        <div className="card-body">
          <div className="cert-card">
            <div className="cert-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>🏅</div>
            <div style={{flex:1}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>أساسيات البرمجة بلغة Python</div>
              <div style={{fontSize:'10.5px',color:'var(--text-muted)',marginTop:'2px'}}>تاريخ الإصدار: 15 يناير 2026</div>
              <div style={{fontSize:'10px',color:'var(--green)',marginTop:'3px',fontWeight:600}}>✅ معتمدة · قابلة للتحقق</div>
            </div>
            <button style={{background:'var(--accent-dim)',border:'1px solid var(--accent-border)',borderRadius:'8px',padding:'6px 12px',color:'var(--cyan)',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}} onClick={() => {toast('📜 جارٍ تحميل الشهادة','var(--cyan)')}}>تحميل</button>
          </div>

          <div style={{background:'rgba(212,168,67,.06)',border:'1px solid rgba(212,168,67,.15)',borderRadius:'12px',padding:'16px',textAlign:'center',marginTop:'14px'}}>
            <div style={{fontSize:'28px',marginBottom:'8px'}}>🎯</div>
            <div style={{fontSize:'13px',fontWeight:700,color:'var(--gold)'}}>أكمل دوراتك الحالية</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'4px'}}>واحصل على شهادتين إضافيتين معتمدتين</div>
          </div>

          <div style={{marginTop:'16px'}}>
            <div style={{fontSize:'12px',fontWeight:700,color:'var(--text)',marginBottom:'10px'}}>📊 ملف الإنجاز</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px'}}>
              ${[
                ['🏅','1','شهادة'],
                ['📚','85','ساعة تدريبية'],
                ['✅','24','واجب مكتمل'],
              ].map(([ic,val,label]) => `
                <div style={{textAlign:'center',padding:'10px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'8px'}}>
                  <div style={{fontSize:'16px'}}>${ic}</div>
                  <div style={{fontSize:'16px',fontWeight:800,color:'var(--text)',marginTop:'4px'}}>${val}</div>
                  <div style={{fontSize:'9px',color:'var(--text-muted)'}}>${label}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Schedule */}
    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr">
        <span className="card-title">📅 جدول هذا الأسبوع</span>
      </div>
      <div className="card-body" style={{padding:0,overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',minWidth:'500px'}}>
          <thead>
            <tr>
              ${['اليوم','السبت','الأحد','الاثنين','الثلاثاء','الأربعاء'].map(d => `<th style={{fontSize:'11px',color:'var(--text-muted)',padding:'10px',textAlign:'center',borderBottom:'1px solid var(--border2)',fontWeight:600}}>${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{fontSize:'11px',color:'var(--text-dim)',padding:'10px',textAlign:'center'}}>9:00-11:30</td>
              <td style={{padding:'6px'}}><div style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'8px',padding:'6px',textAlign:'center',fontSize:'10px',color:'var(--blue)',fontWeight:600}}>💻 تطوير الويب</div></td>
              <td style={{padding:'6px'}}></td>
              <td style={{padding:'6px'}}><div style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'8px',padding:'6px',textAlign:'center',fontSize:'10px',color:'var(--blue)',fontWeight:600}}>💻 تطوير الويب</div></td>
              <td style={{padding:'6px'}}></td>
              <td style={{padding:'6px'}}><div style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'8px',padding:'6px',textAlign:'center',fontSize:'10px',color:'var(--blue)',fontWeight:600}}>💻 تطوير الويب</div></td>
            </tr>
            <tr>
              <td style={{fontSize:'11px',color:'var(--text-dim)',padding:'10px',textAlign:'center'}}>12:00-1:30</td>
              <td style={{padding:'6px'}}></td>
              <td style={{padding:'6px'}}><div style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)',borderRadius:'8px',padding:'6px',textAlign:'center',fontSize:'10px',color:'var(--purple)',fontWeight:600}}>📊 PMP</div></td>
              <td style={{padding:'6px'}}></td>
              <td style={{padding:'6px'}}><div style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)',borderRadius:'8px',padding:'6px',textAlign:'center',fontSize:'10px',color:'var(--purple)',fontWeight:600}}>📊 PMP</div></td>
              <td style={{padding:'6px'}}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Fees */}
    <div className="card">
      <div className="card-hdr">
        <span className="card-title">💰 الرسوم والمدفوعات</span>
      </div>
      <div className="card-body">
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'14px'}}>
          <div style={{textAlign:'center',padding:'12px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--green)'}}>3,700</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>المدفوع (ر.س)</div>
          </div>
          <div style={{textAlign:'center',padding:'12px',background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--red)'}}>2,000</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>المتبقي (ر.س)</div>
          </div>
          <div style={{textAlign:'center',padding:'12px',background:'rgba(34,211,238,.06)',border:'1px solid rgba(34,211,238,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'var(--cyan)'}}>5,700</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)'}}>الإجمالي (ر.س)</div>
          </div>
        </div>
        <button style={{width:'100%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',border:'none',borderRadius:'10px',padding:'12px',color:'#fff',fontSize:'13px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}} onClick={() => {toast('💳 جارٍ التوجيه لبوابة الدفع','var(--cyan)')}}>💳 سدد الآن</button>
      </div>
    </div>

  </div>
</div>

<div className="toast" id="toast-el"></div>
    </div>
  );
}