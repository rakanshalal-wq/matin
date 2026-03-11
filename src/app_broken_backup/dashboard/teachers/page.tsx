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

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', subject: '', qualification: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/teachers', { headers: getHeaders(), credentials: 'include' });
      const d = await res.json();
      setTeachers(Array.isArray(d) ? d : []);
    } catch { } finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = async () => {
    if (!form.name || !form.email) return showToast('الاسم والإيميل مطلوبان');
    setSaving(true);
    try {
      const res = await fetch('/api/teachers', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify(form) });
      const d = await res.json();
      if (res.ok) { showToast('تم إضافة المعلم ✓'); setShowAdd(false); setForm({ name: '', email: '', phone: '', national_id: '', gender: 'MALE', subject: '', qualification: '' }); load(); }
      else showToast(d.error || 'فشل الإضافة');
    } catch { showToast('خطأ في الاتصال'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا المعلم؟')) return;
    try {
      const res = await fetch(`/api/teachers?id=${id}`, { method: 'DELETE', headers: getHeaders(), credentials: 'include' });
      if (res.ok) { showToast('تم الحذف ✓'); load(); }
      else showToast('فشل الحذف');
    } catch { showToast('خطأ في الاتصال'); }
  };

  const filtered = teachers.filter(t => {
    const q = search.toLowerCase();
    return !q || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q);
  });

  const statusColor: Record<string, string> = { active: '#22C55E', inactive: '#EF4444' };

  return (
    <div className="min-h-screen p-6" style={{ background: DARK, color: 'white', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {toast && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl text-sm font-bold shadow-2xl" style={{ background: '#16A34A', color: 'white' }}>{toast}</div>}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">👨‍🏫 إدارة المعلمين</h1>
          <p className="text-gray-400 text-sm mt-1">{teachers.length} معلم مسجل</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: G, color: '#000' }}>+ إضافة معلم</button>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ ...inp, maxWidth: 300 }} />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="overflow-x-auto">
          <div style={{overflowX:"auto"}}><table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: `1px solid ${BORDER}` }}>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">المعلم</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">المادة</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الجوال</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">المؤهل</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الحالة</th>
                <th className="text-right px-4 py-3 text-gray-400 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">جاري التحميل...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">لا توجد نتائج</td></tr>
              ) : filtered.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: `${G}22`, color: G }}>{(t.name || '?')[0]}</div>
                      <div>
                        <div className="font-medium text-white">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{t.subject || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{t.phone || '—'}</td>
                  <td className="px-4 py-3 text-gray-300">{t.qualification || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${statusColor[t.status] || '#6B7280'}22`, color: statusColor[t.status] || '#6B7280' }}>
                      {t.status === 'active' ? 'نشط' : t.status === 'inactive' ? 'غير نشط' : t.status || 'نشط'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelected(t); setShowView(true); }} className="px-3 py-1 rounded-lg text-xs" style={{ background: `${G}22`, color: G }}>عرض</button>
                      <button onClick={() => handleDelete(t.id)} className="px-3 py-1 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <Modal title="إضافة معلم جديد" onClose={() => setShowAdd(false)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-400 mb-1 block">الاسم *</label><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم المعلم" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الإيميل *</label><input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الجوال</label><input style={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05xxxxxxxx" /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">رقم الهوية</label><input style={inp} value={form.national_id} onChange={e => setForm({ ...form, national_id: e.target.value })} /></div>
              <div><label className="text-xs text-gray-400 mb-1 block">الجنس</label>
                <select style={inp} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="MALE">ذكر</option><option value="FEMALE">أنثى</option>
                </select>
              </div>
              <div><label className="text-xs text-gray-400 mb-1 block">المادة</label><input style={inp} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="الرياضيات" /></div>
              <div className="col-span-2"><label className="text-xs text-gray-400 mb-1 block">المؤهل</label><input style={inp} value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="بكالوريوس تربية" /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleAdd} disabled={saving} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: G, color: '#000' }}>{saving ? 'جاري الحفظ...' : 'إضافة المعلم'}</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 rounded-xl font-bold text-sm" style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'white' }}>إلغاء</button>
            </div>
          </div>
        </Modal>
      )}

      {showView && selected && (
        <Modal title="بيانات المعلم" onClose={() => setShowView(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: CARD }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black" style={{ background: `${G}22`, color: G }}>{(selected.name || '?')[0]}</div>
              <div>
                <div className="text-xl font-bold text-white">{selected.name}</div>
                <div className="text-gray-400 text-sm">{selected.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['الجوال', selected.phone], ['المادة', selected.subject], ['المؤهل', selected.qualification], ['الجنس', selected.gender === 'MALE' ? 'ذكر' : 'أنثى']].map(([k, v]) => (
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
