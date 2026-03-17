'use client';
import { CheckCircle, Eye, Pencil, Plus, Save, Search, Target, Trash2, Trophy, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import IconRenderer from "@/components/IconRenderer";

export default function LeadsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '' });

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => { try { const res = await fetch('/api/leads', { headers: getHeaders() }); const data = await res.json(); setItems(Array.isArray(data) ? data : []); } catch (e) { console.error(e); } finally { setLoading(false); } };

  const handleSave = async () => {
    if (!formData.name) { setErrMsg('أدخل اسم العميل'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/leads?id=${editItem.id}` : '/api/leads';
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) { setErrMsg(data.error || 'فشل الحفظ'); return; }
      setShowAddModal(false); setEditItem(null); setFormData({ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '' }); setErrMsg(''); fetchItems();
    } catch (e: any) { setErrMsg(e.message || 'حدث خطأ'); } finally { setSaving(false); }
  };
  const handleEdit = (item: any) => {
    setEditItem(item);
    setFormData({ ...{ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '' }, ...item });
    setErrMsg('');
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try { await fetch(`/api/leads?id=${id}`, { method: 'DELETE', headers: getHeaders() }); fetchItems(); } catch (e) { console.error(e); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return { text: 'جديد', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' };
      case 'contacted': return { text: 'تم التواصل', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
      case 'interested': return { text: 'مهتم', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      case 'converted': return { text: 'تم التحويل', color: '#C9A227', bg: 'rgba(201,162,39,0.1)' };
      case 'lost': return { text: 'خسارة', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
      default: return { text: status, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  const filteredItems = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.company?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm));
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>Target العملاء المحتملين</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>متابعة العملاء المحتملين وتحويلهم لمشتركين</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormData({ name: '', email: '', phone: '', company: '', source: '', status: 'new', notes: '' }); setErrMsg(''); setShowAddModal(true); }} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Plus إضافة عميل</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي العملاء', value: items.length, icon: "ICON_Target", color: '#C9A227' },
          { label: 'جديد', value: items.filter(i => i.status === 'new').length, icon: '🆕', color: '#3B82F6' },
          { label: 'مهتم', value: items.filter(i => i.status === 'interested').length, icon: "ICON_CheckCircle", color: '#10B981' },
          { label: 'تم التحويل', value: items.filter(i => i.status === 'converted').length, icon: "ICON_Trophy", color: '#C9A227' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}><IconRenderer name={stat.icon} /></span>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <input type="text" placeholder="Search بحث بالاسم، الشركة، أو الجوال..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, maxWidth: 400 }} />
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>⏳ جاري التحميل...</p></div>
        ) : filteredItems.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>Target</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا يوجد عملاء محتملين</p>
            <button onClick={() => setShowAddModal(true)} style={{ marginTop: 16, background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 24px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Plus إضافة أول عميل</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227', fontWeight: 700 }}>العميل</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الشركة/المدرسة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الجوال</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>المصدر</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227', fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const badge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, background: 'rgba(201,162,39,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>Target</div>
                        <div>
                          <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{item.name}</p>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{item.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.company || '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13, direction: 'ltr' }}>{item.phone || '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{item.source || '—'}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Eye️ عرض</button>
                        <button onClick={() => handleEdit(item)} style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Pencil️ تعديل</button>
                        <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>Trash2️ حذف</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#06060E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, width: '90%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'Target إضافة عميل محتمل'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 18 }}>X</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الاسم *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="اسم العميل" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>البريد الإلكتروني</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>رقم الجوال</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="05XXXXXXXX" style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الشركة/المدرسة</label><input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>المصدر</label><select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="" style={{ background: '#06060E' }}>اختر المصدر</option><option value="website" style={{ background: '#06060E' }}>الموقع</option><option value="referral" style={{ background: '#06060E' }}>توصية</option><option value="social" style={{ background: '#06060E' }}>سوشيال ميديا</option><option value="ads" style={{ background: '#06060E' }}>إعلانات</option><option value="other" style={{ background: '#06060E' }}>أخرى</option></select></div>
              <div><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>الحالة</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, appearance: 'auto' } as any}><option value="new" style={{ background: '#06060E' }}>جديد</option><option value="contacted" style={{ background: '#06060E' }}>تم التواصل</option><option value="interested" style={{ background: '#06060E' }}>مهتم</option><option value="converted" style={{ background: '#06060E' }}>تم التحويل</option><option value="lost" style={{ background: '#06060E' }}>خسارة</option></select></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 6, display: 'block' }}>ملاحظات</label><textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="ملاحظات إضافية" rows={3} style={{ ...inputStyle, resize: 'vertical' } as any} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-start' }}>
              <button onClick={handleSave} disabled={saving} style={{ background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#06060E', padding: '12px 32px', borderRadius: 10, border: 'none', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? '⏳ جاري الحفظ...' : 'Save حفظ العميل'}</button>
              <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: 10, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
