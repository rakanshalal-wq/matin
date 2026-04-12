import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/questions/import — استيراد أسئلة من ملف
export async function POST(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const body = await request.json();
  const { import_file_url } = body;

  if (!import_file_url) return NextResponse.json({ error: 'import_file_url مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      `INSERT INTO question_imports (institution_id, import_file_url, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [user.school_id || user.institution_id, import_file_url]
    );
    return NextResponse.json({ import: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
