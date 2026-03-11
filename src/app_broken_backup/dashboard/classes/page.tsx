'use client';
import { useState, useEffect } from 'react';

const DARK = '#06060E';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const G = '#C9A84C';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const inp = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 12, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', width: '100%' };

function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ background: '#0D0D1A', border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', grade: '', section: '', teacher_id: '', capacity: '30', academic_year: new Date().getFullYear().toString() });

  useEffect(() => { load(); loadTeachers(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/classes', { headers: getHeaders(), credentials: 'include' });
      const d = await res.json();
      setClasses(Array.isArray(d) ? d : []);
    } catch { } finally { setLoading(false); }
  };

  const loadTeachers = async () => {
    try {
      const res = await fetch('/api/teachers', { headers: getHeaders() });
      const d = await res.json();
      setTeachers(Array.isArray(d) ? d : []);
    } catch { }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = async () => {
    if (!form.name) return showToast('اسم الفصل مطلوب');
    setSaving(true);
    try {
      const res = await fetch('/api/classes', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) || 30 }) });
      const d = await res.json();
      if (res.ok) { showToast('تم إضافة الفصل ✓'); setShowAdd(false); setForm({ name: '', grade: '', section: '', teacher_id: '', capacity: '30', academic_year: new Date().getFullYear().toString() }); load(); }
      else showToast(d.error || 'فشل الإضافة');
    } catch { showToast('خطأ في الاتصال'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا الفصل؟')) return;
    try {
      const res = await fetch(`/api/classes?id=${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' });
      if (res.ok) { showToast('تم الحذف ✓'); load(); }
      else showToast('فشل الحذف');
    } catch { showToast('خطأ في الاتصال'); }
  };

  const filtered = classes.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.grade?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-6" style={{ background: DARK, color: 'white', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl" style={{ background: '#16A34A', color: 'white' }}>{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">📚 إدارة الفصول</h1>
          <p className="text-gray-400 text-sm mt-1">{classes.length} فصل دراسي</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: G, color: '#000' }}>+ إضافة فصل</button>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ ...inp, maxWidth: 300 }} />
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500">جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">لا توجد فصول</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c: any) => (
            <div key={c.id} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${G}22` }}>📚</div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${G}22`, color: G }}>{c.academic_year || '—'}</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg">{c.name}</div>
                <div className="text-gray-400 text-sm">{c.grade ? `الصف: ${c.grade}` : ''} {c.section ? `• شعبة: ${c.section}` : ''}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">الطاقة: <span className="text-white">{c.capacity || 30}</span></span>
                <span className="text-gray-400">الطلاب: <span className="text-white">{c.students_count || 0}</span></span>
              </div>
              {c.teacher_name && <div className="text-xs text-gray-500">المعلم: {c.teacher_name}</div>}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setSelected(c)} className="flex-1 py-1.5 rounded-xl text-xs font-medium" style={{ background: `${G}22`, color: G }}>تفاصيل</button>
                <button onClick={() => handleDelete(c.id)} className="flex-1 py-1.5 rounded-xl text-xs font-medium" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="إضافة فصل جديد" onClose={() => setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">اسم الفصل *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: الصف الأول أ" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الصف</label><input style={inp} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="الأول" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الشعبة</label><input style={inp} value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} placeholder="أ" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الطاقة الاستيعابية</label><input style={inp} type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">العام الدراسي</label><input style={inp} value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })} /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">المعلم المسؤول</label>
                <select style={inp} value={form.teacher_id} onChange={e => setForm({ ...form, teacher_id: e.target.value })}>
                  <option value="">اختر المعلم</option>
                  {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: G, color: '#000' }}>{saving ? 'جاري الحفظ...' : 'إضافة الفصل'}</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'white' }}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal title="تفاصيل الفصل" onClose={() => setSelected(null)}>
          <div className="flex flex-col gap-4">
            <div className="text-center p-4 rounded-xl" style={{ background: CARD }}>
              <div className="text-4xl mb-2">📚</div>
              <div className="text-xl font-bold text-white">{selected.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['الصف', selected.grade], ['الشعبة', selected.section], ['الطاقة', selected.capacity], ['العام الدراسي', selected.academic_year], ['عدد الطلاب', selected.students_count || 0], ['المعلم', selected.teacher_name]].map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="text-gray-400 text-xs mb-1">{k}</div>
                  <div className="text-white font-medium">{v || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
