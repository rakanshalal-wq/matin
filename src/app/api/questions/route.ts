import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions — قائمة الأسئلة
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const subject_id = searchParams.get('subject_id');
  const difficulty = searchParams.get('difficulty');

  try {
    let query = 'SELECT * FROM questions WHERE institution_id = $1';
    const queryParams: any[] = [user.school_id || user.institution_id];

    if (subject_id)  { query += ` AND subject_id = $${queryParams.length + 1}`;      queryParams.push(subject_id); }
    if (difficulty)  { query += ` AND difficulty_level = $${queryParams.length + 1}`; queryParams.push(difficulty); }
    query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ questions: result.rows, page, limit });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/questions — إضافة سؤال
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, question_type, difficulty_level, points, subject_id, options } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'title و content مطلوبان' }, { status: 400 });
  }

  try {
    const qResult = await pool.query(
      `INSERT INTO questions (institution_id, subject_id, created_by, title, content, question_type, difficulty_level, points)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [user.school_id || user.institution_id, subject_id, user.id, title, content,
       question_type || 'mcq', difficulty_level || 'medium', points || 1]
    );

    const question = qResult.rows[0];

    // إضافة الخيارات إن وجدت
    if (options && Array.isArray(options)) {
      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        await pool.query(
          `INSERT INTO question_options (question_id, option_text, is_correct, order_index) VALUES ($1,$2,$3,$4)`,
          [question.id, opt.text, opt.is_correct || false, i]
        );
      }
    }

    return NextResponse.json({ question }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
