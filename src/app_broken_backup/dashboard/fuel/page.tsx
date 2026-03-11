'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function FuelPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ bus_number: '', liters: '', cost: '', date: '', odometer: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/fuel', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleAdd = async () => {
    if (!formData.bus_number) return alert('أدخل رقم الباص');
    setSaving(true);
    try {
      const res = await fetch('/api/fuel', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { setShowAddModal(false); setFormData({ bus_number: '', liters: '', cost: '', date: '', odometer: '' }); fetchItems(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/fuel?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const totalLiters = items.reduce((sum, i) => sum + (parseFloat(i.liters) || 0), 0);
  const totalCost = items.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
  const filteredItems = items.filter(i => i.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()));
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>⛽ سجلات الوقود</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة ومتابعة استهلاك الوقود للباصات</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة تعبئة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي التعبئات', value: items.length, icon: '⛽', color: '#C9A227' },
          { label: 'إجمالي اللترات', value: `${totalLiters.toFixed(1)} لتر`, icon: '🛢️', color: '#3B82F6' },
          { label: 'إجمالي التكلفة', value: `${totalCost.toLocaleString()} ر.س`, icon: '💰', color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}>{stat.icon}</span><span style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="🔍 بحث برقم الباص..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⛽</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد سجلات وقود</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>➕ إضافة أول تعبئة</button>
          </div>
        ) : (
          <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>رقم الباص</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>اللترات</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التكلفة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التاريخ</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>العداد (كم)</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, background: 'rgba(239,68,68,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⛽</div>
                      <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.bus_number}</p>
                    </div>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#3B82F6', fontSize: 15, fontWeight: 700 }}>{item.liters ? `${parseFloat(item.liters).toFixed(1)} لتر` : '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontSize: 14, fontWeight: 700 }}>{item.cost ? `${parseFloat(item.cost).toLocaleString()} ر.س` : '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{item.odometer ? `${parseInt(item.odometer).toLocaleString()} كم` : '—'}</td>
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
          <div style={{ background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>⛽ إضافة تعبئة وقود</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الباص *</label><input value={formData.bus_number} onChange={e => setFormData({ ...formData, bus_number: e.target.value })} placeholder="مثال: BUS-001" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اللترات</label><input value={formData.liters} onChange={e => setFormData({ ...formData, liters: e.target.value })} placeholder="مثال: 50" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التكلفة (ر.س)</label><input value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="مثال: 150" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>قراءة العداد (كم)</label><input value={formData.odometer} onChange={e => setFormData({ ...formData, odometer: e.target.value })} placeholder="مثال: 45000" style={inputStyle} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
              <button onClick={handleAdd} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : '💾 حفظ التعبئة'}</button>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
