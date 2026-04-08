'use client';
import React, { useState } from 'react';
import '../../../styles/uni-admin.css';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('home');
  return (
    <div className="page">
<div className="ov" id="ov" onClick={() => {closeSb()}}></div>

{/* PERMISSIONS MODAL */}
<div className="modal-bg" id="perm-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">🔐 صلاحيات <span id="perm-name">موظف</span></div>
      <button className="mx" onClick={() => {closeModal('perm-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px',fontSize:'12px',color:'var(--td)'}}>
        <strong style={{color:'var(--gr)'}}>الموارد البشرية</strong> — لديها صلاحية إعطاء وسحب الوصول لجميع موظفي الخدمات والإداريين
      </div>
      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>وصول النظام</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الدخول لنظام متين</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>حساب في النظام وكلمة مرور</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تطبيق الجوال</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الوصول من الهاتف</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
      </div>
      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>صلاحيات الحضور</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل حضوره بنفسه</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>عبر الجوال أو البصمة</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>طلب إجازة عبر النظام</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>إجازة اعتيادية أو طارئة</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>عرض كشف الراتب</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>قسيمة الراتب الشهرية</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
      </div>
      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>صلاحيات إضافية (حسب الدور)</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'14px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>عرض خريطة المبنى</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>لحراس الأمن والفراشين</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تقارير العمل اليومي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>رفع تقرير إنجاز يومي</div></div><label className="tog"><input type="checkbox" /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>إرسال رسائل داخلية</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>مراسلة المشرف المباشر</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الوصول لملف الطلاب</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>محظور على خدمات الأمن والنظافة</div></div><label className="tog"><input type="checkbox" /><span className="tsl"></span></label></div>
      </div>
      <div style={{background:'rgba(239,68,68,.06)',border:'1px solid rgba(239,68,68,.2)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px',fontSize:'12px',color:'var(--td)'}}>
        <strong style={{color:'var(--rd)'}}>تجميد الحساب</strong> — عند إنهاء الخدمة، يُجمَّد الحساب فوراً ويُحذف خلال 30 يوم
        <div style={{marginTop:'8px',display:'flex',gap:'8px'}}>
          <button onClick={() => {freezeAccount()}} style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'7px',padding:'6px 14px',color:'var(--rd)',fontSize:'11.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>🔒 تجميد الحساب</button>
          <button onClick={() => {deleteAccount()}} style={{background:'rgba(239,68,68,.15)',border:'1px solid rgba(239,68,68,.4)',borderRadius:'7px',padding:'6px 14px',color:'var(--rd)',fontSize:'11.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>🗑️ حذف نهائي</button>
        </div>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('perm-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {savePerms()}} style={{flex:2,background:'linear-gradient(135deg,var(--ac),#059669)',border:'none',borderRadius:'9px',padding:'11px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>حفظ الصلاحيات ✓</button>
      </div>
    </div>
  </div>
</div>

{/* ADD EMPLOYEE MODAL */}
<div className="modal-bg" id="add-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">➕ إضافة موظف جديد</div>
      <button className="mx" onClick={() => {closeModal('add-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
        <div><label className="flbl">الاسم الكامل</label><input className="finp" type="text" placeholder="الاسم الكامل" style={{marginBottom:0}} /></div>
        <div><label className="flbl">رقم الهوية الوطنية</label><input className="finp" type="text" placeholder="10XXXXXXXX" style={{marginBottom:0}} /></div>
      </div>
      <div style={{height:'10px'}}></div>
      <label className="flbl">المسمى الوظيفي</label>
      <select className="finp">
        <option>-- اختر الوظيفة --</option>
        <optgroup label="خدمات الأمن">
          <option>حارس أمن</option>
          <option>مشرف أمن</option>
        </optgroup>
        <optgroup label="خدمات النظافة">
          <option>فراش / عامل نظافة</option>
          <option>مشرف نظافة</option>
        </optgroup>
        <optgroup label="خدمات النقل">
          <option>سائق</option>
          <option>مشرف نقل</option>
        </optgroup>
        <optgroup label="الإداريون">
          <option>موظف إداري</option>
          <option>سكرتير/ة</option>
          <option>موظف استقبال</option>
        </optgroup>
        <optgroup label="هيئة التدريس (للتسجيل فقط)">
          <option>دكتور / أستاذ</option>
          <option>معيد / محاضر</option>
        </optgroup>
      </select>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
        <div><label className="flbl">القسم / الإدارة</label><select className="finp" style={{marginBottom:0}}><option>الأمن والسلامة</option><option>خدمات النظافة</option><option>النقل الجامعي</option><option>الإدارة العامة</option><option>هيئة التدريس</option></select></div>
        <div><label className="flbl">الراتب الأساسي (SAR)</label><input className="finp" type="number" placeholder="0.00" style={{marginBottom:0}} /></div>
      </div>
      <div style={{height:'10px'}}></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
        <div><label className="flbl">تاريخ بداية العقد</label><input className="finp" type="date" style={{marginBottom:0}} /></div>
        <div><label className="flbl">تاريخ نهاية العقد</label><input className="finp" type="date" style={{marginBottom:0}} /></div>
      </div>
      <div style={{background:'rgba(16,185,129,.06)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px',fontSize:'12px',color:'var(--td)'}}>
        ✅ سيتم إنشاء حساب تلقائياً في النظام وإرسال بيانات الدخول للموظف عبر رسالة نصية
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('add-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('تم إضافة الموظف وإنشاء حسابه في النظام ✓','var(--gr)');closeModal('add-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--ac),#059669)',border:'none',borderRadius:'9px',padding:'11px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إضافة وإنشاء حساب ←</button>
      </div>
    </div>
  </div>
</div>

{/* SIDEBAR */}
<aside className="sb" id="sb">
  <div className="sb-top">
    <a className="logo-r" href="#"><div className="li">م</div><div><div className="lt">متين</div><div className="ls">نظام إدارة التعليم</div></div></a>
    <div className="emp-card" id="emp-card">
      <div className="emp-av" id="emp-av">👩‍💼</div>
      <div style={{minWidth:0}}>
        <div className="emp-n" id="emp-name">سارة المطيري</div>
        <div className="emp-r" id="emp-role" style={{color:'var(--ac)'}}>مديرة الموارد البشرية</div>
        <div className="emp-d">الموارد البشرية</div>
      </div>
    </div>
  </div>
  <nav className="nav" id="sidebar-nav"></nav>
  <div className="sb-ft">
    <button className="lo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>تسجيل الخروج</button>
    <div style={{marginTop:'6px',color:'rgba(238,238,245,.14)',fontSize:'10px',textAlign:'center'}} id="sb-ver">متين v6 — الموارد البشرية</div>
  </div>
</aside>

{/* MAIN */}
<div className="main">
  <header className="hdr">
    <div className="hl">
      <button className="mb" onClick={() => {toggleSb()}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
      <div><div className="ht" id="hdr-title">لوحة الموارد البشرية</div><div className="hs">جامعة الرياض الأهلية — الفصل الثاني 1445/1446</div></div>
    </div>
    <div className="hr2">
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="nd"></span></div>
      <div className="ub">
        <div className="ua">👩‍💼</div>
        <div className="ui"><div className="un" id="hdr-name">سارة المطيري</div><div className="ur" id="hdr-role" style={{color:'var(--ac)'}}>الموارد البشرية</div></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </header>

  <div className="role-tabs" id="role-tabs"></div>

  <div className="con">
    <div id="sections-container"></div>
  </div>

  <footer className="ft">
    <p>© 2026 متين — جامعة الرياض الأهلية</p>
    <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
  </footer>
</div>
    </div>
  );
}