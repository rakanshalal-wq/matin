import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/forums/[id]/posts — منشورات منتدى
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query(
      `SELECT fp.*, u.name as author_name FROM forum_posts fp
       LEFT JOIN users u ON u.id::text = fp.author_id::text
       WHERE fp.forum_id=$1
       ORDER BY fp.is_pinned DESC, fp.created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );
    return NextResponse.json({ posts: result.rows, page, limit });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/forums/[id]/posts — إنشاء منشور
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, content, category } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'title و content مطلوبان' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO forum_posts (forum_id, author_id, title, content, category)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, user.id, title, content, category]
    );
    return NextResponse.json({ post: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
