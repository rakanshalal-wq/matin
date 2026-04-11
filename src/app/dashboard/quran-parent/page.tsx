'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { getHeaders } from '@/lib/api';

const G = '#C9A84C';
const QR = '#22C55E';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.08)';

const toast = (msg: string, color = G) => {
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, {
    position: 'fixed', bottom: '24px', right: '24px', background: color, color: '#fff',
    padding: '12px 20px', borderRadius: '10px', fontWeight: 700, zIndex: '9999',
    fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', fontFamily: 'inherit', direction: 'rtl',
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

const RATING_COLORS: Record<string, string> = {
  'ممتاز': '#22C55E', 'جيد جداً': '#3B82F6', 'جيد': G, 'يحتاج مراجعة': '#EF4444',
};

export default function QuranParentPortal() {
  const [user, setUser] = useState<any>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'attendance' | 'messages'>('overview');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMsg, setRequestMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  const loadData = useCallback(async (studentId: string) => {
    setLoading(true);
    try {
      const [studentRes, progressRes, attRes] = await Promise.all([
        fetch(`/api/quran-students?id=${studentId}`, { headers: getHeaders() }),
        fetch(`/api/quran-progress?student_id=${studentId}`, { headers: getHeaders() }),
        fetch(`/api/quran-attendance?student_id=${studentId}`, { headers: getHeaders() }).catch(() => null),
      ]);
      if (studentRes.ok) setStudentData(await studentRes.json());
      if (progressRes.ok) setProgress(await progressRes.json());
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    // في البيئة الحقيقية: يُجلب معرف الطالب من ملف المستخدم
    // هنا نستخدم student_id من localStorage إذا كان ولي أمر
    const studentId = u.student_id || u.id;
    loadData(String(studentId));
  }, [loadData]);

  const sendMessage = async () => {
    if (!requestMsg.trim()) { toast('الرسالة فارغة', '#EF4444'); return; }
    setSendingMsg(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ content: requestMsg, type: 'quran_parent_request' }),
      });
      if (res.ok) {
        toast('✅ تم إرسال الرسالة', QR);
        setRequestMsg('');
        setShowRequestModal(false);
      } else toast('فشل الإرسال', '#EF4444');
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSendingMsg(false); }
  };

  const downloadCertificate = () => {
    toast('جارٍ تحميل الشهادة...', G);
    // في البيئة الإنتاجية: يتم توجيه لـ /api/certificates?student_id=...
    setTimeout(() => window.print(), 500);
  };

  const NAV = [
    { id: 'overview', label: '🏠 الرئيسية' },
    { id: 'progress', label: '📖 تقدم الحفظ' },
    { id: 'attendance', label: '📋 الحضور' },
    { id: 'messages', label: '💬 التواصل' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: QR, fontSize: 18 }}>جاري التحميل...</div>
    </div>
  );

  const juzPercent = studentData ? ((studentData.current_juz || 0) / 30) * 100 : 0;
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length;
  const totalSessions = attendance.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, minHeight: '100vh', background: '#080811', borderLeft: `1px solid ${BORDER}`, padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: QR }}>🌙 منصة متين</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>بوابة الطالب وولي الأمر</div>
          {user && <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{user.name}</div>}
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)}
              style={{ display: 'block', width: '100%', textAlign: 'right', padding: '10px 20px', background: activeTab === item.id ? `${QR}15` : 'transparent', border: 'none', borderRight: activeTab === item.id ? `3px solid ${QR}` : '3px solid transparent', color: activeTab === item.id ? QR : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${BORDER}` }}>
          <button onClick={() => { localStorage.removeItem('matin_token'); localStorage.removeItem('matin_user'); window.location.href = '/login'; }}
            style={{ width: '100%', background: 'transparent', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: '8px 12px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>
            {studentData ? `أهلاً، ${studentData.name} 👋` : 'بوابة الطالب'}
          </h1>
          {studentData?.circle_name && (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>
              حلقة: {studentData.circle_name}
            </p>
          )}
        </div>

        {activeTab === 'overview' && (
          <div>
            {/* Progress Card */}
            <div style={{ background: `linear-gradient(135deg, ${QR}15, rgba(34,197,94,0.05))`, border: `1px solid ${QR}30`, borderRadius: 16, padding: '28px 32px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>تقدم الحفظ</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: '#fff' }}>
                    {studentData?.current_juz || 0} <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.4)' }}>/ 30 جزء</span>
                  </div>
                </div>
                <div style={{ fontSize: 40 }}>📖</div>
              </div>
              <div style={{ height: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: `linear-gradient(90deg, ${QR}, #86EFAC)`, borderRadius: 5, width: `${juzPercent}%`, transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                <span>{juzPercent.toFixed(0)}% مكتمل</span>
                <span>{30 - (studentData?.current_juz || 0)} جزء متبقٍ</span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'معدل الحضور', value: totalSessions > 0 ? `${Math.round((presentCount / totalSessions) * 100)}%` : '—', color: '#3B82F6', icon: '📋' },
                { label: 'جلسات التسميع', value: progress.length, color: QR, icon: '📖' },
                { label: 'نقاط التحفيز', value: studentData?.total_points || 0, color: G, icon: '⭐' },
              ].map(s => (
                <div key={s.label} style={{ background: CARD, border: `1px solid ${s.color}20`, borderRadius: 14, padding: '20px 24px' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
              {[
                { label: 'عرض تقدم الحفظ', tab: 'progress', color: QR, icon: '📖' },
                { label: 'سجل الحضور', tab: 'attendance', color: '#3B82F6', icon: '📋' },
                { label: 'تواصل مع المحفّظ', tab: 'messages', color: G, icon: '💬' },
              ].map(a => (
                <button key={a.label} onClick={() => setActiveTab(a.tab as any)}
                  style={{ background: CARD, border: `1px solid ${a.color}20`, borderRadius: 14, padding: '20px', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${a.color}50`; (e.currentTarget as HTMLElement).style.background = `${a.color}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${a.color}20`; (e.currentTarget as HTMLElement).style.background = CARD; }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>تقدم الحفظ</h2>
              <button onClick={downloadCertificate}
                style={{ background: `${G}20`, border: `1px solid ${G}40`, borderRadius: 8, padding: '8px 16px', color: G, fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                🎓 تحميل الشهادة
              </button>
            </div>

            {/* Juz Progress */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '24px', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>الأجزاء المحفوظة</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                  <div key={juz}
                    style={{ aspectRatio: '1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: juz <= (studentData?.current_juz || 0) ? `${QR}30` : 'rgba(255,255,255,0.05)', color: juz <= (studentData?.current_juz || 0) ? QR : 'rgba(255,255,255,0.3)', border: `1px solid ${juz <= (studentData?.current_juz || 0) ? QR + '50' : 'rgba(255,255,255,0.08)'}` }}>
                    {juz}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Sessions */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>آخر جلسات التسميع</div>
              {progress.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>لا توجد سجلات تسميع بعد</div>
              ) : (
                progress.slice(0, 10).map((p, i) => (
                  <div key={p.id} style={{ padding: '14px 20px', borderBottom: i < Math.min(progress.length, 10) - 1 ? `1px solid ${BORDER}` : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                        {p.surah_name || 'غير محدد'}
                        {p.from_ayah && p.to_ayah && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}> (آية {p.from_ayah}–{p.to_ayah})</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                        {p.date ? new Date(p.date).toLocaleDateString('ar-SA') : ''}
                        {p.tajweed_notes && <span style={{ marginRight: 8 }}>• {p.tajweed_notes}</span>}
                      </div>
                    </div>
                    <span style={{ background: `${RATING_COLORS[p.rating] || G}20`, color: RATING_COLORS[p.rating] || G, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>
                      {p.rating || 'جيد'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>سجل الحضور</h2>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
                {totalSessions > 0 ? (
                  <>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                      {presentCount} / {totalSessions}
                    </div>
                    <div>جلسة حضور من أصل {totalSessions} جلسة</div>
                  </>
                ) : (
                  'لا توجد سجلات حضور بعد'
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>التواصل مع المحفّظ</h2>
              <button onClick={() => setShowRequestModal(true)}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                ➕ رسالة جديدة
              </button>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>يمكنك التواصل مع المحفّظ لمتابعة تقدم ابنك</div>
              <button onClick={() => setShowRequestModal(true)}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '10px 24px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إرسال رسالة
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal إرسال رسالة */}
      {showRequestModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 440, maxWidth: '95vw', direction: 'rtl' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: '#fff' }}>💬 مراسلة المحفّظ</h2>
            <textarea value={requestMsg} onChange={e => setRequestMsg(e.target.value)}
              placeholder="اكتب رسالتك أو استفسارك هنا..."
              rows={5}
              style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', marginBottom: 20 }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={sendMessage} disabled={sendingMsg}
                style={{ flex: 1, background: QR, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                {sendingMsg ? 'جارٍ الإرسال...' : '📤 إرسال'}
              </button>
              <button onClick={() => setShowRequestModal(false)}
                style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 20px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
