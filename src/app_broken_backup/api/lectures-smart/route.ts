import { NextResponse } from 'next/server';
import { getUserFromRequest, getFilterSQL, pool } from '@/lib/auth';

// ===== نظام المحاضرات الذكي =====
// 1. تذكير تلقائي قبل 3 ساعات، ساعة، 15 دقيقة
// 2. توليد أسئلة ذكية بعد المحاضرة باستخدام AI
// 3. تأكيد حضور المعلم والطلاب

async function generatePostLectureQuestions(lectureTitle: string, lectureContent: string, schoolId: string): Promise<any[]> {
  try {
    const OpenAI = (await import('openai').default;
    const client = new OpenAI();
    
    const prompt = `أنت مساعد تعليمي. بناءً على محاضرة بعنوان "${lectureTitle}" والمحتوى التالي:
${lectureContent || 'محاضرة تعليمية'}

أنشئ 3 أسئلة اختيار من متعدد باللغة العربية لتقييم فهم الطلاب.
أعد الإجابة بصيغة JSON فقط:
[
  {
    "question": "نص السؤال",
    "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
    "correct_answer": "الخيار الصحيح",
    "difficulty": "easy|medium|hard"
  }
]`;

    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || '{"questions":[]}';
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : (parsed.questions || []);
  } catch (error) {
    // أسئلة افتراضية في حالة فشل AI
    return [
      {
        question: `ما هو الموضوع الرئيسي لمحاضرة "${lectureTitle}"؟`,
        options: ['الموضوع أ', 'الموضوع ب', 'الموضوع ج', 'الموضوع د'],
        correct_answer: 'الموضوع أ',
        difficulty: 'easy'
      }
    ];
  }
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const body = await request.json();
  const { action } = body;

  // ===== تأكيد حضور المحاضرة =====
  if (action === 'confirm_attendance') {
    const { lecture_id } = body;
    
    if (!lecture_id) {
      return NextResponse.json({ error: 'معرف المحاضرة مطلوب' }, { status: 400 });
    }

    // التحقق من أن المحاضرة تخص مدرسة المستخدم
    const lectureResult = await pool.query(
      `SELECT * FROM lectures WHERE id::text = $1::text AND school_id::text = $2::text`,
      [lecture_id, user.school_id?.toString()]
    );

    if (lectureResult.rows.length === 0) {
      return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    }

    // تسجيل التأكيد
    await pool.query(
      `INSERT INTO lecture_confirmations (lecture_id, user_id, user_role, confirmation_type)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (lecture_id, user_id, confirmation_type) DO UPDATE SET confirmed_at = NOW()`,
      [lecture_id, user.id, user.role, 'attendance']
    );

    return NextResponse.json({ success: true, message: 'تم تأكيد حضورك بنجاح' });
  }

  // ===== إرسال تذكيرات المحاضرة (يُنفَّذ بواسطة cron job) =====
  if (action === 'send_reminders') {
    // هذا الإجراء للنظام فقط
    if (user.role !== 'super_admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const now = new Date();
    const in3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in15Min = new Date(now.getTime() + 15 * 60 * 1000);

    // محاضرات تحتاج تذكير بعد 3 ساعات
    const lectures3h = await pool.query(
      `SELECT l.*, s.name as school_name FROM lectures l
       JOIN schools s ON s.id::text = l.school_id::text
       WHERE l.scheduled_at BETWEEN $1 AND $2
       AND l.reminder_sent_3h = false AND l.status = 'scheduled'`,
      [now.toISOString(), in3Hours.toISOString()]
    );

    let reminders_sent = 0;

    for (const lecture of lectures3h.rows) {
      // إرسال إشعار للمعلم والطلاب
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, school_id, owner_id, created_at)
         SELECT u.id, 
                'تذكير: محاضرة بعد 3 ساعات',
                'تذكير: محاضرة "' || $1 || '" ستبدأ بعد 3 ساعات',
                'lecture_reminder',
                $2, $3, NOW()
         FROM users u
         WHERE u.school_id::text = $4::text AND u.role IN ('teacher', 'student') AND u.status = 'active'`,
        [lecture.title, lecture.school_id, lecture.owner_id, parseInt(lecture.school_id)]
      );
      
      await pool.query(
        `UPDATE lectures SET reminder_sent_3h = true WHERE id::text = $1::text`,
        [lecture.id]
      );
      reminders_sent++;
    }

    // محاضرات تحتاج تذكير بعد ساعة
    const lectures1h = await pool.query(
      `SELECT * FROM lectures
       WHERE scheduled_at BETWEEN $1 AND $2
       AND reminder_sent_1h = false AND status = 'scheduled'`,
      [now.toISOString(), in1Hour.toISOString()]
    );

    for (const lecture of lectures1h.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, school_id, owner_id, created_at)
         SELECT u.id,
                'تذكير: محاضرة بعد ساعة',
                'تذكير: محاضرة "' || $1 || '" ستبدأ بعد ساعة. يرجى التأكيد',
                'lecture_reminder_urgent',
                $2, $3, NOW()
         FROM users u
         WHERE u.school_id::text = $4::text AND u.role IN ('teacher', 'student') AND u.status = 'active'`,
        [lecture.title, lecture.school_id, lecture.owner_id, parseInt(lecture.school_id)]
      );
      
      await pool.query(
        `UPDATE lectures SET reminder_sent_1h = true WHERE id::text = $1::text`,
        [lecture.id]
      );
      reminders_sent++;
    }

    // محاضرات تحتاج تذكير بعد 15 دقيقة
    const lectures15m = await pool.query(
      `SELECT * FROM lectures
       WHERE scheduled_at BETWEEN $1 AND $2
       AND reminder_sent_15m = false AND status = 'scheduled'`,
      [now.toISOString(), in15Min.toISOString()]
    );

    for (const lecture of lectures15m.rows) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, school_id, owner_id, created_at)
         SELECT u.id,
                'تنبيه: المحاضرة بعد 15 دقيقة!',
                'المحاضرة "' || $1 || '" ستبدأ بعد 15 دقيقة. كن مستعداً!',
                'lecture_reminder_now',
                $2, $3, NOW()
         FROM users u
         WHERE u.school_id::text = $4::text AND u.role IN ('teacher', 'student') AND u.status = 'active'`,
        [lecture.title, lecture.school_id, lecture.owner_id, parseInt(lecture.school_id)]
      );
      
      await pool.query(
        `UPDATE lectures SET reminder_sent_15m = true WHERE id::text = $1::text`,
        [lecture.id]
      );
      reminders_sent++;
    }

    return NextResponse.json({ success: true, reminders_sent });
  }

  // ===== توليد أسئلة ذكية بعد المحاضرة =====
  if (action === 'generate_post_questions') {
    if (!['teacher', 'admin', 'owner', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'لا تملك صلاحية توليد الأسئلة' }, { status: 403 });
    }

    const { lecture_id } = body;

    const lectureResult = await pool.query(
      `SELECT * FROM lectures WHERE id::text = $1::text`,
      [lecture_id]
    );

    if (lectureResult.rows.length === 0) {
      return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    }

    const lecture = lectureResult.rows[0];

    // توليد الأسئلة بالذكاء الاصطناعي
    const questions = await generatePostLectureQuestions(
      lecture.title || lecture.title_ar || 'محاضرة',
      lecture.description || lecture.content || '',
      lecture.school_id
    );

    // حفظ الأسئلة في قاعدة البيانات
    const savedQuestions = [];
    for (const q of questions) {
      const result = await pool.query(
        `INSERT INTO lecture_post_questions (lecture_id, school_id, question, question_ar, options, correct_answer, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [lecture_id, lecture.school_id, q.question, q.question, 
         JSON.stringify(q.options), q.correct_answer, q.difficulty || 'medium']
      );
      savedQuestions.push({ id: result.rows[0].id, ...q });
    }

    // تحديث حالة المحاضرة
    await pool.query(
      `UPDATE lectures SET post_lecture_questions_sent = true, ai_questions = $1 WHERE id::text = $2::text`,
      [JSON.stringify(savedQuestions), lecture_id]
    );

    // إرسال إشعار للطلاب
    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type, school_id, owner_id, created_at)
       SELECT u.id,
              'أسئلة ما بعد المحاضرة',
              'تم إضافة أسئلة جديدة بعد محاضرة "' || $1 || '". أجب عليها الآن!',
              'post_lecture_questions',
              $2, $3, NOW()
       FROM users u
       WHERE u.school_id::text = $4::text AND u.role = 'student' AND u.status = 'active'`,
      [lecture.title || 'المحاضرة', lecture.school_id, lecture.owner_id, parseInt(lecture.school_id)]
    );

    return NextResponse.json({ 
      success: true, 
      questions: savedQuestions,
      message: `تم توليد ${savedQuestions.length} سؤال ذكي بنجاح`
    });
  }

  // ===== الإجابة على أسئلة ما بعد المحاضرة =====
  if (action === 'answer_post_question') {
    if (user.role !== 'student') {
      return NextResponse.json({ error: 'هذا الإجراء للطلاب فقط' }, { status: 403 });
    }

    const { question_id, answer } = body;

    const questionResult = await pool.query(
      `SELECT * FROM lecture_post_questions WHERE id::text = $1::text`,
      [question_id]
    );

    if (questionResult.rows.length === 0) {
      return NextResponse.json({ error: 'السؤال غير موجود' }, { status: 404 });
    }

    const question = questionResult.rows[0];
    const isCorrect = answer === question.correct_answer;

    await pool.query(
      `INSERT INTO lecture_post_answers (question_id, student_id, answer, is_correct)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [question_id, user.id, answer, isCorrect]
    );

    return NextResponse.json({ 
      success: true, 
      is_correct: isCorrect,
      correct_answer: isCorrect ? null : question.correct_answer
    });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const url = new URL(request.url);
  const lecture_id = url.searchParams.get('lecture_id');
  const action = url.searchParams.get('action');

  if (action === 'post_questions' && lecture_id) {
    const questions = await pool.query(
      `SELECT lpq.*, 
              CASE WHEN lpa.student_id = $1 THEN lpa.answer ELSE NULL END as my_answer,
              CASE WHEN lpa.student_id = $1 THEN lpa.is_correct ELSE NULL END as is_answered_correctly
       FROM lecture_post_questions lpq
       LEFT JOIN lecture_post_answers lpa ON lpa.question_id::text = lpq.id::text AND lpa.student_id = $1
       WHERE lpq.lecture_id = $2
       ORDER BY lpq.id`,
      [String(user.id), lecture_id]
    );

    // إخفاء الإجابة الصحيحة عن الطلاب قبل الإجابة
    const questionsData = questions.rows.map(q => ({
      ...q,
      correct_answer: (user.role === 'student' && !q.my_answer) ? undefined : q.correct_answer
    });

    return NextResponse.json({ questions: questionsData });
  }

  if (action === 'confirmations' && lecture_id) {
    if (!['teacher', 'admin', 'owner', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }

    const confirmations = await pool.query(
      `SELECT lc.*, u.name, u.role FROM lecture_confirmations lc
       JOIN users u ON u.id::text = lc.user_id::text
       WHERE lc.lecture_id = $1
       ORDER BY lc.confirmed_at`,
      [lecture_id]
    );

    return NextResponse.json({ confirmations: confirmations.rows });
  }

  return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
}
