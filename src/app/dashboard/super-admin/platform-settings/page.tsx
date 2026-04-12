"use client";

import React, { useState, useEffect } from 'react';
import { Save, Megaphone, ShoppingBag, Settings, Lock, Mail, Smartphone, MessageCircle, CreditCard, Package, CheckCircle } from "lucide-react";
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

export const dynamic = 'force-dynamic';

const Card = ({ children, title, icon: Icon, color }: any) => (
  <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: 15 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={color} />
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{title}</h2>
    </div>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder, dir }: any) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir={dir || 'ltr'} style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
  </div>
);

export default function PlatformSettingsPage() {
  const [activeTab, setActiveTab] = useState('sultah');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [globalAds, setGlobalAds] = useState<any[]>([]);
  const [globalStore, setGlobalStore] = useState<any[]>([]);
  const [newAd, setNewAd] = useState({ text: '', link: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/public/platform-settings');
        if (res.ok) {
          const data = await res.json();
          setGlobalAds(data.global_ads || []);
          setGlobalStore(data.global_store || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const saveSultahSettings = async (key: string, value: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/platform-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: JSON.stringify(value) })
      });
      if (res.ok) alert('تم الحفظ بنجاح');
      else alert('فشل الحفظ');
    } catch (err) {
      alert('خطأ في الاتصال');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: 'var(--gold)', textAlign: 'center' }}>جارٍ تحميل إعدادات السلطة العليا...</div>;

  const tabs = [
    { id: 'sultah', label: 'السلطة العليا', icon: Megaphone, color: '#D4A843' },
    { id: 'general', label: 'إعدادات عامة', icon: Settings, color: '#fff' },
    { id: 'auth', label: 'المصادقة', icon: Lock, color: '#fff' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>إدارة المنصة المركزية</h1>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', maxWidth: 1200, margin: '0 auto', padding: 24, gap: 24 }}>
        <div style={{ width: 220, flexShrink: 0 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', padding: '12px 16px', border: 'none', borderRadius: 10, cursor: 'pointer', marginBottom: 6, textAlign: 'right', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, background: activeTab === tab.id ? (tab.id === 'sultah' ? 'linear-gradient(135deg, #D4A843, #D4B03D)' : 'rgba(255,255,255,0.1)') : 'transparent', color: activeTab === tab.id ? (tab.id === 'sultah' ? '#000' : '#fff') : 'rgba(255,255,255,0.6)' }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === 'sultah' && (
            <>
              <Card title="الإعلانات العالمية المفروضة" icon={Megaphone} color="#10B981">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <input placeholder="نص الإعلان" value={newAd.text} onChange={e => setNewAd({...newAd, text: e.target.value})} style={{ flex: 2, padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                  <input placeholder="الرابط" value={newAd.link} onChange={e => setNewAd({...newAd, link: e.target.value})} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                  <button onClick={() => { setGlobalAds([...globalAds, newAd]); setNewAd({ text: '', link: '' }); }} style={{ padding: '0 20px', borderRadius: 8, background: '#10B981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>إضافة</button>
                </div>
                {globalAds.map((ad, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{ad.text}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{ad.link}</div></div>
                    <button onClick={() => setGlobalAds(globalAds.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                  </div>
                ))}
                <button onClick={() => saveSultahSettings('global_ads', globalAds)} style={{ marginTop: 10, width: '100%', padding: 14, borderRadius: 10, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 800, cursor: 'pointer' }}>حفظ تغييرات الإعلانات</button>
              </Card>

              <Card title="المتجر المركزي (منتجات المالك)" icon={ShoppingBag} color="#D4A843">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                  <input placeholder="اسم المنتج" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ flex: 2, padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                  <input placeholder="السعر" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
                  <button onClick={() => { setGlobalStore([...globalStore, newProduct]); setNewProduct({ name: '', price: '' }); }} style={{ padding: '0 20px', borderRadius: 8, background: '#D4A843', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>إضافة</button>
                </div>
                {globalStore.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div><div style={{ fontSize: 12, color: '#D4A843' }}>{p.price} ر.س</div></div>
                    <button onClick={() => setGlobalStore(globalStore.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>حذف</button>
                  </div>
                ))}
                <button onClick={() => saveSultahSettings('global_store', globalStore)} style={{ marginTop: 10, width: '100%', padding: 14, borderRadius: 10, background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.2)', fontWeight: 800, cursor: 'pointer' }}>حفظ تغييرات المتجر</button>
              </Card>
            </>
          )}

          {activeTab === 'general' && (
            <Card title="الإعدادات العامة" icon={Settings} color="#fff">
              <InputField label="اسم المنصة" value="متين" onChange={() => {}} dir="rtl" />
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>يتم تعديل باقي الإعدادات من لوحة التحكم التقليدية</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
