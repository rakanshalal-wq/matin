'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Building2, Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';

const GOLD = '#C9A84C';
const BG = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

const TAX_TYPES = [
 { value: 'vat', label: 'ضريبة القيمة المضافة (VAT)' },
 { value: 'income', label: 'ضريبة الدخل' },
 { value: 'withholding', label: 'ضريبة الاستقطاع' },
 { value: 'zakat', label: 'الزكاة' },
 { value: 'municipal', label: 'رسوم بلدية' },
 { value: 'other', label: 'أخرى' },
];

export default function TaxesPage() {
 const [items, setItems] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [filterStatus, setFilterStatus] = useState('');
 const [filterType, setFilterType] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [pagination, setPagination] = useState<any>(null);
 const [page, setPage] = useState(1);
 const [formData, setFormData] = useState({ name: '', type: 'vat', rate: '', amount: '', description: '', school_id: '', status: 'active', due_date: '' });
 const [editData, setEditData] = useState<any>({});
 const [schools, setSchools] = useState<any[]>([]);
 const [stats, setStats] = useState({ total: 0, active: 0, totalAmount: 0, collected: 0 });

 useEffect(() => { fetchItems(); fetchSchools(); }, [page, filterStatus, filterType]);

 const fetchSchools = async () => {
 try { const r = await fetch('/api/schools', { headers: getHeaders() }); const d = await r.json(); setSchools(Array.isArray(d) ? d : d.data || []); } catch {}
 };

 const fetchItems = async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({ page: String(page), limit: '20' });
 if (filterStatus) params.set('status', filterStatus);
 if (filterType) params.set('type', filterType);
 const r = await fetch(`/api/taxes?${params}`, { headers: getHeaders() });
 const d = await r.json();
 const arr = d.data || [];
 setItems(arr);
 setPagination(d.pagination);
 setStats({
 total: d.pagination?.total || arr.length,
 active: arr.filter((i: any) => i.status === 'active').length,
 totalAmount: arr.reduce((s: number, i: any) => s + Number(i.amount || 0), 0),
 collected: arr.filter((i: any) => i.status === 'collected').reduce((s: number, i: any) => s + Number(i.amount || 0), 0),
 });
 } catch {} finally { setLoading(false); }
 };

 const filtered = items.filter(i =>
 !search || i.name?.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase())
 );

 const handleAdd = async () => {
 if (!formData.name) return alert('أدخل اسم الضريبة');
 if (!formData.type) return alert('اختر نوع الضريبة');
 setSaving(true);
 try {
 const r = await fetch('/api/taxes', { method: 'POST', headers: getHeaders(), body: JSON.stringify(formData) });
 if (r.ok) { setShowAddModal(false); setFormData({ name: '', type: 'vat', rate: '', amount: '', description: '', school_id: '', status: 'active', due_date: '' }); fetchItems(); }
 else { const e = await r.json(); alert(e.error || 'فشل'); }
 } catch { alert('خطأ في الاتصال'); } finally { setSaving(false); }
 };

 const handleEditOpen = (item: any) => {
 setEditData({ ...item, rate: item.rate || '', amount: item.amount || '', due_date: item.due_date ? item.due_date.split('T')[0] : '' });
 setShowEditModal(true);
 };

 const handleEditSave = async () => {
 if (!editData.name) return alert('أدخل اسم الضريبة');
 setSaving(true);
 try {
 const r = await fetch('/api/taxes', { method: 'PUT', headers: getHeaders(), body: JSON.stringify(editData) });
 if (r.ok) { setShowEditModal(false); fetchItems(); }
 else { const e = await r.json(); alert(e.error || 'فشل'); }
 } catch {} finally { setSaving(false); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل أنت متأكد من حذف هذه الضريبة؟')) return;
 try { await fetch(`/api/taxes?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch {}
 };

 const getStatusBadge = (s: string) => {
 const map: Record<string, { text: string; color: string; bg: string }> = {
 active: { text: 'نشطة', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
 collected: { text: 'محصّلة', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
 pending: { text: 'معلقة', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
 overdue: { text: 'متأخرة', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
 cancelled: { text: 'ملغاة', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
 };
 return map[s] || { text: s, color: '#6B7280', bg: 'rgba(107,114,128,0.12)' };
 };

 const getTypeLabel = (t: string) => TAX_TYPES.find(x => x.value === t)?.label || t;

 const inputStyle: any = { background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', width: '100%', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' };
 const labelStyle: any = { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block' };
 const modalOverlay: any = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' };
 const modalBox: any = { background: '#0D1117', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' };

 const FormFields = ({ data, setData }: { data: any; setData: any }) => (
 <div style={{ display: 'grid', gap: 16 }}>
 <div><label style={labelStyle}>اسم الضريبة *</label><input style={inputStyle} value={data.name || ''} onChange={e => setData({ ...data, name: e.target.value })} placeholder="مثال: ضريبة القيمة المضافة 15%" /></div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div>
 <label style={labelStyle}>نوع الضريبة *</label>
 <select style={inputStyle} value={data.type || 'vat'} onChange={e => setData({ ...data, type: e.target.value })}>
 {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
 </select>
 </div>
 <div>
 <label style={labelStyle}>الحالة</label>
 <select style={inputStyle} value={data.status || 'active'} onChange={e => setData({ ...data, status: e.target.value })}>
 <option value="active">نشطة</option>
 <option value="pending">معلقة</option>
 <option value="collected">محصّلة</option>
 <option value="overdue">متأخرة</option>
 <option value="cancelled">ملغاة</option>
 </select>
 </div>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div><label style={labelStyle}>النسبة (%)</label><input style={inputStyle} type="number" value={data.rate || ''} onChange={e => setData({ ...data, rate: e.target.value })} placeholder="15" /></div>
 <div><label style={labelStyle}>المبلغ (ر.س)</label><input style={inputStyle} type="number" value={data.amount || ''} onChange={e => setData({ ...data, amount: e.target.value })} placeholder="0.00" /></div>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div>
 <label style={labelStyle}>المؤسسة (اختياري)</label>
 <select style={inputStyle} value={data.school_id || ''} onChange={e => setData({ ...data, school_id: e.target.value })}>
 <option value="">كل المؤسسات</option>
 {schools.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
 </select>
 </div>
 <div><label style={labelStyle}>تاريخ الاستحقاق</label><input style={inputStyle} type="date" value={data.due_date || ''} onChange={e => setData({ ...data, due_date: e.target.value })} /></div>
 </div>
 <div><label style={labelStyle}>الوصف</label><textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={data.description || ''} onChange={e => setData({ ...data, description: e.target.value })} placeholder="تفاصيل إضافية..." /></div>
 </div>
 );

 return (
 <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }}>
 {/* Header */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
 <div>
 <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>الضرائب السيادية</div>
 <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>إدارة الضرائب والرسوم الحكومية للمؤسسات</div>
 </div>
 <button onClick={() => setShowAddModal(true)} style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
 + إضافة ضريبة
 </button>
 </div>

 {/* Stats */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
 {[
 { label: 'إجمالي الضرائب', value: stats.total, color: GOLD },
 { label: 'ضرائب نشطة', value: stats.active, color: '#10B981' },
 { label: 'إجمالي المبالغ', value: `${stats.totalAmount.toLocaleString()} ر.س`, color: '#3B82F6' },
 { label: 'المحصّل', value: `${stats.collected.toLocaleString()} ر.س`, color: '#8B5CF6' },
 ].map((s, i) => (
 <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{s.label}</div>
 <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
 </div>
 ))}
 </div>

 {/* Filters */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
 <input style={{ ...inputStyle, maxWidth: 280 }} placeholder="بحث بالاسم أو الوصف..." value={search} onChange={e => setSearch(e.target.value)} />
 <select style={{ ...inputStyle, maxWidth: 200 }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
 <option value="">كل الأنواع</option>
 {TAX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
 </select>
 <select style={{ ...inputStyle, maxWidth: 160 }} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
 <option value="">كل الحالات</option>
 <option value="active">نشطة</option>
 <option value="pending">معلقة</option>
 <option value="collected">محصّلة</option>
 <option value="overdue">متأخرة</option>
 </select>
 </div>

 {/* Table */}
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60 }}>
 <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Building2 size={28} color="#C9A227" /></div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>لا توجد ضرائب مسجّلة</div>
 <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>إضافة أول ضريبة</button>
 </div>
 ) : (
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr>
 {['اسم الضريبة', 'النوع', 'النسبة', 'المبلغ', 'المؤسسة', 'تاريخ الاستحقاق', 'الحالة', 'إجراءات'].map(h => (
 <th key={h} style={{ padding: '14px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((item: any) => {
 const badge = getStatusBadge(item.status);
 return (
 <tr key={item.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
 <td style={{ padding: '14px 16px', fontWeight: 600 }}>{item.name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{getTypeLabel(item.type)}</td>
 <td style={{ padding: '14px 16px', color: GOLD, fontWeight: 700 }}>{item.rate ? `${item.rate}%` : '-'}</td>
 <td style={{ padding: '14px 16px', color: '#3B82F6', fontWeight: 700 }}>{item.amount ? `${Number(item.amount).toLocaleString()} ر.س` : '-'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.school_name || 'كل المؤسسات'}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{item.due_date ? new Date(item.due_date).toLocaleDateString('ar-SA') : '-'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: badge.bg, color: badge.color, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>{badge.text}</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => handleEditOpen(item)} style={{ background: 'rgba(201,168,76,0.1)', color: GOLD, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>تعديل</button>
 <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>حذف</button>
 </div>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* Pagination */}
 {pagination && pagination.totalPages > 1 && (
 <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
 <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)} style={{ background: CARD, border: `1px solid ${BORDER}`, color: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', opacity: pagination.hasPrev ? 1 : 0.4 }}>السابق</button>
 <span style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>صفحة {pagination.page} من {pagination.totalPages}</span>
 <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)} style={{ background: CARD, border: `1px solid ${BORDER}`, color: '#fff', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', opacity: pagination.hasNext ? 1 : 0.4 }}>التالي</button>
 </div>
 )}

 {/* Add Modal */}
 {showAddModal && (
 <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
 <div style={modalBox}>
 <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>إضافة ضريبة جديدة</div>
 <FormFields data={formData} setData={setFormData} />
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleAdd} disabled={saving} style={{ flex: 1, background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
 <button onClick={() => setShowAddModal(false)} style={{ flex: 1, background: CARD, color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px', fontSize: 15, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}

 {/* Edit Modal */}
 {showEditModal && (
 <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setShowEditModal(false); }}>
 <div style={modalBox}>
 <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>تعديل الضريبة</div>
 <FormFields data={editData} setData={setEditData} />
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleEditSave} disabled={saving} style={{ flex: 1, background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
 <button onClick={() => setShowEditModal(false)} style={{ flex: 1, background: CARD, color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px', fontSize: 15, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
