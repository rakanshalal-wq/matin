'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import InstitutionLayout from '@/components/layouts/InstitutionLayout';
import { DashboardWrapper } from '@/components/dashboard';
import { getHeaders } from '@/lib/api';

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (token) {
      fetch('/api/auth/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then(r => r.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user);
            localStorage.setItem('matin_user', JSON.stringify(data.user));
          } else { window.location.href = '/login'; }
        }).catch(() => setLoading(false))
        .finally(() => setLoading(false));
    } else {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (u.id) { 
        setUser(u); 
        setLoading(false);
      }
      else { window.location.href = '/login'; }
    }
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</p>
      </div>
    );
  }

  if (!user || !user.institution) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>لا توجد بيانات مؤسسة للمستخدم.</p>
      </div>
    );
  }

  return (
    <InstitutionLayout institution={user.institution} user={user}>
      <DashboardWrapper />
    </InstitutionLayout>
  );
}
