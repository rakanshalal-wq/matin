'use client';
export const dynamic = 'force-dynamic';
import { BarChart3, BookOpen, Bot, Calendar, Check, CheckCircle, Circle, ClipboardList, Eye, FileText, GraduationCap, HelpCircle, Landmark, Link as LinkIcon, Megaphone, Pencil, Percent, Plus, Save, Settings, Sparkles, Trash2, Users, X, XCircle } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
 DRAFT: { label: 'مسودة', color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' },
 PUBLISHED: { label: 'منشور', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
 ACTIVE: { label: 'جاري الآن', color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
 COMPLETED: { label: 'منتهي', color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
 CANCELLED: { label: 'ملغي', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
};

const QUESTION_TYPES = [
 { value: 'MCQ', label: 'اختيار من متعدد', icon: "ICON_Circle" },
 { value: 'TRUE_FALSE', label: 'صح أو خطأ', icon: "ICON_CheckCircle" },
 { value: 'SHORT_ANSWER', label: 'إجابة قصيرة', icon: '<Pencil size={16} />' },
 { value: 'ESSAY', label: 'مقالي', icon: "ICON_FileText" },
 { value: 'FILL_BLANK', label: 'ملء الفراغ', icon: "ICON_ClipboardList" },
 { value: 'MATCHING', label: 'مطابقة', icon: "ICON_Link" },
];

export default function SmartExamsPage() {
 const [tab, setTab] = useState<'list' | 'create' | 'results' | 'bank'>('list');
 const [exams, setExams] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedExam, setSelectedExam] = useState<any>(null);
 const [showModal, setShowModal] = useState(false);
 const [modalType, setModalType] = useState<'create' | 'view' | 'results' | 'ai_generate' | 'edit'>('create');

 // ── Edit exam state ──
 const [editForm, setEditForm] = useState({ title_ar: '', subject: '', grade: '', duration: 60, total_marks: 100, pass_marks: 50, instructions: '', status: 'DRAFT' });
 const [editLoading, setEditLoading] = useState(false);
 const [editErr, setEditErr] = useState('');
 const [editOk, setEditOk] = useState('');

 // نموذج إنشاء الاختبار
 const [form, setForm] = useState({
 title_ar: '', subject: '', grade: '', duration: 60,
 total_marks: 100, pass_marks: 50, instructions: '',
 scheduled_at: '', status: 'DRAFT', allow_review: true,
 shuffle_questions: false, show_answers_after: false,
 ai_proctoring: false, time_limit_per_question: false,
 });

 // توليد أسئلة بالذكاء الاصطناعي
 const [aiForm, setAiForm] = useState({
 subject: '', topic: '', grade: '', count: 10,
 difficulty: 'medium', types: ['MCQ'],
 language: 'ar',
 });
 const [aiLoading, setAiLoading] = useState(false);
 const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

 // الأسئلة اليدوية
 const [questions, setQuestions] = useState<any[]>([]);
 const [currentQ, setCurrentQ] = useState({
 type: 'MCQ', text: '', marks: 5, options: ['', '', '', ''], correct_answer: '0',
 explanation: '', difficulty: 'medium',
 });

 // نتائج الاختبار
 const [results, setResults] = useState<any[]>([]);

 useEffect(() => { fetchExams(); }, []);

 const fetchExams = async () => {
 try {
 const res = await fetch('/api/exams', { headers: getHeaders() });
 const data = await res.json();
 setExams(Array.isArray(data) ? data : []);
 } catch { } finally { setLoading(false); }
 };

 const fetchResults = async (examId: number) => {
 try {
 const res = await fetch(`/api/exams/${examId}/results`, { headers: getHeaders() });
 const data = await res.json();
 setResults(Array.isArray(data) ? data : []);
 } catch { }
 };

 const createExam = async () => {
 if (!form.title_ar) return alert('أدخل عنوان الاختبار');
 try {
 const res = await fetch('/api/exams', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ ...form, questions }),
 });
 if (res.ok) { fetchExams(); setTab('list'); setQuestions([]); setForm({ ...form, title_ar: '', subject: '' }); alert('<CheckCircle size={18} color="#10B981" /> تم إنشاء الاختبار'); }
 else { const e = await res.json(); alert(e.error || 'خطأ'); }
 } catch { alert('خطأ في الاتصال'); }
 };

 const generateWithAI = async () => {
 if (!aiForm.subject || !aiForm.topic) return alert('أدخل المادة والموضوع');
 setAiLoading(true);
 try {
 const res = await fetch('/api/exams/ai-generate', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify(aiForm),
 });
 const data = await res.json();
 if (data.questions) {
 setGeneratedQuestions(data.questions);
 setQuestions(prev => [...prev, ...data.questions]);
 } else { alert(data.error || 'فشل التوليد'); }
 } catch { alert('خطأ في الاتصال'); } finally { setAiLoading(false); }
 };

 const updateExamStatus = async (id: number, status: string) => {
 try {
 await fetch(`/api/exams/${id}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ status }) });
 fetchExams();
 } catch { }
 };

 const deleteExam = async (id: number) => {
 if (!confirm('هل تريد حذف هذا الاختبار؟')) return;
 try {
 await fetch(`/api/exams/${id}`, { method: 'DELETE', headers: getHeaders() });
 fetchExams();
 } catch { }
 };

 const openEditModal = (exam: any) => {
 setSelectedExam(exam);
 setEditForm({ title_ar: exam.title_ar || exam.title || '', subject: exam.subject || '', grade: exam.grade || '', duration: exam.duration || 60, total_marks: exam.total_marks || 100, pass_marks: exam.pass_marks || 50, instructions: exam.instructions || '', status: exam.status || 'DRAFT' });
 setEditErr(''); setEditOk('');
 setModalType('edit'); setShowModal(true);
 };

 const handleUpdateExam = async () => {
 if (!editForm.title_ar.trim()) { setEditErr('عنوان الاختبار مطلوب'); return; }
 setEditLoading(true); setEditErr(''); setEditOk('');
 try {
 const res = await fetch(`/api/exams/${selectedExam?.id}`, {
 method: 'PUT',
 headers: getHeaders(),
 body: JSON.stringify(editForm),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل تحديث الاختبار');
 setEditOk('تم تحديث الاختبار بنجاح');
 setTimeout(() => { setShowModal(false); setEditOk(''); fetchExams(); }, 1500);
 } catch (e: any) { setEditErr(e.message); }
 finally { setEditLoading(false); }
 };

 const addQuestion = () => {
 if (!currentQ.text) return alert('أدخل نص السؤال');
 setQuestions(prev => [...prev, { ...currentQ, id: Date.now() }]);
 setCurrentQ({ type: 'MCQ', text: '', marks: 5, options: ['', '', '', ''], correct_answer: '0', explanation: '', difficulty: 'medium' });
 };

 return (
 <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>

 {/* الهيدر */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}><IconRenderer name="ICON_FileText" size={18} /> الاختبارات الذكية</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>إنشاء وإدارة الاختبارات مع دعم الذكاء الاصطناعي</p>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={() => { setModalType('ai_generate'); setShowModal(true); }} style={{
 background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
 color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
 }}>
 Bot توليد بالذكاء الاصطناعي
 </button>
 <button onClick={() => setTab('create')} style={{
 background: 'linear-gradient(135deg, #C9A227, #f0c040)',
 color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
 }}>
 + إنشاء اختبار
 </button>
 </div>
 </div>

 {/* التبويبات */}
 <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
 {[
 { key: 'list', label: 'ClipboardList الاختبارات', count: exams.length },
 { key: 'create', label: 'Plus إنشاء اختبار', count: null },
 { key: 'bank', label: 'Landmark بنك الأسئلة', count: null },
 { key: 'results', label: '[BarChart3] النتائج والتحليل', count: null },
 ].map(t => (
 <button key={t.key} onClick={() => setTab(t.key as any)} style={{
 background: tab === t.key ? 'rgba(201,162,39,0.2)' : 'transparent',
 color: tab === t.key ? '#C9A227' : '#9CA3AF',
 border: tab === t.key ? '1px solid rgba(201,162,39,0.3)' : '1px solid transparent',
 padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
 display: 'flex', alignItems: 'center', gap: 6,
 }}>
 {t.label}
 {t.count !== null && <span style={{ background: 'rgba(201,162,39,0.2)', color: '#C9A227', fontSize: 11, padding: '1px 6px', borderRadius: 10 }}>{t.count}</span>}
 </button>
 ))}
 </div>

 {}
 {/* قائمة الاختبارات */}
 {}
 {tab === 'list' && (
 <div>
 {/* إحصائيات سريعة */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الاختبارات', value: exams.length, icon: "ICON_FileText", color: '#3B82F6' },
 { label: 'جاري الآن', value: exams.filter(e => e.status === 'ACTIVE').length, icon: '⏱', color: '#EF4444' },
 { label: 'منشور', value: exams.filter(e => e.status === 'PUBLISHED').length, icon: "ICON_Megaphone", color: '#3B82F6' },
 { label: 'منتهي', value: exams.filter(e => e.status === 'COMPLETED').length, icon: "ICON_CheckCircle", color: '#10B981' },
 ].map((s, i) => (
 <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 14, padding: '16px 20px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ color: '#9CA3AF', fontSize: 12 }}>{s.label}</div>
 <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
 </div>
 <span style={{ fontSize: 28 }}><IconRenderer name={s.icon} /></span>
 </div>
 </div>
 ))}
 </div>

 {loading ? (
 <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>⏳ جاري التحميل...</div>
 ) : exams.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><FileText size={36} color="#C9A227" /></div>
 <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>لا توجد اختبارات بعد</div>
 <div style={{ color: '#9CA3AF', marginTop: 8 }}>أنشئ اختبارك الأول أو استخدم الذكاء الاصطناعي</div>
 <button onClick={() => setTab('create')} style={{ marginTop: 20, background: '#C9A227', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
 + إنشاء اختبار
 </button>
 </div>
 ) : (
 <div style={{ display: 'grid', gap: 16 }}>
 {exams.map((exam: any) => {
 const st = STATUS_MAP[exam.status] || STATUS_MAP.DRAFT;
 return (
 <div key={exam.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
 <div style={{ flex: 1 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
 <span style={{ background: st.bg, color: st.color, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>{st.label}</span>
 {exam.ai_generated && <span style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}><IconRenderer name="ICON_Bot" size={18} /> AI</span>}
 {exam.ai_proctoring && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}><IconRenderer name="ICON_Eye" size={18} /> مراقبة AI</span>}
 </div>
 <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>{exam.title_ar || exam.title}</h3>
 <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
 {exam.subject && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_BookOpen" size={18} /> {exam.subject}</span>}
 {exam.grade && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_GraduationCap" size={18} /> {exam.grade}</span>}
 {exam.duration && <span style={{ color: '#9CA3AF', fontSize: 13 }}>⏱ {exam.duration} دقيقة</span>}
 {exam.total_marks && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_BadgeDollarSign" size={18} /> {exam.total_marks} درجة</span>}
 {exam.questions_count !== undefined && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_HelpCircle" size={18} /> {exam.questions_count} سؤال</span>}
 {exam.scheduled_at && <span style={{ color: '#9CA3AF', fontSize: 13 }}><IconRenderer name="ICON_Calendar" size={18} /> {new Date(exam.scheduled_at).toLocaleDateString('ar-SA')}</span>}
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
 {exam.status === 'DRAFT' && (
 <button onClick={() => updateExamStatus(exam.id, 'PUBLISHED')} style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Megaphone" size={18} /> نشر</button>
 )}
 {exam.status === 'PUBLISHED' && (
 <button onClick={() => updateExamStatus(exam.id, 'ACTIVE')} style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}> تشغيل</button>
 )}
 {exam.status === 'ACTIVE' && (
 <button onClick={() => updateExamStatus(exam.id, 'COMPLETED')} style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>⏹ إنهاء</button>
 )}
 <button onClick={() => { setSelectedExam(exam); fetchResults(exam.id); setModalType('results'); setShowModal(true); }} style={{ background: 'rgba(201,162,39,0.15)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_BarChart3" size={18} /> النتائج</button>
 <button onClick={() => openEditModal(exam)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.25)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل</button>
 <button onClick={() => deleteExam(exam.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Trash2</button>
 </div>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {}
 {/* إنشاء اختبار */}
 {}
 {tab === 'create' && (
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

 {/* معلومات الاختبار */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
 <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_ClipboardList" size={18} /> معلومات الاختبار</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 {[
 { label: 'عنوان الاختبار *', key: 'title_ar', placeholder: 'مثال: اختبار الفصل الأول - رياضيات' },
 { label: 'المادة', key: 'subject', placeholder: 'مثال: الرياضيات' },
 { label: 'الصف / المرحلة', key: 'grade', placeholder: 'مثال: الصف الثالث' },
 ].map(f => (
 <div key={f.key}>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
 placeholder={f.placeholder}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 ))}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>المدة (دقيقة)</label>
 <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>الدرجة الكلية</label>
 <input type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: +e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>درجة النجاح</label>
 <input type="number" value={form.pass_marks} onChange={e => setForm({ ...form, pass_marks: +e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>تاريخ الاختبار</label>
 <input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>التعليمات</label>
 <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })}
 placeholder="تعليمات الاختبار للطلاب..." rows={3}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
 </div>
 {/* خيارات متقدمة */}
 <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 10, padding: '14px' }}>
 <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 700, marginBottom: 10 }}> خيارات متقدمة</div>
 {[
 { key: 'shuffle_questions', label: 'ترتيب عشوائي للأسئلة' },
 { key: 'allow_review', label: 'السماح بمراجعة الإجابات' },
 { key: 'show_answers_after', label: 'عرض الإجابات بعد الانتهاء' },
 { key: 'ai_proctoring', label: 'Bot تفعيل المراقبة بالذكاء الاصطناعي' },
 ].map(opt => (
 <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
 <input type="checkbox" checked={(form as any)[opt.key]} onChange={e => setForm({ ...form, [opt.key]: e.target.checked })} />
 <span style={{ color: '#E2E8F0', fontSize: 13 }}>{opt.label}</span>
 </label>
 ))}
 </div>
 </div>
 </div>

 {/* إضافة الأسئلة */}
 <div>
 {/* توليد AI */}
 <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 16, padding: '20px', marginBottom: 16 }}>
 <h3 style={{ color: '#A78BFA', fontSize: 15, fontWeight: 700, marginBottom: 14 }}><IconRenderer name="ICON_Bot" size={18} /> توليد أسئلة بالذكاء الاصطناعي</h3>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
 <input value={aiForm.subject} onChange={e => setAiForm({ ...aiForm, subject: e.target.value })} placeholder="المادة *"
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#fff', fontSize: 13 }} />
 <input value={aiForm.topic} onChange={e => setAiForm({ ...aiForm, topic: e.target.value })} placeholder="الموضوع *"
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#fff', fontSize: 13 }} />
 <input value={aiForm.grade} onChange={e => setAiForm({ ...aiForm, grade: e.target.value })} placeholder="الصف"
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#fff', fontSize: 13 }} />
 <select value={aiForm.difficulty} onChange={e => setAiForm({ ...aiForm, difficulty: e.target.value })}
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: '#1a1a3a', color: '#fff', fontSize: 13 }}>
 <option value="easy">سهل</option>
 <option value="medium">متوسط</option>
 <option value="hard">صعب</option>
 <option value="mixed">مختلط</option>
 </select>
 </div>
 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <input type="number" value={aiForm.count} onChange={e => setAiForm({ ...aiForm, count: +e.target.value })} min={1} max={50}
 style={{ width: 80, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.1)', color: '#fff', fontSize: 13 }} />
 <span style={{ color: '#9CA3AF', fontSize: 13 }}>سؤال</span>
 <button onClick={generateWithAI} disabled={aiLoading} style={{
 flex: 1, background: aiLoading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7C3AED, #A78BFA)',
 color: '#fff', border: 'none', padding: '9px', borderRadius: 8, cursor: aiLoading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700,
 }}>
 {aiLoading ? '⏳ جاري التوليد...' : 'Sparkles توليد الأسئلة'}
 </button>
 </div>
 {generatedQuestions.length > 0 && (
 <div style={{ marginTop: 10, color: '#10B981', fontSize: 13 }}><IconRenderer name="ICON_CheckCircle" size={18} /> تم توليد {generatedQuestions.length} سؤال وإضافتها للاختبار</div>
 )}
 </div>

 {/* إضافة سؤال يدوي */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px' }}>
 <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 14 }}><Pencil size={18} color="#6B7280" /><IconRenderer name="ICON_Plus" size={18} /> إضافة سؤال يدوي</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
 <select value={currentQ.type} onChange={e => setCurrentQ({ ...currentQ, type: e.target.value })}
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a2d4a', color: '#fff', fontSize: 13 }}>
 {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}><IconRenderer name={t.icon} /> {t.label}</option>)}
 </select>
 <textarea value={currentQ.text} onChange={e => setCurrentQ({ ...currentQ, text: e.target.value })}
 placeholder="نص السؤال *" rows={2}
 style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13, resize: 'vertical' }} />
 {currentQ.type === 'MCQ' && (
 <div>
 {currentQ.options.map((opt, i) => (
 <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
 <input type="radio" name="correct" checked={currentQ.correct_answer === String(i)} onChange={() => setCurrentQ({ ...currentQ, correct_answer: String(i) })} />
 <input value={opt} onChange={e => { const o = [...currentQ.options]; o[i] = e.target.value; setCurrentQ({ ...currentQ, options: o }); }}
 placeholder={`الخيار ${i + 1}`}
 style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 12 }} />
 </div>
 ))}
 </div>
 )}
 {currentQ.type === 'TRUE_FALSE' && (
 <div style={{ display: 'flex', gap: 10 }}>
 {['صح', 'خطأ'].map((v, i) => (
 <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
 <input type="radio" name="tf" checked={currentQ.correct_answer === v} onChange={() => setCurrentQ({ ...currentQ, correct_answer: v })} />
 <span style={{ color: '#E2E8F0', fontSize: 13 }}>{v}</span>
 </label>
 ))}
 </div>
 )}
 <div style={{ display: 'flex', gap: 8 }}>
 <input type="number" value={currentQ.marks} onChange={e => setCurrentQ({ ...currentQ, marks: +e.target.value })} min={1}
 placeholder="الدرجة"
 style={{ width: 80, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 13 }} />
 <select value={currentQ.difficulty} onChange={e => setCurrentQ({ ...currentQ, difficulty: e.target.value })}
 style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a2d4a', color: '#fff', fontSize: 13 }}>
 <option value="easy">سهل</option>
 <option value="medium">متوسط</option>
 <option value="hard">صعب</option>
 </select>
 <button onClick={addQuestion} style={{ background: '#10B981', color: '#fff', border: 'none', padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>+ إضافة</button>
 </div>
 </div>
 </div>

 {/* قائمة الأسئلة المضافة */}
 {questions.length > 0 && (
 <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '16px' }}>
 <div style={{ color: '#9CA3AF', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>الأسئلة المضافة ({questions.length})</div>
 {questions.map((q: any, i: number) => (
 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
 <div style={{ flex: 1 }}>
 <span style={{ color: '#9CA3AF', fontSize: 11, marginLeft: 8 }}>س{i + 1}</span>
 <span style={{ color: '#E2E8F0', fontSize: 13 }}>{q.text?.substring(0, 60)}{q.text?.length > 60 ? '...' : ''}</span>
 </div>
 <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
 <span style={{ color: '#C9A227', fontSize: 12 }}>{q.marks} درجة</span>
 <button onClick={() => setQuestions(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16 }}>×</button>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* زر الحفظ */}
 <button onClick={createExam} style={{
 width: '100%', marginTop: 16,
 background: 'linear-gradient(135deg, #C9A227, #f0c040)',
 color: '#fff', border: 'none', padding: '14px', borderRadius: 12,
 cursor: 'pointer', fontSize: 15, fontWeight: 700,
 }}>
 <Save size={18} color="#6B7280" /> حفظ الاختبار ({questions.length} سؤال)
 </button>
 </div>
 </div>
 )}

 {}
 {/* النتائج والتحليل */}
 {}
 {tab === 'results' && (
 <div>
 <div style={{ marginBottom: 20 }}>
 <label style={{ color: '#9CA3AF', fontSize: 13, marginLeft: 10 }}>اختر الاختبار:</label>
 <select onChange={e => { const ex = exams.find(x => x.id === +e.target.value); setSelectedExam(ex); if (ex) fetchResults(ex.id); }}
 style={{ padding: '9px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a2d4a', color: '#fff', fontSize: 13 }}>
 <option value="">-- اختر --</option>
 {exams.map(e => <option key={e.id} value={e.id}>{e.title_ar || e.title}</option>)}
 </select>
 </div>
 {selectedExam && results.length > 0 && (
 <div>
 {/* ملخص النتائج */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'المشاركون', value: results.length, icon: "ICON_Users", color: '#3B82F6' },
 { label: 'متوسط الدرجات', value: `${Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length)}%`, icon: "ICON_BarChart3", color: '#C9A227' },
 { label: 'الناجحون', value: results.filter(r => r.passed).length, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'الراسبون', value: results.filter(r => !r.passed).length, icon: "ICON_XCircle", color: '#EF4444' },
 ].map((s, i) => (
 <div key={i} style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 14, padding: '16px 20px' }}>
 <div style={{ color: '#9CA3AF', fontSize: 12 }}>{s.label}</div>
 <div style={{ color: '#fff', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
 <span style={{ fontSize: 20 }}><IconRenderer name={s.icon} /></span>
 </div>
 ))}
 </div>
 {/* جدول النتائج */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
 {['الطالب', 'الدرجة', 'النسبة', 'الوقت', 'الحالة', 'التاريخ'].map(h => (
 <th key={h} style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: 12, fontWeight: 700, textAlign: 'right' }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {results.map((r: any, i: number) => (
 <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
 <td style={{ padding: '12px 16px', color: '#E2E8F0', fontSize: 14 }}>{r.student_name || r.user_name || 'طالب'}</td>
 <td style={{ padding: '12px 16px', color: '#fff', fontSize: 14, fontWeight: 700 }}>{r.score || 0}/{selectedExam.total_marks}</td>
 <td style={{ padding: '12px 16px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
 <div style={{ width: `${Math.round((r.score / selectedExam.total_marks) * 100)}%`, height: '100%', background: r.passed ? '#10B981' : '#EF4444', borderRadius: 3 }} />
 </div>
 <span style={{ color: r.passed ? '#10B981' : '#EF4444', fontSize: 13, fontWeight: 700 }}>{Math.round((r.score / selectedExam.total_marks) * 100)}%</span>
 </div>
 </td>
 <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: 13 }}>{r.time_taken ? `${r.time_taken} دقيقة` : '-'}</td>
 <td style={{ padding: '12px 16px' }}>
 <span style={{ background: r.passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: r.passed ? '#10B981' : '#EF4444', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
 {r.passed ? 'Check ناجح' : 'X راسب'}
 </span>
 </td>
 <td style={{ padding: '12px 16px', color: '#9CA3AF', fontSize: 12 }}>{r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('ar-SA') : '-'}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 {selectedExam && results.length === 0 && (
 <div style={{ textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(107,114,128,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><Circle size={19} color="#6B7280" /></div>
 <div>لا توجد نتائج لهذا الاختبار بعد</div>
 </div>
 )}
 </div>
 )}

 {}
 {showModal && modalType === 'edit' && (
 <div style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={() => setShowModal(false)}>
 <div style={{ background:'#0F0F1A',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,width:'100%',maxWidth:540,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.6)',direction:'rtl',fontFamily:'IBM Plex Sans Arabic, sans-serif' }} onClick={e=>e.stopPropagation()}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
 <h3 style={{ color:'#EEEEF5',fontSize:17,fontWeight:700,margin:0 }}><IconRenderer name="ICON_Pencil" size={18} /> تعديل الاختبار</h3>
 <button onClick={() => setShowModal(false)} style={{ background:'rgba(255,255,255,0.05)',border:'none',borderRadius:8,padding:'6px 10px',cursor:'pointer',color:'rgba(238,238,245,0.6)',fontSize:16 }}>X</button>
 </div>
 <div style={{ padding:24 }}>
 {editErr && <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:12 }}>{editErr}</div>}
 {editOk && <div style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,padding:'10px 14px',color:'#10B981',fontSize:13,marginBottom:12 }}>{editOk}</div>}
 {[{label:'عنوان الاختبار *',key:'title_ar',placeholder:'مثال: اختبار الفصل الأول'},{label:'المادة',key:'subject',placeholder:'مثال: الرياضيات'},{label:'الصف',key:'grade',placeholder:'مثال: الصف الثالث'},{label:'التعليمات',key:'instructions',placeholder:'تعليمات للطلاب'}].map(f => (
 <div key={f.key} style={{ marginBottom:14 }}>
 <label style={{ display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 }}>{f.label}</label>
 <input value={(editForm as any)[f.key]} onChange={e => setEditForm(ef => ({...ef,[f.key]:e.target.value}))} placeholder={f.placeholder}
 style={{ width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }} />
 </div>
 ))}
 <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:14 }}>
 {[{label:'المدة (دقيقة)',key:'duration',type:'number'},{label:'الدرجة الكلية',key:'total_marks',type:'number'},{label:'درجة النجاح',key:'pass_marks',type:'number'}].map(f => (
 <div key={f.key}>
 <label style={{ display:'block',color:'rgba(238,238,245,0.7)',fontSize:12,fontWeight:600,marginBottom:5 }}>{f.label}</label>
 <input type={f.type} value={(editForm as any)[f.key]} onChange={e => setEditForm(ef => ({...ef,[f.key]:+e.target.value}))}
 style={{ width:'100%',padding:'9px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }} />
 </div>
 ))}
 </div>
 <div style={{ marginBottom:16 }}>
 <label style={{ display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 }}>الحالة</label>
 <select value={editForm.status} onChange={e => setEditForm(ef => ({...ef,status:e.target.value}))}
 style={{ width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' }}>
 <option value='DRAFT'>مسودة</option>
 <option value='PUBLISHED'>منشور</option>
 <option value='ACTIVE'>جاري الآن</option>
 <option value='COMPLETED'>منتهي</option>
 <option value='CANCELLED'>ملغي</option>
 </select>
 </div>
 <button onClick={handleUpdateExam} disabled={editLoading} style={{ width:'100%',padding:'11px',background:editLoading?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#C9A227,#f0c040)',border:'none',borderRadius:10,color:editLoading?'rgba(238,238,245,0.3)':'#000',cursor:editLoading?'not-allowed':'pointer',fontFamily:'inherit',fontWeight:700,fontSize:14 }}>
 {editLoading ? 'جارٍ التحديث...' : 'حفظ التعديلات'}
 </button>
 </div>
 </div>
 </div>
 )}

 </div>
 );
}
