'use client';
import { BarChart3, CheckCircle, ClipboardList, Download, File, Users, X, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

 try {
 const token = localStorage.getItem('matin_token');
 if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
 } catch { return { 'Content-Type': 'application/json' }; }
};

const GOLD = '#C9A84C';
const BG = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
 present: { label: 'حاضر', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
 absent: { label: 'غائب', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
 late: { label: 'متأخر', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
 excused: { label: 'بعذر', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
};

export default function AttendancePage() {
 const [records, setRecords] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [filterClass, setFilterClass] = useState('');
 const [filterStatus, setFilterStatus] = useState('');
 const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState({
 student_name: '', class_name: '',
 date: new Date().toISOString().split('T')[0],
 status: 'present', notes: '', arrival_time: '', notified_parent: false,
 });

 useEffect(() => { fetchRecords(); }, [filterDate, filterClass]);

 const fetchRecords = async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams();
 if (filterDate) params.set('date', filterDate);
 if (filterClass) params.set('class', filterClass);
 const res = await fetch('/api/attendance?' + params.toString(), { headers: getHeaders() });
 const data = await res.json();
 setRecords(Array.isArray(data) ? data : []);
 } catch { setRecords([]); } finally { setLoading(false); }
 };

 const handleSave = async () => {
 if (!form.student_name || !form.class_name) return alert('ادخل اسم الطالب والفصل');
 setSaving(true);
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? '/api/attendance?id=' + editItem.id : '/api/attendance';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 if (res.ok) {
 setShowModal(false); setEditItem(null);
 setForm({ student_name: '', class_name: '', date: new Date().toISOString().split('T')[0], status: 'present', notes: '', arrival_time: '', notified_parent: false });
 fetchRecords();
 } else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
 } catch { } finally { setSaving(false); }
 };

 const handleDelete = async (id: number) => {
 if (!confirm('هل انت متاكد من الحذف؟')) return;
 try { await fetch('/api/attendance?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchRecords(); } catch { }
 };

 const openEdit = (item: any) => {
 setEditItem(item);
 setForm({ student_name: item.student_name || '', class_name: item.class_name || '', date: item.date || '', status: item.status || 'present', notes: item.notes || '', arrival_time: item.arrival_time || '', notified_parent: item.notified_parent || false });
 setShowModal(true);
 };

 const exportCSV = () => {
 const headers = ['الطالب', 'الفصل', 'التاريخ', 'الحالة', 'وقت الوصول', 'ملاحظات'];
 const rows = filtered.map((r: any) => [r.student_name, r.class_name, r.date, STATUS_MAP[r.status]?.label || r.status, r.arrival_time || '', r.notes || '']);
 const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
 const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a'); a.href = url; a.download = 'حضور_' + filterDate + '.csv'; a.click();
 };

 const filtered = records.filter((r: any) => {
 const matchSearch = !searchTerm || r.student_name?.includes(searchTerm) || r.class_name?.includes(searchTerm);
 const matchStatus = !filterStatus || r.status === filterStatus;
 return matchSearch && matchStatus;
 });

 const stats = {
 total: filtered.length,
 present: filtered.filter((r: any) => r.status === 'present').length,
 absent: filtered.filter((r: any) => r.status === 'absent').length,
 late: filtered.filter((r: any) => r.status === 'late').length,
 excused: filtered.filter((r: any) => r.status === 'excused').length,
 };
 const presentPct = stats.total ? Math.round((stats.present / stats.total) * 100) : 0;

 const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
 const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

 return (
 <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
 <div>
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_ClipboardList" size={18} /> الحضور والغياب</h1>
 <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تسجيل ومتابعة حضور الطلاب يومياً</p>
 </div>
 <div style={{ display: 'flex', gap: 12 }}>
 <button onClick={exportCSV} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: '10px 18px', color: 'white', cursor: 'pointer', fontSize: 14 }}><IconRenderer name="ICON_Download" size={18} /> تصدير Excel</button>
 <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ تسجيل حضور</button>
 </div>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
 {[
 { label: 'اجمالي الطلاب', value: stats.total, color: GOLD, icon: "ICON_Users" },
 { label: 'حاضرون', value: stats.present, color: '#10B981', icon: "ICON_CheckCircle" },
 { label: 'غائبون', value: stats.absent, color: '#EF4444', icon: "ICON_XCircle" },
 { label: 'متأخرون', value: stats.late, color: '#F59E0B', icon: '⏰' },
 { label: 'بعذر', value: stats.excused, color: '#3B82F6', icon: "ICON_File" },
 { label: 'نسبة الحضور', value: presentPct + '%', color: presentPct >= 80 ? '#10B981' : '#EF4444', icon: "ICON_BarChart3" },
 ].map((s, i) => (
 <div key={i} style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 14, padding: '18px 20px' }}>
 <div style={{ fontSize: 24, marginBottom: 8 }}><IconRenderer name={s.icon} /></div>
 <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
 <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</div>
 </div>
 ))}
 </div>

 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ ...inp, width: 180 }} />
 <input placeholder="بحث عن طالب او فصل..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 260 }} />
 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: 160 }}>
 <option value="">جميع الحالات</option>
 {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
 </select>
 <input placeholder="الفصل..." value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ ...inp, width: 160 }} />
 </div>

 <div style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 16, overflow: 'hidden' }}>
 {loading ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60 }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><ClipboardList size={19} color="#6B7280" /></div>
 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد سجلات حضور لهذا اليوم</p>
 <button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ تسجيل اول حضور</button>
 </div>
 ) : (
 <div style={{ overflowX: 'auto' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ borderBottom: '1px solid ' + BORDER }}>
 {['الطالب', 'الفصل', 'التاريخ', 'وقت الوصول', 'الحالة', 'اشعار ولي الامر', 'ملاحظات', 'اجراءات'].map(h => (
 <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {filtered.map((r: any, i: number) => {
 const st = STATUS_MAP[r.status] || { label: r.status, color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' };
 return (
 <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BORDER }}>
 <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.student_name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.class_name}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{r.date}</td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{r.arrival_time || '—'}</td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{st.label}</span>
 </td>
 <td style={{ padding: '14px 16px' }}>
 <span style={{ color: r.notified_parent ? '#10B981' : 'rgba(255,255,255,0.3)', fontSize: 13 }}>{r.notified_parent ? 'CheckCircle تم' : '—'}</span>
 </td>
 <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.notes || '—'}</td>
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
 <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل سجل الحضور' : 'تسجيل حضور جديد'}</h2>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 <div style={{ gridColumn: '1/-1' }}>
 <label style={lbl}>اسم الطالب *</label>
 <input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} placeholder="ادخل اسم الطالب" style={inp} />
 </div>
 <div>
 <label style={lbl}>الفصل *</label>
 <input value={form.class_name} onChange={e => setForm({ ...form, class_name: e.target.value })} placeholder="مثال: الاول أ" style={inp} />
 </div>
 <div>
 <label style={lbl}>التاريخ</label>
 <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} />
 </div>
 <div>
 <label style={lbl}>الحالة</label>
 <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
 {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
 </select>
 </div>
 <div>
 <label style={lbl}>وقت الوصول</label>
 <input type="time" value={form.arrival_time} onChange={e => setForm({ ...form, arrival_time: e.target.value })} style={inp} />
 </div>
 <div style={{ gridColumn: '1/-1' }}>
 <label style={lbl}>ملاحظات</label>
 <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="اي ملاحظات اضافية..." style={{ ...inp, height: 80, resize: 'vertical' as const }} />
 </div>
 <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 10 }}>
 <input type="checkbox" id="notified" checked={form.notified_parent} onChange={e => setForm({ ...form, notified_parent: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
 <label htmlFor="notified" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>تم اشعار ولي الامر</label>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>
 {saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'تسجيل الحضور'}
 </button>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
