'use client';
import { useState } from 'react';

const C = {
  bg: '#06060E',
  sidebar: '#07101A',
  primary: '#22D3EE',
  accent2: '#06B6D4',
  gold: '#D4A843',
  text: '#EEEEF5',
  dim: 'rgba(238,238,245,0.55)',
  muted: 'rgba(238,238,245,0.28)',
  green: '#10B981',
  red: '#EF4444',
  blue: '#60A5FA',
  purple: '#A78BFA',
  orange: '#FB923C',
  border: 'rgba(34,211,238,0.12)',
  card: 'rgba(7,16,26,0.85)',
};

const font = "'IBM Plex Sans Arabic', sans-serif";

type Section =
  | 'home' | 'schedule' | 'profile' | 'leave'
  | 'my-courses' | 'content' | 'assignments'
  | 'online-lecture' | 'in-person-lecture' | 'recorded' | 'halls'
  | 'attendance' | 'excuses' | 'attendance-stats'
  | 'online-exam' | 'in-person-exam' | 'question-bank' | 'exam-schedule'
  | 'enrolled' | 'grades' | 'performance'
  | 'messages' | 'alerts' | 'notes'
  | 'papers' | 'supervision' | 'advising';

interface NavItem { id: Section; label: string; badge?: number; gold?: boolean }
interface NavGroup { title: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    title: 'الرئيسية',
    items: [
      { id: 'home', label: 'لوحتي' },
      { id: 'schedule', label: 'الجدول الأسبوعي' },
      { id: 'profile', label: 'ملفي الأكاديمي' },
      { id: 'leave', label: 'رفع طلب إجازة', gold: true },
    ],
  },
  {
    title: 'المقررات الدراسية',
    items: [
      { id: 'my-courses', label: 'مقرراتي هذا الفصل' },
      { id: 'content', label: 'المحتوى التعليمي' },
      { id: 'assignments', label: 'التكاليف', badge: 2 },
    ],
  },
  {
    title: 'المحاضرات',
    items: [
      { id: 'online-lecture', label: 'محاضرة أونلاين مباشرة' },
      { id: 'in-person-lecture', label: 'محاضرة حضورية' },
      { id: 'recorded', label: 'المحاضرات المسجّلة' },
      { id: 'halls', label: 'القاعات والمدرجات' },
    ],
  },
  {
    title: 'الحضور والغياب',
    items: [
      { id: 'attendance', label: 'رصد الحضور' },
      { id: 'excuses', label: 'الأعذار الطبية — صحتي', badge: 3 },
      { id: 'attendance-stats', label: 'إحصائيات الحضور' },
    ],
  },
  {
    title: 'الاختبارات والتقييم',
    items: [
      { id: 'online-exam', label: 'اختبار أونلاين' },
      { id: 'in-person-exam', label: 'امتحان حضوري' },
      { id: 'question-bank', label: 'بنك الأسئلة' },
      { id: 'exam-schedule', label: 'جدول الامتحانات' },
    ],
  },
  {
    title: 'الطلاب والأداء',
    items: [
      { id: 'enrolled', label: 'الطلاب المسجّلون' },
      { id: 'grades', label: 'رصد الدرجات' },
      { id: 'performance', label: 'تقرير الأداء' },
    ],
  },
  {
    title: 'التواصل',
    items: [
      { id: 'messages', label: 'المراسلات', badge: 5 },
      { id: 'alerts', label: 'تنبيهات جماعية' },
      { id: 'notes', label: 'ملاحظات للطلاب', badge: 3 },
    ],
  },
  {
    title: 'البحث العلمي',
    items: [
      { id: 'papers', label: 'الأوراق البحثية' },
      { id: 'supervision', label: 'الإشراف على رسائل الماجستير' },
      { id: 'advising', label: 'ساعات الإرشاد' },
    ],
  },
];

const lectures = [
  {
    time: '8:00–9:30',
    course: 'هندسة البرمجيات CS301',
    section: 'شعبة أ',
    location: 'مدرج A1',
    mode: 'حضوري',
    status: 'منتهية',
    statusColor: C.muted,
    borderColor: 'rgba(238,238,245,0.1)',
    dimmed: true,
  },
  {
    time: '10:00–11:30',
    course: 'قواعد البيانات CS402',
    section: 'شعبة ب',
    location: 'مدرج B2',
    mode: 'أونلاين',
    status: 'الآن',
    statusColor: C.primary,
    borderColor: C.primary,
    pulse: true,
    hybrid: true,
  },
  {
    time: '12:00–1:00',
    course: 'استراحة',
    section: '',
    location: 'مكتب 4-208',
    mode: 'إرشاد',
    status: 'فراغ',
    statusColor: C.dim,
    borderColor: 'rgba(238,238,245,0.08)',
    break: true,
  },
  {
    time: '1:30–3:00',
    course: 'الذكاء الاصطناعي CS501',
    section: 'ماجستير',
    location: 'قاعة 302',
    mode: 'تسجيل',
    status: 'التالية',
    statusColor: C.gold,
    borderColor: C.gold,
  },
];

const attendanceStudents = [
  { name: 'أحمد الزهراني', id: '201234', present: true },
  { name: 'سارة العنزي', id: '201456', present: true },
  { name: 'خالد الدوسري', id: '201789', present: false },
  { name: 'نورة القحطاني', id: '201102', present: true },
  { name: 'عمر الشمري', id: '201345', present: false },
];

const medicalExcuses = [
  { name: 'خالد الدوسري', date: '7 أبريل', reason: 'مراجعة طبية — صحتي', auto: true },
  { name: 'ليلى المطيري', date: '6 أبريل', reason: 'إجراء عملية', auto: true },
  { name: 'فيصل الغامدي', date: '5 أبريل', reason: 'حادث طارئ', auto: true },
];

const upcomingExams = [
  { course: 'قواعد البيانات CS402', type: 'اختبار أونلاين', date: '12 أبريل', duration: '60 دقيقة', questions: 40 },
  { course: 'هندسة البرمجيات CS301', type: 'امتحان منتصف الفصل', date: '18 أبريل', duration: '90 دقيقة', questions: 0 },
];

const gradeStudents = [
  { name: 'سارة العنزي', grade: 'A+', score: 98, color: C.green },
  { name: 'أحمد الزهراني', grade: 'A', score: 91, color: C.green },
  { name: 'نورة القحطاني', grade: 'B+', score: 84, color: C.blue },
  { name: 'عمر الشمري', grade: 'C', score: 71, color: C.orange },
  { name: 'خالد الدوسري', grade: 'F', score: 42, color: C.red },
];

const studentMessages = [
  { name: 'أحمد الزهراني', time: 'منذ 5 دق', msg: 'دكتور، هل يمكن مراجعة درجة التكليف الأول؟', unread: true },
  { name: 'سارة العنزي', time: 'منذ 20 دق', msg: 'شكراً على الشرح، هل التسجيل متاح للمشاهدة؟', unread: true },
  { name: 'محمد القرني', time: 'منذ 1 س', msg: 'كيف نحسب الـ GPA عند الرسوب في مقرر؟', unread: true },
  { name: 'لمى الشهري', time: 'منذ 2 س', msg: 'هل الاختبار الأسبوعي مؤجل لهذا الأسبوع؟', unread: true },
];

const quickActions = [
  { label: 'محاضرة أونلاين', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, color: C.primary },
  { label: 'محاضرة حضورية', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, color: C.blue },
  { label: 'تسجيل محاضرة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M10 10h4v4h-4z"/></svg>, color: C.purple },
  { label: 'اختبار أونلاين', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, color: C.green },
  { label: 'امتحان حضوري', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>, color: C.orange },
  { label: 'بنك الأسئلة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg>, color: C.accent2 },
  { label: 'تكليف جديد', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8h.01 M12 12v4"/></svg>, color: C.blue },
  { label: 'رصد الدرجات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, color: C.green },
  { label: 'رفع محتوى', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12"/></svg>, color: C.purple },
  { label: 'رصد الحضور', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, color: C.primary },
  { label: 'تقرير الأداء', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, color: C.orange },
  { label: 'رفع إجازة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg>, color: C.gold },
];

export default function FacultyDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(
    Object.fromEntries(attendanceStudents.map(s => [s.id, s.present]))
  );

  const togglePresent = (id: string) =>
    setPresentMap(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: font, direction: 'rtl', color: C.text }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 270, minHeight: '100vh', background: C.sidebar,
        borderLeft: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        scrollbarWidth: 'none',
      }}>
        {/* Profile Card */}
        <div style={{
          margin: '20px 14px 8px', padding: '16px', borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(34,211,238,0.13) 0%, rgba(6,182,212,0.07) 100%)',
          border: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `linear-gradient(135deg, ${C.primary}, ${C.accent2})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: C.bg, marginBottom: 10,
          }}>م</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>د. محمد العتيبي</div>
          <div style={{ fontSize: 12, color: C.dim, marginTop: 3 }}>أستاذ مساعد</div>
          <div style={{
            marginTop: 8, fontSize: 11, color: C.primary,
            background: 'rgba(34,211,238,0.1)', borderRadius: 6,
            padding: '3px 8px', display: 'inline-block',
          }}>كلية هندسة الحاسب</div>
        </div>

        {/* Nav Groups */}
        <nav style={{ flex: 1, padding: '0 10px 20px' }}>
          {navGroups.map(group => (
            <div key={group.title} style={{ marginBottom: 6 }}>
              <div style={{
                fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: 1,
                padding: '10px 6px 4px', textTransform: 'uppercase',
              }}>{group.title}</div>
              {group.items.map(item => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '9px 12px', borderRadius: 9, border: 'none',
                      background: active
                        ? item.gold ? 'rgba(212,168,67,0.15)' : 'rgba(34,211,238,0.12)'
                        : 'transparent',
                      color: active ? (item.gold ? C.gold : C.primary) : (item.gold ? C.gold : C.dim),
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      cursor: 'pointer', textAlign: 'right', transition: 'all 0.15s',
                      marginBottom: 1, fontFamily: font,
                    }}
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span style={{
                        background: item.gold ? C.gold : C.primary,
                        color: C.bg, borderRadius: 10, fontSize: 10,
                        fontWeight: 700, padding: '1px 7px', minWidth: 18, textAlign: 'center',
                      }}>{item.badge}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '12px 16px', borderTop: `1px solid ${C.border}`,
          fontSize: 11, color: C.muted, textAlign: 'center',
        }}>
          متين v6 — كلية الهندسة والتقنية
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 40px' }}>
        {activeSection === 'home' && (
          <div>

            {/* Greeting Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, rgba(34,211,238,0.1) 0%, rgba(6,182,212,0.05) 100%)',
              border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 24px',
              marginBottom: 24,
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>مرحباً د. محمد <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
                <div style={{ fontSize: 13, color: C.dim, marginTop: 4 }}>الثلاثاء، 8 أبريل 2026 — الفصل الثاني</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={btnStyle(C.primary)}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg> محاضرة الآن</button>
                <button style={btnStyle(C.gold)}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/></svg> رفع إجازة</button>
              </div>
            </div>

            {/* Today's Lectures Timeline */}
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>محاضرات اليوم</SectionTitle>
              <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                {lectures.map((lec, i) => (
                  <div key={i} style={{
                    minWidth: 210, background: C.card,
                    border: `1.5px solid ${lec.borderColor}`,
                    borderRadius: 14, padding: '16px', flexShrink: 0,
                    opacity: lec.dimmed ? 0.55 : 1,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {lec.pulse && (
                      <span style={{
                        position: 'absolute', top: 12, left: 12,
                        width: 9, height: 9, borderRadius: '50%',
                        background: C.primary,
                        boxShadow: `0 0 0 3px rgba(34,211,238,0.3)`,
                        animation: 'pulse 1.5s infinite',
                        display: 'inline-block',
                      }} />
                    )}
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>{lec.time}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{lec.course}</div>
                    {lec.section && <div style={{ fontSize: 12, color: C.dim }}>{lec.section}</div>}
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 6 }}>
                      {lec.location} · {lec.mode}
                    </div>
                    {lec.hybrid && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                        <Tag color={C.primary}>هجين</Tag>
                        <Tag color={C.purple}>كاميرا AI</Tag>
                      </div>
                    )}
                    <div style={{
                      marginTop: 10, fontSize: 12, fontWeight: 600,
                      color: lec.statusColor,
                      background: `${lec.statusColor}18`,
                      borderRadius: 6, padding: '3px 9px', display: 'inline-block',
                    }}>{lec.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
              <StatCard value="248" label="إجمالي الطلاب" sub="3 مقررات · 5 شعب" color={C.primary} />
              <StatCard value="87%" label="نسبة الحضور" color={C.green} />
              <StatCard value="2" label="تكاليف للتصحيح" sub="بانتظار رصد الدرجات" color={C.orange} />
              <StatCard value="2.8" label="متوسط GPA" color={C.purple} />
            </div>

            {/* Grid 2: Attendance + Medical Excuses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

              {/* Attendance Roster */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>رصد الحضور</div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 2 }}>CS402 قواعد البيانات — 52 طالب</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.primary, background: 'rgba(34,211,238,0.1)', borderRadius: 6, padding: '3px 8px' }}>
                    AI مراقبة
                  </span>
                </div>
                <div style={{
                  fontSize: 11, color: C.dim, background: 'rgba(34,211,238,0.06)',
                  borderRadius: 8, padding: '8px 12px', marginBottom: 12, border: `1px solid ${C.border}`,
                }}>
                  نظام الكاميرا الذكية يرصد الحضور تلقائياً — يمكنك التعديل اليدوي
                </div>
                {attendanceStudents.map(s => (
                  <div key={s.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: `1px solid ${C.border}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{s.id}</div>
                    </div>
                    <button
                      onClick={() => togglePresent(s.id)}
                      style={{
                        padding: '4px 14px', borderRadius: 8, border: 'none',
                        background: presentMap[s.id] ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: presentMap[s.id] ? C.green : C.red,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: font,
                      }}
                    >
                      {presentMap[s.id] ? 'حضر' : 'غاب'}
                    </button>
                  </div>
                ))}
              </Card>

              {/* Medical Excuses */}
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>الأعذار الطبية — صحتي</div>
                <div style={{ fontSize: 12, color: C.dim, marginBottom: 14 }}>3 أعذار معلّقة — معتمدة تلقائياً</div>
                {medicalExcuses.map((ex, i) => (
                  <div key={i} style={{
                    padding: '12px', borderRadius: 10, marginBottom: 10,
                    background: 'rgba(16,185,129,0.06)', border: `1px solid rgba(16,185,129,0.15)`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{ex.name}</div>
                      <span style={{
                        fontSize: 10, background: 'rgba(16,185,129,0.15)',
                        color: C.green, borderRadius: 5, padding: '2px 7px',
                      }}>معتمد تلقائياً</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{ex.reason}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{ex.date}</div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Grid 3: Exams + Grades + Messages */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

              {/* Upcoming Exams */}
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>الاختبارات القادمة</div>
                {upcomingExams.map((ex, i) => (
                  <div key={i} style={{
                    padding: '12px', borderRadius: 10, marginBottom: 10,
                    background: 'rgba(34,211,238,0.05)', border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{ex.course}</div>
                    <div style={{ fontSize: 12, color: C.primary, marginBottom: 6 }}>{ex.type}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Tag color={C.gold}>{ex.date}</Tag>
                      <Tag color={C.dim}>{ex.duration}</Tag>
                      {ex.questions > 0 && <Tag color={C.purple}>{ex.questions} سؤال</Tag>}
                    </div>
                  </div>
                ))}
              </Card>

              {/* Grade Tracking */}
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>رصد الدرجات</div>
                <div style={{ fontSize: 12, color: C.dim, marginBottom: 12 }}>CS402 قواعد البيانات</div>
                {gradeStudents.map((st, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 0', borderBottom: i < gradeStudents.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}>
                    <div style={{ fontSize: 13 }}>{st.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, color: C.muted }}>{st.score}</span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: st.color,
                        background: `${st.color}18`, borderRadius: 6, padding: '2px 8px',
                      }}>{st.grade}</span>
                    </div>
                  </div>
                ))}
              </Card>

              {/* Student Messages */}
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>رسائل الطلاب</div>
                  <span style={{
                    background: C.primary, color: C.bg, borderRadius: 10,
                    fontSize: 11, fontWeight: 700, padding: '2px 8px',
                  }}>5 جديدة</span>
                </div>
                {studentMessages.map((msg, i) => (
                  <div key={i} style={{
                    padding: '10px 0', borderBottom: i < studentMessages.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{msg.name}</span>
                      <span style={{ fontSize: 10, color: C.muted }}>{msg.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5 }}>{msg.msg}</div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 8 }}>
              <SectionTitle>إجراءات سريعة</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {quickActions.map((qa, i) => (
                  <button key={i} style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: '14px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    cursor: 'pointer', transition: 'all 0.15s', fontFamily: font,
                    color: C.text,
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = qa.color;
                      (e.currentTarget as HTMLButtonElement).style.background = `${qa.color}10`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                      (e.currentTarget as HTMLButtonElement).style.background = C.card;
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{qa.icon}</span>
                    <span style={{ fontSize: 11, color: qa.color, fontWeight: 600, textAlign: 'center' }}>{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeSection !== 'home' && (
          <PlaceholderSection section={activeSection} />
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,211,238,0.3); }
          50% { box-shadow: 0 0 0 7px rgba(34,211,238,0.05); }
        }
        ::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>
    </div>
  );
}

/* ── Helper Components ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 16, fontWeight: 700, color: C.text,
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ display: 'inline-block', width: 3, height: 18, background: C.primary, borderRadius: 2 }} />
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: '18px',
    }}>
      {children}
    </div>
  );
}

function StatCard({ value, label, sub, color }: { value: string; label: string; sub?: string; color: string }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: '18px 20px',
    }}>
      <div style={{ fontSize: 30, fontWeight: 800, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color,
      background: `${color}18`, borderRadius: 5,
      padding: '2px 7px', display: 'inline-block',
    }}>{children}</span>
  );
}

function btnStyle(color: string): React.CSSProperties {
  return {
    background: `${color}18`, border: `1px solid ${color}40`,
    color, borderRadius: 10, padding: '9px 18px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: font,
  };
}

function PlaceholderSection({ section }: { section: Section }) {
  const labels: Record<Section, string> = {
    home: 'لوحتي',
    schedule: 'الجدول الأسبوعي',
    profile: 'ملفي الأكاديمي',
    leave: 'رفع طلب إجازة',
    'my-courses': 'مقرراتي هذا الفصل',
    content: 'المحتوى التعليمي',
    assignments: 'التكاليف',
    'online-lecture': 'محاضرة أونلاين مباشرة',
    'in-person-lecture': 'محاضرة حضورية',
    recorded: 'المحاضرات المسجّلة',
    halls: 'القاعات والمدرجات',
    attendance: 'رصد الحضور',
    excuses: 'الأعذار الطبية — صحتي',
    'attendance-stats': 'إحصائيات الحضور',
    'online-exam': 'اختبار أونلاين',
    'in-person-exam': 'امتحان حضوري',
    'question-bank': 'بنك الأسئلة',
    'exam-schedule': 'جدول الامتحانات',
    enrolled: 'الطلاب المسجّلون',
    grades: 'رصد الدرجات',
    performance: 'تقرير الأداء',
    messages: 'المراسلات',
    alerts: 'تنبيهات جماعية',
    notes: 'ملاحظات للطلاب',
    papers: 'الأوراق البحثية',
    supervision: 'الإشراف على رسائل الماجستير',
    advising: 'ساعات الإرشاد',
  };
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 380, gap: 16,
    }}>
      <div style={{
        width: 70, height: 70, borderRadius: '50%',
        background: 'rgba(34,211,238,0.08)', border: `2px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
      }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/></svg></div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>{labels[section]}</div>
      <div style={{ fontSize: 13, color: C.muted }}>هذا القسم قيد التطوير</div>
    </div>
  );
}
