'use client';
export const dynamic = 'force-dynamic';
import { Bus, CheckCircle, Eye, Pencil, Plane, Plus, Save, Search, Trash2, Truck, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function DriversPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({ name: '', phone: '', license_number: '', bus_number: '', route: '', role: 'driver', status: 'active' });

 useEffect(() => { fetchItems(); }, []);
 const fetchItems = async () => { try { const res = await fetch('/api/drivers', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

 const handleSave = async () => {
 if (!formData.name) { setErrMsg('أدخل اسم السائق'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/drivers?id=${editItem.id}` : '/api/drivers';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({ name: '', phone: '', license_number: '', bus_number: '', route: '', role: 'driver', status: 'active' }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{ name: '', phone: '', license_number: '', bus_number: '', route: '', role: 'driver', status: 'active' }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد؟')) return;
 try { await fetch(`/api/drivers?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
 };

 const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm));
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"> السائقين والمشرفين</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة سائقي الباصات ومشرفي النقل</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({ name: '', phone: '', license_number: '', bus_number: '', route: '', role: 'driver', status: 'active' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة سائق/مشرف</button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'الإجمالي', value: items.length, icon: '<User size={16} /> ', color: 'var(--gold)' },
 { label: 'سائقين', value: items.filter(i => i.role === 'driver').length, icon: "ICON_Bus", color: '#3B82F6' },
 { label: 'مشرفين', value: items.filter(i => i.role === 'supervisor').length, icon: '<Eye size={16} />', color: '#8B5CF6' },
 { label: 'نشط', value: items.filter(i => i.status === 'active').length, icon: "ICON_CheckCircle", color: '#10B981' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم، رقم الباص، أو الجوال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Truck size={20} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد سائقين أو مشرفين</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول سائق</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>الاسم</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الدور</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الجوال</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>رقم الباص</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>المسار</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: item.role === 'driver' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.role === 'driver' ? "ICON_Bus" : '<Eye size={16} />'}</div>
 <div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.name}</p>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.license_number || ''}</p>
 </div>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <span style={{ background: item.role === 'driver' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)', color: item.role === 'driver' ? '#3B82F6' : '#8B5CF6', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.role === 'driver' ? 'سائق' : 'مشرف'}</span>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{item.phone || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>{item.bus_number || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.route || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <span style={{ background: item.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: item.status === 'active' ? '#10B981' : '#EF4444', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status === 'active' ? 'نشط' : 'غير نشط'}</span>
 </td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--gold)', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
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
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : '<User size={16} /><IconRenderer name="ICON_Plus" size={18} /> إضافة سائق/مشرف'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الاسم *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="الاسم الكامل" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الدور</label><select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="driver" style={{ background: 'var(--bg)' }}>سائق</option><option value="supervisor" style={{ background: 'var(--bg)' }}>مشرف</option></select></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الجوال</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الرخصة</label><input value={formData.license_number} onChange={e => setFormData({ ...formData, license_number: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الباص</label><input value={formData.bus_number} onChange={e => setFormData({ ...formData, bus_number: e.target.value })} placeholder="BUS-001" style={inputStyle} /></div>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المسار</label><input value={formData.route} onChange={e => setFormData({ ...formData, route: e.target.value })} placeholder="مثال: حي النزهة - المدرسة" style={inputStyle} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : editItem ? 'Save حفظ التعديلات' : 'Save حفظ'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
