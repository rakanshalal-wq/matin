'use client';
import React, { useState } from 'react';
import '../../../styles/school-owner.css';

export default function SchoolOwnerPage() {
  const [activeUnit, setActiveUnit] = useState<'all' | 'school' | 'kg' | 'nursery'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addUnitModal, setAddUnitModal] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<'school' | 'kg' | 'nursery'>('school');

  const hdrTitles: Record<string, string> = {
    all: 'مدرسة الأمل الدولية — نظرة شاملة',
    school: 'مدرسة الأمل — ابتدائي + متوسط',
    kg: 'روضة الأمل — KG1 · KG2 · KG3',
    nursery: 'حضانة الأمل — شهرين حتى 3 سنوات',
  };

  return (
    <div className="dashboard-page">

      {/* OVERLAY */}
      <div
        className={`ov${sidebarOpen ? ' show' : ''}`}
        id="ov"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* ADD UNIT MODAL */}
      <div className={`modal-bg${addUnitModal ? ' show' : ''}`} id="add-unit-modal">
        <div className="modal">
          <div className="mh">
            <div className="mt">🏫 إضافة وحدة تعليمية جديدة</div>
            <button className="mx" onClick={() => setAddUnitModal(false)}>×</button>
          </div>
          <div style={{padding:'16px'}}>

            {/* نوع الوحدة */}
            <div style={{fontSize:'11px',color:'var(--tm)',fontWeight:700,marginBottom:'10px'}}>اختر نوع الوحدة</div>
            <div className="unit-picker">
              <div
                className={`unit-pick${selectedUnitType === 'school' ? ' sel' : ''}`}
                id="pick-school"
                onClick={() => setSelectedUnitType('school')}
              >
                <div className="unit-pick-ic">🏫</div>
                <div className="unit-pick-n">مدرسة</div>
                <div className="unit-pick-s">ابتدائي · متوسط · ثانوي</div>
              </div>
              <div
                className={`unit-pick${selectedUnitType === 'kg' ? ' sel' : ''}`}
                id="pick-kg"
                onClick={() => setSelectedUnitType('kg')}
              >
                <div className="unit-pick-ic">🌱</div>
                <div className="unit-pick-n">روضة أطفال</div>
                <div className="unit-pick-s">KG1 · KG2 · KG3 · تمهيدي</div>
              </div>
              <div
                className={`unit-pick${selectedUnitType === 'nursery' ? ' sel' : ''}`}
                id="pick-nursery"
                onClick={() => setSelectedUnitType('nursery')}
              >
                <div className="unit-pick-ic">🍼</div>
                <div className="unit-pick-n">حضانة</div>
                <div className="unit-pick-s">من شهرين حتى 3 سنوات</div>
              </div>
            </div>

            {/* تفاصيل الوحدة */}
            <div id="unit-details">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
                <div>
                  <label className="flbl" htmlFor="unit-name">اسم الوحدة</label>
                  <input
                    className="finp"
                    id="unit-name"
                    type="text"
                    placeholder={
                      selectedUnitType === 'school' ? 'مثال: مدرسة جديدة' :
                      selectedUnitType === 'kg' ? 'مثال: روضة أطفال جديدة' :
                      'مثال: حضانة جديدة'
                    }
                    style={{marginBottom:0}}
                  />
                </div>
                <div>
                  <label className="flbl">ترتبط بـ (الفرع)</label>
                  <select className="finp" style={{marginBottom:0}}>
                    <option>الفرع الرئيسي — النزهة</option>
                    <option>فرع الروضة</option>
                    <option>فرع العليا</option>
                    <option>مستقلة</option>
                  </select>
                </div>
              </div>
              <div style={{height:'10px'}}></div>

              {/* ما يتغير حسب النوع */}
              <div id="unit-type-fields">

                {/* school fields */}
                <div id="fields-school" style={{display: selectedUnitType === 'school' ? 'block' : 'none'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                    <div>
                      <label className="flbl">المراحل</label>
                      <select className="finp" style={{marginBottom:0}}>
                        <option>ابتدائي فقط</option>
                        <option>متوسط فقط</option>
                        <option>ثانوي فقط</option>
                        <option>ابتدائي + متوسط</option>
                        <option>الكل</option>
                      </select>
                    </div>
                    <div>
                      <label className="flbl">عدد الفصول</label>
                      <input className="finp" type="number" placeholder="12" style={{marginBottom:0}} />
                    </div>
                    <div>
                      <label className="flbl">الطاقة الاستيعابية</label>
                      <input className="finp" type="number" placeholder="360" style={{marginBottom:0}} />
                    </div>
                  </div>
                </div>

                {/* kg fields */}
                <div id="fields-kg" style={{display: selectedUnitType === 'kg' ? 'block' : 'none'}}>
                  <div style={{background:'rgba(52,211,153,.06)',border:'1px solid rgba(52,211,153,.18)',borderRadius:'9px',padding:'10px 13px',marginBottom:'10px',fontSize:'11.5px',color:'var(--td)'}}>
                    🌱 <strong style={{color:'var(--c)'}}>الروضة</strong> — التقييم يتحول لـ <strong>تقرير نمو</strong> بدل الدرجات · الواجبات تصير <strong>أنشطة منزلية</strong> · التواصل مع الأهل <strong>يومي</strong>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                    <div>
                      <label className="flbl">المستويات المتاحة</label>
                      <select className="finp" style={{marginBottom:0}}>
                        <option>KG1 فقط</option>
                        <option>KG1 + KG2</option>
                        <option>KG1 + KG2 + KG3</option>
                        <option>تمهيدي + KG1 + KG2 + KG3</option>
                      </select>
                    </div>
                    <div>
                      <label className="flbl">الطاقة الاستيعابية</label>
                      <input className="finp" type="number" placeholder="80" style={{marginBottom:0}} />
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                    <div>
                      <label className="flbl">وقت الدوام</label>
                      <input className="finp" type="text" placeholder="7:30 ص — 12:30 م" style={{marginBottom:0}} />
                    </div>
                    <div>
                      <label className="flbl">وقت القيلولة</label>
                      <input className="finp" type="text" placeholder="11:00 ص — 11:30 ص" style={{marginBottom:0}} />
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'2px'}}>
                    <div>
                      <label className="flbl">رسوم القبول</label>
                      <input className="finp" type="number" placeholder="500 SAR" style={{marginBottom:0}} />
                    </div>
                    <div>
                      <label className="flbl">الرسوم الفصلية</label>
                      <input className="finp" type="number" placeholder="4500 SAR" style={{marginBottom:0}} />
                    </div>
                  </div>
                </div>

                {/* nursery fields */}
                <div id="fields-nursery" style={{display: selectedUnitType === 'nursery' ? 'block' : 'none'}}>
                  <div style={{background:'rgba(251,146,60,.06)',border:'1px solid rgba(251,146,60,.2)',borderRadius:'9px',padding:'10px 13px',marginBottom:'10px',fontSize:'11.5px',color:'var(--td)'}}>
                    🍼 <strong style={{color:'var(--or)'}}>الحضانة</strong> — تقرير يومي مفصّل · رسوم <strong>شهرية</strong> · تواصل فوري مع الأهل · يحتاج <strong>مربية + ممرضة</strong>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                    <div>
                      <label className="flbl">الفئة العمرية</label>
                      <select className="finp" style={{marginBottom:0}}>
                        <option>من شهرين — سنة</option>
                        <option>من شهرين — سنتين</option>
                        <option>من شهرين — 3 سنوات</option>
                        <option>سنة — 3 سنوات</option>
                      </select>
                    </div>
                    <div>
                      <label className="flbl">الطاقة الاستيعابية</label>
                      <input className="finp" type="number" placeholder="30" style={{marginBottom:0}} />
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'10px'}}>
                    <div>
                      <label className="flbl">ساعات العمل</label>
                      <input className="finp" type="text" placeholder="7:00 ص — 5:00 م" style={{marginBottom:0}} />
                    </div>
                    <div>
                      <label className="flbl">الرسوم الشهرية</label>
                      <input className="finp" type="number" placeholder="1800 SAR" style={{marginBottom:0}} />
                    </div>
                  </div>
                  <label className="flbl">الخدمات المتاحة</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px'}}>
                    {['وجبات','قيلولة','أنشطة ترفيهية','كاميرات مراقبة','تقرير يومي للأهل','ممرضة متخصصة'].map(s => (
                      <label key={s} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'11.5px',color:'var(--td)',cursor:'pointer'}}>
                        <input type="checkbox" defaultChecked style={{accentColor:'var(--c)'}} /> {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* مشترك: الرسوم والموظفون */}
              <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'9px',padding:'12px',marginBottom:'14px'}}>
                <div style={{fontSize:'11px',color:'var(--c)',fontWeight:700,marginBottom:'8px'}}>⚡ سيتم تلقائياً عند الإضافة</div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px',fontSize:'11.5px',color:'var(--td)'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> إنشاء تبويب مستقل في النظام</div>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> إعداد نماذج التقييم والتقارير المناسبة</div>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> ربط الوحدة بالموارد البشرية والمالية</div>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> تفعيل بوابة ولي الأمر للوحدة الجديدة</div>
                  <div style={{display:'flex',alignItems:'center',gap:'7px'}}><span style={{color:'var(--gr)'}}>✓</span> إضافة الوحدة لتبويبات الموارد البشرية</div>
                </div>
              </div>
            </div>

            <div style={{display:'flex',gap:'8px'}}>
              <button
                onClick={() => setAddUnitModal(false)}
                style={{flex:1,background:'rgba(255,255,255,.05)',border:'1px solid var(--b1)',borderRadius:'9px',padding:'11px',color:'var(--td)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}
              >إلغاء</button>
              <button
                onClick={() => setAddUnitModal(false)}
                style={{flex:2,background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'11px',color:'#fff',fontWeight:800,fontSize:'13px',cursor:'pointer',fontFamily:'var(--f)'}}
              >إضافة الوحدة ←</button>
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`sb${sidebarOpen ? ' open' : ''}`} id="sb">
        <div className="sb-top">
          <a className="logo-r" href="#">
            <div className="li">م</div>
            <div><div className="lt">متين</div><div className="ls">لوحة مالك المدرسة</div></div>
          </a>
          <div className="own-card">
            <div className="own-av">👨‍💼</div>
            <div style={{minWidth:0}}>
              <div className="own-n">أحمد المطيري</div>
              <div className="own-r">مالك مدرسة الأمل الدولية</div>
            </div>
          </div>
          <div className="units-lbl">وحداتي التعليمية</div>
          <div id="sb-units">
            <div
              className={`unit-item${activeUnit === 'all' ? ' active' : ''}`}
              onClick={() => setActiveUnit('all')}
            >
              <div className="unit-ic" style={{background:'var(--cd)'}}>🏫</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="unit-n">جميع الوحدات</div>
                <div className="unit-cnt">3 وحدات · 486 طالب</div>
              </div>
              <span className="unit-badge" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}}>كل</span>
            </div>
            <div
              className={`unit-item${activeUnit === 'school' ? ' active' : ''}`}
              onClick={() => setActiveUnit('school')}
            >
              <div className="unit-ic" style={{background:'rgba(96,165,250,.12)'}}>🏫</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="unit-n">مدرسة الأمل</div>
                <div className="unit-cnt">ابتدائي + متوسط · 380 طالب</div>
              </div>
              <span className="unit-badge" style={{background:'rgba(96,165,250,.1)',color:'var(--bl)',border:'1px solid rgba(96,165,250,.2)'}}>مدرسة</span>
            </div>
            <div
              className={`unit-item${activeUnit === 'kg' ? ' active' : ''}`}
              onClick={() => setActiveUnit('kg')}
            >
              <div className="unit-ic" style={{background:'rgba(52,211,153,.12)'}}>🌱</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="unit-n">روضة الأمل</div>
                <div className="unit-cnt">KG1-KG3 · 76 طفل</div>
              </div>
              <span className="unit-badge" style={{background:'rgba(52,211,153,.1)',color:'var(--gr)',border:'1px solid rgba(52,211,153,.2)'}}>روضة</span>
            </div>
            <div
              className={`unit-item${activeUnit === 'nursery' ? ' active' : ''}`}
              onClick={() => setActiveUnit('nursery')}
            >
              <div className="unit-ic" style={{background:'rgba(251,146,60,.12)'}}>🍼</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="unit-n">حضانة الأمل</div>
                <div className="unit-cnt">شهرين — 3 سنوات · 30 طفل</div>
              </div>
              <span className="unit-badge" style={{background:'rgba(251,146,60,.1)',color:'var(--or)',border:'1px solid rgba(251,146,60,.2)'}}>حضانة</span>
            </div>
            <div
              className="unit-item"
              id="add-unit-btn"
              onClick={() => setAddUnitModal(true)}
              style={{borderStyle:'dashed',justifyContent:'center'}}
            >
              <span style={{fontSize:'13px'}}>➕</span>
              <span style={{fontSize:'11.5px',color:'var(--c)',fontWeight:600}}>إضافة وحدة جديدة</span>
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            الإحصائيات والتقارير
          </a>

          <div className="ng">إدارة الوحدات</div>
          <a className="ni" href="#" onClick={(e) => { e.preventDefault(); setAddUnitModal(true); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span style={{color:'var(--c)',fontWeight:600}}>+ إضافة وحدة</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            إعدادات الوحدات
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            الجداول الدراسية
          </a>

          <div className="ng">الموظفون</div>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            الموارد البشرية <span className="nb nb-c">86</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            🔐 الصلاحيات
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
            العقود <span className="nb nb-r">6</span>
          </a>

          <div className="ng">الطلاب</div>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
            طلاب المدرسة <span className="nb nb-c">380</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            أطفال الروضة <span className="nb nb-c">76</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
            أطفال الحضانة <span className="nb nb-c">30</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/></svg>
            طلبات القبول <span className="nb nb-r">14</span>
          </a>

          <div className="ng">المالية</div>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            الإيرادات والرسوم
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            الرسوم المعلقة <span className="nb nb-r">38K</span>
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>
            المنح والإعفاءات
          </a>

          <div className="ng">النقل</div>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            الباصات المدرسية
          </a>

          <div className="ng">الإعدادات</div>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            إعدادات المدرسة
          </a>
          <a className="ni" href="#">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            الاشتراك والباقة
          </a>
        </nav>

        <div className="sb-ft">
          <button className="lo">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            تسجيل الخروج
          </button>
          <div style={{marginTop:'6px',color:'rgba(238,238,245,.14)',fontSize:'10px',textAlign:'center'}}>متين v6 — مدرسة الأمل الدولية</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="hdr">
          <div className="hl">
            <button className="mb" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div>
              <div className="ht" id="hdr-title">{hdrTitles[activeUnit]}</div>
              <div className="hs">3 وحدات تعليمية · 486 طالب وطفل · الفصل الثاني 1445/1446</div>
            </div>
          </div>
          <div className="hr2">
            <div className="hb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="nd"></span>
            </div>
            <button
              onClick={() => setAddUnitModal(true)}
              style={{background:'linear-gradient(135deg,var(--c),var(--c2))',border:'none',borderRadius:'9px',padding:'7px 14px',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:'var(--f)',display:'flex',alignItems:'center',gap:'6px'}}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              إضافة وحدة
            </button>
            <div className="ub">
              <div className="ua">👨‍💼</div>
              <div className="ui">
                <div className="un">أحمد المطيري</div>
                <div className="ur">مالك المدرسة</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        {/* UNIT TABS */}
        <div className="unit-tabs" id="unit-tabs">
          <button
            className={`utab${activeUnit === 'all' ? ' active' : ''}`}
            data-uid="all"
            onClick={() => setActiveUnit('all')}
            style={activeUnit === 'all' ? {color:'var(--c)',borderBottomColor:'var(--c)'} : {}}
          >🏫 جميع الوحدات</button>
          <button
            className={`utab${activeUnit === 'school' ? ' active' : ''}`}
            data-uid="school"
            onClick={() => setActiveUnit('school')}
            style={activeUnit === 'school' ? {color:'var(--c)',borderBottomColor:'var(--c)'} : {}}
          >🏫 مدرسة الأمل</button>
          <button
            className={`utab${activeUnit === 'kg' ? ' active' : ''}`}
            data-uid="kg"
            onClick={() => setActiveUnit('kg')}
            style={activeUnit === 'kg' ? {color:'var(--c)',borderBottomColor:'var(--c)'} : {}}
          >🌱 روضة الأمل</button>
          <button
            className={`utab${activeUnit === 'nursery' ? ' active' : ''}`}
            data-uid="nursery"
            onClick={() => setActiveUnit('nursery')}
            style={activeUnit === 'nursery' ? {color:'var(--c)',borderBottomColor:'var(--c)'} : {}}
          >🍼 حضانة الأمل</button>
          <button className="utab add-tab" onClick={() => setAddUnitModal(true)}>＋ إضافة وحدة</button>
        </div>

        <div className="con" id="main-con">

          {/* ALL UNITS VIEW */}
          <div id="view-all" style={{display: activeUnit === 'all' ? 'block' : 'none'}}>
            <div className="ph">
              <div>
                <div className="pt">🏫 نظرة شاملة — جميع الوحدات</div>
                <div className="ps">مدرسة + روضة + حضانة · كل شيء في مكان واحد</div>
              </div>
              <button className="btn-p" onClick={() => setAddUnitModal(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                + إضافة وحدة جديدة
              </button>
            </div>

            {/* STATS */}
            <div className="sg">
              <div className="sc">
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(52,211,153,.05),transparent 60%)',pointerEvents:'none'}}></div>
                <div className="si" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>👥</div>
                <div className="sv" style={{color:'var(--c)'}}>486</div>
                <div className="sl">إجمالي الطلاب والأطفال</div>
                <div className="ss" style={{color:'rgba(52,211,153,.6)'}}>380 + 76 + 30</div>
              </div>
              <div className="sc">
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(96,165,250,.05),transparent 60%)',pointerEvents:'none'}}></div>
                <div className="si" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>👩‍🏫</div>
                <div className="sv" style={{color:'var(--bl)'}}>86</div>
                <div className="sl">إجمالي الموظفين</div>
                <div className="ss" style={{color:'rgba(96,165,250,.6)'}}>معلمون + خدمات</div>
              </div>
              <div className="sc">
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(212,168,67,.05),transparent 60%)',pointerEvents:'none'}}></div>
                <div className="si" style={{background:'var(--gdd)',border:'1px solid var(--gdb)'}}>💰</div>
                <div className="sv" style={{color:'var(--gd)'}}>1.2M</div>
                <div className="sl">الإيرادات الفصلية</div>
                <div className="ss" style={{color:'rgba(212,168,67,.6)'}}>SAR هذا الفصل</div>
              </div>
              <div className="sc">
                <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(239,68,68,.05),transparent 60%)',pointerEvents:'none'}}></div>
                <div className="si" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>📋</div>
                <div className="sv" style={{color:'var(--rd)'}}>14</div>
                <div className="sl">طلبات قبول معلقة</div>
                <div className="ss" style={{color:'rgba(239,68,68,.6)'}}>تحتاج مراجعة</div>
              </div>
            </div>

            {/* UNITS OVERVIEW CARDS */}
            <div className="g3">

              {/* مدرسة */}
              <div className="card" style={{marginBottom:0,cursor:'pointer'}} onClick={() => setActiveUnit('school')}>
                <div style={{padding:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'rgba(96,165,250,.12)',border:'1px solid rgba(96,165,250,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>🏫</div>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:800,color:'var(--t)'}}>مدرسة الأمل</div>
                      <div style={{fontSize:'11px',color:'var(--bl)',marginTop:'1px'}}>ابتدائي + متوسط</div>
                    </div>
                    <span className="badge bb" style={{marginRight:'auto'}}>نشطة</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--bl)'}}>380</div><div style={{fontSize:'10px',color:'var(--tm)'}}>طالب</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>54</div><div style={{fontSize:'10px',color:'var(--tm)'}}>معلم</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>18</div><div style={{fontSize:'10px',color:'var(--tm)'}}>فصل دراسي</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>91%</div><div style={{fontSize:'10px',color:'var(--tm)'}}>نسبة الحضور</div></div>
                  </div>
                  <div style={{fontSize:'11px',color:'var(--tm)',marginBottom:'4px'}}>الطاقة الاستيعابية</div>
                  <div className="pbar"><div className="pfill" style={{width:'84%',background:'var(--bl)'}}></div></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--tm)',marginTop:'3px'}}><span>380 طالب</span><span style={{color:'var(--bl)'}}>84% ممتلئة</span></div>
                </div>
                <div style={{padding:'8px 14px',background:'rgba(96,165,250,.04)',borderTop:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'11px',color:'var(--bl)',fontWeight:600}}>📊 عرض التفاصيل ←</span>
                  <span style={{fontSize:'10px',color:'var(--tm)'}}>رسوم: 680K SAR</span>
                </div>
              </div>

              {/* روضة */}
              <div className="card" style={{marginBottom:0,cursor:'pointer'}} onClick={() => setActiveUnit('kg')}>
                <div style={{padding:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'rgba(52,211,153,.12)',border:'1px solid rgba(52,211,153,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>🌱</div>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:800,color:'var(--t)'}}>روضة الأمل</div>
                      <div style={{fontSize:'11px',color:'var(--gr)',marginTop:'1px'}}>KG1 · KG2 · KG3</div>
                    </div>
                    <span className="badge bg" style={{marginRight:'auto'}}>نشطة</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>76</div><div style={{fontSize:'10px',color:'var(--tm)'}}>طفل</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>18</div><div style={{fontSize:'10px',color:'var(--tm)'}}>معلمة + مساعدة</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--c)'}}>3</div><div style={{fontSize:'10px',color:'var(--tm)'}}>مستويات (KG1-3)</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gr)'}}>95%</div><div style={{fontSize:'10px',color:'var(--tm)'}}>نسبة الحضور</div></div>
                  </div>
                  {/* تقييم نمو بدل الدرجات */}
                  <div style={{background:'rgba(52,211,153,.06)',border:'1px solid rgba(52,211,153,.18)',borderRadius:'7px',padding:'8px 10px',marginBottom:'8px'}}>
                    <div style={{fontSize:'10px',color:'var(--c)',fontWeight:700,marginBottom:'4px'}}>📊 نظام التقييم الخاص</div>
                    <div style={{fontSize:'10.5px',color:'var(--td)'}}>تقرير نمو يومي · لا درجات · أنشطة منزلية بدل واجبات</div>
                  </div>
                  <div className="pbar"><div className="pfill" style={{width:'76%',background:'var(--gr)'}}></div></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--tm)',marginTop:'3px'}}><span>76 طفل</span><span style={{color:'var(--gr)'}}>76% ممتلئة</span></div>
                </div>
                <div style={{padding:'8px 14px',background:'rgba(52,211,153,.04)',borderTop:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'11px',color:'var(--gr)',fontWeight:600}}>📊 عرض التفاصيل ←</span>
                  <span style={{fontSize:'10px',color:'var(--tm)'}}>رسوم: 342K SAR</span>
                </div>
              </div>

              {/* حضانة */}
              <div className="card" style={{marginBottom:0,cursor:'pointer'}} onClick={() => setActiveUnit('nursery')}>
                <div style={{padding:'14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                    <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'rgba(251,146,60,.12)',border:'1px solid rgba(251,146,60,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>🍼</div>
                    <div>
                      <div style={{fontSize:'14px',fontWeight:800,color:'var(--t)'}}>حضانة الأمل</div>
                      <div style={{fontSize:'11px',color:'var(--or)',marginTop:'1px'}}>شهرين — 3 سنوات</div>
                    </div>
                    <span className="badge bo" style={{marginRight:'auto'}}>نشطة</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>30</div><div style={{fontSize:'10px',color:'var(--tm)'}}>طفل</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--or)'}}>14</div><div style={{fontSize:'10px',color:'var(--tm)'}}>مربية + ممرضة</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--cy)'}}>7:00—5م</div><div style={{fontSize:'10px',color:'var(--tm)'}}>ساعات العمل</div></div>
                    <div style={{background:'rgba(255,255,255,.02)',border:'1px solid var(--b2)',borderRadius:'7px',padding:'8px',textAlign:'center'}}><div style={{fontSize:'18px',fontWeight:800,color:'var(--gd)'}}>1800</div><div style={{fontSize:'10px',color:'var(--tm)'}}>SAR/شهر</div></div>
                  </div>
                  {/* تقرير يومي */}
                  <div style={{background:'rgba(251,146,60,.06)',border:'1px solid rgba(251,146,60,.18)',borderRadius:'7px',padding:'8px 10px',marginBottom:'8px'}}>
                    <div style={{fontSize:'10px',color:'var(--or)',fontWeight:700,marginBottom:'4px'}}>📋 نظام التقييم الخاص</div>
                    <div style={{fontSize:'10.5px',color:'var(--td)'}}>تقرير يومي مفصّل · رسوم شهرية · تواصل فوري مع الأهل</div>
                  </div>
                  <div className="pbar"><div className="pfill" style={{width:'100%',background:'var(--or)'}}></div></div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--tm)',marginTop:'3px'}}><span>30 طفل</span><span style={{color:'var(--rd)',fontWeight:700}}>100% ممتلئة — قائمة انتظار</span></div>
                </div>
                <div style={{padding:'8px 14px',background:'rgba(251,146,60,.04)',borderTop:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'11px',color:'var(--or)',fontWeight:600}}>📊 عرض التفاصيل ←</span>
                  <span style={{fontSize:'10px',color:'var(--tm)'}}>رسوم: 54K SAR/شهر</span>
                </div>
              </div>
            </div>

            {/* إضافة وحدة جديدة */}
            <div className="add-unit-card" onClick={() => setAddUnitModal(true)}>
              <div style={{fontSize:'36px',marginBottom:'10px'}}>➕</div>
              <div style={{fontSize:'14px',fontWeight:700,color:'var(--c)',marginBottom:'5px'}}>إضافة وحدة تعليمية جديدة</div>
              <div style={{fontSize:'12px',color:'var(--tm)',maxWidth:'320px',margin:'0 auto'}}>هل تريد إضافة مدرسة جديدة، روضة أطفال، أو حضانة؟<br />كل شيء يُضبط تلقائياً حسب نوع الوحدة</div>
              <div style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'14px'}}>
                <div style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)',borderRadius:'9px',padding:'8px 16px',fontSize:'12px',color:'var(--bl)',fontWeight:600}}>🏫 مدرسة</div>
                <div style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)',borderRadius:'9px',padding:'8px 16px',fontSize:'12px',color:'var(--gr)',fontWeight:600}}>🌱 روضة</div>
                <div style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)',borderRadius:'9px',padding:'8px 16px',fontSize:'12px',color:'var(--or)',fontWeight:600}}>🍼 حضانة</div>
              </div>
            </div>

            {/* قبول معلق + مالية */}
            <div className="g2">
              <div className="card" style={{marginBottom:0}}>
                <div className="ch">
                  <div className="ct">📝 طلبات القبول المعلقة <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px',marginRight:'3px'}}>14</span></div>
                  <button className="cl">الكل</button>
                </div>
                <div className="tw">
                  <table>
                    <thead>
                      <tr><th>الاسم</th><th>الوحدة</th><th>العمر</th><th>الحالة</th><th></th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{fontWeight:600,color:'var(--t)'}}>ياسر الشمري</td>
                        <td><span className="badge bb">مدرسة</span></td>
                        <td style={{color:'var(--tm)'}}>6 سنوات</td>
                        <td><span className="badge bo">قيد المراجعة</span></td>
                        <td><div style={{display:'flex',gap:'3px'}}><button className="btn-sm" style={{background:'rgba(16,185,129,.08)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>قبول</button><button className="btn-sm" style={{background:'rgba(239,68,68,.08)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.2)'}}>رفض</button></div></td>
                      </tr>
                      <tr>
                        <td style={{fontWeight:600,color:'var(--t)'}}>ليلى الحربي</td>
                        <td><span className="badge bg">روضة</span></td>
                        <td style={{color:'var(--tm)'}}>4 سنوات</td>
                        <td><span className="badge bo">قيد المراجعة</span></td>
                        <td><div style={{display:'flex',gap:'3px'}}><button className="btn-sm" style={{background:'rgba(16,185,129,.08)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>قبول</button><button className="btn-sm" style={{background:'rgba(239,68,68,.08)',color:'var(--rd)',border:'1px solid rgba(239,68,68,.2)'}}>رفض</button></div></td>
                      </tr>
                      <tr>
                        <td style={{fontWeight:600,color:'var(--t)'}}>سلطان الغامدي</td>
                        <td><span className="badge bo">حضانة</span></td>
                        <td style={{color:'var(--tm)'}}>8 أشهر</td>
                        <td><span className="badge bc">قائمة انتظار</span></td>
                        <td><span style={{fontSize:'10px',color:'var(--tm)'}}>ممتلئة</span></td>
                      </tr>
                      <tr>
                        <td style={{fontWeight:600,color:'var(--t)'}}>نوف المطيري</td>
                        <td><span className="badge bg">روضة</span></td>
                        <td style={{color:'var(--tm)'}}>3 سنوات</td>
                        <td><span className="badge bg">مقبول ✓</span></td>
                        <td><span style={{fontSize:'10px',color:'var(--tm)'}}>—</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card" style={{marginBottom:0}}>
                <div className="ch"><div className="ct">💰 الإيرادات حسب الوحدة</div></div>
                <div style={{padding:'14px'}}>
                  {[
                    {name:'🏫 مدرسة الأمل', value:'680,000', color:'#60A5FA', pct:57},
                    {name:'🌱 روضة الأمل', value:'342,000', color:'#10B981', pct:28},
                    {name:'🍼 حضانة الأمل', value:'54,000', color:'#FB923C', pct:15},
                  ].map(({name, value, color, pct}) => (
                    <div key={name} style={{marginBottom:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',marginBottom:'4px'}}>
                        <span style={{color:'var(--td)'}}>{name}</span>
                        <strong style={{color}}>{value} SAR</strong>
                      </div>
                      <div className="pbar"><div className="pfill" style={{width:`${pct}%`,background:color}}></div></div>
                    </div>
                  ))}
                  <div style={{borderTop:'1px solid var(--b2)',paddingTop:'10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontSize:'12px',color:'var(--tm)'}}>الإجمالي هذا الفصل</span>
                    <strong style={{color:'var(--gd)',fontSize:'16px'}}>1,076,000 SAR</strong>
                  </div>
                  <div style={{marginTop:'4px',fontSize:'11px',color:'var(--rd)'}}>رسوم معلقة: 38,000 SAR من 22 طالب/طفل</div>
                </div>
              </div>
            </div>

          </div>

          {/* SCHOOL VIEW */}
          <div id="view-school" style={{display: activeUnit === 'school' ? 'block' : 'none'}}>
            <div className="ph">
              <div><div className="pt">🏫 مدرسة الأمل — ابتدائي + متوسط</div><div className="ps">380 طالب · 18 فصل · 54 معلم</div></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button className="btn-o" onClick={() => setActiveUnit('all')}>← الكل</button>
                <button className="btn-p">+ قبول طالب</button>
              </div>
            </div>
            <div className="sg">
              <div className="sc"><div className="si" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>👥</div><div className="sv" style={{color:'var(--bl)'}}>380</div><div className="sl">طلاب</div><div className="ss" style={{color:'rgba(96,165,250,.6)'}}>18 فصل</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>✅</div><div className="sv" style={{color:'var(--gr)'}}>91%</div><div className="sl">نسبة الحضور</div><div className="ss" style={{color:'rgba(16,185,129,.6)'}}>346/380 اليوم</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>📝</div><div className="sv" style={{color:'var(--or)'}}>8</div><div className="sl">طلبات قبول</div><div className="ss" style={{color:'rgba(251,146,60,.6)'}}>معلقة</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(212,168,67,.1)',border:'1px solid var(--gdb)'}}>💰</div><div className="sv" style={{color:'var(--gd)'}}>680K</div><div className="sl">إيرادات الفصل</div><div className="ss" style={{color:'rgba(212,168,67,.6)'}}>SAR</div></div>
            </div>
            <div className="card">
              <div className="ch"><div className="ct">📊 الفصول الدراسية</div><button className="cl">+ فصل جديد</button></div>
              <div className="tw">
                <table>
                  <thead><tr><th>الفصل</th><th>المرحلة</th><th>المعلم المسؤول</th><th>الطلاب</th><th>الحضور اليوم</th></tr></thead>
                  <tbody>
                    <tr><td style={{fontWeight:600,color:'var(--t)'}}>الأول — أ</td><td><span className="badge bb">ابتدائي</span></td><td style={{color:'var(--tm)'}}>أ. محمد الغامدي</td><td style={{color:'var(--bl)',fontWeight:700}}>28</td><td><span className="badge bg">26/28 ✓</span></td></tr>
                    <tr><td style={{fontWeight:600,color:'var(--t)'}}>الأول — ب</td><td><span className="badge bb">ابتدائي</span></td><td style={{color:'var(--tm)'}}>أ. خالد النمر</td><td style={{color:'var(--bl)',fontWeight:700}}>26</td><td><span className="badge bg">25/26 ✓</span></td></tr>
                    <tr><td style={{fontWeight:600,color:'var(--t)'}}>الرابع — أ</td><td><span className="badge bb">ابتدائي</span></td><td style={{color:'var(--tm)'}}>أ. سارة الزهراني</td><td style={{color:'var(--bl)',fontWeight:700}}>30</td><td><span className="badge bo">27/30</span></td></tr>
                    <tr><td style={{fontWeight:600,color:'var(--t)'}}>الأول متوسط — أ</td><td><span className="badge bp">متوسط</span></td><td style={{color:'var(--tm)'}}>أ. هند الحربي</td><td style={{color:'var(--bl)',fontWeight:700}}>32</td><td><span className="badge bg">31/32 ✓</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* KG VIEW */}
          <div id="view-kg" style={{display: activeUnit === 'kg' ? 'block' : 'none'}}>
            <div className="ph">
              <div><div className="pt">🌱 روضة الأمل — KG1 · KG2 · KG3</div><div className="ps">76 طفل · 3 مستويات · تقرير نمو يومي</div></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button className="btn-o" onClick={() => setActiveUnit('all')}>← الكل</button>
                <button className="btn-p">+ قبول طفل</button>
              </div>
            </div>
            {/* KG notice */}
            <div style={{background:'rgba(52,211,153,.07)',border:'1px solid rgba(52,211,153,.2)',borderRadius:'11px',padding:'11px 14px',marginBottom:'13px',display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'12px',color:'var(--td)'}}>
              <span style={{fontSize:'18px',flexShrink:0}}>🌱</span>
              <div><strong style={{color:'var(--c)'}}>نظام الروضة مختلف:</strong> التقييم هنا <strong>تقرير نمو</strong> بدل الدرجات — يشمل: اللغة، الحركة، الاجتماعي، الإبداع. الواجبات <strong>أنشطة منزلية</strong>. وقت القيلولة <strong>11:00—11:30</strong>. التواصل مع الأهل <strong>يومي</strong>.</div>
            </div>
            <div className="sg">
              <div className="sc"><div className="si" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>👧</div><div className="sv" style={{color:'var(--gr)'}}>76</div><div className="sl">طفل مقيّد</div><div className="ss" style={{color:'rgba(52,211,153,.6)'}}>KG1: 28 · KG2: 26 · KG3: 22</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.2)'}}>✅</div><div className="sv" style={{color:'var(--gr)'}}>95%</div><div className="sl">نسبة الحضور</div><div className="ss" style={{color:'rgba(16,185,129,.6)'}}>72/76 اليوم</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>👩‍🏫</div><div className="sv" style={{color:'var(--pu)'}}>18</div><div className="sl">معلمة ومساعدة</div><div className="ss" style={{color:'rgba(167,139,250,.6)'}}>6 لكل مستوى</div></div>
              <div className="sc"><div className="si" style={{background:'var(--gdd)',border:'1px solid var(--gdb)'}}>💰</div><div className="sv" style={{color:'var(--gd)'}}>342K</div><div className="sl">إيرادات الفصل</div><div className="ss" style={{color:'rgba(212,168,67,.6)'}}>4,500 SAR/طفل</div></div>
            </div>
            <div className="g3">
              {([
                {level:'KG1', count:'28', icon:'🌸', desc:'أطفال 3-4 سنوات', bg:'rgba(52,211,153,.12)', color:'var(--gr)'},
                {level:'KG2', count:'26', icon:'🌻', desc:'أطفال 4-5 سنوات', bg:'rgba(96,165,250,.12)', color:'var(--bl)'},
                {level:'KG3', count:'22', icon:'🌟', desc:'أطفال 5-6 سنوات (تمهيدي)', bg:'rgba(167,139,250,.12)', color:'var(--pu)'},
              ] as {level:string;count:string;icon:string;desc:string;bg:string;color:string}[]).map(({level, count, icon, desc, bg, color}) => (
                <div className="card" style={{marginBottom:0}} key={level}>
                  <div style={{padding:'14px',textAlign:'center'}}>
                    <div style={{width:'48px',height:'48px',borderRadius:'12px',background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',margin:'0 auto 8px'}}>{icon}</div>
                    <div style={{fontSize:'15px',fontWeight:800,color:'var(--t)',marginBottom:'3px'}}>{level}</div>
                    <div style={{fontSize:'11px',color:'var(--tm)',marginBottom:'8px'}}>{desc}</div>
                    <div style={{fontSize:'26px',fontWeight:800,color,marginBottom:'3px'}}>{count}</div>
                    <div style={{fontSize:'10.5px',color:'var(--tm)'}}>طفل مقيّد</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NURSERY VIEW */}
          <div id="view-nursery" style={{display: activeUnit === 'nursery' ? 'block' : 'none'}}>
            <div className="ph">
              <div><div className="pt">🍼 حضانة الأمل — شهرين حتى 3 سنوات</div><div className="ps">30 طفل · مكتملة · قائمة انتظار نشطة</div></div>
              <div style={{display:'flex',gap:'8px'}}>
                <button className="btn-o" onClick={() => setActiveUnit('all')}>← الكل</button>
                <button className="btn-p">إدارة قائمة الانتظار</button>
              </div>
            </div>
            {/* Nursery notice */}
            <div style={{background:'rgba(251,146,60,.07)',border:'1px solid rgba(251,146,60,.2)',borderRadius:'11px',padding:'11px 14px',marginBottom:'13px',display:'flex',alignItems:'flex-start',gap:'10px',fontSize:'12px',color:'var(--td)'}}>
              <span style={{fontSize:'18px',flexShrink:0}}>🍼</span>
              <div><strong style={{color:'var(--or)'}}>نظام الحضانة مختلف:</strong> تقرير <strong>يومي مفصّل</strong> للأهل (أكل، نوم، نشاط، صحة). الرسوم <strong>شهرية</strong>. يحتاج مربية مخصصة + ممرضة. الطاقة الاستيعابية محدودة. الحضانة <strong>مكتملة حالياً</strong>.</div>
            </div>
            <div className="sg">
              <div className="sc"><div className="si" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>🍼</div><div className="sv" style={{color:'var(--or)'}}>30</div><div className="sl">طفل (مكتملة)</div><div className="ss" style={{color:'rgba(251,146,60,.6)'}}>شهرين — 3 سنوات</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>⏳</div><div className="sv" style={{color:'var(--rd)'}}>7</div><div className="sl">في قائمة الانتظار</div><div className="ss" style={{color:'rgba(239,68,68,.6)'}}>بانتظار مكان</div></div>
              <div className="sc"><div className="si" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>👩‍⚕️</div><div className="sv" style={{color:'var(--pu)'}}>14</div><div className="sl">مربية وممرضة</div><div className="ss" style={{color:'rgba(167,139,250,.6)'}}>نسبة 2:1 لكل طفل</div></div>
              <div className="sc"><div className="si" style={{background:'var(--gdd)',border:'1px solid var(--gdb)'}}>💰</div><div className="sv" style={{color:'var(--gd)'}}>54K</div><div className="sl">إيرادات شهرية</div><div className="ss" style={{color:'rgba(212,168,67,.6)'}}>1,800 SAR/طفل</div></div>
            </div>
            <div className="g2">
              <div className="card" style={{marginBottom:0}}>
                <div className="ch"><div className="ct">👶 أطفال الحضانة اليوم</div><span className="badge br">مكتملة</span></div>
                <div className="tw">
                  <table>
                    <thead><tr><th>الطفل</th><th>العمر</th><th>الحالة</th><th>التقرير</th></tr></thead>
                    <tbody>
                      <tr><td style={{fontWeight:600,color:'var(--t)'}}>ريان الزهراني</td><td style={{color:'var(--tm)'}}>8 أشهر</td><td><span className="badge bg">حاضر</span></td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}}>تقرير اليوم</button></td></tr>
                      <tr><td style={{fontWeight:600,color:'var(--t)'}}>دانة الحربي</td><td style={{color:'var(--tm)'}}>14 شهر</td><td><span className="badge bg">حاضر</span></td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}}>تقرير اليوم</button></td></tr>
                      <tr><td style={{fontWeight:600,color:'var(--t)'}}>عمر المطيري</td><td style={{color:'var(--tm)'}}>2.5 سنة</td><td><span className="badge bo">غائب</span></td><td><span style={{fontSize:'10px',color:'var(--tm)'}}>—</span></td></tr>
                      <tr><td style={{fontWeight:600,color:'var(--t)'}}>لجين الشمري</td><td style={{color:'var(--tm)'}}>18 شهر</td><td><span className="badge bg">حاضر</span></td><td><button className="btn-sm" style={{background:'var(--cd)',color:'var(--c)',border:'1px solid var(--cb)'}}>تقرير اليوم</button></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card" style={{marginBottom:0}}>
                <div className="ch">
                  <div className="ct">⏳ قائمة الانتظار <span style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',color:'var(--rd)',fontSize:'10px',fontWeight:700,padding:'2px 7px',borderRadius:'20px',marginRight:'3px'}}>7</span></div>
                </div>
                {([
                  {name:'سلطان الغامدي', age:'8 أشهر', date:'تقديم 15 مارس'},
                  {name:'هنا العتيبي', age:'6 أشهر', date:'تقديم 18 مارس'},
                  {name:'فارس الشمري', age:'10 أشهر', date:'تقديم 20 مارس'},
                ] as {name:string;age:string;date:string}[]).map(({name, age, date}) => (
                  <div className="item" key={name}>
                    <div className="item-ic" style={{background:'rgba(251,146,60,.1)'}}>⏳</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:'12px',fontWeight:600,color:'var(--t)'}}>{name}</div>
                      <div style={{fontSize:'10.5px',color:'var(--tm)'}}>{age} · {date}</div>
                    </div>
                    <button className="btn-sm" style={{background:'rgba(16,185,129,.08)',color:'var(--gr)',border:'1px solid rgba(16,185,129,.2)'}}>إدخال</button>
                  </div>
                ))}
                <div style={{padding:'8px 13px',textAlign:'center',fontSize:'11px',color:'var(--tm)'}}>+ 4 آخرون</div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div id="quick-actions">
            <div style={{color:'var(--tm)',fontSize:'10px',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'10px'}}>إجراءات سريعة</div>
            <div className="qg">
              <a className="qi" href="#" onClick={(e) => { e.preventDefault(); setAddUnitModal(true); }}><div className="qic" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>🏫</div><span className="ql">إضافة وحدة</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>📝</div><span className="ql">طلبات القبول</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(249,115,22,.1)',border:'1px solid rgba(249,115,22,.2)'}}>👥</div><span className="ql">الموارد البشرية</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid var(--gdb)'}}>💰</div><span className="ql">الإيرادات</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>💳</div><span className="ql">الرسوم المعلقة</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(167,139,250,.1)',border:'1px solid rgba(167,139,250,.2)'}}>🔐</div><span className="ql">الصلاحيات</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(34,211,238,.1)',border:'1px solid rgba(34,211,238,.2)'}}>📊</div><span className="ql">التقارير</span></a>
              <a className="qi" href="#" onClick={(e) => { e.preventDefault(); setActiveUnit('kg'); }}><div className="qic" style={{background:'rgba(52,211,153,.1)',border:'1px solid rgba(52,211,153,.2)'}}>🌱</div><span className="ql">روضة الأمل</span></a>
              <a className="qi" href="#" onClick={(e) => { e.preventDefault(); setActiveUnit('nursery'); }}><div className="qic" style={{background:'rgba(251,146,60,.1)',border:'1px solid rgba(251,146,60,.2)'}}>🍼</div><span className="ql">حضانة الأمل</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(96,165,250,.1)',border:'1px solid rgba(96,165,250,.2)'}}>🚌</div><span className="ql">الباصات</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(212,168,67,.1)',border:'1px solid var(--gdb)'}}>📅</div><span className="ql">التقويم</span></a>
              <a className="qi" href="#"><div className="qic" style={{background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)'}}>⚙️</div><span className="ql">الإعدادات</span></a>
            </div>
          </div>

        </div>

        <footer className="ft">
          <p>© 2026 متين — مدرسة الأمل الدولية</p>
          <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>

    </div>
  );
}
