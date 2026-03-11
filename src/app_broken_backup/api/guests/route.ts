import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { sendOTP, sendSMS, sendEmail } from '@/lib/integrations';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, name, phone, email, nationality, purpose, code } = body;

    // ===== إرسال OTP للزائر =====
    if (action === 'send_otp') {
      if (!name) return NextResponse.json({ error: 'الاسم مطلوب' }, { status: 400 });
      if (!phone && !email) return NextResponse.json({ error: 'الجوال أو الإيميل مطلوب' }, { status: 400 });
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000);
      await pool.query('DELETE FROM email_otps WHERE email = $1', [email || phone]);
      await pool.query('INSERT INTO email_otps (email, code, expires_at) VALUES ($1, $2, $3)', [email || phone, otpCode, expires]);
      await sendOTP(phone || '', email || '', name, otpCode);
      return NextResponse.json({ success: true, message: 'تم إرسال رمز التحقق' });
    }

    // ===== التحقق من OTP وتسجيل الزائر =====
    if (action === 'verify_otp') {
      if (!code) return NextResponse.json({ error: 'الرمز مطلوب' }, { status: 400 });
      const key = email || phone;
      const otpRow = await pool.query(
        'SELECT * FROM email_otps WHERE email = $1 AND code = $2 AND used = false AND expires_at > NOW()',
        [key, code]
      );
      if (otpRow.rows.length === 0) return NextResponse.json({ error: 'الرمز غلط أو منتهي الصلاحية' }, { status: 401 });
      await pool.query('UPDATE email_otps SET used = true WHERE email = $1', [key]);
      const token = jwt.sign({ role: 'guest', name, phone, email }, JWT_SECRET, { expiresIn: '24h' });
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const result = await pool.query(
        `INSERT INTO guest_users (name, phone, email, nationality, purpose, token, expires_at, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW() RETURNING *`,
        [name, phone || null, email || null, nationality || null, purpose || null, token, expires]
      );
      const welcomeMsg = `مرحباً ${name}! 🎉 تم تسجيلك كزائر في منصة متين. يمكنك الآن تصفح الأنشطة والمتجر والتواصل مع المؤسسات.`;
      const welcomeHtml = `
        <div dir="rtl" style="font-family:Arial;padding:30px;background:#0D1B2A;color:white;border-radius:12px;max-width:500px;margin:0 auto">
          <h2 style="color:#C9A227">مرحباً ${name}! 👋</h2>
          <p>تم تسجيلك كزائر في منصة متين بنجاح.</p>
          <div style="background:#1B263B;border:1px solid rgba(201,162,39,0.3);border-radius:12px;padding:20px;margin:20px 0">
            <p style="color:#C9A227;font-weight:700;margin:0 0 12px">يمكنك الآن:</p>
            <p>✅ تصفح الأنشطة والفعاليات</p>
            <p>🛒 التسوق من المتجر</p>
            <p>💬 التواصل مع المؤسسات</p>
            <p>📅 التسجيل في الفعاليات العامة</p>
          </div>
          <p style="color:rgba(255,255,255,0.5);font-size:12px">صلاحية الدخول 24 ساعة - متين نظام إدارة التعليم</p>
        </div>`;
      if (phone) await sendSMS(phone, welcomeMsg);
      if (email) await sendEmail(email, 'مرحباً في متين! 🎉', welcomeHtml);
      const response = NextResponse.json({
        success: true, token,
        user: { id: result.rows[0].id, name, phone, email, role: 'guest', dashboardPath: '/guest' }
      });
      response.cookies.set('matin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24, path: '/' });
      return response;
    }

    // ===== جلب الزوار — يحتاج مصادقة =====
    if (action === 'list') {
      const currentUser = await getUserFromRequest(request);
      if (!currentUser) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
      if (!['super_admin', 'owner', 'admin'].includes(currentUser.role)) {
        return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
      }
      const result = await pool.query('SELECT id, name, phone, email, nationality, purpose, created_at FROM guest_users ORDER BY created_at DESC LIMIT 100');
      return NextResponse.json(result.rows);
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Guest error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    const result = await pool.query('SELECT id, name, phone, nationality, purpose, created_at FROM guest_users ORDER BY created_at DESC LIMIT 100');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}
