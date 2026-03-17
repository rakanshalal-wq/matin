'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
};

/* ═══════════════════════════════════════════════════════════
   بطاقة إحصاء
═══════════════════════════════════════════════════════════ */
const StatCard = ({ title, value, color, sub, link }: any) => (
  <Link href={link || '#'} style={{ textDecoration: 'none' }}>
    <div style={{
      background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
      border: `1px solid ${color}40`,
      borderRadius: 16,
      padding: '20px 22px',
      cursor: 'pointer',
      transition: 'all 0.25s',
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${color}22`;
        (e.currentTarget as HTMLElement).style.borderColor = `${color}70`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}12`, borderRadius: '0 16px 0 70px' }} />
      <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{title}</div>
      <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{value}</div>
      {sub && <div style={{ color: color, fontSize: 11, marginTop: 8, fontWeight: 700 }}>↑ {sub}</div>}
    </div>
  </Link>
);

/* ═══════════════════════════════════════════════════════════
   بطاقة قسم رئيسي
═══════════════════════════════════════════════════════════ */
const SectionCard = ({ label, href, color, count }: any) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      background: `${color}0D`,
      border: `1px solid ${color}20`,
      borderRadius: 10,
      padding: '16px 14px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = `${color}1A`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = `${color}0D`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.borderColor = `${color}20`;
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, margin: '0 auto 10px' }} />
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{label}</div>
      {count !== null && count !== undefined && (
        <div style={{ color: color, fontSize: 18, fontWeight: 800, marginTop: 6 }}>{count}</div>
      )}
    </div>
  </Link>
);

export default function SchoolOwnerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (token) {
      fetch('/api/auth/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user);
            localStorage.setItem('matin_user', JSON.stringify(data.user));
            loadAll(data.user);
          } else { window.location.href = '/login'; }
        }).catch(() => setLoading(false));
    } else {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (u.id) { setUser(u); loadAll(u); }
      else { window.location.href = '/login'; }
    }
  }, []);

  const loadAll = async (u: any) => {
    try {
      const headers = getHeaders();
      const [statsRes, schoolsRes, examsRes, admissionsRes, activityRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers }),
        fetch('/api/schools', { headers }),
        fetch('/api/exams?limit=5', { headers }),
        fetch('/api/admission?status=pending&limit=5', { headers }),
        fetch('/api/activity-log?limit=8', { headers }),
      ]);
      const [statsData, schoolsData, examsData, admissionsData, activityData] = await Promise.all([
        statsRes.json(), schoolsRes.json(), examsRes.json(), admissionsRes.json(), activityRes.json()
      ]);
      setStats(statsData || {});
      const schools = Array.isArray(schoolsData) ? schoolsData : [];
      if (schools.length > 0) setSchool(schools[0]);
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 5) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 5) : []);
      setRecentActivity(Array.isArray(activityData) ? activityData.slice(0, 8) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  };

  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid rgba(201,168,76,0.15)',
          borderTopColor: '#C9A84C',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>

      {/* ══════════════════════════════════════════
          بطاقة الترحيب بمالك المدرسة
      ══════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(201,168,76,0.05) 50%, rgba(16,16,38,0.8) 100%)',
        border: '1px solid rgba(59,130,246,0.15)',
        borderRadius: 18,
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: 'rgba(59,130,246,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, background: 'rgba(201,168,76,0.03)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {school?.logo_url || school?.logo ? (
              <img src={school.logo_url || school.logo} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', border: '2px solid rgba(59,130,246,0.25)' }} />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: 14,
                background: 'rgba(59,130,246,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 900, color: '#3B82F6',
                border: '2px solid rgba(59,130,246,0.2)',
              }}>
                {school?.name_ar?.charAt(0) || school?.name?.charAt(0) || 'م'}
              </div>
            )}
            <div>
              <div style={{ color: 'rgba(59,130,246,0.8)', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                {greeting()}، {user?.name?.split(' ')[0] || 'مرحباً'}
              </div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
                {school?.name_ar || school?.name || 'مدرستك'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>
                  مدرسة
                </span>
                {school?.subscription_status === 'active' ? (
                  <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
                    اشتراك نشط
                  </span>
                ) : (
                  <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)' }}>
                    اشتراك منتهي
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>
              {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 }}>
              {days[time.getDay()]}، {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          بطاقات الإحصاء الرئيسية
      ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="إجمالي الطلاب" value={stats.students ?? '—'} color="#3B82F6" sub={stats.new_students ? `+${stats.new_students} هذا الشهر` : undefined} link="/dashboard/students" />
        <StatCard title="المعلمون" value={stats.teachers ?? '—'} color="#8B5CF6" link="/dashboard/teachers" />
        <StatCard title="الفصول الدراسية" value={stats.classes ?? '—'} color="#10B981" link="/dashboard/classes" />
        <StatCard title="الاختبارات النشطة" value={stats.exams ?? '—'} color="#F59E0B" link="/dashboard/exams" />
        <StatCard title="نسبة الحضور" value={stats.attendance_rate ? `${stats.attendance_rate}٪` : '—'} color="#06B6D4" sub="متوسط هذا الأسبوع" link="/dashboard/attendance" />
        <StatCard title="الإيرادات هذا الشهر" value={stats.revenue ? `${stats.revenue} ر.س` : '—'} color="#C9A84C" link="/dashboard/finance" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* ══════════════════════════════════════════
            الأقسام الرئيسية
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            الأقسام الرئيسية
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'الطلاب', href: '/dashboard/students', color: '#3B82F6', count: stats.students },
              { label: 'المعلمون', href: '/dashboard/teachers', color: '#8B5CF6', count: stats.teachers },
              { label: 'الفصول', href: '/dashboard/classes', color: '#10B981', count: stats.classes },
              { label: 'الاختبارات', href: '/dashboard/exams', color: '#EF4444', count: stats.exams },
              { label: 'الحضور', href: '/dashboard/attendance', color: '#06B6D4', count: null },
              { label: 'الدرجات', href: '/dashboard/grades', color: '#A78BFA', count: null },
              { label: 'الجداول', href: '/dashboard/schedules', color: '#F59E0B', count: null },
              { label: 'الواجبات', href: '/dashboard/homework', color: '#EC4899', count: null },
              { label: 'المكتبة', href: '/dashboard/library', color: '#14B8A6', count: null },
            ].map((item, i) => (
              <SectionCard key={i} {...item} />
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            الإدارة والموارد البشرية
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            الإدارة والموارد البشرية
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'الموظفون', href: '/dashboard/employees', color: '#84CC16', count: null },
              { label: 'الرواتب', href: '/dashboard/salaries', color: '#22D3EE', count: null },
              { label: 'الإجازات', href: '/dashboard/leaves', color: '#FB923C', count: null },
              { label: 'المالية', href: '/dashboard/finance', color: '#C9A84C', count: null },
              { label: 'النقل', href: '/dashboard/transport', color: '#F43F5E', count: null },
              { label: 'الصحة', href: '/dashboard/health', color: '#34D399', count: null },
              { label: 'الكافتيريا', href: '/dashboard/cafeteria', color: '#FBBF24', count: null },
              { label: 'الإعدادات', href: '/dashboard/settings', color: '#94A3B8', count: null },
              { label: 'التقارير', href: '/dashboard/reports', color: '#F97316', count: null },
            ].map((item, i) => (
              <SectionCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* ══════════════════════════════════════════
            الاختبارات القادمة
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>الاختبارات القادمة</div>
            <Link href="/dashboard/exams" style={{ color: '#C9A84C', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>عرض الكل</Link>
          </div>
          {upcomingExams.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد اختبارات قادمة</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingExams.map((exam: any, i: number) => (
                <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 8, padding: '10px 14px' }}>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{exam.title || exam.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>
                    {exam.class_name || exam.subject} — {exam.date ? new Date(exam.date).toLocaleDateString('ar-SA') : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            طلبات الانضمام المعلقة
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>طلبات الانضمام</div>
            <Link href="/dashboard/admissions" style={{ color: '#C9A84C', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>عرض الكل</Link>
          </div>
          {pendingAdmissions.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد طلبات معلقة</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingAdmissions.map((req: any, i: number) => (
                <div key={i} style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{req.student_name || req.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 2 }}>{req.grade || req.level}</div>
                  </div>
                  <Link href={`/dashboard/admissions/${req.id}`} style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontSize: 11, padding: '4px 10px', borderRadius: 6, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(245,158,11,0.2)' }}>
                    مراجعة
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            النشاط الأخير
        ══════════════════════════════════════════ */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            النشاط الأخير
          </div>
          {recentActivity.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا يوجد نشاط حديث</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recentActivity.map((act: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#C9A84C', marginTop: 5, flexShrink: 0 }} />
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{act.description || act.action}</div>
                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 2 }}>
                      {act.created_at ? new Date(act.created_at).toLocaleString('ar-SA') : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          رابط المدرسة وإدارة الصفحة
      ══════════════════════════════════════════ */}
      {school?.code && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 14, padding: '20px 24px', marginBottom: 24 }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            صفحة المدرسة العامة
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>matin.ink/school/</span>
                <span style={{ color: '#C9A84C', fontSize: 12, fontWeight: 700 }}>{school.code}</span>
                <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/school/${school.code}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A84C', fontSize: 12, fontWeight: 700 }}>
                  نسخ
                </button>
              </div>
              {school.custom_domain && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10B981', fontSize: 12 }}>{school.custom_domain}</span>
                  {school.domain_verified && <span style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>متحقق</span>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`https://matin.ink/school/${school.code}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(201,168,76,0.25)' }}>
                معاينة الصفحة
              </a>
              <Link href="/dashboard/school-page" style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)' }}>
                تعديل الصفحة
              </Link>
              <Link href="/dashboard/settings" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)' }}>
                ربط دومين
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          التعليم الإلكتروني والذكاء الاصطناعي
      ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            التعليم الإلكتروني
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'المحاضرات', href: '/dashboard/lectures', color: '#6366F1' },
              { label: 'البث المباشر', href: '/dashboard/live-stream', color: '#EF4444' },
              { label: 'بنك الأسئلة', href: '/dashboard/question-bank', color: '#14B8A6' },
              { label: 'المكتبة', href: '/dashboard/library', color: '#A855F7' },
              { label: 'الواجبات', href: '/dashboard/homework', color: '#EC4899' },
              { label: 'الجداول', href: '/dashboard/schedules', color: '#0EA5E9' },
            ].map((item, i) => (
              <SectionCard key={i} {...item} />
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>
            الذكاء الاصطناعي والتحليلات
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'المساعد الذكي', href: '/dashboard/ai-assistant', color: '#A78BFA' },
              { label: 'تحليلات المنصة', href: '/dashboard/reports', color: '#60A5FA' },
              { label: 'توليد الأسئلة', href: '/dashboard/ai-questions', color: '#F472B6' },
              { label: 'الرسائل', href: '/dashboard/messages', color: '#34D399' },
              { label: 'الإشعارات', href: '/dashboard/notifications', color: '#FB923C' },
              { label: 'المتجر', href: '/dashboard/store', color: '#E879F9' },
            ].map((item, i) => (
              <SectionCard key={i} {...item} />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
