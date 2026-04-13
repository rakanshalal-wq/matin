import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// =====================================================
// API تسجيل مؤسسة جديدة - منصة متين
// مُصحَّح: 2026-04-13 — resilient INSERT for all institution types
// =====================================================

// Helper: run a query inside a SAVEPOINT; on ANY error roll back and return false.
async function tryQuery(client: any, savepointName: string, sql: string, params: any[]): Promise<{ rows: any[] } | null> {
  await client.query(`SAVEPOINT ${savepointName}`);
  try {
    const result = await client.query(sql, params);
    return result;
  } catch (err: any) {
    console.warn(`[Register] SAVEPOINT ${savepointName} failed (code=${err.code}): ${err.message}`);
    await client.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      institution_name,
      institution_type = 'school',
      contact_name,
      contact_phone,
      contact_email,
      plan = 'basic',
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

      // ── 1. INSERT school ─────────────────────────────────────
      // Strategy: try full INSERT first; on any failure fall back to the
      // absolute minimum columns (name only) and then PATCH additional
      // columns one by one so the row is always created.

      let newSchoolId: number | null = null;

      // Attempt 1: full INSERT with all desired columns
      const schoolFull = await tryQuery(client, 'sp_school_full',
        `INSERT INTO schools (name, type, code, email, phone, slug, is_active, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,true,NOW(),NOW()) RETURNING id`,
        [institution_name, normalizedType, schoolCode, contact_email, contact_phone, slug]
      );

      if (schoolFull) {
        newSchoolId = schoolFull.rows[0].id;
      } else {
        // Attempt 2: minimal INSERT — just name, which always exists
        const schoolMin = await tryQuery(client, 'sp_school_min',
          `INSERT INTO schools (name) VALUES ($1) RETURNING id`,
          [institution_name]
        );
        if (!schoolMin) throw new Error('فشل إنشاء سجل المؤسسة حتى بالحد الأدنى من البيانات');
        newSchoolId = schoolMin.rows[0].id;

        // Patch optional columns individually
        await tryQuery(client, 'sp_s_type',   `UPDATE schools SET type=$1        WHERE id=$2`, [normalizedType, newSchoolId]);
        await tryQuery(client, 'sp_s_code',   `UPDATE schools SET code=$1        WHERE id=$2`, [schoolCode, newSchoolId]);
        await tryQuery(client, 'sp_s_email',  `UPDATE schools SET email=$1       WHERE id=$2`, [contact_email, newSchoolId]);
        await tryQuery(client, 'sp_s_phone',  `UPDATE schools SET phone=$1       WHERE id=$2`, [contact_phone, newSchoolId]);
        await tryQuery(client, 'sp_s_slug',   `UPDATE schools SET slug=$1        WHERE id=$2`, [slug, newSchoolId]);
        await tryQuery(client, 'sp_s_active', `UPDATE schools SET is_active=true WHERE id=$2`, [newSchoolId]);
        await tryQuery(client, 'sp_s_ts',     `UPDATE schools SET created_at=NOW(), updated_at=NOW() WHERE id=$1`, [newSchoolId]);
      }

      // ── 2. INSERT user ────────────────────────────────────────
      // Same strategy: full INSERT first, then minimal + patch.

      let userId: number | null = null;

      const userFull = await tryQuery(client, 'sp_user_full',
        `INSERT INTO users (name, email, password, role, school_id, owner_id,
           institution_type, status, package, phone, created_at)
         VALUES ($1,$2,$3,'owner',$4,$4,$5,'active',$6,$7,NOW()) RETURNING id`,
        [contact_name, contact_email.toLowerCase().trim(), hashedPassword,
         newSchoolId, normalizedType, plan, contact_phone]
      );

      if (userFull) {
        userId = userFull.rows[0].id;
      } else {
        // Attempt 2: minimal INSERT — only the non-nullable core columns
        const userMin = await tryQuery(client, 'sp_user_min',
          `INSERT INTO users (name, email, password, role, status, created_at)
           VALUES ($1,$2,$3,'owner','active',NOW()) RETURNING id`,
          [contact_name, contact_email.toLowerCase().trim(), hashedPassword]
        );
        if (!userMin) throw new Error('فشل إنشاء حساب المستخدم حتى بالحد الأدنى من البيانات');
        userId = userMin.rows[0].id;

        // Patch optional columns individually
        await tryQuery(client, 'sp_u_school',    `UPDATE users SET school_id=$1     WHERE id=$2`, [newSchoolId, userId]);
        await tryQuery(client, 'sp_u_owner',     `UPDATE users SET owner_id=$1      WHERE id=$2`, [newSchoolId, userId]);
        await tryQuery(client, 'sp_u_itype',     `UPDATE users SET institution_type=$1 WHERE id=$2`, [normalizedType, userId]);
        await tryQuery(client, 'sp_u_package',   `UPDATE users SET package=$1       WHERE id=$2`, [plan, userId]);
        await tryQuery(client, 'sp_u_phone',     `UPDATE users SET phone=$1         WHERE id=$2`, [contact_phone, userId]);
      }

      // ── 3. Link owner_id on school ────────────────────────────
      await tryQuery(client, 'sp_school_owner',
        `UPDATE schools SET owner_id=$1 WHERE id=$2`, [userId, newSchoolId]);

      // ── 4. Optional tables (silently ignored if absent) ───────
      await tryQuery(client, 'sp_school_owners',
        `INSERT INTO school_owners (user_id, school_id) VALUES ($1,$2) ON CONFLICT (school_id) DO NOTHING`,
        [userId, newSchoolId]);

      await tryQuery(client, 'sp_subscription', (() => {
        // We can't easily reference planId here; just pass null for plan_id
        return `INSERT INTO subscriptions (school_id, owner_id, plan_id, status, billing_cycle, trial_ends_at, created_at)
                VALUES ($1,$2,NULL,'trial','monthly',NOW() + INTERVAL '30 days',NOW())`;
      })(), [newSchoolId, userId]);

      await tryQuery(client, 'sp_otp',
        `INSERT INTO email_otps (email, otp, expires_at, created_at) VALUES ($1,$2,$3,NOW())
         ON CONFLICT (email) DO UPDATE SET otp=$2, expires_at=$3, created_at=NOW()`,
        [contact_email.toLowerCase().trim(), otp, otpExpiry]);

      await client.query('COMMIT');

      // ── 5. Send welcome email (best-effort, outside transaction) ─
      try {
        const RESEND_KEY = process.env.RESEND_API_KEY;
        if (RESEND_KEY && RESEND_KEY !== 'dev_mode_no_email') {
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
          school_id: newSchoolId,
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
    // Use COALESCE/try approach: s.* will work regardless of column presence;
    // we select only guaranteed columns to avoid 42703 errors.
    const result = await pool.query(`
      SELECT s.id, s.name, s.code, s.email, s.phone,
             s.type as institution_type, s.slug, s.created_at,
             u.name as owner_name, u.email as owner_email,
             (SELECT COUNT(*) FROM students WHERE school_id = s.id) as students_count,
             (SELECT COUNT(*) FROM teachers WHERE school_id = s.id) as teachers_count
      FROM schools s
      LEFT JOIN users u ON u.school_id = s.id AND u.role = 'owner'
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('[Register GET]', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
