'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'active' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/gallery', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async () => {
    if (!formData.title) return alert('أدخل البيانات المطلوبة');
    setSaving(true);
    try {
      const res = await fetch('/api/gallery', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ title: '', description: '', status: 'active' }); fetchItems(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/gallery?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const filteredItems = items.filter((i: any) => {
    const s = searchTerm.toLowerCase();
    return i.title?.toLowerCase().includes(s) || i.name?.toLowerCase().includes(s) || i.student_name?.toLowerCase().includes(s) || i.description?.toLowerCase().includes(s);
  });

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🖼️ معرض الصور</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة معرض الصور</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة جديد</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}>🖼️</span><span style={{ fontSize: 28, fontWeight: 800, color: '#C9A227' }}>{items.length}</span></div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>الإجمالي</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🖼️</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد بيانات</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة</button>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>العنوان</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التاريخ</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(201,162,39,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🖼️</div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.title || item.name || item.student_name || item.item_name || item.code || '—'}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.description || item.content || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status || 'نشط'}</span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>👁️ عرض</button>
                      <button style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>✏️ تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>🗑️ حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>🖼️ إضافة جديد</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>العنوان *</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="أدخل العنوان" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="الوصف" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ'}</button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
