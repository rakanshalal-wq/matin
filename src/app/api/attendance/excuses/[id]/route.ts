import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/attendance/excuses/[id] — قبول/رفض العذر
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'الحالة يجب أن تكون approved أو rejected' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE attendance_excuses SET status=$1, approved_by=$2 WHERE id=$3 RETURNING *`,
      [status, user.id, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'العذر غير موجود' }, { status: 404 });
    return NextResponse.json({ excuse: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
