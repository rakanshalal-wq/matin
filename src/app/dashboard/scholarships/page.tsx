'use client';
export const dynamic = 'force-dynamic';
import { Ban, BookMarked, CheckCircle, Coins, Folder, GraduationCap, HandHeart, Pencil, Plus, Save, Search, Shirt, Tag, Trash2, Trophy, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export default function ScholarshipsPage() {
 const [data, setData] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [form, setForm] = useState({ student_name: '', type: 'discount', percentage: '', amount: '', reason: '', start_date: '', end_date: '', status: 'active' });

 useEffect(() => { fetchData(); }, []);

 const fetchData = async () => {
 try {
 const res = await fetch('/api/scholarships', { headers: getHeaders() });
 const result = await res.json();
 setData(result || []);
 } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
 };

 const handleSubmit = async () => {
 if (!form.student_name) return alert('اسم الطالب مطلوب');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem ? { ...form, id: editItem.id } : form;
 const res = await fetch('/api/scholarships', { method, headers: getHeaders(), body: JSON.stringify(body) });
 if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ student_name: '', type: 'discount', percentage: '', amount: '', reason: '', start_date: '', end_date: '', status: 'active' }); }
 } catch (error) { console.error('Error:', error); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من الحذف؟')) return;
 try { await fetch(`/api/scholarships?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
 };

 const handleEdit = (item: any) => {
 setEditItem(item);
 setForm({ student_name: item.student_name || '', type: item.type || 'discount', percentage: item.percentage?.toString() || '', amount: item.amount?.toString() || '', reason: item.reason || '', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', status: item.status || 'active' });
 setShowModal(true);
 };

 const isExpired = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };

 const filtered = data.filter((item: any) => item.student_name?.toLowerCase().includes(search.toLowerCase()) || item.reason?.toLowerCase().includes(search.toLowerCase()));

 const totalAmount = data.filter((d: any) => d.status === 'active').reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);

 const stats = {
 total: data.length,
 active: data.filter((d: any) => d.status === 'active').length,
 expired: data.filter((d: any) => d.status === 'expired' || isExpired(d.end_date)).length,
 totalAmount: totalAmount,
 };

 const typeLabels: any = { full_scholarship: 'منحة كاملة', partial_scholarship: 'منحة جزئية', discount: 'خصم', sibling_discount: 'خصم أخوة', employee_discount: 'خصم موظفين', excellence: 'تميز أكاديمي', need_based: 'حاجة مادية', sports: 'منحة رياضية' };
 const typeColors: any = { full_scholarship: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, partial_scholarship: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' }, discount: { bg: 'rgba(201,162,39,0.1)', color: 'var(--gold)' }, sibling_discount: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }, employee_discount: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' }, excellence: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, need_based: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, sports: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6' } };
 const typeIcons: any = { full_scholarship: "ICON_GraduationCap", partial_scholarship: "ICON_BookMarked", discount: '<Tag size={16} />', sibling_discount: '<User size={16} /> User', employee_discount: "ICON_Shirt", excellence: '', need_based: "ICON_HandHeart", sports: "ICON_Trophy" };
 const statusLabels: any = { active: 'نشط', expired: 'منتهي', suspended: 'موقف', pending: 'قيد المراجعة' };
 const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, expired: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, suspended: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }, pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } };

 const formatMoney = (val: number) => val.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

 const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

 return (
 <div>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <div>
 <h1 className="page-title"><IconRenderer name="ICON_GraduationCap" size={18} /> المنح والخصومات</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة المنح الدراسية وخصومات الرسوم</p>
 </div>
 <button onClick={() => { setEditItem(null); setForm({ student_name: '', type: 'discount', percentage: '', amount: '', reason: '', start_date: '', end_date: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
 Plus إضافة منحة/خصم
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المنح', value: stats.total.toString(), icon: "ICON_GraduationCap", color: 'var(--gold)', suffix: '' },
 { label: 'نشطة', value: stats.active.toString(), icon: "ICON_CheckCircle", color: '#10B981', suffix: '' },
 { label: 'منتهية', value: stats.expired.toString(), icon: "ICON_Folder", color: '#6B7280', suffix: '' },
 { label: 'إجمالي المبالغ', value: formatMoney(stats.totalAmount), icon: "ICON_Coins", color: '#3B82F6', suffix: ' ر.س' },
 ].map((stat, i) => (
 <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
 <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
 <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}<span style={{ fontSize: 13, fontWeight: 400 }}>{stat.suffix}</span></div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
 </div>
 ))}
 </div>

 {/* Search */}
 <div style={{ marginBottom: 20 }}>
 <input placeholder="بحث بالاسم أو السبب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
 </div>

 {/* Table */}
 <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
 ) : filtered.length === 0 ? (
 <div style={{ padding: 60, textAlign: 'center' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(201,168,67,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><GraduationCap size={19} color="#D4A843" /></div>
 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد منح أو خصومات</p>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة منحة/خصم" لإنشاء منحة جديدة</p>
 </div>
 ) : (
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
 {['الطالب', 'النوع', 'النسبة', 'المبلغ', 'السبب', 'البداية', 'النهاية', 'الحالة', 'إجراءات'].map((h, i) => (
 <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => (
 <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isExpired(item.end_date) ? 'rgba(107,114,128,0.03)' : 'transparent' }}>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ width: 40, height: 40, borderRadius: 10, background: typeColors[item.type]?.bg || 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}><IconRenderer name={typeIcons[item.type] || "ICON_GraduationCap"} /></div>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.student_name}</div>
 </div>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: typeColors[item.type]?.bg || 'rgba(201,162,39,0.1)', color: typeColors[item.type]?.color || '#D4A843', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {typeLabels[item.type] || item.type}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 {parseFloat(item.percentage) > 0 ? (
 <span style={{ color: '#10B981', fontWeight: 700, fontSize: 15 }}>{item.percentage}%</span>
 ) : '—'}
 </td>
 <td style={{ padding: '14px 16px' }}>
 {parseFloat(item.amount) > 0 ? (
 <span>
 <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 15, direction: 'ltr' as any }}>{formatMoney(parseFloat(item.amount))}</span>
 <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}> ر.س</span>
 </span>
 ) : '—'}
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.reason ? item.reason.substring(0, 30) + (item.reason.length > 30 ? '...' : '') : '—'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.start_date ? new Date(item.start_date).toLocaleDateString('ar-SA') : '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ color: isExpired(item.end_date) ? '#EF4444' : 'rgba(255,255,255,0.6)', fontWeight: isExpired(item.end_date) ? 700 : 400, fontSize: 13 }}>
 {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-SA') : '—'}
 {isExpired(item.end_date) && ' Ban'}
 </span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: isExpired(item.end_date) ? 'rgba(107,114,128,0.1)' : statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: isExpired(item.end_date) ? '#6B7280' : statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
 {isExpired(item.end_date) ? 'منتهي' : statusLabels[item.status] || item.status}
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل منحة' : 'Plus إضافة منحة/خصم'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم الطالب *</label>
 <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
 <option value="full_scholarship">منحة كاملة GraduationCap</option>
 <option value="partial_scholarship">منحة جزئية BookMarked</option>
 <option value="discount">خصم <Tag size={16} /></option>
 <option value="sibling_discount">خصم أخوة <User size={16} /> User</option>
 <option value="employee_discount">خصم موظفين Shirt</option>
 <option value="excellence">تميز أكاديمي </option>
 <option value="need_based">حاجة مادية HandHeart</option>
 <option value="sports">منحة رياضية Trophy</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نسبة الخصم (%)</label>
 <input type="number" step="0.01" max="100" value={form.percentage} onChange={e => setForm({ ...form, percentage: e.target.value })} style={inputStyle} placeholder="مثال: 25" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>المبلغ (ر.س)</label>
 <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} style={inputStyle} placeholder="0.00" />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
 <option value="active">نشط</option>
 <option value="pending">قيد المراجعة</option>
 <option value="suspended">موقف</option>
 <option value="expired">منتهي</option>
 </select>
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ البداية</label>
 <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
 </div>
 <div>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ النهاية</label>
 <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>السبب / الملاحظات</label>
 <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="سبب المنحة أو الخصم..." />
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
