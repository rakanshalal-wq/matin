import React from 'react';

interface NurseryTemplateProps {
  data: {
    school_name: string;
    description: string;
    vision: string;
    mission: string;
    logo: string;
    cover_image: string;
    phone: string;
    email: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    address?: string;
    child_count?: number;
    caregiver_count?: number;
    age_range?: string;
  };
}

export default function NurseryTemplate({ data }: NurseryTemplateProps) {
  const {
    school_name, description, vision, mission, logo, cover_image, phone, email,
    primary_color = '#FF6B9D', secondary_color = '#FFC93C', accent_color = '#4ECDC4',
    address = '', child_count = 0, caregiver_count = 0, age_range = '',
  } = data;

  return (
    <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      <header style={{
        background: cover_image ? `linear-gradient(135deg, ${primary_color}dd 0%, ${accent_color}99 100%), url(${cover_image}) center/cover` : `linear-gradient(135deg, ${primary_color} 0%, ${accent_color}dd 100%)`,
        minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: 140, height: 140, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
            {logo ? <img src={logo} alt={school_name} style={{ width: 100, height: 100 }} /> : <span style={{ fontSize: 56 }}>🧸</span>}
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: 'white' }}>{school_name}</h1>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', maxWidth: 700, margin: '20px auto 40px' }}>{description}</p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {child_count > 0 && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div style={{ fontSize: 40 }}>👶</div><div style={{ fontSize: 32, fontWeight: 900, color: primary_color }}>{child_count}+</div><div>طفل</div></div>}
            {caregiver_count > 0 && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div style={{ fontSize: 40 }}>👩‍⚕️</div><div style={{ fontSize: 32, fontWeight: 900, color: accent_color }}>{caregiver_count}+</div><div>مربية</div></div>}
            {age_range && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div style={{ fontSize: 40 }}>🎈</div><div style={{ fontSize: 24, fontWeight: 900, color: secondary_color }}>{age_range}</div><div>الفئة العمرية</div></div>}
          </div>
        </div>
      </header>

      <section style={{ padding: '100px 24px', background: '#FFF5F7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, textAlign: 'center', color: primary_color, marginBottom: 60 }}>🏫 برامجنا</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[{ icon: '🎨', title: 'التنمية الإبداعية', desc: 'رسم، ألوان، وأعمال يدوية' }, { icon: '🎵', title: 'الموسيقى والحركة', desc: 'أغاني وألعاب حركية' }, { icon: '📚', title: 'ما قبل القراءة', desc: 'الحروف والأرقام بأسلوب ممتع' }, { icon: '🏃', title: 'النشاط البدني', desc: 'رياضة وألعاب خارجية' }, { icon: '🧠', title: 'التفكير المنطقي', desc: 'ألغاز وأنشطة ذهنية' }, { icon: '🤝', title: 'المهارات الاجتماعية', desc: 'التعاون ومشاركة الآخرين' }].map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 24, padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: primary_color }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#666' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: primary_color }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}>📞 تواصل معنا</h2>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phone && <div><div style={{ fontSize: 32 }}>📱</div><div style={{ fontSize: 20, fontWeight: 700 }}>{phone}</div></div>}
            {email && <div><div style={{ fontSize: 32 }}>✉️</div><div style={{ fontSize: 20, fontWeight: 700 }}>{email}</div></div>}
            {address && <div><div style={{ fontSize: 32 }}>📍</div><div style={{ fontSize: 20, fontWeight: 700 }}>{address}</div></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
