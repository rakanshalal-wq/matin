import type { Metadata } from 'next';
import InstituteShell from '@/components/shells/InstituteShell';

export const metadata: Metadata = { title: { default: 'قطاع المعاهد', template: '%s | متين' } };

export default function InstituteLayout({ children }: { children: React.ReactNode }) {
  return <InstituteShell>{children}</InstituteShell>;
}
