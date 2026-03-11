'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const INSTITUTION_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  school: { label: 'مدرسة', icon: '🏫', color: '#3B82F6' },
  university: { label: 'جامعة', icon: '🎓', color: '#8B5CF6' },
  institute: { label: 'معهد', icon: '🏛', color: '#10B981' },
  kindergarten: { label: 'حضانة', icon: '🌱', color: '#F59E0B' },
  training_center: { label: 'مركز تدريب', icon: '💼', color: '#EF4444' },
  college: { label: 'كلية', icon: '📚', color: '#06B6D4' },
};

const StatCard = ({ title, value, icon, color, sub, link }: any) => (
  <Link href={link || '#'} style={{ textDecoration: 'none' }}>
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
      border: `1px solid ${color}30`,
      borderRadius: 16,
      padding: '20px 24px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}20`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${color}10`, borderRadius: '0 16px 0 80px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 8 }}>{title}</div>
          <div style={{ color: '#fff', fontSize: 32, fontWeight: 800, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ color: color, fontSize: 12, marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 32, opacity: 0.9 }}>{icon}</div>
      </div>
    </div>
  </Link>
);

const QuickAction = ({ label, icon, href, color }: any) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      background: `${color}15`,
      border: `1px solid ${color}30`,
      borderRadius: 12,
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}25`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}15`; }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>{label}</span>
    </div>
  </Link>
);

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
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
      const [statsRes, schoolsRes, examsRes, admissionsRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers }),
        fetch('/api/schools', { headers }),
        fetch('/api/exams?limit=5', { headers }),
        fetch('/api/admissions?status=pending&limit=5', { headers }),
      ]);
      const [statsData, schoolsData, examsData, admissionsData] = await Promise.all([
        statsRes.json(), schoolsRes.json(), examsRes.json(), admissionsRes.json()
      ]);
      setStats(statsData || {});
      const schools = Array.isArray(schoolsData) ? schoolsData : [];
      if (schools.length > 0) setSchool(schools[0]);
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 5) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 5) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const instType = school?.institution_type ? INSTITUTION_TYPES[school.institution_type] || INSTITUTION_TYPES.school : INSTITUTION_TYPES.school;
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
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <div style={{ color: '#9CA3AF' }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>

      {/* ══════════════════════════════════════════ */}
      {/* الهيدر — تحية + معلومات المؤسسة */}
      {/* ══════════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1a2d4a 50%, #0D1B2A 100%)',
        border: '1px solid rgba(201,162,39,0.2)',
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* خلفية زخرفية */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: 'rgba(201,162,39,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, background: 'rgba(59,130,246,0.05)', borderRadius: '50%' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {school?.logo_url || school?.logo ? (
              <img src={school.logo_url || school.logo} alt="" style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', border: '2px solid rgba(201,162,39,0.3)' }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: 16, background: `${instType.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, border: `2px solid ${instType.color}30` }}>
                {instType.icon}
              </div>
            )}
            <div>
              <div style={{ color: '#C9A227', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                {greeting()}، {user?.name?.split(' ')[0] || 'مرحباً'} 👋
              </div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
                {school?.name_ar || school?.name || 'مؤسستك التعليمية'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ background: `${instType.color}20`, color: instType.color, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                  {instType.icon} {instType.label}
                </span>
                {school?.subscription_status === 'active' ? (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                    ✓ اشتراك نشط
                  </span>
                ) : (
                  <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>
                    ⚠ اشتراك منتهي
                  </span>
                )}
                {school?.code && (
                  <span style={{ background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>
                    كود: {school.code}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
              {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div style={{ color: '#9CA3AF', fontSize: 13, marginTop: 4 }}>
              {days[time.getDay()]}، {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Link href="/dashboard/school-page" style={{
                background: 'rgba(201,162,39,0.15)', color: '#C9A227', fontSize: 12, padding: '6px 14px',
                borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(201,162,39,0.3)',
              }}>
                🌐 صفحة المؤسسة
              </Link>
              <Link href="/dashboard/settings" style={{
                background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', fontSize: 12, padding: '6px 14px',
                borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
              }}>
                ⚙️ الإعدادات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* الإحصائيات الرئيسية */}
      {/* ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard title="إجمالي الطلاب" value={stats.students || stats.total_students || 0} icon="👨‍🎓" color="#3B82F6" sub={`+${stats.new_students || 0} هذا الشهر`} link="/dashboard/students" />
        <StatCard title="المعلمون" value={stats.teachers || stats.total_teachers || 0} icon="👩‍🏫" color="#8B5CF6" sub="نشطون" link="/dashboard/teachers" />
        <StatCard title="الفصول" value={stats.classes || stats.total_classes || 0} icon="🏛" color="#10B981" sub="فصل دراسي" link="/dashboard/classes" />
        <StatCard title="الحضور اليوم" value={`${stats.attendance_rate || 0}%`} icon="✋" color="#F59E0B" sub="معدل الحضور" link="/dashboard/attendance" />
        <StatCard title="الاختبارات" value={stats.exams || 0} icon="📝" color="#EF4444" sub="هذا الفصل" link="/dashboard/exams" />
        <StatCard title="طلبات الانضمام" value={stats.pending_admissions || pendingAdmissions.length || 0} icon="📋" color="#06B6D4" sub="بانتظار المراجعة" link="/dashboard/admission" />
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* الإجراءات السريعة */}
      {/* ══════════════════════════════════════════ */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 28,
      }}>
        <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          ⚡ إجراءات سريعة
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          <QuickAction label="إضافة طالب" icon="👨‍🎓" href="/dashboard/students" color="#3B82F6" />
          <QuickAction label="إضافة معلم" icon="👩‍🏫" href="/dashboard/teachers" color="#8B5CF6" />
          <QuickAction label="اختبار جديد" icon="📝" href="/dashboard/exams" color="#EF4444" />
          <QuickAction label="محاضرة جديدة" icon="🎤" href="/dashboard/lectures" color="#10B981" />
          <QuickAction label="إرسال إشعار" icon="🔔" href="/dashboard/notifications" color="#F59E0B" />
          <QuickAction label="تقرير مالي" icon="💰" href="/dashboard/finance" color="#C9A227" />
          <QuickAction label="جدول الحصص" icon="📅" href="/dashboard/schedules" color="#06B6D4" />
          <QuickAction label="المساعد الذكي" icon="🤖" href="/dashboard/ai-assistant" color="#A78BFA" />
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* المحتوى الرئيسي — عمودين */}
      {/* ══════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* طلبات الانضمام المعلقة */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>📋 طلبات الانضمام</div>
            <Link href="/dashboard/admission" style={{ color: '#C9A227', fontSize: 12, textDecoration: 'none' }}>عرض الكل ←</Link>
          </div>
          {pendingAdmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B7280' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 13 }}>لا توجد طلبات معلقة</div>
            </div>
          ) : pendingAdmissions.map((a: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < pendingAdmissions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div>
                <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 600 }}>{a.student_name || a.name || 'طالب'}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12 }}>{a.grade || a.class_name || 'غير محدد'}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href="/dashboard/admission" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, padding: '4px 10px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>قبول</Link>
                <Link href="/dashboard/admission" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 11, padding: '4px 10px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>رفض</Link>
              </div>
            </div>
          ))}
        </div>

        {/* الاختبارات القادمة */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>📝 الاختبارات القادمة</div>
            <Link href="/dashboard/exams" style={{ color: '#C9A227', fontSize: 12, textDecoration: 'none' }}>عرض الكل ←</Link>
          </div>
          {upcomingExams.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B7280' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
              <div style={{ fontSize: 13 }}>لا توجد اختبارات قادمة</div>
            </div>
          ) : upcomingExams.map((e: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < upcomingExams.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div>
                <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 600 }}>{e.title_ar || e.title}</div>
                <div style={{ color: '#9CA3AF', fontSize: 12 }}>{e.subject || ''} • {e.duration ? `${e.duration} دقيقة` : ''}</div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  background: e.status === 'ACTIVE' ? 'rgba(239,68,68,0.15)' : e.status === 'PUBLISHED' ? 'rgba(59,130,246,0.15)' : 'rgba(156,163,175,0.15)',
                  color: e.status === 'ACTIVE' ? '#EF4444' : e.status === 'PUBLISHED' ? '#3B82F6' : '#9CA3AF',
                  fontSize: 11, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                }}>
                  {e.status === 'ACTIVE' ? '⏱ جاري' : e.status === 'PUBLISHED' ? '📢 منشور' : '📝 مسودة'}
                </div>
                {e.scheduled_at && (
                  <div style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                    {new Date(e.scheduled_at).toLocaleDateString('ar-SA')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* الرابط العام للمؤسسة */}
      {/* ══════════════════════════════════════════ */}
      {school && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.04) 100%)',
          border: '1px solid rgba(201,162,39,0.2)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 28,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ color: '#C9A227', fontSize: 14, fontWeight: 700, marginBottom: 6 }}>🌐 الرابط العام للمؤسسة</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#9CA3AF', fontSize: 12 }}>matin.ink/school/</span>
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{school.code}</span>
                  <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/school/${school.code}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A227', fontSize: 14 }}>📋</button>
                </div>
                {school.custom_domain && (
                  <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#10B981', fontSize: 12 }}>🔗 {school.custom_domain}</span>
                    {school.domain_verified && <span style={{ color: '#10B981', fontSize: 11 }}>✓ مُتحقق</span>}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href={`https://matin.ink/school/${school.code}`} target="_blank" rel="noreferrer" style={{
                background: 'rgba(201,162,39,0.15)', color: '#C9A227', fontSize: 13, padding: '8px 18px',
                borderRadius: 10, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(201,162,39,0.3)',
              }}>
                👁 معاينة الصفحة
              </a>
              <Link href="/dashboard/school-page" style={{
                background: 'rgba(59,130,246,0.15)', color: '#3B82F6', fontSize: 13, padding: '8px 18px',
                borderRadius: 10, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(59,130,246,0.3)',
              }}>
                ✏️ تعديل الصفحة
              </Link>
              <Link href="/dashboard/settings" style={{
                background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', fontSize: 13, padding: '8px 18px',
                borderRadius: 10, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
              }}>
                🔗 ربط دومين
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* الخدمات المتاحة حسب نوع المؤسسة */}
      {/* ══════════════════════════════════════════ */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          🗂 الأقسام الرئيسية
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { label: 'الطلاب', icon: '👨‍🎓', href: '/dashboard/students', color: '#3B82F6', count: stats.students || 0 },
            { label: 'المعلمون', icon: '👩‍🏫', href: '/dashboard/teachers', color: '#8B5CF6', count: stats.teachers || 0 },
            { label: 'الفصول', icon: '🏛', href: '/dashboard/classes', color: '#10B981', count: stats.classes || 0 },
            { label: 'الاختبارات', icon: '📝', href: '/dashboard/exams', color: '#EF4444', count: stats.exams || 0 },
            { label: 'المحاضرات', icon: '🎤', href: '/dashboard/lectures', color: '#F59E0B', count: null },
            { label: 'الحضور', icon: '✋', href: '/dashboard/attendance', color: '#06B6D4', count: null },
            { label: 'الدرجات', icon: '📊', href: '/dashboard/grades', color: '#A78BFA', count: null },
            { label: 'المالية', icon: '💰', href: '/dashboard/finance', color: '#C9A227', count: null },
            { label: 'الرسائل', icon: '✉️', href: '/dashboard/messages', color: '#34D399', count: null },
            { label: 'التقارير', icon: '📈', href: '/dashboard/reports', color: '#FB923C', count: null },
            { label: 'المتجر', icon: '🛒', href: '/dashboard/store', color: '#E879F9', count: null },
            { label: 'المساعد AI', icon: '🤖', href: '/dashboard/ai-assistant', color: '#818CF8', count: null },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: `${item.color}10`,
                border: `1px solid ${item.color}25`,
                borderRadius: 12,
                padding: '14px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}20`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}10`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                {item.count !== null && (
                  <div style={{ color: item.color, fontSize: 16, fontWeight: 800, marginTop: 4 }}>{item.count}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
