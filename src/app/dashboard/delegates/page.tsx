'use client';
import { useState, useEffect } from 'react';

export default function DelegatesPage() {
  const [delegates, setDelegates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [permissions, setPermissions] = useState({
    manage_students: false,
    manage_teachers: false,
    manage_classes: false,
    manage_finance: false,
    manage_reports: false,
    manage_settings: false,
  });

  const getHeaders = () => {
    const token = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
    return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  };

  useEffect(() => {
    fetchDelegates();
    fetchUsers();
  }, []);

  const fetchDelegates = async () => {
    try {
      const res = await fetch('/api/delegates', { headers: getHeaders() });
      const data = await res.json();
      setDelegates(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', { headers: getHeaders() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const addDelegate = async () => {
    if (!selectedUser) return alert('اختر مستخدم');
    try {
      await fetch('/api/delegates', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ user_id: parseInt(selectedUser), permissions }),
      });
      setShowForm(false);
      setSelectedUser('');
      setPermissions({ manage_students: false, manage_teachers: false, manage_classes: false, manage_finance: false, manage_reports: false, manage_settings: false });
      fetchDelegates();
    } catch (e) { console.error(e); }
  };

  const deleteDelegate = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المندوب؟')) return;
    await fetch(`/api/delegates?id=${id}`, { method: 'DELETE', headers: getHeaders() });
    fetchDelegates();
  };

  const permissionLabels: Record<string, string> = {
    manage_students: '👨‍🎓 إدارة الطلاب',
    manage_teachers: '👨‍🏫 إدارة المعلمين',
    manage_classes: '🏫 إدارة الفصول',
    manage_finance: '💰 إدارة المالية',
    manage_reports: '📊 إدارة التقارير',
    manage_settings: '⚙️ إدارة الإعدادات',
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#C9A227' }}>جاري التحميل...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#C9A227', margin: 0 }}>👥 المندوبون</h1>
          <p style={{ color: '#94A3B8', margin: '5px 0 0' }}>إدارة مندوبي المدرسة وصلاحياتهم</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#C9A227', color: '#0F172A', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          ➕ إضافة مندوب
        </button>
      </div>

      {/* إحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        {[
          { label: 'إجمالي المندوبين', value: delegates.length, icon: '👥', color: '#3B82F6' },
          { label: 'نشط', value: delegates.length, icon: '✅', color: '#10B981' },
          { label: 'الصلاحيات', value: delegates.reduce((sum, d) => sum + Object.values(d.permissions || {}).filter(Boolean).length, 0), icon: '🔑', color: '#C9A227' },
        ].map((stat, i) => (
          <div key={i} style={{ background: '#1E293B', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
              <div style={{ color: '#94A3B8', fontSize: '14px' }}>{stat.label}</div>
            </div>
            <div style={{ fontSize: '30px' }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* نموذج إضافة */}
      {showForm && (
        <div style={{ background: '#1E293B', borderRadius: '12px', padding: '25px', marginBottom: '30px', border: '1px solid #334155' }}>
          <h3 style={{ color: '#C9A227', marginBottom: '20px' }}>إضافة مندوب جديد</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#94A3B8', display: 'block', marginBottom: '5px' }}>اختر المستخدم</label>
            <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0F172A', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }}>
              <option value="">-- اختر مستخدم --</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#94A3B8', display: 'block', marginBottom: '10px' }}>الصلاحيات</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {Object.entries(permissionLabels).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0', cursor: 'pointer', padding: '8px', background: permissions[key as keyof typeof permissions] ? '#1a3a2a' : '#0F172A', borderRadius: '8px', border: `1px solid ${permissions[key as keyof typeof permissions] ? '#10B981' : '#334155'}` }}>
                  <input type="checkbox" checked={permissions[key as keyof typeof permissions]} onChange={e => setPermissions({ ...permissions, [key]: e.target.checked })} />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={addDelegate} style={{ padding: '10px 25px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>حفظ</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '10px 25px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* جدول المندوبين */}
      {delegates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1E293B', borderRadius: '12px', color: '#94A3B8' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
          <p>لا يوجد مندوبون حالياً</p>
          <p style={{ fontSize: '14px' }}>أضف مندوبين لمساعدتك في إدارة المدرسة</p>
        </div>
      ) : (
        <div style={{ background: '#1E293B', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0F172A' }}>
                <th style={{ padding: '15px', textAlign: 'right', color: '#C9A227' }}>المندوب</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#C9A227' }}>البريد</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#C9A227' }}>الدور</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#C9A227' }}>الصلاحيات</th>
                <th style={{ padding: '15px', textAlign: 'right', color: '#C9A227' }}>تاريخ الإضافة</th>
                <th style={{ padding: '15px', textAlign: 'center', color: '#C9A227' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {delegates.map((d: any) => (
                <tr key={d.id} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '15px', color: '#E2E8F0' }}>{d.user_name || 'غير معروف'}</td>
                  <td style={{ padding: '15px', color: '#94A3B8' }}>{d.user_email || '-'}</td>
                  <td style={{ padding: '15px', color: '#94A3B8' }}>{d.user_role || '-'}</td>
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {Object.entries(d.permissions || {}).filter(([_, v]) => v).map(([k]) => (
                        <span key={k} style={{ padding: '2px 8px', background: '#10B981', color: '#fff', borderRadius: '12px', fontSize: '11px' }}>
                          {permissionLabels[k] || k}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '15px', color: '#94A3B8' }}>{new Date(d.created_at).toLocaleDateString('ar-SA')}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button onClick={() => deleteDelegate(d.id)} style={{ padding: '5px 12px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🗑️ حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
