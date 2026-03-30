'use client';
export const dynamic = 'force-dynamic';
import { Building, Building2, CheckCircle, Pencil, Plus, Save, Search, Trash2, Users, Wrench, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ExamRoomsPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({ name: '', building: '', capacity: '', floor: '', equipment: '', status: 'active' });

 useEffect(() => { fetchItems(); }, []);
 const fetchItems = async () => { try { const res = await fetch('/api/exam-rooms', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

 const handleSave = async () => {
 if (!formData.name) { setErrMsg('أدخل اسم القاعة'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/exam-rooms?id=${editItem.id}` : '/api/exam-rooms';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({ name: '', building: '', capacity: '', floor: '', equipment: '', status: 'active' }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{ name: '', building: '', capacity: '', floor: '', equipment: '', status: 'active' }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد؟')) return;
 try { await fetch(`/api/exam-rooms?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
 };

 const totalCapacity = items.reduce((sum, i) => sum + (parseInt(i.capacity) || 0), 0);
 const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.building?.toLowerCase().includes(searchTerm.toLowerCase()));
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><Building size={18} color="#6B7280" />قاعات الاختبارات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة القاعات والفصول المخصصة للاختبارات</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({ name: '', building: '', capacity: '', floor: '', equipment: '', status: 'active' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة قاعة</button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي القاعات', value: items.length, icon: '<Building2 size={16} />', color: 'var(--gold)' },
 { label: 'السعة الكلية', value: totalCapacity, icon: "ICON_Users", color: '#3B82F6' },
 { label: 'نشطة', value: items.filter(i => i.status === 'active').length, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'صيانة', value: items.filter(i => i.status === 'maintenance').length, icon: "ICON_Wrench", color: '#F59E0B' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم أو المبنى..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Building size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد قاعات</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول قاعة</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>القاعة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>المبنى</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الطابق</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>السعة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>التجهيزات</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: 'rgba(59,130,246,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><Building size={18} color="#6B7280" /></div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.name}</p>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.building || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.floor || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontSize: 15, fontWeight: 700 }}>{item.capacity || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.equipment || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <span style={{ background: item.status === 'active' ? 'rgba(16,185,129,0.1)' : item.status === 'maintenance' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', color: item.status === 'active' ? '#10B981' : item.status === 'maintenance' ? '#F59E0B' : '#EF4444', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status === 'active' ? 'نشطة' : item.status === 'maintenance' ? 'صيانة' : 'معطلة'}</span>
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
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'Building2<IconRenderer name="ICON_Plus" size={18} /> إضافة قاعة جديدة'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم القاعة *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="مثال: قاعة 101" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المبنى</label><input value={formData.building} onChange={e => setFormData({ ...formData, building: e.target.value })} placeholder="مثال: المبنى الرئيسي" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الطابق</label><input value={formData.floor} onChange={e => setFormData({ ...formData, floor: e.target.value })} placeholder="مثال: الدور الأول" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>السعة</label><input value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} placeholder="عدد المقاعد" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="active" style={{ background: 'var(--bg)' }}>نشطة</option><option value="maintenance" style={{ background: 'var(--bg)' }}>صيانة</option><option value="inactive" style={{ background: 'var(--bg)' }}>معطلة</option></select></div>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التجهيزات</label><input value={formData.equipment} onChange={e => setFormData({ ...formData, equipment: e.target.value })} placeholder="مثال: بروجكتر، تكييف، كاميرات" style={inputStyle} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : 'Save حفظ القاعة'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
