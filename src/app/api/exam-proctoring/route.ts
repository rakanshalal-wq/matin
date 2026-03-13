import { NextResponse } from 'next/server';
import { getUserFromRequest, getFilterSQL, pool } from '@/lib/auth';

// ===== الطبقات الأربع لمراقبة الاختبارات =====
// الطبقة 1: مراقبة الوجه (كاميرا) - كشف غياب الوجه أو تعدد الوجوه
// الطبقة 2: مراقبة الشاشة - كشف التبديل بين التطبيقات أو فتح نوافذ أخرى
// الطبقة 3: مراقبة السلوك - كشف النسخ/اللصق والاختصارات المشبوهة
// الطبقة 4: مراقبة الشبكة - كشف الاتصالات المشبوهة أثناء الاختبار

const VIOLATION_TYPES = {
  // الطبقة 1 - الكاميرا
  FACE_NOT_DETECTED: { layer: 1, severity: 'high', description: 'لم يتم اكتشاف وجه الطالب' },
  MULTIPLE_FACES: { layer: 1, severity: 'critical', description: 'تم اكتشاف أكثر من وجه' },
  LOOKING_AWAY: { layer: 1, severity: 'medium', description: 'الطالب ينظر بعيداً عن الشاشة' },
  PHONE_DETECTED: { layer: 1, severity: 'critical', description: 'تم اكتشاف هاتف محمول' },
  CAMERA_BLOCKED: { layer: 1, severity: 'critical', description: 'تم حجب الكاميرا' },
  
  // الطبقة 2 - الشاشة
  TAB_SWITCH: { layer: 2, severity: 'medium', description: 'تبديل التبويب أو النافذة' },
  FULLSCREEN_EXIT: { layer: 2, severity: 'high', description: 'الخروج من وضع ملء الشاشة' },
  COPY_ATTEMPT: { layer: 2, severity: 'high', description: 'محاولة نسخ محتوى الاختبار' },
  SCREENSHOT_ATTEMPT: { layer: 2, severity: 'critical', description: 'محاولة أخذ لقطة شاشة' },
  
  // الطبقة 3 - السلوك
  PASTE_DETECTED: { layer: 3, severity: 'high', description: 'تم اكتشاف لصق نص' },
  KEYBOARD_SHORTCUT: { layer: 3, severity: 'medium', description: 'استخدام اختصار لوحة مفاتيح مشبوه' },
  RAPID_ANSWERS: { layer: 3, severity: 'medium', description: 'سرعة غير طبيعية في الإجابة' },
  INACTIVITY: { layer: 3, severity: 'low', description: 'عدم نشاط لفترة طويلة' },
  
  // الطبقة 4 - الشبكة
  VPN_DETECTED: { layer: 4, severity: 'high', description: 'تم اكتشاف استخدام VPN' },
  PROXY_DETECTED: { layer: 4, severity: 'high', description: 'تم اكتشاف استخدام Proxy' },
  MULTIPLE_SESSIONS: { layer: 4, severity: 'critical', description: 'محاولة تسجيل دخول من جهاز آخر' },
};

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { action } = body;

  // ===== بدء جلسة مراقبة =====
  if (action === 'start_session') {
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'هذا الإجراء للطلاب فقط' }, { status: 403 });
    }

    const { exam_id } = body;

    // التحقق من عدم وجود جلسة نشطة أخرى (الطبقة 4)
    const activeSession = await pool.query(
      `SELECT id FROM exam_proctoring_sessions 
       WHERE student_id = $1 AND exam_id = $2 AND status = 'active'`,
      [user.id, exam_id]
    );

    if (activeSession.rows.length > 0) {
      // تسجيل مخالفة محاولة جلسة مزدوجة
      await pool.query(
        `INSERT INTO exam_violations (session_id, student_id, exam_id, school_id, violation_type, layer, severity, description, ai_confidence)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [activeSession.rows[0].id, user.id, exam_id, user.school_id, 
         'MULTIPLE_SESSIONS', 4, 'critical', VIOLATION_TYPES.MULTIPLE_SESSIONS.description, 99.0]
      );
      return NextResponse.json({ error: 'يوجد جلسة نشطة بالفعل لهذا الاختبار' }, { status: 409 });
    }

    const session = await pool.query(
      `INSERT INTO exam_proctoring_sessions (exam_id, student_id, school_id, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [exam_id, user.id, user.school_id, user.owner_id]
    );

    return NextResponse.json({ 
      success: true, 
      session_id: session.rows[0].id,
      proctoring_config: {
        camera_required: true,
        fullscreen_required: true,
        snapshot_interval: 30,
        layers: [1, 2, 3, 4]
      }
    });
  }

  // ===== تسجيل مخالفة =====
  if (action === 'report_violation') {
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { session_id, violation_type, evidence_url, ai_confidence } = body;
    
    const violationInfo = VIOLATION_TYPES[violation_type as keyof typeof VIOLATION_TYPES];
    if (!violationInfo) {
      return NextResponse.json({ error: 'نوع المخالفة غير معروف' }, { status: 400 });
    }

    // التحقق من أن الجلسة تخص هذا الطالب
    const sessionResult = await pool.query(
      `SELECT * FROM exam_proctoring_sessions WHERE id = $1 AND student_id = $2`,
      [session_id, user.id]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'الجلسة غير موجودة' }, { status: 404 });
    }

    const session = sessionResult.rows[0];

    // إضافة المخالفة
    await pool.query(
      `INSERT INTO exam_violations (session_id, student_id, exam_id, school_id, violation_type, layer, severity, description, evidence_url, ai_confidence)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [session_id, user.id, session.exam_id, session.school_id,
       violation_type, violationInfo.layer, violationInfo.severity,
       violationInfo.description, evidence_url || null, ai_confidence || null]
    );

    // حساب درجة الخطر
    const riskPoints: Record<string, number> = { low: 5, medium: 15, high: 30, critical: 50 };
    const riskIncrease = riskPoints[violationInfo.severity] || 5;
    
    const updatedSession = await pool.query(
      `UPDATE exam_proctoring_sessions 
       SET violations_count = violations_count + 1,
           risk_score = LEAST(risk_score + $1, 100),
           is_flagged = CASE WHEN risk_score + $1 >= 70 THEN true ELSE is_flagged END,
           flag_reason = CASE WHEN risk_score + $1 >= 70 THEN $2 ELSE flag_reason END
       WHERE id = $3
       RETURNING risk_score, is_flagged`,
      [riskIncrease, `مخالفة: ${violationInfo.description}`, session_id]
    );

    const updatedRisk = updatedSession.rows[0];

    // إذا وصلت درجة الخطر لـ 100، إيقاف الاختبار تلقائياً
    if (updatedRisk.risk_score >= 100) {
      await pool.query(
        `UPDATE exam_proctoring_sessions SET status = 'terminated', ended_at = NOW() WHERE id = $1`,
        [session_id]
      );
      return NextResponse.json({ 
        success: true, 
        action_required: 'TERMINATE',
        message: 'تم إيقاف الاختبار بسبب مخالفات متكررة'
      });
    }

    return NextResponse.json({ 
      success: true,
      risk_score: updatedRisk.risk_score,
      is_flagged: updatedRisk.is_flagged,
      warning: updatedRisk.risk_score >= 50 ? 'تحذير: درجة الخطر مرتفعة' : null
    });
  }

  // ===== تسجيل لقطة كاميرا =====
  if (action === 'save_snapshot') {
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const { session_id, snapshot_url, ai_analysis } = body;
    
    const analysis = ai_analysis || {};
    
    await pool.query(
      `INSERT INTO proctoring_snapshots (session_id, student_id, snapshot_url, face_detected, multiple_faces, looking_away, phone_detected, ai_analysis)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [session_id, user.id, snapshot_url,
       analysis.face_detected ?? true,
       analysis.multiple_faces ?? false,
       analysis.looking_away ?? false,
       analysis.phone_detected ?? false,
       JSON.stringify(analysis)]
    );

    // تسجيل مخالفات تلقائياً من تحليل الكاميرا
    const violations = [];
    if (!analysis.face_detected) violations.push('FACE_NOT_DETECTED');
    if (analysis.multiple_faces) violations.push('MULTIPLE_FACES');
    if (analysis.phone_detected) violations.push('PHONE_DETECTED');

    for (const v of violations) {
      const info = VIOLATION_TYPES[v as keyof typeof VIOLATION_TYPES];
      if (info) {
        await pool.query(
          `INSERT INTO exam_violations (session_id, student_id, exam_id, school_id, violation_type, layer, severity, description, evidence_url, ai_confidence)
           SELECT $1, $2, exam_id, school_id, $3, $4, $5, $6, $7, $8
           FROM exam_proctoring_sessions WHERE id = $1`,
          [session_id, user.id, v, info.layer, info.severity, info.description, snapshot_url, analysis.confidence || 85.0]
        );
      }
    }

    return NextResponse.json({ success: true, violations_detected: violations });
  }

  // ===== إنهاء جلسة المراقبة =====
  if (action === 'end_session') {
    const { session_id } = body;
    
    await pool.query(
      `UPDATE exam_proctoring_sessions SET status = 'completed', ended_at = NOW() WHERE id = $1 AND student_id = $2`,
      [session_id, user.id]
    );

    const summary = await pool.query(
      `SELECT s.risk_score, s.violations_count, s.is_flagged,
              COUNT(v.id) FILTER (WHERE v.severity = 'critical') as critical_count,
              COUNT(v.id) FILTER (WHERE v.severity = 'high') as high_count
       FROM exam_proctoring_sessions s
       LEFT JOIN exam_violations v ON v.session_id = s.id
       WHERE s.id = $1
       GROUP BY s.risk_score, s.violations_count, s.is_flagged`,
      [session_id]
    );

    return NextResponse.json({ success: true, summary: summary.rows[0] });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}

export async function GET(request: Request) {
  try {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
    return NextResponse.json({ error: 'لا تملك صلاحية عرض تقارير المراقبة' }, { status: 403 });
  }

  const url = new URL(request.url);
  const exam_id = url.searchParams.get('exam_id');
  const filter = getFilterSQL(user, 2);

  const sessions = await pool.query(
    `SELECT s.*, u.name as student_name,
            COUNT(v.id) as total_violations,
            COUNT(v.id) FILTER (WHERE v.severity = 'critical') as critical_violations
     FROM exam_proctoring_sessions s
     JOIN users u ON u.id = s.student_id
     LEFT JOIN exam_violations v ON v.session_id = s.id
     WHERE 1=1 ${exam_id ? 'AND s.exam_id = $' + (filter.params.length + 1) : ''}
     ${filter.sql.replace('school_id', 's.school_id')}
     GROUP BY s.id, u.name
     ORDER BY s.risk_score DESC, s.started_at DESC
     LIMIT 50`,
    exam_id ? [...filter.params, exam_id] : filter.params
  );

  return NextResponse.json({ sessions: sessions.rows });

  } catch (error) {
    console.error('GET exam-proctoring error:', error);
    return NextResponse.json({ error: 'خطأ في جلب بيانات المراقبة' }, { status: 500 });
  }
}
