'use client';
import { Angry, CheckCircle, Circle, ClipboardList, FileText, HelpCircle, Lightbulb, Pencil, Plus, Save, Search, Siren, ThumbsUp, Trash2, Unlock, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ComplaintsPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ person_name: '', type: 'complaint', category: 'general', subject: '', description: '', priority: 'medium', assigned_to: '', status: 'open' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/complaints', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.person_name || !form.subject) return alert('الاسم والموضوع مطلوبين');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/complaints', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ person_name: '', type: 'complaint', category: 'general', subject: '', description: '', priority: 'medium', assigned_to: '', status: 'open' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/complaints?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ person_name: item.person_name || '', type: item.type || 'complaint', category: item.category || 'general', subject: item.subject || '', description: item.description || '', priority: item.priority || 'medium', assigned_to: item.assigned_to || '', status: item.status || 'open' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.person_name?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()) || item.assigned_to?.toLowerCase().includes(search.toLowerCase()));

 const highPriority = data.filter((d: any) => (d.priority === 'high' || d.priority === 'urgent') && d.status === 'open').length;

 const stats = {
 total: data.length,
 open: data.filter((d: any) => d.status === 'open').length,
 inProgress: data.filter((d: any) => d.status === 'in_progress').length,
 resolved: data.filter((d: any) => d.status === 'resolved').length,
 };

 const typeLabels: any = { complaint: 'شكوى', suggestion: 'اقتراح', inquiry: 'استفسار', report: 'بلاغ' };
 const typeIcons: any = { complaint: "ICON_Angry", suggestion: "ICON_Lightbulb", inquiry: "ICON_HelpCircle", report: "ICON_ClipboardList" };
 const typeColors: any = { complaint: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, suggestion: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, inquiry: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, report: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } };
 const categoryLabels: any = { general: 'عام', academic: 'أكاديمي', financial: 'مالي', transport: 'نقل', facilities: 'مرافق', staff: 'موظفين', food: 'تغذية', safety: 'أمان', technical: 'تقني' };
 const priorityLabels: any = { low: 'منخفض', medium: 'متوسط', high: 'مرتفع', urgent: 'عاجل' };
 const priorityColors: any = { low: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, medium: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, high: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, urgent: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
 const statusLabels: any = { open: 'مفتوحة', in_progress: 'قيد المعالجة', resolved: 'تم الحل', closed: 'مغلقة', rejected: 'مرفوضة' };
 const statusColors: any = { open: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, in_progress: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, closed: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, rejected: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Urgent Alert */}
 {highPriority > 0 && (
 <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}><IconRenderer name="ICON_Siren" size={36} /></span>
 <div>
 <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>يوجد {highPriority} شكوى/بلاغ بأولوية عالية أو عاجلة</div>
 <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى المعالجة فوراً</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_FileText" size={18} /> الشكاوى والاقتراحات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>متابعة شكاوى واقتراحات واستفسارات المستخدمين</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ person_name: '', type: 'complaint', category: 'general', subject: '', description: '', priority: 'medium', assigned_to: '', status: 'open' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إضافة جديد
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'الإجمالي', value: stats.total, icon: "ICON_FileText", color: '#C9A227' },
 { label: 'مفتوحة', value: stats.open, icon: "ICON_Unlock", color: '#EF4444' },
 { label: 'قيد المعالجة', value: stats.inProgress, icon: '⏳', color: '#F59E0B' },
 { label: 'تم الحل', value: stats.resolved, icon: "ICON_CheckCircle", color: '#10B981' },
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
 <input placeholder="بحث بالاسم أو الموضوع أو المسؤول..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><FileText size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد شكاوى أو اقتراحات</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>الحمد لله! كل شيء تمام ThumbsUp</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['مقدم الطلب', 'النوع', 'الموضوع', 'التصنيف', 'الأولوية', 'المسؤول', 'الحالة', 'التاريخ', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.priority === 'urgent' && item.status === 'open' ? 'rgba(239,68,68,0.05)' : item.priority === 'high' && item.status === 'open' ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={typeIcons[item.type] || "ICON_FileText"} /></div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.person_name}</div>
 </div>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {typeLabels[item.type] || item.type}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>{item.subject}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.description ? item.description.substring(0, 35) + (item.description.length > 35 ? '...' : '') : ''}</div>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{categoryLabels[item.category] || item.category}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: priorityColors[item.priority]?.bg, color: priorityColors[item.priority]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {item.priority === 'urgent' && 'Circle '}{priorityLabels[item.priority] || item.priority}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: item.assigned_to ? '#C9A227' : 'rgba(255,255,255,0.3)', fontWeight: item.assigned_to ? 600 : 400, fontSize: 13 }}>{item.assigned_to || 'غير محدد'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: statusColors[item.status]?.bg, color: statusColors[item.status]?.color, padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {statusLabels[item.status] || item.status}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SA') : '—'}</td>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل' : 'Plus إضافة شكوى/اقتراح'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>مقدم الطلب *</label>
 <input value={form.person_name} onChange={e => setForm({ ...form, person_name: e.target.value })} style={inputStyle} placeholder="اسم مقدم الشكوى أو الاقتراح" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="complaint">شكوى Angry</option>
 <option value="suggestion">اقتراح Lightbulb</option>
 <option value="inquiry">استفسار HelpCircle</option>
 <option value="report">بلاغ ClipboardList</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التصنيف</label>
 <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
 <option value="general">عام</option>
 <option value="academic">أكاديمي</option>
 <option value="financial">مالي</option>
 <option value="transport">نقل</option>
 <option value="facilities">مرافق</option>
 <option value="staff">موظفين</option>
 <option value="food">تغذية</option>
 <option value="safety">أمان</option>
 <option value="technical">تقني</option>
 </select>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموضوع *</label>
 <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="موضوع الشكوى أو الاقتراح" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الأولوية</label>
 <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inputStyle}>
 <option value="low">منخفض</option>
 <option value="medium">متوسط</option>
 <option value="high">مرتفع</option>
 <option value="urgent">عاجل Circle</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المسؤول عن المعالجة</label>
 <input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={inputStyle} placeholder="اسم المسؤول" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التفاصيل</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="اشرح التفاصيل هنا..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="open">مفتوحة</option>
 <option value="in_progress">قيد المعالجة</option>
 <option value="resolved">تم الحل</option>
 <option value="closed">مغلقة</option>
 <option value="rejected">مرفوضة</option>
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
