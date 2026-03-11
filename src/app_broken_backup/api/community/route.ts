import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req as any);
    const { searchParams } = new URL(req.url);
    const school_id = searchParams.get('school_id') || (user?.school_id ? String(user.school_id) : null);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    if (!school_id) {
      return NextResponse.json({ posts: [], total: 0 });
    }

    const result = await pool.query(
      `SELECT p.id, p.content, p.created_at, p.is_pinned, p.is_hidden,
        (SELECT COUNT(*) FROM community_likes cl WHERE cl.post_id::text = p.id::text) as likes_count,
        (SELECT COUNT(*) FROM community_comments cc WHERE cc.post_id::text = p.id::text) as comments_count,
        u.name as author_name, u.avatar as author_avatar, u.role as author_role
       FROM community_posts p
       LEFT JOIN users u ON u.id::text = p.user_id::text
       WHERE p.school_id::text = $1::text
       AND (p.is_hidden IS NULL OR p.is_hidden = false)
       ORDER BY p.is_pinned DESC, p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [String(school_id), limit, offset]
    ).catch(() => ({ rows: [] }));

    const total = await pool.query(
      `SELECT COUNT(*) FROM community_posts WHERE school_id::text = $1::text`,
      [String(school_id)]
    ).catch(() => ({ rows: [{ count: 0 }] }));

    return NextResponse.json({
      posts: result.rows,
      total: parseInt(total.rows[0]?.count || '0'),
      page,
      limit
    });
  } catch (e: any) {
    console.error('Community GET error:', e.message);
    return NextResponse.json({ posts: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { action, content, school_id, post_id, comment } = body;

    const sid = school_id || user.school_id;

    if (action === 'create' || !action) {
      if (!content) return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO community_posts (user_id, school_id, content, created_at)
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [String(user.id), String(sid), content]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ success: true, post: result.rows[0] });
    }

    if (action === 'like') {
      const existing = await pool.query(
        `SELECT id FROM community_likes WHERE post_id::text = $1::text AND user_id::text = $2::text`,
        [String(post_id), String(user.id)]
      ).catch(() => ({ rows: [] }));

      if (existing.rows.length > 0) {
        await pool.query(
          `DELETE FROM community_likes WHERE post_id::text = $1::text AND user_id::text = $2::text`,
          [String(post_id), String(user.id)]
        ).catch(() => {});
        return NextResponse.json({ success: true, liked: false });
      } else {
        await pool.query(
          `INSERT INTO community_likes (post_id, user_id, school_id, created_at) VALUES ($1, $2, $3, NOW())`,
          [String(post_id), String(user.id), String(sid)]
        ).catch(() => {});
        return NextResponse.json({ success: true, liked: true });
      }
    }

    if (action === 'comment') {
      if (!comment) return NextResponse.json({ error: 'التعليق مطلوب' }, { status: 400 });
      const result = await pool.query(
        `INSERT INTO community_comments (post_id, user_id, school_id, content, created_at)
         VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
        [String(post_id), String(user.id), String(sid), comment]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ success: true, comment: result.rows[0] });
    }

    if (action === 'delete') {
      if (user.role === 'super_admin' || user.role === 'admin') {
        await pool.query(`DELETE FROM community_posts WHERE id::text = $1::text`, [String(post_id)]).catch(() => {});
      } else {
        await pool.query(
          `DELETE FROM community_posts WHERE id::text = $1::text AND user_id::text = $2::text`,
          [String(post_id), String(user.id)]
        ).catch(() => {});
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' });
  } catch (e: any) {
    console.error('Community POST error:', e.message);
    return NextResponse.json({ error: 'فشل', success: false });
  }
}
