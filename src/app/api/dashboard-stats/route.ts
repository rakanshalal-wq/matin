import { NextResponse } from 'next/server';
import { pool, getUserFromRequest } from '@/lib/auth';

// =====================================================
// API إحصائيات الداشبورد - منصة متين
// مُصحَّح: 2026-04-13 — resilient queries (missing tables return 0)
// =====================================================

// Helper: run a COUNT query; return 0 if the table/column does not exist yet.
async function safeCount(sql: string, params: any[] = []): Promise<number> {
  try {
    const result = await pool.query(sql, params);
    return Number(result.rows[0]?.count ?? 0);
  } catch (err: any) {
    // 42P01 = table not found, 42703 = column not found, others = treat as 0
    console.warn('[Dashboard Stats] query skipped (table/column missing):', err.message);
    return 0;
  }
}

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({});

    // ===== super_admin - مالك المنصة =====
    if (user.role === 'super_admin') {
      const [schools, owners, students, teachers, pending, active] = await Promise.all([
        safeCount("SELECT COUNT(*) FROM schools"),
        safeCount("SELECT COUNT(*) FROM users WHERE role = 'owner'"),
        safeCount("SELECT COUNT(*) FROM students"),
        safeCount("SELECT COUNT(*) FROM teachers"),
        safeCount("SELECT COUNT(*) FROM users WHERE status = 'pending'"),
        safeCount("SELECT COUNT(*) FROM users WHERE status = 'active'"),
      ]);
      return NextResponse.json({
        schools, owners, students, teachers, pending,
        active_users: active,
      });
    }

    // ===== owner - مالك المدرسة =====
    if (user.role === 'owner') {
      const schoolId = user.school_id;
      if (!schoolId) {
        return NextResponse.json({
          my_schools: 0, students: 0, teachers: 0,
          classes: 0, active_exams: 0, revenue: 0,
          attendance_today: 0, pending_fees: 0, messages: 0,
        });
      }
      const [my_schools, my_students, my_teachers, classes, exams] = await Promise.all([
        safeCount("SELECT COUNT(*) FROM schools WHERE owner_id = $1", [user.id]),
        safeCount("SELECT COUNT(*) FROM students WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM teachers WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM classes WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')", [schoolId]),
      ]);
      return NextResponse.json({
        my_schools,
        my_students,
        my_teachers,
        my_classes: classes,
        active_exams: exams,
        students: my_students,
        teachers: my_teachers,
        classes,
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
        safeCount("SELECT COUNT(*) FROM students WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM teachers WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM classes WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')", [schoolId]),
        safeCount("SELECT COUNT(*) FROM subjects WHERE school_id = $1", [schoolId]),
      ]);
      return NextResponse.json({
        my_students, my_teachers,
        my_classes: classes,
        active_exams: exams,
        subjects,
        students: my_students,
        teachers: my_teachers,
        classes,
      });
    }

    // ===== teacher - معلم =====
    if (user.role === 'teacher') {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ my_courses: 0, my_students: 0, active_exams: 0 });
      const [courses, students, exams] = await Promise.all([
        safeCount("SELECT COUNT(*) FROM courses WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM students WHERE school_id = $1", [schoolId]),
        safeCount("SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')", [schoolId]),
      ]);
      return NextResponse.json({
        my_courses: courses,
        my_students: students,
        active_exams: exams,
        today_lessons: 0,
        pending_homework: 0,
      });
    }

    // ===== student - طالب =====
    if (user.role === 'student') {
      const schoolId = user.school_id;
      if (!schoolId) return NextResponse.json({ gpa: '—', upcoming_exams: 0 });
      const exams = await safeCount(
        "SELECT COUNT(*) FROM exams WHERE school_id = $1 AND status IN ('SCHEDULED', 'ONGOING')",
        [schoolId]
      );
      return NextResponse.json({
        gpa: '—',
        upcoming_exams: exams,
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
    // Return empty stats instead of a 500 so the dashboard renders
    return NextResponse.json({
      schools: 0, students: 0, teachers: 0, classes: 0,
      active_exams: 0, my_schools: 0, my_students: 0, my_teachers: 0,
    });
  }
}
