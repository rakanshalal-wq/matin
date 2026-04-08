'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SchoolTemplate from '@/components/templates/SchoolTemplate';

export default function SchoolPublicPage() {
  const params = useParams();
  const router = useRouter();
  const schoolCode = params?.code as string;
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/schools/public?code=${schoolCode}`);
        if (res.ok) setSchool(await res.json());
      } catch (e) {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [schoolCode]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#06060E' }}>
      <div style={{ color: '#D4A843', fontSize: '18px', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>جاري التحميل...</div>
    </div>
  );

  if (!school) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#06060E', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '64px' }}>🏫</div>
      <div style={{ color: 'white', fontSize: '20px', fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>المؤسسة غير موجودة</div>
      <button onClick={() => router.push('/')} style={{ background: '#D4A843', color: '#06060E', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: 700, fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        العودة للرئيسية
      </button>
    </div>
  );

  return (
    <SchoolTemplate
      data={{
        name: school.name || 'المدرسة',
        slug: schoolCode,
        logo: school.logo,
        cover_image: school.cover_image,
        description: school.description,
        primary_color: school.primary_color,
        secondary_color: school.secondary_color,
        accent_color: school.accent_color,
        phone: school.phone,
        email: school.email,
        address: school.address,
        student_count: school.students_count,
        teacher_count: school.teachers_count,
        success_rate: school.success_rate,
        years: school.years,
      }}
    />
  );
}
