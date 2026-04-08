'use client';
export const dynamic = 'force-dynamic';
import { BarChart3, Bug, CheckCircle, ClipboardList, Crown, Diamond, GraduationCap, Headphones, KeyRound, RefreshCw, Save, School, Trophy, Users, Zap } from "lucide-react";
import { useState, useEffect } from 'react';
import { PageHeader, StatCard, LoadingState } from '../_components';

export default function PlatformAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard-stats');
      const data = await res.json();
      setStats(data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <LoadingState message="جاري تحميل الإحصاءات..." />;

  return (
    <div className="page-container">
      <PageHeader
        title="إحصاءات المنصة"
        subtitle="نظرة شاملة على متين — مرئي للمؤسس فقط"
        icon={<BarChart3 size={22} />}
        action={
          <button className="btn-outline" onClick={fetchStats}>
            <RefreshCw size={15} /> تحديث
          </button>
        }
      />

      {stats && (
        <>
          <div className="stat-grid">
            <StatCard label="المدارس النشطة" value={stats.schools || 0} icon={<School size={20} />} color="#D4A843" />
            <StatCard label="ملاك المدارس" value={stats.owners || 0} icon={<Crown size={20} />} color="#8B5CF6" />
            <StatCard label="إجمالي الطلاب" value={stats.students || 0} icon={<GraduationCap size={20} />} color="#3B82F6" />
            <StatCard label="إجمالي المعلمين" value={stats.teachers || 0} icon={<Users size={20} />} color="#10B981" />
            <StatCard label="المستخدمون النشطون" value={stats.active_users || 0} icon={<CheckCircle size={20} />} color="#06B6D4" />
            <StatCard label="طلبات معلقة" value={stats.pending || 0} icon={<RefreshCw size={20} />} color="#F59E0B" />
          </div>

          <div className="analytics-grid">
            {/* توزيع الباقات */}
            <div className="dcard">
              <h3 className="card-section-title"><Diamond size={16} /> توزيع الباقات</h3>
              {[
                { label: 'مجاني', limit: '200 طالب', color: '#6B7280' },
                { label: 'متقدم — 299 ر.س', limit: '1000 طالب', color: 'var(--gold)' },
                { label: 'مؤسسي — 599 ر.س', limit: 'غير محدود', color: '#8B5CF6' },
              ].map((pkg, i) => (
                <div key={i} className={`list-row ${i < 2 ? 'list-row-border' : ''}`}>
                  <div className="list-row-label">
                    <span className="dot" style={{ background: pkg.color }} />
                    <span>{pkg.label}</span>
                  </div>
                  <span className="cell-sub">{pkg.limit}</span>
                </div>
              ))}
            </div>

            {/* القواعد الذهبية */}
            <div className="dcard">
              <h3 className="card-section-title"><Trophy size={16} /> القواعد الذهبية</h3>
              {[
                'مالك المنصة لا يرى بيانات المدارس',
                'كل مدرسة معزولة 100%',
                'الدرجات لا تنقص بعد الاعتماد',
                'الأسئلة مشفرة AES-256',
                'الحضور يسجله النظام تلقائياً',
                'التسجيلات لا تحذف — دليل دائم',
              ].map((rule, i) => (
                <div key={i} className={`list-row ${i < 5 ? 'list-row-border' : ''}`}>
                  <CheckCircle size={15} color="#10B981" />
                  <span className="cell-sub">{rule}</span>
                </div>
              ))}
            </div>

            {/* روابط سريعة */}
            <div className="dcard" style={{ gridColumn: '1 / -1' }}>
              <h3 className="card-section-title"><Zap size={16} /> روابط سريعة</h3>
              <div className="quick-links-grid">
                {[
                  { label: 'إدارة المدارس', href: '/dashboard/schools', icon: <School size={18} /> },
                  { label: 'المستخدمون', href: '/dashboard/users', icon: <Users size={18} /> },
                  { label: 'الاشتراكات', href: '/dashboard/subscriptions', icon: <Diamond size={18} /> },
                  { label: 'سجل العمليات', href: '/dashboard/activity-log', icon: <ClipboardList size={18} /> },
                  { label: 'مفاتيح الطوارئ', href: '/dashboard/emergency-keys', icon: <KeyRound size={18} /> },
                  { label: 'الدعم الفني', href: '/dashboard/support', icon: <Headphones size={18} /> },
                  { label: 'النسخ الاحتياطي', href: '/dashboard/backup', icon: <Save size={18} /> },
                  { label: 'سجل الأخطاء', href: '/dashboard/error-logs', icon: <Bug size={18} /> },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="quick-link-item">
                    <span className="quick-link-icon">{link.icon}</span>
                    <span className="cell-sub">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
