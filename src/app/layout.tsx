import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'متين — منصة إدارة المؤسسات التعليمية',
    template: '%s | متين',
  },
  description: 'منصة SaaS متكاملة لإدارة المدارس والجامعات والمعاهد ومراكز التدريب وتحفيظ القرآن',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matin.ink'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
