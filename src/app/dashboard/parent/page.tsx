'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, ICONS, G, DARK, CARD, BORDER, Spinner } from '@/components/ui-icons';

/* ─── Design: Dark #06060E + Gold #C9A84C — متين v5 ─── */

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
        if (d.children) {
          setChildren(d.children);
          if (d.children.length > 0) setSelectedChild(d.children[0]);
        }
      }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const MENU = [
    { icon: 'dashboard', label: 'الرئيسية', path: '/dashboard/parent' },
    { icon: 'student_hat', label: 'أبنائي', path: '/dashboard/students' },
    { icon: 'schedule', label: 'الجدول', path: '/dashboard/schedules' },
    { icon: 'attendance', label: 'الحضور', path: '/dashboard/attendance' },
    { icon: 'grades', label: 'الدرجات', path: '/dashboard/grades' },
    { icon: 'fees', label: 'الرسوم', path: '/dashboard/finance' },
    { icon: 'transport', label: 'النقل', path: '/dashboard/transport' },
    { icon: 'messages', label: 'التواصل', path: '/dashboard/messages' },
    { icon: 'notif', label: 'الإشعارات', path: '/dashboard/notifications' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <Spinner size={40} />
      <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 14, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>جاري التحميل...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: DARK, fontFamily: 'IBM Plex Sans Arabic, sans-serif', direction: 'rtl' }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#080810', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(201,168,76,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G }}>
              <Icon d={ICONS.parent} size={18} />
            </div>
            <div>
              <div style={{ color: G, fontSize: 14, fontWeight: 800 }}>ولي أمر</div>
              <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 11, marginTop: 2 }}>{user?.name}</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {MENU.map((item) => {
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;
            return (
              <div key={item.path}
                onClick={() => router.push(item.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, cursor: 'pointer', transition: 'all 0.15s', background: isActive ? `rgba(201,168,76,0.08)` : 'transparent', color: isActive ? G : 'rgba(238,238,245,0.55)', borderRight: isActive ? `3px solid ${G}` : '3px solid transparent', fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
                <Icon d={ICONS[item.icon]} size={15} color={isActive ? G : 'rgba(238,238,245,0.4)'} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 8px', borderTop: `1px solid ${BORDER}` }}>
          <div onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', color: '#EF4444', fontSize: 13, fontWeight: 600, background: 'rgba(239,68,68,0.06)' }}>
            <Icon d={ICONS.logout} size={15} color="#EF4444" />
            <span>تسجيل الخروج</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Topbar */}
        <div style={{ background: '#080810', borderBottom: `1px solid ${BORDER}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
          <span style={{ color: '#EEEEF5', fontWeight: 700, fontSize: 16 }}>بوابة ولي الأمر</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => router.push('/dashboard/notifications')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(238,238,245,0.5)', padding: 8, borderRadius: 8 }}>
              <Icon d={ICONS.notif} size={18} />
            </button>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `rgba(201,168,76,0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: G, fontWeight: 800, fontSize: 14 }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>

        <div style={{ padding: '28px 24px' }}>
          {/* الترحيب */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ color: '#EEEEF5', fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.5 }}>مرحباً {user?.name}</h1>
            <p style={{ color: 'rgba(238,238,245,0.4)', margin: 0, fontSize: 14 }}>تابع أداء أبنائك من هنا</p>
          </div>

          {/* اختيار الابن */}
          {children.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, marginBottom: 24 }}>
              <h3 style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon d={ICONS.student_hat} size={16} color={G} /> أبنائي
              </h3>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {children.map((child: any, i: number) => (
                  <div key={i} onClick={() => setSelectedChild(child)}
                    style={{ background: selectedChild?.id === child.id ? `rgba(201,168,76,0.1)` : 'rgba(255,255,255,0.03)', border: `2px solid ${selectedChild?.id === child.id ? G : BORDER}`, borderRadius: 12, padding: '12px 18px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700 }}>{child.name}</div>
                    <div style={{ color: 'rgba(238,238,245,0.4)', fontSize: 12, marginTop: 3 }}>{child.class_name || 'غير محدد'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* إحصائيات الابن المختار */}
          {selectedChild && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { icon: 'attendance', label: 'الحضور', value: `${selectedChild.attendance || 0}%`, color: '#10B981', path: '/dashboard/attendance' },
                { icon: 'grades', label: 'المعدل', value: `${selectedChild.grades_avg || 0}%`, color: '#3B82F6', path: '/dashboard/grades' },
                { icon: 'fees', label: 'الرسوم', value: selectedChild.pending_fees > 0 ? 'معلقة' : 'مسددة', color: selectedChild.pending_fees > 0 ? '#EF4444' : '#10B981', path: '/dashboard/finance' },
                { icon: 'transport', label: 'الباص', value: selectedChild.bus_status || 'غير مسجل', color: '#F59E0B', path: '/dashboard/transport' },
              ].map((item, i) => (
                <div key={i} onClick={() => router.push(item.path)}
                  style={{ background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: 14, padding: '18px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = item.color; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = `${item.color}25`; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: item.color }}>
                    <Icon d={ICONS[item.icon]} size={18} />
                  </div>
                  <div style={{ color: item.color, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{item.value}</div>
                  <div style={{ color: 'rgba(238,238,245,0.45)', fontSize: 12, fontWeight: 500 }}>{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* روابط سريعة */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: '#EEEEF5', fontSize: 14, fontWeight: 700, margin: '0 0 16px' }}>الوصول السريع</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {[
                { icon: 'schedule', label: 'الجدول الدراسي', path: '/dashboard/schedules', color: '#8B5CF6' },
                { icon: 'homework', label: 'الواجبات', path: '/dashboard/homework', color: '#F59E0B' },
                { icon: 'exams', label: 'الاختبارات', path: '/dashboard/exams', color: '#3B82F6' },
                { icon: 'messages', label: 'التواصل مع المعلم', path: '/dashboard/messages', color: '#10B981' },
                { icon: 'notif', label: 'الإشعارات', path: '/dashboard/notifications', color: '#EC4899' },
                { icon: 'reports', label: 'التقارير', path: '/dashboard/reports', color: '#06B6D4' },
              ].map((item, i) => (
                <div key={i} onClick={() => router.push(item.path)}
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = item.color; (e.currentTarget as HTMLDivElement).style.background = `${item.color}08`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORDER; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: item.color }}>
                    <Icon d={ICONS[item.icon]} size={16} />
                  </div>
                  <div style={{ color: 'rgba(238,238,245,0.7)', fontSize: 12, fontWeight: 600 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* لا يوجد أبناء */}
          {children.length === 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '48px 32px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(201,168,76,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: G }}>
                <Icon d={ICONS.parent} size={30} />
              </div>
              <div style={{ color: 'rgba(238,238,245,0.6)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>لم يتم ربط أبنائك بعد</div>
              <div style={{ color: 'rgba(238,238,245,0.3)', fontSize: 13 }}>تواصل مع إدارة المدرسة لربط حسابات أبنائك</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
