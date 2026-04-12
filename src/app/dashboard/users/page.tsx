'use client';
export const dynamic = 'force-dynamic';
import { Users, Crown, School, User, GraduationCap, CheckCircle, XCircle, Pencil, Trash2, Plus, Pause, Play } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, Modal, EmptyState, LoadingState, Badge } from '../_components';

const roleLabels: any = { super_admin: 'مالك المنصة', owner: 'مالك مدارس', admin: 'مدير', teacher: 'معلم', parent: 'ولي أمر', student: 'طالب', user: 'مستخدم' };
const roleColors: any = { super_admin: '#D4A843', owner: '#8B5CF6', admin: '#3B82F6', teacher: '#10B981', parent: '#F59E0B', student: '#EC4899', user: '#6B7280' };
const statusVariant: any = { active: 'green', pending: 'gold', rejected: 'red', suspended: 'purple' };
const statusLabels: any = { active: 'مفعّل', pending: 'قيد المراجعة', rejected: 'مرفوض', suspended: 'موقوف' };
const packageLabels: any = { basic: 'أساسي', advanced: 'متقدم', enterprise: 'مؤسسي' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'student', phone: '' });

  useEffect(() => { fetchUsers(); }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify({ action: 'get_users', role_filter: roleFilter, status_filter: statusFilter }) });
      const data = await res.json();
      setUsers(data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleSaveUser = async () => {
    if (!userForm.name.trim() || !userForm.email.trim()) { setErrMsg('الاسم والبريد الإلكتروني مطلوبان'); return; }
    setSaving(true); setErrMsg('');
    try {
      const body = editItem ? JSON.stringify({ action: 'update_user', user_id: editItem.id, ...userForm }) : JSON.stringify({ action: 'create_user', ...userForm });
      const res = await fetch('/api/auth', { method: editItem ? 'PUT' : 'POST', headers: getHeaders(), credentials: 'include', body });
      const data = await res.json();
      if (res.ok) { setShowModal(false); setEditItem(null); setUserForm({ name: '', email: '', role: 'student', phone: '' }); fetchUsers(); }
      else setErrMsg(data.error || 'فشل الحفظ');
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleAction = async (userId: number, action: string, newStatus?: string) => {
    setActionLoading(userId);
    try {
      await fetch('/api/auth', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify({ action: action === 'toggle' ? 'toggle_status' : action, user_id: userId, new_status: newStatus }) });
      fetchUsers();
    } catch (e) { console.error(e); } finally { setActionLoading(null); }
  };

  const handleDelete = async (userId: number, userName: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${userName}"؟`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: getHeaders(), credentials: 'include', body: JSON.stringify({ action: 'delete_user', user_id: userId }) });
      if (res.ok) fetchUsers(); else { const d = await res.json(); alert(d.error || 'فشل'); }
    } catch { alert('خطأ بالاتصال'); } finally { setActionLoading(null); }
  };

  const filtered = users.filter((u: any) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search));
  const stats = { total: users.length, pending: users.filter((u: any) => u.status === 'pending').length, active: users.filter((u: any) => u.status === 'active').length, owners: users.filter((u: any) => u.role === 'owner').length };

  const timeAgo = (date: string) => {
    if (!date) return ''; const diff = Date.now() - new Date(date).getTime(); const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'الآن'; if (mins < 60) return `منذ ${mins} د`; const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} س`; const days = Math.floor(hours / 24);
    if (days < 7) return `منذ ${days} يوم`; return new Date(date).toLocaleDateString('ar-SA');
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      {stats.pending > 0 && (
        <div className="alert-bar" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.25)' }}>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>{stats.pending} طلب بانتظار الموافقة</span>
          <span style={{ color: 'var(--text-dim)' }}>راجع الطلبات واتخذ إجراء</span>
        </div>
      )}

      <PageHeader title="إدارة المستخدمين" subtitle="إدارة جميع المستخدمين والموافقة على الطلبات" icon={<Users size={20} color="#D4A843" />} />

      <div className="stat-grid">
        <StatCard value={stats.total} label="إجمالي المستخدمين" icon={<Users size={17} color="#3B82F6" />} color="#3B82F6" />
        <StatCard value={stats.pending} label="بانتظار الموافقة" icon={<XCircle size={17} color="#F59E0B" />} color="#F59E0B" />
        <StatCard value={stats.active} label="مستخدمين نشطين" icon={<CheckCircle size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={stats.owners} label="ملاك المدارس" icon={<School size={17} color="#8B5CF6" />} color="#8B5CF6" />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="input-field" style={{ flex: 1, minWidth: 250 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث بالاسم أو الإيميل أو الجوال..." />
        <select className="select-field" style={{ width: 160 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all">كل الأدوار</option>
          <option value="owner">ملاك مدارس</option><option value="admin">مدراء</option><option value="teacher">معلمين</option><option value="parent">أولياء أمور</option><option value="student">طلاب</option>
        </select>
        <select className="select-field" style={{ width: 160 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">كل الحالات</option>
          <option value="pending">قيد المراجعة</option><option value="active">مفعّل</option><option value="rejected">مرفوض</option><option value="suspended">موقوف</option>
        </select>
      </div>

      <div className="dcard">
        {filtered.length === 0 ? (
          <EmptyState icon={<Users size={19} color="#6B7280" />} message="لا يوجد مستخدمين" />
        ) : (
          <div className="table-wrap">
            <table className="dtable">
              <thead><tr>
                <th>المستخدم</th><th style={{ textAlign: 'center' }}>الدور</th><th style={{ textAlign: 'center' }}>الباقة</th><th style={{ textAlign: 'center' }}>الحالة</th><th style={{ textAlign: 'center' }}>التسجيل</th><th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr></thead>
              <tbody>
                {filtered.map((u: any) => (
                  <tr key={u.id} style={{ background: u.status === 'pending' ? 'rgba(245,158,11,0.03)' : undefined }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="stat-icon" style={{ width: 40, height: 40, background: `${roleColors[u.role] || '#6B7280'}1a`, border: 'none' }}>
                          {u.role === 'super_admin' ? <Crown size={16} color={roleColors[u.role]} /> : u.role === 'owner' ? <School size={16} color={roleColors[u.role]} /> : u.role === 'student' ? <GraduationCap size={16} color={roleColors[u.role]} /> : <User size={16} color={roleColors[u.role] || '#6B7280'} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.email}</div>
                          {u.phone && <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{u.phone}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: `${roleColors[u.role] || '#6B7280'}1a`, color: roleColors[u.role] || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{roleLabels[u.role] || u.role}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {u.role === 'owner' ? <Badge variant="gold">{packageLabels[u.package] || u.package || '—'}</Badge> : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}><Badge variant={statusVariant[u.status] || 'gold'}>{statusLabels[u.status] || u.status}</Badge></td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>{timeAgo(u.created_at)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {u.status === 'pending' && (<>
                          <button className="btn-sm btn-sm-green" onClick={() => handleAction(u.id, 'approve')} disabled={actionLoading === u.id}><CheckCircle size={11} /> موافقة</button>
                          <button className="btn-sm btn-sm-red" onClick={() => handleAction(u.id, 'reject')} disabled={actionLoading === u.id}><XCircle size={11} /> رفض</button>
                        </>)}
                        {u.status === 'active' && u.role !== 'super_admin' && (
                          <button className="btn-sm" style={{ background: 'rgba(107,114,128,0.08)', color: '#6B7280', border: '1px solid rgba(107,114,128,0.2)' }} onClick={() => handleAction(u.id, 'toggle', 'suspended')} disabled={actionLoading === u.id}>إيقاف</button>
                        )}
                        {u.status === 'suspended' && (
                          <button className="btn-sm btn-sm-green" onClick={() => handleAction(u.id, 'toggle', 'active')} disabled={actionLoading === u.id}><CheckCircle size={11} /> تفعيل</button>
                        )}
                        {u.status === 'rejected' && (
                          <button className="btn-sm btn-sm-green" onClick={() => handleAction(u.id, 'approve')} disabled={actionLoading === u.id}><CheckCircle size={11} /> موافقة</button>
                        )}
                        {u.role !== 'super_admin' && (
                          <button className="btn-sm btn-sm-red" onClick={() => handleDelete(u.id, u.name)} disabled={actionLoading === u.id}><Trash2 size={11} /> حذف</button>
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

      <Modal open={showModal} onClose={() => { setShowModal(false); setErrMsg(''); }} title={editItem ? 'تعديل المستخدم' : 'إضافة مستخدم'} titleIcon={<User size={18} color="#D4A843" />}>
        {errMsg && <div className="error-box">{errMsg}</div>}
        <div className="form-row">
          <div className="form-full"><label className="form-label">الاسم الكامل *</label><input className="input-field" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} placeholder="أدخل الاسم" /></div>
          <div><label className="form-label">البريد الإلكتروني *</label><input className="input-field" type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} placeholder="example@email.com" /></div>
          <div><label className="form-label">رقم الهاتف</label><input className="input-field" type="tel" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} placeholder="05xxxxxxxx" /></div>
          <div className="form-full"><label className="form-label">الدور</label>
            <select className="select-field" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="student">طالب</option><option value="teacher">معلم</option><option value="parent">ولي أمر</option><option value="admin">مدير</option><option value="driver">سائق</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleSaveUser} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المستخدم'}</button>
          <button className="btn-outline" onClick={() => { setShowModal(false); setErrMsg(''); }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
