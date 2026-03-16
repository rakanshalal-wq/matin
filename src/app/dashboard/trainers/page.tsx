'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
export default function Page() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string,string>>({});
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/trainers', { headers: getH() }); const d = await r.json(); setItems(Array.isArray(d) ? d : (d.items || d.data || [])); } catch { setItems([]); } finally { setLoading(false); } };
  const handleSave = async () => { setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/trainers?id=' + editItem.id : '/api/trainers'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({}); fetchData(); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/trainers?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm(item); setShowModal(true); };
  const filtered = items.filter((i: any) => !search || JSON.stringify(i).includes(search));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🎓 المدربون الخارجيون</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة المدربين والمحاضرين الخارجيين</p></div>
        <button onClick={() => { setEditItem(null); setForm({}); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة جديد</button>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." style={{ ...inp, maxWidth: 300 }} />
        <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 10, padding: '10px 20px', color: GOLD, fontWeight: 700 }}>{items.length} سجل</div>
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{["الاسم","التخصص","الجهة","الجوال","البريد","إجراءات"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: "right", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>لا توجد سجلات</td></tr> :
                filtered.map((item: any, i: number) => (
                  <tr key={item.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                    {Object.values(item).slice(0, 5).map((v: any, j: number) => <td key={j} style={{ padding: '14px 16px', color: j === 0 ? 'white' : 'rgba(255,255,255,0.6)', fontWeight: j === 0 ? 600 : 400, fontSize: 14 }}>{String(v || '—')}</td>)}
                    <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(item)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'إضافة جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: "grid", gap: 16 }}><div><label style={lbl}>اسم المدرب *</label><input value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} /></div><div><label style={lbl}>التخصص</label><input value={form.specialty || ""} onChange={e => setForm({ ...form, specialty: e.target.value })} style={inp} /></div><div><label style={lbl}>الجهة</label><input value={form.organization || ""} onChange={e => setForm({ ...form, organization: e.target.value })} style={inp} /></div><div><label style={lbl}>رقم الجوال</label><input value={form.phone || ""} onChange={e => setForm({ ...form, phone: e.target.value })} style={inp} /></div><div><label style={lbl}>البريد الإلكتروني</label><input type="email" value={form.email || ""} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} /></div></div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ' : 'إضافة'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
