'use client';
export const dynamic = 'force-dynamic';
import { AlertTriangle, BarChart3, BookOpen, Bot, Brain, CheckCircle, Circle, Dumbbell, GraduationCap, Package, RefreshCw, Search, Star, Triangle, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


const qualityConfig: Record<string, { color: string; bg: string; icon: string; desc: string }> = {
 'ممتاز': { color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: 'star', desc: 'سؤال مميز - معدل إجابة صحيحة مثالي' },
 'جيد - سهل': { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', icon: "ICON_CheckCircle", desc: 'سؤال جيد - مناسب للمراجعة' },
 'جيد - صعب': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: "ICON_Dumbbell", desc: 'سؤال تحدي - مناسب للطلاب المتقدمين' },
 'سهل جداً': { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: 'Alert<Triangle size={16} />', desc: 'سهل جداً - لا يميز بين الطلاب' },
 'صعب جداً': { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: "ICON_Circle", desc: 'صعب جداً - قد يكون مربكاً أو غامضاً' },
 'غير محلل': { color: '#6B7280', bg: 'rgba(107,114,128,0.1)', icon: '⏳', desc: 'يحتاج على الأقل 5 إجابات للتحليل' },
};

export default function QuestionAnalyticsPage() {
 const [user, setUser] = useState<any>(null);
 const [questions, setQuestions] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [analyzing, setAnalyzing] = useState(false);
 const [filterSubject, setFilterSubject] = useState('');
 const [filterGrade, setFilterGrade] = useState('');
 const [filterQuality, setFilterQuality] = useState('');
 const [search, setSearch] = useState('');
 const [msg, setMsg] = useState('');
 const [stats, setStats] = useState<any>({});

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 setUser(u);
 loadData();
 }, []);

 const loadData = async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams();
 if (filterSubject) params.set('subject', filterSubject);
 if (filterGrade) params.set('grade', filterGrade);
 
 const res = await fetch(`/api/question-bank/analyze?${params}`, { headers: getHeaders() });
 const data = await res.json();
 
 if (Array.isArray(data)) {
 setQuestions(data);
 // حساب الإحصائيات
 const s: any = { total: data.length, analyzed: 0, excellent: 0, easy: 0, hard: 0, veryEasy: 0, veryHard: 0 };
 data.forEach((q: any) => {
 if (q.quality_label !== 'غير محلل' && q.ai_analyzed) s.analyzed++;
 if (q.quality_label === 'ممتاز') s.excellent++;
 else if (q.quality_label === 'جيد - سهل') s.easy++;
 else if (q.quality_label === 'جيد - صعب') s.hard++;
 else if (q.quality_label === 'سهل جداً') s.veryEasy++;
 else if (q.quality_label === 'صعب جداً') s.veryHard++;
 });
 setStats(s);
 }
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const runAnalysis = async () => {
 setAnalyzing(true);
 setMsg('');
 try {
 const res = await fetch('/api/question-bank/analyze', {
 method: 'PUT',
 headers: getHeaders(),
 });
 const data = await res.json();
 if (data.success) {
 setMsg(`<CheckCircle size={18} color="#10B981" /> تم تحليل ${data.analyzed} سؤال بنجاح`);
 loadData();
 } else {
 setMsg('XCircle ' + (data.error || 'فشل التحليل'));
 }
 } catch (e) {
 setMsg('XCircle خطأ في الاتصال');
 }
 setAnalyzing(false);
 };

 // تصفية الأسئلة
 const filtered = questions.filter(q => {
 if (filterSubject && q.subject !== filterSubject) return false;
 if (filterGrade && q.grade !== filterGrade) return false;
 if (filterQuality && q.quality_label !== filterQuality) return false;
 if (search && !q.question_text?.includes(search)) return false;
 return true;
 });

 const subjects = [...new Set(questions.map((q: any) => q.subject).filter(Boolean))].sort();
 const grades = [...new Set(questions.map((q: any) => q.grade).filter(Boolean))].sort();

 if (loading) return (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
 <div style={{ textAlign: 'center' }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><IconRenderer name="ICON_Brain" size={36} /></div>
 <div style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 18 }}>جاري تحميل بيانات التحليل...</div>
 </div>
 </div>
 );

 return (
 <div>
 {/* Header */}
 <div style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 16, padding: '20px 24px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: 0 }}><IconRenderer name="ICON_Brain" size={18} /> تحليل جودة الأسئلة</h1>
 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '4px 0 0' }}>
 يحلل الذكاء الاصطناعي جودة كل سؤال بناءً على أداء الطلاب الفعلي
 </p>
 </div>
 {user?.role === 'super_admin' && (
 <button
 onClick={runAnalysis}
 disabled={analyzing}
 style={{ padding: '10px 20px', background: analyzing ? '#6B7280' : 'linear-gradient(135deg, #8B5CF6, #3B82F6)', color: 'white', border: 'none', borderRadius: 10, cursor: analyzing ? 'not-allowed' : 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 14 }}
 >
 {analyzing ? '⏳ جاري التحليل...' : 'RefreshCw إعادة تحليل جميع الأسئلة'}
 </button>
 )}
 </div>
 {msg && (
 <div style={{ marginTop: 12, padding: '8px 14px', background: msg.startsWith("ICON_CheckCircle") ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', borderRadius: 8, color: msg.startsWith("ICON_CheckCircle") ? '#10B981' : '#EF4444', fontSize: 14 }}>
 {msg}
 </div>
 )}
 </div>

 {/* إحصائيات سريعة */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
 {[
 { label: 'إجمالي الأسئلة', value: stats.total || 0, color: '#3B82F6', icon: "ICON_Package" },
 { label: 'تم تحليلها', value: stats.analyzed || 0, color: '#8B5CF6', icon: "ICON_Bot" },
 { label: 'أسئلة ممتازة', value: stats.excellent || 0, color: '#10B981', icon: 'ICON_CheckCircle' },
 { label: 'سهلة جداً', value: stats.veryEasy || 0, color: '#F59E0B', icon: 'Alert<Triangle size={16} />' },
 { label: 'صعبة جداً', value: stats.veryHard || 0, color: '#EF4444', icon: "ICON_Circle" },
 ].map((s, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${s.color}30`, borderRadius: 12, padding: '14px 16px' }}>
 <div style={{ fontSize: 22, marginBottom: 4 }}><IconRenderer name={s.icon} /></div>
 <div style={{ color: s.color, fontSize: 24, fontWeight: 800 }}>{s.value}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.label}</div>
 </div>
 ))}
 </div>

 {/* شرح مستويات الجودة */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
 <h3 style={{ color: 'white', fontSize: 14, fontWeight: 700, margin: '0 0 12px' }}>[BarChart3] مستويات جودة الأسئلة</h3>
 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
 {Object.entries(qualityConfig).map(([label, cfg]) => (
 <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: cfg.bg, borderRadius: 8, border: `1px solid ${cfg.color}30` }}>
 <span><IconRenderer name={cfg.icon} /></span>
 <div>
 <div style={{ color: cfg.color, fontSize: 12, fontWeight: 700 }}>{label}</div>
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{cfg.desc}</div>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* فلاتر */}
 <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search ابحث في الأسئلة..."
 style={{ flex: 1, minWidth: 200, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontFamily: 'inherit', fontSize: 14, outline: 'none' }}
 />
 <select
 value={filterSubject}
 onChange={e => setFilterSubject(e.target.value)}
 style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontFamily: 'inherit', fontSize: 13, outline: 'none', cursor: 'pointer' }}
 >
 <option value="">كل المواد</option>
 {subjects.map(s => <option key={s} value={s}>{s}</option>)}
 </select>
 <select
 value={filterGrade}
 onChange={e => setFilterGrade(e.target.value)}
 style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontFamily: 'inherit', fontSize: 13, outline: 'none', cursor: 'pointer' }}
 >
 <option value="">كل الصفوف</option>
 {grades.map(g => <option key={g} value={g}>{g}</option>)}
 </select>
 <select
 value={filterQuality}
 onChange={e => setFilterQuality(e.target.value)}
 style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'white', fontFamily: 'inherit', fontSize: 13, outline: 'none', cursor: 'pointer' }}
 >
 <option value="">كل مستويات الجودة</option>
 {Object.keys(qualityConfig).map(q => <option key={q} value={q}>{q}</option>)}
 </select>
 <button
 onClick={loadData}
 style={{ padding: '10px 18px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, color: '#3B82F6', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}
 >
 RefreshCw تحديث
 </button>
 </div>

 {/* عدد النتائج */}
 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 14 }}>
 عرض {filtered.length} من {questions.length} سؤال
 </div>

 {/* قائمة الأسئلة */}
 {filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)' }}>
 <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(107,114,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Search size={28} color="#6B7280" /></div>
 <div>لا توجد أسئلة تطابق البحث</div>
 </div>
 ) : (
 <div style={{ display: 'grid', gap: 10 }}>
 {filtered.slice(0, 200).map((q: any) => {
 const cfg = qualityConfig[q.quality_label] || qualityConfig['غير محلل'];
 const correctRate = q.times_used > 0 ? Math.round((q.times_correct / q.times_used) * 100) : null;
 
 return (
 <div key={q.id} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${cfg.color}20`, borderRadius: 12, padding: '14px 18px', borderRight: `3px solid ${cfg.color}` }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
 <div style={{ flex: 1 }}>
 <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 6, lineHeight: 1.5 }}>
 {q.question_text}
 </div>
 <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
 {q.subject && (
 <span style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.1)', borderRadius: 6, color: '#3B82F6', fontSize: 11 }}>
 BookOpen {q.subject}
 </span>
 )}
 {q.grade && (
 <span style={{ padding: '2px 8px', background: 'rgba(139,92,246,0.1)', borderRadius: 6, color: '#8B5CF6', fontSize: 11 }}>
 GraduationCap {q.grade}
 </span>
 )}
 {q.difficulty && (
 <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
 {q.difficulty === 'easy' ? 'Circle سهل' : q.difficulty === 'hard' ? 'Circle صعب' : '<Circle size={18} color="#6B7280" /> متوسط'}
 </span>
 )}
 </div>
 </div>
 
 {/* بيانات التحليل */}
 <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
 {q.times_used > 0 && (
 <div style={{ textAlign: 'center', minWidth: 60 }}>
 <div style={{ color: '#3B82F6', fontSize: 18, fontWeight: 800 }}>{q.times_used}</div>
 <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>مرة استُخدم</div>
 </div>
 )}
 {correctRate !== null && (
 <div style={{ textAlign: 'center', minWidth: 60 }}>
 <div style={{ color: correctRate >= 60 ? '#10B981' : '#EF4444', fontSize: 18, fontWeight: 800 }}>{correctRate}%</div>
 <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>إجابة صحيحة</div>
 </div>
 )}
 {q.avg_time_seconds > 0 && (
 <div style={{ textAlign: 'center', minWidth: 60 }}>
 <div style={{ color: '#F59E0B', fontSize: 18, fontWeight: 800 }}>{Math.round(q.avg_time_seconds)}ث</div>
 <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>متوسط الوقت</div>
 </div>
 )}
 
 {/* مستوى الجودة */}
 <div style={{ padding: '6px 14px', background: cfg.bg, borderRadius: 20, border: `1px solid ${cfg.color}40`, textAlign: 'center' }}>
 <div style={{ fontSize: 16 }}><IconRenderer name={cfg.icon} /></div>
 <div style={{ color: cfg.color, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{q.quality_label}</div>
 </div>
 </div>
 </div>
 
 {/* شريط التقدم للإجابات الصحيحة */}
 {q.times_used >= 5 && correctRate !== null && (
 <div style={{ marginTop: 10 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
 <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>معدل الإجابة الصحيحة</span>
 <span style={{ color: cfg.color, fontSize: 11, fontWeight: 600 }}>{correctRate}%</span>
 </div>
 <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
 <div style={{ height: '100%', width: `${correctRate}%`, background: `linear-gradient(90deg, ${cfg.color}80, ${cfg.color})`, borderRadius: 2, transition: 'width 0.5s ease' }} />
 </div>
 </div>
 )}
 </div>
 );
 })}
 {filtered.length > 200 && (
 <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 20, fontSize: 13 }}>
 يُعرض أول 200 نتيجة — استخدم الفلاتر لتضييق البحث
 </div>
 )}
 </div>
 )}
 </div>
 );
}
