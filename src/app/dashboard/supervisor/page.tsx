'use client';
import React, { useState } from 'react';
import '../../../styles/quran-supervisor.css';

export default function SupervisorPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="sidebar" id="sidebar">
  <div className="sb-top">
    <a className="sb-logo"><div className="logo-icon">م</div><div><div className="logo-main">متين</div><div className="logo-sub">منصة إدارة التعليم</div></div></a>
    <div className="user-card">
      <div className="user-av">👳‍♂️</div>
      <div><div className="user-name">الشيخ عبدالله القرني</div><div className="user-role">مشرف حلقات التحفيظ</div></div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active">📊 لوحة التحكم</a>
    <a className="nav-item">📈 التقارير</a>

    <div className="nav-grp">إدارة الحلقات</div>
    <a className="nav-item">🕌 الحلقات القرآنية <span className="nb nb-grn">20</span></a>
    <a className="nav-item">📅 جدول الحلقات</a>
    <a className="nav-item">📋 خطط الحفظ</a>
    <a className="nav-item">🏆 المسابقات القرآنية</a>

    <div className="nav-grp">المحفّظون والطلاب</div>
    <a className="nav-item">👨‍🏫 المحفّظون <span className="nb nb-grn">35</span></a>
    <a className="nav-item">👥 الطلاب <span className="nb nb-gold">1,200</span></a>
    <a className="nav-item">👨‍👩‍👦 أولياء الأمور</a>
    <a className="nav-item">📋 الحضور والغياب</a>

    <div className="nav-grp">الإنجازات</div>
    <a className="nav-item">🎓 الختمات والإجازات <span className="nb nb-gold">5</span></a>
    <a className="nav-item">⭐ نقاط التحفيز</a>
    <a className="nav-item">📜 الشهادات</a>

    <div className="nav-grp">التواصل</div>
    <a className="nav-item">📣 الإعلانات <span className="nb nb-red">2</span></a>
    <a className="nav-item">💬 الرسائل</a>
    <a className="nav-item">⚙️ الإعدادات</a>
  </div>
  <div className="sb-footer"><button className="logout-btn">🚪 تسجيل خروج</button></div>
</div>
<div className="overlay" id="overlay" onClick={() => {toggleSidebar()}}></div>

<div className="main">
  <div className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSidebar()}}>☰</button>
      <div><div className="page-title">لوحة تحكم مشرف الحلقات</div><div className="page-sub">آخر تحديث: اليوم 10:30 ص</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn">🔔 <span className="nb nb-red">3</span></button>
      <button className="hdr-btn">📊 تقرير</button>
      <button className="hdr-btn hdr-btn-p" onClick={() => {toast('➕ إضافة حلقة جديدة','var(--accent)')}}>➕ حلقة جديدة</button>
    </div>
  </div>

  <div className="content">
    <div className="kpi-grid">
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--accent)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--accent-dim)',border:'1px solid var(--accent-border)'}}>🕌</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>+2 جديدة</span>
        </div>
        <div className="kpi-val">20</div>
        <div className="kpi-label">حلقة قرآنية نشطة</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)'}}>👥</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>↑ 8%</span>
        </div>
        <div className="kpi-val">1,200</div>
        <div className="kpi-label">طالب وطالبة</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--gold)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--gold-dim)',border:'1px solid var(--gold-border)'}}>📖</div>
          <span className="kpi-change" style={{background:'var(--gold-dim)',color:'var(--gold)'}}>هذا الشهر</span>
        </div>
        <div className="kpi-val">48</div>
        <div className="kpi-label">جزء تم حفظه (إجمالي الطلاب)</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)'}}>🎓</div>
        </div>
        <div className="kpi-val">5</div>
        <div className="kpi-label">ختمة كاملة هذا الفصل</div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📖 تقدم الحفظ — الشهر الحالي</span>
          <span className="status" style={{background:'rgba(16,185,129,.12)',color:'var(--green)',border:'1px solid rgba(16,185,129,.25)'}}>↑ 12%</span>
        </div>
        <div className="card-body">
          <div className="chart-placeholder">
            ${['ذو الحجة','محرم','صفر','ربيع١','ربيع٢','جمادى'].map((m,i) => {
              const h = [50,58,62,55,70,82][i];
              return `<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}><div className="chart-bar" style={{height:'${h}%',background:'linear-gradient(180deg,var(--accent),rgba(4,120,87,.3))',width:'28px'}}></div><span style={{fontSize:'9px',color:'var(--text-muted)'}}>${m}</span></div>`;
            }).join('')}
          </div>
          <div style={{textAlign:'center',marginTop:'10px',fontSize:'11px',color:'var(--text-muted)'}}>عدد الأجزاء المحفوظة شهرياً (إجمالي الطلاب)</div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><span className="card-title">🕐 آخر الأنشطة</span></div>
        <div className="card-body">
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>🎓</div>
            <div><div className="act-text"><strong>يوسف السبيعي</strong> أتمّ ختمة القرآن الكريم كاملاً 🎉</div><div className="act-time">منذ ساعة</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)'}}>📖</div>
            <div><div className="act-text"><strong>حلقة الإتقان</strong> — 5 طلاب أتمّوا حفظ سورة البقرة</div><div className="act-time">منذ 3 ساعات</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>👥</div>
            <div><div className="act-text"><strong>12 طالب جديد</strong> تم تسجيلهم في حلقة البراعم</div><div className="act-time">اليوم</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>⚠️</div>
            <div><div className="act-text"><strong>3 طلاب</strong> تغيبوا أكثر من أسبوع — يحتاجون متابعة</div><div className="act-time">أمس</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>🏅</div>
            <div><div className="act-text">تم الإعلان عن نتائج <strong>مسابقة الحفظ الشهرية</strong></div><div className="act-time">أمس</div></div>
          </div>
        </div>
      </div>
    </div>

    {/* Halaqat Table */}
    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr">
        <span className="card-title">🕌 الحلقات القرآنية</span>
        <button className="hdr-btn" style={{fontSize:'11px',padding:'4px 10px'}}>عرض الكل</button>
      </div>
      <div className="card-body" style={{padding:0,overflowX:'auto'}}>
        <table className="table">
          <thead><tr><th>الحلقة</th><th>المحفّظ</th><th>الطلاب</th><th>البرنامج</th><th>نسبة الحضور</th><th>تقدم الحفظ</th><th>الحالة</th></tr></thead>
          <tbody>
            ${[
              ['حلقة الإتقان','الشيخ عبدالرحمن','28/30','حفظ كامل','95%','var(--green)','ممتاز','منعقدة','var(--green)'],
              ['حلقة التجويد','الشيخ محمد','22/25','تجويد','88%','var(--green)','جيد جداً','منعقدة','var(--green)'],
              ['حلقة البراعم (أ)','الشيخ أحمد','35/35','جزء عمّ','82%','var(--blue)','جيد','منعقدة','var(--green)'],
              ['حلقة النساء','الأستاذة نورة','18/20','حفظ ومراجعة','90%','var(--green)','ممتاز','منعقدة','var(--green)'],
              ['حلقة المراجعة','الشيخ خالد','15/20','مراجعة','78%','var(--orange)','متوسط','منعقدة','var(--green)'],
              ['حلقة الإجازة','الشيخ عبدالرحمن','5/8','إجازة بالسند','100%','var(--green)','ممتاز','منعقدة','var(--green)'],
            ].map(([halqa,teacher,cap,prog,att,attColor,progress,status,sColor]) => `
              <tr>
                <td style={{fontWeight:600,color:'var(--text)'}}>${halqa}</td>
                <td>${teacher}</td>
                <td>${cap}</td>
                <td style={{fontSize:'11px'}}>${prog}</td>
                <td style={{color:'${attColor}',fontWeight:600}}>${att}</td>
                <td><span className="status" style={{background:'${attColor}18',color:'${attColor}',border:'1px solid ${attColor}33'}}>${progress}</span></td>
                <td><span className="status" style={{background:'${sColor}18',color:'${sColor}',border:'1px solid ${sColor}33'}}>${status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    {/* Teachers + Top Students */}
    <div className="grid-2">
      <div className="card">
        <div className="card-hdr"><span className="card-title">👨‍🏫 أداء المحفّظين</span></div>
        <div className="card-body" style={{padding:0}}>
          <table className="table">
            <thead><tr><th>المحفّظ</th><th>الحلقات</th><th>الطلاب</th><th>نسبة الإنجاز</th><th>التقييم</th></tr></thead>
            <tbody>
              ${[
                ['👳‍♂️ الشيخ عبدالرحمن','2','33','96%','⭐ 4.9'],
                ['👳‍♂️ الشيخ محمد','1','22','92%','⭐ 4.8'],
                ['👳‍♂️ الشيخ أحمد','2','55','88%','⭐ 4.7'],
                ['👩‍🏫 الأستاذة نورة','1','18','94%','⭐ 4.9'],
                ['👳‍♂️ الشيخ خالد','1','15','85%','⭐ 4.6'],
              ].map(([name,halaqat,students,rate,rating]) => `
                <tr>
                  <td style={{fontWeight:600,color:'var(--text)'}}>${name}</td>
                  <td>${halaqat}</td>
                  <td>${students}</td>
                  <td style={{color:'var(--green)',fontWeight:700}}>${rate}</td>
                  <td style={{color:'var(--gold)'}}>${rating}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          <span className="card-title">🏆 أبرز الطلاب هذا الشهر</span>
        </div>
        <div className="card-body">
          ${[
            ['🥇','يوسف السبيعي','ختم القرآن كاملاً','var(--gold)','حلقة الإتقان'],
            ['🥈','عبدالملك الحربي','حفظ 3 أجزاء هذا الشهر','#C0C0C0','حلقة الإتقان'],
            ['🥉','سارة المالكي','أفضل تقييم تجويد','#CD7F32','حلقة النساء'],
            ['⭐','محمد الدوسري','100% حضور + حفظ ممتاز','var(--green)','حلقة البراعم'],
          ].map(([medal,name,achievement,color,halqa]) => `
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 0',borderBottom:'1px solid var(--border2)'}}>
              <div style={{fontSize:'22px'}}>${medal}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:'12.5px',fontWeight:700,color:'var(--text)'}}>${name}</div>
                <div style={{fontSize:'10.5px',color:'var(--text-muted)'}}>${achievement}</div>
              </div>
              <span style={{fontSize:'10px',color:'var(--text-muted)',background:'rgba(255,255,255,.04)',padding:'3px 8px',borderRadius:'6px'}}>${halqa}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    {/* Attendance Overview */}
    <div className="card">
      <div className="card-hdr">
        <span className="card-title">📋 ملخص الحضور — هذا الأسبوع</span>
      </div>
      <div className="card-body">
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'22px',fontWeight:800,color:'var(--green)'}}>89%</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>نسبة الحضور العامة</div>
          </div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(96,165,250,.06)',border:'1px solid rgba(96,165,250,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'22px',fontWeight:800,color:'var(--blue)'}}>1,068</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>حاضر</div>
          </div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(251,146,60,.06)',border:'1px solid rgba(251,146,60,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'22px',fontWeight:800,color:'var(--orange)'}}>96</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>غائب بعذر</div>
          </div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.15)',borderRadius:'10px'}}>
            <div style={{fontSize:'22px',fontWeight:800,color:'var(--red)'}}>36</div>
            <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>غائب بدون عذر</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

<div className="toast" id="toast-el"></div>
    </div>
  );
}