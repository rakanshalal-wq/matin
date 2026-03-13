'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */
const G = '#C9A84C';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const Icon = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  students:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
  teachers:  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  classes:   'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z',
  exams:     'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  attendance:'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
  subjects:  'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  schedule:  'M8 2v4 M16 2v4 M3 10h18 M21 8H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z',
  homework:  'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  reports:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
  notif:     'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  behavior:  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  library:   'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  transport: 'M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'classes'>('overview');

  useEffect(() => {
    const u = localStorage.getItem('matin_user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if (!['admin', 'owner', 'school_owner', 'university_owner', 'institute_owner', 'kindergarten_owner', 'training_owner'].includes(parsed.role)) {
      router.push('/login'); return;
    }
    setUser(parsed);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, teachersRes, classesRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/students', { headers: getHeaders() }),
        fetch('/api/teachers', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
      ]);
      const [statsData, studentsData, teachersData, classesData] = await Promise.all([
        statsRes.json(), studentsRes.json(), teachersRes.json(), classesRes.json()
      ]);
      setStats(statsData || {});
      setRecentStudents(Array.isArray(studentsData) ? studentsData.slice(0, 10) : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${G}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const statCards = [
    { label: 'إجمالي الطلاب', value: stats.my_students || stats.students || 0, icon: 'students', color: '#3B82F6', href: '/dashboard/students' },
    { label: 'المعلمون', value: stats.my_teachers || stats.teachers || 0, icon: 'teachers', color: '#10B981', href: '/dashboard/teachers' },
    { label: 'الفصول', value: stats.my_classes || stats.classes || classes.length || 0, icon: 'classes', color: '#8B5CF6', href: '/dashboard/classes' },
    { label: 'الاختبارات', value: stats.active_exams || stats.exams || 0, icon: 'exams', color: G, href: '/dashboard/exams' },
    { label: 'الحضور اليوم', value: stats.attendance_today || '—', icon: 'attendance', color: '#06B6D4', href: '/dashboard/attendance' },
    { label: 'المواد', value: stats.subjects || 0, icon: 'subjects', color: '#EF4444', href: '/dashboard/subjects' },
  ];

  const quickActions = [
    { label: 'إدارة الطلاب', icon: 'students', href: '/dashboard/students', color: '#3B82F6' },
    { label: 'إدارة المعلمين', icon: 'teachers', href: '/dashboard/teachers', color: '#10B981' },
    { label: 'الفصول الدراسية', icon: 'classes', href: '/dashboard/classes', color: '#8B5CF6' },
    { label: 'تسجيل الحضور', icon: 'attendance', href: '/dashboard/attendance', color: '#F59E0B' },
    { label: 'الجداول', icon: 'schedule', href: '/dashboard/schedules', color: '#EF4444' },
    { label: 'الاختبارات', icon: 'exams', href: '/dashboard/exams', color: '#06B6D4' },
    { label: 'الواجبات', icon: 'homework', href: '/dashboard/homework', color: '#84CC16' },
    { label: 'التقارير', icon: 'reports', href: '/dashboard/reports', color: '#F97316' },
    { label: 'الإشعارات', icon: 'notif', href: '/dashboard/notifications', color: '#A855F7' },
    { label: 'السلوك', icon: 'behavior', href: '/dashboard/behavior', color: '#EC4899' },
    { label: 'المكتبة', icon: 'library', href: '/dashboard/library', color: '#14B8A6' },
    { label: 'النقل', icon: 'transport', href: '/dashboard/transport', color: '#F59E0B' },
  ];

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'students', label: 'الطلاب' },
    { id: 'teachers', label: 'المعلمون' },
    { id: 'classes', label: 'الفصول' },
  ];

  return (
    <div style={{ padding: '28px 24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', minHeight: '100vh', background: DARK }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, ${G}, #E2C46A)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: 22, boxShadow: `0 6px 20px rgba(201,168,76,0.3)` }}>م</div>
          <div>
            <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>لوحة تحكم المدير</h1>
            <p style={{ color: 'rgba(238,238,245,0.45)', margin: 0, fontSize: 13 }}>مرحباً {user.name} — {user.school_name || 'المؤسسة التعليمية'}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/dashboard/notifications" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 10, color: G, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Icon d={ICONS.notif} size={15} /> الإشعارات
          </Link>
          <Link href="/dashboard/settings" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, color: 'rgba(238,238,245,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
            <Icon d={ICONS.settings} size={15} /> الإعدادات
          </Link>
        </div>
      </div>

      {/* التبويبات */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '9px 22px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', transition: 'all 0.2s',
              background: activeTab === tab.id ? `linear-gradient(135deg, ${G}, #E2C46A)` : 'transparent',
              color: activeTab === tab.id ? '#000' : 'rgba(238,238,245,0.5)',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ width: 40, height: 40, border: `3px solid ${G}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14 }}>جاري التحميل...</div>
        </div>
      ) : activeTab === 'overview' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 28 }}>
            {statCards.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px', cursor: 'pointer', transition: 'all 0.25s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = s.color; (e.currentTarget as HTMLDivElement).style.background = `${s.color}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = CARD; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
                      <div style={{ color: '#EEEEF5', fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{typeof s.value === 'number' ? s.value.toLocaleString('ar-SA') : s.value}</div>
                    </div>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                      <Icon d={ICONS[s.icon as keyof typeof ICONS] || ICONS.students} size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>الإجراءات السريعة</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {quickActions.map((a, i) => (
                <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}10`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
                      <Icon d={ICONS[a.icon as keyof typeof ICONS] || ICONS.students} size={17} />
                    </div>
                    <div style={{ color: 'rgba(238,238,245,0.75)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}` }}>
              <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: 0 }}>آخر الطلاب المسجلين</h3>
            </div>
            {recentStudents.length === 0 ? (
              <p style={{ color: 'rgba(238,238,245,0.3)', textAlign: 'center', padding: 40, fontSize: 14 }}>لا يوجد طلاب مسجلون</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                      {['الاسم', 'البريد الإلكتروني', 'الجنس', 'تاريخ التسجيل'].map((h, i) => (
                        <th key={i} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((s: any, i: number) => (
                      <tr key={i}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 14, fontWeight: 600, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.name || s.full_name}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.email}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'students' ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>قائمة الطلاب</h3>
            <Link href="/dashboard/students" style={{ padding: '8px 18px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة الطلاب
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <p style={{ color: 'rgba(238,238,245,0.3)', textAlign: 'center', padding: 60, fontSize: 14 }}>لا يوجد طلاب مسجلون</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['#', 'الاسم', 'البريد الإلكتروني', 'الجنس', 'الحالة'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s: any, i: number) => (
                  <tr key={i}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.3)', fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 14, fontWeight: 600, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.name || s.full_name}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.email}</td>
                    <td style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.5)', fontSize: 13, borderBottom: `1px solid rgba(255,255,255,0.04)` }}>{s.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                    <td style={{ padding: '12px 16px', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>نشط</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : activeTab === 'teachers' ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>قائمة المعلمين</h3>
            <Link href="/dashboard/teachers" style={{ padding: '8px 18px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة المعلمين
            </Link>
          </div>
          {teachers.length === 0 ? (
            <p style={{ color: 'rgba(238,238,245,0.3)', textAlign: 'center', padding: 60, fontSize: 14 }}>لا يوجد معلمون مسجلون</p>
          ) : (
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {teachers.map((t: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <Icon d={ICONS.teachers} size={20} />
                    </div>
                    <div>
                      <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{t.name || t.full_name}</div>
                      <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{t.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}>{t.specialization || 'معلم'}</span>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>نشط</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
            <h3 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>الفصول الدراسية</h3>
            <Link href="/dashboard/classes" style={{ padding: '8px 18px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', borderRadius: 9, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة الفصول
            </Link>
          </div>
          {classes.length === 0 ? (
            <p style={{ color: 'rgba(238,238,245,0.3)', textAlign: 'center', padding: 60, fontSize: 14 }}>لا توجد فصول دراسية</p>
          ) : (
            <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {classes.map((c: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 18, textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#8B5CF6' }}>
                    <Icon d={ICONS.classes} size={22} />
                  </div>
                  <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.name || c.class_name}</div>
                  <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>السعة: {c.capacity || c.max_students || '—'}</div>
                  <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>المرحلة: {c.grade_level || c.level || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
