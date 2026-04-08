import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const url = new URL(request.url);
    const studentId = url.searchParams.get('student_id');
    const halaqahId = url.searchParams.get('halaqah_id');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = 'SELECT r.*, (SELECT name FROM users WHERE id = r.student_id::text) as student_name FROM quran_recitations r WHERE 1=1';
    const params: any[] = [];
    let idx = 1;

    if (user.role !== 'super_admin') {
      query += ` AND r.school_id = $${idx}`;
      params.push(user.school_id);
      idx++;
    }
    if (studentId) { query += ` AND r.student_id = $${idx}`; params.push(studentId); idx++; }
    if (halaqahId) { query += ` AND r.halaqah_id = $${idx}`; params.push(halaqahId); idx++; }

    query += ` ORDER BY r.created_at DESC LIMIT $${idx}`;
    params.push(limit);

    const result = await pool.query(query, params);

    let progress = null;
    if (studentId) {
      const progRes = await pool.query(
        'SELECT * FROM quran_student_progress WHERE student_id = $1 AND school_id = $2',
        [studentId, user.school_id]
      ).catch(() => ({ rows: [] }));
      progress = progRes.rows[0] || null;
    }

    return NextResponse.json({ recitations: result.rows, progress });
  } catch (error) {
    console.error('Quran recitation GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin','owner','admin','supervisor','muhaffiz','teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بتسجيل تسميع' }, { status: 403 });
    }

    const body = await request.json();
    const { student_id, halaqah_id, surah_number, surah_name, from_ayah, to_ayah, recitation_type, grade, tajweed_errors, notes, points, duration_minutes } = body;

    if (!student_id || !surah_number || !grade) {
      return NextResponse.json({ error: 'بيانات ناقصة: student_id, surah_number, grade مطلوبة' }, { status: 400 });
    }

    const gradePoints: Record<string, number> = { excellent: 10, good: 7, fair: 4, weak: 1 };
    const calcPoints = points || gradePoints[grade] || 5;

    const result = await pool.query(
      `INSERT INTO quran_recitations (school_id, halaqah_id, student_id, muhaffiz_id, surah_number, surah_name, from_ayah, to_ayah, recitation_type, grade, tajweed_errors, notes, points, duration_minutes, session_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,CURRENT_DATE) RETURNING *`,
      [user.school_id, halaqah_id||null, student_id, user.id, surah_number, surah_name||null, from_ayah||1, to_ayah||1, recitation_type||'new', grade, tajweed_errors||0, notes||null, calcPoints, duration_minutes||null]
    );

    await pool.query(
      `INSERT INTO quran_student_progress (school_id, student_id, total_points, total_sessions, last_surah, last_ayah, last_session_date, updated_at)
       VALUES ($1, $2, $3, 1, $4, $5, CURRENT_DATE, NOW())
       ON CONFLICT (school_id, student_id) DO UPDATE SET
         total_points = quran_student_progress.total_points + $3,
         total_sessions = quran_student_progress.total_sessions + 1,
         last_surah = $4, last_ayah = $5,
         last_session_date = CURRENT_DATE, updated_at = NOW()`,
      [user.school_id, student_id, calcPoints, surah_number, to_ayah || 1]
    );

    return NextResponse.json({ recitation: result.rows[0], message: 'تم تسجيل التسميع بنجاح' });
  } catch (error) {
    console.error('Quran recitation POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
