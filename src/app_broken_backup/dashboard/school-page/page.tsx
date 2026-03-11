'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function SchoolPageEditor() {
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '', email: '', website: '', logo_url: '', cover_url: '', vision: '', mission: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/schools/me', { credentials: 'include' });
      const data = await r.json();
      setSchool(data);
      setForm({ name: data.name || '', description: data.description || '', address: data.address || '', phone: data.phone || '', email: data.email || '', website: data.website || '', logo_url: data.logo_url || '', cover_url: data.cover_url || '', vision: data.vision || '', mission: data.mission || '' });
    } catch {}
    setLoading(false);
  };
  const save = async () => {
    setSaving(true);
    try { await fetch('/api/schools/me', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }); } catch {}
    setSaving(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, marginBottom: 24 }, label: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }, input: { width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const }, textarea: { width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 100 }, btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: 'IBM Plex Sans Arabic, sans-serif' } };
  if (loading) return <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div></div>;
  return (
    <div style={s.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div><div style={{ fontSize: 28, fontWeight: 700 }}>صفحة المؤسسة</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>تخصيص الصفحة العامة للمؤسسة</div></div>
        <button style={s.btn} onClick={save} disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</button>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>المعلومات الأساسية</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[['name','اسم المؤسسة'],['phone','رقم الهاتف'],['email','البريد الإلكتروني'],['website','الموقع الإلكتروني'],['address','العنوان'],['logo_url','رابط الشعار']].map(([k,l]) => (
            <div key={k}><label style={s.label}>{l}</label><input style={s.input} value={(form as any)[k]} onChange={e => setForm({...form, [k]: e.target.value})} /></div>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>المحتوى التعريفي</h3>
        {[['description','وصف المؤسسة'],['vision','الرؤية'],['mission','الرسالة']].map(([k,l]) => (
          <div key={k} style={{ marginBottom: 16 }}><label style={s.label}>{l}</label><textarea style={s.textarea} value={(form as any)[k]} onChange={e => setForm({...form, [k]: e.target.value})} /></div>
        ))}
      </div>
    </div>
  );
}
