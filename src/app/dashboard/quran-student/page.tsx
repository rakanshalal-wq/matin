'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { getHeaders } from '@/lib/api';

const G = '#D4A843'; const GR = '#047857';

export default function QuranStudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>({ children:[], achievements:[] });
  const [activeChild, setActiveChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    fetch('/api/quran?type=student-parent', { headers: getHeaders() })
      .then(r => r.json()).then(d => { setData(d); if (d.children?.length) setActiveChild(d.children[0]); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color: GR }}>جارٍ التحميل…</div>;

  const STATS = [
    { title:'جزء محفوظ', value: activeChild?.parts_memorized || 0, color: GR, icon:'📖' },
    { title:'نسبة الحضور', value: `${activeChild?.attendance_rate || 0}%`, color:'#3B82F6', icon:'✅' },
    { title:'نقاط التحفيز', value: activeChild?.points || 0, color: G, icon:'⭐' },
    { title:'المركز في المسابقة', value: activeChild?.rank || '-', color:'#A855F7', icon:'🏆' },
  ];

  return (
    <div style={{ fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:'rtl', color:'#F8FAFC' }}>
      <div style={{ marginBottom:'1.25rem' }}>
        <h1 style={{ margin:0, fontSize:'1.35rem', fontWeight:800, color: GR }}>📖 بوابة الطالب وولي الأمر</h1>
        <p style={{ margin:'0.25rem 0 0', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>مرحباً {user?.name} — متابعة أبنائك في مركز التحفيظ</p>
      </div>

      {data.children?.length > 1 && (
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {data.children.map((c:any) => (
            <button key={c.id} onClick={() => setActiveChild(c)} style={{ padding:'0.5rem 1rem', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'0.875rem', fontWeight:600, background: activeChild?.id === c.id ? GR : 'rgba(255,255,255,0.06)', color: activeChild?.id === c.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        {STATS.map(s => (
          <div key={s.title} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25`, borderRadius:12, padding:'1.25rem' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>{s.icon}</div>
            <div style={{ color:'#fff', fontSize:'1.75rem', fontWeight:800 }}>{s.value}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{s.title}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>📊 تقرير الأسبوع</h3>
          <div style={{ padding:'1rem', background:`${GR}0D`, borderRadius:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem' }}>الحضور هذا الأسبوع</span>
              <span style={{ color: GR, fontWeight:700 }}>{activeChild?.weekly_attendance || 0} / 5</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem' }}>آيات محفوظة</span>
              <span style={{ color: G, fontWeight:700 }}>{activeChild?.weekly_ayahs || 0} آية</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem' }}>الحلقة</span>
              <span style={{ color:'rgba(255,255,255,0.8)', fontWeight:600, fontSize:'0.85rem' }}>{activeChild?.halaqa_name || '-'}</span>
            </div>
          </div>
        </div>

        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>🏆 الإنجازات</h3>
          {data.achievements?.length > 0 ? data.achievements.slice(0,4).map((a:any, i:number) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:'1.25rem' }}>{a.icon || '🏅'}</span>
              <div>
                <div style={{ color:'#fff', fontSize:'0.85rem', fontWeight:600 }}>{a.title}</div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>{a.date}</div>
              </div>
            </div>
          )) : (
            <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0', fontSize:'0.85rem' }}>لا توجد إنجازات بعد</div>
          )}
        </div>
      </div>
    </div>
  );
}
