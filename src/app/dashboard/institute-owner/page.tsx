'use client';
import React, { useState } from 'react';
import '../../styles/inst-owner.css';

export default function InstituteOwnerPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="ov" id="ov" onClick={() => {closeSb()}}></div>

{/* MODAL: برنامج جديد */}
<div className="modal-bg" id="prog-modal">
  <div className="modal">
    <div className="modal-h">
      <div className="modal-t">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        إضافة برنامج تدريبي جديد
      </div>
      <div className="modal-x" onClick={() => {closeModal('prog-modal')}}>×</div>
    </div>
    <div className="modal-body">
      <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
        <div><label className="flbl">اسم البرنامج</label><input className="finp" placeholder="مثال: تطوير تطبيقات الويب" /></div>
        <div><label className="flbl">وصف مختصر</label><textarea className="finp" rows="2" placeholder="وصف البرنامج وأهدافه..." style={{resize:'vertical'}}></textarea></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div><label className="flbl">المدة (بالأسابيع)</label><input className="finp" type="number" placeholder="12" /></div>
          <div><label className="flbl">السعر (ر.س)</label><input className="finp" type="number" placeholder="3200" /></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div><label className="flbl">عدد المقاعد</label><input className="finp" type="number" placeholder="25" /></div>
          <div>
            <label className="flbl">المستوى</label>
            <select className="finp"><option>مبتدئ</option><option>متوسط</option><option>متقدم</option><option>جميع المستويات</option></select>
          </div>
        </div>
        <div>
          <label className="flbl">طريقة التدريب</label>
          <select className="finp"><option>حضوري</option><option>أونلاين مباشر</option><option>هجين</option><option>مسجل ذاتياً</option></select>
        </div>
        <div>
          <label className="flbl">المدرب</label>
          <select className="finp">
            <option>اختر المدرب...</option>
            <option>م. سارة القحطاني</option>
            <option>د. خالد المطيري</option>
            <option>م. نورة العمري</option>
            <option>م. فيصل الشمري</option>
          </select>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div><label className="flbl">تاريخ بدء الدفعة</label><input className="finp" type="date" /></div>
          <div><label className="flbl">وقت الجلسة</label><input className="finp" type="time" /></div>
        </div>
        <div style={{display:'flex',gap:'8px',marginTop:'4px'}}>
          <button onClick={() => {closeModal('prog-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
          <button className="btn-sub" style={{flex:2}}>إضافة البرنامج ←</button>
        </div>
      </div>
    </div>
  </div>
</div>

{/* MODAL: إصدار شهادة */}
<div className="modal-bg" id="cert-modal">
  <div className="modal">
    <div className="modal-h">
      <div className="modal-t">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        إصدار شهادة
      </div>
      <div className="modal-x" onClick={() => {closeModal('cert-modal')}}>×</div>
    </div>
    <div className="modal-body">
      <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
        <div><label className="flbl">البرنامج</label><select className="finp"><option>تطوير تطبيقات الويب</option><option>الذكاء الاصطناعي</option><option>إدارة المشاريع PMP</option></select></div>
        <div><label className="flbl">اسم المتدرب الكامل</label><input className="finp" placeholder="كما في الهوية الوطنية" /></div>
        <div><label className="flbl">رقم الهوية الوطنية</label><input className="finp" placeholder="1xxxxxxxxx" /></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          <div><label className="flbl">تاريخ الإتمام</label><input className="finp" type="date" /></div>
          <div><label className="flbl">درجة الاختبار</label><input className="finp" type="number" placeholder="85" /></div>
        </div>
        <div style={{background:'rgba(14,165,233,.07)',border:'1px solid rgba(14,165,233,.2)',borderRadius:'9px',padding:'11px 13px',fontSize:'12px',color:'var(--td)'}}>
          <strong style={{color:'var(--c)'}}>ملاحظة:</strong> الشهادة ستُصدر برمز QR فريد للتحقق، وتُرسل تلقائياً لبريد المتدرب وتُضاف لجواز سفر مهاراته في متين.
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => {closeModal('cert-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
          <button style={{flex:2,background:'linear-gradient(135deg,var(--gd),var(--gd2))',border:'none',borderRadius:'9px',padding:'11px',color:'#000',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إصدار الشهادة ←</button>
        </div>
      </div>
    </div>
  </div>
</div>

{/* SIDEBAR */}
<aside className="sb" id="sb">
  <div className="sb-top">
    <a className="logo-row" href="#">
      <div className="logo-ic">م</div>
      <div><div className="logo-t">متين</div><div className="logo-s">نظام إدارة التدريب</div></div>
    </a>
    <div className="inst-card">
      <div className="ic-av">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div style={{minWidth:0}}>
        <div className="ic-name">أحمد المحيسن</div>
        <div className="ic-role">مدير المعهد</div>
        <div className="ic-inst">معهد الإتقان للتدريب</div>
      </div>
    </div>
  </div>

  <nav className="nav">
    <div className="ng">الرئيسية</div>
    <a className="ni on" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      لوحتي <span className="dot"></span>
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      إعلانات المنصة <span className="nb nb-b">2</span>
    </a>

    <div className="ng">البرامج والدورات</div>
    <a className="ni" href="#" onClick={() => {openModal('prog-modal')}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      <span style={{color:'var(--gd)',fontWeight:600}}>إضافة برنامج جديد</span>
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      جميع البرامج
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
      الجدول والمواعيد
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      قاعات التدريب
    </a>

    <div className="ng">المتدربون</div>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      المتدربون المسجلون <span className="nb nb-b">284</span>
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      الحضور والغياب
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
      الاختبارات والتقييم <span className="nb nb-r">5</span>
    </a>
    <a className="ni" href="#" onClick={() => {openModal('cert-modal')}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
      <span style={{color:'var(--gd)',fontWeight:600}}>إصدار شهادة</span>
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      الشهادات الصادرة
    </a>

    <div className="ng">المدربون</div>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      فريق المدربين
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2 2.84h3a2 2 0 0 0 2 1.72 12.84 12.84 0 0 0 .7 2.81A2 2 0 0 1 7 9.09l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 0 22 16.92z"/></svg>
      طلبات التواصل <span className="nb nb-b">3</span>
    </a>

    <div className="ng">المالية</div>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      الإيرادات والمدفوعات
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      الفواتير الضريبية
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
      كوبونات الخصم
    </a>

    <div className="ng">الإعدادات</div>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      إعدادات صفحة المعهد
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
      الباقة والاشتراك
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      الأمان والصلاحيات
    </a>
    <a className="ni" href="#">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      الدعم الفني
    </a>
  </nav>

  <div className="sb-foot">
    <button className="logout-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      تسجيل الخروج
    </button>
    <div className="sb-ver">متين v3.0 · معهد الإتقان</div>
  </div>
</aside>

{/* MAIN */}
<div className="main">
  {/* HEADER */}
  <header className="hdr">
    <div className="hdr-l">
      <button className="menu-btn" onClick={() => {openSb()}}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div>
        <div className="hdr-title">لوحة مدير المعهد</div>
        <div className="hdr-sub">معهد الإتقان للتدريب · ذو القعدة 1446 هـ</div>
      </div>
    </div>
    <div className="hdr-r">
      <div className="srch">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--tm)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input placeholder="بحث في المتدربين والبرامج..." />
      </div>
      <div className="hdr-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <div className="ndot"></div>
      </div>
      <div className="user-btn">
        <div className="u-av">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <div className="u-name">أحمد المحيسن</div>
          <div className="u-role">مدير المعهد</div>
        </div>
      </div>
    </div>
  </header>

  {/* CONTENT */}
  <div className="ct">

    {/* ALERT */}
    <div className="alert alert-b">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span style={{color:'var(--td)'}}>دفعة <strong style={{color:'var(--c)'}}>تطوير الويب</strong> تبدأ بعد 3 أيام — تأكد من توفر قاعة التدريب وجهاز المدرب</span>
      <a href="#" style={{color:'var(--c)',fontWeight:700,fontSize:'11.5px',marginRight:'auto'}}>عرض التفاصيل ←</a>
      <button onClick={() => {this.parentNode.style.display='none'}} style={{background:'none',border:'none',color:'var(--tm)',cursor:'pointer',fontSize:'16px'}}>×</button>
    </div>

    {/* PAGE HDR */}
    <div className="pg-hdr">
      <div>
        <div className="pg-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          نظرة عامة
        </div>
        <div className="pg-sub">ذو القعدة 1446 · الدفعة الثانية · أسبوع 3 من 12</div>
      </div>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        <button className="btn-p" onClick={() => {openModal('cert-modal')}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          إصدار شهادة
        </button>
        <button className="btn-p" style={{background:'linear-gradient(135deg,var(--gd),var(--gd2))',color:'#000',boxShadow:'0 4px 14px rgba(212,168,67,.25)'}} onClick={() => {openModal('prog-modal')}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          برنامج جديد
        </button>
      </div>
    </div>

    {/* PERIOD BAR */}
    <div className="period-bar">
      <div className="pb-item">
        <div className="pb-lbl">الشهر التدريبي</div>
        <div className="pb-val">ذو القعدة 1446</div>
        <div className="pb-sub" style={{color:'var(--c)'}}>تسجيل مفتوح</div>
      </div>
      <div className="pb-div"></div>
      <div className="pb-item">
        <div className="pb-lbl">دفعات جارية</div>
        <div className="pb-val">5 دفعات</div>
        <div className="pb-sub" style={{color:'var(--gr)'}}>3 حضوري · 2 أونلاين</div>
      </div>
      <div className="pb-div"></div>
      <div className="pb-item">
        <div className="pb-lbl">شهادات هذا الشهر</div>
        <div className="pb-val">47 شهادة</div>
        <div className="pb-sub" style={{color:'var(--or)'}}>تُصدر نهاية الشهر</div>
      </div>
      <div className="pb-div"></div>
      <div className="pb-item pb-prog">
        <div className="pb-lbl">نسبة امتلاء المعهد</div>
        <div className="pb-val" style={{color:'var(--c)'}}>88.7%</div>
        <div className="prog-bar"><div className="prog-fill" style={{width:'88.7%'}}></div></div>
      </div>
    </div>

    {/* STATS */}
    <div className="stats-grid">
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(14,165,233,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="s-icon" style={{background:'rgba(14,165,233,.1)',border:'1px solid rgba(14,165,233,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="s-val" style={{color:'var(--c)'}}>284</div>
        <div className="s-lbl">متدرب نشط</div>
        <div className="s-sub" style={{color:'rgba(14,165,233,.7)'}}>↑ 38 هذا الشهر</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(16,185,129,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="s-icon" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <div className="s-val" style={{color:'var(--gr)'}}>18</div>
        <div className="s-lbl">برنامجاً نشطاً</div>
        <div className="s-sub" style={{color:'rgba(16,185,129,.7)'}}>5 دفعات هذا الشهر</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(212,168,67,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="s-icon" style={{background:'var(--gdd)',border:'1px solid var(--gdb)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
        </div>
        <div className="s-val" style={{color:'var(--gd)'}}>47</div>
        <div className="s-lbl">شهادة تُصدر هذا الشهر</div>
        <div className="s-sub" style={{color:'rgba(212,168,67,.7)'}}>↑ 12 عن الشهر الماضي</div>
      </div>
      <div className="stat-card">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(251,146,60,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="s-icon" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div className="s-val" style={{color:'var(--or)'}}>128,400</div>
        <div className="s-lbl">إيرادات هذا الشهر (ر.س)</div>
        <div className="s-sub" style={{color:'rgba(251,146,60,.7)'}}>↑ 22% عن الشهر السابق</div>
      </div>
    </div>

    {/* ROW 1 */}
    <div className="grid-62">
      {/* PROGRAMS TABLE */}
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            البرامج النشطة
          </div>
          <span className="card-more" onClick={() => {openModal('prog-modal')}}>+ إضافة ←</span>
        </div>
        <div className="card-body" style={{padding:'14px'}}>
          <div className="prog-mini">
            <div className="pm-ic" style={{background:'rgba(14,165,233,.12)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="pm-name">تطوير تطبيقات الويب</div>
              <div className="pm-meta">12 أسبوع · م. سارة القحطاني</div>
              <div className="pm-bar-wrap"><div className="pm-bar"><div className="pm-fill" style={{width:'88%',background:'linear-gradient(90deg,var(--c),var(--cy))'}}></div></div></div>
            </div>
            <div className="pm-seats" style={{color:'var(--rd)'}}>22/25</div>
          </div>
          <div className="prog-mini">
            <div className="pm-ic" style={{background:'rgba(167,139,250,.1)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 0 2h-1v1a2 2 0 0 1-2 2v2h-2v-2H9v2H7v-2a2 2 0 0 1-2-2v-1H4a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="pm-name">الذكاء الاصطناعي وتعلم الآلة</div>
              <div className="pm-meta">8 أسابيع · د. خالد المطيري</div>
              <div className="pm-bar-wrap"><div className="pm-bar"><div className="pm-fill" style={{width:'60%',background:'linear-gradient(90deg,var(--pu),#7C3AED)'}}></div></div></div>
            </div>
            <div className="pm-seats" style={{color:'var(--gr)'}}>12/20</div>
          </div>
          <div className="prog-mini">
            <div className="pm-ic" style={{background:'rgba(251,146,60,.1)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="pm-name">إدارة المشاريع PMP</div>
              <div className="pm-meta">6 أسابيع · م. نورة العمري</div>
              <div className="pm-bar-wrap"><div className="pm-bar"><div className="pm-fill" style={{width:'73%',background:'linear-gradient(90deg,var(--or),#C2410C)'}}></div></div></div>
            </div>
            <div className="pm-seats" style={{color:'var(--or)'}}>18/25</div>
          </div>
          <div className="prog-mini">
            <div className="pm-ic" style={{background:'rgba(239,68,68,.1)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="pm-name">الأمن السيبراني المتقدم</div>
              <div className="pm-meta">8 أسابيع · م. فيصل الشمري</div>
              <div className="pm-bar-wrap"><div className="pm-bar"><div className="pm-fill" style={{width:'80%',background:'linear-gradient(90deg,var(--rd),#B91C1C)'}}></div></div></div>
            </div>
            <div className="pm-seats" style={{color:'var(--gr)'}}>8/10</div>
          </div>
          <div className="prog-mini">
            <div className="pm-ic" style={{background:'rgba(16,185,129,.1)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div className="pm-name">المالية والمحاسبة</div>
              <div className="pm-meta">5 أسابيع · د. رنا الحربي</div>
              <div className="pm-bar-wrap"><div className="pm-bar"><div className="pm-fill" style={{width:'50%',background:'linear-gradient(90deg,var(--gr),#059669)'}}></div></div></div>
            </div>
            <div className="pm-seats" style={{color:'var(--gr)'}}>12/24</div>
          </div>
        </div>
      </div>

      {/* SIDEBAR CARDS */}
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        {/* REVENUE */}
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              ملخص الإيرادات
            </div>
            <span className="card-more">تفاصيل ←</span>
          </div>
          <div className="card-body">
            <div className="rev-row">
              <div className="rev-lbl">إيرادات اليوم</div>
              <div className="rev-val" style={{color:'var(--gr)'}}>4,200 ر.س</div>
            </div>
            <div className="rev-row">
              <div className="rev-lbl">هذا الأسبوع</div>
              <div className="rev-val">28,600 ر.س</div>
            </div>
            <div className="rev-row">
              <div className="rev-lbl">هذا الشهر</div>
              <div className="rev-val" style={{color:'var(--or)'}}>128,400 ر.س</div>
            </div>
            <div className="rev-row">
              <div className="rev-lbl">عمولة متين</div>
              <div className="rev-val" style={{color:'var(--rd)'}}>−6,420 ر.س</div>
            </div>
            <div className="rev-row" style={{borderTop:'1px solid var(--b1)',marginTop:'4px',paddingTop:'8px'}}>
              <div className="rev-lbl" style={{fontWeight:700,color:'var(--t)'}}>الصافي</div>
              <div className="rev-val" style={{color:'var(--c)',fontSize:'15px'}}>121,980 ر.س</div>
            </div>
          </div>
        </div>

        {/* TOP TRAINERS */}
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              أداء المدربين
            </div>
          </div>
          <div className="card-body">
            <div className="tr-row">
              <div className="tr-av" style={{background:'rgba(14,165,233,.12)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="tr-name">م. سارة القحطاني</div>
                <div className="tr-prog">تطوير الويب · 22 متدرب</div>
              </div>
              <div className="tr-rate">★ 4.9</div>
            </div>
            <div className="tr-row">
              <div className="tr-av" style={{background:'rgba(167,139,250,.1)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="tr-name">د. خالد المطيري</div>
                <div className="tr-prog">الذكاء الاصطناعي · 12 متدرب</div>
              </div>
              <div className="tr-rate">★ 4.8</div>
            </div>
            <div className="tr-row">
              <div className="tr-av" style={{background:'rgba(251,146,60,.1)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div className="tr-name">م. نورة العمري</div>
                <div className="tr-prog">إدارة المشاريع · 18 متدرب</div>
              </div>
              <div className="tr-rate">★ 4.9</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ROW 2: TRAINEES TABLE + CERTS */}
    <div className="grid-62">
      <div className="card">
        <div className="card-hdr">
          <div className="card-title">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            المتدربون النشطون
          </div>
          <span className="card-more">عرض الكل ←</span>
        </div>
        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>المتدرب</th>
                <th>البرنامج</th>
                <th>الحضور</th>
                <th>الدرجة</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="tbl-name">محمد الشهري</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>1443xxxx</div></td>
                <td>تطوير الويب</td>
                <td style={{color:'var(--gr)'}}>92%</td>
                <td style={{color:'var(--c)',fontWeight:700}}>88%</td>
                <td><span className="badge b-g">نشط</span></td>
              </tr>
              <tr>
                <td><div className="tbl-name">سارة العتيبي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>1443xxxx</div></td>
                <td>الذكاء الاصطناعي</td>
                <td style={{color:'var(--gr)'}}>100%</td>
                <td style={{color:'var(--gd)',fontWeight:700}}>94%</td>
                <td><span className="badge b-g">متفوقة</span></td>
              </tr>
              <tr>
                <td><div className="tbl-name">عبدالله القرني</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>1443xxxx</div></td>
                <td>إدارة المشاريع</td>
                <td style={{color:'var(--or)'}}>68%</td>
                <td style={{color:'var(--or)',fontWeight:700}}>72%</td>
                <td><span className="badge b-y">تحذير</span></td>
              </tr>
              <tr>
                <td><div className="tbl-name">نورة الحربي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>1443xxxx</div></td>
                <td>الأمن السيبراني</td>
                <td style={{color:'var(--gr)'}}>88%</td>
                <td style={{color:'var(--c)',fontWeight:700}}>81%</td>
                <td><span className="badge b-g">نشطة</span></td>
              </tr>
              <tr>
                <td><div className="tbl-name">فهد المطيري</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>1443xxxx</div></td>
                <td>تطوير الويب</td>
                <td style={{color:'var(--rd)'}}>45%</td>
                <td style={{color:'var(--rd)',fontWeight:700}}>58%</td>
                <td><span className="badge b-r">خطر رسوب</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CERTIFICATES + SETTINGS */}
      <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
              الشهادات هذا الشهر
            </div>
            <span className="card-more" onClick={() => {openModal('cert-modal')}}>إصدار ←</span>
          </div>
          <div className="card-body">
            <div className="cert-row">
              <div className="cert-ic" style={{background:'rgba(14,165,233,.12)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
              </div>
              <div className="cert-name">تطوير تطبيقات الويب</div>
              <div className="cert-count">18 شهادة</div>
            </div>
            <div className="cert-row">
              <div className="cert-ic" style={{background:'rgba(167,139,250,.1)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7"/></svg>
              </div>
              <div className="cert-name">الذكاء الاصطناعي</div>
              <div className="cert-count">11 شهادة</div>
            </div>
            <div className="cert-row">
              <div className="cert-ic" style={{background:'rgba(251,146,60,.1)'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
              </div>
              <div className="cert-name">إدارة المشاريع PMP</div>
              <div className="cert-count">18 شهادة</div>
            </div>
          </div>
        </div>

        {/* QUICK SETTINGS */}
        <div className="card">
          <div className="card-hdr">
            <div className="card-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
              إعدادات سريعة
            </div>
          </div>
          <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>فتح التسجيل للعامة</div>
                <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>صفحة المعهد العامة</div>
              </div>
              <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الملتقى المجتمعي</div>
                <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>للمتدربين الحاليين</div>
              </div>
              <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>قائمة الانتظار</div>
                <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>عند امتلاء المقاعد</div>
              </div>
              <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الدفع بالأقساط</div>
                <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>تقسيط حتى 6 أشهر</div>
              </div>
              <label className="tog"><input type="checkbox" /><span className="tsl"></span></label>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>
    </div>
  );
}