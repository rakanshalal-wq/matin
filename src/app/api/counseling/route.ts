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
      pool.query('SELECT COUNT(*) FROM counseling'),
      pool.query(`SELECT * FROM counseling ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`)
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { student_name, counselor_name, type, description, status, notes } = body;
    if (!student_name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO counseling (student_name, counselor_name, type, description, status, notes, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *',
      [student_name, counselor_name || null, type || null, description || null, status || 'open', notes || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM counseling WHERE id = $1', [id]);
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
    const { id, student_name, counselor_name, type, description, status, notes } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE counseling SET student_name = COALESCE($1, student_name), counselor_name = COALESCE($2, counselor_name), type = COALESCE($3, type), description = COALESCE($4, description), status = COALESCE($5, status), notes = COALESCE($6, notes), updated_at = NOW() WHERE id = $7 RETURNING *`,
      [student_name, counselor_name, type, description, status, notes, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT counseling error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

