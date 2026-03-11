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

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'homework' | 'grades' | 'exams'>('overview');
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<any>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [attendanceMsg, setAttendanceMsg] = useState('');
  const [showAddHW, setShowAddHW] = useState(false);
  const [hwForm, setHwForm] = useState({ title: '', description: '', subject: '', class_name: '', due_date: '', status: 'active' });
  const [savingHW, setSavingHW] = useState(false);
  const [hwMsg, setHwMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, classesRes, examsRes, hwRes] = await Promise.all([
        fetch('/api/dashboard-stats', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
        fetch('/api/exams', { headers: getHeaders() }),
        fetch('/api/homework', { headers: getHeaders() }),
      ]);
      const [statsData, classesData, examsData, hwData] = await Promise.all([
        statsRes.json(), classesRes.json(), examsRes.json(), hwRes.json()
      ]);
      setStats(statsData || {});
      setClasses(Array.isArray(classesData) ? classesData : []);
      setExams(Array.isArray(examsData) ? examsData : []);
      setHomework(Array.isArray(hwData) ? hwData : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadStudents = async (classId: string) => {
    if (!classId) return;
    try {
      const res = await fetch(`/api/students?class_id=${classId}`, { headers: getHeaders() });
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      const init: any = {};
      (Array.isArray(data) ? data : []).forEach((s: any) => { init[s.id] = 'PRESENT'; });
      setAttendance(init);
    } catch {}
  };

  const saveAttendance = async () => {
    if (!selectedClass || students.length === 0) { setAttendanceMsg('اختر فصلاً أولاً'); return; }
    setSavingAttendance(true); setAttendanceMsg('');
    try {
      const records = students.map(s => ({ student_id: s.id, class_id: selectedClass, date: attendanceDate, status: attendance[s.id] || 'PRESENT' }));
      const res = await fetch('/api/attendance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ records }) });
      if (res.ok) { setAttendanceMsg('✅ تم حفظ الحضور بنجاح'); }
      else { const data = await res.json(); setAttendanceMsg('❌ ' + (data.error || 'فشل الحفظ')); }
    } catch { setAttendanceMsg('❌ خطأ في الاتصال'); }
    finally { setSavingAttendance(false); }
  };

  const addHomework = async () => {
    if (!hwForm.title) { setHwMsg('العنوان مطلوب'); return; }
    setSavingHW(true); setHwMsg('');
    try {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      const res = await fetch('/api/homework', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ ...hwForm, teacher_name: u?.name }) });
      const data = await res.json();
      if (res.ok) { setHomework([data, ...homework]); setHwForm({ title: '', description: '', subject: '', class_name: '', due_date: '', status: 'active' }); setShowAddHW(false); setHwMsg('✅ تم إضافة الواجب'); }
      else { setHwMsg('❌ ' + (data.error || 'فشل')); }
    } catch { setHwMsg('❌ خطأ'); }
    finally { setSavingHW(false); }
  };

  const deleteHomework = async (id: number) => {
    if (!confirm('حذف هذا الواجب؟')) return;
    await fetch(`/api/homework?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    setHomework(homework.filter((h: any) => h.id !== id));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>👨‍🏫</div>
        <div style={{ color: '#10B981', fontWeight: 700, fontSize: 18 }}>جاري تحميل لوحة المعلم...</div>
      </div>
    </div>
  );

  const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const, boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍🏫</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>لوحة تحكم المعلم</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>مرحباً {user?.name} 👋</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[{ id: 'overview', label: 'نظرة عامة', icon: '📊' }, { id: 'attendance', label: 'الحضور', icon: '✋' }, { id: 'homework', label: 'الواجبات', icon: '📒' }, { id: 'grades', label: 'الدرجات', icon: '📈' }, { id: 'exams', label: 'الاختبارات', icon: '📝' }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, background: activeTab === tab.id ? '#10B981' : 'rgba(255,255,255,0.05)', color: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.7)', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[{ label: 'فصولي', value: classes.length, icon: '🏛', color: '#3B82F6' }, { label: 'طلابي', value: stats.my_students || stats.students || 0, icon: '👥', color: '#10B981' }, { label: 'واجبات نشطة', value: homework.filter((h: any) => h.status === 'active').length, icon: '📒', color: '#F59E0B' }, { label: 'اختبارات', value: exams.length, icon: '📝', color: '#8B5CF6' }].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ color: s.color, fontSize: 30, fontWeight: 800 }}>{s.value}</div>
                  </div>
                  <div style={{ fontSize: 32 }}>{s.icon}</div>
                </div>
              </div>
            ))}
          </div>
          <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚡ إجراءات سريعة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 28 }}>
            {[{ label: 'تسجيل الحضور', icon: '✋', tab: 'attendance' }, { label: 'إضافة واجب', icon: '📒', tab: 'homework' }, { label: 'رصد الدرجات', icon: '📈', tab: 'grades' }].map((a, i) => (
              <div key={i} onClick={() => setActiveTab(a.tab as any)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 12px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{a.icon}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
              </div>
            ))}
            {[{ label: 'إنشاء اختبار', icon: '📝', href: '/dashboard/exams' }, { label: 'بنك الأسئلة', icon: '❓', href: '/dashboard/question-bank' }, { label: 'الرسائل', icon: '✉️', href: '/dashboard/messages' }].map((a, i) => (
              <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 12px', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{a.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
                </div>
              </Link>
            ))}
          </div>
          {classes.length > 0 && (
            <div>
              <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏛 فصولي</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {classes.map((cls: any) => (
                  <div key={cls.id} style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12, padding: 16 }}>
                    <div style={{ color: 'white', fontWeight: 700, marginBottom: 4 }}>{cls.name_ar || cls.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>الصف: {cls.grade} | الطلاب: {cls.students_count || 0}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'attendance' && (
        <div>
          <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, marginBottom: 20 }}>✋ تسجيل الحضور</h2>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 8 }}>الفصل الدراسي</label>
                <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); loadStudents(e.target.value); }} style={inputStyle}>
                  <option value="">-- اختر الفصل --</option>
                  {classes.map((cls: any) => (<option key={cls.id} value={cls.id}>{cls.name_ar || cls.name} - {cls.grade}</option>))}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 8 }}>التاريخ</label>
                <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>
          {selectedClass && students.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>طلاب الفصل ({students.length})</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { const all: any = {}; students.forEach((s: any) => { all[s.id] = 'PRESENT'; }); setAttendance(all); }} style={{ padding: '6px 14px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>✅ تحضير الكل</button>
                  <button onClick={() => { const all: any = {}; students.forEach((s: any) => { all[s.id] = 'ABSENT'; }); setAttendance(all); }} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>❌ غياب الكل</button>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 8, marginBottom: 20 }}>
                {students.map((student: any, i: number) => (
                  <div key={student.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', fontWeight: 700, fontSize: 14 }}>{i + 1}</div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>{student.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{student.student_id || student.id}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[{ value: 'PRESENT', label: 'حاضر', color: '#10B981' }, { value: 'ABSENT', label: 'غائب', color: '#EF4444' }, { value: 'LATE', label: 'متأخر', color: '#F59E0B' }, { value: 'EXCUSED', label: 'معذور', color: '#8B5CF6' }].map(opt => (
                        <button key={opt.value} onClick={() => setAttendance({ ...attendance, [student.id]: opt.value })} style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, background: attendance[student.id] === opt.value ? opt.color : 'rgba(255,255,255,0.05)', color: attendance[student.id] === opt.value ? 'white' : 'rgba(255,255,255,0.5)' }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {attendanceMsg && (<div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: attendanceMsg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: attendanceMsg.includes('✅') ? '#10B981' : '#EF4444' }}>{attendanceMsg}</div>)}
              <button onClick={saveAttendance} disabled={savingAttendance} style={{ padding: '12px 32px', background: savingAttendance ? 'rgba(16,185,129,0.3)' : '#10B981', color: 'white', border: 'none', borderRadius: 10, cursor: savingAttendance ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 16, fontFamily: 'inherit' }}>
                {savingAttendance ? '⏳ جاري الحفظ...' : '💾 حفظ الحضور'}
              </button>
            </div>
          )}
          {selectedClass && students.length === 0 && (<div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا يوجد طلاب في هذا الفصل</div>)}
          {!selectedClass && (<div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>اختر فصلاً لبدء تسجيل الحضور</div>)}
        </div>
      )}

      {activeTab === 'homework' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>📒 الواجبات المنزلية</h2>
            <button onClick={() => setShowAddHW(!showAddHW)} style={{ padding: '10px 20px', background: showAddHW ? 'rgba(255,255,255,0.1)' : '#F59E0B', color: showAddHW ? 'white' : '#0D1B2A', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
              {showAddHW ? '✕ إلغاء' : '+ إضافة واجب'}
            </button>
          </div>
          {showAddHW && (
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>عنوان الواجب *</label><input value={hwForm.title} onChange={e => setHwForm({...hwForm, title: e.target.value})} placeholder="عنوان الواجب" style={inputStyle} /></div>
                <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>المادة</label><input value={hwForm.subject} onChange={e => setHwForm({...hwForm, subject: e.target.value})} placeholder="المادة الدراسية" style={inputStyle} /></div>
                <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>الفصل</label><select value={hwForm.class_name} onChange={e => setHwForm({...hwForm, class_name: e.target.value})} style={inputStyle}><option value="">-- اختر الفصل --</option>{classes.map((cls: any) => (<option key={cls.id} value={cls.name_ar || cls.name}>{cls.name_ar || cls.name}</option>))}</select></div>
                <div><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>تاريخ التسليم</label><input type="date" value={hwForm.due_date} onChange={e => setHwForm({...hwForm, due_date: e.target.value})} style={inputStyle} /></div>
              </div>
              <div style={{ marginBottom: 16 }}><label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>التفاصيل</label><textarea value={hwForm.description} onChange={e => setHwForm({...hwForm, description: e.target.value})} placeholder="وصف الواجب..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              {hwMsg && (<div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: hwMsg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: hwMsg.includes('✅') ? '#10B981' : '#EF4444' }}>{hwMsg}</div>)}
              <button onClick={addHomework} disabled={savingHW} style={{ padding: '10px 24px', background: '#F59E0B', color: '#0D1B2A', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>{savingHW ? '⏳ جاري الحفظ...' : '💾 حفظ الواجب'}</button>
            </div>
          )}
          <div style={{ display: 'grid', gap: 10 }}>
            {homework.length === 0 ? (<div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا توجد واجبات بعد</div>) : homework.map((hw: any) => (
              <div key={hw.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 700 }}>{hw.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                    {hw.subject && <span style={{ marginLeft: 12 }}>📚 {hw.subject}</span>}
                    {hw.class_name && <span style={{ marginLeft: 12 }}>🏛 {hw.class_name}</span>}
                    {hw.due_date && <span>📅 {new Date(hw.due_date).toLocaleDateString('ar-SA')}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, background: hw.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)', color: hw.status === 'active' ? '#10B981' : '#9CA3AF' }}>{hw.status === 'active' ? 'نشط' : 'منتهي'}</span>
                  <button onClick={() => deleteHomework(hw.id)} style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'grades' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>📈 رصد الدرجات</h2>
            <Link href="/dashboard/grades"><button style={{ padding: '10px 20px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>فتح صفحة الدرجات</button></Link>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>لرصد الدرجات وإدارتها بشكل كامل، استخدم صفحة الدرجات المخصصة</p>
            <Link href="/dashboard/grades"><button style={{ padding: '12px 28px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', marginTop: 16 }}>📈 الذهاب إلى صفحة الدرجات</button></Link>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>📝 الاختبارات ({exams.length})</h2>
            <Link href="/dashboard/exams"><button style={{ padding: '10px 20px', background: '#8B5CF6', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>+ إنشاء اختبار</button></Link>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {exams.length === 0 ? (<div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: 40 }}>لا توجد اختبارات بعد</div>) : exams.slice(0, 10).map((exam: any) => (
              <div key={exam.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 700 }}>{exam.title_ar || exam.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                    {exam.type && <span style={{ marginLeft: 12 }}>📋 {exam.type}</span>}
                    {exam.total_marks && <span style={{ marginLeft: 12 }}>💯 {exam.total_marks} درجة</span>}
                    {exam.duration && <span>⏱️ {exam.duration} دقيقة</span>}
                  </div>
                </div>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: exam.status === 'PUBLISHED' ? 'rgba(59,130,246,0.1)' : 'rgba(156,163,175,0.1)', color: exam.status === 'PUBLISHED' ? '#3B82F6' : '#9CA3AF' }}>
                  {exam.status === 'PUBLISHED' ? 'منشور' : exam.status === 'DRAFT' ? 'مسودة' : exam.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
