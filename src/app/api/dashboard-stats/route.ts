import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// =====================================================
// API إحصائيات الداشبورد - منصة متين
// مُصحَّح: 2026-02-27
// =====================================================

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({});

    // ===== super_admin - مالك المنصة =====
    if (user.role === 'super_admin') {
      const [schools, owners, students, teachers, pending, active] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM schools"),
        pool.query("SELECT COUNT(*) FROM users WHERE role = 'owner'"),
        pool.query("SELECT COUNT(*) FROM students"),
        pool.query("SELECT COUNT(*) FROM teachers"),
        pool.query("SELECT COUNT(*) FROM users WHERE status = 'pending'"),
        pool.query("SELECT COUNT(*) FROM users WHERE is_active = true"),
      ]);
      return NextResponse.json({
        schools: Number(schools.rows[0].count),
        owners: Number(owners.rows[0].count),
        students: Number(students.rows[0].count),
        teachers: Number(teachers.rows[0].count),
        pending: Number(pending.rows[0].count),
        active_users: Number(active.rows[0].count),
      });
    }

    // ===== owner - مالك المدرسة =====
    if (user.role === 'owner') {
      const ownerId = String(user.id);
      const [my_schools, my_students, my_teachers, classes, exams] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM schools WHERE owner_id = $1::text", [ownerId]),
        pool.query("SELECT COUNT(*) FROM students s WHERE EXISTS (SELECT 1 FROM schools sc WHERE sc.id::text = s.school_id::text AND sc.owner_id = $1::text)", [ownerId]),
        pool.query("SELECT COUNT(*) FROM teachers t WHERE EXISTS (SELECT 1 FROM schools sc WHERE sc.id::text = t.school_id::text AND sc.owner_id = $1::text)", [ownerId]),
        pool.query("SELECT COUNT(*) FROM classes c WHERE EXISTS (SELECT 1 FROM schools sc WHERE sc.id::text = c.school_id::text AND sc.owner_id = $1::text)", [ownerId]),
        pool.query("SELECT COUNT(*) FROM exams e WHERE EXISTS (SELECT 1 FROM schools sc WHERE sc.id::text = e.school_id::text AND sc.owner_id = $1::text) AND e.status IN ('SCHEDULED', 'ONGOING')", [ownerId]),
      ]);
      return NextResponse.json({
        my_schools: Number(my_schools.rows[0].count),
        my_students: Number(my_students.rows[0].count),
        my_teachers: Number(my_teachers.rows[0].count),
        my_classes: Number(classes.rows[0].count),
        active_exams: Number(exams.rows[0].count),
        // أسماء بديلة للتوافق
        students: Number(my_students.rows[0].count),
        teachers: Number(my_teachers.rows[0].count),
        classes: Number(classes.rows[0].count),
        revenue: 0,
        attendance_today: 0,
        pending_fees: 0,
        messages: 0,
      });
    }

    // ===== admin - مدير المدرسة =====
    if (user.role === 'admin') {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ my_students: 0, my_teachers: 0, my_classes: 0, active_exams: 0 });
      const [my_students, my_teachers, classes, exams, subjects] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM students WHERE school_id = $1", [schoolId]),
        pool.query("SELECT COUNT(*) FROM teachers WHERE school_id = $1", [schoolId]),
        pool.query("SELECT COUNT(*) FROM classes WHERE school_id = $1", [schoolId]),
        pool.query("SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')", [schoolId]),
        pool.query("SELECT COUNT(*) FROM subjects WHERE school_id = $1", [schoolId]),
      ]);
      return NextResponse.json({
        my_students: Number(my_students.rows[0].count),
        my_teachers: Number(my_teachers.rows[0].count),
        my_classes: Number(classes.rows[0].count),
        active_exams: Number(exams.rows[0].count),
        subjects: Number(subjects.rows[0].count),
        students: Number(my_students.rows[0].count),
        teachers: Number(my_teachers.rows[0].count),
        classes: Number(classes.rows[0].count),
      });
    }

    // ===== teacher - معلم =====
    if (user.role === 'teacher') {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ my_courses: 0, my_students: 0, active_exams: 0 });
      const [courses, students, exams] = await Promise.all([
        pool.query("SELECT COUNT(*) FROM courses WHERE school_id = $1", [schoolId]),
        pool.query("SELECT COUNT(*) FROM students WHERE school_id = $1", [schoolId]),
        pool.query("SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')", [schoolId]),
      ]);
      return NextResponse.json({
        my_courses: Number(courses.rows[0].count),
        my_students: Number(students.rows[0].count),
        active_exams: Number(exams.rows[0].count),
        today_lessons: 0,
        pending_homework: 0,
      });
    }

    // ===== student - طالب =====
    if (user.role === 'student') {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ gpa: '—', upcoming_exams: 0 });
      const exams = await pool.query(
        "SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')",
        [schoolId]
      );
      return NextResponse.json({
        gpa: '—',
        upcoming_exams: Number(exams.rows[0].count),
        today_lectures: 0,
        pending_homework: 0,
        attendance_rate: 0,
      });
    }

    // ===== parent - ولي أمر =====
    if (user.role === 'parent') {
      return NextResponse.json({
        my_children: 0,
        attendance_today: '—',
        new_messages: 0,
        pending_invoices: 0,
      });
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('[Dashboard Stats] Error:', error);
    return NextResponse.json({ error: 'فشل جلب الإحصائيات' }, { status: 500 });
  }
}
