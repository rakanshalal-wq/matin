import { NextResponse } from 'next/server';
import { pool, generateToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { RegisterSchema, formatZodError } from '@/lib/schemas';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const parsed = RegisterSchema.safeParse({ ...body, package: body.package });
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }
    const { name, email, password, phone, bio, avatar, package: pkg, role: userRole, institution_type } = parsed.data;

    // تحقق من تكرار الإيميل
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, bio, avatar, role, package, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'owner', $7, 'pending', NOW())
       RETURNING id, name, email, role, school_id, owner_id, package, status`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        phone?.trim() || null,
        bio || 'مالك مدارس',
        avatar || '👤',
        pkg || 'basic'
      ]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        package: user.package,
        status: user.status,
      },
      message: 'تم التسجيل بنجاح. حسابك قيد المراجعة'
    });

    response.cookies.set('matin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    );
  }
}
