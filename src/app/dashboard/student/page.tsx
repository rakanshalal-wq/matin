'use client';
import React, { useState } from 'react';
import '../../../styles/uni-student.css';

export default function StudentPage() {
  const [sbOpen, setSbOpen] = useState(false);
  const [reqModal, setReqModal] = useState(false);
  const [regModal, setRegModal] = useState(false);

  const toggleSb = () => setSbOpen(p => !p);
  const closeSb = () => setSbOpen(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "var(--f)", background: 'var(--bg)', color: 'var(--t)' }}>

      {/* OVERLAY */}
      {sbOpen && <div className="ov show" onClick={closeSb}></div>}

      {/* MODAL: تقديم طلب */}
      {reqModal && (
        <div className="modal-bg show">
          <div className="modal">
            <div className="mh">
              <div className="mt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                تقديم طلب رسمي
              </div>
              <button className="mx" onClick={() => setReqModal(false)}>×</button>
            </div>
            <div style={{ padding: '16px' }}>
              <label className="flbl">نوع الطلب</label>
              <select className="finp">
                <option>حذف فصل دراسي (Withdrawal)</option>
                <option>تحويل تخصص / كلية</option>
                <option>تجميد القيد</option>
                <option>اعتراض على درجة</option>
                <option>طلب منحة دراسية</option>
                <option>إعادة تسجيل مقرر</option>
                <option>عذر غياب — غير طبي</option>
                <option>إجازة دراسية</option>
                <option>شهادة قيد وتقييد</option>
                <option>نسخة من الكشف الأكاديمي</option>
                <option>اعتراض على قرار</option>
              </select>
              <label className="flbl">وجهة الطلب</label>
              <select className="finp">
                <option>عمادة الكلية — هندسة الحاسب</option>
                <option>د. محمد العتيبي (مرشد أكاديمي)</option>
                <option>شؤون الطلاب</option>
                <option>الشؤون المالية</option>
                <option>عمادة القبول والتسجيل</option>
                <option>عمادة شؤون الطلاب والخدمات</option>
              </select>
              <label className="flbl">التفاصيل والسبب</label>
              <textarea className="finp" style={{ resize: 'vertical', minHeight: '70px' }} placeholder="اشرح سبب طلبك بالتفصيل..."></textarea>
              <label className="flbl">مرفق داعم (اختياري)</label>
              <div style={{ border: '2px dashed var(--b1)', borderRadius: '8px', padding: '14px', textAlign: 'center', marginBottom: '14px', cursor: 'pointer' }} onClick={() => document.getElementById('fup')?.click()}>
                <input type="file" id="fup" style={{ display: 'none' }} />
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>📎</div>
                <div style={{ fontSize: '11.5px', color: 'var(--tm)' }}>اضغط لرفع ملف</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setReqModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', borderRadius: '9px', padding: '11px', color: 'var(--td)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إلغاء</button>
                <button onClick={() => { setReqModal(false); }} style={{ flex: 2, background: 'linear-gradient(135deg,var(--c),var(--c2))', border: 'none', borderRadius: '9px', padding: '11px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إرسال الطلب ←</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: تسجيل مقررات */}
      {regModal && (
        <div className="modal-bg show">
          <div className="modal">
            <div className="mh">
              <div className="mt">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gr)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>
                تسجيل مقررات الفصل القادم
              </div>
              <button className="mx" onClick={() => setRegModal(false)}>×</button>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)', borderRadius: '9px', padding: '10px 13px', marginBottom: '14px', fontSize: '12px', color: 'var(--td)' }}>
                ساعاتك المعتمدة: <strong style={{ color: 'var(--gr)' }}>78/130</strong> · يمكنك تسجيل حتى <strong style={{ color: 'var(--gr)' }}>18 ساعة</strong> هذا الفصل
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--b2)', borderRadius: '8px', padding: '9px 12px' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--c)', width: '15px', height: '15px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>CS501 — الذكاء الاصطناعي</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>3 ساعات · د. محمد العتيبي · أونلاين</div></div>
                  <span className="badge bg2">متاح</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--b2)', borderRadius: '8px', padding: '9px 12px' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--c)', width: '15px', height: '15px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>CS510 — الشبكات المتقدمة</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>3 ساعات · د. سارة الزهراني · حضوري</div></div>
                  <span className="badge bg2">متاح</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '8px', padding: '9px 12px', opacity: .55 }}>
                  <input type="checkbox" disabled style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>CS520 — نظم التشغيل المتقدمة</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>يتطلب اجتياز CS402 أولاً</div></div>
                  <span className="badge br2">محظور</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,.02)', border: '1px solid var(--b2)', borderRadius: '8px', padding: '9px 12px' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: 'var(--c)', width: '15px', height: '15px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--t)' }}>MATH301 — الرياضيات المتقدمة</div><div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>2 ساعات · د. أحمد الخالد · حضوري</div></div>
                  <span className="badge bg2">متاح</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--tm)' }}>الساعات المحددة</span>
                <strong style={{ color: 'var(--c)', fontSize: '16px' }}>8 ساعات</strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setRegModal(false)} style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', borderRadius: '9px', padding: '11px', color: 'var(--td)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>إلغاء</button>
                <button onClick={() => { setRegModal(false); }} style={{ flex: 2, background: 'linear-gradient(135deg,var(--gr),#059669)', border: 'none', borderRadius: '9px', padding: '11px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--f)' }}>تأكيد التسجيل ←</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sb${sbOpen ? ' open' : ''}`}>
        <div className="sb-top">
          <a className="logo-r" href="#"><div className="li2">م</div><div><div className="lt">متين</div><div className="ls">بوابة الطالب الجامعي</div></div></a>
          <div className="std-card">
            <div className="std-top">
              <div className="std-av">🎓</div>
              <div style={{ minWidth: 0 }}><div className="std-n">أحمد محمد الزهراني</div><div className="std-id">441001234 · هندسة الحاسب</div></div>
            </div>
            <div className="std-grid">
              <div className="kv"><span className="kk">المستوى:</span><span className="kv2">6</span></div>
              <div className="kv"><span className="kk">GPA:</span><span className="kv2" style={{ color: 'var(--gr)' }}>4.2/5</span></div>
              <div className="kv"><span className="kk">الساعات:</span><span className="kv2">78/130</span></div>
              <div className="kv"><span className="kk">الفصل:</span><span className="kv2">الثاني</span></div>
            </div>
          </div>
        </div>
        <nav className="nav">
          <div className="ng">الرئيسية</div>
          <a className="ni on" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>بوابتي <span className="dot"></span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>جدولي الدراسي</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>السجل الأكاديمي</a>
          <div className="ng">المحاضرات</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>محاضراتي الأونلاين <span className="nb nb-c">الآن</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>المحاضرات الحضورية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>المحاضرات المسجّلة</a>
          <div className="ng">المقررات والتسجيل</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>مقرراتي الحالية</a>
          <a className="ni" href="#" onClick={() => { setRegModal(true); closeSb(); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg><span style={{ color: 'var(--gr)', fontWeight: 600 }}>تسجيل مقررات</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>الساعات المعتمدة</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>المكتبة الإلكترونية</a>
          <div className="ng">الاختبارات والدرجات</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>اختباراتي <span className="nb nb-c">غداً</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>نتائج درجاتي</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>تحليل أدائي ونقاط الضعف</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>بنك الأسئلة التدريبي</a>
          <div className="ng">خدمات العمادة</div>
          <a className="ni" href="#" onClick={() => { setReqModal(true); closeSb(); }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg><span style={{ color: 'var(--c)', fontWeight: 600 }}>تقديم طلب رسمي</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>الأعذار الطبية — صحتي</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>الشهادات والوثائق الرسمية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>الرسوم الدراسية <span className="nb nb-r">معلقة</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>المنح والإعفاءات</a>
          <div className="ng">التواصل</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>رسائل الدكاترة <span className="nb nb-r">3</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>مرشدي الأكاديمي</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>الملتقى الطلابي</a>
          <div className="ng">الحياة الجامعية</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>الكافتيريا</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>الأنشطة والفعاليات</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>النقل الجامعي</a>
        </nav>
        <div className="sb-ft">
          <button className="lo"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>تسجيل الخروج</button>
          <div style={{ marginTop: '6px', color: 'rgba(238,238,245,.14)', fontSize: '10px', textAlign: 'center' }}>متين v6 — بوابة الطالب</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="hdr">
          <div className="hl">
            <button className="mb" onClick={toggleSb}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
            <div><div className="ht">بوابتي الجامعية</div><div className="hs">كلية الهندسة والتقنية — الفصل الثاني 1445/1446</div></div>
          </div>
          <div className="hr">
            <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="nd"></span></div>
            <div className="hb"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span className="nd"></span></div>
            <div className="ub">
              <div className="ua">🎓</div>
              <div className="ui"><div className="un">أحمد الزهراني</div><div className="ur">طالب — المستوى 6</div></div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        <div className="con">

          {/* ALERT نقطة ضعف */}
          <div className="wk-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
            <div><strong style={{ color: 'var(--or)' }}>تنبيه من النظام:</strong> أداؤك في مادة <strong>قواعد البيانات CS402</strong> أقل من المتوسط. د. محمد العتيبي أرسل لك تنبيهاً بمراجعة وحدة الـ SQL. <a href="#" style={{ color: 'var(--or)', fontWeight: 700 }}>ابدأ التدريب من بنك الأسئلة ←</a></div>
          </div>

          {/* GPA BANNER */}
          <div className="gpa">
            <div>
              <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 700, marginBottom: '3px' }}>المعدل التراكمي GPA</div>
              <div className="gv" style={{ color: 'var(--gr)' }}>4.2 <span style={{ fontSize: '14px', color: 'var(--tm)' }}>/ 5.0</span></div>
              <div style={{ fontSize: '10px', color: 'rgba(16,185,129,.6)', marginTop: '1px' }}>ممتاز · المستوى السادس</div>
            </div>
            <div className="gdi"></div>
            <div style={{ textAlign: 'center' }}><div className="gv" style={{ color: 'var(--c)' }}>78</div><div className="gl">ساعة مكتملة</div></div>
            <div className="gdi"></div>
            <div style={{ textAlign: 'center' }}><div className="gv" style={{ color: 'var(--or)' }}>18K</div><div className="gl">رسوم معلقة (SAR)</div></div>
            <div className="gdi"></div>
            <div className="gpr">
              <div style={{ fontSize: '10px', color: 'var(--tm)', fontWeight: 700, marginBottom: '3px' }}>التقدم نحو التخرج</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--c)' }}>60%</div>
              <div className="pbar"><div className="pfill" style={{ width: '60%' }}></div></div>
              <div style={{ fontSize: '10px', color: 'var(--tm)', marginTop: '3px' }}>78 / 130 ساعة · يتبقى 52 ساعة</div>
            </div>
          </div>

          {/* STATS */}
          <div className="sg">
            <div className="sc">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(129,140,248,.05),transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="si" style={{ background: 'rgba(129,140,248,.1)', border: '1px solid rgba(129,140,248,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>
              <div className="sv" style={{ color: 'var(--c)' }}>5</div><div className="sl">مقررات مسجّلة</div>
              <div className="ss" style={{ color: 'rgba(129,140,248,.6)' }}>16 ساعة هذا الفصل</div>
            </div>
            <div className="sc">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(16,185,129,.05),transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="si" style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg></div>
              <div className="sv" style={{ color: 'var(--gr)' }}>87%</div><div className="sl">نسبة حضوري</div>
              <div className="ss" style={{ color: 'rgba(16,185,129,.6)' }}>الحد الأدنى 75%</div>
            </div>
            <div className="sc">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(251,146,60,.05),transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="si" style={{ background: 'rgba(251,146,60,.1)', border: '1px solid rgba(251,146,60,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg></div>
              <div className="sv" style={{ color: 'var(--or)' }}>2</div><div className="sl">اختبارات قادمة</div>
              <div className="ss" style={{ color: 'rgba(251,146,60,.6)' }}>أقربها غداً</div>
            </div>
            <div className="sc">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(34,211,238,.05),transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="si" style={{ background: 'rgba(34,211,238,.1)', border: '1px solid rgba(34,211,238,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
              <div className="sv" style={{ color: 'var(--cy)' }}>3</div><div className="sl">طلبات قيد المراجعة</div>
              <div className="ss" style={{ color: 'rgba(34,211,238,.6)' }}>بانتظار الرد</div>
            </div>
          </div>

          {/* ROW: جدول اليوم + رسائل الدكاترة */}
          <div className="g2">

            {/* جدول اليوم */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="ch">
                <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>محاضرات اليوم</div>
                <button className="cl">الجدول الكامل</button>
              </div>
              <div className="lr" style={{ opacity: .45 }}>
                <div className="ltime">8:00 — 9:30</div>
                <div><div className="lname">هندسة البرمجيات</div><div className="lsub">CS301 · حضوري</div><div className="lroom"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>مدرج A1</div></div>
                <span className="badge" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--tm)', border: '1px solid var(--b2)' }}>انتهت</span>
              </div>
              <div className="lr now2">
                <div className="ltime" style={{ color: 'var(--c)' }}>10:00 — 11:30</div>
                <div style={{ flex: 1 }}>
                  <div className="lname" style={{ color: 'var(--c)' }}>قواعد البيانات</div>
                  <div className="lsub">CS402 · أونلاين هجين · د. محمد العتيبي</div>
                  <div className="lroom" style={{ color: 'var(--c)' }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>مدرج B2 + رابط أونلاين</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                  <span className="badge bc2">● الآن</span>
                  <button style={{ background: 'linear-gradient(135deg,var(--c),var(--c2))', border: 'none', borderRadius: '6px', padding: '4px 10px', color: '#fff', fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>انضم</button>
                </div>
              </div>
              <div className="lr" style={{ opacity: .4 }}>
                <div className="ltime">12:00 — 1:00</div>
                <div><div className="lname" style={{ color: 'var(--tm)' }}>استراحة الغداء</div><div className="lsub">الكافتيريا · المبنى الرئيسي</div></div>
              </div>
              <div className="lr">
                <div className="ltime">1:30 — 3:00</div>
                <div style={{ flex: 1 }}>
                  <div className="lname">الذكاء الاصطناعي</div>
                  <div className="lsub">CS501 · حضوري + تسجيل · د. محمد العتيبي</div>
                  <div className="lroom"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>قاعة 302</div>
                </div>
                <span className="badge bp2">قادمة</span>
              </div>
              <div className="lr" style={{ borderBottom: 'none' }}>
                <div className="ltime">3:30 — 5:00</div>
                <div style={{ flex: 1 }}>
                  <div className="lname">الرياضيات المتقدمة</div>
                  <div className="lsub">MATH301 · حضوري · د. أحمد الخالد</div>
                  <div className="lroom"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>مدرج C3</div>
                </div>
                <span className="badge bp2">قادمة</span>
              </div>
            </div>

            {/* رسائل الدكاترة */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="ch">
                <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--bl)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>رسائل الدكاترة <span style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: 'var(--rd)', fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>3</span></div>
                <button className="cl" style={{ color: 'var(--bl)' }}>الكل</button>
              </div>
              <div className="msg">
                <div className="munread"></div>
                <div className="mv" style={{ background: 'rgba(34,211,238,.1)', color: 'var(--cy)' }}>م</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>د. محمد العتيبي</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--or)', fontWeight: 600, marginTop: '1px' }}>⚠ تنبيه: ضعف في وحدة SQL Joins</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>راجع الوحدة قبل الاختبار غداً</div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--tm)' }}>10د</div>
              </div>
              <div className="msg">
                <div className="munread"></div>
                <div className="mv" style={{ background: 'rgba(167,139,250,.1)', color: 'var(--pu)' }}>س</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>د. سارة الزهراني</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)', marginTop: '1px' }}>اختبار الشبكات المتقدمة يوم الأحد...</div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--tm)' }}>1س</div>
              </div>
              <div className="msg" style={{ borderBottom: 'none' }}>
                <div style={{ width: '7px', flexShrink: 0 }}></div>
                <div className="mv" style={{ background: 'rgba(16,185,129,.1)', color: 'var(--gr)' }}>ع</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>د. عبدالله الخالد — المرشد</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)', marginTop: '1px' }}>تمت الموافقة على خطتك الدراسية</div>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--tm)' }}>أمس</div>
              </div>
              <div style={{ padding: '9px 13px', borderTop: '1px solid var(--b2)' }}>
                <button style={{ width: '100%', background: 'rgba(129,140,248,.06)', border: '1px solid var(--cb)', borderRadius: '8px', padding: '8px', color: 'var(--c)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>إرسال رسالة لدكتور</button>
              </div>
            </div>
          </div>

          {/* ROW: اختبارات + نتائج + نقاط ضعف */}
          <div className="g3">

            {/* الاختبارات */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="ch">
                <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="2"/></svg>اختباراتي القادمة</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px', borderBottom: '1px solid var(--b2)', background: 'rgba(251,146,60,.04)' }}>
                <div style={{ background: 'rgba(251,146,60,.1)', border: '1px solid rgba(251,146,60,.2)', borderRadius: '8px', padding: '5px 8px', textAlign: 'center', flexShrink: 0, minWidth: '38px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--or)', lineHeight: 1 }}>29</div>
                  <div style={{ fontSize: '8px', color: 'var(--tm)', fontWeight: 600 }}>مارس</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--t)' }}>اختبار قواعد البيانات — نصفي</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>CS402 · أونلاين · 60 دقيقة · 40 درجة</div>
                  <div style={{ fontSize: '10px', color: 'var(--or)', fontWeight: 600, marginTop: '2px' }}>كاميرا إجبارية · مراقبة AI</div>
                </div>
                <span className="badge bo2">غداً</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 13px' }}>
                <div style={{ background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.2)', borderRadius: '8px', padding: '5px 8px', textAlign: 'center', flexShrink: 0, minWidth: '38px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--pu)', lineHeight: 1 }}>05</div>
                  <div style={{ fontSize: '8px', color: 'var(--tm)', fontWeight: 600 }}>أبريل</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--t)' }}>امتحان هندسة البرمجيات</div>
                  <div style={{ fontSize: '10.5px', color: 'var(--tm)' }}>CS301 · حضوري · مدرج A1 · 90 دقيقة</div>
                  <div style={{ fontSize: '10px', color: 'var(--pu)', fontWeight: 600, marginTop: '2px' }}>ورقي · مراقبة تقليدية</div>
                </div>
                <span className="badge bp2">8 أيام</span>
              </div>
            </div>

            {/* نتائج الدرجات */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="ch">
                <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gr)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>نتائجي الأخيرة</div>
                <button className="cl" style={{ color: 'var(--gr)' }}>الكل</button>
              </div>
              <div className="tw">
                <table>
                  <thead><tr><th>المقرر</th><th>الدرجة</th><th>التقدير</th></tr></thead>
                  <tbody>
                    <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>CS402 — نصفي</td><td style={{ color: 'var(--or)', fontWeight: 700 }}>24/40</td><td><span className="badge bo2">C+</span></td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>CS301 — تكليف</td><td style={{ color: 'var(--gr)', fontWeight: 700 }}>18/20</td><td><span className="badge bg2">A</span></td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>CS501 — مشاركة</td><td style={{ color: 'var(--gr)', fontWeight: 700 }}>9/10</td><td><span className="badge bg2">A+</span></td></tr>
                    <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>MATH301 — تكليف</td><td style={{ color: 'var(--bl)', fontWeight: 700 }}>14/20</td><td><span className="badge bb2">B</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* نقاط الضعف */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="ch">
                <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rd)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>نقاط الضعف — اكتشفها النظام</div>
              </div>
              <div style={{ padding: '4px 0' }}>
                <div className="wk">
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>SQL Joins & Queries</div><div style={{ fontSize: '10px', color: 'var(--tm)' }}>CS402 · تنبيه من الدكتور</div></div>
                  <div style={{ width: '80px' }}><div className="wkbar"><div className="wkfill" style={{ width: '38%', background: 'var(--rd)' }}></div></div><div style={{ fontSize: '10px', color: 'var(--rd)', fontWeight: 700, marginTop: '3px', textAlign: 'left' }}>38%</div></div>
                </div>
                <div className="wk">
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>التكامل والاشتقاق</div><div style={{ fontSize: '10px', color: 'var(--tm)' }}>MATH301 · اكتشفه النظام</div></div>
                  <div style={{ width: '80px' }}><div className="wkbar"><div className="wkfill" style={{ width: '55%', background: 'var(--or)' }}></div></div><div style={{ fontSize: '10px', color: 'var(--or)', fontWeight: 700, marginTop: '3px', textAlign: 'left' }}>55%</div></div>
                </div>
                <div className="wk" style={{ borderBottom: 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t)' }}>خوارزميات البحث</div><div style={{ fontSize: '10px', color: 'var(--tm)' }}>CS301 · اكتشفه النظام</div></div>
                  <div style={{ width: '80px' }}><div className="wkbar"><div className="wkfill" style={{ width: '70%', background: 'var(--gd)' }}></div></div><div style={{ fontSize: '10px', color: 'var(--gd)', fontWeight: 700, marginTop: '3px', textAlign: 'left' }}>70%</div></div>
                </div>
              </div>
              <div style={{ padding: '8px 13px', borderTop: '1px solid var(--b2)' }}>
                <button style={{ width: '100%', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '7px', padding: '7px', color: 'var(--rd)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--f)' }}>تمرّن الآن — بنك الأسئلة</button>
              </div>
            </div>
          </div>

          {/* طلباتي */}
          <div className="card">
            <div className="ch">
              <div className="ct"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>طلباتي المقدّمة للعمادة</div>
              <button className="cl" onClick={() => setReqModal(true)}>+ طلب جديد</button>
            </div>
            <div className="tw">
              <table>
                <thead><tr><th>نوع الطلب</th><th>الجهة</th><th>التاريخ</th><th>الحالة</th></tr></thead>
                <tbody>
                  <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>اعتراض على درجة CS402</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>د. محمد العتيبي</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>25 مارس</td><td><span className="badge bc2">قيد المراجعة</span></td></tr>
                  <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>شهادة قيد وتقييد</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>عمادة القبول</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>20 مارس</td><td><span className="badge bg2">مقبول ✓</span></td></tr>
                  <tr><td style={{ fontWeight: 600, color: 'var(--t)' }}>طلب منحة دراسية</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>شؤون الطلاب</td><td style={{ color: 'var(--tm)', fontSize: '11px' }}>15 مارس</td><td><span className="badge bo2">بانتظار وثائق</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div>
            <div style={{ color: 'var(--tm)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>خدماتي — كل شيء بدون مراجعة أي مبنى</div>
            <div className="qg">
              <a className="qi" href="#" onClick={(e) => { e.preventDefault(); setRegModal(true); }}><div className="qic" style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg></div><span className="ql">تسجيل مقررات</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(129,140,248,.1)', border: '1px solid rgba(129,140,248,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div><span className="ql">انضم للمحاضرة</span></a>
              <a className="qi" href="#" onClick={(e) => { e.preventDefault(); setReqModal(true); }}><div className="qic" style={{ background: 'rgba(129,140,248,.1)', border: '1px solid rgba(129,140,248,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/></svg></div><span className="ql">تقديم طلب</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(212,168,67,.1)', border: '1px solid rgba(212,168,67,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div><span className="ql">شهادة قيد</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></div><span className="ql">دفع الرسوم</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><span className="ql">عذر طبي صحتي</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div><span className="ql">المكتبة الإلكترونية</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div><span className="ql">رسالة للدكتور</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(251,146,60,.1)', border: '1px solid rgba(251,146,60,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg></div><span className="ql">الكافتيريا</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(34,211,238,.1)', border: '1px solid rgba(34,211,238,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg></div><span className="ql">محاضرات مسجّلة</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(212,168,67,.1)', border: '1px solid rgba(212,168,67,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg></div><span className="ql">المنح والإعفاءات</span></a>
              <a className="qi" href="#"><div className="qic" style={{ background: 'rgba(129,140,248,.1)', border: '1px solid rgba(129,140,248,.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><span className="ql">الأنشطة</span></a>
            </div>
          </div>

        </div>

        <footer className="ft2">
          <p>© 2026 متين — بوابة الطالب · كلية الهندسة والتقنية</p>
          <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>

    </div>
  );
}
