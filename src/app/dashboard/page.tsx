'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ═══════════════════════════════════════════════════════════
   MATIN DESIGN SYSTEM — Dashboard Home
   الهوية البصرية: أسود #06060E + ذهبي #C9A84C
   بطاقات إحصائية بخلفيات ملونة + رسم بياني حضور + تنبيهات
═══════════════════════════════════════════════════════════ */

const G = '#C9A84C';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const INSTITUTION_TYPES: Record<string, { label: string; icon: string; color: string }> = {
  school:          { label: 'مدرسة',       icon: '🏫', color: '#3B82F6' },
  university:      { label: 'جامعة',       icon: '🎓', color: '#8B5CF6' },
  institute:       { label: 'معهد',        icon: '🏛', color: '#10B981' },
  kindergarten:    { label: 'حضانة',       icon: '🌱', color: '#F59E0B' },
  training_center: { label: 'مركز تدريب', icon: '💼', color: '#EF4444' },
  college:         { label: 'كلية',        icon: '📚', color: '#06B6D4' },
};

/* ─── بطاقة إحصائية محسّنة ─── */
function StatCard({ title, value, color, sub, link, icon }: {
  title: string; value: any; color: string; sub?: string; link?: string; icon: string;
}) {
  const inner = (
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div>
          <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 12, fontWeight: 600, marginBottom: 10 }}>{title}</div>
          <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>{value}</div>
          {sub && (
            <div style={{ color: color, fontSize: 11, marginTop: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>↑</span>{sub}
            </div>
          )}
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}20`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
      </div>
    </div>
  );
  if (link) return <Link href={link} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
  return inner;
}

/* ─── رسم بياني للحضور الأسبوعي ─── */
function AttendanceChart({ data }: { data: { day: string; present: number; absent: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.present + d.absent), 1);
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 120, padding: '0 4px' }}>
      {data.map((d, i) => {
        const total = d.present + d.absent || 1;
        const presentH = Math.round((d.present / maxVal) * 100);
        const absentH = Math.round((d.absent / maxVal) * 100);
        const rate = Math.round((d.present / total) * 100);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, color: G, fontWeight: 700 }}>{rate}%</div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 80, gap: 2 }}>
              <div style={{ width: '100%', height: `${absentH}%`, background: 'rgba(239,68,68,0.7)', borderRadius: '4px 4px 0 0', minHeight: absentH > 0 ? 4 : 0 }} />
              <div style={{ width: '100%', height: `${presentH}%`, background: `linear-gradient(180deg, ${G} 0%, #E2C46A 100%)`, borderRadius: '4px 4px 0 0', minHeight: presentH > 0 ? 4 : 0 }} />
            </div>
            <div style={{ fontSize: 10, color: 'rgba(238,238,245,0.4)', fontWeight: 600 }}>{d.day}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── بطاقة تنبيه ─── */
function AlertItem({ text, time, type }: { text: string; time: string; type: 'warn' | 'success' | 'info' }) {
  const colors = { warn: '#F59E0B', success: '#22C55E', info: '#3B82F6' };
  const icons = { warn: '⚠️', success: '✅', info: '🔔' };
  const c = colors[type];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 14px', borderRadius: 10,
      background: `${c}0D`, border: `1px solid ${c}20`,
      marginBottom: 8,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icons[type]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: 'rgba(238,238,245,0.85)', fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{text}</div>
        <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 11, marginTop: 4 }}>{time}</div>
      </div>
    </div>
  );
}

/* ─── شريط الحضور ─── */
function AttendanceBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ color: color, fontSize: 12, fontWeight: 700, minWidth: 36 }}>{value}%</span>
    </div>
  );
}

/* ─── بادج الحالة ─── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    active:   { label: 'نشط',     color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
    absent:   { label: 'غائب',    color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
    leave:    { label: 'إجازة',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    inactive: { label: 'غير نشط', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
      {s.label}
    </span>
  );
}

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [pendingAdmissions, setPendingAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
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
            loadAll();
          } else { window.location.href = '/login'; }
        }).catch(() => {
          try {
            const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
            if (u.id) { setUser(u); loadAll(); }
            else { window.location.href = '/login'; }
          } catch { window.location.href = '/login'; }
        });
    } else {
      try {
        const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
        if (u.id) { setUser(u); loadAll(); }
        else { window.location.href = '/login'; }
      } catch { window.location.href = '/login'; }
    }
  }, []);

  const loadAll = async () => {
    try {
      const headers = getHeaders();
      const [statsRes, schoolsRes, studentsRes, examsRes, admissionsRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers }),
        fetch('/api/schools', { headers }),
        fetch('/api/students?limit=5&sort=created_at&order=desc', { headers }),
        fetch('/api/exams?limit=3', { headers }),
        fetch('/api/admission?status=pending&limit=3', { headers }),
      ]);
      const [statsData, schoolsData, studentsData, examsData, admissionsData] = await Promise.all([
        statsRes.ok ? statsRes.json() : {},
        schoolsRes.ok ? schoolsRes.json() : [],
        studentsRes.ok ? studentsRes.json() : [],
        examsRes.ok ? examsRes.json() : [],
        admissionsRes.ok ? admissionsRes.json() : [],
      ]);
      setStats(statsData || {});
      const schools = Array.isArray(schoolsData) ? schoolsData : [];
      if (schools.length > 0) setSchool(schools[0]);
      const studs = Array.isArray(studentsData) ? studentsData : (studentsData?.students || []);
      setRecentStudents(studs.slice(0, 5));
      setUpcomingExams(Array.isArray(examsData) ? examsData.slice(0, 3) : []);
      setPendingAdmissions(Array.isArray(admissionsData) ? admissionsData.slice(0, 3) : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const instType = school?.institution_type
    ? INSTITUTION_TYPES[school.institution_type] || INSTITUTION_TYPES.school
    : INSTITUTION_TYPES.school;

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  };

  const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const attendanceData = stats.weekly_attendance || [
    { day: 'الأحد',    present: 92, absent: 8  },
    { day: 'الاثنين',  present: 88, absent: 12 },
    { day: 'الثلاثاء', present: 95, absent: 5  },
    { day: 'الأربعاء', present: 91, absent: 9  },
    { day: 'الخميس',  present: 87, absent: 13 },
  ];

  const alerts: { text: string; time: string; type: 'warn' | 'success' | 'info' }[] = [
    { text: `${stats.absent_today || 12} طالباً تجاوزوا حد الغياب 20%`, time: 'منذ ساعة', type: 'warn' },
    { text: `تم استلام رسوم ${stats.new_fees || 45} طالباً جديداً`, time: 'منذ 3 ساعات', type: 'success' },
    { text: 'تحديث جدول الفصل الثالث متوسط أ', time: 'منذ 5 ساعات', type: 'info' },
    { text: `${stats.absent_teachers || 3} معلمين لم يسجلوا الحضور اليوم`, time: 'منذ 6 ساعات', type: 'warn' },
  ];

  const demoStudents = [
    { name: 'أحمد محمد السالم',   grade: 'الثالث متوسط',   status: 'active', att: 96 },
    { name: 'سارة عبدالله الحربي', grade: 'الأول ثانوي',    status: 'active', att: 88 },
    { name: 'عمر خالد الزهراني',  grade: 'السادس ابتدائي', status: 'absent', att: 72 },
    { name: 'نورة فيصل العتيبي',  grade: 'الثاني ثانوي',   status: 'active', att: 99 },
    { name: 'يوسف سعد القحطاني',  grade: 'الرابع ابتدائي', status: 'leave',  att: 81 },
  ];

  const studentsToShow = recentStudents.length > 0 ? recentStudents.map(s => ({
    name: s.name_ar || s.name || 'طالب',
    grade: s.class_name || s.grade || '—',
    status: s.status || 'active',
    att: s.attendance_rate || 85,
  })) : demoStudents;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, background: `linear-gradient(135deg, ${G} 0%, #E2C46A 100%)`, borderRadius: 14, margin: '0 auto 16px', animation: 'pulse 2s infinite' }} />
        <div style={{ color: G, fontSize: 15, fontWeight: 700 }}>جاري التحميل...</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>

      {/* ══ هيدر الصفحة ══ */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d1a 0%, #111128 60%, #0d0d1a 100%)',
        border: `1px solid ${G}30`,
        borderRadius: 20,
        padding: '24px 28px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: `${G}06`, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -40, width: 220, height: 220, background: 'rgba(59,130,246,0.04)', borderRadius: '50%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {school?.logo_url || school?.logo ? (
              <img src={school.logo_url || school.logo} alt="" style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', border: `2px solid ${G}40` }} />
            ) : (
              <div style={{ width: 60, height: 60, borderRadius: 14, background: `${instType.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: `2px solid ${instType.color}30` }}>
                {instType.icon}
              </div>
            )}
            <div>
              <div style={{ color: G, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                {greeting()}، {user?.name?.split(' ')[0] || 'مرحباً'} 👋
              </div>
              <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>
                {school?.name_ar || school?.name || 'مؤسستك التعليمية'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ background: `${instType.color}20`, color: instType.color, fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>
                  {instType.icon} {instType.label}
                </span>
                {school?.subscription_status === 'active' ? (
                  <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>✓ اشتراك نشط</span>
                ) : (
                  <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 700 }}>⚠ اشتراك منتهي</span>
                )}
                {school?.city && <span style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11 }}>📍 {school.city}</span>}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 900, fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>
              {time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, marginTop: 4 }}>
              {days[time.getDay()]}، {time.getDate()} {months[time.getMonth()]} {time.getFullYear()}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Link href="/dashboard/school-page" style={{ background: `${G}18`, color: G, fontSize: 12, padding: '6px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, border: `1px solid ${G}30` }}>
                🌐 صفحة المؤسسة
              </Link>
              <Link href="/dashboard/settings" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(238,238,245,0.5)', fontSize: 12, padding: '6px 14px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)' }}>
                ⚙️ الإعدادات
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══ البطاقات الإحصائية الأربع ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard title="إجمالي الطلاب" value={(stats.students || stats.total_students || 0).toLocaleString('ar-SA')} icon="👨‍🎓" color="#3B82F6" sub={`+${stats.new_students || 0} هذا الشهر`} link="/dashboard/students" />
        <StatCard title="نسبة الحضور" value={`${stats.attendance_rate || 0}%`} icon="✅" color="#22C55E" sub="عن الأسبوع الماضي" link="/dashboard/attendance" />
        <StatCard title="المعلمون النشطون" value={stats.teachers || stats.total_teachers || 0} icon="👩‍🏫" color={G} sub={stats.new_teachers ? `+${stats.new_teachers} جديد` : 'نشطون'} link="/dashboard/teachers" />
        <StatCard title="الرسوم المحصّلة" value={`${((stats.collected_fees || 0) / 1000).toFixed(0)}K ر.س`} icon="💰" color="#F59E0B" sub="عن الشهر الماضي" link="/dashboard/finance" />
      </div>

      {/* ══ رسم بياني + تنبيهات ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>الحضور الأسبوعي</div>
              <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 12, marginTop: 2 }}>الأسبوع الحالي — {months[time.getMonth()]} {time.getFullYear()}</div>
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: G }} />
                <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 11 }}>حاضر</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#EF4444' }} />
                <span style={{ color: 'rgba(238,238,245,0.5)', fontSize: 11 }}>غائب</span>
              </div>
            </div>
          </div>
          <AttendanceChart data={attendanceData} />
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>التنبيهات</div>
            <span style={{ background: `${G}20`, color: G, fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>{alerts.length} جديد</span>
          </div>
          {alerts.map((a, i) => <AlertItem key={i} text={a.text} time={a.time} type={a.type} />)}
        </div>
      </div>

      {/* ══ جدول الطلاب ══ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>آخر الطلاب المسجلين</div>
            <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 12, marginTop: 2 }}>عرض آخر 5 طلاب</div>
          </div>
          <Link href="/dashboard/students" style={{ color: G, fontSize: 12, textDecoration: 'none', fontWeight: 700, border: `1px solid ${G}30`, padding: '6px 14px', borderRadius: 8, background: `${G}10` }}>
            عرض الكل
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['الطالب', 'الصف', 'الحالة', 'نسبة الحضور', 'التقدير'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.35)', fontSize: 11, fontWeight: 700, textAlign: 'right', borderBottom: `1px solid ${BORDER}`, letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentsToShow.map((s, i) => {
                const attColor = s.att >= 90 ? '#22C55E' : s.att >= 75 ? G : '#EF4444';
                const grade = s.att >= 90 ? 'ممتاز' : s.att >= 80 ? 'جيد جداً' : s.att >= 70 ? 'جيد' : 'مقبول';
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${G}20`, border: `1px solid ${G}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                          <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11 }}>{recentStudents.length === 0 ? 'بيانات تجريبية' : 'طالب'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'rgba(238,238,245,0.6)', fontSize: 13 }}>{s.grade}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={s.status} /></td>
                    <td style={{ padding: '14px 16px', minWidth: 140 }}><AttendanceBar value={s.att} color={attColor} /></td>
                    <td style={{ padding: '14px 16px', color: attColor, fontSize: 13, fontWeight: 700 }}>{grade}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ إجراءات سريعة + اختبارات قادمة ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 16 }}>⚡ إجراءات سريعة</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'إضافة طالب',  icon: '👨‍🎓', href: '/dashboard/students',     color: '#3B82F6' },
              { label: 'إضافة معلم',  icon: '👩‍🏫', href: '/dashboard/teachers',     color: '#8B5CF6' },
              { label: 'تقرير جديد',  icon: '📊',  href: '/dashboard/reports',      color: '#10B981' },
              { label: 'إرسال إشعار', icon: '🔔',  href: '/dashboard/notifications', color: G },
            ].map((item, i) => (
              <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: `${item.color}12`, border: `1px solid ${item.color}25`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}22`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}12`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>📝 الاختبارات القادمة</div>
            <Link href="/dashboard/exams" style={{ color: G, fontSize: 12, textDecoration: 'none', fontWeight: 700 }}>عرض الكل</Link>
          </div>
          {(upcomingExams.length > 0 ? upcomingExams.map((exam, i) => ({
            title: exam.title || exam.name || `اختبار ${i + 1}`,
            subject: exam.subject || exam.class_name || '—',
            date: exam.date ? new Date(exam.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : 'قريباً',
          })) : [
            { title: 'اختبار الرياضيات',    subject: 'الثالث متوسط أ',   date: 'غداً' },
            { title: 'اختبار اللغة العربية', subject: 'الأول ثانوي ب',    date: 'بعد غد' },
            { title: 'اختبار العلوم',        subject: 'السادس ابتدائي',   date: 'الخميس' },
          ]).map((exam, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>{exam.title}</div>
                <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, marginTop: 2 }}>{exam.subject}</div>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontSize: 11, padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>{exam.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ الأقسام الرئيسية ══ */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          🗂 الأقسام الرئيسية
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
          {[
            { label: 'الطلاب',     icon: '👨‍🎓', href: '/dashboard/students',     color: '#3B82F6', count: stats.students || 0 },
            { label: 'المعلمون',   icon: '👩‍🏫', href: '/dashboard/teachers',     color: '#8B5CF6', count: stats.teachers || 0 },
            { label: 'الفصول',     icon: '🏛',  href: '/dashboard/classes',      color: '#10B981', count: stats.classes || 0 },
            { label: 'الاختبارات', icon: '📝',  href: '/dashboard/exams',        color: '#EF4444', count: stats.exams || 0 },
            { label: 'الحضور',     icon: '✋',  href: '/dashboard/attendance',   color: '#06B6D4', count: null },
            { label: 'الدرجات',    icon: '📊',  href: '/dashboard/grades',       color: '#A78BFA', count: null },
            { label: 'المالية',    icon: '💰',  href: '/dashboard/finance',      color: G,         count: null },
            { label: 'الرسائل',    icon: '✉️',  href: '/dashboard/messages',     color: '#34D399', count: null },
            { label: 'التقارير',   icon: '📈',  href: '/dashboard/reports',      color: '#FB923C', count: null },
            { label: 'الجداول',    icon: '📅',  href: '/dashboard/schedules',    color: '#F472B6', count: null },
            { label: 'المتجر',     icon: '🛒',  href: '/dashboard/store',        color: '#E879F9', count: null },
            { label: 'المساعد AI', icon: '🤖',  href: '/dashboard/ai-chat',      color: '#818CF8', count: null },
          ].map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: `${item.color}10`, border: `1px solid ${item.color}22`, borderRadius: 12, padding: '14px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}20`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = `${item.color}40`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${item.color}10`; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = `${item.color}22`; }}
              >
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ color: '#E2E8F0', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                {item.count !== null && item.count > 0 && (
                  <div style={{ color: item.color, fontSize: 15, fontWeight: 900, marginTop: 4 }}>{item.count}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
