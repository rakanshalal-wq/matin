import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { ChangePasswordSchema, formatZodError } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const parsed = ChangePasswordSchema.safeParse({
      current_password: body.currentPassword,
      new_password: body.newPassword,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }
    const currentPassword = parsed.data.current_password;
    const newPassword = parsed.data.new_password;

    // جلب الباسورد الحالي من قاعدة البيانات
    const userRecord = await pool.query(
      'SELECT password, must_change_password FROM users WHERE id = $1',
      [user.id]
    );
    if (userRecord.rows.length === 0) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    const storedPassword = userRecord.rows[0].password;
    const mustChange = userRecord.rows[0].must_change_password;

    // إذا لم يكن مطلوباً تغيير الباسورد — يجب تقديم الباسورد الحالي
    if (!mustChange) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'كلمة المرور الحالية مطلوبة' },
          { status: 400 }
        );
      }

      // التحقق من صحة الباسورد الحالي
      let isCurrentValid = false;
      if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$')) {
        isCurrentValid = await bcrypt.compare(currentPassword, storedPassword);
      } else {
        isCurrentValid = storedPassword === currentPassword;
      }

      if (!isCurrentValid) {
        return NextResponse.json(
          { error: 'كلمة المرور الحالية غير صحيحة' },
          { status: 401 }
        );
      }
    }

    // التأكد أن الباسورد الجديد مختلف عن القديم
    if (storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2a$')) {
      const isSame = await bcrypt.compare(newPassword, storedPassword);
      if (isSame) {
        return NextResponse.json(
          { error: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية' },
          { status: 400 }
        );
      }
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query(
      'UPDATE users SET password = $1, must_change_password = false WHERE id = $2',
      [hashed, user.id]
    );

    return NextResponse.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
