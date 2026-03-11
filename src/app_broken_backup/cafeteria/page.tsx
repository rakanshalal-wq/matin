import Link from 'next/link';

export default function CafeteriaPage() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh', color: 'white', fontFamily: "'IBM Plex Sans Arabic', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🍽️</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 20 }}>
            <span style={{ color: '#C9A227' }}>الكافتيريا</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, margin: '0 auto' }}>
            القوائم والطلبات والدفع الإلكتروني
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 60 }}>
          {[
            { icon: '📋', title: 'القوائم اليومية', desc: 'عرض قوائم الطعام والأسعار' },
            { icon: '📱', title: 'الطلب المسبق', desc: 'طلب الوجبات من الجوال' },
            { icon: '💳', title: 'الدفع الإلكتروني', desc: 'دفع آمن عبر النظام' },
            { icon: '⚠️', title: 'الحساسية الغذائية', desc: 'تتبع حساسية الطلاب' },
            { icon: '📊', title: 'التقارير المالية', desc: 'تقارير المبيعات اليومية' },
            { icon: '🍎', title: 'التغذية الصحية', desc: 'وجبات متوازنة وصحية' }
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
