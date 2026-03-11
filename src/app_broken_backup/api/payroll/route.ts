import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    let query = '';
    let params: any[] = [];
    
    if (user.role === 'super_admin') {
      query = `SELECT p.*, u.name as employee_name_full, u.role as employee_role
               FROM payroll p LEFT JOIN users u ON p.employee_id::text = u.id::text
               ORDER BY p.created_at DESC LIMIT 100`;
    } else {
      query = `SELECT p.*, u.name as employee_name_full, u.role as employee_role
               FROM payroll p LEFT JOIN users u ON p.employee_id::text = u.id::text
               WHERE p.school_id::text = $1::text
               ORDER BY p.created_at DESC`;
      params = [String(user.school_id)];
    }
    
    const result = await pool.query(query, params);
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
    const { employee_id, basic_salary, allowances, deductions, month, year, notes, employee_name, role } = body;
    const net_salary = (Number(basic_salary) || 0) + (Number(allowances) || 0) - (Number(deductions) || 0);
    const school_id = user.school_id || body.school_id || '';
    
    const result = await pool.query(`
      INSERT INTO payroll (employee_id, school_id, employee_name, role, basic_salary, allowances, deductions, net_salary, month, year, status, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11, NOW()
      RETURNING *
    `, [employee_id || null, school_id, employee_name || '', role || '', basic_salary || 0, allowances || 0, deductions || 0, net_salary, month, year, notes || '']);
    return NextResponse.json({ data: result.rows[0], message: 'تم إضافة الراتب بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || !['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const body = await req.json();
    const { id, status, payment_date } = body;
    if (!id) return NextResponse.json({ error: 'معرف مطلوب' }, { status: 400 });
    
    await pool.query('UPDATE payroll SET status = $1, payment_date = $2 WHERE id::text = $3::text', [status || 'paid', payment_date || null, id]);
    return NextResponse.json({ message: 'تم التحديث بنجاح' });
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
    await pool.query('DELETE FROM payroll WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف بنجاح' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
