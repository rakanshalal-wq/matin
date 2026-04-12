import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/lectures-smart/[id]/recording — تسجيلات المحاضرة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM lecture_recordings WHERE lecture_id = $1 ORDER BY created_at DESC',
      [id]
    );
    return NextResponse.json({ recordings: result.rows });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/lectures-smart/[id]/recording — إضافة تسجيل
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
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, recording_url, duration_seconds, file_size_mb]
    );
    return NextResponse.json({ recording: result.rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
