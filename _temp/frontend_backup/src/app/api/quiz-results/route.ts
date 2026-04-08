import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/quiz-results?lecture_id=X
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lecture_id = searchParams.get('lecture_id');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT qr.*, u.name as student_name, l.title as lecture_title
      FROM quiz_results qr
      LEFT JOIN users u ON qr.student_id = u.id
      LEFT JOIN lectures l ON qr.lecture_id = l.id
      WHERE qr.school_id = $1
    `;
    const params: any[] = [user.school_id];
    let idx = 2;

    if (lecture_id) {
      query += ` AND qr.lecture_id = $${idx++}`;
      params.push(lecture_id);
    }

    // الطالب يرى نتائجه فقط
    if (user.role === 'student') {
      query += ` AND qr.student_id = $${idx++}`;
      params.push(user.id);
    }

    query += ` ORDER BY qr.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('quiz-results GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/quiz-results — حفظ نتيجة اختبار محاضرة
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  try {
    const body = await req.json();
    const { lecture_id, score, total, passed, answers } = body;

    if (!lecture_id || score === undefined) {
      return NextResponse.json({ error: 'lecture_id و score مطلوبان' }, { status: 400 });
    }

    // تحقق من عدم وجود نتيجة سابقة ناجحة
    const existing = await pool.query(
      `SELECT id, passed FROM quiz_results WHERE student_id = $1 AND lecture_id = $2 AND school_id = $3 ORDER BY created_at DESC LIMIT 1`,
      [user.id, lecture_id, user.school_id]
    );

    if (existing.rows.length > 0 && existing.rows[0].passed) {
      return NextResponse.json({ error: 'لقد اجتزت هذا الاختبار مسبقاً' }, { status: 409 });
    }

    const result = await pool.query(
      `INSERT INTO quiz_results (student_id, lecture_id, school_id, score, total, passed, answers, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [user.id, lecture_id, user.school_id, score, total || 5, passed || false, answers || '{}']
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('quiz-results POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
