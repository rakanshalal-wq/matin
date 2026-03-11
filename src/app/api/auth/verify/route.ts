import { NextResponse } from 'next/server';
import { pool, verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // من الهيدر
    const authHeader = request.headers.get('authorization');
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // أو من الكوكي
    if (!token) {
      const cookies = request.headers.get('cookie') || '';
      const match = cookies.match(/matin_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ valid: false, error: 'لا يوجد توكن' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ valid: false, error: 'توكن منتهي أو غير صالح' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, name, email, role, school_id, owner_id, package, status FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ valid: false, error: 'المستخدم غير موجود' }, { status: 401 });
    }

    const user = result.rows[0];
    if (user.status !== 'active') {
      return NextResponse.json({ valid: false, error: 'الحساب غير نشط' }, { status: 403 });
    }

    return NextResponse.json({ valid: true, user });
  } catch (error) {
    return NextResponse.json({ valid: false, error: 'خطأ بالتحقق' }, { status: 500 });
  }
}
