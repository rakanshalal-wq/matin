import Link from 'next/link';

const colors = {
  primary: '#34D399',
  primary2: '#059669',
  primaryDim: 'rgba(52,211,153,0.1)',
  primaryBorder: 'rgba(52,211,153,0.22)',
  gold: '#D4A843',
  bg: '#06060E',
  sidebar: '#070F0A',
  card: 'rgba(255,255,255,0.025)',
  border: 'rgba(255,255,255,0.07)',
  text: '#EEEEF5',
  textDim: 'rgba(238,238,245,0.55)',
  green: '#10B981',
  blue: '#60A5FA',
  red: '#EF4444',
};

export default function SchoolOwnerDashboard() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: colors.bg, color: colors.text, minHeight: '100vh', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700,800&display=swap" rel="stylesheet" />
      
      {/* Sidebar */}
      <aside style={{ width: 266, flexShrink: 0, height: '100vh', background: colors.sidebar, borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 14, borderBottom: `1px solid ${colors.border}` }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${colors.gold}, #E8C060)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>متين</div>
              <div style={{ fontSize: 9, color: colors.textDim }}>مدرسة الأمل</div>
            </div>
          </Link>
        </div>
        
        <nav style={{ flex: 1, padding: '10px 0' }}>
          {['النظرة العامة', 'الطلاب', 'المعلمين', 'الجداول', 'المناهج', 'التقييم', 'المالية', 'النقل', 'الصحة', 'الإعدادات'].map((item, i) => (
            <div key={i} style={{ padding: '8px 16px', color: i === 0 ? colors.primary : colors.textDim, cursor: 'pointer', borderRight: i === 0 ? `3px solid ${colors.primary}` : 'none', background: i === 0 ? colors.primaryDim : 'transparent' }}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: colors.primary, marginBottom: 24 }}>لوحة مالك المدرسة</h1>
        
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'الطلاب', value: '1,247', icon: '👨🎓', color: colors.primary },
            { label: 'المعلمين', value: '89', icon: '👨🏫', color: colors.blue },
            { label: 'الفصول', value: '42', icon: '📚', color: colors.green },
            { label: 'التحصيل', value: '84%', icon: '💰', color: colors.gold },
          ].map((stat, i) => (
            <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: colors.textDim }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary2})`, border: 'none', borderRadius: 8, padding: '10px 20px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            + إضافة طالب
          </button>
          <button style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 20px', color: colors.text, cursor: 'pointer' }}>
            📊 التقارير
          </button>
          <button style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 8, padding: '10px 20px', color: colors.text, cursor: 'pointer' }}>
            📢 إعلان جديد
          </button>
        </div>
      </main>
    </div>
  );
}
