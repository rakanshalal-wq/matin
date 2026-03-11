import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';


// GET - جلب كل أولياء الأمور
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query(`
      SELECT p.*, u.name, u.email, u.phone, sc.name as school_name
      FROM parents p
      LEFT JOIN users u ON u.id::text = p.user_id
      LEFT JOIN schools sc ON sc.id = p.school_id
      WHERE 1=1 ${filter.sql} ORDER BY p.created_at DESC
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching parents:', error);
    return NextResponse.json([]);
  }
}

// POST - إضافة ولي أمر جديد
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { name, email, phone, occupation, school_id, password } = body;

    if (!name) {
      return NextResponse.json({ error: 'اسم ولي الأمر مطلوب' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO parents (id, occupation, user_id, school_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $5)
       RETURNING *`,
      [id, occupation || null, id, school_id || '', now]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating parent:', error);
    return NextResponse.json({ error: 'فشل في إضافة ولي الأمر' }, { status: 500 });
  }
}

// DELETE - حذف ولي أمر
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM parents WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الحذف' }, { status: 500 });
  }
}
