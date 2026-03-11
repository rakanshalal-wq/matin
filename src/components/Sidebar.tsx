'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  userRole?: string;
}

export default function Sidebar({ isOpen, onClose, screenSize, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSections, setOpenSections] = useState<string[]>(['الرئيسية', 'الإدارة']);

  const isOverlay = screenSize !== 'desktop';
  const sidebarWidth = 260;

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const roleLabel: Record<string, string> = {
    'admin': 'مدير النظام',
    'teacher': 'معلم',
    'student': 'طالب',
    'parent': 'ولي أمر',
    'super_admin': 'المالك'
  };

  const getMenu = () => {
    const common = [
      {
        title: 'الرئيسية',
        items: [
          { label: 'لوحة التحكم', icon: '📊', href: '/dashboard' },
          { label: 'الملف الشخصي', icon: '👤', href: '/profile' },
        ]
      }
    ];

    if (userRole === 'admin') {
      common.push({
        title: 'الإدارة',
        items: [
          { label: 'الطلاب', icon: '👨‍🎓', href: '/dashboard/students' },
          { label: 'المعلمون', icon: '👩‍🏫', href: '/dashboard/teachers' },
          { label: 'الفصول', icon: '🏛', href: '/dashboard/classes' },
        ]
      });
    }

    return common;
  };

  const menu = getMenu();

  return (
    <>
      {isOverlay && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 998 }} />
      )}
      <aside style={{
        width: sidebarWidth,
        height: '100vh',
        background: '#0B0B16',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: isOverlay ? 'fixed' : 'sticky',
        top: 0,
        right: isOverlay ? (isOpen ? 0 : '-100%') : 0,
        zIndex: 999,
        transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, color: '#000'
            }}>م</div>
            <div style={{
              fontSize: 24, fontWeight: 800,
              color: '#EEEEF5', letterSpacing: -0.5
            }}>متين</div>
          </Link>
          {userRole && (
            <div style={{ marginTop: 12, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 8, padding: '4px 12px', display: 'inline-block' }}>
              <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700 }}>
                {roleLabel[userRole] || userRole}
              </span>
            </div>
          )}
        </div>

        {/* Menu */}
        <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {menu.map((section) => (
            <div key={section.title} style={{ marginBottom: 8 }}>
              <button
                onClick={() => toggleSection(section.title)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '10px 12px',
                  background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                }}
              >
                <span style={{ color: 'rgba(238,238,245,0.35)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {section.title}
                </span>
                <span style={{
                  color: 'rgba(238,238,245,0.2)', fontSize: 10,
                  transition: 'transform 0.2s',
                  transform: openSections.includes(section.title) ? 'rotate(90deg)' : 'rotate(0deg)',
                }}>◀</span>
              </button>
              {openSections.includes(section.title) && (
                <div style={{ marginTop: 4 }}>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => isOverlay && onClose()}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px', borderRadius: 10, margin: '2px 0',
                          background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                          borderRight: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                          transition: 'all 0.2s',
                        }}
                        >
                          <span style={{ fontSize: 18, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                          <span style={{
                            color: isActive ? '#EEEEF5' : 'rgba(238,238,245,0.6)',
                            fontSize: 14,
                            fontWeight: isActive ? 700 : 500,
                          }}>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          <button
            onClick={logout}
            style={{
              width: '100%', background: 'rgba(239,68,68,0.08)', color: '#F87171',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: 12,
              padding: '12px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              transition: 'all 0.2s', fontFamily: 'var(--font)'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
          >
            🚪 تسجيل الخروج
          </button>
          <div style={{ marginTop: 12, color: 'rgba(238,238,245,0.2)', fontSize: 10, textAlign: 'center', fontWeight: 500 }}>
            نظام متين الذكي v2.0
          </div>
        </div>
      </aside>
    </>
  );
}
