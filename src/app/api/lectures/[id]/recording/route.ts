import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/lectures/[id]/recording — جلب تسجيل المحاضرة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    // جلب رابط التسجيل من جدول lectures
    const lecture = await pool.query(
      'SELECT id, title, recording_url, status FROM lectures WHERE id = $1',
      [id]
    );
    if (!lecture.rows[0]) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });

    // جلب التسجيلات الإضافية من جدول lecture_recordings
    const recordings = await pool.query(
      'SELECT * FROM lecture_recordings WHERE lecture_id = $1 ORDER BY created_at DESC',
      [id]
    );

    return NextResponse.json({
      recording_url: lecture.rows[0].recording_url,
      recordings: recordings.rows,
    });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/lectures/[id]/recording — إضافة رابط تسجيل جديد
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { recording_url, duration_seconds, file_size_mb } = body;

  if (!recording_url) return NextResponse.json({ error: 'recording_url مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      `INSERT INTO lecture_recordings (lecture_id, recording_url, duration_seconds, file_size_mb)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, recording_url, duration_seconds || null, file_size_mb || null]
    );

    // تحديث رابط التسجيل الرئيسي في جدول lectures
    await pool.query('UPDATE lectures SET recording_url = $1 WHERE id = $2', [recording_url, id]);

    return NextResponse.json({ recording: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
