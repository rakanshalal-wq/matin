import { NextResponse } from 'next/server';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const [countResult, dataResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM grading_committees'),
      pool.query(`SELECT * FROM grading_committees ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`)
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { name, subject, members, head, status } = body;
    if (!name) return NextResponse.json({ error: 'اسم اللجنة مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO grading_committees (name, subject, members, head, status, created_at) VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *',
      [name, subject || null, members || null, head || null, status || 'active']
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
    await pool.query('DELETE FROM grading_committees WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, subject, members, head, status } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE grading_committees SET name = COALESCE($1, name), subject = COALESCE($2, subject), members = COALESCE($3, members), head = COALESCE($4, head), status = COALESCE($5, status), updated_at = NOW() WHERE id = $6 RETURNING *`,
      [name, subject, members, head, status, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT grading-committees error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

