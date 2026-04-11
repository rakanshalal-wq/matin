import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// POST — تعيين كلمة مرور جديدة باستخدام الـ token
export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token?.trim()) {
      return NextResponse.json({ error: 'رمز إعادة التعيين مطلوب' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // البحث عن الـ token في قاعدة البيانات
    const tokenResult = await pool.query(
      `SELECT prt.*, users.id as uid, users.email
       FROM password_reset_tokens prt
       JOIN users ON prt.user_id = users.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [token.trim()]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'رمز إعادة التعيين غير صالح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }

    const tokenRecord = tokenResult.rows[0];

    // تشفير الباسورد الجديد
    const hashed = await bcrypt.hash(newPassword, 12);

    // تحديث الباسورد وتعليم الـ token كمستخدم
    await pool.query(
      'UPDATE users SET password = $1, must_change_password = false WHERE id = $2',
      [hashed, tokenRecord.user_id]
    );

    await pool.query(
      'UPDATE password_reset_tokens SET used = true WHERE id = $1',
      [tokenRecord.id]
    );

    return NextResponse.json({
      success: true,
      message: 'تم تعيين كلمة المرور الجديدة بنجاح. يمكنك تسجيل الدخول الآن'
    });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
