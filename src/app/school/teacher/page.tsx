'use client';
import { useEffect, useState } from 'react';

const G = '#4ADE80';
const BLUE = '#60A5FA';
const ORANGE = '#FB923C';
const PURPLE = '#A78BFA';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'overview' | 'attendance' | 'grades' | 'homework';
type AttStatus = 'present' | 'absent' | 'late';

interface ClassItem { id: number; name: string; subject: string; grade: string; students_count: number; }
interface Student { id: number; name: string; student_id: string; }
interface HomeworkItem { id: number; title: string; subject: string; class_name: string; due_date: string; status: string; }
interface GradeItem { id: number; student_name: string; grade: number; letter: string; }

const attLabel: Record<AttStatus, { label: string; color: string }> = {
  present: { label: 'حاضر', color: G },
  absent: { label: 'غائب', color: '#EF4444' },
  late: { label: 'متأخر', color: ORANGE },
};

function gradeColor(g: number) {
  if (g >= 90) return G;
  if (g >= 75) return BLUE;
  if (g >= 60) return ORANGE;
  return '#EF4444';
}
function getLetter(g: number) {
  if (g >= 95) return 'ممتاز+';
  if (g >= 85) return 'ممتاز';
  if (g >= 75) return 'جيد جداً';
  if (g >= 65) return 'جيد';
  if (g >= 50) return 'مقبول';
  return 'ضعيف';
}

export default function TeacherPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ students: 0, attendance: 0, homework: 0, avg_grade: 0 });
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttStatus>>({});
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [gradeEdits, setGradeEdits] = useState<Record<number, string>>({});
  const [homework, setHomework] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [showAddHW, setShowAddHW] = useState(false);
  const [hwForm, setHwForm] = useState({ title: '', description: '', subject: '', class_name: '', due_date: '' });
  const [savingHW, setSavingHW] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => { loadInitial(); }, []);

  useEffect(() => {
    if (tab === 'attendance' && selectedClass) loadAttendanceData();
    if (tab === 'grades' && selectedClass) loadGradesData();
  }, [tab, selectedClass, attendanceDate]);

  const loadInitial = async () => {
    setLoading(true);
    const [meRes, statsRes, classesRes, hwRes] = await Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/school/teacher?type=stats'),
      fetch('/api/school/teacher?type=classes'),
      fetch('/api/school/teacher?type=homework'),
    ]);
    if (meRes.ok) { const d = await meRes.json(); setUser(d.user); }
    if (statsRes.ok) { const d = await statsRes.json(); setStats(d.stats || {}); }
    if (classesRes.ok) {
      const d = await classesRes.json();
      const cls = d.classes || [];
      setClasses(cls);
      if (cls[0]) setSelectedClass(cls[0].id);
    }
    if (hwRes.ok) { const d = await hwRes.json(); setHomework(d.homework || []); }
    setLoading(false);
  };

  const loadAttendanceData = async () => {
    setLoadingStudents(true);
    const [studRes, attRes] = await Promise.all([
      fetch(`/api/school/teacher?type=students&class_id=${selectedClass}`),
      fetch(`/api/school/teacher?type=attendance&class_id=${selectedClass}&date=${attendanceDate}`),
    ]);
    if (studRes.ok) { const d = await studRes.json(); setStudents(d.students || []); }
    if (attRes.ok) { const d = await attRes.json(); setAttendance(d.attendance || {}); }
    setLoadingStudents(false);
  };

  const loadGradesData = async () => {
    const res = await fetch(`/api/school/teacher?type=grades&class_id=${selectedClass}`);
    if (res.ok) { const d = await res.json(); setGrades(d.grades || []); }
  };

  const toggleAttendance = (studentId: number) => {
    setAttendance(prev => {
      const current = prev[studentId] || 'present';
      const next: AttStatus = current === 'present' ? 'absent' : current === 'absent' ? 'late' : 'present';
      return { ...prev, [studentId]: next };
    });
  };

  const saveAttendance = async () => {
    if (!selectedClass || students.length === 0) return;
    setSaving(true);
    const records = students.map(s => ({ student_id: s.id, status: attendance[s.id] || 'present' }));
    const res = await fetch('/api/school/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'attendance', class_id: selectedClass, date: attendanceDate, records }),
    });
    setSaveMsg(res.ok ? 'تم حفظ الحضور بنجاح' : 'خطأ في الحفظ');
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3500);
  };

  const addHomework = async () => {
    if (!hwForm.title || !hwForm.class_name) return;
    setSavingHW(true);
    const res = await fetch('/api/school/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'homework', ...hwForm }),
    });
    if (res.ok) {
      setShowAddHW(false);
      setHwForm({ title: '', description: '', subject: '', class_name: '', due_date: '' });
      const hwRes = await fetch('/api/school/teacher?type=homework');
      if (hwRes.ok) { const d = await hwRes.json(); setHomework(d.homework || []); }
    }
    setSavingHW(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: G }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⏳</div>
        <div style={{ fontWeight: 700 }}>جارٍ التحميل…</div>
      </div>
    </div>
  );

  const STATS = [
    { label: 'إجمالي طلابي', value: stats.students || 0, sub: `${classes.length} فصول`, color: G },
    { label: 'متوسط الحضور', value: `${stats.attendance || 0}%`, sub: 'هذا الشهر', color: BLUE },
    { label: 'واجبات معلقة', value: stats.homework || 0, sub: 'تحتاج مراجعة', color: ORANGE },
    { label: 'متوسط الدرجات', value: `${stats.avg_grade || 0}%`, sub: 'جميع الفصول', color: PURPLE },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: G }}>
          مرحباً، {user?.name || 'المعلم'} <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
        </h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          لديك {classes.length} فصل دراسي — {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {STATS.map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{label}</div>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{value}</div>
            <div style={{ color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview' as Tab, label: 'نظرة عامة' },
          { id: 'attendance' as Tab, label: 'الحضور' },
          { id: 'grades' as Tab, label: 'الدرجات' },
          { id: 'homework' as Tab, label: 'الواجبات' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: tab === t.id ? `${G}20` : 'transparent',
            border: `1px solid ${tab === t.id ? G + '50' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 9, padding: '0.55rem 1.25rem', cursor: 'pointer',
            color: tab === t.id ? G : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div>
          <h2 style={{ color: G, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>فصولي الدراسية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem', marginBottom: '2rem' }}>
            {classes.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.35)', padding: '2rem', background: CARD, borderRadius: 12, textAlign: 'center', border: `1px solid ${BORDER}` }}>
                لا توجد فصول دراسية مسجلة بعد
              </div>
            ) : classes.map(cls => (
              <div key={cls.id} style={{ background: CARD, border: `1px solid ${G}20`, borderRadius: 14, padding: '1.1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{cls.name}</div>
                  <span style={{ background: `${G}18`, border: `1px solid ${G}30`, borderRadius: 20, padding: '0.15rem 0.65rem', color: G, fontSize: '0.75rem', fontWeight: 700 }}>
                    {cls.grade}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginBottom: '0.85rem' }}>
                  {cls.subject} · {cls.students_count || 0} طالب
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setSelectedClass(cls.id); setTab('attendance'); }} style={{ flex: 1, background: `${G}12`, border: `1px solid ${G}30`, borderRadius: 8, padding: '0.4rem', color: G, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                    الحضور
                  </button>
                  <button onClick={() => { setSelectedClass(cls.id); setTab('grades'); }} style={{ flex: 1, background: `${BLUE}12`, border: `1px solid ${BLUE}30`, borderRadius: 8, padding: '0.4rem', color: BLUE, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                    الدرجات
                  </button>
                  <button onClick={() => { setSelectedClass(cls.id); setTab('homework'); }} style={{ flex: 1, background: `${ORANGE}12`, border: `1px solid ${ORANGE}30`, borderRadius: 8, padding: '0.4rem', color: ORANGE, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                    واجبات
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Homework */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: ORANGE, fontSize: '1rem', fontWeight: 700 }}>آخر الواجبات</h2>
            <button onClick={() => setTab('homework')} style={{ background: 'transparent', border: 'none', color: ORANGE, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
              عرض الكل ←
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {homework.slice(0, 5).map((hw, i) => (
              <div key={hw.id} style={{
                padding: '0.9rem 1.25rem',
                borderBottom: i < Math.min(homework.length, 5) - 1 ? `1px solid ${BORDER}` : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{hw.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: 2 }}>
                    {hw.subject} · {hw.class_name} · تسليم: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('ar-SA') : '—'}
                  </div>
                </div>
                <span style={{
                  background: `${hw.status === 'active' ? G : ORANGE}18`,
                  border: `1px solid ${hw.status === 'active' ? G : ORANGE}40`,
                  borderRadius: 20, padding: '0.2rem 0.75rem',
                  color: hw.status === 'active' ? G : ORANGE, fontSize: '0.78rem', fontWeight: 700,
                }}>
                  {hw.status === 'active' ? 'نشط' : 'منتهي'}
                </span>
              </div>
            ))}
            {homework.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>
                لا واجبات حتى الآن
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        <div>
          {/* Controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(Number(e.target.value))}
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '0.6rem 1rem', color: '#F8FAFC', fontSize: '0.9rem', cursor: 'pointer', minWidth: 200 }}
            >
              <option value="">— اختر الفصل —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.subject}</option>)}
            </select>
            <input
              type="date" value={attendanceDate}
              onChange={e => setAttendanceDate(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '0.6rem 1rem', color: '#F8FAFC', fontSize: '0.9rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
              {Object.values(attLabel).map(({ label, color }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                </span>
              ))}
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>— انقر للتبديل</span>
            </div>
          </div>

          {loadingStudents && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.4)' }}>جارٍ التحميل…</div>
          )}

          {!loadingStudents && students.length > 0 && (
            <>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
                {/* Summary bar */}
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: '1.5rem', fontSize: '0.82rem' }}>
                  <span style={{ color: G }}>{Object.values(attendance).filter(s => s === 'present').length} حاضر</span>
                  <span style={{ color: '#EF4444' }}>{Object.values(attendance).filter(s => s === 'absent').length} غائب</span>
                  <span style={{ color: ORANGE }}>{Object.values(attendance).filter(s => s === 'late').length} متأخر</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{students.length} إجمالي</span>
                </div>
                {students.map((s, i) => {
                  const st = attendance[s.id] || 'present';
                  const { label, color } = attLabel[st];
                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      borderBottom: i < students.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${G}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: G, fontSize: '0.9rem' }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.76rem' }}>{s.student_id}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAttendance(s.id)}
                        style={{
                          background: `${color}18`, border: `1px solid ${color}50`,
                          borderRadius: 20, padding: '0.38rem 1.1rem',
                          color, fontSize: '0.83rem', fontWeight: 700, cursor: 'pointer',
                          transition: 'all 0.15s', minWidth: 80, textAlign: 'center',
                        }}
                      >
                        {label}
                      </button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={saveAttendance} disabled={saving}
                  style={{ background: G, border: 'none', borderRadius: 10, padding: '0.7rem 2.5rem', color: '#000', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s' }}
                >
                  {saving ? 'جارٍ الحفظ…' : 'حفظ الحضور'}
                </button>
                {saveMsg && (
                  <span style={{ color: saveMsg.includes('تم') ? G : '#EF4444', fontWeight: 700 }}>{saveMsg}</span>
                )}
              </div>
            </>
          )}

          {!loadingStudents && students.length === 0 && selectedClass && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem', background: CARD, borderRadius: 12, border: `1px solid ${BORDER}` }}>
              لا طلاب مسجلون في هذا الفصل
            </div>
          )}
        </div>
      )}

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <div>
          <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(Number(e.target.value))}
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '0.6rem 1rem', color: '#F8FAFC', fontSize: '0.9rem', cursor: 'pointer', minWidth: 220 }}
            >
              <option value="">— اختر الفصل —</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name} — {c.subject}</option>)}
            </select>
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الطالب', 'الدرجة / 100', 'التقدير'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => {
                  const val = gradeEdits[g.id] !== undefined ? gradeEdits[g.id] : String(g.grade);
                  const numVal = Number(val);
                  const color = gradeColor(numVal);
                  return (
                    <tr key={g.id} style={{ borderBottom: i < grades.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontSize: '0.9rem' }}>{g.student_name}</td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <input
                          type="number" min="0" max="100" value={val}
                          onChange={e => setGradeEdits(p => ({ ...p, [g.id]: e.target.value }))}
                          style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 7, padding: '0.38rem 0.7rem', color: '#F8FAFC', width: 75, textAlign: 'center', fontSize: '0.9rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <span style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 20, padding: '0.22rem 0.8rem', color, fontSize: '0.8rem', fontWeight: 700 }}>
                          {g.letter || getLetter(numVal)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {grades.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>
                      {selectedClass ? 'لا درجات مسجلة لهذا الفصل' : 'اختر فصلاً لعرض الدرجات'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── HOMEWORK ── */}
      {tab === 'homework' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: ORANGE, fontSize: '1rem', fontWeight: 700 }}>الواجبات المنزلية</h2>
            <button
              onClick={() => setShowAddHW(true)}
              style={{ background: ORANGE, border: 'none', borderRadius: 9, padding: '0.55rem 1.35rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}
            >
              + إضافة واجب
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            {homework.map((hw, i) => (
              <div key={hw.id} style={{
                padding: '1rem 1.25rem',
                borderBottom: i < homework.length - 1 ? `1px solid ${BORDER}` : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 3 }}>{hw.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    {hw.subject} · {hw.class_name} · تسليم: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('ar-SA') : '—'}
                  </div>
                </div>
                <span style={{
                  background: `${hw.status === 'active' ? G : ORANGE}18`,
                  border: `1px solid ${hw.status === 'active' ? G : ORANGE}40`,
                  borderRadius: 20, padding: '0.25rem 0.85rem',
                  color: hw.status === 'active' ? G : ORANGE, fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                }}>
                  {hw.status === 'active' ? 'نشط' : 'منتهي'}
                </span>
              </div>
            ))}
            {homework.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>
                لا واجبات حتى الآن — أضف واجباً جديداً
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD HOMEWORK MODAL ── */}
      {showAddHW && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${ORANGE}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 500, direction: 'rtl', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: ORANGE, fontSize: '1.1rem', fontWeight: 800 }}>إضافة واجب منزلي جديد</h3>

            {[
              { label: 'عنوان الواجب *', key: 'title', type: 'text', placeholder: 'مثال: حل أسئلة الفصل الثالث' },
              { label: 'المادة الدراسية', key: 'subject', type: 'text', placeholder: 'مثال: رياضيات' },
              { label: 'الفصل الدراسي *', key: 'class_name', type: 'text', placeholder: 'مثال: 3/أ' },
              { label: 'تاريخ التسليم', key: 'due_date', type: 'date', placeholder: '' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>{label}</label>
                <input
                  type={type} value={hwForm[key as keyof typeof hwForm]} placeholder={placeholder}
                  onChange={e => setHwForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none' }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>الوصف / التفاصيل</label>
              <textarea
                value={hwForm.description}
                onChange={e => setHwForm(p => ({ ...p, description: e.target.value }))}
                rows={3} placeholder="وصف الواجب وتعليمات التسليم…"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAddHW(false)} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>
                إلغاء
              </button>
              <button
                onClick={addHomework} disabled={savingHW || !hwForm.title || !hwForm.class_name}
                style={{ background: ORANGE, border: 'none', borderRadius: 9, padding: '0.65rem 2rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingHW || !hwForm.title || !hwForm.class_name) ? 0.6 : 1 }}
              >
                {savingHW ? 'جارٍ الإضافة…' : 'إضافة الواجب <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
