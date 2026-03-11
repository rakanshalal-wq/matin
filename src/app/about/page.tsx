'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #243B53 100%)', minHeight: '100vh' }} dir="rtl">
        
        {/* NAVBAR */}
        <nav style={{ 
          position: 'sticky', 
          top: 0, 
          background: 'rgba(13, 27, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
          zIndex: 1000,
          padding: '16px 0'
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 700,
                color: '#0D1B2A',
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
              }}>م</div>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#C9A227' }}>متين</span>
            </Link>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/" style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #C9A227',
                borderRadius: 6,
                color: '#C9A227',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600
              }}>الرئيسية</Link>
              
              <Link href="/login" style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
                borderRadius: 6,
                color: '#0D1B2A',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(201, 162, 39, 0.3)'
              }}>تسجيل الدخول</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: '80px 24px 60px', maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '6px 14px',
            background: 'rgba(201, 162, 39, 0.1)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            borderRadius: 20,
            color: '#C9A227',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 24
          }}>من نحن</div>
          
          <h1 style={{ fontSize: 42, fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.3 }}>
            نحن <span style={{ color: '#C9A227' }}>متين</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.8)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
            نظام إدارة تعليمية سعودي متكامل يهدف إلى تحويل المؤسسات التعليمية إلى مدن ذكية
          </p>
        </section>

        {/* STORY */}
        <section style={{ padding: '60px 24px', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 40
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#C9A227', marginBottom: 20 }}>قصتنا 📖</h2>
            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8, marginBottom: 16 }}>
              بدأت رحلة متين من رؤية بسيطة: تسهيل الإدارة التعليمية في المملكة العربية السعودية. لاحظنا أن المدارس والجامعات والمعاهد تواجه تحديات كبيرة في إدارة العمليات اليومية - من تسجيل الطلاب إلى متابعة الأداء الأكاديمي.
            </p>
            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8, marginBottom: 16 }}>
              قررنا بناء نظام متكامل يجمع كل ما تحتاجه المؤسسة التعليمية في مكان واحد - نظام متين، قوي، وسهل الاستخدام.
            </p>
            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.8 }}>
              اليوم، نخدم أكثر من 24 مؤسسة تعليمية، 5000 طالب، و200 معلم في جميع أنحاء المملكة.
            </p>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section style={{ padding: '60px 24px', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            
            {/* Vision */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 32
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', marginBottom: 16 }}>رؤيتنا</h3>
              <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7 }}>
                أن نكون النظام الأول والأكثر ثقة لإدارة المؤسسات التعليمية في المملكة العربية السعودية بحلول 2030
              </p>
            </div>

            {/* Mission */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 32
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', marginBottom: 16 }}>رسالتنا</h3>
              <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7 }}>
                تمكين المؤسسات التعليمية من خلال تقديم حلول تقنية متكاملة تسهل العمليات الإدارية وتحسن جودة التعليم
              </p>
            </div>

            {/* Values */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 12,
              padding: 32
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>💎</div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#C9A227', marginBottom: 16 }}>قيمنا</h3>
              <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7 }}>
                الجودة، الابتكار، الشفافية، والالتزام بخدمة عملائنا وتحقيق نجاحهم
              </p>
            </div>

          </div>
        </section>

        {/* TEAM */}
        <section style={{ padding: '60px 24px', maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            فريق <span style={{ color: '#C9A227' }}>متين</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 40 }}>
            فريق من المتخصصين والخبراء في التعليم والتقنية
          </p>

          <div style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 32
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👨‍💼</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 8 }}>راكان شلال</h3>
            <p style={{ fontSize: 14, color: '#C9A227', marginBottom: 12 }}>المؤسس والرئيس التنفيذي</p>
            <p style={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
              رائد أعمال سعودي شغوف بالتقنية والتعليم، يعمل على تطوير حلول مبتكرة لتحسين التعليم في المملكة
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16 }}>
            جاهز للانضمام؟
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 32 }}>
            ابدأ رحلتك مع متين اليوم
          </p>
          <Link href="/register" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
            borderRadius: 8,
            color: '#0D1B2A',
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(201, 162, 39, 0.4)'
          }}>
            <span>ابدأ مجاناً</span>
            <span>🚀</span>
          </Link>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '40px 24px', borderTop: '1px solid rgba(201, 162, 39, 0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>
            © 2026 متين - جميع الحقوق محفوظة
          </p>
        </footer>

      </div>
    </>
  );
}
