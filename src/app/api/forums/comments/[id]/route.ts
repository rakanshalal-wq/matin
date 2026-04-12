import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/forums/comments/[id] — تحديث تعليق
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content) return NextResponse.json({ error: 'content مطلوب' }, { status: 400 });

  try {
    const result = await pool.query(
      `UPDATE forum_comments SET content=$1, updated_at=NOW()
       WHERE id=$2 AND author_id=$3 RETURNING *`,
      [content, id, user.id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'التعليق غير موجود أو غير مصرح' }, { status: 404 });
    return NextResponse.json({ comment: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/forums/comments/[id] — حذف تعليق
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    await pool.query(
      'DELETE FROM forum_comments WHERE id=$1 AND (author_id=$2 OR $3 = ANY(ARRAY[\'admin\',\'super_admin\']))',
      [id, user.id, user.role]
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
