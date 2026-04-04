'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const StatCard = ({ title, value, sub, color }: { title: string; value: any; sub: string; color: string }) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value}</div>
    <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>
  </div>
);

export default function PresidentDashboard() {
  const router = useRouter();
  const [user] = useState<any>({ name: 'أ.د. عبدالله المطيري', role: 'رئيس الجامعة' });
  const [stats, setStats] = useState<any>({ students: 0, colleges: 0, faculty: 0, pending_fees: 0, avg_gpa: 0 });
  const [colleges, setColleges] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<string>('overview');

  const fallbackStats = { students: 14820, colleges: 12, faculty: 634, pending_fees: 48, avg_gpa: 3.41 };
  const fallbackColleges = [
    { id: 1, name: 'كلية الهندسة', students: 3200, faculty: 120, color: '#60A5FA' },
    { id: 2, name: 'كلية الطب', students: 2100, faculty: 98, color: '#A78BFA' },
    { id: 3, name: 'كلية الحاسب والمعلومات', students: 2800, faculty: 90, color: '#34D399' },
    { id: 4, name: 'كلية الأعمال', students: 1900, faculty: 85, color: '#FBBF24' },
    { id: 5, name: 'كلية العلوم', students: 1540, faculty: 76, color: '#F472B6' },
    { id: 6, name: 'كلية الشريعة', students: 980, faculty: 55, color: '#FB923C' },
  ];
  const fallbackAdmissions = [
    { id: 1, name: 'محمد ناصر الغامدي', college: 'كلية الهندسة', date: '2026-03-28', status: 'pending' },
    { id: 2, name: 'سارة علي المطيري', college: 'كلية الطب', date: '2026-03-27', status: 'pending' },
    { id: 3, name: 'خالد عمر البشري', college: 'كلية الحاسب', date: '2026-03-25', status: 'approved' },
    { id: 4, name: 'نورة سعد الحربي', college: 'كلية الأعمال', date: '2026-03-24', status: 'rejected' },
    { id: 5, name: 'عبدالرحمن يوسف', college: 'كلية العلوم', date: '2026-03-22', status: 'pending' },
  ];
  const fallbackActivity = [
    { id: 1, text: 'تم قبول طلب القبول لمحمد الغامدي في كلية الهندسة', time: 'منذ 10 دقائق', icon: '✓', color: '#34D399' },
    { id: 2, text: 'تم تحديث خطة الدراسة لكلية الطب للفصل الثاني', time: 'منذ ساعة', icon: '📋', color: '#60A5FA' },
    { id: 3, text: 'إضافة عضو هيئة تدريس جديد في قسم البرمجيات', time: 'منذ 3 ساعات', icon: '👤', color: '#A78BFA' },
    { id: 4, text: 'رفع تقرير الرسوم الدراسية للفصل الحالي', time: 'منذ 5 ساعات', icon: '💰', color: '#FBBF24' },
    { id: 5, text: 'اعتماد جدول الاختبارات النهائية للفصل الثاني', time: 'أمس', icon: '📅', color: '#FB923C' },
  ];

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, collegesRes, admissionsRes, activityRes] = await Promise.allSettled([
          fetch('/api/university/president?type=stats'),
          fetch('/api/university/president?type=colleges'),
          fetch('/api/university/president?type=admissions'),
          fetch('/api/university/president?type=activity'),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const d = await statsRes.value.json();
          setStats(d);
        } else {
          setStats(fallbackStats);
        }

        if (collegesRes.status === 'fulfilled' && collegesRes.value.ok) {
          const d = await collegesRes.value.json();
          setColleges(Array.isArray(d) ? d : d.data ?? fallbackColleges);
        } else {
          setColleges(fallbackColleges);
        }

        if (admissionsRes.status === 'fulfilled' && admissionsRes.value.ok) {
          const d = await admissionsRes.value.json();
          setAdmissions(Array.isArray(d) ? d : d.data ?? fallbackAdmissions);
        } else {
          setAdmissions(fallbackAdmissions);
        }

        if (activityRes.status === 'fulfilled' && activityRes.value.ok) {
          const d = await activityRes.value.json();
          setActivity(Array.isArray(d) ? d : d.data ?? fallbackActivity);
        } else {
          setActivity(fallbackActivity);
        }
      } catch {
        setStats(fallbackStats);
        setColleges(fallbackColleges);
        setAdmissions(fallbackAdmissions);
        setActivity(fallbackActivity);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWeek = 10;
  const totalWeeks = 16;
  const semesterProgress = Math.round((currentWeek / totalWeeks) * 100);

  const quickActions = [
    { label: 'الكليات والأقسام', icon: '🏛️', path: '/university/president/colleges' },
    { label: 'طلبات القبول', icon: '📋', path: '/university/president/admissions' },
    { label: 'هيئة التدريس', icon: '👨‍🏫', path: '/university/president/faculty' },
    { label: 'الرسوم', icon: '💰', path: '/university/president/fees' },
    { label: 'التقارير', icon: '📊', path: '/university/president/reports' },
    { label: 'الإعدادات', icon: '⚙️', path: '/university/president/settings' },
  ];

  const statusLabel: any = { pending: 'قيد الانتظار', approved: 'مقبول', rejected: 'مرفوض' };
  const statusColor: any = { pending: '#FBBF24', approved: '#34D399', rejected: '#F87171' };

  const tabs = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'colleges', label: 'الكليات' },
    { key: 'admissions', label: 'طلبات القبول' },
    { key: 'activity', label: 'سجل النشاط' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #60A5FA', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>جارٍ تحميل البيانات...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060E', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl', color: '#fff' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } *, *::before, *::after { box-sizing: border-box; }`}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>منصة ماتن</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>نظام إدارة الجامعة</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#60A5FA' }}>{user.role}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(96,165,250,0.13), rgba(167,139,250,0.13))', border: '2px solid rgba(96,165,250,0.27)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px 40px' }}>
        {/* Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff' }}>لوحة تحكم رئيس الجامعة</h1>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>الفصل الدراسي الثاني 1446هـ — الأسبوع {currentWeek} من {totalWeeks}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => router.push('/university/president/reports')}
              style={{ padding: '8px 18px', borderRadius: 10, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)', color: '#60A5FA', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
            >
              📊 التقارير
            </button>
            <button
              onClick={() => router.push('/university/president/settings')}
              style={{ padding: '8px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
            >
              ⚙️ الإعدادات
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '2px solid #60A5FA' : '2px solid transparent',
                color: tab === t.key ? '#60A5FA' : 'rgba(255,255,255,0.45)',
                fontSize: 14,
                fontWeight: tab === t.key ? 700 : 400,
                cursor: 'pointer',
                fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW ─── */}
        {tab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard title="طلاب الجامعة" value={(stats.students ?? 0).toLocaleString()} sub="إجمالي المسجلين" color="#60A5FA" />
              <StatCard title="الكليات" value={stats.colleges} sub="كليات نشطة" color="#A78BFA" />
              <StatCard title="هيئة التدريس" value={stats.faculty} sub="عضو تدريس" color="#34D399" />
              <StatCard title="رسوم معلقة" value={stats.pending_fees} sub="طالب لم يسدد" color="#F87171" />
              <StatCard title="متوسط المعدلات" value={typeof stats.avg_gpa === 'number' ? stats.avg_gpa.toFixed(2) : stats.avg_gpa} sub="GPA متوسط الجامعة" color="#FBBF24" />
            </div>

            {/* Semester Progress */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>تقدم الفصل الدراسي</div>
                <div style={{ fontSize: 13, color: '#60A5FA', fontWeight: 600 }}>الأسبوع {currentWeek} / {totalWeeks}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                <div style={{ width: `${semesterProgress}%`, height: '100%', background: 'linear-gradient(90deg, #60A5FA, #A78BFA)', borderRadius: 8 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>بداية الفصل</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{semesterProgress}% مكتمل</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>نهاية الفصل</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', marginBottom: 28 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>الوصول السريع</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                  >
                    <span style={{ fontSize: 24 }}>{action.icon}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, textAlign: 'center' }}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colleges + Recent Admissions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>الكليات</div>
                  <button onClick={() => setTab('colleges')} style={{ fontSize: 12, color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>عرض الكل ←</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {colleges.slice(0, 4).map((c: any) => (
                    <div
                      key={c.id ?? c.name}
                      onClick={() => router.push(`/university/president/colleges/${c.id}`)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${(c.color ?? '#60A5FA')}18`, borderRadius: 10, cursor: 'pointer' }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.faculty} عضو تدريس</div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: c.color ?? '#60A5FA' }}>{(c.students ?? 0).toLocaleString()}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>طالب</div>
                      </div>
                    </div>
                  ))}
                  {colleges.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد كليات</div>}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>طلبات القبول الحديثة</div>
                  <button onClick={() => setTab('admissions')} style={{ fontSize: 12, color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>عرض الكل ←</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {admissions.slice(0, 4).map((a: any) => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{a.college}</div>
                      </div>
                      <span style={{ fontSize: 11, color: statusColor[a.status] ?? '#fff', background: `${statusColor[a.status] ?? '#fff'}18`, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                        {statusLabel[a.status] ?? a.status}
                      </span>
                    </div>
                  ))}
                  {admissions.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد طلبات</div>}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>آخر الأنشطة</div>
                <button onClick={() => setTab('activity')} style={{ fontSize: 12, color: '#60A5FA', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>عرض الكل ←</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activity.slice(0, 4).map((item: any, i: number) => (
                  <div key={item.id} style={{ display: 'flex', gap: 16, paddingBottom: i < 3 ? 20 : 0, position: 'relative' }}>
                    {i < 3 && <div style={{ position: 'absolute', right: 19, top: 40, bottom: 0, width: 2, background: 'rgba(255,255,255,0.05)' }} />}
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${item.color}18`, border: `2px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item.text}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.time}</div>
                    </div>
                  </div>
                ))}
                {activity.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: '20px 0' }}>لا يوجد نشاط مسجل</div>}
              </div>
            </div>
          </>
        )}

        {/* ─── COLLEGES ─── */}
        {tab === 'colleges' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {colleges.map((c: any) => (
              <div
                key={c.id ?? c.name}
                onClick={() => router.push(`/university/president/colleges/${c.id}`)}
                style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${(c.color ?? '#60A5FA')}20`, borderRadius: 14, padding: '24px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${c.color ?? '#60A5FA'}0A`, borderRadius: '0 14px 0 80px' }} />
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{c.name}</div>
                <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c.color ?? '#60A5FA' }}>{(c.students ?? 0).toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>طالب</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>{c.faculty}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>عضو تدريس</div>
                  </div>
                </div>
              </div>
            ))}
            {colleges.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, padding: '40px 0' }}>لا توجد كليات مسجلة</div>}
          </div>
        )}

        {/* ─── ADMISSIONS ─── */}
        {tab === 'admissions' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>طلبات القبول</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{admissions.length} طلب</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['المتقدم', 'الكلية', 'التاريخ', 'الحالة', 'إجراء'].map((h) => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admissions.map((a: any, i: number) => (
                  <tr key={a.id} style={{ borderBottom: i < admissions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{a.college}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{a.date}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, color: statusColor[a.status] ?? '#fff', background: `${statusColor[a.status] ?? '#fff'}18`, padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                        {statusLabel[a.status] ?? a.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {a.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => setAdmissions((prev) => prev.map((x: any) => x.id === a.id ? { ...x, status: 'approved' } : x))}
                            style={{ padding: '5px 14px', borderRadius: 8, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                          >قبول</button>
                          <button
                            onClick={() => setAdmissions((prev) => prev.map((x: any) => x.id === a.id ? { ...x, status: 'rejected' } : x))}
                            style={{ padding: '5px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
                          >رفض</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>لا توجد طلبات قبول</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── ACTIVITY ─── */}
        {tab === 'activity' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '24px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 24 }}>سجل النشاط</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {activity.map((item: any, i: number) => (
                <div key={item.id} style={{ display: 'flex', gap: 16, paddingBottom: i < activity.length - 1 ? 22 : 0, position: 'relative' }}>
                  {i < activity.length - 1 && <div style={{ position: 'absolute', right: 19, top: 42, bottom: 0, width: 2, background: 'rgba(255,255,255,0.05)' }} />}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${item.color}18`, border: `2px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1, paddingTop: 4 }}>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.time}</div>
                  </div>
                </div>
              ))}
              {activity.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, textAlign: 'center', padding: '30px 0' }}>لا يوجد نشاط مسجل</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
