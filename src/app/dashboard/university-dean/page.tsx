'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C';
const BLUE = '#3B82F6';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

const toast = (msg: string, color = G) => {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: color, color: '#fff',
    padding: '12px 20px', borderRadius: '10px', fontWeight: 700, zIndex: '9999',
    fontSize: '14px', fontFamily: 'inherit', direction: 'rtl',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

const StatCard = ({ label, value, sub, color, icon }: any) => (
  <div style={{ background: CARD, border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}08`, borderRadius: '0 14px 0 70px' }} />
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{label}</div>
    <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginTop: 4 }}>{value}</div>
    {sub && <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </div>
);

export default function UniversityDeanDashboard() {
  const [user, setUser] = useState<any>(null);
  const [colleges, setColleges] = useState<any[]>([]);
  const [myCollege, setMyCollege] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'staff' | 'academics' | 'admissions' | 'reports'>('overview');
  const [saving, setSaving] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: '', email: '', role: 'teacher', specialization: '', phone: '' });
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [collegesRes, studentsRes, teachersRes, admissionsRes, examsRes] = await Promise.all([
        fetch('/api/colleges', { headers: getHeaders() }),
        fetch('/api/students?limit=200', { headers: getHeaders() }),
        fetch('/api/teachers?limit=100', { headers: getHeaders() }),
        fetch('/api/admission?status=pending&limit=20', { headers: getHeaders() }),
        fetch('/api/exams?limit=10', { headers: getHeaders() }),
      ]);
      if (collegesRes.ok) {
        const data = await collegesRes.json();
        setColleges(Array.isArray(data) ? data : []);
        // العميد يرى كليته فقط — أول كلية في النتائج
        if (Array.isArray(data) && data.length > 0) setMyCollege(data[0]);
      }
      if (studentsRes.ok) { const d = await studentsRes.json(); setStudents(Array.isArray(d) ? d : d?.data || []); }
      if (teachersRes.ok) { const d = await teachersRes.json(); setTeachers(Array.isArray(d) ? d : d?.data || []); }
      if (admissionsRes.ok) { const d = await admissionsRes.json(); setAdmissions(Array.isArray(d) ? d : d?.data || []); }
      if (examsRes.ok) { const d = await examsRes.json(); setExams(Array.isArray(d) ? d : d?.data || []); }
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadData();
  }, [loadData]);

  const approveAdmission = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admission?id=${id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ status: 'approved' }),
      });
      if (res.ok) { toast('✅ تم قبول الطالب', '#22C55E'); loadData(); }
      else { const d = await res.json(); toast(d.error || 'فشل القبول', '#EF4444'); }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSaving(false); }
  };

  const rejectAdmission = async (id: number) => {
    if (!confirm('رفض هذا الطلب؟')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admission?id=${id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (res.ok) { toast('تم رفض الطلب', '#EF4444'); loadData(); }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSaving(false); }
  };

  const addStaffMember = async () => {
    if (!staffForm.name || !staffForm.email) { toast('الاسم والبريد مطلوبان', '#EF4444'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/manage-staff', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ ...staffForm, college_id: myCollege?.id }),
      });
      if (res.ok) {
        toast('✅ تمت إضافة عضو هيئة التدريس', '#22C55E');
        setShowAddStaffModal(false);
        setStaffForm({ name: '', email: '', role: 'teacher', specialization: '', phone: '' });
        loadData();
      } else { const d = await res.json(); toast(d.error || 'فشل الإضافة', '#EF4444'); }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSaving(false); }
  };

  const NAV = [
    { id: 'overview', label: '🏛️ لوحة العميد' },
    { id: 'students', label: '👨‍🎓 طلاب الكلية' },
    { id: 'staff', label: '👨‍🏫 هيئة التدريس' },
    { id: 'academics', label: '📚 الشؤون الأكاديمية' },
    { id: 'admissions', label: '📝 طلبات القبول' },
    { id: 'reports', label: '📊 التقارير' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: G, fontSize: 18 }}>جاري التحميل...</div>
    </div>
  );

  const collegeName = myCollege?.name || 'كلية الجامعة';
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const pendingAdmissions = admissions.filter(a => a.status === 'pending').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{ width: 256, minHeight: '100vh', background: '#080811', borderLeft: `1px solid ${BORDER}`, padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: G }}>🏛️ منصة متين</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>عميد الكلية</div>
          {user && <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>{user.name || 'د. العميد'}</div>}
          <div style={{ marginTop: 4, fontSize: 11, color: G, fontWeight: 600 }}>{collegeName}</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)}
              style={{ display: 'block', width: '100%', textAlign: 'right', padding: '10px 20px', background: activeTab === item.id ? `${G}15` : 'transparent', border: 'none', borderRight: activeTab === item.id ? `3px solid ${G}` : '3px solid transparent', color: activeTab === item.id ? G : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {item.label}
            </button>
          ))}
          <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 8, paddingTop: 8 }}>
            {[
              { label: '🗓️ التقويم الأكاديمي', href: '/dashboard/university-owner' },
              { label: '💰 رسوم الطلاب', href: '/dashboard/finance' },
              { label: '🔔 الإشعارات', href: '/dashboard/notifications' },
              { label: '⚙️ الإعدادات', href: '/dashboard/settings' },
            ].map(link => (
              <Link key={link.label} href={link.href}
                style={{ display: 'block', padding: '8px 20px', color: 'rgba(255,255,255,0.5)', fontSize: 12, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
          <button onClick={() => { localStorage.removeItem('matin_token'); localStorage.removeItem('matin_user'); window.location.href = '/login'; }}
            style={{ width: '100%', background: 'transparent', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: '8px 12px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>لوحة عميد الكلية</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>{collegeName}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {pendingAdmissions > 0 && (
              <button onClick={() => setActiveTab('admissions')}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '8px 14px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'inherit' }}>
                🔔 {pendingAdmissions} طلب معلق
              </button>
            )}
            <button onClick={() => setShowAddStaffModal(true)}
              style={{ background: G, border: 'none', borderRadius: 8, padding: '10px 18px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
              ➕ إضافة عضو هيئة تدريس
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard label="طلاب الكلية" value={totalStudents} sub="↑ هذا الفصل" color="#22C55E" icon="👨‍🎓" />
          <StatCard label="هيئة التدريس" value={totalTeachers} sub={`في الكلية`} color={BLUE} icon="👨‍🏫" />
          <StatCard label="طلبات القبول" value={pendingAdmissions} sub="تحتاج مراجعة" color={G} icon="📝" />
          <StatCard label="الأقسام" value={colleges.length} sub="قسم أكاديمي" color="#A855F7" icon="🏛️" />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Quick Actions */}
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>الإجراءات السريعة</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                {[
                  { label: 'قبول طلاب', icon: '✅', color: '#22C55E', tab: 'admissions' },
                  { label: 'عرض الطلاب', icon: '👨‍🎓', color: BLUE, tab: 'students' },
                  { label: 'هيئة التدريس', icon: '👨‍🏫', color: G, tab: 'staff' },
                  { label: 'الشؤون الأكاديمية', icon: '📚', color: '#A855F7', tab: 'academics' },
                  { label: 'التقارير', icon: '📊', color: '#EF4444', tab: 'reports' },
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab as any)}
                    style={{ background: CARD, border: `1px solid ${a.color}20`, borderRadius: 12, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${a.color}50`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${a.color}20`; }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pending Admissions Preview */}
            {admissions.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.6)', margin: 0 }}>آخر طلبات القبول</h2>
                  <button onClick={() => setActiveTab('admissions')} style={{ background: 'transparent', border: 'none', color: G, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>عرض الكل</button>
                </div>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
                  {admissions.slice(0, 5).map((req, i) => (
                    <div key={req.id} style={{ padding: '14px 20px', borderBottom: i < Math.min(admissions.length, 5) - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{req.student_name || req.name || 'طالب'}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{req.phone || ''}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => approveAdmission(req.id)} disabled={saving}
                          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, padding: '5px 12px', color: '#22C55E', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ✅ قبول
                        </button>
                        <button onClick={() => rejectAdmission(req.id)} disabled={saving}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '5px 12px', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          ❌ رفض
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exams Preview */}
            {exams.length > 0 && (
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>الاختبارات القادمة</h2>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
                  {exams.slice(0, 5).map((ex, i) => (
                    <div key={ex.id} style={{ padding: '14px 20px', borderBottom: i < Math.min(exams.length, 5) - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{ex.title || ex.subject || 'اختبار'}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{ex.date ? new Date(ex.date).toLocaleDateString('ar-SA') : 'لم تُحدد'}</div>
                      </div>
                      <Link href={`/dashboard/exams`} style={{ background: `${BLUE}20`, border: `1px solid ${BLUE}40`, borderRadius: 6, padding: '5px 12px', color: BLUE, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                        عرض
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>طلاب الكلية ({totalStudents})</h2>
              <Link href="/dashboard/students" style={{ background: G, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                إدارة الطلاب
              </Link>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['اسم الطالب', 'المرحلة', 'رقم الهاتف', 'الحالة'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {students.slice(0, 20).map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < Math.min(students.length, 20) - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{s.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.grade || s.level || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.phone || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                          {s.status || 'نشط'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا يوجد طلاب بعد</td></tr>
                  )}
                </tbody>
              </table>
              {students.length > 20 && (
                <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, textAlign: 'center' }}>
                  <Link href="/dashboard/students" style={{ color: G, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>عرض جميع {totalStudents} طالب</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>هيئة التدريس والموظفون ({totalTeachers})</h2>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowPermissionsModal(true)}
                  style={{ background: `${BLUE}20`, border: `1px solid ${BLUE}40`, borderRadius: 8, padding: '8px 14px', color: BLUE, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                  🔑 إدارة الصلاحيات
                </button>
                <button onClick={() => setShowAddStaffModal(true)}
                  style={{ background: G, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                  ➕ إضافة عضو
                </button>
              </div>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['الاسم', 'التخصص', 'الدور', 'البريد', 'الإجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {teachers.slice(0, 20).map((t, i) => (
                    <tr key={t.id} style={{ borderBottom: i < Math.min(teachers.length, 20) - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{t.full_name || t.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.subject || t.specialization || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: `${G}20`, color: G, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>دكتور</span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.email || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <Link href={`/dashboard/teachers`} style={{ background: `${BLUE}20`, border: `1px solid ${BLUE}40`, borderRadius: 6, padding: '4px 10px', color: BLUE, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {teachers.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا يوجد أعضاء هيئة تدريس</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'academics' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>الشؤون الأكاديمية</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
              {[
                { label: 'الجداول الدراسية', icon: '📅', href: '/dashboard/schedules', color: BLUE },
                { label: 'الاختبارات', icon: '📝', href: '/dashboard/exams', color: '#A855F7' },
                { label: 'الدرجات والمعدلات', icon: '📊', href: '/dashboard/grades', color: '#22C55E' },
                { label: 'الحضور والغياب', icon: '📋', href: '/dashboard/attendance', color: G },
                { label: 'المقررات', icon: '📚', href: '/dashboard/subjects', color: '#EF4444' },
                { label: 'المحاضرات المباشرة', icon: '📡', href: '/dashboard/live-sessions', color: '#06B6D4' },
                { label: 'بنك الأسئلة', icon: '❓', href: '/dashboard/question-bank', color: '#F59E0B' },
                { label: 'الأبحاث العلمية', icon: '🔬', href: '/dashboard/activities', color: '#8B5CF6' },
              ].map(item => (
                <Link key={item.label} href={item.href}
                  style={{ background: CARD, border: `1px solid ${item.color}20`, borderRadius: 14, padding: '20px', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${item.color}20`; }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{item.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>طلبات القبول</h2>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['الطالب', 'رقم الجوال', 'الحالة', 'التاريخ', 'الإجراءات'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {admissions.map((req, i) => (
                    <tr key={req.id} style={{ borderBottom: i < admissions.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{req.student_name || req.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{req.phone || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: req.status === 'pending' ? 'rgba(245,158,11,0.15)' : req.status === 'approved' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: req.status === 'pending' ? '#F59E0B' : req.status === 'approved' ? '#22C55E' : '#EF4444', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>
                          {req.status === 'pending' ? 'قيد المراجعة' : req.status === 'approved' ? 'مقبول' : 'مرفوض'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                        {req.created_at ? new Date(req.created_at).toLocaleDateString('ar-SA') : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {req.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => approveAdmission(req.id)} disabled={saving}
                              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, padding: '4px 10px', color: '#22C55E', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              ✅ قبول
                            </button>
                            <button onClick={() => rejectAdmission(req.id)} disabled={saving}
                              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', color: '#EF4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                              ❌ رفض
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {admissions.length === 0 && (
                    <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا توجد طلبات قبول</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>التقارير والإحصائيات</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
              {[
                { label: 'تقرير الطلاب الأكاديمي', icon: '👨‍🎓', color: '#22C55E', href: '/dashboard/reports' },
                { label: 'تقرير الحضور', icon: '📋', color: BLUE, href: '/dashboard/attendance' },
                { label: 'تقرير الدرجات', icon: '📊', color: G, href: '/dashboard/grades' },
                { label: 'تقرير الكلية', icon: '🏛️', color: '#A855F7', href: '/dashboard/reports' },
              ].map(r => (
                <Link key={r.label} href={r.href}
                  style={{ background: CARD, border: `1px solid ${r.color}20`, borderRadius: 14, padding: '24px 20px', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.color}50`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${r.color}20`; }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{r.label}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal إضافة عضو هيئة تدريس */}
      {showAddStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 480, maxWidth: '95vw', direction: 'rtl' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#fff' }}>➕ إضافة عضو هيئة تدريس</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'الاسم الكامل *', key: 'name', placeholder: 'د. محمد العتيبي' },
                { label: 'البريد الإلكتروني *', key: 'email', placeholder: 'email@university.edu' },
                { label: 'رقم الجوال', key: 'phone', placeholder: '05XXXXXXXX' },
                { label: 'التخصص', key: 'specialization', placeholder: 'مثال: الهندسة المدنية' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{field.label}</label>
                  <input
                    value={staffForm[field.key as keyof typeof staffForm]}
                    onChange={e => setStaffForm({ ...staffForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>الدور</label>
                <select value={staffForm.role} onChange={e => setStaffForm({ ...staffForm, role: e.target.value })}
                  style={{ width: '100%', background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                  <option value="teacher">دكتور / أستاذ</option>
                  <option value="assistant">معيد / محاضر</option>
                  <option value="admin">موظف إداري</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={addStaffMember} disabled={saving}
                style={{ flex: 1, background: G, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                {saving ? 'جارٍ الإضافة...' : '➕ إضافة العضو'}
              </button>
              <button onClick={() => setShowAddStaffModal(false)}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 20px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal الصلاحيات */}
      {showPermissionsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 520, maxWidth: '95vw', direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#fff' }}>🔑 إدارة الصلاحيات الأكاديمية</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'رفع الدرجات', desc: 'إدخال وتعديل درجات الطلاب', allowed: true },
                { label: 'إنشاء الاختبارات', desc: 'إضافة وجدولة الاختبارات', allowed: true },
                { label: 'تسجيل الحضور', desc: 'حضور وغياب الطلاب', allowed: true },
                { label: 'رفع المحتوى التعليمي', desc: 'محاضرات، ملفات، فيديوهات', allowed: true },
                { label: 'بث مباشر', desc: 'إنشاء جلسات مباشرة', allowed: true },
                { label: 'الإشراف على رسائل الماجستير', desc: 'الإشراف الأكاديمي على الطلاب', allowed: true },
                { label: 'نشر الأبحاث العلمية', desc: 'تسجيل ونشر الأوراق البحثية', allowed: true },
              ].map((perm, i) => (
                <div key={i} style={{ background: CARD, border: `1px solid ${perm.allowed ? '#22C55E20' : BORDER}`, borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{perm.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{perm.desc}</div>
                  </div>
                  <div style={{ width: 36, height: 20, background: perm.allowed ? '#22C55E' : 'rgba(255,255,255,0.1)', borderRadius: 10, position: 'relative', cursor: 'pointer' }}>
                    <div style={{ width: 16, height: 16, background: '#fff', borderRadius: '50%', position: 'absolute', top: 2, left: perm.allowed ? 18 : 2, transition: 'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => { toast('✅ تم حفظ الصلاحيات', '#22C55E'); setShowPermissionsModal(false); }}
                style={{ flex: 1, background: G, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                ✅ حفظ الصلاحيات
              </button>
              <button onClick={() => setShowPermissionsModal(false)}
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
