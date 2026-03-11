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

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', date_of_birth: '', class_id: '' });

  useEffect(() => { load(); loadClasses(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/students', { headers: getHeaders(), credentials: 'include' });
      const d = await res.json();
      setStudents(Array.isArray(d) ? d : []);
    } catch { } finally { setLoading(false); }
  };

  const loadClasses = async () => {
    try {
      const res = await fetch('/api/classes', { headers: getHeaders() });
      const d = await res.json();
      setClasses(Array.isArray(d) ? d : []);
    } catch { }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = async () => {
    if (!form.name) return showToast('الاسم مطلوب');
    setSaving(true);
    try {
      const res = await fetch('/api/students', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(form) });
      const d = await res.json();
      if (res.ok) { showToast('تم إضافة الطالب ✓'); setShowAdd(false); setForm({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', date_of_birth: '', class_id: '' }); load(); }
      else showToast(d.error || 'فشل الإضافة');
    } catch { showToast('خطأ في الاتصال'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا الطالب؟')) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' });
      if (res.ok) { showToast('تم الحذف ✓'); load(); }
      else showToast('فشل الحذف');
    } catch { showToast('خطأ في الاتصال'); }
  };

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const match = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q) || s.student_id?.toLowerCase().includes(q);
    const cls = !filterClass || s.class_id === filterClass;
    return match && cls;
  });

  const genderLabel: Record<string, string> = { MALE: 'ذكر', FEMALE: 'أنثى', male: 'ذكر', female: 'أنثى' };
  const statusColor: Record<string, string> = { active: '#22C55E', inactive: '#EF4444', pending: '#F59E0B' };

  return (
    <div className="min-h-screen p-6" style={{ background: DARK, color: 'white', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl" style={{ background: '#16A34A', color: 'white' }}>{toast}</div>}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">👥 إدارة الطلاب</h1>
          <p className="text-gray-400 text-sm mt-1">{students.length} طالب مسجل</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90" style={{ background: G, color: '#000' }}>
          + إضافة طالب
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث بالاسم أو الإيميل..." style={{ ...inp, maxWidth: 280 }} />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} style={{ ...inp, maxWidth: 200 }}>
          <option value="">كل الفصول</option>
          {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: `1px solid ${BORDER}` }}>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الطالب</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">رقم الطالب</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الفصل</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الجنس</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">لا توجد نتائج</td></tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: `${G}22`, color: G }}>
                        {(s.name || '?')[0]}
                      </div>
                      <div>
                        <div className="font-medium text-white">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{s.student_id || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{s.class_name || classes.find((c: any) => c.id === s.class_id)?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{genderLabel[s.gender] || s.gender || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${statusColor[s.status] || '#6B7280'}22`, color: statusColor[s.status] || '#6B7280' }}>
                      {s.status === 'active' ? 'نشط' : s.status === 'inactive' ? 'غير نشط' : s.status || 'نشط'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelected(s); setShowView(true); }} className="px-3 py-1 rounded-lg text-xs hover:opacity-80" style={{ background: `${G}22`, color: G }}>عرض</button>
                      <button onClick={() => handleDelete(s.id)} className="px-3 py-1 rounded-lg text-xs hover:opacity-80" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="إضافة طالب جديد" onClose={() => setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">الاسم *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم الطالب" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الإيميل</label><input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الجوال</label><input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05xxxxxxxx" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">رقم الهوية</label><input style={inp} value={form.national_id} onChange={e => setForm({ ...form, national_id: e.target.value })} placeholder="1xxxxxxxxx" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الجنس</label>
                <select style={inp} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
                </select>
              </div>
              <div><label className="text-xs text-gray-400 mb-1 block">تاريخ الميلاد</label><input style={inp} type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">الفصل</label>
                <select style={inp} value={form.class_id} onChange={e => setForm({ ...form, class_id: e.target.value })}>
                  <option value="">اختر الفصل</option>
                  {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: G, color: '#000' }}>
                {saving ? 'جاري الحفظ...' : 'إضافة الطالب'}
              </button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'white' }}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {showView && selected && (
        <Modal title="بيانات الطالب" onClose={() => setShowView(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: CARD }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black" style={{ background: `${G}22`, color: G }}>{(selected.name || '?')[0]}</div>
              <div>
                <div className="text-xl font-bold text-white">{selected.name}</div>
                <div className="text-gray-400 text-sm">{selected.email}</div>
                <div className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: `${G}22`, color: G }}>رقم: {selected.student_id || '—'}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['الجوال', selected.phone],
                ['رقم الهوية', selected.national_id],
                ['الجنس', genderLabel[selected.gender] || selected.gender],
                ['تاريخ الميلاد', selected.date_of_birth],
                ['الفصل', selected.class_name || classes.find((c: any) => c.id === selected.class_id)?.name || '—'],
                ['الحالة', selected.status === 'active' ? 'نشط' : 'غير نشط'],
              ].map(([k, v]) => (
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
