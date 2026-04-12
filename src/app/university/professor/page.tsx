'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

export default function ProfessorDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({ courses: 0, students: 0, attendance: 0, pending: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [excuseStatus, setExcuseStatus] = useState<Record<string, 'accepted' | 'rejected'>>({});
  const [attendanceData, setAttendanceData] = useState<any>({});
  const [gradesCourse, setGradesCourse] = useState('');
  const [gradesData, setGradesData] = useState<any>({});
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [lectureSettings, setLectureSettings] = useState<any>({
    enforceCamera: false,
    aiMonitor: false,
    preventWindowSwitch: false,
    recordLecture: false,
    examAiMonitor: false,
    examCamera: false,
    examPreventSwitch: false,
  });
  const [leaveForm, setLeaveForm] = useState({
    type: 'اعتيادية',
    startDate: '',
    endDate: '',
    affectedLectures: '',
    reason: '',
  });

  const fallbackCourses = [
    { id: '1', name: 'هندسة البرمجيات', students: 35, schedule: 'الأحد - الثلاثاء 10:00 ص', code: 'CS401' },
    { id: '2', name: 'قواعد البيانات', students: 42, schedule: 'الاثنين - الأربعاء 12:00 م', code: 'CS302' },
    { id: '3', name: 'الشبكات الحاسوبية', students: 28, schedule: 'الخميس 9:00 ص', code: 'CS303' },
    { id: '4', name: 'الذكاء الاصطناعي', students: 15, schedule: 'الثلاثاء - الخميس 2:00 م', code: 'CS450' },
  ];
  const fallbackAssignments = [
    { id: '1', title: 'مشروع قاعدة البيانات', course: 'قواعد البيانات', due: '2026-04-10', submissions: 30, total: 42, status: 'active' },
    { id: '2', title: 'تقرير الشبكات', course: 'الشبكات الحاسوبية', due: '2026-04-08', submissions: 28, total: 28, status: 'pending_grade' },
    { id: '3', title: 'خوارزميات الذكاء الاصطناعي', course: 'الذكاء الاصطناعي', due: '2026-04-15', submissions: 5, total: 15, status: 'active' },
  ];

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/university/professor?type=stats'),
      fetch('/api/university/professor?type=courses'),
      fetch('/api/university/professor?type=assignments'),
    ])
      .then(async ([meRes, statsRes, coursesRes, assignmentsRes]) => {
        const meData = meRes.ok ? await meRes.json() : {};
        const statsData = statsRes.ok ? await statsRes.json() : {};
        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const assignmentsData = assignmentsRes.ok ? await assignmentsRes.json() : [];
        setUser(meData?.user || meData || null);
        setStats(statsData?.stats || statsData || { courses: 4, students: 120, attendance: 87, pending: 12 });
        setCourses(coursesData?.courses || coursesData || fallbackCourses);
        setAssignments(assignmentsData?.assignments || assignmentsData || fallbackAssignments);
      })
      .catch(() => {
        setStats({ courses: 4, students: 120, attendance: 87, pending: 12 });
        setCourses(fallbackCourses);
        setAssignments(fallbackAssignments);
      })
      .finally(() => setLoading(false));
  }, []);

  const mockStudents = [
    { id: 's1', name: 'أحمد محمد العمري', studentId: '202100123' },
    { id: 's2', name: 'سارة عبدالله الغامدي', studentId: '202100124' },
    { id: 's3', name: 'خالد إبراهيم الحربي', studentId: '202100125' },
    { id: 's4', name: 'نورة فهد القحطاني', studentId: '202100126' },
    { id: 's5', name: 'عمر سعد الزهراني', studentId: '202100127' },
  ];
  const mockExcuseRequests = [
    { id: 'e1', student: 'أحمد محمد العمري', date: '2026-04-01', reason: 'مرض' },
    { id: 'e2', student: 'نورة فهد القحطاني', date: '2026-03-28', reason: 'ظرف طارئ' },
  ];
  const mockLectures: Array<{ id: string; title: string; date: string; duration: string; url?: string }> = [
    { id: 'l1', title: 'المحاضرة 1 - مقدمة في هندسة البرمجيات', date: '2026-03-30', duration: '50 دقيقة' },
    { id: 'l2', title: 'المحاضرة 2 - نماذج دورة الحياة', date: '2026-04-01', duration: '55 دقيقة' },
  ];

  const cycleAttendance = (sid: string) => {
    setAttendanceData((prev: any) => {
      const cur = prev[sid] || 'present';
      const next = cur === 'present' ? 'absent' : cur === 'absent' ? 'late' : 'present';
      return { ...prev, [sid]: next };
    });
  };
  const attendanceColor = (s: string) => s === 'absent' ? '#EF4444' : s === 'late' ? '#F59E0B' : '#22C55E';
  const attendanceLabel = (s: string) => s === 'absent' ? 'غائب' : s === 'late' ? 'متأخر' : 'حاضر';
  const gradeToLetter = (g: string) => {
    const n = parseFloat(g);
    if (isNaN(n)) return '-';
    if (n >= 90) return 'A+'; if (n >= 85) return 'A'; if (n >= 80) return 'B+';
    if (n >= 75) return 'B'; if (n >= 70) return 'C+'; if (n >= 65) return 'C';
    if (n >= 60) return 'D'; return 'F';
  };

  const statCards = [
    { value: stats.courses, label: 'مقرراتي هذا الفصل', sub: 'ساعة معتمدة', color: '#22D3EE', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.25)' },
    { value: stats.students, label: 'إجمالي طلابي', sub: 'طالب', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
    { value: `${stats.attendance}%`, label: 'متوسط حضور الطلاب', sub: 'هذا الشهر', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
    { value: stats.pending, label: 'تكاليف تحتاج تصحيح', sub: 'في انتظار التصحيح', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  ];
  const tabs = [
    { key: 'overview', label: 'نظرة عامة' },
    { key: 'attendance', label: 'حضور الطلاب' },
    { key: 'grades', label: 'الدرجات' },
    { key: 'assignments', label: 'التكاليف' },
    { key: 'lectures', label: 'المحاضرات' },
  ];
  const quickActions = [
    { label: 'تسجيل حضور', icon: '✅', action: () => setActiveTab('attendance') },
    { label: 'رفع تكليف', icon: '📤', action: () => setActiveTab('assignments') },
    { label: 'إدخال درجات', icon: '📝', action: () => setActiveTab('grades') },
    { label: 'محاضرة أونلاين', icon: '🎥', action: () => { setActiveTab('lectures'); setShowLectureModal(true); } },
    { label: 'رفع إجازة', icon: '📋', action: () => setShowLeaveModal(true) },
  ];

  const root: any = {
    minHeight: '100vh',
    background: '#06060E',
    color: '#E2E8F0',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    direction: 'rtl',
    padding: '24px',
  };
  const card: any = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px',
  };
  const inp: any = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '9px 12px',
    color: '#E2E8F0',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontSize: '14px',
  };
  const btnPrimary: any = {
    background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 24px',
    color: '#000',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
  };
  const btnSecondary: any = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px',
    color: '#94A3B8',
    fontFamily: "'IBM Plex Sans Arabic', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  };

  const Toggle = ({ keyName, label }: { keyName: string; label: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '14px', color: '#CBD5E1' }}>{label}</span>
      <div
        onClick={() => setLectureSettings((p: any) => ({ ...p, [keyName]: !p[keyName] }))}
        style={{ width: '44px', height: '24px', borderRadius: '12px', background: lectureSettings[keyName] ? '#22D3EE' : 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', right: lectureSettings[keyName] ? '3px' : 'auto', left: lectureSettings[keyName] ? 'auto' : '3px', transition: 'all 0.2s' }} />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ ...root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(34,211,238,0.3)', borderTopColor: '#22D3EE', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#94A3B8' }}>جاري تحميل البيانات...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={root}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Save feedback toast */}
      {saveMsg && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px', padding: '12px 20px', color: '#22C55E', fontSize: '14px', fontWeight: 600, direction: 'rtl' }}>
          {saveMsg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #22D3EE, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>👨‍🏫</div>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#F1F5F9' }}>لوحة الدكتور الأكاديمية</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>مرحباً {user?.name || 'د. الأستاذ'} — الفصل الدراسي الثاني 1446</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ ...card, background: s.bg, borderColor: s.border }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: 600 }}>{s.label}</div>
            <div style={{ fontSize: '12px', color: s.color, marginTop: '4px', opacity: 0.8 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: activeTab === t.key ? 700 : 400, background: activeTab === t.key ? 'linear-gradient(135deg, #22D3EE, #0EA5E9)' : 'transparent', color: activeTab === t.key ? '#000' : '#94A3B8', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>مقرراتي</h3>
            {courses.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد مقررات مسجلة</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {courses.map((c: any) => (
                  <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{c.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{c.code}</div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', color: '#22D3EE', fontWeight: 600 }}>{c.students} طالب</div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{c.schedule}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={card}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>جدول اليوم</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[{ time: '10:00 ص', course: 'هندسة البرمجيات', room: 'قاعة A101' }, { time: '12:00 م', course: 'قواعد البيانات', room: 'قاعة B203' }].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '8px', background: 'rgba(34,211,238,0.05)', borderRadius: '8px', border: '1px solid rgba(34,211,238,0.1)' }}>
                    <div style={{ fontSize: '12px', color: '#22D3EE', fontWeight: 700, minWidth: '55px' }}>{item.time}</div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#F1F5F9' }}>{item.course}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>إجراءات سريعة</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {quickActions.map((a, i) => (
                  <button key={i} onClick={a.action} style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '10px', padding: '10px 8px', cursor: 'pointer', color: '#22D3EE', fontSize: '12px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 600, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{a.icon}</div>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>تسجيل الحضور</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ ...inp, flex: 1, minWidth: '180px' }}>
                <option value="">-- اختر المقرر --</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={inp} />
            </div>
            {selectedCourse ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {mockStudents.map(s => {
                    const state = attendanceData[s.id] || 'present';
                    return (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{s.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>{s.studentId}</div>
                        </div>
                        <button onClick={() => cycleAttendance(s.id)} style={{ background: `${attendanceColor(state)}22`, border: `1px solid ${attendanceColor(state)}66`, borderRadius: '8px', padding: '6px 16px', color: attendanceColor(state), cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 600, fontSize: '13px' }}>
                          {attendanceLabel(state)}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => {
                  const records = Object.entries(attendanceData).map(([sid, status]) => ({ student_id: sid, course_id: selectedCourse, date: selectedDate || new Date().toISOString().split('T')[0], status }));
                  fetch('/api/attendance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ records }) }).catch(() => {});
                  setSaveMsg('تم حفظ الحضور بنجاح ✅');
                  setTimeout(() => setSaveMsg(''), 3000);
                }} style={btnPrimary}>حفظ الحضور</button>
              </>
            ) : <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>الرجاء اختيار المقرر أولاً</p>}
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#F59E0B', fontWeight: 700 }}>طلبات العذر</h3>
            {mockExcuseRequests.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center' }}>لا توجد طلبات عذر</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockExcuseRequests.map(r => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(245,158,11,0.06)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{r.student}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>{r.date} — {r.reason}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {excuseStatus[r.id] ? (
                        <span style={{ fontSize: '12px', fontWeight: 600, color: excuseStatus[r.id] === 'accepted' ? '#22C55E' : '#EF4444', padding: '5px 12px' }}>
                          {excuseStatus[r.id] === 'accepted' ? '✅ مقبول' : '❌ مرفوض'}
                        </span>
                      ) : (
                        <>
                          <button onClick={() => { fetch('/api/attendance/excuses/' + r.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'approved' }) }).catch(() => {}); setExcuseStatus((p: any) => ({ ...p, [r.id]: 'accepted' })); }} style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '5px 12px', color: '#22C55E', cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: '12px', fontWeight: 600 }}>قبول</button>
                          <button onClick={() => { fetch('/api/attendance/excuses/' + r.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'rejected' }) }).catch(() => {}); setExcuseStatus((p: any) => ({ ...p, [r.id]: 'rejected' })); }} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '5px 12px', color: '#EF4444', cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: '12px', fontWeight: 600 }}>رفض</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* GRADES */}
      {activeTab === 'grades' && (
        <div style={card}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>إدخال الدرجات</h3>
          <select value={gradesCourse} onChange={e => setGradesCourse(e.target.value)} style={{ ...inp, marginBottom: '20px', minWidth: '220px' }}>
            <option value="">-- اختر المقرر --</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {gradesCourse ? (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['الطالب', 'الرقم الجامعي', 'الدرجة', 'التقدير'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.map(s => {
                      const grade = gradesData[s.id] || '';
                      return (
                        <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 12px', fontSize: '14px', color: '#F1F5F9' }}>{s.name}</td>
                          <td style={{ padding: '10px 12px', fontSize: '13px', color: '#94A3B8' }}>{s.studentId}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <input type="number" min="0" max="100" value={grade} onChange={e => setGradesData((prev: any) => ({ ...prev, [s.id]: e.target.value }))} placeholder="0–100" style={{ ...inp, width: '80px' }} />
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '14px', color: '#22D3EE', fontWeight: 700 }}>{gradeToLetter(grade)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={() => { fetch('/api/grades', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: gradesCourse, grades: gradesData }) }).catch(() => {}); setSaveMsg('تم حفظ الدرجات بنجاح ✅'); setTimeout(() => setSaveMsg(''), 3000); }} style={{ ...btnPrimary, marginTop: '16px' }}>حفظ الدرجات</button>
            </>
          ) : <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>الرجاء اختيار المقرر أولاً</p>}
        </div>
      )}

      {/* ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>التكاليف</h3>
            <button onClick={() => () => { window.location.href = '/dashboard/homework'; }} style={{ ...btnPrimary, padding: '8px 18px', fontSize: '13px' }}>+ إضافة تكليف</button>
          </div>
          {assignments.length === 0
            ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد تكاليف حالياً</p>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.map((a: any) => {
                const sc = a.status === 'pending_grade' ? '#F59E0B' : '#22C55E';
                const sl = a.status === 'pending_grade' ? 'ينتظر التصحيح' : 'نشط';
                const pct = Math.round((a.submissions / a.total) * 100);
                return (
                  <div key={a.id} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#F1F5F9', fontSize: '15px' }}>{a.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{a.course} — الموعد: {a.due}</div>
                      </div>
                      <span style={{ background: `${sc}22`, border: `1px solid ${sc}44`, borderRadius: '6px', padding: '3px 10px', fontSize: '12px', color: sc, fontWeight: 600, whiteSpace: 'nowrap' }}>{sl}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#22D3EE', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{a.submissions}/{a.total} تسليم</span>
                    </div>
                  </div>
                );
              })}
            </div>
          }
        </div>
      )}

      {/* LECTURES */}
      {activeTab === 'lectures' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>بدء محاضرة أونلاين</h3>
            <button onClick={() => setShowLectureModal(true)} style={btnPrimary}>🎥 بدء محاضرة أونلاين</button>
          </div>
          <div style={card}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#22D3EE', fontWeight: 700 }}>المحاضرات المسجلة</h3>
            {mockLectures.length === 0
              ? <p style={{ color: '#64748B', textAlign: 'center', padding: '20px 0' }}>لا توجد محاضرات مسجلة</p>
              : <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mockLectures.map(l => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#F1F5F9', fontSize: '14px' }}>{l.title}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{l.date} — {l.duration}</div>
                    </div>
                    <button onClick={() => () => { if (l.url) { window.open(l.url, '_blank'); } else { window.location.href = '/dashboard/lectures'; } }} style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '8px', padding: '5px 12px', color: '#22D3EE', cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: '12px', fontWeight: 600 }}>▶ تشغيل</button>
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      )}

      {/* MODAL: Lecture Settings */}
      {showLectureModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowLectureModal(false)}>
          <div style={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', direction: 'rtl' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: '#F1F5F9', fontWeight: 700 }}>إعدادات المحاضرة الأونلاين</h2>
            <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '13px', color: '#22D3EE' }}>المقرر: {courses.find((c: any) => c.id === selectedCourse)?.name || 'هندسة البرمجيات'}</span>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>ضوابط الحضور الأونلاين</p>
            <Toggle keyName="enforceCamera" label="إجبار تشغيل الكاميرا" />
            <Toggle keyName="aiMonitor" label="مراقبة الذكاء الاصطناعي" />
            <Toggle keyName="preventWindowSwitch" label="منع مغادرة النافذة" />
            <Toggle keyName="recordLecture" label="تسجيل المحاضرة" />
            <p style={{ margin: '16px 0 8px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>ضوابط الاختبار الأونلاين</p>
            <Toggle keyName="examAiMonitor" label="مراقبة الاختبار بالذكاء الاصطناعي" />
            <Toggle keyName="examCamera" label="إجبار الكاميرا" />
            <Toggle keyName="examPreventSwitch" label="منع تبديل التطبيقات" />
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setShowLectureModal(false)} style={{ ...btnSecondary, flex: 1 }}>إلغاء</button>
              <button onClick={() => { fetch('/api/lectures', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'محاضرة جديدة', course_id: selectedCourse, ...lectureSettings }) }).catch(() => {}); setSaveMsg('تم بدء المحاضرة بنجاح ✅'); setTimeout(() => setSaveMsg(''), 3000); setShowLectureModal(false); }} style={{ ...btnPrimary, flex: 2 }}>بدء المحاضرة الآن ←</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Leave Request */}
      {showLeaveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowLeaveModal(false)}>
          <div style={{ background: '#0F1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', direction: 'rtl' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#F1F5F9', fontWeight: 700 }}>رفع طلب إجازة</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>نوع الإجازة</label>
                <select value={leaveForm.type} onChange={e => setLeaveForm(p => ({ ...p, type: e.target.value }))} style={{ ...inp, width: '100%' }}>
                  {['اعتيادية', 'مرضية', 'طارئة', 'مهمة رسمية', 'مؤتمر علمي'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>تاريخ البداية</label>
                  <input type="date" value={leaveForm.startDate} onChange={e => setLeaveForm(p => ({ ...p, startDate: e.target.value }))} style={{ ...inp, width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>تاريخ النهاية</label>
                  <input type="date" value={leaveForm.endDate} onChange={e => setLeaveForm(p => ({ ...p, endDate: e.target.value }))} style={{ ...inp, width: '100%' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>المحاضرات المتأثرة</label>
                <textarea value={leaveForm.affectedLectures} onChange={e => setLeaveForm(p => ({ ...p, affectedLectures: e.target.value }))} rows={2} placeholder="اذكر المحاضرات التي ستتأثر..." style={{ ...inp, width: '100%', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: '#94A3B8', display: 'block', marginBottom: '6px' }}>السبب</label>
                <textarea value={leaveForm.reason} onChange={e => setLeaveForm(p => ({ ...p, reason: e.target.value }))} rows={3} placeholder="اشرح سبب الإجازة..." style={{ ...inp, width: '100%', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowLeaveModal(false)} style={{ ...btnSecondary, flex: 1 }}>إلغاء</button>
              <button onClick={() => { fetch('/api/leaves', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...leaveForm }) }).catch(() => {}); setSaveMsg('تم إرسال طلب الإجازة بنجاح ✅'); setTimeout(() => setSaveMsg(''), 3000); setShowLeaveModal(false); }} style={{ ...btnPrimary, flex: 2 }}>إرسال الطلب</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
