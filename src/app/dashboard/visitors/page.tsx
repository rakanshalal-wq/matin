'use client';
import { Calendar, Globe, Pencil, Plus, Save, School, Search, Trash2, Users, X } from "lucide-react";
const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [guestUsers, setGuestUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'school' | 'guests'>('school');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', national_id: '', purpose: '', school_id: '', notes: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [v, g] = await Promise.all([
        fetch('/api/visitors', { headers: getHeaders() }).then(r => r.json()),
        fetch('/api/guests', { headers: getHeaders() }).then(r => r.json()),
      ]);
      setVisitors(Array.isArray(v) ? v : []);
      setGuestUsers(Array.isArray(g) ? g : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.name) { setErrMsg('أدخل اسم الزائر'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/visitors?id=${editItem.id}` : '/api/visitors';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowAddModal(false); setEditItem(null); setFormData({ name: '', phone: '', national_id: '', purpose: '', school_id: '', notes: '' }); setErrMsg(''); fetchAll();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };
  const handleEdit = (item: any) => {
    setEditItem(item);
    setFormData({ ...{ name: '', phone: '', national_id: '', purpose: '', school_id: '', notes: '' }, ...item });
    setErrMsg('');
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/visitors?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchAll(); } catch (e) { console.error(e); }
  };

  const filteredVisitors = visitors.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm));
  const filteredGuests = guestUsers.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm));

  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

  return (
    <div style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Users الزوار</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة زوار المدرسة والموقع</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormData({ name: '', phone: '', national_id: '', purpose: '', school_id: '', notes: '' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Plus إضافة زائر</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'زوار المدرسة', value: visitors.length, icon: "ICON_School", color: '#C9A227' },
          { label: 'زوار الموقع', value: guestUsers.length, icon: "ICON_Globe", color: '#3B82F6' },
          { label: 'اليوم', value: [...visitors, ...guestUsers].filter(v => new Date(v.created_at).toDateString() === new Date().toDateString()).length, icon: "ICON_Calendar", color: '#22C55E' },
          { label: 'الإجمالي', value: visitors.length + guestUsers.length, icon: "ICON_Users", color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: '8px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ key: 'school', label: 'School زوار المدرسة', count: visitors.length }, { key: 'guests', label: 'Globe زوار الموقع', count: guestUsers.length }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ background: activeTab === tab.key ? 'linear-gradient(135deg, #C9A227, #D4B03D)' : 'rgba(255,255,255,0.05)', color: activeTab === tab.key ? '#06060E' : 'rgba(255,255,255,0.7)', border: 'none', borderRadius: 20, padding: '8px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search بحث..." style={{ ...inputStyle, marginBottom: 20, maxWidth: 400 }} />

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: 60 }}>جاري التحميل...</div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                {['الاسم', 'الجوال', activeTab === 'school' ? 'الهوية' : 'الإيميل', activeTab === 'school' ? 'الغرض' : 'الجنسية', 'التاريخ', activeTab === 'school' ? 'إجراء' : ''].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, textAlign: 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'school' ? filteredVisitors : filteredGuests).map((item, i) => (
                <tr key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '14px 16px', color: 'white', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{item.phone || '-'}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{activeTab === 'school' ? (item.national_id || '-') : (item.email || '-')}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)' }}>{activeTab === 'school' ? (item.purpose || '-') : (item.nationality || '-')}</td>
                  <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{new Date(item.created_at).toLocaleDateString('ar-SA')}</td>
                  {activeTab === 'school' && (
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Pencil️ تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>Trash2️ حذف</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {(activeTab === 'school' ? filteredVisitors : filteredGuests).length === 0 && (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>لا يوجد زوار</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal إضافة زائر */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#1B263B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontWeight: 800, margin: 0 }}>{editItem ? 'تعديل' : 'Plus إضافة زائر'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 24, cursor: 'pointer' }}>X</button>
            </div>
            {[{ key: 'name', label: 'الاسم *', ph: 'اسم الزائر' }, { key: 'phone', label: 'الجوال', ph: '05xxxxxxxx' }, { key: 'national_id', label: 'رقم الهوية', ph: '1xxxxxxxxx' }, { key: 'purpose', label: 'الغرض', ph: 'سبب الزيارة' }, { key: 'notes', label: 'ملاحظات', ph: 'أي ملاحظات إضافية' }].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input value={(formData as any)[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.ph} style={inputStyle} />
              </div>
            ))}
            <button onClick={handleSave} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg, #C9A227, #D4B03D)', color: '#06060E', border: 'none', borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', marginTop: 8 }}>
              {saving ? '⏳ جاري الحفظ...' : editItem ? 'Save حفظ التعديلات' : 'Save حفظ'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
