'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function ActivitiesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/activity-log', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const actionColor = (action: string) => {
    if (action?.includes('create') || action?.includes('add')) return { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' };
    if (action?.includes('delete') || action?.includes('remove')) return { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
    if (action?.includes('update') || action?.includes('edit')) return { bg: 'rgba(201,168,76,0.15)', color: GOLD };
    return { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' };
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>سجل الأنشطة</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>جميع الأنشطة والعمليات في المنصة</div></div>
      <div style={s.card}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد أنشطة</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['المستخدم','الإجراء','التفاصيل','IP','التاريخ'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{data.map((a: any, i: number) => { const ac = actionColor(a.action); return (<tr key={a.id || i}><td style={s.td}>{a.user_name || a.user_id || '-'}</td><td style={s.td}><span style={{ background: ac.bg, color: ac.color, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{a.action || '-'}</span></td><td style={{ ...s.td, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{a.details || a.description || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{a.ip_address || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{a.created_at ? new Date(a.created_at).toLocaleString('ar-SA') : '-'}</td></tr>); })}</tbody></table>
        )}
      </div>
    </div>
  );
}
