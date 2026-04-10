'use client';
import React, { useState } from 'react';
import '../../../styles/uni-owner.css';

export default function UniversityOwnerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uniType, setUniType] = useState<'private' | 'gov'>('private');
  const [privateAlertVisible, setPrivateAlertVisible] = useState(true);
  const [govAlertVisible, setGovAlertVisible] = useState(true);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeModalName, setUpgradeModalName] = useState('المتجر الإلكتروني');

  const openUpgradeModal = (name: string) => {
    setUpgradeModalName(name);
    setUpgradeModalOpen(true);
  };

  const isPrivate = uniType === 'private';
  const isGov = uniType === 'gov';

  return (
    <div className="page">
      {/* OVERLAY */}
      <div
        className={`overlay${sidebarOpen ? ' show' : ''}`}
        id="overlay"
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} id="sidebar">
        <div className="sb-top">
          <a className="sb-logo" href="#">
            <div className="logo-icon">م</div>
            <div>
              <div className="logo-main">متين</div>
              <div className="logo-sub">نظام إدارة التعليم</div>
            </div>
          </a>
          <div className="uni-card">
            <div className="uni-av">🎓</div>
            <div style={{ minWidth: 0 }}>
              <div className="uni-name">جامعة الرياض الأهلية</div>
              <div className="uni-role">رئيس الجامعة</div>
            </div>
          </div>
        </div>

        <nav className="nav">
          <div className="ng">الرئيسية</div>
          <a className="ni active" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            لوحة التحكم <span className="nav-dot"></span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="16" y1="2" x2="16" y2="6" />
            </svg>
            التقويم الأكاديمي
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            سجل النشاط
          </a>

          <div className="ng">الهيكل الأكاديمي</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            الكليات والأقسام
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            المقررات الدراسية
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            الجداول الدراسية
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            البرامج الأكاديمية
          </a>

          <div className="ng">الطلاب</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            الطلاب المقيدون
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            طلبات القبول
            <span className="nb nb-g">12</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
            </svg>
            التسجيل الفصلي
            <span className="nb nb-b">مفتوح</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            الشكاوى والاستفسارات
            <span className="nb nb-r">7</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
            </svg>
            الشهادات والتخرج
          </a>

          <div className="ng">هيئة التدريس</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            الدكاترة والمعيدون
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            العقود والملفات
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            الإجازات والاستئذانات
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
            الأبحاث والنشر
          </a>

          <div className="ng">العمليات الأكاديمية</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            الحضور والغياب
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            الدرجات والمعدلات
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
            </svg>
            الاختبارات النهائية
            <span className="nb nb-b">2</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            السلوك والانضباط
          </a>

          <div className="ng">الساعات المعتمدة</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            إدارة الساعات
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            تقارير المعدلات
          </a>

          <div className="ng">الدراسات العليا</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            طلاب الماجستير والدكتوراه
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <line x1="16" y1="13" x2="8" y2="13" />
            </svg>
            الأطروحات والرسائل
          </a>

          <div className="ng">المالية</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            رسوم الطلاب
            <span className="nb nb-r">18</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            الرواتب والمالية
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            المنح والتخفيضات
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <line x1="9" y1="13" x2="15" y2="13" />
            </svg>
            الضريبة والفواتير
          </a>

          <div className="ng">الصلاحيات والتقنية</div>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            صلاحيات الأدوار
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            التكاملات
          </a>
          <a className="ni" href="#" style={{ color: '#10B981' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span style={{ color: '#10B981', fontWeight: 600 }}>الواجهة الأمامية</span>
            <span style={{ marginRight: 'auto', background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '9px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>الموقع</span>
          </a>
          <a className="ni" href="#" style={{ color: 'var(--gold)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>محرر الواجهة</span>
            <span style={{ marginRight: 'auto', background: 'var(--gold-dim)', color: 'var(--gold)', fontSize: '9px', fontWeight: 700, padding: '1px 7px', borderRadius: '10px', border: '1px solid var(--gold-border)' }}>جديد</span>
          </a>
          <a className="ni" href="#">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            الإعدادات
          </a>

          {/* حكومي فقط */}
          {isGov && (
            <div className="gov-only">
              <div className="ng" style={{ color: 'rgba(212,168,67,0.6)' }}>وزارة التعليم 🏛️</div>
              <a className="ni" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span style={{ color: 'var(--gold)' }}>بوابة القبول الموحد</span>
                <span className="nb nb-g">جديد</span>
              </a>
              <a className="ni" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                </svg>
                <span style={{ color: 'var(--gold)' }}>التقارير الوزارية</span>
              </a>
              <a className="ni" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                <span style={{ color: 'var(--gold)' }}>سلم الرواتب الحكومي</span>
              </a>
              <a className="ni" href="#">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ color: 'var(--gold)' }}>الاعتماد الأكاديمي</span>
              </a>
            </div>
          )}
        </nav>

        <div className="sb-footer">
          <button className="logout-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            تسجيل الخروج
          </button>
          <div className="sb-ver">متين v6 — جامعة الرياض الأهلية</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="header">
          <div className="hdr-left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div>
              <div className="hdr-title">لوحة التحكم</div>
              <div className="hdr-sub">جامعة الرياض الأهلية — الفصل الثاني 1446</div>
            </div>
          </div>
          <div className="hdr-right">
            <div className="search-box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input className="srch-inp" placeholder="بحث عن طالب أو دكتور..." />
            </div>
            <div className="hdr-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="ndot"></span>
            </div>
            <div className="hdr-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="ndot"></span>
            </div>
            <div className="user-btn">
              <div className="user-av">👨‍💼</div>
              <div className="uinfo">
                <div className="uname">د. عبدالله المطيري</div>
                <div className="urole">رئيس الجامعة</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(238,238,245,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>

        <div className="content">

          {/* UNI TYPE SWITCH */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--border2)', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text)' }}>نوع الجامعة</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>— يؤثر على بعض الأقسام والمميزات</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border2)', borderRadius: '9px', padding: '4px' }}>
              <button
                onClick={() => setUniType('private')}
                style={{
                  background: isPrivate ? 'var(--accent-dim)' : 'transparent',
                  border: isPrivate ? '1px solid var(--accent-border)' : '1px solid transparent',
                  color: isPrivate ? 'var(--accent)' : 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: isPrivate ? 700 : 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s'
                }}
              >
                🏛️ خاصة
              </button>
              <button
                onClick={() => setUniType('gov')}
                style={{
                  background: isGov ? 'var(--accent-dim)' : 'transparent',
                  border: isGov ? '1px solid var(--accent-border)' : '1px solid transparent',
                  color: isGov ? 'var(--accent)' : 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  fontSize: '12.5px',
                  fontWeight: isGov ? 700 : 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s'
                }}
              >
                🏛️ حكومية
              </button>
            </div>
          </div>

          {/* GOV NOTICE */}
          {isGov && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '11px', padding: '10px 14px', marginBottom: '14px', fontSize: '12.5px', flexWrap: 'wrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ color: 'rgba(238,238,245,0.7)' }}>
                <strong style={{ color: 'var(--gold)' }}>وضع حكومي:</strong> القبول مرتبط بالبوابة الموحدة · الرواتب حسب سلم الوزارة · التقارير ترفع لوزارة التعليم
              </span>
            </div>
          )}

          {/* PRIVATE ALERT */}
          {isPrivate && privateAlertVisible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(96,165,250,0.07)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '11px', padding: '10px 14px', marginBottom: '16px', fontSize: '12.5px', flexWrap: 'wrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ color: 'rgba(238,238,245,0.6)' }}>
                التسجيل الفصلي مفتوح — <strong style={{ color: 'var(--blue)' }}>1,240 طالب</strong> سجّلوا حتى الآن من أصل 3,800
              </span>
              <a href="#" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none', marginRight: 'auto', fontSize: '12px' }}>عرض التسجيل ←</a>
              <button
                onClick={() => setPrivateAlertVisible(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.3)', cursor: 'pointer', fontSize: '16px' }}
              >×</button>
            </div>
          )}

          {/* GOV ALERT */}
          {isGov && govAlertVisible && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '11px', padding: '10px 14px', marginBottom: '16px', fontSize: '12.5px', flexWrap: 'wrap' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              <span style={{ color: 'rgba(238,238,245,0.6)' }}>
                بوابة القبول الموحد: <strong style={{ color: 'var(--green)' }}>892 مقبول</strong> من وزارة التعليم — يحتاجون إتمام تسجيل
              </span>
              <a href="#" style={{ color: 'var(--green)', fontWeight: 700, textDecoration: 'none', marginRight: 'auto', fontSize: '12px' }}>إتمام التسجيل ←</a>
              <button
                onClick={() => setGovAlertVisible(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(238,238,245,0.3)', cursor: 'pointer', fontSize: '16px' }}
              >×</button>
            </div>
          )}

          {/* PAGE HEADER */}
          <div className="pg-hdr">
            <div>
              <div className="pg-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5" />
                </svg>
                <span>لوحة رئيس الجامعة — {isPrivate ? 'خاصة' : 'حكومية'}</span>
              </div>
              <div className="pg-sub">الفصل الثاني — 1445/1446 هـ · الأسبوع 10 من 16</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button className="btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {isPrivate ? 'قبول طالب جديد' : 'تسجيل من البوابة الموحدة'}
              </button>
            </div>
          </div>

          {/* SEMESTER BAR */}
          <div className="sem-bar">
            <div>
              <div className="sem-label">الفصل الدراسي</div>
              <div className="sem-val">الثاني 1445/1446</div>
              <div className="sem-sub" style={{ color: 'var(--blue)' }}>التسجيل مفتوح</div>
            </div>
            <div className="sem-divider"></div>
            <div>
              <div className="sem-label">تاريخ البدء</div>
              <div className="sem-val">15 يناير 2025</div>
              <div className="sem-sub">أسبوع 10 / 16</div>
            </div>
            <div className="sem-divider"></div>
            <div>
              <div className="sem-label">الاختبارات النهائية</div>
              <div className="sem-val">10 مايو 2025</div>
              <div className="sem-sub" style={{ color: 'var(--orange)' }}>بعد 44 يوم</div>
            </div>
            <div className="sem-divider"></div>
            <div className="sem-progress">
              <div className="sem-label">تقدم الفصل</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--accent)', marginTop: '2px' }}>62%</div>
              <div className="prog-bar">
                <div className="prog-fill" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(96,165,250,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="stat-val" style={{ color: 'var(--blue)' }}>3,842</div>
              <div className="stat-lbl">إجمالي الطلاب</div>
              <div className="stat-sub" style={{ color: 'rgba(96,165,250,0.6)' }}>↑ 148 هذا الفصل</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(167,139,250,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="stat-val" style={{ color: 'var(--purple)' }}>186</div>
              <div className="stat-lbl">هيئة التدريس</div>
              <div className="stat-sub" style={{ color: 'rgba(167,139,250,0.6)' }}>142 دكتور · 44 معيد</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(34,211,238,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className="stat-val" style={{ color: 'var(--cyan)' }}>8</div>
              <div className="stat-lbl">الكليات</div>
              <div className="stat-sub" style={{ color: 'rgba(34,211,238,0.6)' }}>32 قسم · 68 برنامج</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(212,168,67,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="stat-val" style={{ color: 'var(--gold)' }}>4.2M</div>
              <div className="stat-lbl">الإيرادات (SAR)</div>
              <div className="stat-sub" style={{ color: 'rgba(239,68,68,0.7)' }}>↓ 380K رسوم معلقة</div>
            </div>
            <div className="stat-card">
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(16,185,129,0.05) 0%,transparent 60%)', pointerEvents: 'none' }}></div>
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="stat-val" style={{ color: 'var(--green)' }}>312</div>
              <div className="stat-lbl">خريج هذا الفصل</div>
              <div className="stat-sub" style={{ color: 'rgba(16,185,129,0.6)' }}>معدل تخرج 94%</div>
            </div>
          </div>

          {/* COLLEGES GRID */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-hdr">
              <div className="card-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                الكليات والأقسام
              </div>
              <button className="card-link">إدارة الكليات</button>
            </div>
            <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
              {[
                { name: 'كلية الهندسة والتقنية', students: 820, doctors: 42, depts: 6 },
                { name: 'كلية إدارة الأعمال', students: 640, doctors: 28, depts: 5 },
                { name: 'كلية الطب والصحة', students: 580, doctors: 36, depts: 4 },
                { name: 'كلية العلوم والحاسب', students: 490, doctors: 24, depts: 5 },
                { name: 'كلية القانون والشريعة', students: 380, doctors: 18, depts: 3 },
                { name: 'كلية التربية والآداب', students: 410, doctors: 22, depts: 4 },
                { name: 'كلية الفنون والتصميم', students: 280, doctors: 14, depts: 3 },
              ].map((col, i) => (
                <div className="college-card" key={i}>
                  <div className="college-name">{col.name}</div>
                  <div className="college-stats">
                    <div className="college-stat">
                      <div className="college-stat-val">{col.students}</div>
                      <div className="college-stat-lbl">طالب</div>
                    </div>
                    <div className="college-stat">
                      <div className="college-stat-val" style={{ color: 'var(--purple)' }}>{col.doctors}</div>
                      <div className="college-stat-lbl">دكتور</div>
                    </div>
                    <div className="college-stat">
                      <div className="college-stat-val" style={{ color: 'var(--cyan)' }}>{col.depts}</div>
                      <div className="college-stat-lbl">أقسام</div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="college-card">
                <div className="college-name">الدراسات العليا</div>
                <div className="college-stats">
                  <div className="college-stat">
                    <div className="college-stat-val">242</div>
                    <div className="college-stat-lbl">طالب</div>
                  </div>
                  <div className="college-stat">
                    <div className="college-stat-val" style={{ color: 'var(--purple)' }}>38</div>
                    <div className="college-stat-lbl">مشرف</div>
                  </div>
                  <div className="college-stat">
                    <div className="college-stat-val" style={{ color: 'var(--cyan)' }}>12</div>
                    <div className="college-stat-lbl">برنامج</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW: تسجيل + طلبات + نشاط */}
          <div className="grid-3">

            {/* التسجيل الفصلي */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                  </svg>
                  التسجيل الفصلي
                </div>
                <span className="badge b-blue">● مفتوح</span>
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: 'var(--text-dim)' }}>
                  <span>تقدم التسجيل</span>
                  <span style={{ color: 'var(--blue)', fontWeight: 700 }}>1,240 / 3,842</span>
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: '32%' }}></div>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '6px' }}>32% من الطلاب سجّلوا حتى الآن</div>
              </div>
              <div className="tbl-wrap">
                <table>
                  <thead>
                    <tr><th>الكلية</th><th>مسجّل</th><th>الإجمالي</th><th>%</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>الهندسة</td>
                      <td style={{ color: 'var(--blue)', fontWeight: 700 }}>420</td>
                      <td style={{ color: 'var(--text-dim)' }}>820</td>
                      <td><span className="badge b-blue">51%</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>الأعمال</td>
                      <td style={{ color: 'var(--blue)', fontWeight: 700 }}>310</td>
                      <td style={{ color: 'var(--text-dim)' }}>640</td>
                      <td><span className="badge b-blue">48%</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>الطب</td>
                      <td style={{ color: 'var(--green)', fontWeight: 700 }}>580</td>
                      <td style={{ color: 'var(--text-dim)' }}>580</td>
                      <td><span className="badge b-green">100%</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>العلوم</td>
                      <td style={{ color: 'var(--orange)', fontWeight: 700 }}>120</td>
                      <td style={{ color: 'var(--text-dim)' }}>490</td>
                      <td><span className="badge b-orange">24%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* طلبات القبول */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                  </svg>
                  طلبات القبول
                  <span className="card-count" style={{ background: 'var(--gold-dim)', borderColor: 'var(--gold-border)', color: 'var(--gold)' }}>12</span>
                </div>
                <button className="card-link" style={{ color: 'var(--gold)' }}>الكل</button>
              </div>
              <div>
                {[
                  { initial: 'م', color: 'rgba(96,165,250,0.1)', textColor: 'var(--blue)', name: 'محمد العتيبي', degree: 'ماجستير', college: 'كلية الهندسة' },
                  { initial: 'ن', color: 'rgba(167,139,250,0.1)', textColor: 'var(--purple)', name: 'نورة الزهراني', degree: 'بكالوريوس', college: 'كلية الطب' },
                  { initial: 'خ', color: 'rgba(34,211,238,0.1)', textColor: 'var(--cyan)', name: 'خالد المطيري', degree: 'دكتوراه', college: 'كلية العلوم' },
                  { initial: 'س', color: 'rgba(251,146,60,0.1)', textColor: 'var(--orange)', name: 'سارة الحربي', degree: 'بكالوريوس', college: 'كلية الأعمال', last: true },
                ].map((item, i) => (
                  <div className="reg-item" key={i} style={item.last ? { borderBottom: 'none' } : {}}>
                    <div className="reg-av" style={{ background: item.color, color: item.textColor }}>{item.initial}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{item.degree} — {item.college}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-sm" style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>قبول</button>
                      <button className="btn-sm" style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)' }}>رفض</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* آخر النشاطات */}
            <div className="card">
              <div className="card-hdr">
                <div className="card-title">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                  آخر النشاطات
                </div>
                <button className="card-link" style={{ color: 'var(--purple)' }}>الكل</button>
              </div>
              <div>
                {[
                  { color: 'var(--blue)', text: <><strong>محمد العتيبي</strong> تقدم لبرنامج الماجستير في الهندسة</>, time: '10د' },
                  { color: 'var(--green)', text: <>تم قبول <strong>15 طالب</strong> في كلية الطب</>, time: '35د' },
                  { color: 'var(--gold)', text: <><strong>د. سعد الرشيد</strong> نشر ورقة بحثية في مجلة دولية</>, time: '1س' },
                  { color: 'var(--red)', text: <>شكوى جديدة من <strong>طالب في الأعمال</strong></>, time: '2س' },
                  { color: 'var(--cyan)', text: <>تحديث الخطة الدراسية لقسم <strong>علوم الحاسب</strong></>, time: '3س' },
                  { color: 'var(--purple)', text: <><strong>312 طالب</strong> تأهلوا للتخرج هذا الفصل</>, time: '5س', last: true },
                ].map((act, i) => (
                  <div className="act-item" key={i} style={act.last ? { borderBottom: 'none' } : {}}>
                    <div className="act-dot" style={{ background: act.color, boxShadow: `0 0 5px ${act.color}` }}></div>
                    <div className="act-text">{act.text}</div>
                    <div className="act-time">{act.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ marginBottom: '6px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>العمليات الأكاديمية</div>
            <div className="quick-grid" style={{ marginBottom: '18px' }}>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="quick-lbl">قبول طالب</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="quick-lbl">تعيين دكتور</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                  </svg>
                </div>
                <span className="quick-lbl">فتح التسجيل</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <span className="quick-lbl">شهادات التخرج</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <span className="quick-lbl">المقررات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <span className="quick-lbl">إشعار جماعي</span>
              </a>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>المالية والإدارة</div>
            <div className="quick-grid" style={{ marginBottom: '18px' }}>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="quick-lbl">تحصيل رسوم</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <span className="quick-lbl">الإيرادات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                </div>
                <span className="quick-lbl">الرواتب</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                </div>
                <span className="quick-lbl">المنح</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="quick-lbl">الصلاحيات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                </div>
                <span className="quick-lbl">التقارير</span>
              </a>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>الخدمات والتكنولوجيا</div>
            <div className="quick-grid">
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <span className="quick-lbl">التكاملات</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <span className="quick-lbl">المكتبة الرقمية</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <span className="quick-lbl">الملتقى</span>
              </a>
              <a className="quick-item" href="#">
                <div className="quick-icon" style={{ background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                  </svg>
                </div>
                <span className="quick-lbl">الأبحاث</span>
              </a>
              <a className="quick-item" href="#" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                <div className="quick-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <span className="quick-lbl" style={{ color: '#10B981' }}>الواجهة الأمامية</span>
              </a>
              <a className="quick-item" href="#" style={{ borderColor: 'rgba(212,168,67,0.2)' }}>
                <div className="quick-icon" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <span className="quick-lbl" style={{ color: 'var(--gold)' }}>محرر الواجهة</span>
              </a>
            </div>
          </div>

        </div>

        <footer className="footer">
          <p>© 2026 متين — جامعة الرياض الأهلية</p>
          <p>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>

      {/* UPGRADE MODAL */}
      {upgradeModalOpen && (
        <div
          style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setUpgradeModalOpen(false); }}
        >
          <div style={{ background: '#0F0F1E', border: '1px solid var(--gold-border)', borderRadius: '18px', padding: '32px', maxWidth: '420px', width: '90%', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--gold-dim)', border: '1px solid var(--gold-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
              </svg>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold)', marginBottom: '8px' }}>{upgradeModalName}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: '1.7', marginBottom: '24px' }}>
              هذه الخدمة متاحة في <strong style={{ color: 'var(--gold)' }}>الباقة المؤسسية</strong> فقط.<br />رقّي باقتك للحصول على وصول كامل.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setUpgradeModalOpen(false)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'var(--text-dim)', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font)' }}
              >لاحقاً</button>
              <button
                style={{ flex: 2, background: 'linear-gradient(135deg,var(--gold),var(--gold2))', border: 'none', borderRadius: '10px', padding: '12px', color: '#06060E', fontWeight: 800, fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font)' }}
              >ترقية الباقة الآن ←</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
