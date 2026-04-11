"use client";

import { useState } from "react";
import { Search, MoreVertical } from "lucide-react";

type Filter = "all" | "active" | "frozen";

interface Institution {
  name: string;
  city: string;
  type: string;
  plan: string;
  planStyle: string;
  status: "active" | "frozen";
  students: number;
  owner: string;
}

const institutions: Institution[] = [
  {
    name: "مدرسة الأمل الدولية",
    city: "الرياض",
    type: "مدرسة",
    plan: "مؤسسي",
    planStyle: "bg-gold-dim text-gold border-gold-border",
    status: "active",
    students: 1240,
    owner: "أحمد العمري",
  },
  {
    name: "معهد تقنية المعلومات",
    city: "جدة",
    type: "معهد",
    plan: "متقدم",
    planStyle: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    status: "active",
    students: 620,
    owner: "سارة الحربي",
  },
  {
    name: "روضة البراعم الصغيرة",
    city: "الدمام",
    type: "روضة",
    plan: "أساسي",
    planStyle: "bg-white/5 text-txt-dim border-bdr",
    status: "frozen",
    students: 85,
    owner: "نورة المطيري",
  },
  {
    name: "أكاديمية التميز للتدريب",
    city: "الرياض",
    type: "تدريب",
    plan: "مؤسسي",
    planStyle: "bg-gold-dim text-gold border-gold-border",
    status: "active",
    students: 340,
    owner: "خالد الشمري",
  },
];

interface DropdownMenuProps {
  status: "active" | "frozen";
}

function DropdownMenu({ status }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-md bg-white/[0.04] border border-bdr flex items-center justify-center text-txt-dim hover:bg-white/[0.08] transition-all"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute start-0 top-full mt-1 z-[60] bg-[#0f0f1a] border border-bdr rounded-xl p-1 shadow-2xl min-w-[120px]">
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-[12px] text-gold hover:bg-gold/10 rounded-lg transition-all">
              تعديل
            </a>
            <a href="#" className="flex items-center gap-2 px-3 py-2 text-[12px] text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all">
              عرض
            </a>
            {status === "active" ? (
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-[12px] text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                تجميد
              </a>
            ) : (
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-[12px] text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all">
                تفعيل
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function InstitutionsTable() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = institutions.filter((inst) => {
    if (filter === "active" && inst.status !== "active") return false;
    if (filter === "frozen" && inst.status !== "frozen") return false;
    if (search && !inst.name.includes(search) && !inst.city.includes(search)) return false;
    return true;
  });

  return (
    <div className="bg-bg-card border border-bdr rounded-xl overflow-hidden mb-5">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-bdr-light flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[14px] font-bold">
          المؤسسات المسجلة
          <span className="bg-gold-dim border border-gold-border text-gold text-[11px] font-bold px-2 py-0.5 rounded-full">
            47
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] border border-bdr rounded-lg px-3 h-8 w-full sm:w-auto sm:min-w-[180px]">
          <Search size={13} className="text-txt-muted flex-shrink-0" />
          <input
            className="bg-transparent border-none outline-none text-txt text-[12px] w-full font-[inherit]"
            placeholder="بحث عن مؤسسة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 px-4 py-2 border-b border-bdr-light overflow-x-auto">
        <button
          onClick={() => setFilter("all")}
          className={`text-[11px] px-3 py-1 rounded-md whitespace-nowrap transition-all ${
            filter === "all"
              ? "bg-gold-dim border border-gold-border text-gold font-bold"
              : "text-txt-dim hover:bg-white/[0.04]"
          }`}
        >
          الكل (47)
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`text-[11px] px-3 py-1 rounded-md whitespace-nowrap transition-all ${
            filter === "active"
              ? "bg-gold-dim border border-gold-border text-gold font-bold"
              : "text-txt-dim hover:bg-white/[0.04]"
          }`}
        >
          نشطة (44)
        </button>
        <button
          onClick={() => setFilter("frozen")}
          className={`text-[11px] px-3 py-1 rounded-md whitespace-nowrap transition-all ${
            filter === "frozen"
              ? "bg-gold-dim border border-gold-border text-gold font-bold"
              : "text-txt-dim hover:bg-white/[0.04]"
          }`}
        >
          متجمدة (3)
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead>
            <tr className="bg-gold/[0.04]">
              <th className="px-4 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">المؤسسة</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">النوع</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">الباقة</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">الحالة</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">الطلاب</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light">المالك</th>
              <th className="px-3 py-2.5 text-start text-gold font-bold text-[11px] border-b border-bdr-light"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inst, idx) => (
              <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                <td className="px-4 py-3 border-b border-bdr-light">
                  <div className="font-semibold text-[13px]">{inst.name}</div>
                  <div className="text-txt-muted text-[10px]">{inst.city}</div>
                </td>
                <td className="px-3 py-3 border-b border-bdr-light text-txt-dim text-[12px]">{inst.type}</td>
                <td className="px-3 py-3 border-b border-bdr-light">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${inst.planStyle}`}>
                    {inst.plan}
                  </span>
                </td>
                <td className="px-3 py-3 border-b border-bdr-light">
                  {inst.status === "active" ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                      ● نشط
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 w-fit">
                      ● متجمد
                    </span>
                  )}
                </td>
                <td className={`px-3 py-3 border-b border-bdr-light font-bold text-[13px] ${inst.status === "active" ? "text-gold" : "text-txt-muted"}`}>
                  {inst.students.toLocaleString("ar-SA")}
                </td>
                <td className="px-3 py-3 border-b border-bdr-light text-txt-dim text-[12px]">{inst.owner}</td>
                <td className="px-3 py-3 border-b border-bdr-light">
                  <DropdownMenu status={inst.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-3 space-y-2.5">
        {filtered.map((inst, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-3.5 ${
              inst.status === "frozen"
                ? "bg-white/[0.03] border-red-500/[0.15]"
                : "bg-white/[0.03] border-bdr-light"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-[13px]">{inst.name}</div>
                <div className="text-txt-muted text-[10px]">
                  {inst.city} · {inst.owner}
                </div>
              </div>
              {inst.status === "active" ? (
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  نشط
                </span>
              ) : (
                <span className="bg-red-500/10 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-500/20">
                  متجمد
                </span>
              )}
            </div>
            <div className="flex gap-2 text-[10px] text-txt-dim mb-2.5">
              <span>{inst.type}</span>
              <span className={`font-bold ${inst.plan === "مؤسسي" ? "text-gold" : inst.plan === "متقدم" ? "text-blue-400" : ""}`}>
                {inst.plan}
              </span>
              <span className={`font-bold ${inst.status === "active" ? "text-gold" : "text-txt-muted"}`}>
                {inst.students.toLocaleString("ar-SA")} طالب
              </span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-gold/[0.08] text-gold border border-gold/20">
                تعديل
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-400/[0.08] text-blue-400 border border-blue-400/20">
                عرض
              </button>
              {inst.status === "active" ? (
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/[0.08] text-red-400 border border-red-500/20">
                  تجميد
                </button>
              ) : (
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/[0.08] text-emerald-400 border border-emerald-500/20">
                  تفعيل
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
