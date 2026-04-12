'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

/* ═══════════════════════════════════════════════════════════
   DASHBOARD HEADER — متين v6 | هوية بصرية موحدة
   ألوان: #06060E خلفية، #D4A843 ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════════ */

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

// ─── Design Tokens ────────────────────────────────────────
const GOLD = '#D4A843';
const TEXT = '#EEEEF5';
const TEXT_DIM = 'rgba(238,238,245,0.55)';
const BORDER = 'rgba(255,255,255,0.07)';
const BG_CARD = '#10101E';

// ─── Role Labels & Emoji ──────────────────────────────────
const roleLabels: Record<string, string> = {
  'super_admin':        'مالك المنصة',
  'platform_owner':     'مالك المنصة',
  'admin':              'مدير المؤسسة',
  'owner':              'مالك المؤسسة',
  'school_owner':       'مدير المدرسة',
  'university_owner':   'مدير الجامعة',
  'institute_owner':    'مدير المعهد',
  'kindergarten_owner': 'مدير الروضة',
  'training_owner':     'مدير التدريب',
  'teacher':            'معلم',
  'student':            'طالب',
  'parent':             'ولي أمر',
  'driver':             'سائق',
  'guard':              'حارس أمن',
  'platform_staff':     'موظف المنصة',
};

const roleAccent: Record<string, string> = {
  super_admin:         '#D4A843',
  platform_owner:      '#D4A843',
  admin:               '#60A5FA',
  school_owner:        '#34D399',
  university_owner:    '#A78BFA',
  institute_owner:     '#F472B6',
  kindergarten_owner:  '#FB923C',
  training_owner:      '#22D3EE',
  owner:               '#34D399',
  teacher:             '#4ADE80',
  student:             '#38BDF8',
  parent:              '#F9A8D4',
  driver:              '#FCD34D',
  guard:               '#F87171',
  platform_staff:      '#94A3B8',
};

const roleEmoji: Record<string, string> = {
  'super_admin':        '👑',
  'platform_owner':     '👑',
  'admin':              '🏫',
  'owner':              '🏛️',
  'school_owner':       '🏫',
  'university_owner':   '🎓',
  'institute_owner':    '🏢',
  'kindergarten_owner': '🌱',
  'training_owner':     '📚',
  'teacher':            '👨‍🏫',
  'student':            '🎒',
  'parent':             '👨‍👩‍👧',
  'driver':             '🚌',
  'guard':              '🛡️',
  'platform_staff':     '💼',
};

// ─── Breadcrumb Map ───────────────────────────────────────
const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'لوحة التحكم',
  '/dashboard/admin': 'لوحة التحكم',
  '/dashboard/teacher': 'لوحتي',
  '/dashboard/student': 'لوحتي',
  '/dashboard/parent': 'لوحتي',
  '/dashboard/driver': 'لوحتي',
  '/dashboard/guard': 'لوحتي',
  '/owner': 'نظرة عامة',
  '/dashboard/students': 'الطلاب',
  '/dashboard/teachers': 'المعلمون',
  '/dashboard/classes': 'الفصول',
  '/dashboard/attendance': 'الحضور والغياب',
  '/dashboard/grades': 'الدرجات',
  '/dashboard/homework': 'الواجبات',
  '/dashboard/exams': 'الاختبارات',
  '/dashboard/schedules': 'الجداول',
  '/dashboard/settings': 'الإعدادات',
  '/dashboard/messages': 'الرسائل',
  '/dashboard/notifications': 'الإشعارات',
  '/dashboard/reports': 'التقارير',
  '/dashboard/schools': 'المؤسسات',
  '/dashboard/users': 'المستخدمون',
  '/dashboard/support': 'الدعم الفني',
  '/dashboard/transport': 'النقل المدرسي',
  '/dashboard/cafeteria': 'المقصف',
  '/dashboard/health': 'الصحة',
  '/dashboard/library': 'المكتبة الرقمية',
  '/dashboard/community': 'الملتقى المجتمعي',
  '/dashboard/store': 'المتجر',
  '/dashboard/ai-chat': 'المساعد الذكي',
  '/dashboard/finance': 'المالية',
  '/dashboard/activity-log': 'سجل النشاط',
};

// ─── SVG Icons ────────────────────────────────────────────
const BellIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const MenuIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ChevronIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SettingsIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" />
  </svg>
);

const ProfileIcon = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </svg>
);

// ─── Header Component ─────────────────────────────────────
export default function DashboardHeader({ onMenuClick, showMenuButton }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // إغلاق عند النقر خارج
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const userRole = user?.role || 'admin';
  const accent = roleAccent[userRole] || GOLD;
  const pageTitle = breadcrumbMap[pathname] || 'لوحة التحكم';

  return (
    <header style={{
      height: 62,
      background: 'rgba(6, 6, 14, 0.85)',
      backdropFilter: 'blur(24px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
      borderBottom: `1px solid ${BORDER}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: 12,
    }}>

      {/* ── الجانب الأيمن: زر القائمة + عنوان الصفحة ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: TEXT,
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <MenuIcon />
          </button>
        )}

        {/* عنوان الصفحة */}
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: isMobile ? 15 : 17,
            fontWeight: 800,
            color: TEXT,
            letterSpacing: -0.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {pageTitle}
          </div>
          {!isMobile && (
            <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.35)', marginTop: 1, fontWeight: 500 }}>
              منصة متين التعليمية
            </div>
          )}
        </div>
      </div>

      {/* ── الجانب الأيسر: الإشعارات + الحساب ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {/* زر الإشعارات */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
            style={{
              background: showNotifications ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showNotifications ? 'rgba(255,255,255,0.15)' : BORDER}`,
              borderRadius: 10,
              width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: TEXT_DIM,
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = showNotifications ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}
          >
            <BellIcon />
            {/* نقطة إشعار */}
            <span style={{
              position: 'absolute', top: 8, left: 8,
              width: 7, height: 7, borderRadius: '50%',
              background: '#EF4444',
              border: '1.5px solid #06060E',
            }} />
          </button>

          {/* قائمة الإشعارات */}
          {showNotifications && (
            <div style={{
              position: 'absolute', left: 0, top: 46,
              width: 300,
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              zIndex: 200,
            }}>
              <div style={{
                padding: '14px 16px',
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>الإشعارات</span>
                <span style={{ color: GOLD, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>تحديد الكل كمقروء</span>
              </div>
              <div style={{ padding: '28px 20px', textAlign: 'center', color: 'rgba(238,238,245,0.30)', fontSize: 13 }}>
                لا توجد إشعارات جديدة
              </div>
              <div style={{ padding: '10px 14px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' }}>
                <Link
                  href="/dashboard/notifications"
                  style={{ color: GOLD, fontSize: 12, textDecoration: 'none', fontWeight: 600 }}
                  onClick={() => setShowNotifications(false)}
                >
                  عرض كل الإشعارات
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* زر الحساب */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}
            style={{
              background: showDropdown ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showDropdown ? 'rgba(255,255,255,0.15)' : BORDER}`,
              borderRadius: 11,
              padding: isMobile ? '5px 8px' : '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              color: TEXT,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = showDropdown ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}
          >
            {/* أفاتار المستخدم */}
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `rgba(${accent === GOLD ? '212,168,67' : '255,255,255'},0.12)`,
              border: `1.5px solid ${accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
            }}>
              {roleEmoji[userRole] || '👤'}
            </div>
            {!isMobile && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: TEXT, lineHeight: 1.2 }}>
                  {user?.name || 'المستخدم'}
                </div>
                <div style={{ fontSize: 10, color: accent, fontWeight: 700, letterSpacing: 0.3 }}>
                  {roleLabels[userRole] || ''}
                </div>
              </div>
            )}
            <span style={{ color: TEXT_DIM, display: 'flex', alignItems: 'center' }}>
              <ChevronIcon />
            </span>
          </button>

          {/* قائمة الحساب */}
          {showDropdown && (
            <div style={{
              position: 'absolute', left: 0, top: 48,
              width: 220,
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              zIndex: 200,
            }}>
              {/* معلومات المستخدم */}
              <div style={{
                padding: '16px',
                borderBottom: `1px solid ${BORDER}`,
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `rgba(${accent === GOLD ? '212,168,67' : '255,255,255'},0.10)`,
                  border: `1.5px solid ${accent}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 10px',
                }}>
                  {roleEmoji[userRole] || '👤'}
                </div>
                <div style={{ color: TEXT, fontWeight: 800, fontSize: 14 }}>{user?.name || 'المستخدم'}</div>
                <div style={{ color: accent, fontSize: 11, fontWeight: 700, marginTop: 3 }}>
                  {roleLabels[userRole] || ''}
                </div>
                {user?.email && (
                  <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 10, marginTop: 3 }}>
                    {user.email}
                  </div>
                )}
              </div>

              {/* الروابط */}
              <button
                onClick={() => { router.push('/profile'); setShowDropdown(false); }}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '11px 16px', color: TEXT_DIM, fontSize: 13,
                  cursor: 'pointer', textAlign: 'right',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontWeight: 500, fontFamily: 'var(--font)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = TEXT; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = TEXT_DIM; }}
              >
                <span style={{ color: accent }}><ProfileIcon /></span>
                الملف الشخصي
              </button>

              <button
                onClick={() => { router.push('/dashboard/settings'); setShowDropdown(false); }}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '11px 16px', color: TEXT_DIM, fontSize: 13,
                  cursor: 'pointer', textAlign: 'right',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontWeight: 500, fontFamily: 'var(--font)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = TEXT; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = TEXT_DIM; }}
              >
                <span style={{ color: accent }}><SettingsIcon /></span>
                الإعدادات
              </button>

              <button
                onClick={handleLogout}
                style={{
                  width: '100%', background: 'none',
                  border: 'none',
                  borderTop: `1px solid ${BORDER}`,
                  padding: '11px 16px', color: '#F87171', fontSize: 13,
                  cursor: 'pointer', textAlign: 'right',
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontWeight: 600, fontFamily: 'var(--font)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <LogoutIcon />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
