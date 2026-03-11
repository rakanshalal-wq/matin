'use client';
import { useState, useEffect } from 'react';

export default function ExamProctoringPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/exam-session');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {}
    setLoading(false);
  };

  const handleStop = async (id: string) => {
    await fetch('/api/exam-session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'terminate' }),
    });
    fetchSessions();
  };

  const violationColor = (count: number) => {
    if (count === 0) return '#10B981';
    if (count <= 2) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={{ padding: 24, background: '#0D1B2A', minHeight: '100vh', fontFamily: 'Arial' }} dir="rtl">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 800, margin: 0 }}>🎥 مراقبة الاختبارات</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>المراقبة الثلاثية — لحظي — يتحدث كل 30 ثانية</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#10B981', fontSize: 13 }}>مباشر</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'جلسات نشطة', value: sessions.filter(s => s.status === 'active').length, color: '#10B981' },
          { label: 'تنبيهات صفراء', value: sessions.reduce((a, s) => a + (s.suspicious_flags || 0), 0), color: '#F59E0B' },
          { label: 'مخالفات حمراء', value: sessions.filter(s => (s.fullscreen_exits || 0) >= 2).length, color: '#EF4444' },
          { label: 'إجمالي الطلاب', value: sessions.length, color: '#C9A227' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ color: stat.color, fontSize: 28, fontWeight: 800 }}>{stat.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap: 16 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: 'white', fontWeight: 700 }}>الجلسات النشطة</span>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
          ) : sessions.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎥</div>
              <div>لا توجد اختبارات نشطة الآن</div>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {['الطالب', 'الاختبار', 'خروج الشاشة', 'تبديل تاب', 'نسخ', 'مشبوه', 'IP', 'الحالة', 'إجراء'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((session, i) => {
                  const totalViolations = (session.fullscreen_exits || 0) + (session.tab_switches || 0) + (session.copy_attempts || 0);
                  return (
                    <tr key={session.id}
                      onClick={() => setSelected(selected?.id === session.id ? null : session)}
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: selected?.id === session.id ? 'rgba(201,162,39,0.08)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                      <td style={{ padding: '14px 16px', color: 'white', fontSize: 14 }}>{session.student_name || 'طالب'}</td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{session.exam_title || '—'}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ color: violationColor(session.fullscreen_exits || 0), fontWeight: 700 }}>{session.fullscreen_exits || 0}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ color: violationColor(session.tab_switches || 0), fontWeight: 700 }}>{session.tab_switches || 0}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ color: violationColor(session.copy_attempts || 0), fontWeight: 700 }}>{session.copy_attempts || 0}</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ color: violationColor(session.suspicious_flags || 0), fontWeight: 700 }}>{session.suspicious_flags || 0}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{session.ip_address || '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: session.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: session.status === 'active' ? '#10B981' : '#EF4444', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                          {session.status === 'active' ? 'نشط' : 'منتهي'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {session.status === 'active' && totalViolations >= 2 && (
                          <button onClick={(e) => { e.stopPropagation(); handleStop(session.id); }}
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}>
                            ⛔ إيقاف
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(201,162,39,0.2)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ color: '#C9A227', fontWeight: 700 }}>تفاصيل الجلسة</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'الطالب', value: selected.student_name || '—' },
                { label: 'الاختبار', value: selected.exam_title || '—' },
                { label: 'بدأ الساعة', value: selected.started_at ? new Date(selected.started_at).toLocaleTimeString('ar') : '—' },
                { label: 'IP', value: selected.ip_address || '—' },
                { label: 'خروج الشاشة', value: selected.fullscreen_exits || 0 },
                { label: 'تبديل تاب', value: selected.tab_switches || 0 },
                { label: 'محاولات نسخ', value: selected.copy_attempts || 0 },
                { label: 'مشبوه', value: selected.suspicious_flags || 0 },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.label}</span>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
              {selected.status === 'active' && (
                <button onClick={() => handleStop(selected.id)}
                  style={{ marginTop: 8, width: '100%', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                  ⛔ إيقاف الاختبار
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
