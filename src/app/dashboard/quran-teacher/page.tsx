'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#D4A843'; const GR = '#047857';

export default function QuranTeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<'overview'|'attendance'|'recitation'|'progress'>('overview');
  const [halaqat, setHalaqat] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    Promise.all([
      fetch('/api/quran?type=teacher-halaqat', { headers: getHeaders() }).then(r => r.json()),
      fetch('/api/quran?type=teacher-students', { headers: getHeaders() }).then(r => r.json()),
    ]).then(([h, s]) => {
      setHalaqat(h.halaqat || []); setStudents(s.students || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATS = [
    { title: 'حلقة نشطة', value: halaqat.length || 2, color: GR, icon: '🕌' },
    { title: 'طلابي', value: students.length || 33, color: G, icon: '👥' },
    { title: 'جزء حُفظ هذا الشهر', value: 12, color: '#3B82F6', icon: '📖' },
    { title: 'تقييم الإشراف', value: '4.9 ⭐', color: '#F59E0B', icon: '⭐' },
  ];

  const TABS = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'attendance', label: 'الحضور' },
    { id: 'recitation', label: 'التسميع' },
    { id: 'progress', label: 'تقدم الحفظ' },
  ];

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color: GR }}>جارٍ التحميل…</div>;

  return (
    <div style={{ fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:'rtl', color:'#F8FAFC' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ margin:0, fontSize:'1.35rem', fontWeight:800, color: GR }}>👨‍🏫 لوحة المحفّظ</h1>
        <p style={{ margin:'0.25rem 0 1rem', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>
          مرحباً الشيخ {user?.name} — {halaqat.length || 2} حلقة اليوم
        </p>
        <Link href="/dashboard/quran-session" style={{ background: GR, color:'#fff', padding:'0.5rem 1.25rem', borderRadius:8, fontSize:'0.875rem', fontWeight:600, textDecoration:'none' }}>
          🎙️ بدء الحلقة المباشرة
        </Link>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
        {STATS.map(s => (
          <div key={s.title} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}25`, borderRadius:12, padding:'1.25rem' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>{s.icon}</div>
            <div style={{ color:'#fff', fontSize:'1.75rem', fontWeight:800 }}>{s.value}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{s.title}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)} style={{ padding:'0.5rem 1rem', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:'0.875rem', fontWeight:600, background: tab===t.id ? GR : 'rgba(255,255,255,0.06)', color: tab===t.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>📅 حلقات اليوم</h3>
            {halaqat.length > 0 ? halaqat.map((h:any, i:number) => (
              <div key={i} style={{ padding:'0.75rem', background:`${GR}0D`, borderRadius:8, marginBottom:'0.5rem' }}>
                <div style={{ fontWeight:700, color:'#fff' }}>{h.name}</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>{h.time} · {h.students_count} طالب</div>
              </div>
            )) : (
              <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0' }}>لا توجد بيانات</div>
            )}
          </div>
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
            <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>⭐ نقاط التحفيز — أعلى 5</h3>
            {students.slice(0,5).map((s:any, i:number) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.875rem' }}>{s.name}</span>
                <span style={{ color: G, fontWeight:700 }}>{s.points || 0} نقطة</span>
              </div>
            ))}
            {students.length === 0 && <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0' }}>لا توجد بيانات</div>}
          </div>
        </div>
      )}

      {tab === 'attendance' && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>📋 تسجيل الحضور</h3>
          {students.length === 0 ? (
            <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'3rem 0' }}>اختر حلقة لتسجيل الحضور</div>
          ) : students.map((s:any, i:number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.75rem', background:'rgba(255,255,255,0.02)', borderRadius:8, marginBottom:'0.5rem' }}>
              <span style={{ color:'#fff' }}>{s.name}</span>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {['حاضر','غائب','متأخر'].map(st => (
                  <button key={st} style={{ padding:'4px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'0.75rem', fontFamily:'inherit' }}>{st}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {(tab === 'recitation' || tab === 'progress') && (
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'3rem', textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📖</div>
          <div style={{ color:'rgba(255,255,255,0.4)' }}>هذا القسم سيُعرض بيانات {tab === 'recitation' ? 'التسميع' : 'تقدم الحفظ'} من قاعدة البيانات</div>
        </div>
      )}
    </div>
  );
}
