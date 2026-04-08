'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, Eye, Megaphone, Mouse, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, EmptyState, LoadingState, Modal } from '../_components';
import { getHeaders } from '@/lib/api';

export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [form, setForm] = useState({
    title: '', description: '', image_url: '', click_url: '',
    position: 'top', target_type: 'all', priority: 1,
    start_date: '', end_date: '', is_active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/ads/manage', { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAds(Array.isArray(data) ? data : []);
      } else {
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
        setMsg(editItem ? 'تم تعديل الإعلان' : 'تم إضافة الإعلان بنجاح');
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
      setMsg('تم حذف الإعلان');
      setMsgType('success');
      setTimeout(() => setMsg(''), 3000);
    } catch {}
  };

  const positionLabels: Record<string, string> = {
    top: 'أعلى الصفحة', bottom: 'أسفل الصفحة', sidebar: 'الشريط الجانبي', all: 'في كل مكان'
  };

  if (loading) return <LoadingState message="جاري تحميل الإعلانات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="الإعلانات"
        subtitle="إدارة إعلانات المنصة المعروضة لجميع المؤسسات"
        icon={<Megaphone size={22} />}
        action={
          <button className={showAdd ? 'btn-ghost' : 'btn-gold'} onClick={() => { setShowAdd(!showAdd); setEditItem(null); }}>
            {showAdd ? <><X size={16} /> إلغاء</> : <><Plus size={16} /> إضافة إعلان</>}
          </button>
        }
      />

      {msg && (
        <div className={`alert-msg ${msgType === 'success' ? 'alert-success' : 'alert-error'}`}>
          {msgType === 'success' ? <CheckCircle size={16} /> : <X size={16} />} {msg}
        </div>
      )}

      <div className="stat-grid">
        <StatCard label="إجمالي الإعلانات" value={ads.length} icon={<Megaphone size={20} />} color="#D4A843" />
        <StatCard label="الإعلانات النشطة" value={ads.filter(a => a.is_active).length} icon={<CheckCircle size={20} />} color="#10B981" />
        <StatCard label="إجمالي المشاهدات" value={ads.reduce((s, a) => s + (a.views || 0), 0)} icon={<Eye size={20} />} color="#3B82F6" />
        <StatCard label="إجمالي النقرات" value={ads.reduce((s, a) => s + (a.clicks || 0), 0)} icon={<Mouse size={20} />} color="#8B5CF6" />
      </div>

      {showAdd && (
        <Modal
          title={editItem ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
          icon={editItem ? <Pencil size={18} /> : <Plus size={18} />}
          onClose={() => { setShowAdd(false); setEditItem(null); setErrMsg(''); }}
          inline
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">عنوان الإعلان *</label>
              <input className="input-field" placeholder="عنوان جذاب للإعلان" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">الوصف</label>
              <textarea className="input-field" style={{ minHeight: 80, resize: 'vertical' }} placeholder="وصف الإعلان..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="form-label">رابط الصورة</label>
              <input className="input-field" placeholder="https://..." value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="form-label">رابط عند النقر</label>
              <input className="input-field" placeholder="https://..." value={form.click_url} onChange={e => setForm({ ...form, click_url: e.target.value })} dir="ltr" />
            </div>
            <div>
              <label className="form-label">الموضع</label>
              <select className="input-field" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
                <option value="top">أعلى الصفحة</option>
                <option value="bottom">أسفل الصفحة</option>
                <option value="sidebar">الشريط الجانبي</option>
                <option value="all">في كل مكان</option>
              </select>
            </div>
            <div>
              <label className="form-label">الجمهور المستهدف</label>
              <select className="input-field" value={form.target_type} onChange={e => setForm({ ...form, target_type: e.target.value })}>
                <option value="all">الجميع</option>
                <option value="schools">المدارس فقط</option>
                <option value="universities">الجامعات فقط</option>
                <option value="institutes">المعاهد فقط</option>
              </select>
            </div>
            <div>
              <label className="form-label">تاريخ البداية</label>
              <input type="date" className="input-field" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="form-label">تاريخ الانتهاء</label>
              <input type="date" className="input-field" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>
          {errMsg && <div className="error-msg">{errMsg}</div>}
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ جاري الحفظ...' : editItem ? <><Pencil size={15} /> حفظ التعديلات</> : <><Megaphone size={15} /> نشر الإعلان</>}
            </button>
          </div>
        </Modal>
      )}

      {ads.length === 0 ? (
        <EmptyState
          icon={<Megaphone size={32} />}
          title="لا توجد إعلانات بعد"
          description="أضف أول إعلان لعرضه على جميع مؤسسات المنصة"
        />
      ) : (
        <div className="cards-grid">
          {ads.map((ad: any) => (
            <div key={ad.id} className={`dcard ad-card ${ad.is_active ? 'ad-active' : ''}`}>
              {ad.image_url && (
                <div className="ad-image-wrap">
                  <img src={ad.image_url} alt={ad.title} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
              <div className="ad-body">
                <div className="ad-header">
                  <h3 className="ad-title">{ad.title}</h3>
                  <span className={`status-badge ${ad.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {ad.is_active ? <><CheckCircle size={11} /> نشط</> : '⏸ موقوف'}
                  </span>
                </div>
                {ad.description && <p className="ad-desc">{ad.description}</p>}
                <div className="ad-meta">
                  <span>{positionLabels[ad.position] || ad.position}</span>
                  <span><Eye size={12} /> {(ad.views || 0).toLocaleString()}</span>
                  <span><Mouse size={12} /> {(ad.clicks || 0).toLocaleString()}</span>
                </div>
                <div className="ad-actions">
                  <button
                    className={ad.is_active ? 'btn-sm btn-sm-gray' : 'btn-sm btn-sm-green'}
                    onClick={() => handleToggle(ad.id, ad.is_active)}
                  >
                    {ad.is_active ? '⏸ إيقاف' : <><CheckCircle size={12} /> تفعيل</>}
                  </button>
                  <button className="btn-sm btn-sm-gold" onClick={() => handleEdit(ad)}>
                    <Pencil size={13} />
                  </button>
                  <button className="btn-sm btn-sm-red" onClick={() => handleDelete(ad.id)}>
                    <Trash2 size={13} />
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
