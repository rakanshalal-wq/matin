'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'sessions' | 'settings'>('logs');
  const [sessions, setSessions] = useState<any[]>([]);
  const [settings, setSettings] = useState({ two_factor: false, session_timeout: '60', max_login_attempts: '5', password_min_length: '8', require_uppercase: true, require_numbers: true });
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/security', { headers: getH() }); const d = await r.json(); setLogs(Array.isArray(d) ? d : (d.logs || [])); setSessions(d.sessions || []); if (d.settings) setSettings(d.settings); } catch { setLogs([]); } finally { setLoading(false); } };
  const handleSaveSettings = async () => { setSaving(true); try { await fetch('/api/security', { method: 'PUT', headers: getH(), body: JSON.stringify({ settings }) }); alert('تم حفظ الإعدادات'); } catch { } finally { setSaving(false); } };
  const revokeSession = async (id: string) => { try { await fetch('/api/security?session_id=' + id, { method: 'DELETE', headers: getH() }); fetchData(); } catch { } };
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid ' + BR, borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6 };
  const STATUS_COLOR: Record<string, string> = { success: '#10B981', failed: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };
  const tabs = [{ id: 'logs', label: 'سجل الأحداث', icon: '📋' }, { id: 'sessions', label: 'الجلسات النشطة', icon: '🔐' }, { id: 'settings', label: 'إعدادات الأمان', icon: '⚙️' }];
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🔒 الأمان والحماية</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>مراقبة النشاط وإدارة الجلسات وإعدادات الأمان</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 28 }}>
        {[{ l: 'أحداث اليوم', v: logs.filter((r: any) => r.created_at?.startsWith(new Date().toISOString().split('T')[0])).length, c: GOLD, i: '📋' }, { l: 'محاولات فاشلة', v: logs.filter((r: any) => r.status === 'failed').length, c: '#EF4444', i: '❌' }, { l: 'جلسات نشطة', v: sessions.length, c: '#10B981', i: '🔐' }, { l: 'تنبيهات', v: logs.filter((r: any) => r.status === 'warning').length, c: '#F59E0B', i: '⚠️' }].map((s, i) => (
          <div key={i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 14, padding: '18px 20px' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{s.i}</div><div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.l}</div></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: CB, borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: activeTab === tab.id ? GOLD : 'transparent', color: activeTab === tab.id ? '#0B0B16' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>{tab.icon} {tab.label}</button>)}
      </div>
      {activeTab === 'logs' && <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
          logs.length === 0 ? <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48, marginBottom: 16 }}>📋</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد أحداث مسجلة</p></div> :
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>{['المستخدم', 'الحدث', 'الحالة', 'عنوان IP', 'الوقت'].map(h => <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>)}</tr></thead>
            <tbody>{logs.slice(0, 50).map((r: any, i: number) => (
              <tr key={r.id || i} style={{ borderBottom: '1px solid ' + BR }}>
                <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{r.user_name || r.user_id || 'غير معروف'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{r.action || r.event}</td>
                <td style={{ padding: '14px 16px' }}><span style={{ background: `${STATUS_COLOR[r.status] || '#9CA3AF'}22`, color: STATUS_COLOR[r.status] || '#9CA3AF', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{r.status}</span></td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'monospace' }}>{r.ip_address || '—'}</td>
                <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{r.created_at ? new Date(r.created_at).toLocaleString('ar-SA') : '—'}</td>
              </tr>
            ))}</tbody>
          </table></div>}
      </div>}
      {activeTab === 'sessions' && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
        {sessions.length === 0 ? <div style={{ textAlign: 'center', padding: 60, gridColumn: '1/-1' }}><div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div><p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد جلسات نشطة</p></div> :
          sessions.map((s: any, i: number) => (
            <div key={s.id || i} style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div><div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>{s.user_name || 'مستخدم'}</div><div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.role || 'غير محدد'}</div></div>
                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>نشط</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>🌐 {s.ip_address || 'غير معروف'}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>⏱️ {s.created_at ? new Date(s.created_at).toLocaleString('ar-SA') : '—'}</div>
              <button onClick={() => revokeSession(s.id)} style={{ width: '100%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>إنهاء الجلسة</button>
            </div>
          ))}
      </div>}
      {activeTab === 'settings' && <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, padding: 28, maxWidth: 600 }}>
        <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 24 }}>إعدادات الأمان</h3>
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div><div style={{ color: 'white', fontWeight: 600 }}>المصادقة الثنائية</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>تفعيل OTP عند تسجيل الدخول</div></div>
            <button onClick={() => setSettings({ ...settings, two_factor: !settings.two_factor })} style={{ width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: settings.two_factor ? GOLD : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.3s' }}><div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, transition: 'right 0.3s', right: settings.two_factor ? 3 : 25 }} /></button>
          </div>
          <div><label style={lbl}>مهلة انتهاء الجلسة (دقيقة)</label><input type="number" value={settings.session_timeout} onChange={e => setSettings({ ...settings, session_timeout: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>الحد الأقصى لمحاولات الدخول</label><input type="number" value={settings.max_login_attempts} onChange={e => setSettings({ ...settings, max_login_attempts: e.target.value })} style={inp} /></div>
          <div><label style={lbl}>الحد الأدنى لطول كلمة المرور</label><input type="number" value={settings.password_min_length} onChange={e => setSettings({ ...settings, password_min_length: e.target.value })} style={inp} /></div>
          <button onClick={handleSaveSettings} disabled={saving} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '12px 24px', color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</button>
        </div>
      </div>}
    </div>
  );
}
