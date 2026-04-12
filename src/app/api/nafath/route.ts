import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { getIntegration } from '@/lib/integrations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, national_id, transaction_id, owner_id } = body;

    // جلب credentials نفاذ من الداشبورد
    const nafath = await getIntegration('nafath');
    if (!nafath?.api_key) return NextResponse.json({ error: 'نفاذ غير مفعّل، فعّله من مركز التكاملات' }, { status: 400 });

    const appId = nafath.api_key;
    const appSecret = nafath.api_secret;

    // ===== طلب تحقق =====
    if (action === 'request') {
      if (!national_id) return NextResponse.json({ error: 'رقم الهوية مطلوب' }, { status: 400 });
      const res = await fetch('https://nafath.api.elm.sa/api/v1/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'app-id': appId, 'app-key': appSecret || '' },
        body: JSON.stringify({ national_id, service: 'LOGIN', redirect_url: 'https://matin.ink/login' })
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // ===== التحقق من النتيجة =====
    if (action === 'verify') {
      if (!transaction_id || !national_id) return NextResponse.json({ error: 'البيانات مطلوبة' }, { status: 400 });
      const res = await fetch(`https://nafath.api.elm.sa/api/v1/request/${transaction_id}`, {
        headers: { 'app-id': appId, 'app-key': appSecret || '' }
      });
      const data = await res.json();

      if (data.status === 'COMPLETED') {
        // ابحث عن المستخدم بالهوية الوطنية
        const user = await pool.query('SELECT * FROM users WHERE national_id = $1 AND status = $2', [national_id, 'active']);
        if (user.rows.length === 0) return NextResponse.json({ error: 'المستخدم غير موجود أو غير مفعّل' }, { status: 404 });

        const u = user.rows[0];
        const { generateToken } = await import('@/lib/auth');
        const token = generateToken(u);

        const response = NextResponse.json({
          success: true, token,
          user: { id: u.id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, school_id: u.school_id, owner_id: u.owner_id }
        });
        response.cookies.set('matin_token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
        return response;
      }

      return NextResponse.json({ status: data.status });
    }

    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
  } catch (error) {
    console.error('Nafath error:', error);
    return NextResponse.json({ error: 'فشل الاتصال بنفاذ' }, { status: 500 });
  }
}
