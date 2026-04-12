import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/location/history — سجل مواقع الطالب
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const student_id = searchParams.get('student_id');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = parseInt(searchParams.get('limit') || '50');

  if (!student_id) return NextResponse.json({ error: 'student_id مطلوب' }, { status: 400 });

  try {
    let query = 'SELECT * FROM student_locations WHERE student_id = $1';
    const queryParams: any[] = [student_id];

    if (from) { query += ` AND timestamp >= $${queryParams.length + 1}`; queryParams.push(from); }
    if (to)   { query += ` AND timestamp <= $${queryParams.length + 1}`; queryParams.push(to); }
    query += ` ORDER BY timestamp DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ history: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
