"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatCards from "@/components/dashboard/StatCards";
import InstitutionsTable from "@/components/dashboard/InstitutionsTable";
import QuickActions from "@/components/dashboard/QuickActions";
import { AlertTriangle, Plus } from "lucide-react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">

          {/* Alert */}
          <div className="flex items-center gap-3 bg-gold/[0.06] border border-gold/[0.18] rounded-xl p-3 mb-5 text-[13px] text-txt-dim flex-wrap">
            <AlertTriangle size={15} color="#D4A843" className="flex-shrink-0" />
            <span>
              <strong className="text-gold">3 طلبات انضمام</strong> جديدة تنتظر المراجعة
            </span>
            <Link href="#" className="text-gold font-bold text-xs ms-auto hover:underline">
              مراجعة ←
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-5">
            <div>
              <h1 className="text-gold text-lg sm:text-xl font-extrabold flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75">
                  <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                </svg>
                لوحة مالك المنصة
              </h1>
              <p className="text-txt-muted text-[12px] mt-1">إدارة كاملة للمؤسسات والمستخدمين والمالية</p>
            </div>
            <button className="bg-gradient-to-br from-gold to-gold-light rounded-lg px-4 py-2 text-[#06060E] font-bold text-[13px] flex items-center gap-2 shadow-lg shadow-gold/25 w-full sm:w-auto justify-center hover:-translate-y-0.5 transition-all">
              <Plus size={14} color="#06060E" strokeWidth={2.5} />
              إضافة مؤسسة
            </button>
          </div>

          {/* Stats */}
          <StatCards />

          {/* Institutions Table */}
          <InstitutionsTable />

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Footer */}
        <footer className="px-4 py-2.5 border-t border-bdr-light flex justify-between flex-shrink-0 text-white/20 text-[11px]">
          <p>© 2026 متين</p>
          <p className="hidden sm:block">صنع في السعودية</p>
        </footer>
      </div>
    </div>
  );
}
