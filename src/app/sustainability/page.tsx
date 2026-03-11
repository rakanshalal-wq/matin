import Link from 'next/link';

export default function SustainabilityPage() {
  return (
    <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh', color: 'white', fontFamily: "'IBM Plex Sans Arabic', sans-serif", padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🌱</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 20 }}>
            الاستدامة <span style={{ color: '#C9A227' }}>البيئية</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)', maxWidth: 600, margin: '0 auto' }}>
            برامج توعية بيئية ومبادرات خضراء للمدارس
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, marginBottom: 60 }}>
          {[
            { icon: '♻️', title: 'إعادة التدوير', desc: 'برامج تدوير النفايات وفرز القمامة' },
            { icon: '💡', title: 'توفير الطاقة', desc: 'تقنيات ذكية لتوفير الكهرباء والماء' },
            { icon: '🌳', title: 'التشجير', desc: 'مبادرات زراعة الأشجار داخل المدرسة' },
            { icon: '📚', title: 'التوعية البيئية', desc: 'محاضرات وورش عمل بيئية' },
            { icon: '🚰', title: 'ترشيد المياه', desc: 'أنظمة ذكية لتوفير استهلاك المياه' },
            { icon: '☀️', title: 'الطاقة المتجددة', desc: 'ألواح شمسية وطاقة نظيفة' }
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
