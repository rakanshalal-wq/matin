'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function CreditHoursPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ subject_name: '', code: '', hours: '', type: 'required', semester: '', department: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/credit-hours', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async () => {
    if (!formData.subject_name) return alert('أدخل اسم المقرر');
    setSaving(true);
    try {
      const res = await fetch('/api/credit-hours', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ subject_name: '', code: '', hours: '', type: 'required', semester: '', department: '' }); fetchItems(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/credit-hours?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const totalHours = items.reduce((sum, i) => sum + (parseInt(i.hours) || 0), 0);
  const filteredItems = items.filter(i => i.subject_name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.code?.toLowerCase().includes(searchTerm.toLowerCase()) || i.department?.toLowerCase().includes(searchTerm.toLowerCase()));
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>⏰ الساعات المعتمدة</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة الساعات المعتمدة للمقررات الجامعية</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة مقرر</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المقررات', value: items.length, icon: '⏰', color: '#C9A227' },
          { label: 'إجمالي الساعات', value: totalHours, icon: '📊', color: '#3B82F6' },
          { label: 'إجباري', value: items.filter(i => i.type === 'required').length, icon: '📌', color: '#EF4444' },
          { label: 'اختياري', value: items.filter(i => i.type === 'elective').length, icon: '🔀', color: '#10B981' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث بالاسم، الرمز، أو القسم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⏰</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد مقررات</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة أول مقرر</button>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>المقرر</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الرمز</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الساعات</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>النوع</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الفصل</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>القسم</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(201,162,39,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⏰</div>
                      <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.subject_name}</p>
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.code || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontSize: 15, fontWeight: 700 }}>{item.hours || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{ background: item.type === 'required' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: item.type === 'required' ? '#EF4444' : '#10B981', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.type === 'required' ? 'إجباري' : 'اختياري'}</span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.semester || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.department || '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
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
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>⏰ إضافة مقرر جديد</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المقرر *</label><input value={formData.subject_name} onChange={e => setFormData({ ...formData, subject_name: e.target.value })} placeholder="مثال: مقدمة في البرمجة" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رمز المقرر</label><input value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="مثال: CS101" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الساعات</label><input value={formData.hours} onChange={e => setFormData({ ...formData, hours: e.target.value })} placeholder="مثال: 3" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="required" style={{ background: '#0D1B2A' }}>إجباري</option><option value="elective" style={{ background: '#0D1B2A' }}>اختياري</option></select></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل الدراسي</label><input value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} placeholder="مثال: الأول، الثاني" style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>القسم</label><input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="مثال: علوم الحاسب" style={inputStyle} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ المقرر'}</button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
