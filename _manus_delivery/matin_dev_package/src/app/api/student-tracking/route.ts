import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { getGoogleMapsKey } from '@/lib/integrations';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    // جلب Google Maps Key من الداشبورد
    const mapsKey = await getGoogleMapsKey();

    const result = await pool.query(
      `SELECT * FROM student_tracking WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`,
      filter.params
    );
    return NextResponse.json({ data: result.rows, maps_key: mapsKey });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ data: [], maps_key: '' }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { student_id, student_name, latitude, longitude, location_name, event_type, bus_id, driver_id } = body;
    if (!student_name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });

    // التحقق من Google Maps مفعّل
    const mapsKey = await getGoogleMapsKey();
    if (!mapsKey) return NextResponse.json({ error: 'Google Maps غير مفعّل، فعّله من مركز التكاملات' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO student_tracking (student_id, student_name, latitude, longitude, location_name, event_type, bus_id, driver_id, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [student_id || null, student_name, latitude || null, longitude || null, location_name || null, event_type || 'location', bus_id || null, driver_id || null, ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM student_tracking WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, lat, lng, status, bus_id } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE student_tracking SET lat = COALESCE($1, lat), lng = COALESCE($2, lng), status = COALESCE($3, status), bus_id = COALESCE($4, bus_id), updated_at = NOW() WHERE id = $5 RETURNING *`,
      [lat, lng, status, bus_id, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT student-tracking error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

