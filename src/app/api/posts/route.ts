import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query(`
      SELECT 
        posts.*,
        users.name as author_name,
        users.avatar as author_avatar,
        users.bio as author_bio,
        users.verified as author_verified,
        users.role as author_role
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE 1=1 ${filter.sql} ORDER BY posts.created_at DESC LIMIT 200
    `, filter.params);

    return NextResponse.json({
      success: true,
      posts: result.rows
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'حدث خطأ في جلب المنشورات' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);
    const body = await request.json();
    const { action } = body;

    // === إضافة تعليق ===
    if (action === 'comment') {
      const { post_id, content: commentContent, parent_id } = body;
      if (!post_id || !commentContent) return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
      const id = require('crypto').randomUUID();
      const userId = user.id || user.user_id;
      const result = await pool.query(
        `INSERT INTO post_comments (id, post_id, user_id, content, parent_id, school_id, owner_id, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
        [id, post_id, userId, commentContent, parent_id || null, ids.school_id, ids.owner_id]
      );
      // تحديث عداد التعليقات
      await pool.query('UPDATE posts SET comments_count = COALESCE(comments_count, 0) + 1 WHERE id = $1', [post_id]);
      return NextResponse.json(result.rows[0], { status: 201 });
    }

    // === إعجاب / إلغاء إعجاب ===
    if (action === 'like' || action === 'toggle_like') {
      const { post_id } = body;
      if (!post_id) return NextResponse.json({ error: 'معرف المنشور مطلوب' }, { status: 400 });
      const userId = user.id || user.user_id;
      
      // تحقق إذا موجود
      const existing = await pool.query(
        'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2', [post_id, userId]
      );
      
      if (existing.rows.length > 0) {
        // إلغاء الإعجاب
        await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [post_id, userId]);
        await pool.query('UPDATE posts SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0) WHERE id = $1', [post_id]);
        return NextResponse.json({ liked: false });
      } else {
        // إعجاب
        const id = require('crypto').randomUUID();
        await pool.query(
          'INSERT INTO post_likes (id, post_id, user_id, created_at) VALUES ($1,$2,$3,NOW())',
          [id, post_id, userId]
        );
        await pool.query('UPDATE posts SET likes_count = COALESCE(likes_count, 0) + 1 WHERE id = $1', [post_id]);
        return NextResponse.json({ liked: true });
      }
    }

    // === جلب تعليقات منشور ===
    if (action === 'get_comments') {
      const { post_id } = body;
      const result = await pool.query(`
        SELECT pc.*, u.name as user_name, u.avatar as user_avatar
        FROM post_comments pc
        LEFT JOIN users u ON u.id::text = pc.user_id::text
        WHERE pc.post_id = $1
        ORDER BY pc.created_at ASC
      `, [post_id]);
      return NextResponse.json(result.rows);
    }

    // === إنشاء منشور جديد ===
    const { content: postContent, title, image_url, type, visibility } = body;
    if (!postContent && !title) return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 });
    const id = require('crypto').randomUUID();
    const userId = user.id || user.user_id;
    const result = await pool.query(
      `INSERT INTO posts (id, user_id, author_name, title, content, image_url, type, visibility, likes_count, comments_count, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,0,$9,$10,NOW()) RETURNING *`,
      [id, userId, user.name || 'مجهول', title || null, postContent || '', image_url || null, type || 'post', visibility || 'public', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
