import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
 const result = await pool.query('SELECT * FROM bus_maintenance ORDER BY created_at DESC'); return NextResponse.json(result.rows); }
  catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { bus_number, type, description, date, cost, status } = body;
    if (!bus_number) return NextResponse.json({ error: 'رقم الباص مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO bus_maintenance (bus_number, type, description, date, cost, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *',
      [bus_number, type || null, description || null, date || null, cost ? parseFloat(cost) : null, status || 'pending']
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
    await pool.query('DELETE FROM bus_maintenance WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
