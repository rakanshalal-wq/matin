'use client';
export const dynamic = 'force-dynamic';
import { ClipboardList, Lock, Settings, Trash2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, DataTable, EmptyState, LoadingState, FilterTabs } from '../_components';

const getH = (): Record<string, string> => {
  try {
    const t = localStorage.getItem('matin_token');
    if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const SC: Record<string, string> = { success: '#10B981', failed: '#EF4444', warning: '#F59E0B', info: '#3B82F6' };

export default function SecurityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'logs' | 'sessions' | 'settings'>('logs');
  const [settings, setSettings] = useState({ two_factor: false, session_timeout: '60', max_login_attempts: '5', password_min_length: '8', require_uppercase: true, require_numbers: true, require_special: false });
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/security', { headers: getH() });
      const d = await r.json();
      setLogs(Array.isArray(d) ? d : (d.logs || []));
      setSessions(d.sessions || []);
      if (d.settings) setSettings(d.settings);
    } catch { setLogs([]); } finally { setLoading(false); }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/security', { method: 'PUT', headers: getH(), body: JSON.stringify({ settings }) });
      setErrMsg('');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const revokeSession = async (id: string) => {
    if (!confirm('إلغاء هذه الجلسة؟')) return;
    try {
      await fetch('/api/security?session_id=' + id, { method: 'DELETE', headers: getH() });
      fetchData();
    } catch {}
  };

  const filteredLogs = logs.filter(l => !filterStatus || l.status === filterStatus);

  const tabs = [
    { key: 'logs', label: 'سجل الأحداث' },
    { key: 'sessions', label: 'الجلسات النشطة' },
    { key: 'settings', label: 'إعدادات الأمان' },
  ];

  const statusFilterTabs = [
    { key: '', label: 'الكل' },
    { key: 'success', label: 'ناجح' },
    { key: 'failed', label: 'فاشل' },
    { key: 'warning', label: 'تحذير' },
  ];

  const logColumns = [
    { key: 'user_name', label: 'المستخدم', render: (v: any, r: any) => <span className="cell-title">{v || r.user_id || '—'}</span> },
    { key: 'action', label: 'النشاط', render: (v: any, r: any) => <span className="cell-sub">{v || r.description || '—'}</span> },
    { key: 'ip_address', label: 'IP', render: (v: any) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{v || '—'}</span> },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => {
        const c = SC[v] || '#9CA3AF';
        return <span className="badge" style={{ background: `${c}22`, color: c }}>{v || '—'}</span>;
      }
    },
    { key: 'created_at', label: 'الوقت', align: 'center' as const, render: (v: any) => v ? new Date(v).toLocaleString('ar-SA') : '—' },
  ];

  const sessionColumns = [
    { key: 'user_name', label: 'المستخدم', render: (v: any) => <span className="cell-title">{v || '—'}</span> },
    { key: 'device', label: 'الجهاز', render: (v: any, r: any) => <span className="cell-sub">{v || r.user_agent || '—'}</span> },
    { key: 'ip_address', label: 'IP', render: (v: any) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{v || '—'}</span> },
    { key: 'created_at', label: 'بدء الجلسة', align: 'center' as const, render: (v: any) => v ? new Date(v).toLocaleString('ar-SA') : '—' },
    { key: 'last_activity', label: 'آخر نشاط', align: 'center' as const, render: (v: any) => v ? new Date(v).toLocaleString('ar-SA') : '—' },
    {
      key: 'actions', label: 'إجراء', align: 'center' as const,
      render: (_: any, s: any) => (
        <button className="btn-sm btn-sm-red" onClick={() => revokeSession(s.id)}><Trash2 size={13} /> إلغاء</button>
      )
    },
  ];

  const toggleSettings = [
    { k: 'two_factor', l: 'المصادقة الثنائية', d: 'طبقة حماية إضافية عند الدخول' },
    { k: 'require_uppercase', l: 'أحرف كبيرة في كلمة المرور', d: 'إلزامية حرف كبير واحد على الأقل' },
    { k: 'require_numbers', l: 'أرقام في كلمة المرور', d: 'إلزامية رقم واحد على الأقل' },
    { k: 'require_special', l: 'رموز خاصة في كلمة المرور', d: 'إلزامية رمز خاص مثل @#$' },
  ];

  if (loading) return <LoadingState message="جاري تحميل بيانات الأمان..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="الأمان وحماية النظام"
        subtitle="مراقبة الأمان وإدارة الجلسات والصلاحيات"
        icon={<Lock size={22} />}
      />

      <div className="stat-grid">
        <StatCard label="محاولات ناجحة" value={logs.filter(l => l.status === 'success').length} icon={<ClipboardList size={20} />} color="#10B981" />
        <StatCard label="محاولات فاشلة" value={logs.filter(l => l.status === 'failed').length} icon={<Lock size={20} />} color="#EF4444" />
        <StatCard label="الجلسات النشطة" value={sessions.length} icon={<Settings size={20} />} color="#D4A843" />
        <StatCard label="تنبيهات أمنية" value={logs.filter(l => l.status === 'warning').length} icon={<Lock size={20} />} color="#F59E0B" />
      </div>

      <FilterTabs tabs={tabs} active={activeTab} onChange={v => setActiveTab(v as any)} />

      {activeTab === 'logs' && (
        <>
          <div style={{ marginBottom: 16 }}>
            <FilterTabs tabs={statusFilterTabs} active={filterStatus} onChange={setFilterStatus} />
          </div>
          {filteredLogs.length === 0 ? (
            <EmptyState icon={<ClipboardList size={32} />} title="لا توجد سجلات" description="" />
          ) : (
            <DataTable columns={logColumns} data={filteredLogs} />
          )}
        </>
      )}

      {activeTab === 'sessions' && (
        sessions.length === 0 ? (
          <EmptyState icon={<Lock size={32} />} title="لا توجد جلسات نشطة" description="" />
        ) : (
          <DataTable columns={sessionColumns} data={sessions} />
        )
      )}

      {activeTab === 'settings' && (
        <div className="dcard" style={{ maxWidth: 560 }}>
          <h3 className="card-section-title"><Settings size={16} /> إعدادات الأمان</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
            {toggleSettings.map(({ k, l, d }) => (
              <div key={k} className="toggle-row">
                <div>
                  <div className="cell-title" style={{ fontSize: 14 }}>{l}</div>
                  <div className="cell-sub" style={{ fontSize: 12, marginTop: 2 }}>{d}</div>
                </div>
                <div
                  className={`toggle-switch ${(settings as any)[k] ? 'toggle-on' : ''}`}
                  onClick={() => setSettings({ ...settings, [k]: !(settings as any)[k] })}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
            ))}
          </div>
          <div className="form-row" style={{ marginBottom: 20 }}>
            <div>
              <label className="form-label">مهلة الجلسة (دقيقة)</label>
              <input type="number" className="input-field" value={settings.session_timeout} onChange={e => setSettings({ ...settings, session_timeout: e.target.value })} />
            </div>
            <div>
              <label className="form-label">أقصى محاولات دخول</label>
              <input type="number" className="input-field" value={settings.max_login_attempts} onChange={e => setSettings({ ...settings, max_login_attempts: e.target.value })} />
            </div>
            <div>
              <label className="form-label">الحد الأدنى لكلمة المرور</label>
              <input type="number" className="input-field" value={settings.password_min_length} onChange={e => setSettings({ ...settings, password_min_length: e.target.value })} />
            </div>
          </div>
          {errMsg && <div className="error-msg" style={{ marginBottom: 12 }}>{errMsg}</div>}
          <button className="btn-gold" onClick={saveSettings} disabled={saving}>
            {saving ? 'جاري الحفظ...' : <><Settings size={15} /> حفظ الإعدادات</>}
          </button>
        </div>
      )}
    </div>
  );
}
