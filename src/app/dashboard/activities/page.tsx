'use client';
export const dynamic = 'force-dynamic';
import { Calendar, CheckCircle, Circle, Drama, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ActivitiesPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({ name: '', type: '', description: '', date: '', location: '', organizer: '', status: 'upcoming' });

 useEffect(() => { fetchItems(); }, []);
 const fetchItems = async () => { try { const res = await fetch('/api/activities', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

 const handleSave = async () => {
 if (!formData.name) { setErrMsg('أدخل اسم النشاط'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/activities?id=${editItem.id}` : '/api/activities';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({ name: '', type: '', description: '', date: '', location: '', organizer: '', status: 'upcoming' }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{ name: '', type: '', description: '', date: '', location: '', organizer: '', status: 'upcoming' }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => { if (!confirm('هل أنت متأكد؟')) return; try { await fetch(`/api/activities?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); } };

 const getStatusBadge = (s: string) => {
 switch (s) { case 'upcoming': return { text: 'قادم', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' }; case 'ongoing': return { text: 'جاري', color: '#10B981', bg: 'rgba(16,185,129,0.1)' }; case 'completed': return { text: 'منتهي', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' }; default: return { text: s, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' }; }
 };

 const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.type?.toLowerCase().includes(searchTerm.toLowerCase()));
 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Drama" size={18} /> الأنشطة اللاصفية</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة الأنشطة والفعاليات المدرسية</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({ name: '', type: '', description: '', date: '', location: '', organizer: '', status: 'upcoming' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة نشاط</button>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الأنشطة', value: items.length, icon: "ICON_Drama", color: '#C9A227' },
 { label: 'قادمة', value: items.filter(i => i.status === 'upcoming').length, icon: "ICON_Calendar", color: '#3B82F6' },
 { label: 'جارية', value: items.filter(i => i.status === 'ongoing').length, icon: "ICON_Circle", color: '#10B981' },
 { label: 'منتهية', value: items.filter(i => i.status === 'completed').length, icon: "ICON_CheckCircle", color: '#6B7280' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span><span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم أو النوع..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Drama size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد أنشطة</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول نشاط</button>
 </div>
 ) : (
 <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>النشاط</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>النوع</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المكان</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المنظم</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>التاريخ</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
 <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => {
 const badge = getStatusBadge(item.status);
 return (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: 'rgba(139,92,246,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name="ICON_Drama" size={36} /></div>
 <div><p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.name}</p><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.description?.substring(0, 40) || ''}</p></div>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.type || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.location || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.organizer || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}><span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{badge.text}</span></td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}> </button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}> </button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
</div>
 )}
 </div>

 {showAddModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'إضافة نشاط'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم النشاط *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="" style={{ background: '#06060E' }}>اختر</option><option value="sports" style={{ background: '#06060E' }}>رياضي</option><option value="cultural" style={{ background: '#06060E' }}>ثقافي</option><option value="scientific" style={{ background: '#06060E' }}>علمي</option><option value="social" style={{ background: '#06060E' }}>اجتماعي</option><option value="artistic" style={{ background: '#06060E' }}>فني</option></select></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ</label><input type="datetime-local" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المكان</label><input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المنظم</label><input value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} style={inputStyle} /></div>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳' : 'Save حفظ'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
