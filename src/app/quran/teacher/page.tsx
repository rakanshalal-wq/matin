'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const PRIMARY = '#059669';
const SECONDARY = '#10B981';
const GOLD = '#D4A843';

interface Student { id: string; name: string; stage: string; parts: number; points: number; lastSession: string; }
interface Halaqah { id: string; name: string; studentsCount: number; nextTime: string; }

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

const TABS = ['نظرة عامة', 'الحضور', 'التسميع', 'تقدم الحفظ'];

export default function QuranTeacherPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [halaqat, setHalaqat] = useState<Halaqah[]>([]);
  const [stats, setStats] = useState({ myHalaqat: 0, myStudents: 0, monthlyParts: 0, rating: '0.0' });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setUser(d.user ?? d); }).catch(() => {});

    Promise.all([
      fetch('/api/quran?type=teacher-students').then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/quran?type=teacher-halaqat').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([s, h]) => {
      if (s) {
        setStudents(s.data ?? s);
        const d = s.data ?? s;
        setStats(prev => ({ ...prev, myStudents: Array.isArray(d) ? d.length : 0 }));
      }
      if (h) {
        const d = h.data ?? h;
        setHalaqat(Array.isArray(d) ? d : []);
        setStats(prev => ({ ...prev, myHalaqat: Array.isArray(d) ? d.length : 0 }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a 0%,#0d1a11 50%,#0a1a0d 100%)', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: PRIMARY, color: '#fff', padding: '10px 24px', borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 20px rgba(5,150,105,0.5)' }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(5,150,105,0.2)', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👨‍🏫</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>لوحة المحفّظ</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{user?.name ?? 'جاري التحميل...'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => showToast('تم تسجيل الحضور بنجاح ✓')} style={{ background: `${PRIMARY}20`, border: `1px solid ${PRIMARY}50`, color: PRIMARY, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>تسجيل حضور</button>
          <button onClick={() => showToast('تم فتح نموذج التسميع ✓')} style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}50`, color: GOLD, padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>تسجيل تسميع</button>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري تحميل البيانات...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard title="حلقاتي" value={stats.myHalaqat} sub="حلقة نشطة" color={PRIMARY} />
              <StatCard title="طلابي" value={stats.myStudents} sub="طالب مسجّل" color={SECONDARY} />
              <StatCard title="أجزاء هذا الشهر" value={stats.monthlyParts} sub="جزء محفوظ" color={GOLD} />
              <StatCard title="تقييم الإشراف" value={stats.rating} sub="من 5 نجوم" color="#8B5CF6" />
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 4, width: 'fit-content' }}>
              {TABS.map((t, i) => (
                <button key={t} onClick={() => setActiveTab(i)} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, transition: 'all .2s', background: activeTab === i ? PRIMARY : 'transparent', color: activeTab === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{t}</button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 0 && (
              <div>
                {/* Halaqat Overview */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14, marginBottom: 24 }}>
                  {halaqat.length === 0 ? (
                    <div style={{ padding: 30, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>لا توجد حلقات مسندة إليك</div>
                  ) : halaqat.map(h => (
                    <div key={h.id} style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 14, padding: '18px 20px' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{h.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        <span>{h.studentsCount} طالب</span>
                        <span>{h.nextTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Students Table (visible in all tabs for demo) */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {activeTab === 0 ? 'جميع الطلاب' : activeTab === 1 ? 'سجل الحضور' : activeTab === 2 ? 'جلسات التسميع' : 'تقدم الحفظ'}
                </div>
                <div style={{ fontSize: 12, color: SECONDARY }}>{students.length} طالب</div>
              </div>
              {students.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا يوجد طلاب بعد</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(5,150,105,0.06)' }}>
                      {['الاسم', 'المرحلة', 'الأجزاء المحفوظة', 'النقاط', 'آخر تسميع'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 600 }}>{s.name}</td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.stage}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ width: `${(s.parts / 30) * 100}%`, height: '100%', background: `linear-gradient(90deg,${PRIMARY},${SECONDARY})`, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, color: SECONDARY, fontWeight: 700, minWidth: 40 }}>{s.parts}/30</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', color: GOLD, fontWeight: 700, fontSize: 13 }}>{s.points}</td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.lastSession}</td>
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
