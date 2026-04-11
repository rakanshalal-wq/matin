import React from 'react';

interface TrainingTemplateProps {
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
}

const TrainingTemplate: React.FC<TrainingTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const primaryColor = data.primary_color || '#E65100';
  const secondaryColor = data.secondary_color || '#EF6C00';
  const accentColor = data.accent_color || '#FFB74D';
  const fontFamily = data.font_family || 'IBM Plex Sans Arabic';

  return (
    <div style={{ 
      fontFamily: fontFamily, 
      backgroundColor: '#06060E', 
      color: '#EEEEF5',
      minHeight: '100vh',
      direction: 'rtl'
    }}>
      {/* CSS Variables for Dynamic Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --center-primary: ${primaryColor};
          --center-secondary: ${secondaryColor};
          --center-accent: ${accentColor};
          --b1: rgba(255,255,255,0.08);
          --b2: rgba(255,255,255,0.04);
          --t: #EEEEF5;
          --td: rgba(238,238,245,0.6);
          --tm: rgba(238,238,245,0.3);
          --card: rgba(255,255,255,0.03);
        }
      `}} />

      {/* Navigation */}
      <nav style={{ 
        position: 'fixed', top: 0, right: 0, left: 0, zIndex: 100, 
        backdropFilter: 'blur(20px) saturate(1.8)', background: 'rgba(6,6,14,.85)', 
        borderBottom: '1px solid var(--b1)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, color: '#fff' }}>
              {data.logo ? <img src={data.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '10px' }} /> : data.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>{data.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(238,238,245,.35)' }}>مركز تدريب معتمد</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {['الدورات', 'المدربون', 'عن المركز', 'اتصل بنا'].map((link, i) => (
              <div key={i} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--td)', cursor: 'pointer' }}>{link}</div>
            ))}
            <button style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, border: 'none', borderRadius: '9px', padding: '8px 18px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>بوابة المتدرب</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '120px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 460px', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `rgba(${primaryColor}, .1)`, border: `1px solid ${primaryColor}40`, borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: primaryColor, fontWeight: 600, marginBottom: '20px' }}>
              تطوير المهارات — مستقبل مهني واعد
            </div>
            <h1 style={{ fontSize: '46px', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px' }}>
              ارتقِ بمهاراتك مع <br /><em style={{ fontStyle: 'normal', color: primaryColor }}>{data.name}</em>
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--td)', lineHeight: 1.7, marginBottom: '28px', maxWidth: '480px' }}>
              {data.description || 'نقدم برامج تدريبية متطورة تلبي احتياجات سوق العمل وتساهم في تطوير قدرات الكوادر البشرية.'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, border: 'none', borderRadius: '12px', padding: '13px 28px', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>تصفح الدورات</button>
              <button style={{ background: 'rgba(255,255,255,.05)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '13px 24px', color: 'var(--td)', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>تواصل معنا</button>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid var(--b1)', borderRadius: '20px', padding: '20px' }}>
             <div style={{ height: '300px', borderRadius: '12px', background: `linear-gradient(45deg, ${primaryColor}15, ${secondaryColor}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {data.cover_image ? <img src={data.cover_image} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : <span style={{ fontSize: '40px' }}>🎯</span>}
             </div>
          </div>
        </div>
      </section>

      {/* Global Ads (Sultah Olia) */}
      {data.show_global_ads && globalAds && globalAds.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px', background: 'rgba(230,81,0,0.1)', border: '1px solid rgba(230,81,0,0.2)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📢</div>
           <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>إعلان من متين</div>
              <div style={{ fontSize: '14px', color: 'var(--td)' }}>{globalAds[0].text}</div>
           </div>
           <button style={{ background: primaryColor, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}>انضم الآن</button>
        </div>
      )}

      {/* Stats Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px', background: 'var(--card)', border: '1px solid var(--b1)', borderRadius: '16px', padding: '24px 36px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'دورة تدريبية', value: '150+' },
          { label: 'متدرب نشط', value: '12,000+' },
          { label: 'مدرب خبير', value: '45' },
          { label: 'ساعة تدريبية', value: '3,500+' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center', borderLeft: i < 3 ? '1px solid var(--b1)' : 'none' }}>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: '11.5px', color: 'var(--tm)', fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Global Store Products (Sultah Olia) */}
      <section style={{ padding: '40px 24px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>المتجر التعليمي (متين)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
             {globalProducts && globalProducts.length > 0 ? globalProducts.map((p, i) => (
               <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--b1)', borderRadius: '16px', padding: '15px' }}>
                 <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.name}</div>
                 <div style={{ fontSize: '12px', color: primaryColor, marginTop: '5px' }}>{p.price} ر.س</div>
               </div>
             )) : <div style={{ gridColumn: 'span 4', textAlign: 'center', color: 'var(--tm)' }}>لا توجد منتجات حالياً</div>}
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px 24px', textAlign: 'center', fontSize: '12px', color: 'var(--tm)' }}>
        © {new Date().getFullYear()} {data.name} - مدعوم بواسطة منصة متين
      </footer>
    </div>
  );
};

export default TrainingTemplate;
