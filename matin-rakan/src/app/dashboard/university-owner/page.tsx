'use client';

import { useState } from 'react';

const C = {
  accent: '#60A5FA',
  accent2: '#3B82F6',
  gold: '#D4A843',
  gold2: '#E8C060',
  bg: '#06060E',
  bgSb: '#07071A',
  text: '#EEEEF5',
  textDim: 'rgba(238,238,245,0.55)',
  textMuted: 'rgba(238,238,245,0.28)',
  green: '#10B981',
  red: '#EF4444',
  purple: '#A78BFA',
  orange: '#FB923C',
  cyan: '#22D3EE',
};

const navGroups = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'dashboard', label: 'لوحة التحكم', icon: '⊞' },
      { id: 'calendar', label: 'التقويم الأكاديمي', icon: '📅' },
      { id: 'activity-log', label: 'سجل النشاط', icon: '📋' },
    ],
  },
  {
    label: 'الهيكل الأكاديمي',
    items: [
      { id: 'colleges', label: 'الكليات والأقسام', icon: '🏛' },
      { id: 'courses', label: 'المقررات الدراسية', icon: '📚' },
      { id: 'schedules', label: 'الجداول الدراسية', icon: '🗓' },
      { id: 'programs', label: 'البرامج الأكاديمية', icon: '🎓' },
    ],
  },
  {
    label: 'الطلاب',
    items: [
      { id: 'students', label: 'الطلاب المقيدون', icon: '👨‍🎓' },
      { id: 'admissions', label: 'طلبات القبول', icon: '📥', badge: '12' },
      { id: 'enrollment', label: 'التسجيل الفصلي', icon: '📝', badge: 'مفتوح', badgeColor: C.green },
      { id: 'complaints', label: 'الشكاوى', icon: '⚠', badge: '7', badgeColor: C.orange },
      { id: 'graduation', label: 'الشهادات والتخرج', icon: '🏅' },
    ],
  },
  {
    label: 'هيئة التدريس',
    items: [
      { id: 'faculty', label: 'الدكاترة والمعيدون', icon: '👨‍🏫' },
      { id: 'contracts', label: 'العقود والملفات', icon: '📄' },
      { id: 'leaves', label: 'الإجازات والاستئذانات', icon: '🏖' },
      { id: 'research', label: 'الأبحاث والنشر', icon: '🔬' },
    ],
  },
  {
    label: 'العمليات الأكاديمية',
    items: [
      { id: 'attendance', label: 'الحضور والغياب', icon: '✅' },
      { id: 'grades', label: 'الدرجات والمعدلات', icon: '📊' },
      { id: 'finals', label: 'الاختبارات النهائية', icon: '📝', badge: '2', badgeColor: C.red },
      { id: 'discipline', label: 'السلوك والانضباط', icon: '🔒' },
    ],
  },
  {
    label: 'الساعات المعتمدة',
    items: [
      { id: 'credit-hours', label: 'إدارة الساعات', icon: '⏱' },
      { id: 'gpa-reports', label: 'تقارير المعدلات', icon: '📈' },
    ],
  },
  {
    label: 'الدراسات العليا',
    items: [
      { id: 'postgrad', label: 'طلاب الماجستير والدكتوراه', icon: '🎓' },
      { id: 'thesis', label: 'الأطروحات والرسائل', icon: '📜' },
    ],
  },
  {
    label: 'المالية',
    items: [
      { id: 'fees', label: 'رسوم الطلاب', icon: '💳', badge: '18', badgeColor: C.red },
      { id: 'salaries', label: 'الرواتب والمالية', icon: '💰' },
      { id: 'scholarships', label: 'المنح والتخفيضات', icon: '🎁' },
      { id: 'invoices', label: 'الضريبة والفواتير', icon: '🧾' },
    ],
  },
  {
    label: 'الصلاحيات والتقنية',
    items: [
      { id: 'roles', label: 'صلاحيات الأدوار', icon: '🔑' },
      { id: 'integrations', label: 'التكاملات', icon: '🔗' },
      { id: 'frontend', label: 'الواجهة الأمامية', icon: '🖥' },
      { id: 'editor', label: 'محرر الواجهة', icon: '✏' },
      { id: 'settings', label: 'الإعدادات', icon: '⚙' },
    ],
  },
];

const colleges = [
  { name: 'كلية الهندسة', students: 820, faculty: 42, depts: 6, color: C.accent },
  { name: 'إدارة الأعمال', students: 640, faculty: 28, depts: 5, color: C.purple },
  { name: 'الطب', students: 580, faculty: 36, depts: 4, color: C.red },
  { name: 'العلوم', students: 490, faculty: 24, depts: 5, color: C.cyan },
  { name: 'القانون', students: 380, faculty: 18, depts: 3, color: C.gold },
  { name: 'التربية', students: 410, faculty: 22, depts: 4, color: C.green },
  { name: 'الفنون', students: 280, faculty: 14, depts: 3, color: C.orange },
  { name: 'الدراسات العليا', students: 242, faculty: 38, depts: 12, color: C.gold2 },
];

const admissionRequests = [
  { name: 'أحمد محمد السالم', college: 'كلية الهندسة', gpa: '94.5%', date: 'منذ يومين' },
  { name: 'فاطمة عبدالله الراشد', college: 'كلية الطب', gpa: '97.1%', date: 'منذ 3 أيام' },
  { name: 'خالد إبراهيم المنصور', college: 'إدارة الأعمال', gpa: '88.3%', date: 'منذ يوم' },
  { name: 'نورة سعد القحطاني', college: 'كلية العلوم', gpa: '91.7%', date: 'منذ 4 أيام' },
];

const recentActivities = [
  { dot: C.green, text: 'تم قبول 14 طالب في كلية الهندسة', time: 'منذ 12 دقيقة' },
  { dot: C.accent, text: 'تحديث جدول محاضرات الفصل الثاني', time: 'منذ 45 دقيقة' },
  { dot: C.orange, text: 'شكوى جديدة من طالب في كلية الطب', time: 'منذ ساعة' },
  { dot: C.purple, text: 'نشر نتائج اختبارات إدارة الأعمال', time: 'منذ ساعتين' },
  { dot: C.gold, text: 'تسديد رسوم 230 طالب', time: 'منذ 3 ساعات' },
  { dot: C.red, text: 'غياب متكرر: 7 طلاب في كلية التربية', time: 'منذ 5 ساعات' },
];

const enrollmentByCollege = [
  { name: 'الهندسة', enrolled: 780, total: 820 },
  { name: 'الطب', enrolled: 540, total: 580 },
  { name: 'إدارة الأعمال', enrolled: 590, total: 640 },
  { name: 'العلوم', enrolled: 330, total: 490 },
];

const quickActionsRows = [
  {
    label: 'العمليات الأكاديمية',
    color: C.accent,
    items: [
      { label: 'قبول طالب', icon: '✅', color: C.green },
      { label: 'تعيين دكتور', icon: '👨‍🏫', color: C.purple },
      { label: 'فتح التسجيل', icon: '🔓', color: C.accent },
      { label: 'شهادات التخرج', icon: '🏅', color: C.gold },
      { label: 'المقررات', icon: '📚', color: C.cyan },
      { label: 'إشعار جماعي', icon: '📣', color: C.orange },
    ],
  },
  {
    label: 'المالية والإدارة',
    color: C.gold,
    items: [
      { label: 'إصدار فاتورة', icon: '🧾', color: C.gold },
      { label: 'صرف الرواتب', icon: '💰', color: C.green },
      { label: 'منحة دراسية', icon: '🎁', color: C.purple },
      { label: 'تقرير مالي', icon: '📊', color: C.accent },
      { label: 'رسوم معلقة', icon: '⏳', color: C.red },
      { label: 'التدقيق المالي', icon: '🔍', color: C.orange },
    ],
  },
  {
    label: 'الخدمات والتكنولوجيا',
    color: C.cyan,
    items: [
      { label: 'إدارة الأدوار', icon: '🔑', color: C.accent },
      { label: 'النسخ الاحتياطي', icon: '☁', color: C.cyan },
      { label: 'محرر الواجهة', icon: '✏', color: C.purple },
      { label: 'التكاملات', icon: '🔗', color: C.orange },
      { label: 'إعدادات النظام', icon: '⚙', color: C.textDim as string },
      { label: 'سجل المراجعة', icon: '📋', color: C.gold },
    ],
  },
];

export default function UniversityOwnerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: C.bg,
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        color: C.text,
        direction: 'rtl',
      }}
    >
      {/* ─── Sidebar ─── */}
      <aside
        style={{
          width: sidebarCollapsed ? 64 : 268,
          minWidth: sidebarCollapsed ? 64 : 268,
          background: C.bgSb,
          borderLeft: `1px solid rgba(96,165,250,0.08)`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s',
          overflow: 'hidden',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: `1px solid rgba(96,165,250,0.08)`,
            flexShrink: 0,
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${C.accent}, ${C.accent2})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                ج
              </div>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>جامعة الرياض</div>
                <div style={{ color: C.textMuted, fontSize: 10 }}>رئيس الجامعة</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'rgba(96,165,250,0.08)',
              border: '1px solid rgba(96,165,250,0.15)',
              borderRadius: 6,
              color: C.accent,
              cursor: 'pointer',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {sidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Nav Groups */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '12px 8px' }}>
          {navGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 8 }}>
              {!sidebarCollapsed && (
                <div
                  style={{
                    color: C.textMuted,
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    padding: '6px 10px 4px',
                  }}
                >
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: sidebarCollapsed ? '9px 0' : '9px 12px',
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      borderRadius: 8,
                      background: isActive ? `rgba(96,165,250,0.12)` : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(96,165,250,0.25)' : 'transparent'}`,
                      color: isActive ? C.accent : C.textDim,
                      cursor: 'pointer',
                      fontSize: 12,
                      fontWeight: isActive ? 700 : 500,
                      marginBottom: 2,
                      transition: 'all 0.15s',
                      textAlign: 'right',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(238,238,245,0.04)';
                        (e.currentTarget as HTMLButtonElement).style.color = C.text;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        (e.currentTarget as HTMLButtonElement).style.color = C.textDim;
                      }
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                    {!sidebarCollapsed && (
                      <>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        {(item as any).badge && (
                          <span
                            style={{
                              background: (item as any).badgeColor
                                ? `${(item as any).badgeColor}22`
                                : 'rgba(96,165,250,0.15)',
                              color: (item as any).badgeColor ?? C.accent,
                              fontSize: 9,
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: 10,
                              border: `1px solid ${(item as any).badgeColor ?? C.accent}30`,
                            }}
                          >
                            {(item as any).badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div
            style={{
              padding: '12px 16px',
              borderTop: `1px solid rgba(96,165,250,0.08)`,
              flexShrink: 0,
            }}
          >
            <div style={{ color: C.textMuted, fontSize: 10, textAlign: 'center' }}>
              نظام ماتن الأكاديمي v2.1
            </div>
          </div>
        )}
      </aside>

      {/* ─── Main ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header
          style={{
            height: 62,
            background: C.bgSb,
            borderBottom: `1px solid rgba(96,165,250,0.08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ color: C.textMuted, fontSize: 11 }}>لوحة تحكم</div>
            <span style={{ color: C.textMuted }}>›</span>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>رئيس الجامعة</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Notifications */}
            <button
              style={{
                background: 'rgba(251,146,60,0.1)',
                border: '1px solid rgba(251,146,60,0.2)',
                borderRadius: 8,
                color: C.orange,
                cursor: 'pointer',
                width: 34,
                height: 34,
                fontSize: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              🔔
              <span
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  width: 8,
                  height: 8,
                  background: C.red,
                  borderRadius: '50%',
                  border: `1px solid ${C.bgSb}`,
                }}
              />
            </button>
            {/* User Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                ر
              </div>
              <div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 600 }}>د. رائد الأحمد</div>
                <div style={{ color: C.textMuted, fontSize: 10 }}>رئيس الجامعة</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {activeSection === 'dashboard' && <DashboardSection />}
          {activeSection !== 'dashboard' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                gap: 16,
              }}
            >
              <div style={{ fontSize: 48, opacity: 0.3 }}>🚧</div>
              <div style={{ color: C.textDim, fontSize: 16, fontWeight: 600 }}>
                هذا القسم قيد التطوير
              </div>
              <div style={{ color: C.textMuted, fontSize: 13 }}>
                سيتم إضافة محتوى هذا القسم قريباً
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────── Dashboard Section ─────────────────────────── */
function DashboardSection() {
  const [approvedIds, setApprovedIds] = useState<number[]>([]);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);

  return (
    <div style={{ maxWidth: 1300, margin: '0 auto' }}>

      {/* ── Semester Bar ── */}
      <div
        style={{
          background: `linear-gradient(135deg, rgba(96,165,250,0.08), rgba(212,168,67,0.06))`,
          border: `1px solid rgba(96,165,250,0.15)`,
          borderRadius: 12,
          padding: '14px 24px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 20,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 16 }}>📅</span>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>
              الفصل الدراسي: الثاني 1445/1446
            </span>
          </div>
          <span
            style={{
              background: 'rgba(16,185,129,0.12)',
              color: C.green,
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              border: `1px solid rgba(16,185,129,0.25)`,
            }}
          >
            التسجيل مفتوح
          </span>
          <span style={{ color: C.textMuted, fontSize: 12 }}>تاريخ البدء: 15 يناير 2025</span>
          <span style={{ color: C.textMuted, fontSize: 12 }}>الاختبارات: 10 مايو 2025</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: C.textDim, fontSize: 12 }}>تقدم الفصل</span>
          <div
            style={{
              width: 140,
              height: 6,
              background: 'rgba(238,238,245,0.08)',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '62%',
                height: '100%',
                background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
                borderRadius: 3,
              }}
            />
          </div>
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>62%</span>
        </div>
      </div>

      {/* ── Stats Grid (5 cards) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          {
            title: 'إجمالي الطلاب',
            value: '3,842',
            sub: '↑ 148 هذا الفصل',
            color: C.accent,
            icon: '👨‍🎓',
          },
          {
            title: 'هيئة التدريس',
            value: '186',
            sub: '142 دكتور · 44 معيد',
            color: C.purple,
            icon: '👨‍🏫',
          },
          {
            title: 'الكليات',
            value: '8',
            sub: '32 قسم · 68 برنامج',
            color: C.cyan,
            icon: '🏛',
          },
          {
            title: 'الإيرادات',
            value: '4.2M',
            sub: '↓ 380K رسوم معلقة',
            color: C.gold,
            icon: '💰',
          },
          {
            title: 'خريج هذا الفصل',
            value: '312',
            sub: 'معدل تخرج 94%',
            color: C.green,
            icon: '🏅',
          },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: `linear-gradient(135deg, ${s.color}0A, ${s.color}04)`,
              border: `1px solid ${s.color}22`,
              borderRadius: 14,
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 30px ${s.color}18`;
              (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLDivElement).style.borderColor = `${s.color}22`;
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 70,
                height: 70,
                background: `${s.color}07`,
                borderRadius: '0 0 70px 0',
              }}
            />
            <div
              style={{
                fontSize: 20,
                marginBottom: 8,
                position: 'relative',
              }}
            >
              {s.icon}
            </div>
            <div style={{ color: C.textMuted, fontSize: 11, marginBottom: 6, fontWeight: 500 }}>
              {s.title}
            </div>
            <div style={{ color: C.text, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ color: s.color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Colleges Grid (8 cards) ── */}
      <div
        style={{
          background: 'rgba(255,255,255,0.015)',
          border: '1px solid rgba(96,165,250,0.08)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div style={{ color: C.accent, fontSize: 14, fontWeight: 700 }}>الكليات الأكاديمية</div>
          <span style={{ color: C.textMuted, fontSize: 11 }}>8 كليات · 32 قسم</span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          {colleges.map((col, i) => (
            <div
              key={i}
              style={{
                background: `${col.color}08`,
                border: `1px solid ${col.color}20`,
                borderRadius: 12,
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = `${col.color}14`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${col.color}40`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = `${col.color}08`;
                (e.currentTarget as HTMLDivElement).style.borderColor = `${col.color}20`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: col.color,
                  marginBottom: 8,
                }}
              />
              <div style={{ color: C.text, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                {col.name}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: col.color, fontSize: 16, fontWeight: 800 }}>
                    {col.students}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 9 }}>طالب</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: C.textDim, fontSize: 14, fontWeight: 700 }}>
                    {col.faculty}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 9 }}>هيئة</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: C.textDim, fontSize: 14, fontWeight: 700 }}>
                    {col.depts}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 9 }}>قسم</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid-3 Row ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* التسجيل الفصلي */}
        <div
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(96,165,250,0.08)',
            borderRadius: 16,
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>التسجيل الفصلي</div>
            <span
              style={{
                background: 'rgba(16,185,129,0.12)',
                color: C.green,
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                border: `1px solid rgba(16,185,129,0.25)`,
              }}
            >
              مفتوح
            </span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span style={{ color: C.textDim, fontSize: 11 }}>1,240 / 3,842 طالب</span>
              <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>32%</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 7,
                background: 'rgba(238,238,245,0.06)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '32%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${C.accent}, ${C.accent2})`,
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {enrollmentByCollege.map((col, i) => {
              const pct = Math.round((col.enrolled / col.total) * 100);
              return (
                <div key={i}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ color: C.textDim, fontSize: 11 }}>{col.name}</span>
                    <span style={{ color: C.textMuted, fontSize: 11 }}>
                      {col.enrolled}/{col.total}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 4,
                      background: 'rgba(238,238,245,0.05)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: pct >= 90 ? C.green : pct >= 60 ? C.accent : C.orange,
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* طلبات القبول */}
        <div
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(96,165,250,0.08)',
            borderRadius: 16,
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div style={{ color: C.text, fontSize: 13, fontWeight: 700 }}>طلبات القبول</div>
            <span
              style={{
                background: 'rgba(96,165,250,0.12)',
                color: C.accent,
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 10,
                border: `1px solid rgba(96,165,250,0.25)`,
              }}
            >
              12
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {admissionRequests.map((req, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(238,238,245,0.03)',
                  border: '1px solid rgba(238,238,245,0.06)',
                  borderRadius: 10,
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  opacity: approvedIds.includes(i) || rejectedIds.includes(i) ? 0.5 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: C.text,
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {req.name}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 10 }}>
                    {req.college} · {req.gpa}
                  </div>
                </div>
                {approvedIds.includes(i) ? (
                  <span style={{ color: C.green, fontSize: 11, fontWeight: 700 }}>تم القبول</span>
                ) : rejectedIds.includes(i) ? (
                  <span style={{ color: C.red, fontSize: 11, fontWeight: 700 }}>مرفوض</span>
                ) : (
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <button
                      onClick={() => setApprovedIds((p) => [...p, i])}
                      style={{
                        background: 'rgba(16,185,129,0.12)',
                        color: C.green,
                        border: `1px solid rgba(16,185,129,0.25)`,
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => setRejectedIds((p) => [...p, i])}
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        color: C.red,
                        border: `1px solid rgba(239,68,68,0.25)`,
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      رفض
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* آخر النشاطات */}
        <div
          style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(96,165,250,0.08)',
            borderRadius: 16,
            padding: '20px',
          }}
        >
          <div style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
            آخر النشاطات
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivities.map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: act.dot,
                    marginTop: 4,
                    flexShrink: 0,
                    boxShadow: `0 0 6px ${act.dot}60`,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: C.textDim,
                      fontSize: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    {act.text}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 10, marginTop: 2 }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions (3 rows) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 8 }}>
        {quickActionsRows.map((row, ri) => (
          <div
            key={ri}
            style={{
              background: 'rgba(255,255,255,0.015)',
              border: `1px solid rgba(238,238,245,0.05)`,
              borderRadius: 16,
              padding: '18px 22px',
            }}
          >
            <div
              style={{
                color: row.color,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                marginBottom: 14,
                textTransform: 'uppercase',
              }}
            >
              {row.label}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 10,
              }}
            >
              {row.items.map((act, ai) => (
                <button
                  key={ai}
                  style={{
                    background: `${act.color}0A`,
                    border: `1px solid ${act.color}20`,
                    borderRadius: 10,
                    padding: '12px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${act.color}18`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${act.color}40`;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${act.color}0A`;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = `${act.color}20`;
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: 20 }}>{act.icon}</span>
                  <span style={{ color: C.textDim, fontSize: 10, fontWeight: 600, textAlign: 'center' }}>
                    {act.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
