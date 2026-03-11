import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://matin:F5HC3q3qoxxKhDy84YYWWpmd@localhost:5432/matin_db'
});

export async function POST(request: Request) {
  try {
    const { userId, postId } = await request.json();

    const existingLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingLike.rows.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );

      await pool.query(
        'UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1',
        [postId]
      );

      return NextResponse.json({
        success: true,
        action: 'unliked'
      });
    } else {
      await pool.query(
        'INSERT INTO likes (user_id, post_id) VALUES ($1, $2)',
        [userId, postId]
      );

      await pool.query(
        'UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1',
        [postId]
      );

      return NextResponse.json({
        success: true,
        action: 'liked'
      });
    }

  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ' },
      { status: 500 }
    );
  }
}
