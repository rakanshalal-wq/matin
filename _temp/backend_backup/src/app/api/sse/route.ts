import { NextRequest } from 'next/server';
import { pool, getFilterSQL } from '@/lib/auth';
import { getSubscribers } from '@/lib/sse';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return new Response('غير مصرح', { status: 401 });
  }

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
  const subscribers = getSubscribers();

  const stream = new ReadableStream({
    start(controller) {
      if (!subscribers.has(userId)) {
        subscribers.set(userId, new Set());
      }
      subscribers.get(userId)!.add(controller);

      const welcome = `event: connected\ndata: ${JSON.stringify({
        message: 'متصل بنظام الإشعارات الفوري',
        user_id: userId,
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(new TextEncoder().encode(welcome));

      const filter = getFilterSQL(user!);
      pool.query(
        `SELECT COUNT(*) FROM notifications WHERE is_read = false ${filter.sql}`,
        filter.params
      ).then((result) => {
        const count = Number(result.rows[0]?.count || 0);
        const unreadPayload = `event: unread_count\ndata: ${JSON.stringify({ count })}\n\n`;
        try {
          controller.enqueue(new TextEncoder().encode(unreadPayload));
        } catch {}
      }).catch(() => {});

      const heartbeatInterval = setInterval(() => {
        try {
          const hb = `event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`;
          controller.enqueue(new TextEncoder().encode(hb));
        } catch {
          clearInterval(heartbeatInterval);
          subscribers.get(userId)?.delete(controller);
        }
      }, 30000);

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
      'X-Accel-Buffering': 'no',
    },
  });
}
