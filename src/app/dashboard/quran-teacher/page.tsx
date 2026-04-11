'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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

const RATINGS = ['ممتاز', 'جيد جداً', 'جيد', 'يحتاج مراجعة'];
const RATING_COLORS: Record<string, string> = { 'ممتاز': '#22C55E', 'جيد جداً': '#3B82F6', 'جيد': G, 'يحتاج مراجعة': '#EF4444' };

export default function QuranTeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const [circles, setCircles] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'session' | 'students' | 'progress'>('overview');
  const [selectedCircle, setSelectedCircle] = useState('');
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [progressForm, setProgressForm] = useState({ student_id: '', surah_name: '', from_ayah: '', to_ayah: '', juz_number: '', rating: 'جيد', tajweed_notes: '' });
  const [savingProgress, setSavingProgress] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [circlesRes, sessionsRes] = await Promise.all([
        fetch('/api/quran-circles', { headers: getHeaders() }),
        fetch('/api/quran-sessions?status=active', { headers: getHeaders() }),
      ]);
      if (circlesRes.ok) setCircles(await circlesRes.json());
      if (sessionsRes.ok) {
        const sessions = await sessionsRes.json();
        if (Array.isArray(sessions) && sessions.length > 0) setActiveSession(sessions[0]);
      }
    } catch {}
    finally { setLoading(false); }
  }, []);

  const loadStudents = useCallback(async (circleId: string) => {
    if (!circleId) { setStudents([]); return; }
    try {
      const res = await fetch(`/api/quran-students?circle_id=${circleId}`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        const init: Record<number, string> = {};
        data.forEach((s: any) => { init[s.id] = 'PRESENT'; });
        setAttendance(init);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    if (!u.id) { window.location.href = '/login'; return; }
    setUser(u);
    loadData();
  }, [loadData]);

  useEffect(() => { if (selectedCircle) loadStudents(selectedCircle); }, [selectedCircle, loadStudents]);

  const startSession = async () => {
    if (!selectedCircle) { toast('اختر حلقة أولاً', '#EF4444'); return; }
    try {
      const res = await fetch('/api/quran-sessions', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ circle_id: selectedCircle, title: 'جلسة تسميع' }),
      });
      if (res.ok) {
        const session = await res.json();
        setActiveSession(session);
        toast('✅ تم بدء الجلسة', QR);
      } else toast('فشل بدء الجلسة', '#EF4444');
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
  };

  const endSession = async () => {
    if (!activeSession) return;
    if (!confirm('إنهاء الجلسة الحالية؟')) return;
    try {
      const res = await fetch(`/api/quran-sessions?id=${activeSession.id}`, {
        method: 'PUT', headers: getHeaders(),
        body: JSON.stringify({ status: 'ended', ended_at: new Date().toISOString() }),
      });
      if (res.ok) { setActiveSession(null); toast('تم إنهاء الجلسة', G); }
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
  };

  const saveAttendance = async () => {
    if (students.length === 0) { toast('لا يوجد طلاب', '#EF4444'); return; }
    setSavingAttendance(true);
    try {
      const records = students.map(s => ({
        student_id: s.id,
        session_id: activeSession?.id || null,
        circle_id: selectedCircle,
        status: attendance[s.id] || 'PRESENT',
        date: new Date().toISOString().split('T')[0],
      }));
      const res = await fetch('/api/quran-attendance', {
        method: 'POST', headers: getHeaders(), body: JSON.stringify({ records }),
      });
      if (res.ok) toast('✅ تم حفظ الحضور', QR);
      else toast('فشل حفظ الحضور', '#EF4444');
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSavingAttendance(false); }
  };

  const saveProgress = async () => {
    if (!progressForm.student_id) { toast('اختر الطالب', '#EF4444'); return; }
    setSavingProgress(true);
    try {
      const res = await fetch('/api/quran-progress', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ ...progressForm, session_id: activeSession?.id || null }),
      });
      if (res.ok) {
        toast('✅ تم تسجيل التقدم', QR);
        setShowProgressModal(false);
        setProgressForm({ student_id: '', surah_name: '', from_ayah: '', to_ayah: '', juz_number: '', rating: 'جيد', tajweed_notes: '' });
      } else toast('فشل التسجيل', '#EF4444');
    } catch { toast('خطأ في الاتصال', '#EF4444'); }
    finally { setSavingProgress(false); }
  };

  const NAV = [
    { id: 'overview', label: '📊 لوحة التحكم' },
    { id: 'session', label: '📖 جلسة التسميع' },
    { id: 'students', label: '👥 طلابي' },
    { id: 'progress', label: '📈 تقدم الحفظ' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: DARK }}>
      <div style={{ color: QR, fontSize: 18 }}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: DARK, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, minHeight: '100vh', background: '#080811', borderLeft: `1px solid ${BORDER}`, padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: QR }}>🌙 منصة متين</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>لوحة المحفّظ</div>
          {user && <div style={{ marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{user.name}</div>}
          {activeSession && (
            <div style={{ marginTop: 8, background: `${QR}20`, border: `1px solid ${QR}40`, borderRadius: 6, padding: '4px 8px', fontSize: 11, color: QR, fontWeight: 700 }}>
              🔴 جلسة نشطة
            </div>
          )}
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
          <Link href="/dashboard/quran-live" style={{ display: 'block', background: `${QR}20`, border: `1px solid ${QR}40`, borderRadius: 8, padding: '8px 12px', color: QR, fontSize: 12, fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginBottom: 8 }}>
            📡 الحلقة المباشرة
          </Link>
          <button onClick={() => { localStorage.removeItem('matin_token'); localStorage.removeItem('matin_user'); window.location.href = '/login'; }}
            style={{ width: '100%', background: 'transparent', border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: '8px 12px', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 24px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>لوحة المحفّظ</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '4px 0 0' }}>إدارة جلسات التسميع وتتبع تقدم الطلاب</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowProgressModal(true)}
              style={{ background: QR, border: 'none', borderRadius: 8, padding: '10px 18px', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
              📖 تسجيل تسميع
            </button>
          </div>
        </div>

        {/* Circle Selector */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, flexShrink: 0 }}>اختر الحلقة:</label>
          <select value={selectedCircle} onChange={e => setSelectedCircle(e.target.value)}
            style={{ flex: 1, background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
            <option value="">اختر حلقة...</option>
            {circles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {!activeSession ? (
            <button onClick={startSession} style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', flexShrink: 0 }}>
              ▶ بدء التسميع
            </button>
          ) : (
            <button onClick={endSession} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '8px 16px', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', flexShrink: 0 }}>
              ⏹ إنهاء الجلسة
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'طلابي', value: students.length, color: QR },
            { label: 'الحلقات', value: circles.length, color: G },
            { label: 'جلسة نشطة', value: activeSession ? 'نعم' : 'لا', color: activeSession ? QR : '#EF4444' },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${s.color}20`, borderRadius: 14, padding: '20px 24px' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{s.label}</div>
              <div style={{ color: s.color, fontSize: 28, fontWeight: 800, marginTop: 6 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Session Tab - Attendance */}
        {(activeTab === 'session' || activeTab === 'overview') && students.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>📋 الحضور والغياب</h2>
              <button onClick={saveAttendance} disabled={savingAttendance}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                {savingAttendance ? 'جارٍ الحفظ...' : '💾 حفظ الحضور'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {students.map(s => (
                <div key={s.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>جزء {s.current_juz || 0}/30</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[{ v: 'PRESENT', l: 'حاضر', c: QR }, { v: 'ABSENT', l: 'غائب', c: '#EF4444' }, { v: 'LATE', l: 'متأخر', c: G }].map(opt => (
                      <button key={opt.v} onClick={() => setAttendance({ ...attendance, [s.id]: opt.v })}
                        style={{ background: attendance[s.id] === opt.v ? `${opt.c}30` : 'transparent', border: `1px solid ${attendance[s.id] === opt.v ? opt.c : 'rgba(255,255,255,0.1)'}`, borderRadius: 6, padding: '4px 8px', color: attendance[s.id] === opt.v ? opt.c : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {opt.l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>طلابي</h2>
            {students.length === 0 ? (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                اختر حلقة لعرض الطلاب
              </div>
            ) : (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {['الطالب', 'الجزء الحالي', 'التقدم', 'النقاط', 'تسجيل تسميع'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#fff' }}>{s.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: QR, fontWeight: 700 }}>جزء {s.current_juz || 0}</td>
                        <td style={{ padding: '12px 16px', width: 120 }}>
                          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                            <div style={{ height: '100%', background: QR, borderRadius: 3, width: `${((s.current_juz || 0) / 30) * 100}%` }} />
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: G }}>⭐ {s.total_points || 0}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => { setProgressForm({ ...progressForm, student_id: String(s.id) }); setShowProgressModal(true); }}
                            style={{ background: `${QR}20`, border: `1px solid ${QR}40`, borderRadius: 6, padding: '4px 10px', color: QR, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            📖 تسميع
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>تقدم الحفظ</h2>
              <button onClick={() => setShowProgressModal(true)}
                style={{ background: QR, border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
                ➕ تسجيل تسميع جديد
              </button>
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
              <div style={{ color: 'rgba(255,255,255,0.6)' }}>اختر طالباً من قائمة الطلاب لعرض تقدمه</div>
            </div>
          </div>
        )}
      </main>

      {/* Modal تسجيل تسميع */}
      {showProgressModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, width: 500, maxWidth: '95vw', direction: 'rtl', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 800, color: '#fff' }}>📖 تسجيل تسميع</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>الطالب *</label>
                <select value={progressForm.student_id} onChange={e => setProgressForm({ ...progressForm, student_id: e.target.value })}
                  style={{ width: '100%', background: '#0F0F1A', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}>
                  <option value="">اختر الطالب</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>اسم السورة</label>
                  <input value={progressForm.surah_name} onChange={e => setProgressForm({ ...progressForm, surah_name: e.target.value })}
                    placeholder="مثال: البقرة" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>رقم الجزء</label>
                  <input type="number" min="1" max="30" value={progressForm.juz_number} onChange={e => setProgressForm({ ...progressForm, juz_number: e.target.value })}
                    placeholder="1-30" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>من آية</label>
                  <input type="number" value={progressForm.from_ayah} onChange={e => setProgressForm({ ...progressForm, from_ayah: e.target.value })}
                    placeholder="1" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>إلى آية</label>
                  <input type="number" value={progressForm.to_ayah} onChange={e => setProgressForm({ ...progressForm, to_ayah: e.target.value })}
                    placeholder="10" style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>التقييم</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {RATINGS.map(r => (
                    <button key={r} onClick={() => setProgressForm({ ...progressForm, rating: r })}
                      style={{ flex: 1, background: progressForm.rating === r ? `${RATING_COLORS[r]}30` : 'transparent', border: `1px solid ${progressForm.rating === r ? RATING_COLORS[r] : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '8px 4px', color: progressForm.rating === r ? RATING_COLORS[r] : 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'center' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>ملاحظات التجويد</label>
                <textarea value={progressForm.tajweed_notes} onChange={e => setProgressForm({ ...progressForm, tajweed_notes: e.target.value })}
                  placeholder="أي ملاحظات على التجويد..." rows={3}
                  style={{ width: '100%', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={saveProgress} disabled={savingProgress}
                style={{ flex: 1, background: QR, border: 'none', borderRadius: 8, padding: '12px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
                {savingProgress ? 'جارٍ الحفظ...' : '✅ حفظ التسميع'}
              </button>
              <button onClick={() => setShowProgressModal(false)}
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
