import { getHeaders } from '@/lib/api';

/**
 * خدمة لوحة التحكم
 * توفر دوال للتواصل مع API للحصول على البيانات الديناميكية
 */

export interface DashboardStats {
  total_students?: number;
  total_teachers?: number;
  total_classes?: number;
  total_exams?: number;
  pending_admissions?: number;
  active_courses?: number;
  total_revenue?: number;
  completion_rate?: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities?: any[];
  upcomingEvents?: any[];
  pendingTasks?: any[];
}

/**
 * الحصول على إحصائيات لوحة التحكم
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await fetch('/api/dashboard-stats', {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب الإحصائيات');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return {};
  }
};

/**
 * الحصول على بيانات لوحة التحكم الكاملة
 */
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const [stats, activities, events, tasks] = await Promise.all([
      getDashboardStats(),
      getRecentActivities(),
      getUpcomingEvents(),
      getPendingTasks(),
    ]);

    return {
      stats,
      recentActivities: activities,
      upcomingEvents: events,
      pendingTasks: tasks,
    };
  } catch (error) {
    console.error('خطأ في جلب بيانات لوحة التحكم:', error);
    return {
      stats: {},
    };
  }
};

/**
 * الحصول على الأنشطة الحديثة
 */
export const getRecentActivities = async (limit: number = 10): Promise<any[]> => {
  try {
    const response = await fetch(`/api/activities?limit=${limit}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب الأنشطة');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الأنشطة:', error);
    return [];
  }
};

/**
 * الحصول على الأحداث القادمة
 */
export const getUpcomingEvents = async (limit: number = 5): Promise<any[]> => {
  try {
    const response = await fetch(`/api/events?upcoming=true&limit=${limit}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب الأحداث');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الأحداث:', error);
    return [];
  }
};

/**
 * الحصول على المهام المعلقة
 */
export const getPendingTasks = async (limit: number = 5): Promise<any[]> => {
  try {
    const response = await fetch(`/api/tasks?status=pending&limit=${limit}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب المهام');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب المهام:', error);
    return [];
  }
};

/**
 * الحصول على قائمة الطلاب
 */
export const getStudents = async (limit: number = 20, offset: number = 0): Promise<any[]> => {
  try {
    const response = await fetch(`/api/students?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب قائمة الطلاب');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الطلاب:', error);
    return [];
  }
};

/**
 * الحصول على قائمة المعلمين
 */
export const getTeachers = async (limit: number = 20, offset: number = 0): Promise<any[]> => {
  try {
    const response = await fetch(`/api/teachers?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب قائمة المعلمين');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب المعلمين:', error);
    return [];
  }
};

/**
 * الحصول على قائمة الفصول
 */
export const getClasses = async (limit: number = 20, offset: number = 0): Promise<any[]> => {
  try {
    const response = await fetch(`/api/classes?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب قائمة الفصول');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الفصول:', error);
    return [];
  }
};

/**
 * الحصول على قائمة الامتحانات
 */
export const getExams = async (limit: number = 20, offset: number = 0): Promise<any[]> => {
  try {
    const response = await fetch(`/api/exams?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في جلب قائمة الامتحانات');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الامتحانات:', error);
    return [];
  }
};

/**
 * إنشاء طالب جديد
 */
export const createStudent = async (data: any): Promise<any> => {
  try {
    const response = await fetch('/api/students', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('فشل في إنشاء الطالب');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في إنشاء الطالب:', error);
    throw error;
  }
};

/**
 * تحديث بيانات الطالب
 */
export const updateStudent = async (id: string, data: any): Promise<any> => {
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('فشل في تحديث الطالب');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في تحديث الطالب:', error);
    throw error;
  }
};

/**
 * حذف الطالب
 */
export const deleteStudent = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('فشل في حذف الطالب');
    }
  } catch (error) {
    console.error('خطأ في حذف الطالب:', error);
    throw error;
  }
};

/**
 * الموافقة على طلب انضمام
 */
export const approveAdmission = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`/api/admission/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'approved' }),
    });

    if (!response.ok) {
      throw new Error('فشل في الموافقة على الطلب');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في الموافقة على الطلب:', error);
    throw error;
  }
};

/**
 * رفض طلب انضمام
 */
export const rejectAdmission = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`/api/admission/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'rejected' }),
    });

    if (!response.ok) {
      throw new Error('فشل في رفض الطلب');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في رفض الطلب:', error);
    throw error;
  }
};
