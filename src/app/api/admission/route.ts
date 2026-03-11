import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query(`
      SELECT a.*, s.name as school_name 
      FROM admissions a
      LEFT JOIN schools s ON a.school_id::text = s.id::text
      WHERE 1=1 ${filter.sql} ORDER BY a.created_at DESC
    `, filter.params);
    return NextResponse.json(result.rows);
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
