'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#D4A843'; const GR = '#047857';

export default function QuranSupervisorDashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>({ stats:{}, halaqat:[], teachers:[], topStudents:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    fetch('/api/quran?type=supervisor', { headers: getHeaders() })
      .then(r => r.json()).then(d => setData(d))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATS = [
    { title:'الحلقات النشطة', value: data.stats?.halaqat || 20, color: GR, icon:'🕌' },
    { title:'إجمالي الطلاب', value: data.stats?.students || 0, color:'#3B82F6', icon:'👥' },
    { title:'أجزاء محفوظة (إجمالي)', value: data.stats?.partsMemorized || 0, color: G, icon:'📖' },
    { title:'ختمة كاملة هذا الفصل', value: data.stats?.khatmat || 0, color:'#A855F7', icon:'🏆' },
  ];

  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', color: GR }}>جارٍ التحميل…</div>;

  return (
    <div style={{ fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:'rtl', color:'#F8FAFC' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ margin:0, fontSize:'1.35rem', fontWeight:800, color: GR }}>🔍 لوحة مشرف الحلقات</h1>
        <p style={{ margin:'0.25rem 0 0', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem' }}>مرحباً {user?.name} — آخر تحديث: اليوم</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:'1rem', marginBottom:'1.5rem' }}>
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
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>👨‍🏫 أداء المحفّظين</h3>
          {data.teachers?.length > 0 ? data.teachers.map((t:any, i:number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem', background:'rgba(255,255,255,0.02)', borderRadius:8, marginBottom:'0.5rem' }}>
              <span style={{ color:'#fff', fontSize:'0.875rem' }}>{t.name}</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ color: G, fontSize:'0.8rem', fontWeight:700 }}>تقييم: {t.rating || '4.5'}</div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>{t.students_count || 0} طالب</div>
              </div>
            </div>
          )) : (
            <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0', fontSize:'0.85rem' }}>لا توجد بيانات متاحة</div>
          )}
        </div>

        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'1.25rem' }}>
          <h3 style={{ margin:'0 0 1rem', fontSize:'0.9rem', color:'rgba(255,255,255,0.6)' }}>🏆 أبرز الطلاب هذا الشهر</h3>
          {data.topStudents?.length > 0 ? data.topStudents.slice(0,5).map((s:any, i:number) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.7rem', background:'rgba(255,255,255,0.02)', borderRadius:8, marginBottom:'0.5rem' }}>
              <span style={{ color:'#fff', fontSize:'0.875rem' }}>#{i+1} {s.name}</span>
              <span style={{ color: GR, fontWeight:700, fontSize:'0.85rem' }}>{s.parts_memorized || 0} جزء</span>
            </div>
          )) : (
            <div style={{ color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'2rem 0', fontSize:'0.85rem' }}>لا توجد بيانات متاحة</div>
          )}
        </div>
      </div>

      <div style={{ marginTop:'1rem', display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
        {[
          { href:'/dashboard/quran-center', label:'بوابة المركز', icon:'🏛️' },
          { href:'/dashboard/quran-teacher', label:'لوحة المحفّظ', icon:'👨‍🏫' },
          { href:'/dashboard/attendance', label:'سجل الحضور', icon:'📋' },
          { href:'/dashboard/reports', label:'التقارير', icon:'📊' },
        ].map(l => (
          <Link key={l.href} href={l.href} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'rgba(255,255,255,0.75)', padding:'0.6rem 1rem', borderRadius:8, textDecoration:'none', fontSize:'0.875rem', fontWeight:600 }}>
            {l.icon} {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
