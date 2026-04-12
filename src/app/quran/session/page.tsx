'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

const PRIMARY = '#059669';
const SECONDARY = '#10B981';
const GOLD = '#D4A843';

interface Attendee { id: string; name: string; present: boolean; }
interface SessionInfo { id: string; name: string; teacher: string; time: string; }
interface RecitationModal { open: boolean; studentId: string; studentName: string; grade: string; notes: string; }

export default function QuranSessionPage() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({ id: '', name: 'تحميل...', teacher: '', time: '' });
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [modal, setModal] = useState<RecitationModal>({ open: false, studentId: '', studentName: '', grade: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [ended, setEnded] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    fetch('/api/quran?type=session-live')
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(res => {
        if (res) {
          const d = res.data ?? res;
          if (d.session) setSessionInfo(d.session);
          if (d.students) setAttendees(d.students.map((s: Attendee) => ({ ...s, present: true })));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleAttendance = (id: string) => {
    setAttendees(prev => prev.map(a => a.id === id ? { ...a, present: !a.present } : a));
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/quran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'attendance', sessionId: sessionInfo.id, attendance: attendees.map(a => ({ id: a.id, present: a.present })) }),
      });
      if (res.ok) showToast('تم حفظ الحضور بنجاح <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>');
      else showToast('فشل حفظ الحضور، حاول مرة أخرى');
    } catch {
      showToast('خطأ في الاتصال بالخادم');
    } finally {
      setSaving(false);
    }
  };

  const submitRecitation = async () => {
    if (!modal.grade) { showToast('يرجى إدخال الدرجة'); return; }
    try {
      const res = await fetch('/api/quran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'recitation', sessionId: sessionInfo.id, studentId: modal.studentId, grade: modal.grade, notes: modal.notes }),
      });
      if (res.ok) showToast(`تم تسجيل تسميع ${modal.studentName} <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`);
      else showToast('فشل تسجيل التسميع');
    } catch {
      showToast('خطأ في الاتصال');
    }
    setModal(m => ({ ...m, open: false, grade: '', notes: '' }));
  };

  const presentCount = attendees.filter(a => a.present).length;

  if (ended) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a,#0d1a11)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>تم إنهاء الحلقة</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>تم تسجيل جميع البيانات بنجاح</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a0f0a 0%,#0d1a11 50%,#0a1a0d 100%)', color: '#fff', fontFamily: 'Cairo, Tajawal, sans-serif', direction: 'rtl' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: PRIMARY, color: '#fff', padding: '10px 28px', borderRadius: 30, fontSize: 13, fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 20px rgba(5,150,105,0.5)' }}>{toast}</div>
      )}

      {/* Recitation Modal */}
      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0d1a11', border: `1px solid ${PRIMARY}40`, borderRadius: 18, padding: '28px 32px', width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>تسميع: {modal.studentName}</div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>الدرجة (من 100)</label>
              <input
                type="number" min={0} max={100}
                value={modal.grade}
                onChange={e => setModal(m => ({ ...m, grade: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 18, fontWeight: 800, outline: 'none', boxSizing: 'border-box' }}
                placeholder="90"
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>ملاحظة</label>
              <textarea
                value={modal.notes}
                onChange={e => setModal(m => ({ ...m, notes: e.target.value }))}
                rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                placeholder="أداء جيد، يحتاج مراجعة..."
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={submitRecitation} style={{ flex: 1, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '11px 0', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>حفظ التسميع</button>
              <button onClick={() => setModal(m => ({ ...m, open: false }))} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '11px 0', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: 'rgba(5,150,105,0.08)', borderBottom: '1px solid rgba(5,150,105,0.2)', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg></div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{sessionInfo.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>المحفّظ: {sessionInfo.teacher} — {sessionInfo.time}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: SECONDARY }}>{presentCount}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>حاضرون</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#EF4444' }}>{attendees.length - presentCount}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>غائبون</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>جاري تحميل الحلقة...</div>
        ) : (
          <>
            {/* Students List */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(5,150,105,0.15)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>قائمة الطلاب</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{attendees.length} طالب</div>
              </div>

              {attendees.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>لا يوجد طلاب في هذه الحلقة</div>
              ) : attendees.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)', background: a.present ? 'rgba(5,150,105,0.03)' : 'rgba(239,68,68,0.03)' }}>
                  {/* Checkbox */}
                  <div
                    onClick={() => toggleAttendance(a.id)}
                    style={{ width: 26, height: 26, borderRadius: 7, border: `2px solid ${a.present ? PRIMARY : 'rgba(255,255,255,0.15)'}`, background: a.present ? PRIMARY : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all .15s' }}
                  >
                    {a.present && <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>}
                  </div>

                  {/* Avatar */}
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${PRIMARY}40,${SECONDARY}20)`, border: `1px solid ${PRIMARY}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {a.name.charAt(0)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: a.present ? '#fff' : 'rgba(255,255,255,0.4)' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: a.present ? SECONDARY : '#EF4444', fontWeight: 600 }}>{a.present ? 'حاضر' : 'غائب'}</div>
                  </div>

                  {/* Recitation Button */}
                  <button
                    disabled={!a.present}
                    onClick={() => setModal({ open: true, studentId: a.id, studentName: a.name, grade: '', notes: '' })}
                    style={{ background: a.present ? `${GOLD}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${a.present ? GOLD + '50' : 'rgba(255,255,255,0.06)'}`, color: a.present ? GOLD : 'rgba(255,255,255,0.2)', padding: '7px 16px', borderRadius: 8, cursor: a.present ? 'pointer' : 'not-allowed', fontSize: 12, fontWeight: 700, transition: 'all .15s' }}
                  >
                    بدء التسميع
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={saveAttendance}
                disabled={saving}
                style={{ flex: 2, background: `linear-gradient(135deg,${PRIMARY},${SECONDARY})`, border: 'none', color: '#fff', padding: '14px 0', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, opacity: saving ? 0.7 : 1, transition: 'opacity .2s' }}
              >
                {saving ? 'جاري الحفظ...' : 'حفظ الحضور'}
              </button>
              <button
                onClick={() => { saveAttendance(); setTimeout(() => setEnded(true), 500); }}
                style={{ flex: 1, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', padding: '14px 0', borderRadius: 12, cursor: 'pointer', fontSize: 15, fontWeight: 800 }}
              >
                إنهاء الحلقة
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
