import { NextRequest, NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT id, name, email, password, role, school_id, owner_id, package, status, phone, bio, avatar
       FROM users WHERE email = $1 LIMIT 1`,
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // التحقق من حالة الحساب
    if (user.status === 'suspended' || user.status === 'banned') {
      return NextResponse.json({ message: 'هذا الحساب موقوف. تواصل مع الدعم الفني.' }, { status: 403 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    // تفعيل الحساب تلقائياً عند أول دخول ناجح
    if (user.status === 'pending') {
      await pool.query("UPDATE users SET status = 'active' WHERE id = $1", [user.id]);
      user.status = 'active';
    }

    // إنشاء التوكن
    const token = generateToken(user);

    // تحديد صفحة التوجيه حسب الدور
    const roleRedirects: Record<string, string> = {
      super_admin: '/dashboard/super-admin',
      owner: '/dashboard',
      admin: '/dashboard',
      teacher: '/dashboard/teacher',
      trainer: '/dashboard/trainer',
      trainee: '/dashboard/trainee',
      muhaffiz: '/dashboard/muhaffiz',
      supervisor: '/dashboard/supervisor',
      caregiver: '/dashboard/caregiver',
      student: '/dashboard/student',
      parent: '/dashboard/parent',
      school_owner: '/dashboard',
      training_manager: '/dashboard',
      institute_admin: '/dashboard',
      quran_admin: '/dashboard',
    };

    const redirect = roleRedirects[user.role] || '/dashboard';

    // بيانات المستخدم للـ localStorage (بدون كلمة المرور)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      school_id: user.school_id,
      owner_id: user.owner_id,
      package: user.package,
      status: user.status,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
    };

    const response = NextResponse.json({
      success: true,
      redirect,
      user: userData,
      token,
    });

    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // تسجيل الدخول في سجل النشاطات
    await pool.query(
      `INSERT INTO activity_logs (user_id, school_id, action, details, ip_address) VALUES ($1, $2, 'login', 'تسجيل دخول ناجح', $3)`,
      [user.id, user.school_id || null, request.headers.get('x-forwarded-for') || 'unknown']
    ).catch(() => {});

    return response;
  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return NextResponse.json({ message: 'حدث خطأ داخلي، حاول لاحقاً' }, { status: 500 });
  }
}
