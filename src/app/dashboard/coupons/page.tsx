'use client';
import { Ban, CheckCircle, ClipboardList, Dice5, Lock, Pencil, Plus, Save, Search, Tag, Trash2, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

export default function CouponsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/coupons', { headers: getHeaders() });
      const result = await res.json();
      setData(result || []);
    } catch (error) { console.error('Error:', error); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.code) return alert('كود الخصم مطلوب');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch('/api/coupons', { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) { fetchData(); setShowModal(false); setEditItem(null); setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' }); }
      else { const err = await res.json(); alert(err.error || 'حدث خطأ'); }
    } catch (error) { console.error('Error:', error); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await fetch(`/api/coupons?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchData(); } catch (error) { console.error('Error:', error); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setForm({ code: item.code || '', description: item.description || '', discount_type: item.discount_type || 'percentage', discount_value: item.discount_value?.toString() || '', max_uses: item.max_uses?.toString() || '100', used_count: item.used_count?.toString() || '0', start_date: item.start_date ? item.start_date.split('T')[0] : '', end_date: item.end_date ? item.end_date.split('T')[0] : '', status: item.status || 'active' });
    setShowModal(true);
  };

  const isExpired = (date: string) => { if (!date) return false; return new Date(date) < new Date(); };
  const isFullyUsed = (item: any) => parseInt(item.used_count) >= parseInt(item.max_uses);

  const filtered = data.filter((item: any) => item.code?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: data.length,
    active: data.filter((d: any) => d.status === 'active' && !isExpired(d.end_date) && !isFullyUsed(d)).length,
    expired: data.filter((d: any) => isExpired(d.end_date)).length,
    fullyUsed: data.filter((d: any) => isFullyUsed(d)).length,
  };

  const discountTypeLabels: any = { percentage: 'نسبة مئوية', fixed: 'مبلغ ثابت' };
  const statusLabels: any = { active: 'نشط', inactive: 'غير نشط', expired: 'منتهي' };
  const statusColors: any = { active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981' }, inactive: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280' }, expired: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' } };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'MATIN-';
    for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm({ ...form, code });
  };

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Tag️ كوبونات الخصم</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة أكواد الخصم والعروض الترويجية</p>
        </div>
        <button onClick={() => { setEditItem(null); setForm({ code: '', description: '', discount_type: 'percentage', discount_value: '', max_uses: '100', used_count: '0', start_date: '', end_date: '', status: 'active' }); setShowModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>
          Plus إنشاء كوبون
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الكوبونات', value: stats.total, icon: 'Tag️', color: '#C9A227' },
          { label: 'نشط', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
          { label: 'منتهي', value: stats.expired, icon: "ICON_Ban", color: '#EF4444' },
          { label: 'مستنفد', value: stats.fullyUsed, icon: "ICON_Lock", color: '#6B7280' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></div>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, marginTop: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input placeholder="Search بحث بالكود أو الوصف..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>Tag️</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد كوبونات خصم</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>اضغط "إنشاء كوبون" لإضافة كوبون جديد</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['الكود', 'الوصف', 'نوع الخصم', 'القيمة', 'الاستخدام', 'البداية', 'النهاية', 'الحالة', 'إجراءات'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', textAlign: 'right', color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isExpired(item.end_date) ? 'rgba(107,114,128,0.03)' : isFullyUsed(item) ? 'rgba(107,114,128,0.03)' : 'transparent' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(201,162,39,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>[Tag]️</div>
                      <span style={{ color: '#C9A227', fontWeight: 800, fontSize: 15, fontFamily: 'monospace', letterSpacing: 1, direction: 'ltr' as any }}>{item.code}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{item.description ? item.description.substring(0, 30) + (item.description.length > 30 ? '...' : '') : '—'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{discountTypeLabels[item.discount_type] || item.discount_type}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>
                      {item.discount_type === 'percentage' ? `${item.discount_value}%` : `${parseFloat(item.discount_value).toLocaleString('ar-SA')} ر.س`}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden', maxWidth: 80 }}>
                        <div style={{ width: `${Math.min((parseInt(item.used_count) / parseInt(item.max_uses)) * 100, 100)}%`, height: '100%', background: isFullyUsed(item) ? '#EF4444' : '#10B981', borderRadius: 3 }} />
                      </div>
                      <span style={{ color: isFullyUsed(item) ? '#EF4444' : 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}>{item.used_count}/{item.max_uses}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{item.start_date ? new Date(item.start_date).toLocaleDateString('ar-SA') : '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ color: isExpired(item.end_date) ? '#EF4444' : 'rgba(255,255,255,0.6)', fontWeight: isExpired(item.end_date) ? 700 : 400, fontSize: 13 }}>
                      {item.end_date ? new Date(item.end_date).toLocaleDateString('ar-SA') : '—'}
                      {isExpired(item.end_date) && ' Ban'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: isExpired(item.end_date) || isFullyUsed(item) ? 'rgba(107,114,128,0.1)' : statusColors[item.status]?.bg || 'rgba(107,114,128,0.1)', color: isExpired(item.end_date) || isFullyUsed(item) ? '#6B7280' : statusColors[item.status]?.color || '#6B7280', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                      {isExpired(item.end_date) ? 'منتهي' : isFullyUsed(item) ? 'مستنفد Lock' : statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { navigator.clipboard.writeText(item.code); alert('تم نسخ الكود!'); }} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>ClipboardList نسخ</button>
                      <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Pencil️</button>
                      <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Trash2️</button>
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
              <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: 0 }}>{editItem ? 'Pencil️ تعديل كوبون' : 'Plus إنشاء كوبون جديد'}</h2>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>كود الخصم *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: 2, fontSize: 16 }} placeholder="MATIN-XXXXX" />
                  <button onClick={generateCode} style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: 'none', borderRadius: 8, padding: '12px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Dice5 توليد</button>
                </div>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>نوع الخصم</label>
                <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })} style={inputStyle}>
                  <option value="percentage">نسبة مئوية (%)</option>
                  <option value="fixed">مبلغ ثابت (ر.س)</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>قيمة الخصم {form.discount_type === 'percentage' ? '(%)' : '(ر.س)'}</label>
                <input type="number" step="0.01" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} style={inputStyle} placeholder={form.discount_type === 'percentage' ? 'مثال: 15' : 'مثال: 500'} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحد الأقصى للاستخدام</label>
                <input type="number" value={form.max_uses} onChange={e => setForm({ ...form, max_uses: e.target.value })} style={inputStyle} placeholder="100" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>عدد مرات الاستخدام</label>
                <input type="number" value={form.used_count} onChange={e => setForm({ ...form, used_count: e.target.value })} style={inputStyle} placeholder="0" />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ البداية</label>
                <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>تاريخ النهاية</label>
                <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الوصف</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="وصف الكوبون والعرض..." />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="expired">منتهي</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 600 }}>إلغاء</button>
              <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>{editItem ? 'Save تحديث' : 'Plus إنشاء'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
