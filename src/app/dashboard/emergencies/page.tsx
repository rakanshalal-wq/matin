'use client';
export const dynamic = 'force-dynamic';
import { Ambulance, CheckCircle, Circle, Pencil, Plus, Save, Search, Siren, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function EmergenciesPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ student_name: '', type: 'injury', description: '', action_taken: '', reported_by: '', severity: 'medium', date: '', status: 'open' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/emergencies', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.student_name) return alert('اسم الطالب مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/emergencies', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ student_name: '', type: 'injury', description: '', action_taken: '', reported_by: '', severity: 'medium', date: '', status: 'open' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/emergencies?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ student_name: item.student_name || '', type: item.type || 'injury', description: item.description || '', action_taken: item.action_taken || '', reported_by: item.reported_by || '', severity: item.severity || 'medium', date: item.date ? item.date.split('T')[0] : '', status: item.status || 'open' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.student_name?.toLowerCase().includes(search.toLowerCase()) || item.reported_by?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 open: data.filter((d: any) => d.status === 'open').length,
 resolved: data.filter((d: any) => d.status === 'resolved').length,
 critical: data.filter((d: any) => d.severity === 'critical').length,
 };

 const typeLabels: any = { injury: 'إصابة', fainting: 'إغماء', allergy_reaction: 'تحسس', breathing: 'ضيق تنفس', fracture: 'كسر', burn: 'حرق', poisoning: 'تسمم', seizure: 'نوبة', other: 'أخرى' };
 const severityLabels: any = { low: 'بسيطة', medium: 'متوسطة', high: 'خطيرة', critical: 'حرجة' };
 const severityColors: any = { low: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, medium: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, high: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, critical: { bg: 'rgba(185,28,28,0.15)', color: '#DC2626' } };
 const statusLabels: any = { open: 'مفتوحة', in_progress: 'جاري المعالجة', resolved: 'تم الحل', transferred: 'تم التحويل' };
 const statusColors: any = { open: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, in_progress: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, transferred: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Alert Box for Critical Cases */}
 {stats.critical > 0 && (
 <div style={{ background: 'rgba(185,28,28,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}><IconRenderer name="ICON_Siren" size={36} /></span>
 <div>
 <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>تنبيه! يوجد {stats.critical} حالة حرجة</div>
 <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى متابعة الحالات الحرجة فوراً</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Ambulance" size={18} /> الحالات الطارئة</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تسجيل ومتابعة الحالات الطارئة والإصابات</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ student_name: '', type: 'injury', description: '', action_taken: '', reported_by: '', severity: 'medium', date: '', status: 'open' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus تسجيل حالة طارئة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الحالات', value: stats.total, icon: "ICON_Ambulance", color: '#C9A227' },
 { label: 'مفتوحة', value: stats.open, icon: "ICON_Circle", color: '#EF4444' },
 { label: 'تم الحل', value: stats.resolved, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'حرجة', value: stats.critical, icon: "ICON_Siren", color: '#DC2626' },
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
 <input placeholder="بحث بالاسم أو المبلّغ..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ambulance size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد حالات طارئة مسجلة</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>الحمد لله على السلامة!</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['الطالب', 'النوع', 'الخطورة', 'الوصف', 'الإجراء المتخذ', 'المبلّغ', 'التاريخ', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.severity === 'critical' ? 'rgba(185,28,28,0.05)' : item.severity === 'high' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: severityColors[item.severity]?.bg || 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name="ICON_Ambulance" size={36} /></div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.student_name}</div>
 </div>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{typeLabels[item.type] || item.type}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: severityColors[item.severity]?.bg || 'rgba(245,158,11,0.1)', color: severityColors[item.severity]?.color || '#F59E0B', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {severityLabels[item.severity] || item.severity}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.description ? item.description.substring(0, 30) + (item.description.length > 30 ? '...' : '') : '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.action_taken ? item.action_taken.substring(0, 30) + (item.action_taken.length > 30 ? '...' : '') : '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.reported_by || '—'}</td>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل حالة' : 'Plus تسجيل حالة طارئة'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
 <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب المصاب" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع الحالة</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="injury">إصابة</option>
 <option value="fainting">إغماء</option>
 <option value="allergy_reaction">تحسس</option>
 <option value="breathing">ضيق تنفس</option>
 <option value="fracture">كسر</option>
 <option value="burn">حرق</option>
 <option value="poisoning">تسمم</option>
 <option value="seizure">نوبة</option>
 <option value="other">أخرى</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>درجة الخطورة</label>
 <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })} style={inputStyle}>
 <option value="low">بسيطة</option>
 <option value="medium">متوسطة</option>
 <option value="high">خطيرة</option>
 <option value="critical">حرجة</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المبلّغ عن الحالة</label>
 <input value={form.reported_by} onChange={e => setForm({ ...form, reported_by: e.target.value })} style={inputStyle} placeholder="اسم المبلّغ" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التاريخ والوقت</label>
 <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>وصف الحالة</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="وصف تفصيلي للحالة..." />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الإجراء المتخذ</label>
 <textarea value={form.action_taken} onChange={e => setForm({ ...form, action_taken: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="ما تم اتخاذه من إجراءات..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="open">مفتوحة</option>
 <option value="in_progress">جاري المعالجة</option>
 <option value="resolved">تم الحل</option>
 <option value="transferred">تم التحويل للمستشفى</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus تسجيل'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
