import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/lectures/[id]/end — إنهاء المحاضرة
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { recording_url } = body;

  try {
    // التحقق من وجود المحاضرة
    const lecture = await pool.query('SELECT * FROM lectures WHERE id = $1', [id]);
    if (!lecture.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });

    // تحديث حالة المحاضرة إلى ended
    const result = await pool.query(
      `UPDATE lectures
       SET status = 'ended', recording_url = COALESCE($1, recording_url)
       WHERE id = $2
       RETURNING *`,
      [recording_url || null, id]
    );

    return NextResponse.json({ lecture: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
