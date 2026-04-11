"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Activity,
  ExternalLink,
  CreditCard,
  FileText,
  Shield,
  Tag,
  DollarSign,
  Users,
  Building2,
  UserPlus,
  Handshake,
  Layout,
  Bell,
  BookOpen,
  ShoppingBag,
  Lock,
  Puzzle,
  HelpCircle,
  Database,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

interface NavItem {
  icon?: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: { text: string; color: string };
  color?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "المالية السيادية",
    defaultOpen: true,
    items: [
      { icon: <CreditCard size={15} />, label: "الإيرادات والمالية", href: "#" },
      { icon: <FileText size={15} />, label: "الضرائب السيادية", href: "#" },
      { icon: <Shield size={15} />, label: "الاشتراكات والباقات", href: "#" },
      { icon: <Tag size={15} />, label: "الكوبونات", href: "#" },
      { icon: <DollarSign size={15} />, label: "العمولات والإحالات", href: "#" },
    ],
  },
  {
    label: "إدارة المنصة",
    defaultOpen: true,
    items: [
      { icon: <Users size={15} />, label: "المستخدمون", href: "#" },
      { icon: <Shield size={15} />, label: "الصلاحيات", href: "#" },
    ],
  },
  {
    label: "إدارة المؤسسات",
    defaultOpen: true,
    items: [
      { icon: <Building2 size={15} />, label: "المؤسسات التعليمية", href: "#" },
      {
        icon: <UserPlus size={15} />,
        label: "طلبات الانضمام",
        href: "#",
        badge: { text: "3", color: "bg-red-500/10 text-red-400 border-red-500/20" },
      },
      { icon: <Handshake size={15} />, label: "الشركاء والموردون", href: "#" },
    ],
  },
  {
    label: "الإعلانات والمحتوى",
    defaultOpen: true,
    items: [
      { icon: <Layout size={15} />, label: "الإعلانات السيادية", href: "#" },
      { icon: <Bell size={15} />, label: "الإشعارات الجماعية", href: "#" },
      { icon: <BookOpen size={15} />, label: "المكتبة الرقمية", href: "#" },
      { icon: <ShoppingBag size={15} />, label: "المتجر الإلكتروني", href: "#" },
    ],
  },
  {
    label: "الأمان والتقني",
    defaultOpen: false,
    items: [
      { label: "سجل الأمان", href: "#" },
      { label: "التكاملات والـ API", href: "#" },
      { label: "الدعم الفني", href: "#" },
      { label: "النسخ الاحتياطي", href: "#" },
      { label: "سجل الأخطاء", href: "#" },
      { label: "الإعدادات", href: "#" },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(navGroups.map((g) => [g.label, g.defaultOpen ?? false]))
  );

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-[4px] z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 w-[270px] h-dvh z-50 bg-[#08081A] border-l border-bdr flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:relative md:translate-x-0 md:flex-shrink-0`}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-bdr flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-xl font-black text-black shadow-lg shadow-gold/30 flex-shrink-0">
              م
            </div>
            <div>
              <div className="text-[18px] font-extrabold tracking-tight leading-none">متين</div>
              <div className="text-[10px] text-txt-muted font-medium tracking-wide">MATIN.INK</div>
            </div>
            {/* Close button (mobile) */}
            <button
              onClick={onClose}
              className="md:hidden ms-auto w-8 h-8 rounded-lg bg-white/5 border border-bdr flex items-center justify-center text-txt-dim"
            >
              <X size={16} />
            </button>
          </div>

          {/* User card */}
          <div className="bg-gold-dim border border-gold-border rounded-[10px] p-2.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-gold-border flex items-center justify-center text-base flex-shrink-0">
              👑
            </div>
            <div>
              <div className="text-[13px] font-bold leading-tight">راكان الشلال</div>
              <div className="text-gold text-[11px] font-semibold">مالك المنصة</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-1.5 overflow-y-auto overflow-x-hidden">
          {/* Static top items */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-4 py-2.5 mx-1.5 my-0.5 text-[13px] rounded-s-lg bg-gold-dim border-e-[3px] border-gold font-bold text-txt"
          >
            <Home size={16} color="#D4A843" />
            نظرة عامة
            <span className="w-1.5 h-1.5 rounded-full bg-gold ms-auto shadow-[0_0_6px_#D4A843]" />
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2.5 px-4 py-2.5 mx-1.5 my-0.5 text-[13px] text-txt-dim hover:bg-white/[0.04] hover:text-txt rounded-s-lg transition-all"
          >
            <Activity size={16} />
            سجل النشاط
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 mx-1.5 my-0.5 text-[13px] text-emerald-400 font-semibold hover:bg-emerald-500/[0.06] rounded-s-lg transition-all"
          >
            <ExternalLink size={16} color="#10B981" />
            الواجهة الأمامية
            <span className="ms-auto bg-emerald-500/10 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              الموقع
            </span>
          </Link>

          {/* Accordion Groups */}
          {navGroups.map((group) => (
            <div key={group.label}>
              <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center gap-2 px-4 pt-4 pb-1.5 text-[10px] text-txt-muted font-bold tracking-[1px] uppercase cursor-pointer hover:text-txt-dim transition-colors"
              >
                <ChevronRight
                  size={10}
                  strokeWidth={2.5}
                  className={`transition-transform duration-200 ${openGroups[group.label] ? "rotate-90" : ""}`}
                />
                {group.label}
              </button>

              {openGroups[group.label] && (
                <div>
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-2.5 px-4 py-2 mx-1.5 text-[13px] text-txt-dim hover:bg-white/[0.04] hover:text-txt rounded-s-lg transition-all"
                    >
                      {item.icon}
                      {item.label}
                      {item.badge && (
                        <span className={`ms-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badge.color}`}>
                          {item.badge.text}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3.5 py-3 border-t border-bdr flex-shrink-0">
          <button className="w-full bg-red-400/[0.07] border border-red-400/[0.15] rounded-lg py-2.5 text-red-400 text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-red-400/[0.12] transition-all">
            <LogOut size={14} />
            تسجيل الخروج
          </button>
          <div className="text-white/[0.15] text-[10px] text-center mt-2">متين v6</div>
        </div>
      </aside>
    </>
  );
}
