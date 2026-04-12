import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/forums/posts/[id]/comments — تعليقات منشور
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const result = await pool.query(
      `SELECT fc.*, u.name as author_name FROM forum_comments fc
       LEFT JOIN users u ON u.id::text = fc.author_id::text
       WHERE fc.post_id=$1 ORDER BY fc.created_at ASC`,
      [id]
    );
    return NextResponse.json({ comments: result.rows, total: result.rowCount });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// POST /api/forums/posts/[id]/comments — إضافة تعليق
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) return NextResponse.json({ error: 'content مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      'INSERT INTO forum_comments (post_id, author_id, content) VALUES ($1,$2,$3) RETURNING *',
      [id, user.id, content]
    );
    return NextResponse.json({ comment: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
