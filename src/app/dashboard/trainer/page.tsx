'use client';
import React, { useState } from 'react';
import '../../styles/training-trainer.css';

export default function TrainerPage() {
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
      <div className="user-av">👨‍💻</div>
      <div>
        <div className="user-name">م. خالد الحربي</div>
        <div className="user-role">مدرب معتمد</div>
        <div className="user-spec">تطوير البرمجيات</div>
      </div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active">📊 لوحة التحكم</a>
    <a className="nav-item">📅 جدولي التدريبي</a>

    <div className="nav-grp">الدورات</div>
    <a className="nav-item">📚 دوراتي الحالية <span className="nb nb-gold">3</span></a>
    <a className="nav-item">📁 أرشيف الدورات</a>
    <a className="nav-item">📝 المحتوى التدريبي</a>

    <div className="nav-grp">المتدربون</div>
    <a className="nav-item">👥 قائمة المتدربين <span className="nb nb-blue">52</span></a>
    <a className="nav-item">📋 الحضور والغياب</a>
    <a className="nav-item">📊 التقييمات والاختبارات <span className="nb nb-red">8</span></a>
    <a className="nav-item">🎓 الشهادات</a>

    <div className="nav-grp">التواصل</div>
    <a className="nav-item">💬 الرسائل <span className="nb nb-red">4</span></a>
    <a className="nav-item">📣 الإعلانات</a>
    <a className="nav-item">⭐ تقييمات المتدربين</a>

    <div className="nav-grp">حسابي</div>
    <a className="nav-item">👤 الملف الشخصي</a>
    <a className="nav-item">📜 شهاداتي واعتماداتي</a>
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
      <div><div className="page-title">مرحباً م. خالد 👋</div><div className="page-sub">لديك 3 حصص تدريبية اليوم</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn" onClick={() => {toast('🔔 4 إشعارات جديدة','var(--blue)')}}>🔔 <span className="nb nb-red">4</span></button>
      <button className="hdr-btn">📋 تقريري</button>
      <button className="hdr-btn hdr-btn-p" onClick={() => {toast('✅ جارٍ تسجيل الحضور','var(--accent)')}}>✅ تسجيل حضور</button>
    </div>
  </div>

  <div className="content">
    <div className="kpi-grid">
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--accent)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--accent-dim)',border:'1px solid var(--accent-border)'}}>📚</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>نشطة</span>
        </div>
        <div className="kpi-val">3</div>
        <div className="kpi-label">دورات حالية</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)'}}>👥</div>
          <span className="kpi-change" style={{background:'rgba(96,165,250,.12)',color:'var(--blue)'}}>هذا الفصل</span>
        </div>
        <div className="kpi-val">52</div>
        <div className="kpi-label">متدرب حالي</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--gold)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--gold-dim)',border:'1px solid var(--gold-border)'}}>⭐</div>
        </div>
        <div className="kpi-val">4.9</div>
        <div className="kpi-label">تقييم المتدربين</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)'}}>🎓</div>
        </div>
        <div className="kpi-val">96%</div>
        <div className="kpi-label">نسبة نجاح المتدربين</div>
      </div>
    </div>

    {/* Today's Schedule */}
    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr">
        <span className="card-title">📅 جدول اليوم — السبت 4 أبريل 2026</span>
        <span style={{fontSize:'10px',color:'var(--green)',fontWeight:700}}>● 3 حصص</span>
      </div>
      <div className="card-body">
        <div className="schedule-item">
          <div className="sch-time"><div className="sch-time-v">9:00</div><div className="sch-time-p">صباحاً</div></div>
          <div className="sch-body" style={{borderRightColor:'var(--blue)'}}>
            <div className="sch-name">💻 تطوير تطبيقات الويب — المستوى المتقدم</div>
            <div className="sch-meta">القاعة 2 · 18 متدرب · 9:00 - 11:30 · الوحدة 8: React Hooks</div>
          </div>
        </div>
        <div className="schedule-item">
          <div className="sch-time"><div className="sch-time-v">12:00</div><div className="sch-time-p">ظهراً</div></div>
          <div className="sch-body" style={{borderRightColor:'var(--green)'}}>
            <div className="sch-name">🌐 أساسيات البرمجة — المستوى التأسيسي</div>
            <div className="sch-meta">القاعة 5 · 22 متدرب · 12:00 - 1:30 · الوحدة 4: Functions</div>
          </div>
        </div>
        <div className="schedule-item">
          <div className="sch-time"><div className="sch-time-v">4:00</div><div className="sch-time-p">عصراً</div></div>
          <div className="sch-body" style={{borderRightColor:'var(--purple)'}}>
            <div className="sch-name">📱 تطوير تطبيقات الجوال — Flutter</div>
            <div className="sch-meta">القاعة 2 · 12 متدرب · 4:00 - 6:00 · الوحدة 3: Widgets</div>
          </div>
        </div>
      </div>
    </div>

    <div className="grid-2">
      {/* Courses Progress */}
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📚 تقدم الدورات</span>
        </div>
        <div className="card-body">
          ${[
            ['💻 تطوير تطبيقات الويب','75%','var(--blue)','الوحدة 8 من 12','18 متدرب'],
            ['🌐 أساسيات البرمجة','45%','var(--green)','الوحدة 4 من 10','22 متدرب'],
            ['📱 تطوير تطبيقات الجوال','30%','var(--purple)','الوحدة 3 من 10','12 متدرب'],
          ].map(([name,pct,color,unit,students]) => `
            <div style={{marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid var(--border2)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                <span style={{fontSize:'13px',fontWeight:700,color:'var(--text)'}}>${name}</span>
                <span style={{fontSize:'12px',fontWeight:800,color:'${color}'}}>${pct}</span>
              </div>
              <div className="prog-bar" style={{marginBottom:'6px'}}>
                <div className="prog-fill" style={{width:'${pct}',background:'${color}'}}></div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--text-muted)'}}>
                <span>${unit}</span><span>${students}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📋 المهام المطلوبة</span>
          <span className="nb nb-red">8</span>
        </div>
        <div className="card-body">
          ${[
            ['تصحيح اختبار الوحدة 7 — تطوير الويب','عاجل','var(--red)','⏰ اليوم'],
            ['رفع محتوى الوحدة 9 — تطوير الويب','مهم','var(--orange)','📅 غداً'],
            ['تقييم مشروع نهائي — 5 متدربين','مهم','var(--orange)','📅 خلال 3 أيام'],
            ['إعداد اختبار نصفي — أساسيات البرمجة','عادي','var(--blue)','📅 الأسبوع القادم'],
            ['تحديث خطة الدورة — Flutter','عادي','var(--blue)','📅 الأسبوع القادم'],
            ['إرسال تقرير أداء شهري','عادي','var(--blue)','📅 نهاية الشهر'],
          ].map(([task,priority,color,due]) => `
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 0',borderBottom:'1px solid var(--border2)'}}>
              <input type="checkbox" style={{accentColor:'var(--accent)',width:'14px',height:'14px',cursor:'pointer'}} />
              <div style={{flex:1}}>
                <div style={{fontSize:'12px',fontWeight:600,color:'var(--text)'}}>${task}</div>
                <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'2px'}}>${due}</div>
              </div>
              <span className="status" style={{background:'${color}18',color:'${color}',border:'1px solid ${color}33'}}>${priority}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    {/* Students Performance */}
    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr">
        <span className="card-title">👥 أداء المتدربين — تطوير تطبيقات الويب</span>
        <div style={{display:'flex',gap:'6px'}}>
          <button className="hdr-btn" style={{fontSize:'10px',padding:'3px 8px'}}>تصدير</button>
        </div>
      </div>
      <div className="card-body" style={{padding:0}}>
        <table className="table">
          <thead><tr><th>المتدرب</th><th>الحضور</th><th>الواجبات</th><th>الاختبارات</th><th>المشروع</th><th>المعدل</th><th>الحالة</th></tr></thead>
          <tbody>
            ${[
              ['عبدالله المالكي','95%','92','88','—','90%','var(--green)','ممتاز'],
              ['فهد الدوسري','88%','85','82','—','85%','var(--green)','جيد جداً'],
              ['نواف السبيعي','78%','70','75','—','74%','var(--orange)','جيد'],
              ['ماجد العتيبي','60%','55','62','—','59%','var(--red)','يحتاج متابعة'],
              ['سارة الغامدي','100%','98','95','—','97%','var(--green)','متميزة'],
              ['ريم الشهري','92%','88','90','—','90%','var(--green)','ممتازة'],
            ].map(([name,att,hw,test,proj,avg,color,status]) => `
              <tr>
                <td style={{fontWeight:600,color:'var(--text)'}}>${name}</td>
                <td>${att}</td>
                <td>${hw}</td>
                <td>${test}</td>
                <td>${proj}</td>
                <td style={{fontWeight:700,color:'${color}'}}>${avg}</td>
                <td><span className="status" style={{background:'${color}18',color:'${color}',border:'1px solid ${color}33'}}>${status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

  </div>
</div>

<div className="toast" id="toast-el"></div>
    </div>
  );
}