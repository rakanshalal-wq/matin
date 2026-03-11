'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function StudentFeesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all'|'paid'|'pending'|'overdue'>('all');
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/finance?type=fees', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const filtered = data.filter(f => {
    if (tab !== 'all' && f.status !== tab) return false;
    if (search && !f.student_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const total = data.reduce((s: number, f: any) => s + Number(f.amount||0), 0);
  const paid = data.filter(f => f.status === 'paid').reduce((s: number, f: any) => s + Number(f.amount||0), 0);
  const pending = data.filter(f => f.status === 'pending').reduce((s: number, f: any) => s + Number(f.amount||0), 0);
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` }, tab: (a: boolean) => ({ background: a ? GOLD : CARD, color: a ? '#000' : 'rgba(255,255,255,0.6)', border: `1px solid ${a ? GOLD : BORDER}`, borderRadius: 10, padding: '8px 20px', cursor: 'pointer', fontWeight: a ? 700 : 400, fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }) };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>الرسوم الدراسية</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة رسوم الطلاب والمدفوعات</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[{ label: 'إجمالي الرسوم', v: `${total.toLocaleString()} ر.س`, c: GOLD }, { label: 'مدفوعة', v: `${paid.toLocaleString()} ر.س`, c: '#22c55e' }, { label: 'معلقة', v: `${pending.toLocaleString()} ر.س`, c: '#f59e0b' }, { label: 'عدد الطلاب', v: data.length, c: '#fff' }].map((st, i) => (<div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 24, fontWeight: 700, color: st.c }}>{st.v}</div></div>))}
      </div>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>{[['all','الكل'],['paid','مدفوعة'],['pending','معلقة'],['overdue','متأخرة']].map(([v,l]) => (<button key={v} style={s.tab(tab === v)} onClick={() => setTab(v as any)}>{l}</button>))}</div>
          <input style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', color: '#fff', fontSize: 14, outline: 'none', width: 220, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} placeholder="بحث باسم الطالب..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد سجلات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['الطالب','الفصل','نوع الرسوم','المبلغ','تاريخ الاستحقاق','الحالة'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((f: any) => (<tr key={f.id}><td style={s.td}>{f.student_name || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.6)' }}>{f.class_name || '-'}</td><td style={s.td}>{f.fee_type || f.description || '-'}</td><td style={{ ...s.td, color: GOLD, fontWeight: 700 }}>{Number(f.amount||0).toLocaleString()} ر.س</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{f.due_date ? new Date(f.due_date).toLocaleDateString('ar-SA') : '-'}</td><td style={s.td}><span style={{ background: f.status === 'paid' ? 'rgba(34,197,94,0.15)' : f.status === 'overdue' ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)', color: f.status === 'paid' ? '#22c55e' : f.status === 'overdue' ? '#ef4444' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{f.status === 'paid' ? 'مدفوعة' : f.status === 'overdue' ? 'متأخرة' : 'معلقة'}</span></td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
