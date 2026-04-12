'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';

const OR = '#FB923C';
const GREEN = '#34D399';
const BLUE = '#60A5FA';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type AttStatus = 'present' | 'absent' | 'late';
const attLabel: Record<AttStatus, { label: string; color: string }> = {
  present: { label: 'حاضر', color: GREEN },
  absent: { label: 'غائب', color: '#EF4444' },
  late: { label: 'متأخر', color: OR },
};

export default function TrainerPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ courses: 0, trainees: 0, sessions: 0, rating: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, AttStatus>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'attendance' | 'progress'>('overview');
  const [selectedCourse, setSelectedCourse] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/training?type=trainer-stats'),
      fetch('/api/training?type=trainer-courses'),
    ]).then(async ([me, st, co]) => {
      if (me.ok) setUser((await me.json()).user);
      if (st.ok) setStats((await st.json()).stats || {});
      if (co.ok) { const d = await co.json(); const cls = d.courses || []; setCourses(cls); if (cls[0]) setSelectedCourse(cls[0].id); }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'attendance' && selectedCourse) {
      fetch(`/api/training?type=trainer-trainees&course_id=${selectedCourse}`)
        .then(r => r.json()).then(d => setTrainees(d.trainees || [])).catch(() => {});
    }
  }, [tab, selectedCourse]);

  const toggle = (id: number) => {
    setAttendance(p => {
      const cur = p[id] || 'present';
      const next: AttStatus = cur === 'present' ? 'absent' : cur === 'absent' ? 'late' : 'present';
      return { ...p, [id]: next };
    });
  };

  const saveAttendance = async () => {
    setSaving(true);
    const records = trainees.map(t => ({ trainee_id: t.id, status: attendance[t.id] || 'present' }));
    const res = await fetch('/api/training', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'attendance', course_id: selectedCourse, date, records }),
    });
    setSaveMsg(res.ok ? '✅ تم حفظ الحضور' : '❌ خطأ في الحفظ');
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: OR }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem' }}>⏳</div><div style={{ fontWeight: 700, marginTop: 8 }}>جارٍ التحميل…</div></div>
    </div>
  );

  const STATS = [
    { title: 'دوراتي', value: stats.courses || courses.length, sub: 'دورة تدريبية', color: OR },
    { title: 'متدربيّ', value: stats.trainees || trainees.length, sub: 'متدرب', color: BLUE },
    { title: 'جلسات هذا الشهر', value: stats.sessions, sub: 'جلسة تدريبية', color: GREEN },
    { title: 'تقييم المتدربين', value: `${stats.rating || 4.8} ⭐`, sub: 'متوسط التقييم', color: '#F59E0B' },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: OR }}>👨‍🏫 لوحة المدرب</h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          مرحباً {user?.name || 'المدرب'} — {new Date().toLocaleDateString('ar-SA')}
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {STATS.map(({ title, value, sub, color }) => (
          <div key={title} style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value ?? 0}</div>
            <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'attendance', label: 'الحضور' },
          { id: 'progress', label: 'تقدم المتدربين' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{ background: tab === t.id ? `${OR}20` : 'transparent', border: `1px solid ${tab === t.id ? OR + '50' : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer', color: tab === t.id ? OR : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.88rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <h2 style={{ color: OR, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>دوراتي التدريبية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
            {courses.map((c: any) => (
              <div key={c.id} style={{ background: CARD, border: `1px solid ${OR}20`, borderRadius: 14, padding: '1.1rem 1.25rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4 }}>{c.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{c.trainees_count || 0} متدرب</div>
                <button onClick={() => { setSelectedCourse(c.id); setTab('attendance'); }} style={{ width: '100%', background: `${OR}15`, border: `1px solid ${OR}30`, borderRadius: 8, padding: '0.45rem', color: OR, fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
                  تسجيل الحضور
                </button>
              </div>
            ))}
            {courses.length === 0 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا دورات مسندة بعد</div>
            )}
          </div>
        </div>
      )}

      {/* ATTENDANCE */}
      {tab === 'attendance' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', alignItems: 'center' }}>
            <select value={selectedCourse} onChange={e => setSelectedCourse(Number(e.target.value))} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '0.6rem 1rem', color: '#F8FAFC', fontSize: '0.9rem', minWidth: 200 }}>
              <option value="">— اختر الدورة —</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '0.6rem 1rem', color: '#F8FAFC', fontSize: '0.9rem' }} />
          </div>

          {trainees.length > 0 && (
            <>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: '1rem' }}>
                {trainees.map((t: any, i: number) => {
                  const st = attendance[t.id] || 'present';
                  const { label, color } = attLabel[st];
                  return (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderBottom: i < trainees.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${OR}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: OR }}>{t.name?.charAt(0)}</div>
                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                      </div>
                      <button onClick={() => toggle(t.id)} style={{ background: `${color}18`, border: `1px solid ${color}50`, borderRadius: 20, padding: '0.35rem 1rem', color, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', minWidth: 75 }}>{label}</button>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={saveAttendance} disabled={saving} style={{ background: OR, border: 'none', borderRadius: 10, padding: '0.65rem 2.5rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'جارٍ الحفظ…' : 'حفظ الحضور ✓'}
                </button>
                {saveMsg && <span style={{ color: saveMsg.includes('✅') ? GREEN : '#EF4444', fontWeight: 700 }}>{saveMsg}</span>}
              </div>
            </>
          )}
          {trainees.length === 0 && selectedCourse && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', background: CARD, borderRadius: 12, border: `1px solid ${BORDER}` }}>لا متدربون في هذه الدورة</div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {tab === 'progress' && (
        <div>
          <h2 style={{ color: GREEN, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>تقدم المتدربين</h2>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['المتدرب', 'الدورة', 'الحضور%', 'التقدم'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainees.map((t: any, i: number) => (
                  <tr key={t.id} style={{ borderBottom: i < trainees.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{t.name}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{t.course_name || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: OR, fontWeight: 700 }}>{t.attendance || 0}%</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, height: 8, overflow: 'hidden', width: 100 }}>
                        <div style={{ background: OR, height: '100%', width: `${t.progress || 0}%`, borderRadius: 20 }} />
                      </div>
                    </td>
                  </tr>
                ))}
                {trainees.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا بيانات بعد</td></tr>}
              </tbody>
            </table>
</div>
          </div>
        </div>
      )}
    </div>
  );
}
