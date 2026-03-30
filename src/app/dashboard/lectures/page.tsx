'use client';
export const dynamic = 'force-dynamic';
import { BarChart3, BookOpen, Bot, Calendar, Check, CheckCircle, Circle, Clapperboard, ClipboardList, File, FileText, Gamepad2, Link as LinkIcon, Mic, Mic2, Monitor, Pencil, Plus, Save, Trash2, Video } from "lucide-react";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';


const LECTURE_TYPES = [
 { value: 'video', label: 'فيديو مسجل', icon: "ICON_Clapperboard" },
 { value: 'live', label: 'بث مباشر', icon: "ICON_Circle" },
 { value: 'document', label: 'ملف/وثيقة', icon: "ICON_File" },
 { value: 'audio', label: 'تسجيل صوتي', icon: "ICON_Mic2" },
 { value: 'presentation', label: 'عرض تقديمي', icon: "ICON_BarChart3" },
 { value: 'interactive', label: 'تفاعلي', icon: "ICON_Gamepad2" },
];

export default function LecturesPage() {
 const [tab, setTab] = useState<'list' | 'create' | 'live' | 'courses'>('list');
 const [lectures, setLectures] = useState<any[]>([]);
 const [courses, setCourses] = useState<any[]>([]);
 const [loading, setLoading] = useState(true);
 const [showModal, setShowModal] = useState(false);
 const [saving, setSaving] = useState(false);
 const [errMsg, setErrMsg] = useState('');
 const [editItem, setEditItem] = useState<any>(null);
 const [liveSessions, setLiveSessions] = useState<any[]>([]);

 const [form, setForm] = useState({
 title: '', description: '', subject: '', grade: '',
 type: 'video', video_url: '', duration: 0,
 is_free: false, order_index: 0, course_id: '',
 allow_download: false, ai_summary: false,
 });

 const [courseForm, setCourseForm] = useState({
 title: '', description: '', subject: '', grade: '',
 thumbnail: '', is_published: false,
 });

 const [liveForm, setLiveForm] = useState({
 title: '', scheduled_at: '', platform: 'zoom',
 meeting_link: '', password: '', description: '',
 });

 const [createLoading, setCreateLoading] = useState(false);
 const [liveLoading, setLiveLoading] = useState(false);

 useEffect(() => { fetchAll(); }, []);

 const handleSaveLecture = async () => {
 if (!form.title.trim()) { setErrMsg('عنوان المحاضرة مطلوب'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const url = editItem ? `/api/lectures?id=${editItem.id}` : '/api/lectures';
 const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
 const data = await res.json();
 if (res.ok) { setShowModal(false); setEditItem(null); setForm({ title: '', description: '', subject: '', grade: '', type: 'video', video_url: '', duration: 0, is_free: false, order_index: 0, course_id: '', allow_download: false, ai_summary: false }); fetchAll(); }
 else setErrMsg(data.error || 'فشل الحفظ');
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
 };
 const fetchAll = async () => {
 try {
 const [lectRes, courseRes, liveRes] = await Promise.all([
 fetch('/api/lectures', { headers: getHeaders() }),
 fetch('/api/courses', { headers: getHeaders() }),
 fetch('/api/live-sessions', { headers: getHeaders() }),
 ]);
 const [lectData, courseData, liveData] = await Promise.all([
 lectRes.json(), courseRes.json(), liveRes.json()
 ]);
 setLectures(Array.isArray(lectData) ? lectData : []);
 setCourses(Array.isArray(courseData) ? courseData : []);
 setLiveSessions(Array.isArray(liveData) ? liveData : []);
 } catch { } finally { setLoading(false); }
 };

 const createLecture = async () => {
 if (!form.title) return alert('أدخل عنوان المحاضرة');
 setCreateLoading(true);
 try {
 const res = await fetch('/api/lectures', {
 method: 'POST', headers: getHeaders(), body: JSON.stringify(form),
 });
 if (res.ok) { fetchAll(); setTab('list'); alert('CheckCircle تم إنشاء المحاضرة'); }
 else { const e = await res.json(); alert(e.error || 'خطأ'); }
 } catch { alert('خطأ'); } finally { setCreateLoading(false); }
 };

 const createLiveSession = async () => {
 if (!liveForm.title || !liveForm.scheduled_at) return alert('أدخل العنوان والتاريخ');
 setLiveLoading(true);
 try {
 const res = await fetch('/api/live-sessions', {
 method: 'POST', headers: getHeaders(), body: JSON.stringify(liveForm),
 });
 if (res.ok) { fetchAll(); alert('<CheckCircle size={18} color="#10B981" /> تم إنشاء جلسة البث'); }
 else { const e = await res.json(); alert(e.error || 'خطأ'); }
 } catch { alert('خطأ'); } finally { setLiveLoading(false); }
 };

 const deleteLecture = async (id: number) => {
 if (!confirm('حذف المحاضرة؟')) return;
 await fetch(`/api/lectures/${id}`, { method: 'DELETE', headers: getHeaders() });
 fetchAll();
 };

 const generateAISummary = async (id: number) => {
 try {
 const res = await fetch(`/api/lectures/${id}/ai-summary`, { method: 'POST', headers: getHeaders() });
 const data = await res.json();
 if (data.summary) alert(`<FileText size={18} color="#6B7280" /> ملخص الذكاء الاصطناعي:\n\n${data.summary}`);
 else alert('لم يتمكن الذكاء الاصطناعي من توليد الملخص');
 } catch { alert('خطأ'); }
 };

 return (
 <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', direction: 'rtl' }}>

 {/* الهيدر */}
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
 <div>
 <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}><IconRenderer name="ICON_Mic" size={18} /> المحاضرات والتعلم الإلكتروني</h1>
 <p style={{ color: '#9CA3AF', fontSize: 14, margin: '4px 0 0' }}>إدارة المحاضرات والدورات والبث المباشر</p>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={() => setTab('live')} style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
 Circle بث مباشر
 </button>
 <button onClick={() => setTab('create')} style={{ background: 'linear-gradient(135deg, #D4A843, #f0c040)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
 + محاضرة جديدة
 </button>
 </div>
 </div>

 {/* التبويبات */}
 <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
 {[
 { key: 'list', label: 'ClipboardList المحاضرات', count: lectures.length },
 { key: 'courses', label: 'BookOpen الدورات', count: courses.length },
 { key: 'live', label: 'Circle البث المباشر', count: liveSessions.length },
 { key: 'create', label: 'Plus إضافة محاضرة', count: null },
 ].map(t => (
 <button key={t.key} onClick={() => setTab(t.key as any)} style={{
 background: tab === t.key ? 'rgba(201,162,39,0.2)' : 'transparent',
 color: tab === t.key ? '#D4A843' : '#9CA3AF',
 border: tab === t.key ? '1px solid rgba(201,162,39,0.3)' : '1px solid transparent',
 padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
 display: 'flex', alignItems: 'center', gap: 6,
 }}>
 {t.label}
 {t.count !== null && <span style={{ background: 'rgba(201,162,39,0.2)', color: '#D4A843', fontSize: 11, padding: '1px 6px', borderRadius: 10 }}>{t.count}</span>}
 </button>
 ))}
 </div>

 {}
 {/* قائمة المحاضرات */}
 {}
 {tab === 'list' && (
 <div>
 {/* إحصائيات */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المحاضرات', value: lectures.length, icon: "ICON_Clapperboard", color: '#3B82F6' },
 { label: 'فيديو مسجل', value: lectures.filter(l => l.type === 'video').length, icon: "ICON_Video", color: '#8B5CF6' },
 { label: 'بث مباشر', value: liveSessions.filter(l => l.status === 'live').length, icon: "ICON_Circle", color: '#EF4444' },
 { label: 'الدورات', value: courses.length, icon: "ICON_BookOpen", color: '#10B981' },
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
 ) : lectures.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Mic size={36} color="#D4A843" /></div>
 <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>لا توجد محاضرات بعد</div>
 <button onClick={() => setTab('create')} style={{ marginTop: 20, background: '#D4A843', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
 + إضافة محاضرة
 </button>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
 {lectures.map((lec: any) => {
 const typeConf = LECTURE_TYPES.find(t => t.value === lec.type) || LECTURE_TYPES[0];
 return (
 <div key={lec.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
 {/* صورة مصغرة */}
 <div style={{ height: 140, background: `linear-gradient(135deg, #1a2d4a, #06060E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
 {lec.thumbnail ? (
 <img src={lec.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
 ) : (
 <div style={{width:44,height:44,borderRadius:10,background:"rgba(59,130,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><IconRenderer name={typeConf.icon} size={20} /></div>
 )}
 <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '3px 8px', fontSize: 11, color: '#fff' }}>
 <IconRenderer name={typeConf.icon} /> {typeConf.label}
 </div>
 {lec.duration > 0 && (
 <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: '#fff' }}>
 ⏱ {lec.duration} دقيقة
 </div>
 )}
 </div>
 <div style={{ padding: '14px 16px' }}>
 <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>{lec.title}</h3>
 {lec.subject && <div style={{ color: '#9CA3AF', fontSize: 12, marginBottom: 4 }}><BookOpen size={18} color="#6B7280" /> {lec.subject} {lec.grade ? `• ${lec.grade}` : ''}</div>}
 {lec.description && <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.5 }}>{lec.description?.substring(0, 80)}...</div>}
 <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
 {lec.video_url && (
 <a href={lec.video_url} target="_blank" rel="noreferrer" style={{ flex: 1, background: 'rgba(59,130,246,0.15)', color: '#3B82F6', fontSize: 12, padding: '7px', borderRadius: 8, textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
 <IconRenderer name="ICON_Eye" size={18} /> مشاهدة
 </a>
 )}
 <button onClick={() => generateAISummary(lec.id)} style={{ background: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: 'none', fontSize: 12, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
 Bot ملخص AI
 </button>
 <button onClick={() => deleteLecture(lec.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', fontSize: 12, padding: '7px 10px', borderRadius: 8, cursor: 'pointer' }}>
 Trash2
 </button>
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
 {/* البث المباشر */}
 {}
 {tab === 'live' && (
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
 {/* إنشاء جلسة بث */}
 <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '24px' }}>
 <h3 style={{ color: '#EF4444', fontSize: 16, fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_Circle" size={18} /> جلسة بث مباشر جديدة</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>عنوان الجلسة *</label>
 <input value={liveForm.title} onChange={e => setLiveForm({ ...liveForm, title: e.target.value })}
 placeholder="مثال: محاضرة الفصل الثاني - الجبر"
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>تاريخ ووقت البث *</label>
 <input type="datetime-local" value={liveForm.scheduled_at} onChange={e => setLiveForm({ ...liveForm, scheduled_at: e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>المنصة</label>
 <select value={liveForm.platform} onChange={e => setLiveForm({ ...liveForm, platform: e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: '#1a1a3a', color: '#fff', fontSize: 14, boxSizing: 'border-box' }}>
 <option value="zoom">Zoom</option>
 <option value="google_meet">Google Meet</option>
 <option value="microsoft_teams"><IconRenderer name="ICON_Mic" size={18} />rosoft Teams</option>
 <option value="youtube">YouTube Live</option>
 <option value="custom">رابط مخصص</option>
 </select>
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>رابط الاجتماع</label>
 <input value={liveForm.meeting_link} onChange={e => setLiveForm({ ...liveForm, meeting_link: e.target.value })}
 placeholder="https://zoom.us/j/..."
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>كلمة المرور (اختياري)</label>
 <input value={liveForm.password} onChange={e => setLiveForm({ ...liveForm, password: e.target.value })}
 placeholder="كلمة مرور الاجتماع"
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>الوصف</label>
 <textarea value={liveForm.description} onChange={e => setLiveForm({ ...liveForm, description: e.target.value })}
 placeholder="وصف الجلسة..." rows={3}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
 </div>
 <button onClick={createLiveSession} disabled={liveLoading} style={{
 background: liveLoading ? 'rgba(239,68,68,0.3)' : 'linear-gradient(135deg, #EF4444, #F87171)',
 color: '#fff', border: 'none', padding: '12px', borderRadius: 10,
 cursor: liveLoading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700,
 }}>
 {liveLoading ? '⏳ جاري الإنشاء...' : 'Circle إنشاء جلسة البث'}
 </button>
 </div>
 </div>

 {/* الجلسات المجدولة */}
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
 <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 20 }}><IconRenderer name="ICON_Calendar" size={18} /> الجلسات المجدولة</h3>
 {liveSessions.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B7280' }}>
 <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}><IconRenderer name="ICON_Calendar" size={28} /></div>
 <div>لا توجد جلسات مجدولة</div>
 </div>
 ) : liveSessions.map((session: any, i: number) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '14px 16px', marginBottom: 12, border: session.status === 'live' ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.06)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
 {session.status === 'live' && <span style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}><IconRenderer name="ICON_Circle" size={18} /> مباشر الآن</span>}
 {session.status === 'scheduled' && <span style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}><IconRenderer name="ICON_Calendar" size={18} /> مجدول</span>}
 {session.status === 'ended' && <span style={{ background: 'rgba(156,163,175,0.15)', color: '#9CA3AF', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}><IconRenderer name="ICON_Check" size={18} /> انتهى</span>}
 </div>
 <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 700 }}>{session.title}</div>
 {session.scheduled_at && (
 <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
 Calendar {new Date(session.scheduled_at).toLocaleString('ar-SA')}
 </div>
 )}
 {session.platform && <div style={{ color: '#9CA3AF', fontSize: 12 }}><IconRenderer name="ICON_Laptop" size={18} /> {session.platform}</div>}
 </div>
 {session.meeting_link && (
 <a href={session.meeting_link} target="_blank" rel="noreferrer" style={{
 background: session.status === 'live' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.15)',
 color: session.status === 'live' ? '#EF4444' : '#3B82F6',
 fontSize: 12, padding: '7px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 600,
 }}>
 {session.status === 'live' ? 'Circle انضم الآن' : 'Link الرابط'}
 </a>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 )}

 {}
 {/* إضافة محاضرة */}
 {}
 {tab === 'create' && (
 <div style={{ maxWidth: 700, margin: '0 auto' }}>
 <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '28px' }}>
 <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 24 }}><IconRenderer name="ICON_Plus" size={18} /> إضافة محاضرة جديدة</h3>
 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
 {/* نوع المحاضرة */}
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 8 }}>نوع المحاضرة</label>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
 {LECTURE_TYPES.map(t => (
 <button key={t.value} onClick={() => setForm({ ...form, type: t.value })} style={{
 background: form.type === t.value ? 'rgba(201,162,39,0.2)' : 'rgba(255,255,255,0.03)',
 border: form.type === t.value ? '1px solid rgba(201,162,39,0.4)' : '1px solid rgba(255,255,255,0.08)',
 borderRadius: 10, padding: '10px 8px', cursor: 'pointer', textAlign: 'center',
 }}>
 <div style={{ fontSize: 20 }}><IconRenderer name={t.icon} /></div>
 <div style={{ color: form.type === t.value ? '#D4A843' : '#9CA3AF', fontSize: 11, marginTop: 4 }}>{t.label}</div>
 </button>
 ))}
 </div>
 </div>

 {[
 { label: 'عنوان المحاضرة *', key: 'title', placeholder: 'مثال: مقدمة في الجبر' },
 { label: 'المادة', key: 'subject', placeholder: 'مثال: الرياضيات' },
 { label: 'الصف / المرحلة', key: 'grade', placeholder: 'مثال: الصف الثالث' },
 { label: 'رابط الفيديو / الملف', key: 'video_url', placeholder: 'https://...' },
 ].map(f => (
 <div key={f.key}>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>{f.label}</label>
 <input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
 placeholder={f.placeholder}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 ))}

 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>الوصف</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
 placeholder="وصف المحاضرة..." rows={3}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
 </div>

 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>المدة (دقيقة)</label>
 <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, boxSizing: 'border-box' }} />
 </div>
 <div>
 <label style={{ color: '#9CA3AF', fontSize: 12, display: 'block', marginBottom: 6 }}>الدورة (اختياري)</label>
 <select value={form.course_id} onChange={e => setForm({ ...form, course_id: e.target.value })}
 style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: '#1a2d4a', color: '#fff', fontSize: 14, boxSizing: 'border-box' }}>
 <option value="">-- بدون دورة --</option>
 {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
 </select>
 </div>
 </div>

 <div style={{ display: 'flex', gap: 16 }}>
 {[
 { key: 'is_free', label: 'محاضرة مجانية' },
 { key: 'allow_download', label: 'السماح بالتحميل' },
 { key: 'ai_summary', label: 'Bot توليد ملخص AI تلقائياً' },
 ].map(opt => (
 <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
 <input type="checkbox" checked={(form as any)[opt.key]} onChange={e => setForm({ ...form, [opt.key]: e.target.checked })} />
 <span style={{ color: '#E2E8F0', fontSize: 13 }}>{opt.label}</span>
 </label>
 ))}
 </div>

 <button onClick={createLecture} disabled={createLoading} style={{
 background: createLoading ? 'rgba(201,162,39,0.3)' : 'linear-gradient(135deg, #D4A843, #f0c040)',
 color: '#fff', border: 'none', padding: '14px', borderRadius: 12,
 cursor: createLoading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 700,
 }}>
 {createLoading ? '⏳ جاري الحفظ...' : 'Save حفظ المحاضرة'}
 </button>
 </div>
 </div>
 </div>
 )}

 {}
 {/* الدورات */}
 {}
 {tab === 'courses' && (
 <div>
 <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
 <button style={{ background: '#D4A843', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
 + إنشاء دورة
 </button>
 </div>
 {courses.length === 0 ? (
 <div style={{ textAlign: 'center', padding: '64px', background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)' }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,162,39,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><IconRenderer name="ICON_Book" size={36} /></div>
 <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>لا توجد دورات بعد</div>
 <div style={{ color: '#9CA3AF', marginTop: 8 }}>أنشئ دورة وأضف لها المحاضرات</div>
 </div>
 ) : (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
 {courses.map((c: any) => (
 <div key={c.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
 <div style={{ height: 140, background: 'linear-gradient(135deg, #1a2d4a, #06060E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 {c.thumbnail ? <img src={c.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{width:44,height:44,borderRadius:10,background:"rgba(201,168,67,0.15)",display:"flex",alignItems:"center",justifyContent:"center"}}><BookOpen size={20} color="#D4A843" /></div>}
 </div>
 <div style={{ padding: '14px 16px' }}>
 <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{c.title}</h3>
 {c.subject && <div style={{ color: '#9CA3AF', fontSize: 12 }}><IconRenderer name="ICON_BookOpen" size={18} /> {c.subject}</div>}
 <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
 <span style={{ background: c.is_published ? 'rgba(16,185,129,0.15)' : 'rgba(156,163,175,0.15)', color: c.is_published ? '#10B981' : '#9CA3AF', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700 }}>
 {c.is_published ? 'Check منشور' : 'FileText مسودة'}
 </span>
 <span style={{ color: '#9CA3AF', fontSize: 12 }}>{c.lectures_count || 0} محاضرة</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: 20 }}>
 <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, direction: 'rtl', margin: 'auto' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#D4A843', fontSize: 18, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل المحاضرة' : '+ إضافة محاضرة'}</h2>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
 </div>
 {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
 {[
 { label: 'عنوان المحاضرة *', key: 'title', type: 'text', placeholder: 'أدخل عنوان المحاضرة' },
 { label: 'رابط الفيديو', key: 'video_url', type: 'url', placeholder: 'https://...' },
 { label: 'المادة', key: 'subject', type: 'text', placeholder: 'مثال: رياضيات' },
 { label: 'الصف', key: 'grade', type: 'text', placeholder: 'مثال: الصف الأول' },
 ].map(({ label, key, type, placeholder }) => (
 <div key={key} style={{ marginBottom: 14 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
 <input type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
 </div>
 ))}
 <div style={{ marginBottom: 14 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع المحاضرة</label>
 <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
 {LECTURE_TYPES.map(t => <option key={t.value} value={t.value}><IconRenderer name={t.icon} /> {t.label}</option>)}
 </select>
 </div>
 <div style={{ marginBottom: 20 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>الوصف</label>
 <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="وصف المحاضرة..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box' as const }} />
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={handleSaveLecture} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg,#D4A843,#E8C547)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#06060E', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المحاضرة'}</button>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
