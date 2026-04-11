import { getHeaders } from '@/lib/api';

export interface DashboardStats {
  totalStudents?: number;
  totalTeachers?: number;
  totalCourses?: number;
  totalClasses?: number;
  totalRevenue?: number;
  activeSubscriptions?: number;
  pendingRequests?: number;
  recentActivity?: ActivityItem[];
  [key: string]: any;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  quickActions?: QuickAction[];
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export const dashboardService = {
  async getStats(institutionType?: string): Promise<DashboardStats> {
    const endpoint = institutionType
      ? `/api/dashboard/stats?type=${institutionType}`
      : '/api/dashboard/stats';
    const res = await fetch(endpoint, { headers: getHeaders() });
    if (!res.ok) throw new Error('فشل تحميل الإحصائيات');
    return res.json();
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    const res = await fetch(`/api/dashboard/activity?limit=${limit}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('فشل تحميل النشاط الأخير');
    return res.json();
  },

  async getDashboardData(institutionType?: string): Promise<DashboardData> {
    const [stats, recentActivity] = await Promise.all([
      dashboardService.getStats(institutionType),
      dashboardService.getActivity(),
    ]);
    return { stats, recentActivity };
  },
};
