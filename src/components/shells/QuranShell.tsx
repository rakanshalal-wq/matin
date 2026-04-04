'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, Settings, LogOut, ChevronLeft, BarChart3, Bell, Star, Video } from 'lucide-react';

const NAV = [
  { href: '/quran/dashboard',  icon: LayoutDashboard, label: 'بوابة المركز' },
  { href: '/quran/teacher',    icon: BookOpen,        label: 'المعلمون' },
  { href: '/quran/supervisor', icon: Star,            label: 'المشرفون' },
  { href: '/quran/student',    icon: Users,           label: 'الطلاب' },
  { href: '/quran/session',    icon: Video,           label: 'الحلقات المباشرة' },
  { href: '/quran/reports',    icon: BarChart3,       label: 'التقارير' },
  { href: '/quran/settings',   icon: Settings,        label: 'الإعدادات' },
];

const ACCENT = '#059669';

export default function QuranShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F172A' }}>
      <aside style={{ background: '#1E293B', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column', width: collapsed ? '72px' : '240px', transition: 'width 0.25s', flexShrink: 0, height: '100vh', position: 'sticky', top: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #334155', minHeight: '64px' }}>
          {!collapsed && (
            <Link href="/quran/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg,${ACCENT},#047857)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff' }}>م</span>
              <span style={{ fontWeight: '700', fontSize: '1.1rem', color: ACCENT }}>متين</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
            <ChevronLeft size={18} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.75rem', borderRadius: '8px', textDecoration: 'none', background: active ? `rgba(5,150,105,0.15)` : 'transparent', whiteSpace: 'nowrap' }}>
                <Icon size={20} style={{ flexShrink: 0, color: active ? ACCENT : '#94A3B8' }} />
                {!collapsed && <span style={{ color: active ? '#F8FAFC' : '#94A3B8', fontSize: '0.9rem', fontWeight: '500' }}>{label}</span>}
              </Link>
            );
          })}
        </nav>

        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: 'none', background: 'transparent', cursor: 'pointer', margin: '0.5rem', borderRadius: '8px', whiteSpace: 'nowrap' }}>
          <LogOut size={18} style={{ color: '#EF4444' }} />
          {!collapsed && <span style={{ color: '#EF4444' }}>تسجيل الخروج</span>}
        </button>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#1E293B', borderBottom: '1px solid #334155', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}><Bell size={20} /></button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},#047857)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#fff' }}>م</div>
          </div>
        </header>
        <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>{children}</div>
      </main>
    </div>
  );
}
