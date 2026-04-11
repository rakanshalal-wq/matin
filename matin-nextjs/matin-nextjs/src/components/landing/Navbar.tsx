"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-[5%] bg-[rgba(6,6,14,0.88)] backdrop-blur-xl border-b border-bdr">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="متين">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-lg font-black text-black shadow-lg shadow-gold/30">
            م
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-txt tracking-tight leading-none">متين</div>
            <div className="text-[9px] text-txt-muted font-medium tracking-wider">MATIN.INK</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="#features" className="text-txt-dim text-sm font-medium hover:text-gold transition-colors duration-200">
            المميزات
          </a>
          <a href="#institutions" className="text-txt-dim text-sm font-medium hover:text-gold transition-colors duration-200">
            المؤسسات
          </a>
          <a href="#pricing" className="text-txt-dim text-sm font-medium hover:text-gold transition-colors duration-200">
            الأسعار
          </a>
          <a href="#roles" className="text-txt-dim text-sm font-medium hover:text-gold transition-colors duration-200">
            الأدوار
          </a>
          <Link href="/login" className="text-txt-dim text-sm font-medium hover:text-gold transition-colors duration-200">
            تسجيل الدخول
          </Link>
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            className="lg:hidden w-9 h-9 rounded-lg border border-bdr flex items-center justify-center text-txt-dim hover:bg-white/5 transition-all"
            aria-label="فتح القائمة"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link
            href="#"
            className="bg-gradient-to-br from-gold to-gold-light rounded-[9px] px-5 py-2 text-[#06060E] font-bold text-[13px] shadow-lg shadow-gold/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/40 transition-all duration-200"
          >
            ابدأ مجاناً
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-16 inset-x-0 z-40 flex flex-col bg-[rgba(6,6,14,0.97)] backdrop-blur-xl border-b border-bdr py-4 px-[5%] gap-1">
          <a
            href="#features"
            className="block py-3 px-4 text-txt-dim text-sm font-medium hover:text-gold rounded-lg hover:bg-white/[0.03] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            المميزات
          </a>
          <a
            href="#institutions"
            className="block py-3 px-4 text-txt-dim text-sm font-medium hover:text-gold rounded-lg hover:bg-white/[0.03] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            المؤسسات
          </a>
          <a
            href="#pricing"
            className="block py-3 px-4 text-txt-dim text-sm font-medium hover:text-gold rounded-lg hover:bg-white/[0.03] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            الأسعار
          </a>
          <a
            href="#roles"
            className="block py-3 px-4 text-txt-dim text-sm font-medium hover:text-gold rounded-lg hover:bg-white/[0.03] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            الأدوار
          </a>
          <Link
            href="/login"
            className="block py-3 px-4 text-txt-dim text-sm font-medium hover:text-gold rounded-lg hover:bg-white/[0.03] transition-all"
            onClick={() => setMobileOpen(false)}
          >
            تسجيل الدخول
          </Link>
        </div>
      )}
    </>
  );
}
