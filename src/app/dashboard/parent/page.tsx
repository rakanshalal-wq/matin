'use client';
import React, { useState } from 'react';
import '../../../styles/school-parent.css';

export default function ParentPage() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="dashboard-page">
<div className="ov" id="ov" onClick={() => {closeSb()}}></div>

{/* EXCUSE MODAL */}
<div className="modal-bg" id="excuse-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">📋 تقديم عذر غياب</div>
      <button className="mx" onClick={() => {closeModal('excuse-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <label className="flbl">نوع العذر</label>
      <select className="finp">
        <option>مرض</option><option>ظرف عائلي</option><option>سفر</option><option>موعد طبي</option><option>أخرى</option>
      </select>
      <label className="flbl">تاريخ الغياب</label>
      <input className="finp" type="date" />
      <label className="flbl">التفاصيل</label>
      <textarea className="finp" style={{resize:'vertical',minHeight:'65px'}} placeholder="اشرح سبب الغياب..."></textarea>
      <label className="flbl">مرفق طبي (اختياري)</label>
      <div style={{border:'2px dashed var(--b1)',borderRadius:'8px',padding:'14px',textAlign:'center',marginBottom:'14px',cursor:'pointer'}}>
        <div style={{fontSize:'18px',marginBottom:'3px'}}>📎</div>
        <div style={{fontSize:'11px',color:'var(--tm)'}}>اضغط لرفع تقرير طبي</div>
      </div>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('excuse-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'10px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('تم إرسال العذر للمدرسة ✓');closeModal('excuse-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'10px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إرسال ←</button>
      </div>
    </div>
  </div>
</div>

{/* MESSAGE MODAL */}
<div className="modal-bg" id="msg-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">💬 رسالة للمعلم</div>
      <button className="mx" onClick={() => {closeModal('msg-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <label className="flbl">المعلم</label>
      <select className="finp">
        <option>أ. محمد الغامدي — الرياضيات</option>
        <option>أ. سارة الزهراني — العلوم</option>
        <option>أ. خالد المطيري — اللغة العربية</option>
        <option>إدارة المدرسة</option>
      </select>
      <label className="flbl">الرسالة</label>
      <textarea className="finp" style={{resize:'vertical',minHeight:'90px'}} placeholder="اكتب رسالتك هنا..."></textarea>
      <div style={{display:'flex',gap:'8px'}}>
        <button onClick={() => {closeModal('msg-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'10px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('تم إرسال الرسالة ✓');closeModal('msg-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'10px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إرسال ←</button>
      </div>
    </div>
  </div>
</div>

{/* PAY MODAL */}
<div className="modal-bg" id="pay-modal">
  <div className="modal">
    <div className="mh">
      <div className="mt">💳 دفع الرسوم الدراسية</div>
      <button className="mx" onClick={() => {closeModal('pay-modal')}}>×</button>
    </div>
    <div style={{padding:'16px'}}>
      <div style={{background:'rgba(52,211,153,.06)',border:'1px solid var(--cb)',borderRadius:'9px',padding:'12px',marginBottom:'14px'}}>
        <div style={{fontSize:'12px',color:'var(--td)',marginBottom:'6px'}}>المبلغ المستحق</div>
        <div style={{fontSize:'26px',fontWeight:800,color:'var(--c)'}}>2,500 <span style={{fontSize:'14px',color:'var(--tm)'}}>SAR</span></div>
        <div style={{fontSize:'11px',color:'var(--tm)',marginTop:'3px'}}>الرسوم الفصلية — الفصل الثاني 1445</div>
      </div>
      <label className="flbl">طريقة الدفع</label>
      <select className="finp">
        <option>بطاقة مدى</option><option>فيزا / ماستركارد</option><option>Apple Pay</option><option>تحويل بنكي</option>
      </select>
      <label className="flbl">رقم البطاقة</label>
      <input className="finp" type="text" placeholder="XXXX XXXX XXXX XXXX" />
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
        <div><label className="flbl">تاريخ الانتهاء</label><input className="finp" type="text" placeholder="MM/YY" style={{marginBottom:0}} /></div>
        <div><label className="flbl">CVV</label><input className="finp" type="text" placeholder="XXX" style={{marginBottom:0}} /></div>
      </div>
      <div style={{display:'flex',gap:'8px',marginTop:'10px'}}>
        <button onClick={() => {closeModal('pay-modal')}} style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'10px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>إلغاء</button>
        <button onClick={() => {toast('تم الدفع بنجاح ✓');closeModal('pay-modal')}} style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'10px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}>ادفع الآن ←</button>
      </div>
    </div>
  </div>
</div>

{/* SIDEBAR */}
<aside className="sb" id="sb">
  <div className="sb-top">
    <a className="logo-r" href="#"><div className="li">م</div><div><div className="lt">متين</div><div className="ls">بوابة ولي الأمر</div></div></a>
    <div className="par-card">
      <div className="par-top">
        <div className="par-av">👨‍👦</div>
        <div style={{minWidth:0}}><div className="par-n">محمد الزهراني</div><div className="par-r">ولي أمر — مدرسة الأمل</div></div>
      </div>
      <div style={{fontSize:'9px',color:'var(--tm)',fontWeight:700,letterSpacing:'1px',marginBottom:'6px'}}>أبنائي في المدرسة</div>
      <div className="child-row active" onClick={() => {selectChild('فهد',this)}}>
        <div className="child-av">👦</div>
        <div style={{flex:1,minWidth:0}}><div className="child-n">فهد محمد</div><div className="child-s">الصف الرابع — ب</div></div>
        <div className="loc-dot blink" style={{background:'var(--gr)'}} title="في المدرسة"></div>
      </div>
      <div className="child-row" onClick={() => {selectChild('نورة',this)}}>
        <div className="child-av">👧</div>
        <div style={{flex:1,minWidth:0}}><div className="child-n">نورة محمد</div><div className="child-s">الصف الأول — أ</div></div>
        <div className="loc-dot blink" style={{background:'var(--or)'}} title="في الباص"></div>
      </div>
    </div>
  </div>

  <nav className="nav">
    <div className="ng">الرئيسية</div>
    <a className="ni on" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>بوابتي <span className="dot"></span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>الجدول الدراسي</a>

    <div className="ng">النقل المدرسي 🚌</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>حالة الباص الآن <span className="nb nb-c">في الطريق</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>تتبع GPS الباص</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>تتبع GPS الجوال</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>سجل الركوب والنزول</a>

    <div className="ng">الحضور</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>الحضور والغياب اليومي</a>
    <a className="ni" href="#" onClick={() => {openModal('excuse-modal')}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg><span style={{color:'var(--c)',fontWeight:600}}>تقديم عذر غياب</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>إحصائيات الحضور</a>

    <div className="ng">الأداء الأكاديمي</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>الدرجات والنتائج</a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/><path d="M9 14l2 2 4-4"/></svg>الواجبات المنزلية <span className="nb nb-c">3</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>الاختبارات القادمة <span className="nb nb-c">2</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>التقييم الشامل</a>

    <div className="ng">السلوك</div>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>سجل السلوك <span className="nb nb-c">جيد</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/><circle cx="12" cy="12" r="10"/></svg>النقاط والمكافآت ⭐</a>

    <div className="ng">التواصل</div>
    <a className="ni" href="#" onClick={() => {openModal('msg-modal')}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span style={{color:'var(--c)',fontWeight:600}}>راسل المعلم</span> <span className="nb nb-r">2</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>التنبيهات <span className="nb nb-r">4</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>الملتقى والأنشطة</a>

    <div className="ng">المالية</div>
    <a className="ni" href="#" onClick={() => {openModal('pay-modal')}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><span style={{color:'var(--rd)',fontWeight:600}}>الرسوم الدراسية</span> <span className="nb nb-r">معلقة</span></a>
    <a className="ni" href="#"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>سجل المدفوعات</a>
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
      <div><div className="ht" id="hdr-title">متابعة فهد محمد</div><div className="hs">مدرسة الأمل الدولية — الفصل الثاني 1445/1446</div></div>
    </div>
    <div className="hr2">
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="nd"></span></div>
      <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span className="nd"></span></div>
      <div className="ub">
        <div className="ua">👨‍👦</div>
        <div className="ui"><div className="un">محمد الزهراني</div><div className="ur">ولي أمر</div></div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  </header>

  <div className="con">

    {/* BUS ALERT */}
    <div id="bus-notif" style={{display:'flex',alignItems:'center',gap:'10px',background:'rgba(52,211,153,.07)',border:'1px solid rgba(52,211,153,.22)',borderRadius:'11px',padding:'10px 14px',marginBottom:'12px',fontSize:'12.5px',flexWrap:'wrap'}}>
      <span style={{fontSize:'20px'}}>🚌</span>
      <div style={{flex:1}}>
        <div style={{fontWeight:700,color:'var(--c)'}}>✓ فهد ركب الباص — طريق المدرسة</div>
        <div style={{color:'var(--td)',fontSize:'11px',marginTop:'1px'}}>سجّله السائق عبدالله الدوسري · الخط 2 · 7:08 ص · وصل المدرسة 7:35 ص</div>
      </div>
      <button onClick={() => {this.parentNode.style.display='none'}} style={{background:'none',border:'none',color:'var(--tm)',cursor:'pointer',fontSize:'18px'}}>×</button>
    </div>

    {/* CHILD BANNER */}
    <div className="child-banner" id="child-banner">
      <div className="cb-av" id="cb-av">👦</div>
      <div className="cb-info">
        <div className="cb-name" id="cb-name">فهد محمد الزهراني</div>
        <div className="cb-sub" id="cb-sub">الصف الرابع — الفصل ب · مدرسة الأمل الدولية</div>
        <div className="cb-loc" id="cb-loc" style={{color:'var(--gr)'}}>
          <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'var(--gr)',boxShadow:'0 0 5px var(--gr)'}}></div>
          داخل المدرسة — الفصل الدراسي
        </div>
      </div>
      <div className="cb-div"></div>
      <div className="cb-stat"><div className="cb-sv" style={{color:'var(--c)'}}>92%</div><div className="cb-sl">نسبة الحضور</div></div>
      <div className="cb-div"></div>
      <div className="cb-stat"><div className="cb-sv" style={{color:'var(--gr)'}}>88%</div><div className="cb-sl">متوسط الدرجات</div></div>
      <div className="cb-div"></div>
      <div className="cb-stat"><div className="cb-sv" style={{color:'var(--pu)'}}>⭐ 45</div><div className="cb-sl">نقاط السلوك</div></div>
      <div className="cb-div"></div>
      <div className="cb-stat"><div className="cb-sv" style={{color:'var(--rd)'}}>2.5K</div><div className="cb-sl">رسوم معلقة</div></div>
    </div>

    {/* GPS MAPS ROW */}
    <div className="g2">

      {/* GPS الباص */}
      <div className="map-wrap" style={{marginBottom:0}}>
        <div style={{padding:'9px 13px',borderBottom:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:'12.5px',fontWeight:700,color:'var(--t)',display:'flex',alignItems:'center',gap:'7px'}}>
            🚌 GPS الباص المدرسي
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <div className="live-badge">● وصل</div>
            <button onClick={() => {toast('جارٍ التحديث...')}} style={{background:'var(--cd)',border:'1px solid var(--cb)',borderRadius:'6px',padding:'3px 10px',color:'var(--c)',fontSize:'10px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>تحديث</button>
          </div>
        </div>
        <div className="map-body" style={{height:'165px'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'32px 32px'}}></div>
          {/* Route SVG */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 500 165" preserveAspectRatio="none">
            <path d="M 25 135 Q 70 120 110 105 Q 150 88 190 82 Q 230 76 270 74 Q 310 72 340 70" stroke="#10B981" strokeWidth="3" fill="none" opacity=".8"/>
            <path d="M 340 70 Q 380 68 420 66 Q 455 64 475 62" stroke="#60A5FA" strokeWidth="2.5" fill="none" stroke-dasharray="6,4" opacity=".6"/>
          </svg>
          {/* Stops */}
          <div style={{position:'absolute',right:'5%',top:'80%',transform:'translate(50%,-50%)',textAlign:'center'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'var(--gr)',margin:'0 auto 2px'}}></div>
            <div style={{fontSize:'8px',color:'rgba(255,255,255,.4)'}}>المنزل</div>
            <div style={{fontSize:'7.5px',color:'var(--gr)'}}>7:08</div>
          </div>
          <div style={{position:'absolute',right:'32%',top:'46%',transform:'translate(50%,-50%)',textAlign:'center'}}>
            <div style={{width:'9px',height:'9px',borderRadius:'50%',background:'var(--gr)',margin:'0 auto 2px'}}></div>
            <div style={{fontSize:'7.5px',color:'rgba(255,255,255,.35)'}}>محطة وسط</div>
          </div>
          {/* Bus icon (arrived at school) */}
          <div style={{position:'absolute',right:'67%',top:'42%',transform:'translate(50%,-50%)',zIndex:5}}>
            <div style={{background:'rgba(16,185,129,.2)',border:'2px solid var(--gr)',borderRadius:'8px',padding:'3px 7px',fontSize:'13px'}}>🚌</div>
            <div style={{fontSize:'8px',color:'var(--gr)',fontWeight:700,textAlign:'center'}}>وصل ✓</div>
          </div>
          {/* School */}
          <div style={{position:'absolute',right:'87%',top:'36%',transform:'translate(50%,-50%)',textAlign:'center'}}>
            <div style={{width:'14px',height:'14px',borderRadius:'4px',background:'rgba(52,211,153,.25)',border:'2px solid var(--c)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 2px',fontSize:'9px'}}>🏫</div>
            <div style={{fontSize:'8px',color:'var(--c)',fontWeight:700}}>المدرسة</div>
            <div style={{fontSize:'7.5px',color:'rgba(52,211,153,.6)'}}>7:35 وصل</div>
          </div>
          {/* Footer */}
          <div style={{position:'absolute',bottom:'6px',right:'10px',fontSize:'9.5px',color:'var(--gr)',fontWeight:700}}>✓ فهد وصل المدرسة · 7:35 ص</div>
          <div style={{position:'absolute',bottom:'6px',left:'10px',fontSize:'9.5px',color:'var(--tm)'}}>العودة: 2:30 م</div>
        </div>
        {/* Bus info footer */}
        <div style={{padding:'8px 13px',display:'flex',alignItems:'center',gap:'12px',borderTop:'1px solid var(--b2)',flexWrap:'wrap',background:'rgba(255,255,255,.01)'}}>
          <div style={{fontSize:'11px',color:'var(--td)'}}><span style={{color:'var(--c)',fontWeight:700}}>الخط 2</span> — السائق عبدالله الدوسري</div>
          <button onClick={() => {toast('جارٍ الاتصال...')}} style={{background:'rgba(96,165,250,.08)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'6px',padding:'4px 10px',color:'var(--bl)',fontSize:'10.5px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)',marginRight:'auto'}}>📞 اتصل بالسائق</button>
        </div>
      </div>

      {/* GPS الجوال */}
      <div className="map-wrap" style={{marginBottom:0}}>
        <div style={{padding:'9px 13px',borderBottom:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:'12.5px',fontWeight:700,color:'var(--t)',display:'flex',alignItems:'center',gap:'7px'}}>
            📍 GPS جوال فهد
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
            <div style={{background:'rgba(52,211,153,.12)',border:'1px solid var(--cb)',color:'var(--c)',fontSize:'9.5px',fontWeight:700,padding:'2px 8px',borderRadius:'10px',display:'flex',alignItems:'center',gap:'4px'}}><div style={{width:'5px',height:'5px',borderRadius:'50%',background:'var(--c)',animation:'blink 1.5s infinite'}}></div>مباشر</div>
          </div>
        </div>
        <div className="map-body" style={{height:'165px'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'32px 32px'}}></div>
          {/* School building */}
          <div style={{position:'absolute',right:'20%',top:'20%',width:'55%',height:'50%',background:'rgba(52,211,153,.06)',border:'1px solid rgba(52,211,153,.18)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'rgba(52,211,153,.5)',fontWeight:700}}>مبنى المدرسة</div>
          {/* Corridors */}
          <div style={{position:'absolute',right:'40%',top:'10%',width:'2px',height:'20%',background:'rgba(255,255,255,.06)'}}></div>
          <div style={{position:'absolute',right:'20%',top:'40%',width:'55%',height:'2px',background:'rgba(255,255,255,.06)'}}></div>
          {/* Student pin inside school */}
          <div className="pin" style={{right:'45%',top:'52%'}} id="mobile-pin">
            <div className="pin-lbl" id="mobile-lbl">فهد 👦</div>
            <div className="pin-ring" style={{width:'30px',height:'30px'}}>
              <div className="pin-ic" style={{width:'16px',height:'16px',fontSize:'10px'}}>👦</div>
            </div>
          </div>
          {/* Location zones */}
          <div style={{position:'absolute',right:'20%',top:'75%',fontSize:'8.5px',color:'rgba(255,255,255,.25)'}}>الفناء الخارجي</div>
          <div style={{position:'absolute',right:'3%',top:'20%',width:'15%',height:'60%',background:'rgba(255,255,255,.02)',border:'1px dashed rgba(255,255,255,.07)',borderRadius:'5px',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{fontSize:'7.5px',color:'rgba(255,255,255,.3)',writingMode:'vertical-rl'}}>مدخل</div>
          </div>
          {/* Footer */}
          <div style={{position:'absolute',bottom:'6px',right:'10px',fontSize:'9.5px',color:'var(--c)',fontWeight:700}}>📍 داخل الفصل الدراسي</div>
          <div style={{position:'absolute',bottom:'6px',left:'10px',fontSize:'9.5px',color:'var(--tm)'}} id="mobile-time">10:22 ص</div>
        </div>
        <div style={{padding:'8px 13px',borderTop:'1px solid var(--b2)',display:'flex',alignItems:'center',gap:'8px',background:'rgba(255,255,255,.01)'}}>
          <div style={{fontSize:'11px',color:'var(--td)'}}>مرتبط بجوال فهد · تحديث كل دقيقة</div>
          <div style={{marginRight:'auto',background:'rgba(52,211,153,.08)',border:'1px solid rgba(52,211,153,.2)',borderRadius:'6px',padding:'3px 9px',fontSize:'10px',color:'var(--c)',fontWeight:700}}>✓ داخل النطاق الآمن</div>
        </div>
      </div>
    </div>

    {/* STATS */}
    <div className="sg">
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(52,211,153,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>✅</div>
        <div className="sv" style={{color:'var(--c)'}}>92%</div><div className="sl">نسبة الحضور</div>
        <div className="ss" style={{color:'rgba(52,211,153,.6)'}}>45/48 يوم حضر</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(96,165,250,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📝</div>
        <div className="sv" style={{color:'var(--bl)'}}>88%</div><div className="sl">متوسط الدرجات</div>
        <div className="ss" style={{color:'rgba(96,165,250,.6)'}}>↑ الفصل الأول 82%</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(167,139,250,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>⭐</div>
        <div className="sv" style={{color:'var(--pu)'}}>45</div><div className="sl">نقاط السلوك</div>
        <div className="ss" style={{color:'rgba(167,139,250,.6)'}}>ممتاز — هذا الفصل</div>
      </div>
      <div className="sc">
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(251,146,60,.05),transparent 60%)',pointerEvents:'none'}}></div>
        <div className="si" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📚</div>
        <div className="sv" style={{color:'var(--or)'}}>3</div><div className="sl">واجبات مطلوبة</div>
        <div className="ss" style={{color:'rgba(251,146,60,.6)'}}>بانتظار التسليم</div>
      </div>
    </div>

    {/* ROW: جدول اليوم + رسائل المعلم */}
    <div className="g2">

      {/* جدول اليوم + حضور الأسبوع */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>جدول اليوم — الأحد</div>
          <button className="cl">الأسبوع</button>
        </div>
        {/* حضور الأسبوع */}
        <div className="att-week">
          <div className="att-day present"><div className="att-dname">الأحد</div><div className="att-icon">✅</div><div className="att-label" style={{color:'var(--gr)'}}>حضر</div></div>
          <div className="att-day present"><div className="att-dname">الاثنين</div><div className="att-icon">✅</div><div className="att-label" style={{color:'var(--gr)'}}>حضر</div></div>
          <div className="att-day late"><div className="att-dname">الثلاثاء</div><div className="att-icon">⏰</div><div className="att-label" style={{color:'var(--or)'}}>متأخر</div></div>
          <div className="att-day present"><div className="att-dname">الأربعاء</div><div className="att-icon">✅</div><div className="att-label" style={{color:'var(--gr)'}}>حضر</div></div>
          <div className="att-day today bc" style={{borderColor:'var(--c)'}}><div className="att-dname" style={{color:'var(--c)'}}>الخميس</div><div className="att-icon">🕐</div><div className="att-label" style={{color:'var(--c)'}}>اليوم</div></div>
        </div>
        {/* الحصص */}
        <div className="lesson now">
          <div className="ltime" style={{color:'var(--c)'}}>8:00 — 8:45</div>
          <div style={{flex:1}}><div className="lname" style={{color:'var(--c)'}}>الرياضيات</div><div className="lteacher">أ. محمد الغامدي · الفصل 4/ب</div></div>
          <span className="badge bc">● الآن</span>
        </div>
        <div className="lesson">
          <div className="ltime">8:45 — 9:30</div>
          <div style={{flex:1}}><div className="lname">اللغة العربية</div><div className="lteacher">أ. خالد المطيري</div></div>
          <span className="badge bp">قادمة</span>
        </div>
        <div className="lesson">
          <div className="ltime">9:45 — 10:30</div>
          <div style={{flex:1}}><div className="lname">العلوم</div><div className="lteacher">أ. سارة الزهراني</div></div>
          <span className="badge bp">قادمة</span>
        </div>
        <div className="lesson" style={{opacity:'.45'}}>
          <div className="ltime">10:30 — 10:45</div>
          <div style={{flex:1}}><div className="lname" style={{color:'var(--tm)'}}>استراحة</div></div>
        </div>
        <div className="lesson">
          <div className="ltime">10:45 — 11:30</div>
          <div style={{flex:1}}><div className="lname">التربية الإسلامية</div><div className="lteacher">أ. عبدالله الحربي</div></div>
          <span className="badge bp">قادمة</span>
        </div>
        <div className="lesson" style={{borderBottom:'none'}}>
          <div className="ltime">11:30 — 12:15</div>
          <div style={{flex:1}}><div className="lname">التربية البدنية</div><div className="lteacher">أ. فهد الشمري</div></div>
          <span className="badge bp">قادمة</span>
        </div>
      </div>

      {/* رسائل المعلمين + تنبيهات */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>

        {/* رسائل المعلمين */}
        <div className="card" style={{marginBottom:0}}>
          <div className="ch">
            <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bl)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>رسائل المعلمين <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px',marginRight:'3px'}}>2</span></div>
            <button className="cl" onClick={() => {openModal('msg-modal')}} style={{color:'var(--bl)'}}>رد</button>
          </div>
          <div className="msg">
            <div className="munread"></div>
            <div className="mv" style={{background:'rgba(96,165,250,.1)',color:'var(--bl)'}}>م</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>أ. محمد الغامدي — رياضيات</div>
              <div style={{fontSize:'10.5px',color:'var(--or)',fontWeight:600,marginTop:'1px'}}>⚠ فهد لم يسلّم واجب الجمعة</div>
              <div style={{fontSize:'10.5px',color:'var(--tm)'}}>يرجى المتابعة وتسليمه غداً</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)'}}>أمس</div>
          </div>
          <div className="msg" style={{borderBottom:'none'}}>
            <div className="munread"></div>
            <div className="mv" style={{background:'rgba(52,211,153,.1)',color:'var(--c)'}}>س</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>أ. سارة الزهراني — علوم</div>
              <div style={{fontSize:'10.5px',color:'var(--gr)',fontWeight:600,marginTop:'1px'}}>🌟 أداء ممتاز في مشروع العلوم</div>
              <div style={{fontSize:'10.5px',color:'var(--tm)'}}>حصل على أعلى درجة في الفصل</div>
            </div>
            <div style={{fontSize:'10px',color:'var(--tm)'}}>2 أيام</div>
          </div>
          <div style={{padding:'8px 13px',borderTop:'1px solid var(--b2)'}}>
            <button onClick={() => {openModal('msg-modal')}} style={{width:'100%',background:'var(--cd)',border:'1px solid var(--cb)',borderRadius:'7px',padding:'7px',color:'var(--c)',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>💬 راسل معلم</button>
          </div>
        </div>

        {/* السلوك والنقاط */}
        <div className="card" style={{marginBottom:0}}>
          <div className="ch">
            <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>السلوك والانضباط</div>
            <span className="badge bg">ممتاز ⭐</span>
          </div>
          <div style={{padding:'10px 13px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px',fontSize:'12px'}}>
              <span style={{color:'var(--tm)'}}>نقاط السلوك هذا الفصل</span>
              <span style={{color:'var(--pu)',fontWeight:700}}>45 / 50 نقطة</span>
            </div>
            <div className="pbar"><div className="pfill" style={{width:'90%',background:'var(--pu)'}}></div></div>
          </div>
          <div className="item">
            <div className="item-ic" style={{background:'rgba(16,185,129,.1)'}}>🌟</div>
            <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>مشاركة مميزة في الصف</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>أ. محمد الغامدي · أمس</div></div>
            <span className="badge bg">+3 نقاط</span>
          </div>
          <div className="item">
            <div className="item-ic" style={{background:'rgba(251,146,60,.1)'}}>⚠️</div>
            <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>تأخر عن الحصة</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الثلاثاء الماضي</div></div>
            <span className="badge bo">-1 نقطة</span>
          </div>
          <div className="item" style={{borderBottom:'none'}}>
            <div className="item-ic" style={{background:'rgba(212,168,67,.1)'}}>🏆</div>
            <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>طالب الأسبوع</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الأسبوع الماضي</div></div>
            <span className="badge bgd">+5 نقاط</span>
          </div>
        </div>

      </div>
    </div>

    {/* ROW: الدرجات + الواجبات + الاختبارات */}
    <div className="g3">

      {/* درجات المواد */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bl)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>درجات المواد</div>
          <button className="cl" style={{color:'var(--bl)'}}>الكل</button>
        </div>
        <div className="tw"><table>
          <thead><tr><th>المادة</th><th>الدرجة</th><th>التقدير</th></tr></thead>
          <tbody>
            <tr><td style={{fontWeight:600,color:'var(--t)'}}>الرياضيات</td><td style={{color:'var(--gr)',fontWeight:700}}>92/100</td><td><span className="badge bg">ممتاز</span></td></tr>
            <tr><td style={{fontWeight:600,color:'var(--t)'}}>العلوم</td><td style={{color:'var(--gr)',fontWeight:700}}>95/100</td><td><span className="badge bg">ممتاز</span></td></tr>
            <tr><td style={{fontWeight:600,color:'var(--t)'}}>اللغة العربية</td><td style={{color:'var(--bl)',fontWeight:700}}>78/100</td><td><span className="badge bb">جيد جداً</span></td></tr>
            <tr><td style={{fontWeight:600,color:'var(--t)'}}>التربية الإسلامية</td><td style={{color:'var(--gr)',fontWeight:700}}>90/100</td><td><span className="badge bg">ممتاز</span></td></tr>
            <tr><td style={{fontWeight:600,color:'var(--t)'}}>اللغة الإنجليزية</td><td style={{color:'var(--or)',fontWeight:700}}>72/100</td><td><span className="badge bo">جيد</span></td></tr>
          </tbody>
        </table></div>
      </div>

      {/* الواجبات المنزلية */}
      <div className="card" style={{marginBottom:0}}>
        <div className="ch">
          <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>الواجبات المنزلية</div>
          <span style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)',color:'var(--or)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px'}}>3 معلّقة</span>
        </div>
        <div className="item" style={{background:'rgba(239,68,68,.03)'}}>
          <div className="item-ic" style={{background:'rgba(239,68,68,.1)'}}>📐</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>واجب الرياضيات</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>ص 45 — تسليم غداً</div></div>
          <span className="badge br">متأخر!</span>
        </div>
        <div className="item">
          <div className="item-ic" style={{background:'rgba(251,146,60,.1)'}}>📖</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>قراءة العربي</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الدرس السابع — بعد يومين</div></div>
          <span className="badge bo">قريباً</span>
        </div>
        <div className="item">
          <div className="item-ic" style={{background:'rgba(96,165,250,.1)'}}>🔬</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>تقرير العلوم</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>تجربة المياه — نهاية الأسبوع</div></div>
          <span className="badge bb">5 أيام</span>
        </div>
        <div className="item" style={{borderBottom:'none'}}>
          <div className="item-ic" style={{background:'rgba(16,185,129,.1)'}}>✅</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--td)'}}>حفظ الأناشيد</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>سُلّم أمس</div></div>
          <span className="badge bg">منتهي ✓</span>
        </div>
      </div>

      {/* الاختبارات القادمة + الرسوم */}
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        <div className="card" style={{marginBottom:0}}>
          <div className="ch">
            <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--pu)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>الاختبارات القادمة</div>
          </div>
          <div className="item">
            <div style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)',borderRadius:'7px',padding:'5px 8px',textAlign:'center',flexShrink:0,minWidth:'36px'}}><div style={{fontSize:'14px',fontWeight:800,color:'var(--pu)',lineHeight:1}}>30</div><div style={{fontSize:'7.5px',color:'var(--tm)'}}>مارس</div></div>
            <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>اختبار الرياضيات</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الضرب والقسمة · 30 درجة</div></div>
            <span className="badge bp">غداً</span>
          </div>
          <div className="item" style={{borderBottom:'none'}}>
            <div style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'7px',padding:'5px 8px',textAlign:'center',flexShrink:0,minWidth:'36px'}}><div style={{fontSize:'14px',fontWeight:800,color:'var(--bl)',lineHeight:1}}>05</div><div style={{fontSize:'7.5px',color:'var(--tm)'}}>أبريل</div></div>
            <div style={{flex:1}}><div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>اختبار العلوم</div><div style={{fontSize:'10.5px',color:'var(--tm)'}}>الفصل الثاني · 40 درجة</div></div>
            <span className="badge bb">8 أيام</span>
          </div>
        </div>

        {/* الرسوم */}
        <div className="card" style={{marginBottom:0}}>
          <div className="ch">
            <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>الرسوم الدراسية</div>
            <span className="badge br">معلقة</span>
          </div>
          <div style={{padding:'12px 13px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
              <span style={{fontSize:'12px',color:'var(--tm)'}}>رسوم الفصل الثاني</span>
              <span style={{fontSize:'18px',fontWeight:800,color:'var(--rd)'}}>2,500 SAR</span>
            </div>
            <div className="pbar" style={{marginBottom:'8px'}}><div className="pfill" style={{width:'40%',background:'var(--gr)'}}></div></div>
            <div style={{fontSize:'10.5px',color:'var(--tm)',marginBottom:'10px'}}>تم دفع 1,500 · المتبقي 1,000 SAR</div>
            <button onClick={() => {openModal('pay-modal')}} style={{width:'100%',background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'8px',padding:'9px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)'}}>💳 دفع المتبقي الآن</button>
          </div>
        </div>
      </div>
    </div>

    {/* QUICK ACTIONS */}
    <div>
      <div style={{color:'var(--tm)',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>خدمات ولي الأمر</div>
      <div className="qg">
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>🗺️</div><span className="ql">GPS الباص</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}>📍</div><span className="ql">GPS الجوال</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>✅</div><span className="ql">الحضور</span></a>
        <a className="qi" href="#" onClick={() => {openModal('excuse-modal')}}><div className="qic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📋</div><span className="ql">تقديم عذر</span></a>
        <a className="qi" href="#" onClick={() => {openModal('msg-modal')}}><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>💬</div><span className="ql">راسل المعلم</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📊</div><span className="ql">الدرجات</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📚</div><span className="ql">الواجبات</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>🛡️</div><span className="ql">السلوك</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>📝</div><span className="ql">الاختبارات</span></a>
        <a className="qi" href="#" onClick={() => {openModal('pay-modal')}}><div className="qic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>💳</div><span className="ql">دفع الرسوم</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>🏆</div><span className="ql">التقييم</span></a>
        <a className="qi" href="#"><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid rgba(212,168,67,.2)'}}>📅</div><span className="ql">الجدول</span></a>
      </div>
    </div>

  </div>

  <footer className="ft">
    <p>© 2026 متين — بوابة ولي الأمر · مدرسة الأمل الدولية</p>
    <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
  </footer>
</div>
    </div>
  );
}