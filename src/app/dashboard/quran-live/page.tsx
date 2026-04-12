'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getHeaders } from '@/lib/api';

const QR = '#22C55E';
const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.05)';
const BORDER = 'rgba(255,255,255,0.1)';

const TAJWEED_RULES = [
  { name: 'إدغام', color: '#3B82F6' },
  { name: 'إقلاب', color: '#A855F7' },
  { name: 'إخفاء', color: '#F59E0B' },
  { name: 'قلقلة', color: '#22C55E' },
  { name: 'مد', color: '#EF4444' },
];

const RATINGS = [
  { label: 'ممتاز', color: '#22C55E', emoji: '⭐' },
  { label: 'جيد جداً', color: '#3B82F6', emoji: '👍' },
  { label: 'جيد', color: '#F59E0B', emoji: '✅' },
  { label: 'يحتاج مراجعة', color: '#EF4444', emoji: '🔄' },
  { label: 'خطأ تجويد', color: '#A855F7', emoji: '📝' },
];

const toast = (msg: string, color = QR) => {
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

// بيانات القرآن الكريم - الفاتحة كمثال توضيحي
const SURAH_FATIHA = [
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
  'الرَّحْمَٰنِ الرَّحِيمِ',
  'مَالِكِ يَوْمِ الدِّينِ',
  'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
  'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
  'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
];

export default function QuranLivePage() {
  const searchParams = useSearchParams();
  const circleId = searchParams.get('circle_id');

  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [activeAyah, setActiveAyah] = useState(0);
  const [activeStudent, setActiveStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [savingAtt, setSavingAtt] = useState(false);
  const [notes, setNotes] = useState('');
  const [showRatingPanel, setShowRatingPanel] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (session && !sessionEnded) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [session, sessionEnded]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const loadSessionData = useCallback(async () => {
    setLoading(true);
    try {
      // ابحث عن جلسة نشطة أو أنشئ جلسة جديدة
      const sessRes = await fetch(`/api/quran-sessions?status=active${circleId ? `&circle_id=${circleId}` : ''}`, { headers: getHeaders() });
      if (sessRes.ok) {
        const sessions = await sessRes.json();
        if (Array.isArray(sessions) && sessions.length > 0) {
          setSession(sessions[0]);
        }
      }
      // جلب الطلاب
      if (circleId) {
        const studRes = await fetch(`/api/quran-students?circle_id=${circleId}`, { headers: getHeaders() });
        if (studRes.ok) {
          const data = await studRes.json();
          setStudents(data);
          const init: Record<number, string> = {};
          data.forEach((s: any) => { init[s.id] = 'PRESENT'; });
          setAttendance(init);
        }
      }
    } catch {}
    finally { setLoading(false); }
  }, [circleId]);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadSessionData();
  }, [loadSessionData]);

  const startSession = async () => {
    try {
      const res = await fetch('/api/quran-sessions', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ circle_id: circleId || null, title: 'حلقة مباشرة' }),
      });
      if (res.ok) {
        const s = await res.json();
        setSession(s);
        setElapsed(0);
        toast('✅ بدأت الحلقة المباشرة', QR);
      } else toast('فشل بدء الجلسة', '#EF4444');
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
  };

  const endSession = async () => {
    if (!session) return;
    if (!confirm('إنهاء الحلقة المباشرة وحفظ السجلات؟')) return;
    // حفظ الحضور أولاً
    await saveAttendance(true);
    try {
      const res = await fetch(`/api/quran-sessions?id=${session.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ status: 'ended', ended_at: new Date().toISOString(), notes }),
      });
      if (res.ok) { setSessionEnded(true); toast('✅ انتهت الحلقة وتم حفظ السجلات', QR); }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
  };

  const saveAttendance = async (silent = false) => {
    if (students.length === 0) { if (!silent) toast('لا يوجد طلاب', '#EF4444'); return; }
    setSavingAtt(true);
    try {
      const records = students.map(s => ({
        student_id: s.id,
        session_id: session?.id || null,
        circle_id: circleId,
        status: attendance[s.id] || 'PRESENT',
        date: new Date().toISOString().split('T')[0],
      }));
      const res = await fetch('/api/quran-attendance', {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({ records }),
      });
      if (res.ok && !silent) toast('✅ تم حفظ الحضور', QR);
    } catch { if (!silent) toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSavingAtt(false); }
  };

  const evaluateStudent = async (student: any, rating: string) => {
    try {
      const res = await fetch('/api/quran-progress', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({
          student_id: student.id,
          session_id: session?.id || null,
          surah_name: 'الفاتحة',
          from_ayah: activeAyah + 1,
          rating,
        }),
      });
      if (res.ok) {
        toast(`✅ تم تقييم ${student.name}: ${rating}`, QR);
        setShowRatingPanel(false);
        setActiveStudent(null);
      }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
    PRESENT: { label: 'حاضر', color: QR, emoji: '✅' },
    ABSENT: { label: 'غائب', color: '#EF4444', emoji: '❌' },
    LATE: { label: 'متأخر', color: '#F59E0B', emoji: '⏰' },
    READING: { label: 'يقرأ', color: '#3B82F6', emoji: '📖' },
    WAITING: { label: 'ينتظر', color: '#A855F7', emoji: '⏳' },
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: QR, fontSize: 18 }}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Top Bar */}
      <div style={{ background: '#080811', borderBottom: `1px solid ${BORDER}`, padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: QR }}>🌙 الحلقة المباشرة</div>
          {session && !sessionEnded && (
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: '#EF4444' }}>
              🔴 مباشر — {formatTime(elapsed)}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!session ? (
            <button onClick={startSession}
              style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 20px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
              ▶ بدء الحلقة
            </button>
          ) : !sessionEnded ? (
            <>
              <button onClick={() => saveAttendance()} disabled={savingAtt}
                style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', borderRadius: 8, padding: '8px 16px', color: '#3B82F6', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                💾 حفظ الحضور
              </button>
              <button onClick={endSession}
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '8px 16px', color: '#EF4444', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                ⏹ إنهاء الحلقة
              </button>
            </>
          ) : null}
          <button onClick={() => window.history.back()}
            style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            ← رجوع
          </button>
        </div>
      </div>

      {sessionEnded ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', gap: 20 }}>
          <div style={{ fontSize: 72 }}>🌟</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: QR }}>انتهت الحلقة المباركة</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>تم حفظ جميع السجلات. جزاكم الله خيراً</p>
          <button onClick={() => window.location.href = '/dashboard/quran-teacher'}
            style={{ background: QR, border: 'none', borderRadius: 10, padding: '12px 32px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            العودة للوحة المحفّظ
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 0, height: 'calc(100vh - 60px)' }}>
          {/* Quran Display */}
          <div style={{ padding: '24px', borderLeft: `1px solid ${BORDER}`, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: `${CARD}`, border: `1px solid ${QR}20`, borderRadius: 14, padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>سورة الفاتحة — صفحة 1</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setActiveAyah(Math.max(0, activeAyah - 1))}
                  style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 16px', color: QR, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                  ← السابقة
                </button>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>آية {activeAyah + 1} من {SURAH_FATIHA.length}</span>
                <button onClick={() => setActiveAyah(Math.min(SURAH_FATIHA.length - 1, activeAyah + 1))}
                  style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 16px', color: QR, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                  التالية →
                </button>
              </div>
            </div>

            {/* Ayah Display */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {SURAH_FATIHA.map((ayah, i) => (
                <div key={i} onClick={() => setActiveAyah(i)}
                  style={{
                    padding: '16px 20px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
                    background: activeAyah === i ? `${QR}15` : 'transparent',
                    border: `1px solid ${activeAyah === i ? QR + '40' : 'transparent'}`,
                    textAlign: 'center',
                  }}>
                  <div style={{ fontSize: 22, lineHeight: 2, color: activeAyah === i ? '#fff' : 'rgba(255,255,255,0.7)', fontFamily: '"Amiri", serif', direction: 'rtl' }}>
                    {ayah}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>آية {i + 1}</div>
                </div>
              ))}
            </div>

            {/* Tajweed Rules */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, fontWeight: 600 }}>أحكام التجويد</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TAJWEED_RULES.map(rule => (
                  <span key={rule.name} style={{ background: `${rule.color}20`, border: `1px solid ${rule.color}40`, borderRadius: 20, padding: '4px 12px', color: rule.color, fontSize: 12, fontWeight: 600 }}>
                    {rule.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Students Panel */}
          <div style={{ background: '#080811', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>طلاب الحلقة ({students.length})</div>

            {students.length === 0 ? (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 32, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                {circleId ? 'لا يوجد طلاب في هذه الحلقة' : 'لم يتم تحديد حلقة. يرجى الوصول من لوحة المحفّظ'}
              </div>
            ) : (
              students.map(student => (
                <div key={student.id} style={{ background: CARD, border: `1px solid ${attendance[student.id] === 'PRESENT' ? QR + '30' : BORDER}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{student.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>جزء {student.current_juz || 0}/30</div>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['PRESENT', 'ABSENT', 'LATE', 'READING'].map(s => {
                        const cfg = STATUS_CONFIG[s];
                        return (
                          <button key={s} onClick={() => setAttendance({ ...attendance, [student.id]: s })}
                            title={cfg.label}
                            style={{
                              background: attendance[student.id] === s ? `${cfg.color}30` : 'transparent',
                              border: `1px solid ${attendance[student.id] === s ? cfg.color : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: 6, padding: '4px 8px', color: attendance[student.id] === s ? cfg.color : 'rgba(255,255,255,0.3)',
                              fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                            {cfg.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Rating Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
                    {RATINGS.slice(0, 4).map(r => (
                      <button key={r.label} onClick={() => evaluateStudent(student, r.label)}
                        style={{ background: `${r.color}15`, border: `1px solid ${r.color}30`, borderRadius: 6, padding: '5px 4px', color: r.color, fontSize: 10, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Notes */}
            <div style={{ marginTop: 'auto' }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>ملاحظات الجلسة</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="أي ملاحظات للجلسة..."
                rows={3}
                style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 12, fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
