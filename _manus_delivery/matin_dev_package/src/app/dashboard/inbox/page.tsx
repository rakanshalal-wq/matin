'use client';
export const dynamic = 'force-dynamic';
import { Mail, MailOpen, Pencil, Plus, Save, Search, Star, Trash2, Upload, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function InboxPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [viewItem, setViewItem] = useState<any>(null);
 const [form, setForm] = useState({ sender: '', receiver: '', subject: '', body: '', is_read: false, is_starred: false, status: 'sent' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/inbox', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.sender || !form.receiver) return alert('المرسل والمستقبل مطلوبين');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/inbox', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ sender: '', receiver: '', subject: '', body: '', is_read: false, is_starred: false, status: 'sent' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/inbox?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ sender: item.sender || '', receiver: item.receiver || '', subject: item.subject || '', body: item.body || '', is_read: item.is_read || false, is_starred: item.is_starred || false, status: item.status || 'sent' });
 setShowModal(true);
 };

 const toggleStar = async (item: any) => {
 try {
 await fetch('/api/inbox', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ ...item, is_starred: !item.is_starred }) });
 fetchData();
 } catch (error) { console.error('Error:', error); }
 };

 const markAsRead = async (item: any) => {
 if (item.is_read) return;
 try {
 await fetch('/api/inbox', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ ...item, is_read: true }) });
 fetchData();
 } catch (error) { console.error('Error:', error); }
 };

 const filtered = data.filter((item: any) => item.sender?.toLowerCase().includes(search.toLowerCase()) || item.receiver?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 unread: data.filter((d: any) => !d.is_read).length,
 starred: data.filter((d: any) => d.is_starred).length,
 sent: data.filter((d: any) => d.status === 'sent').length,
 };

 const timeAgo = (date: string) => {
 if (!date) return '';
 const diff = Date.now() - new Date(date).getTime();
 const mins = Math.floor(diff / 60000);
 if (mins < 1) return 'الآن';
 if (mins < 60) return `منذ ${mins} د`;
 const hours = Math.floor(mins / 60);
 if (hours < 24) return `منذ ${hours} س`;
 const days = Math.floor(hours / 24);
 if (days < 7) return `منذ ${days} يوم`;
 return new Date(date).toLocaleDateString('ar-SA');
 };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Unread Alert */}
 {stats.unread > 0 && (
 <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}><IconRenderer name="ICON_Mail" size={18} />Open</span>
 <div>
 <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: 15 }}>لديك {stats.unread} رسالة غير مقروءة</div>
 <div style={{ color: 'rgba(59,130,246,0.8)', fontSize: 13, marginTop: 2 }}>اضغط على الرسالة لقراءتها</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"><IconRenderer name="ICON_Mail" size={18} /> البريد الداخلي</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>نظام المراسلات الداخلية بين المستخدمين</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ sender: '', receiver: '', subject: '', body: '', is_read: false, is_starred: false, status: 'sent' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 رسالة جديدة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الرسائل', value: stats.total, icon: "ICON_Mail", color: 'var(--gold)' },
 { label: 'غير مقروءة', value: stats.unread, icon: "ICON_MailOpen", color: '#3B82F6' },
 { label: 'مميزة', value: stats.starred, icon: '', color: '#F59E0B' },
 { label: 'مرسلة', value: stats.sent, icon: "ICON_Upload", color: '#10B981' },
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
 <input placeholder="بحث بالمرسل أو المستقبل أو الموضوع..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Email List */}
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Mail size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>صندوق البريد فارغ</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "رسالة جديدة" لإرسال رسالة</p>
 </div>
 ) : filtered.map((item: any) => (
 <div key={item.id} onClick={() => { setViewItem(item); markAsRead(item); }} style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', background: !item.is_read ? 'rgba(59,130,246,0.04)' : 'transparent', transition: 'background 0.2s' }}
 onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
 onMouseLeave={e => (e.currentTarget.style.background = !item.is_read ? 'rgba(59,130,246,0.04)' : 'transparent')}>
 
 {/* Star */}
 <button onClick={(e) => { e.stopPropagation(); toggleStar(item); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: '4px 8px', marginLeft: 8 }}>
 {item.is_starred ? <Star size={14} color="#D4A843" fill="#D4A843" /> : <Star size={14} color="rgba(238,238,245,0.25)" />}
 </button>

 {/* Unread Dot */}
 <div style={{ width: 10, minWidth: 10, marginLeft: 8 }}>
 {!item.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6' }} />}
 </div>

 {/* Avatar */}
 <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginLeft: 12, flexShrink: 0 }}><IconRenderer name="ICON_Mail" size={36} /></div>

 {/* Content */}
 <div style={{ flex: 1, marginRight: 14, overflow: 'hidden' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
 <span style={{ color: 'white', fontWeight: !item.is_read ? 700 : 500, fontSize: 14 }}>{item.sender}</span>
 <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>→</span>
 <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>{item.receiver}</span>
 </div>
 <div style={{ color: !item.is_read ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: !item.is_read ? 600 : 400 }}>{item.subject || '(بدون موضوع)'}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.body || ''}</div>
 </div>

 {/* Time & Actions */}
 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{timeAgo(item.created_at)}</span>
 <div style={{ display: 'flex', gap: 6 }}>
 <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} style={{ background: 'rgba(201,162,39,0.1)', color: 'var(--gold)', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}> </button>
 <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}> </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* View Modal */}
 {viewItem && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}><IconRenderer name="ICON_Mail" size={18} /> {viewItem.subject || '(بدون موضوع)'}</h2>
 <button onClick={() => setViewItem(null)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'flex', gap: 16, marginBottom: 16, padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 10 }}>
 <div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>من: </span><span style={{ color: 'white', fontWeight: 600 }}>{viewItem.sender}</span></div>
 <div><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>إلى: </span><span style={{ color: 'var(--gold)', fontWeight: 600 }}>{viewItem.receiver}</span></div>
 <div style={{ marginRight: 'auto' }}><span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{viewItem.created_at ? new Date(viewItem.created_at).toLocaleString('ar-SA') : ''}</span></div>
 </div>
 <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.8, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'pre-wrap' }}>{viewItem.body || 'لا يوجد محتوى'}</div>
 </div>
 </div>
 )}

 {/* Compose Modal */}
 {showModal && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل رسالة' : '<Mail size={16} /> رسالة جديدة'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المرسل *</label>
 <input value={form.sender} onChange={e => setForm({ ...form, sender: e.target.value })} style={inputStyle} placeholder="اسم المرسل" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المستقبل *</label>
 <input value={form.receiver} onChange={e => setForm({ ...form, receiver: e.target.value })} style={inputStyle} placeholder="اسم المستقبل" />
 </div>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموضوع</label>
 <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="موضوع الرسالة" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المحتوى</label>
 <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} style={{ ...inputStyle, minHeight: 150, resize: 'vertical' }} placeholder="اكتب رسالتك هنا..." />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Upload إرسال'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
