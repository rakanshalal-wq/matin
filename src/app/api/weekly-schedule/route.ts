import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

// GET /api/weekly-schedule?class_id=X&teacher_id=X&semester=1
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const class_id   = searchParams.get('class_id');
    const teacher_id = searchParams.get('teacher_id');
    const semester   = searchParams.get('semester') || '1';
    const ids = getInsertIds(user);

    let q = `
      SELECT ws.*,
        c.name as class_name, c.grade_level,
        s.name_ar as subject_name, s.color as subject_color,
        u.name as teacher_name
      FROM weekly_schedule ws
      LEFT JOIN classes c ON c.id = ws.class_id
      LEFT JOIN subjects s ON s.id = ws.subject_id
      LEFT JOIN users u ON u.id::text = ws.teacher_id::text
      WHERE ws.school_id = $1 AND ws.semester = $2
    `;
    const params: any[] = [ids.school_id, parseInt(semester)];

    if (class_id)   { params.push(class_id);   q += ` AND ws.class_id=$${params.length}`; }
    if (teacher_id) { params.push(teacher_id); q += ` AND ws.teacher_id=$${params.length}`; }

    q += ' ORDER BY ws.day_of_week, ws.period_num';
    const result = await pool.query(q, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('weekly-schedule GET error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/weekly-schedule — إضافة حصة
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { class_id, subject_id, teacher_id, day_of_week, period_num,
            start_time, end_time, room, semester, notes } = body;

    if (!class_id || !subject_id || day_of_week === undefined || !period_num) {
      return NextResponse.json({ error: 'الفصل والمادة واليوم والحصة مطلوبة' }, { status: 400 });
    }

    const ids = getInsertIds(user);

    // التحقق من عدم التعارض
    const conflict = await pool.query(
      `SELECT id FROM weekly_schedule 
       WHERE class_id=$1 AND day_of_week=$2 AND period_num=$3 AND semester=$4 AND school_id=$5 AND is_active=true`,
      [class_id, day_of_week, period_num, semester || 1, ids.school_id]
    );
    if (conflict.rows.length > 0) {
      return NextResponse.json({ error: 'هذه الحصة محجوزة بالفعل لهذا الفصل' }, { status: 409 });
    }

    const result = await pool.query(
      `INSERT INTO weekly_schedule 
       (school_id, owner_id, class_id, subject_id, teacher_id, day_of_week, period_num,
        start_time, end_time, room, semester, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [ids.school_id, ids.owner_id, class_id, subject_id, teacher_id || null,
       day_of_week, period_num, start_time || '08:00', end_time || '09:00',
       room || null, semester || 1, notes || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('weekly-schedule POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/weekly-schedule — تعديل حصة
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await request.json();
    const { id, subject_id, teacher_id, start_time, end_time, room, notes } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const result = await pool.query(
      `UPDATE weekly_schedule SET subject_id=$1, teacher_id=$2, start_time=$3,
       end_time=$4, room=$5, notes=$6, updated_at=NOW() WHERE id=$7 RETURNING *`,
      [subject_id, teacher_id || null, start_time, end_time, room || null, notes || null, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('weekly-schedule PUT error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/weekly-schedule?id=X
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    await pool.query(`UPDATE weekly_schedule SET is_active=false WHERE id=$1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('weekly-schedule DELETE error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
