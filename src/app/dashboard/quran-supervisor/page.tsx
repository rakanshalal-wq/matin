'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C';
const QR = '#22C55E';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

const toast = (msg: string, color = G) => {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: color, color: '#fff',
    padding: '12px 20px', borderRadius: '10px', fontWeight: 700, zIndex: '9999',
    fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', fontFamily: 'inherit',
    direction: 'rtl',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function QuranSupervisorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'circles' | 'students' | 'attendance' | 'reports'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [circleForm, setCircleForm] = useState({ name: '', schedule: '', max_students: '15', level: 'مبتدئ' });
  const [saving, setSaving] = useState(false);
  const [editCircle, setEditCircle] = useState<any>(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: '', circle_id: '', parent_phone: '' });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [circlesRes, studentsRes] = await Promise.all([
        fetch('/api/quran-circles', { headers: getHeaders() }),
        fetch('/api/quran-students', { headers: getHeaders() }),
      ]);
      if (circlesRes.ok) setCircles(await circlesRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadData();
  }, [loadData]);

  const saveCircle = async () => {
    if (!circleForm.name) { toast('اسم الحلقة مطلوب', '#ef4444'); return; }
    setSaving(true);
    try {
      const method = editCircle ? 'PUT' : 'POST';
      const url = editCircle ? `/api/quran-circles?id=${editCircle.id}` : '/api/quran-circles';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(circleForm) });
      if (res.ok) {
        toast(editCircle ? '✅ تم تحديث الحلقة' : '✅ تمت إضافة الحلقة', QR);
        setShowModal(false);
        setEditCircle(null);
        setCircleForm({ name: '', schedule: '', max_students: '15', level: 'مبتدئ' });
        loadData();
      } else {
        const d = await res.json();
        toast(d.error || 'فشل الحفظ', '#ef4444');
      }
    } catch { toast('خطأ في الاتصال', '#ef4444'); }
    finally { setSaving(false); }
  };

  const deleteCircle = async (id: number, name: string) => {
    if (!confirm(`حذف حلقة "${name}"؟`)) return;
    const res = await fetch(`/api/quran-circles?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    if (res.ok) { toast('تم الحذف', '#ef4444'); loadData(); }
    else toast('فشل الحذف', '#ef4444');
  };

  const saveStudent = async () => {
    if (!studentForm.name) { toast('اسم الطالب مطلوب', '#ef4444'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/quran-students', { method: 'POST', headers: getHeaders(), body: JSON.stringify(studentForm) });
      if (res.ok) {
        toast('✅ تمت إضافة الطالب', QR);
        setShowAddStudent(false);
        setStudentForm({ name: '', circle_id: '', parent_phone: '' });
        loadData();
      } else {
        const d = await res.json();
        toast(d.error || 'فشل', '#ef4444');
      }
    } catch { toast('خطأ في الاتصال', '#ef4444'); }
    finally { setSaving(false); }
  };

  const totalStudents = students.length;
  const totalCircles = circles.length;
  const activeCircles = circles.filter(c => c.status === 'active').length;

  const NAV = [
    { id: 'overview', label: '📊 لوحة التحكم' },
    { id: 'circles', label: '🕌 الحلقات القرآنية' },
    { id: 'students', label: '👥 الطلاب' },
    { id: 'attendance', label: '📋 الحضور والغياب' },
    { id: 'reports', label: '📈 التقارير' },
  ];

  const SB: React.CSSProperties = {
    width: 240, minHeight: '100vh', background: '#080811',
    borderLeft: `1px solid ${BORDER}`, padding: '24px 0', display: 'flex',
    flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0,
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: QR, fontSize: 18 }}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={SB}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: QR }}>🌙 منصة متين</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>مشرف حلقات التحفيظ</div>
          {user && <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{user.name}</div>}
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)}
              style={{
                display: 'block', width: '100%', textAlign: 'right', padding: '10px 20px',
                background: activeTab === item.id ? `${QR}15` : 'transparent',
                border: 'none', borderRight: activeTab === item.id ? `3px solid ${QR}` : '3px solid transparent',
                color: activeTab === item.id ? QR : 'rgba(255,255,255,0.6)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
          <Link href="/dashboard/quran-live" style={{ display: 'block', background: `${QR}20`, border: `1px solid ${QR}40`, borderRadius: 8, padding: '8px 12px', color: QR, fontSize: 12, fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginBottom: 8 }}>
            📡 الحلقة المباشرة
          </Link>
          <button onClick={() => { localStorage.removeItem('matin_token'); localStorage.removeItem('matin_user'); window.location.href = '/login'; }}
            style={{ width: '100%', background: 'transparent', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: '8px 12px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>لوحة مشرف حلقات التحفيظ</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>إدارة حلقات تحفيظ القرآن الكريم</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setEditCircle(null); setCircleForm({ name: '', schedule: '', max_students: '15', level: 'مبتدئ' }); setShowModal(true); }}
              style={{ background: QR, border: 'none', borderRadius: 8, padding: '10px 18px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
              ➕ حلقة جديدة
            </button>
            <button onClick={() => window.print()} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              📊 تقرير
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'إجمالي الطلاب', value: totalStudents, color: QR, sub: 'في جميع الحلقات' },
            { label: 'الحلقات النشطة', value: activeCircles, color: G, sub: `من ${totalCircles} حلقة` },
            { label: 'معدل الحضور', value: '87%', color: '#3B82F6', sub: 'هذا الأسبوع' },
            { label: 'ختمات هذا الشهر', value: 3, color: '#A855F7', sub: 'ماشاء الله' },
          ].map(stat => (
            <div key={stat.label} style={{ background: CARD, border: `1px solid ${stat.color}20`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `${stat.color}08`, borderRadius: '0 14px 0 60px' }} />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{stat.label}</div>
              <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginTop: 6 }}>{stat.value}</div>
              <div style={{ color: stat.color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>الحلقات القرآنية</h2>
            {circles.length === 0 ? (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🕌</div>
                <div>لا توجد حلقات بعد. ابدأ بإضافة حلقة جديدة</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
                {circles.map(c => (
                  <div key={c.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{c.teacher_name || 'غير محدد المحفّظ'}</div>
                      </div>
                      <span style={{ background: `${QR}20`, color: QR, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>{c.level}</span>
                    </div>
                    {c.schedule && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>📅 {c.schedule}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 13, color: QR, fontWeight: 700 }}>👥 {c.student_count || 0} / {c.max_students}</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/dashboard/quran-live?circle_id=${c.id}`} style={{ background: `${QR}20`, border: `1px solid ${QR}40`, borderRadius: 6, padding: '4px 10px', color: QR, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>📡 مباشر</Link>
                        <button onClick={() => { setEditCircle(c); setCircleForm({ name: c.name, schedule: c.schedule || '', max_students: String(c.max_students), level: c.level }); setShowModal(true); }}
                          style={{ background: `${G}15`, border: `1px solid ${G}30`, borderRadius: 6, padding: '4px 10px', color: G, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>تعديل</button>
                        <button onClick={() => deleteCircle(c.id, c.name)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>حذف</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'circles' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>إدارة الحلقات</h2>
              <button onClick={() => { setEditCircle(null); setCircleForm({ name: '', schedule: '', max_students: '15', level: 'مبتدئ' }); setShowModal(true); }}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                ➕ إضافة حلقة
              </button>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['اسم الحلقة', 'المحفّظ', 'الجدول', 'المستوى', 'الطلاب', 'الإجراءات'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {circles.map((c, i) => (
                    <tr key={c.id} style={{ borderBottom: i < circles.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{c.teacher_name || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{c.schedule || '—'}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ background: `${QR}20`, color: QR, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{c.level}</span></td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: QR, fontWeight: 700 }}>{c.student_count || 0}/{c.max_students}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { setEditCircle(c); setCircleForm({ name: c.name, schedule: c.schedule || '', max_students: String(c.max_students), level: c.level }); setShowModal(true); }}
                            style={{ background: `${G}15`, border: `1px solid ${G}30`, borderRadius: 6, padding: '4px 8px', color: G, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>تعديل</button>
                          <button onClick={() => deleteCircle(c.id, c.name)}
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 8px', color: '#ef4444', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {circles.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا توجد حلقات بعد</td></tr>
                  )}
                </tbody>
              </table>
</div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>الطلاب المسجّلون</h2>
              <button onClick={() => setShowAddStudent(true)}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                ➕ إضافة طالب
              </button>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['اسم الطالب', 'الحلقة', 'الجزء الحالي', 'نقاط التحفيز'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.circle_name || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                            <div style={{ height: '100%', background: QR, borderRadius: 3, width: `${((s.current_juz || 0) / 30) * 100}%` }} />
                          </div>
                          <span style={{ fontSize: 12, color: QR, fontWeight: 700 }}>{s.current_juz || 0}/30</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: G, fontWeight: 700 }}>⭐ {s.total_points || 0}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا يوجد طلاب مسجّلون بعد</td></tr>
                  )}
                </tbody>
              </table>
</div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>الحضور والغياب</h2>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>لعرض الحضور، ابدأ جلسة مباشرة من صفحة الحلقة</div>
              <Link href="/dashboard/quran-live" style={{ background: QR, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', display: 'inline-block' }}>
                📡 بدء الحلقة المباشرة
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>التقارير والإحصائيات</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
              {[
                { label: 'تقرير الحضور الأسبوعي', icon: '📋', color: '#3B82F6' },
                { label: 'تقدم الحفظ للطلاب', icon: '📖', color: QR },
                { label: 'أداء المحفّظين', icon: '👨‍🏫', color: G },
                { label: 'الختمات والإجازات', icon: '🎓', color: '#A855F7' },
              ].map(r => (
                <button key={r.label} onClick={() => toast(`جارٍ إنشاء ${r.label}`, r.color)}
                  style={{ background: CARD, border: `1px solid ${r.color}20`, borderRadius: 14, padding: '24px 20px', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.color}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.color}20`; }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal إضافة/تعديل حلقة */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 480, maxWidth: '95vw', direction: 'rtl' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#fff' }}>{editCircle ? 'تعديل الحلقة' : 'إضافة حلقة جديدة'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'اسم الحلقة *', key: 'name', placeholder: 'مثال: حلقة الإتقان الصباحية' },
                { label: 'الجدول الزمني', key: 'schedule', placeholder: 'مثال: السبت والاثنين 10:00–11:30' },
                { label: 'الحد الأقصى للطلاب', key: 'max_students', placeholder: '15', type: 'number' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={circleForm[field.key as keyof typeof circleForm]}
                    onChange={e => setCircleForm({ ...circleForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>المستوى</label>
                <select value={circleForm.level} onChange={e => setCircleForm({ ...circleForm, level: e.target.value })}
                  style={{ width: '100%', background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                  {['مبتدئ', 'متوسط', 'متقدم'].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={saveCircle} disabled={saving}
                style={{ flex: 1, background: QR, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                {saving ? 'جارٍ الحفظ...' : (editCircle ? '✅ حفظ التعديلات' : '➕ إضافة الحلقة')}
              </button>
              <button onClick={() => { setShowModal(false); setEditCircle(null); }}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 20px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal إضافة طالب */}
      {showAddStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 440, maxWidth: '95vw', direction: 'rtl' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#fff' }}>إضافة طالب جديد</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>اسم الطالب *</label>
                <input value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="الاسم الكامل" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>الحلقة</label>
                <select value={studentForm.circle_id} onChange={e => setStudentForm({ ...studentForm, circle_id: e.target.value })}
                  style={{ width: '100%', background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                  <option value="">اختر الحلقة</option>
                  {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>رقم ولي الأمر</label>
                <input value={studentForm.parent_phone} onChange={e => setStudentForm({ ...studentForm, parent_phone: e.target.value })}
                  placeholder="05XXXXXXXX" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={saveStudent} disabled={saving}
                style={{ flex: 1, background: QR, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                {saving ? 'جارٍ الحفظ...' : '➕ إضافة الطالب'}
              </button>
              <button onClick={() => setShowAddStudent(false)}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 20px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
