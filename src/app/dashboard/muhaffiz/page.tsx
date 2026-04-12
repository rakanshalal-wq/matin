'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';

const G = '#D4A843';  // gold accent
const QC = '#047857'; // quran green
const BG = '#06060E';
const SB = '#08081A'; // sidebar
const CARD = 'rgba(255,255,255,0.03)';
const BD = 'rgba(255,255,255,0.07)';
const DIM = 'rgba(238,238,245,0.6)';
const MUT = 'rgba(238,238,245,0.3)';
const TX = '#EEEEF5';
const FF = "'IBM Plex Sans Arabic', sans-serif";

const navSections = [
  { title: 'الرئيسية', items: [{ label: 'لوحة التحكم', icon: '🏠', id: 'overview' }, { label: 'جدول الحلقات', icon: '📅', id: 'schedule' }] },
  { title: 'حلقاتي', items: [{ label: 'حلقاتي', icon: '📖', id: 'halaqat', badge: 2 }, { label: 'خطة الحفظ', icon: '📋', id: 'plan' }, { label: 'سجل التسميع', icon: '🎙️', id: 'tasmi' }] },
  { title: 'الطلاب', items: [{ label: 'طلابي', icon: '👤', id: 'students', badge: 33 }, { label: 'الحضور', icon: '✅', id: 'attendance' }, { label: 'التقييم', icon: '⭐', id: 'eval', badge: 5 }, { label: 'نقاط الحفز', icon: '🏆', id: 'points' }] },
  { title: 'التواصل', items: [{ label: 'أولياء الأمور', icon: '👨‍👩‍👧', id: 'parents' }, { label: 'الرسائل', icon: '💬', id: 'messages', badge: 3 }, { label: 'الإعلانات', icon: '📢', id: 'announcements' }] },
  { title: 'الملف', items: [{ label: 'ملفي الشخصي', icon: '🧑', id: 'profile' }, { label: 'إجازاتي', icon: '📜', id: 'ijazat' }, { label: 'الإعدادات', icon: '⚙️', id: 'settings' }] },
];

const statCards = [
  { label: 'حلقاتي', value: '2', icon: '📖', color: QC },
  { label: 'طلابي', value: '33', icon: '👥', color: '#3B82F6' },
  { label: 'جزء حُفظ', value: '12', icon: '📚', color: G },
  { label: 'التقييم', value: '4.9 ⭐', icon: '⭐', color: '#A78BFA' },
];

const halaqatToday = [
  { name: 'حلقة الفجر – الجزء 28', time: '05:30 – 06:30', room: 'قاعة 1', students: 18, sura: 'سورة المجادلة', progress: 'صفحة 540 – 545', live: true },
  { name: 'حلقة العصر – الجزء 29', time: '16:00 – 17:30', room: 'قاعة 3', students: 15, sura: 'سورة الملك', progress: 'صفحة 562 – 567', live: false },
];

const tasmiStudents = [
  { name: 'فهد العمري', type: 'حفظ جديد', ayat: '10 آيات', rating: 5, notes: 'أداء ممتاز' },
  { name: 'عبدالله الزهراني', type: 'مراجعة', ayat: 'صفحة 542', rating: 4, notes: 'تحسّن ملحوظ' },
  { name: 'سلطان القحطاني', type: 'حفظ جديد', ayat: '7 آيات', rating: 3, notes: 'يحتاج مراجعة' },
  { name: 'نايف الشهري', type: 'مراجعة', ayat: 'ربع الحزب', rating: 5, notes: 'إتقان تام' },
  { name: 'خالد الغامدي', type: 'حفظ جديد', ayat: '12 آيات', rating: 4, notes: 'جيد جداً' },
];

const hifzProgress = [
  { name: 'فهد العمري', juz: 24, pct: 80 },
  { name: 'عبدالله الزهراني', juz: 20, pct: 67 },
  { name: 'سلطان القحطاني', juz: 15, pct: 50 },
  { name: 'نايف الشهري', juz: 28, pct: 93 },
  { name: 'خالد الغامدي', juz: 18, pct: 60 },
];

const attendanceToday = [
  { name: 'فهد العمري', status: 'present' },
  { name: 'عبدالله الزهراني', status: 'present' },
  { name: 'سلطان القحطاني', status: 'absent' },
  { name: 'نايف الشهري', status: 'present' },
  { name: 'خالد الغامدي', status: 'present' },
  { name: 'محمد المالكي', status: 'late' },
];

const parentMessages = [
  { parent: 'والد فهد العمري', msg: 'بارك الله فيكم، هل يمكن تعديل موعد الحلقة للأسبوع القادم؟', time: 'منذ 15 دقيقة', unread: true },
  { parent: 'والدة نايف الشهري', msg: 'ما شاء الله، نايف يراجع كل يوم في البيت، شكراً لاهتمامكم.', time: 'منذ ساعة', unread: true },
  { parent: 'والد خالد الغامدي', msg: 'متى موعد مسابقة الشهر القادم؟', time: 'منذ 3 ساعات', unread: false },
];

const leaderboard = [
  { rank: 1, name: 'نايف الشهري', points: 1240, badge: '🥇' },
  { rank: 2, name: 'فهد العمري', points: 1180, badge: '🥈' },
  { rank: 3, name: 'خالد الغامدي', points: 1050, badge: '🥉' },
  { rank: 4, name: 'عبدالله الزهراني', points: 980, badge: '⭐' },
  { rank: 5, name: 'سلطان القحطاني', points: 870, badge: '⭐' },
];

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? G : 'rgba(255,255,255,.15)', fontSize: 13 }}>★</span>
      ))}
    </span>
  );
}

export default function MuhaffizDashboard() {
  const [active, setActive] = useState('overview');
  const [sideOpen, setSideOpen] = useState(true);

  const sb: React.CSSProperties = {
    width: sideOpen ? 240 : 0,
    minWidth: sideOpen ? 240 : 0,
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
          {/* User profile */}
          <div style={{ background: `${QC}15`, border: `1px solid ${QC}30`, borderRadius: 14, padding: '16px 14px', marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${QC},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 10px' }}>🎓</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>الشيخ عبدالرحمن السديري</div>
              <div style={{ fontSize: 10, color: G, marginTop: 3, fontWeight: 700 }}>محفّظ معتمد · حفص عن عاصم</div>
              <div style={{ fontSize: 10, color: DIM, marginTop: 2 }}>مجاز بالسند المتصل</div>
            </div>
          </div>
          {/* Nav */}
          {navSections.map((sec, si) => (
            <div key={si} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: MUT, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, paddingRight: 4 }}>{sec.title}</div>
              {sec.items.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, border: 'none', background: active === item.id ? `${QC}18` : 'transparent', color: active === item.id ? QC : DIM, fontSize: 12, fontWeight: active === item.id ? 700 : 500, cursor: 'pointer', fontFamily: FF, marginBottom: 2, borderRight: active === item.id ? `2px solid ${QC}` : '2px solid transparent', textAlign: 'right', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 14 }}>{item.icon}</span>{item.label}</span>
                  {(item as any).badge && <span style={{ background: G, color: '#000', borderRadius: 20, padding: '1px 7px', fontSize: 10, fontWeight: 800 }}>{(item as any).badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, overflowX: 'hidden', padding: '0' }}>
        {/* Top bar */}
        <div style={{ background: SB, borderBottom: '1px solid ' + BD, padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setSideOpen(!sideOpen)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid ' + BD, borderRadius: 8, padding: '6px 10px', color: DIM, cursor: 'pointer', fontSize: 16, fontFamily: FF }}>☰</button>
            <span style={{ fontSize: 14, fontWeight: 700 }}>لوحة التحكم – المحفّظ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: DIM }}>الأربعاء 8 أبريل 2026</div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${QC},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🎓</div>
          </div>
        </div>

        <div style={{ padding: '24px 24px' }}>

          {/* ── STAT CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 14, padding: '20px 18px' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: MUT, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── TODAY'S HALAQAT ── */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📅</span> حلقات اليوم
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {halaqatToday.map((h, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${h.live ? QC + '40' : BD}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800 }}>{h.name}</span>
                    <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: h.live ? '#10B98120' : 'rgba(255,255,255,.05)', color: h.live ? '#10B981' : MUT, fontWeight: 700 }}>{h.live ? '🔴 مباشرة' : '⏳ قادمة'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>⏰ {h.time} &nbsp;|&nbsp; 🚪 {h.room}</div>
                  <div style={{ fontSize: 11, color: G, fontWeight: 700, marginBottom: 4 }}>📖 {h.sura}</div>
                  <div style={{ fontSize: 11, color: DIM, marginBottom: 10 }}>التقدم: {h.progress}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUT }}>
                    <span>👥 {h.students} طالب</span>
                    <button style={{ background: `${QC}20`, border: 'none', color: QC, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>بدء الحلقة</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TASMI TABLE ── */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>🎙️</span> سجل التسميع – اليوم
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid ' + BD }}>
                    {['الطالب', 'نوع الجلسة', 'الكمية', 'التقييم', 'ملاحظات'].map(h => (
                      <th key={h} style={{ textAlign: 'right', padding: '8px 12px', fontSize: 11, color: MUT, fontWeight: 700 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasmiStudents.map((s, i) => (
                    <tr key={i} style={{ borderBottom: i < tasmiStudents.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                      <td style={{ padding: '11px 12px', fontWeight: 700 }}>{s.name}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: s.type === 'حفظ جديد' ? `${QC}20` : `${G}18`, color: s.type === 'حفظ جديد' ? QC : G, fontWeight: 700 }}>{s.type}</span>
                      </td>
                      <td style={{ padding: '11px 12px', color: DIM }}>{s.ayat}</td>
                      <td style={{ padding: '11px 12px' }}><Stars n={s.rating} /></td>
                      <td style={{ padding: '11px 12px', color: DIM, fontSize: 12 }}>{s.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── HIFZ PROGRESS + ATTENDANCE ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            {/* Progress */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📈</span> تقدم الحفظ
              </div>
              {hifzProgress.map((s, i) => (
                <div key={i} style={{ marginBottom: i < hifzProgress.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>جزء {s.juz} / 30 &nbsp;({s.pct}%)</span>
                  </div>
                  <div style={{ height: 7, background: 'rgba(255,255,255,.07)', borderRadius: 4 }}>
                    <div style={{ width: s.pct + '%', height: '100%', background: `linear-gradient(90deg,${QC},${G})`, borderRadius: 4, transition: 'width 0.5s' }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>✅</span> حضور اليوم
              </div>
              {attendanceToday.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < attendanceToday.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontSize: 11, padding: '3px 12px', borderRadius: 20, fontWeight: 700, background: s.status === 'present' ? '#10B98120' : s.status === 'late' ? `${G}20` : '#EF444420', color: s.status === 'present' ? '#10B981' : s.status === 'late' ? G : '#EF4444' }}>
                    {s.status === 'present' ? 'حاضر' : s.status === 'late' ? 'متأخر' : 'غائب'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── MESSAGES + LEADERBOARD ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* Messages */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>💬</span> رسائل أولياء الأمور</span>
                <span style={{ background: G, color: '#000', borderRadius: 20, padding: '1px 8px', fontSize: 10, fontWeight: 800 }}>3</span>
              </div>
              {parentMessages.map((m, i) => (
                <div key={i} style={{ background: m.unread ? `${G}08` : 'transparent', border: `1px solid ${m.unread ? G + '25' : BD}`, borderRadius: 10, padding: '12px 14px', marginBottom: i < parentMessages.length - 1 ? 10 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{m.parent}</span>
                    <span style={{ fontSize: 10, color: MUT }}>{m.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: DIM, lineHeight: 1.6 }}>{m.msg}</div>
                  {m.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: G, marginTop: 8 }}></div>}
                </div>
              ))}
            </div>

            {/* Leaderboard */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🏆</span> لوحة النقاط
              </div>
              {leaderboard.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                  <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{s.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: i === 0 ? G : i === 1 ? '#9CA3AF' : i === 2 ? '#B45309' : DIM }}>{s.points} نقطة</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
