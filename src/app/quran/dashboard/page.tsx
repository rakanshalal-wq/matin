'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const PRIMARY = '#059669';
const SECONDARY = '#10B981';
const GOLD = '#D4A843';

interface Stats { totalStudents: number; teachers: number; activeHalaqat: number; ijazat: number; }
interface Halaqah { id: string; name: string; teacher: string; students: number; time: string; status: string; }

function StatCard({ title, value, sub, color }: { title: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}25`, borderRadius: 14, padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 70, height: 70, background: `${color}0A`, borderRadius: '0 14px 0 70px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 8 }}>{title}</div>
      <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{value}</div>
      <div style={{ color, fontSize: 11, marginTop: 4, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

export default function QuranDashboardPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, teachers: 0, activeHalaqat: 0, ijazat: 0 });
  const [halaqat, setHalaqat] = useState<Halaqah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setUser(d.user ?? d); }).catch(() => {});

    Promise.all([
      fetch('/api/quran?type=stats').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/quran?type=halaqat').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([s, h]) => {
      if (s) setStats(s.data ?? s);
      if (h) setHalaqat(h.data ?? h);
    }).finally(() => setLoading(false));
  }, []);

  const statusColor = (s: string) => s === 'نشطة' ? SECONDARY : s === 'منتهية' ? '#EF4444' : GOLD;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a 0%,#0d1a11 50%,#0a1a0d 100%)', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(5,150,105,0.2)', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>لوحة تحكم مركز القرآن</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>مرحباً {user?.name ?? '...'}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Stat Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري تحميل البيانات...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard title="إجمالي الطلاب" value={stats.totalStudents} sub="طالب مسجّل" color={PRIMARY} />
              <StatCard title="المحفّظون" value={stats.teachers} sub="محفّظ نشط" color={SECONDARY} />
              <StatCard title="الحلقات النشطة" value={stats.activeHalaqat} sub="حلقة جارية" color={GOLD} />
              <StatCard title="الإجازات بالسند" value={stats.ijazat} sub="إجازة ممنوحة" color="#8B5CF6" />
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 }}>الوصول السريع</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
                {[
                  { label: 'لوحة المحفّظ', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, href: '/quran/teacher', color: PRIMARY },
                  { label: 'لوحة المشرف', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"/></svg>, href: '/quran/supervisor', color: SECONDARY },
                  { label: 'بوابة الطالب', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, href: '/quran/student', color: GOLD },
                  { label: 'الحلقة المباشرة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>, href: '/quran/session', color: '#8B5CF6' },
                ].map(a => (
                  <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: `${a.color}10`, border: `1px solid ${a.color}30`, borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{a.icon}</span>
                      <span style={{ color: a.color, fontWeight: 700, fontSize: 14 }}>{a.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Halaqat Table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>الحلقات النشطة</div>
                <div style={{ fontSize: 12, color: SECONDARY }}>{halaqat.length} حلقة</div>
              </div>
              {halaqat.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا توجد حلقات حالياً</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(5,150,105,0.06)' }}>
                      {['اسم الحلقة', 'المحفّظ', 'عدد الطلاب', 'الوقت', 'الحالة'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {halaqat.map((row, i) => (
                      <tr key={row.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600 }}>{row.name}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{row.teacher}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: SECONDARY, fontWeight: 700 }}>{row.students}</td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{row.time}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: `${statusColor(row.status)}20`, color: statusColor(row.status), borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
