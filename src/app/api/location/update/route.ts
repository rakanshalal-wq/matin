import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/location/update — تحديث موقع الطالب
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { student_id, latitude, longitude, accuracy_meters, device_id, battery_level } = body;

  if (!student_id || latitude == null || longitude == null) {
    return NextResponse.json({ error: 'student_id و latitude و longitude مطلوبة' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO student_locations
       (student_id, latitude, longitude, accuracy_meters, timestamp, device_id, battery_level)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6) RETURNING *`,
      [student_id, latitude, longitude, accuracy_meters, device_id, battery_level]
    );
    return NextResponse.json({ location: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
