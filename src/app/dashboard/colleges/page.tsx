'use client';

import { useState } from 'react';

const C = {
  bg: '#06060E',
  sidebar: '#09071A',
  card: '#0D0B1F',
  cardAlt: '#100E22',
  border: 'rgba(167,139,250,0.13)',
  borderGold: 'rgba(212,168,67,0.22)',
  purple: '#A78BFA',
  purple2: '#8B5CF6',
  gold: '#D4A843',
  text: '#EEEEF5',
  dim: 'rgba(238,238,245,0.55)',
  muted: 'rgba(238,238,245,0.28)',
  green: '#10B981',
  red: '#EF4444',
  blue: '#60A5FA',
  orange: '#FB923C',
  cyan: '#22D3EE',
};

const SIDEBAR_SECTIONS = [
  {
    label: 'الرئيسية',
    items: [
      { id: 'dashboard', label: 'لوحتي', icon: '⊞' },
      { id: 'calendar', label: 'التقويم الأكاديمي', icon: '📅' },
    ],
  },
  {
    label: 'الكلية',
    items: [
      { id: 'departments', label: 'الأقسام الأكاديمية', icon: '🏛' },
      { id: 'curricula', label: 'المقررات والخطط', icon: '📚' },
      { id: 'schedules', label: 'الجداول الدراسية', icon: '🗓' },
      { id: 'halls', label: 'القاعات والمختبرات', icon: '🔬' },
    ],
  },
  {
    label: 'الطلاب',
    items: [
      { id: 'students', label: 'طلاب الكلية', icon: '🎓' },
      { id: 'admissions', label: 'طلبات القبول', icon: '📥', badge: 8 },
      { id: 'enrollment', label: 'التسجيل الفصلي', icon: '📝' },
      { id: 'complaints', label: 'الشكاوى', icon: '📣', badge: 4 },
      { id: 'certificates', label: 'الشهادات والتخرج', icon: '🏅' },
    ],
  },
  {
    label: 'هيئة التدريس',
    items: [
      { id: 'doctors', label: 'الدكاترة', icon: '👨‍🏫' },
      { id: 'assistants', label: 'المعيدون', icon: '👩‍🎓' },
      { id: 'admins', label: 'الموظفون الإداريون', icon: '🧑‍💼' },
      { id: 'permissions', label: 'إدارة الصلاحيات', icon: '🔐', accent: true },
      { id: 'leaves', label: 'الإجازات', icon: '🌴', badge: 3 },
      { id: 'performance', label: 'تقييم الأداء', icon: '📊' },
    ],
  },
  {
    label: 'العمليات',
    items: [
      { id: 'attendance', label: 'الحضور', icon: '✅' },
      { id: 'grades', label: 'الدرجات', icon: '📈' },
      { id: 'reports', label: 'التقارير', icon: '📋' },
      { id: 'research', label: 'الأبحاث', icon: '🔭' },
      { id: 'postgrad', label: 'الدراسات العليا', icon: '🎖' },
    ],
  },
  {
    label: 'المالية',
    items: [
      { id: 'fees', label: 'رسوم الطلاب', icon: '💰', badge: 6 },
      { id: 'grants', label: 'المنح', icon: '🎁' },
      { id: 'budget', label: 'ميزانية الكلية', icon: '🏦' },
    ],
  },
  {
    label: 'التقنية',
    items: [
      { id: 'collegepage', label: 'صفحة الكلية', icon: '🌐', greenDot: true },
      { id: 'settings', label: 'الإعدادات', icon: '⚙️' },
    ],
  },
];

const STATS = [
  {
    value: '820',
    label: 'طلاب الكلية',
    sub: '↑ 48 هذا الفصل',
    color: C.purple,
    icon: '🎓',
    bg: 'rgba(167,139,250,0.10)',
  },
  {
    value: '62',
    label: 'هيئة التدريس',
    sub: '42 دكتور · 12 معيد · 8 إداريين',
    color: C.blue,
    icon: '👨‍🏫',
    bg: 'rgba(96,165,250,0.10)',
  },
  {
    value: '89%',
    label: 'نسبة الحضور',
    sub: 'معدل الفصل الحالي',
    color: C.green,
    icon: '✅',
    bg: 'rgba(16,185,129,0.10)',
  },
  {
    value: '124',
    label: 'متأهلون للتخرج',
    sub: 'معدل قبول 96%',
    color: C.gold,
    icon: '🏅',
    bg: 'rgba(212,168,67,0.10)',
  },
];

const DEPARTMENTS = [
  { name: 'الهندسة المدنية', students: 180, faculty: 8, labs: 3, color: C.blue },
  { name: 'الهندسة الكهربائية', students: 160, faculty: 9, labs: 2, color: C.purple },
  { name: 'علوم الحاسب', students: 210, faculty: 11, labs: 4, color: C.cyan },
  { name: 'الهندسة الميكانيكية', students: 140, faculty: 7, labs: 2, color: C.orange },
  { name: 'الهندسة المعمارية', students: 90, faculty: 5, labs: 1, color: C.green },
  { name: 'الهندسة الكيميائية', students: 40, faculty: 2, labs: 0, color: C.gold },
];

const STAFF = [
  { name: 'د. خالد العمري', role: 'أستاذ دكتور', dept: 'الهندسة المدنية', status: 'نشط', perm: 'مشرف قسم', statusColor: C.green },
  { name: 'د. منال السالم', role: 'أستاذ مشارك', dept: 'علوم الحاسب', status: 'نشط', perm: 'عضو هيئة تدريس', statusColor: C.green },
  { name: 'د. فيصل الحربي', role: 'أستاذ مساعد', dept: 'الكهربائية', status: 'إجازة', perm: 'عضو هيئة تدريس', statusColor: C.orange },
  { name: 'م. سارة الزهراني', role: 'معيدة', dept: 'الميكانيكية', status: 'نشط', perm: 'معيد', statusColor: C.green },
  { name: 'أ. طارق القحطاني', role: 'موظف إداري', dept: 'الإدارة', status: 'نشط', perm: 'قراءة فقط', statusColor: C.green },
  { name: 'د. ريم العتيبي', role: 'أستاذ مشارك', dept: 'المعماري', status: 'غائب', perm: 'عضو هيئة تدريس', statusColor: C.red },
];

const LEAVES = [
  { name: 'د. فيصل الحربي', type: 'إجازة مرضية', duration: '14 يوم', dept: 'الكهربائية' },
  { name: 'م. سارة الزهراني', type: 'إجازة سنوية', duration: '7 أيام', dept: 'الميكانيكية' },
  { name: 'أ. ماجد الدوسري', type: 'إجازة طارئة', duration: '3 أيام', dept: 'الإدارة' },
];

const ACTIVITY = [
  { time: 'منذ 20 دقيقة', text: 'تم قبول طلب تسجيل — محمد السلمي (الميكانيكية)', icon: '✅', color: C.green },
  { time: 'منذ ساعة', text: 'تقرير الحضور الأسبوعي متاح للمراجعة', icon: '📊', color: C.blue },
  { time: 'منذ ساعتين', text: 'شكوى جديدة من طالب في قسم الحاسب', icon: '📣', color: C.orange },
  { time: 'البارحة', text: 'اعتماد بحث علمي — د. خالد العمري', icon: '🔭', color: C.purple },
  { time: 'البارحة', text: 'تحديث جدول قاعة 3-ب للفصل القادم', icon: '🗓', color: C.cyan },
];

const QUICK_ACTIONS = [
  { label: 'الصلاحيات', icon: '🔐', color: C.purple },
  { label: 'إضافة دكتور', icon: '👨‍🏫', color: C.blue },
  { label: 'إضافة معيد', icon: '👩‍🎓', color: C.cyan },
  { label: 'إضافة موظف', icon: '🧑‍💼', color: C.green },
  { label: 'قبول طالب', icon: '📥', color: C.gold },
  { label: 'شهادات', icon: '🏅', color: C.orange },
  { label: 'التقارير', icon: '📋', color: C.blue },
  { label: 'الأبحاث', icon: '🔭', color: C.purple },
  { label: 'إشعار جماعي', icon: '📢', color: C.red },
  { label: 'الرسوم', icon: '💰', color: C.gold },
  { label: 'الدراسات العليا', icon: '🎖', color: C.cyan },
  { label: 'الإعدادات', icon: '⚙️', color: C.muted },
];

export default function CollegesDeanDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [staffFilter, setStaffFilter] = useState('');

  const filteredStaff = STAFF.filter(
    (s) =>
      staffFilter === '' ||
      s.dept.includes(staffFilter) ||
      s.role.includes(staffFilter) ||
      s.name.includes(staffFilter)
  );

  return (
    <div
      style={{
        direction: 'rtl',
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif",
        display: 'flex',
      }}
    >
      {/* ===================== SIDEBAR ===================== */}
      <aside
        style={{
          width: 260,
          minWidth: 260,
          background: C.sidebar,
          borderLeft: `1px solid ${C.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
        }}
      >
        {/* Dean Card */}
        <div
          style={{
            padding: '24px 20px 20px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.purple2}, ${C.purple})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
                boxShadow: `0 0 0 2px ${C.sidebar}, 0 0 0 4px ${C.purple2}`,
              }}
            >
              👨‍💼
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>
                د. سعد الرشيد
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: C.gold,
                  marginTop: 2,
                  fontWeight: 600,
                }}
              >
                عميد الكلية
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 12,
              color: C.dim,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ color: C.green, fontSize: 8 }}>●</span>
            كلية الهندسة والتقنية
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.muted,
                  letterSpacing: '0.08em',
                  padding: '10px 20px 4px',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </div>
              {section.items.map((item: any) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      width: '100%',
                      background: isActive
                        ? 'rgba(167,139,250,0.15)'
                        : 'transparent',
                      border: 'none',
                      borderRight: isActive
                        ? `3px solid ${C.purple}`
                        : '3px solid transparent',
                      color: isActive
                        ? C.purple
                        : item.accent
                        ? C.purple
                        : C.dim,
                      padding: '10px 20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 400,
                      textAlign: 'right',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.greenDot && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: C.green,
                          display: 'inline-block',
                        }}
                      />
                    )}
                    {item.badge && (
                      <span
                        style={{
                          background: item.accent ? C.purple2 : C.red,
                          color: '#fff',
                          borderRadius: 20,
                          padding: '2px 7px',
                          fontSize: 11,
                          fontWeight: 700,
                          minWidth: 20,
                          textAlign: 'center',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${C.border}`,
            fontSize: 11,
            color: C.muted,
            textAlign: 'center',
          }}
        >
          متين v6 — كلية الهندسة والتقنية
        </div>
      </aside>

      {/* ===================== MAIN CONTENT ===================== */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: C.text,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.purple2}, ${C.purple})`,
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                }}
              >
                ⊞
              </span>
              لوحة تحكم العميد
            </h1>
            <p
              style={{
                margin: '6px 0 0',
                color: C.dim,
                fontSize: 14,
              }}
            >
              مرحباً، د. سعد — كلية الهندسة والتقنية · الفصل الدراسي الثاني 1446
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 13,
                color: C.dim,
              }}
            >
              الثلاثاء، 8 أبريل 2026
            </div>
            <div
              style={{
                background: `rgba(16,185,129,0.12)`,
                border: `1px solid rgba(16,185,129,0.3)`,
                borderRadius: 10,
                padding: '8px 16px',
                fontSize: 13,
                color: C.green,
                fontWeight: 600,
              }}
            >
              ● النظام يعمل
            </div>
          </div>
        </div>

        {/* ---- STATS GRID ---- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 80,
                  height: 80,
                  background: stat.bg,
                  borderRadius: '0 14px 0 80px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-end',
                  padding: '10px 12px',
                  fontSize: 22,
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: stat.color,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* ---- DEPARTMENTS GRID ---- */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 28,
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
            <h2
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: C.text,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              🏛 الأقسام الأكاديمية
            </h2>
            <span
              style={{
                background: 'rgba(167,139,250,0.12)',
                color: C.purple,
                fontSize: 12,
                fontWeight: 700,
                borderRadius: 20,
                padding: '4px 12px',
                border: `1px solid ${C.border}`,
              }}
            >
              6 أقسام
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}
          >
            {DEPARTMENTS.map((dept, i) => (
              <div
                key={i}
                style={{
                  background: C.cardAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '16px 18px',
                  borderTop: `3px solid ${dept.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.text,
                    marginBottom: 12,
                  }}
                >
                  {dept.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 12,
                    color: C.dim,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ color: dept.color }}>🎓</span>
                    {dept.students} طالب
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ color: dept.color }}>👨‍🏫</span>
                    {dept.faculty} عضو
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ color: dept.color }}>🔬</span>
                    {dept.labs > 0 ? `${dept.labs} مختبر` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- GRID-2: Staff + Leaves + Activity ---- */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            marginBottom: 28,
          }}
        >
          {/* Staff Table */}
          <div
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              padding: '20px 22px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                👨‍🏫 هيئة التدريس
              </h2>
              <input
                type="text"
                placeholder="تصفية..."
                value={staffFilter}
                onChange={(e) => setStaffFilter(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '6px 12px',
                  color: C.text,
                  fontSize: 12,
                  outline: 'none',
                  width: 130,
                }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['الاسم', 'الدور', 'القسم', 'الحالة', 'الصلاحيات'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '8px 10px',
                          textAlign: 'right',
                          color: C.muted,
                          fontWeight: 600,
                          borderBottom: `1px solid ${C.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((s, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      <td
                        style={{
                          padding: '10px 10px',
                          color: C.text,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.name}
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          color: C.dim,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.role}
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          color: C.dim,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.dept}
                      </td>
                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            background: `${s.statusColor}18`,
                            color: s.statusColor,
                            borderRadius: 20,
                            padding: '3px 9px',
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '10px 10px',
                          color: C.muted,
                          fontSize: 12,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {s.perm}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leaves + Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Leave Requests */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '18px 20px',
                flex: 1,
              }}
            >
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                🌴 طلبات الإجازة
                <span
                  style={{
                    background: `rgba(251,146,60,0.15)`,
                    color: C.orange,
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 20,
                    padding: '2px 8px',
                    border: `1px solid rgba(251,146,60,0.3)`,
                  }}
                >
                  3 معلّقة
                </span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LEAVES.map((lv, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.cardAlt,
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 13,
                          color: C.text,
                        }}
                      >
                        {lv.name}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {lv.type} · {lv.duration} · {lv.dept}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        style={{
                          background: 'rgba(16,185,129,0.12)',
                          border: `1px solid rgba(16,185,129,0.3)`,
                          color: C.green,
                          borderRadius: 7,
                          padding: '5px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        قبول
                      </button>
                      <button
                        style={{
                          background: 'rgba(239,68,68,0.10)',
                          border: `1px solid rgba(239,68,68,0.3)`,
                          color: C.red,
                          borderRadius: 7,
                          padding: '5px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                padding: '18px 20px',
                flex: 1,
              }}
            >
              <h2
                style={{
                  margin: '0 0 14px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                📋 سجل النشاط
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {ACTIVITY.map((act, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      paddingBottom: i < ACTIVITY.length - 1 ? 10 : 0,
                      borderBottom:
                        i < ACTIVITY.length - 1
                          ? `1px solid ${C.border}`
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        lineHeight: 1,
                        marginTop: 1,
                      }}
                    >
                      {act.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: C.dim }}>{act.text}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                        {act.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- QUICK ACTIONS ---- */}
        <div
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              margin: '0 0 18px',
              fontSize: 16,
              fontWeight: 700,
              color: C.text,
            }}
          >
            ⚡ الإجراءات السريعة
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 12,
            }}
          >
            {QUICK_ACTIONS.map((qa, i) => (
              <button
                key={i}
                style={{
                  background: C.cardAlt,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: '14px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                  color: C.text,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${qa.color}44`;
                  (e.currentTarget as HTMLButtonElement).style.background = `${qa.color}10`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${C.border}`;
                  (e.currentTarget as HTMLButtonElement).style.background = C.cardAlt;
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${qa.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${qa.color}33`,
                  }}
                >
                  {qa.icon}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.dim, textAlign: 'center' }}>
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ---- FOOTER ---- */}
        <div
          style={{
            textAlign: 'center',
            color: C.muted,
            fontSize: 12,
            padding: '12px 0 4px',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          متين v6 — كلية الهندسة والتقنية
        </div>
      </main>
    </div>
  );
}
