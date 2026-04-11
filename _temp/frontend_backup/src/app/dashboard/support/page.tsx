'use client';
export const dynamic = "force-dynamic";
import { Angry, Calendar, CheckCircle, ClipboardList, Headphones, HelpCircle, Lightbulb, Plus, Search, Settings, Trash2, Unlock, Upload, User, Wrench, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function SupportPage() {
 const [tickets, setTickets] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showAdd, setShowAdd] = useState(false);
 const [saving, setSaving] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [errMsg, setErrMsg] = useState('');
 const [search, setSearch] = useState('');
 const [statusFilter, setStatusFilter] = useState('all');
 const [msg, setMsg] = useState('');
 const [msgType, setMsgType] = useState<'success' | 'error'>('success');
 const [form, setForm] = useState({ subject: '', description: '', type: 'complaint', priority: 'medium' });

 useEffect(() => { fetchTickets(); }, []);

 const fetchTickets = async () => {
 try {
 const res = await fetch('/api/support', { headers: getHeaders() });
 const data = await res.json();
 setTickets(Array.isArray(data) ? data : []);
 } catch (e) { console.error(e); } finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!form.subject) { setErrMsg('أدخل عنوان التذكرة'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/support?id=${editItem.id}` : '/api/support';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 const data = await res.json();
 if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
 setShowAdd(false); setEditItem(null); setForm({ subject: '', description: '', type: 'complaint', priority: 'medium' }); setErrMsg('');
 fetchTickets();
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ ...{ subject: '', description: '', type: 'complaint', priority: 'medium' }, ...item });
 setErrMsg('');
 setShowAdd(true);
 };

 const handleUpdateStatus = async (id: number, status: string) => {
 try {
 await fetch('/api/support', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id, status }) });
 setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
 } catch {}
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من حذف هذه التذكرة؟')) return;
 try {
 await fetch(`/api/support?id=${id}`, { method: 'DELETE', headers: getHeaders() });
 setTickets(tickets.filter(t => t.id !== id));
 } catch {}
 };

 const filtered = tickets.filter(t => {
 const matchSearch = (t.subject || '').toLowerCase().includes(search.toLowerCase()) || (t.description || '').toLowerCase().includes(search.toLowerCase()) || (t.name || '').toLowerCase().includes(search.toLowerCase());
 const matchStatus = statusFilter === 'all' || t.status === statusFilter;
 return matchSearch && matchStatus;
 });

 const stats = {
 total: tickets.length,
 open: tickets.filter(t => t.status === 'open').length,
 inProgress: tickets.filter(t => t.status === 'in_progress').length,
 closed: tickets.filter(t => t.status === 'closed').length,
 };

 const typeLabels: Record<string, string> = { complaint: 'Angry شكوى', suggestion: 'Lightbulb اقتراح', inquiry: 'HelpCircle استفسار', technical: 'Wrench مشكلة تقنية' };
 const priorityLabels: Record<string, { label: string; color: string }> = {
 low: { label: 'منخفضة', color: '#10B981' },
 medium: { label: 'متوسطة', color: '#F59E0B' },
 high: { label: 'عالية', color: '#EF4444' },
 urgent: { label: 'عاجلة', color: '#DC2626' },
 };
 const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
 open: { label: 'Unlock مفتوحة', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
 in_progress: { label: '<Settings size={16} /> قيد المعالجة', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
 closed: { label: 'CheckCircle مغلقة', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
 rejected: { label: 'XCircle مرفوضة', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
 };

 const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'IBM Plex Sans Arabic, sans-serif' };

 if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>;

 return (
 <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 {/* الهيدر */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C9A227', margin: 0 }}><IconRenderer name="ICON_Headphones" size={18} /> الدعم الفني</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '6px 0 0' }}>تذاكر الدعم والشكاوى والاستفسارات</p>
 </div>
 <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 {showAdd ? ' إلغاء' : '+ تذكرة جديدة'}
 </button>
 </div>

 {/* رسالة */}
 {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msgType === 'success' ? '#10B981' : '#EF4444' }}>{msg}</div>}

 {/* إحصائيات */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
 {[
 { label: 'الكل', value: stats.total, color: '#C9A227', icon: "ICON_ClipboardList" },
 { label: 'مفتوحة', value: stats.open, color: '#3B82F6', icon: "ICON_Unlock" },
 { label: 'قيد المعالجة', value: stats.inProgress, color: '#F59E0B', icon: '<Settings size={16} />' },
 { label: 'مغلقة', value: stats.closed, color: '#10B981', icon: "ICON_CheckCircle" },
 ].map((s, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
 <div style={{ fontSize: 24, marginBottom: 6 }}><IconRenderer name={s.icon} /></div>
 <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
 <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>

 {/* فورم الإضافة */}
 {showAdd && (
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}><IconRenderer name="ICON_Plus" size={18} /> تذكرة جديدة</h3>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1 / -1' }}>
 <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>الموضوع *</label>
 <input style={inputStyle} placeholder="وصف مختصر للمشكلة" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
 <option value="complaint">شكوى</option>
 <option value="suggestion">اقتراح</option>
 <option value="inquiry">استفسار</option>
 <option value="technical">مشكلة تقنية</option>
 </select>
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>الأولوية</label>
 <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
 <option value="low">منخفضة</option>
 <option value="medium">متوسطة</option>
 <option value="high">عالية</option>
 <option value="urgent">عاجلة</option>
 </select>
 </div>
 <div style={{ gridColumn: '1 / -1' }}>
 <label style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' }}>التفاصيل</label>
 <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="اشرح المشكلة بالتفصيل..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
 </div>
 </div>
 <button onClick={handleSave} disabled={saving} style={{ marginTop: 16, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
 {saving ? '⏳ جاري الإرسال...' : 'Upload إرسال التذكرة'}
 </button>
 </div>
 )}

 {/* فلاتر */}
 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 300 }} />
 <select style={{ ...inputStyle, maxWidth: 200, cursor: 'pointer' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
 <option value="all">كل الحالات</option>
 <option value="open">مفتوحة</option>
 <option value="in_progress">قيد المعالجة</option>
 <option value="closed">مغلقة</option>
 </select>
 </div>

 {/* قائمة التذاكر */}
 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(245,158,11,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Headphones size={19} color="#F59E0B" /></div>
 <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد تذاكر</h3>
 <p style={{ color: '#9CA3AF', fontSize: 14 }}>أضف تذكرة جديدة للدعم الفني</p>
 </div>
 ) : (
 <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
 {filtered.map((ticket: any) => {
 const statusInfo = statusLabels[ticket.status] || statusLabels.open;
 const priorityInfo = priorityLabels[ticket.priority] || priorityLabels.medium;
 return (
 <div key={ticket.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
 <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{ticket.subject || ticket.name}</h3>
 <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusInfo.bg, color: statusInfo.color }}>{statusInfo.label}</span>
 <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.05)', color: priorityInfo.color }}>{priorityInfo.label}</span>
 </div>
 {ticket.description && <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>{ticket.description}</p>}
 <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
 <span style={{ color: '#6B7280', fontSize: 12 }}><IconRenderer name="ICON_User" size={18} /> {ticket.name || 'مجهول'}</span>
 <span style={{ color: '#6B7280', fontSize: 12 }}><IconRenderer name="ICON_ClipboardList" size={18} /> {typeLabels[ticket.type] || ticket.type}</span>
 <span style={{ color: '#6B7280', fontSize: 12 }}><IconRenderer name="ICON_Calendar" size={18} /> {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('ar-SA') : ''}</span>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 {ticket.status === 'open' && (
 <button onClick={() => handleUpdateStatus(ticket.id, 'in_progress')} style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 <Settings size={16} /> معالجة
 </button>
 )}
 {ticket.status !== 'closed' && (
 <button onClick={() => handleUpdateStatus(ticket.id, 'closed')} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 CheckCircle إغلاق
 </button>
 )}
 <button onClick={() => handleDelete(ticket.id)} style={{ padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 );
}
