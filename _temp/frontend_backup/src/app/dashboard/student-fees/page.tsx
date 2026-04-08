'use client';
export const dynamic = "force-dynamic";
import { AlertTriangle, Banknote, CheckCircle, Coins, Download, Triangle, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


const GOLD = '#C9A84C';
const BG = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
 paid: { label: 'مدفوع', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
 pending: { label: 'معلق', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
 overdue: { label: 'متاخر', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
 partial: { label: 'جزئي', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
 waived: { label: 'معفى', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
};

export default function StudentFeesPage() {
 const [fees, setFees] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [filterStatus, setFilterStatus] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState({
 student_name: '', class_name: '', fee_type: 'رسوم دراسية',
 amount: '', paid_amount: '0', due_date: '',
 payment_method: 'تحويل بنكي', status: 'pending', notes: '',
 });

 useEffect(() => { fetchFees(); }, []);

 const fetchFees = async () => {
 setLoading(true);
 try {
 const res = await fetch('/api/student-fees', { headers: getHeaders() });
 const data = await res.json();
 setFees(Array.isArray(data) ? data : []);
 } catch { setFees([]); } finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!form.student_name || !form.amount) return alert('ادخل البيانات المطلوبة');
 setSaving(true);
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? '/api/student-fees?id=' + editItem.id : '/api/student-fees';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 if (res.ok) {
 setShowModal(false); setEditItem(null);
 setForm({ student_name: '', class_name: '', fee_type: 'رسوم دراسية', amount: '', paid_amount: '0', due_date: '', payment_method: 'تحويل بنكي', status: 'pending', notes: '' });
 fetchFees();
 } else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
 } catch { } finally { setSaving(false); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل انت متاكد من الحذف؟')) return;
 try { await fetch('/api/student-fees?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchFees(); } catch { }
 };

 const openEdit = (item: any) => {
 setEditItem(item);
 setForm({ student_name: item.student_name || '', class_name: item.class_name || '', fee_type: item.fee_type || 'رسوم دراسية', amount: String(item.amount || ''), paid_amount: String(item.paid_amount || '0'), due_date: item.due_date || '', payment_method: item.payment_method || 'تحويل بنكي', status: item.status || 'pending', notes: item.notes || '' });
 setShowModal(true);
 };

 const exportCSV = () => {
 const headers = ['الطالب', 'الفصل', 'نوع الرسوم', 'المبلغ الكلي', 'المدفوع', 'المتبقي', 'تاريخ الاستحقاق', 'الحالة'];
 const rows = filtered.map((r: any) => [r.student_name, r.class_name, r.fee_type, r.amount, r.paid_amount || 0, (r.amount - (r.paid_amount || 0)), r.due_date || '', STATUS_MAP[r.status]?.label || r.status]);
 const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
 const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a'); a.href = url; a.download = 'الرسوم_الدراسية.csv'; a.click();
 };

 const filtered = fees.filter((r: any) => {
 const matchSearch = !searchTerm || r.student_name?.includes(searchTerm) || r.class_name?.includes(searchTerm);
 const matchStatus = !filterStatus || r.status === filterStatus;
 return matchSearch && matchStatus;
 });

 const totalAmount = filtered.reduce((s: number, r: any) => s + Number(r.amount || 0), 0);
 const totalPaid = filtered.reduce((s: number, r: any) => s + Number(r.paid_amount || 0), 0);
 const totalPending = totalAmount - totalPaid;
 const overdueCount = filtered.filter((r: any) => r.status === 'overdue').length;

 const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
 const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

 return (
 <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Coins" size={18} /> الرسوم الدراسية</h1>
 <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>متابعة رسوم الطلاب والمدفوعات</p>
 </div>
 <div style={{ display: 'flex', gap: 12 }}>
 <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: '10px 18px', color: 'white', cursor: 'pointer', fontSize: 14 }}><IconRenderer name="ICON_Download" size={18} /> تصدير</button>
 <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة رسوم</button>
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
 {[
 { label: 'اجمالي الرسوم', value: totalAmount.toLocaleString() + ' ر.س', color: GOLD, icon: "ICON_Banknote" },
 { label: 'المحصّل', value: totalPaid.toLocaleString() + ' ر.س', color: '#10B981', icon: "ICON_CheckCircle" },
 { label: 'المتبقي', value: totalPending.toLocaleString() + ' ر.س', color: '#EF4444', icon: '⏳' },
 { label: 'متاخرو الدفع', value: overdueCount, color: '#F59E0B', icon: 'Alert<Triangle size={16} />' },
 ].map((s, i) => (
 <div key={i} style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: '18px 20px' }}>
 <div style={{ fontSize: 24, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>

 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input placeholder="بحث عن طالب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 260 }} />
 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: 180 }}>
 <option value="">جميع الحالات</option>
 {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
 </select>
 </div>

 <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 16, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60 }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(201,168,67,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Coins size={19} color="#C9A84C" /></div>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد رسوم مسجلة</p>
 <button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة رسوم</button>
 </div>
 ) : (
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid ' + BORDER }}>
 {['الطالب', 'الفصل', 'نوع الرسوم', 'المبلغ', 'المدفوع', 'المتبقي', 'الاستحقاق', 'الحالة', 'اجراءات'].map(h => (
 <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((r: any, i: number) => {
 const st = STATUS_MAP[r.status] || { label: r.status, color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' };
 const remaining = Number(r.amount || 0) - Number(r.paid_amount || 0);
 return (
 <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BORDER }}>
 <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.student_name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.class_name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.fee_type}</td>
 <td style={{ padding: '14px 16px', color: GOLD, fontWeight: 700 }}>{Number(r.amount).toLocaleString()} ر.س</td>
 <td style={{ padding: '14px 16px', color: '#10B981' }}>{Number(r.paid_amount || 0).toLocaleString()} ر.س</td>
 <td style={{ padding: '14px 16px', color: remaining > 0 ? '#EF4444' : '#10B981' }}>{remaining.toLocaleString()} ر.س</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.due_date || '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{st.label}</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button>
 <button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button>
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

 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div style={{ background: '#12121F', border: '1px solid ' + BORDER, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الرسوم' : 'اضافة رسوم جديدة'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1/-1' }}>
 <label style={lbl}>اسم الطالب *</label>
 <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} placeholder="ادخل اسم الطالب" style={inp} />
 </div>
 <div>
 <label style={lbl}>الفصل</label>
 <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} placeholder="مثال: الاول أ" style={inp} />
 </div>
 <div>
 <label style={lbl}>نوع الرسوم</label>
 <select value={form.fee_type} onChange={e => setForm({ ...form, fee_type: e.target.value })} style={inp}>
 <option>رسوم دراسية</option>
 <option>رسوم نقل</option>
 <option>رسوم انشطة</option>
 <option>رسوم كتب</option>
 <option>رسوم اخرى</option>
 </select>
 </div>
 <div>
 <label style={lbl}>المبلغ الكلي (ر.س) *</label>
 <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" style={inp} />
 </div>
 <div>
 <label style={lbl}>المبلغ المدفوع (ر.س)</label>
 <input type="number" value={form.paid_amount} onChange={e => setForm({ ...form, paid_amount: e.target.value })} placeholder="0" style={inp} />
 </div>
 <div>
 <label style={lbl}>تاريخ الاستحقاق</label>
 <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inp} />
 </div>
 <div>
 <label style={lbl}>طريقة الدفع</label>
 <select value={form.payment_method} onChange={e => setForm({ ...form, payment_method: e.target.value })} style={inp}>
 <option>تحويل بنكي</option>
 <option>نقدي</option>
 <option>بطاقة ائتمان</option>
 <option>مدى</option>
 <option>Apple Pay</option>
 </select>
 </div>
 <div>
 <label style={lbl}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
 {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
 </select>
 </div>
 <div style={{ gridColumn: '1/-1' }}>
 <label style={lbl}>ملاحظات</label>
 <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="اي ملاحظات..." style={{ ...inp, height: 70, resize: 'vertical' as const }} />
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>
 {saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة الرسوم'}
 </button>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
