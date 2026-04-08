import { useEffect, useState } from 'react';

interface Institution {
  id: string;
  name: string;
  type: 'university' | 'school' | 'institute' | 'quran_center' | 'training_center';
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
}

interface User {
  id: string;
  email: string;
  institution?: Institution;
  role?: string;
}

const useInstitution = () => {
  const [user, setUser] = useState<User | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // محاولة الحصول على البيانات من localStorage أولاً
        const storedUser = localStorage.getItem('matin_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          if (parsedUser.institution) {
            setInstitution(parsedUser.institution);
          }
          setLoading(false);
          return;
        }

        // إذا لم توجد بيانات في localStorage، تحقق من التوكن
        const token = localStorage.getItem('matin_token');
        if (token) {
          const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          
          if (data.valid && data.user) {
            setUser(data.user);
            localStorage.setItem('matin_user', JSON.stringify(data.user));
            
            if (data.user.institution) {
              setInstitution(data.user.institution);
            }
          } else {
            setError('فشل التحقق من المستخدم');
            window.location.href = '/login';
          }
        } else {
          setError('لم يتم العثور على توكن');
          window.location.href = '/login';
        }
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * تحديد الألوان بناءً على نوع المؤسسة
   */
  const getInstitutionColors = (type?: string) => {
    const institutionType = type || institution?.type;
    
    const colors: Record<string, { primary: string; secondary: string; accent: string }> = {
      university: {
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        accent: '#A78BFA',
      },
      school: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#60A5FA',
      },
      institute: {
        primary: '#10B981',
        secondary: '#064E3B',
        accent: '#34D399',
      },
      quran_center: {
        primary: '#EF4444',
        secondary: '#7F1D1D',
        accent: '#F87171',
      },
      training_center: {
        primary: '#F59E0B',
        secondary: '#78350F',
        accent: '#FBBF24',
      },
    };

    return colors[institutionType || 'university'] || colors.university;
  };

  /**
   * الحصول على مسار الملف الشخصي بناءً على نوع المؤسسة
   */
  const getInstitutionPath = () => {
    const type = institution?.type;
    
    const paths: Record<string, string> = {
      university: '/dashboard/university',
      school: '/dashboard/school',
      institute: '/dashboard/institute',
      quran_center: '/dashboard/quran',
      training_center: '/dashboard/training',
    };

    return paths[type || 'university'] || '/dashboard';
  };

  /**
   * التحقق من صلاحيات المستخدم
   */
  const hasPermission = (permission: string) => {
    // يمكن توسيع هذا لاحقاً بناءً على نظام الصلاحيات
    return true;
  };

  /**
   * تحديث بيانات المؤسسة
   */
  const updateInstitution = (newData: Partial<Institution>) => {
    const updated = { ...institution, ...newData } as Institution;
    setInstitution(updated);
    
    // تحديث بيانات المستخدم أيضاً
    if (user) {
      const updatedUser = { ...user, institution: updated };
      setUser(updatedUser);
      localStorage.setItem('matin_user', JSON.stringify(updatedUser));
    }
  };

  return {
    user,
    institution,
    loading,
    error,
    getInstitutionColors,
    getInstitutionPath,
    hasPermission,
    updateInstitution,
  };
};

export default useInstitution;
