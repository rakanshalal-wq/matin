'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- SCHOOL THEME ---
const BG = '#06060E';
const SB = '#0F0A14';
const C = '#A78BFA';
const GD = '#D4A843';
const TXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.5)';
const MUT = 'rgba(238,238,245,0.3)';
const BD = 'rgba(255,255,255,0.08)';
const CD = 'rgba(255,255,255,0.03)';
const FONT = "'IBM Plex Sans Arabic', sans-serif";

// --- UNIVERSITY THEME ---
const UBG = '#06060E';
const USB = '#0A0905';
const UA = '#F59E0B';
const UA2 = '#D97706';
const UGD = '#D4A843';
const UDIM = 'rgba(238,238,245,0.5)';
const UMUT = 'rgba(238,238,245,0.3)';
const UBD = 'rgba(255,255,255,0.08)';
const UCD = 'rgba(255,255,255,0.03)';

// ─────────────────────────────────────────────────────────────
// Change to 'university' to preview the university parent view
// In production this would come from the user's session/token
// ─────────────────────────────────────────────────────────────
const institutionType: 'school' | 'university' = 'school';

// ============================================================
//  UNIVERSITY PARENT DASHBOARD
// ============================================================
function UniversityParentDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [activeChild, setActiveChild] = useState(0);

  const uChildren = [
    { name: 'أحمد محمد الزهراني', major: 'هندسة الحاسب', level: 'المستوى 6', status: '🟢', statusLabel: 'داخل الحرم' },
    { name: 'سارة محمد الزهراني', major: 'إدارة الأعمال', level: 'المستوى 3', status: '🟠', statusLabel: 'خارج الحرم' },
  ];

  const sidebarSections = [
    {
      group: 'الرئيسية',
      items: [
        { id: 'home', icon: '🏠', label: 'بوابتي', active: true },
        { id: 'gps-live', icon: '📍', label: 'تتبع الموقع GPS', badge: 'مباشر' },
      ],
    },
    {
      group: 'النقل الجامعي 🚌',
      items: [
        { id: 'bus-status', icon: '✅', label: 'حالة الباص', badge: 'ركب ✓' },
        { id: 'bus-gps', icon: '📍', label: 'تتبع الباص GPS' },
        { id: 'ride-log', icon: '📋', label: 'سجل ركوب' },
        { id: 'bus-schedule', icon: '🗓️', label: 'جدول الباصات' },
      ],
    },
    {
      group: 'تتبع الأداء',
      items: [
        { id: 'lectures', icon: '📅', label: 'جدول المحاضرات' },
        { id: 'attendance', icon: '✅', label: 'الحضور والغياب' },
        { id: 'grades', icon: '📊', label: 'الدرجات والمعدل' },
        { id: 'exams', icon: '📝', label: 'الاختبارات', badge: '2' },
        { id: 'performance', icon: '📈', label: 'تحليل الأداء' },
        { id: 'medical', icon: '🏥', label: 'الأعذار الطبية صحتي' },
      ],
    },
    {
      group: 'الأكاديمي',
      items: [
        { id: 'courses', icon: '📚', label: 'المقررات' },
        { id: 'credits', icon: '🎓', label: 'الساعات المعتمدة' },
        { id: 'graduation', icon: '🏅', label: 'التقدم نحو التخرج' },
      ],
    },
    {
      group: 'المالية',
      items: [
        { id: 'fees', icon: '💳', label: 'الرسوم', badge: 'معلقة' },
        { id: 'scholarships', icon: '🎁', label: 'المنح والإعفاءات' },
      ],
    },
    {
      group: 'التواصل',
      items: [
        { id: 'doctor-msg', icon: '💬', label: 'مراسلة الدكتور', badge: '2' },
        { id: 'advisor', icon: '👨‍🏫', label: 'المرشد الأكاديمي' },
        { id: 'alerts', icon: '🔔', label: 'التنبيهات', badge: '3' },
      ],
    },
  ];

  const child = uChildren[activeChild];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: FONT, direction: 'rtl', background: UBG, color: TXT }}>
      {/* ── SIDEBAR ── */}
      <aside style={{ width: sidebarOpen ? 270 : 0, background: USB, borderLeft: `1px solid ${UBD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${UBD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${UA}, ${UA2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800 }}>متين</div>
            <div style={{ fontSize: 9, color: UMUT }}>بوابة ولي الأمر الجامعي</div>
          </div>
        </div>

        {/* Parent card */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${UBD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${UA}22`, border: `1px solid ${UA}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍👧‍👦</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>محمد الزهراني</div>
              <div style={{ fontSize: 10, color: UA }}>ولي أمر · {uChildren.length} أبناء</div>
            </div>
          </div>
        </div>

        {/* Children switcher */}
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${UBD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: UMUT, marginBottom: 8 }}>أبنائي في الجامعة</div>
          {uChildren.map((ch, i) => (
            <button key={i} onClick={() => setActiveChild(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeChild === i ? `${UA}18` : 'transparent', color: activeChild === i ? UA : UDIM, marginBottom: 3, textAlign: 'right' }}>
              <span style={{ fontSize: 16 }}>{ch.status}</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{ch.name}</div>
                <div style={{ fontSize: 9, color: UMUT }}>{ch.major} · {ch.level}</div>
                <div style={{ fontSize: 9, color: activeChild === i ? UA : UMUT }}>{ch.statusLabel}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Nav sections */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
          {sidebarSections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: UMUT, padding: '6px 8px', letterSpacing: 1 }}>{sec.group}</div>
              {sec.items.map((nav) => (
                <button key={nav.id} onClick={() => setActiveSection(nav.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600, background: activeSection === nav.id ? `${UA}18` : 'transparent', color: activeSection === nav.id ? UA : UDIM, marginBottom: 1, textAlign: 'right', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 13 }}>{nav.icon}</span>
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span style={{ background: `${UA}28`, color: UA, border: `1px solid ${UA}44`, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>{nav.badge}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{ height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${UBD}`, background: 'rgba(6,6,14,0.85)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: UDIM, fontSize: 18 }}>☰</button>
            <h1 style={{ fontSize: 16, fontWeight: 700 }}>متابعة {child.name}</h1>
            <span style={{ fontSize: 11, color: UA, background: `${UA}18`, border: `1px solid ${UA}33`, padding: '2px 8px', borderRadius: 6 }}>{child.major} · {child.level}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: child.status === '🟢' ? '#4ADE80' : '#FB923C' }}>{child.status} {child.statusLabel}</span>
            <button style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: `1px solid ${UBD}`, borderRadius: 9, width: 36, height: 36, cursor: 'pointer', color: UDIM, fontSize: 16, fontFamily: FONT }}>
              🔔<span style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* ── HOME ── */}
          {(activeSection === 'home' || activeSection === 'gps-live') && (
            <>
              {/* Son Banner */}
              <div style={{ background: `${UA}08`, border: `1px solid ${UA}22`, borderRadius: 14, padding: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${UA}22`, border: `1px solid ${UA}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎓</div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{child.name}</div>
                  <div style={{ fontSize: 12, color: UDIM }}>{child.major} · {child.level} · جامعة الملك عبدالعزيز</div>
                </div>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#4ADE80' }}>4.2<span style={{ fontSize: 12, color: UMUT }}>/5.0</span></div>
                    <div style={{ fontSize: 10, color: UMUT }}>GPA</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: UA }}>87%</div>
                    <div style={{ fontSize: 10, color: UMUT }}>حضور</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#FB923C' }}>18K</div>
                    <div style={{ fontSize: 10, color: UMUT }}>رسوم SAR</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#60A5FA' }}>60%</div>
                    <div style={{ fontSize: 10, color: UMUT }}>تخرج</div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'المقررات', value: '5', icon: '📚', color: UA },
                  { label: 'الحضور', value: '87%', icon: '✅', color: '#4ADE80' },
                  { label: 'اختبارات قادمة', value: '2', icon: '📝', color: '#FB923C' },
                  { label: 'الرسوم المعلقة', value: '18K', icon: '💳', color: '#ef4444' },
                ].map((s, i) => (
                  <div key={i} style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: UDIM }}>{s.label}</span>
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Bus Tracking Section */}
              <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>🚌 تتبع الباص الجامعي</h3>
                <div style={{ background: '#4ADE8008', border: '1px solid #4ADE8022', borderRadius: 10, padding: 12, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4ADE80' }}>ركب الباص</div>
                    <div style={{ fontSize: 11, color: UDIM }}>7:05 صباحاً · الخط 3 · متجه للحرم الجامعي</div>
                  </div>
                </div>
                {/* Route */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: UMUT, marginBottom: 8 }}>مسار الرحلة</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {['حي الروابي ✓', 'حي النزهة ✓', 'شارع الملك ✓', 'بوابة الجامعة ✓', 'الحرم الجامعي ⬤'].map((stop, i, arr) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ background: i < 4 ? '#4ADE8022' : `${UA}22`, border: `1px solid ${i < 4 ? '#4ADE8044' : UA + '55'}`, borderRadius: 6, padding: '4px 8px', fontSize: 10, color: i < 4 ? '#4ADE80' : UA, fontWeight: 600, whiteSpace: 'nowrap' }}>{stop}</div>
                        {i < arr.length - 1 && <div style={{ width: 16, height: 1, background: UBD }} />}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Trip Log */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: UMUT, marginBottom: 8 }}>سجل رحلة اليوم</div>
                  {[
                    { time: '7:05 ص', event: 'ركب الباص من حي الروابي', color: '#4ADE80' },
                    { time: '7:42 ص', event: 'وصل الحرم الجامعي — بوابة D', color: UA },
                    { time: '3:30 م', event: 'موعد العودة المتوقع', color: UMUT },
                  ].map((log, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: `1px solid ${UBD}`, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: log.color, minWidth: 50 }}>{log.time}</span>
                      <span style={{ fontSize: 11, color: UDIM }}>{log.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Table */}
              <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>✅ الحضور لكل مقرر</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: UMUT }}>
                  <span>المقرر</span><span>الدكتور</span><span>حضر</span><span>غاب</span><span>النسبة</span>
                </div>
                {[
                  { course: 'هندسة البرمجيات', doctor: 'د. سعد الحربي', attended: 26, absent: 4, pct: 87 },
                  { course: 'قواعد البيانات', doctor: 'د. فاطمة العتيبي', attended: 28, absent: 2, pct: 93 },
                  { course: 'شبكات الحاسب', doctor: 'د. خالد المالكي', attended: 24, absent: 6, pct: 80 },
                  { course: 'الذكاء الاصطناعي', doctor: 'د. نورة السالم', attended: 27, absent: 3, pct: 90 },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 10px', borderBottom: `1px solid ${UBD}`, fontSize: 12, alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{row.course}</span>
                    <span style={{ color: UDIM, fontSize: 11 }}>{row.doctor}</span>
                    <span style={{ color: '#4ADE80', fontWeight: 700 }}>{row.attended}</span>
                    <span style={{ color: row.absent >= 5 ? '#ef4444' : '#FB923C', fontWeight: 700 }}>{row.absent}</span>
                    <span style={{ color: row.pct >= 90 ? '#4ADE80' : row.pct >= 80 ? UA : '#ef4444', fontWeight: 700 }}>{row.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {[
                  { icon: '📊', label: 'الدرجات', onClick: () => setActiveSection('grades') },
                  { icon: '✅', label: 'الحضور', onClick: () => setActiveSection('attendance') },
                  { icon: '💳', label: 'الرسوم', onClick: () => setActiveSection('fees') },
                  { icon: '🚌', label: 'تتبع الباص', onClick: () => setActiveSection('bus-gps') },
                  { icon: '💬', label: 'مراسلة الدكتور', onClick: () => setActiveSection('doctor-msg') },
                  { icon: '🏥', label: 'عذر طبي', onClick: () => setActiveSection('medical') },
                  { icon: '📅', label: 'المحاضرات', onClick: () => setActiveSection('lectures') },
                  { icon: '🎓', label: 'الساعات', onClick: () => setActiveSection('credits') },
                  { icon: '🏅', label: 'التخرج', onClick: () => setActiveSection('graduation') },
                  { icon: '👨‍🏫', label: 'المرشد', onClick: () => setActiveSection('advisor') },
                  { icon: '🔔', label: 'التنبيهات', onClick: () => setActiveSection('alerts') },
                  { icon: '⚙️', label: 'الإعدادات', onClick: () => router.push('/dashboard/settings') },
                ].map((qa, i) => (
                  <button key={i} onClick={qa.onClick} style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', fontFamily: FONT, textAlign: 'center', color: UDIM, fontSize: 11, fontWeight: 600 }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{qa.icon}</div>{qa.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── GRADES ── */}
          {activeSection === 'grades' && (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>📊 الدرجات والمعدل — {child.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: UMUT }}>
                <span>المقرر</span><span>أعمال</span><span>نصفي</span><span>نهائي</span><span>المجموع</span>
              </div>
              {[
                { course: 'هندسة البرمجيات', cw: 34, mid: 23, final: 58, total: 4.5 },
                { course: 'قواعد البيانات', cw: 36, mid: 22, final: 55, total: 4.25 },
                { course: 'شبكات الحاسب', cw: 30, mid: 20, final: 50, total: 3.75 },
                { course: 'الذكاء الاصطناعي', cw: 35, mid: 24, final: 56, total: 4.25 },
              ].map((g, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 10px', borderBottom: `1px solid ${UBD}`, fontSize: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{g.course}</span>
                  <span style={{ color: UDIM }}>{g.cw}/40</span>
                  <span style={{ color: UDIM }}>{g.mid}/25</span>
                  <span style={{ color: UDIM }}>{g.final}/60</span>
                  <span style={{ fontWeight: 800, color: g.total >= 4.5 ? '#4ADE80' : g.total >= 3.75 ? UA : '#FB923C' }}>{g.total}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <div style={{ background: `${UA}18`, border: `1px solid ${UA}44`, borderRadius: 10, padding: '10px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: UA }}>4.2</div>
                  <div style={{ fontSize: 11, color: UMUT }}>المعدل التراكمي GPA</div>
                </div>
              </div>
            </div>
          )}

          {/* ── ATTENDANCE ── */}
          {activeSection === 'attendance' && (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>✅ الحضور والغياب — {child.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#4ADE8012', border: '1px solid #4ADE8033', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#4ADE80' }}>105</div>
                  <div style={{ fontSize: 11, color: UDIM }}>محاضرة حضر</div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>15</div>
                  <div style={{ fontSize: 11, color: UDIM }}>محاضرة غاب</div>
                </div>
                <div style={{ background: `${UA}12`, border: `1px solid ${UA}33`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: UA }}>87%</div>
                  <div style={{ fontSize: 11, color: UDIM }}>نسبة الحضور</div>
                </div>
              </div>
              <button onClick={() => setActiveSection('medical')} style={{ background: UA, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>تقديم عذر طبي</button>
            </div>
          )}

          {/* ── FEES ── */}
          {activeSection === 'fees' || activeSection === 'scholarships' ? (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>💳 {activeSection === 'scholarships' ? 'المنح والإعفاءات' : 'الرسوم الدراسية'}</h3>
              {activeSection === 'fees' && (
                <>
                  {[
                    { label: 'رسوم الفصل الأول', amount: '9,000 SAR', status: 'مدفوع', statusColor: '#4ADE80' },
                    { label: 'رسوم الفصل الثاني', amount: '9,000 SAR', status: 'معلق', statusColor: '#FB923C' },
                    { label: 'رسوم السكن', amount: '3,500 SAR', status: 'مدفوع', statusColor: '#4ADE80' },
                    { label: 'رسوم الأنشطة', amount: '500 SAR', status: 'معلق', statusColor: '#FB923C' },
                  ].map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${UBD}` }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: UGD }}>{p.amount}</span>
                        <span style={{ background: `${p.statusColor}18`, color: p.statusColor, border: `1px solid ${p.statusColor}33`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{p.status}</span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 14 }}>
                    <button style={{ background: UA, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>سداد الرسوم المعلقة ←</button>
                  </div>
                </>
              )}
              {activeSection === 'scholarships' && (
                <div style={{ color: UDIM, fontSize: 13 }}>
                  <div style={{ background: `${UA}12`, border: `1px solid ${UA}33`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: UA }}>منحة التفوق الأكاديمي</div>
                    <div style={{ fontSize: 11, marginTop: 4 }}>إعفاء 20% من الرسوم — الفصل الثاني · بسبب المعدل 4.2</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${UBD}`, borderRadius: 10, padding: 14 }}>
                    <div style={{ fontWeight: 700, color: UDIM }}>لا توجد منح إضافية حالياً</div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* ── MESSAGES / ADVISOR / ALERTS ── */}
          {(activeSection === 'doctor-msg' || activeSection === 'advisor' || activeSection === 'alerts') && (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>
                {activeSection === 'doctor-msg' ? '💬 مراسلة الدكتور' : activeSection === 'advisor' ? '👨‍🏫 المرشد الأكاديمي' : '🔔 التنبيهات'}
              </h3>
              {activeSection === 'doctor-msg' && ['د. سعد الحربي — هندسة البرمجيات', 'د. فاطمة العتيبي — قواعد البيانات', 'د. خالد المالكي — شبكات الحاسب', 'د. نورة السالم — الذكاء الاصطناعي'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${UBD}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${UA}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👨‍🏫</div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t}</span>
                  </div>
                  <button style={{ background: `${UA}18`, border: `1px solid ${UA}33`, borderRadius: 6, padding: '4px 12px', color: UA, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>مراسلة</button>
                </div>
              ))}
              {activeSection === 'advisor' && (
                <div style={{ color: UDIM, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${UBD}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${UA}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👨‍🏫</div>
                    <div>
                      <div style={{ fontWeight: 700, color: TXT }}>د. عبدالله الزهراني</div>
                      <div style={{ fontSize: 11, marginTop: 2 }}>المرشد الأكاديمي — قسم هندسة الحاسب</div>
                    </div>
                  </div>
                  <button style={{ marginTop: 14, background: UA, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>إرسال رسالة</button>
                </div>
              )}
              {activeSection === 'alerts' && [
                { icon: '📝', text: 'اختبار شبكات الحاسب — الأحد 12 أبريل', color: '#FB923C' },
                { icon: '💳', text: 'رسوم الفصل الثاني مستحقة قبل 15 أبريل', color: '#ef4444' },
                { icon: '✅', text: 'تم تسجيل حضور المحاضرة اليوم بنجاح', color: '#4ADE80' },
              ].map((al, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${UBD}`, alignItems: 'center' }}>
                  <span style={{ fontSize: 18 }}>{al.icon}</span>
                  <span style={{ fontSize: 12, color: al.color, fontWeight: 600 }}>{al.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── BUS GPS / SCHEDULE / RIDE LOG ── */}
          {(activeSection === 'bus-gps' || activeSection === 'bus-status' || activeSection === 'bus-schedule' || activeSection === 'ride-log') && (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>🚌 النقل الجامعي</h3>
              <div style={{ background: '#4ADE8008', border: '1px solid #4ADE8022', borderRadius: 10, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🚌</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80' }}>الباص متحرك — داخل الحرم الجامعي</div>
                  <div style={{ fontSize: 12, color: UDIM }}>الخط 3 · السائق: أبو عمر · رقم الباص: U-07</div>
                </div>
              </div>
              <div style={{ height: 140, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${UBD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: UMUT, fontSize: 13, marginBottom: 14 }}>
                📍 خريطة GPS مباشرة — قريباً
              </div>
              {[
                { time: '7:05 ص', event: 'ركب من حي الروابي', ok: true },
                { time: '7:20 ص', event: 'مرور حي النزهة', ok: true },
                { time: '7:42 ص', event: 'وصل الحرم — بوابة D', ok: true },
                { time: '3:30 م', event: 'موعد العودة (متوقع)', ok: false },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '7px 0', borderBottom: `1px solid ${UBD}`, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: log.ok ? '#4ADE80' : UMUT, minWidth: 50 }}>{log.time}</span>
                  <span style={{ fontSize: 11, color: UDIM }}>{log.event}</span>
                  {log.ok && <span style={{ color: '#4ADE80', fontSize: 12 }}>✓</span>}
                </div>
              ))}
            </div>
          )}

          {/* ── LECTURES / COURSES / CREDITS / GRADUATION / PERFORMANCE / MEDICAL ── */}
          {(activeSection === 'lectures' || activeSection === 'courses' || activeSection === 'credits' || activeSection === 'graduation' || activeSection === 'performance' || activeSection === 'medical' || activeSection === 'exams') && (
            <div style={{ background: UCD, border: `1px solid ${UBD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: UA }}>
                {activeSection === 'lectures' ? '📅 جدول المحاضرات' :
                 activeSection === 'courses' ? '📚 المقررات المسجلة' :
                 activeSection === 'credits' ? '🎓 الساعات المعتمدة' :
                 activeSection === 'graduation' ? '🏅 التقدم نحو التخرج' :
                 activeSection === 'performance' ? '📈 تحليل الأداء' :
                 activeSection === 'exams' ? '📝 الاختبارات القادمة' :
                 '🏥 الأعذار الطبية'}
              </h3>
              {activeSection === 'credits' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                  <div style={{ background: `${UA}12`, border: `1px solid ${UA}33`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: UA }}>78</div>
                    <div style={{ fontSize: 11, color: UDIM }}>ساعة مكتملة</div>
                  </div>
                  <div style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#60A5FA' }}>15</div>
                    <div style={{ fontSize: 11, color: UDIM }}>ساعة حالية</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${UBD}`, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: UDIM }}>37</div>
                    <div style={{ fontSize: 11, color: UDIM }}>ساعة متبقية</div>
                  </div>
                </div>
              )}
              {activeSection === 'graduation' && (
                <div>
                  <div style={{ background: `${UA}10`, border: `1px solid ${UA}33`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>التقدم نحو التخرج</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: UA }}>60%</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: '60%', background: `linear-gradient(90deg, ${UA}, ${UA2})`, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div style={{ color: UDIM, fontSize: 12 }}>78 من 130 ساعة مكتملة · التخرج المتوقع: 2027</div>
                </div>
              )}
              {activeSection === 'exams' && [
                { course: 'شبكات الحاسب', date: 'الأحد 12 أبريل', time: '10:00 ص', hall: 'قاعة A3' },
                { course: 'الذكاء الاصطناعي', date: 'الثلاثاء 14 أبريل', time: '1:00 م', hall: 'قاعة B1' },
              ].map((ex, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${UBD}`, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.course}</div>
                    <div style={{ fontSize: 11, color: UDIM }}>{ex.hall}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FB923C' }}>{ex.date}</div>
                    <div style={{ fontSize: 11, color: UDIM }}>{ex.time}</div>
                  </div>
                </div>
              ))}
              {(activeSection === 'lectures' || activeSection === 'courses' || activeSection === 'performance' || activeSection === 'medical') && (
                <div style={{ color: UDIM, fontSize: 13, padding: 8 }}>
                  {activeSection === 'lectures' && 'جدول المحاضرات الأسبوعي — الأحد إلى الخميس · 8:00ص حتى 4:00م'}
                  {activeSection === 'courses' && 'هندسة البرمجيات · قواعد البيانات · شبكات الحاسب · الذكاء الاصطناعي · مشروع التخرج'}
                  {activeSection === 'performance' && 'المعدل التراكمي 4.2 · الترتيب في الدفعة: الثالث · أداء متقدم في جميع المقررات'}
                  {activeSection === 'medical' && 'لا توجد أعذار طبية مقدمة حالياً · يمكن تقديم العذر خلال 3 أيام من الغياب'}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ============================================================
//  SCHOOL PARENT DASHBOARD (original — untouched)
// ============================================================
function SchoolParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState(0);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [showPayModal, setShowPayModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, statsRes, parentRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/dashboard-stats', { credentials: 'include' }),
          fetch('/api/parent/dashboard', { credentials: 'include' }),
        ]);
        if (meRes.ok) { const d = await meRes.json(); setUser(d.user || d); }
        if (statsRes.ok) setStats(await statsRes.json());
        if (parentRes.ok) { const d = await parentRes.json(); if (d.children) setChildren(d.children); }
      } catch (e) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: C, fontFamily: FONT, direction: 'rtl' }}>جاري التحميل...</div>;

  const parentName = user?.name || 'ولي الأمر';
  const childrenList = children.length > 0 ? children : [
    { name: 'أحمد محمد', grade: 'الصف الرابع أ', attendance: 94, gpa: 88, school: 'مدرسة الأمل' },
    { name: 'سارة محمد', grade: 'الصف الثاني', attendance: 97, gpa: 92, school: 'مدرسة الأمل' },
    { name: 'يوسف محمد', grade: 'KG2', attendance: 100, gpa: 0, school: 'روضة الأمل' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: FONT, direction: 'rtl', background: BG, color: TXT }}>
      {/* SIDEBAR */}
      <aside style={{ width: sidebarOpen ? 260 : 0, background: SB, borderLeft: `1px solid ${BD}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'width 0.3s', flexShrink: 0 }}>
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C}, #7C3AED)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff' }}>م</div>
          <div><div style={{ fontSize: 15, fontWeight: 800 }}>متين</div><div style={{ fontSize: 9, color: MUT }}>بوابة ولي الأمر</div></div>
        </div>
        {/* Parent Card */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${C}22`, border: `1px solid ${C}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👨‍👧‍👦</div>
            <div><div style={{ fontSize: 13, fontWeight: 700 }}>{parentName}</div><div style={{ fontSize: 10, color: C }}>ولي أمر · {childrenList.length} أبناء</div></div>
          </div>
        </div>
        {/* Children Switcher */}
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${BD}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: MUT, marginBottom: 8 }}>أبنائي</div>
          {childrenList.map((child: any, i: number) => (
            <button key={i} onClick={() => setActiveChild(i)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeChild === i ? `${C}18` : 'transparent', color: activeChild === i ? C : DIM, marginBottom: 2, textAlign: 'right' }}>
              <span style={{ fontSize: 14 }}>👦</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div>{child.name}</div>
                <div style={{ fontSize: 9, color: MUT }}>{child.grade}</div>
              </div>
            </button>
          ))}
        </div>
        {/* Nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 14px' }}>
          {[
            { id: 'home', icon: '📊', label: 'الرئيسية' },
            { id: 'grades', icon: '📋', label: 'الدرجات والنتائج' },
            { id: 'attendance', icon: '✅', label: 'الحضور والغياب' },
            { id: 'payments', icon: '💳', label: 'المدفوعات' },
            { id: 'transport', icon: '🚌', label: 'تتبع النقل' },
            { id: 'messages', icon: '💬', label: 'مراسلة المعلم' },
            { id: 'schedule', icon: '📅', label: 'الجدول الدراسي' },
            { id: 'reports', icon: '📊', label: 'التقارير' },
          ].map(nav => (
            <button key={nav.id} onClick={() => setActiveSection(nav.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, fontWeight: 600, background: activeSection === nav.id ? `${C}18` : 'transparent', color: activeSection === nav.id ? C : DIM, marginBottom: 2, textAlign: 'right' }}>
              <span style={{ fontSize: 14 }}>{nav.icon}</span> {nav.label}
            </button>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ height: 56, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${BD}`, background: 'rgba(6,6,14,0.8)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: DIM, fontSize: 18 }}>☰</button>
            <h1 style={{ fontSize: 16, fontWeight: 700 }}>متابعة {childrenList[activeChild]?.name || 'الابن'}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 9, width: 36, height: 36, cursor: 'pointer', color: DIM, fontSize: 16, fontFamily: FONT }}>🔔<span style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} /></button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {/* HOME */}
          {activeSection === 'home' && (
            <>
              {/* Child Info Banner */}
              <div style={{ background: `${C}08`, border: `1px solid ${C}22`, borderRadius: 14, padding: 18, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${C}22`, border: `1px solid ${C}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>👦</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{childrenList[activeChild]?.name}</div>
                  <div style={{ fontSize: 12, color: DIM }}>{childrenList[activeChild]?.grade} · {childrenList[activeChild]?.school || 'مدرسة الأمل'}</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#4ADE80' }}>{childrenList[activeChild]?.attendance || 94}%</div>
                    <div style={{ fontSize: 10, color: MUT }}>الحضور</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#60A5FA' }}>{childrenList[activeChild]?.gpa || 88}%</div>
                    <div style={{ fontSize: 10, color: MUT }}>المعدل</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'أيام الغياب', value: '3', icon: '📅', color: '#ef4444' },
                  { label: 'رسوم معلقة', value: '1,200 SAR', icon: '💳', color: GD },
                  { label: 'اختبارات قادمة', value: '2', icon: '📝', color: '#FB923C' },
                  { label: 'رسائل جديدة', value: '4', icon: '💬', color: C },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: DIM }}>{s.label}</span>
                      <span style={{ fontSize: 16 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 20 }}>
                {[
                  { icon: '📋', label: 'الدرجات', onClick: () => setActiveSection('grades') },
                  { icon: '✅', label: 'الحضور', onClick: () => setActiveSection('attendance') },
                  { icon: '💳', label: 'الدفع', onClick: () => setShowPayModal(true) },
                  { icon: '🚌', label: 'تتبع الباص', onClick: () => setActiveSection('transport') },
                  { icon: '💬', label: 'مراسلة المعلم', onClick: () => setActiveSection('messages') },
                  { icon: '📝', label: 'تقديم عذر', onClick: () => router.push('/dashboard/attendance') },
                  { icon: '📅', label: 'الجدول', onClick: () => setActiveSection('schedule') },
                  { icon: '📊', label: 'التقارير', onClick: () => router.push('/dashboard/reports') },
                  { icon: '📚', label: 'المكتبة', onClick: () => router.push('/dashboard/library') },
                  { icon: '🏪', label: 'المتجر', onClick: () => router.push('/dashboard/store') },
                  { icon: '🤖', label: 'مساعد AI', onClick: () => router.push('/dashboard/ai-chat') },
                  { icon: '⚙️', label: 'الإعدادات', onClick: () => router.push('/dashboard/settings') },
                ].map((qa, i) => (
                  <button key={i} onClick={qa.onClick} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 8px', cursor: 'pointer', fontFamily: FONT, textAlign: 'center', color: DIM, fontSize: 11, fontWeight: 600 }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{qa.icon}</div>{qa.label}
                  </button>
                ))}
              </div>

              {/* Recent grades + Attendance chart */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📋 آخر الدرجات</h3>
                  {[
                    { subject: 'رياضيات', grade: 92, max: 100, color: '#60A5FA' },
                    { subject: 'لغة عربية', grade: 85, max: 100, color: '#4ADE80' },
                    { subject: 'علوم', grade: 88, max: 100, color: '#A78BFA' },
                    { subject: 'إنجليزي', grade: 78, max: 100, color: '#FB923C' },
                  ].map((g, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: DIM }}>{g.subject}</span>
                        <span style={{ fontWeight: 700, color: g.color }}>{g.grade}/{g.max}</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${g.grade}%`, background: g.color, borderRadius: 3 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>✅ سجل الحضور — آخر أسبوع</h3>
                  {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${BD}` }}>
                      <span style={{ fontSize: 12, color: DIM }}>{day}</span>
                      <span style={{ background: i === 2 ? 'rgba(239,68,68,0.1)' : `${C}12`, color: i === 2 ? '#ef4444' : '#4ADE80', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, border: `1px solid ${i === 2 ? 'rgba(239,68,68,0.3)' : '#4ADE8044'}` }}>
                        {i === 2 ? 'غائب (عذر طبي)' : 'حاضر'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* GRADES */}
          {activeSection === 'grades' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📋 درجات {childrenList[activeChild]?.name} — كل المواد</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: MUT }}>
                <span>المادة</span><span>أعمال السنة</span><span>اختبار نصفي</span><span>اختبار نهائي</span><span>المجموع</span>
              </div>
              {[
                { subject: 'الرياضيات', cw: 28, mid: 18, final: 46, total: 92 },
                { subject: 'اللغة العربية', cw: 26, mid: 17, final: 42, total: 85 },
                { subject: 'العلوم', cw: 27, mid: 19, final: 42, total: 88 },
                { subject: 'اللغة الإنجليزية', cw: 24, mid: 16, final: 38, total: 78 },
                { subject: 'التربية الإسلامية', cw: 29, mid: 19, final: 47, total: 95 },
                { subject: 'الدراسات الاجتماعية', cw: 25, mid: 18, final: 40, total: 83 },
              ].map((g, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${BD}`, fontSize: 12, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{g.subject}</span>
                  <span style={{ color: DIM }}>{g.cw}/30</span>
                  <span style={{ color: DIM }}>{g.mid}/20</span>
                  <span style={{ color: DIM }}>{g.final}/50</span>
                  <span style={{ fontWeight: 700, color: g.total >= 90 ? '#4ADE80' : g.total >= 80 ? '#60A5FA' : '#FB923C' }}>{g.total}%</span>
                </div>
              ))}
            </div>
          )}

          {/* ATTENDANCE */}
          {activeSection === 'attendance' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>✅ سجل حضور {childrenList[activeChild]?.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#4ADE8012', border: '1px solid #4ADE8033', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#4ADE80' }}>87</div>
                  <div style={{ fontSize: 11, color: DIM }}>يوم حضور</div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#ef4444' }}>3</div>
                  <div style={{ fontSize: 11, color: DIM }}>أيام غياب</div>
                </div>
                <div style={{ background: '#FB923C12', border: '1px solid #FB923C33', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#FB923C' }}>2</div>
                  <div style={{ fontSize: 11, color: DIM }}>تأخر</div>
                </div>
              </div>
              <button onClick={() => router.push('/dashboard/attendance')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>تقديم عذر غياب</button>
            </div>
          )}

          {/* PAYMENTS */}
          {activeSection === 'payments' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700 }}>💳 المدفوعات والرسوم</h3>
                <button onClick={() => setShowPayModal(true)} style={{ background: GD, border: 'none', borderRadius: 8, padding: '7px 16px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>دفع الآن</button>
              </div>
              {[
                { label: 'رسوم الفصل الثاني', amount: '3,200 SAR', status: 'مدفوع', statusColor: '#4ADE80' },
                { label: 'رسوم النقل — يناير', amount: '400 SAR', status: 'مدفوع', statusColor: '#4ADE80' },
                { label: 'رسوم الفصل الثالث', amount: '3,200 SAR', status: 'معلق', statusColor: '#FB923C' },
                { label: 'رسوم النقل — أبريل', amount: '400 SAR', status: 'معلق', statusColor: '#FB923C' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
                  <div><div style={{ fontSize: 13, fontWeight: 600 }}>{p.label}</div></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: GD }}>{p.amount}</span>
                    <span style={{ background: `${p.statusColor}18`, color: p.statusColor, border: `1px solid ${p.statusColor}33`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRANSPORT */}
          {activeSection === 'transport' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>🚌 تتبع النقل المدرسي</h3>
              <div style={{ background: '#4ADE8008', border: '1px solid #4ADE8022', borderRadius: 10, padding: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28 }}>🚌</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80' }}>الباص في الطريق</div>
                  <div style={{ fontSize: 12, color: DIM }}>الوصول المتوقع: 7:15 صباحاً · السائق: أبو فهد</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📍 موقع الباص</div>
                  <div style={{ height: 120, background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUT, fontSize: 12 }}>خريطة GPS — قريباً</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>📞 بيانات السائق</div>
                  <div style={{ fontSize: 12, color: DIM, lineHeight: 2 }}>
                    الاسم: أبو فهد<br />الجوال: 0555XXXXXX<br />رقم الباص: B-15<br />المسار: حي النزهة
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeSection === 'messages' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>💬 مراسلة معلمي {childrenList[activeChild]?.name}</h3>
              {['أ. سارة العتيبي — رياضيات', 'أ. فهد الحربي — علوم', 'أ. نورة السالم — عربي', 'أ. أحمد الزهراني — إنجليزي'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${BD}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${C}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👩‍🏫</div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t}</span>
                  </div>
                  <button onClick={() => router.push('/dashboard/messages')} style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 6, padding: '4px 12px', color: C, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>مراسلة</button>
                </div>
              ))}
            </div>
          )}

          {/* SCHEDULE */}
          {activeSection === 'schedule' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📅 جدول {childrenList[activeChild]?.name}</h3>
              {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day, di) => (
                <div key={di} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 6 }}>{day}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4 }}>
                    {['رياضيات', 'عربي', 'علوم', 'إنجليزي', 'إسلامية', 'رياضة'].map((s, si) => (
                      <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 6, padding: '6px 4px', textAlign: 'center', fontSize: 10, color: DIM }}>{s}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* REPORTS */}
          {activeSection === 'reports' && (
            <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📊 تقارير {childrenList[activeChild]?.name}</h3>
              <button onClick={() => router.push('/dashboard/reports')} style={{ background: C, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#06060E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>عرض التقارير الكاملة</button>
            </div>
          )}
        </div>
      </main>

      {/* PAYMENT MODAL */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowPayModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0C0C18', border: `1px solid ${BD}`, borderRadius: 18, padding: 28, width: 400 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>💳 سداد الرسوم</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BD}`, fontSize: 13 }}>
                <span style={{ color: DIM }}>رسوم الفصل الثالث</span>
                <strong>3,200 SAR</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: 13 }}>
                <span style={{ color: DIM }}>رسوم النقل</span>
                <strong>400 SAR</strong>
              </div>
              <div style={{ borderTop: `1px solid ${BD}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800 }}>
                <span>الإجمالي</span>
                <span style={{ color: GD }}>3,600 SAR</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
              {['💳 مدى', '💳 فيزا', '📱 Apple Pay'].map((m, i) => (
                <button key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 8, padding: '10px 8px', cursor: 'pointer', fontFamily: FONT, fontSize: 11, fontWeight: 600, color: DIM, textAlign: 'center' }}>{m}</button>
              ))}
            </div>
            <button style={{ width: '100%', background: GD, border: 'none', borderRadius: 10, padding: 12, color: '#06060E', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>إتمام الدفع ←</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
//  ROOT EXPORT — dispatches based on institutionType
// ============================================================
export default function ParentDashboard() {
  if (institutionType === 'university') {
    return <UniversityParentDashboard />;
  }
  return <SchoolParentDashboard />;
}
