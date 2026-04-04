import type { Metadata } from 'next';
import SchoolShell from '@/components/shells/SchoolShell';

export const metadata: Metadata = { title: { default: 'قطاع المدارس', template: '%s | متين' } };

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return <SchoolShell>{children}</SchoolShell>;
}
