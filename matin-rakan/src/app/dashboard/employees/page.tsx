'use client';
export const dynamic = 'force-dynamic';
import { Eye, Pencil, Plus, Save, Search, Shirt, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function EmployeesPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [formData, setFormData] = useState({
 name: '', email: '', phone: '', department: '', job_title: '', salary: '', hire_date: '', notes: ''
 });

 useEffect(() => { fetchItems(); }, []);

 const fetchItems = async () => {
 try {
 const res = await fetch('/api/employees', { headers: getHeaders() });
 const data = await res.json();
 setItems(Array.isArray(data) ? data : []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!formData.name) { setErrMsg('أدخل اسم الموظف'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/employees?id=${editItem.id}` : '/api/employees';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAddModal(false); setEditItem(null); setFormData({
 name: '', email: '', phone: '', department: '', job_title: '', salary: '', hire_date: '', notes: ''
 }); setErrMsg(''); fetchItems();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setFormData({ ...{
 name: '', email: '', phone: '', department: '', job_title: '', salary: '', hire_date: '', notes: ''
 }, ...item });
 setErrMsg('');
 setShowAddModal(true);
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;
 try { await fetch(`/api/employees?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (error) { console.error('Error:', error); }
 };

 const filteredItems = items.filter(i =>
 i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 i.phone?.includes(searchTerm)
 );

 const inputStyle: React.CSSProperties = {
 width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
 borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none',
 };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"><IconRenderer name="ICON_Shirt" size={18} /> الموظفين</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة بيانات الموظفين الإداريين والفنيين</p>
 </div>
 <button onClick={() => { setEditItem(null); setFormData({
 name: '', email: '', phone: '', department: '', job_title: '', salary: '', hire_date: '', notes: ''
 }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة موظف</button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الموظفين', value: items.length, icon: "ICON_Shirt", color: 'var(--gold)' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span>
 <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
 </div>
 ))}
 </div>

 {/* Search */}
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
 <input type="text" placeholder="بحث بالاسم، المسمى الوظيفي، القسم..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
 ) : filteredItems.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Shirt size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد موظفين</p>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><IconRenderer name="ICON_Plus" size={18} /> إضافة أول موظف</button>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
 <th style={{ padding: 16, textAlign: 'right', color: 'var(--gold)', fontWeight: 700 }}>الموظف</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>المسمى الوظيفي</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>القسم</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>الجوال</th>
 <th style={{ padding: 16, textAlign: 'center', color: 'var(--gold)', fontWeight: 700 }}>إجراءات</th>
 </tr>
 </thead>
 <tbody>
 {filteredItems.map((item) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, background: 'rgba(201,162,39,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name="ICON_Shirt" size={36} /></div>
 <div>
 <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.name}</p>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.email}</p>
 </div>
 </div>
 </td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.job_title || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.department || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{item.phone || '—'}</td>
 <td style={{ padding: 16, textAlign: 'center' }}>
 <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
 <button style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}><IconRenderer name="ICON_Eye" size={18} /> عرض</button>
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

 {/* Add Modal */}
 {showAddModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'Shirt إضافة موظف جديد'}</h2>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الموظف *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسم الموظف" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>البريد الإلكتروني</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="example@email.com" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجوال</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المسمى الوظيفي</label><input value={formData.job_title} onChange={e => setFormData({ ...formData, job_title: e.target.value })} placeholder="مثال: محاسب، سكرتير" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>القسم</label><input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="مثال: المالية، الموارد البشرية" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الراتب</label><input value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} placeholder="الراتب الشهري" style={inputStyle} /></div>
 <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ التعيين</label><input type="date" value={formData.hire_date} onChange={e => setFormData({ ...formData, hire_date: e.target.value })} style={inputStyle} /></div>
 <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>ملاحظات</label><textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="ملاحظات إضافية" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
 <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : 'Save حفظ الموظف'}</button>
 <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
