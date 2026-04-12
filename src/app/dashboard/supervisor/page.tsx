'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';

const GR = '#047857'; // green accent
const BG = '#06060E';
const SB = '#08081A';
const CARD = 'rgba(255,255,255,0.03)';
const BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';
const TX = '#EEEEF5';
const FF = "'IBM Plex Sans Arabic', sans-serif";
const GOLD = '#D4A843';

const navSections = [
  { title: 'الرئيسية', items: [{ label: 'لوحة التحكم', icon: '🏠', id: 'overview' }, { label: 'التقارير', icon: '📊', id: 'reports' }] },
  { title: 'الحلقات', items: [{ label: 'الحلقات', icon: '📖', id: 'halaqat', badge: 20 }, { label: 'الجدول', icon: '📅', id: 'schedule' }, { label: 'خطط الحفظ', icon: '📋', id: 'plans' }, { label: 'المسابقات', icon: '🥇', id: 'competitions' }] },
  { title: 'الأفراد', items: [{ label: 'المحفّظون', icon: '🎓', id: 'teachers', badge: 35 }, { label: 'الطلاب', icon: '👤', id: 'students', badge: 1200 }, { label: 'أولياء الأمور', icon: '👨‍👩‍👧', id: 'parents' }, { label: 'الحضور', icon: '✅', id: 'attendance' }] },
  { title: 'الإنجازات', items: [{ label: 'الختمات', icon: '📜', id: 'khatam', badge: 5 }, { label: 'نقاط الحفز', icon: '⭐', id: 'points' }, { label: 'الشهادات', icon: '🏆', id: 'certificates' }] },
  { title: 'التواصل', items: [{ label: 'الإعلانات', icon: '📢', id: 'announcements', badge: 2 }, { label: 'الرسائل', icon: '💬', id: 'messages' }, { label: 'الإعدادات', icon: '⚙️', id: 'settings' }] },
];

const statCards = [
  { label: 'الحلقات', value: '20', icon: '📖', color: GR },
  { label: 'الطلاب', value: '1200', icon: '👥', color: '#3B82F6' },
  { label: 'أجزاء مكتملة', value: '48', icon: '📚', color: GOLD },
  { label: 'الختمات', value: '5', icon: '📜', color: '#A78BFA' },
];

const monthlyHifz = [
  { month: 'نوفمبر', juz: 38 },
  { month: 'ديسمبر', juz: 44 },
  { month: 'يناير', juz: 40 },
  { month: 'فبراير', juz: 52 },
  { month: 'مارس', juz: 48 },
  { month: 'أبريل', juz: 56 },
];

const recentActivities = [
  { icon: '📜', text: 'ختمة جديدة – محمد الأسمري (حفظ كامل)', time: 'منذ ساعتين', color: GR },
  { icon: '⭐', text: 'تميّز الطالب نايف الشهري في مسابقة الجزء 30', time: 'منذ 4 ساعات', color: GOLD },
  { icon: '🎓', text: 'انضم المحفّظ خالد العتيبي إلى الفريق', time: 'أمس', color: '#3B82F6' },
  { icon: '📊', text: 'تقرير الحضور الأسبوعي جاهز – 91%', time: 'أمس', color: GR },
  { icon: '📢', text: 'تم إرسال إعلان موعد مسابقة أبريل', time: 'قبل يومين', color: '#A78BFA' },
];

const halaqatTable = [
  { name: 'حلقة الفجر أ', teacher: 'الشيخ عبدالرحمن', students: 18, attendance: '94%', progress: 'جزء 28', status: 'نشطة' },
  { name: 'حلقة الفجر ب', teacher: 'محمد الغامدي', students: 22, attendance: '89%', progress: 'جزء 25', status: 'نشطة' },
  { name: 'حلقة العصر أ', teacher: 'أحمد الدوسري', students: 20, attendance: '87%', progress: 'جزء 20', status: 'نشطة' },
  { name: 'حلقة العصر ب', teacher: 'سعد الشمري', students: 17, attendance: '92%', progress: 'جزء 15', status: 'نشطة' },
  { name: 'حلقة النساء أ', teacher: 'نورة المالكي', students: 24, attendance: '96%', progress: 'جزء 30', status: 'نشطة' },
  { name: 'حلقة الأطفال', teacher: 'خالد العتيبي', students: 15, attendance: '82%', progress: 'سور قصيرة', status: 'نشطة' },
];

const teacherPerf = [
  { name: 'الشيخ عبدالرحمن', halaqat: 2, students: 35, rating: 4.9, khatam: 3, trend: '↑' },
  { name: 'نورة المالكي', halaqat: 2, students: 28, rating: 5.0, khatam: 2, trend: '↑' },
  { name: 'محمد الغامدي', halaqat: 2, students: 30, rating: 4.8, khatam: 1, trend: '→' },
  { name: 'أحمد الدوسري', halaqat: 1, students: 20, rating: 4.7, khatam: 0, trend: '→' },
  { name: 'خالد العتيبي', halaqat: 1, students: 15, rating: 4.5, khatam: 0, trend: '↑' },
];

const topStudents = [
  { rank: 1, name: 'محمد الأسمري', juz: 30, points: 2400, badge: '🥇', teacher: 'الشيخ عبدالرحمن' },
  { rank: 2, name: 'نايف الشهري', juz: 28, points: 2240, badge: '🥈', teacher: 'محمد الغامدي' },
  { rank: 3, name: 'فهد العمري', juz: 26, points: 2100, badge: '🥉', teacher: 'الشيخ عبدالرحمن' },
  { rank: 4, name: 'سارة القرني', juz: 25, points: 1980, badge: '⭐', teacher: 'نورة المالكي' },
];

const attCards = [
  { label: 'معدل الحضور', value: '89%', icon: '📊', color: GR, sub: 'هذا الأسبوع' },
  { label: 'حاضر اليوم', value: '1068', icon: '✅', color: '#10B981', sub: 'من 1200 طالب' },
  { label: 'متأخرون', value: '96', icon: '⏰', color: GOLD, sub: 'طالب اليوم' },
  { label: 'غائبون', value: '36', icon: '❌', color: '#EF4444', sub: 'طالب اليوم' },
];

const maxJuz = Math.max(...monthlyHifz.map(m => m.juz));

export default function SupervisorDashboard() {
  const [active, setActive] = useState('overview');
  const [sideOpen, setSideOpen] = useState(true);

  const sb: React.CSSProperties = {
    width: sideOpen ? 248 : 0,
    minWidth: sideOpen ? 248 : 0,
    background: SB,
    borderLeft: '1px solid ' + BD,
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'width 0.25s, min-width 0.25s',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
  };

  return (
    <div style={{ fontFamily: FF, direction: 'rtl', background: BG, color: TX, minHeight: '100vh', display: 'flex' }}>

      {/* ── SIDEBAR ── */}
      <aside style={sb}>
        <div style={{ padding: '20px 16px 12px' }}>
          {/* User */}
          <div style={{ background: `${GR}15`, border: `1px solid ${GR}30`, borderRadius: 14, padding: '16px 14px', marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${GR},${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 10px' }}>🛡️</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>الشيخ عبدالله القرني</div>
              <div style={{ fontSize: 10, color: GR, marginTop: 3, fontWeight: 700 }}>مشرف حلقات التحفيظ</div>
              <div style={{ fontSize: 10, color: DIM, marginTop: 2 }}>مركز النور · مجاز بالسند</div>
            </div>
          </div>
          {/* Nav */}
          {navSections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: MUT, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, paddingRight: 4 }}>{sec.title}</div>
              {sec.items.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, border: 'none', background: active === item.id ? `${GR}18` : 'transparent', color: active === item.id ? GR : DIM, fontSize: 12, fontWeight: active === item.id ? 700 : 500, cursor: 'pointer', fontFamily: FF, marginBottom: 2, borderRight: active === item.id ? `2px solid ${GR}` : '2px solid transparent', textAlign: 'right', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}</span>
                  {(item as any).badge && <span style={{ background: GR, color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>{(item as any).badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, overflowX: 'hidden' }}>
        {/* Top bar */}
        <div style={{ background: SB, borderBottom: '1px solid ' + BD, padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setSideOpen(!sideOpen)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid ' + BD, borderRadius: 8, padding: '6px 10px', color: DIM, cursor: 'pointer', fontSize: 16, fontFamily: FF }}>☰</button>
            <span style={{ fontSize: 14, fontWeight: 700 }}>لوحة الإشراف – مشرف الحلقات</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ background: `${GR}20`, border: `1px solid ${GR}40`, borderRadius: 9, padding: '6px 16px', color: GR, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>+ إضافة حلقة</button>
            <div style={{ fontSize: 11, color: DIM }}>الأربعاء 8 أبريل 2026</div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${GR},${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛡️</div>
          </div>
        </div>

        <div style={{ padding: '24px' }}>

          {/* ── STAT CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 14, padding: '20px 18px' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── CHART + ACTIVITIES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            {/* Bar chart */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📈</span> تقدم الحفظ الشهري (أجزاء)
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
                {monthlyHifz.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 10, color: GOLD, fontWeight: 700 }}>{m.juz}</div>
                    <div style={{ width: '100%', height: Math.round((m.juz / maxJuz) * 110) + 'px', background: i === monthlyHifz.length - 1 ? `linear-gradient(180deg,${GOLD},${GR})` : `${GR}60`, borderRadius: '5px 5px 0 0', transition: 'height 0.4s' }}></div>
                    <div style={{ fontSize: 9, color: MUT, textAlign: 'center' }}>{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activities */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔔</span> آخر الأنشطة
              </div>
              {recentActivities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: i < recentActivities.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', alignItems: 'flex-start' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{a.text}</div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 3 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── HALAQAT TABLE ── */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>📖</span> الحلقات النشطة</span>
              <span style={{ fontSize: 11, color: GR, fontWeight: 700 }}>20 حلقة</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid ' + BD }}>
                    {['الحلقة', 'المحفّظ', 'الطلاب', 'الحضور', 'التقدم', 'الحالة'].map(h => (
                      <th key={h} style={{ textAlign: 'right', padding: '8px 12px', fontSize: 11, color: MUT, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {halaqatTable.map((r, i) => (
                    <tr key={i} style={{ borderBottom: i < halaqatTable.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                      <td style={{ padding: '11px 12px', fontWeight: 700 }}>{r.name}</td>
                      <td style={{ padding: '11px 12px', color: DIM }}>{r.teacher}</td>
                      <td style={{ padding: '11px 12px', color: DIM }}>{r.students}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ color: parseFloat(r.attendance) >= 90 ? GR : GOLD, fontWeight: 700 }}>{r.attendance}</span>
                      </td>
                      <td style={{ padding: '11px 12px', color: GOLD, fontSize: 12 }}>{r.progress}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ background: `${GR}20`, color: GR, borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 700 }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── TEACHER PERF + TOP STUDENTS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 18, marginBottom: 20 }}>
            {/* Teacher performance */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎓</span> أداء المحفّظين
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid ' + BD }}>
                    {['المحفّظ', 'الحلقات', 'الطلاب', 'التقييم', 'الختمات', ''].map(h => (
                      <th key={h} style={{ textAlign: 'right', padding: '7px 10px', fontSize: 10, color: MUT, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teacherPerf.map((t, i) => (
                    <tr key={i} style={{ borderBottom: i < teacherPerf.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                      <td style={{ padding: '10px 10px', fontWeight: 700 }}>{t.name}</td>
                      <td style={{ padding: '10px 10px', color: DIM, textAlign: 'center' }}>{t.halaqat}</td>
                      <td style={{ padding: '10px 10px', color: DIM, textAlign: 'center' }}>{t.students}</td>
                      <td style={{ padding: '10px 10px', color: GOLD, fontWeight: 700, textAlign: 'center' }}>{t.rating} ⭐</td>
                      <td style={{ padding: '10px 10px', color: GR, fontWeight: 700, textAlign: 'center' }}>{t.khatam}</td>
                      <td style={{ padding: '10px 10px', textAlign: 'center', color: t.trend === '↑' ? '#10B981' : DIM, fontWeight: 800, fontSize: 16 }}>{t.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top students */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span> أفضل الطلاب
              </div>
              {topStudents.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topStudents.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center' }}>{s.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: DIM }}>{s.teacher}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? GOLD : GR }}>جزء {s.juz}</div>
                    <div style={{ fontSize: 10, color: MUT }}>{s.points} نقطة</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── ATTENDANCE SUMMARY ── */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✅</span> ملخص الحضور
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {attCards.map((c, i) => (
                <div key={i} style={{ background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 3 }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
