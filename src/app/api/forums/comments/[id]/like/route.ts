import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/forums/comments/[id]/like — إعجاب بتعليق
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      `INSERT INTO forum_likes (comment_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [id, user.id]
    );
    // تحديث عداد الإعجابات على التعليق
    await pool.query(
      `UPDATE forum_comments SET likes_count = (
        SELECT COUNT(*) FROM forum_likes WHERE comment_id=$1
      ) WHERE id=$1`,
      [id]
    ).catch(() => {});
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/forums/comments/[id]/like — إلغاء الإعجاب بتعليق
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query('DELETE FROM forum_likes WHERE comment_id=$1 AND user_id=$2', [id, user.id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
