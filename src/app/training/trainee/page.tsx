'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';

const OR = '#FB923C';
const GREEN = '#34D399';
const BLUE = '#60A5FA';
const PURPLE = '#A78BFA';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

type Tab = 'overview' | 'courses' | 'progress' | 'certificates';

export default function TraineePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ enrolled: 0, attendance: 0, completed: 0, certificates: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [showRequest, setShowRequest] = useState(false);
  const [requestForm, setRequestForm] = useState({ course_name: '', reason: '' });
  const [savingRequest, setSavingRequest] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/training?type=trainee-stats'),
      fetch('/api/training?type=trainee-courses'),
      fetch('/api/training?type=trainee-certificates'),
    ]).then(async ([me, st, co, cert]) => {
      if (me.ok) setUser((await me.json()).user);
      if (st.ok) setStats((await st.json()).stats || {});
      if (co.ok) setCourses((await co.json()).courses || []);
      if (cert.ok) setCertificates((await cert.json()).certificates || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const submitRequest = async () => {
    if (!requestForm.course_name) return;
    setSavingRequest(true);
    await fetch('/api/training', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'enrollment-request', ...requestForm }),
    }).catch(() => {});
    setShowRequest(false);
    setRequestForm({ course_name: '', reason: '' });
    setSavingRequest(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: OR }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '2.5rem' }}>⏳</div><div style={{ fontWeight: 700, marginTop: 8 }}>جارٍ التحميل…</div></div>
    </div>
  );

  const STATS = [
    { title: 'الدورات المسجلة', value: stats.enrolled || courses.length, sub: 'دورة تدريبية', color: OR },
    { title: 'نسبة الحضور', value: `${stats.attendance || 0}%`, sub: 'هذا الشهر', color: GREEN },
    { title: 'الدورات المكتملة', value: stats.completed, sub: 'دورة منجزة', color: BLUE },
    { title: 'الشهادات', value: stats.certificates || certificates.length, sub: 'شهادة اجتياز', color: PURPLE },
  ];

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', color: '#F8FAFC' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: OR }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg> بوابتي التدريبية</h1>
        <p style={{ margin: '0.3rem 0 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          مرحباً {user?.name || 'المتدرب'} — {new Date().toLocaleDateString('ar-SA')}
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

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {[
          { label: 'التسجيل في دورة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 14l2 2 4-4"/></svg>, action: () => setShowRequest(true) },
          { label: 'شهاداتي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>, action: () => setTab('certificates') },
          { label: 'تقدمي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, action: () => setTab('progress') },
          { label: 'دوراتي', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, action: () => setTab('courses') },
        ].map(({ label, icon, action }) => (
          <button key={label} onClick={action} style={{ background: `${OR}12`, border: `1px solid ${OR}25`, borderRadius: 12, padding: '0.85rem', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.35rem' }}>{icon}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: 600 }}>{label}</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'overview', label: 'نظرة عامة' },
          { id: 'courses', label: 'دوراتي' },
          { id: 'progress', label: 'تقدمي' },
          { id: 'certificates', label: 'الشهادات' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{ background: tab === t.id ? `${OR}20` : 'transparent', border: `1px solid ${tab === t.id ? OR + '50' : 'rgba(255,255,255,0.1)'}`, borderRadius: 9, padding: '0.5rem 1.1rem', cursor: 'pointer', color: tab === t.id ? OR : 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: '0.88rem' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: CARD, border: `1px solid ${OR}20`, borderRadius: 14, padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: OR, fontSize: '0.95rem', fontWeight: 700 }}>الدورات الجارية</h3>
            {courses.filter((c: any) => c.status === 'active' || !c.status).slice(0, 3).map((c: any) => (
              <div key={c.id} style={{ padding: '0.5rem 0', borderBottom: `1px solid ${BORDER}` }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>المدرب: {c.trainer || '—'}</div>
              </div>
            ))}
            {courses.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>لا دورات جارية</div>
            )}
            <button onClick={() => setShowRequest(true)} style={{ width: '100%', marginTop: '1rem', background: `${OR}15`, border: `1px solid ${OR}30`, borderRadius: 9, padding: '0.55rem', color: OR, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
              + التسجيل في دورة جديدة
            </button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${PURPLE}20`, borderRadius: 14, padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: PURPLE, fontSize: '0.95rem', fontWeight: 700 }}>شهاداتي <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></h3>
            {certificates.slice(0, 3).map((cert: any) => (
              <div key={cert.id} style={{ padding: '0.5rem 0', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cert.course_name}</div>
                <span style={{ color: PURPLE }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></span>
              </div>
            ))}
            {certificates.length === 0 && (
              <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>لا شهادات بعد</div>
            )}
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab === 'courses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, color: OR, fontSize: '1rem', fontWeight: 700 }}>دوراتي التدريبية</h2>
            <button onClick={() => setShowRequest(true)} style={{ background: OR, border: 'none', borderRadius: 9, padding: '0.55rem 1.25rem', color: '#000', fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem' }}>+ التسجيل في دورة</button>
          </div>
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${BORDER}` }}>
                  {['الدورة', 'المدرب', 'الحضور%', 'التقدم', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1.25rem', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any, i: number) => (
                  <tr key={c.id} style={{ borderBottom: i < courses.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'rgba(255,255,255,0.5)' }}>{c.trainer || '—'}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: OR, fontWeight: 700 }}>{c.attendance || 0}%</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, height: 6, overflow: 'hidden', flex: 1 }}>
                          <div style={{ background: GREEN, height: '100%', width: `${c.progress || 0}%`, borderRadius: 20 }} />
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{c.progress || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{ background: `${c.status === 'completed' ? PURPLE : GREEN}18`, border: `1px solid ${c.status === 'completed' ? PURPLE : GREEN}40`, borderRadius: 20, padding: '0.2rem 0.75rem', color: c.status === 'completed' ? PURPLE : GREEN, fontSize: '0.78rem', fontWeight: 700 }}>
                        {c.status === 'completed' ? 'مكتملة' : 'جارية'}
                      </span>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)' }}>لا دورات مسجلة</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROGRESS */}
      {tab === 'progress' && (
        <div>
          <h2 style={{ color: GREEN, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>تقدمي التدريبي</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {courses.map((c: any) => (
              <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: GREEN, fontWeight: 800 }}>{c.progress || 0}%</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, height: 10, overflow: 'hidden' }}>
                  <div style={{ background: `linear-gradient(90deg, ${OR}, ${GREEN})`, height: '100%', width: `${c.progress || 0}%`, borderRadius: 20, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
            {courses.length === 0 && <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا بيانات تقدم بعد</div>}
          </div>
        </div>
      )}

      {/* CERTIFICATES */}
      {tab === 'certificates' && (
        <div>
          <h2 style={{ color: PURPLE, fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>شهاداتي <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {certificates.map((cert: any) => (
              <div key={cert.id} style={{ background: `${PURPLE}10`, border: `1px solid ${PURPLE}30`, borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg></div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 4 }}>{cert.course_name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                  {cert.issued_at ? new Date(cert.issued_at).toLocaleDateString('ar-SA') : '—'}
                </div>
                <button style={{ background: PURPLE, border: 'none', borderRadius: 8, padding: '0.45rem 1.25rem', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                  تحميل الشهادة
                </button>
              </div>
            ))}
            {certificates.length === 0 && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '2.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', gridColumn: '1/-1' }}>
                لا شهادات بعد — أكمل دوراتك للحصول على شهادة الاجتياز
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enrollment Request Modal */}
      {showRequest && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div style={{ background: '#0D1B2A', border: `1px solid ${OR}40`, borderRadius: 18, padding: '2rem', width: '100%', maxWidth: 460, direction: 'rtl' }}>
            <h3 style={{ margin: '0 0 1.5rem', color: OR, fontWeight: 800 }}>التسجيل في دورة جديدة</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>اسم الدورة المطلوبة *</label>
              <input type="text" placeholder="مثال: Excel المتقدم" value={requestForm.course_name} onChange={e => setRequestForm(p => ({ ...p, course_name: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '0.35rem', fontWeight: 600 }}>سبب الطلب</label>
              <textarea value={requestForm.reason} onChange={e => setRequestForm(p => ({ ...p, reason: e.target.value }))} rows={3} placeholder="لماذا تريد الالتحاق بهذه الدورة؟"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 9, padding: '0.65rem 0.9rem', color: '#F8FAFC', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRequest(false)} style={{ background: 'transparent', border: `1px solid rgba(255,255,255,0.15)`, borderRadius: 9, padding: '0.65rem 1.5rem', color: '#94A3B8', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={submitRequest} disabled={savingRequest || !requestForm.course_name} style={{ background: OR, border: 'none', borderRadius: 9, padding: '0.65rem 1.75rem', color: '#000', fontWeight: 800, cursor: 'pointer', opacity: (savingRequest || !requestForm.course_name) ? 0.6 : 1 }}>
                {savingRequest ? 'جارٍ الإرسال…' : 'إرسال الطلب ←'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
