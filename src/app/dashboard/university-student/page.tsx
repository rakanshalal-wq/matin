export default function Dashboard() {
  const stats = [{"label":"المعدل","color":"#3B82F6","value":"3.75"},{"label":"الساعات","color":"#60A5FA","value":"95"},{"label":"المقررات","color":"#A78BFA","value":"6"},{"label":"الواجبات","color":"#D4A843","value":"4"}];
  return (
    \u003cdiv dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: '#06060E', color: '#EEEEF5', minHeight: '100vh', display: 'flex' }}>
      \u003caside style={{ width: 260, flexShrink: 0, height: '100vh', background: '#08081A', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
        \u003cdiv style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          \u003cdiv style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            \u003cdiv style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #D4A843, #E8C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م\u003c/div\u003e
            \u003cdiv\u003e\u003cdiv style={{ fontSize: 17, fontWeight: 800 }}\u003eمتين\u003c/div\u003e\u003c/div\u003e
          \u003c/div\u003e
        \u003c/div\u003e
        \u003cnav style={{ flex: 1, padding: '6px 0' }}\u003e
          {['النظرة العامة', 'الكليات', 'الطلاب', 'الهيئة', 'المناهج', 'البحث'].map((item, i) => (
            \u003cdiv key={i} style={{ padding: '8px 16px', fontSize: 12, color: i === 0 ? '#EEEEF5' : 'rgba(238,238,245,0.55)', cursor: 'pointer', borderRight: i === 0 ? '3px solid #3B82F6' : 'none', background: i === 0 ? '#3B82F620' : 'transparent' }}\u003e{item}\u003c/div\u003e
          ))}
        \u003c/nav\u003e
      \u003c/aside\u003e
      \u003cmain style={{ flex: 1, padding: 24 }}\u003e
        \u003ch1 style={{ fontSize: 24, fontWeight: 800, color: '#3B82F6', marginBottom: 24 }}\u003eبوابة الطالب الجامعي\u003c/h1\u003e
        \u003cdiv style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}\u003e
          {stats.map((stat, i) => (
            \u003cdiv key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: 14 }}\u003e
              \u003cdiv style={{ fontSize: 24, fontWeight: 800, color: stat.color }}\u003e{stat.value}\u003c/div\u003e
              \u003cdiv style={{ fontSize: 11, color: 'rgba(238,238,245,0.55)' }}\u003e{stat.label}\u003c/div\u003e
            \u003c/div\u003e
          ))}
        \u003c/div\u003e
      \u003c/main\u003e
    \u003c/div\u003e
  );
}
