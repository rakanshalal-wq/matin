'use client';
export const dynamic = 'force-dynamic';
import { CheckCircle, Crown, GraduationCap, Pencil, School, Search, Trash2, User, Users, Wrench, XCircle } from "lucide-react";
import { toast } from '@/lib/toast';
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";
import { getHeaders } from '@/lib/api';

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

 const handleSaveUser = async () => {
 if (!userForm.name.trim() || !userForm.email.trim()) { setErrMsg('الاسم والبريد الإلكتروني مطلوبان'); return; }
 setSaving(true); setErrMsg('');
 try {
 const method = editItem ? 'PUT' : 'POST';
 const body = editItem
 ? JSON.stringify({ action: 'update_user', user_id: editItem.id, ...userForm })
 : JSON.stringify({ action: 'create_user', ...userForm });
 const res = await fetch('/api/auth', { method, headers: getHeaders(), credentials: 'include', body });
 const data = await res.json();
 if (res.ok) { setShowModal(false); setEditItem(null); setUserForm({ name: '', email: '', role: 'student', phone: '' }); fetchUsers(); }
 else setErrMsg(data.error || 'فشل الحفظ');
 } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
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
 else { toast(data.error || 'فشل الحذف', "error"); }
 } catch { toast('خطأ بالاتصال', "error"); } finally { setActionLoading(null); }
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
 <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}><Users size={18} color="#6B7280" /> إدارة المستخدمين</h1>
 <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة جميع المستخدمين والموافقة على الطلبات</p>
 </div>
 </div>

 {/* الإحصائيات */}
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
 {[
 { label: 'إجمالي المستخدمين', value: stats.total, icon: "ICON_Users", color: '#3B82F6' },
 { label: 'بانتظار الموافقة', value: stats.pending, icon: '⏳', color: '#F59E0B' },
 { label: 'مستخدمين نشطين', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
 { label: 'ملاك المدارس', value: stats.owners, icon: "ICON_School", color: '#8B5CF6' },
 ].map((s, i) => (
 <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div>
 <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 6 }}>{s.label}</div>
 <div style={{ color: 'white', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
 </div>
 <div style={{ width: 48, height: 48, borderRadius: 12, background: `rgba(${s.color === '#3B82F6' ? '59,130,246' : s.color === '#F59E0B' ? '245,158,11' : s.color === '#10B981' ? '16,185,129' : '139,92,246'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}><IconRenderer name={s.icon} /></div>
 </div>
 </div>
 ))}
 </div>

 {/* الفلاتر */}
 <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
 <input
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="بحث بالاسم أو الإيميل أو الجوال..."
 style={{ flex: 1, minWidth: 250, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }}
 />
 <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
 <option value="all" style={{background:'#06060E'}}>كل الأدوار</option>
 <option value="owner" style={{background:'#06060E'}}>ملاك مدارس</option>
 <option value="admin" style={{background:'#06060E'}}>مدراء</option>
 <option value="teacher" style={{background:'#06060E'}}>معلمين</option>
 <option value="parent" style={{background:'#06060E'}}>أولياء أمور</option>
 <option value="student" style={{background:'#06060E'}}>طلاب</option>
 </select>
 <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', cursor: 'pointer' }}>
 <option value="all" style={{background:'#06060E'}}>كل الحالات</option>
 <option value="pending" style={{background:'#06060E'}}>قيد المراجعة</option>
 <option value="active" style={{background:'#06060E'}}>مفعّل</option>
 <option value="rejected" style={{background:'#06060E'}}>مرفوض</option>
 <option value="suspended" style={{background:'#06060E'}}>موقوف</option>
 </select>
 </div>

 {/* الجدول */}
 {loading ? (
 <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>⏳ جاري التحميل...</div>
 ) : filtered.length === 0 ? (
 <div style={{ textAlign: 'center', padding: 60 }}>
 <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(107,114,128,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Users size={36} color="#9CA3AF" /></div>
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
 {u.role === 'super_admin' ? "ICON_Crown" : u.role === 'owner' ? "ICON_School" : u.role === 'admin' ? "ICON_Wrench" : u.role === 'teacher' ? '<User size={16} />School' : u.role === 'parent' ? '<User size={16} /><User size={18} color="#6B7280" />' : u.role === 'student' ? "ICON_GraduationCap" : "ICON_User"}
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
 ><IconRenderer name="ICON_CheckCircle" size={18} /> موافقة</button>
 <button
 onClick={() => handleAction(u.id, 'reject')}
 disabled={actionLoading === u.id}
 style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
 ><IconRenderer name="ICON_X" size={18} /><IconRenderer name="ICON_Circle" size={18} /> رفض</button>
 </>
 )}
 {u.status === 'active' && u.role !== 'super_admin' && (
 <button
 onClick={() => handleAction(u.id, 'toggle', 'suspended')}
 disabled={actionLoading === u.id}
 style={{ background: 'rgba(107,114,128,0.1)', color: '#6B7280', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
 >⏸ إيقاف</button>
 )}
 {u.status === 'suspended' && (
 <button
 onClick={() => handleAction(u.id, 'toggle', 'active')}
 disabled={actionLoading === u.id}
 style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
 ><IconRenderer name="ICON_Check" size={18} /> تفعيل</button>
 )}
 {u.status === 'rejected' && (
 <button
 onClick={() => handleAction(u.id, 'approve')}
 disabled={actionLoading === u.id}
 style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
 ><IconRenderer name="ICON_CheckCircle" size={18} /> موافقة</button>
 )}
 {u.role !== 'super_admin' && (
 <button
 onClick={() => handleDelete(u.id, u.name)}
 disabled={actionLoading === u.id}
 style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
 ><IconRenderer name="ICON_Trash2" size={18} /> حذف</button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {showModal && (
 <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
 <div style={{ background: '#0F0F1A', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 460, direction: 'rtl' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
 <h2 style={{ color: '#C9A227', fontSize: 18, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil<IconRenderer name="ICON_Pencil" size={18} /> تعديل المستخدم' : '+ إضافة مستخدم'}</h2>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer' }}>×</button>
 </div>
 {errMsg && <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 13 }}>{errMsg}</div>}
 {[
 { label: 'الاسم الكامل *', key: 'name', type: 'text', placeholder: 'أدخل الاسم' },
 { label: 'البريد الإلكتروني *', key: 'email', type: 'email', placeholder: 'example@email.com' },
 { label: 'رقم الهاتف', key: 'phone', type: 'tel', placeholder: '05xxxxxxxx' },
 ].map(({ label, key, type, placeholder }) => (
 <div key={key} style={{ marginBottom: 14 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{label}</label>
 <input type={type} value={(userForm as any)[key]} onChange={e => setUserForm({ ...userForm, [key]: e.target.value })} placeholder={placeholder} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' as const }} />
 </div>
 ))}
 <div style={{ marginBottom: 20 }}>
 <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>الدور</label>
 <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }}>
 <option value="student">طالب</option>
 <option value="teacher">معلم</option>
 <option value="parent">ولي أمر</option>
 <option value="admin">مدير</option>
 <option value="driver">سائق</option>
 </select>
 </div>
 <div style={{ display: 'flex', gap: 10 }}>
 <button onClick={handleSaveUser} disabled={saving} style={{ flex: 1, background: saving ? 'rgba(201,162,39,0.5)' : 'linear-gradient(135deg,#C9A227,#E8C547)', border: 'none', borderRadius: 10, padding: '12px 0', color: '#06060E', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14 }}>{saving ? 'جاري الحفظ...' : editItem ? 'حفظ التعديلات' : 'إضافة المستخدم'}</button>
 <button onClick={() => { setShowModal(false); setErrMsg(''); }} style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 }}>إلغاء</button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
