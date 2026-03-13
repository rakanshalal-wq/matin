'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = localStorage.getItem('matin_user');
    if (!u) { router.push('/login'); return; }
    const parsed = JSON.parse(u);
    if (parsed.role !== 'parent') { router.push('/login'); return; }
    setUser(parsed);
    fetchData(parsed);
  }, []);

  const fetchData = async (u: any) => {
    const token = localStorage.getItem('matin_token');
    const headers = { 'Authorization': 'Bearer ' + token };
    try {
      const res = await fetch('/api/parents', { headers });
      if (res.ok) {
        const d = await res.json();
        if (d.children) { setChildren(d.children); if (d.children.length > 0) setSelectedChild(d.children[0]); }
      }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const s = {
    page: { display: 'flex', minHeight: '100vh', background: '#06060E', fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif', direction: 'rtl' as const },
    sidebar: { width: '220px', background: '#0A1520', borderLeft: '1px solid rgba(139,92,246,0.15)', display: 'flex', flexDirection: 'column' as const, flexShrink: 0 },
    menuItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px' },
    main: { flex: 1, overflow: 'auto' },
    topbar: { background: '#0A1520', borderBottom: '1px solid rgba(139,92,246,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    content: { padding: '24px' },
    card: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(139,92,246,0.1)', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
    cardTitle: { color: '#8B5CF6', fontSize: '15px', fontWeight: 700, marginBottom: '16px' },
  };

  const MENU = [
    { icon: '🏠', label: 'الرئيسية', path: '/dashboard/parent' },
    { icon: '👨‍🎓', label: 'أبنائي', path: '/dashboard/students' },
    { icon: '📅', label: 'الجدول', path: '/dashboard/schedules' },
    { icon: '✅', label: 'الحضور', path: '/dashboard/attendance' },
    { icon: '📈', label: 'الدرجات', path: '/dashboard/grades' },
    { icon: '💰', label: 'الرسوم', path: '/dashboard/finance' },
    { icon: '🚌', label: 'النقل', path: '/dashboard/transport' },
    { icon: '💬', label: 'التواصل', path: '/dashboard/messages' },
    { icon: '🔔', label: 'الإشعارات', path: '/dashboard/notifications' },
  ];

  if (loading) return <div style={{ ...s.page, alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#8B5CF6' }}>جاري التحميل...</div></div>;

  return (
    <div style={s.page}>
      <div style={s.sidebar}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
          <div style={{ color: '#8B5CF6', fontSize: '20px', fontWeight: 800 }}>👨‍👩‍👧 ولي أمر</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '4px' }}>{user?.name}</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: '8px' }}>
          {MENU.map((item) => (
            <div key={item.path} style={s.menuItem} onClick={() => router.push(item.path)}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid rgba(139,92,246,0.1)' }}>
          <div style={s.menuItem} onClick={logout}><span>🚪</span><span>خروج</span></div>
        </div>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <span style={{ color: 'white', fontWeight: 700 }}>بوابة ولي الأمر</span>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
            {user?.name?.charAt(0)}
          </div>
        </div>

        <div style={s.content}>
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
            مرحباً {user?.name} 👋
          </div>

          {/* اختيار الابن */}
          {children.length > 0 && (
            <div style={s.card}>
              <div style={s.cardTitle}>👨‍🎓 أبنائي</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                {children.map((child: any, i: number) => (
                  <div key={i} onClick={() => setSelectedChild(child)}
                    style={{ background: selectedChild?.id === child.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)', border: `2px solid ${selectedChild?.id === child.id ? '#8B5CF6' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', color: 'white', fontSize: '14px' }}>
                    👨‍🎓 {child.name}
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{child.class_name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedChild && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { icon: '✅', label: 'الحضور', value: `${selectedChild.attendance || 0}%`, color: '#10B981', path: '/dashboard/attendance' },
                { icon: '📈', label: 'المعدل', value: `${selectedChild.grades_avg || 0}%`, color: '#3B82F6', path: '/dashboard/grades' },
                { icon: '💰', label: 'الرسوم', value: selectedChild.pending_fees > 0 ? '⚠️ معلقة' : '✓ مسددة', color: selectedChild.pending_fees > 0 ? '#EF4444' : '#10B981', path: '/dashboard/finance' },
                { icon: '🚌', label: 'الباص', value: selectedChild.bus_status || 'غير مسجل', color: '#F59E0B', path: '/dashboard/transport' },
              ].map((item, i) => (
                <div key={i} onClick={() => router.push(item.path)}
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, borderRadius: '12px', padding: '20px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ color: item.color, fontSize: '18px', fontWeight: 800 }}>{item.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {children.length === 0 && (
            <div style={{ ...s.card, textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍👩‍👧</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>لم يتم ربط أبنائك بعد</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', marginTop: '8px' }}>تواصل مع إدارة المدرسة لربط حسابات أبنائك</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
