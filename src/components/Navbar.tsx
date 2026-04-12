'use client';

/* MATIN DESIGN SYSTEM — Navbar Component
   Dark Premium SaaS | RTL | Cairo Font
   Colors: #0a0a0a bg, #D4A843 gold, #22C55E green */

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const location = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4A843] to-[#C49833] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(212,168,67,0.4)] transition-all duration-300">
              <span className="text-black font-black text-lg" style={{ fontFamily: 'Cairo, sans-serif' }}>م</span>
            </div>
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Cairo, sans-serif' }}>
              متين
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location === link.href
                    ? "text-[#D4A843] bg-[rgba(212,168,67,0.08)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Platform Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setPlatformOpen(!platformOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isPlatformActive || platformOpen
                    ? "text-[#D4A843] bg-[rgba(212,168,67,0.08)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                المنصة
                <ChevronDown size={14} className={`transition-transform duration-200 ${platformOpen ? "rotate-180" : ""}`} />
              </button>

              {platformOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden">
                  {platformLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setPlatformOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-[rgba(212,168,67,0.05)] transition-all ${
                          location === link.href ? "bg-[rgba(212,168,67,0.08)]" : ""
                        }`}
                        style={{ fontFamily: 'Cairo, sans-serif' }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,0.1)] flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-[#D4A843]" />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${location === link.href ? "text-[#D4A843]" : "text-white"}`}>
                            {link.label}
                          </div>
                          <div className="text-xs text-gray-500">{link.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://app.matin.ink"
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              تسجيل الدخول
            </a>
            <a
              href="https://app.matin.ink/register"
              className="btn-gold px-5 py-2 rounded-xl text-sm font-bold"
              style={{ fontFamily: 'Cairo, sans-serif' }}
            >
              ابدأ مجاناً
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden navbar-glass border-t border-white/5">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location === link.href
                    ? "text-[#D4A843] bg-[rgba(212,168,67,0.08)]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                style={{ fontFamily: 'Cairo, sans-serif' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Platform links in mobile */}
            <div className="mt-1 mb-1">
              <div className="px-4 py-2 text-xs text-gray-500 font-semibold" style={{ fontFamily: 'Cairo, sans-serif' }}>
                المنصة
              </div>
              {platformLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      location === link.href
                        ? "text-[#D4A843] bg-[rgba(212,168,67,0.08)]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    style={{ fontFamily: 'Cairo, sans-serif' }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={16} className="text-[#D4A843]" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-white/5">
              <a
                href="https://app.matin.ink"
                className="btn-outline-gold px-4 py-3 rounded-xl text-sm font-bold text-center"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                تسجيل الدخول
              </a>
              <a
                href="https://app.matin.ink/register"
                className="btn-gold px-4 py-3 rounded-xl text-sm font-bold text-center"
                style={{ fontFamily: 'Cairo, sans-serif' }}
              >
                ابدأ مجاناً
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
