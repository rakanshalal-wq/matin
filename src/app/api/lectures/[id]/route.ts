import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/lectures/[id] — جلب تفاصيل محاضرة واحدة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      `SELECT l.*,
        u.name as teacher_name,
        c.name as class_name
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id
       LEFT JOIN classes c ON c.id = l.classroom_id
       WHERE l.id = $1`,
      [id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/lectures/[id] — تعديل محاضرة
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, description, scheduled_at, duration_minutes, zoom_meeting_id, zoom_url, recording_url, status } = body;

  try {
    const updates: string[] = [];
    const queryParams: any[] = [];

    if (title)            { updates.push(`title=$${queryParams.length + 1}`);            queryParams.push(title); }
    if (description)      { updates.push(`description=$${queryParams.length + 1}`);      queryParams.push(description); }
    if (scheduled_at)     { updates.push(`scheduled_at=$${queryParams.length + 1}`);     queryParams.push(scheduled_at); }
    if (duration_minutes) { updates.push(`duration_minutes=$${queryParams.length + 1}`); queryParams.push(duration_minutes); }
    if (zoom_meeting_id)  { updates.push(`zoom_meeting_id=$${queryParams.length + 1}`);  queryParams.push(zoom_meeting_id); }
    if (zoom_url)         { updates.push(`zoom_url=$${queryParams.length + 1}`);         queryParams.push(zoom_url); }
    if (recording_url)    { updates.push(`recording_url=$${queryParams.length + 1}`);    queryParams.push(recording_url); }
    if (status)           { updates.push(`status=$${queryParams.length + 1}`);           queryParams.push(status); }

    if (!updates.length) return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });

    queryParams.push(id);
    const result = await pool.query(
      `UPDATE lectures SET ${updates.join(', ')} WHERE id=$${queryParams.length} RETURNING *`,
      queryParams
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    return NextResponse.json({ lecture: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/lectures/[id] — حذف محاضرة
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM lectures WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
