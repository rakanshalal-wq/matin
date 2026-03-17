'use client';

/* MATIN DESIGN SYSTEM — Features Page
   Dark Premium SaaS | RTL | Cairo Font
   Per Constitution v4: 3 lecture types (in-person, online, recorded), 25% absence limit, 7 user levels */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  GraduationCap, Shield, BarChart3, Bell, Bus, Utensils,
  Brain, Users, BookOpen, Calendar, FileText, CreditCard,
  MapPin, MessageSquare, Lock, Activity, Database, Zap,
  Star, CheckCircle, ArrowLeft, Heart, Award, TrendingUp,
  Video, Wifi, PlayCircle, AlertTriangle, Upload, FileSpreadsheet,
  Layers, BookMarked, FlaskConical, Cpu, Briefcase, Scroll
} from "lucide-react";

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const featureCategories = [
  {
    title: "الإدارة الأكاديمية",
    icon: <GraduationCap size={24} />,
    color: "#D4A843",
    features: [
      { title: "الجداول الدراسية الذكية", desc: "إنشاء وتعديل الجداول تلقائياً مع تجنب التعارضات وتوزيع الأعباء" },
      { title: "إدارة الدرجات", desc: "إدخال وتحليل الدرجات مع حساب المعدلات التراكمية وتقارير الأداء" },
      { title: "الحضور والغياب", desc: "تسجيل دقيق مع تنبيهات فورية لأولياء الأمور — حد الغياب 25% تلقائي" },
      { title: "الاختبارات الإلكترونية", desc: "اختبارات آمنة مع كشف الغش وبنك أسئلة متقدم ونتائج فورية" },
      { title: "الواجبات المنزلية", desc: "إدارة الواجبات والتسليمات مع تتبع الإنجاز وتقييم المعلم" },
      { title: "المحتوى التعليمي", desc: "رفع ومشاركة المواد والمحاضرات والملفات بصيغ متعددة" },
    ],
  },
  {
    title: "أنواع المحاضرات الثلاثة",
    icon: <Video size={24} />,
    color: "#60A5FA",
    highlight: true,
    features: [
      {
        title: "المحاضرة الحضورية",
        desc: "إدارة الفصول الدراسية التقليدية مع تسجيل الحضور الفوري وإشعار أولياء الأمور",
        icon: <Users size={18} />
      },
      {
        title: "المحاضرة الأونلاين",
        desc: "بث مباشر متكامل مع إدارة الطلاب وتسجيل الحضور الرقمي وأدوات التفاعل",
        icon: <Wifi size={18} />
      },
      {
        title: "المحاضرة المسجلة",
        desc: "تسجيل المحاضرات ورفعها للمكتبة الرقمية ليتمكن الطلاب من المشاهدة في أي وقت",
        icon: <PlayCircle size={18} />
      },
      { title: "المكتبة الرقمية", desc: "تخزين وتنظيم جميع المحاضرات المسجلة والمواد التعليمية بشكل منظم" },
      { title: "تتبع المشاهدة", desc: "متابعة مشاهدة الطلاب للمحاضرات المسجلة وتسجيل الإنجاز" },
      { title: "التفاعل المباشر", desc: "أسئلة وأجوبة وتصويت وتفاعل مباشر في المحاضرات الأونلاين" },
    ],
  },
  {
    title: "الإدارة المؤسسية",
    icon: <Users size={24} />,
    color: "#22C55E",
    features: [
      { title: "7 مستويات صلاحيات", desc: "RBAC متقدم: مالك المنصة، موظفو المنصة، مالك المؤسسة، مدير، كادر، معلم، طالب/ولي أمر" },
      { title: "القبول والتسجيل", desc: "نظام قبول شامل مع التحقق من نظام نور الحكومي وإدارة الطلبات" },
      { title: "إدارة الفصول", desc: "توزيع الطلاب والمعلمين على الفصول بكفاءة مع إدارة الطاقة الاستيعابية" },
      { title: "الملفات الشخصية", desc: "ملفات شاملة للطلاب والمعلمين والموظفين مع التاريخ الكامل" },
      { title: "التقارير الإدارية", desc: "تقارير مفصلة لكل جانب من جوانب المؤسسة بصيغ متعددة" },
      { title: "إدارة متعددة الفروع", desc: "إدارة مركزية لجميع فروع المؤسسة من لوحة تحكم واحدة" },
    ],
  },
  {
    title: "الأمان والحماية",
    icon: <Shield size={24} />,
    color: "#60A5FA",
    features: [
      { title: "8 طبقات أمان", desc: "جدار حماية، TLS 1.3، 2FA، AES-256، RBAC، IDS، Audit Logs، AI Auditor" },
      { title: "المصادقة الثنائية", desc: "حماية الحسابات بكلمة مرور + رمز تحقق عبر Google Authenticator" },
      { title: "تشفير البيانات", desc: "تشفير كامل AES-256 للبيانات المخزنة والمنقولة بـ TLS 1.3" },
      { title: "سجلات الأمان", desc: "تسجيل كامل لجميع العمليات لا يمكن حذفه — Audit Logs شاملة" },
      { title: "المراقبة الذكية", desc: "AI Auditor يكتشف الشذوذ والتهديدات فوراً ويُنبّه الفريق التقني" },
      { title: "عزل البيانات", desc: "Multi-tenancy يضمن عزل كامل لبيانات كل مؤسسة عن الأخرى" },
    ],
  },
  {
    title: "الخدمات الإضافية",
    icon: <Star size={24} />,
    color: "#F97316",
    features: [
      { title: "النقل المدرسي", desc: "تتبع حي بـ GPS مع إشعارات الركوب والنزول لأولياء الأمور فوراً" },
      { title: "المقصف الذكي", desc: "إدارة الطلبات والدفع الإلكتروني في المقصف المدرسي" },
      { title: "الملتقى المجتمعي", desc: "فضاء آمن للتواصل بين الطلاب والمعلمين وأولياء الأمور" },
      { title: "الصحة النفسية", desc: "مراقبة ذكية وسرية لصحة الطلاب النفسية مع تنبيهات مبكرة" },
      { title: "الأنشطة اللاصفية", desc: "إدارة الأنشطة والبرامج التدريبية الإضافية والرحلات المدرسية" },
      { title: "الخدمات الطبية", desc: "تسجيل الحساسيات والملفات الطبية بأمان تام" },
    ],
  },
  {
    title: "الذكاء الاصطناعي",
    icon: <Brain size={24} />,
    color: "#EC4899",
    features: [
      { title: "التوجيه المهني الذكي", desc: "تحليل مهارات الطالب واقتراح مسارات وظيفية متوافقة مع رؤية 2030" },
      { title: "جواز سفر المهارات", desc: "ملف رقمي يتابع الطالب مدى الحياة عبر المؤسسات التعليمية" },
      { title: "متين كوين", desc: "اقتصاد داخلي يحفز الطلاب على الإنجاز والمشاركة الإيجابية" },
      { title: "AI Well-being", desc: "مراقبة الصحة النفسية بطريقة سرية وإنسانية مع تدخل مبكر" },
      { title: "المحفظة التعليمية", desc: "ملف شامل ينتقل مع الطالب بين المؤسسات التعليمية" },
      { title: "التحليلات التنبؤية", desc: "توقع أداء الطلاب والتدخل المبكر قبل الرسوب" },
    ],
  },
  {
    title: "التحليلات والتقارير",
    icon: <BarChart3 size={24} />,
    color: "#A78BFA",
    features: [
      { title: "لوحات تحكم تفاعلية", desc: "رسوم بيانية وإحصائيات حية لكل مستوى من مستويات المنصة" },
      { title: "تقارير الأداء", desc: "تقارير مفصلة لأداء الطلاب والمعلمين والمؤسسة ككل" },
      { title: "تقارير الحضور", desc: "إحصائيات الحضور والغياب مع تنبيه عند تجاوز حد 25%" },
      { title: "التقارير المالية", desc: "متابعة الرسوم والمدفوعات والمتأخرات والإيرادات" },
      { title: "تقارير وزارة التعليم", desc: "إرسال التقارير الرسمية لوزارة التعليم تلقائياً" },
      { title: "تصدير البيانات", desc: "تصدير جميع البيانات بصيغ PDF وExcel وCSV" },
    ],
  },
];

// ===== بنك الأسئلة — نظام المسارات =====
const questionBankTracks = [
  {
    stage: "الابتدائية",
    color: "#22C55E",
    icon: <BookOpen size={18} />,
    grades: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"],
    subjects: ["لغتي الخالدة", "الرياضيات", "العلوم", "الدراسات الإسلامية", "القرآن الكريم", "اللغة الإنجليزية", "التربية الفنية", "التربية البدنية", "المهارات الحياتية"],
    note: "9 مواد — مشتركة لجميع الصفوف"
  },
  {
    stage: "المتوسطة",
    color: "#60A5FA",
    icon: <BookMarked size={18} />,
    grades: ["الأول", "الثاني", "الثالث"],
    subjects: ["لغتي الخالدة", "الرياضيات", "العلوم", "الدراسات الإسلامية", "القرآن الكريم", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "التربية الوطنية", "المهارات الرقمية"],
    note: "10 مواد — مشتركة لجميع الصفوف"
  },
  {
    stage: "أول ثانوي (مشترك)",
    color: "#F59E0B",
    icon: <GraduationCap size={18} />,
    grades: ["السنة الأولى"],
    subjects: ["لغتي الخالدة", "الرياضيات", "العلوم", "الدراسات الإسلامية", "اللغة الإنجليزية", "التاريخ", "الجغرافيا", "علم البيئة", "التقنية الرقمية"],
    note: "سنة تأسيسية مشتركة لجميع المسارات"
  },
  {
    stage: "المسار العام",
    color: "#8B5CF6",
    icon: <Layers size={18} />,
    grades: ["ثاني ثانوي", "ثالث ثانوي"],
    subjects: ["الكفايات اللغوية", "الدراسات الأدبية", "اللغة الإنجليزية", "الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "علوم الأرض والفضاء", "الدراسات الإسلامية"],
    note: "يتيح جميع التخصصات الجامعية"
  },
  {
    stage: "علوم الحاسب والهندسة",
    color: "#06B6D4",
    icon: <Cpu size={18} />,
    grades: ["ثاني ثانوي", "ثالث ثانوي"],
    subjects: ["الرياضيات", "الفيزياء", "الكيمياء", "علم البيانات", "الهندسة", "انترنت الأشياء", "الذكاء الاصطناعي", "الأمن السيبراني", "هندسة البرمجيات"],
    note: "يؤهل لتخصصات التقنية والهندسة"
  },
  {
    stage: "الصحة والحياة",
    color: "#EF4444",
    icon: <FlaskConical size={18} />,
    grades: ["ثاني ثانوي", "ثالث ثانوي"],
    subjects: ["الكيمياء", "الأحياء", "الفيزياء", "أنظمة جسم الإنسان", "التغذية والصحة", "الصحة العامة", "التصميم الهندسي", "اللياقة والثقافة الصحية"],
    note: "يؤهل لكليات الطب والصحة"
  },
  {
    stage: "إدارة الأعمال",
    color: "#F97316",
    icon: <Briefcase size={18} />,
    grades: ["ثاني ثانوي", "ثالث ثانوي"],
    subjects: ["الرياضيات", "مبادئ المحاسبة", "مبادئ الإدارة", "الاقتصاد", "القانون", "التسويق", "ريادة الأعمال", "المحاسبة المالية"],
    note: "يؤهل لكليات الإدارة والاقتصاد"
  },
  {
    stage: "المسار الشرعي",
    color: "#10B981",
    icon: <Scroll size={18} />,
    grades: ["ثاني ثانوي", "ثالث ثانوي"],
    subjects: ["التفسير وعلوم القرآن", "الحديث وعلومه", "الفقه وأصوله", "العقيدة والمذاهب", "التاريخ الإسلامي", "القانون", "الفقه المقارن", "السيرة النبوية"],
    note: "يؤهل لكليات الشريعة والدراسات الإسلامية"
  },
];

// Absence limit highlight
const absenceHighlight = {
  icon: <AlertTriangle size={24} />,
  color: "#F97316",
  title: "نظام الغياب الذكي",
  desc: "عند تجاوز الطالب حد 25% غياب، يُرسل النظام تنبيهاً فورياً لولي الأمر والإدارة، ويُسجّل الحالة تلقائياً في ملف الطالب.",
};

export default function Features() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">المميزات الكاملة</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            أكثر من <span className="text-gold-gradient">30 ميزة</span> متكاملة
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            منصة متين تغطي كل جانب من جوانب إدارة المؤسسة التعليمية، من القبول حتى التخرج، بأمان لا يُساوم عليه.
          </p>
        </div>
      </section>

      {/* Absence Limit Highlight */}
      <section className="pb-8">
        <div className="container">
          <div
            className="rounded-2xl p-6 fade-in-up flex items-start gap-4"
            style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: "rgba(249,115,22,0.15)", color: "#F97316" }}
            >
              {absenceHighlight.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">{absenceHighlight.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{absenceHighlight.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {featureCategories.map((category, catIdx) => (
        <section key={catIdx} className={`py-16 ${catIdx % 2 === 0 ? "bg-[#0d0d0d]" : ""}`}>
          <div className="container">
            <div className="flex items-center gap-3 mb-10 fade-in-up">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${category.color}15`, color: category.color }}
              >
                {category.icon}
              </div>
              <h2 className="text-2xl font-black text-white">{category.title}</h2>
              {category.highlight && (
                <span
                  className="text-xs px-3 py-1 rounded-full font-bold"
                  style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.3)" }}
                >
                  جديد في الدستور v4
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.features.map((feature, i) => (
                <div key={i} className="matin-card p-5 fade-in-up" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: category.color }} />
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* بنك الأسئلة — نظام المسارات */}
      <section className="py-20 bg-[#080808]">
        <div className="container">
          <div className="text-center mb-12 fade-in-up">
            <span className="section-label mb-4 inline-flex">بنك الأسئلة الذكي</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-3 mb-4">
              يدعم <span className="text-gold-gradient">نظام المسارات</span> الجديد
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              بنك أسئلة شامل يغطي جميع المراحل الدراسية وفق هيكل وزارة التعليم السعودية 1445هـ — من الأول الابتدائي حتى الثالث الثانوي بجميع مساراته الخمسة
            </p>
          </div>

          {/* طرق إدخال الأسئلة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14 fade-in-up">
            {[
              {
                icon: <FileSpreadsheet size={28} />,
                title: "رفع Excel",
                desc: "رفع مئات الأسئلة دفعة واحدة عبر نموذج Excel جاهز مع التحقق التلقائي من البيانات",
                color: "#22C55E",
                badge: "الأسرع"
              },
              {
                icon: <Brain size={28} />,
                title: "توليد بالذكاء الاصطناعي",
                desc: "توليد أسئلة تلقائياً بناءً على المادة والمستوى ومستوى بلوم المطلوب",
                color: "#EC4899",
                badge: "الأذكى"
              },
              {
                icon: <FileText size={28} />,
                title: "إدخال يدوي",
                desc: "إضافة الأسئلة يدوياً مع دعم الصور والمعادلات الرياضية وتنسيق النص",
                color: "#60A5FA",
                badge: "الأدق"
              }
            ].map((method, i) => (
              <div key={i} className="matin-card p-6 fade-in-up text-center" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${method.color}15`, color: method.color }}>
                  {method.icon}
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="text-white font-bold text-lg">{method.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: `${method.color}20`, color: method.color }}>{method.badge}</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{method.desc}</p>
              </div>
            ))}
          </div>

          {/* المسارات والمراحل */}
          <h3 className="text-xl font-black text-white mb-6 fade-in-up">
            المراحل والمسارات المدعومة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {questionBankTracks.map((track, i) => (
              <div key={i} className="matin-card p-5 fade-in-up" style={{ transitionDelay: `${i * 50}ms`, borderRight: `3px solid ${track.color}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${track.color}15`, color: track.color }}>
                    {track.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{track.stage}</h4>
                    <p className="text-gray-600 text-xs">{track.grades.join(" — ")}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {track.subjects.slice(0, 4).map((subj, j) => (
                    <span key={j} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${track.color}10`, color: track.color }}>
                      {subj}
                    </span>
                  ))}
                  {track.subjects.length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                      +{track.subjects.length - 4} مادة
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-xs border-t border-gray-800 pt-2">{track.note}</p>
              </div>
            ))}
          </div>

          {/* إحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-up">
            {[
              { num: "5", label: "مسارات ثانوية", color: "#C9A84C" },
              { num: "12", label: "صف دراسي", color: "#60A5FA" },
              { num: "60+", label: "مادة دراسية", color: "#22C55E" },
              { num: "6", label: "أنواع أسئلة", color: "#EC4899" },
            ].map((stat, i) => (
              <div key={i} className="matin-card p-5 text-center">
                <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.num}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0d0d0d]">
        <div className="container text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            جاهز لتجربة <span className="text-gold-gradient">متين</span>؟
          </h2>
          <p className="text-gray-500 mb-8">ابدأ تجربتك المجانية اليوم — لا يلزم بطاقة ائتمانية</p>
          <a href="https://app.matin.ink/register" className="btn-gold px-8 py-4 rounded-2xl text-base font-bold inline-flex items-center gap-2">
            ابدأ مجاناً الآن
            <ArrowLeft size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
