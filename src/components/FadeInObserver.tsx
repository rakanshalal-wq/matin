'use client';
import { useEffect } from 'react';
export default function FadeInObserver() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => (e.target as HTMLElement).classList.add('visible'), i * 70);
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
