'use client';
import { useState } from 'react';

const ACCENT = '#10B981';
const QR = '#047857';
const GOLD = '#D4A843';
const BG = '#06060E';
const SIDEBAR_BG = '#08081A';
const BD = 'rgba(255,255,255,0.08)';
const DIM = 'rgba(238,238,245,0.7)';
const MUT = 'rgba(238,238,245,0.35)';

/* ─── tiny inline SVG icons ─────────────────────────── */
const IcHome = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcChild = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const IcProgress = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IcCalendar = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcVideo = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M23 7l-7 5 7 5V7z"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const IcStar = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcReport = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IcMsg = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcBell = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IcSettings = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IcDownload = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IcSend = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IcAward = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

/* ─── sidebar nav items ─────────────────────────────── */
const NAV = [
  { id: 'home', label: 'الرئيسية', Icon: IcHome },
  { id: 'yousef', label: 'يوسف', badge: 'ممتاز', badgeColor: '#10B981', Icon: IcChild },
  { id: 'omar', label: 'عمر', badge: 'جيد', badgeColor: '#3B82F6', Icon: IcChild },
  { id: 'progress', label: 'تقدم الحفظ', Icon: IcProgress },
  { id: 'attendance', label: 'سجل الحضور', Icon: IcCalendar },
  { id: 'tasmi', label: 'التسميع المرئي', Icon: IcVideo, isNew: true },
  { id: 'points', label: 'نقاط التحفيز', Icon: IcStar },
  { id: 'reports', label: 'التقارير', Icon: IcReport },
  { id: 'chat', label: 'مراسلة المحفظ', Icon: IcMsg, msgCount: 1 },
  { id: 'announcements', label: 'إعلانات المركز', Icon: IcBell },
  { id: 'settings', label: 'الإعدادات', Icon: IcSettings },
];

/* ─── chat messages ─────────────────────────────────── */
const MESSAGES = [
  { id: 1, from: 'muhaffiz', text: 'السلام عليكم، يوسف أدّى اليوم ختمته بامتياز ما شاء الله!', time: '09:14' },
  { id: 2, from: 'parent', text: 'وعليكم السلام، جزاكم الله خيراً على متابعتكم', time: '09:20' },
  { id: 3, from: 'muhaffiz', text: 'نرجو حضور حفل التخرج يوم الجمعة إن شاء الله', time: '09:22' },
];

/* ─── stats ──────────────────────────────────────────── */
const STATS = [
  { label: '30 جزء', sub: 'المحفوظ', color: QR },
  { label: '95%', sub: 'الحضور', color: ACCENT },
  { label: '480', sub: 'النقاط', color: GOLD },
  { label: 'المركز 1', sub: 'الترتيب', color: '#A855F7' },
];

/* ─── achievements ───────────────────────────────────── */
const ACHIEVEMENTS = [
  { label: 'ختم القرآن الكريم', date: 'رمضان 1446', color: GOLD },
  { label: 'حفظ جزء عم كاملاً', date: 'محرم 1446', color: ACCENT },
  { label: 'حضور مستمر 3 أشهر', date: 'ربيع الأول 1446', color: '#3B82F6' },
];

/* ─── component ─────────────────────────────────────── */
export default function QuranParentPage() {
  const [activeNav, setActiveNav] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState(MESSAGES);

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), from: 'parent', text: chatInput.trim(), time: 'الآن' },
    ]);
    setChatInput('');
  };

  return (
    <div
      style={{
        fontFamily: "'IBM Plex Sans Arabic','Noto Naskh Arabic',sans-serif",
        direction: 'rtl',
        background: BG,
        color: '#EEEEF5',
        minHeight: '100vh',
        display: 'flex',
      }}
    >
      {/* ═══ SIDEBAR ═══════════════════════════════════ */}
      <aside
        style={{
          width: 230,
          background: SIDEBAR_BG,
          borderLeft: '1px solid ' + BD,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            padding: '20px 16px 14px',
            borderBottom: '1px solid ' + BD,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT }}>مركز القرآن</div>
          <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>بوابة أولياء الأمور</div>
        </div>

        {/* User card */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid ' + BD,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: QR + '25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800,
              color: QR,
              flexShrink: 0,
            }}
          >
            أ
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>أبو يوسف السبيعي</div>
            <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>ولي أمر</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '10px 0' }}>
          {NAV.map((item) => {
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 16px',
                  background: active ? ACCENT + '18' : 'transparent',
                  border: 'none',
                  borderRight: active ? '3px solid ' + ACCENT : '3px solid transparent',
                  color: active ? ACCENT : DIM,
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'right',
                  transition: 'all 0.15s',
                }}
              >
                <item.Icon />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: item.badgeColor,
                      background: item.badgeColor + '20',
                      border: '1px solid ' + item.badgeColor + '40',
                      borderRadius: 10,
                      padding: '1px 7px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.isNew && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: '#fff',
                      background: ACCENT,
                      borderRadius: 10,
                      padding: '1px 6px',
                    }}
                  >
                    جديد
                  </span>
                )}
                {item.msgCount && (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.msgCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ═══ MAIN CONTENT ══════════════════════════════ */}
      <main style={{ flex: 1, padding: '24px 28px', overflowY: 'auto', minHeight: '100vh' }}>

        {/* Page header */}
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>الرئيسية</h1>
          <p style={{ fontSize: 13, color: MUT, marginTop: 4 }}>
            مرحباً أبو يوسف — الثلاثاء 8 أبريل 2026
          </p>
        </div>

        {/* ── CONGRATULATIONS BANNER ── */}
        <div
          style={{
            background: 'linear-gradient(120deg,rgba(4,120,87,0.18) 0%,rgba(212,168,67,0.12) 100%)',
            border: '1px solid ' + GOLD + '44',
            borderRadius: 14,
            padding: '16px 20px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: GOLD + '22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IcAward />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: GOLD }}>
              مبارك! يوسف أتمّ ختمة القرآن الكريم
            </div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 3 }}>
              بحمد الله أتمّ يوسف حفظ القرآن كاملاً — 30 جزءاً بإتقان وتميّز
            </div>
          </div>
          <button
            style={{
              marginRight: 'auto',
              flexShrink: 0,
              padding: '7px 16px',
              borderRadius: 9,
              border: '1px solid ' + GOLD + '55',
              background: GOLD + '18',
              color: GOLD,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            شارك الخبر
          </button>
        </div>

        {/* ── CHILDREN CARDS (2-col) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Yousef */}
          <div
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid ' + QR + '44',
              borderRadius: 14,
              padding: '18px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: QR + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    fontWeight: 800,
                    color: QR,
                  }}
                >
                  ي
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>يوسف</div>
                  <div style={{ fontSize: 11, color: MUT }}>المجموعة الأولى</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#10B981',
                  background: '#10B981' + '18',
                  border: '1px solid #10B981' + '44',
                  borderRadius: 10,
                  padding: '3px 10px',
                }}
              >
                ممتاز
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: MUT }}>تقدم الحفظ</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>30 / 30 جزء</span>
            </div>
            <div style={{ height: 6, background: BD, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ width: '100%', height: '100%', background: GOLD, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  background: QR + '12',
                  border: '1px solid ' + QR + '33',
                  borderRadius: 9,
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: QR }}>100%</div>
                <div style={{ fontSize: 10, color: MUT, marginTop: 1 }}>الإنجاز</div>
              </div>
              <button
                style={{
                  flex: 1,
                  background: QR + '18',
                  border: '1px solid ' + QR + '44',
                  borderRadius: 9,
                  color: QR,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                عرض التفاصيل
              </button>
            </div>
          </div>

          {/* Omar */}
          <div
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid ' + BD,
              borderRadius: 14,
              padding: '18px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: '#3B82F6' + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 17,
                    fontWeight: 800,
                    color: '#3B82F6',
                  }}
                >
                  ع
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>عمر</div>
                  <div style={{ fontSize: 11, color: MUT }}>المجموعة الثانية</div>
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#3B82F6',
                  background: '#3B82F6' + '18',
                  border: '1px solid #3B82F6' + '44',
                  borderRadius: 10,
                  padding: '3px 10px',
                }}
              >
                جيد
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: MUT }}>حفظ جزء عمّ</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>24 / 30 سورة</span>
            </div>
            <div style={{ height: 6, background: BD, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ width: '80%', height: '100%', background: ACCENT, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  background: ACCENT + '10',
                  border: '1px solid ' + ACCENT + '33',
                  borderRadius: 9,
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: ACCENT }}>80%</div>
                <div style={{ fontSize: 10, color: MUT, marginTop: 1 }}>الإنجاز</div>
              </div>
              <button
                style={{
                  flex: 1,
                  background: ACCENT + '12',
                  border: '1px solid ' + ACCENT + '44',
                  borderRadius: 9,
                  color: ACCENT,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                عرض التفاصيل
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: s.color + '10',
                border: '1px solid ' + s.color + '33',
                borderRadius: 12,
                padding: '14px 16px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUT, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── VIDEO TASMI CTA ── */}
        <div
          style={{
            background: 'linear-gradient(120deg,' + QR + '28 0%, ' + ACCENT + '18 100%)',
            border: '1px solid ' + ACCENT + '44',
            borderRadius: 14,
            padding: '18px 22px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: ACCENT + '25',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IcVideo />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800 }}>التسميع المرئي</div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 3 }}>
              شاهد تسجيلات تسميع أبنائك مع المحفظ — متاح الآن
            </div>
          </div>
          <button
            style={{
              padding: '9px 20px',
              borderRadius: 10,
              border: 'none',
              background: ACCENT,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            مشاهدة التسجيلات
          </button>
        </div>

        {/* ── BOTTOM GRID: report + achievements + chat ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 16,
          }}
        >
          {/* Weekly report */}
          <div
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid ' + BD,
              borderRadius: 14,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              <IcReport />
              <span style={{ fontSize: 14, fontWeight: 700 }}>التقرير الأسبوعي</span>
            </div>

            {[
              { label: 'حضر يوسف', val: '5 / 5 أيام', color: ACCENT },
              { label: 'حضر عمر', val: '4 / 5 أيام', color: '#3B82F6' },
              { label: 'آيات يوسف', val: '45 آية جديدة', color: GOLD },
              { label: 'آيات عمر', val: '12 آية جديدة', color: ACCENT },
              { label: 'أخطاء التجويد', val: '2 ملاحظات', color: '#F59E0B' },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 0',
                  borderBottom: '1px solid ' + BD,
                }}
              >
                <span style={{ fontSize: 12, color: MUT }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.val}</span>
              </div>
            ))}

            <button
              style={{
                width: '100%',
                marginTop: 12,
                padding: '8px',
                borderRadius: 9,
                border: '1px solid ' + BD,
                background: 'rgba(255,255,255,0.04)',
                color: DIM,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              عرض التقرير الكامل
            </button>
          </div>

          {/* Achievements */}
          <div
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid ' + BD,
              borderRadius: 14,
              padding: '16px 18px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              <IcAward />
              <span style={{ fontSize: 14, fontWeight: 700 }}>الإنجازات والشهادات</span>
            </div>

            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 10px',
                  borderRadius: 9,
                  border: '1px solid ' + a.color + '33',
                  background: a.color + '0c',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: a.color,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 1 }}>{a.date}</div>
                </div>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 9px',
                    borderRadius: 7,
                    border: '1px solid ' + a.color + '44',
                    background: a.color + '14',
                    color: a.color,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <IcDownload />
                  شهادة
                </button>
              </div>
            ))}
          </div>

          {/* Chat with muhaffiz */}
          <div
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid ' + BD,
              borderRadius: 14,
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              <IcMsg />
              <span style={{ fontSize: 14, fontWeight: 700 }}>مراسلة المحفظ</span>
              <span
                style={{
                  marginRight: 'auto',
                  fontSize: 10,
                  fontWeight: 700,
                  color: ACCENT,
                  background: ACCENT + '18',
                  border: '1px solid ' + ACCENT + '40',
                  borderRadius: 10,
                  padding: '1px 7px',
                }}
              >
                متصل
              </span>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 10,
                maxHeight: 200,
              }}
            >
              {messages.map((m) => {
                const isParent = m.from === 'parent';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: isParent ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '8px 11px',
                        borderRadius: isParent ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                        background: isParent ? QR + '25' : 'rgba(255,255,255,0.06)',
                        border: '1px solid ' + (isParent ? QR + '44' : BD),
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      {m.text}
                      <div style={{ fontSize: 9, color: MUT, marginTop: 4, textAlign: 'left' }}>
                        {m.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: 7 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
                placeholder="اكتب رسالة..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + BD,
                  color: '#EEEEF5',
                  padding: '8px 11px',
                  borderRadius: 9,
                  fontSize: 12,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <button
                onClick={sendMsg}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  border: 'none',
                  background: ACCENT,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <IcSend />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
