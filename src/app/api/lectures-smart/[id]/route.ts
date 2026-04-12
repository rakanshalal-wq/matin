import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/lectures-smart/[id] — تفاصيل محاضرة واحدة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM lectures WHERE id = $1 AND institution_id = $2',
      [id, user.school_id || user.institution_id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/lectures-smart/[id] — تحديث محاضرة
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, description, scheduled_at, duration_minutes, zoom_meeting_id, zoom_url } = body;

  try {
    const result = await pool.query(
      `UPDATE lectures SET title=$1, description=$2, scheduled_at=$3,
       duration_minutes=$4, zoom_meeting_id=$5, zoom_url=$6
       WHERE id=$7 AND institution_id=$8 RETURNING *`,
      [title, description, scheduled_at, duration_minutes, zoom_meeting_id, zoom_url,
       id, user.school_id || user.institution_id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/lectures-smart/[id] — حذف محاضرة
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM lectures WHERE id=$1 AND institution_id=$2',
      [id, user.school_id || user.institution_id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
