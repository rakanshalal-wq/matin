import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
 const result = await pool.query('SELECT * FROM driver_licenses ORDER BY created_at DESC LIMIT 200'); return NextResponse.json(result.rows); }
  catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { driver_name, license_number, type, issue_date, expiry_date, status } = body;
    if (!driver_name) return NextResponse.json({ error: 'اسم السائق مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO driver_licenses (driver_name, license_number, type, issue_date, expiry_date, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *',
      [driver_name, license_number || null, type || null, issue_date || null, expiry_date || null, status || 'active']
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
    await pool.query('DELETE FROM driver_licenses WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, driver_name, license_number, type, issue_date, expiry_date, status } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE driver_licenses SET driver_name = COALESCE($1, driver_name), license_number = COALESCE($2, license_number), type = COALESCE($3, type), issue_date = COALESCE($4, issue_date), expiry_date = COALESCE($5, expiry_date), status = COALESCE($6, status), updated_at = NOW() WHERE id = $7 RETURNING *`,
      [driver_name, license_number, type, issue_date, expiry_date, status, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT driver-licenses error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

