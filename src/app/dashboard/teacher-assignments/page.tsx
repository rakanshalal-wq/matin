'use client';
import { useState, useEffect } from 'react';
const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ teacher_id: '', subject_id: '', class_id: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [aRes, tRes, sRes, cRes] = await Promise.all([
        fetch('/api/teacher-assignments', { headers: getHeaders() }),
        fetch('/api/teachers', { headers: getHeaders() }),
        fetch('/api/subjects', { headers: getHeaders() }),
        fetch('/api/classes', { headers: getHeaders() }),
      ]);
      setAssignments(await aRes.json().then(d => Array.isArray(d) ? d : []));
      setTeachers(await tRes.json().then(d => Array.isArray(d) ? d : []));
      setSubjects(await sRes.json().then(d => Array.isArray(d) ? d : []));
      setClasses(await cRes.json().then(d => Array.isArray(d) ? d : []));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.teacher_id || !form.subject_id || !form.class_id) return alert('اختر المعلم والمادة والفصل');
    setSaving(true);
    try {
      const res = await fetch('/api/teacher-assignments', { method: 'POST', headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) { setShowAdd(false); setForm({ teacher_id: '', subject_id: '', class_id: '' }); fetchAll(); }
      else alert(data.error || 'فشل');
    } catch (e) { alert('خطأ'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا التعيين؟')) return;
    await fetch('/api/teacher-assignments?id=' + id, { method: 'DELETE', headers: getHeaders() });
    fetchAll();
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, appearance: 'auto' as any };

  return (
    <div style={{ padding: 24, fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0D1B2A', margin: 0 }}>📚 تعيين المعلمين</h1>
          <p style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>ربط المعلم بالمادة والفصل الدراسي</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>+ تعيين جديد</button>
      </div>

      {subjects.length === 0 && !loading && (
        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <p style={{ color: '#92400E', margin: 0, fontSize: 14 }}>⚠️ لا توجد مواد دراسية. أضف المواد أولاً من صفحة <a href="/dashboard/subjects" style={{ color: '#C9A227', fontWeight: 700 }}>المواد الدراسية</a></p>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>⏳ جاري التحميل...</div>
      ) : assignments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: 64 }}>📭</div>
          <h3 style={{ color: '#0D1B2A', fontSize: 20, fontWeight: 700, marginTop: 16 }}>لا توجد تعيينات</h3>
          <p style={{ color: '#6B7280', fontSize: 14 }}>عيّن المعلمين للمواد والفصول</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.08)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>المعلم</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المادة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الفصل</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a: any) => (
                <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: 16, color: 'white', fontWeight: 600 }}>👨‍🏫 {a.teacher_name || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>{a.subject_name || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>{a.class_name || '—'} {a.grade ? '(' + a.grade + ')' : ''}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button onClick={() => handleDelete(a.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontSize: 13 }}>🗑️ حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 500 }}>
            <h2 style={{ color: '#C9A227', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>+ تعيين جديد</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المعلم *</label>
                <select value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })} style={inputStyle}>
                  <option value="">-- اختر المعلم --</option>
                  {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name} ({t.employee_id})</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المادة *</label>
                <select value={form.subject_id} onChange={e => setForm({ ...form, subject_id: e.target.value })} style={inputStyle}>
                  <option value="">-- اختر المادة --</option>
                  {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل *</label>
                <select value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })} style={inputStyle}>
                  <option value="">-- اختر الفصل --</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name_ar} - {c.grade}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? '⏳ جاري الحفظ...' : '💾 حفظ التعيين'}
              </button>
              <button onClick={() => setShowAdd(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
