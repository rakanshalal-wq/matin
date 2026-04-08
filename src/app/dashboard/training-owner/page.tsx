'use client';
import React, { useState } from 'react';
import '../../styles/training-owner.css';

export default function TrainingOwnerPage() {
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
      <div className="user-av">👨‍💼</div>
      <div><div className="user-name">أ. سلطان الدوسري</div><div className="user-role">مدير مركز التدريب</div></div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active">📊 لوحة التحكم</a>
    <a className="nav-item">📈 التقارير والإحصائيات</a>

    <div className="nav-grp">إدارة التدريب</div>
    <a className="nav-item">📚 البرامج التدريبية <span className="nb nb-gold">24</span></a>
    <a className="nav-item">📅 الجدول التدريبي</a>
    <a className="nav-item">🎓 الشهادات والاعتمادات</a>
    <a className="nav-item">📝 التقييمات والاختبارات</a>

    <div className="nav-grp">إدارة الأفراد</div>
    <a className="nav-item">👨‍🏫 المدربون <span className="nb nb-blue">18</span></a>
    <a className="nav-item">👥 المتدربون <span className="nb nb-gold">340</span></a>
    <a className="nav-item">👔 الموظفون الإداريون</a>

    <div className="nav-grp">المالية</div>
    <a className="nav-item">💰 الإيرادات والرسوم <span className="nb nb-red">3</span></a>
    <a className="nav-item">📋 الفواتير</a>
    <a className="nav-item">💳 المدفوعات</a>

    <div className="nav-grp">المرافق</div>
    <a className="nav-item">🏢 القاعات التدريبية</a>
    <a className="nav-item">🖥️ المختبرات والأجهزة</a>

    <div className="nav-grp">التواصل</div>
    <a className="nav-item">📣 الإعلانات <span className="nb nb-red">2</span></a>
    <a className="nav-item">💬 الرسائل</a>
    <a className="nav-item">⚙️ الإعدادات</a>
  </div>
  <div className="sb-footer">
    <button className="logout-btn" onClick={() => {toast('👋 جارٍ تسجيل الخروج','#F87171')}}>🚪 تسجيل خروج</button>
  </div>
</div>

<div className="overlay" id="overlay" onClick={() => {toggleSidebar()}}></div>

<div className="main">
  <div className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSidebar()}}>☰</button>
      <div><div className="page-title">لوحة تحكم مدير المركز</div><div className="page-sub">آخر تحديث: اليوم 10:45 ص</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn" onClick={() => {toast('🔔 لا توجد إشعارات جديدة','var(--blue)')}}>🔔 <span className="nb nb-red" style={{fontSize:'9px'}}>5</span></button>
      <button className="hdr-btn" onClick={() => {toast('📊 جارٍ تحميل التقرير','var(--accent)')}}>📊 تقرير</button>
      <button className="hdr-btn hdr-btn-p" onClick={() => {toast('➕ إضافة برنامج جديد','var(--accent)')}}>➕ برنامج جديد</button>
    </div>
  </div>

  <div className="content">
    {/* KPIs */}
    <div className="kpi-grid">
      <div className="kpi" style={{C:'var(--accent)'}}>
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--accent)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'var(--accent-dim)',border:'1px solid var(--accent-border)'}}>📚</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>+3 هذا الشهر</span>
        </div>
        <div className="kpi-val">24</div>
        <div className="kpi-label">برنامج تدريبي نشط</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)'}}>👥</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>↑ 12%</span>
        </div>
        <div className="kpi-val">340</div>
        <div className="kpi-label">متدرب مسجل حالياً</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)'}}>💰</div>
          <span className="kpi-change" style={{background:'rgba(16,185,129,.12)',color:'var(--green)'}}>↑ 18%</span>
        </div>
        <div className="kpi-val">285K</div>
        <div className="kpi-label">إيرادات هذا الشهر (ر.س)</div>
      </div>
      <div className="kpi">
        <div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--purple)',borderRadius:'3px'}}></div>
        <div className="kpi-top">
          <div className="kpi-ic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.22)'}}>🎓</div>
          <span className="kpi-change" style={{background:'rgba(251,146,60,.12)',color:'var(--orange)'}}>هذا الأسبوع</span>
        </div>
        <div className="kpi-val">56</div>
        <div className="kpi-label">شهادة صادرة هذا الشهر</div>
      </div>
    </div>

    {/* Charts + Activity */}
    <div className="grid-2">
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📈 إيرادات آخر 6 أشهر</span>
          <span className="card-badge" style={{background:'rgba(16,185,129,.1)',color:'var(--green)',border:'1px solid rgba(16,185,129,.22)'}}>↑ 18%</span>
        </div>
        <div className="card-body">
          <div className="chart-placeholder">
            ${[65,48,72,55,80,92].map((h,i) => `<div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}><div className="chart-bar" style={{height:'${h}%',background:'linear-gradient(180deg,var(--accent),rgba(230,81,0,.3))',width:'28px'}}></div><span style={{fontSize:'9px',color:'var(--text-muted)'}}>${['نوف','ديس','يناير','فبر','مارس','أبريل'][i]}</span></div>`).join('')}
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">🕐 آخر الأنشطة</span>
        </div>
        <div className="card-body">
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>✅</div>
            <div><div className="act-text"><strong>م. خالد</strong> أنهى دورة تطوير الويب — 18 متدرب ناجح</div><div className="act-time">منذ 30 دقيقة</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📝</div>
            <div><div className="act-text"><strong>5 متدربين جدد</strong> سجلوا في برنامج الذكاء الاصطناعي</div><div className="act-time">منذ ساعة</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>💰</div>
            <div><div className="act-text">تم تحصيل <strong>12,500 ر.س</strong> رسوم تسجيل اليوم</div><div className="act-time">منذ ساعتين</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>🎓</div>
            <div><div className="act-text">تم إصدار <strong>8 شهادات</strong> لخريجي دورة PMP</div><div className="act-time">أمس</div></div>
          </div>
          <div className="activity-item">
            <div className="act-ic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>⚠️</div>
            <div><div className="act-text">القاعة 3 تحتاج <strong>صيانة لجهاز العرض</strong></div><div className="act-time">أمس</div></div>
          </div>
        </div>
      </div>
    </div>

    {/* Programs + Trainers */}
    <div className="grid-2">
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">📚 البرامج النشطة</span>
          <button className="hdr-btn" style={{fontSize:'11px',padding:'4px 10px'}} onClick={() => {toast('📋 عرض جميع البرامج','var(--accent)')}}>عرض الكل</button>
        </div>
        <div className="card-body" style={{padding:0}}>
          <table className="table">
            <thead><tr><th>البرنامج</th><th>المدرب</th><th>المتدربون</th><th>الإشغال</th><th>الحالة</th></tr></thead>
            <tbody>
              ${[
                ['تطوير الويب','م. خالد','18/20','90%','var(--green)','نشط'],
                ['إدارة المشاريع PMP','د. عبدالرحمن','22/25','88%','var(--green)','نشط'],
                ['الذكاء الاصطناعي','د. نورة','17/25','68%','var(--blue)','تسجيل'],
                ['الأمن السيبراني','م. فيصل','25/25','100%','var(--orange)','مكتمل'],
                ['تطبيقات الجوال','م. أحمد','10/20','50%','var(--blue)','تسجيل'],
              ].map(([prog,trainer,cap,pct,color,status]) => `
                <tr>
                  <td style={{fontWeight:600,color:'var(--text)'}}>${prog}</td>
                  <td>${trainer}</td>
                  <td>${cap}</td>
                  <td><div className="prog-bar" style={{width:'60px'}}><div className="prog-fill" style={{width:'${pct}',background:'${color}'}}></div></div></td>
                  <td><span className="status" style={{background:'${color}18',color:'${color}',border:'1px solid ${color}33'}}>${status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          <span className="card-title">👨‍🏫 أداء المدربين</span>
          <button className="hdr-btn" style={{fontSize:'11px',padding:'4px 10px'}}>عرض الكل</button>
        </div>
        <div className="card-body" style={{padding:0}}>
          <table className="table">
            <thead><tr><th>المدرب</th><th>التخصص</th><th>المتدربون</th><th>التقييم</th><th>نسبة النجاح</th></tr></thead>
            <tbody>
              ${[
                ['👨‍💻 م. خالد الحربي','برمجة','85','⭐ 4.9','96%'],
                ['👨‍💼 د. عبدالرحمن','إدارة','72','⭐ 4.8','94%'],
                ['👩‍🔬 د. نورة الشمري','AI','65','⭐ 4.9','97%'],
                ['👨‍🔧 م. فيصل العتيبي','أمن سيبراني','58','⭐ 4.7','92%'],
                ['👩‍💻 م. سارة القحطاني','جوال','45','⭐ 4.8','95%'],
              ].map(([name,spec,students,rating,success]) => `
                <tr>
                  <td style={{fontWeight:600,color:'var(--text)'}}>${name}</td>
                  <td>${spec}</td>
                  <td>${students}</td>
                  <td style={{color:'var(--gold)'}}>${rating}</td>
                  <td style={{color:'var(--green)',fontWeight:700}}>${success}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {/* Halls + Finances */}
    <div className="grid-2">
      <div className="card">
        <div className="card-hdr">
          <span className="card-title">🏢 حالة القاعات التدريبية</span>
        </div>
        <div className="card-body">
          ${[
            ['القاعة 1 — الرئيسية','مشغولة','دورة PMP','var(--green)','50 مقعد'],
            ['القاعة 2 — المختبر','مشغولة','تطوير الويب','var(--green)','25 مقعد'],
            ['القاعة 3 — التقنية','صيانة','صيانة بروجكتر','var(--red)','30 مقعد'],
            ['القاعة 4 — المؤتمرات','متاحة','—','var(--blue)','80 مقعد'],
            ['القاعة 5 — الحاسب','مشغولة','الأمن السيبراني','var(--green)','20 مقعد'],
          ].map(([name,status,activity,color,cap]) => `
            <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 0',borderBottom:'1px solid var(--border2)'}}>
              <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'${color}',flexShrink:0}}></div>
              <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--text)'}}>${name}</div><div style={{fontSize:'10px',color:'var(--text-muted)'}}>${activity} · ${cap}</div></div>
              <span className="status" style={{background:'${color}18',color:'${color}',border:'1px solid ${color}33'}}>${status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">
          <span className="card-title">💰 ملخص مالي — أبريل 2026</span>
        </div>
        <div className="card-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'16px'}}>
            <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
              <div style={{fontSize:'20px',fontWeight:800,color:'var(--green)'}}>285,000</div>
              <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>إيرادات (ر.س)</div>
            </div>
            <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.15)',borderRadius:'10px',padding:'12px',textAlign:'center'}}>
              <div style={{fontSize:'20px',fontWeight:800,color:'var(--red)'}}>92,000</div>
              <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'3px'}}>مصروفات (ر.س)</div>
            </div>
          </div>
          <div style={{background:'rgba(230,81,0,.06)',border:'1px solid rgba(230,81,0,.15)',borderRadius:'10px',padding:'14px',textAlign:'center'}}>
            <div style={{fontSize:'24px',fontWeight:800,color:'var(--accent)'}}>193,000</div>
            <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'3px'}}>صافي الربح (ر.س)</div>
          </div>
          <div style={{marginTop:'14px'}}>
            ${[
              ['رسوم تسجيل','195,000 ر.س','var(--green)'],
              ['رسوم اختبارات','45,000 ر.س','var(--blue)'],
              ['رسوم شهادات','25,000 ر.س','var(--purple)'],
              ['خدمات إضافية','20,000 ر.س','var(--orange)'],
            ].map(([label,val,color]) => `
              <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border2)',fontSize:'11.5px'}}>
                <span style={{color:'var(--text-dim)'}}>${label}</span>
                <span style={{color:'${color}',fontWeight:700}}>${val}</span>
              </div>
            `).join('')}
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