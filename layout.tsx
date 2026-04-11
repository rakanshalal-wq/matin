import type { Metadata } from 'next';
import SchoolShell from './SchoolShell';

export const metadata: Metadata = {
  title: 'لوحة تحكم المدرسة - متين',
  description: 'نظام إدارة المدارس',
};

export default function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SchoolShell>{children}</SchoolShell>;
}
