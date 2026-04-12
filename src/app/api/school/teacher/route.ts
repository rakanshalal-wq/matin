import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import { validateAttendancePayload, validateHomeworkPayload } from '@/lib/validation';

// ─────────────────────────────────────────────
// GET /api/school/teacher?type=...
// types: stats | classes | students | attendance | grades | homework
// ─────────────────────────────────────────────
export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (user.role !== 'teacher') return NextResponse.json({ error: 'هذه الصفحة للمعلمين فقط' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'stats';
  const classId = searchParams.get('class_id');
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  try {
    // ── Stats ──
    if (type === 'stats') {
      const [studRes, attRes, hwRes, gradeRes] = await Promise.all([
        pool.query(
          `SELECT COUNT(DISTINCT s.id) as count
           FROM students s
           JOIN classes c ON s.class_id = c.id
           WHERE c.teacher_id = $1`,
          [user.userId]
        ).catch(() => ({ rows: [{ count: 0 }] })),

        pool.query(
          `SELECT COALESCE(ROUND(AVG(CASE WHEN status='present' THEN 100 ELSE 0 END)),0) as avg
           FROM attendance
           WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = $1)
             AND date >= CURRENT_DATE - INTERVAL '30 days'`,
          [user.userId]
        ).catch(() => ({ rows: [{ avg: 0 }] })),

        pool.query(
          `SELECT COUNT(*) as count FROM homework WHERE teacher_id = $1 AND status = 'active'`,
          [user.userId]
        ).catch(() => ({ rows: [{ count: 0 }] })),

        pool.query(
          `SELECT COALESCE(ROUND(AVG(grade)),0) as avg
           FROM grades
           WHERE class_id IN (SELECT id FROM classes WHERE teacher_id = $1)`,
          [user.userId]
        ).catch(() => ({ rows: [{ avg: 0 }] })),
      ]);

      return NextResponse.json({
        stats: {
          students: parseInt(String(studRes.rows[0]?.count)) || 0,
          attendance: parseInt(String(attRes.rows[0]?.avg)) || 0,
          homework: parseInt(String(hwRes.rows[0]?.count)) || 0,
          avg_grade: parseInt(String(gradeRes.rows[0]?.avg)) || 0,
        },
      });
    }

    // ── Classes ──
    if (type === 'classes') {
      const result = await pool.query(
        `SELECT c.id, c.name, c.subject, c.grade,
                COUNT(DISTINCT s.id) as students_count
         FROM classes c
         LEFT JOIN students s ON s.class_id = c.id
         WHERE c.teacher_id = $1
         GROUP BY c.id, c.name, c.subject, c.grade
         ORDER BY c.name`,
        [user.userId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ classes: result.rows });
    }

    // ── Students in class ──
    if (type === 'students' && classId) {
      const result = await pool.query(
        `SELECT u.id, u.name, COALESCE(u.student_id, CONCAT('STU-', u.id)) as student_id
         FROM users u
         JOIN students s ON s.user_id = u.id
         WHERE s.class_id = $1
         ORDER BY u.name`,
        [classId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ students: result.rows });
    }

    // ── Attendance for class + date ──
    if (type === 'attendance' && classId) {
      const result = await pool.query(
        `SELECT student_id, status FROM attendance WHERE class_id = $1 AND date::date = $2::date`,
        [classId, date]
      ).catch(() => ({ rows: [] }));

      const attMap: Record<number, string> = {};
      result.rows.forEach((r: { student_id: number; status: string }) => {
        attMap[r.student_id] = r.status;
      });
      return NextResponse.json({ attendance: attMap });
    }

    // ── Grades for class ──
    if (type === 'grades' && classId) {
      const result = await pool.query(
        `SELECT g.id, u.name as student_name, g.grade,
                CASE
                  WHEN g.grade >= 95 THEN 'ممتاز+'
                  WHEN g.grade >= 85 THEN 'ممتاز'
                  WHEN g.grade >= 75 THEN 'جيد جداً'
                  WHEN g.grade >= 65 THEN 'جيد'
                  WHEN g.grade >= 50 THEN 'مقبول'
                  ELSE 'ضعيف'
                END as letter
         FROM grades g
         JOIN students s ON g.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE g.class_id = $1
         ORDER BY u.name`,
        [classId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ grades: result.rows });
    }

    // ── Homework list ──
    if (type === 'homework') {
      const result = await pool.query(
        `SELECT id, title, description, subject, class_name, due_date, status
         FROM homework
         WHERE teacher_id = $1
         ORDER BY created_at DESC
         LIMIT 50`,
        [user.userId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ homework: result.rows });
    }

    return NextResponse.json({ error: 'نوع غير صحيح' }, { status: 400 });

  } catch (error) {
    console.error('[teacher API] GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/school/teacher
// types: attendance | homework | grade
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (user.role !== 'teacher') return NextResponse.json({ error: 'هذه الصفحة للمعلمين فقط' }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const { type } = body;

  try {
    // ── Save Attendance ──
    if (type === 'attendance') {
      const validation = validateAttendancePayload(body);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const { class_id, date, records } = body as {
        class_id: number;
        date: string;
        records: Array<{ student_id: number; status: string }>;
      };

      // Delete existing records for this class+date, then insert
      await pool.query(
        `DELETE FROM attendance WHERE class_id = $1 AND date::date = $2::date`,
        [class_id, date]
      ).catch(() => {});

      for (const r of records) {
        await pool.query(
          `INSERT INTO attendance (student_id, class_id, date, status, teacher_id, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [r.student_id, class_id, date, r.status, user.userId]
        ).catch(() => {
          // Table might not have teacher_id column — try without it
          return pool.query(
            `INSERT INTO attendance (student_id, class_id, date, status, created_at)
             VALUES ($1, $2, $3, $4, NOW())`,
            [r.student_id, class_id, date, r.status]
          ).catch(() => {});
        });
      }

      return NextResponse.json({ success: true, count: records.length });
    }

    // ── Add Homework ──
    if (type === 'homework') {
      const validation = validateHomeworkPayload(body);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const { title, description, subject, class_name, due_date } = body;

      await pool.query(
        `INSERT INTO homework (title, description, subject, class_name, due_date, teacher_id, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW())`,
        [title, description || '', subject || '', class_name || '', due_date || null, user.userId]
      );

      return NextResponse.json({ success: true });
    }

    // ── Update Grade ──
    if (type === 'grade') {
      const { grade_id, grade } = body;
      await pool.query(
        `UPDATE grades SET grade = $1,
          letter = CASE
            WHEN $1::numeric >= 95 THEN 'ممتاز+'
            WHEN $1::numeric >= 85 THEN 'ممتاز'
            WHEN $1::numeric >= 75 THEN 'جيد جداً'
            WHEN $1::numeric >= 65 THEN 'جيد'
            WHEN $1::numeric >= 50 THEN 'مقبول'
            ELSE 'ضعيف'
          END
         WHERE id = $2`,
        [grade, grade_id]
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'نوع غير صحيح' }, { status: 400 });

  } catch (error) {
    console.error('[teacher API] POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
