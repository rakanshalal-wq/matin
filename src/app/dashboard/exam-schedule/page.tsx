'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
export default function ExamSchedulePage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterGrade, setFilterGrade] = useState('');
  const [form, setForm] = useState({ subject: '', grade: '', exam_date: '', start_time: '08:00', duration: '90', room: '', supervisor: '', exam_type: 'midterm', total_marks: '100', notes: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/exam-schedule', { headers: getH() }); const d = await r.json(); setExams(Array.isArray(d) ? d : (d.exams || [])); } catch { setExams([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.subject || !form.exam_date) return alert('أدخل المادة والتاريخ'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/exam-schedule?id=' + editItem.id : '/api/exam-schedule'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ subject: '', grade: '', exam_date: '', start_time: '08:00', duration: '90', room: '', supervisor: '', exam_type: 'midterm', total_marks: '100', notes: '' }); fetchData(); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/exam-schedule?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ subject: item.subject || '', grade: item.grade || '', exam_date: item.exam_date || '', start_time: item.start_time || '08:00', duration: String(item.duration || 90), room: item.room || '', supervisor: item.supervisor || '', exam_type: item.exam_type || 'midterm', total_marks: String(item.total_marks || 100), notes: item.notes || '' }); setShowModal(true); };
  const grades = [...new Set(exams.map((e: any) => e.grade).filter(Boolean))];
  const filtered = exams.filter((e: any) => !filterGrade || e.grade === filterGrade);
  const upcoming = filtered.filter((e: any) => new Date(e.exam_date) >= new Date()).sort((a: any, b: any) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());
  const past = filtered.filter((e: any) => new Date(e.exam_date) < new Date()).sort((a: any, b: any) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime());
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const TYPE_MAP: Record<string, { l: string; c: string }> = { midterm: { l: 'نصف الفصل', c: '#3B82F6' }, final: { l: 'نهائي', c: '#EF4444' }, quiz: { l: 'اختبار قصير', c: '#10B981' }, makeup: { l: 'تعويضي', c: '#F59E0B' } };
  const ExamRow = ({ e }: { e: any }) => { const t = TYPE_MAP[e.exam_type] || TYPE_MAP.midterm; const isPast = new Date(e.exam_date) < new Date(); return (
    <tr style={{ borderBottom: '1px solid ' + BR, opacity: isPast ? 0.7 : 1 }}>
      <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{e.subject}</td>
      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{e.grade || '—'}</td>
      <td style={{ padding: '14px 16px' }}><span style={{ background: `${t.c}22`, color: t.c, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.l}</span></td>
      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{e.exam_date ? new Date(e.exam_date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td>
      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{e.start_time || '—'} ({e.duration || '—'} د)</td>
      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{e.room || '—'}</td>
      <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{e.supervisor || '—'}</td>
      <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(e)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(e.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
    </tr>
  ); };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📝 جدول الاختبارات</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إدارة مواعيد الاختبارات والقاعات</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إضافة اختبار</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'الإجمالي', v: exams.length, c: GOLD, i: '📝' }, { l: 'قادمة', v: upcoming.length, c: '#10B981', i: '⏰' }, { l: 'منتهية', v: past.length, c: '#9CA3AF', i: '✅' }, { l: 'هذا الأسبوع', v: exams.filter((e: any) => { const d = new Date(e.exam_date); const now = new Date(); const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); return d >= now && d <= week; }).length, c: '#EF4444', i: '🔥' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      {grades.length > 0 && <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilterGrade('')} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid', borderColor: !filterGrade ? GOLD : BR, background: !filterGrade ? `${GOLD}22` : CB, color: !filterGrade ? GOLD : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 }}>الكل</button>
        {grades.map(g => <button key={g} onClick={() => setFilterGrade(g)} style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid', borderColor: filterGrade === g ? GOLD : BR, background: filterGrade === g ? `${GOLD}22` : CB, color: filterGrade === g ? GOLD : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 }}>{g}</button>)}
      </div>}
      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> : <>
        {upcoming.length > 0 && <><h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>⏰ الاختبارات القادمة</h3>
          <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['المادة', 'الصف', 'النوع', 'التاريخ', 'الوقت والمدة', 'القاعة', 'المراقب', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead><tbody>{upcoming.map((e: any) => <ExamRow key={e.id} e={e} />)}</tbody></table></div></div></>}
        {past.length > 0 && <><h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>✅ الاختبارات المنتهية</h3>
          <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['المادة', 'الصف', 'النوع', 'التاريخ', 'الوقت والمدة', 'القاعة', 'المراقب', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead><tbody>{past.map((e: any) => <ExamRow key={e.id} e={e} />)}</tbody></table></div></div></>}
        {exams.length === 0 && <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📝</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد اختبارات مجدولة</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ إضافة اختبار</button></div>}
      </>}
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={lbl}>المادة *</label><input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الصف</label><input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>نوع الاختبار</label><select value={form.exam_type} onChange={e => setForm({ ...form, exam_type: e.target.value })} style={inp}>{Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select></div>
            <div><label style={lbl}>الدرجة الكاملة</label><input type="number" value={form.total_marks} onChange={e => setForm({ ...form, total_marks: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>تاريخ الاختبار *</label><input type="date" value={form.exam_date} onChange={e => setForm({ ...form, exam_date: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>وقت البداية</label><input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>المدة (دقيقة)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>القاعة</label><input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>المراقب</label><input value={form.supervisor} onChange={e => setForm({ ...form, supervisor: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>ملاحظات</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 60, resize: 'vertical' as const }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة الاختبار'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
