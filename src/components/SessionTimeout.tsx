'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionTimeout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getTimeout = () => {
    try {
      const user = JSON.parse(localStorage.getItem('matin_user') || '{}');
      if (user.role === 'student') return 10 * 60 * 1000; // 10 دقائق
      if (user.role === 'teacher') return 15 * 60 * 1000; // 15 دقيقة
      return 30 * 60 * 1000; // 30 دقيقة للمالك والأدمن
    } catch { return 30 * 60 * 1000; }
  };

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    document.cookie = 'matin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login?reason=timeout');
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, getTimeout());
  };

  useEffect(() => {
    const token = localStorage.getItem('matin_token');
    if (!token) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
