import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ===== جلسات التسميع المباشرة =====

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('id');
    const circleId = searchParams.get('circle_id');
    const status = searchParams.get('status');
    const schoolId = user.school_id || user.id;

    if (sessionId) {
      const result = await pool.query(
        `SELECT qs.*, qc.name AS circle_name, u.name AS teacher_name,
          (SELECT json_agg(json_build_object(
            'id', qa.id, 'student_id', qa.student_id, 'status', qa.status,
            'student_name', qst.name
          )) FROM quran_attendance qa
           JOIN quran_students qst ON qa.student_id = qst.id
           WHERE qa.session_id = qs.id) AS attendance
         FROM quran_sessions qs
         LEFT JOIN quran_circles qc ON qs.circle_id = qc.id
         LEFT JOIN users u ON qs.teacher_id = u.id
         WHERE qs.id = $1`,
        [sessionId]
      );
      if (!result.rows[0]) return NextResponse.json({ error: 'الجلسة غير موجودة' }, { status: 404 });
      return NextResponse.json(result.rows[0]);
    }

    let query = `
      SELECT qs.*, qc.name AS circle_name, u.name AS teacher_name
      FROM quran_sessions qs
      LEFT JOIN quran_circles qc ON qs.circle_id = qc.id
      LEFT JOIN users u ON qs.teacher_id = u.id
      WHERE qs.school_id = $1`;
    const params: any[] = [schoolId];
    let idx = 2;

    if (circleId) { query += ` AND qs.circle_id = $${idx++}`; params.push(circleId); }
    if (status) { query += ` AND qs.status = $${idx++}`; params.push(status); }
    query += ' ORDER BY qs.started_at DESC LIMIT 100';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    console.error('quran-sessions GET:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { circle_id, title, notes } = body;
    const schoolId = user.school_id || user.id;

    const result = await pool.query(
      `INSERT INTO quran_sessions (circle_id, teacher_id, school_id, title, notes, status)
       VALUES ($1,$2,$3,$4,$5,'active') RETURNING *`,
      [circle_id || null, user.id, schoolId, title || 'جلسة تسميع', notes || null]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-sessions POST:', error);
    return NextResponse.json({ error: 'فشل في إنشاء الجلسة' }, { status: 500 });
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
    const { status, notes, ended_at } = body;

    const result = await pool.query(
      `UPDATE quran_sessions SET status=$1, notes=$2, ended_at=$3 WHERE id=$4 RETURNING *`,
      [status || 'ended', notes || null, ended_at || new Date().toISOString(), id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'الجلسة غير موجودة' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-sessions PUT:', error);
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}
