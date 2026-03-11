'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function VisitorsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', national_id: '', purpose: '', host_name: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/visitors', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const add = async () => {
    if (!form.name) return;
    try { await fetch('/api/visitors', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); setShowAdd(false); setForm({ name: '', phone: '', national_id: '', purpose: '', host_name: '' }); fetchData(); } catch {}
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` }, modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }, modalBox: { background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, width: 480 }, input: { width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 12 } };
  const today = data.filter((v: any) => v.visit_date && new Date(v.visit_date).toDateString() === new Date().toDateString()).length;
  return (
    <div style={s.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div><div style={{ fontSize: 28, fontWeight: 700 }}>سجل الزوار</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>تسجيل ومتابعة زوار المؤسسة</div></div>
        <button style={s.btn} onClick={() => setShowAdd(true)}>+ تسجيل زائر</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[{ label: 'إجمالي الزوار', v: data.length }, { label: 'زوار اليوم', v: today }, { label: 'في المبنى الآن', v: data.filter((v: any) => v.status === 'inside').length }].map((st, i) => (<div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}
      </div>
      <div style={s.card}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا يوجد زوار مسجلون</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['الاسم','الهاتف','الهوية','الغرض','المضيف','وقت الدخول','الحالة'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{data.map((v: any) => (<tr key={v.id}><td style={s.td}>{v.name || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.6)' }}>{v.phone || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{v.national_id || '-'}</td><td style={s.td}>{v.purpose || '-'}</td><td style={s.td}>{v.host_name || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{v.check_in || v.created_at ? new Date(v.check_in || v.created_at).toLocaleString('ar-SA') : '-'}</td><td style={s.td}><span style={{ background: v.status === 'inside' ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)', color: v.status === 'inside' ? '#22c55e' : 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{v.status === 'inside' ? 'داخل' : 'غادر'}</span></td></tr>))}</tbody></table>
        )}
      </div>
      {showAdd && (<div style={s.modal} onClick={e => e.target === e.currentTarget && setShowAdd(false)}><div style={s.modalBox}><h3 style={{ marginBottom: 20, color: '#fff' }}>تسجيل زائر جديد</h3><input style={s.input} placeholder="الاسم الكامل *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><input style={s.input} placeholder="رقم الهاتف" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /><input style={s.input} placeholder="رقم الهوية" value={form.national_id} onChange={e => setForm({...form, national_id: e.target.value})} /><input style={s.input} placeholder="الغرض من الزيارة" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} /><input style={s.input} placeholder="اسم المضيف" value={form.host_name} onChange={e => setForm({...form, host_name: e.target.value})} /><div style={{ display: 'flex', gap: 12, marginTop: 8 }}><button style={{ ...s.btn, flex: 1 }} onClick={add}>تسجيل</button><button style={{ ...s.btn, background: CARD, color: '#fff', border: `1px solid ${BORDER}`, flex: 1 }} onClick={() => setShowAdd(false)}>إلغاء</button></div></div></div>)}
    </div>
  );
}
