export default function SchoolPublic() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: '#06060E', color: '#EEEEF5', minHeight: '100vh' }}>
      <header style={{ height: 70, background: 'rgba(6,6,14,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #34D399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>م</div>
          <span style={{ fontSize: 18, fontWeight: 800 }}>مدرسة الأمل</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['الرئيسية', 'عن المدرسة', 'البرامج', 'التواصل'].map((item, i) => (
            <a key={i} href="#" style={{ color: 'rgba(238,238,245,0.8)', textDecoration: 'none', fontSize: 14 }}>{item}</a>
          ))}
        </div>
      </header>

      <div style={{ padding: '100px 5%', textAlign: 'center', background: 'radial-gradient(circle at 50% 0%, rgba(52,211,153,0.1) 0%, transparent 50%)' }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, marginBottom: 20 }}>مدرسة الأمل الدولية</h1>
        <p style={{ fontSize: 18, color: 'rgba(238,238,245,0.6)', maxWidth: 600, margin: '0 auto 40px' }}>نحو تعليم متميز يبني جيلاً واعياً ومبدعاً</p>
        
        <button style={{ background: 'linear-gradient(135deg, #34D399, #059669)', border: 'none', borderRadius: 12, padding: '14px 32px', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
          سجل الآن
        </button>
      </div>
    </div>
  );
}
