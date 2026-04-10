'use client';
import React, { useState } from 'react';
import '../../../styles/uni-admin.css';

export default function AdminPage() {
  const [sbOpen, setSbOpen] = useState(false);
  const [permModal, setPermModal] = useState(false);
  const [permStaffName, setPermStaffName] = useState('د. محمد العتيبي');
  const [permStaffRole, setPermStaffRole] = useState('دكتور — قسم الهندسة المدنية');

  const toggleSb = () => setSbOpen(p => !p);
  const closeSb = () => setSbOpen(false);

  const openPermModal = (name: string, role: string) => {
    setPermStaffName(name);
    setPermStaffRole(role || 'عضو هيئة تدريس');
    setPermModal(true);
  };

  const closePermModal = () => setPermModal(false);

  const savePerms = () => {
    setPermModal(false);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "var(--font)", background: 'var(--bg)', color: 'var(--text)' }}>

      {/* OVERLAY */}
      {sbOpen && <div className="overlay show" onClick={closeSb}></div>}

      {/* PERMISSIONS MODAL */}
      {permModal && (
        <div className="modal-overlay show">
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                صلاحيات {permStaffName}
              </div>
              <button className="modal-close" onClick={closePermModal}>×</button>
            </div>
            <div style={{ padding: '14px' }}>
              <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid var(--accent-border)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '12px', color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--accent)' }}>الدور الحالي:</strong> {permStaffRole}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>الصلاحيات الأكاديمية</div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                <div className="perm-row">
                  <div><div className="perm-name">رفع الدرجات</div><div className="perm-desc">إدخال وتعديل درجات الطلاب</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">إنشاء الاختبارات</div><div className="perm-desc">إضافة وجدولة الاختبارات</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">إضافة واجبات</div><div className="perm-desc">رفع وإدارة الواجبات الدراسية</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">تسجيل الحضور</div><div className="perm-desc">حضور وغياب الطلاب</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">رفع المحتوى التعليمي</div><div className="perm-desc">محاضرات، ملفات، فيديوهات</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">بث مباشر</div><div className="perm-desc">إنشاء جلسات مباشرة</div></div>
                  <label className="toggle"><input type="checkbox" /><span className="tslider"></span></label>
                </div>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>صلاحيات الإشراف</div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                <div className="perm-row">
                  <div><div className="perm-name">الإشراف على المعيدين</div><div className="perm-desc">متابعة وتوجيه المعيدين في قسمه</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">إشراف على رسائل الماجستير</div><div className="perm-desc">الإشراف الأكاديمي على الطلاب</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">الإشراف على رسائل الدكتوراه</div><div className="perm-desc">إشراف ومتابعة أطروحات الدكتوراه</div></div>
                  <label className="toggle"><input type="checkbox" /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">نشر الأبحاث العلمية</div><div className="perm-desc">تسجيل ونشر الأوراق البحثية</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>صلاحيات التواصل</div>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
                <div className="perm-row">
                  <div><div className="perm-name">إرسال إشعارات للطلاب</div><div className="perm-desc">إشعارات فردية وجماعية</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">الوصول للملتقى المجتمعي</div><div className="perm-desc">المشاركة في الملتقى</div></div>
                  <label className="toggle"><input type="checkbox" defaultChecked /><span className="tslider"></span></label>
                </div>
                <div className="perm-row">
                  <div><div className="perm-name">عرض تقارير القسم</div><div className="perm-desc">الإحصائيات والتقارير الأكاديمية</div></div>
                  <label className="toggle"><input type="checkbox" /><span className="tslider"></span></label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={closePermModal} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '9px', padding: '11px', color: 'var(--text-dim)', fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font)' }}>إلغاء</button>
                <button onClick={savePerms} style={{ flex: 2, background: 'linear-gradient(135deg,var(--accent),var(--accent2))', border: 'none', borderRadius: '9px', padding: '11px', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font)' }}>
                  حفظ الصلاحيات ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar${sbOpen ? ' open' : ''}`}>
        <div className="sb-top">
          <a className="sb-logo" href="#"><div className="logo-icon">م</div><div><div className="logo-main">متين</div><div className="logo-sub">نظام إدارة التعليم</div></div></a>
          <div className="dean-card">
            <div className="dean-av">👨‍🏫</div>
            <div style={{ minWidth: 0 }}>
              <div className="dean-name">د. سعد الرشيد</div>
              <div className="dean-role">عميد الكلية</div>
              <div className="dean-college">كلية الهندسة والتقنية</div>
            </div>
          </div>
        </div>

        <nav className="nav">
          <div className="ng">الرئيسية</div>
          <a className="ni active" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>لوحتي <span className="nav-dot"></span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>التقويم الأكاديمي</a>

          <div className="ng">الكلية</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>الأقسام الأكاديمية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>المقررات والخطط</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>الجداول الدراسية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>القاعات والمختبرات</a>

          <div className="ng">الطلاب</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>طلاب الكلية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>طلبات القبول <span className="nb nb-g">8</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/></svg>التسجيل الفصلي</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="8" x2="12" y2="12"/></svg>الشكاوى <span className="nb nb-r">4</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>الشهادات والتخرج</a>

          <div className="ng">هيئة التدريس والموظفون</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>الدكاترة والأستاذة</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>المعيدون والمحاضرون</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>الموظفون الإداريون</a>
          <a className="ni" href="#" style={{ color: 'var(--accent)', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); openPermModal('الكل', ''); closeSb(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            إدارة الصلاحيات
            <span style={{ background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '8px', marginRight: 'auto', border: '1px solid var(--accent-border)' }}>رئيسي</span>
          </a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>الإجازات والاستئذانات <span className="nb nb-r">3</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>تقييم الأداء</a>

          <div className="ng">العمليات الأكاديمية</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>الحضور والغياب</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>الدرجات والمعدلات</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>التقارير والإحصائيات</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg>الأبحاث العلمية</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg>الدراسات العليا</a>

          <div className="ng">المالية</div>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>رسوم الطلاب <span className="nb nb-r">6</span></a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>المنح والإعفاءات</a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>ميزانية الكلية</a>

          <div className="ng">التقنية</div>
          <a className="ni" href="#" style={{ color: '#10B981' }} onClick={closeSb}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span style={{ color: '#10B981', fontWeight: 600 }}>صفحة الكلية</span>
          </a>
          <a className="ni" href="#" onClick={closeSb}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>الإعدادات</a>
        </nav>

        <div className="sb-footer">
          <button className="logout-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>تسجيل الخروج</button>
          <div className="sb-ver">متين v6 — كلية الهندسة والتقنية</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="header">
          <div className="hdr-left">
            <button className="menu-btn" onClick={toggleSb}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
            <div><div className="hdr-title">لوحة عميد الكلية</div><div className="hdr-sub">كلية الهندسة والتقنية — الفصل الثاني 1446</div></div>
          </div>
          <div className="hdr-right">
            <div className="search-box"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input className="srch-inp" placeholder="بحث..." /></div>
            <div className="hdr-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span className="ndot"></span></div>
            <div className="user-btn">
              <div className="user-av">👨‍🏫</div>
              <div className="uinfo"><div className="uname">د. سعد الرشيد</div><div className="urole">عميد الكلية</div></div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </header>

        <div className="content">

          {/* PAGE HEADER */}
          <div className="pg-hdr">
            <div>
              <div className="pg-title">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg>
                كلية الهندسة والتقنية
              </div>
              <div className="pg-sub">الأسبوع 10 من 16 — 6 أقسام · 820 طالب · 42 دكتور · 12 معيد · 8 موظفين</div>
            </div>
            <button className="btn-primary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              إضافة عضو هيئة تدريس
            </button>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(167,139,250,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="stat-val" style={{ color: 'var(--accent)' }}>820</div>
              <div className="stat-lbl">طلاب الكلية</div>
              <div className="stat-sub" style={{ color: 'rgba(167,139,250,0.6)' }}>↑ 48 هذا الفصل</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(96,165,250,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
              <div className="stat-val" style={{ color: 'var(--blue)' }}>62</div>
              <div className="stat-lbl">هيئة التدريس والموظفون</div>
              <div className="stat-sub" style={{ color: 'rgba(96,165,250,0.6)' }}>42 دكتور · 12 معيد · 8 إداريين</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(16,185,129,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
              <div className="stat-val" style={{ color: 'var(--green)' }}>89%</div>
              <div className="stat-lbl">نسبة الحضور</div>
              <div className="stat-sub" style={{ color: 'rgba(16,185,129,0.6)' }}>↑ هذا الأسبوع</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(212,168,67,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>
              <div className="stat-val" style={{ color: 'var(--gold)' }}>124</div>
              <div className="stat-lbl">متأهلون للتخرج</div>
              <div className="stat-sub" style={{ color: 'rgba(212,168,67,0.6)' }}>معدل تخرج 96%</div>
            </div>
          </div>

          {/* DEPARTMENTS */}
          <div className="card">
            <div className="card-hdr">
              <div className="card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                أقسام الكلية
              </div>
              <button className="card-link">إدارة الأقسام</button>
            </div>
            <div className="dept-grid">
              <div className="dept-card">
                <div className="dept-name">الهندسة المدنية</div>
                <div className="dept-stats">
                  <div><div className="ds-val">180</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>8</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>3</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
              <div className="dept-card">
                <div className="dept-name">الهندسة الكهربائية</div>
                <div className="dept-stats">
                  <div><div className="ds-val">160</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>9</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>2</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
              <div className="dept-card">
                <div className="dept-name">هندسة الحاسب</div>
                <div className="dept-stats">
                  <div><div className="ds-val">210</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>11</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>4</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
              <div className="dept-card">
                <div className="dept-name">الهندسة الميكانيكية</div>
                <div className="dept-stats">
                  <div><div className="ds-val">140</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>7</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>2</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
              <div className="dept-card">
                <div className="dept-name">هندسة المعماري</div>
                <div className="dept-stats">
                  <div><div className="ds-val">90</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>5</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>1</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
              <div className="dept-card">
                <div className="dept-name">الهندسة الكيميائية</div>
                <div className="dept-stats">
                  <div><div className="ds-val">40</div><div className="ds-lbl">طالب</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--blue)' }}>2</div><div className="ds-lbl">دكتور</div></div>
                  <div><div className="ds-val" style={{ color: 'var(--orange)' }}>—</div><div className="ds-lbl">معيد</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* STAFF TABLE + REQUESTS */}
          <div className="grid-2">

            {/* جدول هيئة التدريس والموظفين */}
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-hdr">
                <div className="card-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  هيئة التدريس والموظفون
                  <span className="card-count">62</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <select style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', color: 'var(--text-dim)', fontSize: '11px', padding: '4px 8px', borderRadius: '6px', fontFamily: 'var(--font)', outline: 'none' }}>
                    <option>الكل</option>
                    <option>دكاترة</option>
                    <option>معيدون</option>
                    <option>إداريون</option>
                  </select>
                  <button className="card-link">+ إضافة</button>
                </div>
              </div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>الدور</th>
                      <th>القسم</th>
                      <th>الحالة</th>
                      <th>الصلاحيات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(167,139,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>م</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>د. محمد العتيبي</span>
                        </div>
                      </td>
                      <td><span className="badge b-accent">دكتور</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>الهندسة المدنية</td>
                      <td><span className="badge b-green">● نشط</span></td>
                      <td>
                        <button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('د. محمد العتيبي', 'دكتور — قسم الهندسة المدنية')}>
                          صلاحيات
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(96,165,250,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--blue)' }}>س</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>د. سارة الزهراني</span>
                        </div>
                      </td>
                      <td><span className="badge b-accent">دكتورة</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>هندسة الحاسب</td>
                      <td><span className="badge b-green">● نشط</span></td>
                      <td><button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('د. سارة الزهراني', 'دكتورة — قسم هندسة الحاسب')}>صلاحيات</button></td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(251,146,60,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--orange)' }}>خ</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>خالد المطيري</span>
                        </div>
                      </td>
                      <td><span className="badge b-orange">معيد</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>الهندسة الكهربائية</td>
                      <td><span className="badge b-green">● نشط</span></td>
                      <td><button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('خالد المطيري', 'معيد — قسم الهندسة الكهربائية')}>صلاحيات</button></td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(34,211,238,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--cyan)' }}>ن</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>نورة الحربي</span>
                        </div>
                      </td>
                      <td><span className="badge b-cyan">إدارية</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>شؤون الطلاب</td>
                      <td><span className="badge b-green">● نشط</span></td>
                      <td><button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('نورة الحربي', 'موظفة إدارية — شؤون الطلاب')}>صلاحيات</button></td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--red)' }}>ع</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>د. عمر الشمري</span>
                        </div>
                      </td>
                      <td><span className="badge b-accent">دكتور</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>الهندسة الميكانيكية</td>
                      <td><span className="badge b-orange">إجازة</span></td>
                      <td><button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('د. عمر الشمري', 'دكتور — قسم الهندسة الميكانيكية')}>صلاحيات</button></td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--green)' }}>ر</div>
                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>ريم السلمي</span>
                        </div>
                      </td>
                      <td><span className="badge b-orange">معيدة</span></td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '11.5px' }}>هندسة الحاسب</td>
                      <td><span className="badge b-green">● نشط</span></td>
                      <td><button className="btn-sm" style={{ background: 'rgba(167,139,250,0.08)', color: 'var(--accent)', border: '1px solid rgba(167,139,250,0.2)' }} onClick={() => openPermModal('ريم السلمي', 'معيدة — قسم هندسة الحاسب')}>صلاحيات</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* جانبي: طلبات + نشاط */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* إجازات معلقة */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-hdr">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                    طلبات الإجازات
                    <span className="card-count" style={{ background: 'rgba(251,146,60,0.1)', borderColor: 'rgba(251,146,60,0.2)', color: 'var(--orange)' }}>3</span>
                  </div>
                </div>
                <div>
                  <div className="req-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>د. عمر الشمري</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>إجازة مرضية — 5 أيام</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-sm" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>قبول</button>
                      <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>رفض</button>
                    </div>
                  </div>
                  <div className="req-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>خالد المطيري</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>استئذان — يوم واحد</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-sm" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>قبول</button>
                      <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>رفض</button>
                    </div>
                  </div>
                  <div className="req-item" style={{ borderBottom: 'none' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>نورة الحربي</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>إجازة اعتيادية — أسبوع</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-sm" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>قبول</button>
                      <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>رفض</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* آخر النشاطات */}
              <div className="card" style={{ marginBottom: 0 }}>
                <div className="card-hdr">
                  <div className="card-title">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    آخر النشاطات
                  </div>
                </div>
                <div>
                  <div className="act-item"><div className="act-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 4px var(--accent)' }}></div><div className="act-text">تم تغيير صلاحيات <strong>د. محمد العتيبي</strong></div><div className="act-time">15د</div></div>
                  <div className="act-item"><div className="act-dot" style={{ background: 'var(--green)', boxShadow: '0 0 4px var(--green)' }}></div><div className="act-text">قبول <strong>8 طلاب</strong> في قسم هندسة الحاسب</div><div className="act-time">1س</div></div>
                  <div className="act-item"><div className="act-dot" style={{ background: 'var(--orange)', boxShadow: '0 0 4px var(--orange)' }}></div><div className="act-text">طلب إجازة من <strong>د. عمر الشمري</strong></div><div className="act-time">2س</div></div>
                  <div className="act-item"><div className="act-dot" style={{ background: 'var(--gold)', boxShadow: '0 0 4px var(--gold)' }}></div><div className="act-text">نشر بحث علمي من <strong>د. سارة الزهراني</strong></div><div className="act-time">3س</div></div>
                  <div className="act-item" style={{ borderBottom: 'none' }}><div className="act-dot" style={{ background: 'var(--red)', boxShadow: '0 0 4px var(--red)' }}></div><div className="act-text">شكوى جديدة من طالب في <strong>هندسة الحاسب</strong></div><div className="act-time">5س</div></div>
                </div>
              </div>

            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>إجراءات سريعة</div>
            <div className="quick-grid">
              <a className="quick-item" href="#" onClick={(e) => { e.preventDefault(); openPermModal('عضو جديد', ''); }}>
                <div className="quick-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></div>
                <span className="quick-lbl">الصلاحيات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <span className="quick-lbl">إضافة دكتور</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <span className="quick-lbl">إضافة معيد</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>
                <span className="quick-lbl">إضافة موظف</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
                <span className="quick-lbl">قبول طالب</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>
                <span className="quick-lbl">شهادات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
                <span className="quick-lbl">التقارير</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
                <span className="quick-lbl">الأبحاث</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg></div>
                <span className="quick-lbl">إشعار جماعي</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <span className="quick-lbl">الرسوم</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                <span className="quick-lbl">الدراسات العليا</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.4)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></div>
                <span className="quick-lbl">الإعدادات</span>
              </a>
            </div>
          </div>

        </div>

        <footer className="footer">
          <p>© 2026 متين — كلية الهندسة والتقنية</p>
          <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>

    </div>
  );
}
