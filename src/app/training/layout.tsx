import type { Metadata } from 'next';

export const metadata: Metadata = { title: { default: 'مراكز التدريب', template: '%s | متين' } };

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#06060E', fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', sans-serif" }}>
      <div style={{ background: 'rgba(251,146,60,0.08)', borderBottom: '1px solid rgba(251,146,60,0.2)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <div style={{ color: '#FB923C', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 6 }}><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16 M18 4v16 M2 9h20 M2 15h20" /></svg>{' متين — مراكز التدريب'}</div>
        <a href="/login" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}>تسجيل الخروج</a>
      </div>
      <div style={{ padding: '2rem', maxWidth: 1280, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}
