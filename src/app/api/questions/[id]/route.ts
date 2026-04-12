import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// GET /api/questions/[id]
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  try {
    const [q, opts] = await Promise.all([
      pool.query('SELECT * FROM questions WHERE id = $1', [id]),
      pool.query('SELECT * FROM question_options WHERE question_id = $1 ORDER BY order_index', [id]),
    ]);
    if (!q.rows[0]) return NextResponse.json({ error: 'السؤال غير موجود' }, { status: 404 });
    return NextResponse.json({ question: { ...q.rows[0], options: opts.rows } });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// PUT /api/questions/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, content, question_type, difficulty_level, points } = body;

  try {
    const result = await pool.query(
      `UPDATE questions SET title=$1, content=$2, question_type=$3, difficulty_level=$4, points=$5
       WHERE id=$6 RETURNING *`,
      [title, content, question_type, difficulty_level, points, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'السؤال غير موجود' }, { status: 404 });
    return NextResponse.json({ question: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// DELETE /api/questions/[id]
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  try {
    await pool.query('DELETE FROM questions WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
