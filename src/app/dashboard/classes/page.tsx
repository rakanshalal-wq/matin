'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name_ar: '', grade: '', section: '', capacity: '30' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/classes', { headers: getHeaders() });
      const data = await res.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.name_ar) { setMsg('اسم الفصل مطلوب'); return; }
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/classes', { method: 'POST', headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'فشل'); setSaving(false); return; }
      setClasses([data, ...classes]);
      setForm({ name_ar: '', grade: '', section: '', capacity: '30' });
      setShowAdd(false);
    } catch { setMsg('خطأ بالاتصال'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذا الفصل؟')) return;
    await fetch(`/api/classes?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    setClasses(classes.filter(c => c.id !== id));
  };

  const canAdd = ['super_admin', 'owner', 'admin'].includes(user?.role);
  const grades = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'الأول متوسط', 'الثاني متوسط', 'الثالث متوسط', 'الأول ثانوي', 'الثاني ثانوي', 'الثالث ثانوي'];
  const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', direction: 'rtl' as const };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', margin: 0 }}>🏛️ الفصول الدراسية</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>{classes.length} فصل</p>
        </div>
        {canAdd && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
            {showAdd ? '✕ إلغاء' : '+ إضافة فصل'}
          </button>
        )}
      </div>

      {msg && <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#EF4444', marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {showAdd && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}>إضافة فصل جديد</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الفصل *</label>
              <input style={inputStyle} placeholder="مثال: فصل أ" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} />
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>المرحلة</label>
              <select style={{...inputStyle, cursor: 'pointer'}} value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}>
                <option value="">اختر المرحلة</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>الشعبة</label>
              <input style={inputStyle} placeholder="أ، ب، ج..." value={form.section} onChange={e => setForm({...form, section: e.target.value})} />
            </div>
            <div>
              <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>السعة</label>
              <input style={inputStyle} type="number" placeholder="30" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} />
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving} style={{ marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
            {saving ? 'جاري الحفظ...' : '✓ حفظ الفصل'}
          </button>
        </div>
      )}

      {classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد فصول بعد</h3>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>أضف أول فصل لمدرستك</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {classes.map((c: any) => (
            <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>{c.name_ar || c.name}</h3>
                <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(201,162,39,0.1)', color: '#C9A227' }}>{c.grade || 'بدون مرحلة'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                {c.section && <span style={{ color: '#9CA3AF', fontSize: 13 }}>📋 شعبة: {c.section}</span>}
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>👥 السعة: {c.capacity || 30}</span>
                <span style={{ color: '#9CA3AF', fontSize: 13 }}>🎓 الطلاب: {c.students_count || 0}</span>
                {c.school_name && <span style={{ color: '#9CA3AF', fontSize: 13 }}>🏫 {c.school_name}</span>}
              </div>
              {canAdd && (
                <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>🗑️ حذف</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
