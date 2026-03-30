'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, Hand, Mailbox, Megaphone, MessageCircle, Pencil, Plus, Save, Search, Siren, Trash2, Upload, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function MessagesPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ sender_name: '', receiver_name: '', subject: '', content: '', type: 'text', status: 'sent' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/messages', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.content) return alert('محتوى الرسالة مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/messages', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ sender_name: '', receiver_name: '', subject: '', content: '', type: 'text', status: 'sent' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/messages?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ sender_name: item.sender_name || '', receiver_name: item.receiver_name || '', subject: item.subject || '', content: item.content || '', type: item.type || 'text', status: item.status || 'sent' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.sender_name?.toLowerCase().includes(search.toLowerCase()) || item.receiver_name?.toLowerCase().includes(search.toLowerCase()) || item.subject?.toLowerCase().includes(search.toLowerCase()) || item.content?.toLowerCase().includes(search.toLowerCase()));

 const stats = {
 total: data.length,
 sent: data.filter((d: any) => d.status === 'sent').length,
 read: data.filter((d: any) => d.status === 'read').length,
 unread: data.filter((d: any) => d.status === 'sent' || d.status === 'delivered').length,
 };

 const typeLabels: any = { text: 'نصية', announcement: 'إعلان', urgent: 'عاجلة', reminder: 'تذكير', welcome: 'ترحيب' };
 const typeIcons: any = { text: "ICON_MessageCircle", announcement: "ICON_Megaphone", urgent: "ICON_Siren", reminder: '⏰', welcome: "ICON_Hand" };
 const typeColors: any = { text: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, announcement: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, urgent: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, reminder: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, welcome: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' } };
 const statusLabels: any = { sent: 'مرسلة', delivered: 'تم التوصيل', read: 'مقروءة', failed: 'فشلت' };
 const statusColors: any = { sent: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, delivered: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, read: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, failed: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Unread Alert */}
 {stats.unread > 0 && (
 <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}><IconRenderer name="ICON_Mail" size={18} />box</span>
 <div>
 <div style={{ color: '#3B82F6', fontWeight: 700, fontSize: 15 }}>لديك {stats.unread} رسالة غير مقروءة</div>
 <div style={{ color: 'rgba(59,130,246,0.8)', fontSize: 13, marginTop: 2 }}>تحقق من الرسائل الجديدة</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_MessageCircle" size={18} /> التواصل</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة الرسائل والتواصل بين أطراف المنصة</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ sender_name: '', receiver_name: '', subject: '', content: '', type: 'text', status: 'sent' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 رسالة جديدة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الرسائل', value: stats.total, icon: "ICON_MessageCircle", color: '#D4A843' },
 { label: 'مرسلة', value: stats.sent, icon: "ICON_Upload", color: '#3B82F6' },
 { label: 'مقروءة', value: stats.read, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'غير مقروءة', value: stats.unread, icon: "ICON_Mailbox", color: '#F59E0B' },
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
 <input placeholder="بحث بالمرسل أو المستقبل أو الموضوع..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><MessageCircle size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد رسائل</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "رسالة جديدة" لإرسال أول رسالة</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['المرسل', 'المستقبل', 'الموضوع', 'المحتوى', 'النوع', 'التاريخ', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: item.status === 'sent' || item.status === 'delivered' ? 'rgba(59,130,246,0.03)' : item.type === 'urgent' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={typeIcons[item.type] || "ICON_MessageCircle"} /></div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.sender_name || '—'}</div>
 </div>
 </td>
 <td style={{ padding: '14px 16px', color: '#D4A843', fontWeight: 600, fontSize: 14 }}>{item.receiver_name || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: item.status !== 'read' ? 700 : 400 }}>{item.subject || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.content ? item.content.substring(0, 40) + (item.content.length > 40 ? '...' : '') : '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: typeColors[item.type]?.bg || 'rgba(59,130,246,0.1)', color: typeColors[item.type]?.color || '#3B82F6', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {typeLabels[item.type] || item.type}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.created_at ? new Date(item.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {statusLabels[item.status] || item.status}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#D4A843', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}> </button>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل رسالة' : 'رسالة جديدة'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المرسل</label>
 <input value={form.sender_name} onChange={e => setForm({ ...form, sender_name: e.target.value })} style={inputStyle} placeholder="اسم المرسل" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المستقبل</label>
 <input value={form.receiver_name} onChange={e => setForm({ ...form, receiver_name: e.target.value })} style={inputStyle} placeholder="اسم المستقبل" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="text">نصية MessageCircle</option>
 <option value="announcement">إعلان Megaphone</option>
 <option value="urgent">عاجلة Siren</option>
 <option value="reminder">تذكير ⏰</option>
 <option value="welcome">ترحيب Hand</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="sent">مرسلة</option>
 <option value="delivered">تم التوصيل</option>
 <option value="read">مقروءة</option>
 <option value="failed">فشلت</option>
 </select>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الموضوع</label>
 <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inputStyle} placeholder="موضوع الرسالة" />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المحتوى *</label>
 <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="اكتب رسالتك هنا..." />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
 <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #D4A843 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Upload إرسال'}</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
