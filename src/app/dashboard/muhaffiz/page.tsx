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
  { title: 'الرئيسية', items: [{ label: 'لوحة التحكم', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10"/></svg>, id: 'overview' }, { label: 'جدول الحلقات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg>, id: 'schedule' }] },
  { title: 'حلقاتي', items: [{ label: 'حلقاتي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, id: 'halaqat', badge: 2 }, { label: 'خطة الحفظ', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, id: 'plan' }, { label: 'سجل التسميع', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, id: 'tasmi' }] },
  { title: 'الطلاب', items: [{ label: 'طلابي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, id: 'students', badge: 33 }, { label: 'الحضور', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, id: 'attendance' }, { label: 'التقييم', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, id: 'eval', badge: 5 }, { label: 'نقاط الحفز', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>, id: 'points' }] },
  { title: 'التواصل', items: [{ label: 'أولياء الأمور', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, id: 'parents' }, { label: 'الرسائل', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, id: 'messages', badge: 3 }, { label: 'الإعلانات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>, id: 'announcements' }] },
  { title: 'الملف', items: [{ label: 'ملفي الشخصي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, id: 'profile' }, { label: 'إجازاتي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, id: 'ijazat' }, { label: 'الإعدادات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, id: 'settings' }] },
];

const statCards = [
  { label: 'حلقاتي', value: '2', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, color: QC },
  { label: 'طلابي', value: '33', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: '#3B82F6' },
  { label: 'جزء حُفظ', value: '12', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, color: G },
  { label: 'التقييم', value: '4.9 <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, color: '#A78BFA' },
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
  { rank: 1, name: 'نايف الشهري', points: 1240, badge: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg> },
  { rank: 2, name: 'فهد العمري', points: 1180, badge: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg> },
  { rank: 3, name: 'خالد الغامدي', points: 1050, badge: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg> },
  { rank: 4, name: 'عبدالله الزهراني', points: 980, badge: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  { rank: 5, name: 'سلطان القحطاني', points: 870, badge: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
];

function Stars({ n }: { n: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? G : 'rgba(255,255,255,.15)', fontSize: 13 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>
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
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg,${QC},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 10px' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
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
            <button onClick={() => setSideOpen(!sideOpen)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid ' + BD, borderRadius: 8, padding: '6px 10px', color: DIM, cursor: 'pointer', fontSize: 16, fontFamily: FF }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/></svg></button>
            <span style={{ fontSize: 14, fontWeight: 700 }}>لوحة التحكم – المحفّظ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 11, color: DIM }}>الأربعاء 8 أبريل 2026</div>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${QC},${G})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
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
              <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg></span> حلقات اليوم
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {halaqatToday.map((h, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${h.live ? QC + '40' : BD}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800 }}>{h.name}</span>
                    <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: h.live ? '#10B98120' : 'rgba(255,255,255,.05)', color: h.live ? '#10B981' : MUT, fontWeight: 700 }}>{h.live ? '<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/></svg> مباشرة' : '⏳ قادمة'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> {h.time} &nbsp;|&nbsp; <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg> {h.room}</div>
                  <div style={{ fontSize: 11, color: G, fontWeight: 700, marginBottom: 4 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> {h.sura}</div>
                  <div style={{ fontSize: 11, color: DIM, marginBottom: 10 }}>التقدم: {h.progress}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUT }}>
                    <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> {h.students} طالب</span>
                    <button style={{ background: `${QC}20`, border: 'none', color: QC, borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>بدء الحلقة</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── TASMI TABLE ── */}
          <div style={{ background: CARD, border: '1px solid ' + BD, borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg></span> سجل التسميع – اليوم
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
                <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg></span> تقدم الحفظ
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
                <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></span> حضور اليوم
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
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span> رسائل أولياء الأمور</span>
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
                <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></span> لوحة النقاط
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
