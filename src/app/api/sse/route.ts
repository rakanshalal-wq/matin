import { NextRequest } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

// =====================================================
// Server-Sent Events (SSE) — إشعارات فورية
// منصة متين
//
// الاستخدام من الـ Frontend:
//   const es = new EventSource('/api/sse?token=<jwt>');
//   es.addEventListener('notification', (e) => {
//     const data = JSON.parse(e.data);
//     // data = { id, title, content, type, created_at }
//   });
//   es.addEventListener('heartbeat', () => {}); // كل 30 ثانية
//   es.addEventListener('unread_count', (e) => {
//     const { count } = JSON.parse(e.data);
//   });
// =====================================================

// مخزن المشتركين: Map<userId, Set<ReadableStreamController>>
const subscribers = new Map<string, Set<ReadableStreamDefaultController>>();

// إرسال حدث لمستخدم محدد
export function sendEventToUser(userId: string, event: string, data: unknown) {
  const controllers = subscribers.get(String(userId));
  if (!controllers || controllers.size === 0) return;

  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const dead: ReadableStreamDefaultController[] = [];

  for (const ctrl of controllers) {
    try {
      ctrl.enqueue(new TextEncoder().encode(payload));
    } catch {
      dead.push(ctrl);
    }
  }

  // تنظيف الاتصالات المنتهية
  for (const ctrl of dead) {
    controllers.delete(ctrl);
  }
}

// إرسال حدث لجميع مستخدمي مدرسة
export function sendEventToSchool(schoolId: string, event: string, data: unknown) {
  for (const [, controllers] of subscribers) {
    for (const ctrl of controllers) {
      try {
        const payload = `event: ${event}\ndata: ${JSON.stringify({ ...data as object, school_id: schoolId })}\n\n`;
        ctrl.enqueue(new TextEncoder().encode(payload));
      } catch {
        // تجاهل الاتصالات المنتهية
      }
    }
  }
}

export async function GET(req: NextRequest) {
  // المصادقة عبر query param (SSE لا يدعم headers)
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return new Response('غير مصرح — أرسل token في الـ query string', { status: 401 });
  }

  // التحقق من الـ token
  let user: { id: number | string; role: string; school_id?: number } | null = null;
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(
      token,
      process.env.JWT_SECRET || 'matin_secret_2024'
    ) as { id: number; role: string; school_id?: number };
    user = decoded;
  } catch {
    return new Response('token غير صالح', { status: 401 });
  }

  const userId = String(user.id);

  // إنشاء SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // تسجيل المشترك
      if (!subscribers.has(userId)) {
        subscribers.set(userId, new Set());
      }
      subscribers.get(userId)!.add(controller);

      // إرسال حدث الاتصال الأول
      const welcome = `event: connected\ndata: ${JSON.stringify({
        message: 'متصل بنظام الإشعارات الفوري',
        user_id: userId,
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(welcome));

      // إرسال عدد الإشعارات غير المقروءة
      const filter = getFilterSQL(user!);
      pool.query(
        `SELECT COUNT(*) FROM notifications WHERE is_read = false ${filter.sql}`,
        filter.params
      ).then((result) => {
        const count = Number(result.rows[0]?.count || 0);
        const unreadPayload = `event: unread_count\ndata: ${JSON.stringify({ count })}\n\n`;
        try {
          controller.enqueue(new TextEncoder().encode(unreadPayload));
        } catch {
          // الاتصال انتهى
        }
      }).catch(() => {});

      // Heartbeat كل 30 ثانية لإبقاء الاتصال حياً
      const heartbeatInterval = setInterval(() => {
        try {
          const hb = `event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`;
          controller.enqueue(new TextEncoder().encode(hb));
        } catch {
          clearInterval(heartbeatInterval);
          subscribers.get(userId)?.delete(controller);
        }
      }, 30_000);

      // تنظيف عند إغلاق الاتصال
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        subscribers.get(userId)?.delete(controller);
        if (subscribers.get(userId)?.size === 0) {
          subscribers.delete(userId);
        }
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // مهم لـ Nginx
    },
  });
}
