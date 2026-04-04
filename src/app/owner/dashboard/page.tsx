'use client';

export default function OwnerDashboard() {
  const stats = [
    { label: 'إجمالي المؤسسات', value: '0', icon: '🏛️', color: '#D4A843' },
    { label: 'المشتركون النشطون', value: '0', icon: '✅', color: '#10B981' },
    { label: 'الإيرادات الشهرية', value: '0 ر.س', icon: '💰', color: '#0EA5E9' },
    { label: 'المستخدمون', value: '0', icon: '👥', color: '#A78BFA' },
  ];

  return (
    <div style={{ direction: 'rtl', fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#D4A843', margin: 0 }}>
          لوحة تحكم مالك المنصة
        </h1>
        <p style={{ color: '#94A3B8', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          متين — نظرة شاملة على جميع المؤسسات التعليمية
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: s.color, marginBottom: '0.25rem' }}>{s.value}</div>
            <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '12px', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '1rem' }}>الإجراءات السريعة</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {[
            { label: 'إضافة مؤسسة', icon: '➕', color: '#D4A843' },
            { label: 'إدارة الباقات', icon: '📦', color: '#10B981' },
            { label: 'التقارير', icon: '📊', color: '#0EA5E9' },
            { label: 'الإعدادات', icon: '⚙️', color: '#A78BFA' },
          ].map((a) => (
            <div key={a.label} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid #334155',
              borderRadius: '10px', padding: '1rem', textAlign: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{a.icon}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: '600' }}>{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
