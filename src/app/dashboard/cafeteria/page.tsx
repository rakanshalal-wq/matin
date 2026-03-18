'use client';
import { CheckCircle, Coins, Search, UtensilsCrossed, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

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

const CATEGORIES = ['وجبات رئيسية', 'وجبات خفيفة', 'مشروبات', 'حلويات', 'فطور', 'اخرى'];

export default function CafeteriaPage() {
 const [tab, setTab] = useState<'menu' | 'orders' | 'inventory'>('menu');
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [filterCategory, setFilterCategory] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState({ name: '', category: 'وجبات رئيسية', price: '', description: '', available: true, calories: '', allergens: '' });

 useEffect(() => { fetchItems(); }, []);

 const fetchItems = async () => {
 setLoading(true);
 try {
 const res = await fetch('/api/cafeteria', { headers: getHeaders() });
 const data = await res.json();
 setItems(Array.isArray(data) ? data : []);
 } catch { setItems([]); } finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!form.name || !form.price) return alert('ادخل اسم الصنف والسعر');
 setSaving(true);
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? '/api/cafeteria?id=' + editItem.id : '/api/cafeteria';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 if (res.ok) { setShowModal(false); setEditItem(null); setForm({ name: '', category: 'وجبات رئيسية', price: '', description: '', available: true, calories: '', allergens: '' }); fetchItems(); }
 else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
 } catch { } finally { setSaving(false); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل انت متاكد من الحذف؟')) return;
 try { await fetch('/api/cafeteria?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch { }
 };

 const openEdit = (item: any) => {
 setEditItem(item);
 setForm({ name: item.name || '', category: item.category || 'وجبات رئيسية', price: String(item.price || ''), description: item.description || '', available: item.available !== false, calories: String(item.calories || ''), allergens: item.allergens || '' });
 setShowModal(true);
 };

 const filtered = items.filter((r: any) => {
 const matchSearch = !searchTerm || r.name?.includes(searchTerm);
 const matchCat = !filterCategory || r.category === filterCategory;
 return matchSearch && matchCat;
 });

 const totalItems = items.length;
 const availableItems = items.filter((r: any) => r.available !== false).length;
 const avgPrice = items.length ? (items.reduce((s: number, r: any) => s + Number(r.price || 0), 0) / items.length).toFixed(1) : 0;

 const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
 const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

 return (
 <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>الكافتيريا</h1>
 <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>ادارة قائمة الطعام والطلبات</p>
 </div>
 <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة صنف</button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
 {[
 { label: 'اجمالي الاصناف', value: totalItems, color: GOLD, icon: 'UtensilsCrossed' },
 { label: 'متاح الان', value: availableItems, color: '#10B981', icon: "ICON_CheckCircle" },
 { label: 'غير متاح', value: totalItems - availableItems, color: '#EF4444', icon: "ICON_XCircle" },
 { label: 'متوسط السعر', value: avgPrice + ' ر.س', color: '#3B82F6', icon: "ICON_Coins" },
 ].map((s, i) => (
 <div key={i} style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: '18px 20px' }}>
 <div style={{ fontSize: 24, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>

 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input placeholder="بحث عن صنف..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 260 }} />
 <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inp, width: 200 }}>
 <option value="">جميع الفئات</option>
 {CATEGORIES.map(c => <option key={c}>{c}</option>)}
 </select>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
 {loading ? (
 <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
 ) : filtered.length === 0 ? (
 <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
 <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Star size={24} color="#C9A84C" /></div>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد اصناف في القائمة</p>
 <button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة اول صنف</button>
 </div>
 ) : filtered.map((item: any, i: number) => (
 <div key={item.id || i} style={{ background: CARD_BG, border: '1px solid ' + (item.available !== false ? BORDER : 'rgba(239,68,68,0.2)'), borderRadius: 16, padding: '20px', position: 'relative' }}>
 {item.available === false && (
 <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(239,68,68,0.2)', color: '#EF4444', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>غير متاح</div>
 )}
 <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Star size={24} color="#C9A84C" /></div>
 <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item.name}</div>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>{item.category}</div>
 {item.description && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 8 }}>{item.description}</div>}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
 <span style={{ color: GOLD, fontWeight: 800, fontSize: 18 }}>{item.price} ر.س</span>
 {item.calories && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{item.calories} سعرة</span>}
 </div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => openEdit(item)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '7px', color: GOLD, cursor: 'pointer', fontSize: 13 }}>تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '7px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>حذف</button>
 </div>
 </div>
 ))}
 </div>

 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div style={{ background: '#12121F', border: '1px solid ' + BORDER, borderRadius: 20, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الصنف' : 'اضافة صنف جديد'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم الصنف *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: شاورما دجاج" style={inp} /></div>
 <div><label style={lbl}>الفئة</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inp}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
 <div><label style={lbl}>السعر (ر.س) *</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" style={inp} /></div>
 <div><label style={lbl}>السعرات الحرارية</label><input type="number" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} placeholder="0" style={inp} /></div>
 <div style={{ gridColumn: '1/-1' }}><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الصنف..." style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
 <div style={{ gridColumn: '1/-1' }}><label style={lbl}>مسببات الحساسية</label><input value={form.allergens} onChange={e => setForm({ ...form, allergens: e.target.value })} placeholder="مثال: جلوتين، لاكتوز..." style={inp} /></div>
 <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
 <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
 <label htmlFor="avail" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>متاح الان</label>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة الصنف'}</button>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
