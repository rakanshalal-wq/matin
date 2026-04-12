import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/notifications/preferences — تفضيلات الإشعارات
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const result = await pool.query(
      'SELECT * FROM notification_preferences WHERE user_id=$1',
      [user.id]
    );
    return NextResponse.json({ preferences: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/notifications/preferences — تحديث التفضيلات
export async function PUT(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { notification_type, enabled_email, enabled_push, enabled_sms } = body;

  if (!notification_type) {
    return NextResponse.json({ error: 'notification_type مطلوب' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notification_preferences (user_id, notification_type, enabled_email, enabled_push, enabled_sms)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id, notification_type) DO UPDATE
         SET enabled_email=$3, enabled_push=$4, enabled_sms=$5
       RETURNING *`,
      [user.id, notification_type, enabled_email ?? true, enabled_push ?? true, enabled_sms ?? false]
    );
    return NextResponse.json({ preference: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
