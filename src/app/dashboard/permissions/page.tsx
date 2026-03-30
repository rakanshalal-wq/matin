'use client';
export const dynamic = 'force-dynamic';
import { Shield, Save, Check } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, LoadingState } from '../_components';

const ROLES = [
  { id: 'admin', label: 'مدير المدرسة', color: '#EF4444' },
  { id: 'teacher', label: 'معلم', color: '#3B82F6' },
  { id: 'student', label: 'طالب', color: '#10B981' },
  { id: 'parent', label: 'ولي أمر', color: '#8B5CF6' },
  { id: 'driver', label: 'سائق', color: '#F59E0B' },
];
const MODULES = [
  { id: 'students', label: 'الطلاب' }, { id: 'teachers', label: 'المعلمون' },
  { id: 'grades', label: 'الدرجات' }, { id: 'attendance', label: 'الحضور' },
  { id: 'finance', label: 'المالية' }, { id: 'reports', label: 'التقارير' },
  { id: 'exams', label: 'الاختبارات' }, { id: 'library', label: 'المكتبة' },
  { id: 'cafeteria', label: 'الكافتيريا' }, { id: 'transport', label: 'النقل' },
  { id: 'settings', label: 'الإعدادات' }, { id: 'backup', label: 'النسخ الاحتياطي' },
];
const ACTIONS = ['view', 'create', 'edit', 'delete'];
const ACTION_LABELS: Record<string, string> = { view: 'عرض', create: 'إنشاء', edit: 'تعديل', delete: 'حذف' };

export default function PermissionsPage() {
  const [perms, setPerms] = useState<Record<string, Record<string, Record<string, boolean>>>>(() => {
    const p: any = {};
    ROLES.forEach(r => { p[r.id] = {}; MODULES.forEach(m => { p[r.id][m.id] = { view: r.id === 'admin', create: r.id === 'admin', edit: r.id === 'admin', delete: r.id === 'admin' }; }); });
    return p;
  });
  const [selectedRole, setSelectedRole] = useState('admin');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => { fetchPerms(); }, []);

  const fetchPerms = async () => {
    setLoading(true);
    try { const r = await fetch('/api/permissions', { headers: getHeaders() }); const d = await r.json(); if (d.permissions) setPerms(d.permissions); }
    catch {} finally { setLoading(false); }
  };

  const toggle = (module: string, action: string) => {
    setPerms(p => ({ ...p, [selectedRole]: { ...p[selectedRole], [module]: { ...p[selectedRole][module], [action]: !p[selectedRole][module][action] } } }));
  };
  const toggleAll = (module: string, val: boolean) => {
    setPerms(p => ({ ...p, [selectedRole]: { ...p[selectedRole], [module]: Object.fromEntries(ACTIONS.map(a => [a, val])) } }));
  };

  const save = async () => {
    setSaving(true);
    try { await fetch('/api/permissions', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ permissions: perms }) }); setErrMsg(''); }
    catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); }
    finally { setSaving(false); }
  };

  const role = ROLES.find(r => r.id === selectedRole);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="إدارة الصلاحيات"
        subtitle="تحديد صلاحيات الوصول لكل دور في النظام"
        icon={<Shield size={20} color="#D4A843" />}
        actions={<button className="btn-gold" onClick={save} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}><Save size={15} /> {saving ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}</button>}
      />

      {errMsg && <div className="error-box">{errMsg}</div>}

      <div className="filter-tabs" style={{ border: 'none', padding: 0, marginBottom: 20 }}>
        {ROLES.map(r => (
          <button key={r.id} className={`ftab${selectedRole === r.id ? ' active' : ''}`}
            onClick={() => setSelectedRole(r.id)}
            style={selectedRole === r.id ? { background: `${r.color}22`, borderColor: `${r.color}66`, color: r.color } : {}}>
            {r.label}
          </button>
        ))}
      </div>

      {role && (
        <div className="alert-bar" style={{ background: `${role.color}11`, borderColor: `${role.color}44`, marginBottom: 20 }}>
          <span style={{ color: role.color, fontWeight: 700 }}>تعديل صلاحيات: {role.label}</span>
        </div>
      )}

      <div className="dcard">
        <div className="table-wrap">
          <table className="dtable">
            <thead><tr>
              <th>الوحدة</th>
              {ACTIONS.map(a => <th key={a} style={{ textAlign: 'center' }}>{ACTION_LABELS[a]}</th>)}
              <th style={{ textAlign: 'center' }}>الكل</th>
            </tr></thead>
            <tbody>
              {MODULES.map((m) => {
                const mp = perms[selectedRole]?.[m.id] || {};
                const allOn = ACTIONS.every(a => mp[a]);
                return (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 600 }}>{m.label}</td>
                    {ACTIONS.map(a => (
                      <td key={a} style={{ textAlign: 'center' }}>
                        <div onClick={() => toggle(m.id, a)} style={{
                          width: 26, height: 26, borderRadius: 7, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                          border: `2px solid ${mp[a] ? (role?.color || 'var(--gold)') : 'var(--border)'}`,
                          background: mp[a] ? `${role?.color || 'var(--gold)'}33` : 'transparent',
                        }}>
                          {mp[a] && <Check size={14} color={role?.color || '#D4A843'} strokeWidth={3} />}
                        </div>
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <div onClick={() => toggleAll(m.id, !allOn)} style={{
                        width: 26, height: 26, borderRadius: 7, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                        border: `2px solid ${allOn ? 'var(--gold)' : 'var(--border)'}`,
                        background: allOn ? 'var(--gold-dim)' : 'transparent',
                      }}>
                        {allOn && <Check size={14} color="#D4A843" strokeWidth={3} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
