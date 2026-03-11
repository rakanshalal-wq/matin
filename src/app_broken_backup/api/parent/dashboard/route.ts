import { NextRequest, NextResponse } from 'next/server';
import { pool, getUserFromRequest, getFilterSQL } from '@/lib/auth';




export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

    // Get children for this parent
    const childrenResult = await pool.query(
      `SELECT pcm.child_id, u.name, u.email, u.phone, u.avatar,
              s.grade_level, s.class_id
       FROM parent_child_mapping pcm
       JOIN users u ON pcm.child_id::text = u.id::text
       LEFT JOIN students s ON s.user_id::text = u.id::text
       WHERE pcm.parent_id = $1`,
      [user.id]
    );

    const children = [];
    for (const child of childrenResult.rows) {
      // Get attendance for each child
      const attendanceResult = await pool.query(
        `SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'PRESENT') as present,
          COUNT(*) FILTER (WHERE status = 'ABSENT') as absent,
          COUNT(*) FILTER (WHERE status = 'LATE') as late
         FROM attendance WHERE student_id = $1::text`,
        [child.child_id]
      );

      // Get grades for each child
      const gradesResult = await pool.query(
        `SELECT AVG(score) as average, COUNT(*) as total
         FROM grades WHERE student_id::text = $1::text`,
        [child.child_id]
      );

      // Get homework for each child
      const homeworkResult = await pool.query(
        `SELECT COUNT(*) as total,
                COUNT(*) FILTER (WHERE status = 'pending') as pending
         FROM homework WHERE class_id = $1`,
        [child.class_id]
      );

      // Get bus info
      const busResult = await pool.query(
        `SELECT b.bus_number, b.driver_name, b.route_name
         FROM bus_riders br
         JOIN buses b ON br.bus_id::text = b.id::text
         WHERE br.student_id = $1
         LIMIT 1`,
        [child.child_id]
      );

      children.push({
        ...child,
        attendance: attendanceResult.rows[0] || { total: 0, present: 0, absent: 0, late: 0 },
        grades: {
          average: Math.round(parseFloat(gradesResult.rows[0]?.average || '0'),
          total: parseInt(gradesResult.rows[0]?.total || '0')
        },
        homework: homeworkResult.rows[0] || { total: 0, pending: 0 },
        bus: busResult.rows[0] || null
      });
    }

    return NextResponse.json({ data: children, total: children.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
