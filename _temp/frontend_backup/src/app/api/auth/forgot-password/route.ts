import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import crypto from 'crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST — طلب إعادة تعيين كلمة المرور
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim() || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // البحث عن المستخدم (نُرجع نفس الرسالة سواء وُجد أم لا — لمنع User Enumeration)
    const userResult = await pool.query(
      'SELECT id, name, email, status FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];

      if (user.status === 'active') {
        // توليد token عشوائي آمن
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ساعة واحدة

        // حفظ الـ token في قاعدة البيانات
        await pool.query(`
          CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token VARCHAR(64) NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL,
            used BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW()
          )
        `).catch(() => {}); // الجدول قد يكون موجوداً

        // حذف الـ tokens القديمة لهذا المستخدم
        await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [user.id]);

        // إدخال الـ token الجديد
        await pool.query(
          'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
          [user.id, resetToken, expiresAt]
        );

        // إرسال الإيميل عبر Resend إذا كان مفعّلاً
        const emailSettings = await pool.query(
          "SELECT key, value FROM platform_settings WHERE category = 'email'"
        ).catch(() => ({ rows: [] }));

        const emailConfig: Record<string, string> = {};
        for (const row of (emailSettings as any).rows) {
          emailConfig[row.key] = row.value;
        }

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://matin.ink'}/reset-password?token=${resetToken}`;

        if (emailConfig.email_api_key) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${emailConfig.email_api_key}`
            },
            body: JSON.stringify({
              from: `${emailConfig.email_from_name || 'متين'} <${emailConfig.email_from || 'noreply@matin.ink'}>`,
              to: [normalizedEmail],
              subject: 'إعادة تعيين كلمة المرور — منصة متين',
              html: `
                <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #f8f9fa; border-radius: 12px;">
                  <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #0D1B2A; margin: 0;">منصة متين</h1>
                    <p style="color: #666; margin-top: 8px;">إعادة تعيين كلمة المرور</p>
                  </div>
                  <div style="background: white; padding: 24px; border-radius: 8px;">
                    <p style="color: #333; font-size: 16px;">مرحباً ${user.name}،</p>
                    <p style="color: #555;">تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك.</p>
                    <div style="text-align: center; margin: 24px 0;">
                      <a href="${resetUrl}" style="background: #0D1B2A; color: #C9A227; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                        إعادة تعيين كلمة المرور
                      </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">الرابط صالح لمدة ساعة واحدة فقط.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">إذا لم تطلب إعادة التعيين، تجاهل هذا الإيميل — حسابك آمن.</p>
                  </div>
                </div>
              `
            })
          }).catch(() => {}); // لا نوقف العملية إذا فشل الإيميل
        }
      }
    }

    // نُرجع نفس الرسالة دائماً — لمنع User Enumeration Attack
    return NextResponse.json({
      success: true,
      message: 'إذا كان البريد الإلكتروني مسجلاً، ستصل رسالة إعادة التعيين خلال دقائق'
    });
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
