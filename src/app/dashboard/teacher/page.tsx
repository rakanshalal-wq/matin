'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon, ICONS, G, DARK, CARD, BORDER, Spinner } from '@/components/ui-icons';
import { getHeaders } from '@/lib/api';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */


export default function TeacherDashboard() {
 const [user, setUser] = useState<any>(null);
 const [stats, setStats] = useState<any>({});
 const [classes, setClasses] = useState<any[]>([]);
 const [students, setStudents] = useState<any[]>([]);
 const [exams, setExams] = useState<any[]>([]);
 const [homework, setHomework] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'homework' | 'grades' | 'exams'>('overview');
 const [selectedClass, setSelectedClass] = useState('');
 const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
 const [attendance, setAttendance] = useState<any>({});
 const [savingAttendance, setSavingAttendance] = useState(false);
 const [attendanceMsg, setAttendanceMsg] = useState('');
 const [showAddHW, setShowAddHW] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [showModal, setShowModal] = useState(false);
 const [hwForm, setHwForm] = useState({ title: '', description: '', subject: '', class_name: '', due_date: '', status: 'active' });
 const [savingHW, setSavingHW] = useState(false);
 const [hwMsg, setHwMsg] = useState('');
 const [hwErrMsg, setHwErrMsg] = useState('');
 const [editHW, setEditHW] = useState<any>(null);

 useEffect(() => {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 if (!u.id) { window.location.href = '/login'; return; }
 setUser(u);
 loadAll();
 }, []);

 const loadAll = async () => {
 setLoading(true);
 try {
 const [statsRes, classesRes, examsRes, hwRes] = await Promise.all([
 fetch('/api/dashboard-stats', { headers: getHeaders() }),
 fetch('/api/classes', { headers: getHeaders() }),
 fetch('/api/exams', { headers: getHeaders() }),
 fetch('/api/homework', { headers: getHeaders() }),
 ]);
 const [statsData, classesData, examsData, hwData] = await Promise.all([
 statsRes.json(), classesRes.json(), examsRes.json(), hwRes.json()
 ]);
 setStats(statsData || {});
 setClasses(Array.isArray(classesData) ? classesData : []);
 setExams(Array.isArray(examsData) ? examsData : []);
 setHomework(Array.isArray(hwData) ? hwData : []);
 } catch (e) { console.error(e); }
 finally { setLoading(false); }
 };

 const loadStudents = async (classId: string) => {
 if (!classId) return;
 try {
 const res = await fetch(`/api/students?class_id=${classId}`, { headers: getHeaders() });
 const data = await res.json();
 setStudents(Array.isArray(data) ? data : []);
 const init: any = {};
 (Array.isArray(data) ? data : []).forEach((s: any) => { init[s.id] = 'PRESENT'; });
 setAttendance(init);
 } catch {}
 };

 const saveAttendance = async () => {
 if (!selectedClass || students.length === 0) { setAttendanceMsg('اختر فصلاً أولاً'); return; }
 setSavingAttendance(true); setAttendanceMsg('');
 try {
 const records = students.map(s => ({ student_id: s.id, class_id: selectedClass, date: attendanceDate, status: attendance[s.id] || 'PRESENT' }));
 const res = await fetch('/api/attendance', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ records }) });
 if (res.ok) { setAttendanceMsg('تم حفظ الحضور بنجاح'); }
 else { const data = await res.json(); setAttendanceMsg(data.error || 'فشل الحفظ'); }
 } catch { setAttendanceMsg('خطأ في الاتصال'); }
 finally { setSavingAttendance(false); }
 };

 const saveHomework = async () => {
 if (!hwForm.title) { setHwMsg('العنوان مطلوب'); return; }
 setSavingHW(true); setHwMsg('');
 try {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 const method = editHW ? 'PUT' : 'POST';
 const url = editHW ? `/api/homework?id=${editHW.id}` : '/api/homework';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify({ ...hwForm, teacher_name: u?.name }) });
 const data = await res.json();
 if (res.ok) {
 if (editHW) { setHomework(homework.map((h: any) => h.id === editHW.id ? data : h)); }
 else { setHomework([data, ...homework]); }
 setHwForm({ title: '', description: '', subject: '', class_name: '', due_date: '', status: 'active' });
 setShowAddHW(false); setEditHW(null); setHwMsg(editHW ? 'تم تعديل الواجب' : 'تم إضافة الواجب');
 } else { setHwMsg(data.error || 'فشل'); }
 } catch (e: any) { setHwMsg(e.message || 'خطأ'); setHwErrMsg(e.message || 'حدث خطأ'); }
 finally { setSavingHW(false); }
 };
 const handleEditHW = (hw: any) => {
 setEditHW(hw);
 setHwForm({ title: hw.title || '', description: hw.description || '', subject: hw.subject || '', class_name: hw.class_name || '', due_date: hw.due_date || '', status: hw.status || 'active' });
 setHwMsg('');
 setShowAddHW(true);
 };

 const deleteHomework = async (id: number) => {
 if (!confirm('حذف هذا الواجب؟')) return;
 await fetch(`/api/homework?id=${id}`, { method: 'DELETE', headers: getHeaders() });
 setHomework(homework.filter((h: any) => h.id !== id));
 };

 if (loading) return (
 <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
 <Spinner size={40} />
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
 </div>
 );

 const inpStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#EEEEF5', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' };
 const labelStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.6)', fontSize: 13, marginBottom: 6, display: 'block', fontWeight: 500 };

 const tabs = [
 { id: 'overview', label: 'نظرة عامة', icon: 'dashboard' },
 { id: 'attendance', label: 'الحضور', icon: 'attendance' },
 { id: 'homework', label: 'الواجبات', icon: 'homework' },
 { id: 'grades', label: 'الدرجات', icon: 'grades' },
 { id: 'exams', label: 'الاختبارات', icon: 'exams' },
 ];

 return (
 <div style={{ padding: '28px 24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif', minHeight: '100vh', background: DARK }}>
 {/* الهيدر */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
 <div style={{ width: 48, height: 48, background: 'rgba(16,185,129,0.12)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
 <Icon d={ICONS.teachers} size={24} />
 </div>
 <div>
 <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>لوحة تحكم المعلم</h1>
 <p style={{ color: 'rgba(238,238,245,0.45)', margin: 0, fontSize: 13 }}>مرحباً {user?.name}</p>
 </div>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <Link href="/dashboard/messages" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, color: 'rgba(238,238,245,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
 <Icon d={ICONS.messages} size={15} /> الرسائل
 </Link>
 <Link href="/dashboard/notifications" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 10, color: G, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
 <Icon d={ICONS.notif} size={15} /> الإشعارات
 </Link>
 </div>
 </div>

 {/* التبويبات */}
 <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 4, width: 'fit-content', flexWrap: 'wrap' }}>
 {tabs.map(tab => (
 <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
 style={{
 display: 'flex', alignItems: 'center', gap: 7,
 padding: '9px 18px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600,
 cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', transition: 'all 0.2s',
 background: activeTab === tab.id ? `linear-gradient(135deg, ${G}, #E2C46A)` : 'transparent',
 color: activeTab === tab.id ? '#000' : 'rgba(238,238,245,0.5)',
 }}>
 <Icon d={ICONS[tab.icon]} size={14} color={activeTab === tab.id ? '#000' : 'rgba(238,238,245,0.5)'} />
 {tab.label}
 </button>
 ))}
 </div>

 {/* نظرة عامة */}
 {activeTab === 'overview' && (
 <div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 28 }}>
 {[
 { label: 'فصولي', value: classes.length, icon: 'classes', color: '#3B82F6' },
 { label: 'طلابي', value: stats.my_students || stats.students || 0, icon: 'students', color: '#10B981' },
 { label: 'واجبات نشطة', value: homework.filter((h: any) => h.status === 'active').length, icon: 'homework', color: '#F59E0B' },
 { label: 'الاختبارات', value: exams.length, icon: 'exams', color: '#8B5CF6' },
 ].map((s, i) => (
 <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '18px 20px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, marginBottom: 8, fontWeight: 500 }}>{s.label}</div>
 <div style={{ color: '#EEEEF5', fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
 </div>
 <div style={{ width: 38, height: 38, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
 <Icon d={ICONS[s.icon]} size={18} />
 </div>
 </div>
 </div>
 ))}
 </div>

 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: '0 0 18px' }}>الإجراءات السريعة</h2>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
 {[
 { label: 'تسجيل الحضور', icon: 'attendance', tab: 'attendance', color: '#10B981' },
 { label: 'إضافة واجب', icon: 'homework', tab: 'homework', color: '#F59E0B' },
 { label: 'رصد الدرجات', icon: 'grades', tab: 'grades', color: '#3B82F6' },
 ].map((a, i) => (
 <div key={i} onClick={() => setActiveTab(a.tab as any)}
 style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}10`; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
 <Icon d={ICONS[a.icon]} size={17} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.75)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
 </div>
 ))}
 {[
 { label: 'إنشاء اختبار', icon: 'exams', href: '/dashboard/exams', color: '#8B5CF6' },
 { label: 'بنك الأسئلة', icon: 'question', href: '/dashboard/question-bank', color: '#06B6D4' },
 { label: 'الرسائل', icon: 'messages', href: '/dashboard/messages', color: '#EC4899' },
 ].map((a, i) => (
 <Link key={i} href={a.href} style={{ textDecoration: 'none' }}>
 <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
 onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = a.color; (e.currentTarget as HTMLDivElement).style.background = `${a.color}10`; }}
 onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
 <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: a.color }}>
 <Icon d={ICONS[a.icon]} size={17} />
 </div>
 <div style={{ color: 'rgba(238,238,245,0.75)', fontSize: 12, fontWeight: 600 }}>{a.label}</div>
 </div>
 </Link>
 ))}
 </div>
 </div>

 {classes.length > 0 && (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BORDER}` }}>
 <h3 style={{ color: '#EEEEF5', fontSize: 15, fontWeight: 700, margin: 0 }}>فصولي الدراسية</h3>
 </div>
 <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
 {classes.map((cls: any) => (
 <div key={cls.id} style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12, padding: 16 }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
 <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
 <Icon d={ICONS.classes} size={16} />
 </div>
 <div style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 14 }}>{cls.name_ar || cls.name}</div>
 </div>
 <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>الصف: {cls.grade || '—'} | الطلاب: {cls.students_count || 0}</div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}

 {/* الحضور */}
 {activeTab === 'attendance' && (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ padding: '20px 24px', borderBottom: `1px solid ${BORDER}` }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 16, fontWeight: 700, margin: 0 }}>تسجيل الحضور والغياب</h2>
 </div>
 <div style={{ padding: 24 }}>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
 <div>
 <label style={labelStyle}>الفصل الدراسي</label>
 <select value={selectedClass} onChange={e => { setSelectedClass(e.target.value); loadStudents(e.target.value); }}
 style={{ ...inpStyle, cursor: 'pointer' }}>
 <option value="">-- اختر الفصل --</option>
 {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name_ar || c.name}</option>)}
 </select>
 </div>
 <div>
 <label style={labelStyle}>التاريخ</label>
 <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} style={inpStyle} />
 </div>
 </div>

 {students.length > 0 ? (
 <>
 <div style={{ marginBottom: 16 }}>
 <div style={{ overflowX: 'auto' }}>
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
 <thead>
 <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
 {['الطالب', 'الحضور'].map((h, i) => (
 <th key={i} style={{ padding: '12px 16px', color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 600, textAlign: 'right', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {students.map((s: any) => (
 <tr key={s.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
 <td style={{ padding: '12px 16px', color: '#EEEEF5', fontSize: 14, fontWeight: 600 }}>{s.name || s.full_name}</td>
 <td style={{ padding: '12px 16px' }}>
 <div style={{ display: 'flex', gap: 8 }}>
 {[{ v: 'PRESENT', label: 'حاضر', color: '#10B981' }, { v: 'ABSENT', label: 'غائب', color: '#EF4444' }, { v: 'LATE', label: 'متأخر', color: '#F59E0B' }].map(opt => (
 <button key={opt.v} onClick={() => setAttendance({ ...attendance, [s.id]: opt.v })}
 style={{ padding: '6px 14px', borderRadius: 8, border: `1px solid ${attendance[s.id] === opt.v ? opt.color : BORDER}`, background: attendance[s.id] === opt.v ? `${opt.color}18` : 'transparent', color: attendance[s.id] === opt.v ? opt.color : 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
 {opt.label}
 </button>
 ))}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
</div>
 </div>
 <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
 <button onClick={saveAttendance} disabled={savingAttendance}
 style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, opacity: savingAttendance ? 0.7 : 1 }}>
 {savingAttendance ? <Spinner size={16} color="#000" /> : <Icon d={ICONS.save} size={16} color="#000" />}
 {savingAttendance ? 'جاري الحفظ...' : 'حفظ الحضور'}
 </button>
 {attendanceMsg && <span style={{ color: attendanceMsg.includes('نجاح') ? '#10B981' : '#EF4444', fontSize: 13 }}>{attendanceMsg}</span>}
 </div>
 </>
 ) : (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)' }}>
 <div style={{ marginBottom: 12 }}><Icon d={ICONS.students} size={40} color="rgba(238,238,245,0.15)" /></div>
 <div style={{ fontSize: 14 }}>اختر فصلاً لعرض الطلاب</div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* الواجبات */}
 {activeTab === 'homework' && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>الواجبات ({homework.length})</h2>
 <button onClick={() => setShowAddHW(true)}
 style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14 }}>
 <Icon d={ICONS.plus} size={16} color="#000" /> إضافة واجب
 </button>
 </div>
 {hwMsg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: hwMsg.includes('تم') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: hwMsg.includes('تم') ? '#10B981' : '#EF4444', fontSize: 14 }}>{hwMsg}</div>}
 <div style={{ display: 'grid', gap: 10 }}>
 {homework.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
 <div style={{ marginBottom: 12 }}><Icon d={ICONS.homework} size={40} color="rgba(238,238,245,0.15)" /></div>
 <div style={{ fontSize: 14 }}>لا توجد واجبات بعد</div>
 </div>
 ) : homework.map((hw: any) => (
 <div key={hw.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
 <div>
 <div style={{ color: '#EEEEF5', fontWeight: 700, marginBottom: 6 }}>{hw.title}</div>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 {hw.subject && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Icon d={ICONS.subjects} size={12} />{hw.subject}</span>}
 {hw.class_name && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Icon d={ICONS.classes} size={12} />{hw.class_name}</span>}
 {hw.due_date && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Icon d={ICONS.calendar} size={12} />{new Date(hw.due_date).toLocaleDateString('ar-SA')}</span>}
 </div>
 </div>
 <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
 <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: hw.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(156,163,175,0.1)', color: hw.status === 'active' ? '#10B981' : '#9CA3AF' }}>
 {hw.status === 'active' ? 'نشط' : 'منتهي'}
 </span>
 <button onClick={() => deleteHomework(hw.id)}
 style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
 <Icon d={ICONS.trash} size={13} /> حذف
 </button>
 </div>
 </div>
 ))}
 </div>

 {showAddHW && (
 <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
 <div style={{ background: '#0D0D1A', border: `1px solid ${BORDER}`, borderRadius: 18, padding: 32, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>إضافة واجب جديد</h2>
 <button onClick={() => setShowAddHW(false)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
 <Icon d={ICONS.x} size={18} />
 </button>
 </div>
 <div style={{ display: 'grid', gap: 14 }}>
 <div><label style={labelStyle}>العنوان *</label><input value={hwForm.title} onChange={e => setHwForm({ ...hwForm, title: e.target.value })} placeholder="عنوان الواجب" style={inpStyle} /></div>
 <div><label style={labelStyle}>الوصف</label><textarea value={hwForm.description} onChange={e => setHwForm({ ...hwForm, description: e.target.value })} placeholder="وصف الواجب" rows={3} style={{ ...inpStyle, resize: 'vertical' } as any} /></div>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div><label style={labelStyle}>المادة</label><input value={hwForm.subject} onChange={e => setHwForm({ ...hwForm, subject: e.target.value })} placeholder="اسم المادة" style={inpStyle} /></div>
 <div><label style={labelStyle}>الفصل</label><input value={hwForm.class_name} onChange={e => setHwForm({ ...hwForm, class_name: e.target.value })} placeholder="اسم الفصل" style={inpStyle} /></div>
 </div>
 <div><label style={labelStyle}>تاريخ التسليم</label><input type="date" value={hwForm.due_date} onChange={e => setHwForm({ ...hwForm, due_date: e.target.value })} style={inpStyle} /></div>
 </div>
 <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
 <button onClick={saveHomework} disabled={savingHW}
 style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', padding: '12px', background: `linear-gradient(135deg, ${G}, #E2C46A)`, color: '#000', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', opacity: savingHW ? 0.7 : 1 }}>
 {savingHW ? <Spinner size={16} color="#000" /> : <Icon d={ICONS.save} size={16} color="#000" />}
 {savingHW ? 'جاري الحفظ...' : 'حفظ الواجب'}
 </button>
 <button onClick={() => setShowAddHW(false)} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, color: 'rgba(238,238,245,0.7)', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit' }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 {/* الدرجات */}
 {activeTab === 'grades' && (
 <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
 <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#3B82F6' }}>
 <Icon d={ICONS.grades} size={30} />
 </div>
 <h3 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>رصد الدرجات</h3>
 <p style={{ color: 'rgba(238,238,245,0.5)', fontSize: 14, marginBottom: 24 }}>لرصد الدرجات وإدارتها بشكل كامل، استخدم صفحة الدرجات المخصصة</p>
 <Link href="/dashboard/grades" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#3B82F6', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
 <Icon d={ICONS.grades} size={16} color="white" /> الذهاب إلى صفحة الدرجات
 </Link>
 </div>
 )}

 {/* الاختبارات */}
 {activeTab === 'exams' && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#EEEEF5', fontSize: 18, fontWeight: 700, margin: 0 }}>الاختبارات ({exams.length})</h2>
 <Link href="/dashboard/exams" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#8B5CF6', color: 'white', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
 <Icon d={ICONS.plus} size={16} color="white" /> إنشاء اختبار
 </Link>
 </div>
 <div style={{ display: 'grid', gap: 10 }}>
 {exams.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(238,238,245,0.3)', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16 }}>
 <div style={{ marginBottom: 12 }}><Icon d={ICONS.exams} size={40} color="rgba(238,238,245,0.15)" /></div>
 <div style={{ fontSize: 14 }}>لا توجد اختبارات بعد</div>
 </div>
 ) : exams.slice(0, 10).map((exam: any) => (
 <div key={exam.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
 <div>
 <div style={{ color: '#EEEEF5', fontWeight: 700, marginBottom: 6 }}>{exam.title_ar || exam.title}</div>
 <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
 {exam.type && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{exam.type}</span>}
 {exam.total_marks && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{exam.total_marks} درجة</span>}
 {exam.duration && <span style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12 }}>{exam.duration} دقيقة</span>}
 </div>
 </div>
 <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: exam.status === 'PUBLISHED' ? 'rgba(59,130,246,0.1)' : 'rgba(156,163,175,0.1)', color: exam.status === 'PUBLISHED' ? '#3B82F6' : '#9CA3AF' }}>
 {exam.status === 'PUBLISHED' ? 'منشور' : exam.status === 'DRAFT' ? 'مسودة' : exam.status}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
