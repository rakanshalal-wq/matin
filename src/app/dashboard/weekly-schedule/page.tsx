'use client';
export const dynamic = 'force-dynamic';
import IconRenderer from "@/components/IconRenderer";
import { Calendar, ClipboardList, DoorOpen, Pencil, School, Trash2, User } from "lucide-react";
import { useState, useEffect } from 'react';

// ─── ثوابت التصميم ───────────────────────────────────────────────
const DARK = '#0A0A14';
const CARD = '#0F0F1E';
const BORDER = 'rgba(255,255,255,0.08)';
const GOLD = '#C9A84C';
const RED = '#EF4444';
const GREEN = '#22C55E';

const inp: any = {
 background: 'rgba(255,255,255,0.06)',
 border: `1px solid ${BORDER}`,
 borderRadius: 10,
 padding: '10px 14px',
 color: 'white',
 fontSize: 14,
 outline: 'none',
 width: '100%',
};

const btn = (bg: string, color = '#000') => ({
 background: bg, color, border: 'none', borderRadius: 10,
 padding: '9px 18px', fontWeight: 700, fontSize: 13,
 cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
});

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const SUBJECT_COLORS = [
 '#C9A84C', '#3B82F6', '#22C55E', '#8B5CF6', '#F59E0B',
 '#EC4899', '#14B8A6', '#EF4444', '#6366F1', '#84CC16',
];

function getH(): Record<string, string> {
 try {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 const h: Record<string, string> = { 'Content-Type': 'application/json' };
 if (u.token) h['Authorization'] = `Bearer ${u.token}`;
 return h;
 } catch { return { 'Content-Type': 'application/json' }; }
}

function Modal({ title, onClose, children }: any) {
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
 style={{ background: 'rgba(0,0,0,0.85)' }}>
 <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
 style={{ background: CARD, border: `1px solid ${BORDER}` }}>
 <div className="flex items-center justify-between px-6 py-4"
 style={{ borderBottom: `1px solid ${BORDER}` }}>
 <h3 className="font-black text-lg text-white">{title}</h3>
 <button onClick={onClose} style={{ color: '#888', fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
 </div>
 <div className="p-6">{children}</div>
 </div>
 </div>
 );
}

export default function WeeklySchedulePage() {
 const [view, setView] = useState<'class' | 'teacher'>('class');
 const [semester, setSemester] = useState('1');
 const [selectedClass, setSelectedClass] = useState('');
 const [selectedTeacher, setSelectedTeacher] = useState('');

 const [schedule, setSchedule] = useState<any[]>([]);
 const [classes, setClasses] = useState<any[]>([]);
 const [teachers, setTeachers] = useState<any[]>([]);
 const [subjects, setSubjects] = useState<any[]>([]);
 const [periods, setPeriods] = useState<any[]>([]);

 const [loading, setLoading] = useState(false);
 const [toast, setToast] = useState('');
 const [toastType, setToastType] = useState<'ok' | 'err'>('ok');

 const [modal, setModal] = useState<null | 'addSlot' | 'editSlot' | 'editPeriods'>(null);
 const [selectedSlot, setSelectedSlot] = useState<any>(null);
 const [form, setForm] = useState<any>({});
 const [periodsForm, setPeriodsForm] = useState<any[]>([]);

 // خريطة ألوان المواد
 const [subjectColorMap, setSubjectColorMap] = useState<Record<string, string>>({});

 useEffect(() => {
 loadClasses();
 loadTeachers();
 loadSubjects();
 loadPeriods();
 }, []);

 useEffect(() => {
 if (view === 'class' && selectedClass) loadSchedule();
 if (view === 'teacher' && selectedTeacher) loadSchedule();
 }, [view, selectedClass, selectedTeacher, semester]);

 useEffect(() => {
 // بناء خريطة ألوان المواد
 const map: Record<string, string> = {};
 subjects.forEach((s: any, i: number) => {
 map[s.id] = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
 });
 setSubjectColorMap(map);
 }, [subjects]);

 const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
 setToast(msg); setToastType(type);
 setTimeout(() => setToast(''), 3000);
 };

 const loadSchedule = async () => {
 setLoading(true);
 try {
 let url = `/api/weekly-schedule?semester=${semester}`;
 if (view === 'class' && selectedClass) url += `&class_id=${selectedClass}`;
 if (view === 'teacher' && selectedTeacher) url += `&teacher_id=${selectedTeacher}`;
 const r = await fetch(url, { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setSchedule(Array.isArray(d) ? d : []);
 } catch { showToast('فشل تحميل الجدول', 'err'); }
 finally { setLoading(false); }
 };

 const loadClasses = async () => {
 try {
 const r = await fetch('/api/classes', { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setClasses(Array.isArray(d) ? d : []);
 } catch {}
 };

 const loadTeachers = async () => {
 try {
 const r = await fetch('/api/teachers', { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setTeachers(Array.isArray(d) ? d : []);
 } catch {}
 };

 const loadSubjects = async () => {
 try {
 const r = await fetch('/api/subjects', { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setSubjects(Array.isArray(d) ? d : []);
 } catch {}
 };

 const loadPeriods = async () => {
 try {
 const r = await fetch('/api/academic-structure?type=periods', { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setPeriods(Array.isArray(d) ? d : []);
 } catch {}
 };

 // الحصص التي ليست استراحة
 const activePeriods = periods.filter((p: any) => !p.is_break);

 // الحصة في خلية معينة
 const getSlot = (day: number, period: number) =>
 schedule.find((s: any) =>
 (s.day_of_week === day || s.day_of_week === String(day)) &&
 (s.period_num === period || s.period_num === String(period))
 );

 const openAdd = (day: number, period: number, periodData: any) => {
 const p = periods.find((pp: any) => pp.period_num === period);
 setForm({
 day_of_week: day,
 period_num: period,
 start_time: p?.start_time || '08:00',
 end_time: p?.end_time || '09:00',
 class_id: selectedClass,
 semester,
 });
 setSelectedSlot(null);
 setModal('addSlot');
 };

 const openEdit = (slot: any) => {
 setSelectedSlot(slot);
 setForm({ ...slot });
 setModal('editSlot');
 };

 const saveSlot = async () => {
 try {
 const r = await fetch('/api/weekly-schedule', {
 method: 'POST',
 headers: getH(),
 credentials: 'include',
 body: JSON.stringify(form),
 });
 const d = await r.json();
 if (!r.ok) return showToast(d.error || 'فشل الحفظ', 'err');
 showToast('تمت إضافة الحصة');
 setModal(null);
 loadSchedule();
 } catch { showToast('خطأ في الاتصال', 'err'); }
 };

 const updateSlot = async () => {
 try {
 const r = await fetch('/api/weekly-schedule', {
 method: 'PUT',
 headers: getH(),
 credentials: 'include',
 body: JSON.stringify(form),
 });
 const d = await r.json();
 if (!r.ok) return showToast(d.error || 'فشل التعديل', 'err');
 showToast('تم التعديل');
 setModal(null);
 loadSchedule();
 } catch { showToast('خطأ', 'err'); }
 };

 const deleteSlot = async (id: number) => {
 if (!confirm('حذف هذه الحصة؟')) return;
 try {
 const r = await fetch(`/api/weekly-schedule?id=${id}`, {
 method: 'DELETE', headers: getH(), credentials: 'include',
 });
 if (r.ok) { showToast('تم الحذف'); loadSchedule(); }
 else showToast('فشل الحذف', 'err');
 } catch { showToast('خطأ', 'err'); }
 };

 const openEditPeriods = () => {
 setPeriodsForm(periods.length > 0 ? [...periods] : getDefaultPeriods());
 setModal('editPeriods');
 };

 const savePeriods = async () => {
 try {
 const r = await fetch('/api/academic-structure', {
 method: 'POST',
 headers: getH(),
 credentials: 'include',
 body: JSON.stringify({ action: 'save_periods', periods: periodsForm }),
 });
 const d = await r.json();
 if (!r.ok) return showToast(d.error || 'فشل', 'err');
 showToast('تم حفظ أوقات الحصص');
 setModal(null);
 loadPeriods();
 } catch { showToast('خطأ', 'err'); }
 };

 const getSubjectColor = (slot: any) => {
 if (slot.subject_color) return slot.subject_color;
 return subjectColorMap[slot.subject_id] || GOLD;
 };

 return (
 <div className="min-h-screen p-6" style={{ background: DARK, color: 'white', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>

 {/* Toast */}
 {toast && (
 <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold"
 style={{ background: toastType === 'ok' ? '#16A34A' : RED, color: 'white' }}>
 {toast}
 </div>
 )}

 {/* Header */}
 <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
 <div>
 <h1 className="text-3xl font-black text-white mb-1"><Calendar size={18} color="#F59E0B" /> الجدول الأسبوعي</h1>
 <p className="text-gray-400 text-sm">إدارة جدول الحصص — قابل للتخصيص الكامل</p>
 </div>
 <button onClick={openEditPeriods}
 style={{ ...btn('rgba(255,255,255,0.08)', '#ccc'), padding: '10px 18px' }}>
 ⏰ تعديل أوقات الحصص
 </button>
 </div>

 {/* Controls */}
 <div className="flex flex-wrap gap-3 mb-6 items-center">
 {/* عرض */}
 <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
 {[
 { key: 'class', label: 'School حسب الفصل' },
 { key: 'teacher', label: '<User size={16} /><School size={18} color="#3B82F6" /> حسب المعلم' },
 ].map((v) => (
 <button key={v.key} onClick={() => setView(v.key as any)}
 style={{
 ...btn(view === v.key ? GOLD : 'transparent', view === v.key ? '#000' : '#aaa'),
 borderRadius: 0, padding: '9px 16px',
 }}>
 {v.label}
 </button>
 ))}
 </div>

 {/* الفصل / المعلم */}
 {view === 'class' ? (
 <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
 style={{ ...inp, width: 200 }}>
 <option value="">اختر الفصل...</option>
 {classes.map((c: any) => (
 <option key={c.id} value={c.id}>{c.name} {c.grade_level ? `— ${c.grade_level}` : ''}</option>
 ))}
 </select>
 ) : (
 <select value={selectedTeacher} onChange={e => setSelectedTeacher(e.target.value)}
 style={{ ...inp, width: 220 }}>
 <option value="">اختر المعلم...</option>
 {teachers.map((t: any) => (
 <option key={t.id} value={t.id}>{t.name || t.user_name}</option>
 ))}
 </select>
 )}

 {/* الفصل الدراسي */}
 <select value={semester} onChange={e => setSemester(e.target.value)}
 style={{ ...inp, width: 160 }}>
 <option value="1">الفصل الأول</option>
 <option value="2">الفصل الثاني</option>
 <option value="3">الفصل الثالث</option>
 </select>
 </div>

 {/* الجدول */}
 {(!selectedClass && view === 'class') || (!selectedTeacher && view === 'teacher') ? (
 <div className="text-center py-20 text-gray-500">
 <div className="text-5xl mb-4"><ClipboardList size={18} color="#6B7280" /></div>
 <p>اختر {view === 'class' ? 'فصلاً' : 'معلماً'} لعرض الجدول</p>
 </div>
 ) : loading ? (
 <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
 ) : activePeriods.length === 0 ? (
 <div className="text-center py-20 text-gray-500">
 <p>لا توجد أوقات حصص محددة</p>
 <button onClick={openEditPeriods} style={{ ...btn(GOLD), marginTop: 16 }}>تحديد أوقات الحصص</button>
 </div>
 ) : (
 <div className="overflow-x-auto">
 <div style={{ overflowX: 'auto' }}>
<table className="w-full min-w-[700px] text-sm border-collapse">
 <thead>
 <tr>
 <th className="text-right px-3 py-3 text-gray-400 font-bold w-32"
 style={{ borderBottom: `2px solid ${BORDER}` }}>
 الحصة / اليوم
 </th>
 {DAYS.map((day, di) => (
 <th key={di} className="text-center px-2 py-3 font-black"
 style={{ borderBottom: `2px solid ${GOLD}44`, color: GOLD, minWidth: 120 }}>
 {day}
 </th>
 ))}
 </tr>
 </thead>
 <tbody>
 {activePeriods.map((period: any) => (
 <tr key={period.period_num}
 style={{ borderBottom: `1px solid ${BORDER}` }}>
 {/* اسم الحصة */}
 <td className="px-3 py-2 text-right">
 <div className="font-bold text-white text-xs">{period.name_ar}</div>
 <div className="text-gray-500 text-xs mt-0.5">
 {period.start_time?.slice(0, 5)} – {period.end_time?.slice(0, 5)}
 </div>
 </td>

 {/* خلايا الأيام */}
 {DAYS.map((_, di) => {
 const slot = getSlot(di, period.period_num);
 const color = slot ? getSubjectColor(slot) : GOLD;

 return (
 <td key={di} className="px-2 py-2 text-center">
 {slot ? (
 <div className="rounded-xl p-2 relative group"
 style={{ background: `${color}18`, border: `1px solid ${color}44` }}>
 <div className="font-bold text-xs mb-1" style={{ color }}>{slot.subject_name}</div>
 {slot.teacher_name && (
 <div className="text-xs text-gray-400">{slot.teacher_name}</div>
 )}
 {slot.room && (
 <div className="text-xs text-gray-500 mt-0.5">DoorOpen {slot.room}</div>
 )}
 {/* أزرار التعديل والحذف */}
 <div className="absolute inset-0 rounded-xl flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
 style={{ background: 'rgba(0,0,0,0.7)' }}>
 <button onClick={() => openEdit(slot)}
 style={{ ...btn('rgba(255,255,255,0.15)', '#fff'), padding: '4px 8px', fontSize: 11 }}>
 <Pencil size={16} />
 </button>
 <button onClick={() => deleteSlot(slot.id)}
 style={{ ...btn(`${RED}33`, RED), padding: '4px 8px', fontSize: 11 }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 ) : (
 view === 'class' && selectedClass ? (
 <button onClick={() => openAdd(di, period.period_num, period)}
 className="w-full rounded-xl py-3 text-xs transition-all hover:opacity-80"
 style={{
 background: 'rgba(255,255,255,0.02)',
 border: `1px dashed ${BORDER}`,
 color: '#444',
 }}>
 + إضافة
 </button>
 ) : (
 <div className="text-gray-700 text-xs py-3">—</div>
 )
 )}
 </td>
 );
 })}
 </tr>
 ))}
 </tbody>
 </table>
</div>
 </div>
 )}

 {/* ملخص الجدول */}
 {schedule.length > 0 && (
 <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'إجمالي الحصص', value: schedule.length, color: GOLD },
 { label: 'أيام مشغولة', value: new Set(schedule.map((s: any) => s.day_of_week)).size, color: '#3B82F6' },
 { label: 'مواد مختلفة', value: new Set(schedule.map((s: any) => s.subject_id)).size, color: GREEN },
 { label: 'معلمون', value: new Set(schedule.filter((s: any) => s.teacher_id).map((s: any) => s.teacher_id)).size, color: '#8B5CF6' },
 ].map((stat) => (
 <div key={stat.label} className="rounded-xl p-4 text-center"
 style={{ background: CARD, border: `1px solid ${stat.color}33` }}>
 <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
 <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
 </div>
 ))}
 </div>
 )}

 {}

 {/* إضافة حصة */}
 {modal === 'addSlot' && (
 <Modal title={`إضافة حصة — ${DAYS[form.day_of_week]} — الحصة ${form.period_num}`} onClose={() => setModal(null)}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">المادة *</label>
 <select style={inp} value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
 <option value="">اختر المادة...</option>
 {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">المعلم</label>
 <select style={inp} value={form.teacher_id || ''} onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
 <option value="">بدون معلم</option>
 {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name || t.user_name}</option>)}
 </select></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">وقت البداية</label>
 <input type="time" style={inp} value={form.start_time || ''} onChange={e => setForm({ ...form, start_time: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">وقت النهاية</label>
 <input type="time" style={inp} value={form.end_time || ''} onChange={e => setForm({ ...form, end_time: e.target.value })} /></div>
 </div>
 <div><label className="text-xs text-gray-400 mb-1 block">الغرفة / القاعة</label>
 <input style={inp} value={form.room || ''} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="مثال: A101" /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">ملاحظات</label>
 <input style={inp} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
 <button onClick={saveSlot} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ الحصة</button>
 </div>
 </Modal>
 )}

 {/* تعديل حصة */}
 {modal === 'editSlot' && (
 <Modal title="تعديل الحصة" onClose={() => setModal(null)}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">المادة *</label>
 <select style={inp} value={form.subject_id || ''} onChange={e => setForm({ ...form, subject_id: e.target.value })}>
 <option value="">اختر المادة...</option>
 {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">المعلم</label>
 <select style={inp} value={form.teacher_id || ''} onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
 <option value="">بدون معلم</option>
 {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name || t.user_name}</option>)}
 </select></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">وقت البداية</label>
 <input type="time" style={inp} value={(form.start_time || '').slice(0, 5)} onChange={e => setForm({ ...form, start_time: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">وقت النهاية</label>
 <input type="time" style={inp} value={(form.end_time || '').slice(0, 5)} onChange={e => setForm({ ...form, end_time: e.target.value })} /></div>
 </div>
 <div><label className="text-xs text-gray-400 mb-1 block">الغرفة / القاعة</label>
 <input style={inp} value={form.room || ''} onChange={e => setForm({ ...form, room: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">ملاحظات</label>
 <input style={inp} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
 <button onClick={updateSlot} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ التعديلات</button>
 </div>
 </Modal>
 )}

 {/* تعديل أوقات الحصص */}
 {modal === 'editPeriods' && (
 <Modal title="⏰ تخصيص أوقات الحصص" onClose={() => setModal(null)}>
 <p className="text-xs text-gray-400 mb-4">حدد أوقات الحصص والاستراحات حسب جدول مدرستك</p>
 <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
 {periodsForm.map((p: any, i: number) => (
 <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
 <div className="flex items-center gap-2 mb-2">
 <input style={{ ...inp, width: 40, textAlign: 'center', padding: '6px' }}
 type="number" value={p.period_num}
 onChange={e => { const arr = [...periodsForm]; arr[i].period_num = parseInt(e.target.value); setPeriodsForm(arr); }} />
 <input style={{ ...inp, flex: 1 }} value={p.name_ar}
 onChange={e => { const arr = [...periodsForm]; arr[i].name_ar = e.target.value; setPeriodsForm(arr); }}
 placeholder="اسم الحصة" />
 <label className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
 <input type="checkbox" checked={p.is_break || false}
 onChange={e => { const arr = [...periodsForm]; arr[i].is_break = e.target.checked; setPeriodsForm(arr); }} />
 استراحة
 </label>
 <button onClick={() => setPeriodsForm(periodsForm.filter((_, j) => j !== i))}
 style={{ ...btn(`${RED}22`, RED), padding: '4px 8px', fontSize: 12 }}>×</button>
 </div>
 <div className="grid grid-cols-2 gap-2">
 <div>
 <label className="text-xs text-gray-500 mb-1 block">من</label>
 <input type="time" style={{ ...inp, padding: '7px 10px' }} value={p.start_time || ''}
 onChange={e => { const arr = [...periodsForm]; arr[i].start_time = e.target.value; setPeriodsForm(arr); }} />
 </div>
 <div>
 <label className="text-xs text-gray-500 mb-1 block">إلى</label>
 <input type="time" style={{ ...inp, padding: '7px 10px' }} value={p.end_time || ''}
 onChange={e => { const arr = [...periodsForm]; arr[i].end_time = e.target.value; setPeriodsForm(arr); }} />
 </div>
 </div>
 </div>
 ))}
 </div>
 <div className="flex gap-3 mt-4">
 <button onClick={() => setPeriodsForm([...periodsForm, {
 period_num: periodsForm.length + 1,
 name_ar: `الحصة ${periodsForm.length + 1}`,
 start_time: '08:00', end_time: '09:00', is_break: false,
 }])} style={{ ...btn('rgba(255,255,255,0.08)', '#ccc'), flex: 1 }}>
 + إضافة حصة
 </button>
 <button onClick={savePeriods} style={{ ...btn(GOLD), flex: 1 }}>حفظ الأوقات</button>
 </div>
 </Modal>
 )}
 </div>
 );
}

function getDefaultPeriods() {
 return [
 { period_num: 1, name_ar: 'الحصة الأولى', start_time: '07:30', end_time: '08:15', is_break: false },
 { period_num: 2, name_ar: 'الحصة الثانية', start_time: '08:15', end_time: '09:00', is_break: false },
 { period_num: 3, name_ar: 'الحصة الثالثة', start_time: '09:00', end_time: '09:45', is_break: false },
 { period_num: 4, name_ar: 'استراحة', start_time: '09:45', end_time: '10:00', is_break: true },
 { period_num: 5, name_ar: 'الحصة الرابعة', start_time: '10:00', end_time: '10:45', is_break: false },
 { period_num: 6, name_ar: 'الحصة الخامسة', start_time: '10:45', end_time: '11:30', is_break: false },
 { period_num: 7, name_ar: 'استراحة', start_time: '11:30', end_time: '11:45', is_break: true },
 { period_num: 8, name_ar: 'الحصة السادسة', start_time: '11:45', end_time: '12:30', is_break: false },
 { period_num: 9, name_ar: 'الحصة السابعة', start_time: '12:30', end_time: '13:15', is_break: false },
 { period_num: 10, name_ar: 'الحصة الثامنة', start_time: '13:15', end_time: '14:00', is_break: false },
 ];
}
