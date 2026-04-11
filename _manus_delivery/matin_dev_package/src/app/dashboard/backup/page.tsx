'use client';
export const dynamic = 'force-dynamic';
import { Database, HardDrive, RefreshCw, Save, Settings, Trash2, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, DataTable, EmptyState, LoadingState, Modal, FilterTabs } from '../_components';

const getH = (): Record<string, string> => {
  try {
    const t = localStorage.getItem('matin_token');
    if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

export default function BackupPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'backups' | 'schedule'>('backups');
  const [schedule, setSchedule] = useState({ enabled: true, frequency: 'daily', time: '02:00', retention_days: '30' });
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [backupForm, setBackupForm] = useState({ type: 'full', destination: 'local' });
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/backup', { headers: getH() });
      const d = await r.json();
      setBackups(Array.isArray(d) ? d : (d.backups || []));
      if (d.schedule) setSchedule(d.schedule);
    } catch { setBackups([]); } finally { setLoading(false); }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const r = await fetch('/api/backup', { method: 'POST', headers: getH(), body: JSON.stringify({ type: 'manual' }) });
      if (r.ok) { alert('تم إنشاء النسخة الاحتياطية بنجاح'); fetchData(); }
      else alert('فشل إنشاء النسخة الاحتياطية');
    } catch {} finally { setCreating(false); }
  };

  const restoreBackup = async (id: number) => {
    if (!confirm('هل أنت متأكد من الاستعادة؟ سيتم استبدال البيانات الحالية.')) return;
    try {
      await fetch('/api/backup?id=' + id + '&action=restore', { method: 'POST', headers: getH() });
      alert('بدأت عملية الاستعادة');
    } catch {}
  };

  const deleteBackup = async (id: number) => {
    if (!confirm('تأكيد الحذف؟')) return;
    try {
      await fetch('/api/backup?id=' + id, { method: 'DELETE', headers: getH() });
      fetchData();
    } catch {}
  };

  const handleCreateBackup = async () => {
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('matin_token') || '' : '';
      const res = await fetch('/api/backup', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(backupForm) });
      const data = await res.json();
      if (res.ok) { setShowModal(false); fetchData(); }
      else { setErrMsg(data.error || 'فشل إنشاء النسخة'); }
    } catch (e: any) { console.error(e); } finally { setSaving(false); }
  };

  const saveSchedule = async () => {
    setSavingSchedule(true);
    try {
      await fetch('/api/backup', { method: 'PUT', headers: getH(), body: JSON.stringify({ schedule }) });
    } catch {} finally { setSavingSchedule(false); }
  };

  const formatSize = (b: number) => {
    if (!b) return '—';
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  };

  const totalSize = backups.reduce((s: number, b: any) => s + (b.size || 0), 0);

  const tabs = [
    { key: 'backups', label: 'النسخ الاحتياطية' },
    { key: 'schedule', label: 'الجدولة التلقائية' },
  ];

  const columns = [
    { key: 'name', label: 'الاسم', render: (v: any, r: any, i: number) => <span className="cell-title">{v || 'نسخة_' + i}</span> },
    {
      key: 'type', label: 'النوع', align: 'center' as const,
      render: (v: any) => <span className="badge badge-blue">{v === 'auto' ? 'تلقائية' : 'يدوية'}</span>
    },
    { key: 'size', label: 'الحجم', render: (v: any) => <span className="cell-sub">{formatSize(v)}</span> },
    {
      key: 'status', label: 'الحالة', align: 'center' as const,
      render: (v: any) => (
        <span className={`badge ${v === 'completed' ? 'badge-green' : 'badge-yellow'}`}>
          {v === 'completed' ? 'مكتملة' : 'جاري...'}
        </span>
      )
    },
    { key: 'created_at', label: 'التاريخ', render: (v: any) => v ? new Date(v).toLocaleString('ar-SA') : '—' },
    {
      key: 'actions', label: 'إجراءات', align: 'center' as const,
      render: (_: any, b: any) => (
        <div className="action-btns">
          <button className="btn-sm btn-sm-green" onClick={() => restoreBackup(b.id)}><RefreshCw size={13} /> استعادة</button>
          <button className="btn-sm btn-sm-red" onClick={() => deleteBackup(b.id)}><Trash2 size={13} /> حذف</button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingState message="جاري تحميل النسخ الاحتياطية..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="النسخ الاحتياطي"
        subtitle="إدارة النسخ الاحتياطية واستعادة البيانات"
        icon={<Save size={22} />}
        action={
          <button className="btn-gold" onClick={createBackup} disabled={creating}>
            {creating ? 'جاري الإنشاء...' : <><Save size={16} /> نسخة احتياطية الآن</>}
          </button>
        }
      />

      <div className="stat-grid">
        <StatCard label="إجمالي النسخ" value={backups.length} icon={<Database size={20} />} color="#D4A843" />
        <StatCard label="الحجم الكلي" value={formatSize(totalSize)} icon={<HardDrive size={20} />} color="#3B82F6" />
        <StatCard label="آخر نسخة" value={backups[0] ? new Date(backups[0].created_at).toLocaleDateString('ar-SA') : '—'} icon={<Save size={20} />} color="#10B981" />
        <StatCard label="الاحتفاظ" value={schedule.retention_days + ' يوم'} icon={<Settings size={20} />} color="#8B5CF6" />
      </div>

      <FilterTabs tabs={tabs} active={activeTab} onChange={v => setActiveTab(v as any)} />

      {activeTab === 'backups' && (
        backups.length === 0 ? (
          <EmptyState icon={<Database size={32} />} title="لا توجد نسخ احتياطية" description="أنشئ أول نسخة احتياطية الآن" />
        ) : (
          <DataTable columns={columns} data={backups} />
        )
      )}

      {activeTab === 'schedule' && (
        <div className="dcard" style={{ maxWidth: 500 }}>
          <h3 className="card-section-title"><Settings size={16} /> إعدادات الجدولة التلقائية</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="toggle-row">
              <div>
                <div className="cell-title">تفعيل النسخ التلقائي</div>
                <div className="cell-sub" style={{ fontSize: 12 }}>نسخ احتياطي تلقائي دوري</div>
              </div>
              <div
                className={`toggle-switch ${schedule.enabled ? 'toggle-on' : ''}`}
                onClick={() => setSchedule({ ...schedule, enabled: !schedule.enabled })}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
            <div>
              <label className="form-label">التكرار</label>
              <select className="input-field" value={schedule.frequency} onChange={e => setSchedule({ ...schedule, frequency: e.target.value })}>
                <option value="hourly">كل ساعة</option>
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
              </select>
            </div>
            <div>
              <label className="form-label">وقت النسخ</label>
              <input type="time" className="input-field" value={schedule.time} onChange={e => setSchedule({ ...schedule, time: e.target.value })} />
            </div>
            <div>
              <label className="form-label">الاحتفاظ بالنسخ (أيام)</label>
              <input type="number" className="input-field" value={schedule.retention_days} onChange={e => setSchedule({ ...schedule, retention_days: e.target.value })} min="1" max="365" />
            </div>
            <button className="btn-gold" onClick={saveSchedule} disabled={savingSchedule}>
              {savingSchedule ? 'جاري الحفظ...' : <><Settings size={15} /> حفظ الإعدادات</>}
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <Modal
          title="إنشاء نسخة احتياطية"
          icon={<Save size={18} />}
          onClose={() => setShowModal(false)}
        >
          <div className="form-row">
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">نوع النسخة</label>
              <select className="input-field" value={backupForm.type} onChange={e => setBackupForm({ ...backupForm, type: e.target.value })}>
                <option value="full">نسخة كاملة</option>
                <option value="partial">نسخة جزئية</option>
                <option value="database">قاعدة البيانات فقط</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">وجهة الحفظ</label>
              <select className="input-field" value={backupForm.destination} onChange={e => setBackupForm({ ...backupForm, destination: e.target.value })}>
                <option value="local">محلي</option>
                <option value="cloud">سحابي</option>
              </select>
            </div>
          </div>
          {errMsg && <div className="error-msg">{errMsg}</div>}
          <div className="modal-footer">
            <button className="btn-gold" onClick={handleCreateBackup} disabled={saving}>
              {saving ? 'جاري الإنشاء...' : <><Save size={15} /> إنشاء النسخة</>}
            </button>
            <button className="btn-ghost" onClick={() => setShowModal(false)}><X size={15} /> إلغاء</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
