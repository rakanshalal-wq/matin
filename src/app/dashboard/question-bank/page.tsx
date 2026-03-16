'use client';
import { useState, useEffect, useRef } from 'react';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'x-user-id': String(u.id || '') };
  } catch { return {}; }
};

const diffConfig: any = {
  easy: { label: 'سهل', color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: '🟢' },
  medium: { label: 'متوسط', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '🟡' },
  hard: { label: 'صعب', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: '🔴' },
};

const typeLabels: any = {
  mcq: 'اختيار من متعدد',
  multiple_choice: 'اختيار من متعدد',
  true_false: 'صح وخطأ',
  essay: 'مقالي',
  fill_blank: 'أكمل الفراغ',
};

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filterDiff, setFilterDiff] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [filterLesson, setFilterLesson] = useState('');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [msg, setMsg] = useState('');
  const [stats, setStats] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    question_text: '', question_type: 'mcq', difficulty: 'medium',
    subject: 'لغتي', grade: 'الأول الابتدائي', semester: '1',
    lesson: '', options: ['', '', '', ''], correct_answer: '', explanation: '',
  });
  const [useAI, setUseAI] = useState(false);
  const [importSubject, setImportSubject] = useState('لغتي');
  const [importGrade, setImportGrade] = useState('الأول الابتدائي');
  const [importTrack, setImportTrack] = useState('عام');
  const [importStage, setImportStage] = useState('الابتدائية');
  const [importReplace, setImportReplace] = useState(false);
  const [filterTrack, setFilterTrack] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [qRes, statsRes] = await Promise.all([
        fetch('/api/question-bank', { headers: getHeaders() }),
        fetch('/api/question-bank/import', { headers: getHeaders() }),
      ]);
      const [qData, statsData] = await Promise.all([qRes.json(), statsRes.json()]);
      setQuestions(Array.isArray(qData) ? qData : []);
      setStats(statsData || {});
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.question_text.trim()) { setMsg('نص السؤال مطلوب'); return; }
    setSaving(true); setMsg('');
    try {
      const payload: any = {
        text_ar: form.question_text,
        type: form.question_type,
        difficulty: form.difficulty,
        subject: form.subject,
        grade: form.grade,
        semester: form.semester,
        lesson: form.lesson,
        options: form.question_type === 'mcq' ? form.options.filter(o => o.trim()) : [],
        answer: form.correct_answer,
        explanation: form.explanation,
        marks: 1,
      };
      const res = await fetch('/api/question-bank', {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data.error || 'فشل الإضافة'); return; }
      setMsg('✅ تم إضافة السؤال بنجاح');
      fetchAll();
      setShowAdd(false);
    } catch { setMsg('خطأ في الاتصال'); } finally { setSaving(false); }
  };

   const handleFileSelect = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setImportProgress('❌ يجب أن يكون الملف بصيغة Excel (.xlsx أو .xls)');
      return;
    }
    setImportFile(file);
    setImportProgress('');
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!importFile) { setImportProgress('❌ يرجى اختيار ملف Excel'); return; }
    if (!importSubject) { setImportProgress('❌ يرجى تحديد المادة الدراسية'); return; }
    if (!importGrade) { setImportProgress('❌ يرجى تحديد الصف الدراسي'); return; }
    setImporting(true);
    setImportProgress('جاري معالجة الملف...');
    setImportResult(null);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      formData.append('subject', importSubject);
      formData.append('grade', importGrade);
      formData.append('track', importTrack);
      formData.append('stage', importStage);
      formData.append('replace', importReplace ? 'true' : 'false');
      const res = await fetch('/api/question-bank/import', {
        method: 'POST',
        headers: getHeaders(),
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setImportProgress('❌ ' + (data.error || 'فشل الاستيراد'));
        return;
      }
      setImportProgress('');
      setImportResult(data);
      setImportFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchAll();
    } catch {
      setImportProgress('❌ خطأ في الاتصال');
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل تريد حذف هذا السؤال؟')) return;
    await fetch(`/api/question-bank?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    setQuestions(questions.filter(q => q.id !== id));
  };

  const filtered = questions.filter(q => {
    if (filterDiff && q.difficulty !== filterDiff) return false;
    if (filterSemester && q.semester !== filterSemester) return false;
    if (filterLesson && !q.lesson?.includes(filterLesson)) return false;
    if (filterTrack && q.track !== filterTrack) return false;
    if (search && !q.question_text?.includes(search) && !q.text_ar?.includes(search)) return false;
    return true;
  });

  const lessons = [...new Set(questions.map(q => q.lesson).filter(Boolean))];
  const canEdit = ['super_admin', 'owner', 'admin', 'teacher'].includes(user?.role);

  const s = {
    page: { minHeight: '100vh', background: '#06060E', fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif', direction: 'rtl' as const, padding: '24px' },
    btn: (color: string) => ({ padding: '10px 20px', background: `${color}20`, border: `1px solid ${color}50`, borderRadius: '8px', color: color, fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }),
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,162,39,0.1)', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
    input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', direction: 'rtl' as const, marginBottom: '12px', boxSizing: 'border-box' as const, fontFamily: 'IBM Plex Sans Arabic, sans-serif' },
    label: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginBottom: '4px', display: 'block' },
    modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalBox: { background: '#06060E', border: '1px solid rgba(201,162,39,0.3)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' as const },
  };

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ color: '#C9A227', fontSize: '24px', fontWeight: 800 }}>📚 بنك الأسئلة</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>{questions.length} سؤال</div>
        </div>
        {canEdit && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={s.btn('#C9A227')} onClick={() => setShowImport(true)}>📥 استيراد Excel</button>
            <button style={s.btn('#10B981')} onClick={() => setShowAdd(true)}>➕ إضافة سؤال</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'إجمالي', value: stats.total || questions.length, color: '#C9A227' },
          { label: 'سهل', value: stats.easy || questions.filter(q => q.difficulty === 'easy').length, color: '#10B981' },
          { label: 'متوسط', value: stats.medium || questions.filter(q => q.difficulty === 'medium').length, color: '#F59E0B' },
          { label: 'صعب', value: stats.hard || questions.filter(q => q.difficulty === 'hard').length, color: '#EF4444' },
          { label: 'محلل بالذكاء الاصطناعي', value: stats.ai_analyzed || 0, color: '#8B5CF6' },
        ].map((st, i) => (
          <div key={i} style={{ background: `${st.color}15`, border: `1px solid ${st.color}30`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: st.color }}>{st.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '4px' }}>{st.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'rtl', flex: 1, minWidth: '200px', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} placeholder="🔍 ابحث في الأسئلة..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'rtl' }} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
          <option value="">كل المستويات</option>
          <option value="easy">🟢 سهل</option>
          <option value="medium">🟡 متوسط</option>
          <option value="hard">🔴 صعب</option>
        </select>
        <select style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'rtl' }} value={filterSemester} onChange={e => setFilterSemester(e.target.value)}>
          <option value="">كل الفصول</option>
          <option value="1">الفصل الأول</option>
          <option value="2">الفصل الثاني</option>
        </select>
        <select style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'rtl' }} value={filterTrack} onChange={e => setFilterTrack(e.target.value)}>
          <option value="">كل المسارات</option>
          <option value="عام">عام (ابتدائي / متوسط)</option>
          <option value="مشترك (جميع المسارات)">أول ثانوي — مشترك</option>
          <option value="المسار العام">المسار العام</option>
          <option value="مسار علوم الحاسب والهندسة">علوم الحاسب والهندسة</option>
          <option value="مسار الصحة والحياة">الصحة والحياة</option>
          <option value="مسار إدارة الأعمال">إدارة الأعمال</option>
          <option value="المسار الشرعي">المسار الشرعي</option>
        </select>
        <select style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none', direction: 'rtl' }} value={filterLesson} onChange={e => setFilterLesson(e.target.value)}>
          <option value="">كل الدروس</option>
          {lessons.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '16px' }}>عرض {filtered.length} من {questions.length} سؤال</div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#C9A227', padding: '40px' }}>جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <div>لا توجد أسئلة. ابدأ بإضافة أسئلة أو استيراد ملف Excel</div>
        </div>
      ) : (
        filtered.map((q, i) => {
          const diff = diffConfig[q.difficulty] || diffConfig.medium;
          let opts: string[] = [];
          try { opts = Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]'); } catch {}
          return (
            <div key={q.id || i} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontSize: '15px', fontWeight: 600, marginBottom: '10px', lineHeight: 1.6 }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '8px', fontSize: '13px' }}>{i + 1}.</span>
                    {q.question_text || q.text_ar}
                  </div>
                  {opts.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {opts.map((opt: string, oi: number) => (
                        <span key={oi} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '13px', background: opt === q.correct_answer ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: opt === q.correct_answer ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)', color: opt === q.correct_answer ? '#10B981' : 'rgba(255,255,255,0.7)' }}>
                          {['أ', 'ب', 'ج', 'د'][oi]}. {opt}{opt === q.correct_answer && ' ✓'}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', background: `${diff.color}20`, border: `1px solid ${diff.color}40`, color: diff.color }}>{diff.icon} {diff.label}</span>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', background: 'rgba(107,114,128,0.2)', border: '1px solid rgba(107,114,128,0.4)', color: '#9CA3AF' }}>{typeLabels[q.question_type] || q.question_type}</span>
                    {q.lesson && <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6' }}>📖 {q.lesson}</span>}
                    {q.semester && <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#3B82F6' }}>الفصل {q.semester}</span>}
                    {q.ai_analyzed && <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '11px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#8B5CF6' }}>🤖 AI</span>}
                  </div>
                  {q.explanation && <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>💡 {q.explanation}</div>}
                </div>
                {canEdit && <button onClick={() => handleDelete(q.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '16px', padding: '4px', flexShrink: 0 }}>🗑️</button>}
              </div>
            </div>
          );
        })
      )}

      {showAdd && (
        <div style={s.modal} onClick={() => setShowAdd(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ color: '#C9A227', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>➕ إضافة سؤال جديد</div>
            {msg && <div style={{ color: msg.includes('✅') ? '#10B981' : '#EF4444', marginBottom: '12px', fontSize: '14px' }}>{msg}</div>}
            <label style={s.label}>نص السؤال *</label>
            <textarea style={{ ...s.input, minHeight: '80px', resize: 'vertical' }} placeholder="اكتب السؤال هنا..." value={form.question_text} onChange={e => setForm({ ...form, question_text: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={s.label}>نوع السؤال</label>
                <select style={{ ...s.input, marginBottom: 0 }} value={form.question_type} onChange={e => setForm({ ...form, question_type: e.target.value })}>
                  <option value="mcq">اختيار من متعدد</option>
                  <option value="true_false">صح وخطأ</option>
                  <option value="essay">مقالي</option>
                  <option value="fill_blank">أكمل الفراغ</option>
                </select>
              </div>
              <div>
                <label style={s.label}>مستوى الصعوبة</label>
                <select style={{ ...s.input, marginBottom: 0 }} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">🟢 سهل</option>
                  <option value="medium">🟡 متوسط</option>
                  <option value="hard">🔴 صعب</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={s.label}>الدرس</label>
                <input style={{ ...s.input, marginBottom: 0 }} placeholder="الدرس أو الوحدة" value={form.lesson} onChange={e => setForm({ ...form, lesson: e.target.value })} />
              </div>
              <div>
                <label style={s.label}>الفصل الدراسي</label>
                <select style={{ ...s.input, marginBottom: 0 }} value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
                  <option value="1">الفصل الأول</option>
                  <option value="2">الفصل الثاني</option>
                  <option value="3">الفصل الثالث</option>
                </select>
              </div>
            </div>
            {form.question_type === 'mcq' && (
              <div style={{ marginTop: '12px' }}>
                <label style={s.label}>الخيارات</label>
                {['أ', 'ب', 'ج', 'د'].map((letter, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#C9A227', width: '20px', flexShrink: 0 }}>{letter}</span>
                    <input style={{ ...s.input, marginBottom: 0, flex: 1 }} placeholder={`الخيار ${letter}`} value={form.options[i]} onChange={e => { const opts = [...form.options]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} />
                  </div>
                ))}
                <label style={s.label}>الإجابة الصحيحة</label>
                <select style={s.input} value={form.correct_answer} onChange={e => setForm({ ...form, correct_answer: e.target.value })}>
                  <option value="">اختر الإجابة الصحيحة</option>
                  {form.options.filter(o => o.trim()).map((opt, i) => (
                    <option key={i} value={opt}>{['أ', 'ب', 'ج', 'د'][i]}. {opt}</option>
                  ))}
                </select>
              </div>
            )}
            <label style={s.label}>الشرح (اختياري)</label>
            <input style={s.input} placeholder="شرح الإجابة..." value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button style={s.btn('#6B7280')} onClick={() => setShowAdd(false)}>إلغاء</button>
              <button style={s.btn('#10B981')} onClick={handleAdd} disabled={saving}>{saving ? 'جاري الحفظ...' : '✅ حفظ السؤال'}</button>
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <div style={s.modal} onClick={() => !importing && setShowImport(false)}>
          <div style={{...s.modalBox, maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
            <div style={{ color: '#C9A227', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>📥 استيراد أسئلة من Excel</div>

            {/* إعدادات الاستيراد */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>المرحلة الدراسية</label>
                <select value={importStage} onChange={e => {
                  setImportStage(e.target.value);
                  if (e.target.value === 'الابتدائية') { setImportGrade('الأول الابتدائي'); setImportTrack('عام'); }
                  else if (e.target.value === 'المتوسطة') { setImportGrade('الأول المتوسط'); setImportTrack('عام'); }
                  else { setImportGrade('أول ثانوي (مشترك)'); setImportTrack('مشترك (جميع المسارات)'); }
                }}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '13px' }}>
                  <option value="الابتدائية">الابتدائية</option>
                  <option value="المتوسطة">المتوسطة</option>
                  <option value="الثانوية">الثانوية</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>الصف الدراسي *</label>
                <select value={importGrade} onChange={e => setImportGrade(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '13px' }}>
                  {importStage === 'الابتدائية' && ['الأول الابتدائي','الثاني الابتدائي','الثالث الابتدائي','الرابع الابتدائي','الخامس الابتدائي','السادس الابتدائي'].map(g => <option key={g} value={g}>{g}</option>)}
                  {importStage === 'المتوسطة' && ['الأول المتوسط','الثاني المتوسط','الثالث المتوسط'].map(g => <option key={g} value={g}>{g}</option>)}
                  {importStage === 'الثانوية' && ['أول ثانوي (مشترك)','ثاني ثانوي','ثالث ثانوي'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>المسار الدراسي</label>
                <select value={importTrack} onChange={e => setImportTrack(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '13px' }}>
                  {importStage !== 'الثانوية' && <option value="عام">عام</option>}
                  {importStage === 'الثانوية' && <>
                    <option value="مشترك (جميع المسارات)">مشترك (جميع المسارات)</option>
                    <option value="المسار العام">المسار العام</option>
                    <option value="مسار علوم الحاسب والهندسة">علوم الحاسب والهندسة</option>
                    <option value="مسار الصحة والحياة">الصحة والحياة</option>
                    <option value="مسار إدارة الأعمال">إدارة الأعمال</option>
                    <option value="المسار الشرعي">المسار الشرعي</option>
                  </>
                  }
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>المادة الدراسية *</label>
                <select value={importSubject} onChange={e => setImportSubject(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: '#f1f5f9', fontSize: '13px' }}>
                  {['لغتي الخالدة','الرياضيات','العلوم','الدراسات الإسلامية','القرآن الكريم','اللغة الإنجليزية','التربية الوطنية','التاريخ','الجغرافيا','الفيزياء','الكيمياء','الأحياء','علم البيانات','الهندسة','مبادئ المحاسبة','مبادئ الإدارة','الاقتصاد','التفسير وعلوم القرآن','الحديث وعلومه','الفقه وأصوله','أخرى'].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* خيار الاستبدال */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px', padding: '10px', borderRadius: '8px', background: importReplace ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${importReplace ? '#ef4444' : '#334155'}` }}>
              <input type="checkbox" checked={importReplace} onChange={e => setImportReplace(e.target.checked)} style={{ width: '15px', height: '15px', accentColor: '#ef4444' }} />
              <div>
                <div style={{ color: '#f1f5f9', fontSize: '13px' }}>استبدال الأسئلة الموجودة لهذه المادة والصف</div>
                <div style={{ color: '#64748b', fontSize: '11px' }}>سيتم حذف الأسئلة القديمة قبل الاستيراد</div>
              </div>
            </label>

            {/* منطقة رفع الملف */}
            <div
              style={{ border: `2px dashed ${importFile ? '#22c55e' : 'rgba(201,162,39,0.4)'}`, borderRadius: '12px', padding: '28px', textAlign: 'center', cursor: 'pointer', background: importFile ? 'rgba(34,197,94,0.05)' : 'transparent', marginBottom: '16px' }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
            >
              {importFile ? (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '6px' }}>✅</div>
                  <div style={{ color: '#22c55e', fontWeight: 600, fontSize: '14px' }}>{importFile.name}</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>{(importFile.size/1024).toFixed(1)} KB - انقر لتغيير الملف</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontSize: '14px', color: '#C9A227', fontWeight: 600 }}>اسحب ملف Excel هنا أو انقر للاختيار</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>يدعم: .xlsx, .xls - جميع هياكل ملفات متين</div>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} disabled={importing} />
            </div>

            {/* رسالة الحالة */}
            {importProgress && (
              <div style={{ background: importProgress.includes('❌') ? 'rgba(239,68,68,0.1)' : 'rgba(201,162,39,0.1)', border: `1px solid ${importProgress.includes('❌') ? '#ef4444' : '#C9A227'}40`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: importProgress.includes('❌') ? '#ef4444' : '#C9A227', fontSize: '13px' }}>
                {importProgress}
              </div>
            )}

            {/* نتائج الاستيراد */}
            {importResult && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ color: '#22c55e', fontWeight: 700, marginBottom: '12px', fontSize: '14px' }}>✅ {importResult.message}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '12px' }}>
                  {[['الكل', importResult.bankStats?.total, '#3b82f6'],['سهل', importResult.bankStats?.easy, '#22c55e'],['متوسط', importResult.bankStats?.medium, '#f59e0b'],['صعب', importResult.bankStats?.hard, '#ef4444']].map(([l,v,c]) => (
                    <div key={l as string} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px', textAlign: 'center' }}>
                      <div style={{ color: c as string, fontSize: '18px', fontWeight: 700 }}>{v}</div>
                      <div style={{ color: '#94a3b8', fontSize: '10px' }}>{l}</div>
                    </div>
                  ))}
                </div>
                {importResult.sheets?.map((sh: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', marginBottom: '4px' }}>
                    <span style={{ color: '#f1f5f9', fontSize: '12px' }}>{sh.sheet}</span>
                    <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>+{sh.imported} سؤال</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button style={s.btn('#6B7280')} onClick={() => { setShowImport(false); setImportResult(null); setImportFile(null); setImportProgress(''); }} disabled={importing}>إغلاق</button>
              <button style={s.btn('#C9A227')} onClick={handleImport} disabled={importing || !importFile}>
                {importing ? '⏳ جاري الاستيراد...' : '📥 استيراد الأسئلة'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
