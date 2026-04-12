import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM health_records WHERE 1=1 ${filter.sql} ORDER BY created_at DESC LIMIT 200`,
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
    const { student_name, condition, blood_type, allergies, medications, doctor_name, notes, status } = body;
    if (!student_name) return NextResponse.json({ error: 'اسم الطالب مطلوب' }, { status: 400 });
    const result = await pool.query(
      `INSERT INTO health_records (student_name, condition, blood_type, allergies, medications, doctor_name, notes, status, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [student_name, condition||null, blood_type||null, allergies||null, medications||null, doctor_name||null, notes||null, status||'active', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, student_name, condition, blood_type, allergies, medications, doctor_name, notes, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE health_records SET student_name=$1, condition=$2, blood_type=$3, allergies=$4, medications=$5, doctor_name=$6, notes=$7, status=$8 WHERE id=$9 RETURNING *',
      [student_name, condition, blood_type, allergies, medications, doctor_name, notes, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM health_records WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
