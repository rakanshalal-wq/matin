import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useInstitution from '@/hooks/useInstitution';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredInstitutionType?: string;
  requiredPermission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredInstitutionType,
  requiredPermission,
}) => {
  const router = useRouter();
  const { user, institution, loading, hasPermission } = useInstitution();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // التحقق من تسجيل الدخول
    if (!user || !institution) {
      router.push('/login');
      return;
    }

    // التحقق من نوع المؤسسة إن وجد
    if (requiredInstitutionType && institution.type !== requiredInstitutionType) {
      router.push('/unauthorized');
      return;
    }

    // التحقق من الصلاحيات إن وجدت
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [user, institution, loading, requiredInstitutionType, requiredPermission, router, hasPermission]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#06060E',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        جاري التحميل...
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: '#06060E',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        جاري إعادة التوجيه...
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
