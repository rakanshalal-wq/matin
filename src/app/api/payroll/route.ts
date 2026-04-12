import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filterSql = getFilterSQL(user);

    const result = await pool.query(`
      SELECT p.*, u.name as employee_name, u.role as employee_role
      FROM payroll p
      LEFT JOIN users u ON p.employee_id = u.id
      WHERE p.school_id IN (SELECT school_id FROM users WHERE id = $1)
      ORDER BY p.created_at DESC LIMIT 200
    `, [user.id]);

    return NextResponse.json({ data: result.rows, total: result.rowCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const body = await req.json();
    const { employee_id, amount, month, year, bonus, deductions, notes } = body;

    const net_amount = (Number(amount) || 0) + (Number(bonus) || 0) - (Number(deductions) || 0);

    const result = await pool.query(`
      INSERT INTO payroll (employee_id, school_id, amount, bonus, deductions, net_amount, month, year, status, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, NOW())
      RETURNING *
    `, [employee_id, user.school_id, amount || 0, bonus || 0, deductions || 0, net_amount, month, year, notes || '']);

    return NextResponse.json({ data: result.rows[0], message: 'تم إضافة الراتب بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });

    await pool.query('DELETE FROM payroll WHERE id = $1', [id]);
    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, amount, bonus, deductions, net_amount, status, notes } = body;
    if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 });
    const result = await pool.query(
      `UPDATE payroll SET amount = COALESCE($1, amount), bonus = COALESCE($2, bonus), deductions = COALESCE($3, deductions), net_amount = COALESCE($4, net_amount), status = COALESCE($5, status), notes = COALESCE($6, notes), updated_at = NOW() WHERE id = $7 RETURNING *`,
      [amount, bonus, deductions, net_amount, status, notes, id]
    );
    if (result.rows.length === 0) return NextResponse.json({ error: 'السجل غير موجود' }, { status: 404 });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) {
    console.error('PUT payroll error:', error);
    return NextResponse.json({ error: 'خطأ في تحديث البيانات' }, { status: 500 });
  }
}

