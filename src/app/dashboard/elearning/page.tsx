'use client';
export const dynamic = 'force-dynamic';
import { Book, BookOpen, CheckCircle, Clapperboard, FileText, GraduationCap, Laptop, Paperclip, Pencil, Plus, Save, Search, Settings, Trash2, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ElearningPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ title: '', type: 'course', subject: '', instructor: '', description: '', duration: '', level: 'beginner', students_count: '0', status: 'active' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/elearning', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.title) return alert('عنوان المحتوى مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/elearning', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', type: 'course', subject: '', instructor: '', description: '', duration: '', level: 'beginner', students_count: '0', status: 'active' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/elearning?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ title: item.title || '', type: item.type || 'course', subject: item.subject || '', instructor: item.instructor || '', description: item.description || '', duration: item.duration || '', level: item.level || 'beginner', students_count: item.students_count?.toString() || '0', status: item.status || 'active' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()) || item.instructor?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 active: data.filter((d: any) => d.status === 'active').length,
 draft: data.filter((d: any) => d.status === 'draft').length,
 totalStudents: data.reduce((sum: number, d: any) => sum + (parseInt(d.students_count) || 0), 0),
 };

 const typeLabels: any = { course: 'دورة', lesson: 'درس', workshop: 'ورشة عمل', tutorial: 'شرح', quiz: 'اختبار إلكتروني', resource: 'مصدر تعليمي' };
 const typeIcons: any = { course: "ICON_BookOpen", lesson: "ICON_Book", workshop: '<Settings size={16} />', tutorial: "ICON_Clapperboard", quiz: "ICON_FileText", resource: "ICON_Paperclip" };
 const levelLabels: any = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' };
 const levelColors: any = { beginner: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, intermediate: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, advanced: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
 const statusLabels: any = { active: 'نشط', draft: 'مسودة', archived: 'مؤرشف' };
 const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, draft: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, archived: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"><IconRenderer name="ICON_Laptop" size={18} /> التعليم الإلكتروني</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة المحتوى التعليمي الإلكتروني والدورات</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ title: '', type: 'course', subject: '', instructor: '', description: '', duration: '', level: 'beginner', students_count: '0', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إضافة محتوى
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المحتوى', value: stats.total, icon: "ICON_Laptop", color: 'var(--gold)' },
 { label: 'نشط', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'مسودة', value: stats.draft, icon: "ICON_FileText", color: '#F59E0B' },
 { label: 'إجمالي الطلاب', value: stats.totalStudents, icon: '<User size={16} />GraduationCap', color: '#3B82F6' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
 <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
 </div>
 ))}
 </div>

 {/* Search */}
 <div style={{ marginBottom: 20 }}>
 <input placeholder="بحث بالعنوان أو المادة أو المدرب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(59,130,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Laptop size={19} color="#3B82F6" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد محتوى تعليمي</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة محتوى" لإنشاء أول محتوى تعليمي</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['المحتوى', 'النوع', 'المادة', 'المدرب', 'المستوى', 'المدة', 'الطلاب', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={typeIcons[item.type] || "ICON_Laptop"} /></div>
 <div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.title}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.description ? item.description.substring(0, 40) + (item.description.length > 40 ? '...' : '') : '—'}</div>
 </div>
 </div>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{typeLabels[item.type] || item.type}</td>
 <td style={{ padding: '14px 16px', color: 'var(--gold)', fontWeight: 600, fontSize: 14 }}>{item.subject || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.instructor || '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: levelColors[item.level]?.bg || 'rgba(16,185,129,0.1)', color: levelColors[item.level]?.color || '#10B981', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {levelLabels[item.level] || item.level}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.duration || '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ color: '#3B82F6', fontWeight: 700, fontSize: 14 }}>{item.students_count || 0}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}> طالب</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {statusLabels[item.status] || item.status}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--gold)', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
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
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل محتوى' : 'Plus إضافة محتوى تعليمي'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان المحتوى *</label>
 <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان الدورة أو الدرس" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="course">دورة</option>
 <option value="lesson">درس</option>
 <option value="workshop">ورشة عمل</option>
 <option value="tutorial">شرح</option>
 <option value="quiz">اختبار إلكتروني</option>
 <option value="resource">مصدر تعليمي</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المادة</label>
 <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="مثال: رياضيات، علوم" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المدرب</label>
 <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} style={inputStyle} placeholder="اسم المدرب أو المعلم" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المستوى</label>
 <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} style={inputStyle}>
 <option value="beginner">مبتدئ</option>
 <option value="intermediate">متوسط</option>
 <option value="advanced">متقدم</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المدة</label>
 <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="مثال: 2 ساعة، 45 دقيقة" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الطلاب</label>
 <input type="number" value={form.students_count} onChange={e => setForm({ ...form, students_count: e.target.value })} style={inputStyle} placeholder="0" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="وصف المحتوى التعليمي..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="active">نشط</option>
 <option value="draft">مسودة</option>
 <option value="archived">مؤرشف</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إضافة'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
