'use client';
import { useState } from 'react';

/* ─── Colors ─── */
const BG = '#06060E';
const SIDEBAR_BG = '#09071C';
const PRIMARY = '#818CF8';
const ACCENT2 = '#6366F1';
const GOLD = '#D4A843';
const BORDER = 'rgba(255,255,255,0.07)';
const TEXT = '#EEEEF5';
const MUTED = 'rgba(238,238,245,0.45)';

/* ─── Sidebar Data ─── */
const SIDEBAR_SECTIONS = [
  {
    title: 'الرئيسية',
    items: [
      { id: 'home', label: 'بوابتي', badge: null, active: true },
      { id: 'schedule', label: 'جدولي الدراسي', badge: null },
      { id: 'record', label: 'السجل الأكاديمي', badge: null },
    ],
  },
  {
    title: 'المحاضرات',
    items: [
      { id: 'online', label: 'محاضراتي الأونلاين', badge: 'الآن' },
      { id: 'inperson', label: 'المحاضرات الحضورية', badge: null },
      { id: 'recorded', label: 'المسجّلة', badge: null },
    ],
  },
  {
    title: 'المقررات',
    items: [
      { id: 'mycourses', label: 'مقرراتي الحالية', badge: null },
      { id: 'register', label: 'تسجيل مقررات', badge: null },
      { id: 'credits', label: 'الساعات المعتمدة', badge: null },
      { id: 'elibrary', label: 'المكتبة الإلكترونية', badge: null },
    ],
  },
  {
    title: 'الاختبارات',
    items: [
      { id: 'myexams', label: 'اختباراتي', badge: 'غداً' },
      { id: 'results', label: 'نتائج درجاتي', badge: null },
      { id: 'analysis', label: 'تحليل أدائي', badge: null },
      { id: 'qbank', label: 'بنك الأسئلة', badge: null },
    ],
  },
  {
    title: 'خدمات العمادة',
    items: [
      { id: 'request', label: 'تقديم طلب', badge: null },
      { id: 'medical', label: 'الأعذار الطبية صحتي', badge: null },
      { id: 'certs', label: 'الشهادات', badge: null },
      { id: 'fees', label: 'الرسوم', badge: 'معلقة' },
      { id: 'grants', label: 'المنح', badge: null },
    ],
  },
  {
    title: 'التواصل',
    items: [
      { id: 'messages', label: 'رسائل الدكاترة', badge: '3' },
      { id: 'advisor', label: 'مرشدي الأكاديمي', badge: null },
      { id: 'forum', label: 'الملتقى الطلابي', badge: null },
    ],
  },
  {
    title: 'الحياة الجامعية',
    items: [
      { id: 'cafeteria', label: 'الكافتيريا', badge: null },
      { id: 'activities', label: 'الأنشطة', badge: null },
      { id: 'transport', label: 'النقل الجامعي', badge: null },
    ],
  },
];

const SCHEDULE = [
  { time: '08:00 - 09:30', subject: 'هياكل البيانات', room: 'قاعة A-204', type: 'حضوري', color: PRIMARY },
  { time: '10:00 - 11:30', subject: 'قواعد البيانات', room: 'مختبر DB-1', type: 'مختبر', color: '#22D3EE' },
  { time: '12:00 - 01:00', subject: 'تحليل الخوارزميات', room: 'قاعة B-107', type: 'حضوري', color: ACCENT2 },
  { time: '02:00 - 03:30', subject: 'شبكات الحاسب', room: 'أونلاين', type: 'أونلاين', color: '#10B981' },
];

const QUICK_ACTIONS = [
  { label: 'تسجيل مقرر', color: PRIMARY },
  { label: 'طلب شهادة', color: '#22D3EE' },
  { label: 'عذر طبي', color: '#F59E0B' },
  { label: 'بنك الأسئلة', color: '#10B981' },
  { label: 'جدول الاختبارات', color: '#EF4444' },
  { label: 'المرشد الأكاديمي', color: ACCENT2 },
  { label: 'الكافتيريا', color: GOLD },
  { label: 'النقل الجامعي', color: '#A78BFA' },
  { label: 'الملتقى الطلابي', color: '#FB923C' },
  { label: 'الساعات المعتمدة', color: '#6366F1' },
  { label: 'المكتبة الإلكترونية', color: '#06B6D4' },
  { label: 'طلب منحة', color: '#EC4899' },
];

const WEAKNESSES = [
  { subject: 'SQL Joins', pct: 38, color: '#EF4444' },
  { subject: 'التكامل', pct: 55, color: '#F59E0B' },
  { subject: 'خوارزميات', pct: 70, color: GOLD },
];

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: BG, direction: 'rtl', fontFamily: "'IBM Plex Sans Arabic', system-ui, sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 264, minWidth: 264, background: SIDEBAR_BG, borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: -0.5 }}>
            <span style={{ color: PRIMARY }}>متين</span> الجامعة
          </div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>بوابة الطالب الجامعي</div>
        </div>

        {/* Student Card */}
        <div style={{ margin: '14px 14px 8px', background: `linear-gradient(135deg, rgba(99,102,241,0.18), rgba(129,140,248,0.08))`, border: `1px solid rgba(129,140,248,0.25)`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `rgba(129,140,248,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, fontSize: 18, fontWeight: 800, color: PRIMARY }}>أ</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.4 }}>أحمد محمد الزهراني</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 3 }}>هندسة الحاسب — المستوى 6</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 10, background: `rgba(129,140,248,0.15)`, color: PRIMARY, borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>طالب</span>
            <span style={{ fontSize: 10, background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>نشط</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 10px 20px' }}>
          {SIDEBAR_SECTIONS.map((sec) => (
            <div key={sec.title} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(238,238,245,0.3)', padding: '10px 10px 4px', letterSpacing: 0.5, textTransform: 'uppercase' }}>{sec.title}</div>
              {sec.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, background: isActive ? `rgba(129,140,248,0.15)` : 'transparent', color: isActive ? PRIMARY : MUTED, fontSize: 13, fontWeight: isActive ? 700 : 500, fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'right' }}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, fontWeight: 700, background: item.badge === 'الآن' ? 'rgba(16,185,129,0.15)' : item.badge === 'غداً' ? 'rgba(245,158,11,0.15)' : item.badge === 'معلقة' ? 'rgba(239,68,68,0.15)' : `rgba(129,140,248,0.15)`, color: item.badge === 'الآن' ? '#10B981' : item.badge === 'غداً' ? '#F59E0B' : item.badge === 'معلقة' ? '#EF4444' : PRIMARY }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>

        {/* Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: TEXT, margin: 0 }}>مرحباً، أحمد الزهراني</h1>
            <p style={{ color: MUTED, fontSize: 13, margin: '4px 0 0' }}>الثلاثاء، 8 أبريل 2026 — الفصل الدراسي الثاني</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 10, color: MUTED, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>الإشعارات</button>
            <button style={{ padding: '9px 18px', background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT2})`, border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700 }}>ملفي الشخصي</button>
          </div>
        </div>

        {/* ── GPA Banner ── */}
        <div style={{ background: `linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(129,140,248,0.08) 100%)`, border: `1px solid rgba(129,140,248,0.22)`, borderRadius: 18, padding: '22px 28px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#10B981', fontSize: 18, fontWeight: 800 }}>4.2</span>
              <span style={{ color: 'rgba(16,185,129,0.7)', fontSize: 9, fontWeight: 600 }}>GPA</span>
            </div>
            <div>
              <div style={{ color: '#10B981', fontSize: 22, fontWeight: 800 }}>4.2 / 5.0</div>
              <div style={{ color: MUTED, fontSize: 12 }}>المعدل التراكمي</div>
            </div>
          </div>
          <div style={{ width: 1, height: 48, background: BORDER }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: PRIMARY, fontSize: 20, fontWeight: 800 }}>78</div>
            <div style={{ color: MUTED, fontSize: 12 }}>ساعة مكتملة</div>
          </div>
          <div style={{ width: 1, height: 48, background: BORDER }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#EF4444', fontSize: 20, fontWeight: 800 }}>18K</div>
            <div style={{ color: MUTED, fontSize: 12 }}>رسوم معلقة</div>
          </div>
          <div style={{ width: 1, height: 48, background: BORDER }} />
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: MUTED, fontSize: 12 }}>تقدم التخرج</span>
              <span style={{ color: GOLD, fontSize: 13, fontWeight: 700 }}>60%</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: `linear-gradient(90deg, ${GOLD}, #E2C46A)`, borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
          {[
            { label: 'مقررات', value: '5', color: PRIMARY, sub: 'هذا الفصل' },
            { label: 'حضور', value: '87%', color: '#10B981', sub: 'نسبة ممتازة' },
            { label: 'اختبارات', value: '2', color: '#F59E0B', sub: 'قادمة' },
            { label: 'طلبات', value: '3', color: '#22D3EE', sub: 'قيد المعالجة' },
          ].map((s, i) => (
            <div key={i} style={{ background: `${s.color}0A`, border: `1px solid ${s.color}22`, borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ color: MUTED, fontSize: 12, marginBottom: 8 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ color: `${s.color}80`, fontSize: 11, marginTop: 6 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Two Column ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 22 }}>

          {/* Today's Schedule */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 16 }}>جدول اليوم</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SCHEDULE.map((lec, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: `${lec.color}08`, border: `1px solid ${lec.color}20`, borderRadius: 12 }}>
                  <div style={{ width: 4, height: 36, borderRadius: 99, background: lec.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>{lec.subject}</div>
                    <div style={{ color: MUTED, fontSize: 11, marginTop: 2 }}>{lec.room}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ color: lec.color, fontSize: 11, fontWeight: 700 }}>{lec.time}</div>
                    <span style={{ fontSize: 10, color: lec.color, background: `${lec.color}18`, padding: '1px 7px', borderRadius: 20 }}>{lec.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weakness Analysis */}
          <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>تحليل نقاط الضعف</div>
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>المواضيع التي تحتاج مراجعة</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {WEAKNESSES.map((w, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: TEXT, fontSize: 13, fontWeight: 600 }}>{w.subject}</span>
                    <span style={{ color: w.color, fontSize: 13, fontWeight: 800 }}>{w.pct}%</span>
                  </div>
                  <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${w.pct}%`, height: '100%', background: w.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, padding: '10px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
              <div style={{ color: '#EF4444', fontSize: 12, fontWeight: 600 }}>تنبيه: SQL Joins تحتاج اهتمام فوري</div>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 22px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 16 }}>الإجراءات السريعة</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {QUICK_ACTIONS.map((a, i) => (
              <button
                key={i}
                style={{ padding: '12px 8px', background: `${a.color}0A`, border: `1px solid ${a.color}22`, borderRadius: 12, cursor: 'pointer', color: a.color, fontSize: 12, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${a.color}18`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${a.color}55`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${a.color}0A`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${a.color}22`; }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
