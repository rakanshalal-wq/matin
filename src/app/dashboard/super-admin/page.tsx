export default function SuperAdminDashboard() {
  return (
    <div dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", background: '#06060E', color: '#EEEEF5', minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: 260, flexShrink: 0, height: '100vh', background: '#08081A', borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #D4A843, #E8C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#000' }}>م</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800 }}>متين</div>
              <div style={{ fontSize: 9, color: 'rgba(238,238,245,0.55)' }}>مالك المنصة</div>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '6px 0' }}>
          {['النظرة العامة', 'المؤسسات', 'المستخدمون', 'الاشتراكات', 'المالية', 'التقارير', 'الإعدادات', 'الدعم'].map((item, i) => (
            <div key={i} style={{ padding: '8px 16px', fontSize: 12, color: i === 0 ? '#EEEEF5' : 'rgba(238,238,245,0.55)', cursor: 'pointer', borderRight: i === 0 ? '3px solid #D4A843' : 'none', background: i === 0 ? 'rgba(212,168,67,0.1)' : 'transparent' }}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#D4A843', marginBottom: 24 }}>داشبورد مالك المنصة</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'المؤسسات', value: '156', color: '#D4A843' },
            { label: 'المستخدمون', value: '12,450', color: '#E8C060' },
            { label: 'الاشتراكات النشطة', value: '89', color: '#10B981' },
            { label: 'الإيرادات الشهرية', value: '45,200', color: '#60A5FA' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 11, padding: 14 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(238,238,245,0.55)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📈 نمو المؤسسات</div>
            <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, #D4A843, #E8C060)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🏫 آخر المؤسسات المضافة</div>
            {['مدرسة الأمل', 'جامعة الرشيد', 'معهد الإتقان', 'مركز الإبداع'].map((school, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,168,67,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🏫</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{school}</div>
                  <div style={{ fontSize: 10, color: 'rgba(238,238,245,0.4)' }}>تم الإضافة اليوم</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
