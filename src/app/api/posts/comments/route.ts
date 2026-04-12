import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(`
      SELECT 
        comments.*,
        users.name as author_name,
        users.avatar as author_avatar,
        users.verified as author_verified,
        users.role as author_role
      FROM post_comments
      JOIN users ON post_comments.user_id = users.id
      WHERE post_comments.post_id = $1
      ORDER BY post_comments.created_at ASC
    `, [postId]);

    return NextResponse.json({
      success: true,
      comments: result.rows
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ في جلب التعليقات' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { getUserFromRequest } = await import('@/lib/auth');
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { postId, content } = await request.json();

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO post_comments (user_id, post_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [user.id, postId, content]
    );

    await pool.query(
      'UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1',
      [postId]
    );

    return NextResponse.json({
      success: true,
      comment: result.rows[0]
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ في إضافة التعليق' },
      { status: 500 }
    );
  }
}
