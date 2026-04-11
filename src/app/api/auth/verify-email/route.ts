import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// =====================================================
// API التحقق من البريد الإلكتروني - منصة متين
// مُصحَّح: 2026-02-27 - يقبل code و otp معاً
// =====================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

async function sendVerificationEmail(email: string, code: string) {
  if (RESEND_API_KEY && RESEND_API_KEY !== 'dev_mode_no_email') {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'متين <noreply@matin.ink>',
        to: email,
        subject: `رمز التحقق: ${code}`,
        html: `
          <div dir="rtl" style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:30px;background:#0C0E17;border-radius:16px;text-align:center">
            <h1 style="color:#C9A227;font-size:28px;margin:0 0 10px">متين</h1>
            <p style="color:#9CA3AF;font-size:14px;margin:0 0 24px">رمز التحقق من بريدك الإلكتروني</p>
            <div style="background:#1a1d2e;border:2px solid #C9A227;border-radius:12px;padding:20px;margin:0 0 24px">
              <span style="color:#C9A227;font-size:36px;font-weight:700;letter-spacing:12px">${code}</span>
            </div>
            <p style="color:#6B7280;font-size:12px;margin:0">الرمز صالح لمدة 10 دقائق</p>
          </div>
        `
      })
    });
  } else {
    // [DEV] log removed
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'send') {
      const { email: rawEmail } = body;
      if (!rawEmail) return NextResponse.json({ error: 'الإيميل مطلوب' }, { status: 400 });
      const email = rawEmail.trim().toLowerCase();
      const user = await pool.query(`SELECT id, email_verified FROM users WHERE email = $1`, [email]);
      if (user.rows.length === 0) return NextResponse.json({ error: 'الإيميل غير مسجل' }, { status: 404 });
      if (user.rows[0].email_verified) return NextResponse.json({ message: 'الإيميل مؤكد مسبقاً', verified: true });
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query(`UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE email = $3`, [code, expires, email]);
      await sendVerificationEmail(email, code);
      return NextResponse.json({ sent: true, message: 'تم إرسال رمز التحقق للإيميل' });
    }

    if (action === 'verify') {
      // يقبل code أو otp للتوافق مع صفحة التسجيل
      const { email, code, otp } = body;
      const verifyCode = code || otp;
      if (!email || !verifyCode) return NextResponse.json({ error: 'الإيميل والرمز مطلوبين' }, { status: 400 });
      const emailNorm = email.toLowerCase().trim();
      const user = await pool.query(`SELECT id, verification_code, code_expires_at, email_verified FROM users WHERE email = $1`, [emailNorm]);
      if (user.rows.length === 0) return NextResponse.json({ error: 'الإيميل غير مسجل' }, { status: 404 });
      const u = user.rows[0];
      if (u.email_verified) return NextResponse.json({ verified: true, message: 'الإيميل مؤكد مسبقاً' });
      let codeValid = false;
      // التحقق من users.verification_code
      if (u.verification_code && u.verification_code === verifyCode) {
        if (!u.code_expires_at || new Date(u.code_expires_at) >= new Date()) {
          codeValid = true;
        } else {
          return NextResponse.json({ error: 'الرمز منتهي — اطلب رمز جديد' }, { status: 400 });
        }
      }
      // البحث في email_otps إذا لم يُوجد في users
      if (!codeValid) {
        const otpResult = await pool.query('SELECT otp, expires_at FROM email_otps WHERE email = $1', [emailNorm]);
        if (otpResult.rows.length > 0 && otpResult.rows[0].otp === verifyCode) {
          if (new Date(otpResult.rows[0].expires_at) >= new Date()) {
            codeValid = true;
          } else {
            return NextResponse.json({ error: 'الرمز منتهي — اطلب رمز جديد' }, { status: 400 });
          }
        }
      }
      if (!codeValid) return NextResponse.json({ error: 'الرمز غير صحيح' }, { status: 400 });
      await pool.query(`UPDATE users SET email_verified = true, verification_code = NULL, code_expires_at = NULL WHERE id = $1`, [u.id]);
      await pool.query('DELETE FROM email_otps WHERE email = $1', [emailNorm]);
      // log removed
      return NextResponse.json({ verified: true, message: 'تم تأكيد الإيميل بنجاح ✓' });
    }

    if (action === 'resend') {
      const { email } = body;
      if (!email) return NextResponse.json({ error: 'الإيميل مطلوب' }, { status: 400 });
      const emailNorm = email.toLowerCase().trim();
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query(`UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE email = $3`, [code, expires, emailNorm]);
      await pool.query(`INSERT INTO email_otps (email, otp, expires_at, created_at) VALUES ($1,$2,$3,NOW()) ON CONFLICT (email) DO UPDATE SET otp=$2, expires_at=$3, created_at=NOW()`, [emailNorm, code, expires]);
      await sendVerificationEmail(email, code);
      return NextResponse.json({ sent: true, message: 'تم إرسال رمز جديد' });
    }

    return NextResponse.json({ error: 'action غير صحيح' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
