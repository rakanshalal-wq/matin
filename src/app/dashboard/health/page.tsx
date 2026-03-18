'use client';
import { Folder, Heart, Hospital, Pencil, Plus, Save, Search, Siren, Trash2, X } from "lucide-react";
 const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

export default function HealthPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ student_name: '', type: 'checkup', description: '', doctor_name: '', date: '', blood_type: '', allergies: '', chronic_conditions: '', status: 'active' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/health', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.student_name) return alert('اسم الطالب مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/health', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ student_name: '', type: 'checkup', description: '', doctor_name: '', date: '', blood_type: '', allergies: '', chronic_conditions: '', status: 'active' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try {
 await fetch(`/api/health?id=${id}`, { method: 'DELETE', headers: getHeaders() });
 fetchData();
 } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ student_name: item.student_name || '', type: item.type || 'checkup', description: item.description || '', doctor_name: item.doctor_name || '', date: item.date ? item.date.split('T')[0] : '', blood_type: item.blood_type || '', allergies: item.allergies || '', chronic_conditions: item.chronic_conditions || '', status: item.status || 'active' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.student_name?.toLowerCase().includes(search.toLowerCase()) || item.doctor_name?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 active: data.filter((d: any) => d.status === 'active').length,
 closed: data.filter((d: any) => d.status === 'closed').length,
 critical: data.filter((d: any) => d.status === 'critical').length,
 };

 const typeLabels: any = { checkup: 'فحص دوري', chronic: 'مرض مزمن', allergy: 'حساسية', disability: 'إعاقة', mental: 'نفسي', other: 'أخرى' };
 const statusLabels: any = { active: 'نشط', closed: 'مغلق', critical: 'حرج' };
 const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, closed: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, critical: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
 const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Hospital" size={18} /> السجلات الصحية</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة السجلات الصحية للطلاب والموظفين</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ student_name: '', type: 'checkup', description: '', doctor_name: '', date: '', blood_type: '', allergies: '', chronic_conditions: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إضافة سجل صحي
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي السجلات', value: stats.total, icon: "ICON_Hospital", color: '#C9A227' },
 { label: 'نشط', value: stats.active, icon: "ICON_Heart", color: '#10B981' },
 { label: 'مغلق', value: stats.closed, icon: "ICON_Folder", color: '#6B7280' },
 { label: 'حرج', value: stats.critical, icon: "ICON_Siren", color: '#EF4444' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
 <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
 </div>
 ))}
 </div>

 {/* Search */}
 <div style={{ marginBottom: 20 }}>
 <input placeholder="بحث بالاسم أو الطبيب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{ fontSize: 48, marginBottom: 16 }}><IconRenderer name="ICON_Hospital" size={36} /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد سجلات صحية</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة سجل صحي" لإنشاء أول سجل</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['الطالب', 'النوع', 'الطبيب', 'فصيلة الدم', 'التاريخ', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name="ICON_Hospital" size={36} /></div>
 <div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.student_name}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.description ? item.description.substring(0, 40) + (item.description.length > 40 ? '...' : '') : '—'}</div>
 </div>
 </div>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{typeLabels[item.type] || item.type}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.doctor_name || '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 {item.blood_type ? (
 <span style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{item.blood_type}</span>
 ) : '—'}
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {statusLabels[item.status] || item.status}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {/* Modal */}
 {showModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل سجل صحي' : 'Plus إضافة سجل صحي'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
 <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع السجل</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="checkup">فحص دوري</option>
 <option value="chronic">مرض مزمن</option>
 <option value="allergy">حساسية</option>
 <option value="disability">إعاقة</option>
 <option value="mental">نفسي</option>
 <option value="other">أخرى</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>فصيلة الدم</label>
 <select value={form.blood_type} onChange={e => setForm({ ...form, blood_type: e.target.value })} style={inputStyle}>
 <option value="">— اختر —</option>
 {bloodTypes.map(bt => <option key={bt} value={bt}>{bt}</option>)}
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطبيب</label>
 <input value={form.doctor_name} onChange={e => setForm({ ...form, doctor_name: e.target.value })} style={inputStyle} placeholder="اسم الطبيب" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ</label>
 <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحساسية</label>
 <input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} style={inputStyle} placeholder="مثال: حساسية من البنسلين، الفول السوداني" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الأمراض المزمنة</label>
 <input value={form.chronic_conditions} onChange={e => setForm({ ...form, chronic_conditions: e.target.value })} style={inputStyle} placeholder="مثال: سكري، ربو، ضغط" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف / الملاحظات</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="تفاصيل إضافية..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="active">نشط</option>
 <option value="closed">مغلق</option>
 <option value="critical">حرج</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إضافة'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
