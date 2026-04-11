import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query('SELECT * FROM trainers ORDER BY created_at DESC LIMIT 200');
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
    const { name, email, phone, specialization, experience_years, bio } = body;
    if (!name) return NextResponse.json({ error: 'اسم المدرب مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO trainers (name, email, phone, specialization, experience_years, bio, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *',
      [name, email || null, phone || null, specialization || null, experience_years ? parseInt(experience_years) : null, bio || null]
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
    await pool.query('DELETE FROM trainers WHERE id = $1', [id]);
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
    const { id, name, specialization, phone, email, status } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE trainers SET name = COALESCE($1, name), specialization = COALESCE($2, specialization), phone = COALESCE($3, phone), email = COALESCE($4, email), status = COALESCE($5, status), updated_at = NOW() WHERE id = $6 RETURNING *`,
      [name, specialization, phone, email, status, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT trainers error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

