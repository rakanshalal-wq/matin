import { NextResponse } from 'next/server';
import { getUserFromRequest, getFilterSQL, encryptField, decryptField, pool } from '@/lib/auth';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// ===== تشفير محتوى الاختبار الكامل =====
function encryptExamContent(content: string, examKey: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.createHash('sha256').update(examKey).digest();
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `EXAM:${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch { return content; }
}

function decryptExamContent(encrypted: string, examKey: string): string {
  if (!encrypted || !encrypted.startsWith('EXAM:')) return encrypted;
  try {
    const [, ivHex, authTagHex, encryptedData] = encrypted.split(':');
    const key = crypto.createHash('sha256').update(examKey).digest();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch { return ''; }
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  
  const body = await request.json();
  const { action } = body;

  // ===== تشفير اختبار =====
  if (action === 'encrypt_exam') {
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية تشفير الاختبارات' }, { status: 403 });
    }
    
    const { exam_id, exam_key } = body;
    if (!exam_id || !exam_key) {
      return NextResponse.json({ error: 'معرف الاختبار ومفتاح التشفير مطلوبان' }, { status: 400 });
    }

    // التحقق من ملكية الاختبار
    const filter = getFilterSQL(user, 2);
    const examResult = await pool.query(
      `SELECT * FROM exams WHERE id = $1 ${filter.sql}`,
      [exam_id, ...filter.params]
    );
    
    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود أو لا تملك صلاحية الوصول' }, { status: 404 });
    }

    // تشفير أسئلة الاختبار
    const questionsResult = await pool.query(
      `SELECT q.* FROM questions q
       JOIN exam_questions eq ON eq.question_id = q.id
       WHERE eq.exam_id = $1`,
      [exam_id]
    );

    const keyHash = crypto.createHash('sha256').update(exam_key).digest('hex');
    
    for (const q of questionsResult.rows) {
      if (!q.is_encrypted) {
        const encContent = encryptExamContent(q.content || '', exam_key);
        const encAnswer = encryptExamContent(JSON.stringify(q.correct_answer || ''), exam_key);
        await pool.query(
          `UPDATE questions SET content_encrypted = $1, answer_encrypted = $2, is_encrypted = true WHERE id = $3`,
          [encContent, encAnswer, q.id]
        );
      }
    }

    // تحديث الاختبار
    await pool.query(
      `UPDATE exams SET is_encrypted = true, encryption_key_hash = $1 WHERE id = $2`,
      [keyHash, exam_id]
    );

    return NextResponse.json({ 
      success: true, 
      message: `تم تشفير ${questionsResult.rows.length} سؤال بنجاح`,
      encrypted_count: questionsResult.rows.length
    });
  }

  // ===== فك تشفير اختبار (للطالب أثناء الامتحان فقط) =====
  if (action === 'decrypt_exam_for_student') {
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'هذا الإجراء للطلاب فقط' }, { status: 403 });
    }
    
    const { exam_id, exam_key } = body;
    
    // التحقق من أن الطالب مسجل في هذا الاختبار
    const examResult = await pool.query(
      `SELECT * FROM exams WHERE id = $1 AND school_id = $2 AND status = 'ACTIVE'`,
      [exam_id, user.school_id]
    );
    
    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير متاح' }, { status: 404 });
    }

    const exam = examResult.rows[0];
    const keyHash = crypto.createHash('sha256').update(exam_key).digest('hex');
    
    if (exam.encryption_key_hash && exam.encryption_key_hash !== keyHash) {
      return NextResponse.json({ error: 'مفتاح الاختبار غير صحيح' }, { status: 401 });
    }

    // جلب الأسئلة وفك تشفيرها
    const questionsResult = await pool.query(
      `SELECT q.id, q.content, q.content_encrypted, q.type, q.options, q.marks, q.is_encrypted
       FROM questions q
       JOIN exam_questions eq ON eq.question_id = q.id
       WHERE eq.exam_id = $1
       ORDER BY eq.order`,
      [exam_id]
    );

    const decryptedQuestions = questionsResult.rows.map(q => ({
      id: q.id,
      content: q.is_encrypted ? decryptExamContent(q.content_encrypted, exam_key) : q.content,
      type: q.type,
      options: q.options,
      marks: q.marks,
    }));

    return NextResponse.json({ 
      success: true, 
      questions: decryptedQuestions,
      exam: { id: exam.id, title: exam.title_ar, duration: exam.duration, total_marks: exam.total_marks }
    });
  }

  // ===== إعداد مفاتيح الطوارئ =====
  if (action === 'setup_emergency_keys') {
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية إعداد مفاتيح الطوارئ' }, { status: 403 });
    }

    const { school_id, key1, key2, key1_holder, key2_holder, purpose } = body;
    
    if (!key1 || !key2 || !key1_holder || !key2_holder || !purpose) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    const key1Hash = crypto.createHash('sha256').update(key1).digest('hex');
    const key2Hash = crypto.createHash('sha256').update(key2).digest('hex');

    // إلغاء تفعيل المفاتيح القديمة
    await pool.query(
      `UPDATE emergency_keys SET is_active = false WHERE school_id = $1 AND purpose = $2`,
      [school_id, purpose]
    );

    const result = await pool.query(
      `INSERT INTO emergency_keys (school_id, owner_id, key1_hash, key2_hash, key1_holder, key2_holder, purpose)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [school_id, user.id, key1Hash, key2Hash, key1_holder, key2_holder, purpose]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'تم إعداد مفاتيح الطوارئ بنجاح',
      key_id: result.rows[0].id
    });
  }

  // ===== استخدام مفاتيح الطوارئ (يتطلب المفتاحين معاً) =====
  if (action === 'use_emergency_keys') {
    const { school_id, key1, key2, purpose, reason } = body;
    
    const key1Hash = crypto.createHash('sha256').update(key1).digest('hex');
    const key2Hash = crypto.createHash('sha256').update(key2).digest('hex');

    const keyResult = await pool.query(
      `SELECT * FROM emergency_keys 
       WHERE school_id = $1 AND purpose = $2 AND is_active = true
       AND key1_hash = $3 AND key2_hash = $4`,
      [school_id, purpose, key1Hash, key2Hash]
    );

    if (keyResult.rows.length === 0) {
      // تسجيل محاولة فاشلة
      await pool.query(
        `INSERT INTO emergency_key_logs (emergency_key_id, used_by, action, reason, ip_address)
         VALUES (NULL, $1, 'FAILED_ATTEMPT', $2, $3)`,
        [user.id, reason, request.headers.get('x-forwarded-for') || 'unknown']
      );
      return NextResponse.json({ error: 'مفاتيح الطوارئ غير صحيحة' }, { status: 401 });
    }

    const emergencyKey = keyResult.rows[0];
    
    // تسجيل الاستخدام الناجح
    await pool.query(
      `INSERT INTO emergency_key_logs (emergency_key_id, used_by, action, reason, ip_address)
       VALUES ($1, $2, 'SUCCESS', $3, $4)`,
      [emergencyKey.id, user.id, reason, request.headers.get('x-forwarded-for') || 'unknown']
    );

    await pool.query(
      `UPDATE emergency_keys SET last_used = NOW() WHERE id = $1`,
      [emergencyKey.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'تم التحقق من مفاتيح الطوارئ بنجاح',
      authorized: true,
      purpose: emergencyKey.purpose
    });
  }

  // ===== سجل طباعة الاختبار =====
  if (action === 'log_exam_print') {
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية طباعة الاختبارات' }, { status: 403 });
    }

    const { exam_id, copies_count } = body;
    
    // التحقق من الحد الأقصى للطباعة
    const examResult = await pool.query(
      `SELECT is_encrypted, print_allowed, max_print_copies, print_watermark FROM exams WHERE id = $1`,
      [exam_id]
    );
    
    if (examResult.rows.length === 0) {
      return NextResponse.json({ error: 'الاختبار غير موجود' }, { status: 404 });
    }

    const exam = examResult.rows[0];
    
    if (!exam.print_allowed) {
      return NextResponse.json({ error: 'الطباعة غير مسموحة لهذا الاختبار' }, { status: 403 });
    }

    // حساب عدد النسخ المطبوعة
    const printCountResult = await pool.query(
      `SELECT COALESCE(SUM(copies_count), 0) as total FROM exam_print_logs WHERE exam_id = $1`,
      [exam_id]
    );
    
    const totalPrinted = parseInt(printCountResult.rows[0].total);
    
    if (exam.max_print_copies > 0 && totalPrinted + copies_count > exam.max_print_copies) {
      return NextResponse.json({ 
        error: `تجاوزت الحد الأقصى للطباعة (${exam.max_print_copies} نسخة)` 
      }, { status: 403 });
    }

    const watermark = `${user.name} - ${new Date().toLocaleString('ar-SA')} - ${exam_id.slice(-6)}`;
    
    await pool.query(
      `INSERT INTO exam_print_logs (exam_id, printed_by, school_id, copies_count, watermark, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [exam_id, user.id, user.school_id, copies_count, watermark, request.headers.get('x-forwarded-for') || 'unknown']
    );

    return NextResponse.json({ 
      success: true, 
      watermark,
      total_printed: totalPrinted + copies_count,
      remaining: exam.max_print_copies > 0 ? exam.max_print_copies - totalPrinted - copies_count : -1
    });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'print_logs') {
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية عرض سجلات الطباعة' }, { status: 403 });
    }
    
    const filter = getFilterSQL(user, 2);
    const logs = await pool.query(
      `SELECT epl.*, u.name as printed_by_name, e.title_ar as exam_title
       FROM exam_print_logs epl
       JOIN users u ON u.id = epl.printed_by
       JOIN exams e ON e.id = epl.exam_id
       WHERE 1=1 ${filter.sql.replace('school_id', 'epl.school_id')}
       ORDER BY epl.printed_at DESC LIMIT 100`,
      filter.params
    );
    
    return NextResponse.json({ logs: logs.rows });
  }

  if (action === 'emergency_logs') {
    if (!['super_admin', 'owner'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية عرض سجلات الطوارئ' }, { status: 403 });
    }
    
    const logs = await pool.query(
      `SELECT ekl.*, u.name as used_by_name, ek.purpose
       FROM emergency_key_logs ekl
       LEFT JOIN users u ON u.id = ekl.used_by
       LEFT JOIN emergency_keys ek ON ek.id = ekl.emergency_key_id
       ORDER BY ekl.used_at DESC LIMIT 100`
    );
    
    return NextResponse.json({ logs: logs.rows });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}
