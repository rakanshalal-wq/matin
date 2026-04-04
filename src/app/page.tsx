import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'متين — منصة إدارة المؤسسات التعليمية',
  description: 'منصة SaaS متكاملة للمدارس والجامعات والمعاهد ومراكز التدريب وتحفيظ القرآن',
};

const SECTORS = [
  { icon: '🏫', title: 'المدارس',           color: '#34D399', desc: 'إدارة شاملة للمدارس الحكومية والخاصة' },
  { icon: '🎓', title: 'الجامعات',          color: '#0EA5E9', desc: 'حلول متكاملة للتعليم العالي والبحث' },
  { icon: '📚', title: 'المعاهد التقنية',   color: '#22D3EE', desc: 'التعليم المهني والتدريب التقني' },
  { icon: '🏋️', title: 'مراكز التدريب',     color: '#FB923C', desc: 'إدارة الدورات والمتدربين والمدربين' },
  { icon: '📖', title: 'تحفيظ القرآن',     color: '#059669', desc: 'حلقات تحفيظ القرآن الكريم والمتابعة' },
];

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      color: '#F8FAFC',
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      direction: 'rtl',
    }}>
      {/* ─── Navbar ─── */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        borderBottom: '1px solid #334155',
        background: 'rgba(15,23,42,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4A843, #B8922E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '1.1rem', color: '#fff',
          }}>م</span>
          <span style={{ fontWeight: '700', fontSize: '1.3rem', color: '#D4A843' }}>متين</span>
        </div>
        <Link href="/login" style={{
          background: 'linear-gradient(135deg, #D4A843, #B8922E)',
          color: '#fff', padding: '0.6rem 1.5rem',
          borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem',
          textDecoration: 'none',
        }}>
          تسجيل الدخول
        </Link>
      </nav>

      {/* ─── Hero ─── */}
      <section style={{
        padding: '5rem 2rem 3rem',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(212,168,67,0.12)',
          border: '1px solid rgba(212,168,67,0.3)',
          borderRadius: '20px',
          padding: '0.4rem 1rem',
          fontSize: '0.85rem',
          color: '#D4A843',
          marginBottom: '1.5rem',
        }}>
          منصة SaaS تعليمية متكاملة
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '800',
          lineHeight: '1.2',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #CBD5E1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          إدارة مؤسستك التعليمية<br />
          <span style={{ color: '#D4A843', WebkitTextFillColor: '#D4A843' }}>بذكاء وسهولة</span>
        </h1>

        <p style={{
          color: '#94A3B8',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          marginBottom: '2.5rem',
        }}>
          سجّل مؤسستك التعليمية واحصل على نظام متكامل لإدارة الطلاب والمعلمين
          والموارد البشرية والمالية — كل شيء في مكان واحد.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #D4A843, #B8922E)',
            color: '#fff', padding: '0.875rem 2rem',
            borderRadius: '10px', fontWeight: '700', fontSize: '1rem',
            textDecoration: 'none', transition: 'transform 0.2s',
          }}>
            ابدأ الآن مجاناً
          </Link>
          <a href="#sectors" style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid #334155',
            color: '#CBD5E1', padding: '0.875rem 2rem',
            borderRadius: '10px', fontWeight: '600', fontSize: '1rem',
            textDecoration: 'none',
          }}>
            استعرض القطاعات
          </a>
        </div>
      </section>

      {/* ─── Sectors ─── */}
      <section id="sectors" style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          القطاعات التعليمية
        </h2>
        <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '3rem' }}>
          منصة واحدة تخدم جميع أنواع المؤسسات التعليمية
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}>
          {SECTORS.map((s) => (
            <div key={s.title} style={{
              background: '#1E293B',
              border: `1px solid #334155`,
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
              transition: 'transform 0.2s, border-color 0.2s',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
              <h3 style={{ color: s.color, fontWeight: '700', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: '1.6' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#475569',
        fontSize: '0.875rem',
        borderTop: '1px solid #334155',
        marginTop: '3rem',
      }}>
        © 2026 متين — جميع الحقوق محفوظة | صنع في المملكة العربية السعودية
      </footer>
    </div>
  );
}
