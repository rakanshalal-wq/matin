'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function AppearancePage() {
  const [settings, setSettings] = useState({ primary_color: GOLD, secondary_color: '#1a1a2e', font_family: 'IBM Plex Sans Arabic', logo_url: '', favicon_url: '', dark_mode: true, rtl: true });
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try { await fetch('/api/settings', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ appearance: settings }) }); } catch {}
    setSaving(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 32, marginBottom: 24 }, label: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }, input: { background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' as const }, btn: { background: GOLD, color: '#000', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15, fontFamily: 'IBM Plex Sans Arabic, sans-serif' } };
  return (
    <div style={s.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div><div style={{ fontSize: 28, fontWeight: 700 }}>المظهر والتخصيص</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>تخصيص مظهر المنصة والألوان</div></div>
        <button style={s.btn} onClick={save} disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>الألوان</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={s.label}>اللون الرئيسي</label><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><input type="color" value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }} /><input style={s.input} value={settings.primary_color} onChange={e => setSettings({...settings, primary_color: e.target.value})} /></div></div>
          <div><label style={s.label}>اللون الثانوي</label><div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><input type="color" value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }} /><input style={s.input} value={settings.secondary_color} onChange={e => setSettings({...settings, secondary_color: e.target.value})} /></div></div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>الخطوط والشعارات</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={s.label}>نوع الخط</label><input style={s.input} value={settings.font_family} onChange={e => setSettings({...settings, font_family: e.target.value})} /></div>
          <div><label style={s.label}>رابط الشعار</label><input style={s.input} value={settings.logo_url} onChange={e => setSettings({...settings, logo_url: e.target.value})} /></div>
          <div><label style={s.label}>رابط الـ Favicon</label><input style={s.input} value={settings.favicon_url} onChange={e => setSettings({...settings, favicon_url: e.target.value})} /></div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>الإعدادات العامة</h3>
        {[['dark_mode','الوضع الداكن'],['rtl','اتجاه النص (RTL)']].map(([k,l]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 15 }}>{l}</span>
            <div onClick={() => setSettings({...settings, [k]: !(settings as any)[k]})} style={{ width: 48, height: 26, borderRadius: 13, background: (settings as any)[k] ? GOLD : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const, transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute' as const, top: 3, left: (settings as any)[k] ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
