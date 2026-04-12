import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/lectures-smart/[id]/attendance — سجل حضور المحاضرة
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      `SELECT la.*, u.name as student_name FROM lecture_attendance la
       LEFT JOIN users u ON u.id::text = la.student_id::text
       WHERE la.lecture_id = $1`,
      [id]
    );
    return NextResponse.json({ attendance: result.rows, total: result.rowCount });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/lectures-smart/[id]/attendance — تسجيل حضور طالب
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { student_id, status = 'present', duration_attended } = body;

  if (!student_id) return NextResponse.json({ error: 'student_id مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      `INSERT INTO lecture_attendance (lecture_id, student_id, attended_at, duration_attended, status)
       VALUES ($1, $2, NOW(), $3, $4)
       ON CONFLICT (lecture_id, student_id) DO UPDATE SET status=$4, attended_at=NOW(), duration_attended=$3
       RETURNING *`,
      [id, student_id, duration_attended, status]
    );
    return NextResponse.json({ attendance: result.rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
