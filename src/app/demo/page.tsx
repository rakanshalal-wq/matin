'use client';
export const dynamic = 'force-dynamic';

/* MATIN DESIGN SYSTEM — Dashboard Demo Page
   Dark Premium Admin | RTL | Cairo Font
   Colors: #0a0a0a (bg) | #D4A843 (gold) | #22C55E (green) | #60A5FA (blue)
   This is a visual prototype for approval before applying to production */

import { useState } from "react";
import {
  Users, BookOpen, Bell, Settings, LogOut,
  BarChart3, GraduationCap, CreditCard, AlertTriangle,
  CheckCircle, Clock, Search, Menu, X,
  Home, FileText, Calendar, Shield,
  ArrowUp, ArrowDown, MoreVertical, Star, Zap,
  Bus, Utensils, Brain, MessageSquare, Award
} from "lucide-react";

// ===== بيانات تجريبية =====
const statsCards = [
  {
    title: "إجمالي الطلاب",
    value: "3,842",
    change: "+124",
    changeType: "up",
    changeLabel: "هذا الشهر",
    icon: <GraduationCap size={22} />,
    color: "#D4A843",
    bg: "rgba(212,168,67,0.08)",
    border: "rgba(212,168,67,0.25)",
  },
  {
    title: "نسبة الحضور",
    value: "94.7%",
    change: "+2.3%",
    changeType: "up",
    changeLabel: "عن الأسبوع الماضي",
    icon: <CheckCircle size={22} />,
    color: "#22C55E",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.25)",
  },
  {
    title: "المعلمون النشطون",
    value: "187",
    change: "+8",
    changeType: "up",
    changeLabel: "معلم جديد",
    icon: <Users size={22} />,
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.25)",
  },
  {
    title: "الرسوم المحصّلة",
    value: "1.2M ر.س",
    change: "-3.1%",
    changeType: "down",
    changeLabel: "عن الشهر الماضي",
    icon: <CreditCard size={22} />,
    color: "#F97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.25)",
  },
];

const recentStudents = [
  { name: "أحمد محمد السالم", grade: "الثالث متوسط", status: "نشط", attendance: 96, gpa: "ممتاز", avatar: "أ" },
  { name: "سارة عبدالله الحربي", grade: "الأول ثانوي", status: "نشط", attendance: 88, gpa: "جيد جداً", avatar: "س" },
  { name: "عمر خالد الزهراني", grade: "السادس ابتدائي", status: "غائب", attendance: 72, gpa: "جيد", avatar: "ع" },
  { name: "نورة فيصل العتيبي", grade: "الثاني ثانوي", status: "نشط", attendance: 99, gpa: "ممتاز", avatar: "ن" },
  { name: "يوسف سعد القحطاني", grade: "الرابع ابتدائي", status: "إجازة", attendance: 81, gpa: "جيد", avatar: "ي" },
];

const weeklyAttendance = [
  { day: "الأحد", present: 92, absent: 8 },
  { day: "الاثنين", present: 95, absent: 5 },
  { day: "الثلاثاء", present: 89, absent: 11 },
  { day: "الأربعاء", present: 97, absent: 3 },
  { day: "الخميس", present: 94, absent: 6 },
];

const alerts = [
  { type: "warning", msg: "12 طالباً تجاوزوا حد الغياب 20%", time: "منذ ساعة", icon: <AlertTriangle size={16} /> },
  { type: "success", msg: "تم استلام رسوم 45 طالباً جديداً", time: "منذ 3 ساعات", icon: <CheckCircle size={16} /> },
  { type: "info", msg: "تحديث جدول الفصل الثالث متوسط أ", time: "منذ 5 ساعات", icon: <Clock size={16} /> },
  { type: "warning", msg: "3 معلمين لم يسجلوا الحضور اليوم", time: "منذ 6 ساعات", icon: <AlertTriangle size={16} /> },
];

const sidebarItems = [
  { icon: <Home size={18} />, label: "النظرة العامة", active: true },
  { icon: <GraduationCap size={18} />, label: "الطلاب" },
  { icon: <Users size={18} />, label: "المعلمون" },
  { icon: <BookOpen size={18} />, label: "المواد الدراسية" },
  { icon: <Calendar size={18} />, label: "الجداول" },
  { icon: <FileText size={18} />, label: "التقارير" },
  { icon: <CreditCard size={18} />, label: "المالية" },
  { icon: <BarChart3 size={18} />, label: "الإحصائيات" },
  { icon: <Bell size={18} />, label: "الإشعارات", badge: 5 },
  { icon: <Shield size={18} />, label: "الأمان" },
  { icon: <Settings size={18} />, label: "الإعدادات" },
];

const quickActions = [
  { icon: <GraduationCap size={20} />, label: "إضافة طالب", color: "#D4A843" },
  { icon: <Users size={20} />, label: "إضافة معلم", color: "#60A5FA" },
  { icon: <FileText size={20} />, label: "تقرير جديد", color: "#22C55E" },
  { icon: <Bell size={20} />, label: "إرسال إشعار", color: "#F97316" },
];

export default function DashboardDemo() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("النظرة العامة");

  return (
    <div
      className="flex min-h-screen"
      style={{ fontFamily: "Cairo, sans-serif", background: "#0a0a0a", direction: "rtl" }}
    >
      {/* ===== SIDEBAR ===== */}
      <aside
        style={{
          width: sidebarOpen ? "260px" : "72px",
          background: "#0d0d0d",
          borderLeft: "1px solid rgba(212,168,67,0.15)",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 16px",
            borderBottom: "1px solid rgba(212,168,67,0.1)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #D4A843, #C9A84C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontWeight: "900",
              fontSize: "18px",
              color: "#0a0a0a",
            }}
          >
            م
          </div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#D4A843", fontWeight: "900", fontSize: "16px", lineHeight: 1.2 }}>
                متين
              </div>
              <div style={{ color: "#555", fontSize: "11px" }}>لوحة التحكم</div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              marginRight: "auto",
              background: "none",
              border: "none",
              color: "#555",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Institution Info */}
        {sidebarOpen && (
          <div
            style={{
              margin: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(212,168,67,0.06)",
              border: "1px solid rgba(212,168,67,0.15)",
            }}
          >
            <div style={{ color: "#fff", fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>
              مدرسة الرواد الأهلية
            </div>
            <div style={{ color: "#D4A843", fontSize: "11px" }}>الرياض — حي النزهة</div>
          </div>
        )}

        {/* Nav Items */}
        <nav style={{ padding: "8px", flex: 1 }}>
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(item.label)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: sidebarOpen ? "10px 12px" : "10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                marginBottom: "2px",
                transition: "all 0.2s",
                background: item.active || activeSection === item.label
                  ? "rgba(212,168,67,0.12)"
                  : "transparent",
                color: item.active || activeSection === item.label ? "#D4A843" : "#777",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize: "13px", fontWeight: "600" }}>{item.label}</span>
              )}
              {sidebarOpen && item.badge && (
                <span
                  style={{
                    marginRight: "auto",
                    background: "#D4A843",
                    color: "#0a0a0a",
                    fontSize: "10px",
                    fontWeight: "900",
                    padding: "1px 7px",
                    borderRadius: "20px",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(212,168,67,0.1)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #D4A843, #C9A84C)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0a0a0a",
                fontWeight: "900",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              م
            </div>
            {sidebarOpen && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontSize: "12px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    محمد العمري
                  </div>
                  <div style={{ color: "#555", fontSize: "10px" }}>مدير المؤسسة</div>
                </div>
                <LogOut size={16} style={{ color: "#555", cursor: "pointer", flexShrink: 0 }} />
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            background: "#0d0d0d",
            borderBottom: "1px solid rgba(212,168,67,0.1)",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1 style={{ color: "#fff", fontWeight: "900", fontSize: "18px", lineHeight: 1 }}>
              النظرة العامة
            </h1>
            <p style={{ color: "#555", fontSize: "12px", marginTop: "2px" }}>
              الثلاثاء، 17 مارس 2026
            </p>
          </div>

          {/* Search */}
          <div
            style={{
              marginRight: "auto",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "8px 14px",
              width: "280px",
            }}
          >
            <Search size={15} style={{ color: "#555" }} />
            <input
              placeholder="بحث في الطلاب، المعلمين..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#aaa",
                fontSize: "13px",
                width: "100%",
                textAlign: "right",
                fontFamily: "Cairo, sans-serif",
              }}
            />
          </div>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              style={{
                background: "rgba(212,168,67,0.08)",
                border: "1px solid rgba(212,168,67,0.2)",
                borderRadius: "10px",
                padding: "8px",
                cursor: "pointer",
                color: "#D4A843",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Bell size={18} />
            </button>
            <span
              style={{
                position: "absolute",
                top: "-4px",
                left: "-4px",
                background: "#EF4444",
                color: "#fff",
                fontSize: "10px",
                fontWeight: "900",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              5
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "24px" }}>

          {/* Quick Actions */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
            {quickActions.map((action, i) => (
              <button
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: `1px solid ${action.color}30`,
                  background: `${action.color}0d`,
                  color: action.color,
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  transition: "all 0.2s",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {statsCards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: `${card.color}15`,
                    transform: "translate(20px, -20px)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: `${card.color}15`,
                      border: `1px solid ${card.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: card.changeType === "up" ? "#22C55E" : "#EF4444",
                      background: card.changeType === "up" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      padding: "3px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    {card.changeType === "up" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {card.change}
                  </div>
                </div>
                <div style={{ color: "#fff", fontSize: "28px", fontWeight: "900", lineHeight: 1, marginBottom: "6px" }}>
                  {card.value}
                </div>
                <div style={{ color: "#888", fontSize: "13px", fontWeight: "600" }}>{card.title}</div>
                <div style={{ color: "#555", fontSize: "11px", marginTop: "4px" }}>{card.changeLabel}</div>
              </div>
            ))}
          </div>

          {/* Charts + Alerts Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {/* Weekly Attendance Chart */}
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(212,168,67,0.12)",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "15px", marginBottom: "2px" }}>
                    الحضور الأسبوعي
                  </h3>
                  <p style={{ color: "#555", fontSize: "12px" }}>الأسبوع الحالي — مارس 2026</p>
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#22C55E" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#22C55E", display: "inline-block" }} />
                    حاضر
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#EF4444" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#EF4444", display: "inline-block" }} />
                    غائب
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "140px" }}>
                {weeklyAttendance.map((day, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                    <div style={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "2px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: `${day.absent * 5}px`,
                          background: "rgba(239,68,68,0.6)",
                          borderRadius: "4px 4px 0 0",
                          minHeight: "4px",
                        }}
                      />
                      <div
                        style={{
                          width: "100%",
                          height: `${day.present * 0.8}px`,
                          background: "linear-gradient(180deg, #22C55E, #16A34A)",
                          borderRadius: "4px 4px 0 0",
                          minHeight: "20px",
                        }}
                      />
                    </div>
                    <span style={{ color: "#666", fontSize: "11px", whiteSpace: "nowrap" }}>{day.day}</span>
                    <span style={{ color: "#D4A843", fontSize: "11px", fontWeight: "700" }}>{day.present}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid rgba(212,168,67,0.12)",
                borderRadius: "16px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "15px" }}>التنبيهات</h3>
                <span
                  style={{
                    background: "rgba(239,68,68,0.15)",
                    color: "#EF4444",
                    fontSize: "11px",
                    fontWeight: "700",
                    padding: "2px 8px",
                    borderRadius: "20px",
                  }}
                >
                  {alerts.length} جديد
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      background: alert.type === "warning"
                        ? "rgba(249,115,22,0.06)"
                        : alert.type === "success"
                        ? "rgba(34,197,94,0.06)"
                        : "rgba(96,165,250,0.06)",
                      border: `1px solid ${
                        alert.type === "warning"
                          ? "rgba(249,115,22,0.15)"
                          : alert.type === "success"
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(96,165,250,0.15)"
                      }`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                      <span
                        style={{
                          color: alert.type === "warning" ? "#F97316" : alert.type === "success" ? "#22C55E" : "#60A5FA",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        {alert.icon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#ddd", fontSize: "12px", fontWeight: "600", lineHeight: 1.4 }}>{alert.msg}</p>
                        <p style={{ color: "#555", fontSize: "11px", marginTop: "3px" }}>{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div
            style={{
              background: "#0d0d0d",
              border: "1px solid rgba(212,168,67,0.12)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid rgba(212,168,67,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "15px", marginBottom: "2px" }}>
                  آخر الطلاب المسجلين
                </h3>
                <p style={{ color: "#555", fontSize: "12px" }}>عرض آخر 5 طلاب</p>
              </div>
              <button
                style={{
                  background: "rgba(212,168,67,0.1)",
                  border: "1px solid rgba(212,168,67,0.25)",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  color: "#D4A843",
                  fontSize: "12px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "Cairo, sans-serif",
                }}
              >
                عرض الكل
              </button>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                    {["الطالب", "الصف", "الحالة", "نسبة الحضور", "التقدير", ""].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "12px 16px",
                          color: "#666",
                          fontSize: "12px",
                          fontWeight: "700",
                          textAlign: "right",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(212,168,67,0.03)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                    >
                      {/* Student Name */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: "linear-gradient(135deg, rgba(212,168,67,0.3), rgba(212,168,67,0.1))",
                              border: "1px solid rgba(212,168,67,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#D4A843",
                              fontWeight: "900",
                              fontSize: "15px",
                              flexShrink: 0,
                            }}
                          >
                            {student.avatar}
                          </div>
                          <span style={{ color: "#e0e0e0", fontSize: "13px", fontWeight: "600" }}>
                            {student.name}
                          </span>
                        </div>
                      </td>
                      {/* Grade */}
                      <td style={{ padding: "14px 16px", color: "#888", fontSize: "13px" }}>
                        {student.grade}
                      </td>
                      {/* Status */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "700",
                            background:
                              student.status === "نشط"
                                ? "rgba(34,197,94,0.12)"
                                : student.status === "غائب"
                                ? "rgba(239,68,68,0.12)"
                                : "rgba(249,115,22,0.12)",
                            color:
                              student.status === "نشط"
                                ? "#22C55E"
                                : student.status === "غائب"
                                ? "#EF4444"
                                : "#F97316",
                            border: `1px solid ${
                              student.status === "نشط"
                                ? "rgba(34,197,94,0.25)"
                                : student.status === "غائب"
                                ? "rgba(239,68,68,0.25)"
                                : "rgba(249,115,22,0.25)"
                            }`,
                          }}
                        >
                          {student.status}
                        </span>
                      </td>
                      {/* Attendance Bar */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "80px",
                              height: "6px",
                              borderRadius: "3px",
                              background: "rgba(255,255,255,0.06)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${student.attendance}%`,
                                height: "100%",
                                borderRadius: "3px",
                                background:
                                  student.attendance >= 90
                                    ? "#22C55E"
                                    : student.attendance >= 75
                                    ? "#D4A843"
                                    : "#EF4444",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              color:
                                student.attendance >= 90
                                  ? "#22C55E"
                                  : student.attendance >= 75
                                  ? "#D4A843"
                                  : "#EF4444",
                              fontSize: "12px",
                              fontWeight: "700",
                            }}
                          >
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      {/* GPA */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            color: student.gpa === "ممتاز" ? "#D4A843" : "#888",
                            fontSize: "13px",
                            fontWeight: student.gpa === "ممتاز" ? "700" : "400",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          {student.gpa === "ممتاز" && <Star size={12} />}
                          {student.gpa}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#555",
                            cursor: "pointer",
                            padding: "4px",
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Row: Quick Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            {[
              { icon: <Bus size={18} />, label: "طلاب الباص", value: "412", color: "#60A5FA" },
              { icon: <Utensils size={18} />, label: "طلاب المقصف", value: "1,204", color: "#F97316" },
              { icon: <Brain size={18} />, label: "اختبارات اليوم", value: "7", color: "#EC4899" },
              { icon: <MessageSquare size={18} />, label: "رسائل جديدة", value: "23", color: "#22C55E" },
              { icon: <Award size={18} />, label: "متين كوين اليوم", value: "+840", color: "#D4A843" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#0d0d0d",
                  border: `1px solid ${item.color}20`,
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "9px",
                    background: `${item.color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.color,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: "800", fontSize: "16px" }}>{item.value}</div>
                  <div style={{ color: "#666", fontSize: "11px" }}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div
            style={{
              marginTop: "24px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(212,168,67,0.04)",
              border: "1px solid rgba(212,168,67,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Zap size={14} style={{ color: "#D4A843" }} />
            <span style={{ color: "#666", fontSize: "12px" }}>
              هذه عينة تصميمية — البيانات المعروضة تجريبية فقط
            </span>
            <span
              style={{
                marginRight: "auto",
                color: "#D4A843",
                fontSize: "11px",
                fontWeight: "700",
                background: "rgba(212,168,67,0.1)",
                padding: "2px 8px",
                borderRadius: "20px",
              }}
            >
              v1.0 Preview
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
