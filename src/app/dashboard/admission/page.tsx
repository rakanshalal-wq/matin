'use client';
  const getHeaders = (): Record<string, string> => { try { const token = localStorage.getItem('matin_token'); if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }; const u = JSON.parse(localStorage.getItem('matin_user') || '{}'); return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') }; } catch { return { 'Content-Type': 'application/json' }; } };
import { useState, useEffect } from 'react';

interface Application {
  id: number;
  student_name: string;
  email: string;
  phone: string;
  school_id: number;
  school_name: string;
  grade: string;
  status: string;
  created_at: string;
}

export default function AdmissionPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admission', { headers: getHeaders() });
      const data = await res.json();
      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'قيد المراجعة', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' };
      case 'approved': return { text: 'مقبول', color: '#10B981', bg: 'rgba(16,185,129,0.1)' };
      case 'rejected': return { text: 'مرفوض', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' };
      default: return { text: status, color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
    }
  };

  const filteredApps = applications.filter(a => {
    const matchesSearch = a.student_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: 0 }}>📋 القبول والتسجيل</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>إدارة طلبات الالتحاق والتسجيل الجديدة</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'إجمالي الطلبات', value: stats.total, icon: '📋', color: '#C9A227' },
          { label: 'قيد المراجعة', value: stats.pending, icon: '⏳', color: '#F59E0B' },
          { label: 'مقبول', value: stats.approved, icon: '✅', color: '#10B981' },
          { label: 'مرفوض', value: stats.rejected, icon: '❌', color: '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 بحث باسم الطالب..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: 250, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none' }} />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14 }}>
          <option value="all">كل الحالات</option>
          <option value="pending">قيد المراجعة</option>
          <option value="approved">مقبول</option>
          <option value="rejected">مرفوض</option>
        </select>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><p style={{ color: 'rgba(255,255,255,0.6)' }}>⏳ جاري التحميل...</p></div>
        ) : filteredApps.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📋</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>لا توجد طلبات تسجيل</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(201,162,39,0.1)' }}>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>اسم الطالب</th>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>المدرسة</th>
                <th style={{ padding: 16, textAlign: 'right', color: '#C9A227' }}>الصف</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>الحالة</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>التاريخ</th>
                <th style={{ padding: 16, textAlign: 'center', color: '#C9A227' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => {
                const badge = getStatusBadge(app.status);
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: 16, color: 'white', fontWeight: 600 }}>{app.student_name}</td>
                    <td style={{ padding: 16, color: 'rgba(255,255,255,0.8)' }}>{app.school_name || '-'}</td>
                    <td style={{ padding: 16, color: 'rgba(255,255,255,0.8)' }}>{app.grade || '-'}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <span style={{ background: badge.bg, color: badge.color, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{badge.text}</span>
                    </td>
                    <td style={{ padding: 16, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{new Date(app.created_at).toLocaleDateString('ar-SA')}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                        <button style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>✅ قبول</button>
                        <button style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12 }}>❌ رفض</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
