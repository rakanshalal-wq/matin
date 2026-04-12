import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/announcements/[id]/read — تسجيل قراءة الإعلان
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      `INSERT INTO announcement_reads (announcement_id, user_id)
       VALUES ($1, $2) ON CONFLICT (announcement_id, user_id) DO NOTHING`,
      [id, user.id]
    );
    return NextResponse.json({ success: true, message: 'تم تسجيل القراءة' });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
