import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/location/alerts — تنبيهات الموقع
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const student_id = searchParams.get('student_id');

  try {
    let query = `
      SELECT la.*, sz.name as zone_name, u.name as student_name
      FROM location_alerts la
      LEFT JOIN safe_zones sz ON sz.id = la.safe_zone_id
      LEFT JOIN users u ON u.id::text = la.student_id::text
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    if (student_id) {
      query += ` AND la.student_id = $${queryParams.length + 1}`;
      queryParams.push(student_id);
    }
    query += ' ORDER BY la.triggered_at DESC LIMIT 100';

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ alerts: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
