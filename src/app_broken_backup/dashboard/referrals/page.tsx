'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function ReferralsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, earned: 0, pending: 0 });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/referrals', { credentials: 'include' });
      const rows = await r.json();
      const arr = Array.isArray(rows) ? rows : [];
      setData(arr);
      setStats({ total: arr.length, active: arr.filter((x:any) => x.status === 'active').length, earned: arr.reduce((s:number,x:any) => s + Number(x.commission_earned||0), 0), pending: arr.filter((x:any) => x.status === 'pending').length });
    } catch {}
    setLoading(false);
  };
  const s: any = {
    page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 },
    statCard: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' },
    card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` },
    td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` },
  };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 28, fontWeight: 700 }}>برنامج الإحالات</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة الإحالات والعمولات</div>
      </div>
      <div style={s.statsGrid}>
        {[{ label: 'إجمالي الإحالات', v: stats.total }, { label: 'إحالات نشطة', v: stats.active }, { label: 'عمولات مكتسبة', v: `${stats.earned.toLocaleString()} ر.س` }, { label: 'معلقة', v: stats.pending }].map((st, i) => (
          <div key={i} style={s.statCard}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>
        ))}
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px' }}>قائمة الإحالات</h3>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد إحالات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}>
            <thead><tr>{['المُحيل','المُحال إليه','الكود','العمولة','الحالة','التاريخ'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{data.map((r: any) => (
              <tr key={r.id}>
                <td style={s.td}>{r.referrer_name || r.referrer_id || '-'}</td>
                <td style={s.td}>{r.referred_name || r.referred_id || '-'}</td>
                <td style={s.td}><span style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{r.code || '-'}</span></td>
                <td style={{ ...s.td, color: '#22c55e', fontWeight: 700 }}>{Number(r.commission_earned||0).toLocaleString()} ر.س</td>
                <td style={s.td}><span style={{ background: r.status === 'active' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: r.status === 'active' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{r.status === 'active' ? 'نشط' : 'معلق'}</span></td>
                <td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('ar-SA') : '-'}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}
