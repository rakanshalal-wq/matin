"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Save, ExternalLink, ChevronDown, Monitor, Tablet, Smartphone, Check } from "lucide-react";

type Tab = "hero" | "institutions" | "features" | "pricing" | "footer";
type DeviceSize = "desktop" | "tablet" | "mobile";

interface HeroData {
  bgColor: string;
  line1: string;
  line2: string;
  desc: string;
  btn1: string;
  btn2: string;
  badge: string;
}

const BG_PRESETS = ["#06060E", "#0A0A1A", "#0D0D0D", "#0A1628", "#0D1117"];

const INSTITUTIONS = [
  { title: "المدارس", desc: "إدارة الفصول والمناهج" },
  { title: "الجامعات", desc: "نظام أكاديمي شامل" },
  { title: "حلقات التحفيظ", desc: "متابعة الحفظ والمراجعة" },
  { title: "المراكز التدريبية", desc: "إدارة الدورات" },
  { title: "رياض الأطفال", desc: "تقارير يومية" },
];

function AccordionSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-bg-card border border-bdr rounded-xl overflow-hidden mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
      >
        <span className="text-[14px] font-bold flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="relative w-[42px] h-6 flex-shrink-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="opacity-0 w-0 h-0 absolute"
      />
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-gold" : "bg-white/10"
        }`}
      />
      <span
        className={`absolute w-[18px] h-[18px] bg-white rounded-full bottom-[3px] transition-transform duration-200 ${
          checked ? "-translate-x-[18px] right-[3px]" : "right-[3px]"
        }`}
      />
    </label>
  );
}

export default function ThemeEditorPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [saved, setSaved] = useState(false);
  const [institutionToggles, setInstitutionToggles] = useState(
    INSTITUTIONS.map(() => true)
  );

  const [heroData, setHeroData] = useState<HeroData>({
    bgColor: "#06060E",
    line1: "كل مؤسستك في",
    line2: "لوحة تحكم واحدة",
    desc: "من الحضور والدرجات إلى الرسوم والنقل — متين يدير كل شيء حتى تركّز أنت على التعليم.",
    btn1: "ابدأ تجربتك المجانية",
    btn2: "شاهد العرض",
    badge: "منصة التعليم الأذكى للمؤسسات الخاصة في السعودية",
  });

  const generatePreviewHTML = useCallback(() => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Cairo',sans-serif;background:${heroData.bgColor};color:#EEEEF5;overflow-x:hidden;}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px 5%;position:relative;overflow:hidden;}
.glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(212,168,67,0.07) 0%,transparent 70%);top:30%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
.badge{display:inline-flex;align-items:center;gap:8px;background:rgba(212,168,67,0.12);border:1px solid rgba(212,168,67,0.22);border-radius:20px;padding:6px 16px;font-size:12px;font-weight:600;color:#D4A843;margin-bottom:24px;}
.dot{width:6px;height:6px;border-radius:50%;background:#D4A843;}
h1{font-size:clamp(32px,5vw,64px);font-weight:800;line-height:1.1;letter-spacing:-1.5px;margin-bottom:16px;}
.gold{color:#D4A843;}
p.sub{font-size:clamp(14px,1.8vw,18px);color:rgba(238,238,245,0.65);max-width:520px;margin:0 auto 32px;line-height:1.75;}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
.btn1{background:linear-gradient(135deg,#D4A843,#E8C060);border:none;border-radius:12px;padding:14px 28px;color:#06060E;font-weight:800;font-size:15px;cursor:pointer;font-family:inherit;box-shadow:0 6px 22px rgba(212,168,67,0.3);}
.btn2{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px 24px;color:#EEEEF5;font-weight:600;font-size:15px;cursor:pointer;font-family:inherit;}
section{padding:80px 5%;text-align:center;}
.sec-title{font-size:clamp(24px,4vw,40px);font-weight:800;margin-bottom:12px;}
.sec-sub{font-size:14px;color:rgba(238,238,245,0.5);max-width:480px;margin:0 auto 40px;}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;max-width:900px;margin:0 auto;}
.card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);border-radius:16px;padding:24px;text-align:start;}
.card h3{font-size:15px;font-weight:700;margin-bottom:6px;}
.card p{font-size:12px;color:rgba(238,238,245,0.4);line-height:1.6;}
</style>
</head>
<body>
<section class="hero">
<div class="glow"></div>
<div class="badge"><span class="dot"></span>${heroData.badge}</div>
<h1>${heroData.line1}<br><span class="gold">${heroData.line2}</span></h1>
<p class="sub">${heroData.desc}</p>
<div class="btns"><button class="btn1">${heroData.btn1}</button><button class="btn2">${heroData.btn2}</button></div>
</section>
<section style="background:rgba(255,255,255,0.01)">
<div class="sec-title">لكل مؤسسة تعليمية <span class="gold">حل مخصص</span></div>
<div class="sec-sub">من الروضة للجامعة — متين يتكيف</div>
<div class="grid3">
<div class="card"><h3>المدارس</h3><p>إدارة كاملة للفصول والمناهج والحضور.</p></div>
<div class="card"><h3>الجامعات</h3><p>نظام أكاديمي شامل بالساعات والتخصصات.</p></div>
<div class="card"><h3>حلقات التحفيظ</h3><p>متابعة الحفظ والمراجعة والإجازات.</p></div>
</div>
</section>
<section>
<div class="sec-title">باقة لكل <span class="gold">مؤسسة</span></div>
<div class="sec-sub">ابدأ مجاناً وطوّر حسب احتياجك.</div>
<div class="grid3">
<div class="card"><h3>أساسي</h3><p>مجاناً · حتى 100 طالب</p></div>
<div class="card" style="border-color:rgba(212,168,67,0.22);background:rgba(212,168,67,0.05)"><h3 style="color:#D4A843">متقدم</h3><p>1,200 ريال/سنة · حتى 500 طالب</p></div>
<div class="card"><h3>مؤسسي</h3><p>حسب الطلب · غير محدود</p></div>
</div>
</section>
</body>
</html>`;
  }, [heroData]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getFrameStyle = () => {
    switch (deviceSize) {
      case "mobile":
        return { maxWidth: "375px", height: "700px" };
      case "tablet":
        return { maxWidth: "768px", height: "100%" };
      default:
        return { maxWidth: "100%", height: "100%" };
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      {/* Top Bar */}
      <header className="h-14 flex items-center justify-between px-5 border-b border-bdr flex-shrink-0 bg-[rgba(6,6,14,0.92)] backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-sm font-black text-black">
            م
          </div>
          <div>
            <div className="text-gold text-[15px] font-extrabold flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              محرر الواجهة الأمامية
            </div>
            <div className="text-txt-muted text-[10px] hidden sm:block">
              تحكم كامل في محتوى وتصميم صفحة matin.ink
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 bg-blue-400/10 border border-blue-400/20 rounded-lg px-3 py-1.5 text-blue-400 text-xs font-semibold hover:bg-blue-400/15 transition-all"
          >
            <ExternalLink size={13} />
            معاينة
          </Link>
          <button
            onClick={handleSave}
            className="bg-gradient-to-br from-gold to-gold-light rounded-lg px-4 py-1.5 text-[#06060E] font-bold text-[13px] flex items-center gap-1.5 shadow-lg shadow-gold/25 hover:-translate-y-0.5 transition-all"
          >
            {saved ? (
              <>
                <Check size={14} />
                تم الحفظ
              </>
            ) : (
              <>
                <Save size={14} />
                حفظ
              </>
            )}
          </button>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="w-full lg:w-[500px] xl:w-[540px] flex-shrink-0 flex flex-col border-s-2 border-bdr overflow-hidden bg-bg">
          {/* Tabs */}
          <div className="flex border-b border-bdr overflow-x-auto flex-shrink-0">
            {(["hero", "institutions", "features", "pricing", "footer"] as Tab[]).map((tab) => {
              const labels: Record<Tab, string> = {
                hero: "الهيرو",
                institutions: "المؤسسات",
                features: "المميزات",
                pricing: "الأسعار",
                footer: "الفوتر",
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-[13px] font-medium border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "text-gold border-gold font-bold"
                      : "border-transparent text-txt-dim hover:text-txt"
                  }`}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* HERO Panel */}
            {activeTab === "hero" && (
              <>
                {/* Background */}
                <AccordionSection
                  title="خلفية الصفحة"
                  defaultOpen={true}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  }
                >
                  <div className="px-5 pb-5 pt-1 space-y-4">
                    <div>
                      <label className="text-txt-dim text-[13px] font-semibold block mb-2">لون الخلفية</label>
                      <div className="flex items-center gap-3 mb-3">
                        <input
                          type="color"
                          value={heroData.bgColor}
                          onChange={(e) => setHeroData((p) => ({ ...p, bgColor: e.target.value }))}
                          className="w-14 h-11 rounded-lg border border-bdr cursor-pointer p-1 bg-white/[0.04]"
                        />
                        <input
                          type="text"
                          value={heroData.bgColor}
                          onChange={(e) => setHeroData((p) => ({ ...p, bgColor: e.target.value }))}
                          className="flex-1 bg-white/[0.04] border border-bdr rounded-lg px-3 py-2.5 text-txt text-[13px] outline-none focus:border-gold/40 font-[inherit]"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {BG_PRESETS.map((color, i) => (
                          <div
                            key={color}
                            onClick={() => setHeroData((p) => ({ ...p, bgColor: color }))}
                            className={`w-10 h-10 rounded-lg cursor-pointer hover:scale-105 transition-all ${
                              heroData.bgColor === color
                                ? "border-2 border-gold"
                                : "border border-bdr-light hover:border-gold/50"
                            }`}
                            style={{ background: color }}
                            title={i === 0 ? "الأصلي" : color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* Hero Content */}
                <AccordionSection
                  title="قسم الهيرو الرئيسي"
                  defaultOpen={true}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                  }
                >
                  <div className="px-5 pb-5 pt-1 space-y-5">
                    <div>
                      <label className="text-txt-dim text-[13px] font-semibold block mb-2">العنوان (السطر الأول)</label>
                      <input
                        type="text"
                        value={heroData.line1}
                        onChange={(e) => setHeroData((p) => ({ ...p, line1: e.target.value }))}
                        className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit]"
                      />
                    </div>
                    <div>
                      <label className="text-txt-dim text-[13px] font-semibold block mb-2">العنوان (السطر الثاني — ذهبي)</label>
                      <input
                        type="text"
                        value={heroData.line2}
                        onChange={(e) => setHeroData((p) => ({ ...p, line2: e.target.value }))}
                        className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit]"
                      />
                    </div>
                    <div>
                      <label className="text-txt-dim text-[13px] font-semibold block mb-2">الوصف</label>
                      <textarea
                        rows={3}
                        value={heroData.desc}
                        onChange={(e) => setHeroData((p) => ({ ...p, desc: e.target.value }))}
                        className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit] resize-y leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-txt-dim text-[13px] font-semibold block mb-2">نص الزر الأول</label>
                        <input
                          type="text"
                          value={heroData.btn1}
                          onChange={(e) => setHeroData((p) => ({ ...p, btn1: e.target.value }))}
                          className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit]"
                        />
                      </div>
                      <div>
                        <label className="text-txt-dim text-[13px] font-semibold block mb-2">نص الزر الثاني</label>
                        <input
                          type="text"
                          value={heroData.btn2}
                          onChange={(e) => setHeroData((p) => ({ ...p, btn2: e.target.value }))}
                          className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit]"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* Badge */}
                <AccordionSection title="شريط الشعار">
                  <div className="px-5 pb-5 pt-1">
                    <label className="text-txt-dim text-[13px] font-semibold block mb-2">نص الشريط</label>
                    <input
                      type="text"
                      value={heroData.badge}
                      onChange={(e) => setHeroData((p) => ({ ...p, badge: e.target.value }))}
                      className="w-full bg-white/[0.04] border border-bdr rounded-lg px-4 py-3 text-txt text-[14px] outline-none focus:border-gold/40 font-[inherit]"
                    />
                  </div>
                </AccordionSection>
              </>
            )}

            {/* INSTITUTIONS Panel */}
            {activeTab === "institutions" && (
              <AccordionSection title="أنواع المؤسسات" defaultOpen={true}>
                <div className="px-5 pb-5 pt-1 space-y-3">
                  {INSTITUTIONS.map((inst, idx) => (
                    <div
                      key={idx}
                      className="bg-white/[0.02] border border-bdr-light rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-[13px] font-bold">{inst.title}</div>
                        <div className="text-[11px] text-txt-muted">{inst.desc}</div>
                      </div>
                      <Toggle
                        checked={institutionToggles[idx]}
                        onChange={(v) => {
                          const updated = [...institutionToggles];
                          updated[idx] = v;
                          setInstitutionToggles(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </AccordionSection>
            )}

            {/* FEATURES Panel */}
            {activeTab === "features" && (
              <AccordionSection title="قائمة المميزات" defaultOpen={true}>
                <div className="px-5 pb-5 pt-1 text-[13px] text-txt-muted">
                  عدّل المميزات المعروضة في الصفحة الرئيسية وأضف مميزات جديدة.
                </div>
              </AccordionSection>
            )}

            {/* PRICING Panel */}
            {activeTab === "pricing" && (
              <AccordionSection title="باقات الأسعار" defaultOpen={true}>
                <div className="px-5 pb-5 pt-1 text-[13px] text-txt-muted">
                  عدّل أسماء الباقات والأسعار والمميزات المتضمنة.
                </div>
              </AccordionSection>
            )}

            {/* FOOTER Panel */}
            {activeTab === "footer" && (
              <AccordionSection title="الفوتر" defaultOpen={true}>
                <div className="px-5 pb-5 pt-1 text-[13px] text-txt-muted">
                  روابط التواصل وحقوق النشر وشعار المنصة.
                </div>
              </AccordionSection>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-[#0a0a14] overflow-hidden border-s-2 border-gold/20 shadow-[-4px_0_20px_rgba(212,168,67,0.05)]">
          {/* Preview Bar */}
          <div className="px-4 py-2.5 border-b border-bdr flex items-center justify-between flex-shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="text-[10px] text-white/20 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              matin.ink
            </div>
            {/* Device Toggles */}
            <div className="flex gap-1">
              {(["desktop", "tablet", "mobile"] as DeviceSize[]).map((size) => {
                const icons = {
                  desktop: <Monitor size={16} />,
                  tablet: <Tablet size={16} />,
                  mobile: <Smartphone size={16} />,
                };
                const labels = { desktop: "كمبيوتر", tablet: "تابلت", mobile: "جوال" };
                return (
                  <button
                    key={size}
                    onClick={() => setDeviceSize(size)}
                    className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-semibold transition-all ${
                      deviceSize === size
                        ? "opacity-100 bg-gold/15 border-gold/30 text-txt-dim"
                        : "opacity-40 border-transparent text-txt-dim hover:opacity-100 hover:bg-gold/15 hover:border-gold/30"
                    }`}
                    aria-label={labels[size]}
                  >
                    {icons[size]}
                    {labels[size]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 flex items-start justify-center p-6 overflow-auto">
            <iframe
              className="rounded-xl border border-bdr shadow-2xl shadow-black/40 bg-bg transition-all duration-300"
              style={{ ...getFrameStyle(), minHeight: "100%", width: "100%" }}
              srcDoc={generatePreviewHTML()}
              title="معاينة الصفحة الرئيسية"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
