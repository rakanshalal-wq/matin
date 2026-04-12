import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/attendance/stats — إحصائيات الحضور
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const classId = searchParams.get('class_id');
  const date = searchParams.get('date');

  try {
    let query = `
      SELECT
        COUNT(*) FILTER (WHERE status = 'present') as present_count,
        COUNT(*) FILTER (WHERE status = 'absent')  as absent_count,
        COUNT(*) FILTER (WHERE status = 'late')    as late_count,
        COUNT(*) as total,
        ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0), 2) as attendance_rate
      FROM attendance WHERE institution_id = $1
    `;
    const queryParams: any[] = [user.school_id || user.institution_id];

    if (classId) { query += ` AND schedule_id = $${queryParams.length + 1}`; queryParams.push(classId); }
    if (date)    { query += ` AND date = $${queryParams.length + 1}`;          queryParams.push(date); }

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ stats: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
