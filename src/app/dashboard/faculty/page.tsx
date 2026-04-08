'use client';
import React, { useState } from 'react';
import '../../styles/uni-faculty.css';

export default function FacultyPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="ov" id="ov" onClick={() => {closeSb()}}></div>

{/* MODAL: إعدادات المحاضرة الأونلاين */}
<div className="modal-bg" id="lec-modal">
  <div className="modal">
    <div className="modal-h">
      <div className="modal-t">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        إعدادات المحاضرة الأونلاين
      </div>
      <button className="modal-x" onClick={() => {closeModal('lec-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{background:'var(--cd)',border:'1px solid var(--cb)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px',fontSize:'12px',color:'var(--td)'}}>
        <strong style={{color:'var(--c)'}}>قواعد البيانات CS402</strong> — شعبة ب · مدرج B2 + أونلاين
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>ضوابط الحضور الأونلاين</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'14px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid var(--b2)'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>إجبار تشغيل الكاميرا</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>لا يُسمح بالحضور بدون كاميرا مفتوحة</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid var(--b2)'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>مراقبة الذكاء الاصطناعي</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>رصد الغياب والانشغال تلقائياً</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid var(--b2)'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>منع مغادرة نافذة المحاضرة</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>تحذير فوري عند الخروج من الشاشة</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل المحاضرة تلقائياً</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>تُحفظ في قسم المحاضرات المسجّلة</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>ضوابط الاختبار الأونلاين</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'16px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid var(--b2)'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>مراقبة الاختبار بالذكاء الاصطناعي</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>رصد الغش وتنبيه فوري</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid var(--b2)'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>إجبار الكاميرا أثناء الاختبار</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>لا يبدأ الاختبار بدون كاميرا</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px'}}>
          <div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>منع تبديل التطبيقات</div><div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'1px'}}>يُسجَّل كمحاولة غش</div></div>
          <label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label>
        </div>
      </div>

      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('lec-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {saveModal('lec-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'11px',color:'#06060E',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>بدء المحاضرة الآن ←</button>
      </div>
    </div>
  </div>
</div>

{/* MODAL: رفع إجازة */}
<div className="modal-bg" id="leave-modal">
  <div className="modal">
    <div className="modal-h">
      <div className="modal-t">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
        رفع طلب إجازة
      </div>
      <button className="modal-x" onClick={() => {closeModal('leave-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{marginBottom:'12px'}}>
        <label style={{fontSize:'11.5px',color:'var(--tm)',fontWeight:600,display:'block',marginBottom:'6px'}}>نوع الإجازة</label>
        <select style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',color:'var(--t)',fontSize:'13px',padding:'10px 12px',borderRadius:'8px',fontFamily:'var(--f)',outline:'none'}}>
          <option>إجازة اعتيادية</option>
          <option>إجازة مرضية</option>
          <option>إجازة طارئة</option>
          <option>مهمة رسمية</option>
          <option>مؤتمر علمي</option>
        </select>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'12px'}}>
        <div>
          <label style={{fontSize:'11.5px',color:'var(--tm)',fontWeight:600,display:'block',marginBottom:'6px'}}>تاريخ البداية</label>
          <input type="date" style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',color:'var(--t)',fontSize:'13px',padding:'10px 12px',borderRadius:'8px',fontFamily:'var(--f)',outline:'none'}} />
        </div>
        <div>
          <label style={{fontSize:'11.5px',color:'var(--tm)',fontWeight:600,display:'block',marginBottom:'6px'}}>تاريخ النهاية</label>
          <input type="date" style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',color:'var(--t)',fontSize:'13px',padding:'10px 12px',borderRadius:'8px',fontFamily:'var(--f)',outline:'none'}} />
        </div>
      </div>
      <div style={{marginBottom:'12px'}}>
        <label style={{fontSize:'11.5px',color:'var(--tm)',fontWeight:600,display:'block',marginBottom:'6px'}}>المحاضرات المتأثرة — من سيحل محلك؟</label>
        <select style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',color:'var(--t)',fontSize:'13px',padding:'10px 12px',borderRadius:'8px',fontFamily:'var(--f)',outline:'none'}}>
          <option>اختر بديلاً...</option>
          <option>د. سارة الزهراني</option>
          <option>خالد المطيري (معيد)</option>
          <option>تأجيل المحاضرة</option>
        </select>
      </div>
      <div style={{marginBottom:'16px'}}>
        <label style={{fontSize:'11.5px',color:'var(--tm)',fontWeight:600,display:'block',marginBottom:'6px'}}>السبب / الملاحظات</label>
        <textarea style={{width:'100%',background:'rgba(255,255,255,.04)',border:'1px solid var(--b1)',color:'var(--t)',fontSize:'13px',padding:'10px 12px',borderRadius:'8px',fontFamily:'var(--f)',outline:'none',resize:'vertical',minHeight:'70px'}} placeholder="اكتب سبب الإجازة..."></textarea>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('leave-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {saveModal('leave-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--gd),var(--gd2))',border:'none',borderRadius:'9px',padding:'11px',color:'#06060E',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إرسال الطلب</button>
      </div>
    </div>
  </div>
</div>

{/* SIDEBAR */}
<aside className="sb" id="sb">
  <div className="sb-top">
    <a className="logo-row" href="#">
      <div className="logo-ic">م</div>
      <div><div className="logo-t">متين</div><div className="logo-s">نظام إدارة التعليم</div></div>
    </a>
    <div className="doc-card">
      <div className="doc-av">👨‍🏫</div>
      <div style={{minWidth:0}}>
        <div className="doc-n">د. محمد العتيبي</div>
        <div className="doc-r">أستاذ مساعد</div>
        <div className="doc-d">هندسة الحاسب · كلية الهندسة</div>
      </div>
    </div>
  </div>

  <nav className="nav">
    <div className="ng">الرئيسية</div>
    <a className="ni on" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      لوحتي <span className="dot"></span>
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>
      الجدول الأسبوعي
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      ملفي الأكاديمي
    </a>
    <a className="ni" href="#" onClick={() => {openModal('leave-modal')}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      <span style={{color:'var(--gd)',fontWeight:600}}>رفع طلب إجازة</span>
    </a>

    <div className="ng">المقررات الدراسية</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      مقرراتي هذا الفصل
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      المحتوى التعليمي
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>
      التكاليف <span className="nb nb-c">2</span>
    </a>

    <div className="ng">المحاضرات</div>
    <a className="ni" href="#" onClick={() => {openModal('lec-modal')}}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
      محاضرة أونلاين مباشرة
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v12H3z"/><path d="M8 21h8M12 17v4"/></svg>
      محاضرة حضورية
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      المحاضرات المسجّلة
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
      القاعات والمدرجات
    </a>

    <div className="ng">الحضور والغياب</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      رصد الحضور
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
      الأعذار الطبية — صحتي <span className="nb nb-c">3</span>
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      إحصائيات الحضور
    </a>

    <div className="ng">الاختبارات والتقييم</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
      اختبار أونلاين
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      امتحان حضوري
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      بنك الأسئلة
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      جدول الامتحانات
    </a>

    <div className="ng">الطلاب والأداء</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      الطلاب المسجّلون
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      رصد الدرجات
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      تقرير الأداء الأكاديمي
    </a>

    <div className="ng">التواصل</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      المراسلات <span className="nb nb-r">5</span>
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      تنبيهات جماعية
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
      ملاحظات للطلاب <span className="nb nb-r">3</span>
    </a>

    <div className="ng">البحث العلمي</div>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>
      الأوراق البحثية المنشورة
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
      الإشراف على رسائل الماجستير
    </a>
    <a className="ni" href="#">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
      ساعات الإرشاد الأكاديمي
    </a>
  </nav>

  <div className="sb-ft">
    <button className="lo-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      تسجيل الخروج
    </button>
    <div style={{marginTop:'7px',color:'rgba(238,238,245,.14)',fontSize:'10px',textAlign:'center'}}>متين v6 — كلية الهندسة والتقنية</div>
  </div>
</aside>

{/* MAIN */}
<div className="main">
  <header className="hdr">
    <div className="hl">
      <button className="mb" onClick={() => {toggleSb()}}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
      <div><div className="ht">لوحتي الأكاديمية</div><div className="hs">الأحد 27 مارس — الفصل الثاني 1445/1446</div></div>
    </div>
    <div className="hr">
      <div className="sb-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="si" placeholder="بحث عن طالب أو مقرر..." />
      </div>
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="nd"></span></div>
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span className="nd"></span></div>
      <div className="ub">
        <div className="ua">👨‍🏫</div>
        <div className="ui"><div className="un">د. محمد العتيبي</div><div className="ur">أستاذ مساعد</div></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </header>

  <div className="con">

    {/* PAGE HDR */}
    <div className="ph">
      <div>
        <div className="pt">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
          مرحباً د. محمد 👋
        </div>
        <div className="ps">3 محاضرات اليوم — المحاضرة الثانية جارية الآن في مدرج B2 · 3 أعذار طبية جديدة عبر صحتي</div>
      </div>
      <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
        <button className="btn-p" onClick={() => {openModal('lec-modal')}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          بدء محاضرة مباشرة
        </button>
        <button className="btn-o" onClick={() => {openModal('leave-modal')}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
          رفع إجازة
        </button>
      </div>
    </div>

    {/* محاضرات اليوم */}
    <div className="lbar">
      <div className="lbar-lbl">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        محاضرات اليوم
      </div>
      <div className="lecs">
        <div className="lec done">
          <div className="lt">8:00 — 9:30</div>
          <div className="ln">هندسة البرمجيات</div>
          <div className="lc">CS301 · شعبة أ</div>
          <div className="lv" style={{color:'var(--bl)'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            مدرج A1 · حضوري
          </div>
          <div className="lty" style={{color:'var(--tm)'}}>منتهية</div>
        </div>
        <div className="lec now">
          <span className="lbg now-b">● الآن</span>
          <div className="lt">10:00 — 11:30</div>
          <div className="ln" style={{color:'var(--c)'}}>قواعد البيانات</div>
          <div className="lc">CS402 · شعبة ب</div>
          <div className="lv" style={{color:'var(--c)'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            مدرج B2 + أونلاين
          </div>
          <div className="lty" style={{color:'var(--c)'}}>هجين · كاميرا إجبارية · AI</div>
        </div>
        <div className="lec free">
          <span className="lbg free-b">فراغ</span>
          <div className="lt">12:00 — 1:00</div>
          <div className="ln" style={{color:'var(--tm)'}}>استراحة</div>
          <div className="lv" style={{color:'var(--gd)'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            مكتب 4-208 · إرشاد
          </div>
        </div>
        <div className="lec next">
          <div className="lt">1:30 — 3:00</div>
          <div className="ln">الذكاء الاصطناعي</div>
          <div className="lc">CS501 · طلاب ماجستير</div>
          <div className="lv" style={{color:'var(--pu)'}}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            قاعة 302 + تسجيل
          </div>
          <div className="lty" style={{color:'var(--pu)'}}>حضوري + مسجّل تلقائياً</div>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="sg">
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(34,211,238,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si2" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="sv" style={{color:'var(--c)'}}>248</div>
        <div className="sl">إجمالي الطلاب المسجّلين</div>
        <div className="ss" style={{color:'rgba(34,211,238,.6)'}}>3 مقررات · 5 شعب</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(16,185,129,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si2" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
        </div>
        <div className="sv" style={{color:'var(--gr)'}}>87%</div>
        <div className="sl">نسبة الحضور الكلية</div>
        <div className="ss" style={{color:'rgba(16,185,129,.6)'}}>هذا الفصل الدراسي</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(251,146,60,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si2" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
        </div>
        <div className="sv" style={{color:'var(--or)'}}>2</div>
        <div className="sl">تكاليف للتصحيح</div>
        <div className="ss" style={{color:'rgba(251,146,60,.6)'}}>بانتظار رصد الدرجات</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(167,139,250,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si2" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </div>
        <div className="sv" style={{color:'var(--pu)'}}>2.8</div>
        <div className="sl">متوسط GPA طلابي</div>
        <div className="ss" style={{color:'rgba(167,139,250,.6)'}}>آخر اختبار نصفي</div>
      </div>
    </div>

    {/* ROW: حضور + أعذار */}
    <div className="g2">

      {/* رصد حضور المحاضرة الحالية */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
            رصد الحضور — CS402 قواعد البيانات · مدرج B2
            <span className="cc">52 طالباً</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span style={{fontSize:'11px',color:'var(--c)',fontWeight:700}}>حضر: 48</span>
            <span style={{fontSize:'11px',color:'var(--rd)',fontWeight:700}}>غاب: 4</span>
            <button className="btn-p" style={{padding:'5px 12px',fontSize:'11px'}}>حفظ</button>
          </div>
        </div>
        {/* AI Notice */}
        <div style={{background:'rgba(34,211,238,.05)',borderBottom:'1px solid var(--b2)',padding:'7px 14px',fontSize:'10.5px',color:'rgba(238,238,245,.5)',display:'flex',alignItems:'center',gap:'7px'}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          مراقبة الذكاء الاصطناعي مفعّلة · الكاميرا إجبارية · لا يمكن مغادرة النافذة
        </div>
        <div style={{maxHeight:'220px',overflowY:'auto'}}>
          <div className="ar">
            <div className="an">1</div>
            <div className="aid">441001234</div>
            <div className="aname">أحمد محمد الزهراني</div>
            <div className="abtns">
              <button className="abtn ap sel" onClick={() => {setA(this,'p')}}>حضر</button>
              <button className="abtn aa" onClick={() => {setA(this,'a')}}>غاب</button>
            </div>
          </div>
          <div className="ar">
            <div className="an">2</div>
            <div className="aid">441001235</div>
            <div className="aname">سارة عبدالله العتيبي</div>
            <div className="abtns">
              <button className="abtn ap sel" onClick={() => {setA(this,'p')}}>حضر</button>
              <button className="abtn aa" onClick={() => {setA(this,'a')}}>غاب</button>
            </div>
          </div>
          <div className="ar" style={{background:'rgba(239,68,68,.04)'}}>
            <div className="an">3</div>
            <div className="aid">441001236</div>
            <div className="aname">
              خالد فهد الشمري
              <span style={{fontSize:'9px',background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)',padding:'1px 6px',borderRadius:'5px',fontWeight:700,marginRight:'4px'}}>عذر صحتي</span>
            </div>
            <div className="abtns">
              <button className="abtn ap" onClick={() => {setA(this,'p')}} disabled style={{opacity:'.4',cursor:'not-allowed'}}>حضر</button>
              <button className="abtn aa sel" style={{opacity:'.7',cursor:'not-allowed'}} disabled>غاب</button>
            </div>
          </div>
          <div className="ar">
            <div className="an">4</div>
            <div className="aid">441001237</div>
            <div className="aname">نورة سعد الحربي</div>
            <div className="abtns">
              <button className="abtn ap sel" onClick={() => {setA(this,'p')}}>حضر</button>
              <button className="abtn aa" onClick={() => {setA(this,'a')}}>غاب</button>
            </div>
          </div>
          <div className="ar">
            <div className="an">5</div>
            <div className="aid">441001238</div>
            <div className="aname">عمر علي القحطاني</div>
            <div className="abtns">
              <button className="abtn ap sel" onClick={() => {setA(this,'p')}}>حضر</button>
              <button className="abtn aa" onClick={() => {setA(this,'a')}}>غاب</button>
            </div>
          </div>
          <div className="ar" style={{background:'rgba(239,68,68,.04)'}}>
            <div className="an">6</div>
            <div className="aid">441001239</div>
            <div className="aname">
              ريم محمد المطيري
              <span style={{fontSize:'9px',background:'rgba(16,185,129,.1)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)',padding:'1px 6px',borderRadius:'5px',fontWeight:700,marginRight:'4px'}}>عذر صحتي</span>
            </div>
            <div className="abtns">
              <button className="abtn ap" onClick={() => {setA(this,'p')}} disabled style={{opacity:'.4',cursor:'not-allowed'}}>حضر</button>
              <button className="abtn aa sel" style={{opacity:'.7',cursor:'not-allowed'}} disabled>غاب</button>
            </div>
          </div>
          <div className="ar">
            <div className="an">7</div>
            <div className="aid">441001240</div>
            <div className="aname">فيصل عبدالرحمن النمر</div>
            <div className="abtns">
              <button className="abtn ap sel" onClick={() => {setA(this,'p')}}>حضر</button>
              <button className="abtn aa" onClick={() => {setA(this,'a')}}>غاب</button>
            </div>
          </div>
          <div style={{padding:'10px 12px',textAlign:'center',fontSize:'11px',color:'var(--tm)'}}>+ 45 طالباً آخر</div>
        </div>
      </div>

      {/* الأعذار الطبية */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        <div className="card" style={{marginBottom:0}}>
          <div className="ch">
            <div className="ct">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gr)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              الأعذار الطبية
              <span style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)',color:'var(--gr)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px'}}>3</span>
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'4px',background:'rgba(255,255,255,.04)',border:'1px solid var(--b2)',color:'var(--tm)',fontSize:'9.5px',fontWeight:600,padding:'3px 8px',borderRadius:'7px'}}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              للاطلاع فقط
            </div>
          </div>
          <div className="info-box" style={{background:'rgba(16,185,129,.05)',borderBottom:'1px solid var(--b2)'}}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            يصل مباشرة من <strong style={{color:'var(--gr)'}}>صحتي</strong> — مقبول تلقائياً ولا يُعدَّل
          </div>
          {/* عذر مقبول */}
          <div className="ex">
            <div className="ex-ic" style={{background:'rgba(16,185,129,.1)'}}>🏥</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>خالد الشمري · 441001236</div>
              <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'2px'}}>CS402 · اليوم · مراجعة طوارئ</div>
              <div style={{fontSize:'10px',color:'var(--gr)',fontWeight:700,marginTop:'3px',display:'flex',alignItems:'center',gap:'3px'}}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                صحتي — مستشفى الملك فهد
              </div>
            </div>
            <span className="badge bg">مقبول تلقائياً</span>
          </div>
          <div className="ex">
            <div className="ex-ic" style={{background:'rgba(16,185,129,.1)'}}>💊</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>ريم المطيري · 441001239</div>
              <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'2px'}}>CS402 · اليوم · إجازة مرضية</div>
              <div style={{fontSize:'10px',color:'var(--gr)',fontWeight:700,marginTop:'3px',display:'flex',alignItems:'center',gap:'3px'}}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                صحتي — عيادة جامعة الرياض
              </div>
            </div>
            <span className="badge bg">مقبول تلقائياً</span>
          </div>
          <div className="ex" style={{borderBottom:'none'}}>
            <div className="ex-ic" style={{background:'rgba(96,165,250,.1)'}}>🏥</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>أحمد النمر · 441001240</div>
              <div style={{fontSize:'10.5px',color:'var(--tm)',marginTop:'2px'}}>CS301 · أمس · مراجعة عيادة</div>
              <div style={{fontSize:'10px',color:'var(--bl)',fontWeight:700,marginTop:'3px',display:'flex',alignItems:'center',gap:'3px'}}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                صحتي — محفوظ في السجل
              </div>
            </div>
            <span className="badge bb">محفوظ</span>
          </div>
        </div>
      </div>
    </div>

    {/* ROW: اختبارات + درجات + رسائل */}
    <div className="g3">

      {/* الاختبارات */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>
            الاختبارات والامتحانات
          </div>
          <button className="cl">+ إنشاء</button>
        </div>
        {/* Type tabs */}
        <div style={{display:'flex',gap:'4px',padding:'7px 12px',borderBottom:'1px solid var(--b2)',overflowX:'auto'}}>
          <button onClick={() => {switchT(this)}} style={{background:'var(--cd)',border:'1px solid var(--cb)',color:'var(--c)',borderRadius:'6px',padding:'3px 10px',fontSize:'10.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)',whiteSpace:'nowrap'}}>الكل</button>
          <button onClick={() => {switchT(this)}} style={{background:'transparent',border:'1px solid transparent',color:'var(--tm)',borderRadius:'6px',padding:'3px 10px',fontSize:'10.5px',cursor:'pointer',fontFamily:'var(--f)',whiteSpace:'nowrap'}}>أونلاين</button>
          <button onClick={() => {switchT(this)}} style={{background:'transparent',border:'1px solid transparent',color:'var(--tm)',borderRadius:'6px',padding:'3px 10px',fontSize:'10.5px',cursor:'pointer',fontFamily:'var(--f)',whiteSpace:'nowrap'}}>حضوري</button>
          <button onClick={() => {switchT(this)}} style={{background:'transparent',border:'1px solid transparent',color:'var(--tm)',borderRadius:'6px',padding:'3px 10px',fontSize:'10.5px',cursor:'pointer',fontFamily:'var(--f)',whiteSpace:'nowrap'}}>بنك الأسئلة</button>
        </div>
        {/* Exam 1 */}
        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 13px',borderBottom:'1px solid var(--b2)'}}>
          <div style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)',borderRadius:'8px',padding:'5px 8px',textAlign:'center',flexShrink:0,minWidth:'38px'}}>
            <div style={{fontSize:'15px',fontWeight:800,color:'var(--c)',lineHeight:1}}>29</div>
            <div style={{fontSize:'8px',color:'var(--tm)',fontWeight:600}}>مارس</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>اختبار قواعد البيانات — نصفي</div>
            <div style={{fontSize:'10.5px',color:'var(--tm)'}}>CS402 · أونلاين · 60 دقيقة · 40 درجة</div>
            <div style={{fontSize:'10px',color:'var(--c)',marginTop:'2px',fontWeight:600}}>مراقبة AI · كاميرا إجبارية</div>
          </div>
          <span className="badge bc">غداً</span>
        </div>
        {/* Exam 2 */}
        <div style={{display:'flex',alignItems:'center',gap:'10px',padding:'9px 13px',borderBottom:'1px solid var(--b2)'}}>
          <div style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)',borderRadius:'8px',padding:'5px 8px',textAlign:'center',flexShrink:0,minWidth:'38px'}}>
            <div style={{fontSize:'15px',fontWeight:800,color:'var(--pu)',lineHeight:1}}>05</div>
            <div style={{fontSize:'8px',color:'var(--tm)',fontWeight:600}}>أبريل</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>امتحان هندسة البرمجيات</div>
            <div style={{fontSize:'10.5px',color:'var(--tm)'}}>CS301 · حضوري · مدرج A1 · 90 دقيقة</div>
            <div style={{fontSize:'10px',color:'var(--pu)',marginTop:'2px',fontWeight:600}}>مراقبة تقليدية · ورقي</div>
          </div>
          <span className="badge bp">8 أيام</span>
        </div>
        <div style={{padding:'10px 13px'}}>
          <button className="btn-p" style={{width:'100%',justifyContent:'center',fontSize:'11.5px',padding:'8px'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إنشاء اختبار جديد
          </button>
        </div>
      </div>

      {/* رصد الدرجات */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            رصد الدرجات — CS402
          </div>
          <button className="cl" style={{color:'var(--pu)'}}>الكل</button>
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>الطالب</th><th>الرقم الجامعي</th><th>الدرجة</th><th>التقدير</th></tr></thead>
            <tbody>
              <tr><td style={{fontWeight:600,color:'var(--t)'}}>أحمد الزهراني</td><td style={{color:'var(--tm)',fontSize:'10.5px'}}>441001234</td><td style={{color:'var(--c)',fontWeight:700}}>38/40</td><td><span className="badge bg">A+</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--t)'}}>سارة العتيبي</td><td style={{color:'var(--tm)',fontSize:'10.5px'}}>441001235</td><td style={{color:'var(--c)',fontWeight:700}}>35/40</td><td><span className="badge bb">A</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--t)'}}>نورة الحربي</td><td style={{color:'var(--tm)',fontSize:'10.5px'}}>441001237</td><td style={{color:'var(--c)',fontWeight:700}}>36/40</td><td><span className="badge bg">A</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--t)'}}>عمر القحطاني</td><td style={{color:'var(--tm)',fontSize:'10.5px'}}>441001238</td><td style={{color:'var(--or)',fontWeight:700}}>24/40</td><td><span className="badge bo">C+</span></td></tr>
              <tr><td style={{fontWeight:600,color:'var(--t)'}}>فيصل النمر</td><td style={{color:'var(--tm)',fontSize:'10.5px'}}>441001240</td><td style={{color:'var(--rd)',fontWeight:700}}>14/40</td><td><span className="badge br">F</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* رسائل الطلاب */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bl)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            رسائل الطلاب
            <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px'}}>5</span>
          </div>
          <button className="cl" style={{color:'var(--bl)'}}>الكل</button>
        </div>
        <div>
          <div className="msg">
            <div className="munread"></div>
            <div className="mv" style={{background:'rgba(251,146,60,.1)',color:'var(--or)'}}>أ</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>أحمد الزهراني</div>
              <div style={{fontSize:'11px',color:'var(--tm)',marginTop:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>دكتور، هل موعد الاختبار غداً؟</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)',whiteSpace:'nowrap'}}>8د</div>
          </div>
          <div className="msg">
            <div className="munread"></div>
            <div className="mv" style={{background:'rgba(167,139,250,.1)',color:'var(--pu)'}}>س</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>سارة العتيبي</div>
              <div style={{fontSize:'11px',color:'var(--tm)',marginTop:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>استفسار عن موضوع المشروع الأخير</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)',whiteSpace:'nowrap'}}>22د</div>
          </div>
          <div className="msg">
            <div style={{width:'7px',flexShrink:0}}></div>
            <div className="mv" style={{background:'rgba(96,165,250,.1)',color:'var(--bl)'}}>ع</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>عمر القحطاني</div>
              <div style={{fontSize:'11px',color:'var(--tm)',marginTop:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>طلب مراجعة درجة التكليف</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)',whiteSpace:'nowrap'}}>1س</div>
          </div>
          <div className="msg" style={{borderBottom:'none'}}>
            <div style={{width:'7px',flexShrink:0}}></div>
            <div className="mv" style={{background:'rgba(16,185,129,.1)',color:'var(--gr)'}}>ن</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>نورة الحربي</div>
              <div style={{fontSize:'11px',color:'var(--tm)',marginTop:'1px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>شكراً على المحاضرة المسجّلة</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)',whiteSpace:'nowrap'}}>3س</div>
          </div>
        </div>
        <div style={{padding:'10px 13px',borderTop:'1px solid var(--b2)'}}>
          <button style={{width:'100%',background:'rgba(96,165,250,.06)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'8px',padding:'8px',color:'var(--bl)',fontSize:'11.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>
            إرسال تنبيه جماعي للطلاب
          </button>
        </div>
      </div>
    </div>

    {/* QUICK ACTIONS */}
    <div style={{marginBottom:'6px'}}>
      <div style={{color:'var(--tm)',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>إجراءات سريعة</div>
      <div className="qg">
        <a className="qi" href="#" onClick={() => {openModal('lec-modal')}}><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div><span className="ql">محاضرة أونلاين</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v12H3z"/><path d="M8 21h8M12 17v4"/></svg></div><span className="ql">محاضرة حضورية</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div><span className="ql">تسجيل محاضرة</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div><span className="ql">اختبار أونلاين</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div><span className="ql">امتحان حضوري</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><span className="ql">بنك الأسئلة</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg></div><span className="ql">تكليف جديد</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div><span className="ql">رصد الدرجات</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><span className="ql">رفع محتوى</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg></div><span className="ql">رصد الحضور</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><span className="ql">تقرير الأداء</span></a>
        <a className="qi" href="#" onClick={() => {openModal('leave-modal')}}><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)'}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div><span className="ql" style={{color:'var(--gd)'}}>رفع إجازة</span></a>
      </div>
    </div>

  </div>

  <footer className="ft">
    <p>© 2026 متين — كلية الهندسة والتقنية · جامعة الرياض الأهلية</p>
    <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
  </footer>
</div>
    </div>
  );
}