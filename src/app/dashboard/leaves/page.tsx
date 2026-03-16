'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const STATUS_MAP: Record<string, { l: string; c: string }> = { pending: { l: 'قيد المراجعة', c: '#F59E0B' }, approved: { l: 'موافق عليه', c: '#10B981' }, rejected: { l: 'مرفوض', c: '#EF4444' } };
const TYPE_MAP: Record<string, string> = { annual: 'سنوية', sick: 'مرضية', emergency: 'طارئة', maternity: 'أمومة', unpaid: 'بدون راتب', other: 'أخرى' };
export default function LeavesPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ employee_name: '', employee_role: 'teacher', leave_type: 'annual', start_date: '', end_date: '', reason: '', status: 'pending', notes: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/leaves', { headers: getH() }); const d = await r.json(); setLeaves(Array.isArray(d) ? d : (d.leaves || [])); } catch { setLeaves([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.employee_name || !form.start_date) return alert('أدخل اسم الموظف وتاريخ البداية'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/leaves?id=' + editItem.id : '/api/leaves'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ employee_name: '', employee_role: 'teacher', leave_type: 'annual', start_date: '', end_date: '', reason: '', status: 'pending', notes: '' }); fetchData(); } } catch { } finally { setSaving(false); } };
  const handleStatusChange = async (id: number, status: string) => { try { await fetch('/api/leaves?id=' + id, { method: 'PUT', headers: getH(), body: JSON.stringify({ status }) }); fetchData(); } catch { } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/leaves?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ employee_name: item.employee_name || '', employee_role: item.employee_role || 'teacher', leave_type: item.leave_type || 'annual', start_date: item.start_date || '', end_date: item.end_date || '', reason: item.reason || '', status: item.status || 'pending', notes: item.notes || '' }); setShowModal(true); };
  const filtered = leaves.filter((l: any) => !filterStatus || l.status === filterStatus);
  const getDays = (start: string, end: string) => { if (!start || !end) return 0; return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1; };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🏖️ طلبات الإجازات</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة إجازات الموظفين والمعلمين</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ طلب إجازة</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'الإجمالي', v: leaves.length, c: GOLD }, { l: 'قيد المراجعة', v: leaves.filter((l: any) => l.status === 'pending').length, c: '#F59E0B' }, { l: 'موافق عليها', v: leaves.filter((l: any) => l.status === 'approved').length, c: '#10B981' }, { l: 'مرفوضة', v: leaves.filter((l: any) => l.status === 'rejected').length, c: '#EF4444' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ v: '', l: 'الكل' }, ...Object.entries(STATUS_MAP).map(([k, v]) => ({ v: k, l: v.l }))].map(s => <button key={s.v} onClick={() => setFilterStatus(s.v)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid', borderColor: filterStatus === s.v ? GOLD : BR, background: filterStatus === s.v ? `${GOLD}22` : CB, color: filterStatus === s.v ? GOLD : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 }}>{s.l}</button>)}
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['الموظف', 'الدور', 'نوع الإجازة', 'من', 'إلى', 'الأيام', 'الحالة', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</td></tr> :
                filtered.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>لا توجد طلبات إجازة</td></tr> :
                filtered.map((l: any, i: number) => { const st = STATUS_MAP[l.status] || STATUS_MAP.pending; return (
                  <tr key={l.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                    <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{l.employee_name}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{l.employee_role === 'teacher' ? 'معلم' : l.employee_role === 'admin' ? 'إداري' : l.employee_role}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{TYPE_MAP[l.leave_type] || l.leave_type}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{l.start_date ? new Date(l.start_date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{l.end_date ? new Date(l.end_date).toLocaleDateString('ar-SA') : '—'}</td>
                    <td style={{ padding: '14px 16px', color: GOLD, fontWeight: 700 }}>{getDays(l.start_date, l.end_date)} يوم</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ background: `${st.c}22`, color: st.c, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{st.l}</span></td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {l.status === 'pending' && <><button onClick={() => handleStatusChange(l.id, 'approved')} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', color: '#10B981', cursor: 'pointer', fontSize: 12 }}>موافقة</button><button onClick={() => handleStatusChange(l.id, 'rejected')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>رفض</button></>}
                        <button onClick={() => openEdit(l)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 6, padding: '4px 10px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button>
                        <button onClick={() => handleDelete(l.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '4px 10px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button>
                      </div>
                    </td>
                  </tr>
                );})}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الطلب' : 'طلب إجازة جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={lbl}>اسم الموظف *</label><input value={form.employee_name} onChange={e => setForm({ ...form, employee_name: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الدور</label><select value={form.employee_role} onChange={e => setForm({ ...form, employee_role: e.target.value })} style={inp}><option value="teacher">معلم</option><option value="admin">إداري</option><option value="staff">موظف</option></select></div>
            <div><label style={lbl}>نوع الإجازة</label><select value={form.leave_type} onChange={e => setForm({ ...form, leave_type: e.target.value })} style={inp}>{Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label style={lbl}>الحالة</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>{Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select></div>
            <div><label style={lbl}>من تاريخ *</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>إلى تاريخ</label><input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>السبب</label><textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ' : 'تقديم الطلب'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
