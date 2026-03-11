'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'ما هو متين؟',
      a: 'متين هو نظام إدارة تعليمية سعودي متكامل يساعد المدارس والجامعات والمعاهد على إدارة جميع عملياتها من مكان واحد.'
    },
    {
      q: 'كم تكلفة الاشتراك؟',
      a: 'نقدم 3 خطط: خطة مجانية للبداية، خطة متقدمة 299 ر.س/شهر، وخطة مؤسسية 599 ر.س/شهر. جميع الخطط تأتي مع تجربة مجانية 30 يوم.'
    },
    {
      q: 'هل يدعم النظام اللغة العربية؟',
      a: 'نعم! متين مصمم خصيصاً للسوق السعودي ويدعم اللغة العربية بالكامل مع التقويم الهجري وجميع المتطلبات المحلية.'
    },
    {
      q: 'هل يمكن التكامل مع الأنظمة الحكومية؟',
      a: 'نعم، متين يتكامل مع نفاذ، نور، وأبشر لضمان التوافق الكامل مع الأنظمة الحكومية.'
    },
    {
      q: 'كيف يتم حماية البيانات؟',
      a: 'نستخدم أعلى معايير الأمان بما في ذلك التشفير الكامل، نسخ احتياطي يومي، وحماية Cloudflare ضد الهجمات.'
    },
    {
      q: 'هل يوجد دعم فني؟',
      a: 'نعم! نقدم دعم فني 24/7 عبر البريد الإلكتروني، الهاتف، والدردشة المباشرة لجميع العملاء.'
    },
    {
      q: 'هل يمكن تجربة النظام قبل الشراء؟',
      a: 'بالتأكيد! نقدم تجربة مجانية 30 يوم بدون الحاجة لبطاقة ائتمانية.'
    },
    {
      q: 'كم يستغرق تفعيل النظام؟',
      a: 'يمكنك البدء فوراً بعد التسجيل. سيتم إعداد حسابك خلال دقائق.'
    }
  ];

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
          }}>الأسئلة الشائعة</div>
          
          <h1 style={{ fontSize: 42, fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.3 }}>
            كل ما تحتاج <span style={{ color: '#C9A227' }}>معرفته</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.8)', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
            إجابات سريعة على أكثر الأسئلة شيوعاً حول متين
          </p>
        </section>

        {/* FAQ */}
        <section style={{ padding: '0 24px 80px', maxWidth: 800, margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                marginBottom: 16,
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 600, textAlign: 'right' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#C9A227', transition: 'transform 0.3s', transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)' }}>
                  ▼
                </span>
              </button>
              
              {openIndex === index && (
                <div style={{ padding: '0 24px 20px', fontSize: 15, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={{ padding: '60px 24px 80px', textAlign: 'center' }}>
          <div style={{ 
            maxWidth: 600,
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201, 162, 39, 0.3)',
            borderRadius: 12,
            padding: 40
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 12 }}>
              لم تجد إجابتك؟
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 24 }}>
              تواصل معنا وسنكون سعداء بمساعدتك
            </p>
            <Link href="/contact" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #C9A227 0%, #D4B03D 100%)',
              borderRadius: 8,
              color: '#0D1B2A',
              textDecoration: 'none',
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(201, 162, 39, 0.4)'
            }}>
              <span>تواصل معنا</span>
              <span>📧</span>
            </Link>
          </div>
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
