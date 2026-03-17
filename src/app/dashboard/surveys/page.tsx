'use client';
import { BarChart3, CheckCircle, FileText, Lock, Users, X } from "lucide-react";
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const STATUS_MAP: Record<string, { l: string; c: string }> = { draft: { l: 'مسودة', c: '#9CA3AF' }, active: { l: 'نشط', c: '#10B981' }, closed: { l: 'مغلق', c: '#EF4444' } };
export default function SurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', target_role: 'all', status: 'draft', deadline: '', anonymous: true });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/surveys', { headers: getH() }); const d = await r.json(); setSurveys(Array.isArray(d) ? d : (d.surveys || [])); } catch { setSurveys([]); } finally { setLoading(false); } };
  const handleSave = async () => { if (!form.title) return alert('أدخل عنوان الاستبيان'); setSaving(true); try { const m = editItem ? 'PUT' : 'POST'; const u = editItem ? '/api/surveys?id=' + editItem.id : '/api/surveys'; const r = await fetch(u, { method: m, headers: getH(), body: JSON.stringify(form) }); if (r.ok) { setShowModal(false); setEditItem(null); setForm({ title: '', description: '', target_role: 'all', status: 'draft', deadline: '', anonymous: true }); fetchData(); } } catch { } finally { setSaving(false); } };
  const handleDelete = async (id: number) => { if (!confirm('تأكيد الحذف؟')) return; try { await fetch('/api/surveys?id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const openEdit = (item: any) => { setEditItem(item); setForm({ title: item.title || '', description: item.description || '', target_role: item.target_role || 'all', status: item.status || 'draft', deadline: item.deadline || '', anonymous: item.anonymous !== false }); setShowModal(true); };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>BarChart3 الاستبيانات</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>إنشاء وإدارة استبيانات الرأي والتقييم</p></div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ إنشاء استبيان</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'الإجمالي', v: surveys.length, c: GOLD, i: "ICON_BarChart3" }, { l: 'نشطة', v: surveys.filter((s: any) => s.status === 'active').length, c: '#10B981', i: "ICON_CheckCircle" }, { l: 'مسودات', v: surveys.filter((s: any) => s.status === 'draft').length, c: '#9CA3AF', i: "ICON_FileText" }, { l: 'مغلقة', v: surveys.filter((s: any) => s.status === 'closed').length, c: '#EF4444', i: "ICON_Lock" }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 16 }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)', gridColumn: '1/-1' }}>جاري التحميل...</div> :
          surveys.length === 0 ? <div style={{ textAlign: 'center', padding: 60, gridColumn: '1/-1' }}><div style={{ fontSize: 48, marginBottom: 16 }}>BarChart3</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد استبيانات</p><button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>إنشاء أول استبيان</button></div> :
          surveys.map((s: any, i: number) => { const st = STATUS_MAP[s.status] || STATUS_MAP.draft; return (
            <div key={s.id || i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{s.title}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s.description}</div></div>
                <span style={{ background: `${st.c}22`, color: st.c, padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginRight: 8, whiteSpace: 'nowrap' }}>{st.l}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                <span>Users {s.target_role === 'all' ? 'الجميع' : s.target_role}</span>
                <span>FileText {s.responses_count || 0} استجابة</span>
                {s.anonymous && <span>Lock مجهول</span>}
              </div>
              {s.deadline && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>⏰ ينتهي: {new Date(s.deadline).toLocaleDateString('ar-SA')}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(s)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '8px', color: GOLD, cursor: 'pointer', fontSize: 13 }}>تعديل</button>
                <button onClick={() => handleDelete(s.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>حذف</button>
              </div>
            </div>
          ); })}
      </div>
      {showModal && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
        <div style={{ background: '#12121F', border: '1px solid ' + BR, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}><h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الاستبيان' : 'استبيان جديد'}</h2><button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>X</button></div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div><label style={lbl}>العنوان *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={lbl}>الفئة المستهدفة</label><select value={form.target_role} onChange={e => setForm({ ...form, target_role: e.target.value })} style={inp}><option value="all">الجميع</option><option value="teacher">المعلمون</option><option value="student">الطلاب</option><option value="parent">أولياء الأمور</option></select></div>
              <div><label style={lbl}>الحالة</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}><option value="draft">مسودة</option><option value="active">نشط</option><option value="closed">مغلق</option></select></div>
            </div>
            <div><label style={lbl}>تاريخ الانتهاء</label><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} style={inp} /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ' : 'إنشاء'}</button>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BR, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>إلغاء</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
