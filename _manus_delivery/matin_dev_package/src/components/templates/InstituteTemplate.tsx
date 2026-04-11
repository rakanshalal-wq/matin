"use client";

import React from 'react';
import LibrarySection from './LibrarySection';

interface InstituteTemplateProps {
  data: {
    name: string;
    logo?: string;
    cover_image?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    font_family?: string;
    show_global_ads?: boolean;
  };
  globalAds?: any[];
  globalProducts?: any[];
  globalLibrary?: any[];
}

const InstituteTemplate: React.FC<InstituteTemplateProps> = ({ data, globalAds, globalProducts, globalLibrary }) => {
  const primaryColor = data.primary_color || '#10B981';
  const secondaryColor = data.secondary_color || '#064E3B';
  const fontFamily = data.font_family || 'IBM Plex Sans Arabic';

  return (
    <div style={{ background: '#0A0F1C', color: '#fff', minHeight: '100vh', direction: 'rtl', fontFamily: fontFamily }}>
      {/* Navigation */}
      <nav style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'fixed', top: 0, width: '100%', zIndex: 100, background: 'rgba(10,15,28,0.8)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: primaryColor, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
            {data.logo ? <img src={data.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '10px' }} /> : data.name?.charAt(0)}
          </div>
          <span style={{ fontSize: '20px', fontWeight: 900 }}>{data.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#about" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>عن المعهد</a>
          <a href="#store" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>المتجر</a>
          <a href="#library" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>المكتبة</a>
          <button style={{ background: primaryColor, color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>تسجيل الدخول</button>
        </div>
      </nav>

      {/* Global Ads (Sultah Olia) */}
      {data.show_global_ads && globalAds && globalAds.length > 0 && (
        <div style={{ marginTop: '80px', background: 'linear-gradient(90deg, #10B981, #34D399)', color: '#000', padding: '12px', textAlign: 'center', fontWeight: 900, fontSize: '14px', position: 'relative', zIndex: 90 }}>
          📢 إعلان مركزي من متين: {globalAds[0].text} | <a href={globalAds[0].link} style={{ color: '#000', fontWeight: 900, textDecoration: 'underline' }}>اكتشف المزيد</a>
        </div>
      )}

      {/* Hero Section */}
      <section id="about" style={{ paddingTop: data.show_global_ads ? '40px' : '120px', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${primaryColor}15`, border: `1px solid ${primaryColor}30`, borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: primaryColor, fontWeight: 700, marginBottom: '24px' }}>
              مرحباً بكم في {data.name}
            </div>
            <h1 style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px' }}>
              نطور المهارات <br /><span style={{ color: primaryColor }}>بمعايير عالمية</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '520px' }}>
              {data.description || 'نحن متخصصون في تقديم برامج تدريبية متقدمة تجمع بين النظرية والتطبيق العملي لتطوير كفاءات المتدربين.'}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button style={{ background: primaryColor, color: '#000', border: 'none', borderRadius: '12px', padding: '14px 32px', fontSize: '16px', fontWeight: 800, cursor: 'pointer' }}>التحق الآن</button>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 28px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>تعرف على البرامج</button>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100%', height: '400px', borderRadius: '30px', background: `linear-gradient(45deg, ${primaryColor}20, ${secondaryColor}20)`, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              {data.cover_image ? <img src={data.cover_image} alt="Institute" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>🏢</div>}
            </div>
          </div>
        </div>
      </section>

      {/* Global Store Products (Sultah Olia) */}
      <section id="store" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: 900 }}>متجر متين التدريبي</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>منتجات وخدمات تدريبية مختارة بعناية</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {globalProducts && globalProducts.length > 0 ? globalProducts.map((p: any, i: number) => (
              <div key={i} style={{ background: '#131C2E', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '20px', transition: 'transform 0.3s' }}>
                <div style={{ height: '180px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>📚</div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{p.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: primaryColor, fontWeight: 900, fontSize: '20px' }}>{p.price} ر.س</span>
                  <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>إضافة</button>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: 'span 4', textAlign: 'center', color: 'rgba(255,255,255,0.2)', padding: '40px' }}>لا توجد منتجات معروضة حالياً</div>
            )}
          </div>
        </div>
      </section>

      {/* Library Section (Sultah Olia) */}
      <div id="library">
        <LibrarySection items={globalLibrary || []} primaryColor={primaryColor} institutionName={data.name} />
      </div>

      {/* Footer */}
      <footer style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: '#080C16' }}>
        <div style={{ fontSize: '18px', fontWeight: 900, marginBottom: '12px' }}>{data.name}</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>جميع الحقوق محفوظة © {new Date().getFullYear()} - مدعوم تقنياً بواسطة منصة متين التعليمية</p>
      </footer>
    </div>
  );
};

export default InstituteTemplate;
