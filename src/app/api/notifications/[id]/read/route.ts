import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/notifications/[id]/read — تعيين الإشعار كمقروء
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      `UPDATE notifications SET is_read=true, read_at=NOW()
       WHERE id=$1 AND recipient_id=$2 RETURNING *`,
      [id, user.id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الإشعار غير موجود' }, { status: 404 });
    return NextResponse.json({ notification: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
