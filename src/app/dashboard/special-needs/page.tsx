'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const DISABILITY_TYPES = ['صعوبات تعلم','إعاقة بصرية','إعاقة سمعية','إعاقة حركية','اضطراب طيف التوحد','اضطراب نقص الانتباه','إعاقة ذهنية','موهبة وتميز','أخرى'];
const SUPPORT_LEVELS = ['دعم خفيف','دعم متوسط','دعم مكثف'];
export default function SpecialNeedsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student_name: '', grade: '', disability_type: 'صعوبات تعلم', support_level: 'دعم خفيف', specialist_name: '', iep_date: '', accommodations: '', notes: '', parent_contact: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/special-needs', { headers: getH() }); const d = await r.json(); setStudents(Array.isArray(d) ? d : (d.students || [])); } catch { setStudents([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.student_name) return alert('أدخل اسم الطالب'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/special-needs?id=' + editItem.id : '/api/special-needs'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ student_name: '', grade: '', disability_type: 'صعوبات تعلم', support_level: 'دعم خفيف', specialist_name: '', iep_date: '', accommodations: '', notes: '', parent_contact: '' }); fetchData(); } else { const e = await r.json(); alert(e.error || 'فشل'); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/special-needs?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ student_name: item.student_name || '', grade: item.grade || '', disability_type: item.disability_type || 'صعوبات تعلم', support_level: item.support_level || 'دعم خفيف', specialist_name: item.specialist_name || '', iep_date: item.iep_date || '', accommodations: item.accommodations || '', notes: item.notes || '', parent_contact: item.parent_contact || '' }); setShowModal(true); };
  const filtered = students.filter((r: any) => !search || r.student_name?.includes(search) || r.disability_type?.includes(search));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const SUPPORT_COLORS: Record<string, string> = { 'دعم خفيف': '#10B981', 'دعم متوسط': '#F59E0B', 'دعم مكثف': '#EF4444' };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>♿ ذوو الاحتياجات الخاصة</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>متابعة الطلاب ذوي الاحتياجات الخاصة وخطط دعمهم</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة طالب</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'إجمالي الطلاب', v: students.length, c: GOLD, i: '♿' }, ...SUPPORT_LEVELS.map(sl => ({ l: sl, v: students.filter((r: any) => r.support_level === sl).length, c: SUPPORT_COLORS[sl] || '#9CA3AF', i: sl === 'دعم خفيف' ? '🟢' : sl === 'دعم متوسط' ? '🟡' : '🔴' }))].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <input placeholder="🔍 بحث عن طالب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 300, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)', gridColumn: '1/-1' }}>جاري التحميل...</div> :
          filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60, gridColumn: '1/-1' }}><div style={{ fontSize: 48, marginBottom: 16 }}>♿</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد سجلات</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة</button></div> :
          filtered.map((s: any, i: number) => (
            <div key={s.id || i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div><div style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>{s.student_name}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.grade || 'غير محدد'}</div></div>
                <span style={{ background: `${SUPPORT_COLORS[s.support_level] || '#9CA3AF'}22`, color: SUPPORT_COLORS[s.support_level] || '#9CA3AF', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.support_level}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>نوع الاحتياج</div><div style={{ fontSize: 14, color: 'white' }}>{s.disability_type}</div></div>
              {s.specialist_name && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>👨‍⚕️ {s.specialist_name}</div>}
              {s.accommodations && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 12, lineHeight: 1.6 }}>التسهيلات: {s.accommodations}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(s)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px', color: GOLD, cursor: 'pointer', fontSize: 13 }}>تعديل</button>
                <button onClick={() => handleDelete(s.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>حذف</button>
              </div>
            </div>
          ))}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل البيانات' : 'إضافة طالب جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم الطالب *</label><input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الصف الدراسي</label><input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="مثال: الثالث ابتدائي" style={inp} /></div>
            <div><label style={lbl}>نوع الاحتياج</label><select value={form.disability_type} onChange={e => setForm({ ...form, disability_type: e.target.value })} style={inp}>{DISABILITY_TYPES.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            <div><label style={lbl}>مستوى الدعم</label><select value={form.support_level} onChange={e => setForm({ ...form, support_level: e.target.value })} style={inp}>{SUPPORT_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div><label style={lbl}>المختص المسؤول</label><input value={form.specialist_name} onChange={e => setForm({ ...form, specialist_name: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>تاريخ خطة IEP</label><input type="date" value={form.iep_date} onChange={e => setForm({ ...form, iep_date: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>تواصل ولي الأمر</label><input value={form.parent_contact} onChange={e => setForm({ ...form, parent_contact: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>التسهيلات المقدمة</label><textarea value={form.accommodations} onChange={e => setForm({ ...form, accommodations: e.target.value })} placeholder="مثال: وقت إضافي في الاختبارات، مقعد أمامي..." style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>ملاحظات</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 60, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة الطالب'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
