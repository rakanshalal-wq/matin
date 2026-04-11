'use client';

import React from 'react';
import useInstitution from '@/hooks/useInstitution';
import { getInstitutionColors } from '@/lib/routing';
import DashboardContent from './DashboardContent';

const DashboardWrapper: React.FC = () => {
  const { institution } = useInstitution();

  if (!institution) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }}>
        جاري تحميل بيانات المؤسسة...
      </div>
    );
  }

  const colors = getInstitutionColors(institution.type);

  return <DashboardContent color={colors.primary} />;
};

export default DashboardWrapper;
