import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// GET - جلب كل الموظفين
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const result = await pool.query(`
      SELECT id, name, email, phone, role, status, bio, created_at FROM users
      WHERE role = 'employee'
      ${filter.sql} ORDER BY created_at DESC
    `, filter.params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

// POST - إضافة موظف جديد
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const ids = getInsertIds(user);
    const body = await request.json();
    const { name, email, phone, notes } = body;
    if (!name) return NextResponse.json({ error: 'اسم الموظف مطلوب' }, { status: 400 });
    if (!email) return NextResponse.json({ error: 'الإيميل مطلوب' }, { status: 400 });

    // باسورد عشوائي آمن
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashed = await bcrypt.hash(tempPassword, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password, role, status, bio, school_id, owner_id, created_at)
       VALUES ($1, $2, $3, $4, 'employee', 'active', $5, $6, $7, NOW()
       RETURNING id, name, email, phone, role, status, created_at`,
      [name, email, phone || null, hashed, notes || null, ids.school_id, ids.owner_id]
    );

    // نرجع الباسورد المؤقت مرة وحدة فقط — يظهر للمدير ليرسله للموظف
    return NextResponse.json({
      ...result.rows[0],
      temp_password: tempPassword,
      message: 'تم إضافة الموظف — احفظ كلمة المرور المؤقتة وأرسلها له'
    }, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في إضافة الموظف' }, { status: 500 });
  }
}

// DELETE - حذف موظف
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'معرف الموظف مطلوب' }, { status: 400 });
    const result = await pool.query(`DELETE FROM users WHERE id::text = $1::text AND role = 'employee' RETURNING *`, [id]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'الموظف غير موجود' }, { status: 404 });
    return NextResponse.json({ message: 'تم حذف الموظف بنجاح' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل في الحذف' }, { status: 500 });
  }
}
