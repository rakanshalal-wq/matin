'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, Coins, Pencil, Plus, Save, Search, Trash2, Wrench, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function BusMaintenancePage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({ bus_number: '', type: '', description: '', date: '', cost: '', status: 'pending' });

 useEffect(() => { fetchItems(); }, []);
 const fetchItems = async () => { try { const res = await fetch('/api/bus-maintenance', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

 const handleSave = async () => {
 if (!formData.bus_number) { setErrMsg('أدخل رقم الباص'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/bus-maintenance?id=${editItem.id}` : '/api/bus-maintenance';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({ bus_number: '', type: '', description: '', date: '', cost: '', status: 'pending' }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{ bus_number: '', type: '', description: '', date: '', cost: '', status: 'pending' }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد؟')) return;
 try { await fetch(`/api/bus-maintenance?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
 };

 const getStatusBadge = (s: string) => {
 switch (s) {
 case 'pending': return { text: 'قيد الانتظار', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
 case 'in_progress': return { text: 'جاري الصيانة', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
 case 'completed': return { text: 'مكتملة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
 default: return { text: s, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
 }
 };

 const totalCost = items.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
 const filteredItems = items.filter(i => i.bus_number?.toLowerCase().includes(searchTerm.toLowerCase()) || i.type?.toLowerCase().includes(searchTerm.toLowerCase()));
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"><IconRenderer name="ICON_Wrench" size={18} /> صيانة الباصات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة سجلات صيانة الباصات المدرسية</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({ bus_number: '', type: '', description: '', date: '', cost: '', status: 'pending' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><Plus size={18} color="#6B7280" /> إضافة صيانة</button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الصيانات', value: items.length, icon: "ICON_Wrench", color: 'var(--gold)' },
 { label: 'قيد الانتظار', value: items.filter(i => i.status === 'pending').length, icon: '⏳', color: '#F59E0B' },
 { label: 'مكتملة', value: items.filter(i => i.status === 'completed').length, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'إجمالي التكلفة', value: `${totalCost.toLocaleString()} ر.س`, icon: "ICON_Coins", color: '#3B82F6' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span><span style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث برقم الباص أو نوع الصيانة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Wrench size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد سجلات صيانة</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول صيانة</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>رقم الباص</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>نوع الصيانة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الوصف</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>التاريخ</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>التكلفة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => {
 const badge = getStatusBadge(item.status);
 return (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: 'rgba(245,158,11,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Wrench size={18} color="#6B7280" /></div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.bus_number}</p>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.type || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.description?.substring(0, 40) || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontSize: 14, fontWeight: 700 }}>{item.cost ? `${parseFloat(item.cost).toLocaleString()} ر.س` : '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{badge.text}</span></td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--gold)', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
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
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'إضافة صيانة جديدة'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الباص *</label><input value={formData.bus_number} onChange={e => setFormData({ ...formData, bus_number: e.target.value })} placeholder="مثال: BUS-001" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع الصيانة</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="" style={{ background: 'var(--bg)' }}>اختر</option><option value="oil_change" style={{ background: 'var(--bg)' }}>تغيير زيت</option><option value="tire" style={{ background: 'var(--bg)' }}>إطارات</option><option value="engine" style={{ background: 'var(--bg)' }}>محرك</option><option value="brake" style={{ background: 'var(--bg)' }}>فرامل</option><option value="ac" style={{ background: 'var(--bg)' }}>تكييف</option><option value="general" style={{ background: 'var(--bg)' }}>صيانة عامة</option></select></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التكلفة (ر.س)</label><input value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="0.00" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="pending" style={{ background: 'var(--bg)' }}>قيد الانتظار</option><option value="in_progress" style={{ background: 'var(--bg)' }}>جاري الصيانة</option><option value="completed" style={{ background: 'var(--bg)' }}>مكتملة</option></select></div>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="تفاصيل الصيانة" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : 'Save حفظ الصيانة'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
