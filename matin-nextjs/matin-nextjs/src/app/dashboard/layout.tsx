import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "متين — لوحة التحكم",
  description: "لوحة تحكم مالك منصة متين التعليمية",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
