import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/forums/[id]/follow — متابعة منتدى
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      `INSERT INTO forum_follows (user_id, forum_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [user.id, id]
    );
    return NextResponse.json({ success: true, message: 'تمت المتابعة' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/forums/[id]/follow — إلغاء متابعة منتدى
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query('DELETE FROM forum_follows WHERE user_id=$1 AND forum_id=$2', [user.id, id]);
    return NextResponse.json({ success: true, message: 'تم إلغاء المتابعة' });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
