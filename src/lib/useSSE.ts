'use client';
export const dynamic = 'force-dynamic';
/**
 * useSSE — React Hook للإشعارات الفورية عبر SSE
 * منصة متين
 *
 * الاستخدام:
 *   const { notifications, unreadCount, connected } = useSSE(token);
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export interface SSENotification {
  id: string | number;
  title: string;
  content?: string;
  type?: string;
  created_at: string;
}

interface UseSSEResult {
  notifications: SSENotification[];
  unreadCount: number;
  connected: boolean;
  clearNotifications: () => void;
  markAllRead: () => void;
}

export function useSSE(token: string | null | undefined): UseSSEResult {
  const [notifications, setNotifications] = useState<SSENotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!token || typeof window === 'undefined') return;

    // إغلاق الاتصال القديم
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource(`/api/sse?token=${encodeURIComponent(token)}`);
    esRef.current = es;

    es.addEventListener('connected', () => {
      setConnected(true);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    });

    es.addEventListener('notification', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as SSENotification;
        setNotifications((prev) => [data, ...prev].slice(0, 50)); // الاحتفاظ بآخر 50
        setUnreadCount((prev) => prev + 1);
      } catch {}
    });

    es.addEventListener('unread_count', (e: MessageEvent) => {
      try {
        const { count } = JSON.parse(e.data);
        setUnreadCount(Number(count));
      } catch {}
    });

    es.addEventListener('heartbeat', () => {
      // الاتصال لا يزال حياً
    });

    es.onerror = () => {
      setConnected(false);
      es.close();
      // إعادة الاتصال بعد 5 ثواني
      reconnectTimer.current = setTimeout(() => {
        connect();
      }, 5_000);
    };
  }, [token]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, []);

  return { notifications, unreadCount, connected, clearNotifications, markAllRead };
}
