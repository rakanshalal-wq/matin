'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * صفحة إعادة توجيه تلقائية — هذه الصفحة أُعيدت هيكلتها.
 * يُرجى الانتقال إلى /dashboard/training للإصدار الكامل المرتبط بالـ API.
 */
export default function RedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/training');
  }, [router]);

  return (
    <div dir="rtl" style={{
      fontFamily: "'IBM Plex Sans Arabic', sans-serif",
      background: '#06060E',
      color: '#EEEEF5',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ fontSize: 32 }}>⏳</div>
      <div style={{ fontSize: 16, fontWeight: 700 }}>جارٍ التوجيه...</div>
      <div style={{ fontSize: 13, color: 'rgba(238,238,245,0.5)' }}>
        إذا لم تنتقل خلال ثانية،{' '}
        <a href="/dashboard/training" style={{ color: '#C9A84C' }}>انقر هنا</a>
      </div>
    </div>
  );
}
