import { NextResponse } from 'next/server';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = getPaginationParams(searchParams);
    const [countResult, dataResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM clinic'),
      pool.query(`SELECT * FROM clinic ORDER BY created_at DESC LIMIT $1 OFFSET $2`, [limit, offset])
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const ids = getInsertIds(user);

    const body = await request.json();
    const { patient_name, visit_type, symptoms, diagnosis, treatment, doctor_name, visit_date, status } = body;
    if (!patient_name) return NextResponse.json({ error: 'اسم المريض مطلوب' }, { status: 400 });
    const result = await pool.query(
      'INSERT INTO clinic (patient_name, visit_type, symptoms, diagnosis, treatment, doctor_name, visit_date, status, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *',
      [patient_name, visit_type || 'checkup', symptoms || null, diagnosis || null, treatment || null, doctor_name || null, visit_date || null, status || 'open']
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, patient_name, visit_type, symptoms, diagnosis, treatment, doctor_name, visit_date, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const result = await pool.query(
      'UPDATE clinic SET patient_name=$1, visit_type=$2, symptoms=$3, diagnosis=$4, treatment=$5, doctor_name=$6, visit_date=$7, status=$8 WHERE id=$9 RETURNING *',
      [patient_name, visit_type, symptoms, diagnosis, treatment, doctor_name, visit_date, status, id]
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
    await pool.query('DELETE FROM clinic WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
