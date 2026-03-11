'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function BehaviorPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ student_name: '', type: 'positive', category: '', description: '', points: '', teacher_name: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/behavior', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async () => {
    if (!formData.student_name) return alert('أدخل اسم الطالب');
    setSaving(true);
    try {
      const res = await fetch('/api/behavior', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ student_name: '', type: 'positive', category: '', description: '', points: '', teacher_name: '' }); fetchItems(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/behavior?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const filteredItems = items.filter(i => i.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.category?.toLowerCase().includes(searchTerm.toLowerCase()));
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>⭐ السلوك والمواظبة</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>متابعة سلوك الطلاب وتسجيل الملاحظات</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ تسجيل ملاحظة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي السجلات', value: items.length, icon: '⭐', color: '#C9A227' },
          { label: 'إيجابي', value: items.filter(i => i.type === 'positive').length, icon: '👍', color: '#10B981' },
          { label: 'سلبي', value: items.filter(i => i.type === 'negative').length, icon: '👎', color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}>{stat.icon}</span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث بالاسم أو التصنيف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⭐</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد سجلات سلوك</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ تسجيل أول ملاحظة</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>الطالب</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>النوع</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التصنيف</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>النقاط</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المعلم</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التاريخ</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: item.type === 'positive' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.type === 'positive' ? '👍' : '👎'}</div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.student_name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.description || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: item.type === 'positive' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: item.type === 'positive' ? '#10B981' : '#EF4444', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.type === 'positive' ? 'إيجابي' : 'سلبي'}</span></td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.category || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: item.type === 'positive' ? '#10B981' : '#EF4444', fontSize: 15, fontWeight: 700 }}>{item.type === 'positive' ? '+' : '-'}{item.points || 0}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.teacher_name || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>🗑️ حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>⭐ تسجيل ملاحظة سلوك</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label><input value={formData.student_name} onChange={e => setFormData({ ...formData, student_name: e.target.value })} placeholder="اسم الطالب" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="positive" style={{ background: '#0D1B2A' }}>إيجابي</option><option value="negative" style={{ background: '#0D1B2A' }}>سلبي</option></select></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التصنيف</label><select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="" style={{ background: '#0D1B2A' }}>اختر</option><option value="discipline" style={{ background: '#0D1B2A' }}>انضباط</option><option value="participation" style={{ background: '#0D1B2A' }}>مشاركة</option><option value="homework" style={{ background: '#0D1B2A' }}>واجبات</option><option value="respect" style={{ background: '#0D1B2A' }}>احترام</option><option value="other" style={{ background: '#0D1B2A' }}>أخرى</option></select></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>النقاط</label><input value={formData.points} onChange={e => setFormData({ ...formData, points: e.target.value })} placeholder="عدد النقاط" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المعلم</label><input value={formData.teacher_name} onChange={e => setFormData({ ...formData, teacher_name: e.target.value })} style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="تفاصيل الملاحظة" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ'}</button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
