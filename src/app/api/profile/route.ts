import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET — جلب بيانات ملف شخصي
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || String(user.id);

    const userResult = await pool.query(
      'SELECT id, name, email, avatar, bio, verified, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const postsCount = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE user_id = $1',
      [userId]
    ).catch(() => ({ rows: [{ count: '0' }] }));

    const followersCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE following_id = $1',
      [userId]
    ).catch(() => ({ rows: [{ count: '0' }] }));

    const followingCount = await pool.query(
      'SELECT COUNT(*) FROM follows WHERE follower_id = $1',
      [userId]
    ).catch(() => ({ rows: [{ count: '0' }] }));

    const postsResult = await pool.query(`
      SELECT posts.*, users.name as author_name, users.avatar as author_avatar,
             users.bio as author_bio, users.verified as author_verified, users.role as author_role
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.user_id = $1
      ORDER BY posts.created_at DESC
      LIMIT 50
    `, [userId]).catch(() => ({ rows: [] }));

    return NextResponse.json({
      success: true,
      user: userResult.rows[0],
      stats: {
        posts: parseInt(postsCount.rows[0].count),
        followers: parseInt(followersCount.rows[0].count),
        following: parseInt(followingCount.rows[0].count)
      },
      posts: postsResult.rows
    });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في جلب البيانات' }, { status: 500 });
  }
}

// PUT — تحديث بيانات الملف الشخصي (الاسم، الصورة، البيو)
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { name, avatar, bio, phone } = await request.json();

    // التحقق من الاسم إذا تم تقديمه
    if (name !== undefined) {
      if (!name?.trim() || name.trim().length < 2) {
        return NextResponse.json({ error: 'الاسم يجب أن يكون حرفين على الأقل' }, { status: 400 });
      }
    }

    // بناء الاستعلام ديناميكياً
    const updates: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (name !== undefined) { updates.push(`name = $${idx++}`); params.push(name.trim()); }
    if (avatar !== undefined) { updates.push(`avatar = $${idx++}`); params.push(avatar); }
    if (bio !== undefined) { updates.push(`bio = $${idx++}`); params.push(bio?.trim() || null); }
    if (phone !== undefined) { updates.push(`phone = $${idx++}`); params.push(phone?.trim() || null); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
    }

    params.push(user.id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, name, email, avatar, bio, phone, role`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      user: result.rows[0]
    });
  } catch {
    return NextResponse.json({ error: 'حدث خطأ في التحديث' }, { status: 500 });
  }
}
