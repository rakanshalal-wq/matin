'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const getHeaders = (): Record<string, string> => {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
    const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return { 'Content-Type': 'application/json', 'x-user-id': String(u.id || '') };
  } catch { return { 'Content-Type': 'application/json' }; }
};

const GOLD = '#C9A84C';
const BG = '#06060E';
const CARD = 'rgba(255,255,255,0.03)';
const BORDER = 'rgba(255,255,255,0.07)';

export default function DriverDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('matin_user') || '{}');
      setUser(u);
    } catch {}
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tripsRes, studentsRes, msgsRes, notifRes] = await Promise.allSettled([
        fetch('/api/transport', { headers: getHeaders() }),
        fetch('/api/student-tracking', { headers: getHeaders() }),
        fetch('/api/messages?limit=5', { headers: getHeaders() }),
        fetch('/api/notifications?limit=5', { headers: getHeaders() }),
      ]);

      if (tripsRes.status === 'fulfilled' && tripsRes.value.ok) {
        const d = await tripsRes.value.json();
        setTrips(Array.isArray(d) ? d.slice(0, 5) : (d.data || []).slice(0, 5));
      }
      if (studentsRes.status === 'fulfilled' && studentsRes.value.ok) {
        const d = await studentsRes.value.json();
        setStudents(Array.isArray(d) ? d.slice(0, 6) : (d.data || []).slice(0, 6));
      }
      if (msgsRes.status === 'fulfilled' && msgsRes.value.ok) {
        const d = await msgsRes.value.json();
        setMessages(Array.isArray(d) ? d.slice(0, 4) : (d.data || []).slice(0, 4));
      }
      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        const d = await notifRes.value.json();
        setNotifications(Array.isArray(d) ? d.slice(0, 4) : (d.data || []).slice(0, 4));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'صباح الخير' : now.getHours() < 17 ? 'مساء الخير' : 'مساء النور';

  const quickLinks = [
    { label: 'تطبيق السائق', icon: '🚌', href: '/driver-app', color: '#3B82F6', desc: 'تتبع الرحلة وتسجيل الركاب' },
    { label: 'الطلاب في رحلتي', icon: '👦', href: '/dashboard/student-tracking', color: '#10B981', desc: 'قائمة الطلاب المسجلين' },
    { label: 'الرسائل', icon: '💬', href: '/dashboard/messages', color: GOLD, desc: 'التواصل مع الإدارة' },
    { label: 'الإشعارات', icon: '🔔', href: '/dashboard/notifications', color: '#8B5CF6', desc: 'آخر التنبيهات' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'IBM Plex Sans Arabic, sans-serif', padding: '32px', direction: 'rtl' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{greeting} 👋</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>{user?.name || 'السائق'}</div>
        <div style={{ fontSize: 14, color: GOLD, marginTop: 4 }}>سائق — {user?.school_name || 'المؤسسة التعليمية'}</div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {quickLinks.map((link, i) => (
          <Link key={i} href={link.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 16 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = link.color + '60')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
              <div style={{ fontSize: 32, width: 52, height: 52, background: link.color + '15', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{link.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{link.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{link.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Students in Trip */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>🎒 الطلاب في رحلتي</div>
            <Link href="/dashboard/student-tracking" style={{ fontSize: 12, color: GOLD, textDecoration: 'none' }}>عرض الكل</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.3)' }}>جاري التحميل...</div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 30, color: 'rgba(255,255,255,0.3)' }}>لا يوجد طلاب مسجلون</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {students.map((s: any) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: GOLD + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👦</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name || s.student_name || 'طالب'}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.address || s.pickup_location || 'موقع الركوب غير محدد'}</div>
                  </div>
                  <div style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: s.boarded ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: s.boarded ? '#10B981' : '#F59E0B' }}>
                    {s.boarded ? 'ركب' : 'بانتظار'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications + Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Notifications */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>🔔 الإشعارات</div>
              <Link href="/dashboard/notifications" style={{ fontSize: 12, color: GOLD, textDecoration: 'none' }}>عرض الكل</Link>
            </div>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>لا توجد إشعارات</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifications.map((n: any) => (
                  <div key={n.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, borderRight: `3px solid ${GOLD}` }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{n.created_at ? new Date(n.created_at).toLocaleDateString('ar-SA') : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>💬 الرسائل</div>
              <Link href="/dashboard/messages" style={{ fontSize: 12, color: GOLD, textDecoration: 'none' }}>عرض الكل</Link>
            </div>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>لا توجد رسائل</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((m: any) => (
                  <div key={m.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{m.sender_name || m.title || 'رسالة'}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.content || m.body || ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Start Trip CTA */}
      <div style={{ marginTop: 32, background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(201,168,76,0.05) 100%)', border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>🚌 هل أنت جاهز للرحلة؟</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>افتح تطبيق السائق لتسجيل الحضور وتتبع الموقع</div>
        </div>
        <Link href="/driver-app" style={{ textDecoration: 'none' }}>
          <button style={{ background: GOLD, color: '#000', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', whiteSpace: 'nowrap' }}>
            ابدأ الرحلة
          </button>
        </Link>
      </div>

    </div>
  );
}
