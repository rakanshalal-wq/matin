import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://matin:F5HC3q3qoxxKhDy84YYWWpmd@localhost:5432/matin_db'
});

export async function GET(request: Request) {
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
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at ASC
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

export async function POST(request: Request) {
  try {
    const { userId, postId, content } = await request.json();

    if (!userId || !postId || !content) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, postId, content]
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
