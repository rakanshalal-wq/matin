'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  School,
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  TrendingUp,
  Bell,
  Plus,
  ArrowLeft,
  Calendar,
  Clock
} from 'lucide-react';

// Types
interface Stats {
  students: number;
  teachers: number;
  classes: number;
  subjects: number;
  monthlyRevenue: number;
  attendanceRate: number;
}

interface Activity {
  id: string;
  type: 'student' | 'teacher' | 'payment' | 'exam';
  title: string;
  description: string;
  time: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
}

// Mock data - replace with API calls
const MOCK_STATS: Stats = {
  students: 245,
  teachers: 18,
  classes: 12,
  subjects: 15,
  monthlyRevenue: 45000,
  attendanceRate: 94
};

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', type: 'student', title: 'طالب جديد', description: 'تم تسجيل الطالب أحمد محمد في الصف الثالث', time: 'منذ 5 دقائق' },
  { id: '2', type: 'payment', title: 'دفعة جديدة', description: 'تم استلام دفعة بقيمة 2,500 ر.س', time: 'منذ 30 دقيقة' },
  { id: '3', type: 'teacher', title: 'معلم جديد', description: 'تم إضافة المعلم خالد عبدالله', time: 'منذ ساعة' },
  { id: '4', type: 'exam', title: 'اختبار قادم', description: 'اختبار نصف الفصل غداً للصف الرابع', time: 'منذ ساعتين' },
];

const MOCK_ALERTS: Alert[] = [
  { id: '1', type: 'warning', message: '5 طلاب غائبون عن الاختبار اليوم' },
  { id: '2', type: 'info', message: 'موعد اجتماع أولياء الأمور يوم الخميس' },
];

const QUICK_ACTIONS = [
  { id: 'student', label: 'إضافة طالب', icon: <GraduationCap size={20} />, color: '#34D399', href: '/school-dashboard/students' },
  { id: 'teacher', label: 'إضافة معلم', icon: <Users size={20} />, color: '#3B82F6', href: '/school-dashboard/teachers' },
  { id: 'class', label: 'إضافة فصل', icon: <School size={20} />, color: '#8B5CF6', href: '/school-dashboard/classes' },
  { id: 'payment', label: 'تسجيل دفعة', icon: <Wallet size={20} />, color: '#F59E0B', href: '/school-dashboard/finance' },
  { id: 'exam', label: 'إنشاء اختبار', icon: <BookOpen size={20} />, color: '#EF4444', href: '/school-dashboard/exams' },
  { id: 'report', label: 'تقرير الحضور', icon: <TrendingUp size={20} />, color: '#06B6D4', href: '/school-dashboard/attendance' },
];

export default function SchoolDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>(MOCK_STATS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('matin_token');
    const userData = localStorage.getItem('matin_user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'owner') {
      router.push('/dashboard');
      return;
    }

    // Fetch real data here
    fetchDashboardData(token);
  }, [router]);

  const fetchDashboardData = async (token: string) => {
    try {
      // Replace with actual API calls
      // const res = await fetch('/api/school/dashboard', { headers: { 'Authorization': `Bearer ${token}` }});
      // const data = await res.json();
      // setStats(data.stats);
      // setActivities(data.activities);
      
      setLoading(false);
    } catch (e) {
      console.error('Failed to fetch dashboard data:', e);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div>⟳</div>
        <span>جاري تحميل لوحة التحكم...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <div className="page-icon">
            <School size={22} />
          </div>
          <div>
            <h1 className="page-title">
              لوحة تحكم <span className="page-title-accent">المدرسة</span>
            </h1>
            <p className="page-subtitle">إدارة شاملة لجميع عمليات المدرسة</p>
          </div>
        </div>

        <div className="page-actions">
          <Link href="/school-dashboard/settings" className="btn btn-outline">
            <span>⚙️ إعدادات</span>
          </Link>
          <Link href="/school-dashboard/students/new" className="btn btn-primary">
            <Plus size={16} />
            <span>طالب جديد</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {alerts.map((alert) => (
        <div key={alert.id} className={alert.type === 'warning' ? 'error-box' : 'alert-bar'} style={{ marginBottom: '16px' }}>
          <Bell size={16} />
          <span>{alert.message}</span>
        </div>
      ))}

      {/* Stats Grid */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', borderColor: 'rgba(52,211,153,0.25)' }}>
            <GraduationCap size={20} />
          </div>
          <div className="stat-val">{stats.students.toLocaleString('ar-SA')}</div>
          <div className="stat-lbl">إجمالي الطلاب</div>
          <div className="stat-sub">↑ 12 طالب جديد هذا الشهر</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', borderColor: 'rgba(59,130,246,0.25)' }}>
            <Users size={20} />
          </div>
          <div className="stat-val">{stats.teachers.toLocaleString('ar-SA')}</div>
          <div className="stat-lbl">المعلمين</div>
          <div className="stat-sub">↑ معلم جديد</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6', borderColor: 'rgba(139,92,246,0.25)' }}>
            <School size={20} />
          </div>
          <div className="stat-val">{stats.classes.toLocaleString('ar-SA')}</div>
          <div className="stat-lbl">الفصول الدراسية</div>
          <div className="stat-sub">↓ فصل واحد متوقف</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', borderColor: 'rgba(245,158,11,0.25)' }}>
            <Wallet size={20} />
          </div>
          <div className="stat-val">{stats.monthlyRevenue.toLocaleString('ar-SA')} ر.س</div>
          <div className="stat-lbl">إيرادات الشهر</div>
          <div className="stat-sub">↑ 15% عن الشهر الماضي</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-label">إجراءات سريعة</div>
      <div className="qa-grid" style={{ marginBottom: '28px' }}>
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.id} href={action.href} className="qa-item">
            <div className="qa-icon" style={{ background: `${action.color}20`, color: action.color }}>
              {action.icon}
            </div>
            <div className="qa-label">{action.label}</div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activity */}
        <div className="dcard">
          <div className="dcard-header">
            <div className="dcard-title">
              <Clock size={18} style={{ color: 'var(--accent)' }} />
              آخر النشاطات
            </div>
            <Link href="/school-dashboard/activity" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
              عرض الكل ←
            </Link>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {activities.map((activity, index) => (
              <div key={activity.id} style={{ 
                display: 'flex', 
                gap: '12px', 
                padding: '12px 0',
                borderBottom: index < activities.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '9px',
                  background: activity.type === 'student' ? 'rgba(52,211,153,0.15)' :
                             activity.type === 'teacher' ? 'rgba(59,130,246,0.15)' :
                             activity.type === 'payment' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: activity.type === 'student' ? '#34D399' :
                         activity.type === 'teacher' ? '#3B82F6' :
                         activity.type === 'payment' ? '#F59E0B' : '#EF4444'
                }}>
                  {activity.type === 'student' && <GraduationCap size={16} />}
                  {activity.type === 'teacher' && <Users size={16} />}
                  {activity.type === 'payment' && <Wallet size={16} />}
                  {activity.type === 'exam' && <BookOpen size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{activity.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.description}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '4px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="dcard">
          <div className="dcard-header">
            <div className="dcard-title">
              <Calendar size={18} style={{ color: 'var(--accent)' }} />
              نسبة الحضور اليوم
            </div>
            <Link href="/school-dashboard/attendance" style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
              التفاصيل ←
            </Link>
          </div>
          <div style={{ padding: '24px 20px', textAlign: 'center' }}>
            <div style={{ 
              width: '140px', 
              height: '140px', 
              borderRadius: '50%',
              background: `conic-gradient(#34D399 ${stats.attendanceRate * 3.6}deg, rgba(255,255,255,0.05) 0)`,
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ 
                width: '110px', 
                height: '110px', 
                borderRadius: '50%',
                background: 'var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#34D399' }}>{stats.attendanceRate}%</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>نسبة الحضور</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#34D399' }}>{Math.round(stats.students * stats.attendanceRate / 100)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>حاضر</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#EF4444' }}>{stats.students - Math.round(stats.students * stats.attendanceRate / 100)}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>غائب</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
