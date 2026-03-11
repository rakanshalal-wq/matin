import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
function getUserFromRequest(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET || '') as any;
    }
    const userId = req.headers.get('x-user-id');
    if (userId) return { id: parseInt(userId) };
    return null;
  } catch { return null; }
}
export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await req.json();
    const { action } = body;
    if (action === 'get_posts') {
      const result = await pool.query(`
        SELECT p.*, u.name as user_name, u.avatar as user_avatar, u.role as user_role,
          EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = $1) as user_liked
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT 50
      `, [user.id]);
      return NextResponse.json({ posts: result.rows });
    }
    if (action === 'create_post') {
      const { content } = body;
      if (!content?.trim()) return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 });
      await pool.query(
        'INSERT INTO posts (user_id, content, created_at) VALUES ($1, $2, NOW())',
        [user.id, content.trim()]
      );
      return NextResponse.json({ success: true });
    }
    if (action === 'delete_post') {
      const { post_id } = body;
      const post = await pool.query('SELECT user_id FROM posts WHERE id = $1', [post_id]);
      if (post.rows.length === 0) return NextResponse.json({ error: 'المنشور غير موجود' }, { status: 404 });
      const userInfo = await pool.query('SELECT role FROM users WHERE id = $1', [user.id]);
      if (post.rows[0].user_id !== user.id && userInfo.rows[0]?.role !== 'super_admin') {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
      }
      await pool.query('DELETE FROM posts WHERE id = $1', [post_id]);
      return NextResponse.json({ success: true });
    }
    if (action === 'toggle_like') {
      const { post_id } = body;
      const existing = await pool.query('SELECT id FROM likes WHERE post_id = $1 AND user_id = $2', [post_id, user.id]);
      if (existing.rows.length > 0) {
        await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [post_id, user.id]);
        await pool.query('UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = $1', [post_id]);
      } else {
        await pool.query('INSERT INTO likes (post_id, user_id, created_at) VALUES ($1, $2, NOW())', [post_id, user.id]);
        await pool.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1', [post_id]);
      }
      return NextResponse.json({ success: true });
    }
    if (action === 'add_comment') {
      const { post_id, content } = body;
      if (!content?.trim()) return NextResponse.json({ error: 'التعليق مطلوب' }, { status: 400 });
      await pool.query(
        'INSERT INTO comments (post_id, user_id, content, created_at) VALUES ($1, $2, $3, NOW())',
        [post_id, user.id, content.trim()]
      );
      await pool.query('UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1', [post_id]);
      return NextResponse.json({ success: true });
    }
    if (action === 'get_comments') {
      const { post_id } = body;
      const result = await pool.query(`
        SELECT c.*, u.name as user_name, u.avatar as user_avatar
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at ASC
      `, [post_id]);
      return NextResponse.json({ comments: result.rows });
    }
    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error: any) {
    console.error('Social API Error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
