import React from 'react';
import Link from 'next/link';

interface TeacherLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children, activePage }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#06060E] text-[#EEEEF5] font-['IBM_Plex_Sans_Arabic',sans-serif]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 h-screen bg-[#08081A] border-l border-[rgba(255,255,255,0.07)] flex flex-direction-column relative z-[300]">
        <div className="p-[16px_14px_12px] border-b border-[rgba(255,255,255,0.07)]">
          <Link href="/" className="flex items-center gap-[9px] mb-[12px] no-underline">
            <div className="w-[34px] height-[34px] rounded-[9px] bg-gradient-to-br from-[#D4A843] to-[#E8C060] flex items-center justify-center text-[17px] font-[900] color-[#000] shadow-[0_4px_12px_rgba(212,168,67,0.3)]">م</div>
            <div>
              <div className="text-[17px] font-[800] text-[#EEEEF5] tracking-[-0.5px]">متين</div>
              <div className="text-[9px] text-[rgba(238,238,245,0.28)] font-[500]">للتعليم الذكي</div>
            </div>
          </Link>
          
          <div className="bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.22)] rounded-[9px] p-[9px_11px] flex items-center gap-[9px]">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[rgba(74,222,128,0.12)] border border-[rgba(74,222,128,0.22)] flex items-center justify-center"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /></svg></div>
            <div>
              <div className="text-[#EEEEF5] text-[12.5px] font-[700]">أ. محمد علي</div>
              <div className="text-[#4ADE80] text-[10.5px] font-[600]">معلم رياضيات</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-[6px_0_4px] overflow-y-auto">
          <div className="text-[9px] text-[rgba(238,238,245,0.28)] font-[700] tracking-[1.2px] uppercase p-[9px_14px_3px]">الرئيسية</div>
          <Link href="/teacher" className={`flex items-center gap-[8px] p-[6px_12px_6px_14px] text-[12px] ${activePage === 'dashboard' ? 'bg-[rgba(74,222,128,0.1)] border-r-[3px] border-[#4ADE80] text-[#EEEEF5] font-[600]' : 'text-[rgba(238,238,245,0.55)]'} hover:bg-[rgba(255,255,255,0.04)]`}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10 M12 20V4 M6 20v-6" /></svg> لوحة التحكم
          </Link>
          <Link href="/teacher/classes" className={`flex items-center gap-[8px] p-[6px_12px_6px_14px] text-[12px] ${activePage === 'classes' ? 'bg-[rgba(74,222,128,0.1)] border-r-[3px] border-[#4ADE80] text-[#EEEEF5] font-[600]' : 'text-[rgba(238,238,245,0.55)]'} hover:bg-[rgba(255,255,255,0.04)]`}>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" /></svg> فصولي الدراسية
          </Link>
        </nav>

        <div className="p-[10px_12px] border-t border-[rgba(255,255,255,0.07)]">
          <button className="w-full bg-[rgba(248,113,113,0.07)] border border-[rgba(248,113,113,0.15)] rounded-[8px] p-[8px_12px] color-[#F87171] text-[12px] font-[600] flex items-center justify-center gap-[7px]">
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[62px] bg-[rgba(6,6,14,0.88)] backdrop-blur-[24px] border-b border-[rgba(255,255,255,0.07)] flex items-center justify-between p-[0_18px] z-10">
          <div className="flex items-center gap-[10px]">
            <div>
              <div className="text-[16px] font-[800] text-[#EEEEF5]">لوحة المعلم</div>
              <div className="text-[10.5px] text-[rgba(238,238,245,0.35)]">مرحباً بك مجدداً</div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-[18px_20px] overflow-y-auto bg-[radial-gradient(circle_at_70%_0%,rgba(74,222,128,0.025)_0%,transparent_55%)]">
          {children}
        </section>
      </main>
    </div>
  );
};

export default TeacherLayout;
