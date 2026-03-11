import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const filterSql = filter.sql.replace('AND school_id =', 'AND c.school_id =');
    const result = await pool.query(`
      SELECT c.*, s.name as school_name,
        (SELECT COUNT(*) FROM students st WHERE st.class_id = c.id) as students_count
      FROM classes c
      LEFT JOIN schools s ON s.id::text = c.school_id::text
      WHERE 1=1 ${filterSql} ORDER BY c.grade, c.name
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
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالإضافة' }, { status: 403 });
    }

    const body = await request.json();
    const { name, name_ar, grade, section, capacity, school_id } = body;
    if (!name && !name_ar) return NextResponse.json({ error: 'اسم الفصل مطلوب' }, { status: 400 });

    // تحديد المدرسة
    let finalSchoolId = school_id;
    if (!finalSchoolId && user.role === 'owner') {
      const s = await pool.query('SELECT id FROM schools WHERE owner_id::text = $1::text LIMIT 1', [String(user.id)]);
      if (s.rows.length > 0) finalSchoolId = s.rows[0].id;
    }
    if (!finalSchoolId && user.school_id) finalSchoolId = String(user.school_id);
    if (!finalSchoolId) return NextResponse.json({ error: 'لازم تنشئ مدرسة أول' }, { status: 400 });

    const ids = getInsertIds(user);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO classes (id, name, name_ar, grade, section, capacity, school_id, owner_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) RETURNING *`,
      [id, name || name_ar, name_ar || name, grade || '', section || null, capacity || 30, finalSchoolId, ids.owner_id, now]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, name_ar, grade, section, capacity } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE classes SET name=$1, name_ar=$2, grade=$3, section=$4, capacity=$5, updated_at=NOW()
       WHERE id::text = $6::text RETURNING *`,
      [name, name_ar, grade, section, capacity, id]
    );
    return NextResponse.json(result.rows[0]);
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
    await pool.query('DELETE FROM classes WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
