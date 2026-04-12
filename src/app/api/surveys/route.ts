import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC LIMIT 200');
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { title, description, target_audience, questions_count, responses_count, start_date, end_date, status } = body;
    if (!title) return NextResponse.json({ error: 'عنوان الاستبيان مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO surveys (title, description, target_audience, questions_count, responses_count, start_date, end_date, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *',
      [title, description || null, target_audience || 'all', questions_count || 0, responses_count || 0, start_date || null, end_date || null, status || 'draft']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, title, description, target_audience, questions_count, responses_count, start_date, end_date, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE surveys SET title=$1, description=$2, target_audience=$3, questions_count=$4, responses_count=$5, start_date=$6, end_date=$7, status=$8 WHERE id=$9 RETURNING *',
      [title, description, target_audience, questions_count, responses_count, start_date, end_date, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM surveys WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
