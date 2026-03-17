'use client';
import { BookOpen, Check, CheckCircle, Eye, Globe, GraduationCap, Megaphone, Mouse, Pencil, Plus, Save, School, Trash2, Users, X } from "lucide-react";
const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    title: '', description: '', image_url: '', click_url: '',
    position: 'top', target_type: 'all', priority: 1,
    start_date: '', end_date: '', is_active: true
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    setUser(u);
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      // جلب الإعلانات مع التوكن (للمدير يرى كل الإعلانات)
      const token = localStorage.getItem('matin_token');
      const res = await fetch('/api/ads/manage', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAds(Array.isArray(data) ? data : []);
      } else {
        // fallback للـ API العام
        const res2 = await fetch('/api/ads', { headers: getHeaders() });
        const data2 = await res2.json();
        setAds(Array.isArray(data2) ? data2 : []);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.title) { setErrMsg('عنوان الإعلان مطلوب'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/ads?id=${editItem.id}` : '/api/ads';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (res.ok) {
        setMsg(editItem ? 'CheckCircle تم تعديل الإعلان' : '[CheckCircle] تم إضافة الإعلان بنجاح');
        setMsgType('success');
        setShowAdd(false); setEditItem(null);
        setForm({ title: '', description: '', image_url: '', click_url: '', position: 'top', target_type: 'all', priority: 1, start_date: '', end_date: '', is_active: true });
        fetchAds();
      } else {
        setErrMsg(data.error || 'فشل الحفظ');
      }
    } catch { setErrMsg('خطأ في الاتصال'); } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 4000);
    }
  };
  const handleEdit = (ad: any) => {
    setEditItem(ad);
    setForm({ title: ad.title || '', description: ad.description || '', image_url: ad.image_url || '', click_url: ad.click_url || '', position: ad.position || 'top', target_type: ad.target_type || 'all', priority: ad.priority || 1, start_date: ad.start_date || '', end_date: ad.end_date || '', is_active: ad.is_active !== false });
    setErrMsg('');
    setShowAdd(true);
  };

  const handleToggle = async (id: number, is_active: boolean) => {
    try {
      await fetch('/api/ads', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id, is_active: !is_active }) });
      setAds(ads.map(a => a.id === id ? { ...a, is_active: !is_active } : a));
    } catch {}
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await fetch(`/api/ads?id=${id}`, { method: 'DELETE', headers: getHeaders() });
      setAds(ads.filter(a => a.id !== id));
      setMsg('CheckCircle تم حذف الإعلان');
      setMsgType('success');
      setTimeout(() => setMsg(''), 3000);
    } catch {}
  };

  const positionLabels: Record<string, string> = { top: '⬆️ أعلى الصفحة', bottom: '⬇️ أسفل الصفحة', sidebar: '◀️ الشريط الجانبي', all: 'Globe في كل مكان' };
  const targetLabels: Record<string, string> = { all: 'Users الجميع', schools: 'School المدارس', universities: 'GraduationCap الجامعات', institutes: 'BookOpen المعاهد' };

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'IBM Plex Sans Arabic, sans-serif' };
  const labelStyle: React.CSSProperties = { color: '#9CA3AF', fontSize: 13, marginBottom: 6, display: 'block' };

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#C9A227', fontSize: 18 }}>⏳ جاري التحميل...</div>;

  return (
    <div style={{ padding: '24px', direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* الهيدر */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#C9A227', margin: 0 }}>Megaphone الإعلانات</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14, margin: '6px 0 0' }}>إدارة إعلانات المنصة المعروضة لجميع المؤسسات</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 24px', background: showAdd ? '#374151' : 'linear-gradient(135deg, #C9A227, #E8C547)', color: showAdd ? '#fff' : '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
          {showAdd ? '[X] إلغاء' : '+ إضافة إعلان'}
        </button>
      </div>

      {/* رسالة */}
      {msg && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600, background: msgType === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, color: msgType === 'success' ? '#10B981' : '#EF4444' }}>{msg}</div>}

      {/* إحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'الكل', value: ads.length, color: '#C9A227', icon: "ICON_Megaphone" },
          { label: 'نشطة', value: ads.filter(a => a.is_active).length, color: '#10B981', icon: "ICON_CheckCircle" },
          { label: 'إجمالي المشاهدات', value: ads.reduce((s, a) => s + (a.views || 0), 0), color: '#3B82F6', icon: 'Eye️' },
          { label: 'إجمالي النقرات', value: ads.reduce((s, a) => s + (a.clicks || 0), 0), color: '#8B5CF6', icon: 'Mouse️' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 22, fontWeight: 800 }}>{s.value.toLocaleString()}</div>
            <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* فورم الإضافة */}
      {showAdd && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: '#C9A227', fontSize: 18, margin: '0 0 20px', fontWeight: 700 }}>{editItem ? 'Pencil️ تعديل الإعلان' : 'Plus إضافة إعلان جديد'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>عنوان الإعلان *</label>
              <input style={inputStyle} placeholder="عنوان جذاب للإعلان" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>الوصف</label>
              <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="وصف الإعلان..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>رابط الصورة</label>
              <input style={inputStyle} placeholder="https://..." value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>رابط عند النقر</label>
              <input style={inputStyle} placeholder="https://..." value={form.click_url} onChange={e => setForm({...form, click_url: e.target.value})} dir="ltr" />
            </div>
            <div>
              <label style={labelStyle}>الموضع</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                <option value="top">أعلى الصفحة</option>
                <option value="bottom">أسفل الصفحة</option>
                <option value="sidebar">الشريط الجانبي</option>
                <option value="all">في كل مكان</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>الجمهور المستهدف</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.target_type} onChange={e => setForm({...form, target_type: e.target.value})}>
                <option value="all">الجميع</option>
                <option value="schools">المدارس فقط</option>
                <option value="universities">الجامعات فقط</option>
                <option value="institutes">المعاهد فقط</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>تاريخ البداية</label>
              <input type="date" style={inputStyle} value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>تاريخ الانتهاء</label>
              <input type="date" style={inputStyle} value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} />
            </div>
          </div>
          {errMsg && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{errMsg}</div>}
          <button onClick={handleSave} disabled={saving} style={{ marginTop: 20, padding: '12px 32px', background: 'linear-gradient(135deg, #C9A227, #E8C547)', color: '#000', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', opacity: saving ? 0.5 : 1 }}>
            {saving ? '⏳ جاري الحفظ...' : editItem ? 'Save حفظ التعديلات' : 'Megaphone نشر الإعلان'}
          </button>
        </div>
      )}

      {/* قائمة الإعلانات */}
      {ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>[Megaphone]</div>
          <h3 style={{ color: '#fff', fontSize: 18, margin: '0 0 8px' }}>لا توجد إعلانات بعد</h3>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>أضف أول إعلان لعرضه على جميع مؤسسات المنصة</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {ads.map((ad: any) => (
            <div key={ad.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${ad.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, overflow: 'hidden' }}>
              {ad.image_url && (
                <div style={{ height: 140, background: '#1a2a3a', overflow: 'hidden' }}>
                  <img src={ad.image_url} alt={ad.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <h3 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0, flex: 1 }}>{ad.title}</h3>
                  <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: ad.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: ad.is_active ? '#10B981' : '#6B7280', flexShrink: 0, marginRight: 8 }}>
                    {ad.is_active ? 'Check نشط' : '⏸ موقوف'}
                  </span>
                </div>
                {ad.description && <p style={{ color: '#9CA3AF', fontSize: 13, margin: '0 0 10px' }}>{ad.description}</p>}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>{positionLabels[ad.position] || ad.position}</span>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>Eye️ {(ad.views || 0).toLocaleString()}</span>
                  <span style={{ color: '#6B7280', fontSize: 12 }}>[Mouse]️ {(ad.clicks || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleToggle(ad.id, ad.is_active)} style={{ flex: 1, padding: '7px 12px', background: ad.is_active ? 'rgba(107,114,128,0.1)' : 'rgba(16,185,129,0.1)', color: ad.is_active ? '#6B7280' : '#10B981', border: `1px solid ${ad.is_active ? 'rgba(107,114,128,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                    {ad.is_active ? '⏸ إيقاف' : '▶️ تفعيل'}
                  </button>
                  <button onClick={() => handleEdit(ad)} style={{ padding: '7px 14px', background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>Pencil️</button>
                  <button onClick={() => handleDelete(ad.id)} style={{ padding: '7px 14px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
                    Trash2️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
