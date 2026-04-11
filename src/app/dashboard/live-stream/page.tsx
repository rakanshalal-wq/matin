'use client';
export const dynamic = 'force-dynamic';
import { Calendar, Circle, Eye, Link, Monitor, Pencil, Plus, Satellite, Save, Search, Trash2, Users, Video, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function LiveStreamPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ title: '', subject: '', teacher_name: '', class_name: '', platform: 'zoom', link: '', date: '', duration: '', viewers_count: '0', status: 'scheduled' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/live-stream', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.title) { toast('عنوان البث مطلوب', "error"); return; };
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/live-stream', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', subject: '', teacher_name: '', class_name: '', platform: 'zoom', link: '', date: '', duration: '', viewers_count: '0', status: 'scheduled' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/live-stream?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ title: item.title || '', subject: item.subject || '', teacher_name: item.teacher_name || '', class_name: item.class_name || '', platform: item.platform || 'zoom', link: item.link || '', date: item.date ? item.date.substring(0, 16) : '', duration: item.duration || '', viewers_count: item.viewers_count?.toString() || '0', status: item.status || 'scheduled' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()) || item.teacher_name?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 live: data.filter((d: any) => d.status === 'live').length,
 scheduled: data.filter((d: any) => d.status === 'scheduled').length,
 totalViewers: data.reduce((sum: number, d: any) => sum + (parseInt(d.viewers_count) || 0), 0),
 };

 const platformLabels: any = { zoom: 'Zoom', teams: 'Microsoft Teams', meet: 'Google Meet', youtube: 'YouTube Live', custom: 'منصة خاصة' };
 const platformIcons: any = { zoom: "ICON_Video", teams: "ICON_Users", meet: "ICON_Circle", youtube: '', custom: '<Monitor size={16} />' };
 const platformColors: any = { zoom: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, teams: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, meet: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, youtube: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, custom: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } };
 const statusLabels: any = { scheduled: 'مجدول', live: 'مباشر الآن', ended: 'انتهى', cancelled: 'ملغي' };
 const statusColors: any = { scheduled: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, live: { bg: 'rgba(16,185,129,0.15)', color: '#10B981' }, ended: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Live Alert */}
 {stats.live > 0 && (
 <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
 <div>
 <div style={{ color: '#10B981', fontWeight: 700, fontSize: 15 }}><IconRenderer name="ICON_Circle" size={18} /> يوجد {stats.live} بث مباشر الآن!</div>
 <div style={{ color: 'rgba(16,185,129,0.8)', fontSize: 13, marginTop: 2 }}>اضغط على زر "انضم" للدخول إلى البث</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Satellite" size={18} /> البث المباشر</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة البث المباشر للمحاضرات والفعاليات</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ title: '', subject: '', teacher_name: '', class_name: '', platform: 'zoom', link: '', date: '', duration: '', viewers_count: '0', status: 'scheduled' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus جدولة بث جديد
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي البثوث', value: stats.total, icon: "ICON_Satellite", color: '#C9A227' },
 { label: 'مباشر الآن', value: stats.live, icon: "ICON_Circle", color: '#10B981' },
 { label: 'مجدول', value: stats.scheduled, icon: "ICON_Calendar", color: '#3B82F6' },
 { label: 'إجمالي المشاهدات', value: stats.totalViewers, icon: '<Eye size={16} />', color: '#8B5CF6' },
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
 <input placeholder="بحث بالعنوان أو المادة أو المعلم..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Circle size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد بثوث مباشرة</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "جدولة بث جديد" لإنشاء بث</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['البث', 'المنصة', 'المادة', 'المعلم', 'الفصل', 'الموعد', 'المشاهدون', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.status === 'live' ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: platformColors[item.platform]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={platformIcons[item.platform] || "ICON_Satellite"} /></div>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <span style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.title}</span>
 {item.status === 'live' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px rgba(239,68,68,0.6)' }} />}
 </div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.duration || '—'}</div>
 </div>
 </div>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: platformColors[item.platform]?.bg || 'rgba(59,130,246,0.1)', color: platformColors[item.platform]?.color || '#3B82F6', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {platformLabels[item.platform] || item.platform}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: '#C9A227', fontWeight: 600, fontSize: 14 }}>{item.subject || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.teacher_name || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.class_name || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.date ? new Date(item.date).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 14 }}>{item.viewers_count || 0}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}> <Eye size={16} /></span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {item.status === 'live' && 'Circle '}{statusLabels[item.status] || item.status}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 {item.link && item.status === 'live' && (
 <button onClick={() => window.open(item.link, '_blank')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}><IconRenderer name="ICON_Circle" size={18} /> انضم</button>
 )}
 {item.link && item.status !== 'live' && (
 <button onClick={() => window.open(item.link, '_blank')} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Link" size={18} /> رابط</button>
 )}
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}> </button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}> </button>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل بث' : 'Plus جدولة بث جديد'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان البث *</label>
 <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان البث المباشر" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المنصة</label>
 <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} style={inputStyle}>
 <option value="zoom">Zoom Video</option>
 <option value="teams"><IconRenderer name="ICON_Mic" size={18} />rosoft Teams Users</option>
 <option value="meet">Google Meet Circle</option>
 <option value="youtube">YouTube Live </option>
 <option value="custom">منصة خاصة <Monitor size={16} /></option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المادة</label>
 <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="اسم المادة" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المعلم</label>
 <input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} style={inputStyle} placeholder="اسم المعلم" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفصل</label>
 <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} style={inputStyle} placeholder="اسم الفصل" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموعد</label>
 <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المدة</label>
 <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="مثال: 60 دقيقة" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد المشاهدين</label>
 <input type="number" value={form.viewers_count} onChange={e => setForm({ ...form, viewers_count: e.target.value })} style={inputStyle} placeholder="0" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="scheduled">مجدول</option>
 <option value="live">مباشر الآن Circle</option>
 <option value="ended">انتهى</option>
 <option value="cancelled">ملغي</option>
 </select>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>رابط البث</label>
 <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} style={inputStyle} placeholder="https://zoom.us/j/..." />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus جدولة'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
