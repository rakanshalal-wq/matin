'use client';
import { AlertTriangle, CheckCircle, Coins, Package, Search, X } from "lucide-react";
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'قرطاسية', quantity: '0', min_quantity: '5', unit: 'قطعة', price: '', location: '', notes: '' });
  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { setLoading(true); try { const r = await fetch('/api/inventory', { headers: getH() }); const d = await r.json(); setItems(Array.isArray(d) ? d : []); } catch { setItems([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.name) return alert('ادخل اسم الصنف'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/inventory?id=' + editItem.id : '/api/inventory'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ name: '', category: 'قرطاسية', quantity: '0', min_quantity: '5', unit: 'قطعة', price: '', location: '', notes: '' }); fetchItems(); } else { const e = await r.json(); alert(e.error || 'فشل'); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/inventory?id=' + id, { method: 'DELETE', headers: getH() }); fetchItems(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ name: item.name || '', category: item.category || 'قرطاسية', quantity: String(item.quantity || 0), min_quantity: String(item.min_quantity || 5), unit: item.unit || 'قطعة', price: String(item.price || ''), location: item.location || '', notes: item.notes || '' }); setShowModal(true); };
  const filtered = items.filter((r: any) => !search || r.name?.includes(search) || r.category?.includes(search));
  const lowStock = items.filter((r: any) => Number(r.quantity) <= Number(r.min_quantity || 5));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const CATS = ['قرطاسية', 'أجهزة', 'أثاث', 'مواد تنظيف', 'رياضة', 'مختبر', 'اخرى'];
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><Package className="w-5 h-5 inline-block" /> إدارة المخزون</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تتبع مستلزمات وأصول المدرسة</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة صنف</button>
      </div>
      {lowStock.length > 0 && <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ fontSize: 20 }}><AlertTriangle className="w-5 h-5 inline-block" />️</span><span style={{ color: '#F59E0B', fontSize: 14 }}><strong>{lowStock.length} أصناف</strong> وصلت للحد الأدنى: {lowStock.map((r: any) => r.name).join('، ')}</span></div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'اجمالي الاصناف', v: items.length, c: GOLD, i: '<Package className="w-5 h-5 inline-block" />' }, { l: 'مخزون كافي', v: items.length - lowStock.length, c: '#10B981', i: '<CheckCircle className="w-5 h-5 inline-block" />' }, { l: 'مخزون منخفض', v: lowStock.length, c: '#F59E0B', i: '<AlertTriangle className="w-5 h-5 inline-block" />️' }, { l: 'اجمالي القيمة', v: items.reduce((s: number, r: any) => s + (Number(r.price || 0) * Number(r.quantity || 0)), 0).toFixed(0) + ' ر.س', c: '#3B82F6', i: '<Coins className="w-5 h-5 inline-block" />' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <input placeholder="<Search className="w-5 h-5 inline-block" /> بحث..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 300, marginBottom: 20 }} />
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}><Package className="w-5 h-5 inline-block" /></div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد اصناف</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة</button></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['الصنف', 'الفئة', 'الكمية', 'الوحدة', 'الحد الأدنى', 'الموقع', 'الحالة', 'اجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map((r: any, i: number) => {
              const isLow = Number(r.quantity) <= Number(r.min_quantity || 5);
              return (<tr key={r.id || i} style={{ borderBottom: '1px solid ' + BR, background: isLow ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.category}</td>
                <td style={{ padding: '14px 16px', color: isLow ? '#F59E0B' : GOLD, fontWeight: 700 }}>{r.quantity}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.unit}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)' }}>{r.min_quantity || 5}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.location || '—'}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: isLow ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)', color: isLow ? '#F59E0B' : '#10B981', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{isLow ? 'منخفض' : 'كافي'}</span></td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
              </tr>);
            })}</tbody>
          </table></div>}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الصنف' : 'اضافة صنف جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}><X className="w-5 h-5 inline-block" /></button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم الصنف *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: أقلام رصاص" style={inp} /></div>
            <div><label style={lbl}>الفئة</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inp}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>الوحدة</label><input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="قطعة، كرتون..." style={inp} /></div>
            <div><label style={lbl}>الكمية الحالية</label><input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الحد الأدنى للتنبيه</label><input type="number" value={form.min_quantity} onChange={e => setForm({ ...form, min_quantity: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>سعر الوحدة (ر.س)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>موقع التخزين</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="مثال: مستودع A" style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>ملاحظات</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة الصنف'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
