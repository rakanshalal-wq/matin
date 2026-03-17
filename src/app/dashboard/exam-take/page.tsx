'use client';
import { AlertTriangle, Ban, Check, FileText, Frown, Lock, PartyPopper, Rocket } from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import IconRenderer from "@/components/IconRenderer";

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function ExamTakePage() {
  const [phase, setPhase] = useState<'loading' | 'ready' | 'exam' | 'result'>('loading');
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [violations, setViolations] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [terminated, setTerminated] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const examId = params.get('exam_id');
    const studentId = params.get('student_id');
    if (examId && studentId) startExam(examId, studentId);
    else setMsg('رابط الاختبار غير صحيح');
  }, []);

  // === قفل الشاشة ===
  useEffect(() => {
    if (phase !== 'exam') return;

    const handleVisibility = () => {
      if (document.hidden) reportViolation('tab_switch', 'انتقل لتبويب آخر');
    };
    const handleBlur = () => reportViolation('tab_switch', 'فقد التركيز على النافذة');
    const handleCopy = (e: ClipboardEvent) => { e.preventDefault(); reportViolation('copy_attempt', 'محاولة نسخ'); };
    const handlePaste = (e: ClipboardEvent) => { e.preventDefault(); reportViolation('copy_attempt', 'محاولة لصق'); };
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'p')) { e.preventDefault(); reportViolation('copy_attempt', `محاولة ${e.key}`); }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) { e.preventDefault(); reportViolation('suspicious', 'محاولة فتح أدوات المطور'); }
      if (e.key === 'Escape') { e.preventDefault(); }
    };
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); reportViolation('suspicious', 'كليك يمين'); };
    const handleFullscreen = () => {
      if (!document.fullscreenElement) reportViolation('fullscreen_exit', 'خرج من وضع ملء الشاشة');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, [phase, session]);

  // === مؤقت الاختبار ===
  useEffect(() => {
    if (phase !== 'exam' || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); finishExam(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeLeft]);

  const startExam = async (examId: string, studentId: string) => {
    try {
      const res = await fetch('/api/exam-session', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ action: 'start', exam_id: examId, student_id: studentId })
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        setQuestions(data.questions || []);
        setPhase('ready');
        // جلب مدة الاختبار
        const examRes = await fetch('/api/exams', { headers: getHeaders() });
        const exams = await examRes.json();
        const exam = Array.isArray(exams) ? exams.find((e: any) => e.id === examId) : null;
        setTimeLeft((exam?.duration || 60) * 60);
      } else setMsg(data.error || 'فشل بدء الاختبار');
    } catch { setMsg('خطأ بالاتصال'); }
  };

  const enterFullscreen = async () => {
    try { await document.documentElement.requestFullscreen(); } catch {}
    setPhase('exam');
  };

  const reportViolation = useCallback(async (type: string, description: string) => {
    if (!session) return;
    setViolations(prev => prev + 1);
    try {
      const res = await fetch('/api/exam-session', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ action: 'violation', session_id: session.id, type, description, severity: type === 'fullscreen_exit' ? 'critical' : 'warning' })
      });
      const data = await res.json();
      if (data.terminated) { setTerminated(true); setPhase('result'); }
    } catch {}
  }, [session]);

  const selectAnswer = async (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (session) {
      try {
        await fetch('/api/exam-session', {
          method: 'POST', headers: getHeaders(),
          body: JSON.stringify({ action: 'answer', session_id: session.id, question_id: questionId, answer })
        });
      } catch {}
    }
  };

  const finishExam = async () => {
    if (!session) return;
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      const res = await fetch('/api/exam-session', {
        method: 'POST', headers: getHeaders(),
        body: JSON.stringify({ action: 'finish', session_id: session.id })
      });
      const data = await res.json();
      setResult(data);
      setPhase('result');
    } catch {}
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const q = questions[currentQ];
  const isUrgent = timeLeft < 300;

  // === شاشة التحميل ===
  if (phase === 'loading') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C0E17', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>FileText</div>
        <p style={{ color: msg ? '#EF4444' : '#C9A227', fontSize: 16 }}>{msg || 'جاري تحميل الاختبار...'}</p>
      </div>
    </div>
  );

  // === شاشة الاستعداد ===
  if (phase === 'ready') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C0E17', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>Lock</div>
        <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 700, margin: '0 0 16px' }}>جاهز للاختبار؟</h1>
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'right' }}>
          <p style={{ color: '#EF4444', fontSize: 14, margin: '0 0 8px', fontWeight: 700 }}>AlertTriangle️ تعليمات مهمة:</p>
          <p style={{ color: '#D4D4D8', fontSize: 13, margin: '0 0 4px' }}>• الاختبار سيفتح بوضع ملء الشاشة</p>
          <p style={{ color: '#D4D4D8', fontSize: 13, margin: '0 0 4px' }}>• ممنوع الخروج من الشاشة أو فتح تبويب ثاني</p>
          <p style={{ color: '#D4D4D8', fontSize: 13, margin: '0 0 4px' }}>• ممنوع النسخ واللصق وكليك يمين</p>
          <p style={{ color: '#D4D4D8', fontSize: 13, margin: '0 0 4px' }}>• 5 مخالفات = إنهاء الاختبار تلقائياً</p>
          <p style={{ color: '#D4D4D8', fontSize: 13, margin: 0 }}>• {questions.length} سؤال — {formatTime(timeLeft)}</p>
        </div>
        <button onClick={enterFullscreen} style={{ padding: '14px 40px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
          [Rocket] ابدأ الاختبار
        </button>
      </div>
    </div>
  );

  // === شاشة النتيجة ===
  if (phase === 'result') return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C0E17', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: 40 }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>{terminated ? "ICON_Ban" : result?.percentage >= 50 ? "ICON_PartyPopper" : "ICON_Frown"}</div>
        <h1 style={{ color: terminated ? '#EF4444' : result?.percentage >= 50 ? '#10B981' : '#F59E0B', fontSize: 28, margin: '0 0 12px' }}>
          {terminated ? 'تم إنهاء الاختبار' : `${result?.correct || 0} / ${result?.total || 0}`}
        </h1>
        <p style={{ color: '#9CA3AF', fontSize: 16, margin: '0 0 8px' }}>
          {terminated ? 'تجاوزت الحد المسموح من المخالفات' : `النسبة: ${result?.percentage || 0}%`}
        </p>
        <p style={{ color: '#6B7280', fontSize: 14, margin: '0 0 24px' }}>المخالفات المسجلة: {violations}</p>
        <a href="/dashboard/exams" style={{ padding: '12px 32px', background: 'rgba(255,255,255,0.05)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 12, fontSize: 14, textDecoration: 'none', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
          ← العودة للاختبارات
        </a>
      </div>
    </div>
  );

  // === شاشة الاختبار ===
  return (
    <div style={{ minHeight: '100vh', background: '#0C0E17', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const, userSelect: 'none' as const }}>
      {/* الشريط العلوي */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: isUrgent ? '#EF4444' : '#C9A227', fontSize: 20, fontWeight: 700, fontFamily: 'monospace' }}>⏱️ {formatTime(timeLeft)}</span>
          {violations > 0 && <span style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.15)', color: '#EF4444', borderRadius: 20, fontSize: 12 }}>AlertTriangle️ مخالفات: {violations}/5</span>}
        </div>
        <span style={{ color: '#9CA3AF', fontSize: 13 }}>سؤال {currentQ + 1} من {questions.length}</span>
        <button onClick={finishExam} style={{ padding: '8px 20px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>[Check] تسليم</button>
      </div>

      {/* شريط التقدم */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.05)' }}>
        <div style={{ height: '100%', width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #C9A227, #10B981)', transition: 'width 0.3s' }}></div>
      </div>

      {/* السؤال */}
      {q && (
        <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(201,162,39,0.15)', color: '#C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>{currentQ + 1}</span>
              <span style={{ color: '#6B7280', fontSize: 12 }}>{q.marks || 1} درجة</span>
            </div>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 24px', lineHeight: 1.7 }}>{q.text_ar || q.text}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(q.options || []).map((opt: string, i: number) => {
                const selected = answers[q.id] === opt;
                return (
                  <button key={i} onClick={() => selectAnswer(q.id, opt)} style={{ padding: '14px 20px', background: selected ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.02)', border: selected ? '2px solid #C9A227' : '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: selected ? '#C9A227' : '#D4D4D8', fontSize: 15, cursor: 'pointer', textAlign: 'right' as const, fontFamily: 'IBM Plex Sans Arabic, sans-serif', transition: 'all 0.2s' }}>
                    <span style={{ marginLeft: 8, color: selected ? '#C9A227' : '#6B7280' }}>{String.fromCharCode(1571 + i)}</span> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* أزرار التنقل */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} style={{ padding: '10px 24px', background: currentQ === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', color: currentQ === 0 ? '#4B5563' : '#D4D4D8', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
              → السابق
            </button>
            {currentQ < questions.length - 1 ? (
              <button onClick={() => setCurrentQ(currentQ + 1)} style={{ padding: '10px 24px', background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 10, fontSize: 14, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                التالي ←
              </button>
            ) : (
              <button onClick={finishExam} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                Check تسليم الاختبار
              </button>
            )}
          </div>

          {/* أرقام الأسئلة */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: answers[questions[i]?.id] ? 'rgba(16,185,129,0.15)' : i === currentQ ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.03)', color: answers[questions[i]?.id] ? '#10B981' : i === currentQ ? '#C9A227' : '#6B7280', fontSize: 13, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
