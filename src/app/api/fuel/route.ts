import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
 const result = await pool.query('SELECT * FROM fuel_records ORDER BY created_at DESC LIMIT 200'); return NextResponse.json(result.rows); }
  catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { bus_number, liters, cost, date, odometer } = body;
    if (!bus_number) return NextResponse.json({ error: 'رقم الباص مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO fuel_records (bus_number, liters, cost, date, odometer, created_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *',
      [bus_number, liters ? parseFloat(liters) : null, cost ? parseFloat(cost) : null, date || null, odometer ? parseInt(odometer) : null]
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
    await pool.query('DELETE FROM fuel_records WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, bus_number, liters, cost, date, station, odometer } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE fuel_records SET bus_number = COALESCE($1, bus_number), liters = COALESCE($2, liters), cost = COALESCE($3, cost), date = COALESCE($4, date), station = COALESCE($5, station), odometer = COALESCE($6, odometer), updated_at = NOW() WHERE id = $7 RETURNING *`,
      [bus_number, liters, cost, date, station, odometer, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT fuel error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

