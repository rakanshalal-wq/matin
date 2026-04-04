import type { Metadata } from 'next';
import OwnerShell from '@/components/shells/OwnerShell';

export const metadata: Metadata = { title: { default: 'مالك المنصة', template: '%s | متين' } };

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <OwnerShell>{children}</OwnerShell>;
}
