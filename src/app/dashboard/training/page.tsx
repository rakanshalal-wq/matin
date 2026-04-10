export default function TrainingDashboard() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: '#06060E', color: '#EEEEF5', minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 260, flexShrink: 0, height: '100vh', background: '#08081A', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #D4A843, #E8C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>متين</div>
              <div style={{ fontSize: 9, color: 'rgba(238,238,245,0.55)' }}>مركز التميز</div>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '6px 0' }}>
          {['النظرة العامة', 'الدورات', 'المدربون', 'المتدربون', 'الجدول', 'الشهادات', 'التقييم', 'المالية'].map((item, i) => (
            <div key={i} style={{ padding: '8px 16px', fontSize: 12, color: i === 0 ? '#EEEEF5' : 'rgba(238,238,245,0.55)', cursor: 'pointer', borderRight: i === 0 ? '3px solid #FB923C' : 'none', background: i === 0 ? 'rgba(251,146,60,0.1)' : 'transparent' }}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#FB923C', marginBottom: 24 }}>لوحة مركز التدريب</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'الدورات', value: '24', color: '#FB923C' },
            { label: 'المتدربون', value: '340', color: '#F97316' },
            { label: 'المدربون', value: '18', color: '#EA580C' },
            { label: 'شهادات هذا الشهر', value: '45', color: '#D4A843' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: 14 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.55)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
