import React from 'react';
import UniversityTemplate from '../templates/UniversityTemplate';
import SchoolTemplate from '../templates/SchoolTemplate';
import QuranTemplate from '../templates/QuranTemplate';
import TrainingTemplate from '../templates/TrainingTemplate';
import InstituteTemplate from '../templates/InstituteTemplate';
import { getInstitutionRoute, getInstitutionColors, isValidInstitutionType } from '@/lib/routing';

const InstitutionLayout = ({ institution, user, children }) => {
  if (!institution) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#06060E',
        color: 'rgba(255,255,255,0.4)',
      }}>
        جاري تحميل بيانات المؤسسة...
      </div>
    );
  }

  const institutionType = institution.type;

  // التحقق من صحة نوع المؤسسة
  if (!isValidInstitutionType(institutionType)) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#06060E',
        color: '#EF4444',
      }}>
        نوع مؤسسة غير معروف: {institutionType}
      </div>
    );
  }

  // الحصول على معلومات التوجيه والألوان
  const route = getInstitutionRoute(institutionType);
  const colors = getInstitutionColors(institutionType);

  // بيانات المؤسسة المحسّنة
  const enhancedData = {
    name: institution.name || route.label,
    logo: institution.logoUrl || '',
    primary_color: institution.primary_color || colors.primary,
    secondary_color: institution.secondary_color || colors.secondary,
    accent_color: colors.accent,
    type: institutionType,
    icon: route.icon,
  };

  // اختيار القالب المناسب بناءً على نوع المؤسسة
  const renderTemplate = () => {
    switch (institutionType) {
      case 'university':
        return <UniversityTemplate data={enhancedData}>{children}</UniversityTemplate>;
      case 'school':
        return <SchoolTemplate data={enhancedData}>{children}</SchoolTemplate>;
      case 'quran_center':
        return <QuranTemplate data={enhancedData}>{children}</QuranTemplate>;
      case 'training_center':
        return <TrainingTemplate data={enhancedData}>{children}</TrainingTemplate>;
      case 'institute':
        return <InstituteTemplate data={enhancedData}>{children}</InstituteTemplate>;
      default:
        return <div>نوع مؤسسة غير معروف</div>;
    }
  };

  return (
    <div style={{
      direction: 'rtl',
      fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif',
    }}>
      {renderTemplate()}
    </div>
  );
};

export default InstitutionLayout;
