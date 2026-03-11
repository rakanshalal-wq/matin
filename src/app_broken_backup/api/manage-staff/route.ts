import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// جلب الموظفين حسب صلاحيات المستخدم
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = 'SELECT id, name, email, phone, role, status, school_id, owner_id, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    // عزل البيانات حسب الدور
    if (user.role === 'owner') {
      params.push(user.id);
      query += ` AND owner_id = $${params.length}`;
    } else if (user.role === 'admin' && user.school_id) {
      params.push(user.school_id);
      query += ` AND school_id = $${params.length}`;
    } else if (user.role !== 'super_admin') {
      return NextResponse.json([]);
    }

    if (role && role !== 'all') { params.push(role); query += ` AND role = $${params.length}`; }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

// إضافة معلم/مدير/موظف
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالإضافة' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, phone, role, school_id, national_id } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'الاسم والإيميل والباسورد مطلوبين' }, { status: 400 });
    }

    // تحديد المدرسة والمالك
    let finalSchoolId = school_id || user.school_id;
    let finalOwnerId = user.role === 'owner' ? user.id : user.owner_id;

    if (!finalSchoolId && user.role !== 'super_admin') {
      return NextResponse.json({ error: 'لازم تنشئ مدرسة أول' }, { status: 400 });
    }

    // تحقق من حدود الباقة (معلمين)
    if (user.role === 'owner' && (role === 'teacher' || !role) ) {
      const teacherCount = await pool.query(
        "SELECT COUNT(*) FROM users WHERE owner_id::text = $1::text AND role = 'teacher'", [user.id]
      );
      const current = parseInt(teacherCount.rows[0].count);
      const max = user.max_teachers || 5;
      if (current >= max) {
        return NextResponse.json({ error: `وصلت الحد الأقصى (${max} معلمين). رقّي باقتك` }, { status: 403 });
      }
    }

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) return NextResponse.json({ error: 'الإيميل مسجل مسبقاً' }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const validRoles = ['admin', 'teacher', 'parent', 'student'];
    const finalRole = validRoles.includes(role) ? role : 'teacher';

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, status, school_id, owner_id, national_id, created_at)
       VALUES ($1,$2,$3,$4,$5,'active',$6,$7,$8,NOW() RETURNING id, name, email, phone, role, status, school_id`,
      [name, email, hashed, phone || null, finalRole, finalSchoolId, finalOwnerId, national_id || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'حدث خطأ بالسيرفر' }, { status: 500 });
  }
}

// تعديل
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();
    const { id, name, phone, role, status } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // تحقق من الملكية
    if (user.role === 'owner') {
      const check = await pool.query('SELECT id FROM users WHERE id::text = $1::text AND owner_id::text = $2::text', [id, String(user.id)]);
      if (check.rows.length === 0) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const result = await pool.query(
      'UPDATE users SET name=$1, phone=$2, role=$3, status=$4 WHERE id::text = $5::text RETURNING id, name, email, phone, role, status',
      [name, phone, role, status, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل التحديث' }, { status: 500 });
  }
}

// حذف
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // ما نحذف super_admin أو owner
    const target = await pool.query('SELECT role, owner_id FROM users WHERE id::text = $1::text', [id]);
    if (target.rows.length === 0) return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    if (['super_admin', 'owner'].includes(target.rows[0].role)) {
      return NextResponse.json({ error: 'لا يمكن حذف هذا الحساب' }, { status: 403 });
    }

    // تحقق من الملكية
    if (user.role === 'owner' && target.rows[0].owner_id !== user.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    await pool.query('DELETE FROM users WHERE id::text = $1::text', [id]);
    return NextResponse.json({ message: 'تم الحذف' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
