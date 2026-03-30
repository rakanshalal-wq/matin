'use client';
export const dynamic = 'force-dynamic';
import { Calendar, Check, CheckCircle, User, X } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD='var(--gold)', BG = 'var(--bg)', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const PRIORITY_MAP: Record<string, { l: string; c: string }> = { low: { l: 'منخفضة', c: '#10B981' }, medium: { l: 'متوسطة', c: '#F59E0B' }, high: { l: 'عالية', c: '#EF4444' }, urgent: { l: 'عاجلة', c: '#8B5CF6' } };
const STATUS_MAP: Record<string, { l: string; c: string }> = { todo: { l: 'للتنفيذ', c: '#9CA3AF' }, in_progress: { l: 'قيد التنفيذ', c: '#3B82F6' }, done: { l: 'مكتملة', c: '#10B981' }, cancelled: { l: 'ملغاة', c: '#EF4444' } };
export default function TasksPage() {
 const [tasks, setTasks] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [filterStatus, setFilterStatus] = useState('');
 const [filterPriority, setFilterPriority] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [editItem, setEditItem] = useState<any>(null);
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', assigned_to: '', due_date: '', category: '' });
 useEffect(() => { fetchData(); }, []);
 const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/tasks', { headers: getH() }); const d = await r.json(); setTasks(Array.isArray(d) ? d : (d.tasks || [])); } catch { setTasks([]); } finally { setLoading(false); } };
 const handleSave = async () => { if (!form.title) return alert('أدخل عنوان المهمة'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/tasks?id=' + editItem.id : '/api/tasks'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ title: '', description: '', priority: 'medium', status: 'todo', assigned_to: '', due_date: '', category: '' }); fetchData(); } } catch { } finally { setSaving(false); } };
 const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/tasks?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
 const toggleStatus = async (task: any) => { const next = task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'; try { await fetch('/api/tasks?id=' + task.id, { method: 'PUT', headers: getH(), body: JSON.stringify({ ...task, status: next }) }); fetchData(); } catch { } };
 const openEdit = (item: any) => { setEditItem(item); setForm({ title: item.title || '', description: item.description || '', priority: item.priority || 'medium', status: item.status || 'todo', assigned_to: item.assigned_to || '', due_date: item.due_date || '', category: item.category || '' }); setShowModal(true); };
 const filtered = tasks.filter((t: any) => (!filterStatus || t.status === filterStatus) && (!filterPriority || t.priority === filterPriority));
 const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
 const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
 return (
 <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'var(--font)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
 <div><h1 className="page-title"><IconRenderer name="ICON_CheckCircle" size={18} /> إدارة المهام</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تتبع وإدارة مهام الفريق</p></div>
 <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: 'var(--bg)', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ مهمة جديدة</button>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
 {Object.entries(STATUS_MAP).map(([k, v]) => <div key={k} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 26, fontWeight: 800, color: v.c }}>{tasks.filter((t: any) => t.status === k).length}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{v.l}</div></div>)}
 </div>
 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, width: 150 }}><option value="">جميع الحالات</option>{Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select>
 <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ ...inp, width: 150 }}><option value="">جميع الأولويات</option>{Object.entries(PRIORITY_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select>
 </div>
 <div style={{ display: 'grid', gap: 12 }}>
 {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
 filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{width:44,height:44,borderRadius:10,background:"rgba(16,185,129,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={19} color="#10B981" /></div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد مهام</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: 'var(--bg)', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة مهمة</button></div> :
 filtered.map((t: any, i: number) => { const p = PRIORITY_MAP[t.priority] || PRIORITY_MAP.medium; const s = STATUS_MAP[t.status] || STATUS_MAP.todo; const overdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'; return (
 <div key={t.id || i} style={{ background: CB, border: `1px solid ${overdue ? 'rgba(239,68,68,0.3)' : BR}`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
 <button onClick={() => toggleStatus(t)} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid', borderColor: t.status === 'done' ? '#10B981' : BR, background: t.status === 'done' ? '#10B981' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, flexShrink: 0 }}>{t.status === 'done' ? "ICON_Check" : ''}</button>
 <div style={{ flex: 1 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
 <span style={{ fontSize: 15, fontWeight: 600, color: t.status === 'done' ? 'rgba(255,255,255,0.4)' : 'white', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</span>
 <span style={{ background: `${p.c}22`, color: p.c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.l}</span>
 <span style={{ background: `${s.c}22`, color: s.c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s.l}</span>
 {overdue && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>متأخرة</span>}
 </div>
 {t.description && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{t.description}</div>}
 <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
 {t.assigned_to && <span><IconRenderer name="ICON_User" size={18} /> {t.assigned_to}</span>}
 {t.due_date && <span style={{ color: overdue ? '#EF4444' : 'rgba(255,255,255,0.4)' }}><IconRenderer name="ICON_Calendar" size={18} /> {new Date(t.due_date).toLocaleDateString('ar-SA')}</span>}
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8 }}>
 <button onClick={() => openEdit(t)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button>
 <button onClick={() => handleDelete(t.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button>
 </div>
 </div>
 ); })}
 </div>
 {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
 <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل المهمة' : 'مهمة جديدة'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button></div>
 <div style={{ display: 'grid', gap: 16 }}>
 <div><label style={lbl}>العنوان *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></div>
 <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div><label style={lbl}>الأولوية</label><select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={inp}>{Object.entries(PRIORITY_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select></div>
 <div><label style={lbl}>الحالة</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>{Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select></div>
 <div><label style={lbl}>المسؤول</label><input value={form.assigned_to} onChange={e => setForm({ ...form, assigned_to: e.target.value })} style={inp} /></div>
 <div><label style={lbl}>تاريخ الاستحقاق</label><input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inp} /></div>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: 'var(--bg)', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ' : 'إضافة'}</button>
 <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
 </div>
 </div>
 </div>}
 </div>
 );
}
