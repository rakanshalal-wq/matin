import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions/import/[id] — حالة الاستيراد
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query('SELECT * FROM question_imports WHERE id = $1', [id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'الاستيراد غير موجود' }, { status: 404 });
    return NextResponse.json({ import: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
