import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/lectures-smart/[id]/end — إنهاء المحاضرة
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { recording_url } = body;

  try {
    const updateQuery = recording_url
      ? `UPDATE lectures SET status='ended', recording_url=$1 WHERE id=$2 AND institution_id=$3 RETURNING *`
      : `UPDATE lectures SET status='ended' WHERE id=$1 AND institution_id=$2 RETURNING *`;
    const updateParams = recording_url
      ? [recording_url, id, user.school_id || user.institution_id]
      : [id, user.school_id || user.institution_id];

    const result = await pool.query(updateQuery, updateParams);
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0], message: 'تم إنهاء المحاضرة' });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
