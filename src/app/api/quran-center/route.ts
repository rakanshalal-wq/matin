import { NextResponse } from 'next/server';
import { pool } from '@/lib/auth';

// ===== بوابة مركز التحفيظ العامة (بدون مصادقة) =====

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (!code) return NextResponse.json({ error: 'رمز المركز مطلوب' }, { status: 400 });

    // جلب بيانات المركز من جدول schools
    const schoolResult = await pool.query(
      `SELECT id, name, code, description, city, phone, email, website, logo, cover_image,
              template, established_year, student_count, teacher_count
       FROM schools WHERE code = $1 AND status = 'active'`,
      [code]
    );

    if (!schoolResult.rows[0]) {
      return NextResponse.json({ error: 'المركز غير موجود' }, { status: 404 });
    }

    const school = schoolResult.rows[0];
    const schoolId = school.id;

    // جلب الحلقات المتاحة
    let circles: any[] = [];
    try {
      const circlesResult = await pool.query(
        `SELECT qc.id, qc.name, qc.schedule, qc.max_students, qc.level,
                u.name AS teacher_name,
                (SELECT COUNT(*) FROM quran_students qs WHERE qs.circle_id = qc.id AND qs.status='active') AS enrolled
         FROM quran_circles qc
         LEFT JOIN users u ON qc.teacher_id = u.id
         WHERE qc.school_id = $1 AND qc.status = 'active'
         ORDER BY qc.name`,
        [schoolId]
      );
      circles = circlesResult.rows;
    } catch {}

    // جلب الأخبار/الإعلانات
    let announcements: any[] = [];
    try {
      const annResult = await pool.query(
        `SELECT title, content, created_at FROM announcements
         WHERE school_id = $1 AND status = 'active'
         ORDER BY created_at DESC LIMIT 5`,
        [schoolId]
      );
      announcements = annResult.rows;
    } catch {}

    return NextResponse.json({ school, circles, announcements });
  } catch (error) {
    console.error('quran-center GET:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
