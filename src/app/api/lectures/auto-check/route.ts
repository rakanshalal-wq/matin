import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';
import { sendSMS, sendWhatsApp, sendEmail } from '@/lib/integrations';

async function notify(owner_id: number, school_id: number, phone: string | null, email: string | null, name: string, title: string, message: string) {
  if (phone) {
    await sendSMS(phone, message);
    await sendWhatsApp(phone, `*${title}*\n${message}`);
  }
  if (email) {
    const html = `<div dir="rtl" style="font-family:Arial;padding:20px;background:#0D1B2A;color:white;border-radius:12px"><h2 style="color:#C9A227">${title}</h2><p>مرحباً ${name}،</p><p>${message}</p></div>`;
    await sendEmail(email, title, html);
  }
}

export async function GET(request: Request) {
  // يُؤمَّن بـ CRON_SECRET لمنع الاستدعاء العشوائي
  const secret = (request as Request & { headers: Headers }).headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const in3h = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in1h = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const in30m = new Date(now.getTime() + 30 * 60 * 1000);

    // ===== 1. قبل 3 ساعات - أرسل تنبيه للأستاذ يختار =====
    const lectures3h = await pool.query(
      `SELECT l.*, u.phone, u.email, u.name as teacher_name_real
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id::integer
       WHERE l.date BETWEEN $1 AND $2
       AND l.status = 'scheduled'
       AND l.confirmation_status = 'pending'
       AND l.notification_2h_sent = false`,
      [now, in3h]
    );

    for (const l of lectures3h.rows) {
      await notify(l.owner_id, l.school_id, l.phone, l.email, l.teacher_name_real || l.teacher_name,
        '⏰ تأكيد المحاضرة',
        `محاضرتك "${l.title}" بعد 3 ساعات. يرجى تأكيد نوع المحاضرة من الداشبورد: حضوري / أونلاين / ملغية.`
      );
      await pool.query('UPDATE lectures SET notification_2h_sent = true WHERE id = $1', [l.id]);
    }

    // ===== 2. قبل ساعتين - تذكير =====
    const lectures2h = await pool.query(
      `SELECT l.*, u.phone, u.email, u.name as teacher_name_real
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id::integer
       WHERE l.date BETWEEN $1 AND $2
       AND l.status = 'scheduled'
       AND l.confirmation_status = 'pending'
       AND l.notification_2h_sent = true
       AND l.notification_1h_sent = false`,
      [now, in2h]
    );

    for (const l of lectures2h.rows) {
      await notify(l.owner_id, l.school_id, l.phone, l.email, l.teacher_name_real || l.teacher_name,
        '⏰ تذكير: لم تؤكد محاضرتك',
        `محاضرتك "${l.title}" بعد ساعتين ولم تؤكد بعد. يرجى التأكيد الآن.`
      );
      await pool.query('UPDATE lectures SET notification_1h_sent = true WHERE id = $1', [l.id]);
    }

    // ===== 3. قبل ساعة بدون تأكيد - حول لأونلاين تلقائياً =====
    const lectures1h = await pool.query(
      `SELECT l.*, u.phone, u.email, u.name as teacher_name_real
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id::integer
       WHERE l.date BETWEEN $1 AND $2
       AND l.status = 'scheduled'
       AND l.confirmation_status = 'pending'
       AND l.notification_1h_sent = true`,
      [now, in1h]
    );

    for (const l of lectures1h.rows) {
      await pool.query(
        `UPDATE lectures SET 
          type = 'online', 
          original_type = 'in_person',
          auto_converted = true,
          conversion_reason = 'no_confirmation_1h'
         WHERE id = $1`,
        [l.id]
      );

      await notify(l.owner_id, l.school_id, l.phone, l.email, l.teacher_name_real || l.teacher_name,
        '🔄 تحويل المحاضرة لأونلاين',
        `لم يتم تأكيد محاضرتك "${l.title}"، تم تحويلها تلقائياً لأونلاين. لا يمكن الرجوع لحضوري.`
      );

      const students = await pool.query(
        `SELECT u.phone, u.email, u.name 
         FROM users u
         JOIN students s ON s.user_id::text = u.id::text
         WHERE s.class_id = $1 AND u.status = 'active'`,
        [l.class_id]
      );
      for (const s of students.rows) {
        await notify(l.owner_id, l.school_id, s.phone, s.email, s.name,
          '📱 تغيير في المحاضرة',
          `محاضرة "${l.title}" أصبحت أونلاين بدلاً من الحضور.`
        );
      }
    }

    // ===== 4. قبل 30 دقيقة لا زالت بدون تأكيد - حول لمسجلة =====
    const lectures30m = await pool.query(
      `SELECT l.*, u.phone, u.email, u.name as teacher_name_real,
              admin.phone as admin_phone, admin.email as admin_email, admin.name as admin_name
       FROM lectures l
       LEFT JOIN users u ON u.id = l.teacher_id::integer
       LEFT JOIN users admin ON admin.school_id = l.school_id AND admin.role = 'admin' AND admin.status = 'active'
       WHERE l.date BETWEEN $1 AND $2
       AND l.type = 'online'
       AND l.auto_converted = true
       AND l.confirmation_status = 'pending'`,
      [now, in30m]
    );

    for (const l of lectures30m.rows) {
      await pool.query(
        `UPDATE lectures SET 
          type = 'recorded',
          conversion_reason = 'no_confirmation_30m'
         WHERE id = $1`,
        [l.id]
      );

      await notify(l.owner_id, l.school_id, l.phone, l.email, l.teacher_name_real || l.teacher_name,
        '🎥 تحويل لمحاضرة مسجلة',
        `تم تحويل محاضرتك "${l.title}" لمسجلة. يرجى رفع التسجيل في أقرب وقت.`
      );

      // إشعار مدير القسم
      if (l.admin_phone || l.admin_email) {
        await notify(l.owner_id, l.school_id, l.admin_phone, l.admin_email, l.admin_name || 'مدير',
          '🚨 تنبيه: أستاذ لم يؤكد محاضرته',
          `الأستاذ ${l.teacher_name_real || l.teacher_name} لم يؤكد محاضرة "${l.title}" وتم تحويلها لمسجلة.`
        );
      }

      const students = await pool.query(
        `SELECT u.phone, u.email, u.name 
         FROM users u
         JOIN students s ON s.user_id::text = u.id::text
         WHERE s.class_id = $1 AND u.status = 'active'`,
        [l.class_id]
      );
      for (const s of students.rows) {
        await notify(l.owner_id, l.school_id, s.phone, s.email, s.name,
          '🎥 محاضرة مسجلة',
          `محاضرة "${l.title}" أصبحت مسجلة. ستجد الرابط في الداشبورد بعد رفعها.`
        );
      }
    }

    // ===== 5. مراقبة الأساتذة - يومياً الساعة 8 =====
    if (now.getHours() === 8 && now.getMinutes() < 15) {

      // يومين بدون تسجيل
      const teachers2days = await pool.query(
        `SELECT u.id, u.name, u.phone, u.email, u.owner_id, u.school_id
         FROM users u
         WHERE u.role = 'teacher' AND u.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM lectures l
           WHERE l.teacher_id = u.id::text
           AND l.type = 'recorded'
           AND l.created_at > NOW() - INTERVAL '2 days'
         )
         AND EXISTS (
           SELECT 1 FROM lectures l2
           WHERE l2.teacher_id = u.id::text
           AND l2.date > NOW() - INTERVAL '2 days'
         )`
      );

      for (const t of teachers2days.rows) {
        await notify(t.owner_id, t.school_id, t.phone, t.email, t.name,
          '⚠️ تنبيه: لا يوجد تسجيل',
          `لم يتم رفع تسجيل لمحاضراتك منذ يومين. يرجى رفع التسجيلات.`
        );
      }

      // 3 أيام - إشعار المدير
      const teachers3days = await pool.query(
        `SELECT u.id, u.name, u.owner_id, u.school_id,
                admin.phone as admin_phone, admin.email as admin_email, admin.name as admin_name
         FROM users u
         LEFT JOIN users admin ON admin.school_id = u.school_id 
           AND admin.role = 'admin' 
           AND admin.status = 'active'
         WHERE u.role = 'teacher' AND u.status = 'active'
         AND NOT EXISTS (
           SELECT 1 FROM lectures l
           WHERE l.teacher_id = u.id::text
           AND l.type = 'recorded'
           AND l.created_at > NOW() - INTERVAL '3 days'
         )
         AND EXISTS (
           SELECT 1 FROM lectures l2
           WHERE l2.teacher_id = u.id::text
           AND l2.date > NOW() - INTERVAL '3 days'
         )`
      );

      for (const t of teachers3days.rows) {
        if (t.admin_phone || t.admin_email) {
          await notify(t.owner_id, t.school_id, t.admin_phone, t.admin_email, t.admin_name || 'المدير',
            '🚨 تنبيه عاجل',
            `الأستاذ ${t.name} لم يرفع تسجيلات منذ 3 أيام. يرجى المتابعة.`
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: {
        lectures3h: lectures3h.rows.length,
        lectures2h: lectures2h.rows.length,
        lectures1h: lectures1h.rows.length,
        lectures30m: lectures30m.rows.length,
      }
    });

  } catch (error) {
    console.error('Auto-check error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
