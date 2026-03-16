'use client';
import { useState, useEffect } from 'react';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const GOLD = '#C9A84C';
const BG = '#0B0B16';
const CARD_BG = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'فعاليات', image_url: '', is_public: true, date: new Date().toISOString().split('T')[0] });

  useEffect(() => { fetchAlbums(); }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery', { headers: getHeaders() });
      const data = await res.json();
      setAlbums(Array.isArray(data) ? data : []);
    } catch { setAlbums([]); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.title) return alert('ادخل عنوان الصورة/الالبوم');
    setSaving(true);
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? '/api/gallery?id=' + editItem.id : '/api/gallery';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      if (res.ok) { setShowModal(false); setEditItem(null); setForm({ title: '', description: '', category: 'فعاليات', image_url: '', is_public: true, date: new Date().toISOString().split('T')[0] }); fetchAlbums(); }
      else { const e = await res.json(); alert(e.error || 'فشل الحفظ'); }
    } catch { } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل انت متاكد من الحذف؟')) return;
    try { await fetch('/api/gallery?id=' + id, { method: 'DELETE', headers: getHeaders() }); fetchAlbums(); } catch { }
  };

  const openEdit = (item: any) => {
    setEditItem(item);
    setForm({ title: item.title || '', description: item.description || '', category: item.category || 'فعاليات', image_url: item.image_url || '', is_public: item.is_public !== false, date: item.date || new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const filtered = albums.filter((a: any) => !searchTerm || a.title?.includes(searchTerm) || a.category?.includes(searchTerm));
  const categories = ['فعاليات', 'رحلات', 'تخرج', 'رياضة', 'فنون', 'اخرى'];
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BORDER, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🖼️ معرض الصور</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>ذكريات وفعاليات المدرسة</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 20px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>+ اضافة صورة</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        {categories.map(cat => {
          const count = albums.filter((a: any) => a.category === cat).length;
          return (
            <div key={cat} onClick={() => setSearchTerm(cat === searchTerm ? '' : cat)} style={{ background: searchTerm === cat ? GOLD + '22' : CARD_BG, border: '1px solid ' + (searchTerm === cat ? GOLD : BORDER), borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ color: searchTerm === cat ? GOLD : 'white', fontWeight: 600, fontSize: 14 }}>{cat}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>{count} صورة</div>
            </div>
          );
        })}
      </div>

      <input placeholder="🔍 بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inp, width: 300, marginBottom: 20 }} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا توجد صور بعد</p>
          <button onClick={() => setShowModal(true)} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 24px', color: '#0B0B16', fontWeight: 700, cursor: 'pointer', marginTop: 16 }}>+ اضافة اول صورة</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {filtered.map((item: any, i: number) => (
            <div key={item.id || i} style={{ background: CARD_BG, border: '1px solid ' + BORDER, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ height: 160, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 48 }}>🖼️</span>
                )}
                <span style={{ position: 'absolute', top: 10, right: 10, background: GOLD + 'cc', color: '#0B0B16', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{item.category}</span>
                {!item.is_public && <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '3px 8px', borderRadius: 20, fontSize: 11 }}>🔒 خاص</span>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                {item.description && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 8 }}>{item.description}</div>}
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginBottom: 12 }}>{item.date}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(item)} style={{ flex: 1, background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, padding: '7px', color: GOLD, cursor: 'pointer', fontSize: 13 }}>تعديل</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '7px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#12121F', border: '1px solid ' + BORDER, borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل الصورة' : 'اضافة صورة جديدة'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 22, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={lbl}>العنوان *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="عنوان الصورة" style={inp} /></div>
              <div><label style={lbl}>الوصف</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر..." style={{ ...inp, height: 70, resize: 'vertical' as const }} /></div>
              <div><label style={lbl}>التصنيف</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inp}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label style={lbl}>رابط الصورة</label><input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." style={inp} /></div>
              <div><label style={lbl}>التاريخ</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} /></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="pub" checked={form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="pub" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>عرض للعموم</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: GOLD, border: 'none', borderRadius: 10, padding: 12, color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'اضافة الصورة'}</button>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid ' + BORDER, borderRadius: 10, padding: 12, color: 'white', cursor: 'pointer', fontSize: 15 }}>الغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
