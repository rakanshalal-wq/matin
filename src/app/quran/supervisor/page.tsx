'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const PRIMARY = '#059669';
const SECONDARY = '#10B981';
const GOLD = '#D4A843';

interface SupervHalaqah {
  id: string; name: string; teacher: string; students: number;
  attendance: number; progress: number;
}
interface TopStudent { id: string; name: string; halaqah: string; achievement: string; }

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

export default function QuranSupervisorPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [halaqat, setHalaqat] = useState<SupervHalaqah[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = {
    halaqat: halaqat.length,
    students: halaqat.reduce((a, h) => a + h.students, 0),
    avgProgress: halaqat.length ? Math.round(halaqat.reduce((a, h) => a + h.progress, 0) / halaqat.length) : 0,
    pendingReports: 3,
  };

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setUser(d.user ?? d); }).catch(() => {});

    fetch('/api/quran?type=supervisor-halaqat')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(res => {
        if (res) {
          const d = res.data ?? res;
          setHalaqat(Array.isArray(d) ? d : []);
          if (res.topStudents) setTopStudents(res.topStudents);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const progressColor = (v: number) => v >= 80 ? SECONDARY : v >= 50 ? GOLD : '#EF4444';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a 0%,#0d1a11 50%,#0a1a0d 100%)', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(5,150,105,0.2)', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔍</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>لوحة المشرف</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{user?.name ?? 'جاري التحميل...'}</div>
          </div>
        </div>
        <button style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}50`, color: GOLD, padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          رفع تقرير
        </button>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري تحميل البيانات...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard title="الحلقات تحت الإشراف" value={stats.halaqat} sub="حلقة" color={PRIMARY} />
              <StatCard title="إجمالي الطلاب" value={stats.students} sub="طالب" color={SECONDARY} />
              <StatCard title="متوسط الإنجاز" value={`${stats.avgProgress}%`} sub="نسبة التقدم" color={GOLD} />
              <StatCard title="التقارير المعلقة" value={stats.pendingReports} sub="تقرير ينتظر المراجعة" color="#EF4444" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
              {/* Halaqat Table */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>الحلقات تحت الإشراف</div>
                </div>
                {halaqat.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا توجد حلقات</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(5,150,105,0.06)' }}>
                        {['اسم الحلقة', 'المحفّظ', 'الطلاب', 'نسبة الحضور', 'التقدم'].map(h => (
                          <th key={h} style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {halaqat.map((row, i) => (
                        <tr key={row.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '13px 14px', fontSize: 14, fontWeight: 600 }}>{row.name}</td>
                          <td style={{ padding: '13px 14px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{row.teacher}</td>
                          <td style={{ padding: '13px 14px', fontSize: 13, color: SECONDARY, fontWeight: 700 }}>{row.students}</td>
                          <td style={{ padding: '13px 14px' }}>
                            <span style={{ color: progressColor(row.attendance), fontSize: 13, fontWeight: 700 }}>{row.attendance}%</span>
                          </td>
                          <td style={{ padding: '13px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${row.progress}%`, height: '100%', background: `linear-gradient(90deg,${PRIMARY},${SECONDARY})`, borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', minWidth: 30 }}>{row.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
</div>
                )}
              </div>

              {/* Top Students Panel */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${GOLD}20`, borderRadius: 16, padding: '20px', height: 'fit-content' }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🏆</span> إنجازات الأسبوع
                </div>
                {topStudents.length === 0 ? (
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>لا توجد بيانات هذا الأسبوع</div>
                ) : topStudents.slice(0, 3).map((s, i) => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 32, height: 32, background: i === 0 ? GOLD : i === 1 ? '#94A3B8' : '#92400E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.halaqah}</div>
                    </div>
                    <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, background: `${GOLD}15`, padding: '3px 8px', borderRadius: 20 }}>{s.achievement}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
