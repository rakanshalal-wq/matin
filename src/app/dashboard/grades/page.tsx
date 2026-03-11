'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

const gradeColors: any = { 'A+': '#10B981', 'A': '#10B981', 'B': '#3B82F6', 'C': '#F59E0B', 'D': '#F97316', 'F': '#EF4444' };

export default function GradesPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedExam, setSelectedExam] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [gradeInputs, setGradeInputs] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [gRes, eRes, sRes] = await Promise.all([
        fetch('/api/grades', { headers: getHeaders() }),
        fetch('/api/exams', { headers: getHeaders() }),
        fetch('/api/students', { headers: getHeaders() }),
      ]);
      const [gData, eData, sData] = await Promise.all([gRes.json(), eRes.json(), sRes.json()]);
      setGrades(Array.isArray(gData) ? gData : []);
      setExams(Array.isArray(eData) ? eData : []);
      setStudents(Array.isArray(sData) ? sData : []);
    } catch {} finally { setLoading(false); }
  };

  const handleExamChange = async (examId: string) => {
    setSelectedExam(examId);
    if (examId) {
      const res = await fetch(`/api/grades?exam_id=${examId}`, { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        const map: any = {};
        data.forEach((g: any) => { map[g.student_id] = g.marks; });
        setGradeInputs(map);
      }
    }
  };

  const handleSaveGrades = async () => {
    if (!selectedExam) return;
    setSaving(true); setMsg('');
    const exam = exams.find(e => e.id === selectedExam);
    const maxMarks = exam?.total_marks || 100;
    try {
      const records = students.filter(s => gradeInputs[s.id] !== undefined && gradeInputs[s.id] !== '').map(s => ({
        student_id: s.id,
        exam_id: selectedExam,
        marks: parseFloat(gradeInputs[s.id]) || 0,
        max_marks: maxMarks,
      }));
      if (records.length === 0) { setMsg('أدخل درجة طالب واحد على الأقل'); setSaving(false); return; }
      const res = await fetch('/api/grades', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ records }) });
      if (res.ok) setMsg('تم حفظ الدرجات بنجاح ✓');
      else { const d = await res.json(); setMsg(d.error || 'فشل'); }
    } catch { setMsg('خطأ'); } finally { setSaving(false); }
  };

  const canEdit = ['super_admin', 'owner', 'admin', 'teacher'].includes(user?.role);
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: 0 }}>📊 الدرجات</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>{grades.length} درجة مسجلة</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            {showAdd ? '✕ إلغاء' : '+ تسجيل درجات'}
          </button>
        )}
      </div>

      <div style={{ padding: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#F59E0B' }}>
        ⚠️ القاعدة الذهبية: الدرجات ترتفع فقط ولا تنقص أبداً بعد التسجيل
      </div>

      {msg && <div style={{ padding: 12, background: msg.includes('✓') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msg.includes('✓') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 10, color: msg.includes('✓') ? '#10B981' : '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {/* تسجيل درجات */}
      {showAdd && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 16px', fontWeight: 700 }}>تسجيل درجات اختبار</h3>
          <select style={{...inputStyle, maxWidth: 400, cursor: 'pointer', marginBottom: 20}} value={selectedExam} onChange={e => handleExamChange(e.target.value)}>
            <option value="">-- اختر الاختبار --</option>
            {exams.map(e => <option key={e.id} value={e.id}>{e.title_ar || e.title} ({e.total_marks} درجة)</option>)}
          </select>

          {selectedExam && students.length > 0 && (
            <>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                {students.map((s: any, i: number) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700 }}>{i + 1}</span>
                      <span style={{ color: '#fff', fontSize: 14 }}>{s.name || s.student_id}</span>
                    </div>
                    <input type="number" placeholder="الدرجة" style={{...inputStyle, maxWidth: 120, textAlign: 'center' as const}} value={gradeInputs[s.id] || ''} onChange={e => setGradeInputs({...gradeInputs, [s.id]: e.target.value})} />
                  </div>
                ))}
              </div>
              <button onClick={handleSaveGrades} disabled={saving} style={{ marginTop: 16, padding: '12px 32px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
                {saving ? 'جاري الحفظ...' : '✓ حفظ الدرجات'}
              </button>
            </>
          )}
        </div>
      )}

      {/* عرض الدرجات */}
      {grades.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد درجات مسجلة</h3>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px 80px', padding: '12px 20px', background: 'rgba(201,162,39,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700 }}>الطالب</span>
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700 }}>الاختبار</span>
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700, textAlign: 'center' as const }}>الدرجة</span>
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700, textAlign: 'center' as const }}>النسبة</span>
            <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700, textAlign: 'center' as const }}>التقدير</span>
          </div>
          {grades.map((g: any, i: number) => (
            <div key={g.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px 80px', padding: '12px 20px', borderBottom: i < grades.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontSize: 14 }}>{g.student_name || g.student_number || '-'}</span>
              <span style={{ color: '#9CA3AF', fontSize: 13 }}>{g.exam_title || '-'}</span>
              <span style={{ color: '#fff', fontSize: 14, textAlign: 'center' as const, fontWeight: 700 }}>{g.marks}/{g.max_marks}</span>
              <span style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center' as const }}>{g.percentage ? g.percentage.toFixed(0) + '%' : '-'}</span>
              <span style={{ textAlign: 'center' as const }}>
                <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: gradeColors[g.grade] || '#9CA3AF', background: (gradeColors[g.grade] || '#9CA3AF') + '20' }}>{g.grade || '-'}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
