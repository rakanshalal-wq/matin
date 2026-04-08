'use client';
import React, { useState } from 'react';
import '../../../styles/quran-muhaffiz.css';

export default function MuhaffizPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="sidebar" id="sidebar">
  <div className="sb-top">
    <a className="sb-logo"><div className="logo-icon">م</div><div><div className="logo-main">متين</div><div className="logo-sub">منصة إدارة التعليم</div></div></a>
    <div className="user-card">
      <div className="user-av">👳‍♂️</div>
      <div><div className="user-name">الشيخ عبدالرحمن السديري</div><div className="user-role">محفّظ معتمد</div><div className="user-spec">حفص عن عاصم · مجاز بالسند</div></div>
    </div>
  </div>
  <div className="nav">
    <div className="nav-grp">الرئيسية</div>
    <a className="nav-item active">📊 لوحة التحكم</a>
    <a className="nav-item">📅 جدول الحلقات</a>
    <div className="nav-grp">الحلقات</div>
    <a className="nav-item">🕌 حلقاتي <span className="nb nb-grn">2</span></a>
    <a className="nav-item">📋 خطة الحفظ</a>
    <a className="nav-item">📖 سجل التسميع</a>
    <div className="nav-grp">الطلاب</div>
    <a className="nav-item">👥 طلابي <span className="nb nb-gold">33</span></a>
    <a className="nav-item">📋 الحضور والغياب</a>
    <a className="nav-item">📊 تقييم الطلاب <span className="nb nb-red">5</span></a>
    <a className="nav-item">⭐ نقاط التحفيز</a>
    <div className="nav-grp">التواصل</div>
    <a className="nav-item">👨‍👩‍👦 أولياء الأمور</a>
    <a className="nav-item">💬 الرسائل <span className="nb nb-red">3</span></a>
    <a className="nav-item">📣 الإعلانات</a>
    <div className="nav-grp">حسابي</div>
    <a className="nav-item">👤 الملف الشخصي</a>
    <a className="nav-item">📜 إجازاتي</a>
    <a className="nav-item">⚙️ الإعدادات</a>
  </div>
  <div className="sb-footer"><button className="logout-btn">🚪 تسجيل خروج</button></div>
</div>
<div className="overlay" id="overlay" onClick={() => {toggleSidebar()}}></div>

<div className="main">
  <div className="header">
    <div className="hdr-left">
      <button className="menu-btn" onClick={() => {toggleSidebar()}}>☰</button>
      <div><div className="page-title">مرحباً الشيخ عبدالرحمن 👋</div><div className="page-sub">لديك حلقتان اليوم — بعد الفجر وبعد العصر</div></div>
    </div>
    <div className="hdr-actions">
      <button className="hdr-btn">🔔 <span className="nb nb-red">3</span></button>
      <button className="hdr-btn hdr-btn-p" onClick={() => {toast('✅ فتح سجل التسميع','var(--qr)')}}>📖 بدء التسميع</button>
    </div>
  </div>
  <div className="content">
    <div className="kpi-grid">
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--qr)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'var(--qr-dim)',border:'1px solid var(--qr-border)'}}>🕌</div></div><div className="kpi-val">2</div><div className="kpi-label">حلقة نشطة</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--blue)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.22)'}}>👥</div></div><div className="kpi-val">33</div><div className="kpi-label">طالب في حلقاتي</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--gold)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'var(--gold-dim)',border:'1px solid var(--gold-border)'}}>📖</div></div><div className="kpi-val">12</div><div className="kpi-label">جزء حُفظ هذا الشهر</div></div>
      <div className="kpi"><div style={{position:'absolute',top:0,right:0,width:'3px',height:'100%',background:'var(--green)',borderRadius:'3px'}}></div><div className="kpi-top"><div className="kpi-ic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.22)'}}>⭐</div></div><div className="kpi-val">4.9</div><div className="kpi-label">تقييم الإشراف</div></div>
    </div>

    <div className="card" style={{marginBottom:'18px'}}>
      <div className="card-hdr"><span className="card-title">📅 حلقات اليوم — السبت 4 أبريل 2026</span><span style={{fontSize:'10px',color:'var(--green)',fontWeight:700}}>● حلقتان</span></div>
      <div className="card-body">
        <div className="sch-item"><div className="sch-time"><div className="sch-time-v">5:30</div><div className="sch-time-p">فجراً</div></div><div className="sch-body" style={{borderRightColor:'var(--qr)'}}><div className="sch-name">📖 حلقة الإتقان — الحفظ الجديد + المراجعة</div><div className="sch-meta">المسجد الرئيسي · 28 طالب · المقرر: سورة النساء (الآيات 24-35)</div></div></div>
        <div className="sch-item"><div className="sch-time"><div className="sch-time-v">4:30</div><div className="sch-time-p">عصراً</div></div><div className="sch-body" style={{borderRightColor:'var(--gold)'}}><div className="sch-name">📜 حلقة الإجازة — قراءة ومتابعة السند</div><div className="sch-meta">المصلّى · 5 طلاب · مراجعة ختمة كاملة مع التطبيق</div></div></div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card">
        <div className="card-hdr"><span className="card-title">👥 تسميع اليوم — حلقة الإتقان</span><button className="hdr-btn hdr-btn-p" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {toast('✅ تم فتح سجل التسميع','var(--qr)')}}>📖 بدء التسميع</button></div>
        <div className="card-body" style={{padding:0}}><table className="table"><thead><tr><th>الطالب</th><th>المقرر</th><th>الحفظ</th><th>المراجعة</th><th>التقييم</th></tr></thead><tbody>
          <tr><td style={{fontWeight:600,color:'var(--text)'}}>يوسف السبيعي</td><td style={{fontSize:'11px'}}>الناس-الفلق</td><td><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>ممتاز</span></td><td><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>ممتاز</span></td><td style={{color:'var(--gold)'}}>⭐⭐⭐</td></tr>
          <tr><td style={{fontWeight:600,color:'var(--text)'}}>عبدالملك الحربي</td><td style={{fontSize:'11px'}}>آل عمران 150-160</td><td><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>جيد جداً</span></td><td><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>ممتاز</span></td><td style={{color:'var(--gold)'}}>⭐⭐⭐</td></tr>
          <tr><td style={{fontWeight:600,color:'var(--text)'}}>سعود المطيري</td><td style={{fontSize:'11px'}}>البقرة 255-270</td><td><span className="status" style={{background:'rgba(96,165,250,.15)',color:'var(--blue)',border:'1px solid rgba(96,165,250,.3)'}}>جيد</span></td><td><span className="status" style={{background:'rgba(96,165,250,.15)',color:'var(--blue)',border:'1px solid rgba(96,165,250,.3)'}}>جيد جداً</span></td><td style={{color:'var(--gold)'}}>⭐⭐</td></tr>
          <tr><td style={{fontWeight:600,color:'var(--text)'}}>فارس العتيبي</td><td style={{fontSize:'11px'}}>النساء 1-15</td><td><span className="status" style={{background:'rgba(251,146,60,.15)',color:'var(--orange)',border:'1px solid rgba(251,146,60,.3)'}}>متوسط</span></td><td><span className="status" style={{background:'rgba(251,146,60,.15)',color:'var(--orange)',border:'1px solid rgba(251,146,60,.3)'}}>جيد</span></td><td style={{color:'var(--gold)'}}>⭐⭐</td></tr>
          <tr><td style={{fontWeight:600,color:'var(--text)'}}>خالد الشمري</td><td style={{fontSize:'11px'}}>آل عمران 100-110</td><td><span className="status" style={{background:'rgba(239,68,68,.15)',color:'var(--red)',border:'1px solid rgba(239,68,68,.3)'}}>ضعيف</span></td><td><span className="status" style={{background:'rgba(251,146,60,.15)',color:'var(--orange)',border:'1px solid rgba(251,146,60,.3)'}}>متوسط</span></td><td style={{color:'var(--gold)'}}>⭐</td></tr>
        </tbody></table></div>
      </div>

      <div className="card">
        <div className="card-hdr"><span className="card-title">📊 تقدم الحفظ — حلقة الإتقان</span></div>
        <div className="card-body">
          <div style={{marginBottom:'14px',paddingBottom:'14px',borderBottom:'1px solid var(--border2)'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>يوسف السبيعي</span><span style={{fontSize:'11px',fontWeight:700,color:'var(--green)'}}>30/30 جزء</span></div><div className="prog-bar"><div className="prog-fill" style={{width:'100%',background:'var(--green)'}}></div></div><div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'4px'}}>✅ ختم — جاهز للإجازة</div></div>
          <div style={{marginBottom:'14px',paddingBottom:'14px',borderBottom:'1px solid var(--border2)'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>عبدالملك الحربي</span><span style={{fontSize:'11px',fontWeight:700,color:'var(--blue)'}}>22/30 جزء</span></div><div className="prog-bar"><div className="prog-fill" style={{width:'73%',background:'var(--blue)'}}></div></div><div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'4px'}}>متقدم — متوقع الختم خلال 8 أشهر</div></div>
          <div style={{marginBottom:'14px',paddingBottom:'14px',borderBottom:'1px solid var(--border2)'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>سعود المطيري</span><span style={{fontSize:'11px',fontWeight:700,color:'var(--blue)'}}>15/30 جزء</span></div><div className="prog-bar"><div className="prog-fill" style={{width:'50%',background:'var(--blue)'}}></div></div><div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'4px'}}>جيد — مستمر في الحفظ</div></div>
          <div style={{marginBottom:'14px',paddingBottom:'14px',borderBottom:'1px solid var(--border2)'}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>فارس العتيبي</span><span style={{fontSize:'11px',fontWeight:700,color:'var(--orange)'}}>8/30 جزء</span></div><div className="prog-bar"><div className="prog-fill" style={{width:'27%',background:'var(--orange)'}}></div></div><div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'4px'}}>يحتاج تحفيز — بطيء في المراجعة</div></div>
          <div><div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}><span style={{fontSize:'12px',fontWeight:700,color:'var(--text)'}}>خالد الشمري</span><span style={{fontSize:'11px',fontWeight:700,color:'var(--red)'}}>5/30 جزء</span></div><div className="prog-bar"><div className="prog-fill" style={{width:'17%',background:'var(--red)'}}></div></div><div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'4px'}}>يحتاج متابعة — كثير الغياب</div></div>
        </div>
      </div>
    </div>

    <div className="grid-2">
      <div className="card">
        <div className="card-hdr"><span className="card-title">📋 حضور اليوم</span><button className="hdr-btn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {toast('✅ تم حفظ الحضور','var(--green)')}}>حفظ</button></div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid var(--border2)'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--green)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>يوسف السبيعي</span><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>حاضر</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid var(--border2)'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--green)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>عبدالملك الحربي</span><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>حاضر</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid var(--border2)'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--green)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>سعود المطيري</span><span className="status" style={{background:'rgba(16,185,129,.15)',color:'var(--green)',border:'1px solid rgba(16,185,129,.3)'}}>حاضر</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid var(--border2)'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--orange)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>فارس العتيبي</span><span className="status" style={{background:'rgba(251,146,60,.15)',color:'var(--orange)',border:'1px solid rgba(251,146,60,.3)'}}>متأخر</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0',borderBottom:'1px solid var(--border2)'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--red)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>خالد الشمري</span><span className="status" style={{background:'rgba(239,68,68,.15)',color:'var(--red)',border:'1px solid rgba(239,68,68,.3)'}}>غائب</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'7px 0'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--blue)'}}></div><span style={{flex:1,fontSize:'12px',fontWeight:600}}>عمر البيشي</span><span className="status" style={{background:'rgba(96,165,250,.15)',color:'var(--blue)',border:'1px solid rgba(96,165,250,.3)'}}>غائب بعذر</span></div>
          <div style={{marginTop:'12px',display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
            <div style={{textAlign:'center',padding:'8px',background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.15)',borderRadius:'8px'}}><div style={{fontSize:'16px',fontWeight:800,color:'var(--green)'}}>3</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>حاضر</div></div>
            <div style={{textAlign:'center',padding:'8px',background:'rgba(251,146,60,.06)',border:'1px solid rgba(251,146,60,.15)',borderRadius:'8px'}}><div style={{fontSize:'16px',fontWeight:800,color:'var(--orange)'}}>1</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>متأخر</div></div>
            <div style={{textAlign:'center',padding:'8px',background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.15)',borderRadius:'8px'}}><div style={{fontSize:'16px',fontWeight:800,color:'var(--red)'}}>2</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>غائب</div></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr"><span className="card-title">💬 رسائل أولياء الأمور</span><span className="nb nb-red">3</span></div>
        <div className="card-body">
          <div style={{padding:'12px',background:'rgba(255,255,255,.02)',border:'1px solid var(--border2)',borderRadius:'10px',marginBottom:'8px',borderRight:'3px solid var(--green)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}><div style={{width:'28px',height:'28px',borderRadius:'7px',background:'rgba(16,185,129,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>👨</div><div style={{flex:1,fontSize:'12px',fontWeight:700}}>أبو يوسف السبيعي</div><span style={{fontSize:'9px',color:'var(--text-muted)'}}>منذ ساعة</span></div>
            <div style={{fontSize:'11.5px',color:'var(--text-dim)',lineHeight:'1.5',paddingRight:'36px'}}>ماشاءالله على الختمة! متى تبدأ مرحلة الإجازة؟</div>
            <div style={{marginTop:'8px',paddingRight:'36px'}}><button style={{background:'var(--qr-dim)',border:'1px solid var(--qr-border)',borderRadius:'6px',padding:'4px 10px',color:'var(--qr)',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}}>ردّ</button></div>
          </div>
          <div style={{padding:'12px',background:'rgba(255,255,255,.02)',border:'1px solid var(--border2)',borderRadius:'10px',marginBottom:'8px',borderRight:'3px solid var(--blue)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}><div style={{width:'28px',height:'28px',borderRadius:'7px',background:'rgba(96,165,250,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>👨</div><div style={{flex:1,fontSize:'12px',fontWeight:700}}>أبو خالد الشمري</div><span style={{fontSize:'9px',color:'var(--text-muted)'}}>منذ 3 ساعات</span></div>
            <div style={{fontSize:'11.5px',color:'var(--text-dim)',lineHeight:'1.5',paddingRight:'36px'}}>خالد مريض اليوم، إن شاء الله يحضر غداً</div>
            <div style={{marginTop:'8px',paddingRight:'36px'}}><button style={{background:'var(--qr-dim)',border:'1px solid var(--qr-border)',borderRadius:'6px',padding:'4px 10px',color:'var(--qr)',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}}>ردّ</button></div>
          </div>
          <div style={{padding:'12px',background:'rgba(255,255,255,.02)',border:'1px solid var(--border2)',borderRadius:'10px',borderRight:'3px solid var(--orange)'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}><div style={{width:'28px',height:'28px',borderRadius:'7px',background:'rgba(251,146,60,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px'}}>👩</div><div style={{flex:1,fontSize:'12px',fontWeight:700}}>أم فارس العتيبي</div><span style={{fontSize:'9px',color:'var(--text-muted)'}}>أمس</span></div>
            <div style={{fontSize:'11.5px',color:'var(--text-dim)',lineHeight:'1.5',paddingRight:'36px'}}>هل يمكن إرسال تقرير فارس الشهري؟</div>
            <div style={{marginTop:'8px',paddingRight:'36px'}}><button style={{background:'var(--qr-dim)',border:'1px solid var(--qr-border)',borderRadius:'6px',padding:'4px 10px',color:'var(--qr)',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--font)'}}>ردّ</button></div>
          </div>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-hdr"><span className="card-title">⭐ نقاط التحفيز — أعلى 5 طلاب</span><button className="hdr-btn" style={{fontSize:'10px',padding:'4px 10px'}} onClick={() => {toast('⭐ إضافة نقاط','var(--gold)')}}>➕ إضافة نقاط</button></div>
      <div className="card-body">
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'10px'}}>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'12px'}}><div style={{fontSize:'24px'}}>🥇</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text)',margin:'6px 0 4px'}}>يوسف السبيعي</div><div style={{fontSize:'18px',fontWeight:800,color:'var(--gold)'}}>480</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>نقطة</div></div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'12px'}}><div style={{fontSize:'24px'}}>🥈</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text)',margin:'6px 0 4px'}}>عبدالملك الحربي</div><div style={{fontSize:'18px',fontWeight:800,color:'#C0C0C0'}}>420</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>نقطة</div></div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'12px'}}><div style={{fontSize:'24px'}}>🥉</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text)',margin:'6px 0 4px'}}>ماجد القحطاني</div><div style={{fontSize:'18px',fontWeight:800,color:'#CD7F32'}}>380</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>نقطة</div></div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'12px'}}><div style={{fontSize:'24px'}}>⭐</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text)',margin:'6px 0 4px'}}>سعود المطيري</div><div style={{fontSize:'18px',fontWeight:800,color:'var(--green)'}}>350</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>نقطة</div></div>
          <div style={{textAlign:'center',padding:'14px',background:'rgba(255,255,255,.03)',border:'1px solid var(--border2)',borderRadius:'12px'}}><div style={{fontSize:'24px'}}>⭐</div><div style={{fontSize:'11px',fontWeight:700,color:'var(--text)',margin:'6px 0 4px'}}>تركي الزهراني</div><div style={{fontSize:'18px',fontWeight:800,color:'var(--blue)'}}>320</div><div style={{fontSize:'9px',color:'var(--text-muted)'}}>نقطة</div></div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="toast" id="toast-el"></div>
    </div>
  );
}