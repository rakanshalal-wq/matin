'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : null;
  return { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
};

const StatCard = ({ title, value, color, sub, link }: any) => (
  <Link href={link || '#'} style={{ textDecoration: 'none' }}>
    <div
      style={{ background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`, border: `1px solid ${color}40`, borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 32px ${color}18`; el.style.borderColor = `${color}50`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none'; el.style.borderColor = `${color}25`; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${color}08`, borderRadius: '0 14px 0 80px' }} />
      <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, marginBottom: 10, fontWeight: 600 }}>{title}</div>
      <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, letterSpacing: -1, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color, fontSize: 11, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
    </div>
  </Link>
);

const SectionCard = ({ label, href, color, count }: any) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div
      style={{ background: `${color}0D`, border: `1px solid ${color}20`, borderRadius: 10, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}1A`; el.style.transform = 'translateY(-2px)'; el.style.borderColor = `${color}40`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}0D`; el.style.transform = 'translateY(0)'; el.style.borderColor = `${color}20`; }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, margin: '0 auto 8px' }} />
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600 }}>{label}</div>
      {count != null && <div style={{ color, fontSize: 16, fontWeight: 800, marginTop: 4 }}>{count}</div>}
    </div>
  </Link>
);

export default function TrainingOwnerDashboard() {
  const [user, setUser]                           = useState<any>(null);
  const [school, setSchool]                       = useState<any>(null);
  const [stats, setStats]                         = useState<any>({});
  const [upcomingExams, setUpcomingExams]         = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
  const [recentActivity, setRecentActivity]       = useState<any[]>([]);
  const [trainers, setTrainers]                   = useState<any[]>([]);
  const [courses, setCourses]                     = useState<any[]>([]);
  const [leads, setLeads]                         = useState<any[]>([]);
  const [loading, setLoading]                     = useState(true);
  const [time, setTime]                           = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (token) {
      fetch('/api/auth/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(d => {
          if (d.valid) { setUser(d.user); localStorage.setItem('matin_user', JSON.stringify(d.user)); loadAll(); }
          else window.location.href = '/login';
        }).catch(() => setLoading(false));
    } else {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (u?.id) { setUser(u); loadAll(); } else window.location.href = '/login';
    }
  }, []);

  const loadAll = async () => {
    try {
      const h = getHeaders();
      const [statsRes, schoolsRes, examsRes, admissionsRes, activityRes, trainersRes, coursesRes, leadsRes] = await Promise.all([
        fetch('/api/dashboard-stats',           { headers: h }),
        fetch('/api/schools',                   { headers: h }),
        fetch('/api/exams?limit=5',             { headers: h }),
        fetch('/api/admission?status=pending',  { headers: h }),
        fetch('/api/activity-log?limit=8',      { headers: h }),
        fetch('/api/trainers',                  { headers: h }),
        fetch('/api/courses',                   { headers: h }),
        fetch('/api/leads',                     { headers: h }),
      ]);
      const [statsData, schoolsData, examsData, admissionsData, activityData, trainersData, coursesData, leadsData] = await Promise.all([
        statsRes.json(), schoolsRes.json(), examsRes.json(), admissionsRes.json(),
        activityRes.json(), trainersRes.json(), coursesRes.json(), leadsRes.json(),
      ]);
      setStats(statsData || {});
      const arr = Array.isArray(schoolsData) ? schoolsData : [];
      if (arr.length > 0) setSchool(arr[0]);
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 5) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 5) : []);
      setRecentActivity(Array.isArray(activityData) ? activityData.slice(0, 8) : []);
      setTrainers(Array.isArray(trainersData) ? trainersData.slice(0, 5) : []);
      setCourses(Array.isArray(coursesData) ? coursesData.slice(0, 5) : []);
      setLeads(Array.isArray(leadsData) ? leadsData.slice(0, 5) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const greeting = () => { const h = time.getHours(); return h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور'; };
  const DAYS   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const ACCENT = '#F97316'; // برتقالي - مناسب للتدريب

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid ${ACCENT}20`, borderTopColor: ACCENT, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', fontFamily: 'IBM Plex Sans Arabic,sans-serif' }}>

      {/* ══ بطاقة الترحيب ══ */}
      <div style={{ background: `linear-gradient(135deg,rgba(249,115,22,0.08) 0%,rgba(201,168,76,0.05) 50%,rgba(16,16,38,0.8) 100%)`, border: `1px solid ${ACCENT}20`, borderRadius: 18, padding: '28px 32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 200, height: 200, background: `${ACCENT}04`, borderRadius: '50%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {school?.logo_url || school?.logo
              ? <img src={school.logo_url || school.logo} alt="" style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', border: `2px solid ${ACCENT}25` }} />
              : <div style={{ width: 64, height: 64, borderRadius: 14, background: `${ACCENT}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: ACCENT, border: `2px solid ${ACCENT}20` }}>{school?.name_ar?.charAt(0) || school?.name?.charAt(0) || 'ت'}</div>
            }
            <div>
              <div style={{ color: `${ACCENT}CC`, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{greeting()}، {user?.name?.split(' ')[0] || 'مرحباً'}</div>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>{school?.name_ar || school?.name || 'مركز التدريب'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <span style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: `1px solid ${ACCENT}25` }}>مركز تدريب</span>
                {school?.subscription_status === 'active'
                  ? <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>اشتراك نشط</span>
                  : <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 11, padding: '3px 10px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(239,68,68,0.2)' }}>اشتراك منتهي</span>
                }
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>{time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 4 }}>{DAYS[time.getDay()]}، {time.getDate()} {MONTHS[time.getMonth()]} {time.getFullYear()}</div>
          </div>
        </div>
      </div>

      {/* ══ بطاقات الإحصاء ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="إجمالي المتدربين"      value={stats.students ?? '—'}                          color={ACCENT}     link="/dashboard/students" />
        <StatCard title="المدربون"               value={trainers.length || stats.teachers || '—'}       color="#3B82F6"    link="/dashboard/trainers" />
        <StatCard title="الدورات التدريبية"      value={courses.length || '—'}                          color="#8B5CF6"    link="/dashboard/courses" />
        <StatCard title="الاختبارات النشطة"      value={stats.active_exams ?? stats.exams ?? '—'}       color="#EF4444"    link="/dashboard/exams" />
        <StatCard title="العملاء المحتملون"      value={leads.length || '—'}                            color="#F59E0B"    link="/dashboard/leads" />
        <StatCard title="الإيرادات هذا الشهر"   value={stats.revenue ? `${stats.revenue} ر.س` : '—'}  color="#C9A84C"    link="/dashboard/finance" />
      </div>

      {/* ══ الأقسام الرئيسية ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* الأقسام التدريبية */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>الأقسام التدريبية</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'المتدربون',       href: '/dashboard/students',    color: '#F97316', count: stats.students },
              { label: 'المدربون',        href: '/dashboard/trainers',    color: '#3B82F6', count: trainers.length || null },
              { label: 'الدورات',         href: '/dashboard/courses',     color: '#8B5CF6', count: courses.length || null },
              { label: 'الاختبارات',      href: '/dashboard/exams',       color: '#EF4444', count: stats.active_exams },
              { label: 'الحضور',          href: '/dashboard/attendance',  color: '#06B6D4', count: null },
              { label: 'الشهادات',        href: '/dashboard/certificates',color: '#34D399', count: null },
              { label: 'الجداول',         href: '/dashboard/schedules',   color: '#F59E0B', count: null },
              { label: 'الواجبات',        href: '/dashboard/homework',    color: '#A78BFA', count: null },
              { label: 'سجلات التدريب',   href: '/dashboard/training',    color: '#14B8A6', count: null },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>

        {/* التسويق والمبيعات */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>التسويق والمبيعات</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'العملاء المحتملون', href: '/dashboard/leads',       color: '#F59E0B', count: leads.length || null },
              { label: 'الكوبونات',         href: '/dashboard/coupons',     color: '#EC4899', count: null },
              { label: 'العمولات',          href: '/dashboard/commissions', color: '#C9A84C', count: null },
              { label: 'الإحالات',          href: '/dashboard/referrals',   color: '#34D399', count: null },
              { label: 'الإعلانات',         href: '/dashboard/ads',         color: '#F97316', count: null },
              { label: 'المتجر',            href: '/dashboard/store',       color: '#E879F9', count: null },
              { label: 'الشراكات',          href: '/dashboard/partners',    color: '#60A5FA', count: null },
              { label: 'الاستبيانات',       href: '/dashboard/surveys',     color: '#A78BFA', count: null },
              { label: 'المجتمع',           href: '/dashboard/community',   color: '#14B8A6', count: null },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* ══ الإدارة والموارد ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* الإدارة والموارد البشرية */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>الإدارة والموارد البشرية</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'الموظفون',    href: '/dashboard/employees',  color: '#84CC16', count: null },
              { label: 'الرواتب',     href: '/dashboard/salaries',   color: '#22D3EE', count: null },
              { label: 'الإجازات',    href: '/dashboard/leaves',     color: '#FB923C', count: null },
              { label: 'المالية',     href: '/dashboard/finance',    color: '#C9A84C', count: null },
              { label: 'العقود',      href: '/dashboard/contracts',  color: '#3B82F6', count: null },
              { label: 'المستلزمات',  href: '/dashboard/inventory',  color: '#F472B6', count: null },
              { label: 'الصحة',       href: '/dashboard/health',     color: '#34D399', count: null },
              { label: 'الإعدادات',   href: '/dashboard/settings',   color: '#94A3B8', count: null },
              { label: 'التقارير',    href: '/dashboard/reports',    color: '#F97316', count: null },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>

        {/* الخدمات الإدارية */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>الخدمات الإدارية</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'الإعلانات',      href: '/dashboard/announcements',  color: '#F97316' },
              { label: 'المهام',         href: '/dashboard/tasks',          color: '#3B82F6' },
              { label: 'الاجتماعات',     href: '/dashboard/meetings',       color: '#8B5CF6' },
              { label: 'الشكاوى',        href: '/dashboard/complaints',     color: '#EF4444' },
              { label: 'الزوار',         href: '/dashboard/visitors',       color: '#06B6D4' },
              { label: 'الأمن',          href: '/dashboard/security',       color: '#F43F5E' },
              { label: 'الطوارئ',        href: '/dashboard/emergencies',    color: '#EF4444' },
              { label: 'النسخ الاحتياطي',href: '/dashboard/backup',         color: '#94A3B8' },
              { label: 'المعرض',         href: '/dashboard/gallery',        color: '#FBBF24' },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* ══ التعليم الإلكتروني والذكاء الاصطناعي ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>التعليم الإلكتروني</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'المحاضرات',     href: '/dashboard/lectures',       color: '#6366F1' },
              { label: 'البث المباشر',  href: '/dashboard/live-stream',    color: '#EF4444' },
              { label: 'بنك الأسئلة',   href: '/dashboard/question-bank',  color: '#14B8A6' },
              { label: 'المكتبة',       href: '/dashboard/library',        color: '#A855F7' },
              { label: 'التسجيلات',     href: '/dashboard/recordings',     color: '#0EA5E9' },
              { label: 'الفيديوهات',    href: '/dashboard/videos',         color: '#F97316' },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>الذكاء الاصطناعي والتواصل</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'المساعد الذكي',  href: '/dashboard/ai-chat',            color: '#A78BFA' },
              { label: 'توليد الأسئلة',  href: '/dashboard/question-bank',      color: '#F472B6' },
              { label: 'التحليلات',      href: '/dashboard/reports',            color: '#60A5FA' },
              { label: 'الرسائل',        href: '/dashboard/messages',           color: '#34D399' },
              { label: 'الإشعارات',      href: '/dashboard/push-notifications', color: '#FB923C' },
              { label: 'الدعم',          href: '/dashboard/support',            color: '#06B6D4' },
            ].map((item, i) => <SectionCard key={i} {...item} />)}
          </div>
        </div>
      </div>

      {/* ══ الدورات + العملاء المحتملون + الاختبارات + النشاط ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* الدورات الحالية */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>الدورات</div>
            <Link href="/dashboard/courses" style={{ color: '#C9A84C', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>عرض الكل</Link>
          </div>
          {courses.length === 0
            ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد دورات</div>
            : courses.map((c: any, i: number) => (
              <div key={i} style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{c.name || c.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>{c.instructor || c.duration || ''}</div>
              </div>
            ))
          }
        </div>

        {/* العملاء المحتملون */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>العملاء المحتملون</div>
            <Link href="/dashboard/leads" style={{ color: '#C9A84C', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>عرض الكل</Link>
          </div>
          {leads.length === 0
            ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد بيانات</div>
            : leads.map((lead: any, i: number) => (
              <div key={i} style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{lead.name || lead.full_name}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>{lead.phone || lead.email || ''}</div>
              </div>
            ))
          }
        </div>

        {/* الاختبارات القادمة */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>الاختبارات</div>
            <Link href="/dashboard/exams" style={{ color: '#C9A84C', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>عرض الكل</Link>
          </div>
          {upcomingExams.length === 0
            ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد اختبارات</div>
            : upcomingExams.map((exam: any, i: number) => (
              <div key={i} style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 8, padding: '10px 14px', marginBottom: 8 }}>
                <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{exam.title || exam.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>{exam.date ? new Date(exam.date).toLocaleDateString('ar-SA') : ''}</div>
              </div>
            ))
          }
        </div>

        {/* النشاط الأخير */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>النشاط الأخير</div>
          {recentActivity.length === 0
            ? <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا يوجد نشاط</div>
            : recentActivity.map((act: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{act.description || act.title || act.action}</div>
                  <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 2 }}>{act.created_at ? new Date(act.created_at).toLocaleString('ar-SA') : ''}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* ══ رابط مركز التدريب العام ══ */}
      {school?.code && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 14, padding: '20px 24px' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: 10, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 2 }}>صفحة مركز التدريب العامة</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>matin.ink/school/</span>
                <span style={{ color: '#C9A84C', fontSize: 12, fontWeight: 700 }}>{school.code}</span>
                <button onClick={() => navigator.clipboard.writeText(`https://matin.ink/school/${school.code}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9A84C', fontSize: 12, fontWeight: 700 }}>نسخ</button>
              </div>
              {school.custom_domain && (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10B981', fontSize: 12 }}>{school.custom_domain}</span>
                  {school.domain_verified && <span style={{ color: '#10B981', fontSize: 11, fontWeight: 700 }}>✓ متحقق</span>}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`https://matin.ink/school/${school.code}`} target="_blank" rel="noreferrer" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(201,168,76,0.25)' }}>معاينة الصفحة</a>
              <Link href="/dashboard/school-page" style={{ background: `${ACCENT}15`, color: ACCENT, fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: `1px solid ${ACCENT}25` }}>تعديل الصفحة</Link>
              <Link href="/dashboard/settings" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)' }}>ربط دومين</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
