'use client';
import { AlertTriangle, Ban, CheckCircle, Pencil, Plus, Save, Search, Shield, Siren, Trash2, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function InsurancePage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ person_name: '', provider: '', policy_number: '', type: 'student', start_date: '', end_date: '', coverage: '', status: 'active' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/insurance', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.person_name) return alert('اسم المؤمن له مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/insurance', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ person_name: '', provider: '', policy_number: '', type: 'student', start_date: '', end_date: '', coverage: '', status: 'active' }); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/insurance?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ person_name: item.person_name || '', provider: item.provider || '', policy_number: item.policy_number || '', type: item.type || 'student', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', coverage: item.coverage || '', status: item.status || 'active' });
    setShowModal(true);
  };

  const isExpired = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };
  const isExpiringSoon = (date: string) => { if (!date) return false; const diff = new Date(date).getTime() - new Date().getTime(); return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000; };

  const filtered = data.filter((item: any) => item.person_name?.toLowerCase().includes(search.toLowerCase()) || item.provider?.toLowerCase().includes(search.toLowerCase()) || item.policy_number?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    active: data.filter((d: any) => d.status === 'active' && !isExpired(d.end_date)).length,
    expiring: data.filter((d: any) => isExpiringSoon(d.end_date)).length,
    expired: data.filter((d: any) => isExpired(d.end_date)).length,
  };

  const typeLabels: any = { student: 'طالب', teacher: 'معلم', employee: 'موظف', family: 'عائلي' };
  const statusLabels: any = { active: 'نشط', inactive: 'غير نشط', suspended: 'معلق' };
  const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, inactive: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, suspended: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' } };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Alert Boxes */}
      {stats.expired > 0 && (
        <div style={{ background: 'rgba(185,28,28,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>Siren</span>
          <div>
            <div style={{ color: '#EF4444', fontWeight: 700, fontSize: 15 }}>تنبيه! يوجد {stats.expired} تأمين منتهي الصلاحية</div>
            <div style={{ color: 'rgba(239,68,68,0.8)', fontSize: 13, marginTop: 2 }}>يرجى تجديد وثائق التأمين المنتهية</div>
          </div>
        </div>
      )}
      {stats.expiring > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>AlertTriangle️</span>
          <div>
            <div style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15 }}>{stats.expiring} تأمين ينتهي خلال 30 يوم</div>
            <div style={{ color: 'rgba(245,158,11,0.8)', fontSize: 13, marginTop: 2 }}>يرجى التجديد قبل انتهاء الصلاحية</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Shield️ التأمين الصحي</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة وثائق التأمين الصحي للطلاب والموظفين</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ person_name: '', provider: '', policy_number: '', type: 'student', start_date: '', end_date: '', coverage: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Plus إضافة تأمين
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الوثائق', value: stats.total, icon: 'Shield️', color: '#C9A227' },
          { label: 'سارية', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
          { label: 'تنتهي قريباً', value: stats.expiring, icon: 'AlertTriangle️', color: '#F59E0B' },
          { label: 'منتهية', value: stats.expired, icon: "ICON_Siren", color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 28 }}>{stat.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Search بحث بالاسم أو شركة التأمين أو رقم الوثيقة..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>Shield️</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد وثائق تأمين</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إضافة تأمين" لإنشاء وثيقة جديدة</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['المؤمن له', 'شركة التأمين', 'رقم الوثيقة', 'النوع', 'تاريخ البداية', 'تاريخ الانتهاء', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isExpired(item.end_date) ? 'rgba(185,28,28,0.05)' : isExpiringSoon(item.end_date) ? 'rgba(245,158,11,0.03)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>Shield️</div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{item.person_name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{item.coverage ? item.coverage.substring(0, 30) + (item.coverage.length > 30 ? '...' : '') : '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#C9A227', fontWeight: 600, fontSize: 14 }}>{item.provider || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' as any }}>{item.policy_number || '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{typeLabels[item.type] || item.type}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.start_date ? new Date(item.start_date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: isExpired(item.end_date) ? '#EF4444' : isExpiringSoon(item.end_date) ? '#F59E0B' : 'rgba(255,255,255,0.6)', fontWeight: isExpired(item.end_date) || isExpiringSoon(item.end_date) ? 700 : 400, fontSize: 13 }}>
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-SA') : '—'}
                      {isExpired(item.end_date) && ' Ban'}
                      {isExpiringSoon(item.end_date) && ' AlertTriangle️'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: isExpired(item.end_date) ? 'rgba(239,68,68,0.1)' : statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: isExpired(item.end_date) ? '#EF4444' : statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {isExpired(item.end_date) ? 'منتهي' : statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Pencil️ تعديل</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Trash2️ حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil️ تعديل تأمين' : 'Plus إضافة تأمين جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>اسم المؤمن له *</label>
                <input value={form.person_name} onChange={e => setForm({ ...form, person_name: e.target.value })} style={inputStyle} placeholder="اسم الطالب أو الموظف" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>شركة التأمين</label>
                <input value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} style={inputStyle} placeholder="مثال: بوبا، التعاونية" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الوثيقة</label>
                <input value={form.policy_number} onChange={e => setForm({ ...form, policy_number: e.target.value })} style={inputStyle} placeholder="رقم وثيقة التأمين" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>النوع</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="student">طالب</option>
                  <option value="teacher">معلم</option>
                  <option value="employee">موظف</option>
                  <option value="family">عائلي</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">معلق</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ البداية</label>
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ الانتهاء</label>
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>التغطية التأمينية</label>
                <textarea value={form.coverage} onChange={e => setForm({ ...form, coverage: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="تفاصيل التغطية التأمينية..." />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إضافة'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
