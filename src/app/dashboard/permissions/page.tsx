'use client';
import { useState, useEffect } from 'react';
const getH = (): Record<string, string> => { try { const t = localStorage.getItem('matin_token'); if (t) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
const GOLD = '#C9A84C', BG = '#0B0B16', CB = 'rgba(255,255,255,0.04)', BR = 'rgba(255,255,255,0.08)';
const ROLES = [
  { id: 'admin', label: 'مدير المدرسة', icon: '👑', color: GOLD },
  { id: 'teacher', label: 'معلم', icon: '👨‍🏫', color: '#3B82F6' },
  { id: 'student', label: 'طالب', icon: '🎓', color: '#10B981' },
  { id: 'parent', label: 'ولي أمر', icon: '👨‍👩‍👧', color: '#8B5CF6' },
  { id: 'driver', label: 'سائق', icon: '🚌', color: '#F59E0B' },
  { id: 'platform_staff', label: 'موظف المنصة', icon: '⚙️', color: '#EF4444' },
];
const MODULES = [
  { id: 'students', label: 'الطلاب' }, { id: 'teachers', label: 'المعلمون' },
  { id: 'attendance', label: 'الحضور' }, { id: 'grades', label: 'الدرجات' },
  { id: 'exams', label: 'الاختبارات' }, { id: 'homework', label: 'الواجبات' },
  { id: 'schedule', label: 'الجدول' }, { id: 'finance', label: 'المالية' },
  { id: 'library', label: 'المكتبة' }, { id: 'transport', label: 'النقل' },
  { id: 'cafeteria', label: 'الكافتيريا' }, { id: 'reports', label: 'التقارير' },
  { id: 'settings', label: 'الإعدادات' }, { id: 'backup', label: 'النسخ الاحتياطي' },
];
const ACTIONS = ['view', 'create', 'edit', 'delete'];
const ACTION_LABELS: Record<string, string> = { view: 'عرض', create: 'إنشاء', edit: 'تعديل', delete: 'حذف' };
export default function PermissionsPage() {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetchData(); }, [selectedRole]);
  const fetchData = async () => { setLoading(true); try { const r = await fetch('/api/permissions?role=' + selectedRole, { headers: getH() }); const d = await r.json(); setPermissions(d.permissions || {}); } catch { setPermissions({}); } finally { setLoading(false); } };
  const toggle = (module: string, action: string) => { setPermissions(prev => ({ ...prev, [module]: { ...(prev[module] || {}), [action]: !(prev[module]?.[action]) } })); };
  const toggleAll = (module: string) => { const allOn = ACTIONS.every(a => permissions[module]?.[a]); setPermissions(prev => ({ ...prev, [module]: Object.fromEntries(ACTIONS.map(a => [a, !allOn])) })); };
  const handleSave = async () => { setSaving(true); try { await fetch('/api/permissions', { method: 'PUT', headers: getH(), body: JSON.stringify({ role: selectedRole, permissions }) }); alert('تم حفظ الصلاحيات'); } catch { } finally { setSaving(false); } };
  const role = ROLES.find(r => r.id === selectedRole);
  return (
    <div style={{ minHeight: '100vh', background: BG, padding: '32px 24px', direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ marginBottom: 32 }}><h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>🛡️ إدارة الصلاحيات</h1><p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 6, fontSize: 14 }}>تحديد صلاحيات الوصول لكل دور</p></div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        {ROLES.map(r => <button key={r.id} onClick={() => setSelectedRole(r.id)} style={{ padding: '10px 18px', borderRadius: 12, border: '2px solid', borderColor: selectedRole === r.id ? r.color : BR, background: selectedRole === r.id ? `${r.color}22` : CB, color: selectedRole === r.id ? r.color : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}>{r.icon} {r.label}</button>)}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div> :
      <div style={{ background: CB, border: '1px solid ' + BR, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid ' + BR, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'white', fontSize: 16, fontWeight: 700, margin: 0 }}>{role?.icon} صلاحيات {role?.label}</h3>
          <button onClick={handleSave} disabled={saving} style={{ background: GOLD, border: 'none', borderRadius: 8, padding: '8px 20px', color: '#0B0B16', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid ' + BR }}>
              <th style={{ padding: '14px 20px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>الوحدة</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>الكل</th>
              {ACTIONS.map(a => <th key={a} style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{ACTION_LABELS[a]}</th>)}
            </tr></thead>
            <tbody>{MODULES.map((mod, i) => {
              const allOn = ACTIONS.every(a => permissions[mod.id]?.[a]);
              return <tr key={mod.id} style={{ borderBottom: '1px solid ' + BR, background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <td style={{ padding: '14px 20px', color: 'white', fontWeight: 600 }}>{mod.label}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}><button onClick={() => toggleAll(mod.id)} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid', borderColor: allOn ? GOLD : BR, background: allOn ? GOLD : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', color: allOn ? '#0B0B16' : 'transparent', fontSize: 14 }}>✓</button></td>
                {ACTIONS.map(a => { const on = permissions[mod.id]?.[a]; return <td key={a} style={{ padding: '14px 16px', textAlign: 'center' }}><button onClick={() => toggle(mod.id, a)} style={{ width: 28, height: 28, borderRadius: 6, border: '2px solid', borderColor: on ? '#10B981' : BR, background: on ? '#10B981' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto', color: on ? 'white' : 'transparent', fontSize: 14 }}>✓</button></td>; })}
              </tr>;
            })}</tbody>
          </table>
        </div>
      </div>}
    </div>
  );
}
