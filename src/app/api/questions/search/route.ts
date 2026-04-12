import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions/search — بحث في الأسئلة
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const subject_id = searchParams.get('subject_id');
  const difficulty = searchParams.get('difficulty');

  if (!q) return NextResponse.json({ error: 'كلمة البحث مطلوبة' }, { status: 400 });

  try {
    let query = `SELECT * FROM questions WHERE institution_id=$1 AND (title ILIKE $2 OR content ILIKE $2)`;
    const queryParams: any[] = [user.school_id || user.institution_id, `%${q}%`];

    if (subject_id) { query += ` AND subject_id = $${queryParams.length + 1}`;      queryParams.push(subject_id); }
    if (difficulty) { query += ` AND difficulty_level = $${queryParams.length + 1}`; queryParams.push(difficulty); }
    query += ' ORDER BY created_at DESC LIMIT 30';

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ results: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
