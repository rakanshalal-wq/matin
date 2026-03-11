import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user info
    const userResult = await pool.query(
      'SELECT id, name, email, avatar, bio, verified, role, created_at FROM users WHERE id::text = $1::text',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const profile = userResult.rows[0];

    // Get posts count
    const postsCount = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE user_id::text = $1::text',
      [userId]
    );

    // Get followers count
    const followersCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [userId]
    );

    // Get following count
    const followingCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [userId]
    );

    // Get user posts
    const postsResult = await pool.query(`
      SELECT 
        posts.*,
        users.name as author_name,
        users.avatar as author_avatar,
        users.bio as author_bio,
        users.verified as author_verified,
        users.role as author_role
      FROM posts
      JOIN users ON posts.user_id::text = users.id::text
      WHERE posts.user_id::text = $1::text
      ORDER BY posts.created_at DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      user: user,
      stats: {
        posts: parseInt(postsCount.rows[0].count),
        followers: parseInt(followersCount.rows[0].count),
        following: parseInt(followingCount.rows[0].count)
      },
      posts: postsResult.rows
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}
