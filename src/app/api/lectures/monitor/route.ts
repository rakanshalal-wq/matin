import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// مراقبة الدكتور — ينادى يومياً
// يومين بدون تسجيل = تنبيه
// 3 أيام = إشعار رئيس القسم
// أسبوع = إنذار رسمي

export async function GET(request: NextRequest) {
  // يُؤمَّن بـ CRON_SECRET لمنع الاستدعاء العشوائي
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const alerts: any[] = [];

    // المحاضرات المسجلة اللي فات عليها يومين بدون رفع تسجيل
    const twoDays = await pool.query(`
      SELECT l.id, l.title, l.date, l.teacher_id, l.school_id,
        u.name as teacher_name, u.email as teacher_email
      FROM lectures l
      LEFT JOIN teachers t ON t.id = l.teacher_id
      LEFT JOIN users u ON u.id::text = t.user_id
      WHERE l.type = 'recorded'
        AND l.recording_url IS NULL
        AND l.date IS NOT NULL
        AND l.date < NOW() - interval '2 days'
        AND l.date > NOW() - interval '3 days'
    `);
    for (const row of twoDays.rows) {
      alerts.push({ level: 'warning', type: 'missing_recording_2days', teacher: row.teacher_name, lecture: row.title, date: row.date, message: `تنبيه: ${row.teacher_name} لم يرفع تسجيل محاضرة "${row.title}" منذ يومين` });
    }

    // 3 أيام — إشعار رئيس القسم
    const threeDays = await pool.query(`
      SELECT l.id, l.title, l.date, l.teacher_id, l.school_id,
        u.name as teacher_name, t.department
      FROM lectures l
      LEFT JOIN teachers t ON t.id = l.teacher_id
      LEFT JOIN users u ON u.id::text = t.user_id
      WHERE l.type = 'recorded'
        AND l.recording_url IS NULL
        AND l.date IS NOT NULL
        AND l.date < NOW() - interval '3 days'
        AND l.date > NOW() - interval '7 days'
    `);
    for (const row of threeDays.rows) {
      alerts.push({ level: 'escalation', type: 'missing_recording_3days', teacher: row.teacher_name, department: row.department, lecture: row.title, date: row.date, message: `تصعيد: ${row.teacher_name} لم يرفع تسجيل محاضرة "${row.title}" منذ 3 أيام — إشعار رئيس القسم` });
    }

    // أسبوع — إنذار رسمي
    const oneWeek = await pool.query(`
      SELECT l.id, l.title, l.date, l.teacher_id, l.school_id,
        u.name as teacher_name, t.department
      FROM lectures l
      LEFT JOIN teachers t ON t.id = l.teacher_id
      LEFT JOIN users u ON u.id::text = t.user_id
      WHERE l.type = 'recorded'
        AND l.recording_url IS NULL
        AND l.date IS NOT NULL
        AND l.date < NOW() - interval '7 days'
    `);
    for (const row of oneWeek.rows) {
      alerts.push({ level: 'formal_warning', type: 'missing_recording_7days', teacher: row.teacher_name, department: row.department, lecture: row.title, date: row.date, message: `إنذار رسمي: ${row.teacher_name} لم يرفع تسجيل محاضرة "${row.title}" منذ أسبوع` });
    }

    return NextResponse.json({
      success: true,
      total_alerts: alerts.length,
      warnings: alerts.filter(a => a.level === 'warning').length,
      escalations: alerts.filter(a => a.level === 'escalation').length,
      formal_warnings: alerts.filter(a => a.level === 'formal_warning').length,
      alerts
    });
  } catch (error) {
    console.error('Monitor error:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}
