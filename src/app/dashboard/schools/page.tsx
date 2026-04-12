'use client';
export const dynamic = 'force-dynamic';
import { School, Plus, Pencil, Trash2, CheckCircle, MapPin, Mail, Phone, User, Ban } from "lucide-react";
import { useState, useEffect } from 'react';
import { getHeaders } from '@/lib/api';
import { PageHeader, StatCard, SearchBar, Modal, EmptyState, LoadingState, Badge } from '../_components';

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editSchool, setEditSchool] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' });
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');
  const [search, setSearch] = useState('');

  useEffect(() => { const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); setUser(u); fetchSchools(); }, []);

  const fetchSchools = async () => {
    setLoading(true);
    try { const res = await fetch('/api/schools', { headers: getHeaders() }); const data = await res.json(); setSchools(Array.isArray(data) ? data : []); }
    catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!form.name_ar) { setErrMsg('أدخل اسم المؤسسة'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editSchool ? 'PUT' : 'POST';
      const url = editSchool ? `/api/schools?id=${editSchool.id}` : '/api/schools';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowModal(false); setEditSchool(null); setForm({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' }); fetchSchools();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };

  const handleEdit = (school: any) => {
    setEditSchool(school);
    setForm({ name_ar: school.name_ar || school.name || '', email: school.email || '', phone: school.phone || '', city: school.city || '', address: school.address || '', status: school.status || 'TRIAL' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المؤسسة؟')) return;
    try { await fetch(`/api/schools?id=${id}`, { method: 'DELETE', headers: getHeaders() }); setSchools(schools.filter(s => s.id !== id)); setMsg('تم حذف المؤسسة'); setMsgType('success'); }
    catch { setMsg('فشل الحذف'); setMsgType('error'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch('/api/schools', { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ id, status: 'ACTIVE' }) });
      if (res.ok) { setSchools(schools.map(s => s.id === id ? { ...s, status: 'ACTIVE' } : s)); setMsg('تم تفعيل المؤسسة'); setMsgType('success'); }
    } catch { setMsg('فشل التفعيل'); setMsgType('error'); }
    setTimeout(() => setMsg(''), 3000);
  };

  const canAdd = user?.role === 'owner' || user?.role === 'super_admin';
  const filtered = schools.filter(s => (s.name_ar || s.name || '').toLowerCase().includes(search.toLowerCase()) || (s.city || '').toLowerCase().includes(search.toLowerCase()) || (s.email || '').toLowerCase().includes(search.toLowerCase()));

  const statusVariant: any = { ACTIVE: 'green', SUSPENDED: 'red', TRIAL: 'gold' };
  const statusLabel: any = { ACTIVE: 'نشطة', SUSPENDED: 'موقوفة', TRIAL: 'تجريبية' };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader
        title="المؤسسات التعليمية"
        subtitle={`${schools.length} مؤسسة مسجلة | ${schools.filter(s => s.status === 'ACTIVE').length} نشطة`}
        icon={<School size={20} color="#D4A843" />}
        actions={canAdd ? <button className="btn-gold" onClick={() => { setEditSchool(null); setForm({ name_ar: '', email: '', phone: '', city: '', address: '', status: 'TRIAL' }); setShowModal(true); }}><Plus size={15} /> إضافة مؤسسة</button> : undefined}
      />

      {msg && <div className={msgType === 'success' ? 'alert-bar' : 'error-box'} style={{ marginBottom: 20 }}>{msg}</div>}

      <div className="stat-grid">
        <StatCard value={schools.length} label="الكل" icon={<School size={17} color="#D4A843" />} color="#D4A843" />
        <StatCard value={schools.filter(s => s.status === 'ACTIVE').length} label="نشطة" icon={<CheckCircle size={17} color="#10B981" />} color="#10B981" />
        <StatCard value={schools.filter(s => s.status === 'TRIAL').length} label="تجريبية" icon={<School size={17} color="#F59E0B" />} color="#F59E0B" />
        <StatCard value={schools.filter(s => s.status === 'SUSPENDED').length} label="موقوفة" icon={<Ban size={17} color="#EF4444" />} color="#EF4444" />
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="بحث بالاسم أو المدينة أو البريد..." />

      {filtered.length === 0 ? (
        <div className="dcard"><EmptyState icon={<School size={19} color="#3B82F6" />} message={search ? 'لا توجد نتائج' : 'لا توجد مؤسسات بعد'} action={!search && canAdd ? <button className="btn-gold" onClick={() => setShowModal(true)}><Plus size={15} /> إضافة أول مؤسسة</button> : undefined} /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((school: any) => (
            <div key={school.id} className="dcard" style={{ marginBottom: 0 }}>
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text)', fontSize: 16, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{school.name_ar || school.name}</div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{school.code}</span>
                  </div>
                  <Badge variant={statusVariant[school.status] || 'gold'}>{statusLabel[school.status] || school.status}</Badge>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                  {school.city && <span style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> {school.city}</span>}
                  {school.phone && <span style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} /> {school.phone}</span>}
                  {school.email && <span style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><Mail size={13} /> {school.email}</span>}
                  {school.owner_name && <span style={{ color: 'var(--text-dim)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><User size={13} /> {school.owner_name}</span>}
                </div>
                {canAdd && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn-sm btn-sm-blue" onClick={() => handleEdit(school)}><Pencil size={11} /> تعديل</button>
                    {school.status !== 'ACTIVE' && user?.role === 'super_admin' && (
                      <button className="btn-sm btn-sm-green" onClick={() => handleApprove(school.id)}><CheckCircle size={11} /> تفعيل</button>
                    )}
                    <button className="btn-sm btn-sm-red" onClick={() => handleDelete(school.id)}><Trash2 size={11} /> حذف</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => { setShowModal(false); setErrMsg(''); }} title={editSchool ? 'تعديل المؤسسة' : 'إضافة مؤسسة جديدة'} titleIcon={<School size={18} color="#D4A843" />} large>
        {errMsg && <div className="error-box">{errMsg}</div>}
        <div className="form-row">
          <div className="form-full"><label className="form-label">اسم المؤسسة *</label><input className="input-field" placeholder="مثال: مدارس النور الأهلية" value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} /></div>
          <div><label className="form-label">البريد الإلكتروني</label><input className="input-field" type="email" placeholder="info@school.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div><label className="form-label">رقم الجوال</label><input className="input-field" placeholder="05xxxxxxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div><label className="form-label">المدينة</label><input className="input-field" placeholder="الرياض" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
          <div><label className="form-label">العنوان</label><input className="input-field" placeholder="حي النرجس، شارع الملك فهد" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          {editSchool && user?.role === 'super_admin' && (
            <div className="form-full"><label className="form-label">الحالة</label>
              <select className="select-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="TRIAL">تجريبية</option><option value="ACTIVE">نشطة</option><option value="SUSPENDED">موقوفة</option>
              </select>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-gold" onClick={handleSave} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>{saving ? 'جاري الحفظ...' : editSchool ? 'تحديث المؤسسة' : 'حفظ المؤسسة'}</button>
          <button className="btn-outline" onClick={() => { setShowModal(false); setErrMsg(''); }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
