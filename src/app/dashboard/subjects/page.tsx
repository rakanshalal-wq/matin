'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const STAGES = ['الابتدائية', 'المتوسطة', 'الثانوية', 'جميع المراحل'];
const TRACKS = ['عام', 'علوم الحاسب والهندسة', 'الصحة والحياة', 'إدارة الأعمال', 'الشرعي', 'مشترك'];
const COLORS = ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316'];
export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name_ar: '', code: '', stage: 'الابتدائية', track: 'عام', weekly_hours: '4', description: '', color: '#3B82F6', is_required: true });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/subjects', { headers: getH() }); const d = await r.json(); setSubjects(Array.isArray(d) ? d : (d.subjects || [])); } catch { setSubjects([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.name_ar) return alert('أدخل اسم المادة'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/subjects?id=' + editItem.id : '/api/subjects'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ name_ar: '', code: '', stage: 'الابتدائية', track: 'عام', weekly_hours: '4', description: '', color: '#3B82F6', is_required: true }); fetchData(); } else { const e = await r.json(); alert(e.error || 'فشل'); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/subjects?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ name_ar: item.name_ar || '', code: item.code || '', stage: item.stage || 'الابتدائية', track: item.track || 'عام', weekly_hours: String(item.weekly_hours || 4), description: item.description || '', color: item.color || '#3B82F6', is_required: item.is_required !== false }); setShowModal(true); };
  const filtered = subjects.filter((r: any) => (!search || r.name_ar?.includes(search) || r.code?.includes(search)) && (!filterStage || r.stage === filterStage));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📖 المواد الدراسية</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة المواد لجميع المراحل والمسارات</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة مادة</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'إجمالي المواد', v: subjects.length, c: GOLD, i: '📖' }, { l: 'الابتدائية', v: subjects.filter((r: any) => r.stage === 'الابتدائية').length, c: '#10B981', i: '🌱' }, { l: 'المتوسطة', v: subjects.filter((r: any) => r.stage === 'المتوسطة').length, c: '#3B82F6', i: '📚' }, { l: 'الثانوية', v: subjects.filter((r: any) => r.stage === 'الثانوية').length, c: '#8B5CF6', i: '🎓' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 بحث عن مادة..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 260 }} />
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} style={{ ...inp, width: 180 }}>
          <option value="">جميع المراحل</option>{STAGES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
          filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📖</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد مواد مسجلة</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة</button></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['المادة', 'الرمز', 'المرحلة', 'المسار', 'ساعات أسبوعية', 'الحالة', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map((r: any, i: number) => (
              <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color || '#3B82F6', flexShrink: 0 }} /><span style={{ color: 'white', fontWeight: 600 }}>{r.name_ar}</span></div></td>
                <td style={{ padding: '14px 16px', color: GOLD, fontWeight: 700, fontSize: 13 }}>{r.code || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.stage}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.track || 'عام'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{r.weekly_hours || 4}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: r.is_required !== false ? 'rgba(16,185,129,0.15)' : 'rgba(156,163,175,0.15)', color: r.is_required !== false ? '#10B981' : '#9CA3AF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{r.is_required !== false ? 'إلزامية' : 'اختيارية'}</span></td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل المادة' : 'إضافة مادة جديدة'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم المادة *</label><input value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} placeholder="مثال: الرياضيات" style={inp} /></div>
            <div><label style={lbl}>رمز المادة</label><input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="مثال: MATH101" style={inp} /></div>
            <div><label style={lbl}>ساعات أسبوعية</label><input type="number" value={form.weekly_hours} onChange={e => setForm({ ...form, weekly_hours: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>المرحلة</label><select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })} style={inp}>{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={lbl}>المسار</label><select value={form.track} onChange={e => setForm({ ...form, track: e.target.value })} style={inp}>{TRACKS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label style={lbl}>لون المادة</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>{COLORS.map(c => <button key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid white' : '2px solid transparent', cursor: 'pointer' }} />)}</div></div>
            <div><label style={lbl}>النوع</label><select value={form.is_required ? 'required' : 'optional'} onChange={e => setForm({ ...form, is_required: e.target.value === 'required' })} style={inp}><option value="required">إلزامية</option><option value="optional">اختيارية</option></select></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>وصف المادة</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المادة'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
