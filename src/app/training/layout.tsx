import type { Metadata } from 'next';
import TrainingShell from '@/components/shells/TrainingShell';

export const metadata: Metadata = { title: { default: 'مراكز التدريب', template: '%s | متين' } };

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return <TrainingShell>{children}</TrainingShell>;
}
