import { NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { LoginSchema, formatZodError } from '@/lib/schemas';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: formatZodError(parsed.error) },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    const result = await pool.query(
      'SELECT id, name, email, password, role, school_id, owner_id, package, status, must_change_password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    if (user.status === 'rejected') {
      return NextResponse.json({ success: false, message: 'تم رفض حسابك. تواصل مع الإدارة' }, { status: 403 });
    }
    // تم إزالة شرط pending - التسجيل فوري
    if (user.status === 'suspended') {
      return NextResponse.json({ success: false, message: 'حسابك موقوف. تواصل مع الإدارة' }, { status: 403 });
    }

    let validPassword = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      validPassword = await bcrypt.compare(password, user.password);
    } else {
      validPassword = (user.password === password);
      if (validPassword) {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
      }
    }

    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // ✅ التحقق من إعداد OTP من قاعدة البيانات
    const otpSetting = await pool.query(
      "SELECT value FROM platform_settings WHERE key = 'otp_enabled'"
    );
    const otpEnabled = otpSetting.rows[0]?.value === 'true';

    if (otpEnabled) {
      // توليد رمز OTP من 6 أرقام
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 دقائق

      // حفظ الرمز في قاعدة البيانات
      await pool.query(
        `CREATE TABLE IF NOT EXISTS otp_codes (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          code VARCHAR(6) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      );

      // حذف الأكواد القديمة لهذا المستخدم
      await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [user.id]);

      // إدخال الكود الجديد
      await pool.query(
        'INSERT INTO otp_codes (user_id, code, expires_at) VALUES ($1, $2, $3)',
        [user.id, otpCode, expiresAt]
      );

      // جلب إعدادات الإيميل
      const emailSettings = await pool.query(
        "SELECT key, value FROM platform_settings WHERE category = 'email'"
      );
      const emailConfig: Record<string, string> = {};
      for (const row of emailSettings.rows) {
        emailConfig[row.key] = row.value;
      }

      // إرسال OTP عبر الإيميل
      if (emailConfig.email_api_key) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${emailConfig.email_api_key}`
            },
            body: JSON.stringify({
              from: `${emailConfig.email_from_name || 'متين'} <${emailConfig.email_from || 'noreply@matin.ink'}>`,
              to: [email],
              subject: `رمز التحقق: ${otpCode}`,
              html: `
                <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f8f9fa; border-radius: 12px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #0D1B2A; margin: 0;">منصة متين</h1>
                    <p style="color: #666; margin-top: 8px;">رمز التحقق من تسجيل الدخول</p>
                  </div>
                  <div style="background: white; padding: 24px; border-radius: 8px; text-align: center;">
                    <p style="color: #333; font-size: 16px; margin-bottom: 16px;">مرحباً ${user.name}،</p>
                    <div style="background: #0D1B2A; color: #C9A227; font-size: 36px; font-weight: bold; letter-spacing: 12px; padding: 20px; border-radius: 8px; margin: 16px 0;">
                      ${otpCode}
                    </div>
                    <p style="color: #666; font-size: 14px;">الرمز صالح لمدة 5 دقائق</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">إذا لم تطلب هذا الرمز، تجاهل هذا الإيميل</p>
                  </div>
                </div>
              `
            })
          });

          if (!res.ok) {
            console.error('Email send failed:', await res.text());
          }
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
      }

      // إرجاع استجابة تطلب OTP
      return NextResponse.json({
        success: true,
        requireOTP: true,
        userId: user.id,
        email: user.email,
        message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'
      });
    }

    // لو OTP معطّل — دخول مباشر
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        school_id: user.school_id,
        owner_id: user.owner_id,
        package: user.package,
        status: user.status,
        must_change_password: user.must_change_password || false,
      },
    });

    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error FULL:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
