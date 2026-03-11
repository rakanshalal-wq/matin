'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function TasksPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', assigned_to: '', priority: 'medium', status: 'pending', due_date: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/tasks', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async () => {
    if (!formData.title) return alert('أدخل عنوان المهمة');
    setSaving(true);
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ title: '', description: '', assigned_to: '', priority: 'medium', status: 'pending', due_date: '' }); fetchItems(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/tasks?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high': return { text: 'عالية', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
      case 'medium': return { text: 'متوسطة', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
      case 'low': return { text: 'منخفضة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      default: return { text: p, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'pending': return { text: 'قيد الانتظار', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
      case 'in_progress': return { text: 'جاري التنفيذ', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
      case 'completed': return { text: 'مكتملة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      case 'cancelled': return { text: 'ملغية', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
      default: return { text: s, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  const filteredItems = items.filter(i => i.title?.toLowerCase().includes(searchTerm.toLowerCase()) || i.assigned_to?.toLowerCase().includes(searchTerm.toLowerCase()));
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>✅ المهام</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة ومتابعة المهام والتكليفات</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة مهمة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المهام', value: items.length, icon: '✅', color: '#C9A227' },
          { label: 'قيد الانتظار', value: items.filter(i => i.status === 'pending').length, icon: '⏳', color: '#F59E0B' },
          { label: 'جاري التنفيذ', value: items.filter(i => i.status === 'in_progress').length, icon: '🔄', color: '#3B82F6' },
          { label: 'مكتملة', value: items.filter(i => i.status === 'completed').length, icon: '🏆', color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}>{stat.icon}</span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث بالعنوان أو المكلف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>✅</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد مهام</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة أول مهمة</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>المهمة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المكلف</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الأولوية</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الموعد النهائي</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const priority = getPriorityBadge(item.priority);
                const status = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(16,185,129,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✅</div>
                        <div>
                          <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.title}</p>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.description || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.assigned_to || '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: priority.bg, color: priority.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{priority.text}</span></td>
                    <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: status.bg, color: status.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{status.text}</span></td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.due_date ? new Date(item.due_date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>✏️ تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>🗑️ حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>✅ إضافة مهمة جديدة</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان المهمة *</label><input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="مثال: تجهيز تقرير الأداء" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المكلف</label><input value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموعد النهائي</label><input type="date" value={formData.due_date} onChange={e => setFormData({ ...formData, due_date: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الأولوية</label><select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="high" style={{ background: '#0D1B2A' }}>عالية</option><option value="medium" style={{ background: '#0D1B2A' }}>متوسطة</option><option value="low" style={{ background: '#0D1B2A' }}>منخفضة</option></select></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="pending" style={{ background: '#0D1B2A' }}>قيد الانتظار</option><option value="in_progress" style={{ background: '#0D1B2A' }}>جاري التنفيذ</option><option value="completed" style={{ background: '#0D1B2A' }}>مكتملة</option></select></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="تفاصيل المهمة" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ المهمة'}</button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
