"use client";

import React, { useState, useEffect } from 'react';
import { Save, Eye, Palette, Layout, Plus, School, GraduationCap, BookOpen, Heart, Settings, X, Pencil, FileText, Phone, Smartphone } from "lucide-react";
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export const dynamic = 'force-dynamic';

const Card = ({ children, title, icon: Icon, color }: any) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 15 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, dir, isTextArea = false }: any) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
    {isTextArea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir || 'rtl'} style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box', minHeight: 100, resize: 'vertical' }} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir || 'rtl'} style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
    )}
  </div>
);

export default function SchoolPageManagement() {
  const [pages, setPages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [form, setForm] = useState<any>({
    type: 'school',
    primary_color: '#1E88E5',
    secondary_color: '#1565C0',
    accent_color: '#FFB300',
    font_family: 'IBM Plex Sans Arabic',
    show_global_ads: true,
    is_published: true
  });

  useEffect(() => { fetchPages(); }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/school-page', { headers: getHeaders() });
      const data = await res.json();
      setPages(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openEditor = (page: any) => {
    setSelected(page);
    setForm({
      ...page,
      type: page.type || 'school',
      primary_color: page.primary_color || '#1E88E5',
      secondary_color: page.secondary_color || '#1565C0',
      accent_color: page.accent_color || '#FFB300',
      font_family: page.font_family || 'IBM Plex Sans Arabic',
      show_global_ads: page.show_global_ads ?? true,
      is_published: page.is_published ?? true
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/school-page', { 
        method: 'PUT', 
        headers: getHeaders(), 
        body: JSON.stringify(form) 
      });
      if (res.ok) {
        await fetchPages();
        alert('تم الحفظ بنجاح');
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleCreate = async () => {
    if (!newSlug || !newName) return alert('أدخل الاسم والرابط');
    try {
      const user = JSON.parse(localStorage.getItem('matin_user') || '{}');
      const res = await fetch('/api/school-page', { 
        method: 'POST', 
        headers: getHeaders(), 
        body: JSON.stringify({ slug: newSlug, school_name: newName, school_id: user.school_id }) 
      });
      if (res.ok) { setShowAdd(false); setNewSlug(''); setNewName(''); await fetchPages(); }
      else { const err = await res.json(); alert(err.error || 'فشل'); }
    } catch (e) { console.error(e); }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--gold)', textAlign: 'center' }}>جارٍ تحميل إعدادات الصفحة...</div>;

  const types = [
    { id: 'school', label: 'مدرسة', icon: School },
    { id: 'university', label: 'جامعة', icon: GraduationCap },
    { id: 'training', label: 'مركز تدريب', icon: BookOpen },
    { id: 'quran', label: 'مركز تحفيظ', icon: Heart },
  ];

  return (
    <div style={{ fontFamily: 'var(--font)', direction: 'rtl' }}>
      {!selected ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h1 className="page-title"><IconRenderer name="ICON_School" size={18} /> صفحة المؤسسة</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>تخصيص القالب والهوية البصرية لمؤسستك</p>
            </div>
            <button onClick={() => setShowAdd(true)} style={{ background: 'linear-gradient(135deg, #D4A843, #D4B03D)', color: 'var(--bg)', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}><Plus size={18} /> إنشاء صفحة</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {pages.map(page => (
              <div key={page.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ color: 'white', fontWeight: 800, margin: 0 }}>{page.school_name}</h3>
                  <span style={{ background: page.is_published ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: page.is_published ? '#22C55E' : '#EF4444', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20 }}>{page.is_published ? 'منشور' : 'مخفي'}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>matin.ink/institution/{page.slug}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => openEditor(page)} style={{ flex: 1, background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}><Pencil size={16} /> تعديل</button>
                  <a href={`/institution/${page.slug}`} target="_blank" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}><Eye size={16} /> معاينة</a>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 16px', cursor: 'pointer' }}>← رجوع</button>
              <h2 style={{ color: 'white', fontWeight: 900, margin: 0 }}>تخصيص: {form.school_name}</h2>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #D4A843, #D4B03D)', color: '#000', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* نوع المؤسسة */}
              <Card title="نوع المؤسسة والقالب" icon={Layout} color="#3B82F6">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                  {types.map(t => (
                    <div key={t.id} onClick={() => setForm({...form, type: t.id})} style={{ padding: 20, borderRadius: 16, border: `2px solid ${form.type === t.id ? '#D4A843' : 'rgba(255,255,255,0.05)'}`, background: form.type === t.id ? 'rgba(212,168,67,0.05)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                      <t.icon size={28} color={form.type === t.id ? '#D4A843' : 'rgba(255,255,255,0.3)'} style={{ marginBottom: 10 }} />
                      <div style={{ fontWeight: 800, fontSize: 13, color: form.type === t.id ? '#fff' : 'rgba(255,255,255,0.5)' }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* المعلومات الأساسية */}
              <Card title="المحتوى والمعلومات" icon={FileText} color="#A855F7">
                <InputField label="اسم المؤسسة" value={form.school_name || ''} onChange={(v:any) => setForm({...form, school_name: v})} />
                <InputField label="وصف المؤسسة" value={form.description || ''} onChange={(v:any) => setForm({...form, description: v})} isTextArea={true} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <InputField label="الرؤية" value={form.vision || ''} onChange={(v:any) => setForm({...form, vision: v})} isTextArea={true} />
                  <InputField label="الرسالة" value={form.mission || ''} onChange={(v:any) => setForm({...form, mission: v})} isTextArea={true} />
                </div>
              </Card>

              {/* التواصل */}
              <Card title="بيانات التواصل" icon={Phone} color="#10B981">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <InputField label="رقم الهاتف" value={form.phone || ''} onChange={(v:any) => setForm({...form, phone: v})} dir="ltr" />
                  <InputField label="البريد الإلكتروني" value={form.email || ''} onChange={(v:any) => setForm({...form, email: v})} dir="ltr" />
                </div>
                <InputField label="العنوان" value={form.address || ''} onChange={(v:any) => setForm({...form, address: v})} />
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* الهوية البصرية */}
              <Card title="الهوية البصرية" icon={Palette} color="#D4A843">
                <InputField label="اللون الأساسي" type="color" value={form.primary_color} onChange={(v:any) => setForm({...form, primary_color: v})} />
                <InputField label="اللون الثانوي" type="color" value={form.secondary_color} onChange={(v:any) => setForm({...form, secondary_color: v})} />
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>نوع الخط</label>
                  <select value={form.font_family} onChange={e => setForm({...form, font_family: e.target.value})} style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 10, color: 'white', fontSize: 14, outline: 'none' }}>
                    <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic</option>
                    <option value="Tajawal">Tajawal</option>
                    <option value="Cairo">Cairo</option>
                  </select>
                </div>
              </Card>

              {/* الإعدادات */}
              <Card title="الحالة والخصوصية" icon={Settings} color="#6B7280">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>نشر الصفحة للعموم</span>
                  <div onClick={() => setForm({...form, is_published: !form.is_published})} style={{ width: 44, height: 24, background: form.is_published ? '#22C55E' : 'rgba(255,255,255,0.1)', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
                    <div style={{ width: 16, height: 16, background: 'white', borderRadius: '50%', transform: form.is_published ? 'translateX(-20px)' : 'translateX(0)', transition: 'all 0.3s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>إعلانات متين المركزية</span>
                  <span style={{ color: form.show_global_ads ? '#10B981' : 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 800 }}>{form.show_global_ads ? 'مفروضة' : 'معطلة'}</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Modal إنشاء صفحة */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1B263B', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 440 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>إنشاء صفحة جديدة</h2>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <InputField label="اسم المؤسسة *" value={newName} onChange={setNewName} placeholder="مدرسة النجاح" />
            <InputField label="رابط الصفحة * (slug)" value={newSlug} onChange={(v:any) => setNewSlug(v.toLowerCase().replace(/\s/g, '-'))} placeholder="success-school" dir="ltr" />
            <button onClick={handleCreate} style={{ width: '100%', background: 'linear-gradient(135deg, #D4A843, #D4B03D)', color: '#000', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 12 }}>إنشاء الصفحة الآن</button>
          </div>
        </div>
      )}
    </div>
  );
}
