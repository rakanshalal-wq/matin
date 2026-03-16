'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const TYPE_MAP: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  positive: { label: 'إيجابي', color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: '⭐' },
  negative: { label: 'سلبي', color: '#EF4444', bg: 'rgba(239,68,68,0.15)', icon: '⚠️' },
  warning: { label: 'تحذير', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', icon: '🔔' },
  suspension: { label: 'إيقاف', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', icon: '🚫' },
};
const CATEGORIES = ['الانضباط', 'التفوق الأكاديمي', 'المشاركة', 'الغياب', 'التنمر', 'الاحترام', 'النظافة', 'المبادرة', 'أخرى'];
export default function BehaviorPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ student_name: '', type: 'positive', category: 'الانضباط', description: '', points: '1', teacher_name: '', action_taken: '', date: new Date().toISOString().split('T')[0] });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/behavior', { headers: getH() }); const d = await r.json(); setItems(Array.isArray(d) ? d : (d.records || [])); } catch { setItems([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.student_name) return alert('أدخل اسم الطالب'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/behavior?id=' + editItem.id : '/api/behavior'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ student_name: '', type: 'positive', category: 'الانضباط', description: '', points: '1', teacher_name: '', action_taken: '', date: new Date().toISOString().split('T')[0] }); fetchData(); } else { const e = await r.json(); alert(e.error || 'فشل'); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/behavior?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ student_name: item.student_name || '', type: item.type || 'positive', category: item.category || 'الانضباط', description: item.description || '', points: String(item.points || 1), teacher_name: item.teacher_name || '', action_taken: item.action_taken || '', date: item.date || new Date().toISOString().split('T')[0] }); setShowModal(true); };
  const filtered = items.filter((r: any) => (!search || r.student_name?.includes(search) || r.description?.includes(search)) && (!filterType || r.type === filterType));
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🎭 السلوك والانضباط</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تسجيل وتتبع سلوك الطلاب</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ تسجيل حادثة</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {Object.entries(TYPE_MAP).map(([k, v]) => (
          <div key={k} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{v.icon}</div><div style={{ fontSize: 26, fontWeight: 800, color: v.color }}>{items.filter((r: any) => r.type === k).length}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{v.label}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="🔍 بحث عن طالب..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: 260 }} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ ...inp, width: 160 }}>
          <option value="">جميع الأنواع</option>{Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
          filtered.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>🎭</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد سجلات</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ تسجيل أول حادثة</button></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['الطالب', 'النوع', 'الفئة', 'الوصف', 'النقاط', 'المعلم', 'التاريخ', 'إجراءات'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map((r: any, i: number) => { const t = TYPE_MAP[r.type] || TYPE_MAP.positive; return (
              <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.student_name}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: t.bg, color: t.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{t.icon} {t.label}</span></td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{r.category}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', maxWidth: 200 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description}</div></td>
                <td style={{ padding: '14px 16px', color: r.type === 'positive' ? '#10B981' : '#EF4444', fontWeight: 700, textAlign: 'center' }}>{r.type === 'positive' ? '+' : '-'}{Math.abs(r.points || 1)}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.teacher_name || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.date ? new Date(r.date).toLocaleDateString('ar-SA') : '—'}</td>
                <td style={{ padding: '14px 16px' }}><div style={{ display: 'flex', gap: 8 }}><button onClick={() => openEdit(r)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '6px 12px', color: GOLD, cursor: 'pointer', fontSize: 12 }}>تعديل</button><button onClick={() => handleDelete(r.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', color: '#EF4444', cursor: 'pointer', fontSize: 12 }}>حذف</button></div></td>
              </tr>); })}
            </tbody>
          </table></div>}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل السجل' : 'تسجيل حادثة جديدة'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>اسم الطالب *</label><input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} placeholder="اسم الطالب" style={inp} /></div>
            <div><label style={lbl}>نوع السلوك</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>{Object.entries(TYPE_MAP).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}</select></div>
            <div><label style={lbl}>الفئة</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inp}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label style={lbl}>النقاط</label><input type="number" value={form.points} onChange={e => setForm({ ...form, points: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>التاريخ</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={lbl}>الوصف التفصيلي</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف الحادثة..." style={{ ...inp, height: 80, resize: 'vertical' as const }} /></div>
            <div><label style={lbl}>المعلم المسجّل</label><input value={form.teacher_name} onChange={e => setForm({ ...form, teacher_name: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الإجراء المتخذ</label><input value={form.action_taken} onChange={e => setForm({ ...form, action_taken: e.target.value })} placeholder="مثال: تم التواصل مع ولي الأمر" style={inp} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'تسجيل الحادثة'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
