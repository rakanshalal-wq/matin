import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/forums/posts/[id] — تفاصيل منشور
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    // زيادة عداد المشاهدات
    await pool.query('UPDATE forum_posts SET views_count = views_count + 1 WHERE id=$1', [id]).catch(() => {});
    const result = await pool.query(
      `SELECT fp.*, u.name as author_name FROM forum_posts fp
       LEFT JOIN users u ON u.id::text = fp.author_id::text
       WHERE fp.id=$1`,
      [id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المنشور غير موجود' }, { status: 404 });
    return NextResponse.json({ post: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/forums/posts/[id] — تحديث منشور
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, content, category, is_pinned } = body;

  try {
    const result = await pool.query(
      `UPDATE forum_posts SET title=$1, content=$2, category=$3, is_pinned=$4, updated_at=NOW()
       WHERE id=$5 AND author_id=$6 RETURNING *`,
      [title, content, category, is_pinned, id, user.id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'المنشور غير موجود أو غير مصرح' }, { status: 404 });
    return NextResponse.json({ post: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/forums/posts/[id] — حذف منشور
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      'DELETE FROM forum_posts WHERE id=$1 AND (author_id=$2 OR $3 = ANY(ARRAY[\'admin\',\'super_admin\']))',
      [id, user.id, user.role]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
