import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions/[id]/stats — إحصائيات سؤال
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      'SELECT * FROM question_statistics WHERE question_id = $1',
      [id]
    );
    return NextResponse.json({ stats: result.rows[0] || { question_id: id, total_attempts: 0 } });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
