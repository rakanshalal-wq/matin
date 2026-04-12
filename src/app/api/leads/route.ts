import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 200');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { name, email, phone, company, source, status, notes } = body;
    if (!name) return NextResponse.json({ error: 'اسم العميل مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, company, source, status, notes, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *',
      [name, email || null, phone || null, company || null, source || null, status || 'new', notes || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM leads WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, email, phone, company, source, status, notes } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE leads SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), company = COALESCE($4, company), source = COALESCE($5, source), status = COALESCE($6, status), notes = COALESCE($7, notes), updated_at = NOW() WHERE id = $8 RETURNING *`,
      [name, email, phone, company, source, status, notes, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT leads error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

