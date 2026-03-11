import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


// GET - جلب كل الكليات
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query(`
      SELECT c.*, s.name as school_name 
      FROM colleges c
      LEFT JOIN schools s ON c.school_id = s.id
      WHERE 1=1 ${filter.sql} ORDER BY c.created_at DESC
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json([]);
  }
}

// POST - إضافة كلية جديدة
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { school_id, name, name_en, type, dean_name, email, phone, description } = body;

    const result = await pool.query(`
      INSERT INTO colleges (school_id, name, name_en, type, dean_name, email, phone, description, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())
      RETURNING *
    `, [school_id, name, name_en, type, dean_name, email, phone, description]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating college:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الكلية' }, { status: 500 });
  }
}

// PUT - تحديث كلية
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, ...fields } = body;

    const setClause = Object.keys(fields)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');

    const result = await pool.query(`
      UPDATE colleges SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *
    `, [id, ...Object.values(fields)]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating college:', error);
    return NextResponse.json({ error: 'فشل في تحديث الكلية' }, { status: 500 });
  }
}

// DELETE - حذف كلية
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await pool.query('DELETE FROM colleges WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Error deleting college:', error);
    return NextResponse.json({ error: 'فشل في الحذف' }, { status: 500 });
  }
}
