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

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [exams, setExams] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'grades' | 'homework'>('overview');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, examsRes, gradesRes, hwRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/exams', { headers: getHeaders() }),
        fetch('/api/grades', { headers: getHeaders() }),
        fetch('/api/homework', { headers: getHeaders() }),
      ]);
      const [statsData, examsData, gradesData, hwData] = await Promise.all([
        statsRes.json(), examsRes.json(), gradesRes.json(), hwRes.json()
      ]);
      setStats(statsData || {});
      setExams(Array.isArray(examsData) ? examsData : []);
      setGrades(Array.isArray(gradesData) ? gradesData : []);
      setHomework(Array.isArray(hwData) ? hwData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
        <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: 18 }}>جاري تحميل بوابة الطالب...</div>
      </div>
    </div>
  );

  const publishedExams = exams.filter((e: any) => e.status === 'PUBLISHED' || e.status === 'ACTIVE');
  const avgGrade = grades.length > 0 ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.percentage || 0), 0) / grades.length) : 0;
  const pendingHW = homework.filter((h: any) => h.status === 'active').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 16, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎓</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}>مرحباً {user?.name} 👋</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '4px 0 0' }}>بوابة الطالب - منصة متين التعليمية</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ id: 'overview', label: 'نظرة عامة', icon: '📊' }, { id: 'exams', label: 'اختباراتي', icon: '📝' }, { id: 'grades', label: 'درجاتي', icon: '📈' }, { id: 'homework', label: 'واجباتي', icon: '📒' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, background: activeTab === tab.id ? '#3B82F6' : 'rgba(255,255,255,0.05)', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.7)', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* === نظرة عامة === */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'متوسط الدرجات', value: `${avgGrade}%`, icon: '📈', color: '#10B981' },
              { label: 'اختبارات متاحة', value: publishedExams.length, icon: '📝', color: '#3B82F6' },
              { label: 'واجبات معلقة', value: pendingHW, icon: '📒', color: '#F59E0B' },
              { label: 'نسبة الحضور', value: `${stats.attendance_rate || 0}%`, icon: '✅', color: '#8B5CF6' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ color: s.color, fontSize: 28, fontWeight: 800 }}>{s.value}</div>
                  </div>
                  <div style={{ fontSize: 30 }}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* روابط سريعة */}
          <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🚀 الوصول السريع</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
            {[
              { label: 'اختباراتي', icon: '📝', tab: 'exams', color: '#3B82F6' },
              { label: 'درجاتي', icon: '📈', tab: 'grades', color: '#10B981' },
              { label: 'واجباتي', icon: '📒', tab: 'homework', color: '#F59E0B' },
            ].map((a, i) => (
              <div key={i} onClick={() => setActiveTab(a.tab as any)} style={{ background: `${a.color}10`, border: `1px solid ${a.color}30`, borderRadius: 12, padding: '18px 12px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ color: a.color, fontSize: 13, fontWeight: 700 }}>{a.label}</div>
              </div>
            ))}
            {[
              { label: 'الجدول', icon: '📅', href: '/dashboard/schedules' },
              { label: 'المكتبة', icon: '📚', href: '/dashboard/library' },
              { label: 'الرسائل', icon: '✉️', href: '/dashboard/messages' },
            ].map((a, i) => (
              <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '18px 12px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* اختبارات متاحة */}
          {publishedExams.length > 0 && (
            <div>
              <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📝 اختبارات متاحة الآن</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {publishedExams.slice(0, 3).map((exam: any) => (
                  <div key={exam.id} style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700 }}>{exam.title_ar || exam.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                        ⏱️ {exam.duration} دقيقة | 💯 {exam.total_marks} درجة
                      </div>
                    </div>
                    <Link href={`/dashboard/exam-take?exam_id=${exam.id}&student_id=${user?.id}`}>
                      <button style={{ padding: '8px 18px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>
                        ابدأ الاختبار
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === اختباراتي === */}
      {activeTab === 'exams' && (
        <div>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>📝 اختباراتي ({exams.length})</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {exams.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا توجد اختبارات بعد</div>
            ) : exams.map((exam: any) => (
              <div key={exam.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, marginBottom: 4 }}>{exam.title_ar || exam.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                    ⏱️ {exam.duration} دقيقة | 💯 {exam.total_marks} درجة | 🎯 {exam.passing_marks} للنجاح
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: exam.status === 'PUBLISHED' ? 'rgba(59,130,246,0.15)' : exam.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(156,163,175,0.1)', color: exam.status === 'PUBLISHED' ? '#3B82F6' : exam.status === 'ACTIVE' ? '#10B981' : '#9CA3AF' }}>
                    {exam.status === 'PUBLISHED' ? '📢 منشور' : exam.status === 'ACTIVE' ? '⚡ جاري' : exam.status === 'DRAFT' ? '📝 مسودة' : exam.status}
                  </span>
                  {(exam.status === 'PUBLISHED' || exam.status === 'ACTIVE') && (
                    <Link href={`/dashboard/exam-take?exam_id=${exam.id}&student_id=${user?.id}`}>
                      <button style={{ padding: '7px 16px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>
                        ابدأ الاختبار ←
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === درجاتي === */}
      {activeTab === 'grades' && (
        <div>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>📈 درجاتي ({grades.length})</h2>
          {grades.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا توجد درجات بعد</div>
          ) : (
            <div>
              {/* ملخص */}
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 14, padding: 20, marginBottom: 20, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#10B981', fontSize: 32, fontWeight: 800 }}>{avgGrade}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>المتوسط العام</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3B82F6', fontSize: 32, fontWeight: 800 }}>{grades.length}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>عدد المواد</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#F59E0B', fontSize: 32, fontWeight: 800 }}>{grades.filter((g: any) => (g.percentage || 0) >= 60).length}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>مواد ناجح</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {grades.map((grade: any) => (
                  <div key={grade.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'white', fontWeight: 700 }}>{grade.course_name || grade.course_id}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                        {grade.marks} / {grade.max_marks} درجة
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: (grade.percentage || 0) >= 90 ? '#10B981' : (grade.percentage || 0) >= 70 ? '#3B82F6' : (grade.percentage || 0) >= 60 ? '#F59E0B' : '#EF4444' }}>
                        {grade.grade || `${Math.round(grade.percentage || 0)}%`}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{Math.round(grade.percentage || 0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* === واجباتي === */}
      {activeTab === 'homework' && (
        <div>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>📒 واجباتي ({homework.length})</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {homework.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا توجد واجبات بعد</div>
            ) : homework.map((hw: any) => (
              <div key={hw.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 700 }}>{hw.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                    {hw.subject && <span style={{ marginLeft: 12 }}>📚 {hw.subject}</span>}
                    {hw.teacher_name && <span style={{ marginLeft: 12 }}>👨‍🏫 {hw.teacher_name}</span>}
                    {hw.due_date && <span>📅 التسليم: {new Date(hw.due_date).toLocaleDateString('ar-SA')}</span>}
                  </div>
                  {hw.description && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 6 }}>{hw.description}</div>}
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: hw.status === 'active' ? 'rgba(245,158,11,0.1)' : 'rgba(156,163,175,0.1)', color: hw.status === 'active' ? '#F59E0B' : '#9CA3AF' }}>
                  {hw.status === 'active' ? '⏳ معلق' : '✅ منتهي'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
