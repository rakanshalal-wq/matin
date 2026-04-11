'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, BookOpen, Settings,
  LogOut, ChevronLeft, GraduationCap, Building,
  BarChart3, Bell, DollarSign, FileText,
} from 'lucide-react';

const NAV = [
  { href: '/university/president', icon: LayoutDashboard, label: 'لوحة الرئيس', roles: ['university_president'] },
  { href: '/university/dean',      icon: Building,         label: 'عميد الكلية',   roles: ['university_dean'] },
  { href: '/university/professor', icon: GraduationCap,   label: 'الأكاديميون',   roles: ['professor'] },
  { href: '/university/student',   icon: BookOpen,         label: 'بوابة الطالب',  roles: ['university_student'] },
  { href: '/university/parent',    icon: Users,            label: 'أولياء الأمور', roles: ['parent_university'] },
  { href: '/university/hr',        icon: FileText,         label: 'الموارد البشرية', roles: ['hr_university'] },
  { href: '/university/finance',   icon: DollarSign,       label: 'المالية',       roles: ['university_president', 'university_dean'] },
  { href: '/university/reports',   icon: BarChart3,        label: 'التقارير',      roles: [] },
  { href: '/university/settings',  icon: Settings,         label: 'الإعدادات',     roles: [] },
];

export default function UniversityShell({ children, userRole = '' }: { children: React.ReactNode; userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = NAV.filter((n) => n.roles.length === 0 || n.roles.includes(userRole));

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div style={styles.shell}>
      <aside style={{ ...styles.sidebar, width: collapsed ? '72px' : '240px' }}>
        <div style={styles.sidebarHeader}>
          {!collapsed && (
            <Link href="/dashboard" style={styles.logoWrap}>
              <span style={{ ...styles.logoIcon, background: 'linear-gradient(135deg,#0EA5E9,#0284C7)' }}>م</span>
              <span style={{ ...styles.logoText, color: '#0EA5E9' }}>متين</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
            <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        <nav style={styles.nav}>
          {visibleNav.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ ...styles.navItem, ...(active ? styles.navActive : {}) }}>
                <Icon size={20} style={{ flexShrink: 0, color: active ? '#0EA5E9' : '#94A3B8' }} />
                {!collapsed && <span style={{ color: active ? '#F8FAFC' : '#94A3B8' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <button onClick={logout} style={styles.logoutBtn}>
          <LogOut size={18} style={{ color: '#EF4444' }} />
          {!collapsed && <span style={{ color: '#EF4444' }}>تسجيل الخروج</span>}
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={styles.iconBtn}><Bell size={20} /></button>
            <div style={{ ...styles.avatar, background: 'linear-gradient(135deg,#0EA5E9,#0284C7)' }}>م</div>
          </div>
        </header>
        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: { display: 'flex', minHeight: '100vh', background: '#0F172A' },
  sidebar: { background: '#1E293B', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column', transition: 'width 0.25s', flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #334155', minHeight: '64px' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  logoIcon: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: '700', color: '#fff', flexShrink: 0 },
  logoText: { fontWeight: '700', fontSize: '1.1rem' },
  collapseBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' },
  nav: { flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' },
  navItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap' },
  navActive: { background: 'rgba(14,165,233,0.12)' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', margin: '0.5rem', borderRadius: '8px', whiteSpace: 'nowrap' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: { background: '#1E293B', borderBottom: '1px solid #334155', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  iconBtn: { background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', fontSize: '0.9rem' },
  content: { padding: '1.5rem', flex: 1, overflowY: 'auto' },
};
