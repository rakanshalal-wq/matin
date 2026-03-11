'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function ComplaintsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all'|'open'|'resolved'>('all');
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/complaints', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const resolve = async (id: string) => {
    try { await fetch(`/api/complaints?id=${id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'resolved' }) }); fetchData(); } catch {}
  };
  const filtered = data.filter(c => tab === 'all' || (tab === 'open' && c.status !== 'resolved') || (tab === 'resolved' && c.status === 'resolved'));
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24 }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` }, tab: (a: boolean) => ({ background: a ? GOLD : CARD, color: a ? '#000' : 'rgba(255,255,255,0.6)', border: `1px solid ${a ? GOLD : BORDER}`, borderRadius: 10, padding: '8px 20px', cursor: 'pointer', fontWeight: a ? 700 : 400, fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }) };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>الشكاوى والمقترحات</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إدارة شكاوى ومقترحات الطلاب وأولياء الأمور</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[{ label: 'إجمالي', v: data.length }, { label: 'مفتوحة', v: data.filter(c => c.status !== 'resolved').length }, { label: 'محلولة', v: data.filter(c => c.status === 'resolved').length }].map((st, i) => (<div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}
      </div>
      <div style={s.card}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>{[['all','الكل'],['open','مفتوحة'],['resolved','محلولة']].map(([v,l]) => (<button key={v} style={s.tab(tab === v)} onClick={() => setTab(v as any)}>{l}</button>))}</div>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد شكاوى</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['مقدم الشكوى','الموضوع','الوصف','الأولوية','الحالة','التاريخ','إجراء'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((c: any) => (<tr key={c.id}><td style={s.td}>{c.submitter_name || c.user_name || '-'}</td><td style={s.td}>{c.subject || c.title || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{c.description?.substring(0, 60) || '-'}</td><td style={s.td}><span style={{ background: c.priority === 'high' ? 'rgba(239,68,68,0.15)' : c.priority === 'medium' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.08)', color: c.priority === 'high' ? '#ef4444' : c.priority === 'medium' ? GOLD : 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{c.priority === 'high' ? 'عالية' : c.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</span></td><td style={s.td}><span style={{ background: c.status === 'resolved' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: c.status === 'resolved' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12 }}>{c.status === 'resolved' ? 'محلولة' : 'مفتوحة'}</span></td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{c.created_at ? new Date(c.created_at).toLocaleDateString('ar-SA') : '-'}</td><td style={s.td}>{c.status !== 'resolved' && <button onClick={() => resolve(c.id)} style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>حل</button>}</td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
