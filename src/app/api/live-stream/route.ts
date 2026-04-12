import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query('SELECT * FROM live_streams ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { title, subject, teacher_name, class_name, platform, link, date, duration, viewers_count, status } = body;
    if (!title) return NextResponse.json({ error: 'عنوان البث مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO live_streams (title, subject, teacher_name, class_name, platform, link, date, duration, viewers_count, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *',
      [title, subject || null, teacher_name || null, class_name || null, platform || 'zoom', link || null, date || null, duration || null, viewers_count || 0, status || 'scheduled']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, title, subject, teacher_name, class_name, platform, link, date, duration, viewers_count, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE live_streams SET title=$1, subject=$2, teacher_name=$3, class_name=$4, platform=$5, link=$6, date=$7, duration=$8, viewers_count=$9, status=$10 WHERE id=$11 RETURNING *',
      [title, subject, teacher_name, class_name, platform, link, date, duration, viewers_count, status, id]
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
    await pool.query('DELETE FROM live_streams WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
