'use client';
import IconRenderer from "@/components/IconRenderer";
import {, X } from "lucide-react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon, ICONS, G, DARK, CARD, BORDER, Spinner } from '@/components/ui-icons';
import { getHeaders } from '@/lib/api';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */

 try {
 const token = localStorage.getItem('matin_token');
 if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
 } catch { return { 'Content-Type': 'application/json' }; }
};

/* ── Modal ── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
 return (
 <div style={{ position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={onClose}>
 <div style={{ background:'#0F0F1A',border:'1px solid rgba(255,255,255,0.08)',borderRadius:20,width:'100%',maxWidth:520,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
 <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
 <h3 style={{ color:'#EEEEF5',fontSize:17,fontWeight:700,margin:0 }}>{title}</h3>
 <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)',border:'none',borderRadius:8,padding:'6px 10px',cursor:'pointer',color:'rgba(238,238,245,0.6)',fontSize:16 }}><X size={14} /></button>
 </div>
 <div style={{ padding:24 }}>{children}</div>
 </div>
 </div>
 );
}
const ErrBox = ({ msg }: { msg: string }) => msg ? <div style={{ background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'10px 14px',color:'#EF4444',fontSize:13,marginBottom:12 }}>{msg}</div> : null;
const OkBox = ({ msg }: { msg: string }) => msg ? <div style={{ background:'rgba(16,185,129,0.1)',border:'1px solid rgba(16,185,129,0.3)',borderRadius:8,padding:'10px 14px',color:'#10B981',fontSize:13,marginBottom:12 }}>{msg}</div> : null;
const INP: React.CSSProperties = { width:'100%',padding:'10px 14px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:10,color:'#EEEEF5',fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit' };
const LBL: React.CSSProperties = { display:'block',color:'rgba(238,238,245,0.7)',fontSize:13,fontWeight:600,marginBottom:6 };
const FW: React.CSSProperties = { marginBottom:16 };

export default function StudentDashboard() {
 const [user, setUser] = useState<any>(null);
 const [stats, setStats] = useState<any>({});
 const [exams, setExams] = useState<any[]>([]);
 const [grades, setGrades] = useState<any[]>([]);
 const [homework, setHomework] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'overview' | 'exams' | 'grades' | 'homework'>('overview');

 // ── Homework submit modal ──
 const [showHWModal, setShowHWModal] = useState(false);
 const [selHW, setSelHW] = useState<any>(null);
 const [hwAnswer, setHwAnswer] = useState('');
 const [hwLoading, setHwLoading] = useState(false);
 const [hwErr, setHwErr] = useState('');
 const [hwOk, setHwOk] = useState('');

 // ── Grade review modal ──
 const [showGradeModal, setShowGradeModal] = useState(false);
 const [selGrade, setSelGrade] = useState<any>(null);
 const [gradeNote, setGradeNote] = useState('');
 const [gradeLoading, setGradeLoading] = useState(false);
 const [gradeErr, setGradeErr] = useState('');
 const [gradeOk, setGradeOk] = useState('');

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 if (!u.id) { window.location.href = '/login'; return; }
 setUser(u);
 loadAll();
 }, []);

 const loadAll = async () => {
 setLoading(true);
 try {
 const [statsRes, examsRes, gradesRes, hwRes] = await Promise.all([
 fetch('/api/dashboard-stats', { headers: getHeaders() }),
 fetch('/api/exams', { headers: getHeaders() }),
 fetch('/api/grades', { headers: getHeaders() }),
 fetch('/api/homework', { headers: getHeaders() }),
 ]);
 const [statsData, examsData, gradesData, hwData] = await Promise.all([
 statsRes.json(), examsRes.json(), gradesRes.json(), hwRes.json()
 ]);
 setStats(statsData || {});
 setExams(Array.isArray(examsData) ? examsData : []);
 setGrades(Array.isArray(gradesData) ? gradesData : []);
 setHomework(Array.isArray(hwData) ? hwData : []);
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const handleSubmitHW = async () => {
 if (!hwAnswer.trim()) { setHwErr('يجب كتابة الإجابة'); return; }
 setHwLoading(true); setHwErr(''); setHwOk('');
 try {
 const res = await fetch('/api/homework', {
 method: 'POST',
 headers: getHeaders(),
 body: JSON.stringify({ homework_id: selHW?.id, answer: hwAnswer, student_id: user?.id }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل تسليم الواجب');
 setHwOk('تم تسليم الواجب بنجاح');
 setTimeout(() => { setShowHWModal(false); setHwOk(''); setHwAnswer(''); loadAll(); }, 1500);
 } catch (e: any) { setHwErr(e.message); }
 finally { setHwLoading(false); }
 };

 const handleGradeReview = async () => {
 if (!gradeNote.trim()) { setGradeErr('يجب كتابة سبب طلب المراجعة'); return; }
 setGradeLoading(true); setGradeErr(''); setGradeOk('');
 try {
 const res = await fetch('/api/grades', {
 method: 'PUT',
 headers: getHeaders(),
 body: JSON.stringify({ grade_id: selGrade?.id, review_request: gradeNote, student_id: user?.id }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || 'فشل إرسال طلب المراجعة');
 setGradeOk('تم إرسال طلب المراجعة بنجاح');
 setTimeout(() => { setShowGradeModal(false); setGradeOk(''); setGradeNote(''); }, 1500);
 } catch (e: any) { setGradeErr(e.message); }
 finally { setGradeLoading(false); }
 };

 if (loading) return (
 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16, background: DARK }}>
 <Spinner size={40} />
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري تحميل بوابة الطالب...</div>
 </div>
 );

 const publishedExams = exams.filter((e: any) => e.status === 'PUBLISHED' || e.status === 'ACTIVE');
 const avgGrade = grades.length > 0 ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.percentage || 0), 0) / grades.length) : 0;
 const pendingHW = homework.filter((h: any) => h.status === 'active').length;

 return (
 <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
 {/* Header */}
 <div style={{ marginBottom: 28, background: `rgba(201,168,76,0.06)`, border: `1px solid rgba(201,168,76,0.15)`, borderRadius: 16, padding: '20px 24px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
 <div style={{ width: 52, height: 52, background: `rgba(201,168,76,0.12)`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G }}>
 <Icon d={ICONS.student_hat} size={26} />
 </div>
 <div>
 <h1 style={{ fontSize: 20, fontWeight: 800, color: '#EEEEF5', margin: 0, letterSpacing: -0.5 }}>مرحباً {user?.name}</h1>
 <p style={{ color: 'rgba(238,238,245,0.4)', fontSize: 13, margin: '4px 0 0' }}>بوابة الطالب — منصة متين التعليمية</p>
 </div>
 </div>
 </div>

 {/* Tabs */}
 <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
 {[
 { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
 { id: 'exams', label: 'اختباراتي', icon: 'exams' },
 { id: 'grades', label: 'درجاتي', icon: 'grades' },
 { id: 'homework', label: 'واجباتي', icon: 'homework' },
 ].map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
 style={{ padding: '9px 16px', borderRadius: 10, border: `1px solid ${activeTab === tab.id ? G : BORDER}`, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, background: activeTab === tab.id ? `rgba(201,168,76,0.1)` : 'transparent', color: activeTab === tab.id ? G : 'rgba(238,238,245,0.5)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7 }}>
 <Icon d={ICONS[tab.icon]} size={14} color={activeTab === tab.id ? G : 'rgba(238,238,245,0.4)'} />
 {tab.label}
 </button>
 ))}
 </div>

 {/* === نظرة عامة === */}
 {activeTab === 'overview' && (
 <div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
 {[
 { label: 'متوسط الدرجات', value: `${avgGrade}%`, icon: 'grades', color: '#10B981' },
 { label: 'اختبارات متاحة', value: publishedExams.length, icon: 'exams', color: '#3B82F6' },
 { label: 'واجبات معلقة', value: pendingHW, icon: 'homework', color: '#F59E0B' },
 { label: 'نسبة الحضور', value: `${stats.attendance_rate || 0}%`, icon: 'attendance', color: '#8B5CF6' },
 ].map((s, i) => (
 <div key={i} style={{ background: `${s.color}08`, border: `1px solid ${s.color}25`, borderRadius: 14, padding: '18px 16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
 <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, fontWeight: 500 }}>{s.label}</div>
 <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
 <Icon d={ICONS[s.icon]} size={16} />
 </div>
 </div>
 <div style={{ color: s.color, fontSize: 26, fontWeight: 800 }}>{s.value}</div>
 </div>
 ))}
 </div>

 {/* روابط سريعة */}
 <h2 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.dashboard} size={16} color={G} /> الوصول السريع
 </h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 28 }}>
 {[
 { label: 'اختباراتي', icon: 'exams', tab: 'exams', color: '#3B82F6' },
 { label: 'درجاتي', icon: 'grades', tab: 'grades', color: '#10B981' },
 { label: 'واجباتي', icon: 'homework', tab: 'homework', color: '#F59E0B' },
 ].map((a, i) => (
 <div key={i} onClick={() => setActiveTab(a.tab as any)}
 style={{ background: `${a.color}08`, border: `1px solid ${a.color}25`, borderRadius: 12, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${a.color}25`; }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
 <Icon d={ICONS[a.icon]} size={18} />
 </div>
 <div style={{ color: a.color, fontSize: 13, fontWeight: 700 }}>{a.label}</div>
 </div>
 ))}
 {[
 { label: 'الجدول', icon: 'schedule', href: '/dashboard/schedules', color: '#6366F1' },
 { label: 'المكتبة', icon: 'subjects', href: '/dashboard/library', color: '#06B6D4' },
 { label: 'الرسائل', icon: 'messages', href: '/dashboard/messages', color: '#EC4899' },
 ].map((a, i) => (
 <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
 <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}08`; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
 <Icon d={ICONS[a.icon]} size={18} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 13, fontWeight: 600 }}>{a.label}</div>
 </div>
 </Link>
 ))}
 </div>

 {/* اختبارات متاحة */}
 {publishedExams.length > 0 && (
 <div>
 <h2 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.exams} size={16} color={G} /> اختبارات متاحة الآن
 </h2>
 <div style={{ display: 'grid', gap: 10 }}>
 {publishedExams.slice(0, 3).map((exam: any) => (
 <div key={exam.id} style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{exam.title_ar || exam.title}</div>
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 4, display: 'flex', gap: 12 }}>
 <span>{exam.duration} دقيقة</span>
 <span>{exam.total_marks} درجة</span>
 </div>
 </div>
 <Link href={`/dashboard/exam-take?exam_id=${exam.id}&student_id=${user?.id}`}>
 <button style={{ padding: '8px 16px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>
 ابدأ
 </button>
 </Link>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}

 {/* === الاختبارات === */}
 {activeTab === 'exams' && (
 <div>
 <h2 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.exams} size={17} color={G} /> اختباراتي
 </h2>
 {exams.length === 0 ? (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
 <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: G }}>
 <Icon d={ICONS.exams} size={24} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14 }}>لا توجد اختبارات حالياً</div>
 </div>
 ) : (
 <div style={{ display: 'grid', gap: 10 }}>
 {exams.map((exam: any) => {
 const statusColor = exam.status === 'PUBLISHED' || exam.status === 'ACTIVE' ? '#10B981' : exam.status === 'DRAFT' ? '#F59E0B' : '#6B7280';
 const statusLabel = exam.status === 'PUBLISHED' || exam.status === 'ACTIVE' ? 'متاح' : exam.status === 'DRAFT' ? 'مسودة' : 'منتهي';
 return (
 <div key={exam.id}
 style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
 <span style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{exam.title_ar || exam.title}</span>
 <span style={{ background: `${statusColor}18`, color: statusColor, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>{statusLabel}</span>
 </div>
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, display: 'flex', gap: 12 }}>
 <span>{exam.duration} دقيقة</span>
 <span>{exam.total_marks} درجة</span>
 {exam.subject_name && <span>{exam.subject_name}</span>}
 </div>
 </div>
 {(exam.status === 'PUBLISHED' || exam.status === 'ACTIVE') && (
 <Link href={`/dashboard/exam-take?exam_id=${exam.id}&student_id=${user?.id}`}>
 <button style={{ padding: '8px 16px', background: G, color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontFamily: 'inherit', fontSize: 13 }}>
 ابدأ
 </button>
 </Link>
 )}
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* === الدرجات === */}
 {activeTab === 'grades' && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.grades} size={17} color={G} /> درجاتي
 </h2>
 {grades.length > 0 && (
 <div style={{ background: `rgba(201,168,76,0.1)`, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 10, padding: '6px 14px', color: G, fontSize: 13, fontWeight: 700 }}>
 المعدل: {avgGrade}%
 </div>
 )}
 </div>
 {grades.length === 0 ? (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
 <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14 }}>لا توجد درجات مسجلة</div>
 </div>
 ) : (
 <div style={{ display: 'grid', gap: 8 }}>
 {grades.map((g: any, i: number) => {
 const pct = g.percentage || 0;
 const color = pct >= 90 ? '#10B981' : pct >= 75 ? '#3B82F6' : pct >= 60 ? '#F59E0B' : '#EF4444';
 return (
 <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{g.subject_name || g.exam_title || 'مادة'}</div>
 {g.exam_title && <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 3 }}>{g.exam_title}</div>}
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
 <div style={{ textAlign: 'center' }}>
 <div style={{ color, fontSize: 20, fontWeight: 800 }}>{pct}%</div>
 <div style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11 }}>{g.obtained_marks}/{g.total_marks}</div>
 </div>
 <button onClick={() => { setSelGrade(g); setGradeNote(''); setGradeErr(''); setGradeOk(''); setShowGradeModal(true); }}
 style={{ padding: '5px 10px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 7, color: '#3B82F6', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}>
 مراجعة
 </button>
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {/* === الواجبات === */}
 {activeTab === 'homework' && (
 <div>
 <h2 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
 <Icon d={ICONS.homework} size={17} color={G} /> واجباتي
 </h2>
 {homework.length === 0 ? (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '40px 32px', textAlign: 'center' }}>
 <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14 }}>لا توجد واجبات حالياً</div>
 </div>
 ) : (
 <div style={{ display: 'grid', gap: 8 }}>
 {homework.map((hw: any, i: number) => {
 const isActive = hw.status === 'active';
 return (
 <div key={i} style={{ background: CARD, border: `1px solid ${isActive ? 'rgba(245,158,11,0.25)' : BORDER}`, borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
 <span style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{hw.title_ar || hw.title}</span>
 {isActive && <span style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20 }}>معلق</span>}
 </div>
 {hw.due_date && <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>موعد التسليم: {new Date(hw.due_date).toLocaleDateString('ar-SA')}</div>}
 </div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 12 }}>{hw.subject_name}</div>
 {isActive && (
 <button onClick={() => { setSelHW(hw); setHwAnswer(''); setHwErr(''); setHwOk(''); setShowHWModal(true); }}
 style={{ padding: '6px 14px', background: G, color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 12 }}>
 تسليم
 </button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 )}

 {}
 {showHWModal && selHW && (
 <Modal title="تسليم الواجب" onClose={() => setShowHWModal(false)}>
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
 <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{selHW.title_ar || selHW.title}</div>
 {selHW.due_date && <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 4 }}>موعد التسليم: {new Date(selHW.due_date).toLocaleDateString('ar-SA')}</div>}
 </div>
 <div style={FW}><label style={LBL}>إجابتك <span style={{color:'#EF4444'}}>*</span></label>
 <textarea value={hwAnswer} onChange={e => setHwAnswer(e.target.value)} rows={5} placeholder="اكتب إجابتك هنا..." style={{ ...INP, resize: 'vertical', minHeight: 100 }} />
 </div>
 <ErrBox msg={hwErr} /><OkBox msg={hwOk} />
 <button onClick={handleSubmitHW} disabled={hwLoading} style={{ width: '100%', padding: '11px', background: hwLoading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg,${G},#A07830)`, border: 'none', borderRadius: 10, color: hwLoading ? 'rgba(238,238,245,0.3)' : '#000', cursor: hwLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
 {hwLoading ? 'جارٍ التسليم...' : 'تسليم الواجب'}
 </button>
 </Modal>
 )}

 {}
 {showGradeModal && selGrade && (
 <Modal title="طلب مراجعة الدرجة" onClose={() => setShowGradeModal(false)}>
 <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, marginBottom: 16 }}>
 <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{selGrade.subject_name || selGrade.exam_title}</div>
 <div style={{ color: 'rgba(238,238,245,0.5)', fontSize: 13, marginTop: 4 }}>الدرجة: {selGrade.obtained_marks}/{selGrade.total_marks} ({selGrade.percentage}%)</div>
 </div>
 <div style={FW}><label style={LBL}>سبب طلب المراجعة <span style={{color:'#EF4444'}}>*</span></label>
 <textarea value={gradeNote} onChange={e => setGradeNote(e.target.value)} rows={4} placeholder="اشرح سبب طلبك لمراجعة الدرجة..." style={{ ...INP, resize: 'vertical', minHeight: 80 }} />
 </div>
 <ErrBox msg={gradeErr} /><OkBox msg={gradeOk} />
 <button onClick={handleGradeReview} disabled={gradeLoading} style={{ width: '100%', padding: '11px', background: gradeLoading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#3B82F6,#1D4ED8)', border: 'none', borderRadius: 10, color: gradeLoading ? 'rgba(238,238,245,0.3)' : '#fff', cursor: gradeLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
 {gradeLoading ? 'جارٍ الإرسال...' : 'إرسال طلب المراجعة'}
 </button>
 </Modal>
 )}

 </div>
 );
}
