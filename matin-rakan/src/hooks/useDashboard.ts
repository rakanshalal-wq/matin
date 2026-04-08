'use client';
import { useEffect, useState, useCallback } from 'react';
import { dashboardService, DashboardData, DashboardStats, ActivityItem } from '@/services/dashboardService';

interface UseDashboardOptions {
  institutionType?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseDashboardReturn {
  data: DashboardData | null;
  stats: DashboardStats | null;
  activity: ActivityItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const useDashboard = (options: UseDashboardOptions = {}): UseDashboardReturn => {
  const { institutionType, autoRefresh = false, refreshInterval = 60000 } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getDashboardData(institutionType);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [institutionType]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(load, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, load]);

  return {
    data,
    stats: data?.stats ?? null,
    activity: data?.recentActivity ?? [],
    loading,
    error,
    refresh: load,
  };
};

export default useDashboard;
