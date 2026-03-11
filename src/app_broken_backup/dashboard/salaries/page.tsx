'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function SalariesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, totalAmount: 0 });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/payroll', { credentials: 'include' });
      const arr = await r.json();
      const rows = Array.isArray(arr) ? arr : [];
      setData(rows);
      setStats({ total: rows.length, paid: rows.filter((x:any) => x.status === 'paid').length, pending: rows.filter((x:any) => x.status === 'pending').length, totalAmount: rows.reduce((s:number,x:any) => s + Number(x.net_salary||x.base_salary||0), 0) });
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }, statCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>الرواتب</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة رواتب الموظفين والمعلمين</div></div>
      <div style={s.statsGrid}>{[{ label: 'إجمالي السجلات', v: stats.total }, { label: 'مدفوعة', v: stats.paid }, { label: 'معلقة', v: stats.pending }, { label: 'إجمالي الرواتب', v: `${stats.totalAmount.toLocaleString()} ر.س` }].map((st, i) => (<div key={i} style={s.statCard}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}</div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px' }}>كشف الرواتب</h3>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد سجلات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['الموظف','الراتب الأساسي','البدلات','الخصومات','الصافي','الشهر','الحالة'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{data.map((p: any) => (<tr key={p.id}><td style={s.td}>{p.employee_name || p.user_name || p.employee_id || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.7)' }}>{Number(p.base_salary||0).toLocaleString()} ر.س</td><td style={{ ...s.td, color: '#22c55e' }}>+{Number(p.allowances||0).toLocaleString()}</td><td style={{ ...s.td, color: '#ef4444' }}>-{Number(p.deductions||0).toLocaleString()}</td><td style={{ ...s.td, color: GOLD, fontWeight: 700 }}>{Number(p.net_salary||p.base_salary||0).toLocaleString()} ر.س</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{p.month || p.pay_period || '-'}</td><td style={s.td}><span style={{ background: p.status === 'paid' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: p.status === 'paid' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{p.status === 'paid' ? 'مدفوع' : 'معلق'}</span></td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
