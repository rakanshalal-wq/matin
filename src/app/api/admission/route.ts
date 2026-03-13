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
    const [countResult, dataResult] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM admissions a WHERE 1=1 ${filter.sql}`, filter.params),
      pool.query(`
        SELECT a.*, s.name as school_name 
        FROM admissions a
        LEFT JOIN schools s ON a.school_id::text = s.id::text
        WHERE 1=1 ${filter.sql} ORDER BY a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `, filter.params)
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
    const { school_id, student_name, email, phone, grade, parent_name, parent_phone, notes } = body;

    const result = await pool.query(`
      INSERT INTO admissions (school_id, student_name, email, phone, grade, parent_name, parent_phone, notes, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
      RETURNING *
    `, [school_id, student_name, email, phone, grade, parent_name, parent_phone, notes]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الطلب' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, status } = body;

    const result = await pool.query(`
      UPDATE admissions SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *
    `, [id, status]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في التحديث' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `DELETE FROM admissions WHERE id = $1 RETURNING id`,
      [id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE admission error:', error);
    return NextResponse.json({ error: 'خطأ في الحذف' }, { status: 500 });
  }
}

