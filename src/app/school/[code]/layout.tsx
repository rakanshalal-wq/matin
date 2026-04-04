import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'بوابة المدرسة', template: '%s | متين' },
};

// تغطي SchoolShell الأب بالكامل — صفحة عامة بدون sidebar
export default function SchoolPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        overflowY: 'auto',
        background: '#06060E',
      }}
    >
      {children}
    </div>
  );
}
