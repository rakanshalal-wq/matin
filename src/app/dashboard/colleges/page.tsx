'use client';
import { BookOpen, CheckCircle, Eye, GraduationCap, Pencil, Plus, Search, User, X } from "lucide-react";
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface College {
  id: number;
  school_id: number;
  school_name: string;
  name: string;
  name_en: string;
  type: string;
  dean_name: string;
  email: string;
  phone: string;
  departments_count: number;
  students_count: number;
  teachers_count: number;
  is_active: boolean;
  created_at: string;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    school_id: '',
    name: '',
    name_en: '',
    type: 'college',
    dean_name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    fetchColleges();
    fetchSchools();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await fetch('/api/colleges', { headers: getHeaders() });
      const data = await res.json();
      setColleges(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await fetch('/api/schools', { headers: getHeaders() });
      const data = await res.json();
      setSchools(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setErrMsg('اسم الكلية مطلوب'); return; }
    setSaving(true); setErrMsg('');
    try {
      const method = editItem ? 'PUT' : 'POST';
      const url = editItem ? `/api/colleges?id=${editItem.id}` : '/api/colleges';
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowAddModal(false); setEditItem(null);
        setFormData({ school_id: '', name: '', name_en: '', type: 'college', dean_name: '', email: '', phone: '', description: '' });
        fetchColleges();
      } else {
        setErrMsg(data.error || 'فشل الحفظ');
      }
    } catch (error: any) {
      setErrMsg(error.message || 'حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const filteredColleges = colleges.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.school_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: colleges.length,
    active: colleges.filter(c => c.is_active).length,
    departments: colleges.reduce((sum, c) => sum + (c.departments_count || 0), 0),
    students: colleges.reduce((sum, c) => sum + (c.students_count || 0), 0),
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '12px 16px',
    color: 'white',
    fontSize: 14,
    outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>GraduationCap الكليات والأقسام</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة الكليات والأقسام العلمية داخل الجامعات والمعاهد</p>
        </div>
        <button onClick={() => { setEditItem(null); setFormData({
    school_id: '',
    name: '',
    name_en: '',
    type: 'college',
    dean_name: '',
    email: '',
    phone: '',
    description: '',
  }); setErrMsg(''); setShowAddModal(true); }} style={{
          background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
          color: '#06060E',
          padding: '12px 24px',
          borderRadius: 10,
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          Plus إضافة كلية/قسم
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الكليات', value: stats.total, icon: "ICON_GraduationCap", color: '#C9A227' },
          { label: 'الكليات النشطة', value: stats.active, icon: "ICON_CheckCircle", color: '#10B981' },
          { label: 'الأقسام العلمية', value: stats.departments, icon: "ICON_BookOpen", color: '#3B82F6' },
          { label: 'إجمالي الطلاب', value: stats.students.toLocaleString(), icon: 'User‍GraduationCap', color: '#8B5CF6' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
      }}>
        <input
          type="text"
          placeholder="Search بحث بالاسم أو الجامعة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, maxWidth: 400 }}
        />
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p>
          </div>
        ) : filteredColleges.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>GraduationCap</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد كليات أو أقسام</p>
            <button onClick={() => setShowAddModal(true)} style={{
              marginTop: 16,
              background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
              color: '#06060E',
              padding: '12px 24px',
              borderRadius: 10,
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              Plus إضافة أول كلية
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>الكلية/القسم</th>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>الجامعة/المعهد</th>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>العميد/الرئيس</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>الأقسام</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>الطلاب</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredColleges.map((college) => (
                <tr key={college.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 45, height: 45,
                        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 20,
                      }}>GraduationCap</div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 600, margin: 0 }}>{college.name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>{college.name_en}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 16, color: 'rgba(255,255,255,0.8)' }}>{college.school_name || '-'}</td>
                  <td style={{ padding: 16, color: 'rgba(255,255,255,0.8)' }}>{college.dean_name || '-'}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'white', fontWeight: 600 }}>{college.departments_count || 0}</td>
                  <td style={{ padding: 16, textAlign: 'center', color: 'white', fontWeight: 600 }}>{college.students_count || 0}</td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{
                      background: college.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: college.is_active ? '#10B981' : '#EF4444',
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {college.is_active ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button style={{
                        background: 'rgba(59,130,246,0.1)',
                        color: '#3B82F6',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}>Eye️ عرض</button>
                      <button onClick={() => { setEditItem(college); setFormData({ school_id: String(college.school_id || ""), name: college.name || "", name_en: college.name_en || "", type: college.type || "college", dean_name: college.dean_name || "", email: college.email || "", phone: college.phone || "", description: "" }); setShowAddModal(true); setErrMsg(""); }} style={{
                        background: 'rgba(201,162,39,0.1)',
                        color: '#C9A227',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}>Pencil️ تعديل</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: 20,
        }}>
          <div style={{
            background: '#1B263B',
            borderRadius: 16,
            padding: 32,
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid rgba(201,162,39,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: '#C9A227', fontSize: 22, fontWeight: 700, margin: 0 }}>{editItem ? 'تعديل' : 'Plus إضافة كلية/قسم جديد'}</h2>
              <button onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'white',
                width: 36, height: 36,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 18,
              }}>X</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>الجامعة/المعهد *</label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                    required
                    style={inputStyle}
                  >
                    <option value="">اختر الجامعة أو المعهد</option>
                    {schools.filter(s => s.type === 'university' || s.type === 'institute').map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>النوع *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="college">كلية</option>
                    <option value="department">قسم علمي</option>
                    <option value="institute">معهد</option>
                    <option value="center">مركز</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>الاسم بالعربي *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={inputStyle}
                    placeholder="مثال: كلية علوم الحاسب"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>الاسم بالإنجليزي</label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    style={inputStyle}
                    placeholder="Example: College of Computer Science"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>اسم العميد/الرئيس</label>
                  <input
                    type="text"
                    value={formData.dean_name}
                    onChange={(e) => setFormData({ ...formData, dean_name: e.target.value })}
                    style={inputStyle}
                    placeholder="د. أحمد محمد"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                      placeholder="college@university.edu"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>رقم الهاتف</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                      placeholder="01XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontSize: 14 }}>الوصف</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    placeholder="نبذة عن الكلية أو القسم..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowAddModal(false); setEditItem(null); setErrMsg(''); }} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}>إلغاء</button>
                <button type="submit" disabled={saving} style={{
                  background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                  border: 'none',
                  color: '#06060E',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}>
                  {saving ? '⏳ جاري الحفظ...' : 'CheckCircle حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
