'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Settings, Bell, Search, LogOut, Home, Users, BookOpen, ClipboardCheck, Wallet, GraduationCap, School } from 'lucide-react';

const UNITS = [
  {
    id: 'kindergarten',
    name: 'حضانة الأمل',
    icon: '🧸',
    color: '#F59E0B',
    stats: [
      { label: 'أشهر - سنوات', value: '3' },
      { label: 'طفل', value: '30' },
      { label: 'مرضعة + مربية', value: '14' },
      { label: 'ساعات العمل', value: '7:00ص' },
    ],
    subStats: [
      { label: '1800', sub: 'SAR/شهر' },
      { label: '5', sub: 'أيام' },
    ],
    progress: { label: 'نظام التقييم الخاص', value: 100, sub: '30 طفل - قائمة انتظار' }
  },
  {
    id: 'nursery',
    name: 'روضة الأمل',
    icon: '🌱',
    color: '#22C55E',
    stats: [
      { label: 'KG1 - KG2 - KG3', value: '' },
      { label: 'طفل', value: '76' },
      { label: 'معلمة + مساعدة', value: '18' },
      { label: 'نسبة الحضور', value: '95%' },
    ],
    subStats: [
      { label: '3', sub: 'فصول' },
      { label: '76', sub: 'طفل' },
    ],
    progress: { label: 'نظام التقييم الخاص', value: 76, sub: 'تقرير نمو يومي + أشغال يدوية + مزايلة بدل وأجبك' }
  },
  {
    id: 'school',
    name: 'مدرسة الأمل',
    icon: '🏫',
    color: '#3B82F6',
    stats: [
      { label: 'ابتدائي + متوسط', value: '' },
      { label: 'طالب', value: '380' },
      { label: 'معلم', value: '54' },
      { label: 'نسبة الحضور', value: '91%' },
    ],
    subStats: [
      { label: '18', sub: 'فصل دراسي' },
      { label: '380', sub: 'طالب' },
    ],
    progress: { label: 'الطاقة الاستيعابية', value: 84, sub: 'عرض التفاصيل ← يوم: 680K SAR' }
  },
];

const SIDEBAR_MENU = [
  { icon: '🏠', label: 'الرئيسية', href: '/school-dashboard', active: true },
  { icon: '📊', label: 'لوحة التحكم', href: '#' },
  { icon: '🏫', label: 'الوحدات', href: '#', badge: 3 },
  { icon: '👨‍🎓', label: 'الطلاب', href: '#', badge: 486 },
  { icon: '👨‍🏫', label: 'المعلمين', href: '#', badge: 86 },
  { icon: '📚', label: 'المناهج', href: '#' },
  { icon: '📝', label: 'الاختبارات', href: '#' },
  { icon: '💰', label: 'المالية', href: '#' },
  { icon: '📅', label: 'الجدول', href: '#' },
  { icon: '📢', label: 'الإشعارات', href: '#', badge: 6 },
  { icon: '⚙️', label: 'الإعدادات', href: '#' },
];

export default function SchoolDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
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

  if (loading) {
    return <div style={{ padding: 60, textAlign: 'center', color: '#666', background: '#06060E', minHeight: '100vh' }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#06060E', color: '#EEEEF5', fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#0A0F0A', borderLeft: '1px solid rgba(52,211,153,0.1)', display: 'flex', flexDirection: 'column', position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #34D399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>متين</div>
              <div style={{ fontSize: 11, color: '#666' }}>نظام إدارة المدارس</div>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div style={{ margin: 16, padding: 14, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{user?.name || 'أحمد المطيري'}</div>
            <div style={{ fontSize: 11, color: '#34D399' }}>مالك مدرسة الأمل الدولية</div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
          {SIDEBAR_MENU.map((item, i) => (
            <Link key={i} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, marginBottom: 4, textDecoration: 'none', color: item.active ? '#34D399' : '#888', background: item.active ? 'rgba(52,211,153,0.1)' : 'transparent' }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 13 }}>{item.label}</span>
              {item.badge && <span style={{ background: '#EF4444', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 10 }}>{item.badge}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#EF4444', fontSize: 13, cursor: 'pointer' }}>
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginRight: 260 }}>
        {/* Header */}
        <header style={{ height: 64, background: 'rgba(6,6,14,0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ fontSize: 18, fontWeight: 800 }}>مدرسة الأمل الدولية</h1>
            <span style={{ fontSize: 12, color: '#666' }}>3 وحدات تعليمية - 486 طالب وطفل - أفضل أداء 1445/1446</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#22C55E', color: '#000', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
              <Plus size={16} />
              إضافة وحدة +
            </button>
            <button style={{ padding: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#888' }}>
              <Bell size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>
              <span style={{ fontSize: 13 }}>{user?.name || 'أحمد المطيري'}</span>
              <span style={{ color: '#22C55E' }}>●</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ padding: 24 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {[
              { id: 'all', label: '🏫 جميع الوحدات' },
              { id: 'school', label: '🏫 مدرسة الأمل' },
              { id: 'nursery', label: '🌱 روضة الأمل' },
              { id: 'kindergarten', label: '🧸 حضانة الأمل' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: activeTab === tab.id ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)', color: activeTab === tab.id ? '#34D399' : '#888' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Units Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {UNITS.filter(u => activeTab === 'all' || u.id === activeTab).map(unit => (
              <div key={unit.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${unit.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{unit.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>{unit.name}</div>
                    <div style={{ fontSize: 12, color: unit.color }}>نشطة</div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 16 }}>
                  {unit.stats.map((stat, i) => (
                    <div key={i} style={{ textAlign: 'center', padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: unit.color }}>{stat.value}</div>
                      <div style={{ fontSize: 11, color: '#666' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Sub Stats */}
                <div style={{ display: 'flex', gap: 12, padding: '0 16px 16px' }}>
                  {unit.subStats.map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center', padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: unit.color }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: '#666' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12 }}>{unit.progress.label}</span>
                    <span style={{ fontSize: 12, color: unit.color }}>{unit.progress.value}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${unit.progress.value}%`, height: '100%', background: unit.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{unit.progress.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
