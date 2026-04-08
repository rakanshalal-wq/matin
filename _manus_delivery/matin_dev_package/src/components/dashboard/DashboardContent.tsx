'use client';

import React from 'react';
import useDashboard from '@/hooks/useDashboard';
import useInstitution from '@/hooks/useInstitution';
import { StatCard, Card, Table, Button, Badge } from '@/components/ui';

interface DashboardContentProps {
  color?: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ color = '#D4A843' }) => {
  const { stats, students, loading, error, refreshData } = useDashboard();
  const { institution } = useInstitution();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
        جاري تحميل البيانات...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>
        {error}
        <br />
        <Button onClick={refreshData} variant="primary" color={color} style={{ marginTop: '16px' }}>
          إعادة محاولة
        </Button>
      </div>
    );
  }

  // تحديد الأيقونات والتسميات بناءً على نوع المؤسسة
  const getLabelsForInstitution = () => {
    const type = institution?.type;
    const labels: Record<string, any> = {
      university: {
        students: 'الطلاب',
        teachers: 'أعضاء هيئة التدريس',
        classes: 'الأقسام',
        exams: 'الامتحانات',
      },
      school: {
        students: 'الطلاب',
        teachers: 'المعلمون',
        classes: 'الفصول',
        exams: 'الامتحانات',
      },
      institute: {
        students: 'المتدربون',
        teachers: 'المدربون',
        classes: 'البرامج',
        exams: 'الشهادات',
      },
      quran_center: {
        students: 'الطلاب',
        teachers: 'المعلمون',
        classes: 'الفصول',
        exams: 'الاختبارات',
      },
      training_center: {
        students: 'المتدربون',
        teachers: 'المدربون',
        classes: 'الدورات',
        exams: 'الشهادات',
      },
    };

    return labels[type || 'university'] || labels.university;
  };

  const labels = getLabelsForInstitution();

  const studentColumns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'phone', label: 'الهاتف' },
    {
      key: 'status',
      label: 'الحالة',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'success' : 'warning'}>
          {value === 'active' ? 'نشط' : 'معلق'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="secondary" color={color}>
            تعديل
          </Button>
          <Button size="sm" variant="outline" color="#EF4444">
            حذف
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', direction: 'rtl' }}>
      {/* رأس الصفحة */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#EEEEF5', margin: 0 }}>
          لوحة التحكم
        </h1>
        <p style={{ color: 'rgba(238,238,245,0.55)', margin: '8px 0 0 0' }}>
          مرحباً بك في {institution?.name}
        </p>
      </div>

      {/* الإحصائيات */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <StatCard
          label={labels.students}
          value={stats?.total_students || 0}
          icon="👥"
          color={color}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          label={labels.teachers}
          value={stats?.total_teachers || 0}
          icon="👨‍🏫"
          color={color}
          trend="neutral"
          trendValue="لا تغيير"
        />
        <StatCard
          label={labels.classes}
          value={stats?.total_classes || 0}
          icon="📚"
          color={color}
          trend="up"
          trendValue="+5%"
        />
        <StatCard
          label={labels.exams}
          value={stats?.total_exams || 0}
          icon="📝"
          color={color}
          trend="up"
          trendValue="+8%"
        />
      </div>

      {/* الجدول */}
      <Card title={`قائمة ${labels.students}`} icon="👥" color={color}>
        <Table
          columns={studentColumns}
          data={students.slice(0, 5)}
          color={color}
          striped
          hoverable
        />
        {students.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(238,238,245,0.3)' }}>
            لا توجد بيانات لعرضها
          </div>
        )}
      </Card>

      {/* أزرار الإجراءات */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="primary" color={color}>
          إضافة {labels.students}
        </Button>
        <Button variant="secondary" color={color}>
          تصدير البيانات
        </Button>
        <Button variant="outline" color={color}>
          إعادة تحميل
        </Button>
      </div>
    </div>
  );
};

export default DashboardContent;
