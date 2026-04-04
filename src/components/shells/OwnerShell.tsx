'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Globe, Users, Settings, LogOut, ChevronLeft,
  BarChart3, Bell, Building, DollarSign, Shield, Package,
} from 'lucide-react';

const NAV = [
  { href: '/owner/dashboard',      icon: LayoutDashboard, label: 'لوحة التحكم' },
  { href: '/owner/institutions',   icon: Building,        label: 'المؤسسات' },
  { href: '/owner/subscriptions',  icon: Package,         label: 'الاشتراكات' },
  { href: '/owner/users',          icon: Users,           label: 'المستخدمون' },
  { href: '/owner/finance',        icon: DollarSign,      label: 'المالية' },
  { href: '/owner/reports',        icon: BarChart3,       label: 'التقارير' },
  { href: '/owner/landing',        icon: Globe,           label: 'الصفحة الرئيسية' },
  { href: '/owner/security',       icon: Shield,          label: 'الأمان' },
  { href: '/owner/settings',       icon: Settings,        label: 'الإعدادات' },
];

const ACCENT = '#D4A843';

export default function OwnerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#06060E' }}>
      <aside style={{
        background: '#070F0A',
        borderLeft: `1px solid rgba(212,168,67,0.15)`,
        display: 'flex', flexDirection: 'column',
        width: collapsed ? '72px' : '248px',
        transition: 'width 0.25s', flexShrink: 0,
        height: '100vh', position: 'sticky', top: 0, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: `1px solid rgba(255,255,255,0.07)`, minHeight: '64px' }}>
          {!collapsed && (
            <Link href="/owner/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ width: '38px', height: '38px', borderRadius: '10px', background: `linear-gradient(135deg,${ACCENT},#B8922E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1rem', color: '#fff', flexShrink: 0 }}>م</span>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: ACCENT }}>متين</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(238,238,245,0.35)' }}>مالك المنصة</div>
              </div>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.75rem', borderRadius: '8px', textDecoration: 'none',
                background: active ? `rgba(212,168,67,0.12)` : 'transparent',
                borderRight: `3px solid ${active ? ACCENT : 'transparent'}`,
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}>
                <Icon size={19} style={{ flexShrink: 0, color: active ? ACCENT : '#94A3B8' }} />
                {!collapsed && <span style={{ color: active ? '#F8FAFC' : '#94A3B8', fontSize: '0.875rem', fontWeight: active ? '600' : '400' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', margin: '0.5rem', borderRadius: '8px', whiteSpace: 'nowrap' }}>
          <LogOut size={18} style={{ color: '#EF4444', flexShrink: 0 }} />
          {!collapsed && <span style={{ color: '#EF4444', fontSize: '0.875rem' }}>تسجيل الخروج</span>}
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{
          background: 'rgba(6,6,14,0.88)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '0 1.5rem', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '9px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8' }}>
              <Bell size={17} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},#B8922E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>م</div>
          </div>
        </header>
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', color: '#F8FAFC' }}>{children}</div>
      </main>
    </div>
  );
}
