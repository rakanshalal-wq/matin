'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import SessionTimeout from '@/components/SessionTimeout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('matin_token');
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) {
          localStorage.removeItem('matin_user');
          localStorage.removeItem('matin_token');
          router.push('/login');
          return;
        }
        const data = await res.json();
        const user = data.user || data;
        if (!user || !user.id) {
          router.push('/login');
          return;
        }
        localStorage.setItem('matin_user', JSON.stringify(user));
        setUserRole(user.role || '');
        if (user.role === 'super_admin') {
          router.push('/owner');
          return;
        }
        setLoading(false);
      } catch {
        const stored = localStorage.getItem('matin_user');
        if (!stored) {
          router.push('/login');
          return;
        }
        try {
          const u = JSON.parse(stored);
          setUserRole(u.role || '');
          setLoading(false);
        } catch {
          router.push('/login');
        }
      }
    };
    verifyUser();
  }, [router]);

  useEffect(() => {
    const checkScreen = () => {
      const w = window.innerWidth;
      if (w < 768) { setScreenSize('mobile'); setSidebarOpen(false); }
      else if (w < 1024) { setScreenSize('tablet'); setSidebarOpen(false); }
      else { setScreenSize('desktop'); setSidebarOpen(true); }
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.8; } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)', borderRadius: 20, margin: '0 auto 24px', animation: 'pulse 2s infinite', boxShadow: '0 0 40px rgba(201,168,76,0.2)' }} />
          <p style={{ color: '#C9A84C', fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>جاري تحميل متين...</p>
          <p style={{ color: 'rgba(238,238,245,0.35)', fontSize: 14, marginTop: 8, fontWeight: 500 }}>نظام إدارة التعليم المتكامل</p>
        </div>
      </div>
    );
  }

  const isDesktop = screenSize === 'desktop';
  const mainPadding = screenSize === 'mobile' ? 16 : screenSize === 'tablet' ? 24 : 32;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#06060E', 
      direction: 'rtl', 
      fontFamily: 'var(--font)',
      display: 'flex',
      flexDirection: 'row',
    }}>
      <SessionTimeout />
      
      <Sidebar 
        isOpen={isDesktop ? true : sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        screenSize={screenSize}
        userRole={userRole}
      />
      
      <div style={{ 
        flex: 1, 
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <DashboardHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          showMenuButton={!isDesktop} 
        />
        <main style={{ 
          flex: 1,
          padding: mainPadding, 
          overflowY: 'auto',
          overflowX: 'hidden',
          background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.03) 0%, transparent 70%)'
        }}>
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
        <footer style={{ 
          padding: screenSize === 'mobile' ? '16px' : '20px 32px', 
          borderTop: '1px solid rgba(255,255,255,0.06)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 12,
          flexShrink: 0,
          background: 'rgba(255,255,255,0.01)'
        }}>
          <p style={{ color: 'rgba(238,238,245,0.25)', fontSize: screenSize === 'mobile' ? 11 : 12, margin: 0, fontWeight: 500 }}>© 2026 متين - جميع الحقوق محفوظة</p>
          <p style={{ color: 'rgba(238,238,245,0.25)', fontSize: screenSize === 'mobile' ? 11 : 12, margin: 0, fontWeight: 500 }}>صنع بـ ❤️ في المملكة العربية السعودية</p>
        </footer>
      </div>
    </div>
  );
}
