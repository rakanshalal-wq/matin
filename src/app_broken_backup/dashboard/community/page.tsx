'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/community', { credentials: 'include' });
      const arr = await r.json();
      setPosts(Array.isArray(arr) ? arr : []);
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24, marginBottom: 16 } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>المجتمع</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>منشورات ومشاركات المجتمع المدرسي</div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[{ label: 'إجمالي المنشورات', v: posts.length }, { label: 'منشورات اليوم', v: posts.filter((p: any) => p.created_at && new Date(p.created_at).toDateString() === new Date().toDateString()).length }, { label: 'معلقة للمراجعة', v: posts.filter((p: any) => p.status === 'pending').length }].map((st, i) => (<div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px' }}><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{st.label}</div><div style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{st.v}</div></div>))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : posts.length === 0 ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>لا توجد منشورات</div> : posts.map((p: any) => (
        <div key={p.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div><div style={{ fontWeight: 600, marginBottom: 8 }}>{p.title || p.content?.substring(0, 50) || '-'}</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{p.content?.substring(0, 150) || '-'}</div></div>
            <span style={{ background: p.status === 'published' ? 'rgba(34,197,94,0.15)' : 'rgba(201,168,76,0.15)', color: p.status === 'published' ? '#22c55e' : GOLD, borderRadius: 8, padding: '4px 10px', fontSize: 12, flexShrink: 0, marginRight: 16 }}>{p.status === 'published' ? 'منشور' : 'معلق'}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
            <span>👤 {p.author_name || '-'}</span>
            <span>💬 {p.comments_count || 0} تعليق</span>
            <span>❤️ {p.likes_count || 0} إعجاب</span>
            <span>{p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : '-'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
