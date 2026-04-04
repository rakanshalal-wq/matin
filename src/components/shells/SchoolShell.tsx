'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Settings,
  LogOut, Menu, X, ChevronLeft, Building2,
  DollarSign, BarChart3, Bell,
} from 'lucide-react';

const NAV = [
  { href: '/school/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/school/teacher',   icon: BookOpen,         label: 'المعلمون' },
  { href: '/school/parent',    icon: Users,            label: 'أولياء الأمور' },
  { href: '/school/hr',        icon: Building2,        label: 'الموارد البشرية' },
  { href: '/school/finance',   icon: DollarSign,       label: 'المالية' },
  { href: '/school/reports',   icon: BarChart3,        label: 'التقارير' },
  { href: '/school/settings',  icon: Settings,         label: 'الإعدادات' },
];

export default function SchoolShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  const Sidebar = (
    <aside style={{ ...styles.sidebar, width: collapsed ? '72px' : '240px' }}>
      {/* Logo */}
      <div style={styles.sidebarHeader}>
        {!collapsed && (
          <Link href="/school/dashboard" style={styles.logoWrap}>
            <span style={{ ...styles.logoIcon, background: 'linear-gradient(135deg,#34D399,#10B981)' }}>م</span>
            <span style={styles.logoText}>متين</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
          <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{ ...styles.navItem, ...(active ? styles.navActive : {}) }}>
              <Icon size={20} style={{ flexShrink: 0, color: active ? '#34D399' : '#94A3B8' }} />
              {!collapsed && <span style={{ color: active ? '#F8FAFC' : '#94A3B8' }}>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={logout} style={styles.logoutBtn}>
        <LogOut size={18} style={{ color: '#EF4444' }} />
        {!collapsed && <span style={{ color: '#EF4444' }}>تسجيل الخروج</span>}
      </button>
    </aside>
  );

  return (
    <div style={styles.shell}>
      {/* Desktop Sidebar */}
      <div style={{ display: 'flex' }}>{Sidebar}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={styles.overlay} onClick={() => setMobileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={styles.mobileSidebar}>
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topbar}>
          <button onClick={() => setMobileOpen(true)} style={styles.menuBtn}>
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={styles.iconBtn}><Bell size={20} /></button>
            <div style={styles.avatar}>م</div>
          </div>
        </header>

        {/* Page content */}
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: '#0F172A' },
  sidebar: {
    background: '#1E293B',
    borderLeft: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.25s',
    flexShrink: 0,
    height: '100vh',
    position: 'sticky',
    top: 0,
    overflow: 'hidden',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: '1px solid #334155',
    minHeight: '64px',
  },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', fontWeight: '700', color: '#fff', flexShrink: 0,
  },
  logoText: { fontWeight: '700', fontSize: '1.1rem', color: '#34D399' },
  collapseBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#94A3B8', padding: '4px', borderRadius: '6px',
    display: 'flex', alignItems: 'center',
  },
  nav: { flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.65rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
    transition: 'background 0.15s', fontSize: '0.9rem', fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  navActive: { background: 'rgba(52,211,153,0.12)' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem 1rem', border: 'none', background: 'transparent',
    cursor: 'pointer', margin: '0.5rem', borderRadius: '8px',
    transition: 'background 0.15s', whiteSpace: 'nowrap',
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: {
    background: '#1E293B',
    borderBottom: '1px solid #334155',
    padding: '0 1.5rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  menuBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#94A3B8', display: 'flex', alignItems: 'center', padding: '4px',
  },
  iconBtn: {
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: '#94A3B8', display: 'flex', alignItems: 'center',
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: 'linear-gradient(135deg,#34D399,#10B981)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', color: '#fff', fontSize: '0.9rem',
  },
  content: { padding: '1.5rem', flex: 1, overflowY: 'auto' },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    zIndex: 50, display: 'flex',
  },
  mobileSidebar: { height: '100vh' },
};
