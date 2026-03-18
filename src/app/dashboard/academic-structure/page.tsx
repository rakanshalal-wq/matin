'use client';
import IconRenderer from "@/components/IconRenderer";
import { Book, BookOpen,, Pencil, School, Search, Target, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';

// ─── ثوابت التصميم ───────────────────────────────────────────────
const DARK = '#0A0A14';
const CARD = '#0F0F1E';
const BORDER = 'rgba(255,255,255,0.08)';
const GOLD = '#C9A84C';
const BLUE = '#3B82F6';
const GREEN = '#22C55E';
const RED = '#EF4444';
const PURPLE = '#8B5CF6';

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

// ─── مساعد Headers ───────────────────────────────────────────────
function getH(): Record<string, string> {
 try {
 const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
 const token = u.token || '';
 const base: Record<string, string> = { 'Content-Type': 'application/json' };
 if (token) base['Authorization'] = `Bearer ${token}`;
 return base;
 } catch { return { 'Content-Type': 'application/json' }; }
}

// ─── مكون Modal ──────────────────────────────────────────────────
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

// ─── مكون Badge ──────────────────────────────────────────────────
function Badge({ text, color }: { text: string; color: string }) {
 return (
 <span style={{
 background: `${color}22`, color, border: `1px solid ${color}44`,
 borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700,
 }}>{text}</span>
 );
}

// ─── الصفحة الرئيسية ─────────────────────────────────────────────
export default function AcademicStructurePage() {
 const [tab, setTab] = useState<'stages' | 'catalog' | 'tracks'>('stages');
 const [data, setData] = useState<any>({ stages: [], grades: [], tracks: [], catalog: [] });
 const [loading, setLoading] = useState(true);
 const [toast, setToast] = useState('');
 const [toastType, setToastType] = useState<'ok' | 'err'>('ok');

 // فلاتر الكتالوج
 const [filterStage, setFilterStage] = useState('');
 const [filterTrack, setFilterTrack] = useState('');
 const [search, setSearch] = useState('');

 // Modals
 const [modal, setModal] = useState<null | 'addStage' | 'editStage' | 'addGrade' | 'editGrade' |
 'addTrack' | 'editTrack' | 'addCatalog' | 'editCatalog'>(null);
 const [selected, setSelected] = useState<any>(null);

 // نماذج
 const [form, setForm] = useState<any>({});

 useEffect(() => { load(); }, []);

 const load = async () => {
 setLoading(true);
 try {
 const r = await fetch('/api/academic-structure?type=all', { headers: getH(), credentials: 'include' });
 const d = await r.json();
 setData(d);
 } catch { showToast('فشل تحميل البيانات', 'err'); }
 finally { setLoading(false); }
 };

 const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
 setToast(msg); setToastType(type);
 setTimeout(() => setToast(''), 3000);
 };

 const openModal = (type: any, item?: any) => {
 setSelected(item || null);
 setForm(item ? { ...item } : {});
 setModal(type);
 };

 const closeModal = () => { setModal(null); setSelected(null); setForm({}); };

 // ─── حفظ ───────────────────────────────────────────────────────
 const save = async (action: string, method: 'POST' | 'PUT' = 'POST') => {
 try {
 const r = await fetch('/api/academic-structure', {
 method,
 headers: getH(),
 credentials: 'include',
 body: JSON.stringify({ action, ...form }),
 });
 const d = await r.json();
 if (!r.ok) return showToast(d.error || 'فشل الحفظ', 'err');
 showToast('تم الحفظ بنجاح');
 closeModal();
 load();
 } catch { showToast('خطأ في الاتصال', 'err'); }
 };

 // ─── حذف ───────────────────────────────────────────────────────
 const del = async (type: string, id: number) => {
 if (!confirm('هل تريد الحذف؟')) return;
 try {
 const r = await fetch(`/api/academic-structure?type=${type}&id=${id}`, {
 method: 'DELETE', headers: getH(), credentials: 'include',
 });
 if (r.ok) { showToast('تم الحذف'); load(); }
 else showToast('فشل الحذف', 'err');
 } catch { showToast('خطأ', 'err'); }
 };

 // ─── فلترة الكتالوج ────────────────────────────────────────────
 const filteredCatalog = (data.catalog || []).filter((s: any) => {
 if (filterStage && String(s.stage_id) !== filterStage) return false;
 if (filterTrack && String(s.track_id) !== filterTrack) return false;
 if (search && !s.name_ar.includes(search) && !(s.name_en || '').toLowerCase().includes(search.toLowerCase())) return false;
 return true;
 });

 const stageColors: any = { 1: GOLD, 2: BLUE, 3: GREEN };
 const trackColors: any = { 1: '#94A3B8', 2: '#94A3B8', 3: BLUE, 4: PURPLE, 5: GREEN, 6: GOLD, 7: '#F59E0B' };

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
 <div className="mb-8">
 <h1 className="text-3xl font-black text-white mb-1"><IconRenderer name="ICON_School" size={18} /> الهيكل الأكاديمي</h1>
 <p className="text-gray-400 text-sm">المراحل والصفوف والمواد وفق وزارة التعليم السعودية — قابل للتخصيص</p>
 </div>

 {/* Tabs */}
 <div className="flex gap-2 mb-6">
 {[
 { key: 'stages', label: 'BookOpen المراحل والصفوف' },
 { key: 'catalog', label: 'Book المواد الدراسية' },
 { key: 'tracks', label: '[Target] المسارات' },
 ].map((t) => (
 <button key={t.key} onClick={() => setTab(t.key as any)}
 style={{
 ...btn(tab === t.key ? GOLD : 'rgba(255,255,255,0.06)', tab === t.key ? '#000' : '#aaa'),
 padding: '10px 20px',
 }}>
 {t.label}
 </button>
 ))}
 </div>

 {loading ? (
 <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
 ) : (
 <>
 {}
 {tab === 'stages' && (
 <div>
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-lg font-bold text-white">المراحل الدراسية</h2>
 <button onClick={() => openModal('addStage')} style={btn(GOLD)}>+ إضافة مرحلة</button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {(data.stages || []).map((stage: any) => {
 const grades = (data.grades || []).filter((g: any) => g.stage_id === stage.id);
 const color = stageColors[stage.id] || BLUE;
 return (
 <div key={stage.id} className="rounded-2xl overflow-hidden"
 style={{ border: `1px solid ${color}33`, background: CARD }}>
 {/* رأس المرحلة */}
 <div className="px-5 py-4 flex items-center justify-between"
 style={{ background: `${color}18`, borderBottom: `1px solid ${color}33` }}>
 <div>
 <h3 className="font-black text-lg" style={{ color }}>{stage.name_ar}</h3>
 <p className="text-xs text-gray-400 mt-0.5">{stage.years_count} سنوات — {stage.description}</p>
 </div>
 <div className="flex gap-2">
 <button onClick={() => openModal('editStage', stage)}
 style={{ ...btn('rgba(255,255,255,0.08)', '#ccc'), padding: '6px 12px', fontSize: 12 }}>
 <Pencil size={16} />
 </button>
 <button onClick={() => del('stage', stage.id)}
 style={{ ...btn(`${RED}22`, RED), padding: '6px 12px', fontSize: 12 }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>

 {/* الصفوف */}
 <div className="p-4">
 <div className="flex justify-between items-center mb-3">
 <span className="text-xs text-gray-400 font-bold">الصفوف ({grades.length})</span>
 <button onClick={() => openModal('addGrade', { stage_id: stage.id, stage_name: stage.name_ar })}
 style={{ ...btn(`${color}22`, color), padding: '4px 10px', fontSize: 12 }}>
 + صف
 </button>
 </div>
 <div className="flex flex-col gap-2">
 {grades.map((g: any) => (
 <div key={g.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
 style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}` }}>
 <span className="text-sm text-white font-bold">{g.name_ar}</span>
 <div className="flex gap-1">
 <button onClick={() => openModal('editGrade', g)}
 style={{ ...btn('rgba(255,255,255,0.06)', '#aaa'), padding: '3px 8px', fontSize: 11 }}>
 <Pencil size={16} />
 </button>
 <button onClick={() => del('grade', g.id)}
 style={{ ...btn(`${RED}15`, RED), padding: '3px 8px', fontSize: 11 }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {}
 {tab === 'catalog' && (
 <div>
 <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
 <div className="flex gap-3 flex-wrap">
 <input value={search} onChange={e => setSearch(e.target.value)}
 placeholder="[Search] بحث عن مادة..." style={{ ...inp, width: 200 }} />
 <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
 style={{ ...inp, width: 160 }}>
 <option value="">كل المراحل</option>
 {(data.stages || []).map((s: any) => (
 <option key={s.id} value={s.id}>{s.name_ar}</option>
 ))}
 </select>
 <select value={filterTrack} onChange={e => setFilterTrack(e.target.value)}
 style={{ ...inp, width: 200 }}>
 <option value="">كل المسارات</option>
 {(data.tracks || []).map((t: any) => (
 <option key={t.id} value={t.id}>{t.name_ar}</option>
 ))}
 </select>
 </div>
 <button onClick={() => openModal('addCatalog')} style={btn(GOLD)}>+ إضافة مادة</button>
 </div>

 <div className="text-xs text-gray-500 mb-3">{filteredCatalog.length} مادة</div>

 <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
 <table className="w-full text-sm">
 <thead>
 <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: `1px solid ${BORDER}` }}>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">المادة</th>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">الكود</th>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">المرحلة</th>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">المسار</th>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">ح/أسبوع</th>
 <th className="text-right px-4 py-3 text-gray-400 font-bold">النوع</th>
 <th className="px-4 py-3"></th>
 </tr>
 </thead>
 <tbody>
 {filteredCatalog.map((s: any, i: number) => (
 <tr key={s.id} style={{
 borderBottom: `1px solid ${BORDER}`,
 background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
 }}>
 <td className="px-4 py-3">
 <div className="font-bold text-white">{s.name_ar}</div>
 {s.name_en && <div className="text-xs text-gray-500">{s.name_en}</div>}
 </td>
 <td className="px-4 py-3 text-gray-400 font-mono text-xs">{s.code || '—'}</td>
 <td className="px-4 py-3">
 {s.stage_name && <Badge text={s.stage_name} color={stageColors[s.stage_id] || BLUE} />}
 </td>
 <td className="px-4 py-3">
 {s.track_name && <Badge text={s.track_name} color={trackColors[s.track_id] || '#888'} />}
 </td>
 <td className="px-4 py-3 text-center">
 <span style={{ color: GOLD, fontWeight: 700 }}>{s.weekly_hours}</span>
 </td>
 <td className="px-4 py-3">
 <Badge text={s.is_core ? 'إلزامي' : 'اختياري'} color={s.is_core ? GREEN : PURPLE} />
 </td>
 <td className="px-4 py-3">
 <div className="flex gap-2 justify-end">
 <button onClick={() => openModal('editCatalog', s)}
 style={{ ...btn('rgba(255,255,255,0.06)', '#ccc'), padding: '5px 10px', fontSize: 12 }}>
 <Pencil size={16} />
 </button>
 <button onClick={() => del('catalog', s.id)}
 style={{ ...btn(`${RED}15`, RED), padding: '5px 10px', fontSize: 12 }}>
 <Trash2 size={16} />
 </button>
 </div>
 </td>
 </tr>
 ))}
 {filteredCatalog.length === 0 && (
 <tr>
 <td colSpan={7} className="text-center py-10 text-gray-500">لا توجد مواد مطابقة</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {}
 {tab === 'tracks' && (
 <div>
 <div className="flex justify-between items-center mb-4">
 <h2 className="text-lg font-bold text-white">المسارات الدراسية</h2>
 <button onClick={() => openModal('addTrack')} style={btn(GOLD)}>+ إضافة مسار</button>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 {(data.tracks || []).map((t: any) => {
 const color = trackColors[t.id] || BLUE;
 const subjectCount = (data.catalog || []).filter((s: any) => s.track_id === t.id).length;
 return (
 <div key={t.id} className="rounded-2xl p-5"
 style={{ background: CARD, border: `1px solid ${color}33` }}>
 <div className="flex items-start justify-between mb-3">
 <div>
 <h3 className="font-black text-base" style={{ color }}>{t.name_ar}</h3>
 {t.name_en && <p className="text-xs text-gray-500 mt-0.5">{t.name_en}</p>}
 </div>
 <div className="flex gap-1">
 <button onClick={() => openModal('editTrack', t)}
 style={{ ...btn('rgba(255,255,255,0.06)', '#ccc'), padding: '5px 10px', fontSize: 12 }}>
 <Pencil size={16} />
 </button>
 <button onClick={() => del('track', t.id)}
 style={{ ...btn(`${RED}15`, RED), padding: '5px 10px', fontSize: 12 }}>
 <Trash2 size={16} />
 </button>
 </div>
 </div>
 {t.description && <p className="text-xs text-gray-400 mb-3">{t.description}</p>}
 <div className="flex gap-2 flex-wrap">
 <Badge text={t.applies_to || 'الثانوية'} color={color} />
 <Badge text={`${subjectCount} مادة`} color="#94A3B8" />
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </>
 )}

 {}

 {/* إضافة مرحلة */}
 {modal === 'addStage' && (
 <Modal title="إضافة مرحلة دراسية" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المرحلة *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: الابتدائية" /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} placeholder="Primary" /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">عدد السنوات</label>
 <input type="number" style={inp} value={form.years_count || ''} onChange={e => setForm({ ...form, years_count: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الترتيب</label>
 <input type="number" style={inp} value={form.order_num || ''} onChange={e => setForm({ ...form, order_num: e.target.value })} /></div>
 </div>
 <div><label className="text-xs text-gray-400 mb-1 block">وصف</label>
 <input style={inp} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
 <button onClick={() => save('add_stage')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ</button>
 </div>
 </Modal>
 )}

 {/* تعديل مرحلة */}
 {modal === 'editStage' && (
 <Modal title="تعديل مرحلة دراسية" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المرحلة *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">عدد السنوات</label>
 <input type="number" style={inp} value={form.years_count || ''} onChange={e => setForm({ ...form, years_count: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الترتيب</label>
 <input type="number" style={inp} value={form.order_num || ''} onChange={e => setForm({ ...form, order_num: e.target.value })} /></div>
 </div>
 <div><label className="text-xs text-gray-400 mb-1 block">وصف</label>
 <input style={inp} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
 <button onClick={() => save('update_stage', 'PUT')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ التعديلات</button>
 </div>
 </Modal>
 )}

 {/* إضافة صف */}
 {modal === 'addGrade' && (
 <Modal title={`إضافة صف — ${form.stage_name || ''}`} onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم الصف *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: الأول الابتدائي" /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} placeholder="Grade 1" /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">رقم الصف</label>
 <input type="number" style={inp} value={form.grade_num || ''} onChange={e => setForm({ ...form, grade_num: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الترتيب العام</label>
 <input type="number" style={inp} value={form.order_num || ''} onChange={e => setForm({ ...form, order_num: e.target.value })} /></div>
 </div>
 <button onClick={() => save('add_grade')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ</button>
 </div>
 </Modal>
 )}

 {/* تعديل صف */}
 {modal === 'editGrade' && (
 <Modal title="تعديل صف دراسي" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم الصف *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">رقم الصف</label>
 <input type="number" style={inp} value={form.grade_num || ''} onChange={e => setForm({ ...form, grade_num: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الترتيب العام</label>
 <input type="number" style={inp} value={form.order_num || ''} onChange={e => setForm({ ...form, order_num: e.target.value })} /></div>
 </div>
 <button onClick={() => save('update_grade', 'PUT')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ التعديلات</button>
 </div>
 </Modal>
 )}

 {/* إضافة مسار */}
 {modal === 'addTrack' && (
 <Modal title="إضافة مسار دراسي" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المسار *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: المسار العلمي" /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">يُطبّق على</label>
 <select style={inp} value={form.applies_to || 'الثانوية'} onChange={e => setForm({ ...form, applies_to: e.target.value })}>
 <option>الثانوية</option>
 <option>المتوسطة</option>
 <option>الابتدائية</option>
 <option>الابتدائية والمتوسطة</option>
 <option>جميع المراحل</option>
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">وصف</label>
 <input style={inp} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
 <button onClick={() => save('add_track')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ</button>
 </div>
 </Modal>
 )}

 {/* تعديل مسار */}
 {modal === 'editTrack' && (
 <Modal title="تعديل مسار دراسي" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المسار *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">يُطبّق على</label>
 <select style={inp} value={form.applies_to || 'الثانوية'} onChange={e => setForm({ ...form, applies_to: e.target.value })}>
 <option>الثانوية</option>
 <option>المتوسطة</option>
 <option>الابتدائية</option>
 <option>الابتدائية والمتوسطة</option>
 <option>جميع المراحل</option>
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">وصف</label>
 <input style={inp} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
 <button onClick={() => save('update_track', 'PUT')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ التعديلات</button>
 </div>
 </Modal>
 )}

 {/* إضافة مادة للكتالوج */}
 {modal === 'addCatalog' && (
 <Modal title="إضافة مادة دراسية" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المادة *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: الرياضيات" /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">كود المادة</label>
 <input style={inp} value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="MTH-P" /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">المرحلة</label>
 <select style={inp} value={form.stage_id || ''} onChange={e => setForm({ ...form, stage_id: e.target.value })}>
 <option value="">اختر...</option>
 {(data.stages || []).map((s: any) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">المسار</label>
 <select style={inp} value={form.track_id || ''} onChange={e => setForm({ ...form, track_id: e.target.value })}>
 <option value="">عام</option>
 {(data.tracks || []).map((t: any) => <option key={t.id} value={t.id}>{t.name_ar}</option>)}
 </select></div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">حصص/أسبوع</label>
 <input type="number" style={inp} value={form.weekly_hours || 2} onChange={e => setForm({ ...form, weekly_hours: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">النوع</label>
 <select style={inp} value={form.is_core !== false ? 'true' : 'false'} onChange={e => setForm({ ...form, is_core: e.target.value === 'true' })}>
 <option value="true">إلزامي</option>
 <option value="false">اختياري</option>
 </select></div>
 </div>
 <button onClick={() => save('add_subject_catalog')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ</button>
 </div>
 </Modal>
 )}

 {/* تعديل مادة في الكتالوج */}
 {modal === 'editCatalog' && (
 <Modal title="تعديل مادة دراسية" onClose={closeModal}>
 <div className="flex flex-col gap-4">
 <div><label className="text-xs text-gray-400 mb-1 block">اسم المادة *</label>
 <input style={inp} value={form.name_ar || ''} onChange={e => setForm({ ...form, name_ar: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">الاسم بالإنجليزية</label>
 <input style={inp} value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">كود المادة</label>
 <input style={inp} value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">المرحلة</label>
 <select style={inp} value={form.stage_id || ''} onChange={e => setForm({ ...form, stage_id: e.target.value })}>
 <option value="">اختر...</option>
 {(data.stages || []).map((s: any) => <option key={s.id} value={s.id}>{s.name_ar}</option>)}
 </select></div>
 <div><label className="text-xs text-gray-400 mb-1 block">المسار</label>
 <select style={inp} value={form.track_id || ''} onChange={e => setForm({ ...form, track_id: e.target.value })}>
 <option value="">عام</option>
 {(data.tracks || []).map((t: any) => <option key={t.id} value={t.id}>{t.name_ar}</option>)}
 </select></div>
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div><label className="text-xs text-gray-400 mb-1 block">حصص/أسبوع</label>
 <input type="number" style={inp} value={form.weekly_hours || 2} onChange={e => setForm({ ...form, weekly_hours: e.target.value })} /></div>
 <div><label className="text-xs text-gray-400 mb-1 block">النوع</label>
 <select style={inp} value={form.is_core !== false ? 'true' : 'false'} onChange={e => setForm({ ...form, is_core: e.target.value === 'true' })}>
 <option value="true">إلزامي</option>
 <option value="false">اختياري</option>
 </select></div>
 </div>
 <button onClick={() => save('update_subject_catalog')} style={{ ...btn(GOLD), width: '100%', padding: '12px' }}>حفظ التعديلات</button>
 </div>
 </Modal>
 )}
 </div>
 );
}
