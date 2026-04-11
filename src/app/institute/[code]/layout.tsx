import type { Metadata } from 'next';
export const metadata: Metadata = { title: { default: 'بوابة المعهد', template: '%s | متين' } };
export default function InstitutePublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, overflowY: 'auto', background: '#06060E' }}>
      {children}
    </div>
  );
}
