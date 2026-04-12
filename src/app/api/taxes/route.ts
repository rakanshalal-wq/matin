import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';

    let where = 'WHERE 1=1';
    const params: any[] = [];
    let idx = 1;

    if (search) { where += ` AND (t.name ILIKE $${idx} OR t.description ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (status) { where += ` AND t.status = $${idx}`; params.push(status); idx++; }
    if (type) { where += ` AND t.type = $${idx}`; params.push(type); idx++; }

    const countResult = await pool.query(`SELECT COUNT(*) FROM taxes t ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const result = await pool.query(
      `SELECT t.*, s.name as school_name FROM taxes t
       LEFT JOIN schools s ON t.school_id = s.id
       ${where} ORDER BY t.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset]
    );

    return NextResponse.json(buildPaginatedResponse(result.rows, total, page, limit));
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    const body = await request.json();
    const { name, type, rate, amount, description, school_id, status, due_date } = body;
    if (!name) return NextResponse.json({ error: 'اسم الضريبة مطلوب' }, { status: 400 });
    if (!type) return NextResponse.json({ error: 'نوع الضريبة مطلوب' }, { status: 400 });

    const result = await pool.query(
      `INSERT INTO taxes (name, type, rate, amount, description, school_id, status, due_date, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *`,
      [name, type, rate || 0, amount || 0, description || null, school_id || null, status || 'active', due_date || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    const body = await request.json();
    const { id, name, type, rate, amount, description, school_id, status, due_date } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE taxes SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        rate = COALESCE($3, rate),
        amount = COALESCE($4, amount),
        description = COALESCE($5, description),
        school_id = COALESCE($6, school_id),
        status = COALESCE($7, status),
        due_date = COALESCE($8, due_date)
       WHERE id = $9 RETURNING *`,
      [name, type, rate, amount, description, school_id, status, due_date, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM taxes WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
