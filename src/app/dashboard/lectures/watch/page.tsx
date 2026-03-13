'use client';
import { useState, useEffect, useRef } from 'react';

const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };

export default function WatchLecturePage() {
  const [lecture, setLecture] = useState<any>(null);
  const [phase, setPhase] = useState<'loading' | 'watching' | 'quiz' | 'result'>('loading');
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState(0);
  const [result, setResult] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<any>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) fetchLecture(id);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fetchLecture = async (id: string) => {
    try {
      const res = await fetch('/api/lectures', { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data)) {
        const found = data.find((l: any) => String(l.id) === id);
        if (found) {
          setLecture(found);
          setPhase('watching');
          startTimer(found.duration_minutes || 45);
        } else setMsg('المحاضرة غير موجودة');
      }
    } catch { setMsg('خطأ بالاتصال'); }
  };

  const startTimer = (durationMin: number) => {
    const totalSec = durationMin * 60;
    let sec = 0;
    timerRef.current = setInterval(() => {
      sec++;
      setElapsed(sec);
      setProgress(Math.min(100, Math.round((sec / totalSec) * 100)));
      if (sec >= totalSec) {
        clearInterval(timerRef.current);
        loadQuiz();
      }
    }, 1000);
  };

  const loadQuiz = async () => {
    const sampleQuestions = [
      { id: '1', question_text: 'ما هو الموضوع الرئيسي للمحاضرة؟', options: ['الموضوع الأول', 'الموضوع الثاني', 'الموضوع الثالث', 'لا شيء مما سبق'], correct_answer: 'الموضوع الأول' },
      { id: '2', question_text: 'أي من التالي صحيح؟', options: ['الخيار أ', 'الخيار ب', 'الخيار ج', 'الخيار د'], correct_answer: 'الخيار أ' },
      { id: '3', question_text: 'ما هي النتيجة المتوقعة؟', options: ['نتيجة 1', 'نتيجة 2', 'نتيجة 3', 'نتيجة 4'], correct_answer: 'نتيجة 1' },
      { id: '4', question_text: 'متى يتم تطبيق هذا المفهوم؟', options: ['دائماً', 'أحياناً', 'نادراً', 'أبداً'], correct_answer: 'دائماً' },
      { id: '5', question_text: 'ما هو الاستنتاج النهائي؟', options: ['استنتاج أ', 'استنتاج ب', 'استنتاج ج', 'استنتاج د'], correct_answer: 'استنتاج أ' },
    ];

    if (lecture) {
      try {
        const res = await fetch(`/api/lectures/questions?lecture_id=${lecture.id}`, { headers: getHeaders() });
        const data = await res.json();
        if (Array.isArray(data) && data.length >= 5) {
          setQuestions(data.slice(0, 5));
          setPhase('quiz');
          return;
        }
      } catch {}
    }

    setQuestions(sampleQuestions);
    setPhase('quiz');
  };

  const submitQuiz = async () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    setScore(correct);

    const attendanceStatus = correct >= 3 ? 'present' : correct === 2 ? 'retry' : 'absent';
    setResult(attendanceStatus);

    if (attendanceStatus === 'present') {
      setMsg(`أحسنت! ${correct}/5 — تم تسجيل حضورك ✓`);
    } else if (attendanceStatus === 'retry') {
      setMsg(`${correct}/5 — تحتاج تعيد المحاولة`);
    } else {
      setMsg(`${correct}/5 — للأسف تم تسجيل غياب`);
    }

    // حفظ نتيجة الاختبار والحضور في قاعدة البيانات
    if (lecture && attendanceStatus !== 'retry') {
      setSaving(true);
      try {
        // 1. حفظ الحضور
        await fetch('/api/attendance', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            lecture_id: lecture.id,
            status: attendanceStatus === 'present' ? 'present' : 'absent',
            notes: `اختبار المحاضرة: ${correct}/5`,
          }),
        });

        // 2. حفظ نتيجة الاختبار
        await fetch('/api/quiz-results', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({
            lecture_id: lecture.id,
            score: correct,
            total: 5,
            passed: attendanceStatus === 'present',
            answers: JSON.stringify(answers),
          }),
        });
      } catch (e) {
        console.error('خطأ في حفظ النتيجة:', e);
      } finally {
        setSaving(false);
      }
    }

    setPhase('result');
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const inputStyle = { fontFamily: 'IBM Plex Sans Arabic, sans-serif' };

  if (msg && phase === 'loading') return (
    <div style={{ padding: 40, textAlign: 'center', color: '#EF4444', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' as const }}>{msg}</div>
  );

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', maxWidth: 800, margin: '0 auto' }}>

      {/* === مرحلة المشاهدة === */}
      {phase === 'watching' && lecture && (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#C9A227', margin: '0 0 8px' }}>🎥 {lecture.title}</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '0 0 24px' }}>شاهد المحاضرة كاملة بدون تقديم أو ترجيع — بعدها 5 أسئلة</p>

          {/* شاشة الفيديو */}
          <div style={{ background: '#000', borderRadius: 16, height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' as const, overflow: 'hidden' }}>
            {lecture.recording_url ? (
              <video style={{ width: '100%', height: '100%', borderRadius: 16 }} autoPlay controlsList="nodownload nofullscreen" disablePictureInPicture onContextMenu={e => e.preventDefault()}>
                <source src={lecture.recording_url} />
              </video>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 10 }}>🎥</div>
                <p style={{ color: '#6B7280', fontSize: 16 }}>المحاضرة جارية...</p>
                <p style={{ color: '#C9A227', fontSize: 32, fontWeight: 700, fontFamily: 'monospace' }}>{formatTime(elapsed)}</p>
              </div>
            )}

            {/* منع التقديم/الترجيع */}
            <div style={{ position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: '8px 16px', background: 'rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#C9A227', fontSize: 13 }}>⏱️ {formatTime(elapsed)} / {lecture.duration_minutes || 45} دقيقة</span>
                <span style={{ color: '#10B981', fontSize: 13 }}>📊 {progress}%</span>
              </div>
              <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6 }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #C9A227, #10B981)', borderRadius: 2, transition: 'width 1s' }}></div>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, fontSize: 13, color: '#EF4444' }}>
            🔒 لا يمكن تقديم أو ترجيع المحاضرة — شاهدها كاملة للوصول للأسئلة
          </div>

          {/* زر تخطي للاختبار — للتجربة فقط */}
          <button onClick={loadQuiz} style={{ marginTop: 16, padding: '10px 24px', background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)', borderRadius: 10, fontSize: 13, cursor: 'pointer', ...inputStyle }}>
            ⏭️ تخطي للأسئلة (للاختبار فقط)
          </button>
        </div>
      )}

      {/* === مرحلة الأسئلة === */}
      {phase === 'quiz' && (
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#C9A227', margin: '0 0 8px' }}>❓ أسئلة المحاضرة</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '0 0 24px' }}>أجب على 5 أسئلة — 3 صحيحة = حاضر</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {questions.map((q, i) => (
              <div key={q.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 12px' }}>
                  <span style={{ color: '#C9A227' }}>س{i + 1}:</span> {q.question_text}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(q.options || []).map((opt: string, oi: number) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <button key={oi} onClick={() => setAnswers({...answers, [q.id]: opt})} style={{ padding: '10px 16px', background: selected ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.03)', border: selected ? '2px solid #C9A227' : '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: selected ? '#C9A227' : '#fff', fontSize: 14, cursor: 'pointer', textAlign: 'right' as const, ...inputStyle }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button onClick={submitQuiz} disabled={Object.keys(answers).length < 5 || saving} style={{ marginTop: 24, padding: '14px 40px', background: Object.keys(answers).length < 5 ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: Object.keys(answers).length < 5 ? '#6B7280' : '#000', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', ...inputStyle }}>
            {saving ? '⏳ جاري الحفظ...' : `✓ تسليم الإجابات (${Object.keys(answers).length}/5)`}
          </button>
        </div>
      )}

      {/* === مرحلة النتيجة === */}
      {phase === 'result' && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>
            {result === 'present' ? '🎉' : result === 'retry' ? '🔄' : '😞'}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: result === 'present' ? '#10B981' : result === 'retry' ? '#F59E0B' : '#EF4444', margin: '0 0 12px' }}>
            {score} / 5
          </h1>
          <p style={{ fontSize: 18, color: '#fff', margin: '0 0 8px' }}>
            {result === 'present' ? 'تم تسجيل حضورك بنجاح!' : result === 'retry' ? 'تحتاج تعيد المحاولة' : 'تم تسجيل غياب'}
          </p>
          <p style={{ fontSize: 14, color: '#9CA3AF', margin: '0 0 30px' }}>{msg}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, margin: '0 auto' }}>
            {questions.map((q, i) => {
              const correct = answers[q.id] === q.correct_answer;
              return (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: correct ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: 10, border: `1px solid ${correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                  <span style={{ color: '#fff', fontSize: 13 }}>س{i + 1}: {q.question_text.substring(0, 30)}...</span>
                  <span style={{ color: correct ? '#10B981' : '#EF4444', fontSize: 16 }}>{correct ? '✓' : '✕'}</span>
                </div>
              );
            })}
          </div>

          {result === 'retry' && (
            <button onClick={() => { setAnswers({}); setPhase('quiz'); }} style={{ marginTop: 24, padding: '12px 32px', background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', color: '#000', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', ...inputStyle }}>
              🔄 إعادة المحاولة
            </button>
          )}

          <a href="/dashboard/lectures" style={{ display: 'inline-block', marginTop: 16, padding: '12px 32px', background: 'rgba(255,255,255,0.05)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 12, fontSize: 14, textDecoration: 'none', ...inputStyle }}>
            ← العودة للمحاضرات
          </a>
        </div>
      )}
    </div>
  );
}
