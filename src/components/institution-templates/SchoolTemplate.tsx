import React from 'react';

interface SchoolTemplateProps {
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
    established_year?: string;
    student_count?: number;
    teacher_count?: number;
  };
}

export default function SchoolTemplate({ data }: SchoolTemplateProps) {
  const {
    school_name,
    description,
    vision,
    mission,
    logo,
    cover_image,
    phone,
    email,
    primary_color = '#1a1a2e',
    secondary_color = '#d4a843',
    accent_color = '#FFB300',
    address = '',
    established_year = '',
    student_count = 0,
    teacher_count = 0,
  } = data;

  return (
    <div dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* Hero Section */}
      <header style={{
        background: cover_image 
          ? `linear-gradient(135deg, ${primary_color}dd 0%, ${primary_color}99 100%), url(${cover_image}) center/cover`
          : `linear-gradient(135deg, ${primary_color} 0%, ${primary_color}dd 100%)`,
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{
            width: 120, height: 120, background: secondary_color, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
          }}>
            {logo ? (
              <img src={logo} alt={school_name} style={{ width: 80, height: 80, objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: 48, fontWeight: 800, color: primary_color }}>م</span>
            )}
          </div>

          <h1 style={{ fontSize: 56, fontWeight: 900, color: 'white', marginBottom: 20 }}>{school_name}</h1>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.9)', maxWidth: 700, margin: '0 auto 40px' }}>{description}</p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {student_count > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px 40px', borderRadius: 16 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: secondary_color }}>{student_count}+</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>طالب</div>
              </div>
            )}
            {teacher_count > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px 40px', borderRadius: 16 }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: secondary_color }}>{teacher_count}+</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>معلم</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Vision & Mission */}
      <section style={{ padding: '100px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 40 }}>
            <div style={{ background: 'white', borderRadius: 24, padding: 48, borderTop: `4px solid ${primary_color}` }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: primary_color, marginBottom: 16 }}>الرؤية</h2>
              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.8 }}>{vision}</p>
            </div>
            <div style={{ background: 'white', borderRadius: 24, padding: 48, borderTop: `4px solid ${secondary_color}` }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: secondary_color, marginBottom: 16 }}>الرسالة</h2>
              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.8 }}>{mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: '80px 24px', background: primary_color }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 32 }}>تواصل معنا</h2>
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {phone && <div style={{ color: 'white' }}><div style={{ marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2.68h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{phone}</div></div>}
            {email && <div style={{ color: 'white' }}><div style={{ marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{email}</div></div>}
            {address && <div style={{ color: 'white' }}><div style={{ marginBottom: 8 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /></svg></div><div style={{ fontSize: 20, fontWeight: 700 }}>{address}</div></div>}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', background: '#0a0a1a', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)' }}>© 2026 {school_name} - مدعوم بـ متين</p>
      </footer>
    </div>
  );
}
