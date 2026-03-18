import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';
import { getPaginationParams, buildPaginatedResponse } from '@/lib/pagination';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

function generatePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let pass = '';
  for (let i = 0; i < 10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

async function sendPasswordEmail(email: string, name: string, password: string, schoolName: string, schoolSlug: string) {
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
      html: `<div dir="rtl" style="font-family:Arial;max-width:500px;margin:0 auto;padding:20px">
        <div style="background:#0D1B2A;padding:20px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#C9A227;margin:0">${schoolName}</h1>
          <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">مدعوم بمنصة متين</p>
        </div>
        <div style="background:white;padding:30px;border-radius:0 0 12px 12px;border:1px solid #eee">
          <h2>مرحباً ${name} 👋</h2>
          <p>تم إنشاء حسابك في <strong style="color:#C9A227">${schoolName}</strong></p>
          <div style="background:#f8f9fa;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
            <p style="color:#666;margin:0 0 8px">البريد الإلكتروني</p>
            <p style="font-weight:bold;font-size:16px;margin:0 0 16px;color:#0D1B2A">${email}</p>
            <p style="color:#666;margin:0 0 8px">كلمة المرور المؤقتة</p>
            <div style="background:#0D1B2A;color:#C9A227;font-size:24px;font-weight:bold;padding:16px;border-radius:8px;letter-spacing:3px">${password}</div>
          </div>
          <div style="background:#FFF3CD;border:1px solid #FFEAA7;border-radius:8px;padding:12px;margin:16px 0">
            <p style="color:#856404;margin:0;font-size:14px">⚠️ سيُطلب منك تغيير كلمة المرور عند أول تسجيل دخول</p>
          </div>
          <a href="${loginUrl}" style="display:block;background:#C9A227;color:#0D1B2A;text-align:center;padding:15px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:20px">الذهاب لصفحة المدرسة</a>
        </div>
      </div>`,
    });
  } catch (err) { console.error('[Student Email Error]:', err); }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json([]);
    let query = '';
    let params: any[] = [];
    if (user.role === 'super_admin') {
      query = `SELECT s.*, u.name, u.email, u.phone, u.national_id, sc.name as school_name
        FROM students s LEFT JOIN users u ON u.id::text = s.user_id
        LEFT JOIN schools sc ON sc.id = s.school_id WHERE 1=1`;
    } else if (user.role === 'owner') {
      query = `SELECT s.*, u.name, u.email, u.phone, u.national_id, sc.name as school_name
        FROM students s LEFT JOIN users u ON u.id::text = s.user_id
        LEFT JOIN schools sc ON sc.id = s.school_id
        WHERE s.school_id IN (SELECT id FROM schools WHERE owner_id = $1)`;
      params = [String(user.id)];
    } else {
      query = `SELECT s.*, u.name, u.email, u.phone, u.national_id, sc.name as school_name
        FROM students s LEFT JOIN users u ON u.id::text = s.user_id
        LEFT JOIN schools sc ON sc.id = s.school_id WHERE s.school_id = $1`;
      params = [String(user.school_id)];
    }
    const { searchParams } = new URL(request.url);
    const classFilter = searchParams.get('class_id');
    if (classFilter) { query += ' AND s.class_id = $' + String(params.length + 1); params.push(classFilter); }
    // إذا طُلب all=true نُرجع كل البيانات (للتصدير مثلاً)
    if (searchParams.get('all') === 'true') {
      query += ' ORDER BY s.created_at DESC LIMIT 5000';
      return NextResponse.json((await pool.query(query, params)).rows);
    }
    // Pagination افتراضي
    const { page, limit, offset } = getPaginationParams(searchParams);
    const baseQuery = query;
    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS sub`;
    const dataQuery = `${baseQuery} ORDER BY s.created_at DESC LIMIT $1 OFFSET $2`;
    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params),
      pool.query(dataQuery, [...params, limit, offset])
    ]);
    const total = parseInt(countResult.rows[0]?.count || '0', 10);
    return NextResponse.json(buildPaginatedResponse(dataResult.rows, total, page, limit));
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();

    // ✅ التحقق من صحة البيانات بـ Zod
    const { z } = await import('zod');
    const StudentPostSchema = z.object({
      name: z.string({ required_error: 'اسم الطالب مطلوب' }).min(2, 'الاسم يجب أن يكون حرفين على الأقل').max(100).trim(),
      email: z.string().email('صيغة البريد غير صحيحة').max(255).optional().nullable().or(z.literal('')),
      phone: z.string().max(20).optional().nullable(),
      national_id: z.string().max(20).optional().nullable(),
      gender: z.enum(['male', 'female', 'other']).optional().nullable(),
      date_of_birth: z.string().optional().nullable(),
      class_id: z.union([z.number().int().positive(), z.string()]).optional().nullable(),
    });
    const parsed = StudentPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map(e => e.message).join(' | ') },
        { status: 400 }
      );
    }
    const { name, email, phone, national_id, gender, date_of_birth, class_id } = parsed.data;

    let schoolId = '';
    let schoolName = '';
    let schoolSlug = '';
    if (user.role === 'owner') {
      const s = await pool.query('SELECT id, name, slug FROM schools WHERE owner_id = $1 LIMIT 1', [String(user.id)]);
      if (s.rows.length > 0) { schoolId = s.rows[0].id; schoolName = s.rows[0].name; schoolSlug = s.rows[0].slug || ''; }
    } else if (user.school_id) {
      schoolId = String(user.school_id);
      const s = await pool.query('SELECT name, slug FROM schools WHERE id = $1', [schoolId]);
      schoolName = s.rows[0]?.name || ''; schoolSlug = s.rows[0]?.slug || '';
    }

    const cnt = await pool.query('SELECT COUNT(*) FROM students WHERE school_id = $1', [schoolId]);
    const studentId = 'STD-' + String(parseInt(cnt.rows[0].count) + 1).padStart(4, '0');
    const recId = crypto.randomUUID();
    let userId: string = recId;

    const autoPassword = generatePassword();
    const em = email || ('s' + Date.now() + '@matin.ink');
    const h = await bcrypt.hash(autoPassword, 10);

    const ex = await pool.query('SELECT id FROM users WHERE email=$1', [em.toLowerCase().trim()]);
    if (ex.rows.length > 0) {
      userId = String(ex.rows[0].id);
    } else {
      const r = await pool.query(
        `INSERT INTO users (name,email,password,phone,national_id,role,school_id,owner_id,status,must_change_password,created_at)
         VALUES ($1,$2,$3,$4,$5,'student',$6,$7,'active',true,NOW()) RETURNING id`,
        [name, em.toLowerCase().trim(), h, phone||null, national_id||null, schoolId, String(user.id)]
      );
      userId = String(r.rows[0].id);
    }

    const result = await pool.query(
      `INSERT INTO students (id,student_id,gender,date_of_birth,class_id,user_id,school_id,owner_id,enrollment_date,created_at,updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW(),NOW()) RETURNING *`,
      [recId, studentId, gender||'MALE', date_of_birth||null, class_id||null, userId, schoolId, String(user.id)]
    );

    if (email && email.includes('@') && !email.endsWith('@matin.ink')) {
      sendPasswordEmail(em.toLowerCase().trim(), name, autoPassword, schoolName, schoolSlug);
    }

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'فشل: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const body = await request.json();
    const { id, name, email, phone, national_id, gender, date_of_birth, student_id, class_id } = body;
    if (!id) return NextResponse.json({ error: 'معرف الطالب مطلوب' }, { status: 400 });

    await pool.query(
      `UPDATE students SET student_id=COALESCE($1,student_id), gender=$2, date_of_birth=$3, class_id=$4, updated_at=NOW() WHERE id=$5`,
      [student_id||null, gender||null, date_of_birth||null, class_id||null, id]
    );

    const student = await pool.query('SELECT user_id FROM students WHERE id=$1', [id]);
    if (student.rows.length > 0) {
      await pool.query(
        `UPDATE users SET name=COALESCE($1,name), phone=COALESCE($2,phone), national_id=COALESCE($3,national_id) WHERE id::text=$4`,
        [name||null, phone||null, national_id||null, student.rows[0].user_id]
      );
    }

    return NextResponse.json({ message: 'تم التحديث بنجاح' });
  } catch (error: any) {
    console.error('Students PUT Error:', error);
    return NextResponse.json({ error: 'فشل: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'مطلوب' }, { status: 400 });
    await pool.query('DELETE FROM students WHERE id=$1', [id]);
    return NextResponse.json({ message: 'تم' });
  } catch (e) { return NextResponse.json({ error: 'فشل' }, { status: 500 }); }
}
