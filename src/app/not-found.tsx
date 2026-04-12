'use client';

import Link from 'next/link';
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-lg mx-4 text-center p-10 rounded-2xl" style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.1)' }}>
            <AlertCircle className="h-10 w-10" style={{ color: '#D4A843' }} />
          </div>
        </div>

        <h1 className="text-5xl font-black mb-2" style={{ color: '#D4A843', fontFamily: 'Cairo, sans-serif' }}>404</h1>

        <h2 className="text-xl font-bold mb-4" style={{ color: '#f5f5f5', fontFamily: 'Cairo, sans-serif' }}>
          الصفحة غير موجودة
        </h2>

        <p className="mb-8 leading-relaxed" style={{ color: 'rgba(245,245,245,0.65)', fontFamily: 'Cairo, sans-serif' }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة.
          <br />
          ربما تم نقلها أو حذفها.
        </p>

        <Link
          href="/"
          className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base"
          style={{ fontFamily: 'Cairo, sans-serif' }}
        >
          <Home className="w-5 h-5" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
