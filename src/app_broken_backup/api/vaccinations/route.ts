import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const result = await pool.query('SELECT * FROM vaccinations_table ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { student_name, vaccine_name, dose_number, date, next_dose_date, administered_by, status } = body;
    if (!student_name || !vaccine_name) return NextResponse.json({ error: 'اسم الطالب واسم التطعيم مطلوبين' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO vaccinations_table (student_name, vaccine_name, dose_number, date, next_dose_date, administered_by, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW() RETURNING *',
      [student_name, vaccine_name, dose_number || 1, date || null, next_dose_date || null, administered_by || null, status || 'completed']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, student_name, vaccine_name, dose_number, date, next_dose_date, administered_by, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE vaccinations_table SET student_name=$1, vaccine_name=$2, dose_number=$3, date=$4, next_dose_date=$5, administered_by=$6, status=$7 WHERE id::text = $8::text RETURNING *',
      [student_name, vaccine_name, dose_number, date, next_dose_date, administered_by, status, id]
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
    await pool.query('DELETE FROM vaccinations_table WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
