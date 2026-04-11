import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// ===== حضور حلقات التحفيظ =====

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const circleId = searchParams.get('circle_id');
    const date = searchParams.get('date');
    const schoolId = user.school_id || user.id;

    let query = `
      SELECT qa.*, qst.name AS student_name
      FROM quran_attendance qa
      JOIN quran_students qst ON qa.student_id = qst.id
      WHERE qa.school_id = $1`;
    const params: any[] = [schoolId];
    let idx = 2;

    if (sessionId) { query += ` AND qa.session_id = $${idx++}`; params.push(sessionId); }
    if (circleId) { query += ` AND qa.circle_id = $${idx++}`; params.push(circleId); }
    if (date) { query += ` AND qa.date = $${idx++}`; params.push(date); }
    query += ' ORDER BY qst.name ASC';

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
    console.error('quran-attendance GET:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { records } = body; // [{ student_id, session_id, circle_id, status, date }]

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'يرجى إرسال سجلات الحضور' }, { status: 400 });
    }

    const schoolId = user.school_id || user.id;
    const today = new Date().toISOString().split('T')[0];

    const saved = [];
    for (const rec of records) {
      const { student_id, session_id, circle_id, status, date } = rec;
      if (!student_id) continue;
      const result = await pool.query(
        `INSERT INTO quran_attendance (student_id, session_id, circle_id, school_id, date, status)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (session_id, student_id) DO UPDATE SET status = EXCLUDED.status
         RETURNING *`,
        [student_id, session_id || null, circle_id || null, schoolId, date || today, status || 'PRESENT']
      );
      saved.push(result.rows[0]);
    }

    return NextResponse.json({ saved: saved.length, records: saved });
  } catch (error: any) {
    if (error?.code === '42P01') return NextResponse.json({ error: 'يرجى تشغيل migration_quran.sql أولاً' }, { status: 503 });
    console.error('quran-attendance POST:', error);
    return NextResponse.json({ error: 'فشل في حفظ الحضور' }, { status: 500 });
  }
}
