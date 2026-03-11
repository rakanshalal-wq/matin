'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
  showMenuButton: boolean;
}

export default function DashboardHeader({ onMenuClick, showMenuButton }: HeaderProps) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { }
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const roleLabels: Record<string, string> = {
    'admin': 'مدير النظام',
    'teacher': 'معلم',
    'student': 'طالب',
    'parent': 'ولي أمر',
    'super_admin': 'المالك'
  };

  return (
    <header style={{
      height: 64,
      background: 'rgba(6, 6, 14, 0.8)',
      backdropFilter: 'blur(20px) saturate(1.8)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {showMenuButton && (
          <button onClick={onMenuClick} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#EEEEF5',
            fontSize: 20
          }}>☰</button>
        )}
        {!showMenuButton && (
          <div style={{ fontSize: 18, fontWeight: 800, color: '#EEEEF5', letterSpacing: -0.5 }}>
            لوحة التحكم
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#EEEEF5',
            fontSize: 18
          }}>🔔</button>
          {showNotifications && (
            <div style={{
              position: 'absolute', left: 0, top: 52, width: 320,
              background: '#10101E', border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 100
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 15 }}>الإشعارات</span>
                <span style={{ color: '#C9A84C', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>تحديد الكل كمقروء</span>
              </div>
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'rgba(238, 238, 245, 0.35)', fontSize: 13 }}>
                لا توجد إشعارات جديدة
              </div>
              <div style={{ padding: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <Link href="/dashboard/notifications" style={{ color: '#C9A84C', fontSize: 12, textDecoration: 'none', fontWeight: 600 }} onClick={() => setShowNotifications(false)}>عرض كل الإشعارات</Link>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            color: '#EEEEF5',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2) 0%, rgba(226, 196, 106, 0.2) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, border: '1px solid rgba(201, 168, 76, 0.3)'
            }}>
              {user?.avatar || '👤'}
            </div>
            {!isMobile && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EEEEF5' }}>{user?.name || 'المستخدم'}</div>
                <div style={{ fontSize: 10, color: '#C9A84C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{roleLabels[user?.role] || ''}</div>
              </div>
            )}
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute', left: 0, top: 56, width: 220,
              background: '#10101E', border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', zIndex: 100
            }}>
              <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.2) 0%, rgba(226, 196, 106, 0.2) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, margin: '0 auto 12px', border: '1px solid rgba(201, 168, 76, 0.3)'
                }}>{user?.avatar || '👤'}</div>
                <div style={{ color: '#EEEEF5', fontWeight: 800, fontSize: 15 }}>{user?.name}</div>
                <div style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700, marginTop: 4 }}>{roleLabels[user?.role] || ''}</div>
              </div>
              <button onClick={() => { router.push('/dashboard/settings'); setShowDropdown(false); }} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', color: 'rgba(238, 238, 245, 0.7)', fontSize: 13, cursor: 'pointer', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 }}>⚙️ الإعدادات</button>
              <button onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', padding: '14px 16px', color: '#F87171', fontSize: 13, cursor: 'pointer', textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontWeight: 600 }}>🚪 تسجيل الخروج</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
