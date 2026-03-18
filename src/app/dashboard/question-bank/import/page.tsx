'use client';
import IconRenderer from "@/components/IconRenderer";
import { AlertTriangle, BarChart3, BookOpen, CheckCircle, ClipboardList, Download, Settings, File } from "lucide-react";

import { useState, useRef } from 'react';
import Link from 'next/link';

// قائمة المواد الدراسية
const SUBJECTS = [
 'لغتي', 'الرياضيات', 'العلوم', 'الدراسات الإسلامية',
 'اللغة العربية', 'اللغة الإنجليزية', 'التربية الوطنية',
 'الحاسب الآلي', 'التربية الفنية', 'التربية البدنية',
 'الاجتماعيات', 'الفيزياء', 'الكيمياء', 'الأحياء',
 'التاريخ', 'الجغرافيا', 'أخرى',
];

// قائمة الصفوف الدراسية
const GRADES = [
 { value: '1', label: 'الصف الأول الابتدائي' },
 { value: '2', label: 'الصف الثاني الابتدائي' },
 { value: '3', label: 'الصف الثالث الابتدائي' },
 { value: '4', label: 'الصف الرابع الابتدائي' },
 { value: '5', label: 'الصف الخامس الابتدائي' },
 { value: '6', label: 'الصف السادس الابتدائي' },
 { value: '7', label: 'الصف الأول المتوسط' },
 { value: '8', label: 'الصف الثاني المتوسط' },
 { value: '9', label: 'الصف الثالث المتوسط' },
 { value: '10', label: 'الصف الأول الثانوي' },
 { value: '11', label: 'الصف الثاني الثانوي' },
 { value: '12', label: 'الصف الثالث الثانوي' },
];

interface ImportResult {
 success: boolean;
 message: string;
 imported: number;
 skipped: number;
 sheets: Array<{ sheet: string; imported: number; skipped: number; structure: string }>;
 bankStats: { total: string; easy: string; medium: string; hard: string };
 errors?: string[];
}

export default function ImportQuestionsPage() {
 const [subject, setSubject] = useState('');
 const [grade, setGrade] = useState('');
 const [replaceExisting, setReplaceExisting] = useState(false);
 const [file, setFile] = useState<File | null>(null);
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState<ImportResult | null>(null);
 const [error, setError] = useState('');
 const [dragOver, setDragOver] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleFileSelect = (selectedFile: File) => {
 if (!selectedFile.name.match(/\.(xlsx|xls)$/i)) {
 setError('يجب أن يكون الملف بصيغة Excel (.xlsx أو .xls)');
 return;
 }
 setFile(selectedFile);
 setError('');
 setResult(null);
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 setDragOver(false);
 const droppedFile = e.dataTransfer.files[0];
 if (droppedFile) handleFileSelect(droppedFile);
 };

 const handleImport = async () => {
 if (!file) { setError('يرجى اختيار ملف Excel'); return; }
 if (!subject) { setError('يرجى تحديد المادة الدراسية'); return; }
 if (!grade) { setError('يرجى تحديد الصف الدراسي'); return; }

 setLoading(true);
 setError('');
 setResult(null);

 try {
 const token = localStorage.getItem('token');
 const formData = new FormData();
 formData.append('file', file);
 formData.append('subject', subject);
 formData.append('grade', grade);
 formData.append('replace', replaceExisting.toString());

 const res = await fetch('/api/question-bank/import', {
 method: 'POST',
 headers: { Authorization: `Bearer ${token}` },
 body: formData,
 });

 const data = await res.json();
 if (!res.ok) {
 setError(data.error || 'فشل الاستيراد');
 } else {
 setResult(data);
 setFile(null);
 if (fileInputRef.current) fileInputRef.current.value = '';
 }
 } catch (err: any) {
 setError('خطأ في الاتصال: ' + err.message);
 } finally {
 setLoading(false);
 }
 };

 const structureLabel = (s: string) => {
 if (s === 'type1') return '12 عمود (مع مهارة)';
 if (s === 'type2') return '11 عمود (اختيار متعدد)';
 if (s === 'type3') return '9 أعمدة (صح/خطأ)';
 return s;
 };

 return (
 <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', direction: 'rtl' }}>
 {/* رأس الصفحة */}
 <div style={{ marginBottom: '24px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
 <Link href="/dashboard/question-bank" style={{
 color: '#94a3b8', textDecoration: 'none', fontSize: '14px',
 display: 'flex', alignItems: 'center', gap: '4px'
 }}>
 ← بنك الأسئلة
 </Link>
 </div>
 <h1 style={{ color: '#f1f5f9', fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
 Download استيراد أسئلة من Excel
 </h1>
 <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>
 ارفع ملف Excel من ملفات منصة متين التعليمية وستُضاف الأسئلة تلقائياً لبنك الأسئلة
 </p>
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
 {/* القسم الأيمن - الإعدادات والرفع */}
 <div>
 {/* إعدادات الاستيراد */}
 <div style={{
 background: '#1e293b', borderRadius: '12px', padding: '20px',
 border: '1px solid #334155', marginBottom: '16px'
 }}>
 <h3 style={{ color: '#f1f5f9', margin: '0 0 16px 0', fontSize: '16px' }}>
 <Settings size={16} /> إعدادات الاستيراد
 </h3>

 {/* المادة */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
 المادة الدراسية *
 </label>
 <select
 value={subject}
 onChange={e => setSubject(e.target.value)}
 style={{
 width: '100%', padding: '10px 12px', borderRadius: '8px',
 background: '#0f172a', border: '1px solid #334155',
 color: '#f1f5f9', fontSize: '14px', outline: 'none'
 }}
 >
 <option value="">اختر المادة...</option>
 {SUBJECTS.map(s => (
 <option key={s} value={s}>{s}</option>
 ))}
 </select>
 </div>

 {/* الصف */}
 <div style={{ marginBottom: '16px' }}>
 <label style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
 الصف الدراسي *
 </label>
 <select
 value={grade}
 onChange={e => setGrade(e.target.value)}
 style={{
 width: '100%', padding: '10px 12px', borderRadius: '8px',
 background: '#0f172a', border: '1px solid #334155',
 color: '#f1f5f9', fontSize: '14px', outline: 'none'
 }}
 >
 <option value="">اختر الصف...</option>
 {GRADES.map(g => (
 <option key={g.value} value={g.value}>{g.label}</option>
 ))}
 </select>
 </div>

 {/* خيار الاستبدال */}
 <label style={{
 display: 'flex', alignItems: 'center', gap: '10px',
 cursor: 'pointer', padding: '10px', borderRadius: '8px',
 background: replaceExisting ? '#1e3a5f' : 'transparent',
 border: `1px solid ${replaceExisting ? '#3b82f6' : '#334155'}`,
 transition: 'all 0.2s'
 }}>
 <input
 type="checkbox"
 checked={replaceExisting}
 onChange={e => setReplaceExisting(e.target.checked)}
 style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
 />
 <div>
 <div style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: '500' }}>
 استبدال الأسئلة الموجودة
 </div>
 <div style={{ color: '#64748b', fontSize: '11px' }}>
 سيتم حذف أسئلة نفس المادة والصف قبل الاستيراد
 </div>
 </div>
 </label>
 </div>

 {/* منطقة رفع الملف */}
 <div
 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
 onDragLeave={() => setDragOver(false)}
 onDrop={handleDrop}
 onClick={() => fileInputRef.current?.click()}
 style={{
 border: `2px dashed ${dragOver ? '#3b82f6' : file ? '#22c55e' : '#334155'}`,
 borderRadius: '12px', padding: '32px', textAlign: 'center',
 cursor: 'pointer', transition: 'all 0.2s',
 background: dragOver ? '#1e3a5f' : file ? '#0f2a1a' : '#1e293b',
 marginBottom: '16px'
 }}
 >
 <input
 ref={fileInputRef}
 type="file"
 accept=".xlsx,.xls"
 style={{ display: 'none' }}
 onChange={e => {
 const f = e.target.files?.[0];
 if (f) handleFileSelect(f);
 }}
 />
 {file ? (
 <>
 <div style={{ fontSize: '40px', marginBottom: '8px' }}><IconRenderer name="ICON_Check" size={18} />Circle</div>
 <div style={{ color: '#22c55e', fontWeight: 'bold', marginBottom: '4px' }}>
 {file.name}
 </div>
 <div style={{ color: '#64748b', fontSize: '12px' }}>
 {(file.size / 1024).toFixed(1)} KB
 </div>
 <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>
 انقر لتغيير الملف
 </div>
 </>
 ) : (
 <>
 <div style={{ fontSize: '48px', marginBottom: '12px' }}><IconRenderer name="ICON_BarChart3" size={18} />3</div>
 <div style={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '8px', fontSize: '15px' }}>
 اسحب ملف Excel هنا أو انقر للاختيار
 </div>
 <div style={{ color: '#64748b', fontSize: '12px' }}>
 يدعم: .xlsx و .xls
 </div>
 </>
 )}
 </div>

 {/* رسالة الخطأ */}
 {error && (
 <div style={{
 background: '#2d1b1b', border: '1px solid #ef4444', borderRadius: '8px',
 padding: '12px', color: '#ef4444', fontSize: '13px', marginBottom: '16px'
 }}>
 Alert<Triangle size={16} /> {error}
 </div>
 )}

 {/* زر الاستيراد */}
 <button
 onClick={handleImport}
 disabled={loading || !file || !subject || !grade}
 style={{
 width: '100%', padding: '14px', borderRadius: '10px',
 background: loading || !file || !subject || !grade
 ? '#334155' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
 color: loading || !file || !subject || !grade ? '#64748b' : 'white',
 border: 'none', cursor: loading || !file || !subject || !grade ? 'not-allowed' : 'pointer',
 fontSize: '15px', fontWeight: 'bold', transition: 'all 0.2s',
 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
 }}
 >
 {loading ? (
 <>
 <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
 جاري الاستيراد...
 </>
 ) : (
 <><IconRenderer name="ICON_Download" size={18} /> استيراد الأسئلة</>
 )}
 </button>
 </div>

 {/* القسم الأيسر - النتائج والتعليمات */}
 <div>
 {/* نتائج الاستيراد */}
 {result && (
 <div style={{
 background: '#0f2a1a', border: '1px solid #22c55e', borderRadius: '12px',
 padding: '20px', marginBottom: '16px'
 }}>
 <h3 style={{ color: '#22c55e', margin: '0 0 16px 0', fontSize: '16px' }}>
 CheckCircle {result.message}
 </h3>

 {/* إحصائيات الاستيراد */}
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
 {[
 { label: 'تم الاستيراد', value: result.imported, color: '#22c55e' },
 { label: 'تم التخطي', value: result.skipped, color: '#f59e0b' },
 ].map(stat => (
 <div key={stat.label} style={{
 background: '#1e293b', borderRadius: '8px', padding: '12px', textAlign: 'center'
 }}>
 <div style={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
 <div style={{ color: '#94a3b8', fontSize: '12px' }}>{stat.label}</div>
 </div>
 ))}
 </div>

 {/* إحصائيات البنك بعد الاستيراد */}
 {result.bankStats && (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
 BarChart3 إجمالي البنك بعد الاستيراد:
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
 {[
 { label: 'الكل', value: result.bankStats.total, color: '#3b82f6' },
 { label: 'سهل', value: result.bankStats.easy, color: '#22c55e' },
 { label: 'متوسط', value: result.bankStats.medium, color: '#f59e0b' },
 { label: 'صعب', value: result.bankStats.hard, color: '#ef4444' },
 ].map(s => (
 <div key={s.label} style={{
 background: '#0f172a', borderRadius: '6px', padding: '8px', textAlign: 'center'
 }}>
 <div style={{ color: s.color, fontSize: '18px', fontWeight: 'bold' }}>{s.value}</div>
 <div style={{ color: '#64748b', fontSize: '10px' }}>{s.label}</div>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* تفاصيل الأوراق */}
 {result.sheets && result.sheets.length > 0 && (
 <div>
 <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
 ClipboardList تفاصيل الاستيراد:
 </div>
 {result.sheets.map((s, i) => (
 <div key={i} style={{
 background: '#1e293b', borderRadius: '6px', padding: '8px 12px',
 marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
 }}>
 <span style={{ color: '#f1f5f9', fontSize: '13px' }}>{s.sheet}</span>
 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
 <span style={{ color: '#64748b', fontSize: '11px' }}>{structureLabel(s.structure)}</span>
 <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 'bold' }}>
 +{s.imported}
 </span>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* أخطاء */}
 {result.errors && result.errors.length > 0 && (
 <div style={{ marginTop: '12px' }}>
 <div style={{ color: '#f59e0b', fontSize: '12px', marginBottom: '6px' }}>
 Alert<Triangle size={16} /> تحذيرات:
 </div>
 {result.errors.map((e, i) => (
 <div key={i} style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '2px' }}>
 • {e}
 </div>
 ))}
 </div>
 )}

 {/* أزرار بعد الاستيراد */}
 <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
 <Link href="/dashboard/question-bank" style={{
 flex: 1, padding: '10px', borderRadius: '8px',
 background: '#1e3a5f', color: '#3b82f6', textDecoration: 'none',
 textAlign: 'center', fontSize: '13px', fontWeight: '500'
 }}>
 BookOpen عرض البنك
 </Link>
 <button
 onClick={() => { setResult(null); setFile(null); }}
 style={{
 flex: 1, padding: '10px', borderRadius: '8px',
 background: '#1e293b', color: '#94a3b8', border: '1px solid #334155',
 cursor: 'pointer', fontSize: '13px'
 }}
 >
 Download استيراد آخر
 </button>
 </div>
 </div>
 )}

 {/* تعليمات الاستخدام */}
 <div style={{
 background: '#1e293b', borderRadius: '12px', padding: '20px',
 border: '1px solid #334155'
 }}>
 <h3 style={{ color: '#f1f5f9', margin: '0 0 16px 0', fontSize: '15px' }}>
 [ClipboardList] تعليمات الاستخدام
 </h3>

 <div style={{ marginBottom: '16px' }}>
 <div style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
 هياكل الملفات المدعومة:
 </div>
 {[
 {
 title: 'الهيكل الكامل (12 عمود)',
 desc: '# | الوحدة | الدرس | النوع | الصعوبة | المهارة | السؤال | أ | ب | ج | د | الإجابة',
 color: '#22c55e'
 },
 {
 title: 'الهيكل المعياري (11 عمود)',
 desc: '# | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | ج | د | الإجابة',
 color: '#3b82f6'
 },
 {
 title: 'صح/خطأ (9 أعمدة)',
 desc: '# | القسم | الدرس | النوع | الصعوبة | السؤال | أ | ب | الإجابة',
 color: '#f59e0b'
 },
 ].map((h, i) => (
 <div key={i} style={{
 background: '#0f172a', borderRadius: '8px', padding: '10px 12px',
 marginBottom: '8px', borderRight: `3px solid ${h.color}`
 }}>
 <div style={{ color: h.color, fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
 {h.title}
 </div>
 <div style={{ color: '#64748b', fontSize: '11px', fontFamily: 'monospace' }}>
 {h.desc}
 </div>
 </div>
 ))}
 </div>

 <div>
 <div style={{ color: '#3b82f6', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
 ملاحظات مهمة:
 </div>
 {[
 'يمكن أن يحتوي الملف على أوراق متعددة (فصل أول، فصل ثاني)',
 'يُكتشف الفصل الدراسي تلقائياً من اسم الورقة',
 'مستويات الصعوبة: سهل، متوسط، صعب',
 'يتجاهل الصفوف الفارغة والرؤوس تلقائياً',
 'الإجابة الصحيحة: أ، ب، ج، أو د',
 ].map((note, i) => (
 <div key={i} style={{
 color: '#94a3b8', fontSize: '12px', marginBottom: '6px',
 display: 'flex', gap: '6px', alignItems: 'flex-start'
 }}>
 <span style={{ color: '#3b82f6', flexShrink: 0 }}>•</span>
 {note}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>

 <style>{`
 @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
 select option { background: #1e293b; color: #f1f5f9; }
 `}</style>
 </div>
 );
}
