"use client";

export default function Footer() {
  return (
    <footer className="py-8 px-[5%] border-t border-bdr flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-start">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-[15px] font-black text-black">
          م
        </div>
        <div>
          <div className="text-[15px] font-extrabold">متين</div>
          <div className="text-[9px] text-txt-muted font-medium">النظام السيادي للتعليم</div>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-txt-muted text-xs">
        © 2026 متين — جميع الحقوق محفوظة · صنع في المملكة العربية السعودية
      </p>

      {/* Links */}
      <div className="flex gap-5 flex-wrap justify-center">
        <a href="#" className="text-txt-muted text-xs hover:text-gold transition-colors duration-200">
          سياسة الخصوصية
        </a>
        <a href="#" className="text-txt-muted text-xs hover:text-gold transition-colors duration-200">
          الشروط والأحكام
        </a>
        <a href="#" className="text-txt-muted text-xs hover:text-gold transition-colors duration-200">
          تواصل معنا
        </a>
      </div>
    </footer>
  );
}
