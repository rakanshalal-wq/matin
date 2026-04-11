'use client';
import { useEffect, useState } from 'react';
import { InstitutionType, getInstitutionColors, getInstitutionRoute } from '@/lib/routing';

interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
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
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            if (data.user.institution) {
              setInstitution(data.user.institution);
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'حدث خطأ');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const getColors = (type?: string) => {
    const t = (type || institution?.type || 'school') as InstitutionType;
    return getInstitutionColors(t);
  };

  const getPath = () => {
    const t = institution?.type || 'school';
    return getInstitutionRoute(t as InstitutionType).dashboardPath;
  };

  return { user, institution, loading, error, getColors, getPath };
};

export default useInstitution;
