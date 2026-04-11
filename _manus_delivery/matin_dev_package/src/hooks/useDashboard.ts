import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardData,
  getDashboardStats,
  getStudents,
  getTeachers,
  getClasses,
  getExams,
  DashboardStats,
  DashboardData,
} from '@/services/dashboardService';

interface UseDashboardReturn {
  data: DashboardData | null;
  stats: DashboardStats | null;
  students: any[];
  teachers: any[];
  classes: any[];
  exams: any[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

/**
 * Hook لإدارة بيانات لوحة التحكم
 */
const useDashboard = (): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * تحميل بيانات لوحة التحكم
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardData = await getDashboardData();
      setData(dashboardData);
      setStats(dashboardData.stats || null);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل بيانات لوحة التحكم');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * تحميل قائمة الطلاب
   */
  const loadStudents = useCallback(async () => {
    try {
      const studentsList = await getStudents(20, 0);
      setStudents(studentsList);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل قائمة الطلاب');
    }
  }, []);

  /**
   * تحميل قائمة المعلمين
   */
  const loadTeachers = useCallback(async () => {
    try {
      const teachersList = await getTeachers(20, 0);
      setTeachers(teachersList);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل قائمة المعلمين');
    }
  }, []);

  /**
   * تحميل قائمة الفصول
   */
  const loadClasses = useCallback(async () => {
    try {
      const classesList = await getClasses(20, 0);
      setClasses(classesList);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل قائمة الفصول');
    }
  }, []);

  /**
   * تحميل قائمة الامتحانات
   */
  const loadExams = useCallback(async () => {
    try {
      const examsList = await getExams(20, 0);
      setExams(examsList);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل قائمة الامتحانات');
    }
  }, []);

  /**
   * تحديث الإحصائيات
   */
  const refreshStats = useCallback(async () => {
    try {
      const newStats = await getDashboardStats();
      setStats(newStats);
    } catch (err: any) {
      setError(err.message || 'فشل في تحديث الإحصائيات');
    }
  }, []);

  /**
   * تحديث جميع البيانات
   */
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadDashboardData(),
      loadStudents(),
      loadTeachers(),
      loadClasses(),
      loadExams(),
    ]);
  }, [loadDashboardData, loadStudents, loadTeachers, loadClasses, loadExams]);

  /**
   * تحميل البيانات عند تحميل المكون
   */
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    stats,
    students,
    teachers,
    classes,
    exams,
    loading,
    error,
    refreshData,
    refreshStats,
  };
};

export default useDashboard;
