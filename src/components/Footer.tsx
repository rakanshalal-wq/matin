'use client';
/* MATIN DESIGN SYSTEM — Footer Component
   Dark Premium SaaS | RTL | Cairo Font */

import Link from 'next/link';

const footerLinks = {
  المنصة: [
    { label: "المميزات", href: "/features" },
    { label: "التكاملات", href: "/integrations" },
    { label: "الأسعار", href: "/pricing" },
    { label: "الذكاء الاصطناعي", href: "/ai" },
    { label: "المتجر الإلكتروني", href: "/store" },
    { label: "الملتقى المجتمعي", href: "/community" },
    { label: "المكتبة الرقمية", href: "/library" },
  ],
  الشركة: [
    { label: "عن متين", href: "/about" },
    { label: "الأخبار", href: "/news" },
    { label: "الاستدامة", href: "/sustainability" },
    { label: "تواصل معنا", href: "/contact" },
  ],
  القانونية: [
    { label: "سياسة الخصوصية", href: "/privacy" },
    { label: "الشروط والأحكام", href: "/terms" },
    { label: "سياسة الاستخدام المقبول", href: "/aup" },
  ],
  التواصل: [
    { label: "واتساب", href: "https://wa.me/966500000000" },
    { label: "البريد الإلكتروني", href: "mailto:hello@matin.ink" },
    { label: "تويتر/X", href: "https://x.com/matinink" },
    { label: "لينكدإن", href: "https://linkedin.com/company/matinink" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8">
      <div className="container">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#C49833] flex items-center justify-center">
                <span className="text-black font-black text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>م</span>
              </div>
              <span className="text-white font-black text-xl" style={{ fontFamily: 'Cairo, sans-serif' }}>متين</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
              نظام إدارة المؤسسات التعليمية الأكثر تكاملاً في المملكة العربية السعودية.
            </p>

          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-bold text-sm mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-500 hover:text-[#D4A843] text-sm transition-colors duration-200"
                      style={{ fontFamily: 'Cairo, sans-serif' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
            © 2026 منصة متين التعليمية. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>
              مصنوع في المملكة العربية السعودية
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
              <span className="text-[#22C55E] text-xs font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                99.9% Uptime
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
