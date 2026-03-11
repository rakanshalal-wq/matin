'use client';
import { useState, useEffect } from 'react';
const GOLD = '#C9A84C'; const BG = '#06060E'; const CARD = 'rgba(255,255,255,0.04)'; const BORDER = 'rgba(255,255,255,0.08)';
export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ two_factor: false, login_attempts: 5, session_timeout: 60, ip_whitelist: '' });
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/activity-log?type=security', { credentials: 'include' });
      const arr = await r.json();
      setLogs(Array.isArray(arr) ? arr.slice(0, 50) : []);
    } catch {}
    setLoading(false);
  };
  const s: any = { page: { minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }, card: { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: 24, marginBottom: 24 }, label: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }, input: { background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' as const }, table: { width: '100%', borderCollapse: 'collapse' as const }, th: { padding: '12px 16px', textAlign: 'right' as const, fontSize: 12, color: 'rgba(255,255,255,0.4)', borderBottom: `1px solid ${BORDER}` }, td: { padding: '14px 16px', fontSize: 14, borderBottom: `1px solid rgba(255,255,255,0.04)` } };
  return (
    <div style={s.page}>
      <div style={{ marginBottom: 32 }}><div style={{ fontSize: 28, fontWeight: 700 }}>الأمان والحماية</div><div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>إعدادات الأمان وسجل الدخول</div></div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>إعدادات الأمان</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label style={s.label}>الحد الأقصى لمحاولات الدخول</label><input style={s.input} type="number" value={settings.login_attempts} onChange={e => setSettings({...settings, login_attempts: Number(e.target.value)})} /></div>
          <div><label style={s.label}>مهلة الجلسة (دقيقة)</label><input style={s.input} type="number" value={settings.session_timeout} onChange={e => setSettings({...settings, session_timeout: Number(e.target.value)})} /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={s.label}>قائمة IP المسموح بها (مفصولة بفاصلة)</label><input style={s.input} value={settings.ip_whitelist} onChange={e => setSettings({...settings, ip_whitelist: e.target.value})} placeholder="192.168.1.1, 10.0.0.1" /></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '16px 0', borderTop: `1px solid ${BORDER}` }}>
          <span>المصادقة الثنائية (2FA)</span>
          <div onClick={() => setSettings({...settings, two_factor: !settings.two_factor})} style={{ width: 48, height: 26, borderRadius: 13, background: settings.two_factor ? GOLD : 'rgba(255,255,255,0.15)', cursor: 'pointer', position: 'relative' as const }}>
            <div style={{ position: 'absolute' as const, top: 3, left: settings.two_factor ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </div>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={{ margin: '0 0 20px', color: GOLD }}>سجل الأمان</h3>
        {loading ? <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div> : logs.length === 0 ? <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>لا توجد سجلات</div> : (
          <div style={{overflowX:"auto"}}><table style={s.table}><thead><tr>{['المستخدم','الإجراء','IP','التاريخ'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{logs.map((l: any, i: number) => (<tr key={l.id || i}><td style={s.td}>{l.user_name || l.user_id || '-'}</td><td style={s.td}>{l.action || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{l.ip_address || '-'}</td><td style={{ ...s.td, color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{l.created_at ? new Date(l.created_at).toLocaleString('ar-SA') : '-'}</td></tr>))}</tbody></table>
        )}
      </div>
    </div>
  );
}
