import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('school_id') || user.school_id;
    const result = await pool.query(`
      SELECT p.*, u.name as author_name, u.role as author_role,
        (SELECT COUNT(*) FROM community_likes cl WHERE cl.post_id = p.id) as likes_count,
        (SELECT COUNT(*) FROM community_comments cc WHERE cc.post_id = p.id) as comments_count,
        EXISTS(SELECT 1 FROM community_likes cl WHERE cl.post_id = p.id AND cl.user_id = $2) as liked_by_me
      FROM community_posts p
      LEFT JOIN users u ON u.id::text = p.user_id
      WHERE p.school_id = $1
      ORDER BY p.created_at DESC LIMIT 50
    `, [String(schoolId), String(user.id)]);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Community GET:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { content, school_id } = await request.json();
    if (!content || !content.trim()) return NextResponse.json({ error: 'المحتوى مطلوب' }, { status: 400 });
    let schoolId = school_id || user.school_id;
    if (user.role === 'owner' && !schoolId) {
      const s = await pool.query('SELECT id FROM schools WHERE owner_id = $1 LIMIT 1', [String(user.id)]);
      schoolId = s.rows[0]?.id;
    }
    const result = await pool.query(
      'INSERT INTO community_posts (content, user_id, school_id) VALUES ($1, $2, $3) RETURNING *',
      [content.trim(), String(user.id), String(schoolId)]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Community POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const { post_id, action, content } = await request.json();
    if (action === 'like') {
      try {
        await pool.query('INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)', [post_id, String(user.id)]);
      } catch {
        await pool.query('DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2', [post_id, String(user.id)]);
      }
      return NextResponse.json({ success: true });
    }
    if (action === 'comment') {
      if (!content) return NextResponse.json({ error: 'التعليق مطلوب' }, { status: 400 });
      const result = await pool.query(
        'INSERT INTO community_comments (post_id, content, user_id) VALUES ($1, $2, $3) RETURNING *',
        [post_id, content.trim(), String(user.id)]
      );
      return NextResponse.json(result.rows[0], { status: 201 });
    }
    return NextResponse.json({ error: 'إجراء غير صحيح' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'مطلوب' }, { status: 400 });
    if (['super_admin', 'owner', 'admin'].includes(user.role)) {
      await pool.query('DELETE FROM community_posts WHERE id = $1', [id]);
    } else {
      await pool.query('DELETE FROM community_posts WHERE id = $1 AND user_id = $2', [id, String(user.id)]);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
