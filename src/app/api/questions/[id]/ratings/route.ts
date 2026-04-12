import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions/[id]/ratings — تقييمات سؤال
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      `SELECT qr.*, u.name as user_name FROM question_ratings qr
       LEFT JOIN users u ON u.id::text = qr.user_id::text
       WHERE qr.question_id = $1 ORDER BY qr.created_at DESC`,
      [id]
    );
    return NextResponse.json({ ratings: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
