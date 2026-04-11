import { NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL, getInsertIds } from '@/lib/auth';

// ===== نظام المحاضرات الصارم - الجزء السادس من الوثيقة الفنية =====
// المبدأ: فرض الالتزام وضمان حق الطالب
// الحالات: scheduled → confirmed_online/confirmed_recorded/live → completed/cancelled
// نافذة الفتح: unlock_window_hours (افتراضي 3 ساعات)
// التأكيد: يجب على المعلم تأكيد نوع المحاضرة قبل الموعد

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    const filter = getFilterSQL(user);
    const { searchParams } = new URL(request.url);
    const lecture_id = searchParams.get('id');
    const status_filter = searchParams.get('status');
    const teacher_filter = searchParams.get('teacher_id');
    
    // جلب محاضرة واحدة مع الحضور
    if (lecture_id) {
      const lecture = await pool.query('SELECT * FROM lectures WHERE id = $1', [lecture_id]);
      if (lecture.rows.length === 0) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
      
      const attendance = await pool.query(
        `SELECT a.*, u.name as student_name FROM attendance a
         LEFT JOIN students s ON s.id = a.student_id
         LEFT JOIN users u ON u.id::text = s.user_id
         WHERE a.lecture_id = $1 ORDER BY a.created_at`, [lecture_id]
      );
      return NextResponse.json({ lecture: lecture.rows[0], attendance: attendance.rows });
    }
    
    // بناء الاستعلام مع الفلاتر
    let whereExtra = '';
    const extraParams: any[] = [];
    let paramIdx = filter.params.length + 1;
    
    if (status_filter) {
      whereExtra += ` AND l.status = $${paramIdx}`;
      extraParams.push(status_filter);
      paramIdx++;
    }
    if (teacher_filter) {
      whereExtra += ` AND l.teacher_id = $${paramIdx}`;
      extraParams.push(teacher_filter);
      paramIdx++;
    }
    
    // للمعلم: يرى فقط محاضراته
    let teacherFilter = '';
    if (user.role === 'teacher') {
      teacherFilter = ` AND l.teacher_id = ${user.id}`;
    }
    
    const result = await pool.query(
      `SELECT l.*, 
        u.name as teacher_display_name,
        c.name as class_name,
        (SELECT COUNT(*) FROM attendance WHERE lecture_id = l.id AND status = 'present') as present_count,
        (SELECT COUNT(*) FROM attendance WHERE lecture_id = l.id AND status = 'absent') as absent_count,
        CASE 
          WHEN l.scheduled_at IS NOT NULL AND l.scheduled_at > NOW() THEN 'upcoming'
          WHEN l.scheduled_at IS NOT NULL AND l.scheduled_at <= NOW() AND l.status IN ('scheduled','live') THEN 'active'
          ELSE 'past'
        END as time_status,
        CASE 
          WHEN l.scheduled_at IS NOT NULL AND l.confirmation_deadline IS NOT NULL 
            AND NOW() > l.confirmation_deadline AND l.status = 'scheduled' THEN true
          ELSE false
        END as deadline_passed
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id
       LEFT JOIN classes c ON c.id = l.class_id
       WHERE 1=1 ${filter.sql} ${teacherFilter} ${whereExtra}
       ORDER BY l.scheduled_at DESC NULLS LAST, l.created_at DESC LIMIT 200`,
      [...filter.params, ...extraParams]
    );
    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Lectures GET Error:', error);
    return NextResponse.json({ error: 'حدث خطأ في الخادم' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بإضافة محاضرات' }, { status: 403 });
    }
    
    const ids = getInsertIds(user);
    const body = await request.json();
    const { 
      title, subject, teacher_id, teacher_name, class_id, 
      scheduled_at, duration, type, location, description,
      course_id, unlock_window_hours,
      video_url, attachments, materials
    } = body;
    
    if (!title) return NextResponse.json({ error: 'عنوان المحاضرة مطلوب' }, { status: 400 });
    if (!scheduled_at) return NextResponse.json({ error: 'وقت المحاضرة مطلوب' }, { status: 400 });

    // حساب موعد التأكيد (قبل 3 ساعات من الموعد افتراضياً)
    const windowHours = unlock_window_hours || 3;
    const scheduledDate = new Date(scheduled_at);
    const confirmationDeadline = new Date(scheduledDate.getTime() - windowHours * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO lectures (
        title, subject, teacher_id, teacher_name, class_id, 
        scheduled_at, duration, type, location, description,
        status, confirmation_deadline, unlock_window_hours,
        course_id, video_url, attachments, materials,
        school_id, owner_id, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        'scheduled',$11,$12,$13,$14,$15,$16,$17,$18,NOW()) RETURNING *`,
      [
        title, subject || null, teacher_id || (user.role === 'teacher' ? user.id : null),
        teacher_name || null, class_id || null,
        scheduled_at, duration || 60, type || 'in_person', location || null, description || null,
        confirmationDeadline.toISOString(), windowHours,
        course_id || null, video_url || null,
        JSON.stringify(attachments || []), JSON.stringify(materials || []),
        ids.school_id, ids.owner_id
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Lectures POST Error:', error);
    return NextResponse.json({ error: error.message || 'فشل في الإضافة' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    
    const body = await request.json();
    const { id, action } = body;
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });

    // جلب المحاضرة الحالية
    const old = await pool.query('SELECT * FROM lectures WHERE id = $1', [id]);
    if (old.rows.length === 0) return NextResponse.json({ error: 'المحاضرة غير موجودة' }, { status: 404 });
    const lecture = old.rows[0];

    // ===== نظام الإجراءات الصارم =====
    if (action) {
      switch (action) {
        case 'confirm':
          // تأكيد المحاضرة (حضوري) - فقط قبل الموعد
          if (lecture.status !== 'scheduled') {
            return NextResponse.json({ error: 'لا يمكن تأكيد محاضرة ليست مجدولة' }, { status: 400 });
          }
          await pool.query(
            `UPDATE lectures SET status = 'confirmed_online', confirmed = true, 
             confirmation_status = 'confirmed', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم تأكيد المحاضرة' });

        case 'confirm_online':
          // تأكيد أونلاين
          if (lecture.status !== 'scheduled') {
            return NextResponse.json({ error: 'لا يمكن تأكيد محاضرة ليست مجدولة' }, { status: 400 });
          }
          await pool.query(
            `UPDATE lectures SET status = 'confirmed_online', type = 'online', confirmed = true,
             confirmation_status = 'confirmed', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم تأكيد المحاضرة كأونلاين' });

        case 'confirm_recorded':
          // تأكيد تسجيل
          await pool.query(
            `UPDATE lectures SET status = 'confirmed_recorded', type = 'recorded', confirmed = true,
             confirmation_status = 'confirmed', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم تأكيد المحاضرة كمسجلة - يرجى رفع التسجيل خلال 48 ساعة' });

        case 'start_live':
          // بدء البث المباشر
          await pool.query(
            `UPDATE lectures SET status = 'live', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'المحاضرة جارية الآن' });

        case 'complete':
          // إنهاء المحاضرة
          await pool.query(
            `UPDATE lectures SET status = 'completed', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم إنهاء المحاضرة' });

        case 'cancel':
          // إلغاء المحاضرة
          await pool.query(
            `UPDATE lectures SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم إلغاء المحاضرة' });

        case 'upload_recording':
          // رفع تسجيل المحاضرة
          const { recording_url } = body;
          if (!recording_url) return NextResponse.json({ error: 'رابط التسجيل مطلوب' }, { status: 400 });
          await pool.query(
            `UPDATE lectures SET recording_url = $1, status = 'completed', updated_at = NOW() WHERE id = $2`,
            [recording_url, id]
          );
          return NextResponse.json({ success: true, message: 'تم رفع التسجيل بنجاح' });

        case 'force_online':
          // تحويل إجباري لأونلاين (من النظام التلقائي)
          await pool.query(
            `UPDATE lectures SET type = 'online', status = 'confirmed_online', 
             auto_converted = true, confirmation_status = 'auto_online',
             updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم التحويل التلقائي لأونلاين' });

        case 'force_recorded':
          // تحويل إجباري لمسجلة
          await pool.query(
            `UPDATE lectures SET type = 'recorded', status = 'confirmed_recorded',
             auto_converted = true, confirmation_status = 'auto_recorded',
             updated_at = NOW() WHERE id = $1`,
            [id]
          );
          return NextResponse.json({ success: true, message: 'تم التحويل التلقائي لمسجلة' });

        default:
          return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 });
      }
    }

    // تحديث عام للمحاضرة
    const { title, subject, teacher_name, scheduled_at, duration, type, location, description, status, confirmed, video_url, attachments, materials } = body;
    
    const result = await pool.query(
      `UPDATE lectures SET 
        title = COALESCE($1, title), subject = COALESCE($2, subject), 
        teacher_name = COALESCE($3, teacher_name), scheduled_at = COALESCE($4, scheduled_at),
        duration = COALESCE($5, duration), type = COALESCE($6, type),
        location = COALESCE($7, location), description = COALESCE($8, description),
        status = COALESCE($9, status), confirmed = COALESCE($10, confirmed),
        video_url = COALESCE($11, video_url), updated_at = NOW()
       WHERE id = $12 RETURNING *`,
      [title, subject, teacher_name, scheduled_at, duration, type, location, description, status, confirmed, video_url, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Lectures PUT Error:', error);
    return NextResponse.json({ error: error.message || 'فشل' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    if (!['super_admin', 'owner', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'غير مصرح بالحذف' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
    
    // التحقق من أن المحاضرة لم تكتمل بعد
    const lecture = await pool.query('SELECT status FROM lectures WHERE id = $1', [id]);
    if (lecture.rows[0]?.status === 'completed') {
      return NextResponse.json({ error: 'لا يمكن حذف محاضرة مكتملة' }, { status: 400 });
    }
    
    await pool.query('DELETE FROM lectures WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'تم حذف المحاضرة' });
  } catch (error: any) {
    console.error('Lectures DELETE Error:', error);
    return NextResponse.json({ error: error.message || 'فشل' }, { status: 500 });
  }
}
