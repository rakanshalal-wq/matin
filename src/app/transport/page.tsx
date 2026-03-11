import Link from 'next/link';

export default function TransportPage() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh', color: 'white', fontFamily: "'IBM Plex Sans Arabic', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🚌</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 20 }}>
            النقل <span style={{ color: '#C9A227' }}>المدرسي</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, margin: '0 auto' }}>
            تتبع GPS مباشر وإشعارات فورية عند الوصول
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 60 }}>
          {[
            { icon: '📍', title: 'تتبع GPS مباشر', desc: 'موقع الباص لحظياً على الخريطة' },
            { icon: '🔔', title: 'إشعارات فورية', desc: 'تنبيهات عند الوصول والمغادرة' },
            { icon: '🗺️', title: 'الخطوط والمحطات', desc: 'إدارة خطوط السير والمحطات' },
            { icon: '👨‍✈️', title: 'السائقين والمشرفين', desc: 'بيانات السائقين والمشرفات' },
            { icon: '📊', title: 'التقارير', desc: 'تقارير يومية عن الرحلات' },
            { icon: '⏱️', title: 'الالتزام بالمواعيد', desc: 'متابعة دقة مواعيد الوصول' }
          ].map((item, i) => (
            <div key={i} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(201, 162, 39, 0.2)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)', color: '#0D1B2A', borderRadius: 12, textDecoration: 'none', fontSize: 18, fontWeight: 700 }}>
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
