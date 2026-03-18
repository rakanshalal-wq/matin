'use client';
import { AlertTriangle, BadgeDollarSign, Briefcase, CheckCircle, Handshake, Megaphone, Pencil, Plus, Save, Search, Shirt, Trash2, User, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function CommissionsPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/commissions', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.person_name) return alert('اسم المستفيد مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/commissions', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/commissions?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ person_name: item.person_name || '', role: item.role || '', type: item.type || 'fixed', amount: item.amount?.toString() || '', percentage: item.percentage?.toString() || '', source: item.source || '', month: item.month || '', status: item.status || 'pending' });
 setShowModal(true);
 };

 const filtered = data.filter((item: any) => item.person_name?.toLowerCase().includes(search.toLowerCase()) || item.role?.toLowerCase().includes(search.toLowerCase()) || item.source?.toLowerCase().includes(search.toLowerCase()));

 const totalPaid = data.filter((d: any) => d.status === 'paid').reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);
 const totalPending = data.filter((d: any) => d.status === 'pending').reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);

 const stats = {
 total: data.length,
 paid: totalPaid,
 pending: totalPending,
 cancelled: data.filter((d: any) => d.status === 'cancelled').length,
 };

 const typeLabels: any = { fixed: 'مبلغ ثابت', percentage: 'نسبة مئوية', tiered: 'متدرّج', bonus: 'مكافأة' };
 const roleLabels: any = { sales_rep: 'مندوب مبيعات', referral: 'مُحيل', partner: 'شريك', employee: 'موظف', affiliate: 'مسوّق بالعمولة' };
 const roleIcons: any = { sales_rep: '<User size={16} />Briefcase', referral: "ICON_Handshake", partner: "ICON_Handshake", employee: "ICON_Shirt", affiliate: "ICON_Megaphone" };
 const statusLabels: any = { paid: 'تم الصرف', pending: 'معلّق', processing: 'جاري المعالجة', cancelled: 'ملغي' };
 const statusColors: any = { paid: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, processing: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };
 const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

 const formatMoney = (val: number) => val.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Pending Alert */}
 {totalPending > 0 && (
 <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
 <span style={{ fontSize: 24 }}></span>
 <div>
 <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>يوجد عمولات معلّقة بمبلغ {formatMoney(totalPending)} ر.س</div>
 <div style={{ color: 'rgba(245,158,11,0.8)', fontSize: 13, marginTop: 2 }}>يرجى مراجعة العمولات المعلّقة وصرفها</div>
 </div>
 </div>
 )}

 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_BadgeDollarSign" size={18} /> العمولات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة عمولات المندوبين والشركاء</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ person_name: '', role: '', type: 'fixed', amount: '', percentage: '', source: '', month: '', status: 'pending' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إضافة عمولة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي السجلات', value: stats.total.toString(), icon: "ICON_BadgeDollarSign", color: '#C9A227', suffix: '' },
 { label: 'تم الصرف', value: formatMoney(stats.paid), icon: "ICON_CheckCircle", color: '#10B981', suffix: ' ر.س' },
 { label: 'معلّق', value: formatMoney(stats.pending), icon: '⏳', color: '#F59E0B', suffix: ' ر.س' },
 { label: 'ملغي', value: stats.cancelled.toString(), icon: "ICON_XCircle", color: '#EF4444', suffix: '' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
 <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
 <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}<span style={{ fontSize: 13, fontWeight: 400 }}>{stat.suffix}</span></div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
 </div>
 ))}
 </div>

 {/* Search */}
 <div style={{ marginBottom: 20 }}>
 <input placeholder="بحث بالاسم أو الدور أو المصدر..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><BadgeDollarSign size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد عمولات مسجلة</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة عمولة" لتسجيل عمولة جديدة</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['المستفيد', 'الدور', 'النوع', 'المبلغ', 'النسبة', 'المصدر', 'الشهر', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={roleIcons[item.role] || "ICON_BadgeDollarSign"} /></div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.person_name}</div>
 </div>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {roleLabels[item.role] || item.role || '—'}
 </span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{typeLabels[item.type] || item.type}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ color: '#C9A227', fontWeight: 700, fontSize: 15, direction: 'ltr' as any }}>{formatMoney(parseFloat(item.amount) || 0)}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}> ر.س</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 {parseFloat(item.percentage) > 0 ? (
 <span style={{ color: '#10B981', fontWeight: 700, fontSize: 14 }}>{item.percentage}%</span>
 ) : '—'}
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.source || '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{item.month || '—'}</td>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل عمولة' : 'Plus إضافة عمولة جديدة'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المستفيد *</label>
 <input value={form.person_name} onChange={e => setForm({ ...form, person_name: e.target.value })} style={inputStyle} placeholder="اسم المستفيد" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الدور</label>
 <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inputStyle}>
 <option value="">— اختر —</option>
 <option value="sales_rep">مندوب مبيعات <User size={16} />Briefcase</option>
 <option value="referral">مُحيل Handshake</option>
 <option value="partner">شريك Handshake</option>
 <option value="employee">موظف Shirt</option>
 <option value="affiliate">مسوّق بالعمولة Megaphone</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع العمولة</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="fixed">مبلغ ثابت</option>
 <option value="percentage">نسبة مئوية</option>
 <option value="tiered">متدرّج</option>
 <option value="bonus">مكافأة</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المبلغ (ر.س)</label>
 <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} placeholder="0.00" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النسبة (%)</label>
 <input type="number" step="0.01" max="100" value={form.percentage} onChange={e => setForm({ ...form, percentage: e.target.value })} style={inputStyle} placeholder="مثال: 10" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المصدر</label>
 <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} style={inputStyle} placeholder="مثال: اشتراك مدرسة الأمل" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الشهر</label>
 <select value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} style={inputStyle}>
 <option value="">— اختر الشهر —</option>
 {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="pending">معلّق</option>
 <option value="processing">جاري المعالجة</option>
 <option value="paid">تم الصرف</option>
 <option value="cancelled">ملغي</option>
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
