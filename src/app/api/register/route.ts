import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// =====================================================
// API تسجيل مؤسسة جديدة - منصة متين
// مُصحَّح: 2026-02-27
// =====================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      institution_name,
      institution_type = 'school',
      contact_name,
      contact_phone,
      contact_email,
      students_count,
      plan = 'professional',
      password,
    } = body;

    if (!institution_name || !contact_name || !contact_phone || !contact_email || !password) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة: اسم المؤسسة، اسم المسؤول، الجوال، الإيميل، كلمة المرور' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
      return NextResponse.json({ error: 'صيغة البريد الإلكتروني غير صحيحة' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [contact_email.toLowerCase().trim()]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل مسبقاً' }, { status: 409 });
    }

    // quran_center is an alias for mosque — treat both as the same institution type
    const normalizedType = institution_type === 'quran_center' ? 'mosque' : institution_type;
    const typePrefix: Record<string, string> = {
      school: 'SCH', university: 'UNI', institute: 'INS',
      kindergarten: 'KND', training_center: 'TRN',
      mosque: 'MSQ',
    };
    const prefix = typePrefix[normalizedType] || 'SCH';
    const schoolCode = `${prefix}-${Date.now().toString(36).toUpperCase()}`;

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const slug = institution_name
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FF\w-]/g, '')
      + '-' + Date.now().toString(36);

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert school — try with the full type value; if the type column has a CHECK
      // constraint that doesn't include this institution type yet, fall back to 'school'.
      await client.query('SAVEPOINT before_school_insert');
      let schoolResult;
      try {
        schoolResult = await client.query(
          `INSERT INTO schools (
            name, type, code, email, phone,
            slug, is_active, created_at, updated_at
          ) VALUES ($1,$2,$3,$4,$5,$6,true,NOW(),NOW())
          RETURNING id`,
          [institution_name, normalizedType, schoolCode,
           contact_email, contact_phone, slug]
        );
      } catch (schoolInsertErr: any) {
        if (schoolInsertErr.code === '23514' || schoolInsertErr.code === '22P02') {
          await client.query('ROLLBACK TO SAVEPOINT before_school_insert');
          schoolResult = await client.query(
            `INSERT INTO schools (
              name, type, code, email, phone,
              slug, is_active, created_at, updated_at
            ) VALUES ($1,$2,$3,$4,$5,$6,true,NOW(),NOW())
            RETURNING id`,
            [institution_name, 'school', schoolCode,
             contact_email, contact_phone, slug]
          );
          // Try to set the real type separately
          try {
            await client.query('SAVEPOINT before_school_type');
            await client.query('UPDATE schools SET type = $1 WHERE id = $2', [normalizedType, schoolResult.rows[0].id]);
          } catch {
            await client.query('ROLLBACK TO SAVEPOINT before_school_type');
          }
        } else {
          throw schoolInsertErr;
        }
      }
      const newSchoolId = schoolResult.rows[0].id;

      // Insert user — try with institution_type first; fall back without it if the column
      // has a CHECK constraint that hasn't been updated in production yet.
      await client.query('SAVEPOINT before_user_insert');
      let userResult;
      try {
        userResult = await client.query(
          `INSERT INTO users (
            name, email, password, role, school_id, owner_id,
            institution_type, status, package, phone, created_at
          ) VALUES ($1,$2,$3,'owner',$4,$4,$5,'active',$6,$7,NOW())
          RETURNING id`,
          [
            contact_name,
            contact_email.toLowerCase().trim(),
            hashedPassword,
            newSchoolId,
            normalizedType,
            plan,
            contact_phone,
          ]
        );
      } catch (userInsertErr: any) {
        // CHECK constraint violation or invalid enum value — retry without institution_type
        if (userInsertErr.code === '23514' || userInsertErr.code === '22P02') {
          await client.query('ROLLBACK TO SAVEPOINT before_user_insert');
          userResult = await client.query(
            `INSERT INTO users (
              name, email, password, role, school_id, owner_id,
              status, package, phone, created_at
            ) VALUES ($1,$2,$3,'owner',$4,$4,'active',$5,$6,NOW())
            RETURNING id`,
            [
              contact_name,
              contact_email.toLowerCase().trim(),
              hashedPassword,
              newSchoolId,
              plan,
              contact_phone,
            ]
          );
          // Try to set institution_type separately (best-effort)
          try {
            await client.query('SAVEPOINT before_type_update');
            await client.query('UPDATE users SET institution_type = $1 WHERE id = $2', [normalizedType, userResult.rows[0].id]);
          } catch {
            await client.query('ROLLBACK TO SAVEPOINT before_type_update');
          }
        } else {
          throw userInsertErr;
        }
      }
      const userId = userResult.rows[0].id;

      // Update owner_id on school if that column exists (added by migration).
      try {
        await client.query(
          'UPDATE schools SET owner_id = $1 WHERE id = $2',
          [userId, newSchoolId]
        );
      } catch { /* owner_id column may not exist yet */ }

      // Optional tables — insert if they exist, ignore errors if they don't
      try {
        await client.query(
          `INSERT INTO school_owners (user_id, school_id) VALUES ($1, $2) ON CONFLICT (school_id) DO NOTHING`,
          [userId, newSchoolId]
        );
      } catch { /* table may not exist yet */ }

      try {
        const planResult = await client.query('SELECT id FROM plans WHERE name = $1', [plan]);
        const planId = planResult.rows[0]?.id || null;
        await client.query(
          `INSERT INTO subscriptions (school_id, owner_id, plan_id, status, billing_cycle, trial_ends_at, created_at)
           VALUES ($1,$2,$3,'trial','monthly',NOW() + INTERVAL '30 days',NOW())`,
          [newSchoolId, userId, planId]
        );
      } catch { /* table may not exist yet */ }

      try {
        await client.query(
          `INSERT INTO email_otps (email, otp, expires_at, created_at) VALUES ($1,$2,$3,NOW())
           ON CONFLICT (email) DO UPDATE SET otp=$2, expires_at=$3, created_at=NOW()`,
          [contact_email.toLowerCase().trim(), otp, otpExpiry]
        );
      } catch { /* table may not exist yet */ }

      await client.query('COMMIT');

      // Use newSchoolId for the response
      const schoolId = newSchoolId;

      // إرسال إيميل التحقق
      try {
        const RESEND_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_KEY || RESEND_KEY === 'dev_mode_no_email') {
          // [DEV] log removed
        } else {
          const { Resend } = await import('resend');
          const resend = new Resend(RESEND_KEY);
          await resend.emails.send({
            from: 'متين <noreply@matin.ink>',
            to: contact_email,
            subject: `مرحباً بك في متين - رمز التأكيد: ${otp}`,
            html: `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:0 auto;padding:20px">
              <div style="background:#0D1B2A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
                <h1 style="color:#C9A227;margin:0">منصة متين</h1>
              </div>
              <div style="background:white;padding:30px;border-radius:0 0 12px 12px;border:1px solid #eee">
                <h2>مرحباً ${contact_name}</h2>
                <p>تم تسجيل مؤسستك <strong style="color:#C9A227">${institution_name}</strong> بنجاح.</p>
                <div style="background:#0D1B2A;color:#C9A227;font-size:42px;font-weight:bold;text-align:center;padding:28px;border-radius:12px;letter-spacing:14px;margin:20px 0">${otp}</div>
                <p style="color:#666;font-size:13px;text-align:center">صالح لمدة 10 دقائق</p>
                <p><strong>كود المؤسسة:</strong> ${schoolCode}</p>
                <a href="https://matin.ink/login" style="display:block;background:#C9A227;color:#0D1B2A;text-align:center;padding:15px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px">تسجيل الدخول الآن</a>
              </div>
            </div>`,
          });
        }
      } catch (emailErr) {
        console.error('[Register] Email error:', emailErr);
      }

      return NextResponse.json({
        success: true,
        message: 'تم تسجيل المؤسسة بنجاح. تحقق من بريدك الإلكتروني لتأكيد الحساب.',
        data: {
          school_id: schoolId,
          school_code: schoolCode,
          institution_type: normalizedType,
          trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          requires_verification: true,
          ...(process.env.NODE_ENV === 'development' ? { dev_otp: otp } : {}),
        },
      }, { status: 201 });

    } catch (txError: any) {
      await client.query('ROLLBACK');
      throw txError;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error('[Register] Error:', error?.message, 'code:', error?.code, 'detail:', error?.detail);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني أو الكود مسجل مسبقاً' }, { status: 409 });
    }
    if (error.code === '23514') {
      // CHECK constraint violation — likely institution_type not in allowed values
      console.error('[Register] CHECK constraint violated — ensure migration script has been run');
      return NextResponse.json({ error: 'نوع المؤسسة غير مدعوم في قاعدة البيانات. يرجى تشغيل سكريبت الترحيل.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'فشل التسجيل. حاول مرة أخرى.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { getUserFromRequest } = await import('@/lib/auth');
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    const result = await pool.query(`
      SELECT s.id, s.name, s.code, s.email, s.phone,
             s.type as institution_type, s.is_active, s.slug, s.created_at,
             u.name as owner_name, u.email as owner_email,
             (SELECT COUNT(*) FROM students WHERE school_id = s.id) as students_count,
             (SELECT COUNT(*) FROM teachers WHERE school_id = s.id) as teachers_count
      FROM schools s
      LEFT JOIN users u ON u.school_id = s.id AND u.role = 'owner'
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
