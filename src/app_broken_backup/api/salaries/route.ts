import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const filter = getFilterSQL(user);
    const result = await pool.query(
      `SELECT * FROM salaries WHERE 1=1 ${filter.sql} ORDER BY created_at DESC`,
      filter.params
    );
    return NextResponse.json(result.rows);
  } catch (error) { console.error('Error:', error); return NextResponse.json([]); }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    const ids = getInsertIds(user);
    const body = await request.json();
    const { employee_name, role, base_salary, allowances, deductions, month, year, status } = body;
    if (!employee_name) return NextResponse.json({ error: 'اسم الموظف مطلوب' }, { status: 400 });
    const net = (Number(base_salary)||0) + (Number(allowances)||0) - (Number(deductions)||0);
    const result = await pool.query(
      `INSERT INTO salaries (employee_name, role, base_salary, allowances, deductions, net_salary, month, year, status, school_id, owner_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW() RETURNING *`,
      [employee_name, role||'teacher', base_salary||0, allowances||0, deductions||0, net, month||null, year||null, status||'pending', ids.school_id, ids.owner_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, employee_name, role, base_salary, allowances, deductions, month, year, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    const net = (Number(base_salary)||0) + (Number(allowances)||0) - (Number(deductions)||0);
    const result = await pool.query(
      'UPDATE salaries SET employee_name=$1, role=$2, base_salary=$3, allowances=$4, deductions=$5, net_salary=$6, month=$7, year=$8, status=$9 WHERE id::text = $10::text RETURNING *',
      [employee_name, role, base_salary, allowances, deductions, net, month, year, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM salaries WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) { console.error('Error:', error); return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
