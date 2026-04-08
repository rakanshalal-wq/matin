'use client';
import React, { useState } from 'react';
import '../../styles/school-staff.css';

export default function StaffPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="dashboard-page">
<div className="ov" id="ov" onClick={() => {closeSb()}}></div>

{/* ADD EMPLOYEE MODAL */}
<div className="modal-bg" id="add-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">➕ إضافة موظف جديد</div>
      <button className="mx" onClick={() => {closeModal('add-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
        <div><label className="flbl">الاسم الكامل</label><input className="finp" type="text" placeholder="الاسم" style={{marginBottom:0}} /></div>
        <div><label className="flbl">رقم الهوية</label><input className="finp" type="text" placeholder="10XXXXXXXX" style={{marginBottom:0}} /></div>
      </div>
      <div style={{height:'10px'}}></div>
      <label className="flbl">المسمى الوظيفي</label>
      <select className="finp">
        <option>-- اختر الوظيفة --</option>
        <optgroup label="التدريس">
          <option>معلم / معلمة</option>
          <option>معلم أول</option>
          <option>وكيل المدرسة</option>
          <option>المرشد الطلابي</option>
        </optgroup>
        <optgroup label="الإدارة والسكرتارية">
          <option>موظف إداري</option>
          <option>سكرتير/ة</option>
          <option>مسؤول القبول والتسجيل</option>
        </optgroup>
        <optgroup label="خدمات الدعم">
          <option>سائق باص مدرسي</option>
          <option>فراش / عامل نظافة</option>
          <option>حارس أمن</option>
          <option>مشرف فناء</option>
          <option>طباخ / كافتيريا</option>
        </optgroup>
        <optgroup label="الدعم التقني">
          <option>مسؤول تقنية المعلومات</option>
          <option>مشرف المختبر</option>
        </optgroup>
      </select>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
        <div>
          <label className="flbl">الفرع</label>
          <select className="finp" style={{marginBottom:0}} id="modal-branch">
            <option>الفرع الرئيسي — حي النزهة</option>
            <option>فرع حي الروضة</option>
            <option>فرع حي العليا</option>
          </select>
        </div>
        <div><label className="flbl">الراتب الأساسي (SAR)</label><input className="finp" type="number" placeholder="0.00" style={{marginBottom:0}} /></div>
      </div>
      <div style={{height:'10px'}}></div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
        <div><label className="flbl">بداية العقد</label><input className="finp" type="date" style={{marginBottom:0}} /></div>
        <div><label className="flbl">نهاية العقد</label><input className="finp" type="date" style={{marginBottom:0}} /></div>
      </div>
      {/* صلاحيات النظام */}
      <div style={{background:'rgba(249,115,22,.05)',border:'1px solid var(--cb)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px'}}>
        <div style={{fontSize:'11px',color:'var(--c)',fontWeight:700,marginBottom:'8px'}}>صلاحيات النظام — تُحدَّد تلقائياً حسب الوظيفة</div>
        <div style={{display:'flex',flexDirection:'column',gap:'6px',fontSize:'11.5px',color:'var(--td)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> حساب في متين + تطبيق الجوال</div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span id="perm-att" style={{color:'var(--gr)'}}>✓</span> <span id="perm-att-lbl">تسجيل حضور الطلاب (للمعلمين)</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span id="perm-grades" style={{color:'var(--tm)'}}>✗</span> <span id="perm-grades-lbl">رفع الدرجات والواجبات</span></div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> تسجيل حضوره الشخصي + طلب إجازة</div>
          <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> عرض كشف راتبه</div>
        </div>
      </div>
      <div style={{background:'rgba(16,185,129,.05)',border:'1px solid rgba(16,185,129,.2)',borderRadius:'8px',padding:'8px 12px',marginBottom:'14px',fontSize:'11.5px',color:'var(--td)'}}>
        ✅ سيتم إنشاء الحساب تلقائياً وإرسال بيانات الدخول عبر SMS
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('add-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'10px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('✓ تم إضافة الموظف وإنشاء حسابه');closeModal('add-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'10px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إضافة وإنشاء حساب ←</button>
      </div>
    </div>
  </div>
</div>

{/* PERMISSIONS MODAL */}
<div className="modal-bg" id="perm-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">🔐 صلاحيات <span id="perm-name">موظف</span></div>
      <button className="mx" onClick={() => {closeModal('perm-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{background:'var(--cd)',border:'1px solid var(--cb)',borderRadius:'9px',padding:'9px 13px',marginBottom:'14px',fontSize:'12px',color:'var(--td)'}}>
        <strong style={{color:'var(--c)'}}>الموارد البشرية</strong> — تتحكم كامل في صلاحيات جميع موظفي المدرسة
        <div style={{marginTop:'3px',fontSize:'10.5px',color:'var(--tm)'}}>الصلاحيات الأكاديمية للمعلمين تُفعَّل هنا · الخدمات الأخرى وصولهم محدود</div>
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>وصول النظام</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الدخول لنظام متين</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>حساب وكلمة مرور</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تطبيق الجوال</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>وصول من الهاتف</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>صلاحيات المعلمين (الأكاديمية)</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل حضور الطلاب</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>يومياً لكل حصة</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>رفع الدرجات والواجبات</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>إدخال نتائج الطلاب</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>إنشاء اختبارات</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>اختبارات ورقية وإلكترونية</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>مراسلة أولياء الأمور</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>رسائل مباشرة في النظام</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل السلوك والانضباط</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>نقاط سلوك + / -</div></div><label className="tog"><input type="checkbox" /><span className="tsl"></span></label></div>
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>صلاحيات موظفي الخدمات</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'12px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل ركوب الطلاب (السائق)</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>حضور الباص المدرسي</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>خريطة المدرسة (الأمن)</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>للحراسة والدوريات</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>الوصول لبيانات الطلاب</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>محظور على الأمن والنظافة</div></div><label className="tog"><input type="checkbox" /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تقرير عمل يومي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>للفراشين والسائقين</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
      </div>

      <div style={{fontSize:'10px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'8px'}}>صلاحيات شخصية (للجميع)</div>
      <div style={{background:'var(--card)',border:'1px solid var(--b2)',borderRadius:'9px',overflow:'hidden',marginBottom:'14px'}}>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>تسجيل حضوره الشخصي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>بصمة أو من الجوال</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>طلب إجازة عبر النظام</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>اعتيادية / طارئة / مرضية</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
        <div className="perm-row"><div><div style={{fontSize:'12.5px',fontWeight:600,color:'var(--t)'}}>عرض كشف الراتب</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>قسيمة شهرية</div></div><label className="tog"><input type="checkbox" checked /><span className="tsl"></span></label></div>
      </div>

      {/* تجميد/حذف */}
      <div style={{background:'rgba(239,68,68,.05)',border:'1px solid rgba(239,68,68,.18)',borderRadius:'9px',padding:'10px 13px',marginBottom:'14px'}}>
        <div style={{fontSize:'11.5px',color:'var(--rd)',fontWeight:700,marginBottom:'7px'}}>⚠️ إجراءات إنهاء الخدمة</div>
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={() => {toast('✓ تم تجميد الحساب');closeModal('perm-modal')}} style={{flex:1,background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.25)',borderRadius:'7px',padding:'7px',color:'var(--rd)',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>🔒 تجميد الحساب</button>
          <button onClick={() => {toast('✓ تم الحذف النهائي');closeModal('perm-modal')}} style={{flex:1,background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.3)',borderRadius:'7px',padding:'7px',color:'var(--rd)',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>🗑️ حذف نهائي</button>
        </div>
      </div>

      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('perm-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'10px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('✓ تم حفظ الصلاحيات');closeModal('perm-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'10px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>حفظ الصلاحيات ✓</button>
      </div>
    </div>
  </div>
</div>

{/* SIDEBAR */}
<aside className="sb" id="sb">
  <div className="sb-top">
    <a className="logo-r" href="#"><div className="li">م</div><div><div className="lt">متين</div><div className="ls">الموارد البشرية — المدرسة</div></div></a>
    <div className="hr-card">
      <div className="hr-av">👩‍💼</div>
      <div style={{minWidth:0}}>
        <div className="hr-n">ريم العتيبي</div>
        <div className="hr-r">مديرة الموارد البشرية</div>
        <div className="hr-d">مدرسة الأمل الدولية</div>
      </div>
    </div>
    <div className="branch-sel">
      <div className="branch-lbl">الفروع</div>
      <div className="branch-list">
        <div className="branch-item active" onClick={() => {selectBranch('all',this)}}>
          <div className="branch-ic" style={{background:'rgba(249,115,22,.15)'}}>🏫</div>
          <div style={{flex:1,minWidth:0}}><div className="branch-n">جميع الفروع</div><div className="branch-cnt">86 موظف</div></div>
          <div className="branch-dot" style={{background:'var(--c)'}}></div>
        </div>
        <div className="branch-item" onClick={() => {selectBranch('main',this)}}>
          <div className="branch-ic" style={{background:'rgba(96,165,250,.12)'}}>🏫</div>
          <div style={{flex:1,minWidth:0}}><div className="branch-n">الرئيسي — النزهة</div><div className="branch-cnt">42 موظف</div></div>
          <div className="branch-dot" style={{background:'var(--bl)'}}></div>
        </div>
        <div className="branch-item" onClick={() => {selectBranch('b2',this)}}>
          <div className="branch-ic" style={{background:'rgba(167,139,250,.12)'}}>🏫</div>
          <div style={{flex:1,minWidth:0}}><div className="branch-n">فرع الروضة</div><div className="branch-cnt">26 موظف</div></div>
          <div className="branch-dot" style={{background:'var(--pu)'}}></div>
        </div>
        <div className="branch-item" onClick={() => {selectBranch('b3',this)}}>
          <div className="branch-ic" style={{background:'rgba(16,185,129,.12)'}}>🏫</div>
          <div style={{flex:1,minWidth:0}}><div className="branch-n">فرع العليا</div><div className="branch-cnt">18 موظف</div></div>
          <div className="branch-dot" style={{background:'var(--gr)'}}></div>
        </div>
      </div>
    </div>
  </div>

  <nav className="nav">
    <div className="ng">الرئيسية</div>
    <a className="ni on" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>لوحتي <span className="dot"></span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>التقويم</a>

    <div className="ng">إدارة الموظفين</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>جميع الموظفين <span className="nb nb-c">86</span></a>
    <a className="ni" href="#" onClick={() => {openModal('add-modal')}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="12" y1="11" x2="12" y2="17"/></svg><span style={{color:'var(--c)',fontWeight:600}}>+ إضافة موظف جديد</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>🔐 إدارة الصلاحيات</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>العقود <span className="nb nb-r">6</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>تقييم الأداء</a>

    <div className="ng">فرق العمل بالنوع</div>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>👩‍🏫</span> المعلمون/ات <span className="nb nb-c">52</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🚌</span> سائقو الباص <span className="nb nb-c">8</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🛡️</span> حراس الأمن <span className="nb nb-c">6</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🧹</span> الفراشون/ات <span className="nb nb-c">10</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>📋</span> الإداريون/ات <span className="nb nb-c">10</span></a>

    <div className="ng">الحضور والإجازات</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>حضور اليوم <span className="nb nb-c">اليوم</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>طلبات الإجازة <span className="nb nb-r">9</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>إحصائيات الحضور</a>

    <div className="ng">الرواتب</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>مسير الرواتب</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>قسائم الرواتب</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>الزيادات والبدلات</a>

    <div className="ng">الفروع</div>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🏫</span> الرئيسي — النزهة <span style={{background:'rgba(96,165,250,.1)',color:'var(--bl)',fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'5px',marginRight:'auto',border:'1px solid rgba(96,165,250,.2)'}}>42</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🏫</span> فرع الروضة <span style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'5px',marginRight:'auto',border:'1px solid rgba(167,139,250,.2)'}}>26</span></a>
    <a className="ni" href="#"><span style={{fontSize:'13px'}}>🏫</span> فرع العليا <span style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',fontSize:'9px',fontWeight:700,padding:'1px 5px',borderRadius:'5px',marginRight:'auto',border:'1px solid rgba(16,185,129,.2)'}}>18</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span style={{color:'var(--c)'}}>إضافة فرع جديد</span></a>
  </nav>

  <div className="sb-ft">
    <button className="lo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>تسجيل الخروج</button>
    <div style={{marginTop:'6px',color:'rgba(238,238,245,.14)',fontSize:'10px',textAlign:'center'}}>متين v6 — مدرسة الأمل الدولية</div>
  </div>
</aside>

{/* MAIN */}
<div className="main">
  <header className="hdr">
    <div className="hl">
      <button className="mb" onClick={() => {toggleSb()}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
      <div><div className="ht" id="hdr-title">الموارد البشرية — جميع الفروع</div><div className="hs">مدرسة الأمل الدولية · 3 فروع · 86 موظف</div></div>
    </div>
    <div className="hr2">
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="nd"></span></div>
      <button onClick={() => {openModal('add-modal')}} style={{background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'7px 14px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)',display:'flex',alignItems:'center',gap:'6px'}}>+ إضافة موظف</button>
      <div className="ub">
        <div className="ua">👩‍💼</div>
        <div className="ui"><div className="un">ريم العتيبي</div><div className="ur">الموارد البشرية</div></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </header>

  {/* BRANCH TABS */}
  <div className="branch-tabs" id="branch-tabs">
    <button className="btab active" data-bid="all" onClick={() => {switchBranch('all',this)}} style={{color:'var(--c)',borderBottomColor:'var(--c)'}}>🏫 جميع الفروع <span style={{background:'var(--cd)',color:'var(--c)',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'8px',marginRight:'4px',border:'1px solid var(--cb)'}}>86</span></button>
    <button className="btab" data-bid="main" onClick={() => {switchBranch('main',this)}}>🏫 الرئيسي — النزهة <span style={{background:'rgba(96,165,250,.1)',color:'var(--bl)',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'8px',marginRight:'4px',border:'1px solid rgba(96,165,250,.2)'}}>42</span></button>
    <button className="btab" data-bid="b2" onClick={() => {switchBranch('b2',this)}}>🏫 فرع الروضة <span style={{background:'rgba(167,139,250,.1)',color:'var(--pu)',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'8px',marginRight:'4px',border:'1px solid rgba(167,139,250,.2)'}}>26</span></button>
    <button className="btab" data-bid="b3" onClick={() => {switchBranch('b3',this)}}>🏫 فرع العليا <span style={{background:'rgba(16,185,129,.1)',color:'var(--gr)',fontSize:'9px',fontWeight:700,padding:'1px 6px',borderRadius:'8px',marginRight:'4px',border:'1px solid rgba(16,185,129,.2)'}}>18</span></button>
  </div>

  <div className="con">

    {/* PAGE HDR */}
    <div className="ph">
      <div>
        <div className="pt" id="page-title">👥 الموارد البشرية — جميع الفروع</div>
        <div className="ps" id="page-sub">عرض شامل لجميع الموظفين في كل الفروع · المركزية مع استقلالية جزئية لكل فرع</div>
      </div>
      <button className="btn-p" onClick={() => {openModal('add-modal')}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        إضافة موظف
      </button>
    </div>

    {/* BRANCHES OVERVIEW (all view) */}
    <div id="branches-overview">
      <div className="g3" style={{marginBottom:'13px'}}>
        <div className="card" style={{marginBottom:0}}>
          <div style={{padding:'14px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'9px',background:'rgba(96,165,250,.12)',border:'1px solid rgba(96,165,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🏫</div>
              <div><div style={{fontSize:'13px',fontWeight:700,color:'var(--t)'}}>الرئيسي — النزهة</div><div style={{fontSize:'10.5px',color:'var(--bl)'}}>الفرع الأم</div></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--bl)'}}>42</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>موظف</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>96%</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>حضور</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>3</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>إجازات</div></div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:'96%',background:'var(--bl)'}}></div></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',fontSize:'10px',color:'var(--tm)'}}>
              <span>حضور اليوم</span><span style={{color:'var(--bl)',fontWeight:700}}>40 / 42</span>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:0}}>
          <div style={{padding:'14px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'9px',background:'rgba(167,139,250,.12)',border:'1px solid rgba(167,139,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🏫</div>
              <div><div style={{fontSize:'13px',fontWeight:700,color:'var(--t)'}}>فرع الروضة</div><div style={{fontSize:'10.5px',color:'var(--pu)'}}>الفرع الثاني</div></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--pu)'}}>26</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>موظف</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>92%</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>حضور</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>4</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>إجازات</div></div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:'92%',background:'var(--pu)'}}></div></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',fontSize:'10px',color:'var(--tm)'}}>
              <span>حضور اليوم</span><span style={{color:'var(--pu)',fontWeight:700}}>24 / 26</span>
            </div>
          </div>
        </div>
        <div className="card" style={{marginBottom:0}}>
          <div style={{padding:'14px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'9px',background:'rgba(16,185,129,.12)',border:'1px solid rgba(16,185,129,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>🏫</div>
              <div><div style={{fontSize:'13px',fontWeight:700,color:'var(--t)'}}>فرع العليا</div><div style={{fontSize:'10.5px',color:'var(--gr)'}}>الفرع الثالث</div></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',marginBottom:'10px'}}>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>18</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>موظف</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>88%</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>حضور</div></div>
              <div style={{textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>2</div><div style={{fontSize:'9.5px',color:'var(--tm)'}}>إجازات</div></div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:'88%',background:'var(--gr)'}}></div></div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:'5px',fontSize:'10px',color:'var(--tm)'}}>
              <span>حضور اليوم</span><span style={{color:'var(--gr)',fontWeight:700}}>16 / 18</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="sg">
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(249,115,22,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.2)'}}>👥</div>
        <div className="sv" style={{color:'var(--c)'}} id="stat-total">86</div>
        <div className="sl">إجمالي الموظفين</div>
        <div className="ss" style={{color:'rgba(249,115,22,.6)'}} id="stat-total-sub">3 فروع</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(16,185,129,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>✅</div>
        <div className="sv" style={{color:'var(--gr)'}} id="stat-att">94%</div>
        <div className="sl">نسبة الحضور اليوم</div>
        <div className="ss" style={{color:'rgba(16,185,129,.6)'}}>81 من 86 حضروا</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(239,68,68,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>📋</div>
        <div className="sv" style={{color:'var(--rd)'}}>9</div>
        <div className="sl">طلبات إجازة معلقة</div>
        <div className="ss" style={{color:'rgba(239,68,68,.6)'}}>تحتاج موافقة</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(239,68,68,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>📄</div>
        <div className="sv" style={{color:'var(--rd)'}}>6</div>
        <div className="sl">عقود تنتهي قريباً</div>
        <div className="ss" style={{color:'rgba(239,68,68,.6)'}}>خلال 30 يوم</div>
      </div>
    </div>

    {/* EMPLOYEES TABLE */}
    <div className="card">
      <div className="ch">
        <div className="ct">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          جميع الموظفين — التحكم الكامل
          <span id="emp-count" style={{background:'var(--cd)',border:'1px solid var(--cb)',color:'var(--c)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px'}}>86</span>
        </div>
        <div style={{display:'flex',gap:'6px',alignItems:'center',flexWrap:'wrap'}}>
          <select style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b2)',color:'var(--td)',fontSize:'11px',padding:'4px 8px',borderRadius:'6px',fontFamily:'var(--f)',outline:'none'}}>
            <option>الكل</option><option>معلمون</option><option>سائقون</option><option>أمن</option><option>نظافة</option><option>إداريون</option>
          </select>
          <select id="branch-filter" style={{background:'rgba(255,255,255,.04)',border:'1px solid var(--b2)',color:'var(--td)',fontSize:'11px',padding:'4px 8px',borderRadius:'6px',fontFamily:'var(--f)',outline:'none'}}>
            <option>كل الفروع</option><option>الرئيسي — النزهة</option><option>فرع الروضة</option><option>فرع العليا</option>
          </select>
          <button onClick={() => {openModal('add-modal')}} style={{background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'7px',padding:'5px 12px',color:'#fff',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>+ موظف</button>
        </div>
      </div>
      <div className="tw">
        <table>
          <thead><tr><th>الموظف</th><th>الوظيفة</th><th>النوع</th><th>الفرع</th><th>الحالة</th><th>الحضور</th><th>الصلاحيات</th></tr></thead>
          <tbody id="emp-table">
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(249,115,22,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--c)',flexShrink:0}}>م</div><span style={{fontWeight:600,color:'var(--t)'}}>أ. محمد الغامدي</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>معلم رياضيات</td><td><span className="badge bb">معلم</span></td><td><span style={{fontSize:'10px',color:'var(--bl)'}}>● الرئيسي</span></td><td><span className="badge bg">نشط</span></td><td style={{color:'var(--gr)',fontWeight:700,fontSize:'11px'}}>✓ حاضر</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('أ. محمد الغامدي')}}>🔐 صلاحيات</button></td></tr>
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(52,211,153,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--gr)'}}>س</div><span style={{fontWeight:600,color:'var(--t)'}}>أ. سارة الزهراني</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>معلمة علوم</td><td><span className="badge bb">معلمة</span></td><td><span style={{fontSize:'10px',color:'var(--pu)'}}>● الروضة</span></td><td><span className="badge bg">نشط</span></td><td style={{color:'var(--gr)',fontWeight:700,fontSize:'11px'}}>✓ حاضر</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('أ. سارة الزهراني')}}>🔐 صلاحيات</button></td></tr>
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(96,165,250,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--bl)'}}>ع</div><span style={{fontWeight:600,color:'var(--t)'}}>عبدالله الدوسري</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>سائق باص</td><td><span className="badge bo">سائق</span></td><td><span style={{fontSize:'10px',color:'var(--bl)'}}>● الرئيسي</span></td><td><span className="badge bg">نشط</span></td><td style={{color:'var(--gr)',fontWeight:700,fontSize:'11px'}}>✓ حاضر</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('عبدالله الدوسري')}}>🔐 صلاحيات</button></td></tr>
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(239,68,68,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--rd)'}}>ف</div><span style={{fontWeight:600,color:'var(--t)'}}>فيصل الشمري</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>حارس أمن</td><td><span className="badge br">أمن</span></td><td><span style={{fontSize:'10px',color:'var(--gr)'}}>● العليا</span></td><td><span className="badge bo">إجازة</span></td><td style={{color:'var(--or)',fontWeight:700,fontSize:'11px'}}>✗ إجازة</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('فيصل الشمري')}}>🔐 صلاحيات</button></td></tr>
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(16,185,129,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--gr)'}}>ر</div><span style={{fontWeight:600,color:'var(--t)'}}>ريم السلمي</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>فراشة</td><td><span className="badge bg">نظافة</span></td><td><span style={{fontSize:'10px',color:'var(--pu)'}}>● الروضة</span></td><td><span className="badge bg">نشط</span></td><td style={{color:'var(--gr)',fontWeight:700,fontSize:'11px'}}>✓ حاضر</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('ريم السلمي')}}>🔐 صلاحيات</button></td></tr>
            <tr><td><div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'26px',height:'26px',borderRadius:'6px',background:'rgba(167,139,250,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,color:'var(--pu)'}}>ن</div><span style={{fontWeight:600,color:'var(--t)'}}>نورة الحربي</span></div></td><td style={{color:'var(--tm)',fontSize:'11px'}}>موظفة إدارية</td><td><span className="badge bp">إدارية</span></td><td><span style={{fontSize:'10px',color:'var(--bl)'}}>● الرئيسي</span></td><td><span className="badge bg">نشط</span></td><td style={{color:'var(--gr)',fontWeight:700,fontSize:'11px'}}>✓ حاضر</td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}} onClick={() => {openPerm('نورة الحربي')}}>🔐 صلاحيات</button></td></tr>
          </tbody>
        </table>
      </div>
      <div style={{padding:'9px 13px',textAlign:'center',fontSize:'11px',color:'var(--tm)'}}>+ 80 موظف آخر</div>
    </div>

    {/* LEAVES + CONTRACTS */}
    <div className="g2">
      {/* إجازات معلقة */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct">📋 طلبات الإجازة المعلقة <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px',marginRight:'3px'}}>9</span></div>
        </div>
        ${['أ. محمد الغامدي — الرئيسي — إجازة اعتيادية 3 أيام','أ. سارة الزهراني — الروضة — إجازة مرضية','عبدالله الدوسري — الرئيسي — استئذان يوم','فيصل الشمري — العليا — إجازة طارئة','ريم السلمي — الروضة — إجازة اعتيادية أسبوع'].map(l=>{
          const [name,branch,type] = l.split(' — ');
          return `<div className="item"><div className="item-ic" style={{background:'rgba(249,115,22,.1)'}}>📋</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>${name}</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>${branch} · ${type}</div></div><div style={{display:'flex',gap:'4px'}}><button className="btn-sm" style={{background:'rgba(16,185,129,.08)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>قبول</button><button className="btn-sm" style={{background:'rgba(239,68,68,.08)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.2)'}}>رفض</button></div></div>`;
        }).join('')}
        <div style={{padding:'8px 13px',textAlign:'center',fontSize:'11px',color:'var(--tm)'}}>+ 4 طلبات أخرى</div>
      </div>

      {/* عقود وراتب */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        <div className="card" style={{marginBottom:0}}>
          <div className="ch"><div className="ct">📄 عقود تنتهي قريباً <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px',marginRight:'3px'}}>6</span></div></div>
          ${[['أ. خالد النمر','معلم — الروضة','انتهى','br'],['ريم السلمي','فراشة — الروضة','بعد 8 أيام','bo'],['فيصل الشمري','أمن — العليا','بعد 20 يوم','bo'],['أ. هند الزهراني','معلمة — الرئيسي','بعد 28 يوم','bb']].map(([n,r,d,bc])=>`
          <div className="item"><div className="item-ic" style={{background:'rgba(239,68,68,.1)'}}>📄</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>${n}</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>${r} · ${d}</div></div><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}}>تجديد</button></div>`).join('')}
        </div>

        <div className="card" style={{marginBottom:0}}>
          <div className="ch"><div className="ct">💰 مسير الرواتب — هذا الشهر</div><span className="badge bg">جاهز ✓</span></div>
          <div style={{padding:'12px 13px'}}>
            ${[['الرئيسي — النزهة','152,000 SAR','#60A5FA'],['فرع الروضة','88,000 SAR','#A78BFA'],['فرع العليا','64,000 SAR','#10B981']].map(([b,a,col])=>`
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:'1px solid var(--b2)',fontSize:'12px'}}><span style={{color:'var(--td)'}}>${b}</span><strong style={{color:'${col}'}}>${a}</strong></div>`).join('')}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',fontSize:'13px',fontWeight:700}}><span style={{color:'var(--t)'}}>الإجمالي</span><span style={{color:'var(--c)'}}>304,000 SAR</span></div>
            <button onClick={() => {toast('✓ تم صرف الرواتب')}} style={{width:'100%',background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'8px',padding:'9px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>💸 صرف الرواتب الآن</button>
          </div>
        </div>
      </div>
    </div>

    {/* QUICK ACTIONS */}
    <div>
      <div style={{color:'var(--tm)',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>إجراءات سريعة</div>
      <div className="qg">
        <a className="qi" href="#" onClick={() => {openModal('add-modal')}}><div className="qic" style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.2)'}}>➕</div><span className="ql">إضافة موظف</span></a>
        <a className="qi" href="#" onClick={() => {openModal('perm-modal')}}><div className="qic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>🔐</div><span className="ql">الصلاحيات</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📋</div><span className="ql">معالجة إجازة</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📄</div><span className="ql">تجديد عقد</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>💰</div><span className="ql">مسير الرواتب</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>⭐</div><span className="ql">تقييم الأداء</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}>📊</div><span className="ql">تقرير HR</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📑</div><span className="ql">قسائم الراتب</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.2)'}}>🚌</div><span className="ql">سائقو الباص</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>🛡️</div><span className="ql">حراس الأمن</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>🧹</div><span className="ql">الفراشون</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)'}}>🏫</div><span className="ql">إدارة الفروع</span></a>
      </div>
    </div>

  </div>

  <footer className="ft">
    <p>© 2026 متين — الموارد البشرية · مدرسة الأمل الدولية</p>
    <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
  </footer>
</div>
    </div>
  );
}