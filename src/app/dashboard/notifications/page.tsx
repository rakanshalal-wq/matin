'use client';
export const dynamic = 'force-dynamic';
import { AlertTriangle, Bell, Building, Calendar, CheckCircle, Circle, Clock, GraduationCap, Mailbox, Pencil, Plus, Save, School, Search, Settings, Shirt, Siren, Trash2, Triangle, User, Users, X } from "lucide-react";
import { toast } from '@/lib/toast';
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function NotificationsPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ title: '', message: '', type: 'info', target_audience: 'all', is_read: false, status: 'active' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/notifications', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.title) { toast('عنوان الإشعار مطلوب', "error"); return; };
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/notifications', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ title: '', message: '', type: 'info', target_audience: 'all', is_read: false, status: 'active' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/notifications?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ title: item.title || '', message: item.message || '', type: item.type || 'info', target_audience: item.target_audience || 'all', is_read: item.is_read || false, status: item.status || 'active' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.title?.toLowerCase().includes(search.toLowerCase()) || item.message?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 unread: data.filter((d: any) => !d.is_read).length,
 urgent: data.filter((d: any) => d.type === 'urgent').length,
 today: data.filter((d: any) => { const t = new Date(d.created_at); const n = new Date(); return t.toDateString() === n.toDateString(); }).length,
 };

 const typeLabels: any = { info: 'معلومة', success: 'نجاح', warning: 'تحذير', urgent: 'عاجل', reminder: 'تذكير', system: 'نظام' };
 const typeIcons: any = { info: 'ℹ ', success: "ICON_CheckCircle", warning: 'Alert<Triangle size={16} />', urgent: "ICON_Siren", reminder: '⏰', system: '<Settings size={16} />' };
 const typeColors: any = { info: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, success: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, warning: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, urgent: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, reminder: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, system: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };
 const audienceLabels: any = { all: 'الجميع', students: 'الطلاب', teachers: 'المعلمين', parents: 'أولياء الأمور', employees: 'الموظفين', admins: 'المدراء' };
 const statusLabels: any = { active: 'نشط', archived: 'مؤرشف' };
 const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, archived: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 const timeAgo = (date: string) => {
 const diff = Date.now() - new Date(date).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 1) return 'الآن';
 if (mins < 60) return `منذ ${mins} دقيقة`;
 const hours = Math.floor(mins / 60);
 if (hours < 24) return `منذ ${hours} ساعة`;
 const days = Math.floor(hours / 24);
 return `منذ ${days} يوم`;
 };

 return (
 <div>
 {/* Urgent Alert */}
 {stats.urgent > 0 && (
 <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}><IconRenderer name="ICON_Siren" size={36} /></span>
 <div>
 <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>يوجد {stats.urgent} إشعار عاجل</div>
 <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى مراجعة الإشعارات العاجلة فوراً</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Bell" size={18} /> الإشعارات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة وإرسال الإشعارات لجميع المستخدمين</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ title: '', message: '', type: 'info', target_audience: 'all', is_read: false, status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إشعار جديد
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الإشعارات', value: stats.total, icon: "ICON_Bell", color: '#C9A227' },
 { label: 'غير مقروء', value: stats.unread, icon: "ICON_Mailbox", color: '#3B82F6' },
 { label: 'عاجل', value: stats.urgent, icon: "ICON_Siren", color: '#EF4444' },
 { label: 'اليوم', value: stats.today, icon: "ICON_Calendar", color: '#10B981' },
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
 <input placeholder="بحث بالعنوان أو المحتوى..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Notifications List */}
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:'0 auto 12px'}}><Circle size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>لا توجد إشعارات</p>
 </div>
 ) : (
 filtered.map((item: any) => (
 <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
 <div style={{ flex: 1 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
 <span style={{ color: 'white', fontWeight: !item.is_read ? 700 : 500, fontSize: 15 }}>{item.title}</span>
 {!item.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />}
 <span style={{ background: typeColors[item.type]?.bg, color: typeColors[item.type]?.color, padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{typeLabels[item.type] || item.type}</span>
 </div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '6px 0' }}>{item.message || '—'}</p>
 <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{audienceLabels[item.target_audience] || item.target_audience}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{item.created_at ? timeAgo(item.created_at) : '—'}</span>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>حذف</button>
 </div>
 </div>
 ))
 )}
 </div>

 {/* Modal */}
 {showModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل إشعار' : 'Plus إشعار جديد'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عنوان الإشعار *</label>
 <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="عنوان الإشعار" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="info">معلومة ℹ </option>
 <option value="success">نجاح CheckCircle</option>
 <option value="warning">تحذير Alert<Triangle size={16} /></option>
 <option value="urgent">عاجل Siren</option>
 <option value="reminder">تذكير ⏰</option>
 <option value="system">نظام <Settings size={16} /></option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الفئة المستهدفة</label>
 <select value={form.target_audience} onChange={e => setForm({ ...form, target_audience: e.target.value })} style={inputStyle}>
 <option value="all">الجميع Users</option>
 <option value="students">الطلاب GraduationCap</option>
 <option value="teachers">المعلمين <User size={16} />School</option>
 <option value="parents">أولياء الأمور <User size={16} /> User</option>
 <option value="employees">الموظفين Shirt</option>
 <option value="admins">المدراء Building</option>
 </select>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المحتوى</label>
 <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="محتوى الإشعار..." />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="active">نشط</option>
 <option value="archived">مؤرشف</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Bell إرسال'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
