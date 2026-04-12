'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BG = '#06060E';
const SB = '#0A1510';
const C = '#4ADE80';
const GD = '#D4A843';
const TXT = '#EEEEF5';
const DIM = 'rgba(238,238,245,0.5)';
const MUT = 'rgba(238,238,245,0.3)';
const BD = 'rgba(255,255,255,0.08)';
const CD = 'rgba(255,255,255,0.03)';
const FONT = "'IBM Plex Sans Arabic', sans-serif";

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [schedule, setSchedule] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, statsRes, schedRes, studRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'include' }),
          fetch('/api/dashboard-stats', { credentials: 'include' }),
          fetch('/api/schedules', { credentials: 'include' }),
          fetch('/api/students', { credentials: 'include' }),
        ]);
        if (meRes.ok) { const d = await meRes.json(); setUser(d.user || d); }
        if (statsRes.ok) setStats(await statsRes.json());
        if (schedRes.ok) { const d = await schedRes.json(); setSchedule(Array.isArray(d) ? d : []); }
        if (studRes.ok) { const d = await studRes.json(); setStudents(Array.isArray(d) ? d : d.students || []); }
      } catch (e) {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: BG, color: C, fontFamily: FONT, direction: 'rtl' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg></div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>جاري التحميل...</div>
      </div>
    </div>
  );

  const teacherName = user?.name || 'المعلم';

  const defaultStudents = [
    { id: 1, name: 'أحمد محمد العمري', class: 'الرابع أ', attendance: 96, grade: 88 },
    { id: 2, name: 'فاطمة عبدالله السالم', class: 'الرابع أ', attendance: 100, grade: 95 },
    { id: 3, name: 'عمر خالد الحربي', class: 'الخامس ب', attendance: 88, grade: 72 },
    { id: 4, name: 'نورة سعد القحطاني', class: 'الخامس ب', attendance: 92, grade: 85 },
    { id: 5, name: 'محمد علي الزهراني', class: 'السادس أ', attendance: 100, grade: 91 },
    { id: 6, name: 'ريم إبراهيم المالكي', class: 'السادس أ', attendance: 84, grade: 78 },
    { id: 7, name: 'خالد عبدالرحمن العتيبي', class: 'الرابع ب', attendance: 92, grade: 83 },
    { id: 8, name: 'منى فيصل الدوسري', class: 'الخامس أ', attendance: 96, grade: 90 },
  ];

  const displayStudents = students.length > 0 ? students : defaultStudents;

  const defaultSchedule = [
    { period: 1, time: '7:30 - 8:15', subject: 'رياضيات', class: 'الصف الرابع أ', room: '201' },
    { period: 2, time: '8:20 - 9:05', subject: 'رياضيات', class: 'الصف الخامس ب', room: '305' },
    { period: 3, time: '9:30 - 10:15', subject: 'رياضيات', class: 'الصف السادس أ', room: '102' },
    { period: 4, time: '10:20 - 11:05', subject: 'رياضيات', class: 'الصف الرابع ب', room: '201' },
  ];

  const displaySchedule = schedule.length > 0 ? schedule.slice(0, 4) : defaultSchedule;

  const handleSaveAttendance = async () => {
    try {
      await fetch('/api/attendance', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0], attendance: attendanceMap }),
      });
    } catch (e) {}
  };

  const navItems = [
    { id: 'home',       icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'الرئيسية' },
    { id: 'schedule',   icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg>, label: 'الجدول اليومي' },
    { id: 'students',   icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, label: 'طلابي' },
    { id: 'attendance', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, label: 'الحضور والغياب' },
    { id: 'exams',      icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, label: 'الاختبارات' },
    { id: 'grades',     icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'الدرجات' },
    { id: 'homework',   icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, label: 'الواجبات' },
    { id: 'elearning',  icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4"/></svg>, label: 'التعليم الإلكتروني' },
    { id: 'messages',   icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'المراسلات' },
    { id: 'settings',   icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: 'الإعدادات' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: FONT, direction: 'rtl', background: BG, color: TXT }}>

      {/* ═══════════════════════════════════════════════════════ SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 260 : 0,
        background: SB,
        borderLeft: `1px solid ${BD}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
        flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${C}, #047857)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0,
          }}>م</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap' }}>متين</div>
            <div style={{ fontSize: 9, color: MUT, whiteSpace: 'nowrap' }}>لوحة تحكم المعلم</div>
          </div>
        </div>

        {/* Teacher Card */}
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${BD}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: `${C}1A`, border: `1px solid ${C}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, flexShrink: 0,
            }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{teacherName}</div>
              <div style={{ fontSize: 10, color: C, whiteSpace: 'nowrap' }}>معلم — رياضيات</div>
              <div style={{ fontSize: 10, color: MUT, whiteSpace: 'nowrap' }}>الصف الرابع · الخامس · السادس</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
          {navItems.map(nav => (
            <button
              key={nav.id}
              onClick={() => setActiveSection(nav.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                width: '100%', padding: '9px 11px', borderRadius: 10,
                border: 'none', cursor: 'pointer', fontFamily: FONT,
                fontSize: 12.5, fontWeight: 600,
                background: activeSection === nav.id ? `${C}18` : 'transparent',
                color: activeSection === nav.id ? C : DIM,
                marginBottom: 2, textAlign: 'right',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>{nav.icon}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{nav.label}</span>
              {activeSection === nav.id && (
                <span style={{ marginRight: 'auto', width: 4, height: 4, borderRadius: '50%', background: C, flexShrink: 0 }} />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '12px 18px', borderTop: `1px solid ${BD}`, flexShrink: 0 }}>
          <button
            onClick={() => router.push('/login')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, fontSize: 12, color: MUT, padding: 0 }}
          >
            <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg></span> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════ MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: 58, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${BD}`,
          background: 'rgba(6,6,14,0.85)', backdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 8, cursor: 'pointer', color: DIM, fontSize: 16, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            ><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3"/></svg></button>
            <div>
              <h1 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>مرحباً يا أستاذ {teacherName} <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></h1>
              <div style={{ fontSize: 10, color: MUT }}>{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Class Selector */}
            <select style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`,
              borderRadius: 8, padding: '6px 12px', color: DIM, fontSize: 11,
              fontFamily: FONT, cursor: 'pointer', outline: 'none',
            }}>
              <option>الصف الرابع أ</option>
              <option>الصف الخامس ب</option>
              <option>الصف السادس أ</option>
            </select>

            {/* Notification Bell */}
            <button style={{
              position: 'relative', background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${BD}`, borderRadius: 9,
              width: 36, height: 36, cursor: 'pointer', color: DIM,
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '2px solid #06060E' }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: `${C}22`, border: `1px solid ${C}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
          </div>
        </header>

        {/* ─── Content Area ─── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

          {/* ══════════════════════════════════════════════ HOME */}
          {activeSection === 'home' && (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'إجمالي طلابي', value: displayStudents.length || stats.students || 156, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, color: '#60A5FA', sub: 'عبر جميع الفصول' },
                  { label: 'نسبة الحضور اليوم', value: `${stats.attendance_rate || 94}%`, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, color: C, sub: 'فوق المستوى المطلوب' },
                  { label: 'اختبارات قادمة', value: stats.upcoming_exams || 3, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, color: '#FB923C', sub: 'خلال 7 أيام' },
                  { label: 'متوسط الدرجات', value: `${stats.average_grade || 82}%`, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, color: '#A78BFA', sub: 'هذا الفصل الدراسي' },
                ].map((s, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -10, left: -10, width: 60, height: 60, borderRadius: '50%', background: `${s.color}0A` }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, color: DIM, fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: MUT }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Today's Schedule */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px', marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> جدول اليوم</h3>
                  <button
                    onClick={() => setActiveSection('schedule')}
                    style={{ background: 'none', border: 'none', color: C, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}
                  >عرض الجدول الكامل ←</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {displaySchedule.map((p: any, i: number) => {
                    const isNow = i === 1;
                    return (
                      <div key={i} style={{
                        background: isNow ? `${C}10` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isNow ? C + '44' : BD}`,
                        borderRadius: 12, padding: '14px 12px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 10, color: C, fontWeight: 700, marginBottom: 4 }}>الحصة {p.period || i + 1}</div>
                        <div style={{ fontSize: 11, color: MUT, marginBottom: 8 }}>{p.time || `${7 + i}:30`}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: isNow ? C : TXT }}>{p.subject || 'رياضيات'}</div>
                        <div style={{ fontSize: 11, color: DIM, marginBottom: 2 }}>{p.class || `الصف ${i + 4}`}</div>
                        <div style={{ fontSize: 10, color: MUT }}>قاعة {p.room || '201'}</div>
                        {isNow && (
                          <div style={{ marginTop: 8, background: `${C}22`, borderRadius: 6, padding: '2px 8px', fontSize: 9, color: C, fontWeight: 700 }}>الحصة الحالية</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two-Column Row: Quick Actions + Top Students */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>

                {/* Quick Actions */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 14px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> إجراءات سريعة</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, label: 'تسجيل حضور', onClick: () => setActiveSection('attendance') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, label: 'اختبار جديد', onClick: () => setActiveSection('exams') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, label: 'رصد درجات', onClick: () => setActiveSection('grades') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, label: 'واجب جديد', onClick: () => setActiveSection('homework') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4"/></svg>, label: 'بث مباشر', onClick: () => router.push('/dashboard/live-stream') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'مراسلة ولي', onClick: () => setActiveSection('messages') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg>, label: 'مساعد AI', onClick: () => router.push('/dashboard/ai-chat') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, label: 'قائمة الطلاب', onClick: () => setActiveSection('students') },
                      { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, label: 'المكتبة', onClick: () => router.push('/dashboard/library') },
                    ].map((qa, i) => (
                      <button key={i} onClick={qa.onClick} style={{
                        background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`,
                        borderRadius: 10, padding: '10px 6px', cursor: 'pointer',
                        fontFamily: FONT, textAlign: 'center', color: DIM,
                        fontSize: 10.5, fontWeight: 600,
                      }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{qa.icon}</div>
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Students */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg> أفضل الطلاب</h3>
                    <button onClick={() => setActiveSection('students')} style={{ background: 'none', border: 'none', color: C, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>عرض الكل ←</button>
                  </div>
                  {displayStudents.slice(0, 5).map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 4 ? `1px solid ${BD}` : 'none' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: i === 0 ? `${GD}22` : i === 1 ? 'rgba(192,192,192,0.1)' : i === 2 ? 'rgba(205,127,50,0.1)' : 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 800,
                        color: i === 0 ? GD : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : MUT,
                        flexShrink: 0,
                      }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: MUT }}>{s.class || 'غير محدد'}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: (s.grade || 0) >= 90 ? C : (s.grade || 0) >= 75 ? '#60A5FA' : '#FB923C' }}>
                        {s.grade || 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 14px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> آخر النشاطات</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, text: 'تم تسجيل حضور الصف الرابع أ', time: 'منذ 30 دقيقة', color: C },
                    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, text: 'تم إنشاء اختبار جبر للصف الخامس', time: 'منذ ساعتين', color: '#FB923C' },
                    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, text: 'رسالة جديدة من ولي أمر أحمد العمري', time: 'منذ 3 ساعات', color: '#60A5FA' },
                    { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, text: 'تم إضافة واجب هندسة للصف السادس', time: 'أمس', color: '#A78BFA' },
                  ].map((act, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 9, background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${act.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{act.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{act.text}</div>
                      </div>
                      <div style={{ fontSize: 10, color: MUT, whiteSpace: 'nowrap' }}>{act.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ══════════════════════════════════════════════ SCHEDULE */}
          {activeSection === 'schedule' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> الجدول الأسبوعي</h2>
                <div style={{ fontSize: 12, color: DIM }}>الفصل الدراسي الثاني — 1446</div>
              </div>

              {/* Today card */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 14px 0', color: C }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg> حصص اليوم</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {displaySchedule.map((p: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: C, fontWeight: 700, marginBottom: 4 }}>الحصة {p.period || i + 1}</div>
                      <div style={{ fontSize: 11, color: MUT, marginBottom: 8 }}>{p.time || `${7 + i}:30 - ${8 + i}:15`}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.subject || 'رياضيات'}</div>
                      <div style={{ fontSize: 11, color: DIM, marginBottom: 2 }}>{p.class || `الصف ${i + 4}`}</div>
                      <div style={{ fontSize: 10, color: MUT }}>قاعة {p.room || '201'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Grid */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 16px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> الجدول الأسبوعي الكامل</h3>
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].map((day, di) => (
                  <div key={di} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: C, display: 'inline-block' }} />
                      {day}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(p => {
                        const hasClass = !(di === 4 && p === 5) && !(di === 0 && p === 3);
                        return (
                          <div key={p} style={{
                            background: hasClass ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                            border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 6px', textAlign: 'center',
                          }}>
                            <div style={{ fontSize: 9, color: MUT, marginBottom: 2 }}>الحصة {p}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: hasClass ? TXT : MUT }}>{hasClass ? 'رياضيات' : '—'}</div>
                            <div style={{ fontSize: 9, color: DIM }}>{hasClass ? `الصف ${di + 4}` : 'فراغ'}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ STUDENTS */}
          {activeSection === 'students' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg> قائمة طلابي</h2>
                <select style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 8, padding: '6px 12px', color: DIM, fontSize: 11, fontFamily: FONT, outline: 'none' }}>
                  <option>جميع الفصول</option>
                  <option>الصف الرابع أ</option>
                  <option>الصف الخامس ب</option>
                  <option>الصف السادس أ</option>
                </select>
              </div>

              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 1fr 1fr 100px', gap: 8, padding: '12px 16px', background: 'rgba(255,255,255,0.04)', fontSize: 11, fontWeight: 700, color: MUT }}>
                  <span>#</span>
                  <span>اسم الطالب</span>
                  <span>الفصل</span>
                  <span>الحضور</span>
                  <span>المعدل</span>
                  <span>إجراءات</span>
                </div>
                {/* Rows */}
                {displayStudents.map((s: any, i: number) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '44px 2fr 1fr 1fr 1fr 100px',
                    gap: 8, padding: '12px 16px', borderTop: `1px solid ${BD}`,
                    fontSize: 12, alignItems: 'center',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}>
                    <span style={{ color: MUT, fontWeight: 600 }}>{i + 1}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: `${C}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                    <span style={{ color: DIM }}>{s.class || 'غير محدد'}</span>
                    <span style={{ color: (s.attendance || 0) >= 90 ? C : (s.attendance || 0) >= 75 ? '#FB923C' : '#ef4444', fontWeight: 700 }}>{s.attendance || 0}%</span>
                    <span style={{ color: (s.grade || 0) >= 85 ? '#60A5FA' : (s.grade || 0) >= 70 ? GD : '#FB923C', fontWeight: 700 }}>{s.grade || 0}%</span>
                    <button style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 7, padding: '4px 10px', color: C, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>التفاصيل</button>
                  </div>
                ))}
              </div>

              {/* Summary Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
                {[
                  { label: 'إجمالي الطلاب', value: displayStudents.length, color: '#60A5FA' },
                  { label: 'متوسط الحضور', value: `${Math.round(displayStudents.reduce((a: number, s: any) => a + (s.attendance || 0), 0) / (displayStudents.length || 1))}%`, color: C },
                  { label: 'متوسط المعدل', value: `${Math.round(displayStudents.reduce((a: number, s: any) => a + (s.grade || 0), 0) / (displayStudents.length || 1))}%`, color: '#A78BFA' },
                ].map((item, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: item.color }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: DIM, marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ ATTENDANCE */}
          {activeSection === 'attendance' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> تسجيل الحضور والغياب</h2>
                <div style={{ fontSize: 12, color: DIM }}>{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>

              {/* Class Selector */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                {['الصف الرابع أ', 'الصف الخامس ب', 'الصف السادس أ', 'الصف الرابع ب'].map((cls, i) => (
                  <button key={i} style={{
                    background: i === 0 ? `${C}18` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${i === 0 ? C + '44' : BD}`,
                    borderRadius: 8, padding: '6px 14px', color: i === 0 ? C : DIM,
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT,
                  }}>{cls}</button>
                ))}
              </div>

              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: `${C}18`, border: `1px solid ${C}44`, borderRadius: 7, padding: '5px 12px', color: C, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>تحديد الكل حاضر</button>
                    <button style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 7, padding: '5px 12px', color: DIM, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>مسح الكل</button>
                  </div>
                  <button
                    onClick={handleSaveAttendance}
                    style={{ background: C, border: 'none', borderRadius: 9, padding: '8px 20px', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}
                  ><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg> حفظ الحضور</button>
                </div>

                {/* Column Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 200px', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, marginBottom: 8, fontSize: 11, fontWeight: 700, color: MUT }}>
                  <span>#</span><span>اسم الطالب</span><span>الحضور السابق</span><span>حالة اليوم</span>
                </div>

                {/* Student Rows */}
                {displayStudents.map((s: any, i: number) => {
                  const status = attendanceMap[s.id || i] || 'حاضر';
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 200px', gap: 8, padding: '10px 12px', borderBottom: `1px solid ${BD}`, alignItems: 'center' }}>
                      <span style={{ color: MUT, fontSize: 12 }}>{i + 1}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: '#60A5FA18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: (s.attendance || 0) >= 90 ? C : '#FB923C' }}>{s.attendance || 0}%</span>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[
                          { label: 'حاضر', color: C },
                          { label: 'غائب', color: '#ef4444' },
                          { label: 'متأخر', color: GD },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => setAttendanceMap(prev => ({ ...prev, [s.id || i]: opt.label }))}
                            style={{
                              background: status === opt.label ? `${opt.color}22` : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${status === opt.label ? opt.color + '55' : BD}`,
                              borderRadius: 7, padding: '4px 10px',
                              color: status === opt.label ? opt.color : DIM,
                              fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: FONT,
                              transition: 'all 0.2s',
                            }}
                          >{opt.label}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Attendance Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'حاضر', value: Object.values(attendanceMap).filter(v => v === 'حاضر').length || displayStudents.length, color: C, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
                  { label: 'غائب', value: Object.values(attendanceMap).filter(v => v === 'غائب').length, color: '#ef4444', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01"/></svg> },
                  { label: 'متأخر', value: Object.values(attendanceMap).filter(v => v === 'متأخر').length, color: GD, icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> },
                ].map((item, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 11, color: DIM }}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ EXAMS */}
          {activeSection === 'exams' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg> الاختبارات</h2>
                <button
                  onClick={() => router.push('/dashboard/exams/create')}
                  style={{ background: C, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}
                >+ إنشاء اختبار جديد</button>
              </div>

              {/* Upcoming Exams */}
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: '#FB923C' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> الاختبارات القادمة</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {[
                  { title: 'اختبار الفصل الأول — رياضيات', class: 'الصف الرابع أ', date: '15 أبريل 2026', duration: '45 دقيقة', questions: 30 },
                  { title: 'اختبار شهري — جبر', class: 'الصف الخامس ب', date: '8 أبريل 2026', duration: '60 دقيقة', questions: 25 },
                  { title: 'اختبار قصير — المعادلات', class: 'الصف السادس أ', date: '10 أبريل 2026', duration: '30 دقيقة', questions: 15 },
                ].map((exam, i) => (
                  <div key={i} style={{ background: CD, border: '1px solid #FB923C33', borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ background: '#FB923C18', color: '#FB923C', border: '1px solid #FB923C33', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>قادم</span>
                      <span style={{ fontSize: 11, color: MUT }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> {exam.date}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{exam.title}</div>
                    <div style={{ fontSize: 12, color: DIM, marginBottom: 8 }}>{exam.class}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 10, color: MUT }}>
                      <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg> {exam.duration}</span>
                      <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg> {exam.questions} سؤال</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                      <button style={{ flex: 1, background: `${C}15`, border: `1px solid ${C}33`, borderRadius: 7, padding: '5px 0', color: C, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>تعديل</button>
                      <button style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 7, padding: '5px 0', color: DIM, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>معاينة</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Past Exams */}
              <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: C }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> الاختبارات المنتهية</h3>
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', fontSize: 11, fontWeight: 700, color: MUT }}>
                  <span>الاختبار</span><span>الفصل</span><span>التاريخ</span><span>المتوسط</span><span>النتائج</span>
                </div>
                {[
                  { title: 'اختبار قصير — هندسة', class: 'الصف السادس أ', date: '28 مارس', avg: '78%' },
                  { title: 'اختبار شهري — رياضيات', class: 'الصف الرابع أ', date: '15 مارس', avg: '83%' },
                  { title: 'اختبار الفصل — جبر', class: 'الصف الخامس ب', date: '1 مارس', avg: '76%' },
                ].map((exam, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px', gap: 8, padding: '12px 16px', borderTop: `1px solid ${BD}`, fontSize: 12, alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{exam.title}</span>
                    <span style={{ color: DIM }}>{exam.class}</span>
                    <span style={{ color: MUT }}>{exam.date}</span>
                    <span style={{ color: C, fontWeight: 700 }}>{exam.avg}</span>
                    <button style={{ background: '#60A5FA18', border: '1px solid #60A5FA33', borderRadius: 7, padding: '4px 10px', color: '#60A5FA', fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>عرض النتائج</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ GRADES */}
          {activeSection === 'grades' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> رصد الدرجات</h2>
                <button style={{ background: C, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg> حفظ الدرجات</button>
              </div>

              {/* Selectors */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 8, padding: '7px 14px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none' }}>
                  <option>الصف الرابع أ</option>
                  <option>الصف الخامس ب</option>
                  <option>الصف السادس أ</option>
                </select>
                <select style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 8, padding: '7px 14px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none' }}>
                  <option>اختبار الفصل الأول</option>
                  <option>الاختبار الشهري</option>
                  <option>الواجبات</option>
                  <option>المشاركة الصفية</option>
                </select>
              </div>

              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', fontSize: 11, fontWeight: 700, color: MUT }}>
                  <span>#</span><span>الطالب</span><span>الاختبار/20</span><span>الشفهي/10</span><span>الواجب/10</span><span>المجموع/40</span>
                </div>
                {displayStudents.map((s: any, i: number) => {
                  const exam = Math.round((s.grade || 80) * 0.2);
                  const oral = 8;
                  const hw = 9;
                  const total = exam + oral + hw;
                  return (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 2fr 1fr 1fr 1fr 1fr', gap: 8, padding: '10px 16px', borderTop: `1px solid ${BD}`, fontSize: 12, alignItems: 'center' }}>
                      <span style={{ color: MUT }}>{i + 1}</span>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                      <input defaultValue={exam} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 7, padding: '4px 8px', color: TXT, fontSize: 12, fontFamily: FONT, width: 60, textAlign: 'center', outline: 'none' }} />
                      <input defaultValue={oral} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 7, padding: '4px 8px', color: TXT, fontSize: 12, fontFamily: FONT, width: 60, textAlign: 'center', outline: 'none' }} />
                      <input defaultValue={hw} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 7, padding: '4px 8px', color: TXT, fontSize: 12, fontFamily: FONT, width: 60, textAlign: 'center', outline: 'none' }} />
                      <span style={{ fontWeight: 800, color: total >= 32 ? C : total >= 24 ? GD : '#FB923C' }}>{total}</span>
                    </div>
                  );
                })}
              </div>

              {/* Grade Distribution */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 14px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg> توزيع الدرجات</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {[
                    { label: 'ممتاز (90-100)', value: displayStudents.filter((s: any) => (s.grade || 0) >= 90).length, color: C },
                    { label: 'جيد جداً (80-89)', value: displayStudents.filter((s: any) => (s.grade || 0) >= 80 && (s.grade || 0) < 90).length, color: '#60A5FA' },
                    { label: 'جيد (70-79)', value: displayStudents.filter((s: any) => (s.grade || 0) >= 70 && (s.grade || 0) < 80).length, color: GD },
                    { label: 'مقبول (أقل من 70)', value: displayStudents.filter((s: any) => (s.grade || 0) < 70).length, color: '#FB923C' },
                  ].map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BD}`, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: item.color }}>{item.value}</div>
                      <div style={{ fontSize: 10, color: DIM, marginTop: 4 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ HOMEWORK */}
          {activeSection === 'homework' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg> الواجبات المنزلية</h2>
                <button style={{ background: C, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>+ إضافة واجب جديد</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { title: 'تمارين الكسور — الصفحة 45', class: 'الصف الرابع أ', due: '9 أبريل', submitted: 18, total: 25, color: '#FB923C' },
                  { title: 'حل مسائل الجبر', class: 'الصف الخامس ب', due: '10 أبريل', submitted: 20, total: 22, color: C },
                  { title: 'تدريبات الهندسة الفراغية', class: 'الصف السادس أ', due: '11 أبريل', submitted: 5, total: 30, color: '#ef4444' },
                  { title: 'مراجعة الوحدة الثانية', class: 'الصف الرابع ب', due: '12 أبريل', submitted: 28, total: 28, color: C },
                  { title: 'تمارين الاحتمالات', class: 'الصف الخامس أ', due: '13 أبريل', submitted: 14, total: 26, color: '#60A5FA' },
                ].map((hw, i) => (
                  <div key={i} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{hw.class}</span>
                      <span style={{ fontSize: 10, color: MUT }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> {hw.due}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{hw.title}</div>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 10 }}>
                      التسليم: <span style={{ color: hw.color, fontWeight: 700 }}>{hw.submitted}</span> / {hw.total}
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round((hw.submitted / hw.total) * 100)}%`, background: hw.color, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 4, textAlign: 'left' }}>{Math.round((hw.submitted / hw.total) * 100)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ ELEARNING */}
          {activeSection === 'elearning' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z M8 21h8 M12 17v4"/></svg> التعليم الإلكتروني</h2>
              </div>

              {/* Feature Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, title: 'بث مباشر', desc: 'ابدأ حصة مباشرة مع طلابك الآن', path: '/dashboard/live-stream', color: '#60A5FA', badge: 'متاح' },
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, title: 'المحتوى التعليمي', desc: 'ملفات ومقاطع مرفوعة للطلاب', path: '/dashboard/elearning', color: C, badge: '12 ملف' },
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, title: 'اختبار إلكتروني', desc: 'أنشئ اختباراً تفاعلياً أونلاين', path: '/dashboard/exams', color: '#A78BFA', badge: null },
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3"/></svg>, title: 'مساعد AI', desc: 'أنشئ أسئلة بالذكاء الاصطناعي', path: '/dashboard/ai-chat', color: GD, badge: 'جديد' },
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, title: 'بنك الأسئلة', desc: 'أسئلة جاهزة حسب المنهج', path: '/dashboard/question-bank', color: '#FB923C', badge: '200+ سؤال' },
                  { icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, title: 'تسجيلات الحصص', desc: 'مشاهدة وإدارة التسجيلات السابقة', path: '/dashboard/recordings', color: '#F472B6', badge: '8 تسجيل' },
                ].map((item, i) => (
                  <button key={i} onClick={() => router.push(item.path)} style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: 20, cursor: 'pointer', fontFamily: FONT, textAlign: 'right', position: 'relative', overflow: 'hidden' }}>
                    {item.badge && (
                      <div style={{ position: 'absolute', top: 12, left: 12, background: `${item.color}22`, border: `1px solid ${item.color}44`, borderRadius: 6, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: item.color }}>{item.badge}</div>
                    )}
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}18`, border: `1px solid ${item.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>{item.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 6 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: DIM, lineHeight: 1.5 }}>{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Uploaded Materials */}
              <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg> المواد المرفوعة مؤخراً</h3>
                  <button style={{ background: `${C}18`, border: `1px solid ${C}33`, borderRadius: 7, padding: '5px 12px', color: C, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>+ رفع ملف</button>
                </div>
                {[
                  { name: 'شرح الكسور.pdf', class: 'الصف الرابع أ', size: '2.3 MB', date: 'منذ يومين', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, color: '#ef4444' },
                  { name: 'حل تمارين الجبر.mp4', class: 'الصف الخامس ب', size: '45 MB', date: 'منذ 3 أيام', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, color: '#60A5FA' },
                  { name: 'ملزمة الهندسة.pptx', class: 'الصف السادس أ', size: '8.1 MB', date: 'منذ أسبوع', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, color: '#FB923C' },
                ].map((file, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${BD}` : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${file.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{file.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                      <div style={{ fontSize: 10, color: MUT }}>{file.class} · {file.size} · {file.date}</div>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BD}`, borderRadius: 7, padding: '4px 10px', color: DIM, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: FONT, flexShrink: 0 }}>تحميل</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ MESSAGES */}
          {activeSection === 'messages' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> المراسلات</h2>
                <button style={{ background: C, border: 'none', borderRadius: 9, padding: '8px 18px', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>+ رسالة جديدة</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
                {/* Inbox */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3"/></svg> البريد الوارد</span>
                    <span style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444433', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6 }}>3 جديد</span>
                  </div>
                  {[
                    { from: 'ولي أمر أحمد العمري', msg: 'استفسار عن درجة الاختبار الأخير...', time: 'منذ ساعة', read: false },
                    { from: 'إدارة المدرسة', msg: 'تذكير: اجتماع أولياء الأمور الجمعة القادم', time: 'منذ 3 ساعات', read: false },
                    { from: 'ولي أمر فاطمة', msg: 'شكراً على متابعة ابنتي في الرياضيات', time: 'أمس', read: true },
                    { from: 'ولي أمر عمر', msg: 'هل يمكن ترتيب لقاء هذا الأسبوع؟', time: 'أمس', read: false },
                    { from: 'ولي أمر نورة', msg: 'تم استلام نتيجة اختبار الفصل', time: 'منذ يومين', read: true },
                  ].map((msg, i) => (
                    <div key={i} style={{ padding: '12px 16px', borderBottom: `1px solid ${BD}`, cursor: 'pointer', background: !msg.read ? `${C}06` : 'transparent', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: !msg.read ? `${C}18` : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: !msg.read ? 700 : 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.from}</span>
                          <span style={{ fontSize: 9, color: MUT, flexShrink: 0, marginRight: 4 }}>{msg.time}</span>
                        </div>
                        <div style={{ fontSize: 11, color: DIM, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.msg}</div>
                      </div>
                      {!msg.read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: C, flexShrink: 0, marginTop: 4 }} />}
                    </div>
                  ))}
                </div>

                {/* Compose */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 16px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"/></svg> إرسال رسالة لولي الأمر</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 11, color: DIM, fontWeight: 600, display: 'block', marginBottom: 6 }}>المستلم</label>
                      <select style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none' }}>
                        <option>اختر الطالب...</option>
                        {displayStudents.map((s: any, i: number) => (
                          <option key={i}>ولي أمر {s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: DIM, fontWeight: 600, display: 'block', marginBottom: 6 }}>موضوع الرسالة</label>
                      <input placeholder="أدخل موضوع الرسالة..." style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: DIM, fontWeight: 600, display: 'block', marginBottom: 6 }}>نص الرسالة</label>
                      <textarea rows={5} placeholder="اكتب رسالتك هنا..." style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 9, padding: '9px 12px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 16px', color: DIM, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>مسودة</button>
                      <button style={{ background: C, border: 'none', borderRadius: 8, padding: '8px 20px', color: '#06060E', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: FONT }}>إرسال <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12"/></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ SETTINGS */}
          {activeSection === 'settings' && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 20px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> الإعدادات</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>

                {/* Profile Settings */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 16px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> الملف الشخصي</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { label: 'الاسم الكامل', value: teacherName },
                      { label: 'المادة الدراسية', value: 'الرياضيات' },
                      { label: 'البريد الإلكتروني', value: user?.email || '' },
                    ].map((field, i) => (
                      <div key={i}>
                        <label style={{ fontSize: 11, color: DIM, fontWeight: 600, display: 'block', marginBottom: 5 }}>{field.label}</label>
                        <input defaultValue={field.value} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BD}`, borderRadius: 8, padding: '8px 12px', color: TXT, fontSize: 12, fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                    <button style={{ background: C, border: 'none', borderRadius: 8, padding: '9px 0', color: '#06060E', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: FONT, marginTop: 4 }}>حفظ التغييرات</button>
                  </div>
                </div>

                {/* Notification Settings */}
                <div style={{ background: CD, border: `1px solid ${BD}`, borderRadius: 14, padding: '18px 20px' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 16px 0' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0"/></svg> إعدادات الإشعارات</h3>
                  {[
                    { label: 'إشعارات رسائل أولياء الأمور', enabled: true },
                    { label: 'تذكيرات الاختبارات', enabled: true },
                    { label: 'تقارير الحضور اليومية', enabled: false },
                    { label: 'إشعارات البث المباشر', enabled: true },
                    { label: 'ملخص الأداء الأسبوعي', enabled: false },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? `1px solid ${BD}` : 'none' }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{item.label}</span>
                      <div style={{
                        width: 38, height: 20, borderRadius: 10,
                        background: item.enabled ? C : 'rgba(255,255,255,0.1)',
                        position: 'relative', cursor: 'pointer',
                      }}>
                        <div style={{ position: 'absolute', top: 2, right: item.enabled ? 2 : 18, width: 16, height: 16, borderRadius: '50%', background: '#fff' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
