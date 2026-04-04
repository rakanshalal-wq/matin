import type { Metadata } from 'next';
import QuranShell from '@/components/shells/QuranShell';

export const metadata: Metadata = { title: { default: 'تحفيظ القرآن', template: '%s | متين' } };

export default function QuranLayout({ children }: { children: React.ReactNode }) {
  return <QuranShell>{children}</QuranShell>;
}
