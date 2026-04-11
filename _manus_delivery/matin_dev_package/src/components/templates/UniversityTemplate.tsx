import React from 'react';

interface UniversityTemplateProps {
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

const UniversityTemplate: React.FC<UniversityTemplateProps> = ({ data, globalAds, globalProducts }) => {
  const primaryColor = data.primary_color || '#818CF8';
  const secondaryColor = data.secondary_color || '#6366F1';
  const accentColor = data.accent_color || '#C084FC';
  const fontFamily = data.font_family || 'IBM Plex Sans Arabic';

  return (
    <div style={{ 
      fontFamily: fontFamily, 
      backgroundColor: '#06060E', 
      color: '#EEEEF5',
      minHeight: '100vh',
      display: 'flex',
      direction: 'rtl'
    }}>
      {/* CSS Variables for Dynamic Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --uni-primary: ${primaryColor};
          --uni-secondary: ${secondaryColor};
          --uni-accent: ${accentColor};
          --b1: rgba(255,255,255,0.08);
          --b2: rgba(255,255,255,0.04);
          --t: #EEEEF5;
          --td: rgba(238,238,245,0.6);
          --tm: rgba(238,238,245,0.3);
          --card: rgba(255,255,255,0.03);
        }
      `}} />

      {/* Sidebar (Simplified for Template) */}
      <aside style={{ width: '240px', background: '#090915', borderLeft: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--b1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {data.logo ? <img src={data.logo} alt="logo" style={{ width: '100%', height: '100%', borderRadius: '8px' }} /> : data.name.charAt(0)}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{data.name}</div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px' }}>
          {['لوحة التحكم', 'المقررات الدراسية', 'الجدول الدراسي', 'النتائج والتقارير', 'المكتبة الرقمية', 'الملتقى الجامعي'].map((item, i) => (
            <div key={i} style={{ padding: '10px 12px', borderRadius: '8px', fontSize: '13px', color: i === 0 ? primaryColor : 'var(--td)', background: i === 0 ? `rgba(${primaryColor}, 0.1)` : 'transparent', marginBottom: '4px', cursor: 'pointer', fontWeight: 600 }}>
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: '64px', background: 'rgba(6,6,14,.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>بوابة الطالب الأكاديمية</div>
          <div style={{ display: 'flex', gap: '10px' }}>
             <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,255,255,.04)', border: '1px solid var(--b1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
             <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,.04)', border: '1px solid var(--b1)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>JD</div>
                <div style={{ fontSize: '12px', fontWeight: 700 }}>جامعة متين</div>
             </div>
          </div>
        </header>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* Global Ads (Sultah Olia) */}
          {data.show_global_ads && globalAds && globalAds.length > 0 && (
            <div style={{ marginBottom: '20px', background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, color: '#fff', padding: '12px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>📢 إعلان أكاديمي: {globalAds[0].text}</div>
              <button style={{ background: '#fff', color: primaryColor, border: 'none', borderRadius: '8px', padding: '5px 15px', fontSize: '12px', fontWeight: 700 }}>عرض التفاصيل</button>
            </div>
          )}

          {/* GPA Banner (From Design) */}
          <div style={{ background: `linear-gradient(135deg, rgba(${primaryColor}, 0.1), rgba(${secondaryColor}, 0.04))`, border: `1px solid rgba(${primaryColor}, 0.2)`, borderRadius: '13px', padding: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>3.85</div>
              <div style={{ fontSize: '10px', color: 'var(--tm)' }}>المعدل التراكمي العام</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'var(--b1)' }}></div>
            <div style={{ flex: 1, marginLeft: '20px', marginRight: '20px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                  <span>التقدم الدراسي</span>
                  <span>75%</span>
               </div>
               <div style={{ height: '6px', background: 'rgba(255,255,255,.07)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: `linear-gradient(90deg, ${primaryColor}, ${accentColor})` }}></div>
               </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
            {[
              { label: 'المواد المسجلة', value: '6', icon: '📚', color: primaryColor },
              { label: 'الساعات المعتمدة', value: '18', icon: '⏳', color: secondaryColor },
              { label: 'الإنذارات الأكاديمية', value: '0', icon: '⚠️', color: '#EF4444' },
              { label: 'الرسائل الجديدة', value: '12', icon: '✉️', color: accentColor },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '15px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>{stat.icon}</div>
                <div style={{ fontSize: '20px', fontWeight: 800 }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--tm)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Global Store Products (Sultah Olia) */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--b1)', borderRadius: '12px', padding: '20px' }}>
             <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '15px' }}>متجر الكتب الرقمية (متين)</h3>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                {globalProducts && globalProducts.length > 0 ? globalProducts.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ padding: '12px', border: '1px solid var(--b2)', borderRadius: '10px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: primaryColor, marginTop: '4px' }}>{p.price} ر.س</div>
                  </div>
                )) : <div style={{ color: 'var(--tm)', fontSize: '12px' }}>لا توجد منتجات حالياً</div>}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UniversityTemplate;
