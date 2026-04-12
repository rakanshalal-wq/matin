import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/location/geofence — قائمة المناطق الآمنة
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const result = await pool.query(
      'SELECT * FROM safe_zones WHERE institution_id = $1 ORDER BY created_at DESC',
      [user.school_id || user.institution_id]
    );
    return NextResponse.json({ zones: result.rows });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/location/geofence — إضافة منطقة آمنة
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { name, latitude, longitude, radius_meters } = body;

  if (!name || latitude == null || longitude == null) {
    return NextResponse.json({ error: 'name و latitude و longitude مطلوبة' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO safe_zones (institution_id, name, latitude, longitude, radius_meters)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user.school_id || user.institution_id, name, latitude, longitude, radius_meters || 100]
    );
    return NextResponse.json({ zone: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
