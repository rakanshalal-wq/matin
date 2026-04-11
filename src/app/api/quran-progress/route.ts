import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ===== تقدم حفظ الطلاب =====

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const circleId = searchParams.get('circle_id');
    const schoolId = user.school_id || user.id;

    if (studentId) {
      const result = await pool.query(
        `SELECT qp.*, qst.name AS student_name
         FROM quran_progress qp
         JOIN quran_students qst ON qp.student_id = qst.id
         WHERE qp.student_id = $1
         ORDER BY qp.date DESC, qp.created_at DESC
         LIMIT 50`,
        [studentId]
      );
      return NextResponse.json(result.rows);
    }

    if (circleId) {
      const result = await pool.query(
        `SELECT qst.id, qst.name, qst.current_juz, qst.total_memorized,
          (SELECT qp.rating FROM quran_progress qp WHERE qp.student_id = qst.id ORDER BY qp.created_at DESC LIMIT 1) AS last_rating,
          (SELECT SUM(qpt.points) FROM quran_points qpt WHERE qpt.student_id = qst.id) AS total_points
         FROM quran_students qst
         WHERE qst.circle_id = $1 AND qst.status = 'active'
         ORDER BY qst.current_juz DESC`,
        [circleId]
      );
      return NextResponse.json(result.rows);
    }

    const result = await pool.query(
      `SELECT qp.*, qst.name AS student_name, qst.current_juz
       FROM quran_progress qp
       JOIN quran_students qst ON qp.student_id = qst.id
       WHERE qp.school_id = $1
       ORDER BY qp.date DESC, qp.created_at DESC
       LIMIT 200`,
      [schoolId]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json([]);
    console.error('quran-progress GET:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { student_id, session_id, surah_name, from_ayah, to_ayah, juz_number, rating, tajweed_notes } = body;
    if (!student_id) return NextResponse.json({ error: 'الطالب مطلوب' }, { status: 400 });

    const schoolId = user.school_id || user.id;

    const result = await pool.query(
      `INSERT INTO quran_progress (student_id, session_id, school_id, surah_name, from_ayah, to_ayah, juz_number, rating, tajweed_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [student_id, session_id || null, schoolId, surah_name || null, from_ayah || null, to_ayah || null, juz_number || null, rating || 'جيد', tajweed_notes || null]
    );

    // تحديث الجزء الحالي للطالب إذا توفر رقم الجزء
    if (juz_number) {
      await pool.query(
        'UPDATE quran_students SET current_juz = GREATEST(current_juz, $1) WHERE id = $2',
        [juz_number, student_id]
      );
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-progress POST:', error);
    return NextResponse.json({ error: 'فشل في تسجيل التقدم' }, { status: 500 });
  }
}
