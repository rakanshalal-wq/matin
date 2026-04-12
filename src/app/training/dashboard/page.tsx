'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Stats { trainees: number; trainers: number; courses: number; certificates: number }
interface TCourse { id: any; name: string; trainer: string; trainees_count: number; start_date?: string; end_date?: string; status?: string; capacity?: number; price?: number }
interface Trainee { id: any; name: string; email?: string; course?: string; progress?: number; attendance?: number; status?: string }
interface Certificate { id: any; trainee: string; course: string; issued_at?: string; status?: string }

// ─── Constants ───────────────────────────────────────────────────────────────
const ORANGE = '#FB923C';
const BG     = '#06060E';
const CARD   = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(251,146,60,0.18)';

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
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: ORANGE, animation: 'spin 0.8s linear infinite' }} />
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
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value} onChange={(e: any) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '0.65rem 0.75rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' as any, outline: 'none' }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TrainingDashboard() {
  const [tab,      setTab]      = useState<'overview' | 'courses' | 'trainees' | 'trainers' | 'certificates'>('overview');
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState<Stats>({ trainees: 0, trainers: 0, courses: 0, certificates: 0 });
  const [courses,  setCourses]  = useState<TCourse[]>([]);
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [certs,    setCerts]    = useState<Certificate[]>([]);
  const [user,     setUser]     = useState<any>(null);

  // Modals
  const [showCourse,  setShowCourse]  = useState(false);
  const [showTrainee, setShowTrainee] = useState(false);
  const [showTrainer, setShowTrainer] = useState(false);
  const [showCert,    setShowCert]    = useState(false);

  // Course form
  const [cName,     setCName]     = useState('');
  const [cTrainer,  setCTrainer]  = useState('');
  const [cStart,    setCStart]    = useState('');
  const [cEnd,      setCEnd]      = useState('');
  const [cCapacity, setCCapacity] = useState('');
  const [cPrice,    setCPrice]    = useState('');

  // Trainee form
  const [tName,    setTName]    = useState('');
  const [tEmail,   setTEmail]   = useState('');
  const [tPhone,   setTPhone]   = useState('');
  const [tCourse,  setTCourse]  = useState('');

  // Trainer form
  const [trName,      setTrName]      = useState('');
  const [trEmail,     setTrEmail]     = useState('');
  const [trSpecialty, setTrSpecialty] = useState('');

  // Certificate form
  const [certTrainee, setCertTrainee] = useState('');
  const [certCourse,  setCertCourse]  = useState('');

  // Saving
  const [savingC,  setSavingC]  = useState(false);
  const [savingTn, setSavingTn] = useState(false);
  const [savingTr, setSavingTr] = useState(false);
  const [savingCt, setSavingCt] = useState(false);

  // ── Fetch data ────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [userRes, statsRes, coursesRes, traineesRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/training?type=stats'),
          fetch('/api/training?type=courses'),
          fetch('/api/training?type=trainees'),
        ]);
        if (userRes.ok)     { const d = await userRes.json();     setUser(d.user ?? d); }
        if (statsRes.ok)    { const d = await statsRes.json();    if (d.stats)    setStats(d.stats); }
        if (coursesRes.ok)  { const d = await coursesRes.json();  if (d.courses)  setCourses(d.courses); }
        if (traineesRes.ok) { const d = await traineesRes.json(); if (d.trainees) setTrainees(d.trainees); }
      } catch (_) {}
      finally { setLoading(false); }
    })();
  }, []);

  async function refreshStats() {
    const r = await fetch('/api/training?type=stats');
    if (r.ok) { const d = await r.json(); if (d.stats) setStats(d.stats); }
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleAddCourse() {
    if (!cName.trim()) return;
    setSavingC(true);
    try {
      await fetch('/api/training', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'course', name: cName, trainer: cTrainer, start_date: cStart, end_date: cEnd, capacity: cCapacity, price: cPrice }),
      });
      const r = await fetch('/api/training?type=courses');
      if (r.ok) { const d = await r.json(); if (d.courses) setCourses(d.courses); }
      await refreshStats();
    } catch (_) {}
    setSavingC(false); setShowCourse(false);
    setCName(''); setCTrainer(''); setCStart(''); setCEnd(''); setCCapacity(''); setCPrice('');
  }

  async function handleRegisterTrainee() {
    if (!tName.trim()) return;
    setSavingTn(true);
    try {
      await fetch('/api/training', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trainee', name: tName, email: tEmail, phone: tPhone, course: tCourse }),
      });
      const r = await fetch('/api/training?type=trainees');
      if (r.ok) { const d = await r.json(); if (d.trainees) setTrainees(d.trainees); }
      await refreshStats();
    } catch (_) {}
    setSavingTn(false); setShowTrainee(false);
    setTName(''); setTEmail(''); setTPhone(''); setTCourse('');
  }

  async function handleAddTrainer() {
    if (!trName.trim()) return;
    setSavingTr(true);
    try {
      await fetch('/api/training', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'trainer', name: trName, email: trEmail, specialty: trSpecialty }),
      });
      await refreshStats();
    } catch (_) {}
    setSavingTr(false); setShowTrainer(false);
    setTrName(''); setTrEmail(''); setTrSpecialty('');
  }

  async function handleIssueCertificate() {
    if (!certTrainee.trim()) return;
    setSavingCt(true);
    try {
      await fetch('/api/training', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'certificate', trainee: certTrainee, course: certCourse }),
      });
      const r = await fetch('/api/training?type=certificates');
      if (r.ok) { const d = await r.json(); if (d.certificates) setCerts(d.certificates); }
      await refreshStats();
    } catch (_) {}
    setSavingCt(false); setShowCert(false);
    setCertTrainee(''); setCertCourse('');
  }

  // ── Style helpers ─────────────────────────────────────────────────────────
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '0.55rem 1.25rem', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: '0.88rem', fontWeight: active ? 700 : 400,
    background: active ? ORANGE : 'transparent',
    color: active ? '#06060E' : 'rgba(255,255,255,0.55)',
    transition: 'all 0.2s',
  });

  const btnPrimary: React.CSSProperties = {
    background: ORANGE, color: '#06060E', border: 'none', borderRadius: 9,
    padding: '0.6rem 1.4rem', fontFamily: 'inherit', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
  };

  const btnOutline: React.CSSProperties = {
    background: 'transparent', color: ORANGE, border: `1px solid ${ORANGE}55`, borderRadius: 9,
    padding: '0.55rem 1.2rem', fontFamily: 'inherit', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
  };

  const th: React.CSSProperties = { padding: '0.75rem 1rem', textAlign: 'right' as any, fontWeight: 600, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' };
  const td: React.CSSProperties = { padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' };

  const quickActions = [
    { label: 'إضافة دورة',      icon: '📋', action: () => setShowCourse(true) },
    { label: 'تسجيل متدرب',     icon: '👤', action: () => setShowTrainee(true) },
    { label: 'إضافة مدرب',      icon: '👨‍🏫', action: () => setShowTrainer(true) },
    { label: 'الشهادات',         icon: '🎓', action: () => setTab('certificates') },
    { label: 'التقارير',          icon: '📊', action: () => { window.location.href = '/dashboard/reports'; } },
    { label: 'الإعدادات',         icon: '⚙️', action: () => { window.location.href = '/dashboard/settings'; } },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic','Segoe UI',sans-serif", color: '#F8FAFC', minHeight: '100vh', background: BG }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${ORANGE},#EA580C)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏋️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>داش بورد مركز التدريب</h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>مرحباً، {user?.name || 'مدير التدريب'}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="المتدربون"        value={stats.trainees}     color={ORANGE}    icon="👥" />
        <StatCard label="المدربون"          value={stats.trainers}     color="#3B82F6"   icon="👨‍🏫" />
        <StatCard label="كورسات نشطة"      value={stats.courses}      color="#10B981"   icon="📋" />
        <StatCard label="شهادات أُصدرت"   value={stats.certificates} color="#A855F7"   icon="🎓" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.75rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 999, border: `1px solid ${BORDER}`, width: 'fit-content' }}>
        {(['overview','courses','trainees','trainers','certificates'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>
            {{ overview: 'نظرة عامة', courses: 'الدورات', trainees: 'المتدربون', trainers: 'المدربون', certificates: 'الشهادات' }[t]}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: ORANGE, marginBottom: '1rem', marginTop: 0 }}>الدورات التدريبية النشطة</h2>
                {courses.length === 0 ? <EmptyState label="لا توجد دورات نشطة" /> : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {courses.slice(0, 6).map(c => (
                      <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 700, color: '#F8FAFC', marginBottom: 6, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>المدرب: {c.trainer || '—'}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>المتدربون: {c.trainees_count ?? 0}</div>
                        {c.start_date && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>البداية: {new Date(c.start_date).toLocaleDateString('ar-SA')}</div>}
                        <div style={{ marginTop: 8 }}>
                          <span style={{ background: '#10B98122', color: '#10B981', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem' }}>{c.status || 'نشط'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: ORANGE, marginBottom: '1rem' }}>الجلسات القادمة</h2>
                {courses.length === 0 ? <EmptyState label="لا توجد جلسات قادمة" /> : (
                  <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                    {courses.slice(0, 4).map(c => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>المدرب: {c.trainer || '—'}</div>
                        </div>
                        <span style={{ background: `${ORANGE}22`, color: ORANGE, borderRadius: 6, padding: '2px 10px', fontSize: '0.75rem' }}>
                          {c.start_date ? new Date(c.start_date).toLocaleDateString('ar-SA') : 'قريباً'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: ORANGE, marginBottom: '1rem', marginTop: 0 }}>إجراءات سريعة</h2>
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
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>الدورات التدريبية</h2>
                <button style={btnPrimary} onClick={() => setShowCourse(true)}>+ إضافة دورة</button>
              </div>
              {courses.length === 0 ? <EmptyState label="لا توجد دورات — أضف أول دورة" /> : (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                    <thead style={{ background: 'rgba(251,146,60,0.08)' }}>
                      <tr>{['الدورة','المدرب','المتدربون','تاريخ البداية','تاريخ الانتهاء','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {courses.map(c => (
                        <tr key={c.id}>
                          <td style={td}><span style={{ fontWeight: 600 }}>{c.name}</span></td>
                          <td style={td}>{c.trainer || '—'}</td>
                          <td style={td}>{c.trainees_count ?? 0}{c.capacity ? ` / ${c.capacity}` : ''}</td>
                          <td style={td}>{c.start_date ? new Date(c.start_date).toLocaleDateString('ar-SA') : '—'}</td>
                          <td style={td}>{c.end_date   ? new Date(c.end_date).toLocaleDateString('ar-SA')   : '—'}</td>
                          <td style={td}><span style={{ background: '#10B98122', color: '#10B981', borderRadius: 6, padding: '2px 10px', fontSize: '0.78rem' }}>{c.status || 'نشط'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TRAINEES ──────────────────────────────────────────────────── */}
          {tab === 'trainees' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>المتدربون</h2>
                <button style={btnPrimary} onClick={() => setShowTrainee(true)}>+ تسجيل متدرب</button>
              </div>
              {trainees.length === 0 ? <EmptyState label="لا يوجد متدربون مسجلون" /> : (
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                    <thead style={{ background: 'rgba(251,146,60,0.08)' }}>
                      <tr>{['الاسم','الدورة','التقدم%','الحضور','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {trainees.map(t => (
                        <tr key={t.id}>
                          <td style={td}>
                            <div style={{ fontWeight: 600 }}>{t.name}</div>
                            {t.email && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem' }}>{t.email}</div>}
                          </td>
                          <td style={td}>{t.course || '—'}</td>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${t.progress ?? 0}%`, height: '100%', background: ORANGE, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', minWidth: 32 }}>{t.progress ?? 0}%</span>
                            </div>
                          </td>
                          <td style={td}>{t.attendance ?? 0}%</td>
                          <td style={td}><span style={{ background: '#10B98122', color: '#10B981', borderRadius: 6, padding: '2px 10px', fontSize: '0.78rem' }}>{t.status || 'نشط'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── TRAINERS ──────────────────────────────────────────────────── */}
          {tab === 'trainers' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>المدربون</h2>
                <button style={btnPrimary} onClick={() => setShowTrainer(true)}>+ إضافة مدرب</button>
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                  <thead style={{ background: 'rgba(251,146,60,0.08)' }}>
                    <tr>{['المدرب','التخصص','الدورات','التقييم'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={4} style={{ ...td, textAlign: 'center' as any, color: 'rgba(255,255,255,0.3)', padding: '2.5rem' }}>لا يوجد مدربون — أضف أول مدرب</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CERTIFICATES ──────────────────────────────────────────────── */}
          {tab === 'certificates' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>الشهادات المُصدرة</h2>
                <button style={btnPrimary} onClick={() => setShowCert(true)}>+ إصدار شهادة</button>
              </div>
              {certs.length === 0 ? <EmptyState label="لم يتم إصدار شهادات بعد" /> : null}
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 580 }}>
                  <thead style={{ background: 'rgba(251,146,60,0.08)' }}>
                    <tr>{['المتدرب','الدورة','تاريخ الإصدار','الحالة'].map(h => <th key={h} style={th}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {certs.length === 0 ? (
                      <tr><td colSpan={4} style={{ ...td, textAlign: 'center' as any, color: 'rgba(255,255,255,0.3)', padding: '2.5rem' }}>لا توجد شهادات مسجلة</td></tr>
                    ) : certs.map(c => (
                      <tr key={c.id}>
                        <td style={td}>{c.trainee}</td>
                        <td style={td}>{c.course}</td>
                        <td style={td}>{c.issued_at ? new Date(c.issued_at).toLocaleDateString('ar-SA') : '—'}</td>
                        <td style={td}><span style={{ background: '#A855F722', color: '#A855F7', borderRadius: 6, padding: '2px 10px', fontSize: '0.78rem' }}>{c.status || 'مُصدرة'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MODAL: Add Course ──────────────────────────────────────────────── */}
      {showCourse && (
        <Modal title="إضافة دورة تدريبية" onClose={() => setShowCourse(false)}>
          <Field label="اسم الدورة *"    value={cName}     onChange={setCName}     placeholder="مثال: إدارة المشاريع" />
          <Field label="المدرب"           value={cTrainer}  onChange={setCTrainer}  placeholder="اسم المدرب" />
          <Field label="تاريخ البداية"   value={cStart}    onChange={setCStart}    type="date" />
          <Field label="تاريخ الانتهاء"  value={cEnd}      onChange={setCEnd}      type="date" />
          <Field label="الطاقة الاستيعابية" value={cCapacity} onChange={setCCapacity} type="number" placeholder="20" />
          <Field label="السعر (ريال)"    value={cPrice}    onChange={setCPrice}    type="number" placeholder="0" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={btnOutline} onClick={() => setShowCourse(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingC ? 0.6 : 1 }} onClick={handleAddCourse} disabled={savingC}>{savingC ? 'جاري الحفظ...' : 'إضافة الدورة'}</button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Register Trainee ───────────────────────────────────────── */}
      {showTrainee && (
        <Modal title="تسجيل متدرب جديد" onClose={() => setShowTrainee(false)}>
          <Field label="الاسم *"              value={tName}   onChange={setTName}   placeholder="الاسم الكامل" />
          <Field label="البريد الإلكتروني"    value={tEmail}  onChange={setTEmail}  type="email" placeholder="example@email.com" />
          <Field label="رقم الهاتف"           value={tPhone}  onChange={setTPhone}  type="tel" placeholder="05xxxxxxxx" />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 6 }}>الدورة</label>
            <select value={tCourse} onChange={e => setTCourse(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '0.65rem 0.75rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' as any }}>
              <option value="" style={{ background: '#0D1117' }}>-- اختر الدورة --</option>
              {courses.map(c => <option key={c.id} value={c.id} style={{ background: '#0D1117' }}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={btnOutline} onClick={() => setShowTrainee(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingTn ? 0.6 : 1 }} onClick={handleRegisterTrainee} disabled={savingTn}>{savingTn ? 'جاري التسجيل...' : 'تسجيل المتدرب'}</button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Add Trainer ────────────────────────────────────────────── */}
      {showTrainer && (
        <Modal title="إضافة مدرب جديد" onClose={() => setShowTrainer(false)}>
          <Field label="الاسم *"              value={trName}      onChange={setTrName}      placeholder="اسم المدرب" />
          <Field label="البريد الإلكتروني"    value={trEmail}     onChange={setTrEmail}     type="email" placeholder="example@email.com" />
          <Field label="التخصص"               value={trSpecialty} onChange={setTrSpecialty} placeholder="مثال: إدارة، برمجة، تسويق" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={btnOutline} onClick={() => setShowTrainer(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingTr ? 0.6 : 1 }} onClick={handleAddTrainer} disabled={savingTr}>{savingTr ? 'جاري الحفظ...' : 'إضافة المدرب'}</button>
          </div>
        </Modal>
      )}

      {/* ── MODAL: Issue Certificate ──────────────────────────────────────── */}
      {showCert && (
        <Modal title="إصدار شهادة" onClose={() => setShowCert(false)}>
          <Field label="اسم المتدرب *"  value={certTrainee} onChange={setCertTrainee} placeholder="اسم المتدرب" />
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: 6 }}>الدورة</label>
            <select value={certCourse} onChange={e => setCertCourse(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '0.65rem 0.75rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' as any }}>
              <option value="" style={{ background: '#0D1117' }}>-- اختر الدورة --</option>
              {courses.map(c => <option key={c.id} value={c.id} style={{ background: '#0D1117' }}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button style={btnOutline} onClick={() => setShowCert(false)}>إلغاء</button>
            <button style={{ ...btnPrimary, opacity: savingCt ? 0.6 : 1 }} onClick={handleIssueCertificate} disabled={savingCt}>{savingCt ? 'جاري الإصدار...' : 'إصدار الشهادة'}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
