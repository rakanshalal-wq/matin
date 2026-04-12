'use client';

export default function OwnerDashboard() {
  const stats = [
    { label: 'إجمالي المؤسسات', value: '0', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>, color: '#D4A843' },
    { label: 'المشتركون النشطون', value: '0', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, color: '#10B981' },
    { label: 'الإيرادات الشهرية', value: '0 ر.س', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#0EA5E9' },
    { label: 'المستخدمون', value: '0', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>, color: '#A78BFA' },
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
            { label: 'إضافة مؤسسة', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14 M5 12h14"/></svg>, color: '#D4A843' },
            { label: 'إدارة الباقات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, color: '#10B981' },
            { label: 'التقارير', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6"/></svg>, color: '#0EA5E9' },
            { label: 'الإعدادات', icon: <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, color: '#A78BFA' },
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
