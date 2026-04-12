import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/announcements/[id]/stats — إحصائيات قراءة الإعلان
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const [ann, reads] = await Promise.all([
      pool.query('SELECT * FROM announcements WHERE id = $1', [id]),
      pool.query(
        `SELECT COUNT(*) as total_reads, MAX(read_at) as last_read
         FROM announcement_reads WHERE announcement_id = $1`,
        [id]
      ),
    ]);
    if (!ann.rows[0]) return NextResponse.json({ error: 'الإعلان غير موجود' }, { status: 404 });

    return NextResponse.json({
      announcement: ann.rows[0],
      stats: reads.rows[0],
    });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
