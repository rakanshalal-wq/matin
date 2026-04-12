import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import crypto from 'crypto';

const dayNames: any = { 0: 'الأحد', 1: 'الاثنين', 2: 'الثلاثاء', 3: 'الأربعاء', 4: 'الخميس', 5: 'الجمعة', 6: 'السبت' };

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const class_id = searchParams.get('class_id');
    const teacher_id = searchParams.get('teacher_id');

    const filter = getFilterSQL(user);
    const filterSql = filter.sql.replace('AND school_id =', 'AND c.school_id =');
    let query = `
      SELECT sc.*, c.name as class_name, c.grade,
        sub.name_ar as subject_name, t.id as t_id,
        u.name as teacher_name
      FROM schedules sc
      LEFT JOIN classes c ON c.id = sc.class_id
      LEFT JOIN courses co ON co.id = sc.course_id
      LEFT JOIN subjects sub ON sub.id = co.subject_id
      LEFT JOIN teachers t ON t.id = sc.teacher_id
      LEFT JOIN users u ON u.id::text = t.user_id
      WHERE 1=1 ${filterSql}
    `;
    const params = [...filter.params];

    if (class_id) { params.push(class_id); query += ` AND sc.class_id = $${params.length}`; }
    if (teacher_id) { params.push(teacher_id); query += ` AND sc.teacher_id = $${params.length}`; }

    query += ' ORDER BY sc.day_of_week, sc.start_time';
    const result = await pool.query(query, params);
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
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { day_of_week, start_time, end_time, room, class_id, course_id, teacher_id } = body;

    if (!class_id || !teacher_id || !start_time || !end_time) {
      return NextResponse.json({ error: 'الفصل والمعلم والوقت مطلوبين' }, { status: 400 });
    }

    const ids = getInsertIds(user);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO schedules (id, day_of_week, start_time, end_time, room, class_id, course_id, teacher_id, school_id, owner_id, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11) RETURNING *`,
      [id, day_of_week || 0, start_time, end_time, room || null, class_id, course_id || '', teacher_id, ids.school_id, ids.owner_id, now]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
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
    const { id, day_of_week, start_time, end_time, room, class_id, course_id, teacher_id } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE schedules SET day_of_week=$1, start_time=$2, end_time=$3, room=$4, class_id=$5, course_id=$6, teacher_id=$7, updated_at=NOW()
       WHERE id=$8 RETURNING *`,
      [day_of_week, start_time, end_time, room, class_id, course_id, teacher_id, id]
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
    await pool.query('DELETE FROM schedules WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
