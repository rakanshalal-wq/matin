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
            {logo ? <img src={logo} alt={school_name} style={{ width: 100, height: 100 }} /> : <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, color: 'white' }}>{school_name}</h1>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.95)', maxWidth: 700, margin: '20px auto 40px' }}>{description}</p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {child_count > 0 && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg></div><div style={{ fontSize: 32, fontWeight: 900, color: primary_color }}>{child_count}+</div><div>طفل</div></div>}
            {caregiver_count > 0 && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg></div><div style={{ fontSize: 32, fontWeight: 900, color: accent_color }}>{caregiver_count}+</div><div>مربية</div></div>}
            {age_range && <div style={{ background: 'white', padding: '24px 40px', borderRadius: 20 }}><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg></div><div style={{ fontSize: 24, fontWeight: 900, color: secondary_color }}>{age_range}</div><div>الفئة العمرية</div></div>}
          </div>
        </div>
      </header>

      <section style={{ padding: '100px 24px', background: '#FFF5F7' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 42, fontWeight: 900, textAlign: 'center', color: primary_color, marginBottom: 60 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg> برامجنا</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {[{ icon: 'M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10-1.66 0-3-.34-3-2 0-.58.22-1.1.56-1.5.42-.48.56-1.04.56-1.5 0-1.1-.9-2-2-2H6C3.79 15 2 13.21 2 11 2 6.14 6.47 2 12 2z', title: 'التنمية الإبداعية', desc: 'رسم، ألوان، وأعمال يدوية' }, { icon: 'M18 8a6 6 0 0 1 0 8 M11.86 17.86c.47.12.95.14 1.14.14a3 3 0 0 0 0-6 M19 12H21 M3 8h2v8H3z M5 8l6 4-6 4V8z', title: 'الموسيقى والحركة', desc: 'أغاني وألعاب حركية' }, { icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', title: 'ما قبل القراءة', desc: 'الحروف والأرقام بأسلوب ممتع' }, { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', title: 'النشاط البدني', desc: 'رياضة وألعاب خارجية' }, { icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8v4l3 3', title: 'التفكير المنطقي', desc: 'ألغاز وأنشطة ذهنية' }, { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', title: 'المهارات الاجتماعية', desc: 'التعاون ومشاركة الآخرين' }].map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 24, padding: 40, textAlign: 'center' }}>
                <div style={{ marginBottom: 16 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg></div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: primary_color }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#666' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: primary_color }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 32 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> تواصل معنا</h2>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phone && <div><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z M12 18h.01" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{phone}</div></div>}
            {email && <div><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{email}</div></div>}
            {address && <div><div><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{address}</div></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
