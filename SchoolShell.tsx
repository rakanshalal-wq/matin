'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  ClipboardCheck,
  Wallet,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import './school-theme.css';

interface SchoolShellProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const NAV_SECTIONS = [
  {
    title: 'الرئيسية',
    items: [
      { id: 'overview', label: 'نظرة عامة', icon: <LayoutDashboard size={18} />, href: '/school-dashboard' },
    ]
  },
  {
    title: 'إدارة المدرسة',
    items: [
      { id: 'students', label: 'الطلاب', icon: <GraduationCap size={18} />, href: '/school-dashboard/students' },
      { id: 'teachers', label: 'المعلمين', icon: <Users size={18} />, href: '/school-dashboard/teachers' },
      { id: 'classes', label: 'الفصول', icon: <School size={18} />, href: '/school-dashboard/classes' },
      { id: 'subjects', label: 'المواد', icon: <BookOpen size={18} />, href: '/school-dashboard/subjects' },
    ]
  },
  {
    title: 'العمليات',
    items: [
      { id: 'exams', label: 'الاختبارات', icon: <ClipboardCheck size={18} />, href: '/school-dashboard/exams' },
      { id: 'attendance', label: 'الحضور', icon: <ClipboardCheck size={18} />, href: '/school-dashboard/attendance' },
      { id: 'finance', label: 'المالية', icon: <Wallet size={18} />, href: '/school-dashboard/finance' },
    ]
  },
  {
    title: 'الإعدادات',
    items: [
      { id: 'settings', label: 'إعدادات المدرسة', icon: <Settings size={18} />, href: '/school-dashboard/settings' },
    ]
  }
];

export default function SchoolShell({ children }: SchoolShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    const userData = localStorage.getItem('matin_user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Check if user is school owner
    if (parsedUser.role !== 'owner') {
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchSchoolData(token);
  }, [router]);

  const fetchSchoolData = async (token: string) => {
    try {
      const res = await fetch('/api/schools/my-school', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSchool(data);
      }
    } catch (e) {
      console.error('Failed to fetch school data:', e);
    } finally {
      setLoading(false);
    }
  };

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
    return (
      <div className="school-layout">
        <div className="loading-state">
          <div className="animate-spin">⟳</div>
          <span>جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="school-layout">
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`school-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sb-header">
          <Link href="/school-dashboard" className="sb-logo">
            <div className="sb-logo-icon">م</div>
            <div>
              <div className="sb-logo-text">متين</div>
              <div className="sb-logo-sub">نظام إدارة المدارس</div>
            </div>
          </Link>

          {school && (
            <div className="sb-school-card">
              <div className="sb-school-avatar">🏫</div>
              <div className="sb-school-info">
                <div className="sb-school-name">{school.name_ar || school.name || 'مدرستي'}</div>
                <div className="sb-school-role">مدير المدرسة</div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sb-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="sb-section">
              <div className="sb-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`sb-link ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge ? <span className="sb-badge">{item.badge}</span> : null}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          <button className="sb-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="school-main">
        {/* Header */}
        <header className="school-header">
          <div className="header-search">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input type="text" placeholder="البحث في المدرسة..." />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>

            <div className="header-actions">
              <button className="header-btn">
                <Bell size={18} />
                {notifications > 0 && <span className="dot" />}
              </button>

              <div className="header-user">
                <div className="header-user-avatar">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'م'}
                </div>
                <div className="header-user-info">
                  <div className="header-user-name">{user?.name || user?.email?.split('@')[0] || 'مدير'}</div>
                  <div className="header-user-role">مالك المدرسة</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="school-content">
          {children}
        </div>
      </main>
    </div>
  );
}
