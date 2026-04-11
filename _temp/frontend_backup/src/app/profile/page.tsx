'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (user?.id) {
        router.replace(`/profile/${user.id}`);
      } else {
        router.replace('/login');
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06060E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'IBM Plex Sans Arabic, sans-serif',
      color: 'rgba(255,255,255,0.4)',
      fontSize: 14,
    }}>
      جاري التحميل...
    </div>
  );
}
