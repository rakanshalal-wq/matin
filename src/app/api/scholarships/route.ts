import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM scholarships WHERE 1=1 ${filter.sql} ORDER BY created_at DESC`,
      filter.params
    );
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const ids = getInsertIds(user);
    const body = await request.json();
    const { student_name, type, amount, percentage, reason, start_date, end_date, status } = body;
    if (!student_name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO scholarships (student_name, type, amount, percentage, reason, start_date, end_date, status, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [student_name, type||'discount', amount||0, percentage||0, reason||null, start_date||null, end_date||null, status||'active', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, student_name, type, amount, percentage, reason, start_date, end_date, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE scholarships SET student_name=$1, type=$2, amount=$3, percentage=$4, reason=$5, start_date=$6, end_date=$7, status=$8 WHERE id=$9 RETURNING *',
      [student_name, type, amount, percentage, reason, start_date, end_date, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM scholarships WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
