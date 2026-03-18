import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const filterSQL = filter.sql ? filter.sql.replace('AND school_id', 'AND school_id') : '';
    const [countResult, dataResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM behavior WHERE 1=1 ${filterSQL}`, filter.params),
      pool.query(`SELECT * FROM behavior WHERE 1=1 ${filterSQL} ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [...filter.params, limit, offset])
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
    const { student_name, type, category, description, points, teacher_name } = body;
    if (!student_name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO behavior (student_name, type, category, description, points, teacher_name, created_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING *',
      [student_name, type || 'positive', category || null, description || null, points ? parseInt(points) : 0, teacher_name || null]
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
    await pool.query('DELETE FROM behavior WHERE id = $1', [id]);
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
    const { id, student_name, type, category, description, points, teacher_name } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE behavior SET student_name = COALESCE($1, student_name), type = COALESCE($2, type), category = COALESCE($3, category), description = COALESCE($4, description), points = COALESCE($5, points), teacher_name = COALESCE($6, teacher_name), updated_at = NOW() WHERE id = $7 RETURNING *`,
      [student_name, type, category, description, points, teacher_name, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT behavior error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

