import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// POST /api/questions/[id]/rate — تقييم سؤال
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request as any);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { rating, comment } = body;

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `INSERT INTO question_ratings (question_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (question_id, user_id) DO UPDATE SET rating=$3, comment=$4
       RETURNING *`,
      [id, user.id, rating, comment]
    );

    // تحديث الإحصائيات
    await pool.query(
      `INSERT INTO question_statistics (question_id, average_rating)
       VALUES ($1, $2)
       ON CONFLICT (question_id) DO UPDATE SET
         average_rating = (SELECT AVG(rating) FROM question_ratings WHERE question_id=$1),
         updated_at = NOW()`,
      [id, rating]
    ).catch(() => {});

    return NextResponse.json({ rating: result.rows[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
