'use client';
import Link from 'next/link';
import { useState } from 'react';

const POSTS = [
  { id: 1, author: 'أحمد المنصور', role: 'مدير مدرسة', time: 'منذ ساعتين', title: 'تجربتي مع نظام الحضور الذكي', content: 'بعد 3 أشهر من استخدام متين، انخفضت نسبة الغياب غير المبرر بنسبة 40%. النظام يرسل تنبيهات فورية لأولياء الأمور.', likes: 24, replies: 8, tag: 'تجارب' },
  { id: 2, author: 'سارة الزهراني', role: 'معلمة رياضيات', time: 'منذ 5 ساعات', title: 'كيف أستخدم بنك الأسئلة لتوفير الوقت', content: 'أشارك معكم طريقتي في بناء بنك أسئلة شامل يوفر عليّ ساعات في إعداد الاختبارات. الذكاء الاصطناعي يساعد في التنويع.', likes: 31, replies: 12, tag: 'نصائح' },
  { id: 3, author: 'محمد العتيبي', role: 'ولي أمر', time: 'أمس', title: 'تطبيق الجوال غيّر طريقة تواصلنا', content: 'الآن أعرف درجات ابني فور صدورها، وأتلقى إشعاراً فور وصوله للمدرسة. الشفافية مع المدرسة وصلت لمستوى لم أتخيله.', likes: 45, replies: 19, tag: 'تجارب' },
];

const TAGS = ['الكل', 'تجارب', 'نصائح', 'أسئلة', 'تحديثات'];

export default function CommunityPage() {
  const [activeTag, setActiveTag] = useState('الكل');
  const navLinkStyle: React.CSSProperties = { color: 'rgba(238,238,245,0.65)', textDecoration: 'none', fontSize: 14, fontWeight: 500 };
  const filtered = activeTag === 'الكل' ? POSTS : POSTS.filter(p => p.tag === activeTag);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ background: '#06060E', minHeight: '100vh', color: '#EEEEF5', fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl', paddingTop: 64 }}>

        <nav style={{ position: 'fixed', top: 0, right: 0, left: 0, zIndex: 200, height: 64, display: 'flex', alignItems: 'center', padding: '0 48px', gap: 40, background: 'rgba(6,6,14,0.92)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#EEEEF5', fontSize: 19, fontWeight: 800 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: '#000' }}>م</div>
            متين
          </Link>
          <div style={{ display: 'flex', gap: 28, flex: 1 }}>
            <Link href="/features" style={navLinkStyle}>المميزات</Link>
            <Link href="/pricing" style={navLinkStyle}>الأسعار</Link>
            <Link href="/community" style={{ ...navLinkStyle, color: '#C9A84C' }}>المجتمع</Link>
            <Link href="/about" style={navLinkStyle}>عن متين</Link>
            <Link href="/contact" style={navLinkStyle}>تواصل معنا</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
            <Link href="/login" style={{ padding: '8px 18px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(238,238,245,0.65)', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}>تسجيل الدخول</Link>
            <Link href="/register" style={{ padding: '8px 20px', borderRadius: 9, background: '#C9A84C', color: '#000', fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>ابدأ مجاناً</Link>
          </div>
        </nav>

        <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11.5, fontWeight: 700, color: '#C9A84C', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>الملتقى المجتمعي</div>
          <h1 style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, color: '#EEEEF5', margin: 0 }}>
            مجتمع{' '}
            <span style={{ background: 'linear-gradient(90deg,#C9A84C,#E2C46A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>متين</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(238,238,245,0.65)', maxWidth: 560, margin: '16px auto 0', lineHeight: 1.8 }}>تبادل الخبرات مع آلاف المربين والإداريين في المملكة.</p>
        </section>

        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)' }} />

        <section style={{ padding: '40px 24px', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {TAGS.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)} style={{ padding: '8px 18px', borderRadius: 100, border: `1px solid ${activeTag === tag ? '#C9A84C' : 'rgba(255,255,255,0.06)'}`, background: activeTag === tag ? 'rgba(201,168,76,0.15)' : 'transparent', color: activeTag === tag ? '#C9A84C' : 'rgba(238,238,245,0.5)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
                {tag}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map(post => (
              <div key={post.id} style={{ background: '#0B0B16', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#C9A84C,#E2C46A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#000', flexShrink: 0 }}>{post.author[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#EEEEF5' }}>{post.author}</div>
                    <div style={{ fontSize: 12, color: 'rgba(238,238,245,0.4)' }}>{post.role} · {post.time}</div>
                  </div>
                  <span style={{ marginRight: 'auto', padding: '4px 12px', borderRadius: 100, background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontSize: 11, fontWeight: 700 }}>{post.tag}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#EEEEF5', marginBottom: 10 }}>{post.title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(238,238,245,0.65)', lineHeight: 1.7, marginBottom: 16 }}>{post.content}</p>
                <div style={{ display: 'flex', gap: 20 }}>
                  <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)' }}>❤️ {post.likes}</span>
                  <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.4)' }}>💬 {post.replies} رد</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)' }}>© {new Date().getFullYear()} منصة متين. جميع الحقوق محفوظة.</span>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/privacy" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>سياسة الخصوصية</Link>
            <Link href="/terms" style={{ fontSize: 13, color: 'rgba(238,238,245,0.35)', textDecoration: 'none' }}>الشروط والأحكام</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
