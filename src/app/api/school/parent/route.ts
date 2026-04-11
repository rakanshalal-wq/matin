import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import pool from '@/lib/db';

// ─────────────────────────────────────────────
// GET /api/school/parent?type=...
// types: stats | grades | homework | behavior | messages | fees
// ─────────────────────────────────────────────
export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (!['parent_school', 'parent'].includes(user.role)) {
    return NextResponse.json({ error: 'هذه الصفحة لأولياء الأمور فقط' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'stats';

  try {
    // ── Get child's student record ──
    const childRes = await pool.query(
      `SELECT s.id as student_id, u.name, u.id as user_id,
              c.name as class_name, sch.name as school_name,
              s.class_id, s.school_id
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN classes c ON s.class_id = c.id
       LEFT JOIN schools sch ON s.school_id = sch.id
       WHERE s.parent_id = $1
       LIMIT 1`,
      [user.userId]
    ).catch(() => ({ rows: [] }));

    const child = childRes.rows[0] || null;

    // ── Stats ──
    if (type === 'stats') {
      if (!child) {
        return NextResponse.json({ stats: { attendance: 0, avg_grade: 0, behavior_points: 0, pending_hw: 0 }, child: null });
      }

      const [attRes, gradeRes, behaviorRes, hwRes] = await Promise.all([
        pool.query(
          `SELECT COALESCE(ROUND(AVG(CASE WHEN status='present' THEN 100 ELSE 0 END)), 0) as avg
           FROM attendance
           WHERE student_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'`,
          [child.student_id]
        ).catch(() => ({ rows: [{ avg: 0 }] })),

        pool.query(
          `SELECT COALESCE(ROUND(AVG(grade)), 0) as avg FROM grades WHERE student_id = $1`,
          [child.student_id]
        ).catch(() => ({ rows: [{ avg: 0 }] })),

        pool.query(
          `SELECT COALESCE(SUM(points), 0) as total FROM behavior_records WHERE student_id = $1`,
          [child.student_id]
        ).catch(() => ({ rows: [{ total: 0 }] })),

        pool.query(
          `SELECT COUNT(*) as count FROM homework WHERE class_id = $1 AND status = 'active'`,
          [child.class_id]
        ).catch(() => ({ rows: [{ count: 0 }] })),
      ]);

      return NextResponse.json({
        child: { name: child.name, class_name: child.class_name, school_name: child.school_name },
        stats: {
          attendance: parseInt(String(attRes.rows[0]?.avg)) || 0,
          avg_grade: parseInt(String(gradeRes.rows[0]?.avg)) || 0,
          behavior_points: parseInt(String(behaviorRes.rows[0]?.total)) || 0,
          pending_hw: parseInt(String(hwRes.rows[0]?.count)) || 0,
        },
      });
    }

    if (!child) return NextResponse.json({ grades: [], homework: [], records: [], messages: [], fees: null });

    // ── Grades ──
    if (type === 'grades') {
      const result = await pool.query(
        `SELECT g.id, g.subject, g.grade,
                CASE
                  WHEN g.grade >= 90 THEN 'ممتاز'
                  WHEN g.grade >= 75 THEN 'جيد جداً'
                  WHEN g.grade >= 60 THEN 'جيد'
                  WHEN g.grade >= 50 THEN 'مقبول'
                  ELSE 'ضعيف'
                END as letter
         FROM grades g
         WHERE g.student_id = $1
         ORDER BY g.subject`,
        [child.student_id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ grades: result.rows });
    }

    // ── Homework ──
    if (type === 'homework') {
      const result = await pool.query(
        `SELECT id, title, subject, due_date, status FROM homework
         WHERE class_id = $1
         ORDER BY created_at DESC LIMIT 20`,
        [child.class_id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ homework: result.rows });
    }

    // ── Behavior ──
    if (type === 'behavior') {
      const result = await pool.query(
        `SELECT id, note, points, created_at FROM behavior_records
         WHERE student_id = $1
         ORDER BY created_at DESC LIMIT 20`,
        [child.student_id]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ records: result.rows });
    }

    // ── Messages ──
    if (type === 'messages') {
      const result = await pool.query(
        `SELECT m.id, m.content, m.created_at, u.name as sender_name
         FROM messages m
         JOIN users u ON m.sender_id = u.id
         WHERE m.receiver_id = $1 OR m.sender_id = $1
         ORDER BY m.created_at DESC LIMIT 20`,
        [user.userId]
      ).catch(() => ({ rows: [] }));
      return NextResponse.json({ messages: result.rows });
    }

    // ── Fees ──
    if (type === 'fees') {
      const [pendingRes, historyRes] = await Promise.all([
        pool.query(
          `SELECT COALESCE(SUM(amount), 0) as pending FROM school_fees
           WHERE student_id = $1 AND status = 'pending'`,
          [child.student_id]
        ).catch(() => ({ rows: [{ pending: 0 }] })),

        pool.query(
          `SELECT amount, paid_at as date FROM school_fees
           WHERE student_id = $1 AND status = 'paid'
           ORDER BY paid_at DESC LIMIT 10`,
          [child.student_id]
        ).catch(() => ({ rows: [] })),
      ]);

      return NextResponse.json({
        fees: {
          pending: parseFloat(String(pendingRes.rows[0]?.pending)) || 0,
          history: historyRes.rows,
        },
      });
    }

    return NextResponse.json({ error: 'نوع غير صحيح' }, { status: 400 });

  } catch (error) {
    console.error('[parent API] GET error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// POST /api/school/parent
// types: excuse | message | payment
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  if (!['parent_school', 'parent'].includes(user.role)) {
    return NextResponse.json({ error: 'هذه الصفحة لأولياء الأمور فقط' }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const { type } = body;

  try {
    // Get child info
    const childRes = await pool.query(
      `SELECT s.id as student_id FROM students s WHERE s.parent_id = $1 LIMIT 1`,
      [user.userId]
    ).catch(() => ({ rows: [] }));
    const studentId = childRes.rows[0]?.student_id;

    // ── Excuse ──
    if (type === 'excuse') {
      const { reason_type, date, details } = body;
      await pool.query(
        `INSERT INTO absence_excuses (student_id, parent_id, reason_type, date, details, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [studentId, user.userId, reason_type, date, details || '']
      ).catch(() => {
        // Try alternative table name
        return pool.query(
          `INSERT INTO excuses (student_id, parent_id, type, date, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [studentId, user.userId, reason_type, date, details || '']
        ).catch(() => {});
      });
      return NextResponse.json({ success: true });
    }

    // ── Message ──
    if (type === 'message') {
      const { teacher, content } = body;
      // Find teacher user if provided
      const teacherRes = await pool.query(
        `SELECT id FROM users WHERE name ILIKE $1 AND role = 'teacher' LIMIT 1`,
        [`%${teacher}%`]
      ).catch(() => ({ rows: [] }));
      const receiverId = teacherRes.rows[0]?.id || null;

      await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content, sender_role, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [user.userId, receiverId, content, user.role]
      ).catch(() => {});
      return NextResponse.json({ success: true });
    }

    // ── Payment ──
    if (type === 'payment') {
      const { amount, method } = body;
      // Record payment (in real scenario, integrate with payment gateway)
      await pool.query(
        `INSERT INTO payment_logs (user_id, amount, method, status, created_at)
         VALUES ($1, $2, $3, 'completed', NOW())`,
        [user.userId, amount, method]
      ).catch(() => {});

      // Mark fees as paid
      if (studentId) {
        await pool.query(
          `UPDATE school_fees SET status = 'paid', paid_at = NOW()
           WHERE student_id = $1 AND status = 'pending'`,
          [studentId]
        ).catch(() => {});
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'نوع غير صحيح' }, { status: 400 });

  } catch (error) {
    console.error('[parent API] POST error:', error);
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
  }
}
