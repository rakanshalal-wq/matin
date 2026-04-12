import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/attendance/[student_id] — سجل حضور طالب محدد
export async function GET(request: Request, { params }: { params: Promise<{ student_id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { student_id } = await params;
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  try {
    let query = 'SELECT * FROM attendance WHERE student_id = $1';
    const queryParams: any[] = [student_id];

    if (from) { query += ` AND date >= $${queryParams.length + 1}`; queryParams.push(from); }
    if (to)   { query += ` AND date <= $${queryParams.length + 1}`; queryParams.push(to); }
    query += ' ORDER BY date DESC';

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ attendance: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
