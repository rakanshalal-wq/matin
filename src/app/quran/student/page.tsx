'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const PRIMARY = '#059669';
const SECONDARY = '#10B981';
const GOLD = '#D4A843';

interface Session { id: string; date: string; surah: string; from: number; to: number; grade: number; notes: string; }
interface Badge { id: string; label: string; icon: string; earned: boolean; }
interface Progress { partsDone: number; attendance: number; points: number; overall: number; sessions: Session[]; badges: Badge[]; }

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

const DEFAULT_BADGES: Badge[] = [
  { id: '1', label: 'أول جزء', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>, earned: false },
  { id: '2', label: '5 أجزاء', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, earned: false },
  { id: '3', label: 'الحضور المنتظم', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, earned: false },
  { id: '4', label: 'المتفوق', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>, earned: false },
  { id: '5', label: 'حافظ القرآن', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg>, earned: false },
];

export default function QuranStudentPage() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [progress, setProgress] = useState<Progress>({ partsDone: 0, attendance: 0, points: 0, overall: 0, sessions: [], badges: DEFAULT_BADGES });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => { if (d) setUser(d.user ?? d); }).catch(() => {});

    fetch('/api/quran?type=student-progress')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(res => {
        if (res) {
          const d = res.data ?? res;
          setProgress(p => ({ ...p, ...d, badges: d.badges ?? DEFAULT_BADGES }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = (g: number) => g >= 90 ? SECONDARY : g >= 70 ? GOLD : '#EF4444';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a 0%,#0d1a11 50%,#0a1a0d 100%)', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(5,150,105,0.2)', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>بوابة الطالب</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{user?.name ?? 'جاري التحميل...'}</div>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري تحميل البيانات...</div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard title="الأجزاء المحفوظة" value={`${progress.partsDone}/30`} sub="جزء من القرآن الكريم" color={PRIMARY} />
              <StatCard title="نسبة الحضور" value={`${progress.attendance}%`} sub="معدل الحضور الكلي" color={SECONDARY} />
              <StatCard title="النقاط المكتسبة" value={progress.points} sub="نقطة مكافأة" color={GOLD} />
              <StatCard title="التقدم العام" value={`${progress.overall}%`} sub="من المنهج المقرر" color="#8B5CF6" />
            </div>

            {/* Progress Bar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>تقدم الحفظ</div>
                <div style={{ fontSize: 13, color: SECONDARY, fontWeight: 800 }}>{progress.partsDone} / 30 جزءاً</div>
              </div>
              <div style={{ height: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 7, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${(progress.partsDone / 30) * 100}%`, height: '100%', background: `linear-gradient(90deg,${PRIMARY},${SECONDARY})`, borderRadius: 7, transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                <span>البداية</span>
                <span>النصف (15 جزء)</span>
                <span>الختمة الكاملة</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
              {/* Sessions Log */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>سجل التسميع الأخير</div>
                </div>
                {progress.sessions.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا توجد جلسات مسجّلة</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(5,150,105,0.06)' }}>
                        {['التاريخ', 'السورة', 'من', 'إلى', 'الدرجة', 'ملاحظات'].map(h => (
                          <th key={h} style={{ padding: '11px 14px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {progress.sessions.map((s, i) => (
                        <tr key={s.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.date}</td>
                          <td style={{ padding: '12px 14px', fontSize: 13, fontWeight: 600 }}>{s.surah}</td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.from}</td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.to}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: gradeColor(s.grade), fontWeight: 800, fontSize: 14 }}>{s.grade}</span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.notes ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Badges */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${GOLD}20`, borderRadius: 16, padding: '20px' }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg></span> الإنجازات والشارات
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {progress.badges.map(b => (
                    <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: b.earned ? 1 : 0.35 }}>
                      <div style={{ width: 42, height: 42, background: b.earned ? `${GOLD}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${b.earned ? GOLD : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{b.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: b.earned ? '#fff' : 'rgba(255,255,255,0.4)' }}>{b.label}</div>
                        <div style={{ fontSize: 11, color: b.earned ? GOLD : 'rgba(255,255,255,0.25)' }}>{b.earned ? 'مكتسبة <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' : 'لم تُكتسب بعد'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
