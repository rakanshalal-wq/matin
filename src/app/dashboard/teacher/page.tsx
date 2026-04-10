import Link from 'next/link';

const colors = {
  accent: '#4ADE80',
  accent2: '#22C55E',
  accentDim: 'rgba(74,222,128,0.1)',
  accentBorder: 'rgba(74,222,128,0.22)',
  gold: '#D4A843',
  bg: '#06060E',
  sidebar: '#08081A',
  card: 'rgba(255,255,255,0.025)',
  border: 'rgba(255,255,255,0.07)',
  text: '#EEEEF5',
  textDim: 'rgba(238,238,245,0.55)',
  green: '#10B981',
  red: '#EF4444',
  blue: '#60A5FA',
};

export default function TeacherDashboard() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: colors.bg, color: colors.text, minHeight: '100vh', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <aside style={{ width: 260, flexShrink: 0, height: '100vh', background: colors.sidebar, borderLeft: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px 12px', borderBottom: `1px solid ${colors.border}` }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${colors.gold}, #E8C060)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: colors.text }}>متين</div>
              <div style={{ fontSize: 9, color: colors.textDim }}>مدرسة الأمل</div>
            </div>
          </Link>
          
          <div style={{ background: colors.accentDim, border: `1px solid ${colors.accentBorder}`, borderRadius: 9, padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(74,222,128,0.12)', border: `1px solid ${colors.accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👨🏫</div>
            <div>
              <div style={{ color: colors.text, fontSize: 12.5, fontWeight: 700 }}>أحمد محمد</div>
              <div style={{ color: colors.accent, fontSize: 10.5, fontWeight: 600 }}>معلم الرياضيات</div>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '6px 0' }}>
          {['النظرة العامة', 'جدولي', 'فصولي', 'الطلاب', 'الحضور', 'التقييم', 'الواجبات', 'الرسائل', 'التقارير'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 14px', fontSize: 12, color: i === 0 ? colors.text : colors.textDim, cursor: 'pointer', borderRight: i === 0 ? `3px solid ${colors.accent}` : 'none', background: i === 0 ? colors.accentDim : 'transparent', fontWeight: i === 0 ? 600 : 400 }}>
              <span>{['📊', '📅', '🏫', '👨🎓', '✅', '📝', '📚', '💬', '📈'][i]}</span>
              <span>{item}</span>
            </div>
          ))}
        </nav>
        
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${colors.border}` }}>
          <button style={{ width: '100%', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 8, padding: '8px 12px', color: '#F87171', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>🚪 تسجيل الخروج</button>
        </div>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: 62, background: 'rgba(6,6,14,0.88)', backdropFilter: 'blur(24px)', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: colors.text }}>لوحة المعلم</div>
            <div style={{ fontSize: 10.5, color: 'rgba(238,238,245,0.35)' }}>الأحد، 10 أبريل 2026</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <button style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}`, borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              🔔<span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: colors.red, border: `1.5px solid ${colors.bg}` }} />
            </button>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${colors.border}`, borderRadius: 10, padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(74,222,128,0.1)', border: `1.5px solid rgba(74,222,128,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>👨🏫</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>أحمد محمد</div>
                <div style={{ fontSize: 9.5, color: colors.accent, fontWeight: 700 }}>معلم</div>
              </div>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, padding: 18, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'طلابي', value: '87', icon: '👨🎓', color: colors.accent },
              { label: 'الحضور اليوم', value: '94%', icon: '✅', color: colors.green },
              { label: 'واجبات للتصحيح', value: '12', icon: '📝', color: colors.gold },
              { label: 'رسائل جديدة', value: '3', icon: '💬', color: colors.blue },
            ].map((stat, i) => (
              <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 11, padding: 14 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: colors.textDim }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 13, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: colors.textDim, fontWeight: 700, marginBottom: 12 }}>📅 جدول اليوم</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {[
                { time: '07:30 - 08:15', subject: 'الرياضيات', class: 'ثالث ثانوي - أ', status: 'done' },
                { time: '08:20 - 09:05', subject: 'الرياضيات', class: 'ثالث ثانوي - ب', status: 'current' },
                { time: '09:10 - 09:55', subject: 'فصلة', class: 'استراحة', status: 'free' },
                { time: '10:00 - 10:45', subject: 'الرياضيات', class: 'ثاني ثانوي - أ', status: 'upcoming' },
              ].map((period, i) => (
                <div key={i} style={{ borderRadius: 10, padding: '10px 14px', minWidth: 140, border: period.status === 'current' ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`, background: period.status === 'current' ? 'rgba(74,222,128,0.06)' : period.status === 'done' ? 'rgba(255,255,255,0.02)' : colors.card, opacity: period.status === 'done' ? 0.6 : 1 }}>
                  <div style={{ fontSize: 10, color: colors.textDim, fontWeight: 600, marginBottom: 4 }}>{period.time}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{period.subject}</div>
                  <div style={{ fontSize: 11, color: colors.textDim, marginTop: 2 }}>{period.class}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent2})`, border: 'none', borderRadius: 9, padding: '10px 20px', color: '#04190E', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ تسجيل حضور</button>
            <button style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '10px 20px', color: colors.text, fontSize: 13, cursor: 'pointer' }}>📝 رصد درجات</button>
            <button style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '10px 20px', color: colors.text, fontSize: 13, cursor: 'pointer' }}>📚 إضافة واجب</button>
          </div>
        </div>
      </main>
    </div>
  );
}
