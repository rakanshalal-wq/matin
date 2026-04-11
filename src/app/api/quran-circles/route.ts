import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ===== حلقات التحفيظ القرآني =====

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const circleId = searchParams.get('id');
    const schoolId = user.school_id || user.id;

    if (circleId) {
      const result = await pool.query(
        `SELECT qc.*, u.name AS teacher_name,
          (SELECT COUNT(*) FROM quran_students qs WHERE qs.circle_id = qc.id AND qs.status = 'active') AS student_count
         FROM quran_circles qc
         LEFT JOIN users u ON qc.teacher_id = u.id
         WHERE qc.id = $1 AND qc.school_id = $2`,
        [circleId, schoolId]
      );
      if (!result.rows[0]) return NextResponse.json({ error: 'الحلقة غير موجودة' }, { status: 404 });
      return NextResponse.json(result.rows[0]);
    }

    const result = await pool.query(
      `SELECT qc.*, u.name AS teacher_name,
        (SELECT COUNT(*) FROM quran_students qs WHERE qs.circle_id = qc.id AND qs.status = 'active') AS student_count
       FROM quran_circles qc
       LEFT JOIN users u ON qc.teacher_id = u.id
       WHERE qc.school_id = $1
       ORDER BY qc.created_at DESC`,
      [schoolId]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); // table does not exist yet
    console.error('quran-circles GET:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { name, teacher_id, schedule, max_students, level } = body;
    if (!name) return NextResponse.json({ error: 'اسم الحلقة مطلوب' }, { status: 400 });

    const schoolId = user.school_id || user.id;
    const result = await pool.query(
      `INSERT INTO quran_circles (name, school_id, teacher_id, schedule, max_students, level)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, schoolId, teacher_id || null, schedule || null, max_students || 15, level || 'مبتدئ']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-circles POST:', error);
    return NextResponse.json({ error: 'فشل في إضافة الحلقة' }, { status: 500 });
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
    const { name, teacher_id, schedule, max_students, level, status } = body;
    const schoolId = user.school_id || user.id;

    const result = await pool.query(
      `UPDATE quran_circles
       SET name=$1, teacher_id=$2, schedule=$3, max_students=$4, level=$5, status=$6, updated_at=NOW()
       WHERE id=$7 AND school_id=$8 RETURNING *`,
      [name, teacher_id || null, schedule || null, max_students || 15, level || 'مبتدئ', status || 'active', id, schoolId]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الحلقة غير موجودة' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-circles PUT:', error);
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
    await pool.query('DELETE FROM quran_circles WHERE id=$1 AND school_id=$2', [id, schoolId]);
    return NextResponse.json({ message: 'تم حذف الحلقة' });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-circles DELETE:', error);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
