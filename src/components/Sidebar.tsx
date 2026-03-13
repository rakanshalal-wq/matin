'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   SIDEBAR — متين | قوائم 7 أدوار وفق الدستور السيادي v4
   ألوان: #0B0B16 خلفية، #C9A84C ذهبي، #EEEEF5 نص
═══════════════════════════════════════════════════════════ */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
  userRole?: string;
}

interface MenuItem { label: string; icon: string; href: string; }
interface MenuGroup { title: string; items: MenuItem[]; }

const getMenuByRole = (role: string): MenuGroup[] => {
  if (role === 'super_admin') {
    return [
      { title: 'النظرة العامة', items: [
        { label: 'لوحة التحكم', icon: '📊', href: '/dashboard/owner' },
        { label: 'الإحصائيات الشاملة', icon: '📈', href: '/dashboard/platform-analytics' },
      ]},
      { title: 'المالية السيادية', items: [
        { label: 'الإيرادات والمالية', icon: '💰', href: '/dashboard/finance' },
        { label: 'الضرائب السيادية', icon: '🏛', href: '/dashboard/taxes' },
        { label: 'الاشتراكات والباقات', icon: '📦', href: '/dashboard/subscriptions' },
        { label: 'الكوبونات', icon: '🎟', href: '/dashboard/coupons' },
        { label: 'العمولات والإحالات', icon: '🤝', href: '/dashboard/commissions' },
      ]},
      { title: 'إدارة المؤسسات', items: [
        { label: 'المؤسسات التعليمية', icon: '🏫', href: '/dashboard/schools' },
        { label: 'طلبات الانضمام', icon: '📋', href: '/dashboard/join-requests' },
        { label: 'الشركاء والموردون', icon: '🏢', href: '/dashboard/partners' },
      ]},
      { title: 'الإعلانات والمحتوى', items: [
        { label: 'الإعلانات السيادية', icon: '📢', href: '/dashboard/ads' },
        { label: 'الإشعارات الجماعية', icon: '🔔', href: '/dashboard/push-notifications' },
        { label: 'المكتبة الرقمية', icon: '📚', href: '/dashboard/library' },
      ]},
      { title: 'الذكاء الاصطناعي', items: [
        { label: 'المفتش الرقمي AI', icon: '🤖', href: '/dashboard/ai-chat' },
        { label: 'تحليلات المنصة', icon: '🧠', href: '/dashboard/question-analytics' },
      ]},
      { title: 'الأمان والتقارير', items: [
        { label: 'سجل الأمان (Audit Log)', icon: '🔐', href: '/dashboard/activity-log' },
        { label: 'التكاملات والـ API', icon: '🔗', href: '/dashboard/api' },
        { label: 'الدعم الفني', icon: '🎧', href: '/dashboard/support' },
        { label: 'النسخ الاحتياطي', icon: '💾', href: '/dashboard/backup' },
      ]},
    ];
  }

  if (['admin', 'school_owner', 'university_owner', 'institute_owner', 'kindergarten_owner', 'training_owner'].includes(role)) {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحة التحكم', icon: '📊', href: '/dashboard' },
        { label: 'صفحة المؤسسة', icon: '🏫', href: '/dashboard/school-page' },
        { label: 'الإعدادات', icon: '⚙️', href: '/dashboard/settings' },
      ]},
      { title: 'الأكاديمي', items: [
        { label: 'الطلاب', icon: '👨‍🎓', href: '/dashboard/students' },
        { label: 'المعلمون', icon: '👩‍🏫', href: '/dashboard/teachers' },
        { label: 'الفصول', icon: '🏛', href: '/dashboard/classes' },
        { label: 'الجداول', icon: '📅', href: '/dashboard/schedules' },
        { label: 'المناهج', icon: '📖', href: '/dashboard/curriculum' },
        { label: 'الحضور', icon: '✅', href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: '📝', href: '/dashboard/grades' },
        { label: 'الواجبات', icon: '📌', href: '/dashboard/homework' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'الاختبارات', icon: '📋', href: '/dashboard/exams' },
        { label: 'بنك الأسئلة', icon: '🗂', href: '/dashboard/question-bank' },
        { label: 'جدول الاختبارات', icon: '🗓', href: '/dashboard/exam-schedule' },
        { label: 'قاعات الاختبار', icon: '🏢', href: '/dashboard/exam-rooms' },
        { label: 'مراقبة الاختبار', icon: '👁', href: '/dashboard/exam-proctoring' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: '🎬', href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: '📡', href: '/dashboard/live-stream' },
        { label: 'المكتبة الرقمية', icon: '📚', href: '/dashboard/library' },
        { label: 'الأنشطة', icon: '🎯', href: '/dashboard/activities' },
      ]},
      { title: 'الموارد البشرية', items: [
        { label: 'الموظفون', icon: '👥', href: '/dashboard/employees' },
        { label: 'الرواتب', icon: '💵', href: '/dashboard/salaries' },
        { label: 'الإجازات', icon: '🌴', href: '/dashboard/leaves' },
        { label: 'الصلاحيات', icon: '🔑', href: '/dashboard/permissions' },
      ]},
      { title: 'المالية', items: [
        { label: 'المالية', icon: '💰', href: '/dashboard/finance' },
        { label: 'رسوم الطلاب', icon: '🧾', href: '/dashboard/student-fees' },
        { label: 'الاشتراك', icon: '📦', href: '/dashboard/subscribe' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'النقل المدرسي', icon: '🚌', href: '/dashboard/transport' },
        { label: 'الكافتيريا', icon: '🍽', href: '/dashboard/cafeteria' },
        { label: 'الصحة', icon: '🏥', href: '/dashboard/health' },
        { label: 'المتجر', icon: '🛒', href: '/dashboard/store' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: '💬', href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: '🔔', href: '/dashboard/push-notifications' },
        { label: 'الإعلانات', icon: '📢', href: '/dashboard/announcements' },
        { label: 'أولياء الأمور', icon: '👨‍👩‍👦', href: '/dashboard/parents' },
      ]},
      { title: 'الذكاء الاصطناعي', items: [
        { label: 'المساعد الذكي', icon: '🤖', href: '/dashboard/ai-chat' },
        { label: 'التقارير الذكية', icon: '📊', href: '/dashboard/reports' },
        { label: 'تحليلات الأداء', icon: '📈', href: '/dashboard/platform-analytics' },
      ]},
    ];
  }

  if (role === 'teacher') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: '📊', href: '/dashboard/teacher' },
        { label: 'ملفي الإنجازي', icon: '🏆', href: '/dashboard/teacher-assignments' },
      ]},
      { title: 'الفصول والطلاب', items: [
        { label: 'فصولي', icon: '🏛', href: '/dashboard/classes' },
        { label: 'طلابي', icon: '👨‍🎓', href: '/dashboard/students' },
        { label: 'الحضور', icon: '✅', href: '/dashboard/attendance' },
        { label: 'الدرجات', icon: '📝', href: '/dashboard/grades' },
        { label: 'الواجبات', icon: '📌', href: '/dashboard/homework' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'اختباراتي', icon: '📋', href: '/dashboard/exams' },
        { label: 'بنك الأسئلة', icon: '🗂', href: '/dashboard/question-bank' },
        { label: 'جدول الاختبارات', icon: '🗓', href: '/dashboard/exam-schedule' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: '🎬', href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: '📡', href: '/dashboard/live-stream' },
        { label: 'الأنشطة', icon: '🎯', href: '/dashboard/activities' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: '💬', href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: '🔔', href: '/dashboard/notifications' },
        { label: 'المساعد الذكي', icon: '🤖', href: '/dashboard/ai-chat' },
      ]},
    ];
  }

  if (role === 'student') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: '📊', href: '/dashboard/student' },
        { label: 'محفظتي الرقمية', icon: '🏆', href: '/dashboard/certificates' },
      ]},
      { title: 'الدراسة', items: [
        { label: 'جدولي', icon: '📅', href: '/dashboard/schedules' },
        { label: 'الواجبات', icon: '📌', href: '/dashboard/homework' },
        { label: 'درجاتي', icon: '📝', href: '/dashboard/grades' },
        { label: 'حضوري', icon: '✅', href: '/dashboard/attendance' },
      ]},
      { title: 'الاختبارات', items: [
        { label: 'اختباراتي', icon: '📋', href: '/dashboard/exams' },
        { label: 'أداء الاختبار', icon: '✍️', href: '/dashboard/exam-take' },
      ]},
      { title: 'التعليم الإلكتروني', items: [
        { label: 'المحاضرات', icon: '🎬', href: '/dashboard/lectures' },
        { label: 'البث المباشر', icon: '📡', href: '/dashboard/live-stream' },
        { label: 'المكتبة', icon: '📚', href: '/dashboard/library' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'المتجر', icon: '🛒', href: '/dashboard/store' },
        { label: 'المقصف', icon: '🍽', href: '/dashboard/cafeteria' },
        { label: 'الرسائل', icon: '💬', href: '/dashboard/messages' },
        { label: 'المساعد الذكي', icon: '🤖', href: '/dashboard/ai-chat' },
      ]},
    ];
  }

  if (role === 'parent') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: '📊', href: '/dashboard/parent' },
      ]},
      { title: 'متابعة الأبناء', items: [
        { label: 'الحضور والغياب', icon: '✅', href: '/dashboard/attendance' },
        { label: 'الدرجات والتقارير', icon: '📝', href: '/dashboard/grades' },
        { label: 'الواجبات', icon: '📌', href: '/dashboard/homework' },
        { label: 'الجدول الدراسي', icon: '📅', href: '/dashboard/schedules' },
        { label: 'الاختبارات', icon: '📋', href: '/dashboard/exams' },
      ]},
      { title: 'الخدمات', items: [
        { label: 'النقل المدرسي (GPS)', icon: '🚌', href: '/dashboard/transport' },
        { label: 'المقصف الذكي', icon: '🍽', href: '/dashboard/cafeteria' },
        { label: 'الصحة', icon: '🏥', href: '/dashboard/health' },
        { label: 'المدفوعات', icon: '💳', href: '/dashboard/parent/payments' },
      ]},
      { title: 'التواصل', items: [
        { label: 'الرسائل', icon: '💬', href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: '🔔', href: '/dashboard/notifications' },
        { label: 'المساعد الذكي', icon: '🤖', href: '/dashboard/ai-chat' },
      ]},
    ];
  }

  if (role === 'driver') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحتي', icon: '📊', href: '/dashboard' },
        { label: 'تطبيق السائق', icon: '🚌', href: '/driver-app' },
      ]},
      { title: 'العمليات', items: [
        { label: 'الطلاب في رحلتي', icon: '👨‍🎓', href: '/dashboard/student-tracking' },
        { label: 'الرسائل', icon: '💬', href: '/dashboard/messages' },
        { label: 'الإشعارات', icon: '🔔', href: '/dashboard/notifications' },
      ]},
    ];
  }

  if (role === 'platform_staff') {
    return [
      { title: 'الرئيسية', items: [
        { label: 'لوحة التحكم', icon: '📊', href: '/dashboard' },
      ]},
      { title: 'الدعم', items: [
        { label: 'تذاكر الدعم', icon: '🎧', href: '/dashboard/support' },
        { label: 'المؤسسات', icon: '🏫', href: '/dashboard/schools' },
        { label: 'الإشعارات', icon: '🔔', href: '/dashboard/push-notifications' },
      ]},
    ];
  }

  return [
    { title: 'الرئيسية', items: [
      { label: 'لوحة التحكم', icon: '📊', href: '/dashboard' },
      { label: 'الملف الشخصي', icon: '👤', href: '/profile' },
    ]},
  ];
};

const roleLabels: Record<string, string> = {
  'super_admin': 'مالك المنصة',
  'admin': 'مدير المؤسسة',
  'school_owner': 'مدير المدرسة',
  'university_owner': 'مدير الجامعة',
  'institute_owner': 'مدير المعهد',
  'kindergarten_owner': 'مدير الروضة',
  'training_owner': 'مدير التدريب',
  'teacher': 'معلم',
  'student': 'طالب',
  'parent': 'ولي أمر',
  'driver': 'سائق',
  'platform_staff': 'موظف المنصة',
};

export default function Sidebar({ isOpen, onClose, screenSize, userRole = 'admin' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('');

  const isOverlay = screenSize !== 'desktop';
  const sidebarWidth = 260;

  useEffect(() => {
    const stored = localStorage.getItem('matin_user');
    if (stored) {
      try { setUserName(JSON.parse(stored).name || ''); } catch {}
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('matin_token');
    localStorage.removeItem('matin_user');
    router.push('/login');
  };

  const menu = getMenuByRole(userRole);

  return (
    <>
      {isOverlay && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 998 }} />
      )}
      <aside style={{
        width: sidebarWidth,
        height: '100vh',
        background: '#0B0B16',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: isOverlay ? 'fixed' : 'sticky',
        top: 0,
        right: isOverlay ? (isOpen ? 0 : '-100%') : 0,
        zIndex: 999,
        transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* الشعار */}
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #C9A84C 0%, #E2C46A 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, fontWeight: 900, color: '#000', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(201,168,76,0.25)',
            }}>م</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#EEEEF5', letterSpacing: -0.5 }}>متين</div>
          </Link>
          <div style={{ marginTop: 10, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 7, padding: '4px 10px', display: 'inline-block' }}>
            <span style={{ color: '#C9A84C', fontSize: 11, fontWeight: 700 }}>
              {roleLabels[userRole] || userRole}
            </span>
          </div>
          {userName && (
            <div style={{ marginTop: 6, color: 'rgba(238,238,245,0.4)', fontSize: 12, fontWeight: 500 }}>{userName}</div>
          )}
        </div>

        {/* القائمة */}
        <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          {menu.map((group, gi) => (
            <div key={gi} style={{ marginBottom: 2 }}>
              <div style={{ padding: '6px 16px 3px', color: 'rgba(238,238,245,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                {group.title}
              </div>
              {group.items.map((item, ii) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={ii}
                    href={item.href}
                    onClick={isOverlay ? onClose : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 16px', textDecoration: 'none',
                      background: isActive ? 'rgba(201,168,76,0.08)' : 'transparent',
                      borderRight: isActive ? '3px solid #C9A84C' : '3px solid transparent',
                      transition: 'all 0.15s', margin: '1px 0',
                    }}
                  >
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{
                      color: isActive ? '#EEEEF5' : 'rgba(238,238,245,0.55)',
                      fontSize: 13, fontWeight: isActive ? 600 : 400,
                    }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* تسجيل الخروج */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
          <button
            onClick={logout}
            style={{
              width: '100%', background: 'rgba(239,68,68,0.07)', color: '#F87171',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: 9, padding: '9px 16px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.07)')}
          >
            <span>🚪</span> تسجيل الخروج
          </button>
          <div style={{ marginTop: 10, color: 'rgba(238,238,245,0.18)', fontSize: 10, textAlign: 'center', fontWeight: 500 }}>
            متين v4 — النظام السيادي للتعليم
          </div>
        </div>
      </aside>
    </>
  );
}
