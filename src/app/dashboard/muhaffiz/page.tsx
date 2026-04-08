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

          {/* ── OVERVIEW ── */}
          {active === 'overview' && <>

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

          </>} {/* end overview */}

          {/* ══════════════════════════════════════════════════════════════
              STUDENTS SECTION
          ══════════════════════════════════════════════════════════════ */}
          {active === 'students' && <>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>طلابي</div>
                <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>إجمالي 33 طالباً في حلقتين</div>
              </div>
              <button style={{ background: QC, border: 'none', color: '#fff', borderRadius: 10, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>+ إضافة طالب</button>
            </div>

            {/* Summary badges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
              {[
                { label: 'ممتاز', count: 5, color: QC },
                { label: 'جيد', count: 2, color: G },
                { label: 'يحتاج متابعة', count: 1, color: '#EF4444' },
              ].map((b, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${b.color}30`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: b.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: b.color }}>{b.label}</span>
                  <span style={{ marginRight: 'auto', fontSize: 22, fontWeight: 900, color: b.color }}>{b.count}</span>
                </div>
              ))}
            </div>

            {/* Students table */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>👤</span> قائمة الطلاب
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid ' + BD }}>
                      {['الطالب', 'العمر', 'السورة الحالية', 'الأجزاء المحفوظة', 'آخر جلسة', 'الحالة'].map(h => (
                        <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: 11, color: MUT, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'نايف الشهري',      age: 14, surah: 'سورة النبأ',       juz: 28, last: '08 أبر 2026', status: 'ممتاز' },
                      { name: 'فهد العمري',        age: 13, surah: 'سورة الفرقان',     juz: 24, last: '08 أبر 2026', status: 'ممتاز' },
                      { name: 'خالد الغامدي',      age: 15, surah: 'سورة الكهف',       juz: 18, last: '07 أبر 2026', status: 'ممتاز' },
                      { name: 'عبدالله الزهراني',  age: 13, surah: 'سورة طه',          juz: 20, last: '08 أبر 2026', status: 'جيد' },
                      { name: 'محمد المالكي',      age: 12, surah: 'سورة مريم',        juz: 16, last: '07 أبر 2026', status: 'جيد' },
                      { name: 'سلطان القحطاني',   age: 14, surah: 'سورة الحجر',       juz: 15, last: '06 أبر 2026', status: 'يحتاج متابعة' },
                      { name: 'عمر الدوسري',      age: 11, surah: 'سورة إبراهيم',     juz: 13, last: '08 أبر 2026', status: 'جيد' },
                      { name: 'ياسر الشمري',      age: 16, surah: 'سورة الرعد',       juz: 12, last: '05 أبر 2026', status: 'يحتاج متابعة' },
                    ].map((s, i, arr) => {
                      const sc = s.status === 'ممتاز' ? QC : s.status === 'جيد' ? G : '#EF4444';
                      return (
                        <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${QC}18`, border: `1px solid ${QC}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👤</div>
                              {s.name}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: DIM }}>{s.age} سنة</td>
                          <td style={{ padding: '12px 14px', color: G, fontWeight: 600 }}>{s.surah}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3 }}>
                                <div style={{ width: `${Math.round((s.juz / 30) * 100)}%`, height: '100%', background: `linear-gradient(90deg,${QC},${G})`, borderRadius: 3 }}></div>
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: QC, minWidth: 40 }}>جزء {s.juz}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: DIM, fontSize: 11 }}>{s.last}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: `${sc}18`, color: sc, fontWeight: 700 }}>{s.status}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* ══════════════════════════════════════════════════════════════
              ATTENDANCE SECTION
          ══════════════════════════════════════════════════════════════ */}
          {active === 'attendance' && <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>الحضور</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>الأربعاء 8 أبريل 2026 – حلقة الفجر</div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
              {[
                { label: 'حاضر', value: '18 / 20', color: '#10B981', icon: '✅' },
                { label: 'غائب', value: '2',        color: '#EF4444', icon: '❌' },
                { label: 'في الوقت', value: '16',   color: QC,        icon: '⏰' },
              ].map((s, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${s.color}30`, borderRadius: 14, padding: '20px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Attendance list */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>✅</span> تسجيل الحضور
              </div>
              {[
                { name: 'نايف الشهري',     status: 'present' },
                { name: 'فهد العمري',      status: 'present' },
                { name: 'خالد الغامدي',    status: 'present' },
                { name: 'عبدالله الزهراني',status: 'present' },
                { name: 'محمد المالكي',    status: 'late'    },
                { name: 'سلطان القحطاني', status: 'absent'  },
                { name: 'عمر الدوسري',    status: 'present' },
                { name: 'ياسر الشمري',    status: 'absent'  },
                { name: 'بندر العتيبي',   status: 'present' },
                { name: 'تركي الرشيدي',   status: 'present' },
                { name: 'سعد الحارثي',    status: 'present' },
                { name: 'راشد البلوي',    status: 'present' },
                { name: 'وليد العمري',    status: 'late'    },
                { name: 'زياد السبيعي',   status: 'present' },
                { name: 'حسام العنزي',    status: 'present' },
                { name: 'ماجد الثبيتي',   status: 'present' },
                { name: 'أنس الجهني',     status: 'present' },
                { name: 'يوسف القرني',    status: 'present' },
                { name: 'هاني السلمي',    status: 'present' },
                { name: 'إبراهيم الوادعي',status: 'present' },
              ].map((s, i, arr) => {
                const isPres = s.status === 'present';
                const isLate = s.status === 'late';
                const col = isPres ? '#10B981' : isLate ? G : '#EF4444';
                const lbl = isPres ? 'حاضر' : isLate ? 'متأخر' : 'غائب';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${QC}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>👤</div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {(['present', 'late', 'absent'] as const).map(opt => {
                        const oc = opt === 'present' ? '#10B981' : opt === 'late' ? G : '#EF4444';
                        const ol = opt === 'present' ? 'حاضر' : opt === 'late' ? 'متأخر' : 'غائب';
                        const chosen = s.status === opt;
                        return (
                          <button key={opt} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FF, border: `1px solid ${oc}50`, background: chosen ? `${oc}25` : 'transparent', color: chosen ? oc : MUT, transition: 'all 0.15s' }}>{ol}</button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-start' }}>
                <button style={{ background: QC, border: 'none', color: '#fff', borderRadius: 10, padding: '10px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>حفظ الحضور</button>
              </div>
            </div>
          </>}

          {/* ══════════════════════════════════════════════════════════════
              RECITATION SECTION
          ══════════════════════════════════════════════════════════════ */}
          {active === 'recitation' && <>
            <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>جلسات التسميع</div>
                <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>اليوم – الأربعاء 8 أبريل 2026</div>
              </div>
              <button style={{ background: QC, border: 'none', color: '#fff', borderRadius: 10, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>+ جلسة جديدة</button>
            </div>

            {/* Grade summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 22 }}>
              {[
                { grade: 'A', label: 'ممتاز', count: 3, color: QC },
                { grade: 'B', label: 'جيد جداً', count: 2, color: '#3B82F6' },
                { grade: 'C', label: 'جيد', count: 1, color: G },
                { grade: 'D', label: 'مقبول', count: 1, color: '#F97316' },
                { grade: 'F', label: 'ضعيف', count: 1, color: '#EF4444' },
              ].map((g, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${g.color}30`, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: g.color }}>{g.grade}</div>
                  <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{g.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: g.color, marginTop: 6 }}>{g.count}</div>
                </div>
              ))}
            </div>

            {/* Recitation table */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🎙️</span> تفاصيل التسميع
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid ' + BD }}>
                      {['الطالب', 'السورة', 'نطاق الآيات', 'التقييم', 'جودة التسجيل', 'ملاحظات'].map(h => (
                        <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: 11, color: MUT, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'نايف الشهري',     surah: 'النبأ',    range: '1 – 40', grade: 'A', quality: 95, notes: 'إتقان تام، تجويد مثالي' },
                      { name: 'فهد العمري',      surah: 'الفرقان', range: '1 – 10', grade: 'A', quality: 90, notes: 'أداء ممتاز' },
                      { name: 'عبدالله الزهراني',surah: 'طه',      range: '1 – 15', grade: 'B', quality: 80, notes: 'تحسّن ملحوظ في المخارج' },
                      { name: 'محمد المالكي',    surah: 'مريم',    range: '1 – 12', grade: 'B', quality: 75, notes: 'جيد جداً، استمر' },
                      { name: 'خالد الغامدي',    surah: 'الكهف',   range: '60 – 75',grade: 'C', quality: 65, notes: 'يحتاج مراجعة الغنة' },
                      { name: 'سلطان القحطاني', surah: 'الحجر',   range: '1 – 8',  grade: 'D', quality: 50, notes: 'أخطاء في المد' },
                      { name: 'عمر الدوسري',    surah: 'إبراهيم', range: '1 – 10', grade: 'A', quality: 88, notes: 'جيد جداً' },
                      { name: 'ياسر الشمري',    surah: 'الرعد',   range: '1 – 7',  grade: 'F', quality: 40, notes: 'غياب متكرر أثّر على الحفظ' },
                    ].map((s, i, arr) => {
                      const gc = s.grade === 'A' ? QC : s.grade === 'B' ? '#3B82F6' : s.grade === 'C' ? G : s.grade === 'D' ? '#F97316' : '#EF4444';
                      const qc = s.quality >= 80 ? '#10B981' : s.quality >= 60 ? G : '#EF4444';
                      return (
                        <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${QC}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎙️</div>
                              {s.name}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: G, fontWeight: 600 }}>سورة {s.surah}</td>
                          <td style={{ padding: '12px 14px', color: DIM }}>الآيات {s.range}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ display: 'inline-block', width: 32, height: 32, lineHeight: '32px', textAlign: 'center', borderRadius: '50%', background: `${gc}20`, color: gc, fontWeight: 900, fontSize: 14 }}>{s.grade}</span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, minWidth: 60 }}>
                                <div style={{ width: `${s.quality}%`, height: '100%', background: qc, borderRadius: 3 }}></div>
                              </div>
                              <span style={{ fontSize: 11, color: qc, fontWeight: 700, minWidth: 28 }}>{s.quality}%</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: DIM, fontSize: 12 }}>{s.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* ══════════════════════════════════════════════════════════════
              REPORTS SECTION
          ══════════════════════════════════════════════════════════════ */}
          {active === 'reports' && <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>تقرير التقدم الشهري</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>أبريل 2026 – حلقتا الفجر والعصر</div>
            </div>

            {/* Overall stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
              {[
                { label: 'إجمالي الصفحات المحفوظة', value: '1,240', icon: '📚', color: QC },
                { label: 'صفحات جديدة هذا الشهر',  value: '84',    icon: '✨', color: G },
                { label: 'صفحات المراجعة',           value: '312',   icon: '🔄', color: '#3B82F6' },
              ].map((s, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${s.color}30`, borderRadius: 14, padding: '22px 20px' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: DIM, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bars per student */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20, marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📈</span> تقدم الحفظ لكل طالب – أبريل
              </div>
              {[
                { name: 'نايف الشهري',     juz: 28, pct: 93, newPages: 14, revPages: 42 },
                { name: 'فهد العمري',      juz: 24, pct: 80, newPages: 12, revPages: 36 },
                { name: 'خالد الغامدي',    juz: 18, pct: 60, newPages: 10, revPages: 30 },
                { name: 'عبدالله الزهراني',juz: 20, pct: 67, newPages: 11, revPages: 33 },
                { name: 'محمد المالكي',    juz: 16, pct: 53, newPages: 9,  revPages: 27 },
                { name: 'سلطان القحطاني', juz: 15, pct: 50, newPages: 8,  revPages: 24 },
                { name: 'عمر الدوسري',    juz: 13, pct: 43, newPages: 7,  revPages: 21 },
                { name: 'ياسر الشمري',    juz: 12, pct: 40, newPages: 3,  revPages: 9  },
              ].map((s, i, arr) => {
                const barColor = s.pct >= 80 ? QC : s.pct >= 55 ? G : '#F97316';
                return (
                  <div key={i} style={{ marginBottom: i < arr.length - 1 ? 18 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</span>
                        <span style={{ fontSize: 10, color: MUT }}>جزء {s.juz} / 30</span>
                      </div>
                      <div style={{ display: 'flex', gap: 14, fontSize: 11, color: DIM }}>
                        <span><span style={{ color: QC, fontWeight: 700 }}>+{s.newPages}</span> صفحة جديدة</span>
                        <span><span style={{ color: '#3B82F6', fontWeight: 700 }}>{s.revPages}</span> صفحة مراجعة</span>
                        <span style={{ color: barColor, fontWeight: 800 }}>{s.pct}%</span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: 14, background: 'rgba(255,255,255,.06)', borderRadius: 7 }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: `linear-gradient(90deg,${barColor},${barColor}cc)`, borderRadius: 7, transition: 'width 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 6 }}>
                      </div>
                      <div style={{ position: 'absolute', right: `${100 - s.pct}%`, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: barColor, border: '2px solid ' + BG, marginRight: -8 }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Monthly comparison table */}
            <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📊</span> مقارنة أشهر الحفظ
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid ' + BD }}>
                      {['الشهر', 'صفحات محفوظة', 'صفحات مراجع', 'معدل الحضور', 'التقييم العام'].map(h => (
                        <th key={h} style={{ textAlign: 'right', padding: '10px 14px', fontSize: 11, color: MUT, fontWeight: 700 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: 'يناير 2026', pages: 65, rev: 240, attend: '91%', rating: 4.7 },
                      { month: 'فبراير 2026', pages: 70, rev: 265, attend: '89%', rating: 4.6 },
                      { month: 'مارس 2026',  pages: 78, rev: 290, attend: '93%', rating: 4.8 },
                      { month: 'أبريل 2026', pages: 84, rev: 312, attend: '90%', rating: 4.9 },
                    ].map((r, i, arr) => (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none', background: i === arr.length - 1 ? `${QC}08` : 'transparent' }}>
                        <td style={{ padding: '11px 14px', fontWeight: i === arr.length - 1 ? 800 : 600, color: i === arr.length - 1 ? QC : TX }}>{r.month}</td>
                        <td style={{ padding: '11px 14px', color: QC, fontWeight: 700 }}>{r.pages}</td>
                        <td style={{ padding: '11px 14px', color: '#3B82F6', fontWeight: 700 }}>{r.rev}</td>
                        <td style={{ padding: '11px 14px', color: DIM }}>{r.attend}</td>
                        <td style={{ padding: '11px 14px' }}><Stars n={Math.round(r.rating)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>}

          {/* ══════════════════════════════════════════════════════════════
              SETTINGS SECTION
          ══════════════════════════════════════════════════════════════ */}
          {active === 'settings' && <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 900 }}>الإعدادات</div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>إعدادات الحلقة والملف الشخصي والإشعارات</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Circle info */}
              <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📖</span> معلومات الحلقة
                </div>
                {[
                  { label: 'اسم الحلقة', value: 'حلقة الشيخ عبدالرحمن السديري' },
                  { label: 'الرواية', value: 'حفص عن عاصم' },
                  { label: 'المسجد', value: 'مسجد الراشد – الرياض' },
                  { label: 'سعة الحلقة', value: '20 طالباً' },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 11, color: MUT, fontWeight: 700, display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid ' + BD, borderRadius: 9, padding: '10px 14px', fontSize: 13, color: TX }}>{f.value}</div>
                  </div>
                ))}
                <button style={{ width: '100%', background: `${QC}18`, border: `1px solid ${QC}40`, color: QC, borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, marginTop: 4 }}>تعديل المعلومات</button>
              </div>

              {/* Schedule */}
              <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📅</span> الجدول الأسبوعي
                </div>
                {[
                  { day: 'السبت – الخميس', session: 'حلقة الفجر',  time: '05:30 – 06:30', room: 'قاعة 1' },
                  { day: 'السبت – الخميس', session: 'حلقة العصر',  time: '16:00 – 17:30', room: 'قاعة 3' },
                  { day: 'الجمعة',          session: 'مراجعة عامة', time: '10:00 – 11:00', room: 'القاعة الرئيسية' },
                ].map((sc, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid ' + BD, borderRadius: 10, padding: '12px 14px', marginBottom: i < 2 ? 10 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: QC }}>{sc.session}</span>
                      <span style={{ fontSize: 11, color: MUT }}>{sc.day}</span>
                    </div>
                    <div style={{ fontSize: 11, color: DIM }}>⏰ {sc.time} &nbsp;|&nbsp; 🚪 {sc.room}</div>
                  </div>
                ))}
                <button style={{ width: '100%', background: `${QC}18`, border: `1px solid ${QC}40`, color: QC, borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, marginTop: 14 }}>تعديل الجدول</button>
              </div>

              {/* Teacher info */}
              <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🎓</span> معلومات المحفّظ
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, background: `${QC}0D`, border: `1px solid ${QC}25`, borderRadius: 12, padding: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg,${QC},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🎓</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>الشيخ عبدالرحمن السديري</div>
                    <div style={{ fontSize: 11, color: G, marginTop: 3, fontWeight: 700 }}>محفّظ معتمد · مجاز بالسند المتصل</div>
                    <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>رقم الترخيص: QI-4892</div>
                  </div>
                </div>
                {[
                  { label: 'البريد الإلكتروني', value: 'alsudairi@quran.sa' },
                  { label: 'رقم الجوال',        value: '+966 5X XXX XXXX' },
                  { label: 'سنوات الخبرة',      value: '12 سنة' },
                ].map((f, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: MUT, fontWeight: 700, display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid ' + BD, borderRadius: 9, padding: '9px 14px', fontSize: 13, color: TX }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>🔔</span> إعدادات الإشعارات
                </div>
                {[
                  { label: 'إشعارات الحضور',          sub: 'تنبيه عند تسجيل غياب طالب',      on: true  },
                  { label: 'رسائل أولياء الأمور',      sub: 'تنبيه فوري عند وصول رسالة جديدة', on: true  },
                  { label: 'تذكير الحلقة',             sub: 'قبل 15 دقيقة من موعد الحلقة',     on: true  },
                  { label: 'تقارير الأداء الأسبوعية',  sub: 'ملخص أسبوعي كل يوم جمعة',         on: false },
                  { label: 'نقاط الطلاب',              sub: 'تنبيه عند اكتساب طالب مكافأة',    on: true  },
                  { label: 'الإشعارات التسويقية',      sub: 'أخبار المنصة والتحديثات',          on: false },
                ].map((n, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{n.label}</div>
                      <div style={{ fontSize: 11, color: MUT, marginTop: 2 }}>{n.sub}</div>
                    </div>
                    <div style={{ position: 'relative', width: 44, height: 24, flexShrink: 0 }}>
                      <div style={{ width: 44, height: 24, borderRadius: 12, background: n.on ? QC : 'rgba(255,255,255,.1)', transition: 'background 0.2s', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 3px', justifyContent: n.on ? 'flex-end' : 'flex-start' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,.4)' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
                <button style={{ width: '100%', background: QC, border: 'none', color: '#fff', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, marginTop: 18 }}>حفظ الإعدادات</button>
              </div>
            </div>
          </>}

        </div>
      </main>
    </div>
  );
}
