import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ===== طلاب حلقات التحفيظ =====

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const circleId = searchParams.get('circle_id');
    const studentId = searchParams.get('id');
    const schoolId = user.school_id || user.id;

    if (studentId) {
      const result = await pool.query(
        `SELECT qst.*, qc.name AS circle_name,
          (SELECT COALESCE(SUM(qpt.points),0) FROM quran_points qpt WHERE qpt.student_id = qst.id) AS total_points
         FROM quran_students qst
         LEFT JOIN quran_circles qc ON qst.circle_id = qc.id
         WHERE qst.id = $1 AND qst.school_id = $2`,
        [studentId, schoolId]
      );
      if (!result.rows[0]) return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 });
      return NextResponse.json(result.rows[0]);
    }

    let query = `
      SELECT qst.*, qc.name AS circle_name,
        (SELECT COALESCE(SUM(qpt.points),0) FROM quran_points qpt WHERE qpt.student_id = qst.id) AS total_points
      FROM quran_students qst
      LEFT JOIN quran_circles qc ON qst.circle_id = qc.id
      WHERE qst.school_id = $1`;
    const params: any[] = [schoolId];

    if (circleId) { query += ' AND qst.circle_id = $2'; params.push(circleId); }
    query += ' AND qst.status = \'active\' ORDER BY qst.name';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    console.error('quran-students GET:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { name, circle_id, parent_phone, date_of_birth, notes } = body;
    if (!name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });

    const schoolId = user.school_id || user.id;
    const result = await pool.query(
      `INSERT INTO quran_students (name, circle_id, school_id, parent_phone, date_of_birth, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, circle_id || null, schoolId, parent_phone || null, date_of_birth || null, notes || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-students POST:', error);
    return NextResponse.json({ error: 'فشل في إضافة الطالب' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const body = await request.json();
    const { name, circle_id, parent_phone, current_juz, total_memorized, notes, status } = body;
    const schoolId = user.school_id || user.id;

    const result = await pool.query(
      `UPDATE quran_students
       SET name=$1, circle_id=$2, parent_phone=$3, current_juz=$4, total_memorized=$5, notes=$6, status=$7
       WHERE id=$8 AND school_id=$9 RETURNING *`,
      [name, circle_id || null, parent_phone || null, current_juz || 0, total_memorized || null, notes || null, status || 'active', id, schoolId]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-students PUT:', error);
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    const schoolId = user.school_id || user.id;
    await pool.query('UPDATE quran_students SET status=\'inactive\' WHERE id=$1 AND school_id=$2', [id, schoolId]);
    return NextResponse.json({ message: 'تم حذف الطالب' });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-students DELETE:', error);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
