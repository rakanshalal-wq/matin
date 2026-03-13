import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

async function sendWelcomeEmail(email: string, name: string, password: string, schoolName: string, schoolSlug: string, roleName: string) {
  try {
    const apiKeyResult = await pool.query("SELECT value FROM platform_settings WHERE key = 'email_api_key'");
    const apiKey = apiKeyResult.rows[0]?.value;
    if (!apiKey) { console.error('[Email] email_api_key not configured — password email not sent'); return; }
    const loginUrl = schoolSlug ? `https://matin.ink/school/${schoolSlug}` : 'https://matin.ink/login';
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: 'متين <noreply@matin.ink>',
      to: email,
      subject: `مرحباً بك في ${schoolName} - بيانات الدخول`,
      html: `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:0 auto;padding:20px"><div style="background:#0D1B2A;padding:20px;border-radius:12px 12px 0 0;text-align:center"><h1 style="color:#C9A227;margin:0">${schoolName}</h1><p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">مدعوم بمنصة متين</p></div><div style="background:white;padding:30px;border-radius:0 0 12px 12px;border:1px solid #eee"><h2>مرحباً ${name}</h2><p>تم تسجيلك كـ <strong>${roleName}</strong> في <strong style="color:#C9A227">${schoolName}</strong></p><div style="background:#FFF3CD;border:1px solid #FFEAA7;border-radius:8px;padding:12px;margin:16px 0"><p style="color:#856404;margin:0;font-size:14px">حسابك بانتظار موافقة إدارة المدرسة</p></div><div style="background:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0;text-align:center"><p style="color:#666;margin:0 0 8px">البريد الإلكتروني</p><p style="font-weight:bold;font-size:16px;margin:0 0 16px;color:#0D1B2A">${email}</p><p style="color:#666;margin:0 0 8px">كلمة المرور المؤقتة</p><div style="background:#0D1B2A;color:#C9A227;font-size:24px;font-weight:bold;padding:16px;border-radius:8px;letter-spacing:3px">${password}</div></div><a href="${loginUrl}" style="display:block;background:#C9A227;color:#0D1B2A;text-align:center;padding:15px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px">الذهاب لصفحة المدرسة</a></div></div>`,
    });
  } catch (err) { console.error('[Join Email Error]:', err); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { school_code, name, email, phone, role, student_id, employee_id, national_id, grade } = body;
    if (!school_code || !name || !email) {
      return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبين' }, { status: 400 });
    }
    const validRoles = ['teacher', 'student', 'parent'];
    const finalRole = validRoles.includes(role) ? role : 'student';
    let schoolResult = await pool.query('SELECT id, name, slug, owner_id, status FROM schools WHERE code = $1', [school_code]);
    if (schoolResult.rows.length === 0) {
      schoolResult = await pool.query('SELECT id, name, slug, owner_id, status FROM schools WHERE slug = $1', [school_code]);
    }
    if (schoolResult.rows.length === 0) {
      schoolResult = await pool.query('SELECT id, name, slug, owner_id, status FROM schools WHERE slug LIKE $1', ['%' + school_code + '%']);
    }
    if (schoolResult.rows.length === 0) {
      return NextResponse.json({ error: 'كود المدرسة غير صحيح' }, { status: 404 });
    }
    const school = schoolResult.rows[0];
    if (school.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'هذه المدرسة موقوفة حالياً' }, { status: 403 });
    }
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل مسبقاً' }, { status: 409 });
    }
    const autoPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(autoPassword, 10);
    const userResult = await pool.query(
      `INSERT INTO users (name, email, password, phone, role, school_id, owner_id, national_id, status, must_change_password, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',true,$9,NOW()) RETURNING id, name, email, role, school_id, status`,
      [name, email.toLowerCase().trim(), hashedPassword, phone || null, finalRole, school.id, school.owner_id, national_id || null, grade || null]
    );
    const newUser = userResult.rows[0];
    if (finalRole === 'teacher') {
      const cnt = await pool.query('SELECT COUNT(*) FROM teachers WHERE school_id = $1', [school.id]);
      const empId = employee_id || ('TCH-' + String(parseInt(cnt.rows[0].count) + 1).padStart(4, '0'));
      await pool.query(
        `INSERT INTO teachers (id, employee_id, user_id, school_id, owner_id, hire_date, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,NOW(),NOW(),NOW())`,
        [crypto.randomUUID(), empId, newUser.id.toString(), school.id, school.owner_id]
      );
    }
    if (finalRole === 'student') {
      const cnt = await pool.query('SELECT COUNT(*) FROM students WHERE school_id = $1', [school.id]);
      const stdId = student_id || ('STD-' + String(parseInt(cnt.rows[0].count) + 1).padStart(4, '0'));
      await pool.query(
        `INSERT INTO students (id, student_id, user_id, school_id, owner_id, enrollment_date, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,NOW(),NOW(),NOW())`,
        [crypto.randomUUID(), stdId, newUser.id.toString(), school.id, school.owner_id]
      );
    }
    const roleLabel = finalRole === 'teacher' ? 'معلم' : finalRole === 'student' ? 'طالب' : 'ولي أمر';
    if (email && email.includes('@') && !email.endsWith('@matin.ink')) {
      sendWelcomeEmail(email.toLowerCase().trim(), name, autoPassword, school.name, school.slug || '', roleLabel);
    }
    return NextResponse.json({
      success: true,
      message: 'تم تسجيلك بنجاح كـ' + roleLabel + ' في ' + school.name + '. بانتظار موافقة إدارة المدرسة. تم إرسال بيانات الدخول لبريدك الإلكتروني.',
      data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, school_name: school.name, status: 'pending' }
    }, { status: 201 });
  } catch (error: any) {
    console.error('[School-Join] Error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'هذا البريد مسجل مسبقاً' }, { status: 409 });
    }
    return NextResponse.json({ error: 'حدث خطأ. حاول مرة أخرى.' }, { status: 500 });
  }
}
