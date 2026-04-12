'use client';
export const dynamic = 'force-dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,      // البيانات تبقى طازجة 5 دقائق
        gcTime: 10 * 60 * 1000,         // تُحذف من الذاكرة بعد 10 دقائق
        retry: 1,                        // محاولة واحدة فقط عند الفشل
        refetchOnWindowFocus: false,     // لا إعادة جلب عند التبديل بين النوافذ
        refetchOnReconnect: true,        // إعادة جلب عند استعادة الاتصال
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
