import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// PUT /api/questions/[id]/difficulty — تحديث مستوى الصعوبة
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user || !['admin', 'super_admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { difficulty_level } = body;

  const validLevels = ['easy', 'medium', 'hard'];
  if (!difficulty_level || !validLevels.includes(difficulty_level)) {
    return NextResponse.json({ error: 'مستوى الصعوبة يجب أن يكون easy أو medium أو hard' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      'UPDATE questions SET difficulty_level=$1 WHERE id=$2 RETURNING *',
      [difficulty_level, id]
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'السؤال غير موجود' }, { status: 404 });
    return NextResponse.json({ question: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
