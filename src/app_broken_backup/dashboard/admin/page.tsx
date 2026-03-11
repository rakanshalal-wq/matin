'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
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
    if (parsed.role !== 'admin') { router.push('/login'); return; }
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

  if (!user) return <div style={{minHeight:'100vh',background:'#0D1B2A',display:'flex',alignItems:'center',justifyContent:'center',color:'#C9A227',fontSize:20}}>جاري التحميل...</div>;

  const statCards = [
    { label: 'إجمالي الطلاب', value: stats.my_students || stats.students || 0, icon: '🎓', color: '#3B82F6', href: '/dashboard/students' },
    { label: 'المعلمين', value: stats.my_teachers || stats.teachers || 0, icon: '👨‍🏫', color: '#10B981', href: '/dashboard/teachers' },
    { label: 'الفصول', value: stats.my_classes || stats.classes || classes.length || 0, icon: '🏫', color: '#8B5CF6', href: '/dashboard/classes' },
    { label: 'الاختبارات', value: stats.active_exams || stats.exams || 0, icon: '📝', color: '#F59E0B', href: '/dashboard/exams' },
    { label: 'الحضور اليوم', value: stats.attendance_today || '—', icon: '✅', color: '#06B6D4', href: '/dashboard/attendance' },
    { label: 'المواد', value: stats.subjects || 0, icon: '📚', color: '#EF4444', href: '/dashboard/subjects' },
  ];

  const quickActions = [
    { label: 'إدارة الطلاب', icon: '👨‍🎓', href: '/dashboard/students', color: '#3B82F6' },
    { label: 'إدارة المعلمين', icon: '👨‍🏫', href: '/dashboard/teachers', color: '#10B981' },
    { label: 'الفصول الدراسية', icon: '🏫', href: '/dashboard/classes', color: '#8B5CF6' },
    { label: 'تسجيل الحضور', icon: '✅', href: '/dashboard/attendance', color: '#F59E0B' },
    { label: 'الجداول', icon: '📅', href: '/dashboard/schedules', color: '#EF4444' },
    { label: 'الاختبارات', icon: '📝', href: '/dashboard/exams', color: '#06B6D4' },
    { label: 'الواجبات', icon: '📋', href: '/dashboard/homework', color: '#84CC16' },
    { label: 'التقارير', icon: '📊', href: '/dashboard/reports', color: '#F97316' },
    { label: 'الإشعارات', icon: '🔔', href: '/dashboard/notifications', color: '#A855F7' },
    { label: 'السلوك', icon: '⭐', href: '/dashboard/behavior', color: '#EC4899' },
    { label: 'المكتبة', icon: '📚', href: '/dashboard/library', color: '#14B8A6' },
    { label: 'النقل', icon: '🚌', href: '/dashboard/transport', color: '#F59E0B' },
  ];

  const tabs = [
    { id: 'overview', label: '📊 نظرة عامة' },
    { id: 'students', label: '🎓 الطلاب' },
    { id: 'teachers', label: '👨‍🏫 المعلمين' },
    { id: 'classes', label: '🏫 الفصول' },
  ];

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: 20,
  };

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#C9A227', fontSize: 26, fontWeight: 800, margin: 0 }}>
            🏫 لوحة تحكم المدير
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '6px 0 0', fontSize: 14 }}>
            مرحباً {user.name} | {user.school_name || 'المدرسة'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/dashboard/notifications" style={{ padding: '8px 16px', background: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, color: '#C9A227', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            🔔 الإشعارات
          </Link>
        </div>
      </div>

      {/* التبويبات */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #C9A227, #E8C547)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? '#0D1B2A' : 'rgba(255,255,255,0.7)',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>
      ) : activeTab === 'overview' ? (
        <>
          {/* بطاقات الإحصاءات */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            {statCards.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{ ...cardStyle, cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = s.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                      <div style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
                    </div>
                    <div style={{ fontSize: 32, opacity: 0.8 }}>{s.icon}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* إجراءات سريعة */}
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 16 }}>⚡ إجراءات سريعة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
            {quickActions.map((a, i) => (
              <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{ ...cardStyle, textAlign: 'center', cursor: 'pointer', padding: 16, transition: 'all 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = a.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ color: a.color, fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* آخر الطلاب */}
          <div style={cardStyle}>
            <h3 style={{ color: '#C9A227', fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>🎓 آخر الطلاب المسجلين</h3>
            {recentStudents.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 20 }}>لا يوجد طلاب</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['الاسم', 'البريد', 'الجنس', 'تاريخ التسجيل'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((s: any, i: number) => (
                      <tr key={i}>
                        <td style={{ padding: '10px 12px', color: 'white', fontSize: 14, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.name || s.full_name}</td>
                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.email}</td>
                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.gender === 'male' ? '👦 ذكر' : '👧 أنثى'}</td>
                        <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'students' ? (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>🎓 قائمة الطلاب</h3>
            <Link href="/dashboard/students" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#0D1B2A', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة الطلاب ←
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>لا يوجد طلاب مسجلين</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['#', 'الاسم', 'البريد', 'الجنس', 'الحالة'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((s: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.4)', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', color: 'white', fontSize: 14, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.name || s.full_name}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.email}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.gender === 'male' ? '👦 ذكر' : '👧 أنثى'}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>نشط</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'teachers' ? (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>👨‍🏫 قائمة المعلمين</h3>
            <Link href="/dashboard/teachers" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#0D1B2A', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة المعلمين ←
            </Link>
          </div>
          {teachers.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>لا يوجد معلمين</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
              {teachers.map((t: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👨‍🏫</div>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{t.name || t.full_name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{t.email}</div>
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
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>🏫 الفصول الدراسية</h3>
            <Link href="/dashboard/classes" style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#0D1B2A', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
              إدارة الفصول ←
            </Link>
          </div>
          {classes.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>لا توجد فصول</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {classes.map((c: any, i: number) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🏫</div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{c.name || c.class_name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>السعة: {c.capacity || c.max_students || '—'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>المرحلة: {c.grade_level || c.level || '—'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
