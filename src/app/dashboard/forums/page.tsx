'use client';
import { BookOpen, CheckCircle, FileText, GraduationCap, Lightbulb, MessageSquare, Pencil, Plus, Save, School, Search, Settings, Target, Trash2, User, Users, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ForumsPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ title: '', category: 'general', author: '', description: '', members_count: '', posts_count: '', status: 'active' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/forums', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.title) return alert('عنوان المجموعة مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/forums', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', category: 'general', author: '', description: '', members_count: '', posts_count: '', status: 'active' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/forums?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ title: item.title || '', category: item.category || 'general', author: item.author || '', description: item.description || '', members_count: item.members_count?.toString() || '', posts_count: item.posts_count?.toString() || '', status: item.status || 'active' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.category?.toLowerCase().includes(search.toLowerCase()) || item.author?.toLowerCase().includes(search.toLowerCase()));

 const totalMembers = data.reduce((sum: number, d: any) => sum + (parseInt(d.members_count) || 0), 0);
 const totalPosts = data.reduce((sum: number, d: any) => sum + (parseInt(d.posts_count) || 0), 0);

 const stats = {
 total: data.length,
 active: data.filter((d: any) => d.status === 'active').length,
 totalMembers,
 totalPosts,
 };

 const categoryLabels: any = { general: 'عام', academic: 'أكاديمي', activities: 'أنشطة', parents: 'أولياء الأمور', teachers: 'معلمين', students: 'طلاب', suggestions: 'اقتراحات', support: 'دعم فني' };
 const categoryIcons: any = { general: "ICON_MessageSquare", academic: "ICON_BookOpen", activities: "ICON_Target", parents: '<User size={16} /> User', teachers: '<User size={16} />School', students: "ICON_GraduationCap", suggestions: "ICON_Lightbulb", support: '<Settings size={16} />' };
 const categoryColors: any = { general: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, academic: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, activities: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, parents: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, teachers: { bg: 'rgba(201,162,39,0.1)', color: '#C9A227' }, students: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, suggestions: { bg: 'rgba(236,72,153,0.1)', color: '#EC4899' }, support: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };
 const statusLabels: any = { active: 'نشط', closed: 'مغلق', archived: 'مؤرشف' };
 const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, closed: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, archived: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_MessageSquare" size={18} /> مجموعات النقاش</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة منتديات ومجموعات النقاش التعليمية</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ title: '', category: 'general', author: '', description: '', members_count: '', posts_count: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إنشاء مجموعة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المجموعات', value: stats.total, icon: "ICON_MessageSquare", color: '#C9A227' },
 { label: 'نشطة', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'إجمالي الأعضاء', value: stats.totalMembers, icon: "ICON_Users", color: '#3B82F6' },
 { label: 'إجمالي المنشورات', value: stats.totalPosts, icon: "ICON_FileText", color: '#8B5CF6' },
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
 <input placeholder="بحث بالعنوان أو التصنيف أو المنشئ..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Forums Grid */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, gridColumn: '1 / -1' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12, gridColumn: '1 / -1' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Circle size={19} color="#6B7280" /></div>
 <div>
 <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{item.title}</div>
 <span style={{ background: categoryColors[item.category]?.bg, color: categoryColors[item.category]?.color, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{categoryLabels[item.category] || item.category}</span>
 </div>
 </div>
 <span style={{ background: statusColors[item.status]?.bg, color: statusColors[item.status]?.color, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{statusLabels[item.status] || item.status}</span>
 </div>

 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '0 0 16px 0', lineHeight: 1.6 }}>{item.description ? item.description.substring(0, 80) + (item.description.length > 80 ? '...' : '') : 'لا يوجد وصف'}</p>

 {item.author && (
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 12 }}>أنشأها: <span style={{ color: '#C9A227' }}>{item.author}</span></div>
 )}

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
 <div style={{ display: 'flex', gap: 20 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <span style={{ fontSize: 16 }}><IconRenderer name="ICON_User" size={18} />s</span>
 <span style={{ color: '#3B82F6', fontWeight: 700, fontSize: 14 }}>{item.members_count || 0}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>عضو</span>
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
 <span style={{ fontSize: 16 }}><FileText size={18} color="#6B7280" /></span>
 <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 14 }}>{item.posts_count || 0}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>منشور</span>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Modal */}
 {showModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل مجموعة' : 'Plus إنشاء مجموعة نقاش'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان المجموعة *</label>
 <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان مجموعة النقاش" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التصنيف</label>
 <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
 <option value="general">عام MessageSquare</option>
 <option value="academic">أكاديمي BookOpen</option>
 <option value="activities">أنشطة Target</option>
 <option value="parents">أولياء الأمور <User size={16} /> User</option>
 <option value="teachers">معلمين <User size={16} />School</option>
 <option value="students">طلاب GraduationCap</option>
 <option value="suggestions">اقتراحات Lightbulb</option>
 <option value="support">دعم فني <Settings size={16} /></option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المنشئ</label>
 <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} style={inputStyle} placeholder="اسم منشئ المجموعة" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد الأعضاء</label>
 <input type="number" value={form.members_count} onChange={e => setForm({ ...form, members_count: e.target.value })} style={inputStyle} placeholder="0" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد المنشورات</label>
 <input type="number" value={form.posts_count} onChange={e => setForm({ ...form, posts_count: e.target.value })} style={inputStyle} placeholder="0" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="وصف مجموعة النقاش..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="active">نشط</option>
 <option value="closed">مغلق</option>
 <option value="archived">مؤرشف</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إنشاء'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
