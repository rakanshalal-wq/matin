import type { Metadata } from 'next';

export const metadata: Metadata = { title: { default: 'قطاع المعاهد', template: '%s | متين' } };

export default function InstituteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#06060E', fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif" }}>
      <div style={{ background: 'rgba(6,182,212,0.08)', borderBottom: '1px solid rgba(6,182,212,0.2)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ color: '#06B6D4', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M5 21V7l7-4 7 4v14 M9 21v-4a3 3 0 0 1 6 0v4" /></svg>{' متين — قطاع المعاهد'}</div>
        <a href="/login" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>تسجيل الخروج</a>
      </div>
      <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
