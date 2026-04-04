'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';

const OR = '#FB923C';
const BLUE = '#60A5FA';
const GREEN = '#34D399';
const PURPLE = '#A78BFA';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'overview' | 'courses' | 'trainees' | 'trainers' | 'finance';

const StatCard = ({ title, value, sub, color }: any) => (
  <div style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value ?? 0}</div>
    <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>
  </div>
);

export default function TrainingManagerPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ trainees: 0, trainers: 0, courses: 0, revenue: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [trainees, setTrainees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseForm, setCourseForm] = useState({ name: '', trainer: '', start_date: '', end_date: '', capacity: '', price: '' });
  const [savingCourse, setSavingCourse] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/training?type=stats'),
      fetch('/api/training?type=courses'),
      fetch('/api/training?type=trainees'),
    ]).then(async ([me, st, co, tr]) => {
      if (me.ok) setUser((await me.json()).user);
      if (st.ok) setStats((await st.json()).stats || {});
      if (co.ok) setCourses((await co.json()).courses || []);
      if (tr.ok) setTrainees((await tr.json()).trainees || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addCourse = async () => {
    setSavingCourse(true);
    await fetch('/api/training', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'course', ...courseForm }),
    }).catch(() => {});
    setShowAddCourse(false);
    setCourseForm({ name: '', trainer: '', start_date: '', end_date: '', capacity: '', price: '' });
    const r = await fetch('/api/training?type=courses');
    if (r.ok) setCourses((await r.json()).courses || []);
    setSavingCourse(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: OR }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem' }}>⏳</div><div style={{ fontWeight: 700, marginTop: 8 }}>جارٍ التحميل…</div></div>
    </div>
  );

  const STATS = [
    { title: 'المتدربون', value: stats.trainees, sub: 'متدرب نشط', color: OR },
    { title: 'المدربون', value: stats.trainers, sub: 'مدرب متخصص', color: BLUE },
    { title: 'دورات نشطة', value: stats.courses, sub: 'برنامج تدريبي', color: GREEN },
    { title: 'الإيرادات', value: `${(stats.revenue || 0).toLocaleString()} ريال`, sub: 'هذا الشهر', color: PURPLE },
  ];

  const QUICK = [
    { label: 'إضافة دورة', icon: '📋', action: () => setShowAddCourse(true) },
    { label: 'تسجيل متدرب', icon: '👤', action: () => setTab('trainees') },
    { label: 'الشهادات', icon: '🏆', action: () => {} },
    { label: 'التقارير', icon: '📊', action: () => {} },
    { label: 'المدربون', icon: '👨‍🏫', action: () => setTab('trainers') },
    { label: 'الإعدادات', icon: '⚙️', action: () => {} },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: OR }}>
          لوحة مدير مركز التدريب 📋
        </h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          مرحباً {user?.name || 'المدير'} — {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        {STATS.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {QUICK.map(({ label, icon, action }) => (
          <button key={label} onClick={action} style={{ background: `${OR}12`, border: `1px solid ${OR}25`, borderRadius: 12, padding: '0.85rem', textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${OR}22`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${OR}12`; }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{icon}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'courses', label: 'الدورات' },
          { id: 'trainees', label: 'المتدربون' },
          { id: 'trainers', label: 'المدربون' },
          { id: 'finance', label: 'المالية' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{ background: tab === t.id ? `${OR}20` : 'transparent', border: `1px solid ${tab === t.id ? OR + '50' : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer', color: tab === t.id ? OR : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.88rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <h2 style={{ color: OR, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>الدورات النشطة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
            {courses.filter(c => c.status !== 'ended').slice(0, 6).map((c: any) => (
              <div key={c.id} style={{ background: CARD, border: `1px solid ${OR}20`, borderRadius: 14, padding: '1.1rem 1.25rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: 4 }}>{c.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                  {c.trainer || c.subject || 'المدرب'} · {c.trainees_count || c.students_count || 0} متدرب
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button onClick={() => setTab('trainees')} style={{ flex: 1, background: `${OR}12`, border: `1px solid ${OR}30`, borderRadius: 8, padding: '0.4rem', color: OR, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>المتدربون</button>
                  <button onClick={() => setTab('courses')} style={{ flex: 1, background: `${GREEN}12`, border: `1px solid ${GREEN}30`, borderRadius: 8, padding: '0.4rem', color: GREEN, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>التفاصيل</button>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                لا دورات نشطة — <button onClick={() => setShowAddCourse(true)} style={{ background: 'none', border: 'none', color: OR, cursor: 'pointer', fontWeight: 700 }}>أضف دورة جديدة</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab === 'courses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: OR, fontSize: '1rem', fontWeight: 700 }}>جميع الدورات</h2>
            <button onClick={() => setShowAddCourse(true)} style={{ background: OR, border: 'none', borderRadius: 9, padding: '0.55rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>+ إضافة دورة</button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الدورة', 'المدرب', 'المتدربون', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any, i: number) => (
                  <tr key={c.id} style={{ borderBottom: i < courses.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'rgba(255,255,255,0.6)' }}>{c.trainer || c.subject || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>{c.trainees_count || c.students_count || 0}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, borderRadius: 20, padding: '0.2rem 0.75rem', color: GREEN, fontSize: '0.78rem', fontWeight: 700 }}>نشطة</span>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا دورات بعد</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRAINEES */}
      {tab === 'trainees' && (
        <div>
          <h2 style={{ color: OR, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>المتدربون</h2>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الاسم', 'الدورة', 'الحضور%', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainees.map((t: any, i: number) => (
                  <tr key={t.id} style={{ borderBottom: i < trainees.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{t.name}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'rgba(255,255,255,0.6)' }}>{t.course_name || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: OR, fontWeight: 700 }}>{t.attendance || 0}%</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ background: `${GREEN}18`, border: `1px solid ${GREEN}40`, borderRadius: 20, padding: '0.2rem 0.75rem', color: GREEN, fontSize: '0.78rem', fontWeight: 700 }}>نشط</span>
                    </td>
                  </tr>
                ))}
                {trainees.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا متدربون مسجلون بعد</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRAINERS */}
      {tab === 'trainers' && (
        <div>
          <h2 style={{ color: BLUE, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>المدربون</h2>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
            قائمة المدربين ستظهر هنا عند توفر البيانات
          </div>
        </div>
      )}

      {/* FINANCE */}
      {tab === 'finance' && (
        <div>
          <h2 style={{ color: PURPLE, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>المالية والإيرادات</h2>
          <div style={{ background: CARD, border: `1px solid ${PURPLE}30`, borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: PURPLE, fontSize: '2rem', fontWeight: 800 }}>{(stats.revenue || 0).toLocaleString()} ريال</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>إجمالي الإيرادات الشهرية</div>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${OR}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 500, direction: 'rtl' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: OR, fontWeight: 800 }}>إضافة دورة تدريبية جديدة</h3>
            {[
              { label: 'اسم الدورة *', key: 'name', type: 'text', ph: 'مثال: برنامج Excel المتقدم' },
              { label: 'المدرب', key: 'trainer', type: 'text', ph: 'اسم المدرب' },
              { label: 'تاريخ البداية', key: 'start_date', type: 'date', ph: '' },
              { label: 'تاريخ الانتهاء', key: 'end_date', type: 'date', ph: '' },
              { label: 'الطاقة الاستيعابية', key: 'capacity', type: 'number', ph: '20' },
              { label: 'السعر (ريال)', key: 'price', type: 'number', ph: '500' },
            ].map(({ label, key, type, ph }) => (
              <div key={key} style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.3rem', fontWeight: 600 }}>{label}</label>
                <input type={type} placeholder={ph} value={courseForm[key as keyof typeof courseForm]} onChange={e => setCourseForm(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.6rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setShowAddCourse(false)} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={addCourse} disabled={savingCourse || !courseForm.name} style={{ background: OR, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingCourse || !courseForm.name) ? 0.6 : 1 }}>
                {savingCourse ? 'جارٍ الإضافة…' : 'إضافة الدورة ✓'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
