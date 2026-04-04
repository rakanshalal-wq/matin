'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function StudentPortal() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ courses: 0, hours: 0, attendance: 0, exams: 0, requests: 0 });
  const [gpaInfo, setGpaInfo] = useState<any>({ gpa: 0, completedHours: 0, totalHours: 160, fees: 0, progress: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedAvailableCourses, setSelectedAvailableCourses] = useState<string[]>([]);
  const [requestForm, setRequestForm] = useState({ type: 'حذف فصل دراسي', destination: 'عمادة الكلية', details: '' });

  const fallbackCourses = [
    { id: 'c1', name: 'هندسة البرمجيات', doctor: 'د. خالد العمري', hours: 3, schedule: 'أحد - ثلاثاء 10:00 ص', attendance: 88, isLive: true },
    { id: 'c2', name: 'قواعد البيانات', doctor: 'د. سارة الغامدي', hours: 3, schedule: 'اثنين - أربعاء 12:00 م', attendance: 92, isLive: false },
    { id: 'c3', name: 'الشبكات الحاسوبية', doctor: 'د. عمر الزهراني', hours: 2, schedule: 'خميس 9:00 ص', attendance: 80, isLive: false },
    { id: 'c4', name: 'الذكاء الاصطناعي', doctor: 'د. نورة القحطاني', hours: 3, schedule: 'ثلاثاء - خميس 2:00 م', attendance: 95, isLive: false },
  ];
  const fallbackExams = [
    { id: 'ex1', course: 'هندسة البرمجيات', date: '2026-04-20', place: 'قاعة الاختبارات A', time: '10:00 ص' },
    { id: 'ex2', course: 'قواعد البيانات', date: '2026-04-22', place: 'قاعة الاختبارات B', time: '12:00 م' },
    { id: 'ex3', course: 'الشبكات الحاسوبية', date: '2026-04-25', place: 'قاعة الاختبارات C', time: '9:00 ص' },
  ];
  const fallbackRequests = [
    { id: 'r1', type: 'شهادة قيد', destination: 'شؤون الطلاب', date: '2026-03-20', status: 'مكتمل' },
    { id: 'r2', type: 'اعتراض على درجة', destination: 'عمادة الكلية', date: '2026-03-28', status: 'قيد المراجعة' },
    { id: 'r3', type: 'عذر غياب', destination: 'المرشد الأكاديمي', date: '2026-04-01', status: 'معلق' },
  ];
  const availableCourses = [
    { id: 'av1', name: 'تحليل الخوارزميات', code: 'CS501', hours: 3, prereqOk: true },
    { id: 'av2', name: 'أمن المعلومات', code: 'CS502', hours: 3, prereqOk: true },
    { id: 'av3', name: 'حوسبة سحابية', code: 'CS503', hours: 2, prereqOk: false },
    { id: 'av4', name: 'تطوير تطبيقات الجوال', code: 'CS504', hours: 3, prereqOk: true },
  ];
  const prevGrades = [
    { course: 'هياكل البيانات', grade: 88, letter: 'A' },
    { course: 'البرمجة الكائنية', grade: 92, letter: 'A+' },
    { course: 'الرياضيات المتقطعة', grade: 75, letter: 'B' },
  ];
  const pastExamResults = [
    { course: 'هياكل البيانات', grade: 88, letter: 'A' },
    { course: 'البرمجة الكائنية', grade: 92, letter: 'A+' },
  ];

  const quickActions12 = [
    { label: 'تسجيل مقررات', icon: '📋', action: () => setShowRegisterModal(true) },
    { label: 'انضم للمحاضرة', icon: '🎥', action: () => alert('الانضمام للمحاضرة المباشرة') },
    { label: 'تقديم طلب', icon: '📨', action: () => setShowRequestModal(true) },
    { label: 'شهادة قيد', icon: '📄', action: () => alert('طلب شهادة قيد') },
    { label: 'دفع الرسوم', icon: '💳', action: () => alert('الانتقال لبوابة الدفع') },
    { label: 'عذر طبي', icon: '🏥', action: () => alert('تقديم عذر طبي') },
    { label: 'المكتبة', icon: '📚', action: () => alert('المكتبة الرقمية') },
    { label: 'رسالة للدكتور', icon: '✉️', action: () => alert('إرسال رسالة') },
    { label: 'الكافتيريا', icon: '🍽️', action: () => alert('قائمة الكافتيريا') },
    { label: 'محاضرات مسجّلة', icon: '▶️', action: () => alert('المحاضرات المسجلة') },
    { label: 'المنح', icon: '🏆', action: () => alert('برامج المنح') },
    { label: 'الأنشطة', icon: '⭐', action: () => alert('الأنشطة الطلابية') },
  ];

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/university/student?type=stats'),
      fetch('/api/university/student?type=courses'),
      fetch('/api/university/student?type=exams'),
      fetch('/api/university/student?type=requests'),
    ])
      .then(async ([meRes, statsRes, coursesRes, examsRes, requestsRes]) => {
        const meData = meRes.ok ? await meRes.json() : {};
        const statsData = statsRes.ok ? await statsRes.json() : {};
        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const examsData = examsRes.ok ? await examsRes.json() : [];
        const requestsData = requestsRes.ok ? await requestsRes.json() : [];
        setUser(meData?.user || meData || null);
        const s = statsData?.stats || statsData || {};
        setStats({ courses: s.courses || 4, hours: s.hours || 11, attendance: s.attendance || 88, exams: s.exams || 3, requests: s.requests || 2 });
        const g = statsData?.gpa || {};
        setGpaInfo({ gpa: g.gpa || 4.2, completedHours: g.completedHours || 85, totalHours: g.totalHours || 160, fees: g.fees || 0, progress: g.progress || 53 });
        setCourses(coursesData?.courses || coursesData || fallbackCourses);
        setExams(examsData?.exams || examsData || fallbackExams);
        setRequests(requestsData?.requests || requestsData || fallbackRequests);
      })
      .catch(() => {
        setStats({ courses: 4, hours: 11, attendance: 88, exams: 3, requests: 2 });
        setGpaInfo({ gpa: 4.2, completedHours: 85, totalHours: 160, fees: 0, progress: 53 });
        setCourses(fallbackCourses);
        setExams(fallbackExams);
        setRequests(fallbackRequests);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleCourse = (id: string) => {
    setSelectedAvailableCourses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const selectedHours = availableCourses.filter(c => selectedAvailableCourses.includes(c.id)).reduce((s, c) => s + c.hours, 0);

  const statusColor = (status: string) => {
    if (status === 'مكتمل') return '#22C55E';
    if (status === 'قيد المراجعة') return '#818CF8';
    if (status === 'مرفوض') return '#EF4444';
    return '#F59E0B';
  };

  const statCards = [
    { value: `${stats.courses} مقرر (${stats.hours} ساعة)`, label: 'مقرراتي', sub: 'مسجّلة', color: '#818CF8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.25)' },
    { value: `${stats.attendance}%`, label: 'نسبة حضوري', sub: 'الحد الأدنى 75%', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
    { value: stats.exams, label: 'اختبارات قادمة', sub: 'أقربها غداً', color: '#F97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)' },
    { value: stats.requests, label: 'طلبات قيد المراجعة', sub: 'من العمادة', color: '#22D3EE', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.25)' },
  ];
  const tabs = [
    { key: 'overview', label: 'بوابتي' },
    { key: 'courses', label: 'مقرراتي' },
    { key: 'exams', label: 'الاختبارات' },
    { key: 'requests', label: 'طلباتي' },
  ];

  const root: any = { minHeight: '100vh', background: '#06060E', color: '#E2E8F0', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', padding: '24px' };
  const card: any = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' };
  const inp: any = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 12px', color: '#E2E8F0', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: '14px' };
  const btnPrimary: any = { background: 'linear-gradient(135deg, #818CF8, #6366F1)', border: 'none', borderRadius: '10px', padding: '10px 24px', color: '#fff', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: '14px', cursor: 'pointer' };
  const btnSecondary: any = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px', color: '#94A3B8', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 600, fontSize: '14px', cursor: 'pointer' };
  const thStyle: any = { padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#64748B', fontWeight: 600 };
  const tdStyle: any = { padding: '10px 12px', fontSize: '14px', color: '#F1F5F9' };

  if (loading) {
    return (
      <div style={{ ...root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(129,140,248,0.3)', borderTopColor: '#818CF8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94A3B8' }}>جاري تحميل البيانات...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={root}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #818CF8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🎓</div>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#F1F5F9' }}>بوابة الطالب الجامعي</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>مرحباً {user?.name || 'الطالب'} — الفصل الدراسي الثاني 1446</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...card, background: s.bg, borderColor: s.border }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: '12px', color: s.color, marginTop: '4px', opacity: 0.8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: activeTab === t.key ? 700 : 400, background: activeTab === t.key ? 'linear-gradient(135deg, #818CF8, #6366F1)' : 'transparent', color: activeTab === t.key ? '#fff' : '#94A3B8', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* GPA Banner */}
          <div style={{ ...card, background: 'rgba(129,140,248,0.06)', borderColor: 'rgba(129,140,248,0.2)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#818CF8' }}>{gpaInfo.gpa}/5.0</div>
                <div style={{ fontSize: '12px', color: '#818CF8', fontWeight: 600 }}>المعدل التراكمي</div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>ممتاز</div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#F1F5F9' }}>{gpaInfo.completedHours} ساعة</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>الساعات المكتملة</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: gpaInfo.fees > 0 ? '#EF4444' : '#22C55E' }}>{gpaInfo.fees > 0 ? `${gpaInfo.fees} ريال` : 'لا توجد رسوم'}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>رسوم معلقة</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}>{gpaInfo.progress}% ({gpaInfo.completedHours}/{gpaInfo.totalHours} ساعة)</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>التقدم نحو التخرج</div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${gpaInfo.progress}%`, height: '100%', background: 'linear-gradient(90deg, #818CF8, #6366F1)', borderRadius: '4px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Courses */}
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>مقرراتي الحالية</h3>
            {courses.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد مقررات مسجلة</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {courses.map((c: any) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${c.isLive ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {c.isLive && <span style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '4px', padding: '1px 6px', fontSize: '10px', color: '#22C55E', fontWeight: 700 }}>● مباشر</span>}
                        <span style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{c.name}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{c.doctor} — {c.schedule}</div>
                    </div>
                    {c.isLive && (
                      <button onClick={() => alert('الانضمام للمحاضرة المباشرة')} style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#fff', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>انضم الآن</button>
                    )}
                  </div>
                ))}
              </div>
            }
          </div>

          {/* Quick Actions 12-grid */}
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>الخدمات السريعة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px' }}>
              {quickActions12.map((a, i) => (
                <button key={i} onClick={a.action} style={{ background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.18)', borderRadius: '12px', padding: '12px 8px', cursor: 'pointer', color: '#818CF8', fontSize: '11px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>{a.icon}</div>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>المقررات المسجّلة حالياً</h3>
              <button onClick={() => setShowRegisterModal(true)} style={{ ...btnPrimary, padding: '8px 16px', fontSize: '13px' }}>تسجيل مقررات الفصل القادم</button>
            </div>
            {courses.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد مقررات</p>
              : <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['المقرر', 'الدكتور', 'الساعات', 'الجدول', 'الحضور%'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c: any) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={tdStyle}>{c.name}</td>
                        <td style={{ ...tdStyle, color: '#94A3B8', fontSize: '13px' }}>{c.doctor}</td>
                        <td style={{ ...tdStyle, color: '#818CF8', fontWeight: 700 }}>{c.hours}</td>
                        <td style={{ ...tdStyle, fontSize: '12px', color: '#64748B' }}>{c.schedule}</td>
                        <td style={{ ...tdStyle }}>
                          <span style={{ color: c.attendance >= 75 ? '#22C55E' : '#EF4444', fontWeight: 700 }}>{c.attendance}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>

          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>درجات الفصل السابق</h3>
            {prevGrades.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center' }}>لا توجد درجات</p>
              : <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['المقرر', 'الدرجة', 'التقدير'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {prevGrades.map((g, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={tdStyle}>{g.course}</td>
                        <td style={tdStyle}>{g.grade}</td>
                        <td style={{ ...tdStyle, color: '#818CF8', fontWeight: 700 }}>{g.letter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      )}

      {/* EXAMS TAB */}
      {activeTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>الاختبارات القادمة</h3>
            {exams.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد اختبارات قادمة</p>
              : <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['المقرر', 'التاريخ', 'المكان', 'الوقت'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((e: any) => (
                      <tr key={e.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={tdStyle}>{e.course}</td>
                        <td style={{ ...tdStyle, color: '#F97316', fontWeight: 600 }}>{e.date}</td>
                        <td style={{ ...tdStyle, fontSize: '13px', color: '#94A3B8' }}>{e.place}</td>
                        <td style={{ ...tdStyle, color: '#818CF8', fontWeight: 600 }}>{e.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>نتائج الاختبارات السابقة</h3>
            {pastExamResults.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center' }}>لا توجد نتائج</p>
              : <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['المقرر', 'الدرجة', 'التقدير'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {pastExamResults.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={tdStyle}>{r.course}</td>
                        <td style={tdStyle}>{r.grade}</td>
                        <td style={{ ...tdStyle, color: '#818CF8', fontWeight: 700 }}>{r.letter}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#818CF8', fontWeight: 700 }}>طلباتي</h3>
            <button onClick={() => setShowRequestModal(true)} style={{ ...btnPrimary, padding: '8px 18px', fontSize: '13px' }}>+ طلب جديد</button>
          </div>
          {requests.length === 0
            ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد طلبات مقدمة</p>
            : <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['نوع الطلب', 'الجهة', 'التاريخ', 'الحالة'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r: any) => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={tdStyle}>{r.type}</td>
                      <td style={{ ...tdStyle, fontSize: '13px', color: '#94A3B8' }}>{r.destination}</td>
                      <td style={{ ...tdStyle, fontSize: '13px', color: '#64748B' }}>{r.date}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: `${statusColor(r.status)}22`, border: `1px solid ${statusColor(r.status)}44`, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: statusColor(r.status), fontWeight: 600, whiteSpace: 'nowrap' }}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      )}

      {/* MODAL: Course Registration */}
      {showRegisterModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowRegisterModal(false)}>
          <div style={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', direction: 'rtl' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#F1F5F9', fontWeight: 700 }}>تسجيل مقررات</h2>
            <div style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: '#818CF8' }}>ساعاتك المكتملة: {gpaInfo.completedHours} ساعة — يمكن تسجيل حتى 18 ساعة هذا الفصل</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {availableCourses.map(c => (
                <div key={c.id} onClick={() => c.prereqOk && toggleCourse(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: selectedAvailableCourses.includes(c.id) ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${selectedAvailableCourses.includes(c.id) ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.06)'}`, cursor: c.prereqOk ? 'pointer' : 'not-allowed', opacity: c.prereqOk ? 1 : 0.5 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${selectedAvailableCourses.includes(c.id) ? '#818CF8' : 'rgba(255,255,255,0.2)'}`, background: selectedAvailableCourses.includes(c.id) ? '#818CF8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedAvailableCourses.includes(c.id) && <span style={{ color: '#fff', fontSize: '11px' }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{c.code} — {c.hours} ساعات</div>
                  </div>
                  {!c.prereqOk && <span style={{ fontSize: '11px', color: '#EF4444', background: 'rgba(239,68,68,0.1)', borderRadius: '4px', padding: '2px 6px' }}>متطلب سابق</span>}
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '14px', color: '#818CF8', fontWeight: 600 }}>
              الساعات المحددة: {selectedHours} ساعة
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowRegisterModal(false)} style={{ ...btnSecondary, flex: 1 }}>إلغاء</button>
              <button onClick={() => { if (selectedHours === 0) { alert('الرجاء اختيار مقرر واحد على الأقل'); return; } alert(`تم تسجيل ${selectedAvailableCourses.length} مقررات (${selectedHours} ساعة) بنجاح`); setShowRegisterModal(false); }} style={{ ...btnPrimary, flex: 2 }}>تأكيد التسجيل ←</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Formal Request */}
      {showRequestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowRequestModal(false)}>
          <div style={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', direction: 'rtl' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#F1F5F9', fontWeight: 700 }}>تقديم طلب رسمي</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>نوع الطلب</label>
                <select value={requestForm.type} onChange={e => setRequestForm(p => ({ ...p, type: e.target.value }))} style={{ ...inp, width: '100%' }}>
                  {['حذف فصل دراسي', 'تحويل تخصص/كلية', 'تجميد القيد', 'اعتراض على درجة', 'طلب منحة', 'إعادة تسجيل مقرر', 'عذر غياب', 'إجازة دراسية', 'شهادة قيد', 'نسخة كشف أكاديمي', 'اعتراض على قرار'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>وجهة الطلب</label>
                <select value={requestForm.destination} onChange={e => setRequestForm(p => ({ ...p, destination: e.target.value }))} style={{ ...inp, width: '100%' }}>
                  {['عمادة الكلية', 'المرشد الأكاديمي', 'شؤون الطلاب', 'الشؤون المالية', 'القبول والتسجيل', 'خدمات الطلاب'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>التفاصيل والسبب</label>
                <textarea value={requestForm.details} onChange={e => setRequestForm(p => ({ ...p, details: e.target.value }))} rows={4} placeholder="اشرح تفاصيل طلبك وسببه..." style={{ ...inp, width: '100%', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowRequestModal(false)} style={{ ...btnSecondary, flex: 1 }}>إلغاء</button>
              <button onClick={() => { alert('تم إرسال طلبك بنجاح'); setShowRequestModal(false); }} style={{ ...btnPrimary, flex: 2 }}>إرسال الطلب ←</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
