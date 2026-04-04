'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getHeaders } from '@/lib/api';

const G = '#D4A843';
const GR = '#047857';

const StatCard = ({ title, value, sub, color }: any) => (
  <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
    <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value}</div>
    {sub && <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </div>
);

export default function QuranCenterDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, halaqat: 0, graduates: 0, ijazat: 0 });
  const [halaqat, setHalaqat] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    fetch('/api/quran?type=stats', { headers: getHeaders() })
      .then(r => r.json()).then(d => { if (d.stats) setStats(d.stats); if (d.halaqat) setHalaqat(d.halaqat); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STATS = [
    { title: 'إجمالي الطلاب', value: stats.students || 0, sub: 'طالب وطالبة', color: GR },
    { title: 'المحفّظون', value: stats.teachers || 0, sub: 'محفّظ ومحفّظة', color: G },
    { title: 'الحلقات النشطة', value: stats.halaqat || 0, sub: 'حلقة قرآنية', color: '#3B82F6' },
    { title: 'الحافظون المتخرجون', value: stats.graduates || 0, sub: 'حافظ/ة متخرّج', color: '#A855F7' },
    { title: 'الإجازات بالسند', value: stats.ijazat || 0, sub: 'إجازة متصلة', color: '#F59E0B' },
  ];

  const QUICK = [
    { href: '/dashboard/quran-teacher', label: 'لوحة المحفّظ', icon: '👨‍🏫', color: G },
    { href: '/dashboard/quran-supervisor', label: 'لوحة المشرف', icon: '🔍', color: GR },
    { href: '/dashboard/quran-student', label: 'بوابة الطالب', icon: '📖', color: '#3B82F6' },
    { href: '/dashboard/quran-session', label: 'الحلقة المباشرة', icon: '🎙️', color: '#EF4444' },
    { href: '/dashboard/students', label: 'إدارة الطلاب', icon: '👥', color: '#A855F7' },
    { href: '/dashboard/attendance', label: 'الحضور والغياب', icon: '📋', color: '#06B6D4' },
    { href: '/dashboard/reports', label: 'التقارير', icon: '📊', color: '#10B981' },
    { href: '/dashboard/settings', label: 'إعدادات المركز', icon: '⚙️', color: '#94A3B8' },
  ];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: GR, fontSize: 18 }}>جارٍ التحميل…</div>;

  return (
    <div style={{ fontFamily: "'IBM Plex Sans Arabic',sans-serif", direction: 'rtl', color: '#F8FAFC' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📖</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: GR }}>بوابة مركز تحفيظ القرآن الكريم</h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>مرحباً {user?.name} — إدارة المركز الكاملة</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/dashboard/quran-session" style={{ background: GR, color: '#fff', padding: '0.5rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            🎙️ فتح حلقة مباشرة
          </Link>
          <Link href="/dashboard/quran-supervisor" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F8FAFC', padding: '0.5rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            📊 تقارير المشرف
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STATS.map(s => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Halaqat */}
      {halaqat.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>🕌 الحلقات القرآنية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '0.75rem' }}>
            {halaqat.map((h: any, i: number) => (
              <div key={i} style={{ background: `${GR}0D`, border: `1px solid ${GR}25`, borderRadius: 10, padding: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{h.name}</span>
                  <span style={{ background: h.status === 'active' ? `${GR}30` : 'rgba(255,255,255,0.07)', color: h.status === 'active' ? GR : '#94A3B8', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                    {h.status === 'active' ? '● منعقدة' : 'متوقفة'}
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{h.teacher} · {h.students_count} طالب</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>⚡ الوصول السريع</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.75rem' }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} style={{ background: `${q.color}0D`, border: `1px solid ${q.color}20`, borderRadius: 10, padding: '1rem', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{q.icon}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 600 }}>{q.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
