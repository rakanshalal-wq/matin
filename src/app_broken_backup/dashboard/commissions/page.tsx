'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function CommissionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, totalAmount: 0 });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/commissions', { credentials: 'include' });
      const arr = await r.json();
      const rows = Array.isArray(arr) ? arr : [];
      setData(rows);
      setStats({ total: rows.length, paid: rows.filter((x:any) => x.status === 'paid').length, pending: rows.filter((x:any) => x.status === 'pending').length, totalAmount: rows.reduce((s:number,x:any) => s + Number(x.amount||0), 0) });
    } catch {}
    setLoading(false);
  };
  const pay = async (id: string) => {
    try { await fetch(`/api/commissions?id=${id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'paid' }) }); fetchData(); } catch {}
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }, statCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>العمولات</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة عمولات المبيعات والإحالات</div></div>
      <div style={s.statsGrid}>{[{ label: 'إجمالي العمولات', v: stats.total }, { label: 'مدفوعة', v: stats.paid }, { label: 'معلقة', v: stats.pending }, { label: 'إجمالي المبالغ', v: `${stats.totalAmount.toLocaleString()} ر.س` }].map((st, i) => (<div key={i} style={s.statCard}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}</div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px' }}>قائمة العمولات</h3>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد عمولات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['المستفيد','المبلغ','النوع','الحالة','التاريخ','إجراء'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{data.map((c: any) => (<tr key={c.id}><td style={s.td}>{c.user_name || c.user_id || '-'}</td><td style={{ ...s.td, color: GOLD, fontWeight: 700 }}>{Number(c.amount||0).toLocaleString()} ر.س</td><td style={s.td}>{c.type || '-'}</td><td style={s.td}><span style={{ background: c.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: c.status === 'paid' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{c.status === 'paid' ? 'مدفوعة' : 'معلقة'}</span></td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '-'}</td><td style={s.td}>{c.status !== 'paid' && <button onClick={() => pay(c.id)} style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>دفع</button>}</td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
