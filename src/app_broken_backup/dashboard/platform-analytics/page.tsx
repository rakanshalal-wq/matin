'use client';
import { useState, useEffect } from 'react';

export default function PlatformAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/dashboard-stats');
      const data = await res.json();
      setStats(data);
    } catch {}
    setLoading(false);
  };

  const cards = stats ? [
    { label: 'المدارس النشطة', value: stats.schools || 0, icon: '🏫', color: '#C9A227' },
    { label: 'ملاك المدارس', value: stats.owners || 0, icon: '👑', color: '#8B5CF6' },
    { label: 'إجمالي الطلاب', value: stats.students || 0, icon: '👨‍🎓', color: '#3B82F6' },
    { label: 'إجمالي المعلمين', value: stats.teachers || 0, icon: '👩‍🏫', color: '#10B981' },
    { label: 'المستخدمون النشطون', value: stats.active_users || 0, icon: '✅', color: '#06B6D4' },
    { label: 'طلبات معلقة', value: stats.pending || 0, icon: '⏳', color: '#F59E0B' },
  ] : [];

  return (
    <div style={{ padding: 24, background: '#0D1B2A', minHeight: '100vh', fontFamily: 'Arial' }} dir="rtl">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#C9A227', fontSize: 24, fontWeight: 800, margin: 0 }}>📊 إحصاءات المنصة</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>نظرة شاملة على متين — مرئي للمؤسس فقط</p>
        </div>
        <button onClick={fetchStats}
          style={{ background: 'rgba(201,162,39,0.1)', color: '#C9A227', border: '1px solid rgba(201,162,39,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}>
          🔄 تحديث
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 80, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>جاري التحميل...</div>
      ) : (
        <>
          {/* الإحصاءات الرئيسية */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            {cards.map((card, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  {card.icon}
                </div>
                <div>
                  <div style={{ color: card.color, fontSize: 32, fontWeight: 800 }}>{card.value.toLocaleString('ar')}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 2 }}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* معلومات المنصة */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* الباقات */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
              <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: 16 }}>💎 توزيع الباقات</h3>
              {[
                { label: 'مجاني', limit: '200 طالب', color: '#6B7280' },
                { label: 'متقدم — 299 ر.س', limit: '1000 طالب', color: '#C9A227' },
                { label: 'مؤسسي — 599 ر.س', limit: 'غير محدود', color: '#8B5CF6' },
              ].map((pkg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: pkg.color }} />
                    <span style={{ color: 'white', fontSize: 14 }}>{pkg.label}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{pkg.limit}</span>
                </div>
              ))}
            </div>

            {/* القواعد الذهبية */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
              <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: 16 }}>🏆 القواعد الذهبية</h3>
              {[
                'مالك المنصة لا يرى بيانات المدارس',
                'كل مدرسة معزولة 100%',
                'الدرجات لا تنقص بعد الاعتماد',
                'الأسئلة مشفرة AES-256',
                'الحضور يسجله النظام تلقائياً',
                'التسجيلات لا تحذف — دليل دائم',
              ].map((rule, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ color: '#10B981', fontSize: 16 }}>✅</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{rule}</span>
                </div>
              ))}
            </div>

            {/* روابط سريعة */}
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', padding: 20, gridColumn: '1 / -1' }}>
              <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: 16 }}>⚡ روابط سريعة</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { label: 'إدارة المدارس', href: '/dashboard/schools', icon: '🏫' },
                  { label: 'المستخدمون', href: '/dashboard/users', icon: '👥' },
                  { label: 'الاشتراكات', href: '/dashboard/subscriptions', icon: '💎' },
                  { label: 'سجل العمليات', href: '/dashboard/activity-log', icon: '📋' },
                  { label: 'مفاتيح الطوارئ', href: '/dashboard/emergency-keys', icon: '🗝️' },
                  { label: 'الدعم الفني', href: '/dashboard/support', icon: '🎧' },
                  { label: 'النسخ الاحتياطي', href: '/dashboard/backup', icon: '💾' },
                  { label: 'سجل الأخطاء', href: '/dashboard/error-logs', icon: '🐛' },
                ].map((link, i) => (
                  <a key={i} href={link.href}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 20 }}>{link.icon}</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
