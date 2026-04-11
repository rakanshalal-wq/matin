import type { Metadata } from 'next';
import UniversityShell from '@/components/shells/UniversityShell';

export const metadata: Metadata = { title: { default: 'قطاع الجامعات', template: '%s | متين' } };

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return <UniversityShell>{children}</UniversityShell>;
}
