"use client";

import { Menu, Search, Bell } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="h-[56px] bg-[rgba(6,6,14,0.9)] backdrop-blur-xl border-b border-bdr flex items-center justify-between px-4 md:px-6 flex-shrink-0 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden w-9 h-9 rounded-lg bg-white/5 border border-bdr flex items-center justify-center text-txt-dim hover:bg-white/10 transition-all"
          onClick={onMenuClick}
          aria-label="القائمة"
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="text-[16px] font-extrabold tracking-tight">نظرة عامة</div>
          <div className="text-[11px] text-white/30 hidden sm:block">منصة متين التعليمية</div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-bdr rounded-lg px-3 h-9 min-w-[160px]">
          <Search size={13} className="text-txt-muted flex-shrink-0" />
          <input
            className="bg-transparent border-none outline-none text-txt text-[12px] w-full font-[inherit]"
            placeholder="بحث..."
            aria-label="بحث"
          />
        </div>

        {/* Notifications */}
        <button
          className="w-9 h-9 rounded-lg bg-white/[0.04] border border-bdr flex items-center justify-center text-txt-dim relative hover:bg-white/[0.08] transition-all"
          aria-label="إشعارات"
        >
          <Bell size={16} />
          <div className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-red-500 border border-bg" />
        </button>

        {/* User */}
        <div className="bg-white/[0.04] border border-bdr rounded-lg p-1 px-2 flex items-center gap-2 cursor-pointer hover:bg-white/[0.06] transition-all">
          <div className="w-7 h-7 rounded-md bg-gold-dim border border-gold/40 flex items-center justify-center text-sm">
            👑
          </div>
          <div className="hidden md:block">
            <div className="text-[12px] font-bold leading-tight">راكان</div>
            <div className="text-[10px] text-gold font-bold">المالك</div>
          </div>
        </div>
      </div>
    </header>
  );
}
