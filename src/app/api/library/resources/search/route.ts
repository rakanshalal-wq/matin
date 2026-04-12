import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/library/resources/search — بحث في الموارد
export async function GET(request: Request) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) return NextResponse.json({ error: 'كلمة البحث مطلوبة' }, { status: 400 });

  try {
    const result = await pool.query(
      `SELECT * FROM library_resources
       WHERE (institution_id = $1 OR is_public = true)
         AND (title ILIKE $2 OR description ILIKE $2 OR author ILIKE $2)
       ORDER BY created_at DESC LIMIT 30`,
      [user.school_id || user.institution_id, `%${q}%`]
    );
    return NextResponse.json({ results: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
