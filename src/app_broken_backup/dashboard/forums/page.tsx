'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function ForumsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/forums', { credentials: 'include' });
      const arr = await r.json();
      setData(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px', marginBottom: 12 } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>المنتديات</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>منتديات النقاش والتواصل</div></div>
      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : data.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد منتديات</div> : data.map((f: any) => (
        <div key={f.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 600, marginBottom: 4 }}>{f.title || f.name || '-'}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{f.description || '-'}</div></div>
            <div style={{ display: 'flex', gap: 16, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              <span>💬 {f.posts_count || f.replies_count || 0}</span>
              <span>👁 {f.views_count || 0}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
