'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import './school-theme.css';

interface SchoolShellProps {
  children: React.ReactNode;
}

const NAV_SECTIONS = [
  {
    title: 'الرئيسية',
    items: [
      { id: 'overview', label: 'نظرة عامة', href: '/school-dashboard' },
    ]
  },
  {
    title: 'إدارة المدرسة',
    items: [
      { id: 'students', label: 'الطلاب', href: '/school-dashboard/students' },
      { id: 'teachers', label: 'المعلمين', href: '/school-dashboard/teachers' },
      { id: 'classes', label: 'الفصول', href: '/school-dashboard/classes' },
      { id: 'subjects', label: 'المواد', href: '/school-dashboard/subjects' },
    ]
  },
  {
    title: 'العمليات',
    items: [
      { id: 'exams', label: 'الاختبارات', href: '/school-dashboard/exams' },
      { id: 'attendance', label: 'الحضور', href: '/school-dashboard/attendance' },
      { id: 'finance', label: 'المالية', href: '/school-dashboard/finance' },
    ]
  },
  {
    title: 'الإعدادات',
    items: [
      { id: 'settings', label: 'إعدادات المدرسة', href: '/school-dashboard/settings' },
    ]
  }
];

export default function SchoolShell({ children }: SchoolShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    const userData = localStorage.getItem('matin_user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'owner') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/school-dashboard') {
      return pathname === '/school-dashboard';
    }
    return pathname.startsWith(href);
  };

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>جاري التحميل...</div>;
  }

  return (
    <div className="school-layout">
      <aside className="school-sidebar">
        <div className="sb-header">
          <Link href="/school-dashboard" className="sb-logo">
            <div className="sb-logo-icon">م</div>
            <div>
              <div className="sb-logo-text">متين</div>
              <div className="sb-logo-sub">نظام إدارة المدارس</div>
            </div>
          </Link>

          <div className="sb-user">
            <div className="sb-user-avatar">{user?.name?.charAt(0) || 'م'}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{user?.name || user?.email?.split('@')[0] || 'مدير'}</div>
              <div className="sb-user-role">مالك المدرسة</div>
            </div>
          </div>
        </div>

        <nav className="sb-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="sb-section">
              <div className="sb-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`sb-link ${isActive(item.href) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <button className="sb-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="school-main">
        <header className="school-header">
          <div></div>
          <div className="header-user">
            <span>{user?.name || 'مدير'}</span>
            <span style={{ color: 'var(--accent)' }}>●</span>
          </div>
        </header>

        <div className="school-content">
          {children}
        </div>
      </main>
    </div>
  );
}
