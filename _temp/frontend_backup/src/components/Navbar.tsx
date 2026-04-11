'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ShoppingBag, Users, BookOpen } from "lucide-react";

const navLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "المميزات", href: "/features" },
  { label: "التكاملات", href: "/integrations" },
  { label: "الأسعار", href: "/pricing" },
  { label: "الذكاء الاصطناعي", href: "/ai" },
  { label: "عن متين", href: "/about" },
];

const platformLinks = [
  { label: "المتجر الإلكتروني", href: "/store", icon: ShoppingBag, desc: "بيع المنتجات والخدمات" },
  { label: "الملتقى المجتمعي", href: "/community", icon: Users, desc: "فضاء اجتماعي آمن" },
  { label: "المكتبة الرقمية", href: "/library", icon: BookOpen, desc: "كتب ومراجع تعليمية" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const location = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPlatformActive = platformLinks.some(l => location === l.href);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-[#0A0A0F] border-b border-white/5">
      <div className="container flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="text-white font-black text-xl">
          متين
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm ${
                location === link.href
                  ? "text-[#D4A843]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Platform Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setPlatformOpen(!platformOpen)}
              className={`px-3 py-2 text-sm flex items-center gap-1 ${
                isPlatformActive ? "text-[#D4A843]" : "text-gray-400"
              }`}
            >
              المنصة <ChevronDown size={14} />
            </button>

            {platformOpen && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-[#111] rounded-xl border border-white/10 shadow-lg">
                {platformLinks.map(link => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
                      onClick={() => setPlatformOpen(false)}
                    >
                      <Icon size={16} className="text-[#D4A843]" />
                      <div>
                        <div className="text-white text-sm">{link.label}</div>
                        <div className="text-xs text-gray-500">{link.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-gray-300 hover:text-white text-sm">
            تسجيل الدخول
          </Link>
          <Link href="/register" className="bg-[#D4A843] text-black px-4 py-2 rounded-lg text-sm font-bold">
            ابدأ مجاناً
          </Link>
        </div>

        {/* Mobile Button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#111] border-t border-white/5 p-4 space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-300 py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-white/10" />

          <Link href="/login" className="block py-2 text-white">
            تسجيل الدخول
          </Link>

          <Link href="/register" className="block py-2 text-[#D4A843] font-bold">
            ابدأ مجاناً
          </Link>
        </div>
      )}
    </nav>
  );
}
