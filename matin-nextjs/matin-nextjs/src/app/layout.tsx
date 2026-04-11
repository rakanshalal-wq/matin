import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "متين — منصة إدارة المؤسسات التعليمية",
  description: "منصة SaaS عربية لإدارة المؤسسات التعليمية — المدارس، الجامعات، حلقات القرآن، مراكز التدريب، ورياض الأطفال",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-ar bg-bg text-txt antialiased">
        {children}
      </body>
    </html>
  );
}
