'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name_ar: '', code: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/subjects', { headers: getHeaders() });
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.name_ar) { setMsg('اسم المادة مطلوب'); return; }
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/subjects', { method: 'POST', headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'فشل'); setSaving(false); return; }
      setSubjects([data, ...subjects]);
      setForm({ name_ar: '', code: '', description: '' });
      setShowAdd(false);
    } catch { setMsg('خطأ بالاتصال'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه المادة؟')) return;
    await fetch(`/api/subjects?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const canAdd = ['super_admin', 'owner', 'admin'].includes(user?.role);
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const };
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: 0 }}>📚 المواد الدراسية</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>{subjects.length} مادة</p>
        </div>
        {canAdd && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            {showAdd ? '✕ إلغاء' : '+ إضافة مادة'}
          </button>
        )}
      </div>

      {msg && <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {showAdd && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}>إضافة مادة جديدة</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المادة *</label>
              <input style={inputStyle} placeholder="مثال: الرياضيات" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} />
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>رمز المادة</label>
              <input style={inputStyle} placeholder="MATH-101" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label>
              <input style={inputStyle} placeholder="وصف مختصر للمادة" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving} style={{ marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'جاري الحفظ...' : '✓ حفظ المادة'}
          </button>
        </div>
      )}

      {subjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد مواد بعد</h3>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>أضف المواد الدراسية لمدرستك</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {subjects.map((s: any, i: number) => (
            <div key={s.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${colors[i % colors.length]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📖</div>
                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(255,255,255,0.05)', color: '#9CA3AF' }}>{s.code}</span>
              </div>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: '0 0 6px' }}>{s.name_ar || s.name}</h3>
              {s.description && <p style={{ color: '#6B7280', fontSize: 13, margin: '0 0 12px' }}>{s.description}</p>}
              {canAdd && (
                <button onClick={() => handleDelete(s.id)} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>🗑️ حذف</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
