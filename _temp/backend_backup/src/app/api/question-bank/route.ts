import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

// ===== بنك الأسئلة الآمن - الجزء 7.1 من الوثيقة الفنية =====
// المبدأ: الأسئلة المقفلة لا تظهر للمعلم
// التقييم: AI يقيم كل سؤال (أخضر/أصفر/أحمر)
// البنك المركزي (is_global=true) متاح لجميع المدارس

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const semester = searchParams.get('semester');
    const lesson = searchParams.get('lesson');
    const subject = searchParams.get('subject');
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');
    const qType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '500');
    
    let query = `SELECT q.*, u.name as author_name,
      COALESCE(q.times_used, 0) as usage_count_total,
      CASE 
        WHEN q.ai_grade = 'green' THEN 'ممتاز'
        WHEN q.ai_grade = 'yellow' THEN 'مقبول'
        WHEN q.ai_grade = 'red' THEN 'ضعيف'
        ELSE 'غير مقيّم'
      END as quality_label_ar
      FROM question_bank q
      LEFT JOIN users u ON u.id = q.created_by
      WHERE q.is_active = true`;
    const params: any[] = [];
    
    if (user.role === 'super_admin') {
      // super_admin يرى كل شيء
    } else if (user.role === 'teacher') {
      // المعلم يرى: البنك المركزي + أسئلة مدرسته (غير المقفلة) + أسئلته هو (حتى المقفلة)
      const schoolId = user.school_id;
      if (schoolId) {
        params.push(schoolId, user.id);
        query += ` AND (q.is_global = true OR (q.school_id = $${params.length - 1} AND (q.status != 'locked' OR q.created_by = $${params.length})))`;
      } else {
        query += ` AND q.is_global = true`;
      }
    } else {
      const schoolId = user.school_id;
      if (schoolId) {
        params.push(schoolId);
        query += ` AND (q.is_global = true OR q.school_id = $${params.length})`;
      } else {
        query += ` AND q.is_global = true`;
      }
    }
    
    if (grade) { params.push(grade); query += ` AND q.grade = $${params.length}`; }
    if (difficulty) { params.push(difficulty); query += ` AND q.difficulty = $${params.length}`; }
    if (semester) { params.push(semester); query += ` AND q.semester = $${params.length}`; }
    if (lesson) { params.push(`%${lesson}%`); query += ` AND q.lesson ILIKE $${params.length}`; }
    if (subject) { params.push(subject); query += ` AND q.subject = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND q.question_text ILIKE $${params.length}`; }
    if (qType) { params.push(qType); query += ` AND q.question_type = $${params.length}`; }
    
    query += ` ORDER BY q.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);
    
    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[QuestionBank GET] Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
    }
    
    const body = await request.json();
    const {
      question_text, text_ar, type, question_type,
      options, answer, correct_answer,
      difficulty = 'medium', subject = 'لغتي',
      grade = 'الأول الابتدائي', semester = '1',
      lesson = '', explanation = '', marks = 1,
      is_global, image_url, tags
    } = body;
    
    const qText = question_text || text_ar;
    if (!qText) return NextResponse.json({ error: 'نص السؤال مطلوب' }, { status: 400 });
    
    const qTypeVal = question_type || type || 'mcq';
    const correctAns = correct_answer || answer || '';
    const schoolId = user.role === 'super_admin' ? null : user.school_id;
    const isGlobal = user.role === 'super_admin' ? true : (is_global || false);
    
    const diffScore = difficulty === 'easy' ? 0.3 : difficulty === 'hard' ? 0.8 : 0.5;
    
    // ===== تقييم السؤال بالذكاء الاصطناعي (محاكاة) =====
    let aiGrade = 'green';
    let aiFeedback = 'سؤال جيد ومناسب للمرحلة';
    
    if (qText.length < 10) {
      aiGrade = 'red';
      aiFeedback = 'السؤال قصير جداً. يرجى إضافة تفاصيل أكثر';
    } else if (qText.length < 30) {
      aiGrade = 'yellow';
      aiFeedback = 'السؤال مقبول لكن يمكن تحسينه بإضافة سياق';
    } else if (['multiple_choice', 'mcq'].includes(qTypeVal) && options) {
      const opts = Array.isArray(options) ? options : [];
      if (opts.length < 3) {
        aiGrade = 'yellow';
        aiFeedback = 'يفضل وجود 4 خيارات على الأقل';
      }
    }
    
    const qualityScore = aiGrade === 'green' ? 90 : aiGrade === 'yellow' ? 60 : 30;
    const qualityLabel = aiGrade === 'green' ? 'ممتاز' : aiGrade === 'yellow' ? 'مقبول' : 'ضعيف';
    
    // حفظ السؤال بحالة locked (مقفل) افتراضياً حسب الوثيقة
    const result = await pool.query(
      `INSERT INTO question_bank (
        school_id, subject, grade, semester, lesson,
        question_text, question_type, options, correct_answer,
        explanation, difficulty, difficulty_score, ai_analyzed,
        is_global, created_by, status, ai_grade, ai_feedback,
        quality_score, quality_label, image_url, tags,
        created_at, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,true,$13,$14,'locked',$15,$16,$17,$18,$19,$20,NOW(),NOW())
      RETURNING *`,
      [
        schoolId, subject, grade, semester, lesson,
        qText, qTypeVal,
        JSON.stringify(Array.isArray(options) ? options : []),
        correctAns, explanation, difficulty, diffScore,
        isGlobal, user.id, aiGrade, aiFeedback,
        qualityScore, qualityLabel,
        image_url || null, tags ? JSON.stringify(tags) : null
      ]
    );
    
    return NextResponse.json({
      ...result.rows[0],
      ai_evaluation: { grade: aiGrade, feedback: aiFeedback, quality_score: qualityScore }
    });
  } catch (error) {
    console.error('[QuestionBank POST] Error:', error);
    return NextResponse.json({ error: 'فشل إضافة السؤال' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    const { id, action } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // إجراءات خاصة
    if (action) {
      switch (action) {
        case 'approve':
          if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
            return NextResponse.json({ error: 'غير مصرح بالموافقة' }, { status: 403 });
          }
          await pool.query(`UPDATE question_bank SET status = 'approved', updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم الموافقة على السؤال' });

        case 'lock':
          await pool.query(`UPDATE question_bank SET status = 'locked', updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم قفل السؤال' });

        case 'reject':
          if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
            return NextResponse.json({ error: 'غير مصرح' }, { status: 403 });
          }
          await pool.query(`UPDATE question_bank SET status = 'rejected', updated_at = NOW() WHERE id = $1`, [id]);
          return NextResponse.json({ success: true, message: 'تم رفض السؤال' });

        default:
          return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
      }
    }

    // تحديث عام
    const { question_text, question_type, options, correct_answer, subject, grade, difficulty, explanation } = body;
    
    const result = await pool.query(
      `UPDATE question_bank SET 
        question_text = COALESCE($1, question_text),
        question_type = COALESCE($2, question_type),
        options = COALESCE($3, options),
        correct_answer = COALESCE($4, correct_answer),
        subject = COALESCE($5, subject),
        grade = COALESCE($6, grade),
        difficulty = COALESCE($7, difficulty),
        explanation = COALESCE($8, explanation),
        updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [question_text, question_type, options ? JSON.stringify(options) : null, correct_answer, subject, grade, difficulty, explanation, id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('[QuestionBank PUT] Error:', error);
    return NextResponse.json({ error: error.message || 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID مطلوب' }, { status: 400 });
    
    // التحقق من أن السؤال غير مستخدم في اختبارات
    const usage = await pool.query('SELECT COUNT(*) as count FROM exam_questions WHERE question_bank_id = $1', [id]);
    if (parseInt(usage.rows[0]?.count || '0') > 0) {
      return NextResponse.json({ error: 'لا يمكن حذف سؤال مستخدم في اختبارات' }, { status: 400 });
    }
    
    if (user.role === 'super_admin') {
      await pool.query('DELETE FROM question_bank WHERE id = $1', [id]);
    } else {
      await pool.query('DELETE FROM question_bank WHERE id = $1 AND school_id = $2', [id, user.school_id]);
    }
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل الحذف' }, { status: 500 });
  }
}
