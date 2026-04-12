import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { postId } = await request.json();
    if (!postId) return NextResponse.json({ error: 'postId مطلوب' }, { status: 400 });

    const existingLike = await pool.query(
      'SELECT id FROM post_likes WHERE user_id = $1 AND post_id = $2',
      [user.id, postId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        'DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2',
        [user.id, postId]
      );
      await pool.query(
        'UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = $1',
        [postId]
      );
      return NextResponse.json({ success: true, action: 'unliked' });
    } else {
      await pool.query(
        'INSERT INTO post_likes (user_id, post_id, created_at) VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING',
        [user.id, postId]
      );
      await pool.query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
        [postId]
      );
      return NextResponse.json({ success: true, action: 'liked' });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}
