'use client';
  const getHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json' });
import { useState, useEffect } from 'react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action: 'get_users', role_filter: roleFilter, status_filter: statusFilter })
      });
      const data = await res.json();
      setUsers(data || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleAction = async (userId: number, action: string, newStatus?: string) => {
    setActionLoading(userId);
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action: action === 'toggle' ? 'toggle_status' : action, user_id: userId, new_status: newStatus })
      });
      fetchUsers();
    } catch (error) { console.error('Error:', error); } finally { setActionLoading(null); }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟ لا يمكن التراجع.`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action: 'delete_user', user_id: userId })
      });
      const data = await res.json();
      if (res.ok) { fetchUsers(); }
      else { alert(data.error || 'فشل الحذف'); }
    } catch { alert('خطأ بالاتصال'); } finally { setActionLoading(null); }
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const stats = {
    total: users.length,
    pending: users.filter((u: any) => u.status === 'pending').length,
    active: users.filter((u: any) => u.status === 'active').length,
    owners: users.filter((u: any) => u.role === 'owner').length,
  };

  const roleLabels: any = { super_admin: 'مالك المنصة', owner: 'مالك مدارس', admin: 'مدير', teacher: 'معلم', parent: 'ولي أمر', student: 'طالب', user: 'مستخدم' };
  const roleColors: any = { super_admin: '#C9A227', owner: '#8B5CF6', admin: '#3B82F6', teacher: '#10B981', parent: '#F59E0B', student: '#EC4899', user: '#6B7280' };
  const statusLabels: any = { active: 'مفعّل', pending: 'قيد المراجعة', rejected: 'مرفوض', suspended: 'موقوف' };
  const statusColors: any = { active: '#10B981', pending: '#F59E0B', rejected: '#EF4444', suspended: '#6B7280' };
  const packageLabels: any = { basic: 'أساسي', advanced: 'متقدم', enterprise: 'مؤسسي' };
  const packageColors: any = { basic: '#10B981', advanced: '#3B82F6', enterprise: '#C9A227' };

  const timeAgo = (date: string) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} د`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`;
    return new Date(date).toLocaleDateString('ar-SA');
  };

  return (
    <div>
      {/* تنبيه الطلبات المعلقة */}
      {stats.pending > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⏳</span>
          <div>
            <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>يوجد {stats.pending} طلب بانتظار الموافقة</div>
            <div style={{ color: 'rgba(245,158,11,0.8)', fontSize: 13, marginTop: 2 }}>راجع الطلبات واتخذ إجراء</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>👥 إدارة المستخدمين</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة جميع المستخدمين والموافقة على الطلبات</p>
        </div>
      </div>

      {/* الإحصائيات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي المستخدمين', value: stats.total, icon: '👥', color: '#3B82F6' },
          { label: 'بانتظار الموافقة', value: stats.pending, icon: '⏳', color: '#F59E0B' },
          { label: 'مستخدمين نشطين', value: stats.active, icon: '✅', color: '#10B981' },
          { label: 'ملاك المدارس', value: stats.owners, icon: '🏫', color: '#8B5CF6' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 6 }}>{s.label}</div>
                <div style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${s.color === '#3B82F6' ? '59,130,246' : s.color === '#F59E0B' ? '245,158,11' : s.color === '#10B981' ? '16,185,129' : '139,92,246'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* الفلاتر */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 بحث بالاسم أو الإيميل أو الجوال..."
          style={{ flex: 1, minWidth: 250, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }}
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
          <option value="all" style={{background:'#0D1B2A'}}>كل الأدوار</option>
          <option value="owner" style={{background:'#0D1B2A'}}>ملاك مدارس</option>
          <option value="admin" style={{background:'#0D1B2A'}}>مدراء</option>
          <option value="teacher" style={{background:'#0D1B2A'}}>معلمين</option>
          <option value="parent" style={{background:'#0D1B2A'}}>أولياء أمور</option>
          <option value="student" style={{background:'#0D1B2A'}}>طلاب</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
          <option value="all" style={{background:'#0D1B2A'}}>كل الحالات</option>
          <option value="pending" style={{background:'#0D1B2A'}}>قيد المراجعة</option>
          <option value="active" style={{background:'#0D1B2A'}}>مفعّل</option>
          <option value="rejected" style={{background:'#0D1B2A'}}>مرفوض</option>
          <option value="suspended" style={{background:'#0D1B2A'}}>موقوف</option>
        </select>
      </div>

      {/* الجدول */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>⏳ جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>لا يوجد مستخدمين</div>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['المستخدم', 'الدور', 'الباقة', 'الحالة', 'التسجيل', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: u.status === 'pending' ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                  {/* المستخدم */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(${(roleColors[u.role] || '#6B7280').slice(1).match(/../g)?.map((h: string) => parseInt(h,16)).join(',')},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                        {u.role === 'super_admin' ? '👑' : u.role === 'owner' ? '🏫' : u.role === 'admin' ? '🔧' : u.role === 'teacher' ? '👨‍🏫' : u.role === 'parent' ? '👨‍👧' : u.role === 'student' ? '🎓' : '👤'}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{u.email}</div>
                        {u.phone && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{u.phone}</div>}
                      </div>
                    </div>
                  </td>
                  {/* الدور */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: `rgba(${(roleColors[u.role] || '#6B7280').slice(1).match(/../g)?.map((h: string) => parseInt(h,16)).join(',')},0.1)`, color: roleColors[u.role] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  {/* الباقة */}
                  <td style={{ padding: '14px 16px' }}>
                    {u.role === 'owner' ? (
                      <span style={{ background: `rgba(${(packageColors[u.package] || '#6B7280').slice(1).match(/../g)?.map((h: string) => parseInt(h,16)).join(',')},0.1)`, color: packageColors[u.package] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                        {packageLabels[u.package] || u.package}
                      </span>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  {/* الحالة */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: `rgba(${(statusColors[u.status] || '#6B7280').slice(1).match(/../g)?.map((h: string) => parseInt(h,16)).join(',')},0.1)`, color: statusColors[u.status] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {statusLabels[u.status] || u.status}
                    </span>
                  </td>
                  {/* التسجيل */}
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                    {timeAgo(u.created_at)}
                  </td>
                  {/* الإجراءات */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {u.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(u.id, 'approve')}
                            disabled={actionLoading === u.id}
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >✅ موافقة</button>
                          <button
                            onClick={() => handleAction(u.id, 'reject')}
                            disabled={actionLoading === u.id}
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >❌ رفض</button>
                        </>
                      )}
                      {u.status === 'active' && u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleAction(u.id, 'toggle', 'suspended')}
                          disabled={actionLoading === u.id}
                          style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                        >⏸️ إيقاف</button>
                      )}
                      {u.status === 'suspended' && (
                        <button
                          onClick={() => handleAction(u.id, 'toggle', 'active')}
                          disabled={actionLoading === u.id}
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                        >▶️ تفعيل</button>
                      )}
                      {u.status === 'rejected' && (
                        <button
                          onClick={() => handleAction(u.id, 'approve')}
                          disabled={actionLoading === u.id}
                          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                        >✅ موافقة</button>
                      )}
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={actionLoading === u.id}
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                        >🗑️ حذف</button>
                      )}
                    </div>
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
