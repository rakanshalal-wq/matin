import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/attendance/excuses — تقديم عذر غياب
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { student_id, date, reason, attachment_url } = body;

  if (!student_id || !date || !reason) {
    return NextResponse.json({ error: 'student_id و date و reason مطلوبة' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO attendance_excuses (student_id, date, reason, attachment_url)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, date, reason, attachment_url]
    );
    return NextResponse.json({ excuse: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// GET /api/attendance/excuses — قائمة أعذار الغياب
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const student_id = searchParams.get('student_id');

  try {
    let query = 'SELECT * FROM attendance_excuses WHERE 1=1';
    const queryParams: any[] = [];

    if (status)     { query += ` AND status = $${queryParams.length + 1}`;     queryParams.push(status); }
    if (student_id) { query += ` AND student_id = $${queryParams.length + 1}`; queryParams.push(student_id); }
    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ excuses: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
