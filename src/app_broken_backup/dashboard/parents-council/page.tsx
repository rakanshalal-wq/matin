'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function ParentsCouncilPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/parents-council', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>مجلس أولياء الأمور</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة مجلس أولياء الأمور والاجتماعات</div></div>
      <div style={s.card}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد سجلات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['الاسم','الدور','الفصل','الهاتف','الحالة'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{data.map((m: any) => (<tr key={m.id}><td style={s.td}>{m.name || m.parent_name || '-'}</td><td style={s.td}>{m.role || 'عضو'}</td><td style={s.td}>{m.class_name || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.6)' }}>{m.phone || '-'}</td><td style={s.td}><span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>نشط</span></td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
