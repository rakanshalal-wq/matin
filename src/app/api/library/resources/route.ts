import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/library/resources — قائمة الموارد
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;
  const type = searchParams.get('type');
  const subject_id = searchParams.get('subject_id');

  try {
    let query = `SELECT * FROM library_resources WHERE (institution_id = $1 OR is_public = true)`;
    const queryParams: any[] = [user.school_id || user.institution_id];

    if (type)       { query += ` AND resource_type = $${queryParams.length + 1}`; queryParams.push(type); }
    if (subject_id) { query += ` AND subject_id = $${queryParams.length + 1}`;    queryParams.push(subject_id); }
    query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);
    return NextResponse.json({ resources: result.rows, page, limit });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/library/resources — إضافة مورد
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, resource_type, file_url, file_size_mb, author, subject_id, grade_level, is_public } = body;

  if (!title || !file_url) {
    return NextResponse.json({ error: 'title و file_url مطلوبان' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO library_resources
       (institution_id, title, description, resource_type, file_url, file_size_mb, author, subject_id, grade_level, is_public)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [user.school_id || user.institution_id, title, description, resource_type, file_url,
       file_size_mb, author, subject_id, grade_level, is_public || false]
    );
    return NextResponse.json({ resource: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
