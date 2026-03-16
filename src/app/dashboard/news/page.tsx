'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const GOLD = '#C9A84C';
const BG = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news', { headers: getHeaders() });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { setItems([]); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? '/api/news?id=' + editItem.id : '/api/news';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      if (res.ok) { setShowModal(false); setEditItem(null); setForm({}); fetchItems(); }
      else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
    } catch { } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل انت متاكد من الحذف؟')) return;
    try { await fetch('/api/news?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch { }
  };

  const openEdit = (item: any) => { setEditItem(item); setForm({ ...item }); setShowModal(true); };
  const filtered = items.filter((r: any) => !searchTerm || JSON.stringify(r).includes(searchTerm));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📰 الأخبار والإعلانات</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>نشر الأخبار والإعلانات المدرسية</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({}); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة جديد</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: '18px 20px' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: GOLD }}>{items.length}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>الاجمالي</div>
        </div>
        
      </div>

      <input placeholder="🔍 بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 300, marginBottom: 20 }} />

      <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد بيانات بعد</p>
            <button onClick={() => { setForm({}); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة اول سجل</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid ' + BORDER }}>
                  
                  <th style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>اجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r: any, i: number) => (
                  <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BORDER }}>
                    {Object.keys(r).filter(k => k !== 'id' && k !== 'school_id' && k !== 'created_at' && k !== 'updated_at').slice(0, 6).map(k => (
                      <td key={k} style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(r[k] ?? '—')}</td>
                    ))}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button>
                        <button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#12121F', border: '1px solid ' + BORDER, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'اضافة جديد'} — الأخبار والإعلانات</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.keys(form).filter(k => k !== 'id' && k !== 'school_id' && k !== 'created_at' && k !== 'updated_at').map(k => (
                <div key={k}>
                  <label style={lbl}>{k.replace(/_/g, ' ')}</label>
                  {String(form[k]).length > 60 ? (
                    <textarea value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={{ ...inp, height: 80, resize: 'vertical' as const }} />
                  ) : (
                    <input value={form[k] || ''} onChange={e => setForm({ ...form, [k]: e.target.value })} style={inp} />
                  )}
                </div>
              ))}
              {Object.keys(form).length === 0 && (
                <div>
                  <label style={lbl}>العنوان *</label>
                  <input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="ادخل العنوان" style={inp} />
                  <label style={{ ...lbl, marginTop: 14 }}>الوصف</label>
                  <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر..." style={{ ...inp, height: 80, resize: 'vertical' as const }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة'}</button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
