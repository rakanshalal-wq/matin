'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Stats { students: number; teachers: number; courses: number; revenue: number }
interface Course { id: any; name: string; teacher: string; students_count: number; schedule?: string; price?: number; status?: string }
interface Student { id: any; name: string; email: string; course?: string; enrolled_at?: string; attendance?: number; paid?: number; status?: string }

// ─── Constants ───────────────────────────────────────────────────────────────
const CYAN   = '#06B6D4';
const BG     = '#06060E';
const CARD   = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(6,182,212,0.18)';

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }: { label: string; value: any; color: string; icon: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${color}33`, borderRadius: 14, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '1.6rem' }}>{icon}</span>
        <span style={{ background: `${color}22`, color, borderRadius: 8, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 600 }}>إجمالي</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value ?? 0}</div>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>{label}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: CYAN, animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
      <div style={{ fontSize: '0.9rem' }}>{label}</div>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0D1117', border: `1px solid ${BORDER}`, borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#F8FAFC', fontSize: '1.1rem' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem', lineHeight: 1 }}>&#x2715;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8,
    padding: '0.65rem 0.75rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box', outline: 'none',
  };
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InstituteDashboard() {
  const [tab,      setTab]      = useState<'overview' | 'courses' | 'students' | 'faculty' | 'finance'>('overview');
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState<Stats>({ students: 0, teachers: 0, courses: 0, revenue: 0 });
  const [courses,  setCourses]  = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [user,     setUser]     = useState<any>(null);

  // Modals
  const [showCourse,  setShowCourse]  = useState(false);
  const [showStudent, setShowStudent] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);

  // Course form
  const [cName,     setCName]     = useState('');
  const [cTeacher,  setCTeacher]  = useState('');
  const [cSchedule, setCSchedule] = useState('');
  const [cPrice,    setCPrice]    = useState('');
  const [cDuration, setCDuration] = useState('');
  const [cCapacity, setCCapacity] = useState('');

  // Student form
  const [sName,   setSName]   = useState('');
  const [sEmail,  setSEmail]  = useState('');
  const [sPhone,  setSPhone]  = useState('');
  const [sCourse, setSCourse] = useState('');

  // Teacher form
  const [tName,      setTName]      = useState('');
  const [tEmail,     setTEmail]     = useState('');
  const [tSpecialty, setTSpecialty] = useState('');

  // Saving
  const [savingC, setSavingC] = useState(false);
  const [savingS, setSavingS] = useState(false);
  const [savingT, setSavingT] = useState(false);

  // ── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [userRes, statsRes, coursesRes, studentsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/institute?type=stats'),
          fetch('/api/institute?type=courses'),
          fetch('/api/institute?type=students'),
        ]);
        if (userRes.ok)     { const d = await userRes.json();     setUser(d.user ?? d); }
        if (statsRes.ok)    { const d = await statsRes.json();    if (d.stats)    setStats(d.stats); }
        if (coursesRes.ok)  { const d = await coursesRes.json();  if (d.courses)  setCourses(d.courses); }
        if (studentsRes.ok) { const d = await studentsRes.json(); if (d.students) setStudents(d.students); }
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  async function refreshStats() {
    const r = await fetch('/api/institute?type=stats');
    if (r.ok) { const d = await r.json(); if (d.stats) setStats(d.stats); }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleAddCourse() {
    if (!cName.trim()) return;
    setSavingC(true);
    try {
      await fetch('/api/institute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'course', name: cName, teacher: cTeacher, schedule: cSchedule, price: cPrice, duration: cDuration, capacity: cCapacity }),
      });
      const r = await fetch('/api/institute?type=courses');
      if (r.ok) { const d = await r.json(); if (d.courses) setCourses(d.courses); }
      await refreshStats();
    } catch (_) {}
    setSavingC(false); setShowCourse(false);
    setCName(''); setCTeacher(''); setCSchedule(''); setCPrice(''); setCDuration(''); setCCapacity('');
  }

  async function handleEnrollStudent() {
    if (!sName.trim()) return;
    setSavingS(true);
    try {
      await fetch('/api/institute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'student', name: sName, email: sEmail, phone: sPhone, course: sCourse }),
      });
      const r = await fetch('/api/institute?type=students');
      if (r.ok) { const d = await r.json(); if (d.students) setStudents(d.students); }
      await refreshStats();
    } catch (_) {}
    setSavingS(false); setShowStudent(false);
    setSName(''); setSEmail(''); setSPhone(''); setSCourse('');
  }

  async function handleAddTeacher() {
    if (!tName.trim()) return;
    setSavingT(true);
    try {
      await fetch('/api/institute', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'teacher', name: tName, email: tEmail, specialty: tSpecialty }),
      });
      await refreshStats();
    } catch (_) {}
    setSavingT(false); setShowTeacher(false);
    setTName(''); setTEmail(''); setTSpecialty('');
  }

  // ── Style helpers ─────────────────────────────────────────────────────────
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '0.55rem 1.25rem', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: active ? 700 : 400,
    background: active ? CYAN : 'transparent',
    color: active ? '#06060E' : 'rgba(255,255,255,0.55)',
    transition: 'all 0.2s',
  });

  const btnPrimary: React.CSSProperties = {
    background: CYAN, color: '#06060E', border: 'none', borderRadius: 9,
    padding: '0.6rem 1.4rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
  };

  const btnOutline: React.CSSProperties = {
    background: 'transparent', color: CYAN, border: `1px solid ${CYAN}55`, borderRadius: 9,
    padding: '0.55rem 1.2rem', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
  };

  const th: React.CSSProperties = { padding: '0.75rem 1rem', textAlign: 'right' as any, fontWeight: 600, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' };
  const td: React.CSSProperties = { padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' };

  const quickActions = [
    { label: 'إضافة كورس',  icon: '📚', action: () => setShowCourse(true) },
    { label: 'إضافة طالب',  icon: '👨‍🎓', action: () => setShowStudent(true) },
    { label: 'إضافة مدرس',  icon: '👨‍🏫', action: () => setShowTeacher(true) },
    { label: 'التقارير',     icon: '📊', action: () => setTab('finance') },
    { label: 'المدفوعات',    icon: '💳', action: () => setTab('finance') },
    { label: 'الشهادات',     icon: '🎓', action: () => alert('قريباً — الشهادات') },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Segoe UI',sans-serif", color: '#F8FAFC', minHeight: '100vh', background: BG }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${CYAN},#0284C7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏢</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>داش بورد المعهد</h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>مرحباً، {user?.name || 'مدير المعهد'}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="طلاب المعهد"      value={stats.students}                  color={CYAN}      icon="👨‍🎓" />
        <StatCard label="المدرسون"          value={stats.teachers}                  color="#3B82F6"   icon="👨‍🏫" />
        <StatCard label="الكورسات النشطة"  value={stats.courses}                   color="#10B981"   icon="📚" />
        <StatCard label="الإيرادات (ريال)" value={stats.revenue.toLocaleString()} color="#F59E0B"   icon="💰" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.75rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 999, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {(['overview','courses','students','faculty','finance'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>
            {{ overview: 'نظرة عامة', courses: 'الكورسات', students: 'الطلاب', faculty: 'المدرسون', finance: 'المالية' }[t]}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CYAN, marginBottom: '1rem', marginTop: 0 }}>الكورسات النشطة</h2>
                {courses.length === 0 ? <EmptyState label="لا توجد كورسات نشطة" /> : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {courses.slice(0, 6).map(c => (
                      <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: 6, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>المدرس: {c.teacher || '—'}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>الطلاب: {c.students_count ?? 0}</div>
                        {c.schedule && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>الجدول: {c.schedule}</div>}
                      </div>
                    ))}
                  </div>
                )}

                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CYAN, marginBottom: '1rem' }}>آخر التسجيلات</h2>
                {students.length === 0 ? <EmptyState label="لا توجد تسجيلات حديثة" /> : (
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                    {students.slice(0, 5).map(s => (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{s.email}</div>
                        </div>
                        <span style={{ background: `${CYAN}22`, color: CYAN, borderRadius: 6, padding: '2px 10px', fontSize: '0.75rem' }}>مسجل</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: CYAN, marginBottom: '1rem', marginTop: 0 }}>إجراءات سريعة</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {quickActions.map(({ label, icon, action }) => (
                    <button key={label} onClick={action} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.75rem 1rem', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, cursor: 'pointer', color: '#F8FAFC', fontFamily: 'inherit', fontSize: '0.9rem', textAlign: 'right' as any }}>
                      <span style={{ fontSize: '1.2rem' }}>{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COURSES ───────────────────────────────────────────────────── */}
          {tab === 'courses' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>الكورسات</h2>
                <button style={btnPrimary} onClick={() => setShowCourse(true)}>+ إضافة كورس</button>
              </div>
              {courses.length === 0 ? <EmptyState label="لا توجد كورسات — أضف أول كورس" /> : (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                    <thead style={{ background: 'rgba(6,182,212,0.08)' }}>
                      <tr>{['الكورس','المدرس','الطلاب','الجدول','السعر','الحالة','إجراءات'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {courses.map(c => (
                        <tr key={c.id}>
                          <td style={td}><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                          <td style={td}>{c.teacher || '—'}</td>
                          <td style={td}>{c.students_count ?? 0}</td>
                          <td style={td}>{c.schedule || '—'}</td>
                          <td style={td}>{c.price ? `${c.price} ر.س` : '—'}</td>
                          <td style={td}><span style={{ background: '#10B98122', color: '#10B981', borderRadius: 6, padding: '2px 10px', fontSize: '0.78rem' }}>{c.status || 'نشط'}</span></td>
                          <td style={td}><button style={btnOutline} onClick={() => alert(`تعديل: ${c.name}`)}>تعديل</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── STUDENTS ──────────────────────────────────────────────────── */}
          {tab === 'students' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>الطلاب</h2>
                <button style={btnPrimary} onClick={() => setShowStudent(true)}>+ تسجيل طالب</button>
              </div>
              {students.length === 0 ? <EmptyState label="لا يوجد طلاب مسجلون" /> : (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead style={{ background: 'rgba(6,182,212,0.08)' }}>
                      <tr>{['الاسم','الكورس','تاريخ التسجيل','الحضور%','المدفوع','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {students.map(s => (
                        <tr key={s.id}>
                          <td style={td}>
                            <div style={{ fontWeight: 600 }}>{s.name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem' }}>{s.email}</div>
                          </td>
                          <td style={td}>{s.course || '—'}</td>
                          <td style={td}>{s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString('ar-SA') : '—'}</td>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${s.attendance ?? 0}%`, height: '100%', background: CYAN, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', minWidth: 32 }}>{s.attendance ?? 0}%</span>
                            </div>
                          </td>
                          <td style={td}>{s.paid ? `${s.paid} ر.س` : '—'}</td>
                          <td style={td}><span style={{ background: '#10B98122', color: '#10B981', borderRadius: 6, padding: '2px 10px', fontSize: '0.78rem' }}>{s.status || 'نشط'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── FACULTY ───────────────────────────────────────────────────── */}
          {tab === 'faculty' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>المدرسون</h2>
                <button style={btnPrimary} onClick={() => setShowTeacher(true)}>+ إضافة مدرس</button>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                  <thead style={{ background: 'rgba(6,182,212,0.08)' }}>
                    <tr>{['الاسم','التخصص','الكورسات','التقييم','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={5} style={{ ...td, textAlign: 'center' as any, color: 'rgba(255,255,255,0.3)', padding: '2.5rem' }}>لا يوجد مدرسون — أضف أول مدرس</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── FINANCE ───────────────────────────────────────────────────── */}
          {tab === 'finance' && (
            <div>
              <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.05rem', fontWeight: 700 }}>المالية</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: CARD, border: '1px solid #F59E0B33', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 6 }}>الإيراد الشهري</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B' }}>0 ر.س</div>
                </div>
                <div style={{ background: CARD, border: '1px solid #EF444433', borderRadius: 12, padding: '1.25rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: 6 }}>الرسوم المعلقة</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EF4444' }}>0 ر.س</div>
                </div>
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'rgba(255,255,255,0.7)' }}>جدول المدفوعات</h3>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
                  <thead style={{ background: 'rgba(6,182,212,0.08)' }}>
                    <tr>{['الطالب','الكورس','المبلغ','التاريخ','الطريقة','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={6} style={{ ...td, textAlign: 'center' as any, color: 'rgba(255,255,255,0.3)', padding: '2.5rem' }}>لا توجد مدفوعات مسجلة</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MODAL: Add Course ──────────────────────────────────────────────── */}
      {showCourse && (
        <Modal title="إضافة كورس جديد" onClose={() => setShowCourse(false)}>
          <Field label="اسم الكورس *"         value={cName}     onChange={setCName}     placeholder="مثال: Python للمبتدئين" />
          <Field label="المدرس"                value={cTeacher}  onChange={setCTeacher}  placeholder="اسم المدرس" />
          <Field label="الجدول"                value={cSchedule} onChange={setCSchedule} placeholder="الأحد والثلاثاء 5-7 م" />
          <Field label="السعر (ريال)"          value={cPrice}    onChange={setCPrice}    type="number" placeholder="0" />
          <Field label="المدة"                 value={cDuration} onChange={setCDuration} placeholder="مثال: 3 أشهر" />
          <Field label="الطاقة الاستيعابية"   value={cCapacity} onChange={setCCapacity} type="number" placeholder="20" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={{ background: 'transparent', color: CYAN, border: `1px solid ${CYAN}55`, borderRadius: 9, padding: '0.55rem 1.2rem', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setShowCourse(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingC ? 0.6 : 1 }} onClick={handleAddCourse} disabled={savingC}>{savingC ? 'جاري الحفظ...' : 'إضافة الكورس'}</button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Enroll Student ─────────────────────────────────────────── */}
      {showStudent && (
        <Modal title="تسجيل طالب جديد" onClose={() => setShowStudent(false)}>
          <Field label="الاسم *"              value={sName}  onChange={setSName}  placeholder="الاسم الكامل" />
          <Field label="البريد الإلكتروني"    value={sEmail} onChange={setSEmail} type="email" placeholder="example@email.com" />
          <Field label="رقم الهاتف"           value={sPhone} onChange={setSPhone} type="tel" placeholder="05xxxxxxxx" />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 6 }}>الكورس</label>
            <select value={sCourse} onChange={e => setSCourse(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '0.65rem 0.75rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' as any }}>
              <option value="" style={{ background: '#0D1117' }}>-- اختر الكورس --</option>
              {courses.map(c => <option key={c.id} value={c.id} style={{ background: '#0D1117' }}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={{ background: 'transparent', color: CYAN, border: `1px solid ${CYAN}55`, borderRadius: 9, padding: '0.55rem 1.2rem', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setShowStudent(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingS ? 0.6 : 1 }} onClick={handleEnrollStudent} disabled={savingS}>{savingS ? 'جاري التسجيل...' : 'تسجيل الطالب'}</button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Add Teacher ────────────────────────────────────────────── */}
      {showTeacher && (
        <Modal title="إضافة مدرس جديد" onClose={() => setShowTeacher(false)}>
          <Field label="الاسم *"              value={tName}      onChange={setTName}      placeholder="اسم المدرس" />
          <Field label="البريد الإلكتروني"    value={tEmail}     onChange={setTEmail}     type="email" placeholder="example@email.com" />
          <Field label="التخصص"               value={tSpecialty} onChange={setTSpecialty} placeholder="مثال: رياضيات، برمجة" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={{ background: 'transparent', color: CYAN, border: `1px solid ${CYAN}55`, borderRadius: 9, padding: '0.55rem 1.2rem', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => setShowTeacher(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingT ? 0.6 : 1 }} onClick={handleAddTeacher} disabled={savingT}>{savingT ? 'جاري الحفظ...' : 'إضافة المدرس'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
