import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/forums/posts/[id]/like — إعجاب بمنشور
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      `INSERT INTO forum_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [id, user.id]
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/forums/posts/[id]/like — إلغاء الإعجاب
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query('DELETE FROM forum_likes WHERE post_id=$1 AND user_id=$2', [id, user.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
