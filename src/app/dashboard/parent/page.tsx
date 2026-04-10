export default function ParentDashboard() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: '#06060E', color: '#EEEEF5', minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 260, flexShrink: 0, height: '100vh', background: '#08081A', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #D4A843, #E8C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>متين</div>
              <div style={{ fontSize: 9, color: 'rgba(238,238,245,0.55)' }}>ولي أمر</div>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '6px 0' }}>
          {['النظرة العامة', 'أبنائي', 'الجداول', 'الدرجات', 'الحضور', 'الدفعات', 'الرسائل', 'الإشعارات'].map((item, i) => (
            <div key={i} style={{ padding: '8px 16px', fontSize: 12, color: i === 0 ? '#EEEEF5' : 'rgba(238,238,245,0.55)', cursor: 'pointer', borderRight: i === 0 ? '3px solid #A78BFA' : 'none', background: i === 0 ? 'rgba(167,139,250,0.1)' : 'transparent' }}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#A78BFA', marginBottom: 24 }}>لوحة ولي الأمر</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'أبنائي', value: '3', color: '#A78BFA' },
            { label: 'الحضور', value: '94%', color: '#10B981' },
            { label: 'المبالغ المستحقة', value: '2,500', color: '#EF4444' },
            { label: 'رسائل جديدة', value: '5', color: '#60A5FA' },
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
