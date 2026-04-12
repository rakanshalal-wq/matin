import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/notifications/unread — الإشعارات غير المقروءة
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE recipient_id=$1 AND is_read=false
       ORDER BY created_at DESC LIMIT 50`,
      [user.id]
    );
    return NextResponse.json({ notifications: result.rows, count: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
