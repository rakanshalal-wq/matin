'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, ClipboardList, Megaphone, Palette, Plug, Save, Settings, ShoppingCart, XCircle } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, LoadingState, EmptyState } from '../_components';
import { getHeaders } from '@/lib/api';

interface Setting {
  id: number; key: string; value: string;
  category: string; description: string; updated_at: string;
}

const categoryLabels: Record<string, string> = {
  general: 'عام', design: 'التصميم', integrations: 'التكاملات',
  ads: 'الإعلانات', store: 'المتجر',
};
const categoryIcons: Record<string, any> = {
  general: <Settings size={15} />, design: <Palette size={15} />,
  integrations: <Plug size={15} />, ads: <Megaphone size={15} />,
  store: <ShoppingCart size={15} />,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState('general');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', { headers: getHeaders() });
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setSettings(arr);
      const vals: Record<string, string> = {};
      arr.forEach((s: Setting) => { vals[s.key] = s.value || ''; });
      setEditValues(vals);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      const res = await fetch('/api/settings', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ key, value: editValues[key] || '' }) });
      if (res.ok) { setMsg(`تم حفظ "${key}" بنجاح`); setMsgType('success'); fetchSettings(); }
      else { setMsg('فشل الحفظ'); setMsgType('error'); }
    } catch (e: any) { setMsg(e.message || 'خطأ في الاتصال'); setMsgType('error'); } finally {
      setSaving(null);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleSaveAll = async () => {
    setSaving('all');
    const filtered = settings.filter(s => s.category === activeCategory);
    let success = 0;
    for (const s of filtered) {
      try {
        const res = await fetch('/api/settings', { method: 'POST', headers: getHeaders(), body: JSON.stringify({ key: s.key, value: editValues[s.key] || '', category: s.category }) });
        if (res.ok) success++;
      } catch {}
    }
    setMsg(`تم حفظ ${success} إعداد بنجاح`);
    setMsgType('success');
    setSaving(null);
    setTimeout(() => setMsg(''), 3000);
    fetchSettings();
  };

  const categories = [...new Set(settings.map(s => s.category))];
  const filteredSettings = settings.filter(s => s.category === activeCategory);

  if (loading) return <LoadingState message="جاري تحميل الإعدادات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إعدادات المنصة"
        subtitle="تحكم في جميع إعدادات منصة متين"
        icon={<Settings size={22} />}
      />

      {msg && (
        <div className={`alert-msg ${msgType === 'success' ? 'alert-success' : 'alert-error'}`}>
          {msgType === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />} {msg}
        </div>
      )}

      <div className="settings-layout">
        {/* الشريط الجانبي */}
        <div className="settings-sidebar">
          {(categories.length > 0 ? categories : Object.keys(categoryLabels)).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`settings-cat-btn ${activeCategory === cat ? 'active' : ''}`}
            >
              {categoryIcons[cat] || <ClipboardList size={15} />}
              <span>{categoryLabels[cat] || cat}</span>
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div className="settings-content dcard">
          <div className="settings-content-header">
            <h2 className="section-title" style={{ margin: 0 }}>
              {categoryIcons[activeCategory]} {categoryLabels[activeCategory] || activeCategory}
            </h2>
            <button className="btn-gold" onClick={handleSaveAll} disabled={saving === 'all'}>
              {saving === 'all' ? '⏳ جاري الحفظ...' : <><Save size={15} /> حفظ الكل</>}
            </button>
          </div>

          {filteredSettings.length === 0 ? (
            <EmptyState icon={<Settings size={28} />} title="لا توجد إعدادات في هذه الفئة" description="" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredSettings.map(s => (
                <div key={s.key} className="setting-row">
                  <div className="setting-info">
                    <div className="cell-title" style={{ fontSize: 14 }}>{s.description || s.key}</div>
                    <div className="cell-sub" style={{ fontSize: 12 }}>{s.key}</div>
                  </div>
                  <div className="setting-control">
                    {s.key.includes('color') ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="color" value={editValues[s.key] || '#000000'} onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })} style={{ width: 44, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none' }} />
                        <input type="text" className="input-field" value={editValues[s.key] || ''} onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })} placeholder="#D4A843" dir="ltr" />
                      </div>
                    ) : s.key.includes('enabled') ? (
                      <button
                        className={editValues[s.key] === 'true' ? 'btn-sm btn-sm-green' : 'btn-sm btn-sm-red'}
                        onClick={() => setEditValues({ ...editValues, [s.key]: editValues[s.key] === 'true' ? 'false' : 'true' })}
                      >
                        {editValues[s.key] === 'true' ? <><CheckCircle size={12} /> مفعّل</> : <><XCircle size={12} /> معطّل</>}
                      </button>
                    ) : (
                      <input
                        type={s.key.includes('password') || s.key.includes('secret') ? 'password' : 'text'}
                        className="input-field"
                        value={editValues[s.key] || ''}
                        onChange={e => setEditValues({ ...editValues, [s.key]: e.target.value })}
                        placeholder={s.description || s.key}
                        dir="ltr"
                      />
                    )}
                  </div>
                  <button className="btn-sm btn-sm-gold" onClick={() => handleSave(s.key)} disabled={saving === s.key}>
                    {saving === s.key ? '⏳' : <><Save size={12} /> حفظ</>}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
