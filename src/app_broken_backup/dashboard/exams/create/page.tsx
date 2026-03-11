'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  question_text: string;
  subject: string;
  grade: string;
  difficulty: string;
  lesson: string;
  options: string[];
  correct_answer: string;
  question_type: string;
}

interface ExamQuestion {
  question: Question;
  points: number;
  order: number;
}

export default function CreateExamPage() {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ subject: '', grade: '', difficulty: '', search: '' });
  const [classes, setClasses] = useState<any[]>([]);
  
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    subject: '',
    grade: '',
    class_id: '',
    start_time: '',
    end_time: '',
    duration_minutes: 60,
    total_marks: 100,
    passing_marks: 60,
    instructions: '',
    shuffle_questions: false,
    shuffle_options: false,
    show_results_immediately: true,
    exam_type: 'quiz',
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') : '';
  const headers: any = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };

  useEffect(() => {
    fetchQuestions();
    fetchClasses();
  }, [filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.set('subject', filters.subject);
      if (filters.grade) params.set('grade', filters.grade);
      if (filters.difficulty) params.set('difficulty', filters.difficulty);
      if (filters.search) params.set('search', filters.search);
      params.set('limit', '50');
      const res = await fetch(`/api/question-bank?${params}`, { headers });
      const data = await res.json();
      // الـ API يرجع مصفوفة مباشرة أو {questions: [...]}
      setQuestions(Array.isArray(data) ? data : (data.questions || []));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes', { headers });
      const data = await res.json();
      setClasses(data.classes || data || []);
    } catch (e) { console.error(e); }
  };

  const toggleQuestion = (q: Question) => {
    const exists = selectedQuestions.find(sq => sq.question.id === q.id);
    if (exists) {
      setSelectedQuestions(prev => prev.filter(sq => sq.question.id !== q.id));
    } else {
      setSelectedQuestions(prev => [...prev, { question: q, points: 1, order: prev.length + 1 }]);
    }
  };

  const updatePoints = (questionId: number, points: number) => {
    setSelectedQuestions(prev => prev.map(sq =>
      sq.question.id === questionId ? { ...sq, points } : sq
    ));
  };

  const totalPoints = selectedQuestions.reduce((sum, sq) => sum + sq.points, 0);

  const handleSave = async () => {
    if (!examData.title) { alert('يرجى إدخال عنوان الاختبار'); return; }
    if (selectedQuestions.length === 0) { alert('يرجى اختيار سؤال واحد على الأقل'); return; }
    
    setSaving(true);
    try {
      const payload = {
        ...examData,
        questions: selectedQuestions.map(sq => ({
          question_id: sq.question.id,
          points: sq.points,
          order: sq.order,
        })),
        total_marks: totalPoints,
      };
      
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        alert('تم إنشاء الاختبار بنجاح!');
        window.location.href = '/dashboard/exams';
      } else {
        const err = await res.json();
        alert('خطأ: ' + (err.error || 'فشل إنشاء الاختبار'));
      }
    } catch (e) {
      alert('خطأ في الاتصال بالخادم');
    }
    setSaving(false);
  };

  const difficultyColors: any = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' };
  const difficultyLabels: any = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };

  const subjects = [...new Set(questions.map(q => q.subject))];
  const grades = [...new Set(questions.map(q => q.grade))];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Link href="/dashboard/exams" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>
          ← الاختبارات
        </Link>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: 0 }}>إنشاء اختبار جديد</h1>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[
          { num: 1, label: 'معلومات الاختبار' },
          { num: 2, label: 'اختيار الأسئلة' },
          { num: 3, label: 'المراجعة والنشر' },
        ].map(s => (
          <button key={s.num} onClick={() => setStep(s.num)} style={{
            flex: 1, padding: '12px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: step === s.num ? '#C9A227' : step > s.num ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.05)',
            color: step === s.num ? '#0D1B2A' : step > s.num ? '#C9A227' : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: 14,
          }}>
            {s.num}. {s.label}
          </button>
        ))}
      </div>

      {/* Step 1: معلومات الاختبار */}
      {step === 1 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>معلومات الاختبار</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>عنوان الاختبار *</label>
              <input value={examData.title} onChange={e => setExamData(p => ({ ...p, title: e.target.value }))}
                placeholder="مثال: اختبار الفصل الأول - الرياضيات"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>المادة</label>
              <input value={examData.subject} onChange={e => setExamData(p => ({ ...p, subject: e.target.value }))}
                placeholder="الرياضيات"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>الصف</label>
              <input value={examData.grade} onChange={e => setExamData(p => ({ ...p, grade: e.target.value }))}
                placeholder="الأول الابتدائي"
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>الفصل الدراسي</label>
              <select value={examData.class_id} onChange={e => setExamData(p => ({ ...p, class_id: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }}>
                <option value="">-- اختر الفصل --</option>
                {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>نوع الاختبار</label>
              <select value={examData.exam_type} onChange={e => setExamData(p => ({ ...p, exam_type: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }}>
                <option value="quiz">اختبار قصير</option>
                <option value="midterm">منتصف الفصل</option>
                <option value="final">نهائي</option>
                <option value="homework">واجب</option>
              </select>
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>تاريخ البداية</label>
              <input type="datetime-local" value={examData.start_time} onChange={e => setExamData(p => ({ ...p, start_time: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>تاريخ النهاية</label>
              <input type="datetime-local" value={examData.end_time} onChange={e => setExamData(p => ({ ...p, end_time: e.target.value }))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>مدة الاختبار (دقيقة)</label>
              <input type="number" value={examData.duration_minutes} onChange={e => setExamData(p => ({ ...p, duration_minutes: Number(e.target.value) }))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>درجة النجاح</label>
              <input type="number" value={examData.passing_marks} onChange={e => setExamData(p => ({ ...p, passing_marks: Number(e.target.value) }))}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'block', marginBottom: 6 }}>تعليمات الاختبار</label>
              <textarea value={examData.instructions} onChange={e => setExamData(p => ({ ...p, instructions: e.target.value }))}
                placeholder="اكتب تعليمات الاختبار هنا..."
                rows={3}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'white', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <input type="checkbox" checked={examData.shuffle_questions} onChange={e => setExamData(p => ({ ...p, shuffle_questions: e.target.checked }))} />
                ترتيب عشوائي للأسئلة
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <input type="checkbox" checked={examData.shuffle_options} onChange={e => setExamData(p => ({ ...p, shuffle_options: e.target.checked }))} />
                ترتيب عشوائي للخيارات
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                <input type="checkbox" checked={examData.show_results_immediately} onChange={e => setExamData(p => ({ ...p, show_results_immediately: e.target.checked }))} />
                عرض النتائج فوراً
              </label>
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setStep(2)} style={{ background: '#C9A227', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              التالي: اختيار الأسئلة →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: اختيار الأسئلة */}
      {step === 2 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
            {/* بنك الأسئلة */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 }}>
              <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>بنك الأسئلة ({questions.length} سؤال)</h2>
              
              {/* فلاتر */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
                <select value={filters.subject} onChange={e => setFilters(p => ({ ...p, subject: e.target.value }))}
                  style={{ padding: '8px 10px', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 13 }}>
                  <option value="">كل المواد</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={filters.grade} onChange={e => setFilters(p => ({ ...p, grade: e.target.value }))}
                  style={{ padding: '8px 10px', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 13 }}>
                  <option value="">كل الصفوف</option>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={filters.difficulty} onChange={e => setFilters(p => ({ ...p, difficulty: e.target.value }))}
                  style={{ padding: '8px 10px', background: '#0D1B2A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 13 }}>
                  <option value="">كل المستويات</option>
                  <option value="easy">سهل</option>
                  <option value="medium">متوسط</option>
                  <option value="hard">صعب</option>
                </select>
              </div>
              <input value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                placeholder="ابحث في الأسئلة..."
                style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: 'white', fontSize: 13, marginBottom: 16, boxSizing: 'border-box' }} />

              {/* قائمة الأسئلة */}
              <div style={{ maxHeight: 500, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.5)' }}>جاري التحميل...</div>
                ) : questions.map(q => {
                  const isSelected = selectedQuestions.some(sq => sq.question.id === q.id);
                  return (
                    <div key={q.id} onClick={() => toggleQuestion(q)} style={{
                      padding: '12px 14px', marginBottom: 8, borderRadius: 10, cursor: 'pointer',
                      background: isSelected ? 'rgba(201,162,39,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isSelected ? 'rgba(201,162,39,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.2s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: 'white', fontSize: 13, margin: '0 0 6px', lineHeight: 1.5 }}>{q.question_text}</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{q.subject}</span>
                            <span style={{ background: `${difficultyColors[q.difficulty]}22`, color: difficultyColors[q.difficulty], fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{difficultyLabels[q.difficulty]}</span>
                            {q.lesson && <span style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{q.lesson}</span>}
                          </div>
                        </div>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: isSelected ? '#C9A227' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, color: isSelected ? '#0D1B2A' : 'transparent' }}>
                          ✓
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* الأسئلة المختارة */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20, height: 'fit-content', position: 'sticky', top: 80 }}>
              <h2 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>الأسئلة المختارة</h2>
              <div style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                <div style={{ color: '#C9A227', fontSize: 13, fontWeight: 600 }}>{selectedQuestions.length} سؤال | {totalPoints} درجة</div>
              </div>
              
              {selectedQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                  اضغط على الأسئلة لإضافتها
                </div>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {selectedQuestions.map((sq, idx) => (
                    <div key={sq.question.id} style={{ padding: '10px 12px', marginBottom: 8, borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>س{idx + 1}</span>
                        <button onClick={() => toggleQuestion(sq.question)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontSize: 11 }}>حذف</button>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: '0 0 8px', lineHeight: 1.4 }}>
                        {sq.question.question_text.substring(0, 60)}{sq.question.question_text.length > 60 ? '...' : ''}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>الدرجة:</span>
                        <input type="number" value={sq.points} min={0.5} max={10} step={0.5}
                          onChange={e => updatePoints(sq.question.id, Number(e.target.value))}
                          style={{ width: 60, padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, color: 'white', fontSize: 12 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              ← السابق
            </button>
            <button onClick={() => setStep(3)} disabled={selectedQuestions.length === 0} style={{ background: selectedQuestions.length > 0 ? '#C9A227' : 'rgba(255,255,255,0.1)', color: selectedQuestions.length > 0 ? '#0D1B2A' : 'rgba(255,255,255,0.3)', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 15, cursor: selectedQuestions.length > 0 ? 'pointer' : 'not-allowed' }}>
              التالي: المراجعة →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: المراجعة والنشر */}
      {step === 3 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>مراجعة الاختبار قبل النشر</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ color: '#C9A227', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>معلومات الاختبار</h3>
              {[
                { label: 'العنوان', value: examData.title || '—' },
                { label: 'المادة', value: examData.subject || '—' },
                { label: 'الصف', value: examData.grade || '—' },
                { label: 'النوع', value: examData.exam_type },
                { label: 'المدة', value: `${examData.duration_minutes} دقيقة` },
                { label: 'درجة النجاح', value: `${examData.passing_marks}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.label}</span>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16 }}>
              <h3 style={{ color: '#C9A227', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>إحصائيات الأسئلة</h3>
              {[
                { label: 'إجمالي الأسئلة', value: selectedQuestions.length },
                { label: 'إجمالي الدرجات', value: totalPoints },
                { label: 'سهل', value: selectedQuestions.filter(sq => sq.question.difficulty === 'easy').length },
                { label: 'متوسط', value: selectedQuestions.filter(sq => sq.question.difficulty === 'medium').length },
                { label: 'صعب', value: selectedQuestions.filter(sq => sq.question.difficulty === 'hard').length },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{item.label}</span>
                  <span style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* قائمة الأسئلة */}
          <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>الأسئلة المختارة ({selectedQuestions.length})</h3>
          <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 24 }}>
            {selectedQuestions.map((sq, idx) => (
              <div key={sq.question.id} style={{ padding: '12px 14px', marginBottom: 8, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#C9A227', fontSize: 12, fontWeight: 700, marginLeft: 8 }}>س{idx + 1}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{sq.question.question_text.substring(0, 80)}{sq.question.question_text.length > 80 ? '...' : ''}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ background: `${difficultyColors[sq.question.difficulty]}22`, color: difficultyColors[sq.question.difficulty], fontSize: 11, padding: '2px 8px', borderRadius: 6 }}>{difficultyLabels[sq.question.difficulty]}</span>
                  <span style={{ color: '#C9A227', fontSize: 13, fontWeight: 700 }}>{sq.points} درجة</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(2)} style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              ← السابق
            </button>
            <button onClick={handleSave} disabled={saving} style={{ background: '#C9A227', color: '#0D1B2A', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'جاري الحفظ...' : '✅ نشر الاختبار'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
