import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import jwt from 'jsonwebtoken';

function getUserFromToken(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (auth?.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      return jwt.verify(token, process.env.JWT_SECRET || 'matin_secret_2024') as any;
    }
    const cookie = req.cookies.get('matin_token')?.value;
    if (cookie) {
      return jwt.verify(cookie, process.env.JWT_SECRET || 'matin_secret_2024') as any;
    }
    return null;
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const school_id = searchParams.get('school_id');
    const type = searchParams.get('type') || 'posts';

    if (type === 'posts') {
      const result = await pool.query(
        `SELECT p.id, p.content, p.created_at, p.likes_count, p.comments_count,
          u.name as author_name, u.avatar as author_avatar, u.role as author_role
         FROM posts p
         LEFT JOIN users u ON p.user_id::text = u.id::text
         WHERE p.school_id::text = $1::text OR p.school_id IS NULL
         ORDER BY p.created_at DESC LIMIT 50`,
        [school_id]
      ).catch(() => ({ rows: [] });
      return NextResponse.json({ posts: result.rows, total: result.rows.length });
    }

    if (type === 'forums') {
      const result = await pool.query(
        `SELECT f.*, u.name as author_name FROM forums f
         LEFT JOIN users u ON f.user_id::text = u.id::text
         WHERE f.school_id::text = $1::text
         ORDER BY f.created_at DESC LIMIT 50`,
        [school_id]
      ).catch(() => ({ rows: [] });
      return NextResponse.json({ forums: result.rows });
    }

    return NextResponse.json({ posts: [], forums: [], total: 0 });
  } catch (e: any) {
    console.error('Social GET error:', e.message);
    return NextResponse.json({ posts: [], forums: [], total: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await req.json();
    const { action, school_id, content, post_id } = body;

    if (action === 'create_post' || !action) {
      const result = await pool.query(
        `INSERT INTO posts (user_id, school_id, content, created_at, likes_count, comments_count)
         VALUES ($1, $2, $3, NOW(), 0, 0) RETURNING *`,
        [String(user.id), school_id, content]
      ).catch(() => ({ rows: [] });
      return NextResponse.json({ success: true, post: result.rows[0] });
    }

    if (action === 'like') {
      await pool.query(
        `INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, NOW()
         ON CONFLICT DO NOTHING`,
        [String(user.id), post_id]
      ).catch(() => {});
      await pool.query(
        `UPDATE posts SET likes_count = likes_count + 1 WHERE id::text = $1::text`,
        [post_id]
      ).catch(() => {});
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' });
  } catch (e: any) {
    console.error('Social POST error:', e.message);
    return NextResponse.json({ error: 'فشل', success: false });
  }
}
