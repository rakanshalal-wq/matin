import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/lectures-smart/[id]/start — بدء المحاضرة
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const result = await pool.query(
      `UPDATE lectures SET status='live' WHERE id=$1 AND institution_id=$2 RETURNING *`,
      [id, user.school_id || user.institution_id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0], message: 'تم بدء المحاضرة' });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
